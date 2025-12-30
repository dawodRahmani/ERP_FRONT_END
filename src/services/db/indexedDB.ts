/**
 * VDO ERP IndexedDB Initialization
 *
 * Main entry point for the database system.
 * Exports the database initialization function and re-exports core utilities.
 *
 * Database: vdo-erp-db
 * Version: 35
 * Total Stores: 80+
 */

// Re-export connection utilities
export { getDB, initDB, resetDB, closeDB, deleteDatabase, isConnected, getDBVersion } from './core/connection';

// Re-export CRUD utilities
export { createCRUDService, batchCreate, batchDelete, countRecords, clearStore } from './core/crud';

// Re-export utility functions
export {
  generateFormattedCode,
  generateUniqueCode,
  sortRecords,
  sortByCreatedAt,
  searchRecords,
  filterByStatus,
  filterByDateRange,
  paginate,
  calculateTotalPages,
  getUniqueValues,
  groupBy,
  isDateInRange,
  daysBetween,
  formatISODate,
  getCurrentFiscalYear,
  debounce,
} from './core/utils';

// Re-export upgrade utilities
export { upgradeDatabase, storeExists, getAllStoreNames } from './core/upgrade';

// Re-export types
export type {
  BaseRecord,
  CreateInput,
  UpdateInput,
  CRUDService,
  TransactionMode,
  BaseFilters,
  PaginationParams,
  PaginatedResult,
  SortDirection,
  SortParams,
  CommonStatus,
} from '@/types/db/base';

export type { VDODatabase, StoreName, StoreValue, StoreKey, StoreIndexes } from '@/types/db/stores';

export {
  DatabaseError,
  RecordNotFoundError,
  ValidationError,
  VersionMismatchError,
  DuplicateRecordError,
  TransactionError,
  ConnectionError,
  UpgradeError,
  ConstraintError,
  isDatabaseError,
  isRecordNotFoundError,
  isValidationError,
} from '@/types/db/errors';

export { DB_CONFIG, APPROVAL_STATUS, RECORD_STATUS, EMPLOYEE_STATUS, CODE_PATTERNS } from '@/types/db/constants';

/**
 * Initialize the database
 * This is the main function to call when starting the application
 *
 * @returns Promise resolving to the database instance
 *
 * @example
 * ```typescript
 * import { initDB } from '@/services/db/indexedDB';
 *
 * // Initialize database when app starts
 * await initDB();
 * ```
 */
export { initDB as default };
