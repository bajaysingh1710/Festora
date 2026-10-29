import React, { useState } from 'react';
import {
  Wallet,
  Building,
  UtensilsCrossed,
  Sparkles,
  Camera,
  Shirt,
  QrCode,
  Car,
  Plus,
  Trash2,
  Edit2,
  Sliders,
  AlertCircle,
  CheckCircle2,
  Home,
  Info,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { BudgetCategoryId, BudgetItem, VenueType } from '../../types';
import { calculateItemCost } from '../../services/budgetCalculator';

export const BudgetModule: React.FC = () => {
  const {
    event,
    budgetCategories,
    budgetSummary,
    updateEvent,
    updateGuestCount,
    updateVenueType,
    updateBudgetItem,
    addBudgetItem,
    deleteBudgetItem,
    setIsWhatIfModalOpen,
  } = useEvent();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<{ categoryId: BudgetCategoryId; item: BudgetItem } | null>(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [addCategoryId, setAddCategoryId] = useState<BudgetCategoryId>('catering');

  // New Item State
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemUnitCost, setNewItemUnitCost] = useState<number>(500);
  const [newItemQuantity, setNewItemQuantity] = useState<number>(1);
  const [newItemIsGuestDependent, setNewItemIsGuestDependent] = useState(false);
  const [newItemGuestMultiplier, setNewItemGuestMultiplier] = useState<number>(1.0);
  const [newItemCommitted, setNewItemCommitted] = useState<number>(0);

  const getCategoryIcon = (id: BudgetCategoryId) => {
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
      default:
        return Wallet;
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    updateBudgetItem(editingItem.categoryId, editingItem.item.id, {
      name: editingItem.item.name,
      description: editingItem.item.description,
      unitCost: Number(editingItem.item.unitCost),
      quantity: Number(editingItem.item.quantity),
      committedAmount: Number(editingItem.item.committedAmount),
      isGuestDependent: editingItem.item.isGuestDependent,
      guestMultiplier: Number(editingItem.item.guestMultiplier),
    });

    setEditingItem(null);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addBudgetItem(addCategoryId, {
      categoryId: addCategoryId,
      name: newItemName.trim(),
      description: newItemDesc.trim() || undefined,
      unitCost: Number(newItemUnitCost),
      quantity: Number(newItemQuantity),
      isGuestDependent: newItemIsGuestDependent,
      guestMultiplier: Number(newItemGuestMultiplier),
      committedAmount: Number(newItemCommitted),
      estimatedTotal: Number(newItemUnitCost) * Number(newItemQuantity),
    });

    // Reset Form
    setNewItemName('');
    setNewItemDesc('');
    setNewItemUnitCost(500);
    setNewItemQuantity(1);
    setNewItemIsGuestDependent(false);
    setNewItemCommitted(0);
    setIsAddItemOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FEF9ED] text-[#D9A948] text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Module B</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#49372D]">
            Smart Budget Planner
          </h1>
          <p className="text-sm text-[#6E5548] mt-0.5">
            Transparent cost modeling across 7 categories. Fixed and guest-dependent estimates automatically sync.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsWhatIfModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C96F4A] to-[#A8522F] text-white font-semibold text-sm shadow-festive hover:brightness-105 active:scale-95 transition-all"
          >
            <Sliders className="w-4 h-4" />
            <span>Simulate Alternative Budgets</span>
          </button>

          <button
            onClick={() => setIsAddItemOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#EAE5E1] text-[#49372D] font-semibold text-sm hover:bg-[#FAF0EB] active:scale-95 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#C96F4A]" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Main Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Target Budget Card */}
        <div className="rounded-2xl bg-white p-5 border border-[#EAE5E1] shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6E5548]">
            Target Budget Cap
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-serif text-2xl font-bold text-[#49372D]">
              ₹{event.targetBudget.toLocaleString('en-IN')}
            </span>
            <input
              type="number"
              step="10000"
              value={event.targetBudget}
              onChange={(e) => updateEvent({ targetBudget: Number(e.target.value) })}
              className="w-24 text-right text-xs font-mono px-2 py-1 rounded border border-[#EAE5E1] text-[#6E5548] focus:outline-none"
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
              ₹{budgetSummary.totalEstimated.toLocaleString('en-IN')}
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
              ₹{budgetSummary.totalCommitted.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-[#6E5548]">
              {((budgetSummary.totalCommitted / budgetSummary.totalEstimated) * 100).toFixed(0)}% secured
            </span>
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
              ₹{Math.abs(budgetSummary.remainingBudget).toLocaleString('en-IN')}
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                budgetSummary.isOverBudget ? 'bg-red-200 text-red-800' : 'bg-emerald-200 text-emerald-800'
              }`}
            >
              {budgetSummary.isOverBudget ? 'Over Budget' : 'Within Budget'}
            </span>
          </div>
          <p className="text-xs opacity-80 mt-1">
            {budgetSummary.isOverBudget
              ? 'Trim guest count or decor to rebalance'
              : 'Surplus available for contingency or upgrades'}
          </p>
        </div>
      </div>

      {/* Interactive Controls Bar: Real-time Guest Count Scaling & Venue Type Toggle */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FAF0EB] to-[#FFF8EF] border border-[#F5D1BD] p-5 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Guest Count Slider with Real-Time Budget Recalculation */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#49372D] uppercase tracking-wider flex items-center gap-1.5">
                <span>Scale Guests Live:</span>
                <span className="text-sm font-mono text-[#C96F4A] font-bold">
                  {event.targetGuestCount} Guests
                </span>
              </label>
              <span className="text-xs text-[#6E5548]">
                Scales catering & return favors dynamically
              </span>
            </div>

            <div className="mt-2 flex items-center gap-4">
              <span className="text-xs text-[#6E5548] font-mono">50</span>
              <input
                type="range"
                min="50"
                max="250"
                step="5"
                value={event.targetGuestCount}
                onChange={(e) => updateGuestCount(Number(e.target.value))}
                className="w-full h-2 bg-[#F5D1BD] rounded-lg appearance-none cursor-pointer accent-[#C96F4A]"
              />
              <span className="text-xs text-[#6E5548] font-mono">250</span>
            </div>
          </div>

          {/* Home vs Function Hall Venue Toggle */}
          <div className="lg:border-l lg:border-[#F5D1BD] lg:pl-6 shrink-0">
            <span className="block text-xs font-bold text-[#49372D] uppercase tracking-wider mb-2">
              Venue Hosting Model:
            </span>
            <div className="inline-flex rounded-xl p-1 bg-white border border-[#EAE5E1] shadow-sm">
              <button
                onClick={() => updateVenueType('function_hall')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  event.venue.type === 'function_hall'
                    ? 'bg-[#C96F4A] text-white shadow-sm'
                    : 'text-[#6E5548] hover:text-[#49372D]'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Function Hall</span>
              </button>
              <button
                onClick={() => updateVenueType('home_courtyard')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  event.venue.type === 'home_courtyard'
                    ? 'bg-[#C96F4A] text-white shadow-sm'
                    : 'text-[#6E5548] hover:text-[#49372D]'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home Courtyard (Saves ₹175k)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setActiveCategoryFilter('all')}
          className={`px-3.5 py-2 rounded-xl font-semibold capitalize transition-all ${
            activeCategoryFilter === 'all'
              ? 'bg-[#49372D] text-white shadow-sm'
              : 'bg-white border border-[#EAE5E1] text-[#6E5548] hover:bg-[#FAF0EB]'
          }`}
        >
          All 7 Categories
        </button>

        {budgetCategories.map((cat) => {
          const summary = budgetSummary.categoryTotals[cat.id];
          const Icon = getCategoryIcon(cat.id);
          const isSelected = activeCategoryFilter === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all ${
                isSelected
                  ? 'bg-[#C96F4A] text-white font-semibold shadow-sm'
                  : 'bg-white border border-[#EAE5E1] text-[#49372D] hover:bg-[#FAF0EB]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{cat.name}</span>
              <span className={`text-[11px] opacity-80 ${isSelected ? 'text-white' : 'text-[#6E5548]'}`}>
                (₹{Math.round((summary?.estimatedTotal || 0) / 1000)}k)
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Line Items Matrix */}
      <div className="space-y-4">
        {budgetCategories
          .filter((cat) => activeCategoryFilter === 'all' || activeCategoryFilter === cat.id)
          .map((cat) => {
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
                        ₹{summary?.estimatedTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6E5548]">Committed:</span>{' '}
                      <span className="font-semibold text-emerald-800">
                        ₹{summary?.committedTotal.toLocaleString('en-IN')}
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
                          event.targetGuestCount,
                          event.venue.type
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
                              ₹{item.unitCost.toLocaleString('en-IN')}
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-semibold">
                                {item.isGuestDependent
                                  ? Math.max(1, Math.round(event.targetGuestCount * item.guestMultiplier))
                                  : item.quantity}
                              </span>
                              {item.isGuestDependent && (
                                <span className="ml-1 text-[10px] text-[#C96F4A] font-semibold bg-[#FAF0EB] px-1.5 py-0.5 rounded">
                                  Guest Scaled
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-[#6E5548]">
                              {calculationExplanation}
                            </td>

                            <td className="py-3 px-4 font-semibold text-emerald-800">
                              ₹{item.committedAmount.toLocaleString('en-IN')}
                            </td>

                            <td className="py-3 px-4 font-bold text-sm text-[#49372D]">
                              ₹{estimatedTotal.toLocaleString('en-IN')}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingItem({ categoryId: cat.id, item })}
                                  className="p-1 rounded text-[#6E5548] hover:text-[#C96F4A] hover:bg-[#FAF0EB]"
                                  title="Edit line item"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteBudgetItem(cat.id, item.id)}
                                  className="p-1 rounded text-stone-400 hover:text-red-600 hover:bg-red-50"
                                  title="Delete item"
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

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-festive-lg border border-[#F5D1BD]">
            <h2 className="font-serif text-xl font-bold text-[#49372D] mb-4">Edit Expense Item</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4 text-sm text-[#49372D]">
              <div>
                <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.item.name}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, name: e.target.value },
                    })
                  }
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
                    value={editingItem.item.unitCost}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, unitCost: Number(e.target.value) },
                      })
                    }
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
                    value={editingItem.item.committedAmount}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, committedAmount: Number(e.target.value) },
                      })
                    }
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
                  checked={editingItem.item.isGuestDependent}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, isGuestDependent: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-[#C96F4A]"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-[#EAE5E1] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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
      )}

      {/* Add New Item Modal */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-festive-lg border border-[#F5D1BD]">
            <h2 className="font-serif text-xl font-bold text-[#49372D] mb-4">Add Expense Item</h2>
            <form onSubmit={handleCreateItem} className="space-y-4 text-sm text-[#49372D]">
              <div>
                <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
                  Budget Category
                </label>
                <select
                  value={addCategoryId}
                  onChange={(e) => setAddCategoryId(e.target.value as BudgetCategoryId)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
                >
                  {budgetCategories.map((c) => (
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
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
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
                    value={newItemUnitCost}
                    onChange={(e) => setNewItemUnitCost(Number(e.target.value))}
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
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(Number(e.target.value))}
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
                  checked={newItemIsGuestDependent}
                  onChange={(e) => setNewItemIsGuestDependent(e.target.checked)}
                  className="w-4 h-4 accent-[#C96F4A]"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-[#EAE5E1] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddItemOpen(false)}
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
      )}
    </div>
  );
};
