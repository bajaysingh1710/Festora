/**
 * Make-Life-Vibe prompt, input sanitization and security layer
 * Protects against prompt injection, control characters, XSS script tags,
 * and prototype pollution.
 */
export function sanitizeForPrompt(text: string, maxLength: number = 500): string {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(/[\x00-\x08\x0B-\x1F\x7F]/g, '') // strip control characters
    .replace(/`{3,}/g, '')                     // strip triple-backtick markdown escapes
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // strip script tags
    .replace(/<style[^>]*>.*?<\/style>/gi, '')   // strip style tags
    .replace(/\[\/?INST\]/gi, '')               // strip LLM instruct jailbreak tokens
    .replace(/<\|im_start\|>|<\|im_end\|>/gi, '') // strip ChatML jailbreak tokens
    .replace(/ignore (?:all )?previous instructions/gi, '[filtered]') // prompt injection guard
    .trim()
    .slice(0, maxLength);
}

export function sanitizePlainText(text: string, maxLength: number = 300): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .slice(0, maxLength);
}

export function sanitizeObjectKey(key: string): boolean {
  // Prevent prototype pollution
  return key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
}
