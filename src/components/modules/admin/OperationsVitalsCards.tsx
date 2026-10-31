import React from 'react';
import { Users, Utensils, Gift } from 'lucide-react';

interface OperationsVitalsCardsProps {
  targetGuestCount: number;
  confirmedHeadcount: number;
  expectedTotalHeadcount: number;
  checkedInHeadcount: number;
  pendingHeadcount: number;
  cateringPlateCapacity: number;
  cateringDeficit: number;
  cateringPlateBuffer: number;
  totalGiftHampers: number;
  giftDeficit: number;
  projectedAttendingParties: number;
  onAddPlateBuffer: () => void;
  onAddGiftBuffer: () => void;
}

export const OperationsVitalsCards: React.FC<OperationsVitalsCardsProps> = ({
  targetGuestCount,
  confirmedHeadcount,
  expectedTotalHeadcount,
  checkedInHeadcount,
  pendingHeadcount,
  cateringPlateCapacity,
  cateringDeficit,
  cateringPlateBuffer,
  totalGiftHampers,
  giftDeficit,
  projectedAttendingParties,
  onAddPlateBuffer,
  onAddGiftBuffer,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Card 1: Attendance & RSVP Reconciliation */}
      <div className="rounded-2xl bg-white border border-[#EAE5E1] p-5 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E1]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#FAF0EB] text-[#C96F4A] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </span>
            <h3 className="font-serif font-bold text-base text-[#49372D]">Headcount Status</h3>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
            {targetGuestCount} Target
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E5548]">Confirmed Attending:</span>
            <span className="font-bold text-emerald-800 text-sm">{confirmedHeadcount} guests</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E5548]">Projected Total (70% conversion):</span>
            <span className="font-bold text-[#49372D] text-sm">{expectedTotalHeadcount} guests</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E5548]">Admitted at Entrance:</span>
            <span className="font-semibold text-[#C96F4A]">{checkedInHeadcount} checked in</span>
          </div>

          <div className="pt-2">
            <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden flex">
              <div
                className="bg-emerald-600 h-full"
                style={{ width: `${Math.min(100, (confirmedHeadcount / (targetGuestCount || 1)) * 100)}%` }}
                title="Confirmed Attending"
              />
              <div
                className="bg-amber-400 h-full"
                style={{ width: `${Math.min(100, ((expectedTotalHeadcount - confirmedHeadcount) / (targetGuestCount || 1)) * 100)}%` }}
                title="Projected Conversion"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#6E5548] mt-1.5">
              <span>🟢 {confirmedHeadcount} Confirmed</span>
              <span>🟡 {pendingHeadcount} Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Food & Catering Plate Buffer Tracking */}
      <div className="rounded-2xl bg-white border border-[#EAE5E1] p-5 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E1]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#FEF9ED] text-[#D9A948] flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </span>
            <h3 className="font-serif font-bold text-base text-[#49372D]">Catering Buffer</h3>
          </div>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              cateringDeficit > 0 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {cateringDeficit > 0 ? 'Shortfall Warning' : 'Buffer Secure'}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E5548]">Total Plate Capacity:</span>
            <span className="font-bold text-[#49372D] text-sm">
              {cateringPlateCapacity} plates ({cateringPlateBuffer} buffer)
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E5548]">Projected Demand:</span>
            <span className="font-bold text-[#49372D] text-sm">{expectedTotalHeadcount} plates</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E5548]">Buffer Safety Margin:</span>
            <span
              className={`font-semibold ${
                cateringPlateCapacity - expectedTotalHeadcount < 5 ? 'text-red-600' : 'text-emerald-700'
              }`}
            >
              {cateringPlateCapacity - expectedTotalHeadcount} plates remaining
            </span>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={onAddPlateBuffer}
              className="w-full py-1.5 rounded-xl border border-[#F5D1BD] bg-[#FAF0EB] text-[#C96F4A] text-xs font-semibold hover:bg-[#F5D1BD] transition-all"
            >
              + Add 10 Buffer Plates
            </button>
          </div>
        </div>
      </div>

      {/* Card 3: Return Gift & Keepsake Hampers */}
      <div className="rounded-2xl bg-white border border-[#EAE5E1] p-5 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E1]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#F2F6F0] text-[#859675] flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </span>
            <h3 className="font-serif font-bold text-base text-[#49372D]">Return Favors</h3>
          </div>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              giftDeficit > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {giftDeficit > 0 ? 'Deficit Warning' : 'Sufficient'}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E5548]">Prepared Gift Boxes:</span>
            <span className="font-bold text-[#49372D] text-sm">{totalGiftHampers} hampers</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E5548]">Projected Attending Families:</span>
            <span className="font-bold text-[#49372D] text-sm">
              {projectedAttendingParties} parties
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E5548]">Gift Surplus / Deficit:</span>
            <span
              className={`font-semibold ${giftDeficit > 0 ? 'text-amber-700' : 'text-emerald-700'}`}
            >
              {totalGiftHampers - projectedAttendingParties} spare boxes
            </span>
          </div>

          <div className="pt-2">
            <button
              onClick={onAddGiftBuffer}
              className="w-full py-1.5 rounded-xl border border-[#A9B89A]/50 bg-[#F2F6F0] text-[#859675] text-xs font-semibold hover:bg-[#C8D4BD] transition-all"
            >
              + Order 10 Extra Hampers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

