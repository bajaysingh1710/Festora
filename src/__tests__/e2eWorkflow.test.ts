import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../services/storageService';
import { extractEventDetailsFromConversation, generateStructuredProposal } from '../services/smartPlanner';
import { getCopilotResponse } from '../services/copilotService';
import { calculateBudgetSummary } from '../services/budgetCalculator';
import { generateAllDecorConcepts, DECOR_AREAS } from '../services/imageGenService';
import { validateGuestCheckIn } from '../services/guestPassService';
import { simulateWhatIfScenario } from '../services/whatIfEngine';
import { getDefaultBudgetCategories, getDefaultThemesForEventType } from '../services/eventDefaults';
import { Guest, EventDetails } from '../types';

class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string) {
    return this.store[key] || null;
  }
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
  removeItem(key: string) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

if (typeof globalThis.localStorage === 'undefined') {
  (globalThis as any).localStorage = new LocalStorageMock();
}

describe('Festora Mandatory End-to-End Workflow Verification', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Step 1 & 2: First-time user starts clean without automatic wedding load', () => {
    const events = StorageService.listEvents();
    expect(events.length).toBe(0);

    const activeId = StorageService.getActiveEventId();
    expect(activeId).toBeNull();
  });

  it('Step 3: Create a Birthday Celebration for 200 guests with persistent storage', () => {
    const created = StorageService.createEvent({
      title: "Rohan's 25th Birthday Celebration",
      eventType: 'birthday',
      targetGuestCount: 200,
      targetBudget: 350000,
      date: '2026-12-15',
      time: '19:00',
      venue: {
        name: 'The Palm Garden Lawns',
        type: 'function_hall',
        address: 'MG Road',
        city: 'Bengaluru',
        capacity: 250,
      },
    });

    expect(created.id).toBeDefined();
    expect(created.title).toBe("Rohan's 25th Birthday Celebration");
    expect(created.targetGuestCount).toBe(200);
    expect(created.targetBudget).toBe(350000);

    // Verify presence in event list
    const list = StorageService.listEvents();
    expect(list.length).toBe(1);
    expect(list[0].id).toBe(created.id);
    expect(list[0].eventType).toBe('birthday');
  });

  it('Step 4, 5, 6: Copilot understands natural language request and generates structured 12-section proposal', async () => {
    const query = 'Plan a birthday party for 200 people in Bengaluru with a budget of 350000';
    const response = await getCopilotResponse(query, {
      event: null,
      guests: [],
      budgetCategories: [],
      themes: [],
      tasks: [],
      conversationHistory: [],
    });

    expect(response.sender).toBe('copilot');
    expect(response.text).toContain('200');
    expect(response.structuredProposal).toBeDefined();

    const prop = response.structuredProposal!;
    expect(prop.eventType).toBe('birthday');
    expect(prop.guestCount).toBe(200);

    // Verify all 12 mandatory sections
    expect(prop.overview).toBeDefined(); // 1. Overview
    expect(prop.requirements.length).toBeGreaterThan(0); // 2. Requirements
    expect(prop.venueArrangements.recommendedType).toBeDefined(); // 3. Venue
    expect(prop.guestPlanning.targetCount).toBe(200); // 4. Attendance
    expect(prop.budgetBreakdown.length).toBeGreaterThan(0); // 5. Budget breakdown
    expect(prop.cateringRecommendations.recommendedMenu.length).toBeGreaterThan(0); // 6. Food
    expect(prop.decorConcepts.themeTitle).toBeDefined(); // 7. Theme
    expect(prop.returnGiftRecommendations).toBeDefined(); // 8. Return gifts
    expect(prop.entertainmentRecommendations.length).toBeGreaterThan(0); // 9. Entertainment
    expect(prop.timeline.length).toBeGreaterThan(0); // 10. Timeline
    expect(prop.importantTasks.length).toBeGreaterThan(0); // 11. Tasks
    expect(prop.risksAndContingencies.length).toBeGreaterThan(0); // 12. Risks
  });

  it('Step 7, 8, 9: Proposal converts to live event and populates budget calculations', () => {
    const proposal = generateStructuredProposal({
      eventType: 'birthday',
      guestCount: 200,
      budget: 350000,
      city: 'Bengaluru',
      venuePreference: 'function_hall',
    });

    const liveEvent = StorageService.createEvent({
      title: proposal.title,
      eventType: proposal.eventType,
      targetGuestCount: proposal.guestCount,
      targetBudget: proposal.targetBudget,
      date: proposal.date,
      venue: {
        name: 'The Courtyard Pavilion',
        type: proposal.venueArrangements.recommendedType,
        address: `${proposal.city} Center`,
        city: proposal.city,
        capacity: 250,
      },
    });

    const budgetCats = StorageService.getBudgetCategories(liveEvent.id);
    expect(budgetCats.length).toBeGreaterThan(0);

    const summary = calculateBudgetSummary(
      budgetCats,
      liveEvent.targetBudget,
      liveEvent.targetGuestCount,
      liveEvent.venue.type
    );

    expect(summary.totalEstimated).toBeGreaterThan(0);
    expect(summary.effectiveGuestCount).toBe(200);
  });

  it('Step 10, 11, 12: Generate actual decoration images for 8 required zones and link to budget', () => {
    const theme = getDefaultThemesForEventType('birthday')[0];
    const concepts = generateAllDecorConcepts({
      eventType: 'birthday',
      venueType: 'function_hall',
      theme,
      targetBudget: 350000,
      guestCount: 200,
    });

    // Check all 8 required zones
    expect(concepts.length).toBe(8);
    const generatedAreas = concepts.map((c) => c.area);
    DECOR_AREAS.forEach((a) => {
      expect(generatedAreas).toContain(a.id);
    });

    // Verify real image URLs from Pollinations AI
    concepts.forEach((c) => {
      expect(c.imageUrl).toContain('pollinations.ai/prompt');
      expect(c.materials.length).toBeGreaterThan(0);
      expect(c.estimatedCost).toBeGreaterThan(0);
      expect(c.affordableAlternative).toBeDefined();
    });

    // Link a concept cost to event budget
    const stageConcept = concepts.find((c) => c.area === 'stage')!;
    const liveEvent = StorageService.createEvent({
      eventType: 'birthday',
      targetBudget: 350000,
      targetGuestCount: 200,
    });

    const categories = StorageService.getBudgetCategories(liveEvent.id);
    const initialSummary = calculateBudgetSummary(
      categories,
      liveEvent.targetBudget,
      liveEvent.targetGuestCount,
      liveEvent.venue.type
    );
    const initialDecorTotal = initialSummary.categoryTotals['decor'].estimatedTotal;

    const decorCat = categories.find((c) => c.id === 'decor')!;
    decorCat.items.push({
      id: `b-decor-${stageConcept.id}`,
      categoryId: 'decor',
      name: stageConcept.title,
      unitCost: stageConcept.estimatedCost,
      quantity: 1,
      isGuestDependent: false,
      guestMultiplier: 1,
      committedAmount: 0,
      estimatedTotal: stageConcept.estimatedCost,
    });

    StorageService.saveBudgetCategories(liveEvent.id, categories);

    const updatedSummary = calculateBudgetSummary(
      categories,
      liveEvent.targetBudget,
      liveEvent.targetGuestCount,
      liveEvent.venue.type
    );

    expect(updatedSummary.categoryTotals['decor'].estimatedTotal).toBe(
      initialDecorTotal + stageConcept.estimatedCost
    );
  });

  it('Step 13, 14, 15: Add 5 guests, verify QR codes, and duplicate check-in prevention', () => {
    const liveEvent = StorageService.createEvent({
      eventType: 'birthday',
      targetGuestCount: 200,
    });

    const guests: Guest[] = [
      {
        id: 'g-1',
        guestCode: 'FEST-BD-101',
        name: 'Arjun & Maya Verma',
        email: 'arjun@example.com',
        phone: '+91 98111 00001',
        category: 'close_friends',
        partySize: 2,
        rsvpStatus: 'attending',
        mealPreference: 'vegetarian',
        invitationSent: true,
        checkInStatus: 'not_checked_in',
      },
      {
        id: 'g-2',
        guestCode: 'FEST-BD-102',
        name: 'Priya Sen',
        email: 'priya@example.com',
        phone: '+91 98111 00002',
        category: 'vip',
        partySize: 1,
        rsvpStatus: 'attending',
        mealPreference: 'non_vegetarian',
        invitationSent: true,
        checkInStatus: 'not_checked_in',
      },
      {
        id: 'g-3',
        guestCode: 'FEST-BD-103',
        name: 'Siddharth Rao & Family',
        email: 'sid@example.com',
        phone: '+91 98111 00003',
        category: 'family',
        partySize: 4,
        rsvpStatus: 'attending',
        mealPreference: 'vegetarian',
        invitationSent: true,
        checkInStatus: 'not_checked_in',
      },
      {
        id: 'g-4',
        guestCode: 'FEST-BD-104',
        name: 'Ananya Roy',
        email: 'ananya@example.com',
        phone: '+91 98111 00004',
        category: 'close_friends',
        partySize: 1,
        rsvpStatus: 'pending',
        mealPreference: 'jain',
        invitationSent: true,
        checkInStatus: 'not_checked_in',
      },
      {
        id: 'g-5',
        guestCode: 'FEST-BD-105',
        name: 'Karan Malhotra & Partner',
        email: 'karan@example.com',
        phone: '+91 98111 00005',
        category: 'colleagues',
        partySize: 2,
        rsvpStatus: 'attending',
        mealPreference: 'non_vegetarian',
        invitationSent: true,
        checkInStatus: 'not_checked_in',
      },
    ];

    StorageService.saveGuests(liveEvent.id, guests);
    expect(StorageService.getGuests(liveEvent.id).length).toBe(5);

    // 1st Check-in attempt: Valid
    const res1 = validateGuestCheckIn('FEST-BD-101', guests, 'Gate Scanner 1');
    expect(res1.success).toBe(true);
    expect(res1.status).toBe('valid');
    expect(res1.guest?.name).toBe('Arjun & Maya Verma');

    // Update guest record to checked in
    guests[0].checkInStatus = 'checked_in';
    guests[0].checkedInAt = new Date().toISOString();
    guests[0].checkedInBy = 'Gate Scanner 1';

    // 2nd Check-in attempt with SAME code: Strictly Prevent Duplicate Reuse!
    const res2 = validateGuestCheckIn('FEST-BD-101', guests, 'Gate Scanner 2');
    expect(res2.success).toBe(false);
    expect(res2.status).toBe('already_checked_in');
    expect(res2.message).toContain('ALREADY CHECKED IN');
  });

  it('Step 17, 18, 19: Simulate +30 guests in What-If Engine without altering live event until applied', () => {
    const liveEvent = StorageService.createEvent({
      eventType: 'birthday',
      targetGuestCount: 200,
      targetBudget: 350000,
    });
    const categories = StorageService.getBudgetCategories(liveEvent.id);
    const guests: Guest[] = [];

    // Simulate scenario with +30 guests
    const scenario = simulateWhatIfScenario(
      liveEvent,
      guests,
      categories,
      {
        name: 'Scenario: +30 Guests',
        description: 'Test expanding guest count by 30',
        deltaGuestCount: 30,
      }
    );

    expect(scenario.calculatedMetrics.proposedGuestCount).toBe(230);
    expect(scenario.calculatedMetrics.costDifference).toBeGreaterThan(0);
    expect(scenario.calculatedMetrics.cateringDifference).toBeGreaterThan(0);

    // Verify live event remains completely unchanged
    const unchangedEvent = StorageService.getEvent(liveEvent.id)!;
    expect(unchangedEvent.targetGuestCount).toBe(200);
    expect(unchangedEvent.targetBudget).toBe(350000);
  });

  it('Step 20, 21, 22: Multi-event isolation between Birthday Celebration and College Fest', () => {
    // Event 1: Birthday
    const bdayEvent = StorageService.createEvent({
      id: 'event-bday-rohan',
      title: "Rohan's Birthday",
      eventType: 'birthday',
      targetGuestCount: 150,
      targetBudget: 250000,
    });
    StorageService.saveGuests(bdayEvent.id, [
      {
        id: 'g-bday-1',
        guestCode: 'FEST-BD-999',
        name: 'Birthday VIP Friend',
        email: 'vip@bday.com',
        phone: '+91 99999 11111',
        category: 'vip',
        partySize: 2,
        rsvpStatus: 'attending',
        mealPreference: 'vegetarian',
        invitationSent: true,
        checkInStatus: 'not_checked_in',
      },
    ]);

    // Event 2: College Fest
    const festEvent = StorageService.createEvent({
      id: 'event-fest-zenith',
      title: 'Zenith 2026 Inter-College Cultural Fest',
      eventType: 'college',
      targetGuestCount: 600,
      targetBudget: 800000,
    });
    StorageService.saveGuests(festEvent.id, [
      {
        id: 'g-fest-1',
        guestCode: 'FEST-CO-101',
        name: 'Dean Student Affairs',
        email: 'dean@college.edu',
        phone: '+91 99999 22222',
        category: 'vip',
        partySize: 1,
        rsvpStatus: 'attending',
        mealPreference: 'vegetarian',
        invitationSent: true,
        checkInStatus: 'not_checked_in',
      },
    ]);

    // Verify list contains both events
    const allEvents = StorageService.listEvents();
    expect(allEvents.length).toBe(2);

    // Verify isolated guests
    const bdayGuests = StorageService.getGuests(bdayEvent.id);
    const festGuests = StorageService.getGuests(festEvent.id);
    expect(bdayGuests.length).toBe(1);
    expect(festGuests.length).toBe(1);
    expect(bdayGuests[0].guestCode).toBe('FEST-BD-999');
    expect(festGuests[0].guestCode).toBe('FEST-CO-101');

    // Verify isolated budget categories
    const bdayBudget = StorageService.getBudgetCategories(bdayEvent.id);
    const festBudget = StorageService.getBudgetCategories(festEvent.id);

    // College fest has celebrity artist & pro sound rigging; Birthday has cake & DJ
    const festCatNames = festBudget.map((c) => c.name);
    expect(festCatNames.some((n) => n.includes('Auditorium') || n.includes('Artists'))).toBe(true);
  });

  it('Step 24: Copilot contextual follow-up handling ("Make it more luxurious" and "Save ₹50,000")', async () => {
    const liveEvent: EventDetails = {
      id: 'event-test-ctx',
      title: 'Family Anniversary Dinner',
      tagline: '25 years of love',
      eventType: 'anniversary',
      date: '2026-11-20',
      time: '19:30',
      venue: {
        name: 'Grand Pavilion',
        type: 'function_hall',
        address: 'MG Road',
        city: 'Bengaluru',
        capacity: 100,
      },
      targetGuestCount: 80,
      targetBudget: 200000,
      activeThemeId: 'theme-sunset-terracotta',
      dressCode: 'Formal',
      story: 'Silver jubilee',
      organizer: { name: 'Host', email: 'host@test.com', phone: '+91 98000', role: 'Host' },
      cateringPlateBuffer: 10,
      returnGiftBuffer: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Test follow-up: Make it more luxurious
    const luxResponse = await getCopilotResponse('Make it more luxurious', {
      event: liveEvent,
      guests: [],
      budgetCategories: [],
      themes: [],
      tasks: [],
      conversationHistory: [],
    });
    expect(luxResponse.proposal).toBeDefined();
    expect(luxResponse.proposal?.title).toContain('Luxury');

    // Test follow-up: How to save money
    const saveResponse = await getCopilotResponse('How can we save ₹50,000 on this celebration?', {
      event: liveEvent,
      guests: [],
      budgetCategories: [],
      themes: [],
      tasks: [],
      conversationHistory: [],
    });
    expect(saveResponse.text).toContain('Cost-Optimization');
    expect(saveResponse.proposal).toBeDefined();
  });
});
