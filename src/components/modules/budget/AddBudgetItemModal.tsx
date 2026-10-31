import React, { useState } from 'react';
import { X } from 'lucide-react';
import { BudgetCategory, BudgetCategoryId, BudgetItem } from '../../../types';

interface AddBudgetItemModalProps {
  categories: BudgetCategory[];
  defaultCategoryId: BudgetCategoryId;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (categoryId: BudgetCategoryId, item: Omit<BudgetItem, 'id'>) => void;
}

export const AddBudgetItemModal: React.FC<AddBudgetItemModalProps> = ({
  categories,
  defaultCategoryId,
  isOpen,
  onClose,
  onAdd,
}) => {
  const [categoryId, setCategoryId] = useState<BudgetCategoryId>(defaultCategoryId);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [unitCost, setUnitCost] = useState<number>(500);
  const [quantity, setQuantity] = useState<number>(1);
  const [isGuestDependent, setIsGuestDependent] = useState(false);
  const [guestMultiplier, setGuestMultiplier] = useState<number>(1.0);
  const [committed, setCommitted] = useState<number>(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd(categoryId, {
      categoryId,
      name: name.trim(),
      description: desc.trim() || undefined,
      unitCost: Math.max(0, Number(unitCost)),
      quantity: Math.max(1, Number(quantity)),
      isGuestDependent,
      guestMultiplier: Number(guestMultiplier),
      committedAmount: Math.max(0, Number(committed)),
      estimatedTotal: Math.max(0, Number(unitCost)) * Math.max(1, Number(quantity)),
    });

    setName('');
    setDesc('');
    setUnitCost(500);
    setQuantity(1);
    setIsGuestDependent(false);
    setCommitted(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-festive-lg border border-[#F5D1BD]">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E1] mb-4">
          <h2 className="font-serif text-xl font-bold text-[#49372D]">Add Expense Item</h2>
          <button onClick={onClose} className="p-1 text-[#6E5548] hover:text-[#49372D]" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-[#49372D]">
          <div>
            <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
              Budget Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as BudgetCategoryId)}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
              Item Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Live Saxophone Soloist"
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
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
              />
            </div>
          </div>

          <div className="p-3 bg-[#FAF0EB]/60 rounded-xl border border-[#F5D1BD] flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold block text-[#49372D]">Guest Dependent?</span>
              <span className="text-[#6E5548]">Quantity links to total guests (e.g. food plates)</span>
            </div>
            <input
              type="checkbox"
              checked={isGuestDependent}
              onChange={(e) => setIsGuestDependent(e.target.checked)}
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
              Add Line Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

