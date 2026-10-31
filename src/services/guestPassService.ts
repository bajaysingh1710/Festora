import QRCode from 'qrcode';
import { Guest, GuestPass, EventDetails } from '../types';

export interface CheckInResult {
  success: boolean;
  status: 'valid' | 'already_checked_in' | 'cancelled' | 'invalid';
  message: string;
  guest?: Guest;
  checkInTime?: string;
  operator?: string;
}

/**
 * Generates a standardized, deterministic alphanumeric guest pass identifier.
 * Format: FEST-{EVENT_PREFIX}-{SEQUENCE_NUMBER}
 * e.g., FEST-BD-101 for Birthday, FEST-WE-102 for Wedding
 */
export function generateGuestCode(eventType: string, sequenceNumber: number): string {
  const prefix = (eventType || 'EV').slice(0, 2).toUpperCase();
  const num = Math.max(100, Math.floor(sequenceNumber));
  return `FEST-${prefix}-${num}`;
}

/**
 * Creates standardized QR payload string for a guest pass
 */
export function createQrPayload(guest: Guest, eventId: string): string {
  return JSON.stringify({
    app: 'FESTORA',
    ver: '1.0',
    eid: eventId,
    gid: guest.id,
    code: guest.guestCode,
    name: guest.name,
    party: guest.partySize,
    diet: guest.mealPreference,
  });
}

/**
 * Generates an SVG or data URL QR code image from the payload
 */
export async function generateQrDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      width: 280,
      margin: 2,
      color: {
        dark: '#49372D', // Festora deep warm brown
        light: '#FFF8EF', // Festora cream
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Failed to generate QR data URL', err);
    // Fallback simple SVG data URI
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23FFF8EF"/><text x="100" y="100" text-anchor="middle" fill="%2349372D">FESTORA PASS</text></svg>';
  }
}

/**
 * Creates or retrieves GuestPass object for a guest
 */
export async function getGuestPass(guest: Guest, event: EventDetails): Promise<GuestPass> {
  const payload = createQrPayload(guest, event.id);
  const qrDataUrl = await generateQrDataUrl(payload);

  let status: GuestPass['status'] = 'valid';
  if (guest.rsvpStatus === 'declined') {
    status = 'cancelled';
  } else if (guest.checkInStatus === 'checked_in') {
    status = 'already_checked_in';
  }

  return {
    passId: `PASS-${guest.guestCode}`,
    guestId: guest.id,
    guestCode: guest.guestCode,
    guestName: guest.name,
    partySize: guest.partySize,
    category: guest.category,
    mealPreference: guest.mealPreference,
    qrPayload: qrDataUrl,
    status,
    checkInHistory: guest.checkedInAt
      ? [{ timestamp: guest.checkedInAt, operator: guest.checkedInBy || 'Reception Desk' }]
      : [],
  };
}

/**
 * Validates a guest check-in attempt using pass code, QR payload, or guest name/phone
 */
export function validateGuestCheckIn(
  query: string,
  guests: Guest[],
  operatorName: string = 'Terminal 1'
): CheckInResult {
  const cleanQuery = query.trim().toUpperCase();

  if (!cleanQuery) {
    return {
      success: false,
      status: 'invalid',
      message: 'Please enter a valid guest pass code, phone number, or scan QR code.',
    };
  }

  // Parse if query is JSON QR payload
  let targetCode = cleanQuery;
  try {
    if (cleanQuery.startsWith('{') && cleanQuery.endsWith('}')) {
      const parsed = JSON.parse(cleanQuery);
      if (parsed.code) targetCode = parsed.code.toUpperCase();
    }
  } catch {
    // Keep as plain code
  }

  // Find guest by code, id, phone, or name match
  const guest = guests.find((g) => {
    return (
      g.guestCode.toUpperCase() === targetCode ||
      g.id.toUpperCase() === targetCode ||
      g.phone.replace(/\D/g, '').includes(cleanQuery.replace(/\D/g, '')) ||
      g.name.toUpperCase().includes(cleanQuery)
    );
  });

  if (!guest) {
    return {
      success: false,
      status: 'invalid',
      message: `No matching guest found for "${query}". Check the code and try again.`,
    };
  }

  if (guest.rsvpStatus === 'declined') {
    return {
      success: false,
      status: 'cancelled',
      guest,
      message: `${guest.name}'s RSVP was marked as Declined. Please confirm with host before admitting.`,
    };
  }

  // DUPLICATE CHECK-IN DETECTION
  if (guest.checkInStatus === 'checked_in') {
    const timeFormatted = guest.checkedInAt
      ? new Date(guest.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'earlier';
    return {
      success: false,
      status: 'already_checked_in',
      guest,
      checkInTime: guest.checkedInAt,
      operator: guest.checkedInBy,
      message: `⚠️ ALREADY CHECKED IN: ${guest.name} (Party of ${guest.partySize}) checked in at ${timeFormatted} by ${guest.checkedInBy || 'Reception'}. Duplicate entry rejected!`,
    };
  }

  // Valid check-in!
  const now = new Date().toISOString();
  return {
    success: true,
    status: 'valid',
    guest,
    checkInTime: now,
    operator: operatorName,
    message: `🎉 Check-in verified! Welcome ${guest.name} (Party of ${guest.partySize}). Table: ${guest.tableNumber || 'Open Seating'}.`,
  };
}

/**
 * Records a guest check-out attempt for event exit verification
 */
export function validateGuestCheckOut(
  query: string,
  guests: Guest[],
  operatorName: string = 'Exit Gate 1'
): CheckInResult {
  const cleanQuery = query.trim().toUpperCase();

  if (!cleanQuery) {
    return {
      success: false,
      status: 'invalid',
      message: 'Please enter a valid guest pass code, phone number, or scan QR code.',
    };
  }

  let targetCode = cleanQuery;
  try {
    if (cleanQuery.startsWith('{') && cleanQuery.endsWith('}')) {
      const parsed = JSON.parse(cleanQuery);
      if (parsed.code) targetCode = parsed.code.toUpperCase();
    }
  } catch {
    // Keep raw
  }

  const guest = guests.find((g) => {
    return (
      g.guestCode.toUpperCase() === targetCode ||
      g.id.toUpperCase() === targetCode ||
      g.phone.replace(/\D/g, '').includes(cleanQuery.replace(/\D/g, '')) ||
      g.name.toUpperCase().includes(cleanQuery)
    );
  });

  if (!guest) {
    return {
      success: false,
      status: 'invalid',
      message: `No matching guest found for "${query}".`,
    };
  }

  if (guest.checkInStatus !== 'checked_in') {
    return {
      success: false,
      status: 'invalid',
      guest,
      message: `${guest.name} has not checked in yet. Cannot record exit.`,
    };
  }

  const now = new Date().toISOString();
  return {
    success: true,
    status: 'valid',
    guest,
    checkInTime: now,
    operator: operatorName,
    message: `👋 Check-out confirmed for ${guest.name} (Party of ${guest.partySize}). Return gift delivered. Safe travels!`,
  };
}
