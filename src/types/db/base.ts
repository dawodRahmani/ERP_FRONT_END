/**
 * Base Database Types
 *
 * Core type definitions for the VDO ERP IndexedDB database system.
 * Provides foundation types used across all database services.
 */

/**
 * Base record interface with standard timestamp fields
 * All database records should extend this interface
 */
export interface BaseRecord {
  /** Auto-incrementing primary key */
  id: number;
  /** ISO 8601 timestamp when record was created */
  createdAt: string;
  /** ISO 8601 timestamp when record was last updated */
  updatedAt: string;
}

/**
 * Input type for creating new records
 * Omits auto-generated fields (id, timestamps)
 */
export type CreateInput<T extends BaseRecord> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt'
>;

/**
 * Input type for updating existing records
 * Omits id, allows partial updates
 */
export type UpdateInput<T extends BaseRecord> = Partial<Omit<T, 'id'>>;

/**
 * Generic CRUD service interface
 * Defines standard operations for all database services
 */
export interface CRUDService<T extends BaseRecord> {
  /**
   * Create a new record
   * @param data Record data without id and timestamps
   * @returns Created record with id and timestamps
   */
  create(data: CreateInput<T>): Promise<T>;

  /**
   * Get all records from the store
   * @returns Array of all records
   */
  getAll(): Promise<T[]>;

  /**
   * Get a single record by ID
   * @param id Record ID
   * @returns Record if found, undefined otherwise
   */
  getById(id: number): Promise<T | undefined>;

  /**
   * Update an existing record
   * @param id Record ID
   * @param data Partial update data
   * @returns Updated record
   * @throws RecordNotFoundError if record doesn't exist
   */
  update(id: number, data: UpdateInput<T>): Promise<T>;

  /**
   * Delete a record by ID
   * @param id Record ID
   * @throws RecordNotFoundError if record doesn't exist
   */
  delete(id: number): Promise<void>;

  /**
   * Query records by index
   * @param indexName Name of the index to query
   * @param value Value to search for
   * @returns Array of matching records
   */
  getByIndex<K extends keyof T>(indexName: string, value: T[K]): Promise<T[]>;
}

/**
 * Transaction mode types for IndexedDB operations
 */
export type TransactionMode = 'readonly' | 'readwrite';

/**
 * Base filter interface for query operations
 * Services can extend this with specific filter fields
 */
export interface BaseFilters {
  /** Search term for text search */
  search?: string;
  /** Status filter */
  status?: string;
  /** Additional filter fields */
  [key: string]: unknown;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  /** Page number (1-indexed) */
  page: number;
  /** Number of items per page */
  pageSize: number;
}

/**
 * Paginated result wrapper
 */
export interface PaginatedResult<T> {
  /** Array of items for current page */
  items: T[];
  /** Total number of items across all pages */
  total: number;
  /** Current page number */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Total number of pages */
  totalPages: number;
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort parameters
 */
export interface SortParams<T> {
  /** Field to sort by */
  field: keyof T;
  /** Sort direction */
  direction: SortDirection;
}

/**
 * Common status types used across multiple modules
 */
export type CommonStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'active'
  | 'inactive'
  | 'completed'
  | 'cancelled';

/**
 * Utility type for extracting values from const objects
 * Used for creating type-safe enums
 */
export type ValueOf<T> = T[keyof T];
