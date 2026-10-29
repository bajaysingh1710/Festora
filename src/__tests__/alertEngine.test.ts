import { describe, it, expect } from 'vitest';
import { generateOperationalAlerts } from '../services/alertEngine';
import { SEED_EVENT, SEED_GUESTS, SEED_BUDGET_CATEGORIES, SEED_TASKS } from '../lib/seedData';

describe('Operational Alert Engine', () => {
  it('triggers budget overrun alert when total estimated exceeds target budget', () => {
    // Set budget lower than current estimates (~₹680,000)
    const tightEvent = { ...SEED_EVENT, targetBudget: 400000 };
    const alerts = generateOperationalAlerts(
      tightEvent,
      SEED_GUESTS,
      SEED_BUDGET_CATEGORIES,
      SEED_TASKS
    );

    const budgetAlert = alerts.find((a) => a.id === 'alert-budget-overrun');
    expect(budgetAlert).toBeDefined();
    expect(budgetAlert?.severity).toBe('danger');
    expect(budgetAlert?.message).toContain('exceed your target budget');
  });

  it('triggers pending RSVP reminder alert when pending guests exist', () => {
    const alerts = generateOperationalAlerts(
      SEED_EVENT,
      SEED_GUESTS,
      SEED_BUDGET_CATEGORIES,
      SEED_TASKS
    );

    const rsvpAlert = alerts.find((a) => a.id === 'alert-pending-rsvps');
    expect(rsvpAlert).toBeDefined();
    expect(rsvpAlert?.title).toContain('Unconfirmed Invitations');
  });

  it('triggers critical task alert when uncompleted critical tasks exist', () => {
    const alerts = generateOperationalAlerts(
      SEED_EVENT,
      SEED_GUESTS,
      SEED_BUDGET_CATEGORIES,
      SEED_TASKS
    );

    const taskAlert = alerts.find((a) => a.id === 'alert-critical-tasks');
    expect(taskAlert).toBeDefined();
    expect(taskAlert?.severity).toBe('warning');
  });
});
