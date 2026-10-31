import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  EventDetails,
  EventSummary,
  Guest,
  BudgetCategory,
  BudgetCategoryId,
  BudgetItem,
  ThemeConcept,
  Task,
  VenueType,
  OperationalAlert,
  WhatIfScenario,
  CopilotProposal,
  CopilotMessage,
  DecorConceptItem,
  VenuePhoto,
  StructuredEventProposal,
} from '../types';
import { StorageService } from '../services/storageService';
import { calculateBudgetSummary, BudgetSummary } from '../services/budgetCalculator';
import { generateOperationalAlerts } from '../services/alertEngine';
import { validateGuestCheckIn, CheckInResult } from '../services/guestPassService';
import { generateAllDecorConcepts } from '../services/imageGenService';

export interface EventContextType {
  // Multi-event State
  events: EventSummary[];
  activeEventId: string | null;
  event: EventDetails;
  isFirstTimeUser: boolean;
  switchEvent: (eventId: string) => void;
  createEvent: (details: Partial<EventDetails>) => EventDetails;
  duplicateCurrentEvent: () => void;
  deleteCurrentEvent: () => void;
  loadSampleWedding: () => void;

  // Connected Data Collections
  guests: Guest[];
  budgetCategories: BudgetCategory[];
  themes: ThemeConcept[];
  tasks: Task[];
  activeTheme: ThemeConcept;
  budgetSummary: BudgetSummary;
  alerts: OperationalAlert[];

  // Decor Concepts & Venue Photos
  decorConcepts: DecorConceptItem[];
  venuePhotos: VenuePhoto[];
  generateDecorConceptsForEvent: (modifications?: string) => void;
  addVenuePhoto: (name: string, dataUrl: string, notes?: string) => void;
  deleteVenuePhoto: (id: string) => void;
  toggleDecorFavorite: (id: string) => void;
  applyDecorCostToBudget: (concept: DecorConceptItem) => void;

  // Copilot State
  copilotMessages: CopilotMessage[];
  setCopilotMessages: React.Dispatch<React.SetStateAction<CopilotMessage[]>>;
  applyCopilotProposal: (proposal: CopilotProposal) => void;
  applyStructuredProposalAsEvent: (proposal: StructuredEventProposal) => void;

  // AI Configuration Settings
  aiSettings: { apiKey: string; model: string };
  updateAISettings: (settings: { apiKey: string; model: string }) => void;
  isAISettingsOpen: boolean;
  setIsAISettingsOpen: (open: boolean) => void;

  // Navigation & Modals
  activeModule: 'overview' | 'guests' | 'budget' | 'theme' | 'admin' | 'what-if' | 'copilot' | 'invitation-preview';
  setActiveModule: (mod: 'overview' | 'guests' | 'budget' | 'theme' | 'admin' | 'what-if' | 'copilot' | 'invitation-preview') => void;
  selectedGuestForPass: Guest | null;
  setSelectedGuestForPass: (guest: Guest | null) => void;
  isCheckInScannerOpen: boolean;
  setIsCheckInScannerOpen: (open: boolean) => void;
  isWhatIfModalOpen: boolean;
  setIsWhatIfModalOpen: (open: boolean) => void;
  isCreateEventModalOpen: boolean;
  setIsCreateEventModalOpen: (open: boolean) => void;
  isEventSwitcherOpen: boolean;
  setIsEventSwitcherOpen: (open: boolean) => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;

  // Toast
  activeToast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;

