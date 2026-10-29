import { EventDetails, Guest, BudgetCategory, VenueType, WhatIfScenario, WhatIfScenarioMetrics } from '../types';
import { calculateBudgetSummary } from './budgetCalculator';

export interface ScenarioInputParams {
  name?: string;
  description?: string;
  deltaGuestCount: number; // e.g. +50 or -30
  overrideVenueType?: VenueType;
  deltaDecorPercent?: number; // e.g. -25 for 25% decor reduction
  deltaBudgetPercent?: number; // e.g. -15 for 15% target budget cut
}

/**
 * Deep clones budget categories and applies scenario modifications
 */
export function cloneAndModifyBudget(
  baseCategories: BudgetCategory[],
  _effectiveGuests: number,
  _venueType: VenueType,
  deltaDecorPercent: number = 0
): BudgetCategory[] {
  return baseCategories.map((cat) => {
    return {
      ...cat,
      items: cat.items.map((item) => {
        let clonedItem = { ...item };

        // Adjust decor budget if percentage modifier provided
        if (cat.id === 'decor' && deltaDecorPercent !== 0) {
          const factor = Math.max(0.1, 1 + deltaDecorPercent / 100);
          clonedItem.unitCost = Math.round(clonedItem.unitCost * factor);
          clonedItem.estimatedTotal = Math.round(clonedItem.estimatedTotal * factor);
        }

        return clonedItem;
      }),
    };
  });
}

/**
 * Simulates a What-If scenario against current event data
 * Leaves original event and budget untouched!
 */
