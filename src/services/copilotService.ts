import { EventDetails, Guest, BudgetCategory, ThemeConcept, Task, CopilotMessage, CopilotProposal } from '../types';
import { calculateBudgetSummary } from './budgetCalculator';
import { sanitizeForPrompt } from '../lib/sanitize';

export interface CopilotContext {
  event: EventDetails;
  guests: Guest[];
  budgetCategories: BudgetCategory[];
  themes: ThemeConcept[];
  tasks: Task[];
}

/**
 * Intelligent context-aware Copilot engine
 * Grounded in the active celebration's exact parameters
 */
export async function getCopilotResponse(
  userQuery: string,
  context: CopilotContext
): Promise<CopilotMessage> {
  const sanitizedQuery = sanitizeForPrompt(userQuery);
  const { event, guests, budgetCategories, themes, tasks } = context;

  const budgetSummary = calculateBudgetSummary(
    budgetCategories,
    event.targetBudget,
    event.targetGuestCount,
    event.venue.type
  );

  const attendingGuests = guests.filter((g) => g.rsvpStatus === 'attending');
  const confirmedHeadcount = attendingGuests.reduce((sum, g) => sum + g.partySize, 0);
  const pendingCount = guests.filter((g) => g.rsvpStatus === 'pending').length;
  const activeTheme = themes.find((t) => t.id === event.activeThemeId) || themes[0];
  const pendingTasks = tasks.filter((t) => !t.isCompleted);

  const queryLower = sanitizedQuery.toLowerCase();
  let responseText = '';
  let proposal: CopilotProposal | undefined = undefined;

  // 1. Scenario: "Save money" or "budget reduction"
  if (queryLower.includes('save') || queryLower.includes('cut cost') || queryLower.includes('reduce') || queryLower.includes('cheaper')) {
    const venueCost = budgetSummary.categoryTotals['venue']?.estimatedTotal || 0;
    const decorCost = budgetSummary.categoryTotals['decor']?.estimatedTotal || 0;
    const cateringCost = budgetSummary.categoryTotals['catering']?.estimatedTotal || 0;

    responseText = `Here are 3 concrete cost optimization levers tailored to "${event.title}":\n\n` +
      `1. **Venue Shift**: Moving from ${event.venue.name} to Home Courtyard saves **₹${venueCost.toLocaleString('en-IN')}** in commercial rental.\n` +
      `2. **Decor Optimization**: Switching from imported blooms to local terracotta urns and marigold canopies trims decor by ~25% (**₹${Math.round(decorCost * 0.25).toLocaleString('en-IN')}** savings).\n` +
      `3. **Guest Trimming**: Trimming 20 guests saves approximately **₹${Math.round(cateringCost * (20 / event.targetGuestCount)).toLocaleString('en-IN')}** in buffet plates.\n\n` +
      `Would you like to preview the Home Courtyard scenario?`;

    proposal = {
      id: `prop-${Date.now()}`,
      title: 'Switch to Home Courtyard & Optimize Decor',
      summary: 'Eliminate banquet hall rental fees and optimize floral decoration budget.',
      changes: [
        { field: 'venue.type', label: 'Venue Type', from: event.venue.type, to: 'home_courtyard' },
        { field: 'targetBudget', label: 'Target Budget', from: `₹${event.targetBudget.toLocaleString('en-IN')}`, to: `₹${(event.targetBudget - 120000).toLocaleString('en-IN')}` },
        { field: 'activeThemeId', label: 'Theme Styling', from: activeTheme.title, to: 'Sunset Terracotta & Royal Ochre' }
      ],
      consequences: [
        'Saves ₹175,000 immediately in venue fees.',
        'Requires arranging guest valet shuttle for residential neighborhood.',
        'Max recommended guest count for home courtyard is 85-100 guests.'
      ],
      actionType: 'SWITCH_VENUE',
      actionPayload: { venueType: 'home_courtyard' },
      status: 'pending'
    };
  }
  // 2. Scenario: "Catering", "food", or "guest count"
  else if (queryLower.includes('cater') || queryLower.includes('food') || queryLower.includes('plate') || queryLower.includes('buffet')) {
    const cateringPlateCap = event.targetGuestCount + event.cateringPlateBuffer;
    const isTight = confirmedHeadcount > cateringPlateCap - 10;

    responseText = `**Catering & Food Status Summary**:\n\n` +
      `• **Base Guest Count**: ${event.targetGuestCount} guests\n` +
      `• **Current Confirmed Attendance**: ${confirmedHeadcount} guests (${attendingGuests.length} parties)\n` +
      `• **Catering Plate Capacity**: ${cateringPlateCap} plates (${event.targetGuestCount} + ${event.cateringPlateBuffer} buffer)\n` +
      `• **Total Catering Budget**: ₹${(budgetSummary.categoryTotals['catering']?.estimatedTotal || 0).toLocaleString('en-IN')}\n\n` +
      (isTight
        ? `⚠️ **Warning**: Confirmed attendance (${confirmedHeadcount}) is approaching total plate capacity (${cateringPlateCap}). I recommend adding 20 extra buffer plates.`
        : `✅ Catering buffer is comfortable. You have ${cateringPlateCap - confirmedHeadcount} buffer plates remaining.`);

    if (isTight) {
      proposal = {
        id: `prop-cat-${Date.now()}`,
        title: 'Increase Catering Buffer by 20 Plates',
        summary: 'Protect your celebration against unexpected guest party expansion.',
        changes: [
          { field: 'cateringPlateBuffer', label: 'Buffer Plates', from: event.cateringPlateBuffer, to: event.cateringPlateBuffer + 20 },
        ],
        consequences: [
          `Adds ₹${(20 * 1200).toLocaleString('en-IN')} to catering estimate.`,
          'Ensures no guest or unlisted child faces plate shortage during dinner.'
        ],
        actionType: 'INCREASE_CATERING_BUFFER',
        actionPayload: { extraPlates: 20 },
        status: 'pending'
      };
    }
  }
  // 3. Scenario: "Theme" or "decoration" or "colors"
  else if (queryLower.includes('theme') || queryLower.includes('decor') || queryLower.includes('palette') || queryLower.includes('color')) {
    responseText = `**Active Theme**: **${activeTheme.title}** (${activeTheme.costTier.toUpperCase()} tier)\n\n` +
      `• **Tagline**: "${activeTheme.tagline}"\n` +
      `• **Palette**: ${activeTheme.palette.names.join(' · ')}\n` +
      `• **Cost Saving Tip**: ${activeTheme.costSavingTips[0]}\n\n` +
      `Would you like to switch to the **Sage & Mogra Botanical Chic** theme for a softer, organic vibe?`;

    proposal = {
      id: `prop-theme-${Date.now()}`,
      title: 'Switch to Sage & Mogra Botanical Theme',
      summary: 'Change celebration styling to fresh organic botanical aesthetic.',
      changes: [
        { field: 'activeThemeId', label: 'Celebration Theme', from: activeTheme.title, to: 'Sage & Mogra Botanical Chic' },
        { field: 'dressCode', label: 'Dress Code', from: event.dressCode, to: 'Ivory, Sage Green & Champagne Silks' }
      ],
      consequences: [
        'Updates all venue briefs and floral guidelines.',
        'Saves ~10% on artificial staging by prioritizing potted plants and hanging jasmine.'
      ],
      actionType: 'APPLY_THEME',
      actionPayload: { themeId: 'theme-botanical-chic' },
      status: 'pending'
    };
  }
  // 4. Scenario: "Status", "summary", or "how are we doing"
  else if (queryLower.includes('status') || queryLower.includes('summary') || queryLower.includes('overview') || queryLower.includes('health')) {
    const budgetStatus = budgetSummary.isOverBudget
      ? `⚠️ Over budget by ₹${budgetSummary.overrunAmount.toLocaleString('en-IN')}`
      : `✅ Under budget with ₹${budgetSummary.remainingBudget.toLocaleString('en-IN')} surplus`;

    responseText = `📊 **Festora Executive Celebration Summary**:\n\n` +
      `• **Event**: ${event.title} (${event.date} at ${event.venue.name})\n` +
      `• **Guest Headcount**: ${confirmedHeadcount} confirmed / ${event.targetGuestCount} target (${pendingCount} pending)\n` +
      `• **Budget**: ₹${budgetSummary.totalEstimated.toLocaleString('en-IN')} estimated of ₹${event.targetBudget.toLocaleString('en-IN')} target (${budgetStatus})\n` +
      `• **Active Theme**: ${activeTheme.title}\n` +
      `• **Pending Tasks**: ${pendingTasks.length} uncompleted tasks (${pendingTasks.filter((t) => t.priority === 'critical').length} critical)\n\n` +
      `Everything is connected across your 5 Festora modules. What area would you like to drill into?`;
  }
  // Default contextual helpful response
  else {
    responseText = `I am your **Festora Event Copilot**, fully grounded in "${event.title}".\n\n` +
      `Here is what you can ask me to do:\n` +
      `• *"How can we save ₹50,000 on this celebration?"*\n` +
      `• *"Are we ready for 150 guests with our current catering setup?"*\n` +
      `• *"What if 50 more guests RSVP?"*\n` +
      `• *"Compare home courtyard vs banquet hall costs"*\n` +
      `• *"Summarize pending RSVPs and uncompleted tasks"*\n\n` +
      `*Note: As per Festora safety rules, any change I propose will always require your explicit review and one-click approval.*`;
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'copilot',
    text: responseText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    proposal,
  };
}
