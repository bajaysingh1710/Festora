import { describe, it, expect } from 'vitest';
import { validateGuestCheckIn, createQrPayload } from '../services/guestPassService';
import { SEED_GUESTS, SEED_EVENT } from '../lib/seedData';
import { Guest } from '../types';

describe('GuestPass & Check-In Service', () => {
  it('generates consistent QR JSON payload', () => {
    const guest = SEED_GUESTS[0];
    const payloadStr = createQrPayload(guest, SEED_EVENT.id);
    const parsed = JSON.parse(payloadStr);

    expect(parsed.app).toBe('FESTORA');
    expect(parsed.code).toBe(guest.guestCode);
    expect(parsed.name).toBe(guest.name);
    expect(parsed.party).toBe(guest.partySize);
  });

  it('validates a first-time check-in and returns valid status', () => {
    // Guest g-102 is 'not_checked_in'
    const guest102 = SEED_GUESTS.find((g) => g.id === 'g-102')!;
    const result = validateGuestCheckIn(guest102.guestCode, SEED_GUESTS, 'Gate 1');

    expect(result.success).toBe(true);
    expect(result.status).toBe('valid');
    expect(result.guest?.id).toBe(guest102.id);
    expect(result.message).toContain('Check-in verified');
  });

  it('detects duplicate check-in and rejects already checked-in guest', () => {
    // Guest g-101 is already 'checked_in' in seed data
    const guest101 = SEED_GUESTS.find((g) => g.id === 'g-101')!;
    const result = validateGuestCheckIn(guest101.guestCode, SEED_GUESTS, 'Gate 1');

    expect(result.success).toBe(false);
    expect(result.status).toBe('already_checked_in');
    expect(result.message).toContain('ALREADY CHECKED IN');
  });

  it('handles declined RSVP with warning status', () => {
    // Guest g-109 is declined
    const guest109 = SEED_GUESTS.find((g) => g.id === 'g-109')!;
    const result = validateGuestCheckIn(guest109.guestCode, SEED_GUESTS, 'Gate 1');

    expect(result.success).toBe(false);
    expect(result.status).toBe('cancelled');
    expect(result.message).toContain('RSVP was marked as Declined');
  });

  it('handles invalid / non-existent code safely', () => {
    const result = validateGuestCheckIn('NON_EXISTENT_CODE_999', SEED_GUESTS);
    expect(result.success).toBe(false);
    expect(result.status).toBe('invalid');
  });
});
