export type EventType =
  | 'wedding'
  | 'engagement'
  | 'birthday'
  | 'anniversary'
  | 'college'
  | 'community'
  | 'family'
  | 'corporate'
  | 'custom';

export type VenueType =
  | 'function_hall'
  | 'home_courtyard'
  | 'outdoor_lawn'
  | 'resort'
  | 'campus_auditorium'
  | 'conference_center';

export type RSVPStatus = 'attending' | 'declined' | 'pending';

export type GuestCategory = 'family' | 'close_friends' | 'vip' | 'colleagues' | 'community';

export type MealPreference = 'vegetarian' | 'non_vegetarian' | 'jain' | 'vegan';

export interface VenueInfo {
  name: string;
  type: VenueType;
  address: string;
  city: string;
  capacity: number;
  directionsUrl?: string;
  mapEmbedUrl?: string;
  notes?: string;
}

export interface EventDetails {
  id: string;
  title: string;
  tagline: string;
  eventType: EventType;
  date: string; // YYYY-MM-DD
  time: string;
  venue: VenueInfo;
  targetGuestCount: number;
  targetBudget: number;
  activeThemeId: string;
  dressCode: string;
  story: string;
  organizer: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  cateringPlateBuffer: number; // e.g. 15 extra buffer plates
  returnGiftBuffer: number;    // e.g. 10 extra gifts
  schedule?: TimelineEvent[];  // Day-of timeline milestones
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  time: string; // e.g. "10:00 AM" or "14:30"
  title: string;
  description?: string;
  location?: string;
  coordinator?: string;
  isCompleted?: boolean;
}

export interface Guest {
  id: string;
  guestCode: string; // e.g. FEST-AK-101
  name: string;
  email: string;
  phone: string;
  category: GuestCategory;
  partySize: number; // Total attending in this family/group
  rsvpStatus: RSVPStatus;
  mealPreference: MealPreference;
  tableNumber?: string;
  dietaryNotes?: string;
  invitationSent: boolean;
  invitationSentAt?: string;
  checkInStatus: 'not_checked_in' | 'checked_in';
  checkedInAt?: string;
  checkedInBy?: string;
}

export interface GuestPass {
  passId: string;
  guestId: string;
  guestCode: string;
  guestName: string;
  partySize: number;
  category: GuestCategory;
  mealPreference: MealPreference;
  qrPayload: string;
  status: 'valid' | 'already_checked_in' | 'cancelled' | 'invalid';
  checkInHistory: Array<{ timestamp: string; operator: string }>;
}

export type BudgetCategoryId =
  | 'venue'
  | 'catering'
  | 'decor'
  | 'photography'
  | 'styling'
  | 'invitations'
  | 'transport'
  | 'entertainment'
  | 'gifts'
  | 'contingency'
  | 'custom';

export interface BudgetItem {
  id: string;
  categoryId: BudgetCategoryId;
  name: string;
  description?: string;
  unitCost: number;
  quantity: number;
  isGuestDependent: boolean; // if true, quantity or cost automatically links to guest count
  guestMultiplier: number;  // 1 = 1 per guest; 0.5 = 1 per couple; 0.01 = 1 per 100
  isHomeVenueDiscounted?: boolean;
  homeVenueCostModifier?: number; // e.g., 0 = free if home, 0.4 = 60% cheaper
  committedAmount: number; // deposit paid / committed
  estimatedTotal: number;
  notes?: string;
}

export interface BudgetCategory {
  id: BudgetCategoryId;
  name: string;
  iconName: string;
  color: string;
  targetPercent: number;
  items: BudgetItem[];
}

export interface Palette {
  primary: string; // hex
  secondary: string;
  accent: string;
  background: string;
  text: string;
  names: string[];
}

export interface ThemeConcept {
  id: string;
  title: string;
  tagline: string;
  description: string;
  palette: Palette;
  suitableEventTypes: EventType[];
  vibeKeywords: string[];
  venueBriefs: {
    function_hall: string;
    home_courtyard: string;
  };
  decorElements: string[];
  costTier: 'budget_friendly' | 'balanced' | 'luxury';
  costSavingTips: string[];
  accentImageUrl?: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  category: string;
  deadline: string; // YYYY-MM-DD
  assignedTo: string;
  priority: TaskPriority;
  isCompleted: boolean;
  completedAt?: string;
}

export interface OperationalAlert {
  id: string;
  type: 'budget' | 'catering' | 'rsvp' | 'task' | 'gift' | 'venue';
  severity: 'info' | 'warning' | 'danger';
  title: string;
  message: string;
  actionLabel?: string;
  actionTargetModule?: 'guests' | 'budget' | 'theme' | 'admin' | 'what-if' | 'copilot';
}

