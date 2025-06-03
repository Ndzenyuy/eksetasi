import { z } from 'zod';
import { NextResponse } from 'next/server';

// Generic validation function for API routes
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: NextResponse } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return {
        success: false,
        error: NextResponse.json(
          {
            message: 'Validation failed',
            errors: errorMessages,
          },
          { status: 400 }
        ),
      };
    }

    return {
      success: false,
      error: NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      ),
    };
  }
}

// Validate query parameters
export function validateQuery<T>(
  schema: z.ZodSchema<T>,
  searchParams: URLSearchParams
): { success: true; data: T } | { success: false; error: NextResponse } {
  const queryObject: Record<string, string> = {};
  
  for (const [key, value] of searchParams.entries()) {
    queryObject[key] = value;
  }

  return validateRequest(schema, queryObject);
}

// Common validation schemas
export const idSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
});

// Sanitize HTML input to prevent XSS
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validate and sanitize text input
export function validateAndSanitizeText(
  text: string,
  maxLength: number = 1000
): string {
  if (!text || typeof text !== 'string') {
    throw new Error('Text input is required');
  }

  if (text.length > maxLength) {
    throw new Error(`Text must be less than ${maxLength} characters`);
  }

  return sanitizeHtml(text.trim());
}

// Email validation regex
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password strength validation
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// File upload validation
export const fileUploadSchema = z.object({
  name: z.string().min(1, 'File name is required'),
  size: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
  type: z.string().refine(
    (type) => ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(type),
    'File type must be JPEG, PNG, GIF, or PDF'
  ),
});

// Types
export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: NextResponse };

export type FileUpload = z.infer<typeof fileUploadSchema>;
