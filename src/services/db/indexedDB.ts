/**
 * VDO ERP IndexedDB Initialization
 *
 * Main entry point for the database system.
 * Exports the database initialization function and re-exports core utilities.
 *
 * Modules:
 * - User Management
 * - Compliance (projects, documents, proposals, registrations, etc.)
 * - Audit
 * - Program
 * - Governance
 */

// Re-export connection utilities
export { getDB, initDB, resetDB, closeDB, deleteDatabase, deleteAndRecreateDB, isConnected, getDBVersion } from './core/connection';

// Re-export CRUD utilities
export { createCRUDService, batchCreate, batchDelete, countRecords, clearStore, clearAllData } from './core/crud';

// Re-export compliance services
export {
  complianceProjectDB,
  complianceDocumentDB,
  complianceAmendmentDB,
  proposalDB,
  dueDiligenceDB,
  registrationDB,
  membershipDB,
  certificateDB,
  boardOfDirectorsDB,
  partnerDB,
  donorOutreachDB,
  governmentOutreachDB,
  governmentOutreachDB as govtOutreachDB,
  blacklistDB,
  complianceService,
} from './complianceService';

// Re-export audit services
export {
  auditTypesDB,
  hactAssessmentsDB,
  donorProjectAuditsDB,
  externalAuditsDB,
  internalAuditsDB,
  partnerAuditsDB,
  correctiveActionsDB,
  auditDashboardService,
  auditService,
} from './auditService';

// Re-export program services
export {
  programDonorsDB,
  programProjectsDB,
  programWorkPlansDB,
  programCertificatesDB,
  programDocumentsDB,
  programReportingDB,
  programBeneficiariesDB,
  programSafeguardingDB,
  programDashboardService,
  programService,
  // Backward compatibility aliases
  programDonorDB,
  programProjectDB,
  programWorkPlanDB,
  programCertificateDB,
  programDocumentDB,
  programReportDB,
  programBeneficiaryDB,
  programSafeguardDB,
} from './programService';

// Re-export governance services
export {
  governanceBoardMembersDB,
  governanceBoardMeetingsDB,
  governanceCorrespondenceDB,
  governanceService,
  // Backward compatibility aliases
  governanceBoardMemberDB,
  governanceBoardMeetingDB,
  governanceCorrespondenceService,
} from './governanceService';

// Re-export recruitment services
export {
  recruitmentDropdownsDB,
  recruitmentDropdownService,
} from './recruitmentService';

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
} from '../../types/db/base';

export type { VDODatabase, StoreName, StoreValue, StoreKey, StoreIndexes } from '../../types/db/stores';

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
} from '../../types/db/errors';

export { DB_CONFIG, APPROVAL_STATUS, RECORD_STATUS, EMPLOYEE_STATUS, CODE_PATTERNS } from '../../types/db/constants';

/**
 * Initialize the database
 * This is the main function to call when starting the application
 *
 * @returns Promise resolving to the database instance
 *
 * @example
 * ```typescript
 * import { initDB } from './indexedDB';
 *
 * // Initialize database when app starts
 * await initDB();
 * ```
 */
export { initDB as default } from "./core/connection";
