import React from 'react';
import { X } from 'lucide-react';
import { BudgetCategoryId, BudgetItem } from '../../../types';

interface EditBudgetItemModalProps {
  editingItem: { categoryId: BudgetCategoryId; item: BudgetItem } | null;
  onClose: () => void;
  onSave: (categoryId: BudgetCategoryId, itemId: string, updates: Partial<BudgetItem>) => void;
}

export const EditBudgetItemModal: React.FC<EditBudgetItemModalProps> = ({
  editingItem,
  onClose,
  onSave,
}) => {
  if (!editingItem) return null;

  const [item, setItem] = React.useState<BudgetItem>(editingItem.item);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editingItem.categoryId, item.id, {
      name: item.name,
      description: item.description,
      unitCost: Math.max(0, Number(item.unitCost)),
      quantity: Math.max(1, Number(item.quantity)),
      committedAmount: Math.max(0, Number(item.committedAmount)),
      isGuestDependent: item.isGuestDependent,
      guestMultiplier: Number(item.guestMultiplier),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-festive-lg border border-[#F5D1BD]">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E1] mb-4">
          <h2 className="font-serif text-xl font-bold text-[#49372D]">Edit Expense Item</h2>
          <button onClick={onClose} className="p-1 text-[#6E5548] hover:text-[#49372D]" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-[#49372D]">
          <div>
            <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
              Item Name
            </label>
            <input
              type="text"
              required
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
                Unit Cost (₹)
              </label>
              <input
                type="number"
                min="0"
                value={item.unitCost}
                onChange={(e) => setItem({ ...item, unitCost: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
                Committed / Paid (₹)
              </label>
              <input
                type="number"
                min="0"
                value={item.committedAmount}
                onChange={(e) => setItem({ ...item, committedAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
              />
            </div>
          </div>

          <div className="p-3 bg-[#FAF0EB]/60 rounded-xl border border-[#F5D1BD] flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold block text-[#49372D]">Scale with Guest Count?</span>
              <span className="text-[#6E5548]">Automatically scale quantity as guests change</span>
            </div>
            <input
              type="checkbox"
              checked={item.isGuestDependent}
              onChange={(e) => setItem({ ...item, isGuestDependent: e.target.checked })}
              className="w-4 h-4 accent-[#C96F4A]"
            />
          </div>

          <div className="mt-6 pt-4 border-t border-[#EAE5E1] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#EAE5E1] text-[#6E5548] font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#C96F4A] text-white font-semibold shadow-festive hover:bg-[#A8522F]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