export interface WhatIfScenarioMetrics {
  originalGuestCount: number;
  proposedGuestCount: number;
  guestCountDiff: number;

  originalTotalCost: number;
  proposedTotalCost: number;
  costDifference: number;

  targetBudget: number;
  originalRemainingBudget: number;
  proposedRemainingBudget: number;

  originalCateringCost: number;
  proposedCateringCost: number;
  cateringDifference: number;

  originalVenueCost: number;
  proposedVenueCost: number;

  originalDecorCost: number;
  proposedDecorCost: number;

  expectedAttendance: number;
  confirmedAttendance: number;
  cateringPlateCapacity: number;
  cateringPlateShortfall: number;
  giftCountCapacity: number;
  giftShortfall: number;

  isOverBudget: boolean;
  overBudgetAmount: number;

  tradeOffSummary: string[];
  warnings: string[];
  positives: string[];
}

export interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  deltaGuestCount: number; // e.g. +50 or -30
  overrideVenueType?: VenueType;
  deltaDecorBudgetPercent?: number; // e.g. -25 for 25% reduction
  deltaBudgetPercent?: number; // e.g. -15 for 15% reduction
  calculatedMetrics: WhatIfScenarioMetrics;
}

export type DecorAreaId =
  | 'entrance'
  | 'stage'
  | 'seating'
  | 'dining'
  | 'tables'
  | 'lighting'
  | 'outdoor'
  | 'complete_venue';

export interface DecorConceptItem {
  id: string;
  area: DecorAreaId;
  title: string;
  description: string;
  imageUrl: string;
  prompt: string;
  estimatedCost: number;
  materials: string[];
  affordableAlternative: string;
  isFavorite?: boolean;
  selectedForBudget?: boolean;
}

export interface VenuePhoto {
  id: string;
  name: string;
  dataUrl: string;
  uploadedAt: string;
  notes?: string;
}

export interface StructuredEventProposal {
  id: string;
  eventType: EventType;
  title: string;
  tagline: string;
  guestCount: number;
  targetBudget: number;
  city: string;
  date: string;
  // 12 Required Core Sections
  overview: string;
  requirements: string[];
  venueArrangements: {
    recommendedType: VenueType;
    layoutConcept: string;
    capacityPlanning: string;
  };
  guestPlanning: {
    targetCount: number;
    estimatedParties: number;
    tableArrangements: string;
  };
  budgetBreakdown: Array<{
    category: BudgetCategoryId;
    categoryName: string;
    amount: number;
    percentage: number;
    assumptions: string;
  }>;
  cateringRecommendations: {
    mealType: string;
    recommendedMenu: string[];
    plateBuffer: number;
    estimatedPerPlate: number;
  };
  decorConcepts: {
    themeTitle: string;
    palette: string[];
    keyElements: string[];
    lightingVibe: string;
  };
  returnGiftRecommendations?: {
    description: string;
    perUnitEstimate: number;
    recommendedQuantity: number;
  };
  entertainmentRecommendations: string[];
  timeline: Array<{
    timeframe: string;
    milestone: string;
    tasks: string[];
  }>;
  importantTasks: Array<{
    title: string;
    priority: TaskPriority;
    deadlineDaysBefore: number;
    category: string;
  }>;
  risksAndContingencies: Array<{
    risk: string;
    mitigation: string;
  }>;
}

export interface EventSummary {
  id: string;
  title: string;
  eventType: EventType;
  date: string;
  time: string;
  city: string;
  venueName: string;
  targetGuestCount: number;
  targetBudget: number;
  activeThemeId: string;
  createdAt: string;
  updatedAt: string;
}

export type CopilotActionType =
  | 'APPLY_WHAT_IF'
  | 'ADJUST_GUEST_COUNT'
  | 'SWITCH_VENUE'
  | 'UPDATE_BUDGET'
  | 'APPLY_THEME'
  | 'INCREASE_CATERING_BUFFER'
  | 'CREATE_EVENT_FROM_PROPOSAL'
  | 'UPDATE_EVENT_DETAILS'
  | 'ADD_TASKS_BATCH'
  | 'APPLY_BUDGET_ALLOCATION'
  | 'APPLY_DECOR_CONCEPT';

export interface CopilotProposal {
  id: string;
  title: string;
  summary: string;
  changes: Array<{
    field: string;
    label: string;
    from: string | number;
    to: string | number;
  }>;
  consequences: string[];
  actionType: CopilotActionType;
  actionPayload: any;
  status: 'pending' | 'applied' | 'rejected';
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  proposal?: CopilotProposal;
  structuredProposal?: StructuredEventProposal;
  suggestedQuestions?: string[];
  interviewStep?: string;
}
