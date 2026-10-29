import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  X,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Building,
  Home,
  Check,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import {
  simulateWhatIfScenario,
  PRESET_WHAT_IF_SCENARIOS,
  ScenarioInputParams,
} from '../../services/whatIfEngine';
import { VenueType } from '../../types';

export const WhatIfModal: React.FC = () => {
  const {
    event,
    guests,
    budgetCategories,
    isWhatIfModalOpen,
    setIsWhatIfModalOpen,
    applyWhatIfScenario,
  } = useEvent();

  // Custom simulation slider states
  const [deltaGuestCount, setDeltaGuestCount] = useState<number>(50);
  const [overrideVenueType, setOverrideVenueType] = useState<VenueType | undefined>(undefined);
  const [deltaDecorPercent, setDeltaDecorPercent] = useState<number>(0);
  const [deltaBudgetPercent, setDeltaBudgetPercent] = useState<number>(0);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(0);

  // Active scenario simulation
  const scenario = useMemo(() => {
    const params: ScenarioInputParams = {
      name:
        selectedPresetIndex !== null
          ? PRESET_WHAT_IF_SCENARIOS[selectedPresetIndex]?.name
          : `Custom Scenario (${deltaGuestCount >= 0 ? '+' : ''}${deltaGuestCount} Guests)`,
      deltaGuestCount,
      overrideVenueType,
      deltaDecorPercent,
      deltaBudgetPercent,
    };

    return simulateWhatIfScenario(event, guests, budgetCategories, params);
  }, [
    event,
    guests,
    budgetCategories,
    deltaGuestCount,
    overrideVenueType,
    deltaDecorPercent,
    deltaBudgetPercent,
    selectedPresetIndex,
  ]);

  if (!isWhatIfModalOpen) return null;

  const handleApplyPreset = (index: number) => {
    setSelectedPresetIndex(index);
    const preset = PRESET_WHAT_IF_SCENARIOS[index];
    setDeltaGuestCount(preset.params.deltaGuestCount);
    setOverrideVenueType(preset.params.overrideVenueType);
    setDeltaDecorPercent(preset.params.deltaDecorPercent || 0);
    setDeltaBudgetPercent(preset.params.deltaBudgetPercent || 0);
  };

  const handleApplyToEvent = () => {
    applyWhatIfScenario(scenario);
    setIsWhatIfModalOpen(false);
  };

  const m = scenario.calculatedMetrics;
  const isCostIncrease = m.costDifference > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-festive-lg border border-[#F5D1BD] my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE5E1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#49372D] to-[#32251D] text-[#F2C66D] flex items-center justify-center shadow-sm">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-[#49372D]">
                  Event What-If Engine
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C96F4A] text-white">
                  Signature Differentiator
                </span>
              </div>
              <p className="text-xs text-[#6E5548]">
                Test alternative plans safely without touching your live celebration until you choose to apply.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWhatIfModalOpen(false)}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Signature Presets Bar */}
        <div className="mt-5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6E5548] block mb-2">
            One-Click Signature Scenarios:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {PRESET_WHAT_IF_SCENARIOS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyPreset(idx)}
                className={`shrink-0 px-3.5 py-2 rounded-xl font-medium transition-all ${
                  selectedPresetIndex === idx
                    ? 'bg-[#C96F4A] text-white font-semibold shadow-festive'
                    : 'bg-[#FAF0EB] text-[#49372D] hover:bg-[#F5D1BD]/60'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Simulation Sliders */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#FAF0EB]/50 border border-[#F5D1BD]">
          {/* Guest Count Delta */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#49372D]">Guest Count Shift:</span>
              <span className="font-mono font-bold text-[#C96F4A]">
                {deltaGuestCount >= 0 ? `+${deltaGuestCount}` : deltaGuestCount} Guests ({m.proposedGuestCount} total)
              </span>
            </div>
            <input
              type="range"
              min="-60"
              max="100"
              step="5"
              value={deltaGuestCount}
              onChange={(e) => {
                setSelectedPresetIndex(null);
                setDeltaGuestCount(Number(e.target.value));
              }}
              className="mt-2 w-full h-2 bg-[#F5D1BD] rounded-lg appearance-none cursor-pointer accent-[#C96F4A]"
            />
          </div>

          {/* Venue Model Override */}
          <div>
            <span className="font-semibold text-xs text-[#49372D] block mb-1">
              Venue Hosting Model:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => {
                  setSelectedPresetIndex(null);
                  setOverrideVenueType('function_hall');
                }}
                className={`py-1.5 px-2 rounded-lg font-medium border text-center transition-all ${
                  (overrideVenueType || event.venue.type) === 'function_hall'
                    ? 'bg-[#49372D] text-white border-[#49372D]'
                    : 'bg-white text-[#6E5548] border-[#EAE5E1]'
                }`}
              >
                Function Hall
              </button>
              <button
                onClick={() => {
                  setSelectedPresetIndex(null);
                  setOverrideVenueType('home_courtyard');
                }}
                className={`py-1.5 px-2 rounded-lg font-medium border text-center transition-all ${
                  (overrideVenueType || event.venue.type) === 'home_courtyard'
                    ? 'bg-[#C96F4A] text-white border-[#C96F4A]'
                    : 'bg-white text-[#6E5548] border-[#EAE5E1]'
                }`}
              >
                Home Courtyard
              </button>
            </div>
          </div>

          {/* Decor Budget Modifier */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#49372D]">Decor Budget Modifier:</span>
              <span className="font-mono font-bold text-[#C96F4A]">
                {deltaDecorPercent >= 0 ? `+${deltaDecorPercent}%` : `${deltaDecorPercent}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="30"
              step="5"
              value={deltaDecorPercent}
              onChange={(e) => {
                setSelectedPresetIndex(null);
                setDeltaDecorPercent(Number(e.target.value));
              }}
              className="mt-2 w-full h-2 bg-[#F5D1BD] rounded-lg appearance-none cursor-pointer accent-[#C96F4A]"
            />
          </div>
        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="mt-6 rounded-2xl bg-white border border-[#EAE5E1] overflow-hidden shadow-card">
          <div className="bg-[#FAF0EB]/60 px-5 py-3 border-b border-[#EAE5E1] flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#49372D]">
              Scenario Comparison Matrix
            </h3>
            <span className="text-xs text-[#6E5548]">Current Plan vs Proposed Scenario</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-[#49372D]">
              <thead className="text-[11px] uppercase tracking-wider text-[#6E5548] border-b border-[#EAE5E1]">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Dimension</th>
                  <th className="py-2.5 px-4 font-semibold">Current Plan</th>
                  <th className="py-2.5 px-4 font-semibold">Proposed Scenario</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Variance / Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5E1]/60 text-xs">
                {/* Guest Count */}
                <tr>
                  <td className="py-3 px-4 font-medium">Guest Headcount</td>
                  <td className="py-3 px-4 font-mono">{m.originalGuestCount} guests</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#C96F4A]">
                    {m.proposedGuestCount} guests
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold">
                    {m.guestCountDiff >= 0 ? `+${m.guestCountDiff}` : m.guestCountDiff} guests
                  </td>
                </tr>

                {/* Total Estimated Cost */}
                <tr>
                  <td className="py-3 px-4 font-medium">Total Estimated Cost</td>
                  <td className="py-3 px-4 font-mono">₹{m.originalTotalCost.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 font-mono font-bold text-base text-[#49372D]">
                    ₹{m.proposedTotalCost.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                        isCostIncrease
                          ? 'bg-red-100 text-red-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isCostIncrease ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {isCostIncrease ? '+' : '-'}₹{Math.abs(m.costDifference).toLocaleString('en-IN')}
                      </span>
                    </span>
                  </td>
                </tr>

                {/* Catering Costs */}
                <tr>
                  <td className="py-3 px-4 font-medium">Food & Catering Expense</td>
                  <td className="py-3 px-4 font-mono">₹{m.originalCateringCost.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 font-mono font-bold">
                    ₹{m.proposedCateringCost.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {m.cateringDifference >= 0 ? '+' : '-'}₹
                    {Math.abs(m.cateringDifference).toLocaleString('en-IN')}
                  </td>
                </tr>

                {/* Venue Cost */}
                <tr>
                  <td className="py-3 px-4 font-medium">Venue Rental & Sound</td>
                  <td className="py-3 px-4 font-mono">₹{m.originalVenueCost.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 font-mono font-bold">
                    ₹{m.proposedVenueCost.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {m.proposedVenueCost < m.originalVenueCost ? (
                      <span className="text-emerald-700 font-bold">
                        -₹{(m.originalVenueCost - m.proposedVenueCost).toLocaleString('en-IN')} (Saved)
                      </span>
                    ) : (
                      'Unchanged'
                    )}
                  </td>
                </tr>

                {/* Remaining Budget Balance */}
                <tr>
                  <td className="py-3 px-4 font-medium">Budget Balance / Deficit</td>
                  <td className="py-3 px-4 font-mono">₹{m.originalRemainingBudget.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 font-mono font-bold">
                    ₹{m.proposedRemainingBudget.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`font-semibold ${
                        m.isOverBudget ? 'text-red-700 font-bold' : 'text-emerald-700'
                      }`}
                    >
                      {m.isOverBudget
                        ? `Over budget by ₹${m.overBudgetAmount.toLocaleString('en-IN')}`
                        : 'Within Target'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Trade-Off Realities & Warnings */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Opportunities & Positives */}
          <div className="rounded-2xl bg-[#F2F6F0]/80 border border-[#A9B89A]/60 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Opportunities & Positives</span>
            </h4>
            {m.positives.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-emerald-900">
                {m.positives.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-emerald-800">No special cost windfalls in this scenario.</p>
            )}
          </div>

          {/* Trade-Off Realities & Bottlenecks */}
          <div className="rounded-2xl bg-amber-50/80 border border-amber-200 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>Trade-Offs & Bottlenecks</span>
            </h4>
            <div className="space-y-1.5 text-xs text-amber-900">
              {m.tradeOffSummary.map((t, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-amber-700 font-bold">•</span>
                  <span>{t}</span>
                </div>
              ))}
              {m.warnings.map((w, idx) => (
                <div key={`w-${idx}`} className="flex items-start gap-2 font-semibold text-red-700">
                  <span className="font-bold">⚠️</span>
                  <span>{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer: Discard vs Apply */}
        <div className="mt-6 pt-4 border-t border-[#EAE5E1] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#6E5548]">
            *Applying this scenario updates target headcount, venue selection, and budget estimates synchronously.
          </p>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsWhatIfModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-[#EAE5E1] text-[#6E5548] text-xs font-semibold hover:bg-stone-50"
            >
              Discard Scenario
            </button>

            <button
              onClick={handleApplyToEvent}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C96F4A] text-white text-xs font-bold shadow-festive hover:bg-[#A8522F] active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Apply Scenario to Celebration</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
