import { describe, it, expect } from 'vitest';
import {
  validateImageFile,
  validateDataUrl,
  MAX_VENUE_PHOTO_BYTES,
} from '../lib/fileValidation';

describe('File Upload Security & Validation', () => {
  it('approves standard JPEG, PNG, and WebP files within size limit', () => {
    const validJpg = new File(['fake-jpg-content'], 'venue.jpg', { type: 'image/jpeg' });
    const validPng = new File(['fake-png-content'], 'stage.png', { type: 'image/png' });
    const validWebp = new File(['fake-webp-content'], 'lawn.webp', { type: 'image/webp' });

    expect(validateImageFile(validJpg).isValid).toBe(true);
    expect(validateImageFile(validPng).isValid).toBe(true);
    expect(validateImageFile(validWebp).isValid).toBe(true);
  });

  it('strictly rejects SVG and HTML files to prevent stored XSS attacks', () => {
    const maliciousSvg = new File(['<svg onload="alert(1)"></svg>'], 'xss.svg', {
      type: 'image/svg+xml',
    });
    const maliciousHtml = new File(['<script>alert(1)</script>'], 'xss.html', {
      type: 'text/html',
    });

    const svgResult = validateImageFile(maliciousSvg);
    expect(svgResult.isValid).toBe(false);
    expect(svgResult.error).toContain('SVG');

    const htmlResult = validateImageFile(maliciousHtml);
    expect(htmlResult.isValid).toBe(false);
  });

  it('rejects files larger than 5 MB', () => {
    // Mock an oversized file
    const oversizedFile = {
      name: 'huge_photo.jpg',
      size: MAX_VENUE_PHOTO_BYTES + 1024,
      type: 'image/jpeg',
    } as unknown as File;

    const result = validateImageFile(oversizedFile);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('too large');
  });

  it('validates Data URLs correctly', () => {
    expect(validateDataUrl('data:image/jpeg;base64,/9j/4AAQSkZJRg==')).toBe(true);
    expect(validateDataUrl('data:image/png;base64,iVBORw0KGgo=')).toBe(true);
    expect(validateDataUrl('javascript:alert(1)')).toBe(false);
    expect(validateDataUrl('data:text/html;base64,PHNjcmlwdD4=')).toBe(false);
  });
});