  // Core Event Actions
  updateEvent: (updates: Partial<EventDetails>) => void;
  updateGuestCount: (count: number) => void;
  updateVenueType: (venueType: VenueType) => void;
  addGuest: (guest: Omit<Guest, 'id'>) => void;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  importGuestsFromCSV: (csvText: string) => number;
  exportGuestsToCSV: () => string;
  checkInGuestByCode: (query: string, operator?: string) => CheckInResult;
  updateBudgetItem: (categoryId: BudgetCategoryId, itemId: string, updates: Partial<BudgetItem>) => void;
  addBudgetItem: (categoryId: BudgetCategoryId, item: Omit<BudgetItem, 'id'>) => void;
  deleteBudgetItem: (categoryId: BudgetCategoryId, itemId: string) => void;
  setActiveTheme: (themeId: string) => void;
  toggleTask: (taskId: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (taskId: string) => void;
  applyWhatIfScenario: (scenario: WhatIfScenario) => void;
  resetToDemoSeed: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// Clean fallback event for new users before an event is created
const INITIAL_CLEAN_EVENT: EventDetails = {
  id: 'event-welcome-new',
  title: 'My First Celebration',
  tagline: 'Big moments. Beautifully planned.',
  eventType: 'birthday',
  date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  time: '18:00',
  venue: {
    name: 'Selected Venue / Lawn',
    type: 'function_hall',
    address: 'City Center',
    city: 'Bengaluru',
    capacity: 200,
    directionsUrl: 'https://maps.google.com',
  },
  targetGuestCount: 100,
  targetBudget: 250000,
  activeThemeId: 'theme-sunset-terracotta',
  dressCode: 'Festive & Elegant',
  story: 'Gathering our closest circle to celebrate life and memories.',
  organizer: {
    name: 'Event Host',
    email: 'host@festora.in',
    phone: '+91 98765 00000',
    role: 'Lead Planner',
  },
  cateringPlateBuffer: 15,
  returnGiftBuffer: 10,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load list of events from storage
  const [events, setEvents] = useState<EventSummary[]>(() => StorageService.listEvents());
  const [activeEventId, setActiveEventId] = useState<string | null>(() => StorageService.getActiveEventId());

  // Determine initial event
  const [event, setEvent] = useState<EventDetails>(() => {
    const activeId = StorageService.getActiveEventId();
    if (activeId) {
      const stored = StorageService.getEvent(activeId);
      if (stored) return stored;
    }
    const eventList = StorageService.listEvents();
    if (eventList.length > 0) {
      const first = StorageService.getEvent(eventList[0].id);
      if (first) {
        StorageService.setActiveEventId(first.id);
        return first;
      }
    }
    return INITIAL_CLEAN_EVENT;
  });

  const isFirstTimeUser = useMemo(() => {
    return events.length === 0;
  }, [events]);

  // Connected Module State (isolated by active event ID)
  const [guests, setGuests] = useState<Guest[]>(() => StorageService.getGuests(event.id));
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(() =>
    StorageService.getBudgetCategories(event.id)
  );
  const [themes, setThemes] = useState<ThemeConcept[]>(() => StorageService.getThemes(event.id));
  const [tasks, setTasks] = useState<Task[]>(() => StorageService.getTasks(event.id));
  const [decorConcepts, setDecorConcepts] = useState<DecorConceptItem[]>(() =>
    StorageService.getDecorConcepts(event.id)
  );
  const [venuePhotos, setVenuePhotos] = useState<VenuePhoto[]>(() =>
    StorageService.getVenuePhotos(event.id)
  );
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>(() =>
    StorageService.getCopilotMessages(event.id)
  );

  // AI Configuration
  const [aiSettings, setAiSettings] = useState(() => StorageService.getAISettings());
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);

  // Navigation & Modals
  const [activeModule, setActiveModule] = useState<EventContextType['activeModule']>('overview');
  const [selectedGuestForPass, setSelectedGuestForPass] = useState<Guest | null>(null);
  const [isCheckInScannerOpen, setIsCheckInScannerOpen] = useState(false);
  const [isWhatIfModalOpen, setIsWhatIfModalOpen] = useState(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isEventSwitcherOpen, setIsEventSwitcherOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<EventContextType['activeToast']>(null);

  // Sync state to isolated localStorage whenever event changes
  useEffect(() => {
    if (event.id && event.id !== 'event-welcome-new') {
      StorageService.saveEvent(event);
      setEvents(StorageService.listEvents());
    }
  }, [event]);

  useEffect(() => {
    if (event.id && event.id !== 'event-welcome-new') {
      StorageService.saveGuests(event.id, guests);
    }
  }, [guests, event.id]);

  useEffect(() => {
    if (event.id && event.id !== 'event-welcome-new') {
      StorageService.saveBudgetCategories(event.id, budgetCategories);
    }
  }, [budgetCategories, event.id]);

  useEffect(() => {
    if (event.id && event.id !== 'event-welcome-new') {
      StorageService.saveThemes(event.id, themes);
    }
  }, [themes, event.id]);

  useEffect(() => {
    if (event.id && event.id !== 'event-welcome-new') {
      StorageService.saveTasks(event.id, tasks);
    }
  }, [tasks, event.id]);

  useEffect(() => {
    if (event.id && event.id !== 'event-welcome-new') {
      StorageService.saveDecorConcepts(event.id, decorConcepts);
    }
  }, [decorConcepts, event.id]);

  useEffect(() => {
    if (event.id && event.id !== 'event-welcome-new') {
      StorageService.saveVenuePhotos(event.id, venuePhotos);
    }
  }, [venuePhotos, event.id]);

  useEffect(() => {
    if (event.id && event.id !== 'event-welcome-new') {
      StorageService.saveCopilotMessages(event.id, copilotMessages);
    }
  }, [copilotMessages, event.id]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setActiveToast({ message, type });
    setTimeout(() => {
      setActiveToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Active theme calculation
  const activeTheme = useMemo(() => {
    return themes.find((t) => t.id === event.activeThemeId) || themes[0] || {
      id: 'theme-sunset-terracotta',
      title: 'Sunset Terracotta & Royal Ochre',
      tagline: 'Earthen luxury, antique brass, and the soul of intimate festivities',
      description: 'Warm terracotta tones with golden ochre and marigolds.',
      palette: {
        primary: '#C96F4A',
        secondary: '#D9A948',
        accent: '#F5D1BD',
        background: '#FFF8EF',
        text: '#49372D',
        names: ['Sunset Terracotta', 'Royal Ochre', 'Blush Peach', 'Warm Cream', 'Deep Umber'],
      },
      suitableEventTypes: ['birthday', 'wedding', 'custom'],
      vibeKeywords: ['Warm', 'Festive', 'Regal'],
      venueBriefs: {
        function_hall: 'Grand entryway with brass lanterns and warm uplighting.',
        home_courtyard: 'Courtyard fairy lights and terracotta urns.',
      },
      decorElements: ['Terracotta urns', 'Marigold garlands', 'Brass lamps'],
      costTier: 'balanced',
      costSavingTips: ['Source flowers wholesale locally'],
    };
  }, [themes, event.activeThemeId]);

  // Derived budget calculation
  const budgetSummary = useMemo(() => {
    return calculateBudgetSummary(
      budgetCategories,
      event.targetBudget,
      event.targetGuestCount,
      event.venue.type
    );
  }, [budgetCategories, event.targetBudget, event.targetGuestCount, event.venue.type]);

  // Operational alerts
  const alerts = useMemo(() => {
    return generateOperationalAlerts(event, guests, budgetCategories, tasks);
  }, [event, guests, budgetCategories, tasks]);

  // Switch between events
  const switchEvent = (targetEventId: string) => {
    const targetEvent = StorageService.getEvent(targetEventId);
    if (!targetEvent) return;

    StorageService.setActiveEventId(targetEventId);
    setActiveEventId(targetEventId);
    setEvent(targetEvent);

    // Load target event's isolated data
    setGuests(StorageService.getGuests(targetEventId));
    setBudgetCategories(StorageService.getBudgetCategories(targetEventId));
    setThemes(StorageService.getThemes(targetEventId));
    setTasks(StorageService.getTasks(targetEventId));
    setDecorConcepts(StorageService.getDecorConcepts(targetEventId));
    setVenuePhotos(StorageService.getVenuePhotos(targetEventId));
    setCopilotMessages(StorageService.getCopilotMessages(targetEventId));

    showToast(`Switched workspace to "${targetEvent.title}"`, 'info');
  };

  // Create new event
  const createEvent = (details: Partial<EventDetails>): EventDetails => {
    const newEv = StorageService.createEvent(details);
    setEvents(StorageService.listEvents());
    setActiveEventId(newEv.id);
    setEvent(newEv);
    setGuests([]);
    setBudgetCategories(StorageService.getBudgetCategories(newEv.id));
    setThemes(StorageService.getThemes(newEv.id));
    setTasks(StorageService.getTasks(newEv.id));
    setDecorConcepts([]);
    setVenuePhotos([]);
    setCopilotMessages([]);

    confetti({
      particleCount: 60,
      spread: 60,
      colors: ['#C96F4A', '#F2C66D', '#A9B89A'],
    });

    showToast(`Created workspace for "${newEv.title}"!`);
    return newEv;
  };

  // Duplicate current event
  const duplicateCurrentEvent = () => {
    if (!event.id) return;
    const dup = StorageService.duplicateEvent(event.id);
    if (dup) {
      setEvents(StorageService.listEvents());
      switchEvent(dup.id);
      showToast(`Duplicated celebration: "${dup.title}"`);
    }
  };

  // Delete current event
  const deleteCurrentEvent = () => {
    if (!event.id) return;
    const title = event.title;
    StorageService.deleteEvent(event.id);
    const updatedList = StorageService.listEvents();
    setEvents(updatedList);

    if (updatedList.length > 0) {
      switchEvent(updatedList[0].id);
    } else {
      setActiveEventId(null);
      setEvent(INITIAL_CLEAN_EVENT);
      setGuests([]);
      setBudgetCategories([]);
      setThemes([]);
      setTasks([]);
      setDecorConcepts([]);
      setVenuePhotos([]);
      setCopilotMessages([]);
    }
    showToast(`Deleted "${title}"`, 'warning');
  };

  // Load sample wedding explicitly
  const loadSampleWedding = () => {
    const sample = StorageService.loadSampleWedding();
    setEvents(StorageService.listEvents());
    switchEvent(sample.id);
    showToast('Loaded sample wedding celebration for exploration!', 'info');
  };

  // Generate Decor Concepts for Event
  const generateDecorConceptsForEvent = (modifications?: string) => {
    const venueNote = venuePhotos.length > 0 ? venuePhotos[0].notes || 'Photo uploaded by user' : undefined;
    const newConcepts = generateAllDecorConcepts({
      eventType: event.eventType,
      venueType: event.venue.type,
      theme: activeTheme,
      targetBudget: event.targetBudget,
      guestCount: event.targetGuestCount,
      customModifications: modifications,
      venuePhotoNote: venueNote,
    });
    setDecorConcepts(newConcepts);
    showToast('Generated 8 AI visual decoration concepts across venue zones!');
  };

  // Add venue photo
  const addVenuePhoto = (name: string, dataUrl: string, notes?: string) => {
    const newPhoto: VenuePhoto = {
      id: `photo-${Date.now()}`,
      name,
      dataUrl,
      uploadedAt: new Date().toISOString(),
      notes,
    };
    setVenuePhotos((prev) => [newPhoto, ...prev]);
    showToast(`Uploaded venue reference photo: ${name}`);
  };

  const deleteVenuePhoto = (id: string) => {
    setVenuePhotos((prev) => prev.filter((p) => p.id !== id));
    showToast('Removed venue photo', 'info');
  };

  const toggleDecorFavorite = (id: string) => {
    setDecorConcepts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  // Connect decor cost to budget
  const applyDecorCostToBudget = (concept: DecorConceptItem) => {
    const existingDecorCat = budgetCategories.find((c) => c.id === 'decor');
    if (!existingDecorCat) return;

    const newBudgetItem: BudgetItem = {
      id: `b-decor-${concept.id}`,
      categoryId: 'decor',
      name: concept.title,
      description: `AI Visual Decor concept: ${concept.description}`,
      unitCost: concept.estimatedCost,
      quantity: 1,
      isGuestDependent: false,
      guestMultiplier: 1,
      committedAmount: 0,
      estimatedTotal: concept.estimatedCost,
    };

    setBudgetCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== 'decor') return cat;
        return {
          ...cat,
          items: [...cat.items, newBudgetItem],
        };
      })
    );

    setDecorConcepts((prev) =>
      prev.map((c) => (c.id === concept.id ? { ...c, selectedForBudget: true } : c))
    );

    showToast(`Connected "${concept.title}" (₹${concept.estimatedCost.toLocaleString('en-IN')}) to event budget!`);
  };

  // Convert Copilot 12-Section Proposal into actual live event data
  const applyStructuredProposalAsEvent = (proposal: StructuredEventProposal) => {
    const newEv = createEvent({
      title: proposal.title,
      tagline: proposal.tagline,
      eventType: proposal.eventType,
      targetGuestCount: proposal.guestCount,
      targetBudget: proposal.targetBudget,
      date: proposal.date,
      venue: {
        name: proposal.venueArrangements.recommendedType === 'home_courtyard' ? 'Ancestral Home Courtyard' : 'Grand Celebration Hall',
        type: proposal.venueArrangements.recommendedType,
        address: `${proposal.city} Center`,
        city: proposal.city,
        capacity: Math.round(proposal.guestCount * 1.3),
        directionsUrl: 'https://maps.google.com',
        notes: proposal.venueArrangements.layoutConcept,
      },
      story: proposal.overview,
      cateringPlateBuffer: proposal.cateringRecommendations.plateBuffer,
      returnGiftBuffer: proposal.returnGiftRecommendations?.recommendedQuantity || 10,
    });

    // Populate customized tasks from proposal
    const proposalTasks: Task[] = proposal.importantTasks.map((t, idx) => ({
      id: `task-prop-${Date.now()}-${idx}`,
      title: t.title,
      category: t.category,
      deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      assignedTo: 'Lead Organizer',
      priority: t.priority,
      isCompleted: false,
    }));
    setTasks(proposalTasks);

    // Generate initial decor concepts
    setTimeout(() => {
      generateDecorConceptsForEvent();
    }, 200);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#C96F4A', '#F2C66D', '#A9B89A', '#FFF8EF'],
    });

    showToast(`✅ Approved! Live event workspace created for "${proposal.title}".`);
    setActiveModule('overview');
  };

