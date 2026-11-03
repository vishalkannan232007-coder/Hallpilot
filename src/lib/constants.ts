/**
 * HallPilot — Platform Constants
 *
 * All values in this file are derived directly from the project documentation:
 *   - docs/SECURITY_PLAN.md
 *   - docs/UPLOAD_FORMAT.md
 *   - docs/DATABASE_DESIGN.md
 *   - supabase/migrations/20261009000001_initial_schema.sql
 *
 * Do NOT import supabase client or any React dependencies here.
 * This file is a pure static-data module with zero side effects.
 */

// =============================================================================
// SESSION SLOTS
// Values mirror the `session_slot TEXT CHECK (session_slot IN ('FN', 'AN'))`
// DB constraint and the ExamSession.session_slot union type in models.ts.
// =============================================================================

/** All valid exam session slot codes. */
export const SESSION_SLOTS = ['FN', 'AN'] as const;

/** Narrowed union type for a session slot code. */
export type SessionSlot = (typeof SESSION_SLOTS)[number];

/** Human-readable display labels for each session slot code. */
export const SESSION_SLOT_LABELS: Record<SessionSlot, string> = {
  FN: 'Forenoon',
  AN: 'Afternoon',
} as const;

/** Full descriptive labels including the abbreviation. */
export const SESSION_SLOT_FULL_LABELS: Record<SessionSlot, string> = {
  FN: 'Forenoon (FN)',
  AN: 'Afternoon (AN)',
} as const;

// =============================================================================
// EXAM SESSION STATUS
// Values mirror the `status TEXT CHECK (status IN ('draft', 'published', 'archived'))`
// DB constraint and the ExamSession.status union type in models.ts.
// =============================================================================

/** All valid exam session status codes. */
export const SESSION_STATUSES = ['draft', 'published', 'archived'] as const;

/** Narrowed union type for a session status. */
export type SessionStatus = (typeof SESSION_STATUSES)[number];

/** Human-readable display labels for each session status code. */
export const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
} as const;

// =============================================================================
// DATA RETENTION
// Source: DATABASE_DESIGN.md §5.1
//   "Default: session_date + end_time + 24 hours."
//   "College administrators can customize retention from 2 hours up to 7 days."
// Also reflected in colleges.default_retention_hours DEFAULT 24 in migration SQL
// and the default_retention_hours field in College model (models.ts).
// =============================================================================

/** Default session expiry window in hours (used when a college has no custom value). */
export const DEFAULT_RETENTION_HOURS = 24;

/** Minimum configurable retention window a college admin may select (hours). */
export const MIN_RETENTION_HOURS = 2;

/** Maximum configurable retention window a college admin may select (hours). */
export const MAX_RETENTION_HOURS = 7 * 24; // 168 hours = 7 days

// =============================================================================
// REGISTER NUMBER CONSTRAINTS
// Source: UPLOAD_FORMAT.md §1 — register_number validation rules:
//   "2 to 30 characters. Trimmed, leading zeros preserved. Alphanumeric & hyphens."
// =============================================================================

/** Minimum character length for a valid register number. */
export const REGISTER_NUMBER_MIN_LENGTH = 2;

/** Maximum character length for a valid register number (matches DB column size). */
export const REGISTER_NUMBER_MAX_LENGTH = 30;

/**
 * Regex that a register number must satisfy.
 * Allows alphanumeric characters and hyphens; does NOT strip leading zeros.
 * Source: UPLOAD_FORMAT.md §1 — "Alphanumeric & hyphens allowed."
 */
export const REGISTER_NUMBER_PATTERN = /^[A-Za-z0-9-]{2,30}$/;

// =============================================================================
// UPLOAD FILE CONSTRAINTS
// Source: SECURITY_PLAN.md §4.2 — "Maximum upload file size: 10 MB per file."
//         SECURITY_PLAN.md §4.2 — "Maximum rows per batch: 10,000 records."
// =============================================================================

/** Maximum permitted upload file size in bytes (10 MB). */
export const UPLOAD_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/** Human-readable label for the maximum file size limit. */
export const UPLOAD_MAX_FILE_SIZE_LABEL = '10 MB';

/** Maximum number of seating records that may be submitted in a single upload batch. */
export const UPLOAD_MAX_ROWS = 10_000;

/** Supported file MIME types and extensions for seating roster uploads. */
export const UPLOAD_ACCEPTED_MIME_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
] as const;

/** File extensions displayed in the upload dropzone hint. */
export const UPLOAD_ACCEPTED_EXTENSIONS = ['.csv', '.xlsx', '.xls'] as const;

// =============================================================================
// CSV / FORMULA INJECTION PREVENTION
// Source: SECURITY_PLAN.md §4.1
//   "cells starting with =, +, -, @ are prefixed with a single quote or stripped"
// Source: UPLOAD_FORMAT.md §3.2 — same character set.
// =============================================================================

/**
 * Characters that, when they appear at the start of a cell value, indicate a
 * potential formula injection attempt (CSV Injection).
 * Cells beginning with any of these must be sanitized before storage.
 */
export const CSV_INJECTION_PREFIXES = ['=', '+', '-', '@'] as const;

// =============================================================================
// FIELD LENGTH LIMITS
// Source: UPLOAD_FORMAT.md §1 — per-column validation rules table.
// These values mirror the intended DB column constraints for client-side
// pre-validation before any network call is made.
// =============================================================================

export const FIELD_MAX_LENGTHS = {
  /** register_number — "2 to 30 characters" */
  registerNumber: 30,
  /** hall_number — "1 to 50 characters" */
  hallNumber: 50,
  /** seat_number — "up to 30 characters" */
  seatNumber: 30,
  /** course_code — "up to 30 characters" */
  courseCode: 30,
  /** course_name — "up to 150 characters" */
  courseName: 150,
  /** building_name — "up to 100 characters" */
  buildingName: 100,
  /** floor_number — "up to 50 characters" */
  floorNumber: 50,
  /** student_name — "up to 100 characters" */
  studentName: 100,
  /** special_instructions — "up to 250 characters" */
  specialInstructions: 250,
} as const;

// =============================================================================
// RATE LIMITING (CLIENT-SIDE REFERENCE)
// Source: SECURITY_PLAN.md §3.3
//   "Rate limiting on Supabase Edge / API layer (max 20 lookups per minute per IP)."
// These constants document the server-side policy so client-side debounce and
// throttle logic (useDebounce, future middleware) can be calibrated consistently.
// They do NOT implement server-side enforcement — that lives in Supabase.
// =============================================================================

/** Maximum number of student seating lookups permitted per IP per minute (server policy). */
export const RATE_LIMIT_LOOKUPS_PER_MINUTE = 20;

/**
 * Recommended client-side debounce delay in milliseconds for the lookup search
 * input, derived from the rate limit: 60 000 ms / 20 = 3 000 ms headroom.
 * Using a conservative 500 ms keeps UX snappy while staying far below the limit.
 */
export const LOOKUP_DEBOUNCE_MS = 500;
