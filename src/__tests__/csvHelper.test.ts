import { describe, it, expect } from 'vitest';
import {
  parseCsvLine,
  parseGuestsFromCsv,
  escapeCsvField,
  serializeGuestsToCsv,
} from '../lib/csvHelper';
import { Guest } from '../types';

describe('CSV Helper & Security Utilities', () => {
  describe('parseCsvLine', () => {
    it('splits simple comma-separated fields', () => {
      const line = 'Arjun Verma,2,+919800011111,arjun@example.com';
      expect(parseCsvLine(line)).toEqual([
        'Arjun Verma',
        '2',
        '+919800011111',
        'arjun@example.com',
      ]);
    });

    it('respects quoted fields containing commas', () => {
      const line = '"Verma, Arjun & Maya",3,"+91 98000 11111",arjun@example.com';
      const fields = parseCsvLine(line);
      expect(fields[0]).toBe('Verma, Arjun & Maya');
      expect(fields[1]).toBe('3');
      expect(fields[2]).toBe('+91 98000 11111');
      expect(fields[3]).toBe('arjun@example.com');
    });

    it('handles escaped quotes inside quotes', () => {
      const line = '"Arjun ""The Host"" Verma",2';
      const fields = parseCsvLine(line);
      expect(fields[0]).toBe('Arjun "The Host" Verma');
    });
  });

  describe('parseGuestsFromCsv', () => {
    it('parses valid CSV rows with default fallbacks for optional fields', () => {
      const csv = `Name,PartySize,Phone,Email,Category,MealPreference
Rohan Sharma,4,+91 98765 43210,rohan@example.com,vip,vegetarian
Priya Sen,1,+91 98765 00000,priya@example.com,close_friends,non_vegetarian`;

      const guests = parseGuestsFromCsv(csv);
      expect(guests.length).toBe(2);

      expect(guests[0].name).toBe('Rohan Sharma');
      expect(guests[0].partySize).toBe(4);
      expect(guests[0].category).toBe('vip');
      expect(guests[0].mealPreference).toBe('vegetarian');

      expect(guests[1].name).toBe('Priya Sen');
      expect(guests[1].partySize).toBe(1);
      expect(guests[1].mealPreference).toBe('non_vegetarian');
    });

    it('gracefully handles empty strings or header-only CSVs', () => {
      expect(parseGuestsFromCsv('')).toEqual([]);
      expect(parseGuestsFromCsv('Name,PartySize')).toEqual([]);
    });

    it('sanitizes and bounds party size between 1 and 50', () => {
      const csv = `Name,PartySize
Super Party,999
Solo Guest,-5`;
      const guests = parseGuestsFromCsv(csv);
      expect(guests[0].partySize).toBe(50);
      expect(guests[1].partySize).toBe(1);
    });
  });

  describe('CSV Formula Injection Defense', () => {
    it('neutralizes leading =, +, -, @, tab, and CR characters', () => {
      expect(escapeCsvField('=cmd|/C calc')).toBe(`"'=cmd|/C calc"`);
      expect(escapeCsvField('+12345')).toBe(`"'+12345"`);
      expect(escapeCsvField('-2+3')).toBe(`"'-2+3"`);
      expect(escapeCsvField('@SUM(1,2)')).toBe(`"'@SUM(1,2)"`);
    });

    it('safely escapes internal double quotes', () => {
      expect(escapeCsvField('John "Jack" Doe')).toBe(`"John ""Jack"" Doe"`);
    });

    it('serializes a list of guests safely', () => {
      const guests: Guest[] = [
        {
          id: 'g-1',
          guestCode: 'FEST-BD-101',
          name: 'Maya Verma',
          email: 'maya@example.com',
          phone: '+91 98000 00001',
          category: 'family',
          partySize: 2,
          rsvpStatus: 'attending',
          mealPreference: 'vegetarian',
          invitationSent: true,
          checkInStatus: 'not_checked_in',
        },
      ];

      const csv = serializeGuestsToCsv(guests);
      expect(csv).toContain('Guest Code,Name');
      expect(csv).toContain('"FEST-BD-101"');
      expect(csv).toContain('"Maya Verma"');
    });
  });
});