  // AI Settings
  const updateAISettings = (newSettings: { apiKey: string; model: string }) => {
    StorageService.saveAISettings(newSettings);
    setAiSettings(newSettings);
    showToast('AI Settings updated successfully!');
  };

  // Core Actions
  const updateEvent = (updates: Partial<EventDetails>) => {
    setEvent((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
    showToast('Event settings updated', 'info');
  };

  const updateGuestCount = (count: number) => {
    const safeCount = Math.max(10, count);
    setEvent((prev) => ({
      ...prev,
      targetGuestCount: safeCount,
      updatedAt: new Date().toISOString(),
    }));
    showToast(`Guest count updated to ${safeCount}. Related catering and gift estimates adjusted!`);
  };

  const updateVenueType = (venueType: VenueType) => {
    setEvent((prev) => ({
      ...prev,
      venue: {
        ...prev.venue,
        type: venueType,
        name:
          venueType === 'home_courtyard'
            ? 'Ancestral Family Courtyard & Gardens'
            : venueType === 'outdoor_lawn'
            ? 'Open Air Heritage Lawns & Pavilion'
            : 'The Grand Celebration Ballroom',
      },
      updatedAt: new Date().toISOString(),
    }));
    showToast(`Venue set to ${venueType.replace('_', ' ')}.`);
  };

  const addGuest = (guestData: Omit<Guest, 'id'>) => {
    const newGuest: Guest = {
      ...guestData,
      id: `g-${Date.now()}`,
    };
    setGuests((prev) => [newGuest, ...prev]);
    showToast(`Added ${newGuest.name} to guest list`);
  };

  const updateGuest = (id: string, updates: Partial<Guest>) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
    showToast('Guest record updated');
  };

  const deleteGuest = (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
    showToast('Guest removed from event', 'warning');
  };

  // CSV Import & Export
  const importGuestsFromCSV = (csvText: string): number => {
    try {
      const lines = csvText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
      if (lines.length <= 1) return 0;

      let addedCount = 0;
      const newGuests: Guest[] = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
        if (parts.length >= 2 && parts[0]) {
          const name = parts[0];
          const partySize = parseInt(parts[1], 10) || 2;
          const phone = parts[2] || '+91 98000 00000';
          const email = parts[3] || 'guest@example.com';
          const category = (['family', 'close_friends', 'vip', 'colleagues', 'community'].includes(parts[4])
            ? parts[4]
            : 'family') as any;
          const meal = (['vegetarian', 'non_vegetarian', 'jain', 'vegan'].includes(parts[5])
            ? parts[5]
            : 'vegetarian') as any;

          const guestCode = `FEST-${event.eventType.slice(0, 2).toUpperCase()}-${100 + guests.length + addedCount + 1}`;

          newGuests.push({
            id: `g-import-${Date.now()}-${i}`,
            guestCode,
            name,
            email,
            phone,
            category,
            partySize,
            rsvpStatus: 'attending',
            mealPreference: meal,
            invitationSent: true,
            invitationSentAt: new Date().toISOString(),
            checkInStatus: 'not_checked_in',
          });
          addedCount++;
        }
      }

      if (newGuests.length > 0) {
        setGuests((prev) => [...newGuests, ...prev]);
        showToast(`Successfully imported ${newGuests.length} guests from CSV!`);
      }
      return addedCount;
    } catch {
      showToast('Failed to parse CSV file. Please check format.', 'warning');
      return 0;
    }
  };

