import React from 'react';
import { BudgetSummary } from '../../../services/budgetCalculator';
import { formatCurrency } from '../../../lib/formatters';

interface BudgetOverviewCardProps {
  targetBudget: number;
  budgetSummary: BudgetSummary;
  fixedTotal: number;
  variableTotal: number;
  onUpdateTargetBudget: (target: number) => void;
}

export const BudgetOverviewCard: React.FC<BudgetOverviewCardProps> = ({
  targetBudget,
  budgetSummary,
  fixedTotal,
  variableTotal,
  onUpdateTargetBudget,
}) => {
  const percentSecured =
    budgetSummary.totalEstimated > 0
      ? ((budgetSummary.totalCommitted / budgetSummary.totalEstimated) * 100).toFixed(0)
      : '0';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Target Budget Card */}
        <div className="rounded-2xl bg-white p-5 border border-[#EAE5E1] shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6E5548]">
            Target Budget Cap
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-serif text-2xl font-bold text-[#49372D]">
              {formatCurrency(targetBudget)}
            </span>
            <input
              type="number"
              step="10000"
              value={targetBudget}
              onChange={(e) => onUpdateTargetBudget(Number(e.target.value))}
              className="w-24 text-right text-xs font-mono px-2 py-1 rounded border border-[#EAE5E1] text-[#6E5548] focus:outline-none focus:border-[#C96F4A]"
              title="Click to adjust target cap"
            />
          </div>
          <p className="text-xs text-[#6E5548] mt-1">Set overall financial threshold</p>
        </div>

        {/* Estimated Expenses Card */}
        <div className="rounded-2xl bg-white p-5 border border-[#EAE5E1] shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6E5548]">
            Total Estimated
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-serif text-2xl font-bold text-[#C96F4A]">
              {formatCurrency(budgetSummary.totalEstimated)}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FAF0EB] text-[#C96F4A]">
              {budgetSummary.percentSpent.toFixed(0)}% Allocated
            </span>
          </div>
          <div className="mt-2 w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                budgetSummary.isOverBudget ? 'bg-red-500' : 'bg-[#C96F4A]'
              }`}
              style={{ width: `${Math.min(100, budgetSummary.percentSpent)}%` }}
            />
          </div>
        </div>

        {/* Committed / Paid Deposit Card */}
        <div className="rounded-2xl bg-white p-5 border border-[#EAE5E1] shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6E5548]">
            Committed / Paid
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-serif text-2xl font-bold text-emerald-800">
              {formatCurrency(budgetSummary.totalCommitted)}
            </span>
            <span className="text-xs text-[#6E5548]">{percentSecured}% secured</span>
          </div>
          <p className="text-xs text-[#6E5548] mt-1">Down-payments & vendor advances</p>
        </div>

        {/* Remaining Surplus or Overrun Card */}
        <div
          className={`rounded-2xl p-5 border shadow-card ${
            budgetSummary.isOverBudget
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-[#F2F6F0] border-[#A9B89A]/50 text-emerald-900'
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
            {budgetSummary.isOverBudget ? 'Budget Overrun Deficit' : 'Remaining Budget Surplus'}
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-serif text-2xl font-bold">
              {formatCurrency(Math.abs(budgetSummary.remainingBudget))}
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                budgetSummary.isOverBudget ? 'bg-red-200 text-red-800' : 'bg-emerald-200 text-emerald-800'
              }`}
            >
              {budgetSummary.isOverBudget ? 'DEFICIT' : 'SURPLUS'}
            </span>
          </div>
          <p className="text-xs opacity-75 mt-1">
            {budgetSummary.isOverBudget ? 'Exceeds budget cap' : 'Available for contingencies'}
          </p>
        </div>
      </div>

      {/* Fixed vs Variable Cost Summary Bar */}
      <div className="rounded-2xl bg-white border border-[#EAE5E1] p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <span className="text-[#6E5548] font-semibold">Cost Composition:</span>
          <span className="flex items-center gap-1.5 font-medium text-[#49372D]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C96F4A]" />
            Fixed Base Costs: <strong>{formatCurrency(fixedTotal)}</strong>
          </span>
          <span className="flex items-center gap-1.5 font-medium text-[#49372D]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9A948]" />
            Guest-Scaled Variable: <strong>{formatCurrency(variableTotal)}</strong>
          </span>
        </div>
        <span className="text-[#6E5548] italic">
          Variable costs dynamically adjust as RSVPs shift
        </span>
      </div>
    </div>
  );
};

