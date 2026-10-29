import { EventDetails, Guest, BudgetCategory, Task, OperationalAlert } from '../types';
import { calculateBudgetSummary } from './budgetCalculator';

/**
 * Calculates operational alerts and warnings deterministically
 * based on live application state.
 */
export function generateOperationalAlerts(
  event: EventDetails,
  guests: Guest[],
  budgetCategories: BudgetCategory[],
  tasks: Task[]
): OperationalAlert[] {
  const alerts: OperationalAlert[] = [];

  // 1. RSVP & Guest Attendance Calculations
  const attendingGuests = guests.filter((g) => g.rsvpStatus === 'attending');
  const pendingGuests = guests.filter((g) => g.rsvpStatus === 'pending');

  const confirmedHeadcount = attendingGuests.reduce((sum, g) => sum + g.partySize, 0);
  const pendingHeadcount = pendingGuests.reduce((sum, g) => sum + g.partySize, 0);
  const expectedTotalHeadcount = confirmedHeadcount + Math.round(pendingHeadcount * 0.7); // 70% projected conversion

  // 2. Budget status
  const budgetSummary = calculateBudgetSummary(
    budgetCategories,
    event.targetBudget,
    event.targetGuestCount,
    event.venue.type
  );

  // ALERT: Budget Overrun
  if (budgetSummary.isOverBudget) {
    alerts.push({
      id: 'alert-budget-overrun',
      type: 'budget',
      severity: 'danger',
      title: 'Budget Target Exceeded',
      message: `Total estimated expenses (₹${budgetSummary.totalEstimated.toLocaleString('en-IN')}) exceed your target budget by ₹${budgetSummary.overrunAmount.toLocaleString('en-IN')}. Consider switching to a home venue or optimizing decor.`,
      actionLabel: 'Open What-If Simulator',
      actionTargetModule: 'what-if',
    });
  }

  // ALERT: Catering Plate Shortage vs Expected/Confirmed Headcount
  const cateringPlateCapacity = event.targetGuestCount + (event.cateringPlateBuffer || 0);
  if (expectedTotalHeadcount > cateringPlateCapacity) {
    const shortfall = expectedTotalHeadcount - cateringPlateCapacity;
    alerts.push({
      id: 'alert-catering-shortfall',
      type: 'catering',
      severity: 'danger',
      title: 'Catering Capacity Shortfall',
      message: `Projected attendance (${expectedTotalHeadcount} guests) exceeds current catering capacity (${cateringPlateCapacity} plates including ${event.cateringPlateBuffer} buffer). Deficit: ${shortfall} plates.`,
      actionLabel: 'Increase Catering Buffer',
      actionTargetModule: 'admin',
    });
  } else if (confirmedHeadcount > event.targetGuestCount) {
    alerts.push({
      id: 'alert-catering-tight',
      type: 'catering',
      severity: 'warning',
      title: 'Confirmed Guests Exceed Base Target',
      message: `Confirmed attendance (${confirmedHeadcount}) has crossed the base 150 target. Buffer plates remaining: ${cateringPlateCapacity - confirmedHeadcount}.`,
      actionLabel: 'Review Catering Numbers',
      actionTargetModule: 'budget',
    });
  }

  // ALERT: Return Gift / Favor Shortfall
  // Gifts are typically given per family/party
  const attendingParties = attendingGuests.length;
  const pendingParties = pendingGuests.length;
  const projectedAttendingParties = attendingParties + Math.round(pendingParties * 0.7);

  // Look up gifts in budget
  const giftItem = budgetCategories
    .flatMap((c) => c.items)
    .find((i) => i.id === 'b-i2' || i.name.toLowerCase().includes('favor') || i.name.toLowerCase().includes('gift'));
  
  const totalGiftBoxes = giftItem ? giftItem.quantity + (event.returnGiftBuffer || 0) : 80;

  if (projectedAttendingParties > totalGiftBoxes) {
    const giftShortfall = projectedAttendingParties - totalGiftBoxes;
    alerts.push({
      id: 'alert-gift-shortfall',
      type: 'gift',
      severity: 'warning',
      title: 'Return Gift Hamper Deficit',
      message: `Projected attending families (${projectedAttendingParties}) exceed prepared gift boxes (${totalGiftBoxes}). Deficit: ${giftShortfall} boxes needed.`,
      actionLabel: 'Update Gift Count',
      actionTargetModule: 'admin',
    });
  }

  // ALERT: Pending RSVPs & Approaching Deadline
  if (pendingGuests.length > 0) {
    alerts.push({
      id: 'alert-pending-rsvps',
      type: 'rsvp',
      severity: pendingGuests.length >= 3 ? 'warning' : 'info',
      title: `${pendingGuests.length} Unconfirmed Invitations`,
      message: `${pendingHeadcount} guests across ${pendingGuests.length} parties have not responded. Send digital WhatsApp reminder passes to confirm final headcount.`,
      actionLabel: 'Manage Guest List',
      actionTargetModule: 'guests',
    });
  }

  // ALERT: Overdue or Critical Tasks
  const today = new Date().toISOString().split('T')[0];
  const pendingTasks = tasks.filter((t) => !t.isCompleted);
  const overdueTasks = pendingTasks.filter((t) => t.deadline < today);
  const criticalTasks = pendingTasks.filter((t) => t.priority === 'critical');

  if (overdueTasks.length > 0) {
    alerts.push({
      id: 'alert-overdue-tasks',
      type: 'task',
      severity: 'danger',
      title: `${overdueTasks.length} Overdue Planning Task${overdueTasks.length > 1 ? 's' : ''}`,
      message: `Tasks including "${overdueTasks[0].title}" have missed their milestone deadlines.`,
      actionLabel: 'View Task Manager',
      actionTargetModule: 'admin',
    });
  } else if (criticalTasks.length > 0) {
    alerts.push({
      id: 'alert-critical-tasks',
      type: 'task',
      severity: 'warning',
      title: `${criticalTasks.length} Critical Priority Task${criticalTasks.length > 1 ? 's' : ''}`,
      message: `Immediate action required: "${criticalTasks[0].title}" assigned to ${criticalTasks[0].assignedTo}.`,
      actionLabel: 'Review Tasks',
      actionTargetModule: 'admin',
    });
  }

  return alerts;
}
