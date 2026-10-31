import React from 'react';
import { DollarSign } from 'lucide-react';
import { formatCurrency } from '../../../lib/formatters';

interface FairBillingAuditCardProps {
  costPerPlate: number;
  cateringPlateCapacity: number;
  expectedTotalHeadcount: number;
  plateVariance: number;
  fairBillingValue: number;
  onAutoAdjustDeficit: () => void;
  onReconcileCapBuffer: () => void;
}

export const FairBillingAuditCard: React.FC<FairBillingAuditCardProps> = ({
  costPerPlate,
  cateringPlateCapacity,
  expectedTotalHeadcount,
  plateVariance,
  fairBillingValue,
  onAutoAdjustDeficit,
  onReconcileCapBuffer,
}) => {
  return (
    <div className="rounded-3xl bg-white border border-[#EAE5E1] p-6 shadow-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#FAF0EB] text-[#C96F4A] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </span>
            <h3 className="font-serif font-bold text-lg text-[#49372D]">
              Attendance-Based Fair Billing Analysis
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 font-mono text-[#6E5548]">
            ~{formatCurrency(costPerPlate)}/plate
          </span>
        </div>
        <p className="text-xs text-[#6E5548] mb-4">
          Real-time audit between contractual plate commitments and projected live demand to prevent food wastage or surprise rush penalties.
        </p>

        <div className="space-y-2.5 p-4 rounded-2xl bg-[#FAF0EB]/40 border border-[#F5D1BD]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E5548]">Contracted Plates:</span>
            <span className="font-bold text-[#49372D]">{cateringPlateCapacity} plates</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E5548]">Live Projected Demand:</span>
            <span className="font-bold text-[#C96F4A]">{expectedTotalHeadcount} plates</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-[#F5D1BD]">
            <span className="font-semibold text-[#49372D]">
              {plateVariance >= 0 ? 'Potential Avoidable Wastage:' : 'Urgent Plate Deficit Risk:'}
            </span>
            <span
              className={`font-bold font-mono text-sm ${
                plateVariance >= 0 ? 'text-amber-800' : 'text-red-700'
              }`}
            >
              {plateVariance >= 0 ? `+${plateVariance} spare plates` : `${plateVariance} plates short`}{' '}
              ({formatCurrency(fairBillingValue)})
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#EAE5E1] flex items-center gap-2">
        {plateVariance < 0 ? (
          <button
            onClick={onAutoAdjustDeficit}
            className="w-full py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-festive hover:bg-red-700 transition-all"
          >
            Auto-Adjust Buffer (+{Math.abs(plateVariance) + 10} Plates)
          </button>
        ) : plateVariance > 20 ? (
          <button
            onClick={onReconcileCapBuffer}
            className="w-full py-2 rounded-xl bg-[#49372D] text-white text-xs font-semibold hover:bg-[#32251D] transition-all"
          >
            Reconcile & Cap Buffer to 10 Plates (Saves {formatCurrency((plateVariance - 10) * costPerPlate)})
          </button>
        ) : (
          <p className="text-xs text-emerald-800 font-semibold py-1">
            ✓ Catering commitment perfectly balanced with projected attendance.
          </p>
        )}
      </div>
    </div>
  );
};