  const exportGuestsToCSV = (): string => {
    const headers = 'Name,PartySize,Phone,Email,Category,MealPreference,RSVPStatus,GuestCode,CheckInStatus\n';
    const rows = guests
      .map(
        (g) =>
          `"${g.name}",${g.partySize},"${g.phone}","${g.email}","${g.category}","${g.mealPreference}","${g.rsvpStatus}","${g.guestCode}","${g.checkInStatus}"`
      )
      .join('\n');
    return headers + rows;
  };

  const checkInGuestByCode = (query: string, operatorName: string = 'Terminal 1'): CheckInResult => {
    const result = validateGuestCheckIn(query, guests, operatorName);

    if (result.success && result.guest) {
      const now = result.checkInTime || new Date().toISOString();
      setGuests((prev) =>
        prev.map((g) =>
          g.id === result.guest!.id
            ? {
                ...g,
                checkInStatus: 'checked_in',
                checkedInAt: now,
                checkedInBy: operatorName,
              }
            : g
        )
      );

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#C96F4A', '#F2C66D', '#A9B89A', '#FFF8EF'],
      });

      showToast(`Checked in: ${result.guest.name} (Party of ${result.guest.partySize})`);
    } else {
      showToast(result.message, result.status === 'already_checked_in' ? 'warning' : 'info');
    }

    return result;
  };

  const updateBudgetItem = (
    categoryId: BudgetCategoryId,
    itemId: string,
    updates: Partial<BudgetItem>
  ) => {
    setBudgetCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
        };
      })
    );
    showToast('Budget line item updated');
  };

  const addBudgetItem = (categoryId: BudgetCategoryId, itemData: Omit<BudgetItem, 'id'>) => {
    const newItem: BudgetItem = {
      ...itemData,
      id: `b-custom-${Date.now()}`,
    };
    setBudgetCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: [...cat.items, newItem],
        };
      })
    );
    showToast(`Added "${newItem.name}" to budget`);
  };

  const deleteBudgetItem = (categoryId: BudgetCategoryId, itemId: string) => {
    setBudgetCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.filter((i) => i.id !== itemId),
        };
      })
    );
    showToast('Item removed from budget', 'warning');
  };

  const setActiveTheme = (themeId: string) => {
    setEvent((prev) => ({
      ...prev,
      activeThemeId: themeId,
      updatedAt: new Date().toISOString(),
    }));
    const found = themes.find((t) => t.id === themeId);
    showToast(`Active theme set to "${found?.title || themeId}"`);
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const willComplete = !t.isCompleted;
        return {
          ...t,
          isCompleted: willComplete,
          completedAt: willComplete ? new Date().toISOString() : undefined,
        };
      })
    );
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Task created: "${newTask.title}"`);
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Task deleted', 'info');
  };

  const applyWhatIfScenario = (scenario: WhatIfScenario) => {
    const newGuestCount = scenario.calculatedMetrics.proposedGuestCount;
    const newVenueType = scenario.overrideVenueType || event.venue.type;
    const newBudget = scenario.calculatedMetrics.targetBudget;

    setEvent((prev) => ({
      ...prev,
      targetGuestCount: newGuestCount,
      targetBudget: newBudget,
      venue: {
        ...prev.venue,
        type: newVenueType,
        name:
          newVenueType === 'home_courtyard'
            ? 'Ancestral Family Courtyard & Gardens'
            : newVenueType === 'outdoor_lawn'
            ? 'Open Air Heritage Lawns & Pavilion'
            : 'The Courtyard Pavilion & Heritage Lawns',
      },
      updatedAt: new Date().toISOString(),
    }));

    if (scenario.deltaDecorBudgetPercent) {
      const factor = Math.max(0.1, 1 + scenario.deltaDecorBudgetPercent / 100);
      setBudgetCategories((prev) =>
        prev.map((cat) => {
          if (cat.id !== 'decor') return cat;
          return {
            ...cat,
            items: cat.items.map((item) => ({
              ...item,
              unitCost: Math.round(item.unitCost * factor),
              estimatedTotal: Math.round(item.estimatedTotal * factor),
            })),
          };
        })
      );
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C96F4A', '#F2C66D', '#A9B89A', '#FFF8EF'],
    });

    showToast(`✅ Scenario "${scenario.name}" successfully applied to your celebration!`);
  };

  const applyCopilotProposal = (proposal: CopilotProposal) => {
    if (proposal.actionType === 'SWITCH_VENUE') {
      const vType = proposal.actionPayload?.venueType || 'home_courtyard';
      updateVenueType(vType);
    } else if (proposal.actionType === 'INCREASE_CATERING_BUFFER') {
      const extra = proposal.actionPayload?.extraPlates || 20;
      updateEvent({ cateringPlateBuffer: event.cateringPlateBuffer + extra });
    } else if (proposal.actionType === 'APPLY_THEME') {
      const themeId = proposal.actionPayload?.themeId || 'theme-botanical-chic';
      setActiveTheme(themeId);
    } else if (proposal.actionType === 'ADJUST_GUEST_COUNT') {
      const count = proposal.actionPayload?.guestCount || 150;
      updateGuestCount(count);
      if (proposal.actionPayload?.extraPlates) {
        updateEvent({ cateringPlateBuffer: event.cateringPlateBuffer + proposal.actionPayload.extraPlates });
      }
    } else if (proposal.actionType === 'UPDATE_BUDGET') {
      const newBudget = proposal.actionPayload?.targetBudget || event.targetBudget;
      updateEvent({ targetBudget: newBudget });
    }

    confetti({
      particleCount: 60,
      spread: 50,
      colors: ['#F2C66D', '#C96F4A'],
    });

    showToast(`Proposal applied: ${proposal.title}!`);
  };

  const resetToDemoSeed = () => {
    loadSampleWedding();
  };

  return (
    <EventContext.Provider
      value={{
        events,
        activeEventId,
        event,
        isFirstTimeUser,
        switchEvent,
        createEvent,
        duplicateCurrentEvent,
        deleteCurrentEvent,
        loadSampleWedding,
        guests,
        budgetCategories,
        themes,
        tasks,
        activeTheme,
        budgetSummary,
        alerts,
        decorConcepts,
        venuePhotos,
        generateDecorConceptsForEvent,
        addVenuePhoto,
        deleteVenuePhoto,
        toggleDecorFavorite,
        applyDecorCostToBudget,
        copilotMessages,
        setCopilotMessages,
        applyCopilotProposal,
        applyStructuredProposalAsEvent,
        aiSettings,
        updateAISettings,
        isAISettingsOpen,
        setIsAISettingsOpen,
        activeModule,
        setActiveModule,
        selectedGuestForPass,
        setSelectedGuestForPass,
        isCheckInScannerOpen,
        setIsCheckInScannerOpen,
        isWhatIfModalOpen,
        setIsWhatIfModalOpen,
        isCreateEventModalOpen,
        setIsCreateEventModalOpen,
        isEventSwitcherOpen,
        setIsEventSwitcherOpen,
        isMobileNavOpen,
        setIsMobileNavOpen,
        activeToast,
        showToast,
        updateEvent,
        updateGuestCount,
        updateVenueType,
        addGuest,
        updateGuest,
        deleteGuest,
        importGuestsFromCSV,
        exportGuestsToCSV,
        checkInGuestByCode,
        updateBudgetItem,
        addBudgetItem,
        deleteBudgetItem,
        setActiveTheme,
        toggleTask,
        addTask,
        deleteTask,
        applyWhatIfScenario,
        resetToDemoSeed,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
