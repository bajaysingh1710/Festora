import { describe, it, expect } from 'vitest';
import { calculateItemCost, calculateBudgetSummary } from '../services/budgetCalculator';
import { SEED_BUDGET_CATEGORIES } from '../lib/seedData';
import { BudgetItem } from '../types';

describe('Budget Calculator Service', () => {
  it('calculates fixed cost item correctly regardless of guest count', () => {
    const fixedItem: BudgetItem = {
      id: 'test-fixed',
      categoryId: 'photography',
      name: 'Lead Photographer',
      unitCost: 50000,
      quantity: 1,
      isGuestDependent: false,
      guestMultiplier: 1,
      committedAmount: 20000,
      estimatedTotal: 50000,
    };

    const cost100 = calculateItemCost(fixedItem, 100, 'function_hall');
    const cost200 = calculateItemCost(fixedItem, 200, 'function_hall');

    expect(cost100.estimatedTotal).toBe(50000);
    expect(cost200.estimatedTotal).toBe(50000);
  });

  it('scales guest-dependent item dynamically with guest count', () => {
    const buffetItem: BudgetItem = {
      id: 'test-catering',
      categoryId: 'catering',
      name: 'Dinner Buffet',
      unitCost: 1200,
      quantity: 100,
      isGuestDependent: true,
      guestMultiplier: 1.0,
      committedAmount: 0,
      estimatedTotal: 120000,
    };

    const cost100 = calculateItemCost(buffetItem, 100, 'function_hall');
    const cost150 = calculateItemCost(buffetItem, 150, 'function_hall');
    const cost200 = calculateItemCost(buffetItem, 200, 'function_hall');

    expect(cost100.estimatedTotal).toBe(100 * 1200);
    expect(cost150.estimatedTotal).toBe(150 * 1200);
    expect(cost200.estimatedTotal).toBe(200 * 1200);
  });

  it('applies home courtyard venue discount (waives hall rental)', () => {
    const hallRentalItem: BudgetItem = {
      id: 'test-hall',
      categoryId: 'venue',
      name: 'Ballroom Rental',
      unitCost: 175000,
      quantity: 1,
      isGuestDependent: false,
      guestMultiplier: 1,
      isHomeVenueDiscounted: true,
      homeVenueCostModifier: 0, // 0 = free at home
      committedAmount: 0,
      estimatedTotal: 175000,
    };

    const hallCost = calculateItemCost(hallRentalItem, 150, 'function_hall');
    const homeCost = calculateItemCost(hallRentalItem, 150, 'home_courtyard');

    expect(hallCost.estimatedTotal).toBe(175000);
    expect(homeCost.estimatedTotal).toBe(0);
    expect(homeCost.calculationExplanation).toContain('Waived');
  });

  it('calculates full budget summary and identifies over-budget status', () => {
    const summaryUnder = calculateBudgetSummary(SEED_BUDGET_CATEGORIES, 900000, 150, 'function_hall');
    expect(summaryUnder.isOverBudget).toBe(false);
    expect(summaryUnder.remainingBudget).toBeGreaterThan(0);

    const summaryOver = calculateBudgetSummary(SEED_BUDGET_CATEGORIES, 300000, 150, 'function_hall');
    expect(summaryOver.isOverBudget).toBe(true);
    expect(summaryOver.overrunAmount).toBe(summaryOver.totalEstimated - 300000);
  });
});
