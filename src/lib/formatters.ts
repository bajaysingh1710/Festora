/**
 * Festora Shared Formatting Utilities
 * Deterministic formatting for currency, dates, percentages, and metrics.
 */

/**
 * Formats a numeric amount into Indian Rupee (INR) currency representation.
 * Handles negative amounts, zero, NaN, and compact notation (e.g. ₹250k).
 */
export function formatCurrency(
  amount: number | null | undefined,
  options: { compact?: boolean; showSymbol?: boolean } = {}
): string {
  const { compact = false, showSymbol = true } = options;
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const symbol = showSymbol ? '₹' : '';

  if (compact) {
    if (Math.abs(num) >= 10000000) {
      return `${symbol}${(num / 10000000).toFixed(1)}Cr`;
    }
    if (Math.abs(num) >= 100000) {
      return `${symbol}${(num / 100000).toFixed(1)}L`;
    }
    if (Math.abs(num) >= 1000) {
      return `${symbol}${Math.round(num / 1000)}k`;
    }
    return `${symbol}${num.toLocaleString('en-IN')}`;
  }

  return `${symbol}${num.toLocaleString('en-IN')}`;
}

/**
 * Formats an ISO date string (YYYY-MM-DD) into a human-readable celebration date.
 */
export function formatDate(
  dateStr: string | null | undefined,
  format: 'full' | 'medium' | 'short' = 'full'
): string {
  if (!dateStr) return 'Date TBD';
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return dateStr;

  if (format === 'full') {
    return parsed.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  if (format === 'medium') {
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
  });
}

/**
 * Formats a 24-hour time string (e.g. "18:00") into a clean 12-hour AM/PM string.
 */
export function formatTime(timeStr: string | null | undefined): string {
  if (!timeStr) return '';
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return timeStr;

  const hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${minutes} ${ampm}`;
}

/**
 * Formats a number with Indian comma grouping.
 */
export function formatNumber(val: number | null | undefined): string {
  const num = typeof val === 'number' && !isNaN(val) ? val : 0;
  return num.toLocaleString('en-IN');
}

/**
 * Formats a percentage value (0-100) with a '%' symbol.
 */
export function formatPercentage(val: number | null | undefined, decimals: number = 0): string {
  const num = typeof val === 'number' && !isNaN(val) ? val : 0;
  return `${num.toFixed(decimals)}%`;
}

