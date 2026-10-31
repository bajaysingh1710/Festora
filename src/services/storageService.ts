import {
  EventDetails,
  Guest,
  BudgetCategory,
  ThemeConcept,
  Task,
  EventSummary,
  DecorConceptItem,
  VenuePhoto,
  CopilotMessage,
} from '../types';
import {
  SEED_EVENT,
  SEED_GUESTS,
  SEED_BUDGET_CATEGORIES,
  SEED_THEMES,
  SEED_TASKS,
} from '../lib/seedData';
import {
  getDefaultBudgetCategories,
  getDefaultThemesForEventType,
  getDefaultTasksForEventType,
} from './eventDefaults';
import { logInfo, logError } from '../lib/logger';

const GLOBAL_KEYS = {
  EVENT_LIST: 'festora_event_list_v2',
  ACTIVE_EVENT_ID: 'festora_active_event_id_v2',
  AI_SETTINGS: 'festora_ai_settings_v2',
};

function eventKey(prefix: string, eventId: string): string {
  return `festora_${prefix}_${eventId}`;
}

export class StorageService {
  // --- Event List & Active Selection ---
  static listEvents(): EventSummary[] {
    try {
      const data = localStorage.getItem(GLOBAL_KEYS.EVENT_LIST);
      if (data) {
        return JSON.parse(data);
      }
    } catch (err) {
      logError('Failed to read event list from storage', { err });
    }
    return [];
  }

  static saveEventList(list: EventSummary[]): void {
    try {
      localStorage.setItem(GLOBAL_KEYS.EVENT_LIST, JSON.stringify(list));
    } catch (err) {
      logError('Failed to save event list', { err });
    }
  }

  static getActiveEventId(): string | null {
    try {
      return localStorage.getItem(GLOBAL_KEYS.ACTIVE_EVENT_ID);
    } catch {
      return null;
    }
  }

  static setActiveEventId(id: string | null): void {
    try {
      if (id) {
        localStorage.setItem(GLOBAL_KEYS.ACTIVE_EVENT_ID, id);
      } else {
        localStorage.removeItem(GLOBAL_KEYS.ACTIVE_EVENT_ID);
      }
    } catch (err) {
      logError('Failed to set active event id', { err });
    }
  }

  // --- Event Details ---
  static getEvent(eventId?: string): EventDetails | null {
    const id = eventId || this.getActiveEventId();
    if (!id) return null;

    try {
      const data = localStorage.getItem(eventKey('event', id));
      if (data) return JSON.parse(data);
    } catch (err) {
      logError('Failed to read event from storage', { id, err });
    }
    return null;
  }

  static saveEvent(event: EventDetails): void {
    try {
      localStorage.setItem(eventKey('event', event.id), JSON.stringify(event));

      // Update or add in event list
      const list = this.listEvents();
      const existingIdx = list.findIndex((e) => e.id === event.id);
      const summary: EventSummary = {
        id: event.id,
        title: event.title,
        eventType: event.eventType,
        date: event.date,
        time: event.time,
        city: event.venue.city || 'Local',
        venueName: event.venue.name || 'Selected Venue',
        targetGuestCount: event.targetGuestCount,
        targetBudget: event.targetBudget,
        activeThemeId: event.activeThemeId,
        createdAt: event.createdAt,
        updatedAt: new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        list[existingIdx] = summary;
      } else {
        list.push(summary);
      }
      this.saveEventList(list);
      logInfo('Saved event state', { id: event.id });
    } catch (err) {
      logError('Failed to save event to storage', { err });
    }
  }

