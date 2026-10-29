import { EventDetails, Guest, BudgetCategory, ThemeConcept, Task } from '../types';
import { SEED_EVENT, SEED_GUESTS, SEED_BUDGET_CATEGORIES, SEED_THEMES, SEED_TASKS } from '../lib/seedData';
import { logInfo, logError } from '../lib/logger';

const KEYS = {
  EVENT: 'festora_event_v1',
  GUESTS: 'festora_guests_v1',
  BUDGET: 'festora_budget_v1',
  THEMES: 'festora_themes_v1',
  TASKS: 'festora_tasks_v1',
};

export class StorageService {
  // --- Event ---
  static getEvent(): EventDetails {
    try {
      const data = localStorage.getItem(KEYS.EVENT);
      if (data) return JSON.parse(data);
    } catch (err) {
      logError('Failed to read event from storage', { err });
    }
    this.saveEvent(SEED_EVENT);
    return SEED_EVENT;
  }

  static saveEvent(event: EventDetails): void {
    try {
      localStorage.setItem(KEYS.EVENT, JSON.stringify(event));
      logInfo('Saved event state', { id: event.id });
    } catch (err) {
      logError('Failed to save event to storage', { err });
    }
  }

  // --- Guests ---
  static getGuests(): Guest[] {
    try {
      const data = localStorage.getItem(KEYS.GUESTS);
      if (data) return JSON.parse(data);
    } catch (err) {
      logError('Failed to read guests from storage', { err });
    }
    this.saveGuests(SEED_GUESTS);
    return SEED_GUESTS;
  }

  static saveGuests(guests: Guest[]): void {
    try {
      localStorage.setItem(KEYS.GUESTS, JSON.stringify(guests));
      logInfo('Saved guests state', { count: guests.length });
    } catch (err) {
      logError('Failed to save guests to storage', { err });
    }
  }

  // --- Budget Categories ---
  static getBudgetCategories(): BudgetCategory[] {
    try {
      const data = localStorage.getItem(KEYS.BUDGET);
      if (data) return JSON.parse(data);
    } catch (err) {
      logError('Failed to read budget from storage', { err });
    }
    this.saveBudgetCategories(SEED_BUDGET_CATEGORIES);
    return SEED_BUDGET_CATEGORIES;
  }

  static saveBudgetCategories(categories: BudgetCategory[]): void {
    try {
      localStorage.setItem(KEYS.BUDGET, JSON.stringify(categories));
      logInfo('Saved budget categories state', { count: categories.length });
    } catch (err) {
      logError('Failed to save budget to storage', { err });
    }
  }

  // --- Themes ---
  static getThemes(): ThemeConcept[] {
    try {
      const data = localStorage.getItem(KEYS.THEMES);
      if (data) return JSON.parse(data);
    } catch (err) {
      logError('Failed to read themes from storage', { err });
    }
    this.saveThemes(SEED_THEMES);
    return SEED_THEMES;
  }

  static saveThemes(themes: ThemeConcept[]): void {
    try {
      localStorage.setItem(KEYS.THEMES, JSON.stringify(themes));
    } catch (err) {
      logError('Failed to save themes to storage', { err });
    }
  }

  // --- Tasks ---
  static getTasks(): Task[] {
    try {
      const data = localStorage.getItem(KEYS.TASKS);
      if (data) return JSON.parse(data);
    } catch (err) {
      logError('Failed to read tasks from storage', { err });
    }
    this.saveTasks(SEED_TASKS);
    return SEED_TASKS;
  }

  static saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
      logInfo('Saved tasks state', { count: tasks.length });
    } catch (err) {
      logError('Failed to save tasks to storage', { err });
    }
  }

  // --- Reset All to Demo Seed ---
  static resetAll(): {
    event: EventDetails;
    guests: Guest[];
    budgetCategories: BudgetCategory[];
    themes: ThemeConcept[];
    tasks: Task[];
  } {
    this.saveEvent(SEED_EVENT);
    this.saveGuests(SEED_GUESTS);
    this.saveBudgetCategories(SEED_BUDGET_CATEGORIES);
    this.saveThemes(SEED_THEMES);
    this.saveTasks(SEED_TASKS);
    return {
      event: SEED_EVENT,
      guests: SEED_GUESTS,
      budgetCategories: SEED_BUDGET_CATEGORIES,
      themes: SEED_THEMES,
      tasks: SEED_TASKS,
    };
  }
}
