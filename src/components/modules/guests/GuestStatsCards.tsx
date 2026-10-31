import React from 'react';
import { CheckCircle, Clock, XCircle, QrCode } from 'lucide-react';

export interface GuestStats {
  totalParties: number;
  totalPeople: number;
  attendingParties: number;
  attendingPeople: number;
  pendingParties: number;
  pendingPeople: number;
  declinedParties: number;
  declinedPeople: number;
  checkedInParties: number;
  checkedInPeople: number;
}

interface GuestStatsCardsProps {
  stats: GuestStats;
}

export const GuestStatsCards: React.FC<GuestStatsCardsProps> = ({ stats }) => {
  return (
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
  );
};

