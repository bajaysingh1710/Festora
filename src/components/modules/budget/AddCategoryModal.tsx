import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, targetPercent: number) => void;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [percent, setPercent] = useState(10);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), Number(percent));
    setName('');
    setPercent(10);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-festive-lg border border-[#F5D1BD]">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E1] mb-4">
          <h2 className="font-serif text-xl font-bold text-[#49372D]">Create Custom Category</h2>
          <button onClick={onClose} className="p-1 text-[#6E5548] hover:text-[#49372D]" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-[#49372D]">
          <div>
            <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Celebrity Artist & Performance"
              className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
              Target Allocation (% of Budget)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE5E1]">
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
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

