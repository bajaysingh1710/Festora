/**
 * Festora Robust CSV Parser and Safe Serializer
 * RFC-4180 compliant with CSV Formula Injection defense.
 */
import { Guest, GuestCategory, MealPreference } from '../types';

export interface ParsedCsvGuest {
  name: string;
  partySize: number;
  phone: string;
  email: string;
  category: GuestCategory;
  mealPreference: MealPreference;
  tableNumber?: string;
  notes?: string;
}

const VALID_CATEGORIES: GuestCategory[] = [
  'family',
  'close_friends',
  'vip',
  'colleagues',
  'community',
];

const VALID_MEALS: MealPreference[] = [
  'vegetarian',
  'non_vegetarian',
  'jain',
  'vegan',
];

/**
 * Parses raw CSV line into fields respecting quotes and commas within quotes.
 */
export function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  fields.push(current.trim());
  return fields;
}

/**
 * Parses full CSV text into validated guest objects.
 */
export function parseGuestsFromCsv(csvText: string): ParsedCsvGuest[] {
  if (!csvText || typeof csvText !== 'string') return [];

  // Split lines respecting both CRLF and LF
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length <= 1) return [];

  const results: ParsedCsvGuest[] = [];

  // Skip header row (line 0)
  for (let i = 1; i < lines.length; i++) {
    const rawFields = parseCsvLine(lines[i]);
    if (rawFields.length >= 1 && rawFields[0].length > 0) {
      const name = rawFields[0].replace(/^["']|["']$/g, '').trim();
      if (!name) continue;

      const rawParty = parseInt(rawFields[1] || '2', 10);
      const partySize = isNaN(rawParty) || rawParty < 1 ? 1 : Math.min(rawParty, 50);

      const phone = (rawFields[2] || '+91 98000 00000').replace(/[^\w\s+()-]/g, '').slice(0, 25);
      const email = (rawFields[3] || 'guest@example.com').replace(/[^\w.@+-]/g, '').slice(0, 100);

      const catStr = (rawFields[4] || 'family').toLowerCase().trim() as GuestCategory;
      const category: GuestCategory = VALID_CATEGORIES.includes(catStr) ? catStr : 'family';

      const mealStr = (rawFields[5] || 'vegetarian').toLowerCase().trim() as MealPreference;
      const mealPreference: MealPreference = VALID_MEALS.includes(mealStr) ? mealStr : 'vegetarian';

      const tableNumber = rawFields[6]?.slice(0, 30);
      const notes = rawFields[7]?.slice(0, 200);

      results.push({
        name,
        partySize,
        phone,
        email,
        category,
        mealPreference,
        tableNumber,
        notes,
      });
    }
  }

  return results;
}

/**
 * Escapes a cell value for safe CSV output.
 * Defends against CSV Formula Injection (=, +, -, @, tab, CR)
 * which can trigger arbitrary formula execution in Microsoft Excel and LibreOffice.
 */
export function escapeCsvField(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '""';
  let str = String(val).trim();

  // CSV Formula Injection mitigation: prefix dangerous leading characters with a single quote
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // Escape internal double quotes by doubling them
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Serializes guest list to safe CSV format.
 */
export function serializeGuestsToCsv(guests: Guest[]): string {
  const headers = [
    'Guest Code',
    'Name',
    'Party Size',
    'Category',
    'RSVP Status',
    'Meal Preference',
    'Phone',
    'Email',
    'Table',
    'Check-In Status',
    'Checked In At',
  ];

  const rows = guests.map((g) => [
    escapeCsvField(g.guestCode),
    escapeCsvField(g.name),
    escapeCsvField(g.partySize),
    escapeCsvField(g.category),
    escapeCsvField(g.rsvpStatus),
    escapeCsvField(g.mealPreference),
    escapeCsvField(g.phone),
    escapeCsvField(g.email),
    escapeCsvField(g.tableNumber || ''),
    escapeCsvField(g.checkInStatus),
    escapeCsvField(g.checkedInAt || ''),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

