import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { BudgetCategory, BudgetCategoryId, BudgetItem, VenueType } from '../../../types';
import { calculateItemCost, BudgetSummary } from '../../../services/budgetCalculator';
import { getCategoryIcon } from './CategoryAllocationList';
import { formatCurrency } from '../../../lib/formatters';

interface BudgetItemTableProps {
  categories: BudgetCategory[];
  budgetSummary: BudgetSummary;
  targetGuestCount: number;
  venueType: VenueType;
  activeFilter: string;
  onEditItem: (categoryId: BudgetCategoryId, item: BudgetItem) => void;
  onDeleteItem: (categoryId: BudgetCategoryId, itemId: string) => void;
}

export const BudgetItemTable: React.FC<BudgetItemTableProps> = ({
  categories,
  budgetSummary,
  targetGuestCount,
  venueType,
  activeFilter,
  onEditItem,
  onDeleteItem,
}) => {
  const visibleCategories = categories.filter(
    (cat) => activeFilter === 'all' || activeFilter === cat.id
  );

  return (
    <div className="space-y-4">
      {visibleCategories.map((cat) => {
        const summary = budgetSummary.categoryTotals[cat.id];
        const Icon = getCategoryIcon(cat.id);

        return (
          <div
            key={cat.id}
            className="rounded-2xl bg-white border border-[#EAE5E1] shadow-card overflow-hidden"
          >
            {/* Category Header */}
            <div className="bg-[#FAF0EB]/60 px-5 py-3.5 border-b border-[#EAE5E1] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#49372D]">{cat.name}</h3>
                  <p className="text-xs text-[#6E5548]">
                    Target share: {cat.targetPercent}% · Actual: {summary?.percentageOfTotal.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-[#6E5548]">Estimated Total:</span>{' '}
                  <span className="font-bold text-sm text-[#49372D]">
                    {formatCurrency(summary?.estimatedTotal || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-[#6E5548]">Committed:</span>{' '}
                  <span className="font-semibold text-emerald-800">
                    {formatCurrency(summary?.committedTotal || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#49372D]">
                <thead className="text-[11px] uppercase tracking-wider text-[#6E5548] border-b border-[#EAE5E1]/60">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Expense Item</th>
                    <th className="py-2.5 px-4 font-semibold">Unit Rate</th>
                    <th className="py-2.5 px-4 font-semibold">Quantity / Scaling</th>
                    <th className="py-2.5 px-4 font-semibold">Calculation Basis</th>
                    <th className="py-2.5 px-4 font-semibold">Committed</th>
                    <th className="py-2.5 px-4 font-semibold">Estimated Total</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE5E1]/50 text-xs">
                  {cat.items.map((item) => {
                    const { estimatedTotal, calculationExplanation } = calculateItemCost(
                      item,
                      targetGuestCount,
                      venueType
                    );

                    return (
                      <tr key={item.id} className="hover:bg-[#FFF8EF]/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-[#49372D]">
                          <div>{item.name}</div>
                          {item.description && (
                            <div className="text-[11px] text-[#6E5548] mt-0.5">{item.description}</div>
                          )}
                        </td>

                        <td className="py-3 px-4 font-mono font-medium">
                          {formatCurrency(item.unitCost)}
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold">
                            {item.isGuestDependent
                              ? Math.max(1, Math.round(targetGuestCount * item.guestMultiplier))
                              : item.quantity}
                          </span>
                          {item.isGuestDependent && (
                            <span className="ml-1 text-[10px] text-[#C96F4A] font-semibold bg-[#FAF0EB] px-1.5 py-0.5 rounded">
                              Guest Scaled
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-[#6E5548]">{calculationExplanation}</td>

                        <td className="py-3 px-4 font-semibold text-emerald-800">
                          {formatCurrency(item.committedAmount)}
                        </td>

                        <td className="py-3 px-4 font-bold text-sm text-[#49372D]">
                          {formatCurrency(estimatedTotal)}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onEditItem(cat.id, item)}
                              className="p-1 rounded text-[#6E5548] hover:text-[#C96F4A] hover:bg-[#FAF0EB]"
                              title="Edit line item"
                              aria-label={`Edit ${item.name}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteItem(cat.id, item.id)}
                              className="p-1 rounded text-stone-400 hover:text-red-600 hover:bg-red-50"
                              title="Delete item"
                              aria-label={`Delete ${item.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};
