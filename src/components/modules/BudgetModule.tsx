import React, { useState, useMemo } from 'react';
import { Sparkles, Plus, Sliders, Building, Home } from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { BudgetCategoryId, BudgetItem } from '../../types';
import { calculateItemCost } from '../../services/budgetCalculator';
import { BudgetOverviewCard } from './budget/BudgetOverviewCard';
import { CategoryAllocationList } from './budget/CategoryAllocationList';
import { BudgetItemTable } from './budget/BudgetItemTable';
import { AddBudgetItemModal } from './budget/AddBudgetItemModal';
import { EditBudgetItemModal } from './budget/EditBudgetItemModal';
import { AddCategoryModal } from './budget/AddCategoryModal';

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
    addBudgetCategory,
    autoBalanceBudgetCategories,
    setIsWhatIfModalOpen,
  } = useEvent();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<{ categoryId: BudgetCategoryId; item: BudgetItem } | null>(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [addCategoryId, setAddCategoryId] = useState<BudgetCategoryId>('catering');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  // Fixed vs Variable (Guest-Dependent) Breakdown
  const { fixedTotal, variableTotal } = useMemo(() => {
    let fixed = 0;
    let variable = 0;
    budgetCategories.forEach((cat) => {
      cat.items.forEach((item) => {
        const { estimatedTotal } = calculateItemCost(item, event.targetGuestCount, event.venue.type);
        if (item.isGuestDependent) {
          variable += estimatedTotal;
        } else {
          fixed += estimatedTotal;
        }
      });
    });
    return { fixedTotal: fixed, variableTotal: variable };
  }, [budgetCategories, event.targetGuestCount, event.venue.type]);

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
            Transparent cost modeling across categories. Fixed and guest-dependent estimates automatically sync.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={autoBalanceBudgetCategories}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF0EB] border border-[#F5D1BD] text-[#C96F4A] font-bold text-xs hover:bg-[#F5D1BD]/50 active:scale-95 transition-all shadow-sm"
            title="Automatically rebalance target category shares based on event type"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Auto-Balance</span>
          </button>

          <button
            onClick={() => setIsAddCategoryOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#EAE5E1] text-[#49372D] font-bold text-xs hover:bg-[#FAF0EB] active:scale-95 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#C96F4A]" />
            <span>Add Category</span>
          </button>

          <button
            onClick={() => setIsAddItemOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#EAE5E1] text-[#49372D] font-bold text-xs hover:bg-[#FAF0EB] active:scale-95 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#C96F4A]" />
            <span>Add Expense</span>
          </button>

          <button
            onClick={() => setIsWhatIfModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C96F4A] to-[#A8522F] text-white font-bold text-xs shadow-festive hover:brightness-105 active:scale-95 transition-all"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>What-If Sandbox</span>
          </button>
        </div>
      </div>

      {/* Main Financial Overview Cards */}
      <BudgetOverviewCard
        targetBudget={event.targetBudget}
        budgetSummary={budgetSummary}
        fixedTotal={fixedTotal}
        variableTotal={variableTotal}
        onUpdateTargetBudget={(target) => updateEvent({ targetBudget: target })}
      />

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
                <span>Home Courtyard (Waives Hall Rental)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Allocation Quick Tiles */}
      <CategoryAllocationList
        categories={budgetCategories}
        budgetSummary={budgetSummary}
        targetBudget={event.targetBudget}
        activeFilter={activeCategoryFilter}
        onSelectFilter={setActiveCategoryFilter}
      />

      {/* Category Line Items Matrix */}
      <BudgetItemTable
        categories={budgetCategories}
        budgetSummary={budgetSummary}
        targetGuestCount={event.targetGuestCount}
        venueType={event.venue.type}
        activeFilter={activeCategoryFilter}
        onEditItem={(categoryId, item) => setEditingItem({ categoryId, item })}
        onDeleteItem={deleteBudgetItem}
      />

      {/* Edit Item Modal */}
      <EditBudgetItemModal
        editingItem={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={updateBudgetItem}
      />

      {/* Add Custom Category Modal */}
      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onAdd={addBudgetCategory}
      />

      {/* Add New Item Modal */}
      <AddBudgetItemModal
        categories={budgetCategories}
        defaultCategoryId={addCategoryId}
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onAdd={addBudgetItem}
      />
    </div>
  );
};