  // --- Create Event ---
  static createEvent(details: Partial<EventDetails>): EventDetails {
    const id = details.id || `event-${Date.now()}`;
    const eventType = details.eventType || 'birthday';
    const targetBudget = details.targetBudget || 200000;
    const targetGuestCount = details.targetGuestCount || 100;

    const newEvent: EventDetails = {
      id,
      title: details.title || `New ${eventType.toUpperCase()} Celebration`,
      tagline: details.tagline || 'A memorable milestone lovingly crafted',
      eventType,
      date: details.date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      time: details.time || '18:00',
      venue: {
        name: details.venue?.name || 'Grand Celebration Hall',
        type: details.venue?.type || 'function_hall',
        address: details.venue?.address || 'City Center Main Road',
        city: details.venue?.city || 'Bengaluru',
        capacity: Math.round(targetGuestCount * 1.3),
        directionsUrl: details.venue?.directionsUrl || 'https://maps.google.com',
        notes: details.venue?.notes || 'Ample guest parking and valet available.',
      },
      targetGuestCount,
      targetBudget,
      activeThemeId: details.activeThemeId || getDefaultThemesForEventType(eventType)[0].id,
      dressCode: details.dressCode || 'Smart Festive Attire',
      story: details.story || 'Bringing friends, family, and loved ones together for an unforgettable milestone.',
      organizer: details.organizer || {
        name: 'Event Host',
        email: 'host@festora.in',
        phone: '+91 98765 00000',
        role: 'Host & Lead Planner',
      },
      cateringPlateBuffer: details.cateringPlateBuffer ?? 15,
      returnGiftBuffer: details.returnGiftBuffer ?? 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save event details
    this.saveEvent(newEvent);
    this.setActiveEventId(id);

    // Initialize isolated default state for this event
    const defaultBudgetCats = getDefaultBudgetCategories(eventType, targetBudget, targetGuestCount);
    this.saveBudgetCategories(id, defaultBudgetCats);

    const defaultThemes = getDefaultThemesForEventType(eventType);
    this.saveThemes(id, defaultThemes);

    const defaultTasks = getDefaultTasksForEventType(eventType, newEvent.date);
    this.saveTasks(id, defaultTasks);

    this.saveGuests(id, []);
    this.saveDecorConcepts(id, []);
    this.saveVenuePhotos(id, []);
    this.saveCopilotMessages(id, []);

    logInfo('Created new event workspace', { id, eventType });
    return newEvent;
  }

  // --- Duplicate Event ---
  static duplicateEvent(sourceEventId: string): EventDetails | null {
    const sourceEvent = this.getEvent(sourceEventId);
    if (!sourceEvent) return null;

    const newId = `event-${Date.now()}`;
    const duplicatedEvent: EventDetails = {
      ...sourceEvent,
      id: newId,
      title: `${sourceEvent.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.saveEvent(duplicatedEvent);
    this.saveGuests(newId, this.getGuests(sourceEventId));
    this.saveBudgetCategories(newId, this.getBudgetCategories(sourceEventId));
    this.saveThemes(newId, this.getThemes(sourceEventId));
    this.saveTasks(newId, this.getTasks(sourceEventId));
    this.saveDecorConcepts(newId, this.getDecorConcepts(sourceEventId));
    this.saveVenuePhotos(newId, this.getVenuePhotos(sourceEventId));
    this.setActiveEventId(newId);

    return duplicatedEvent;
  }

  // --- Delete Event ---
  static deleteEvent(eventId: string): void {
    try {
      localStorage.removeItem(eventKey('event', eventId));
      localStorage.removeItem(eventKey('guests', eventId));
      localStorage.removeItem(eventKey('budget', eventId));
      localStorage.removeItem(eventKey('themes', eventId));
      localStorage.removeItem(eventKey('tasks', eventId));
      localStorage.removeItem(eventKey('decor_concepts', eventId));
      localStorage.removeItem(eventKey('venue_photos', eventId));
      localStorage.removeItem(eventKey('copilot_msgs', eventId));

      const list = this.listEvents().filter((e) => e.id !== eventId);
      this.saveEventList(list);

      if (this.getActiveEventId() === eventId) {
        const nextId = list.length > 0 ? list[0].id : null;
        this.setActiveEventId(nextId);
      }
      logInfo('Deleted event', { eventId });
    } catch (err) {
      logError('Failed to delete event', { eventId, err });
    }
  }

  // --- Guests ---
  static getGuests(eventId?: string): Guest[] {
    const id = eventId || this.getActiveEventId();
    if (!id) return [];

    try {
      const data = localStorage.getItem(eventKey('guests', id));
      if (data) return JSON.parse(data);
    } catch (err) {
      logError('Failed to read guests', { id, err });
    }
    return [];
  }

  static saveGuests(eventId: string, guests: Guest[]): void {
    try {
      localStorage.setItem(eventKey('guests', eventId), JSON.stringify(guests));
    } catch (err) {
      logError('Failed to save guests', { eventId, err });
    }
  }

  // --- Budget Categories ---
  static getBudgetCategories(eventId?: string): BudgetCategory[] {
    const id = eventId || this.getActiveEventId();
    if (!id) return [];

    try {
      const data = localStorage.getItem(eventKey('budget', id));
      if (data) return JSON.parse(data);
    } catch (err) {
      logError('Failed to read budget', { id, err });
    }
    return [];
  }

  static saveBudgetCategories(eventId: string, categories: BudgetCategory[]): void {
    try {
      localStorage.setItem(eventKey('budget', eventId), JSON.stringify(categories));
    } catch (err) {
      logError('Failed to save budget', { eventId, err });
    }
  }

  // --- Themes ---
  static getThemes(eventId?: string): ThemeConcept[] {
    const id = eventId || this.getActiveEventId();
    if (!id) return [];

    try {
      const data = localStorage.getItem(eventKey('themes', id));
      if (data) return JSON.parse(data);
    } catch (err) {
      logError('Failed to read themes', { id, err });
    }
    return [];
  }

  static saveThemes(eventId: string, themes: ThemeConcept[]): void {
    try {
      localStorage.setItem(eventKey('themes', eventId), JSON.stringify(themes));
    } catch (err) {
      logError('Failed to save themes', { eventId, err });
    }
  }

  // --- Tasks ---
  static getTasks(eventId?: string): Task[] {
    const id = eventId || this.getActiveEventId();
    if (!id) return [];

    try {
      const data = localStorage.getItem(eventKey('tasks', id));
      if (data) return JSON.parse(data);
    } catch (err) {
      logError('Failed to read tasks', { id, err });
    }
    return [];
  }

  static saveTasks(eventId: string, tasks: Task[]): void {
    try {
      localStorage.setItem(eventKey('tasks', eventId), JSON.stringify(tasks));
    } catch (err) {
      logError('Failed to save tasks', { eventId, err });
    }
  }

  // --- Decor Concepts ---
  static getDecorConcepts(eventId?: string): DecorConceptItem[] {
    const id = eventId || this.getActiveEventId();
    if (!id) return [];

    try {
      const data = localStorage.getItem(eventKey('decor_concepts', id));
      if (data) return JSON.parse(data);
    } catch (err) {
      logError('Failed to read decor concepts', { id, err });
    }
    return [];
  }

  static saveDecorConcepts(eventId: string, concepts: DecorConceptItem[]): void {
    try {
      localStorage.setItem(eventKey('decor_concepts', eventId), JSON.stringify(concepts));
    } catch (err) {
      logError('Failed to save decor concepts', { eventId, err });
    }
  }

  // --- Venue Photos ---
  static getVenuePhotos(eventId?: string): VenuePhoto[] {
    const id = eventId || this.getActiveEventId();
    if (!id) return [];

    try {
      const data = localStorage.getItem(eventKey('venue_photos', id));
      if (data) return JSON.parse(data);
    } catch (err) {
      logError('Failed to read venue photos', { id, err });
    }
    return [];
  }

  static saveVenuePhotos(eventId: string, photos: VenuePhoto[]): void {
    try {
      localStorage.setItem(eventKey('venue_photos', eventId), JSON.stringify(photos));
    } catch (err) {
      logError('Failed to save venue photos', { eventId, err });
    }
  }

  // --- Copilot Messages ---
  static getCopilotMessages(eventId?: string): CopilotMessage[] {
    const id = eventId || this.getActiveEventId();
    if (!id) return [];

    try {
      const data = localStorage.getItem(eventKey('copilot_msgs', id));
      if (data) return JSON.parse(data);
    } catch (err) {
      logError('Failed to read copilot messages', { id, err });
    }
    return [];
  }

  static saveCopilotMessages(eventId: string, msgs: CopilotMessage[]): void {
    try {
      localStorage.setItem(eventKey('copilot_msgs', eventId), JSON.stringify(msgs));
    } catch (err) {
      logError('Failed to save copilot messages', { eventId, err });
    }
  }

  // --- AI Settings (Gemini API key & model) ---
  static getAISettings(): { apiKey: string; model: string } {
    try {
      const envKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      const data = localStorage.getItem(GLOBAL_KEYS.AI_SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          apiKey: parsed.apiKey || envKey,
          model: parsed.model || 'gemini-2.0-flash',
        };
      }
      return { apiKey: envKey, model: 'gemini-2.0-flash' };
    } catch {
      return { apiKey: '', model: 'gemini-2.0-flash' };
    }
  }

  static saveAISettings(settings: { apiKey: string; model: string }): void {
    try {
      localStorage.setItem(GLOBAL_KEYS.AI_SETTINGS, JSON.stringify(settings));
    } catch (err) {
      logError('Failed to save AI settings', { err });
    }
  }

  // --- Load Sample Wedding (Explicit User Action Only) ---
  static loadSampleWedding(): EventDetails {
    const sampleEvent = {
      ...SEED_EVENT,
      id: 'event-sample-wedding-2026',
      title: "Sample: Aanya & Kabir's Sangeet & Engagement Celebration",
    };
    this.saveEvent(sampleEvent);
    this.saveGuests(sampleEvent.id, SEED_GUESTS);
    this.saveBudgetCategories(sampleEvent.id, SEED_BUDGET_CATEGORIES);
    this.saveThemes(sampleEvent.id, SEED_THEMES);
    this.saveTasks(sampleEvent.id, SEED_TASKS);
    this.setActiveEventId(sampleEvent.id);
    return sampleEvent;
  }

  // --- Reset demo fallback ---
  static resetToDemoSeed(): EventDetails {
    return this.loadSampleWedding();
  }
}
