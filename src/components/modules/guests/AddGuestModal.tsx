import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Guest, GuestCategory, MealPreference } from '../../../types';
import { generateGuestCode } from '../../../services/guestPassService';

interface AddGuestModalProps {
  isOpen: boolean;
  eventType: string;
  existingGuestCount: number;
  onClose: () => void;
  onAdd: (guest: Omit<Guest, 'id'>) => void;
}

export const AddGuestModal: React.FC<AddGuestModalProps> = ({
  isOpen,
  eventType,
  existingGuestCount,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<GuestCategory>('family');
  const [partySize, setPartySize] = useState<number>(2);
  const [meal, setMeal] = useState<MealPreference>('vegetarian');
  const [table, setTable] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const guestCode = generateGuestCode(eventType, 100 + existingGuestCount + 1);

    onAdd({
      guestCode,
      name: name.trim().slice(0, 80),
      email: email.trim().slice(0, 100) || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: phone.trim().slice(0, 25) || '+91 98000 00000',
      category,
      partySize: Math.max(1, Math.min(20, Number(partySize) || 1)),
      rsvpStatus: 'pending',
      mealPreference: meal,
      tableNumber: table.trim() || undefined,
      dietaryNotes: notes.trim() || undefined,
      invitationSent: true,
      invitationSentAt: new Date().toISOString(),
      checkInStatus: 'not_checked_in',
    });

    setName('');
    setEmail('');
    setPhone('');
    setCategory('family');
    setPartySize(2);
    setTable('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-festive-lg border border-[#F5D1BD] animate-in fade-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE5E1]">
          <h2 className="font-serif text-2xl font-bold text-[#49372D]">Add Celebration Guest</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-sm text-[#49372D]">
          <div>
            <label className="block text-xs font-semibold text-[#6E5548] uppercase tracking-wider mb-1">
              Full Name / Family Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vikram & Preeti Mehra"
              className="w-full px-3.5 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6E5548] uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98450 12345"
                className="w-full px-3.5 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6E5548] uppercase tracking-wider mb-1">
                Party Size (Attending Count)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6E5548] uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GuestCategory)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
              >
                <option value="family">Family</option>
                <option value="close_friends">Close Friends</option>
                <option value="vip">VIP</option>
                <option value="colleagues">Colleagues</option>
                <option value="community">Community</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6E5548] uppercase tracking-wider mb-1">
                Meal Preference
              </label>
              <select
                value={meal}
                onChange={(e) => setMeal(e.target.value as MealPreference)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non_vegetarian">Non-Vegetarian</option>
                <option value="jain">Jain Special</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6E5548] uppercase tracking-wider mb-1">
              Table Assignment (Optional)
            </label>
            <input
              type="text"
              value={table}
              onChange={(e) => setTable(e.target.value)}
              placeholder="e.g. Table 2 / VIP High Table"
              className="w-full px-3.5 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
            />
          </div>

          <div className="pt-4 border-t border-[#EAE5E1] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#EAE5E1] text-[#6E5548] font-semibold hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#C96F4A] text-white font-bold shadow-festive hover:bg-[#A8522F]"
            >
              Save & Generate Pass
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