export function simulateWhatIfScenario(
  event: EventDetails,
  guests: Guest[],
  categories: BudgetCategory[],
  params: ScenarioInputParams
): WhatIfScenario {
  const originalGuestCount = event.targetGuestCount;
  const proposedGuestCount = Math.max(10, originalGuestCount + params.deltaGuestCount);
  const guestCountDiff = proposedGuestCount - originalGuestCount;

  const originalVenueType = event.venue.type;
  const proposedVenueType = params.overrideVenueType || originalVenueType;

  const targetBudget = params.deltaBudgetPercent
    ? Math.round(event.targetBudget * (1 + params.deltaBudgetPercent / 100))
    : event.targetBudget;

  // 1. Calculate Original Baseline
  const originalSummary = calculateBudgetSummary(
    categories,
    event.targetBudget,
    originalGuestCount,
    originalVenueType
  );

  // 2. Clone and Simulate Proposed Budget
  const simulatedCategories = cloneAndModifyBudget(
    categories,
    proposedGuestCount,
    proposedVenueType,
    params.deltaDecorPercent || 0
  );

  const proposedSummary = calculateBudgetSummary(
    simulatedCategories,
    targetBudget,
    proposedGuestCount,
    proposedVenueType
  );

  // Category specific comparisons
  const originalCateringCost = originalSummary.categoryTotals['catering']?.estimatedTotal || 0;
  const proposedCateringCost = proposedSummary.categoryTotals['catering']?.estimatedTotal || 0;

  const originalVenueCost = originalSummary.categoryTotals['venue']?.estimatedTotal || 0;
  const proposedVenueCost = proposedSummary.categoryTotals['venue']?.estimatedTotal || 0;

  const originalDecorCost = originalSummary.categoryTotals['decor']?.estimatedTotal || 0;
  const proposedDecorCost = proposedSummary.categoryTotals['decor']?.estimatedTotal || 0;

  // Attendance metrics
  const confirmedAttendance = guests
    .filter((g) => g.rsvpStatus === 'attending')
    .reduce((sum, g) => sum + g.partySize, 0);

  const cateringPlateCapacity = proposedGuestCount + (event.cateringPlateBuffer || 0);
  const cateringPlateShortfall = Math.max(0, confirmedAttendance - cateringPlateCapacity);

  const attendingParties = guests.filter((g) => g.rsvpStatus === 'attending').length;
  const giftCountCapacity = Math.round(proposedGuestCount * 0.55) + (event.returnGiftBuffer || 0);
  const giftShortfall = Math.max(0, attendingParties - giftCountCapacity);

  const costDifference = proposedSummary.totalEstimated - originalSummary.totalEstimated;

  // Generate Trade-offs, Warnings, and Positives
  const tradeOffSummary: string[] = [];
  const warnings: string[] = [];
  const positives: string[] = [];

  // Guest count shifts
  if (guestCountDiff > 0) {
    tradeOffSummary.push(
      `Adding ${guestCountDiff} guests increases food & beverage expenses by ₹${(proposedCateringCost - originalCateringCost).toLocaleString('en-IN')}.`
    );
    if (proposedSummary.isOverBudget) {
      warnings.push(
        `Total budget target exceeded by ₹${proposedSummary.overrunAmount.toLocaleString('en-IN')}.`
      );
    }
    if (proposedVenueType === 'home_courtyard' && proposedGuestCount > 85) {
      warnings.push(
        `Severe Overcrowding: Home courtyard typically accommodates up to 85 guests comfortably (${proposedGuestCount} planned).`
      );
    }
  } else if (guestCountDiff < 0) {
    const savings = Math.abs(costDifference);
    positives.push(
      `Trimming ${Math.abs(guestCountDiff)} guests saves ₹${savings.toLocaleString('en-IN')} overall across catering, invitations, and favors.`
    );
    tradeOffSummary.push(
      `Creates a more intimate atmosphere with lower logistics overhead and faster guest seating.`
    );
  }

  // Venue shifts
  if (originalVenueType === 'function_hall' && proposedVenueType === 'home_courtyard') {
    const venueSavings = originalVenueCost - proposedVenueCost;
    positives.push(
      `Eliminating commercial banquet hall rental yields immediate savings of ₹${venueSavings.toLocaleString('en-IN')}!`
    );
    tradeOffSummary.push(
      'Home venue provides sentimental warmth and zero hard curfew, but requires external valet shuttle and acoustic control.'
    );
    if (proposedGuestCount > 100) {
      warnings.push('Valet parking and restroom capacity will require supplemental rental units.');
    }
  } else if (originalVenueType === 'home_courtyard' && proposedVenueType === 'function_hall') {
    tradeOffSummary.push(
      `Moving to a function hall adds commercial rental costs but includes built-in valet, sound rigging, and power backup.`
    );
  }

  // Decor shifts
  if (params.deltaDecorPercent && params.deltaDecorPercent < 0) {
    const decorSavings = originalDecorCost - proposedDecorCost;
    positives.push(
      `Reducing decor complexity saves ₹${decorSavings.toLocaleString('en-IN')} without compromising primary stage presence.`
    );
    tradeOffSummary.push(
      'Substitutes exotic floral cut stems with reusable terracotta urns, marigold garlands, and ambient string lighting.'
    );
  }

  // Budget cut shifts
  if (params.deltaBudgetPercent && params.deltaBudgetPercent < 0) {
    tradeOffSummary.push(
      `Target budget slashed by ${Math.abs(params.deltaBudgetPercent)}% (New cap: ₹${targetBudget.toLocaleString('en-IN')}).`
    );
    if (proposedSummary.isOverBudget) {
      warnings.push(
        `Requires an additional ₹${proposedSummary.overrunAmount.toLocaleString('en-IN')} in expense cuts to fit within new tightened budget.`
      );
    }
  }

  const metrics: WhatIfScenarioMetrics = {
    originalGuestCount,
    proposedGuestCount,
    guestCountDiff,
    originalTotalCost: originalSummary.totalEstimated,
    proposedTotalCost: proposedSummary.totalEstimated,
    costDifference,
    targetBudget,
    originalRemainingBudget: originalSummary.remainingBudget,
    proposedRemainingBudget: proposedSummary.remainingBudget,
    originalCateringCost,
    proposedCateringCost,
    cateringDifference: proposedCateringCost - originalCateringCost,
    originalVenueCost,
    proposedVenueCost,
    originalDecorCost,
    proposedDecorCost,
    expectedAttendance: proposedGuestCount,
    confirmedAttendance,
    cateringPlateCapacity,
    cateringPlateShortfall,
    giftCountCapacity,
    giftShortfall,
    isOverBudget: proposedSummary.isOverBudget,
    overBudgetAmount: proposedSummary.overrunAmount,
    tradeOffSummary,
    warnings,
    positives,
  };

  return {
    id: `scenario-${Date.now()}`,
    name: params.name || `Scenario: ${params.deltaGuestCount >= 0 ? '+' : ''}${params.deltaGuestCount} Guests`,
    description: params.description || 'Custom What-If scenario simulation',
    deltaGuestCount: params.deltaGuestCount,
    overrideVenueType: params.overrideVenueType,
    deltaDecorBudgetPercent: params.deltaDecorPercent,
    deltaBudgetPercent: params.deltaBudgetPercent,
    calculatedMetrics: metrics,
  };
}

/**
 * Pre-configured signature scenarios for one-click exploration
 */
export const PRESET_WHAT_IF_SCENARIOS: Array<{
  name: string;
  description: string;
  params: ScenarioInputParams;
}> = [
  {
    name: 'Add 50 More Guests (+50)',
    description: 'Simulate inviting distant relatives and larger college squads (Total: 200 guests).',
    params: {
      deltaGuestCount: 50,
    },
  },
  {
    name: 'Trim to Intimate Circle (-30)',
    description: 'Keep celebration focused on close family and core friends (Total: 120 guests).',
    params: {
      deltaGuestCount: -30,
    },
  },
  {
    name: 'Switch to Home Courtyard',
    description: 'Eliminate banquet hall rental fees by hosting in ancestral home courtyard.',
    params: {
      deltaGuestCount: 0,
      overrideVenueType: 'home_courtyard',
      deltaDecorPercent: -15,
    },
  },
  {
    name: 'Decor Value Optimization (-25% Decor)',
    description: 'Swap imported blooms for local marigold, brass lanterns & fairy light canopy.',
    params: {
      deltaGuestCount: 0,
      deltaDecorPercent: -25,
    },
  },
  {
    name: 'Tighten Overall Budget by 15%',
    description: 'Simulate a 15% budget reduction to preserve savings for honeymoon travel.',
    params: {
      deltaGuestCount: -15,
      deltaBudgetPercent: -15,
      deltaDecorPercent: -10,
    },
  },
];
