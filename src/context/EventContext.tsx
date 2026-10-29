import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  EventDetails,
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
} from '../types';
import { StorageService } from '../services/storageService';
import { calculateBudgetSummary, BudgetSummary } from '../services/budgetCalculator';
import { generateOperationalAlerts } from '../services/alertEngine';
import { validateGuestCheckIn, CheckInResult } from '../services/guestPassService';

interface EventContextType {
  event: EventDetails;
  guests: Guest[];
  budgetCategories: BudgetCategory[];
  themes: ThemeConcept[];
  tasks: Task[];
  activeTheme: ThemeConcept;
  budgetSummary: BudgetSummary;
  alerts: OperationalAlert[];
  activeModule: 'overview' | 'guests' | 'budget' | 'theme' | 'admin' | 'what-if' | 'copilot' | 'invitation-preview';
  setActiveModule: (mod: 'overview' | 'guests' | 'budget' | 'theme' | 'admin' | 'what-if' | 'copilot' | 'invitation-preview') => void;
  selectedGuestForPass: Guest | null;
  setSelectedGuestForPass: (guest: Guest | null) => void;
  isCheckInScannerOpen: boolean;
  setIsCheckInScannerOpen: (open: boolean) => void;
  isWhatIfModalOpen: boolean;
  setIsWhatIfModalOpen: (open: boolean) => void;
  activeToast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;

  // Actions
  updateEvent: (updates: Partial<EventDetails>) => void;
  updateGuestCount: (count: number) => void;
  updateVenueType: (venueType: VenueType) => void;
  addGuest: (guest: Omit<Guest, 'id'>) => void;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  checkInGuestByCode: (query: string, operator?: string) => CheckInResult;
  updateBudgetItem: (categoryId: BudgetCategoryId, itemId: string, updates: Partial<BudgetItem>) => void;
  addBudgetItem: (categoryId: BudgetCategoryId, item: Omit<BudgetItem, 'id'>) => void;
  deleteBudgetItem: (categoryId: BudgetCategoryId, itemId: string) => void;
  setActiveTheme: (themeId: string) => void;
  toggleTask: (taskId: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (taskId: string) => void;
  applyWhatIfScenario: (scenario: WhatIfScenario) => void;
  applyCopilotProposal: (proposal: CopilotProposal) => void;
  resetToDemoSeed: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [event, setEvent] = useState<EventDetails>(() => StorageService.getEvent());
  const [guests, setGuests] = useState<Guest[]>(() => StorageService.getGuests());
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(() =>
    StorageService.getBudgetCategories()
  );
  const [themes, setThemes] = useState<ThemeConcept[]>(() => StorageService.getThemes());
  const [tasks, setTasks] = useState<Task[]>(() => StorageService.getTasks());

  const [activeModule, setActiveModule] = useState<EventContextType['activeModule']>('overview');
  const [selectedGuestForPass, setSelectedGuestForPass] = useState<Guest | null>(null);
  const [isCheckInScannerOpen, setIsCheckInScannerOpen] = useState(false);
  const [isWhatIfModalOpen, setIsWhatIfModalOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<EventContextType['activeToast']>(null);

  // Sync to localStorage
  useEffect(() => {
    StorageService.saveEvent(event);
  }, [event]);

  useEffect(() => {
    StorageService.saveGuests(guests);
  }, [guests]);

  useEffect(() => {
    StorageService.saveBudgetCategories(budgetCategories);
  }, [budgetCategories]);

  useEffect(() => {
    StorageService.saveTasks(tasks);
  }, [tasks]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setActiveToast({ message, type });
    setTimeout(() => {
      setActiveToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Active theme calculation
  const activeTheme = useMemo(() => {
    return themes.find((t) => t.id === event.activeThemeId) || themes[0];
  }, [themes, event.activeThemeId]);

  // Derived budget calculation (updates automatically when guests or venue changes!)
  const budgetSummary = useMemo(() => {
    return calculateBudgetSummary(
      budgetCategories,
      event.targetBudget,
      event.targetGuestCount,
      event.venue.type
    );
  }, [budgetCategories, event.targetBudget, event.targetGuestCount, event.venue.type]);

  // Derived operational alerts (recalculated on every state change!)
  const alerts = useMemo(() => {
    return generateOperationalAlerts(event, guests, budgetCategories, tasks);
  }, [event, guests, budgetCategories, tasks]);

  // --- ACTIONS ---

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
            : 'The Courtyard Pavilion & Heritage Lawns',
      },
      updatedAt: new Date().toISOString(),
    }));
    showToast(`Venue set to ${venueType === 'home_courtyard' ? 'Home Courtyard' : 'Function Hall'}.`);
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

      // Trigger celebration confetti on valid check-in!
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

  // --- SIGNATURE WHAT-IF APPLICATION ---
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
            : 'The Courtyard Pavilion & Heritage Lawns',
      },
      updatedAt: new Date().toISOString(),
    }));

    // If decor budget was modified, apply modifier to decor items
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

    // Celebratory confetti on applied scenario!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C96F4A', '#F2C66D', '#A9B89A', '#FFF8EF'],
    });

    showToast(`✅ Scenario "${scenario.name}" successfully applied to your celebration!`);
  };

  // --- COPILOT PROPOSAL APPLICATION ---
  const applyCopilotProposal = (proposal: CopilotProposal) => {
    if (proposal.actionType === 'SWITCH_VENUE') {
      updateVenueType('home_courtyard');
    } else if (proposal.actionType === 'INCREASE_CATERING_BUFFER') {
      const extra = proposal.actionPayload?.extraPlates || 20;
      updateEvent({ cateringPlateBuffer: event.cateringPlateBuffer + extra });
    } else if (proposal.actionType === 'APPLY_THEME') {
      const themeId = proposal.actionPayload?.themeId || 'theme-botanical-chic';
      setActiveTheme(themeId);
    } else if (proposal.actionType === 'ADJUST_GUEST_COUNT') {
      const count = proposal.actionPayload?.guestCount || 150;
      updateGuestCount(count);
    }

    confetti({
      particleCount: 60,
      spread: 50,
      colors: ['#F2C66D', '#C96F4A'],
    });

    showToast(`Proposal applied: ${proposal.title}!`);
  };

  const resetToDemoSeed = () => {
    const seeded = StorageService.resetAll();
    setEvent(seeded.event);
    setGuests(seeded.guests);
    setBudgetCategories(seeded.budgetCategories);
    setThemes(seeded.themes);
    setTasks(seeded.tasks);
    showToast('Reset to original sample celebration demo state', 'info');
  };

  return (
    <EventContext.Provider
      value={{
        event,
        guests,
        budgetCategories,
        themes,
        tasks,
        activeTheme,
        budgetSummary,
        alerts,
        activeModule,
        setActiveModule,
        selectedGuestForPass,
        setSelectedGuestForPass,
        isCheckInScannerOpen,
        setIsCheckInScannerOpen,
        isWhatIfModalOpen,
        setIsWhatIfModalOpen,
        activeToast,
        showToast,
        updateEvent,
        updateGuestCount,
        updateVenueType,
        addGuest,
        updateGuest,
        deleteGuest,
        checkInGuestByCode,
        updateBudgetItem,
        addBudgetItem,
        deleteBudgetItem,
        setActiveTheme,
        toggleTask,
        addTask,
        deleteTask,
        applyWhatIfScenario,
        applyCopilotProposal,
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
