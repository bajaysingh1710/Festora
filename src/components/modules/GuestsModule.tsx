import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  QrCode,
  Sparkles,
  Phone,
  Mail,
  Utensils,
  Trash2,
  Edit2,
  ExternalLink,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { Guest, GuestCategory, RSVPStatus, MealPreference } from '../../types';

export const GuestsModule: React.FC = () => {
  const {
    event,
    guests,
    addGuest,
    updateGuest,
    deleteGuest,
    importGuestsFromCSV,
    exportGuestsToCSV,
    setSelectedGuestForPass,
    setIsCheckInScannerOpen,
    setActiveModule,
    showToast,
  } = useEvent();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'directory' | 'seating'>('directory');

  // New Guest Form State
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestCategory, setNewGuestCategory] = useState<GuestCategory>('family');
  const [newGuestPartySize, setNewGuestPartySize] = useState<number>(2);
  const [newGuestMeal, setNewGuestMeal] = useState<MealPreference>('vegetarian');
  const [newGuestTable, setNewGuestTable] = useState('');
  const [newGuestNotes, setNewGuestNotes] = useState('');

  // Statistics
  const stats = useMemo(() => {
    const totalParties = guests.length;
    const totalPeople = guests.reduce((sum, g) => sum + g.partySize, 0);

    const attendingGuests = guests.filter((g) => g.rsvpStatus === 'attending');
    const attendingPeople = attendingGuests.reduce((sum, g) => sum + g.partySize, 0);

    const pendingGuests = guests.filter((g) => g.rsvpStatus === 'pending');
    const pendingPeople = pendingGuests.reduce((sum, g) => sum + g.partySize, 0);

    const declinedGuests = guests.filter((g) => g.rsvpStatus === 'declined');
    const declinedPeople = declinedGuests.reduce((sum, g) => sum + g.partySize, 0);

    const checkedInGuests = guests.filter((g) => g.checkInStatus === 'checked_in');
    const checkedInPeople = checkedInGuests.reduce((sum, g) => sum + g.partySize, 0);

    return {
      totalParties,
      totalPeople,
      attendingPeople,
      attendingParties: attendingGuests.length,
      pendingPeople,
      pendingParties: pendingGuests.length,
      declinedPeople,
      checkedInPeople,
      checkedInParties: checkedInGuests.length,
    };
  }, [guests]);

  // Filtered Guests
  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const matchesSearch =
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.guestCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.phone.includes(searchQuery);

      const matchesCategory = selectedCategory === 'all' || guest.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || guest.rsvpStatus === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [guests, searchQuery, selectedCategory, selectedStatus]);

  // Seating & Table Groupings
  const tables = useMemo(() => {
    const tableMap: Record<string, { guests: Guest[]; totalHeadcount: number }> = {};
    for (let i = 1; i <= 6; i++) {
      tableMap[`Table ${i}`] = { guests: [], totalHeadcount: 0 };
    }
    tableMap['VIP High Table'] = { guests: [], totalHeadcount: 0 };
    tableMap['Family Table'] = { guests: [], totalHeadcount: 0 };

    guests.forEach((g) => {
      if (g.tableNumber) {
        if (!tableMap[g.tableNumber]) {
          tableMap[g.tableNumber] = { guests: [], totalHeadcount: 0 };
        }
        tableMap[g.tableNumber].guests.push(g);
        tableMap[g.tableNumber].totalHeadcount += g.partySize;
      }
    });

    return tableMap;
  }, [guests]);

  const unseatedGuests = useMemo(() => {
    return guests.filter((g) => !g.tableNumber && g.rsvpStatus === 'attending');
  }, [guests]);

  const handleCreateGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const prefix = event.eventType.slice(0, 2).toUpperCase();
    const guestCode = `FEST-${prefix}-${Math.floor(100 + Math.random() * 900)}`;

    addGuest({
      guestCode,
      name: newGuestName.trim(),
      email: newGuestEmail.trim() || `${newGuestName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: newGuestPhone.trim() || '+91 98000 00000',
      category: newGuestCategory,
      partySize: Number(newGuestPartySize) || 1,
      rsvpStatus: 'pending',
      mealPreference: newGuestMeal,
      tableNumber: newGuestTable.trim() || undefined,
      dietaryNotes: newGuestNotes.trim() || undefined,
      invitationSent: true,
      invitationSentAt: new Date().toISOString(),
      checkInStatus: 'not_checked_in',
    });

    // Reset Form
    setNewGuestName('');
    setNewGuestEmail('');
    setNewGuestPhone('');
    setNewGuestCategory('family');
    setNewGuestPartySize(2);
    setNewGuestTable('');
    setNewGuestNotes('');
    setIsAddModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        importGuestsFromCSV(text);
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadCSV = () => {
    const csvContent = exportGuestsToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_Guests.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0EB] text-[#C96F4A] text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Module A</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#49372D]">
            Smart Invitations & GuestPass
          </h1>
          <p className="text-sm text-[#6E5548] mt-0.5">
            Manage invitations, generate scannable QR passes, and ensure secure check-in.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* View Mode Switcher */}
          <div className="flex items-center rounded-xl bg-stone-100 p-0.5 border border-[#EAE5E1]">
            <button
              onClick={() => setActiveView('directory')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'directory'
                  ? 'bg-white text-[#49372D] shadow-sm'
                  : 'text-[#6E5548] hover:text-[#49372D]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Directory</span>
            </button>
            <button
              onClick={() => setActiveView('seating')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'seating'
                  ? 'bg-white text-[#C96F4A] shadow-sm'
                  : 'text-[#6E5548] hover:text-[#49372D]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Seating Plan</span>
            </button>
          </div>

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#EAE5E1] text-[#49372D] font-semibold text-xs hover:bg-[#FAF0EB] active:scale-95 transition-all shadow-sm">
            <span>Import CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {guests.length > 0 && (
            <button
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#EAE5E1] text-[#49372D] font-semibold text-xs hover:bg-[#FAF0EB] active:scale-95 transition-all shadow-sm"
            >
              <span>Export CSV</span>
            </button>
          )}

          <button
            onClick={() => setIsCheckInScannerOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#C96F4A] text-[#C96F4A] font-semibold text-xs hover:bg-[#FAF0EB] active:scale-95 transition-all shadow-sm"
          >
            <QrCode className="w-4 h-4" />
            <span>Check-In Terminal</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C96F4A] text-white font-semibold text-xs hover:bg-[#A8522F] active:scale-95 transition-all shadow-festive"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
        <div className="rounded-2xl bg-white p-4 border border-[#EAE5E1] shadow-card">
          <p className="text-xs font-semibold text-[#6E5548] uppercase tracking-wider">Total Invited</p>
          <p className="mt-1 text-2xl font-bold font-serif text-[#49372D]">
            {stats.totalPeople}{' '}
            <span className="text-xs font-normal text-[#6E5548] font-sans">
              ({stats.totalParties} parties)
            </span>
          </p>
          <p className="text-[11px] text-[#6E5548] mt-0.5">All registered records</p>
        </div>

        <div className="rounded-2xl bg-[#F2F6F0] p-4 border border-[#A9B89A]/40 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Confirmed Attending</p>
            <CheckCircle className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="mt-1 text-2xl font-bold font-serif text-emerald-900">
            {stats.attendingPeople}{' '}
            <span className="text-xs font-normal text-emerald-700 font-sans">
              ({stats.attendingParties} parties)
            </span>
          </p>
          <p className="text-[11px] text-emerald-700 mt-0.5">Ready for dinner & seating</p>
        </div>

        <div className="rounded-2xl bg-[#FEF9ED] p-4 border border-[#F2C66D]/50 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-amber-900 uppercase tracking-wider">Pending RSVP</p>
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <p className="mt-1 text-2xl font-bold font-serif text-amber-900">
            {stats.pendingPeople}{' '}
            <span className="text-xs font-normal text-amber-700 font-sans">
              ({stats.pendingParties} parties)
            </span>
          </p>
          <p className="text-[11px] text-amber-700 mt-0.5">Awaiting guest response</p>
        </div>

        <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Declined</p>
            <XCircle className="w-4 h-4 text-stone-500" />
          </div>
          <p className="mt-1 text-2xl font-bold font-serif text-stone-700">
            {stats.declinedPeople}
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5">Regrets received</p>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-2xl bg-[#FAF0EB] p-4 border border-[#F5D1BD] shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#C96F4A] uppercase tracking-wider">Checked In Today</p>
            <QrCode className="w-4 h-4 text-[#C96F4A]" />
          </div>
          <p className="mt-1 text-2xl font-bold font-serif text-[#C96F4A]">
            {stats.checkedInPeople}{' '}
            <span className="text-xs font-normal text-[#C96F4A]/80 font-sans">
              ({stats.checkedInParties} checked)
            </span>
          </p>
          <p className="text-[11px] text-[#6E5548] mt-0.5">Admitted through scanner</p>
        </div>
      </div>

      {/* View 1: Guest Table / Directory */}
      {activeView === 'directory' ? (
        <>
          {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-white p-4 border border-[#EAE5E1] shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6E5548] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, pass code (e.g. FEST-AK-101), phone or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#EAE5E1] text-sm text-[#49372D] focus:outline-none focus:border-[#C96F4A] focus:ring-1 focus:ring-[#C96F4A]"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <span className="text-[#6E5548] font-medium hidden sm:inline">Category:</span>
          {['all', 'family', 'close_friends', 'vip', 'colleagues'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-[#C96F4A] text-white shadow-sm'
                  : 'bg-[#FAF0EB] text-[#49372D] hover:bg-[#F5D1BD]'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#6E5548] font-medium hidden sm:inline">RSVP:</span>
          {['all', 'attending', 'pending', 'declined'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1.5 rounded-lg font-medium capitalize transition-all ${
                selectedStatus === st
                  ? 'bg-[#49372D] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Table / Directory */}
      <div className="rounded-2xl bg-white border border-[#EAE5E1] shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#49372D]">
            <thead className="bg-[#FAF0EB]/60 border-b border-[#EAE5E1] text-xs uppercase tracking-wider text-[#6E5548]">
              <tr>
                <th className="py-3 px-4 font-semibold">Guest & Pass Code</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Party Size</th>
                <th className="py-3 px-4 font-semibold">RSVP Status</th>
                <th className="py-3 px-4 font-semibold">Meal & Table</th>
                <th className="py-3 px-4 font-semibold">Check-In Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE5E1]/70">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#6E5548]">
                    <Users className="w-8 h-8 text-[#C96F4A]/40 mx-auto mb-2" />
                    <p className="font-medium">No guests match your search criteria</p>
                    <p className="text-xs text-[#6E5548] mt-1">Try resetting filters or adding a new guest.</p>
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  return (
                    <tr key={guest.id} className="hover:bg-[#FFF8EF]/50 transition-colors">
                      {/* Name & Code */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#49372D]">{guest.name}</div>
                        <div className="flex items-center gap-2 text-xs text-[#6E5548] mt-0.5">
                          <span className="font-mono bg-[#FAF0EB] px-1.5 py-0.5 rounded text-[11px] text-[#C96F4A] font-bold">
                            {guest.guestCode}
                          </span>
                          <span>Â· {guest.phone}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-[#F5D1BD]/40 text-[#49372D]">
                          {guest.category.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Party Size */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold">{guest.partySize}</span>{' '}
                        <span className="text-xs text-[#6E5548]">
                          {guest.partySize > 1 ? 'people' : 'person'}
                        </span>
                      </td>

                      {/* RSVP Status Switcher */}
                      <td className="py-3.5 px-4">
                        <select
                          value={guest.rsvpStatus}
                          onChange={(e) =>
                            updateGuest(guest.id, { rsvpStatus: e.target.value as RSVPStatus })
                          }
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none transition-all ${
                            guest.rsvpStatus === 'attending'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : guest.rsvpStatus === 'pending'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-stone-50 text-stone-600 border-stone-200'
                          }`}
                        >
                          <option value="attending">âœ“ Attending</option>
                          <option value="pending">â³ Pending</option>
                          <option value="declined">âœ• Declined</option>
                        </select>
                      </td>

                      {/* Meal & Table */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs capitalize font-medium text-[#49372D]">
                          {guest.mealPreference}
                        </div>
                        <div className="text-[11px] text-[#6E5548]">
                          {guest.tableNumber || 'Table Unassigned'}
                        </div>
                      </td>

                      {/* Check-In Status */}
                      <td className="py-3.5 px-4">
                        {guest.checkInStatus === 'checked_in' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Checked In</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Not Checked In</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View GuestPass Modal Trigger */}
                          <button
                            onClick={() => setSelectedGuestForPass(guest)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF0EB] text-[#C96F4A] text-xs font-semibold hover:bg-[#F5D1BD] transition-colors"
                            title="Generate and view QR GuestPass"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Pass</span>
                          </button>

                          {/* Delete Guest */}
                          <button
                            onClick={() => deleteGuest(guest.id)}
                            className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Remove guest"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  ) : (
    /* View 2: Seating & Table Arrangement Layout */
    <div className="space-y-6">
      {/* Seating Top Banner */}
      <div className="p-5 rounded-2xl bg-white border border-[#EAE5E1] shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#49372D]">
            Venue Seating Layout & Table Allocations
          </h3>
          <p className="text-xs text-[#6E5548] mt-0.5">
            Organize attending guests into banquet tables, VIP sections, and family groupings.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
            ✓ {guests.filter((g) => !!g.tableNumber).reduce((sum, g) => sum + g.partySize, 0)} Seated
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
            ⏳ {unseatedGuests.reduce((sum, g) => sum + g.partySize, 0)} Unseated Attending
          </span>
        </div>
      </div>

      {/* Unseated Guests Pool */}
      {unseatedGuests.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#FEF9ED] border border-[#F2C66D]/60 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Guests Awaiting Table Assignment ({unseatedGuests.length} parties)
            </span>
            <span className="text-xs text-amber-800">Assign with 1 click:</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {unseatedGuests.map((g) => (
              <div
                key={g.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#F2C66D] text-xs text-[#49372D] shadow-sm"
              >
                <span className="font-semibold">{g.name}</span>
                <span className="text-[11px] text-[#6E5548]">({g.partySize}p)</span>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      updateGuest(g.id, { tableNumber: e.target.value });
                    }
                  }}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD] cursor-pointer"
                >
                  <option value="" disabled>
                    Seat at...
                  </option>
                  {Object.keys(tables).map((tName) => (
                    <option key={tName} value={tName}>
                      {tName}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(tables).map(([tableName, data]) => {
          const capacity = tableName.includes('VIP') ? 6 : 8;
          const isFull = data.totalHeadcount >= capacity;

          return (
            <div
              key={tableName}
              className="p-5 rounded-2xl bg-white border border-[#EAE5E1] shadow-card flex flex-col justify-between hover:border-[#F5D1BD] transition-all"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E1]">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#FAF0EB] text-[#C96F4A] flex items-center justify-center font-bold text-xs">
                      🍽️
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#49372D]">{tableName}</h4>
                      <span className="text-[10px] text-[#6E5548]">Capacity: {capacity} seats</span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      isFull
                        ? 'bg-amber-100 text-amber-800'
                        : data.totalHeadcount > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {data.totalHeadcount} / {capacity}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-stone-100 rounded-full h-1.5 my-3 overflow-hidden">
                  <div
                    className={`h-full ${isFull ? 'bg-amber-500' : 'bg-emerald-600'}`}
                    style={{ width: `${Math.min(100, (data.totalHeadcount / (capacity || 1)) * 100)}%` }}
                  />
                </div>

                {/* Guest list for this table */}
                <div className="space-y-2 mt-3 min-h-[90px]">
                  {data.guests.length === 0 ? (
                    <p className="text-xs text-stone-400 italic text-center py-6">
                      No guests seated here yet.
                    </p>
                  ) : (
                    data.guests.map((g) => (
                      <div
                        key={g.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-[#FFF8EF]/80 text-xs border border-[#FAF0EB]"
                      >
                        <div>
                          <p className="font-bold text-[#49372D]">{g.name}</p>
                          <p className="text-[10px] text-[#6E5548]">
                            {g.partySize} guests · {g.mealPreference.replace('_', ' ')}
                          </p>
                        </div>
                        <button
                          onClick={() => updateGuest(g.id, { tableNumber: undefined })}
                          className="text-stone-300 hover:text-red-500 p-1 text-xs"
                          title="Unseat guest"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Seat Guest Action */}
              {unseatedGuests.length > 0 && !isFull && (
                <div className="mt-4 pt-3 border-t border-[#EAE5E1]">
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        updateGuest(e.target.value, { tableNumber: tableName });
                      }
                    }}
                    className="w-full text-xs font-semibold py-1.5 px-3 rounded-xl bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD] cursor-pointer hover:bg-[#F5D1BD]/50"
                  >
                    <option value="" disabled>
                      + Seat Unassigned Guest Here...
                    </option>
                    {unseatedGuests.map((ug) => (
                      <option key={ug.id} value={ug.id}>
                        {ug.name} ({ug.partySize} guests)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )}

      {/* Add Guest Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-festive-lg border border-[#F5D1BD] animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE5E1]">
              <h2 className="font-serif text-2xl font-bold text-[#49372D]">Add Celebration Guest</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                âœ•
              </button>
            </div>

            <form onSubmit={handleCreateGuest} className="mt-5 space-y-4 text-sm text-[#49372D]">
              <div>
                <label className="block text-xs font-semibold text-[#6E5548] uppercase tracking-wider mb-1">
                  Full Name / Family Name *
                </label>
                <input
                  type="text"
                  required
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="e.g. Vikram & Preeti Mehra"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#6E5548] uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newGuestPhone}
                    onChange={(e) => setNewGuestPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6E5548] uppercase tracking-wider mb-1">
                    Party Size (Attending Count)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newGuestPartySize}
                    onChange={(e) => setNewGuestPartySize(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#6E5548] uppercase tracking-wider mb-1">
                    Guest Category
                  </label>
                  <select
                    value={newGuestCategory}
                    onChange={(e) => setNewGuestCategory(e.target.value as GuestCategory)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
                  >
                    <option value="family">Family</option>
                    <option value="close_friends">Close Friends</option>
                    <option value="vip">VIP Guest</option>
                    <option value="colleagues">Colleagues</option>
                    <option value="community">Community</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6E5548] uppercase tracking-wider mb-1">
                    Meal Preference
                  </label>
                  <select
                    value={newGuestMeal}
                    onChange={(e) => setNewGuestMeal(e.target.value as MealPreference)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
                  >
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non_vegetarian">Non-Vegetarian</option>
                    <option value="jain">Strict Jain</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#6E5548] uppercase tracking-wider mb-1">
                    Table Assignment
                  </label>
                  <input
                    type="text"
                    value={newGuestTable}
                    onChange={(e) => setNewGuestTable(e.target.value)}
                    placeholder="e.g. Table Royal 1"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6E5548] uppercase tracking-wider mb-1">
                    Dietary / Elderly Notes
                  </label>
                  <input
                    type="text"
                    value={newGuestNotes}
                    onChange={(e) => setNewGuestNotes(e.target.value)}
                    placeholder="e.g. Wheelchair access"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EAE5E1] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EAE5E1] text-[#6E5548] font-medium hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C96F4A] text-white font-semibold shadow-festive hover:bg-[#A8522F]"
                >
                  Create Guest & Issue Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
