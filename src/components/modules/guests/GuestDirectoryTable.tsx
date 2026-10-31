import React from 'react';
import { Search, Users, QrCode, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Guest, RSVPStatus } from '../../../types';

interface GuestDirectoryTableProps {
  guests: Guest[];
  searchQuery: string;
  selectedCategory: string;
  selectedStatus: string;
  onSearchChange: (q: string) => void;
  onCategoryChange: (cat: string) => void;
  onStatusChange: (status: string) => void;
  onUpdateRsvp: (guestId: string, status: RSVPStatus) => void;
  onOpenPass: (guest: Guest) => void;
  onDeleteGuest: (guestId: string) => void;
}

export const GuestDirectoryTable: React.FC<GuestDirectoryTableProps> = ({
  guests,
  searchQuery,
  selectedCategory,
  selectedStatus,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onUpdateRsvp,
  onOpenPass,
  onDeleteGuest,
}) => {
  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-white p-4 border border-[#EAE5E1] shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6E5548] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, pass code (e.g. FEST-BD-101), phone or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#EAE5E1] text-sm text-[#49372D] focus:outline-none focus:border-[#C96F4A] focus:ring-1 focus:ring-[#C96F4A]"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <span className="text-[#6E5548] font-medium hidden sm:inline">Category:</span>
          {['all', 'family', 'close_friends', 'vip', 'colleagues'].map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
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
              onClick={() => onStatusChange(st)}
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
              {guests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#6E5548]">
                    <Users className="w-8 h-8 text-[#C96F4A]/40 mx-auto mb-2" />
                    <p className="font-medium">No guests match your search criteria</p>
                    <p className="text-xs text-[#6E5548] mt-1">Try resetting filters or adding a new guest.</p>
                  </td>
                </tr>
              ) : (
                guests.map((guest) => {
                  return (
                    <tr key={guest.id} className="hover:bg-[#FFF8EF]/50 transition-colors">
                      {/* Name & Code */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#49372D]">{guest.name}</div>
                        <div className="flex items-center gap-2 text-xs text-[#6E5548] mt-0.5">
                          <span className="font-mono bg-[#FAF0EB] px-1.5 py-0.5 rounded text-[11px] text-[#C96F4A] font-bold">
                            {guest.guestCode}
                          </span>
                          <span>· {guest.phone}</span>
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
                          onChange={(e) => onUpdateRsvp(guest.id, e.target.value as RSVPStatus)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none transition-all ${
                            guest.rsvpStatus === 'attending'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : guest.rsvpStatus === 'pending'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-stone-50 text-stone-600 border-stone-200'
                          }`}
                        >
                          <option value="attending">✓ Attending</option>
                          <option value="pending">⏳ Pending</option>
                          <option value="declined">✕ Declined</option>
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
                            onClick={() => onOpenPass(guest)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF0EB] text-[#C96F4A] text-xs font-semibold hover:bg-[#F5D1BD] transition-colors"
                            title="Generate and view QR GuestPass"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Pass</span>
                          </button>

                          {/* Delete Guest */}
                          <button
                            onClick={() => onDeleteGuest(guest.id)}
                            className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Remove guest"
                            aria-label={`Remove ${guest.name}`}
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
    </div>
  );
};

