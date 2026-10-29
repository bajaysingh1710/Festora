import { BudgetCategory, BudgetItem, VenueType } from '../types';

export interface CalculatedCategoryTotal {
  category: BudgetCategory;
  estimatedTotal: number;
  committedTotal: number;
  itemCount: number;
  percentageOfTotal: number;
  isOverTarget: boolean;
}

export interface BudgetSummary {
  targetBudget: number;
  totalEstimated: number;
  totalCommitted: number;
  remainingBudget: number;
  percentSpent: number;
  isOverBudget: boolean;
  overrunAmount: number;
  venueType: VenueType;
  effectiveGuestCount: number;
  categoryTotals: Record<string, CalculatedCategoryTotal>;
}

/**
 * Computes individual item estimated cost considering guest count scaling
 * and venue type modifications (e.g., home courtyard vs function hall)
 */
export function calculateItemCost(
  item: BudgetItem,
  guestCount: number,
  venueType: VenueType
): { estimatedTotal: number; calculationExplanation: string } {
  let quantity = item.quantity;
  let explanation = `${quantity} × ₹${item.unitCost.toLocaleString('en-IN')}`;

  // If item is guest-dependent, scale quantity dynamically with guest count
  if (item.isGuestDependent) {
    quantity = Math.max(1, Math.round(guestCount * item.guestMultiplier));
    explanation = `Scaled for ${guestCount} guests (${quantity} units @ ₹${item.unitCost.toLocaleString('en-IN')})`;
  }

  let total = quantity * item.unitCost;

  // If venue is home/courtyard and item has home venue discount/modifier
  if (venueType === 'home_courtyard' && item.isHomeVenueDiscounted) {
    const modifier = item.homeVenueCostModifier ?? 0;
    if (modifier === 0) {
      total = 0;
      explanation = 'Waived (Hosted at home courtyard)';
    } else {
      total = Math.round(total * modifier);
      explanation += ` [Home venue adjustment: ${(modifier * 100).toFixed(0)}%]`;
    }
  }

  return { estimatedTotal: total, calculationExplanation: explanation };
}

/**
 * Calculates complete budget summary across all 7 categories
 */
export function calculateBudgetSummary(
  categories: BudgetCategory[],
  targetBudget: number,
  guestCount: number,
  venueType: VenueType
): BudgetSummary {
  let totalEstimated = 0;
  let totalCommitted = 0;
  const categoryTotals: Record<string, CalculatedCategoryTotal> = {};

  categories.forEach((cat) => {
    let catEstimated = 0;
    let catCommitted = 0;

    cat.items.forEach((item) => {
      const { estimatedTotal } = calculateItemCost(item, guestCount, venueType);
      catEstimated += estimatedTotal;
      catCommitted += item.committedAmount;
    });

    totalEstimated += catEstimated;
    totalCommitted += catCommitted;

    categoryTotals[cat.id] = {
      category: cat,
      estimatedTotal: catEstimated,
      committedTotal: catCommitted,
      itemCount: cat.items.length,
      percentageOfTotal: 0, // calculated below
      isOverTarget: false,
    };
  });

  // Calculate percentage shares and target variances
  categories.forEach((cat) => {
    const entry = categoryTotals[cat.id];
    if (entry) {
      entry.percentageOfTotal = totalEstimated > 0 ? (entry.estimatedTotal / totalEstimated) * 100 : 0;
      entry.isOverTarget = entry.percentageOfTotal > cat.targetPercent + 5; // >5% over target allocation
    }
  });

  const remainingBudget = targetBudget - totalEstimated;
  const isOverBudget = totalEstimated > targetBudget;
  const overrunAmount = isOverBudget ? totalEstimated - targetBudget : 0;
  const percentSpent = targetBudget > 0 ? (totalEstimated / targetBudget) * 100 : 0;

  return {
    targetBudget,
    totalEstimated,
    totalCommitted,
    remainingBudget,
    percentSpent,
    isOverBudget,
    overrunAmount,
    venueType,
    effectiveGuestCount: guestCount,
    categoryTotals,
  };
}
