import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatTime,
  formatNumber,
  formatPercentage,
} from '../lib/formatters';

describe('Shared Formatting Utilities', () => {
  describe('formatCurrency', () => {
    it('formats standard rupee amounts with Indian comma grouping', () => {
      expect(formatCurrency(250000)).toBe('₹2,50,000');
      expect(formatCurrency(1500)).toBe('₹1,500');
      expect(formatCurrency(0)).toBe('₹0');
    });

    it('handles compact format accurately', () => {
      expect(formatCurrency(250000, { compact: true })).toBe('₹2.5L');
      expect(formatCurrency(15000000, { compact: true })).toBe('₹1.5Cr');
      expect(formatCurrency(85000, { compact: true })).toBe('₹85k');
      expect(formatCurrency(750, { compact: true })).toBe('₹750');
    });

    it('handles negative, null, and NaN safely', () => {
      expect(formatCurrency(-50000)).toBe('₹-50,000');
      expect(formatCurrency(null)).toBe('₹0');
      expect(formatCurrency(undefined)).toBe('₹0');
      expect(formatCurrency(NaN)).toBe('₹0');
    });

    it('supports omitting the currency symbol', () => {
      expect(formatCurrency(100000, { showSymbol: false })).toBe('1,00,000');
    });
  });

  describe('formatDate', () => {
    it('formats valid ISO date into full readable date', () => {
      const formatted = formatDate('2026-12-15', 'full');
      expect(formatted).toContain('December');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2026');
    });

    it('formats medium and short date variants', () => {
      expect(formatDate('2026-12-15', 'medium')).toBe('Dec 15, 2026');
      expect(formatDate('2026-12-15', 'short')).toBe('12/15/26');
    });

    it('gracefully handles null, undefined, or invalid dates', () => {
      expect(formatDate(null)).toBe('Date TBD');
      expect(formatDate(undefined)).toBe('Date TBD');
      expect(formatDate('invalid-date')).toBe('invalid-date');
    });
  });

  describe('formatTime', () => {
    it('converts 24h time to 12h AM/PM representation', () => {
      expect(formatTime('18:00')).toBe('6:00 PM');
      expect(formatTime('09:30')).toBe('9:30 AM');
      expect(formatTime('12:00')).toBe('12:00 PM');
      expect(formatTime('00:45')).toBe('12:45 AM');
    });

    it('handles null, undefined, or arbitrary strings safely', () => {
      expect(formatTime(null)).toBe('');
      expect(formatTime(undefined)).toBe('');
      expect(formatTime('TBD')).toBe('TBD');
    });
  });

  describe('formatNumber and formatPercentage', () => {
    it('formats numbers with commas', () => {
      expect(formatNumber(1000000)).toBe('10,00,000');
      expect(formatNumber(null)).toBe('0');
    });

    it('formats percentages correctly', () => {
      expect(formatPercentage(25.67, 1)).toBe('25.7%');
      expect(formatPercentage(100)).toBe('100%');
    });
  });
});

