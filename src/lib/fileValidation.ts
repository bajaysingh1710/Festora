/**
 * Festora File Upload Security and Validation
 * Enforces strict MIME-type boundaries, file size limits, and blocks scriptable image payloads (SVG).
 */

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const MAX_VENUE_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

/**
 * Validates an uploaded image file before reading as Data URL or storing in state.
 */
export function validateImageFile(file: File): FileValidationResult {
  if (!file) {
    return { isValid: false, error: 'No file selected.' };
  }

  // 1. Check file size
  if (file.size > MAX_VENUE_PHOTO_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `File is too large (${sizeMb} MB). Maximum allowed size is 5 MB.`,
    };
  }

  // 2. Reject SVG or HTML payloads (stored XSS vector)
  const lowerName = file.name.toLowerCase();
  if (lowerName.endsWith('.svg') || lowerName.endsWith('.html') || lowerName.endsWith('.htm')) {
    return {
      isValid: false,
      error: 'Vector (SVG) and HTML files are not permitted for security reasons. Please upload JPG, PNG, or WebP images.',
    };
  }

  // 3. Strict MIME-type checking
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      isValid: false,
      error: `Unsupported image format (${file.type || 'unknown'}). Please upload a JPEG, PNG, or WebP photograph.`,
    };
  }

  return { isValid: true };
}

/**
 * Validates a base64 DataURL string before persisting to localStorage.
 */
export function validateDataUrl(dataUrl: string): boolean {
  if (!dataUrl || typeof dataUrl !== 'string') return false;
  // Match data:image/(jpeg|png|webp);base64,...
  const regex = /^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/;
  return regex.test(dataUrl);
}

