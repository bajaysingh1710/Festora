import { describe, it, expect } from 'vitest';
import { simulateWhatIfScenario } from '../services/whatIfEngine';
import { SEED_EVENT, SEED_GUESTS, SEED_BUDGET_CATEGORIES } from '../lib/seedData';

describe('Event What-If Engine Service', () => {
  it('does NOT modify original event or budget categories when simulating', () => {
    const originalGuestCount = SEED_EVENT.targetGuestCount;
    const originalBudget = SEED_EVENT.targetBudget;

    const scenario = simulateWhatIfScenario(SEED_EVENT, SEED_GUESTS, SEED_BUDGET_CATEGORIES, {
      deltaGuestCount: 50,
      overrideVenueType: 'home_courtyard',
      deltaDecorPercent: -20,
    });

    // Original event MUST remain untouched
    expect(SEED_EVENT.targetGuestCount).toBe(originalGuestCount);
    expect(SEED_EVENT.targetBudget).toBe(originalBudget);

    // Scenario metrics reflect the proposed changes
    expect(scenario.calculatedMetrics.proposedGuestCount).toBe(originalGuestCount + 50);
    expect(scenario.calculatedMetrics.originalGuestCount).toBe(originalGuestCount);
  });

  it('correctly calculates cost increase and trade-offs when adding 50 guests', () => {
    const scenario = simulateWhatIfScenario(SEED_EVENT, SEED_GUESTS, SEED_BUDGET_CATEGORIES, {
      deltaGuestCount: 50,
    });

    const m = scenario.calculatedMetrics;
    expect(m.proposedGuestCount).toBe(200);
    expect(m.costDifference).toBeGreaterThan(0);
    expect(m.proposedCateringCost).toBeGreaterThan(m.originalCateringCost);
    expect(m.tradeOffSummary.some((t) => t.includes('Adding 50 guests'))).toBe(true);
  });

  it('correctly calculates savings when switching to home courtyard', () => {
    const scenario = simulateWhatIfScenario(SEED_EVENT, SEED_GUESTS, SEED_BUDGET_CATEGORIES, {
      deltaGuestCount: 0,
      overrideVenueType: 'home_courtyard',
    });

    const m = scenario.calculatedMetrics;
    expect(m.proposedVenueCost).toBeLessThan(m.originalVenueCost);
    expect(m.positives.some((p) => p.includes('Eliminating commercial banquet hall rental'))).toBe(true);
  });
});
