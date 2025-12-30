/**
 * Database Error Types
 *
 * Custom error classes for database operations.
 * Provides structured, type-safe error handling.
 */

/**
 * Base database error class
 * All database errors extend this class
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly storeName?: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error thrown when a record is not found
 */
export class RecordNotFoundError extends DatabaseError {
  constructor(
    storeName: string,
    public readonly recordId: number
  ) {
    super(
      `Record with id ${recordId} not found in ${storeName}`,
      'RECORD_NOT_FOUND',
      storeName
    );
    this.name = 'RecordNotFoundError';
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends DatabaseError {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly validationErrors?: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

/**
 * Error thrown when database version doesn't match expected version
 */
export class VersionMismatchError extends DatabaseError {
  constructor(
    public readonly expected: number,
    public readonly actual: number
  ) {
    super(
      `Database version mismatch. Expected: ${expected}, Actual: ${actual}`,
      'VERSION_MISMATCH'
    );
    this.name = 'VersionMismatchError';
  }
}

/**
 * Error thrown when a duplicate record would be created
 */
export class DuplicateRecordError extends DatabaseError {
  constructor(
    storeName: string,
    public readonly field: string,
    public readonly value: unknown
  ) {
    super(
      `Duplicate record in ${storeName}: ${field} = ${value}`,
      'DUPLICATE_RECORD',
      storeName
    );
    this.name = 'DuplicateRecordError';
  }
}

/**
 * Error thrown when a transaction fails
 */
export class TransactionError extends DatabaseError {
  constructor(
    message: string,
    storeName?: string,
    cause?: unknown
  ) {
    super(message, 'TRANSACTION_ERROR', storeName, cause);
    this.name = 'TransactionError';
  }
}

/**
 * Error thrown when database connection fails
 */
export class ConnectionError extends DatabaseError {
  constructor(
    message: string,
    cause?: unknown
  ) {
    super(message, 'CONNECTION_ERROR', undefined, cause);
    this.name = 'ConnectionError';
  }
}

/**
 * Error thrown when database upgrade fails
 */
export class UpgradeError extends DatabaseError {
  constructor(
    message: string,
    public readonly fromVersion: number,
    public readonly toVersion: number,
    cause?: unknown
  ) {
    super(
      `Database upgrade failed from v${fromVersion} to v${toVersion}: ${message}`,
      'UPGRADE_ERROR',
      undefined,
      cause
    );
    this.name = 'UpgradeError';
  }
}

/**
 * Error thrown when a constraint is violated
 */
export class ConstraintError extends DatabaseError {
  constructor(
    message: string,
    storeName?: string,
    public readonly constraint?: string
  ) {
    super(message, 'CONSTRAINT_ERROR', storeName);
    this.name = 'ConstraintError';
  }
}

/**
 * Type guard to check if an error is a DatabaseError
 */
export function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof DatabaseError;
}

/**
 * Type guard to check if an error is a RecordNotFoundError
 */
export function isRecordNotFoundError(error: unknown): error is RecordNotFoundError {
  return error instanceof RecordNotFoundError;
}

/**
 * Type guard to check if an error is a ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}
