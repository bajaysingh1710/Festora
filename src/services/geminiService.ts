import { GoogleGenAI } from '@google/genai';
import {
  EventDetails,
  Guest,
  BudgetCategory,
  ThemeConcept,
  Task,
  CopilotMessage,
  StructuredEventProposal,
  VenueType,
} from '../types';
import { StorageService } from './storageService';
import {
  extractEventDetailsFromConversation,
  generateStructuredProposal,
} from './smartPlanner';

export interface GeminiCopilotContext {
  event?: EventDetails | null;
  guests: Guest[];
  budgetCategories: BudgetCategory[];
  themes: ThemeConcept[];
  tasks: Task[];
  conversationHistory: CopilotMessage[];
}

export async function callGeminiOrFallback(
  userQuery: string,
  context: GeminiCopilotContext
): Promise<CopilotMessage> {
  const settings = StorageService.getAISettings();
  const apiKey = settings.apiKey;

  // If user has provided a valid Gemini API key, use official Google GenAI SDK
  if (apiKey && apiKey.trim().length > 15) {
    try {
      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
      const currentEventInfo = context.event
        ? `Active Event: "${context.event.title}" (${context.event.eventType}, ${context.event.targetGuestCount} guests, ₹${context.event.targetBudget} budget, ${context.event.venue.type} in ${context.event.venue.city})`
        : 'No event currently active. Interview the user to plan a new celebration.';

      const systemInstruction = `You are Festora's AI Event Copilot — an empathetic, creative, and operationally rigorous celebration designer.
Festora plans all event types: Weddings, Birthdays, Engagements, Anniversaries, College Fests, Corporate Summits, and Family Celebrations.
${currentEventInfo}

Rules:
1. Conduct an intelligent natural conversation. If details are missing, ask 2-3 relevant follow-up questions tailored to the event type.
2. Never ask for details already provided by the user.
3. If the user provided enough information (e.g. event type, guest count, approximate budget/city), provide a structured event proposal.
4. Support follow-up modifications like "make it more luxurious", "reduce cost", "what if 30 more guests arrive", "suggest cheaper decor".
5. Keep your tone warm, elegant, and celebratory. Format with markdown headings and bullet points.`;

      const contents = [
        { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser request: ${userQuery}` }] },
      ];

      const response = await ai.models.generateContent({
        model: settings.model || 'gemini-2.0-flash',
        contents,
      });

      const responseText = response.text || '';
      if (responseText.trim()) {
        // Check if query implies creating/finalizing a proposal
        const extracted = extractEventDetailsFromConversation([
          ...context.conversationHistory.map((m) => ({ sender: m.sender, text: m.text })),
          { sender: 'user', text: userQuery },
        ]);

        let structuredProposal: StructuredEventProposal | undefined = undefined;
        if (extracted.eventType && (extracted.guestCount || context.event?.targetGuestCount)) {
          const lower = userQuery.toLowerCase();
          if (
            lower.includes('plan') ||
            lower.includes('proposal') ||
            lower.includes('create') ||
            lower.includes('birthday') ||
            lower.includes('wedding') ||
            lower.includes('fest') ||
            lower.includes('party') ||
            context.conversationHistory.length >= 2
          ) {
            structuredProposal = generateStructuredProposal({
              eventType: extracted.eventType || context.event?.eventType || 'birthday',
              guestCount: extracted.guestCount || context.event?.targetGuestCount || 100,
              budget: extracted.budget || context.event?.targetBudget,
              city: extracted.city || context.event?.venue.city,
              venuePreference: extracted.venuePreference || context.event?.venue.type,
              foodPreference: extracted.foodPreference,
            });
          }
        }

        return {
          id: `msg-${Date.now()}`,
          sender: 'copilot',
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          structuredProposal,
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart local planning engine:', err);
    }
  }

  // Graceful smart local planning engine (works offline with zero setup)
  return runSmartLocalCopilot(userQuery, context);
}

function runSmartLocalCopilot(
  userQuery: string,
  context: GeminiCopilotContext
): CopilotMessage {
  const queryLower = userQuery.toLowerCase().trim();
  const allMessages = [
    ...context.conversationHistory.map((m) => ({ sender: m.sender, text: m.text })),
    { sender: 'user', text: userQuery },
  ];

  const extracted = extractEventDetailsFromConversation(allMessages);
  const event = context.event;

  // 1. User wants to plan a new event (e.g., "Plan a birthday party for 200 people")
  if (
    queryLower.includes('plan a') ||
    queryLower.includes('organize a') ||
    queryLower.includes('planning a') ||
    queryLower.includes('birthday party for') ||
    queryLower.includes('wedding for') ||
    queryLower.includes('college fest') ||
    queryLower.includes('corporate event') ||
    (!event && (extracted.eventType || extracted.guestCount))
  ) {
    const eventType = extracted.eventType || 'birthday';
    const guestCount = extracted.guestCount || 100;
    const city = extracted.city || 'your city';

    // Generate comprehensive 12-section proposal
    const proposal = generateStructuredProposal({
      eventType,
      guestCount,
      budget: extracted.budget,
      city: extracted.city,
      venuePreference: extracted.venuePreference,
      foodPreference: extracted.foodPreference,
    });

    let followUpQuestions: string[] = [];
    if (!extracted.city) followUpQuestions.push('Which city will this celebration take place in?');
    if (!extracted.venuePreference) followUpQuestions.push('Do you prefer a function hall, home courtyard, or outdoor space?');
    if (!extracted.foodPreference) followUpQuestions.push('Would you prefer vegetarian, non-vegetarian, or a hybrid spread?');
    if (!extracted.budget) followUpQuestions.push(`Do you have a target budget in mind (e.g. ₹${(guestCount * 1200).toLocaleString('en-IN')})?`);

    const responseText = `🎉 I'm thrilled to design your **${eventType.toUpperCase()}** for **${guestCount} guests**${extracted.city ? ` in ${extracted.city}` : ''}!\n\n` +
      `I have synthesized a complete **12-Section Event Proposal** below — covering venue layouts, a balanced budget breakdown, multi-course culinary planning, visual styling, timelines, and risk mitigations.\n\n` +
      (followUpQuestions.length > 0
        ? `To fine-tune this further, you can answer or skip any of these:\n` +
          followUpQuestions.map((q, idx) => `• ${q}`).join('\n') + `\n\n`
        : '') +
      `Review the proposal below and click **"Approve & Initialize Event"** to instantiate your dedicated Festora workspace!`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'copilot',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      structuredProposal: proposal,
      suggestedQuestions: [
        'Make it more luxurious',
        'Can we reduce the budget by 20%?',
        'Change venue to outdoors',
        'Add live DJ & cocktail bar',
      ],
    };
  }

  // 2. "Make it more luxurious"
  if (queryLower.includes('luxurious') || queryLower.includes('luxury') || queryLower.includes('premium') || queryLower.includes('grand')) {
    const currentBudget = event?.targetBudget || 300000;
    const upgradedBudget = Math.round(currentBudget * 1.35);

    const text = `✨ **Elevating to Luxury Tier Styling & Experience**:\n\n` +
      `Here is how we transform the celebration into an ultra-luxury experience:\n\n` +
      `1. **Venue & Ambience**: Switch to premium ballroom or heritage lawns with architectural warm amber wash.\n` +
      `2. **Culinary Upgrades**: Introduce live gourmet counters (truffle pasta, artisanal mocktails/cocktails, imported dessert gelato bar).\n` +
      `3. **Visual Aesthetics**: Upgrade stage backdrop to custom acrylic monogramming, suspended florals, and pin-spot table lighting.\n` +
      `4. **Guest Keepsakes**: Handcrafted brass urlis with organic saffron dry-fruit hampers.\n\n` +
      `Would you like to apply this luxury upgrade (+₹${(upgradedBudget - currentBudget).toLocaleString('en-IN')})?`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'copilot',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      proposal: event
        ? {
            id: `prop-lux-${Date.now()}`,
            title: 'Upgrade Celebration to Luxury Tier',
            summary: 'Enhance catering spread, add premium stage lighting, and upgrade guest keepsake hampers.',
            changes: [
              { field: 'targetBudget', label: 'Target Budget', from: `₹${event.targetBudget.toLocaleString('en-IN')}`, to: `₹${upgradedBudget.toLocaleString('en-IN')}` },
              { field: 'activeThemeId', label: 'Styling Tier', from: 'Balanced', to: 'Luxury Tier' },
            ],
            consequences: [
              `Adds ₹${(upgradedBudget - currentBudget).toLocaleString('en-IN')} across culinary and stage ambience.`,
              'Elevates per-guest dining experience to premium benchmark.',
            ],
            actionType: 'UPDATE_BUDGET',
            actionPayload: { targetBudget: upgradedBudget },
            status: 'pending',
          }
        : undefined,
      suggestedQuestions: ['What if 30 more guests arrive?', 'Show budget breakdown', 'Suggest unique decoration'],
    };
  }

  // 3. "Reduce budget" or "cheaper decoration" or "save money"
  if (
    queryLower.includes('reduce') ||
    queryLower.includes('cheaper') ||
    queryLower.includes('save') ||
    queryLower.includes('cut cost') ||
    queryLower.includes('lower budget')
  ) {
    const currentBudget = event?.targetBudget || 200000;
    const reducedBudget = Math.round(currentBudget * 0.8);
    const savings = currentBudget - reducedBudget;

    const text = `💡 **Actionable Cost-Optimization Levers (Save ₹${savings.toLocaleString('en-IN')})**:\n\n` +
      `1. **Decor Optimization (Saves ~30%)**: Replace imported florals and structural plywood with seasonal blooms, warm fairy light curtains, and potted foliage that can be reused.\n` +
      `2. **Catering Streamlining (Saves ~18%)**: Consolidate live counters from 4 to 2 high-impact crowd favorites (e.g. chaat & woodfired sliders) without compromising dinner buffet quality.\n` +
      `3. **Digital Pass Distribution**: Eliminate physical envelope cards and rely 100% on Festora's scannable digital GuestPass.\n\n` +
      `I can apply this 20% budget reduction to keep expenses comfortably below target.`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'copilot',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      proposal: event
        ? {
            id: `prop-save-${Date.now()}`,
            title: 'Apply 20% Budget Optimization',
            summary: 'Trim non-essential staging markups and streamline catering live stations.',
            changes: [
              { field: 'targetBudget', label: 'Target Budget', from: `₹${event.targetBudget.toLocaleString('en-IN')}`, to: `₹${reducedBudget.toLocaleString('en-IN')}` },
            ],
            consequences: [
              `Saves ₹${savings.toLocaleString('en-IN')} instantly.`,
              'Protects emergency buffer while retaining celebratory charm.',
            ],
            actionType: 'UPDATE_BUDGET',
            actionPayload: { targetBudget: reducedBudget },
            status: 'pending',
          }
        : undefined,
      suggestedQuestions: ['Compare home courtyard vs banquet hall', 'How are RSVPs doing?', 'Create task checklist'],
    };
  }

  // 4. "What if 30 more guests arrive?" / Guest count adjustments
  const whatIfGuestMatch = queryLower.match(/what if (\d+)\s*(?:more|extra)?\s*guests?/i) ||
    queryLower.match(/add (\d+)\s*guests?/i);
  if (whatIfGuestMatch || queryLower.includes('more guests')) {
    const extraGuests = whatIfGuestMatch ? parseInt(whatIfGuestMatch[1], 10) : 30;
    const currentCount = event?.targetGuestCount || 100;
    const newCount = currentCount + extraGuests;
    const perPlateEstimate = 1200;
    const additionalCost = extraGuests * perPlateEstimate;

    const text = `📊 **Impact Analysis: ${extraGuests} Additional Guests (${currentCount} → ${newCount} guests)**:\n\n` +
      `• **Culinary Impact**: Requires **${extraGuests} extra buffet plates** (~₹${additionalCost.toLocaleString('en-IN')}).\n` +
      `• **Seating Impact**: Needs **${Math.ceil(extraGuests / 8)} additional tables** and chair rentals (~₹${(extraGuests * 150).toLocaleString('en-IN')}).\n` +
      `• **Catering Buffer**: Current buffer is ${event?.cateringPlateBuffer || 15} plates. With ${extraGuests} extra guests, we recommend increasing the buffer by at least 10 plates.\n` +
      `• **Return Gifts**: Additional ~${Math.round(extraGuests / 2)} family keepsake gift hampers (~₹${(Math.round(extraGuests / 2) * 350).toLocaleString('en-IN')}).\n\n` +
      `Total estimated incremental expense: **₹${(additionalCost + extraGuests * 300).toLocaleString('en-IN')}**.\n\n` +
      `Would you like to apply this new guest headcount?`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'copilot',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      proposal: event
        ? {
            id: `prop-guest-${Date.now()}`,
            title: `Increase Guest Count to ${newCount} Guests`,
            summary: `Scale catering buffet, seating tables, and favors for ${extraGuests} extra guests.`,
            changes: [
              { field: 'targetGuestCount', label: 'Guest Count', from: currentCount, to: newCount },
              { field: 'cateringPlateBuffer', label: 'Catering Buffer', from: event.cateringPlateBuffer, to: event.cateringPlateBuffer + 10 },
            ],
            consequences: [
              `Increases estimated catering expenses by ~₹${additionalCost.toLocaleString('en-IN')}.`,
              'Ensures zero plate deficits or seating shortages at reception.',
            ],
            actionType: 'ADJUST_GUEST_COUNT',
            actionPayload: { guestCount: newCount, extraPlates: 10 },
            status: 'pending',
          }
        : undefined,
      suggestedQuestions: ['How can we save ₹50,000?', 'Compare home vs banquet hall', 'Check operational health'],
    };
  }

  // 5. "Change the venue to outdoors" or "Switch to home courtyard"
  if (queryLower.includes('outdoor') || queryLower.includes('lawn') || queryLower.includes('home courtyard') || queryLower.includes('courtyard')) {
    const isOutdoor = queryLower.includes('outdoor') || queryLower.includes('lawn');
    const newVenueType: VenueType = isOutdoor ? 'outdoor_lawn' : 'home_courtyard';

    const text = isOutdoor
      ? `🌳 **Switching to Outdoor Lawn & Garden Venue**:\n\n` +
        `• **Ambience**: Fairy light canopies, festoon pathways, romantic sunset natural lighting.\n` +
        `• **Logistics**: Requires weather-contingency covered canopy and generator backup for audio rigging.\n` +
        `• **Capacity**: Ample space for ${event?.targetGuestCount || 100} guests with spacious lounge zones.\n\n` +
        `Would you like to update the venue configuration to Outdoor Lawn?`
      : `🏡 **Switching to Home Courtyard / Terrace**:\n\n` +
        `• **Savings**: Eliminates banquet rental fees (~₹150,000 to ₹250,000 saved).\n` +
        `• **Vibe**: Highly personal, warm intimate celebration with terracotta urns and marigolds.\n` +
        `• **Logistics**: Requires residential valet shuttle and catering staging area.\n\n` +
        `Would you like to update the venue configuration to Home Courtyard?`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'copilot',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      proposal: event
        ? {
            id: `prop-venue-${Date.now()}`,
            title: `Switch Venue to ${isOutdoor ? 'Outdoor Lawn' : 'Home Courtyard'}`,
            summary: `Update venue profile, layout briefs, and associated budget adjustments.`,
            changes: [
              { field: 'venue.type', label: 'Venue Type', from: event.venue.type, to: newVenueType },
            ],
            consequences: [
              isOutdoor ? 'Enhances open-air aesthetics; adds weather buffer contingency.' : 'Eliminates commercial rental fees; saves substantial budget.',
            ],
            actionType: 'SWITCH_VENUE',
            actionPayload: { venueType: newVenueType },
            status: 'pending',
          }
        : undefined,
      suggestedQuestions: ['Make it more luxurious', 'Reduce budget', 'Suggest unique decoration'],
    };
  }

  // 6. "Suggest something unique"
  if (queryLower.includes('unique') || queryLower.includes('special') || queryLower.includes('creative idea')) {
    const text = `🌟 **3 Unique & Memorable Concepts for Your Celebration**:\n\n` +
      `1. **Live Audio Guestbook**: Replace the traditional paper register with a vintage rotary telephone where guests pick up the receiver and leave heartfelt recorded voice messages.\n` +
      `2. **Custom Scented Welcome Station**: A signature misting entryway infused with natural vetiver and jasmine, pairing olfactory memories with visual decor.\n` +
      `3. **Interactive Food Grazing Table**: A 20-foot artisanal grazing spread featuring local artisanal cheeses, warm baked breads, dips, honeycomb, and edible floral garnishes.\n\n` +
      `Would you like to incorporate any of these into your event plan?`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'copilot',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: ['How can we save ₹50,000?', 'What if 30 more guests arrive?', 'Show task checklist'],
    };
  }

  // 7. "Create a checklist" or "tasks"
  if (queryLower.includes('checklist') || queryLower.includes('tasks') || queryLower.includes('to do') || queryLower.includes('todo')) {
    const text = `📋 **Core Celebration Milestone Checklist**:\n\n` +
      `• [ ] **Catering**: Menu tasting & locking plate capacity with caterer (Critical · 10 days before)\n` +
      `• [ ] **Styling**: Finalize backdrop & photo-booth design with decorator (High · 14 days before)\n` +
      `• [ ] **Passes**: Send digital GuestPass links to confirmed attendees (High · 5 days before)\n` +
      `• [ ] **Operations**: Configure organizer check-in scanner on phone/tablet (High · 2 days before)\n` +
      `• [ ] **Entertainment**: Review playlist & sound rigging with DJ/Emcee (Medium · 3 days before)\n\n` +
      `These are synchronized with your Event Operations module.`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'copilot',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: ['Are we ready for 150 guests?', 'How can we save money?', 'Show budget breakdown'],
    };
  }

  // 8. General open-ended fallback
  const eventTitle = event ? `"${event.title}"` : 'your upcoming celebration';
  const text = `I am your **Festora Event Copilot**, fully synchronized with ${eventTitle}.\n\n` +
    `You can ask me anything in natural language:\n` +
    `• *"Plan a birthday party for 200 people with live games"*\n` +
    `• *"How can we save ₹50,000 on this celebration?"*\n` +
    `• *"What if 30 more guests arrive?"*\n` +
    `• *"Make it more luxurious"* or *"Change venue to outdoor"*\n` +
    `• *"Suggest unique celebration concepts"*\n\n` +
    `Any proposed change will be presented as a clear proposal card for your review and one-click approval.`;

  return {
    id: `msg-${Date.now()}`,
    sender: 'copilot',
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedQuestions: [
      'How can we save ₹50,000 on this celebration?',
      'What if 30 more guests arrive?',
      'Make it more luxurious',
      'Compare home courtyard vs banquet hall',
    ],
  };
}
