/**
 * Make-Life-Vibe prompt and input sanitization algorithm
 * Protects against prompt injection, control characters, and script tags
 */
export function sanitizeForPrompt(text: string, maxLength: number = 300): string {
  if (!text) return '';
  return text
    .replace(/[\x00-\x08\x0B-\x1F\x7F]/g, '') // control characters
    .replace(/`{3,}/g, '')                     // triple-backtick injection
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // script tags
    .trim()
    .slice(0, maxLength);
}

export function sanitizePlainText(text: string): string {
  if (!text) return '';
  return text.trim().replace(/[<>]/g, '');
}
