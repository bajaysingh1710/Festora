import React from 'react';
import {
  Wallet,
  Building,
  UtensilsCrossed,
  Sparkles,
  Camera,
  Shirt,
  QrCode,
  Car,
  Gift,
  ShieldAlert,
} from 'lucide-react';
import { BudgetCategory, BudgetCategoryId } from '../../../types';
import { BudgetSummary } from '../../../services/budgetCalculator';
import { formatCurrency, formatPercentage } from '../../../lib/formatters';

interface CategoryAllocationListProps {
  categories: BudgetCategory[];
  budgetSummary: BudgetSummary;
  targetBudget: number;
  activeFilter: string;
  onSelectFilter: (id: string) => void;
}

export function getCategoryIcon(id: BudgetCategoryId) {
  switch (id) {
    case 'venue':
      return Building;
    case 'catering':
      return UtensilsCrossed;
    case 'decor':
      return Sparkles;
    case 'photography':
      return Camera;
    case 'styling':
      return Shirt;
    case 'invitations':
      return QrCode;
    case 'transport':
      return Car;
    case 'entertainment':
      return Sparkles;
    case 'gifts':
      return Gift;
    case 'contingency':
      return ShieldAlert;
    default:
      return Wallet;
  }
}

export const CategoryAllocationList: React.FC<CategoryAllocationListProps> = ({
  categories,
  budgetSummary,
  targetBudget,
  activeFilter,
  onSelectFilter,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-lg text-[#49372D]">Category Allocations</h3>
        <span className="text-xs text-[#6E5548]">Target vs. Actual Expense Tracking</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <button
          onClick={() => onSelectFilter('all')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            activeFilter === 'all'
              ? 'bg-[#C96F4A] text-white border-[#C96F4A] shadow-md'
              : 'bg-white border-[#EAE5E1] text-[#49372D] hover:border-[#C96F4A]'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span>All Categories</span>
          </div>
          <p className="font-mono font-bold text-sm">
            {formatCurrency(budgetSummary.totalEstimated, { compact: true })}
          </p>
          <p className={`text-[10px] ${activeFilter === 'all' ? 'text-white/80' : 'text-[#6E5548]'}`}>
            {categories.length} segments
          </p>
        </button>

        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.id);
          const total = budgetSummary.categoryTotals[cat.id]?.estimatedTotal || 0;
          const targetAmount = Math.round(targetBudget * (cat.targetPercent / 100));
          const isSelected = activeFilter === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectFilter(cat.id)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-[#49372D] text-white border-[#49372D] shadow-md'
                  : 'bg-white border-[#EAE5E1] text-[#49372D] hover:border-[#C96F4A]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="truncate">{cat.name}</span>
                <Icon className="w-3.5 h-3.5 shrink-0 opacity-75" />
              </div>
              <p className="font-mono font-bold text-sm">
                {formatCurrency(total, { compact: true })}
              </p>
              <div
                className={`flex items-center justify-between text-[10px] mt-0.5 ${
                  isSelected ? 'text-white/80' : 'text-[#6E5548]'
                }`}
              >
                <span>Target: {formatPercentage(cat.targetPercent)}</span>
                <span className="font-mono">{formatCurrency(targetAmount, { compact: true })}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
