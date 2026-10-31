import {
  EventType,
  VenueType,
  StructuredEventProposal,
  EventDetails,
  BudgetCategory,
  Guest,
  ThemeConcept,
  Task,
  CopilotProposal,
} from '../types';
import { getDefaultBudgetCategories, getDefaultThemesForEventType } from './eventDefaults';
import { calculateBudgetSummary } from './budgetCalculator';

export interface ExtractedEventParams {
  eventType?: EventType;
  title?: string;
  guestCount?: number;
  budget?: number;
  city?: string;
  date?: string;
  venuePreference?: VenueType;
  foodPreference?: 'vegetarian' | 'non_vegetarian' | 'both' | 'jain';
  decorVibe?: string;
  hasReturnGifts?: boolean;
  entertainmentPreference?: string[];
  missingCrucialFields: string[];
}

export function extractEventDetailsFromConversation(
  messages: Array<{ sender: string; text: string }>
): ExtractedEventParams {
  const fullText = messages.map((m) => m.text).join(' \n ');
  const lower = fullText.toLowerCase();

  // Detect Event Type
  let eventType: EventType | undefined = undefined;
  if (lower.includes('birthday') || lower.includes('bday')) eventType = 'birthday';
  else if (lower.includes('wedding') || lower.includes('shaadi') || lower.includes('vivah')) eventType = 'wedding';
  else if (lower.includes('engagement') || lower.includes('sangeet') || lower.includes('roka')) eventType = 'engagement';
  else if (lower.includes('anniversary')) eventType = 'anniversary';
  else if (lower.includes('college') || lower.includes('fest') || lower.includes('symposium') || lower.includes('cultural')) eventType = 'college';
  else if (lower.includes('corporate') || lower.includes('conference') || lower.includes('summit') || lower.includes('offsite')) eventType = 'corporate';
  else if (lower.includes('community') || lower.includes('puja') || lower.includes('festival')) eventType = 'community';
  else if (lower.includes('family') || lower.includes('reunion') || lower.includes('gathering')) eventType = 'family';

  // Detect Guest Count
  let guestCount: number | undefined = undefined;
  const guestMatch = lower.match(/(\d+)\s*(people|guests|pax|members|attendees|persons)/i) ||
    lower.match(/for\s*(\d+)/i) ||
    lower.match(/(\d+)\s*(headcount)/i);
  if (guestMatch) {
    const parsed = parseInt(guestMatch[1], 10);
    if (!isNaN(parsed) && parsed > 0) guestCount = parsed;
  }

  // Detect Budget
  let budget: number | undefined = undefined;
  const budgetMatch = lower.match(/(₹|rs\.?|inr|budget\s*(?:of|is|:)?)\s*([\d,]+)\s*(lakh|lac|k|thousand|cr|crore)?/i) ||
    lower.match(/([\d,]+)\s*(lakh|lac|k)\s*(?:budget|inr|rs)/i);
  if (budgetMatch) {
    const numPart = parseFloat(budgetMatch[2]?.replace(/,/g, '') || budgetMatch[1]?.replace(/,/g, '') || '0');
    const unit = (budgetMatch[3] || budgetMatch[2] || '').toLowerCase();
    if (unit.includes('lakh') || unit.includes('lac')) {
      budget = Math.round(numPart * 100000);
    } else if (unit.includes('k') || unit.includes('thousand')) {
      budget = Math.round(numPart * 1000);
    } else if (unit.includes('cr') || unit.includes('crore')) {
      budget = Math.round(numPart * 10000000);
    } else if (numPart > 1000) {
      budget = Math.round(numPart);
    }
  }

  // Detect City
  let city: string | undefined = undefined;
  const cities = ['bengaluru', 'bangalore', 'mumbai', 'delhi', 'hyderabad', 'chennai', 'pune', 'kolkata', 'jaipur', 'goa', 'ahmedabad', 'kochi'];
  for (const c of cities) {
    if (lower.includes(c)) {
      city = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  // Detect Venue Preference
  let venuePreference: VenueType | undefined = undefined;
  if (lower.includes('home') || lower.includes('courtyard') || lower.includes('terrace') || lower.includes('backyard')) {
    venuePreference = 'home_courtyard';
  } else if (lower.includes('outdoor') || lower.includes('lawn') || lower.includes('garden')) {
    venuePreference = 'outdoor_lawn';
  } else if (lower.includes('resort') || lower.includes('farmhouse')) {
    venuePreference = 'resort';
  } else if (lower.includes('auditorium') || lower.includes('campus')) {
    venuePreference = 'campus_auditorium';
  } else if (lower.includes('hall') || lower.includes('banquet') || lower.includes('hotel') || lower.includes('ballroom')) {
    venuePreference = 'function_hall';
  }

  // Detect Food Preference
  let foodPreference: 'vegetarian' | 'non_vegetarian' | 'both' | 'jain' | undefined = undefined;
  if (lower.includes('jain')) foodPreference = 'jain';
  else if (lower.includes('pure veg') || lower.includes('vegetarian only')) foodPreference = 'vegetarian';
  else if (lower.includes('non-veg') || lower.includes('non veg') || lower.includes('both veg and non')) foodPreference = 'both';
  else if (lower.includes('veg')) foodPreference = 'vegetarian';

  // Check missing crucial fields
  const missingCrucialFields: string[] = [];
  if (!eventType) missingCrucialFields.push('event_type');
  if (!guestCount) missingCrucialFields.push('guest_count');
  if (!city) missingCrucialFields.push('city');
  if (!venuePreference) missingCrucialFields.push('venue_type');
  if (!budget) missingCrucialFields.push('budget');
  if (!foodPreference) missingCrucialFields.push('food_preference');

  return {
    eventType,
    guestCount,
    budget,
    city,
    venuePreference,
    foodPreference,
    missingCrucialFields,
  };
}

export function generateStructuredProposal(params: {
  title?: string;
  eventType: EventType;
  guestCount: number;
  budget?: number;
  city?: string;
  venuePreference?: VenueType;
  foodPreference?: string;
  themeTitle?: string;
  date?: string;
}): StructuredEventProposal {
  const { eventType, guestCount } = params;
  const city = params.city || 'Bengaluru';
  const venueType = params.venuePreference || (guestCount > 100 ? 'function_hall' : 'home_courtyard');
  
  // Calculate reasonable realistic budget if not provided
  let defaultBudgetPerGuest = 1200;
  if (eventType === 'wedding' || eventType === 'engagement') defaultBudgetPerGuest = 4500;
  else if (eventType === 'college') defaultBudgetPerGuest = 800;
  else if (eventType === 'corporate') defaultBudgetPerGuest = 2500;
  else if (eventType === 'birthday') defaultBudgetPerGuest = 1500;

  const targetBudget = params.budget || Math.round(guestCount * defaultBudgetPerGuest);
  const eventDate = params.date || new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0];

  const defaultThemes = getDefaultThemesForEventType(eventType);
  const theme = defaultThemes[0];

  // 1. Overview
  const overview = `A comprehensively engineered ${eventType} celebration for ${guestCount} guests in ${city}, designed with a target budget of ₹${targetBudget.toLocaleString('en-IN')}. Seamlessly synchronizes venue logistics, multi-course culinary planning, and visual theme styling.`;

  // 2. Requirements
  const requirements = [
    `Confirmed reservation for a ${venueType.replace('_', ' ')} with minimum capacity of ${Math.round(guestCount * 1.25)} attendees`,
    `Multi-station catering service accommodating ${guestCount} guests + 15 buffer plates`,
    `Integrated digital invitations with individual scannable QR passes`,
    `Thematic styling following "${theme.title}" color & lighting palette`,
    `Acoustic sound system and event photographer coverage`,
  ];

  // 3. Recommended venue arrangements
  const venueArrangements = {
    recommendedType: venueType,
    layoutConcept: venueType === 'home_courtyard'
      ? 'Intimate courtyard arrangement with perimeter fairy-light canopies, centralized cake/stage podium, and cozy lounge pods'
      : 'Grand banquet configuration with dual welcome arches, perimeter buffet counters, dance floor / stage riser, and 10-seater round guest tables',
    capacityPlanning: `Comfortably accommodates ${guestCount} attendees with 20% circulation clearance and dedicated registration/reception entryway.`,
  };

  // 4. Guest & attendance planning
  const guestPlanning = {
    targetCount: guestCount,
    estimatedParties: Math.round(guestCount / 2.3),
    tableArrangements: `${Math.ceil(guestCount / 8)} reserved tables with custom name placards and dietary tags.`,
  };

  // 5. Budget breakdown
  const budgetCats = getDefaultBudgetCategories(eventType, targetBudget, guestCount);
  const budgetBreakdown = budgetCats.map((cat) => {
    const catTotal = cat.items.reduce((s, it) => s + it.estimatedTotal, 0);
    return {
      category: cat.id,
      categoryName: cat.name,
      amount: catTotal,
      percentage: Math.round((catTotal / targetBudget) * 100),
      assumptions: `Based on ₹${Math.round(catTotal / guestCount)} per guest benchmark for ${eventType}`,
    };
  });

  // 6. Food & catering recommendations
  const cateringRecommendations = {
    mealType: params.foodPreference || 'Gourmet Vegetarian & Live Counters',
    recommendedMenu: [
      'Welcome Drinks: Mint Mojito & Spiced Saffron Kahwa',
      'Live Appetizers: Crisp paneer tikka, crispy corn baskets, woodfired mini sliders',
      'Main Course: 2 seasonal curries, artisanal dal makhani, assorted breads & fragrant biryani',
      'Desserts: Warm gulab jamun with rabdi, gourmet gelato station',
    ],
    plateBuffer: Math.max(10, Math.round(guestCount * 0.1)),
    estimatedPerPlate: Math.round((targetBudget * 0.35) / guestCount),
  };

  // 7. Decoration & theme concepts
  const decorConcepts = {
    themeTitle: theme.title,
    palette: theme.palette.names,
    keyElements: theme.decorElements,
    lightingVibe: 'Warm ambient amber uplighting with fairy-light canopy drops',
  };

  // 8. Return-gift recommendations
  const returnGiftRecommendations = {
    description: 'Curated organic sweet box / artisanal brass keepsakes packaged in custom foil-stamped pouches',
    perUnitEstimate: 350,
    recommendedQuantity: Math.round(guestCount / 2.2),
  };

  // 9. Entertainment
  const entertainmentRecommendations = [
    'Professional Emcee to anchor timeline, toasts, and cake-cutting',
    'Curated Spotify / live acoustic musician performance during dinner',
    'Custom photo-booth with personalized celebration props and instant printouts',
  ];

  // 10. Timeline
  const timeline = [
    { timeframe: '30 Days Before', milestone: 'Lock Venue & Catering Contract', tasks: ['Sign venue lease', 'Finalize food tasting'] },
    { timeframe: '15 Days Before', milestone: 'Dispatch Digital Invitations', tasks: ['Generate GuestPass links', 'Collect RSVP meal preferences'] },
    { timeframe: '3 Days Before', milestone: 'Reconcile Final Headcount', tasks: ['Lock final plate count with caterer', 'Assemble return gifts'] },
    { timeframe: 'Event Day', milestone: 'Execution & Reception Check-in', tasks: ['Venue decor setup by 3 PM', 'Terminal check-in active at door'] },
  ];

  // 11. Important Tasks
  const importantTasks = [
    { title: 'Confirm catering menu and plate guarantees', priority: 'critical' as const, deadlineDaysBefore: 10, category: 'Catering' },
    { title: 'Approve final floral/balloon backdrop design', priority: 'high' as const, deadlineDaysBefore: 14, category: 'Decor' },
    { title: 'Deploy organizer QR check-in terminal', priority: 'high' as const, deadlineDaysBefore: 2, category: 'Operations' },
    { title: 'Verify sound rigging and party playlist', priority: 'medium' as const, deadlineDaysBefore: 3, category: 'Entertainment' },
  ];

  // 12. Risks & Contingencies
  const risksAndContingencies = [
    {
      risk: 'Unannounced guest party expansion beyond target count',
      mitigation: `Pre-configured ${cateringRecommendations.plateBuffer} buffer plates and extra seating reserved in service area.`,
    },
    {
      risk: 'Weather or outdoor temperature fluctuations',
      mitigation: 'Covered canopy provision with industrial mist fans or patio heaters on standby.',
    },
    {
      risk: 'Last-minute vendor delay during setup',
      mitigation: 'Setup call time scheduled 4 hours prior to guest arrival with designated floor captain.',
    },
  ];

  return {
    id: `proposal-${Date.now()}`,
    eventType,
    title: `${params.title || `${guestCount}-Guest ${eventType.toUpperCase()} Celebration`}`,
    tagline: `Curated celebration in ${city} for ${guestCount} guests`,
    guestCount,
    targetBudget,
    city,
    date: eventDate,
    overview,
    requirements,
    venueArrangements,
    guestPlanning,
    budgetBreakdown,
    cateringRecommendations,
    decorConcepts,
    returnGiftRecommendations,
    entertainmentRecommendations,
    timeline,
    importantTasks,
    risksAndContingencies,
  };
}
