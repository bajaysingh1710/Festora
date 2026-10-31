import React, { useState, useMemo } from 'react';
import { UserPlus, QrCode, List, LayoutGrid } from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { Guest } from '../../types';
import { GuestStatsCards, GuestStats } from './guests/GuestStatsCards';
import { GuestDirectoryTable } from './guests/GuestDirectoryTable';
import { SeatingPlanVisualizer } from './guests/SeatingPlanVisualizer';
import { AddGuestModal } from './guests/AddGuestModal';

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
  } = useEvent();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'directory' | 'seating'>('directory');

  // Statistics
  const stats: GuestStats = useMemo(() => {
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
      attendingParties: attendingGuests.length,
      attendingPeople,
      pendingParties: pendingGuests.length,
      pendingPeople,
      declinedParties: declinedGuests.length,
      declinedPeople,
      checkedInParties: checkedInGuests.length,
      checkedInPeople,
    };
  }, [guests]);

  // Filtered Guests
  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        guest.name.toLowerCase().includes(q) ||
        guest.guestCode.toLowerCase().includes(q) ||
        guest.email.toLowerCase().includes(q) ||
        guest.phone.includes(q);

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
    // Reset file input so re-uploading the same file triggers onChange
    e.target.value = '';
  };

  const handleDownloadCSV = () => {
    const csvContent = exportGuestsToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')}_Guests.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      <GuestStatsCards stats={stats} />

      {/* View 1: Guest Table / Directory */}
      {activeView === 'directory' ? (
        <GuestDirectoryTable
          guests={filteredGuests}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onStatusChange={setSelectedStatus}
          onUpdateRsvp={(id, status) => updateGuest(id, { rsvpStatus: status })}
          onOpenPass={setSelectedGuestForPass}
          onDeleteGuest={deleteGuest}
        />
      ) : (
        /* View 2: Seating & Table Arrangement Layout */
        <SeatingPlanVisualizer
          guests={guests}
          unseatedGuests={unseatedGuests}
          tables={tables}
          onAssignTable={(guestId, tableName) => updateGuest(guestId, { tableNumber: tableName })}
          onUnseatGuest={(guestId) => updateGuest(guestId, { tableNumber: undefined })}
        />
      )}

      {/* Add Guest Modal */}
      <AddGuestModal
        isOpen={isAddModalOpen}
        eventType={event.eventType}
        existingGuestCount={guests.length}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addGuest}
      />
    </div>
  );
};
