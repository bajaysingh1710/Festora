import {
  EventDetails,
  Guest,
  BudgetCategory,
  ThemeConcept,
  Task,
  CopilotMessage,
} from '../types';
import { callGeminiOrFallback } from './geminiService';
import { sanitizeForPrompt } from '../lib/sanitize';

export interface CopilotContext {
  event?: EventDetails | null;
  guests: Guest[];
  budgetCategories: BudgetCategory[];
  themes: ThemeConcept[];
  tasks: Task[];
  conversationHistory?: CopilotMessage[];
}

/**
 * Intelligent, context-aware Festora Event Copilot engine.
 * Powered by Google Gemini 2.0 Flash with smart autonomous fallback.
 */
export async function getCopilotResponse(
  userQuery: string,
  context: CopilotContext
): Promise<CopilotMessage> {
  const sanitizedQuery = sanitizeForPrompt(userQuery, 1000);
  return callGeminiOrFallback(sanitizedQuery, {
    event: context.event,
    guests: context.guests || [],
    budgetCategories: context.budgetCategories || [],
    themes: context.themes || [],
    tasks: context.tasks || [],
    conversationHistory: context.conversationHistory || [],
  });
}
