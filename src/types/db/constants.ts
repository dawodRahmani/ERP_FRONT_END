/**
 * Database Constants
 *
 * Shared constants and enums used across database services.
 * Uses const assertions for type-safe enum-like behavior.
 */

/**
 * Database configuration
 */
export const DB_CONFIG = {
  NAME: 'vdo-erp-db',
  VERSION: 41, // Add governance stores (board members, meetings, correspondence)
} as const;

/**
 * Common approval statuses
 * Used across multiple modules (requisitions, requests, etc.)
 */
export const APPROVAL_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type ApprovalStatus = typeof APPROVAL_STATUS[keyof typeof APPROVAL_STATUS];

/**
 * Human-readable labels for approval statuses
 */
export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  [APPROVAL_STATUS.DRAFT]: 'Draft',
  [APPROVAL_STATUS.PENDING]: 'Pending Approval',
  [APPROVAL_STATUS.APPROVED]: 'Approved',
  [APPROVAL_STATUS.REJECTED]: 'Rejected',
};

/**
 * Common record statuses
 */
export const RECORD_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
  DELETED: 'deleted',
} as const;

export type RecordStatus = typeof RECORD_STATUS[keyof typeof RECORD_STATUS];

/**
 * Employee statuses
 */
export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  PROBATION: 'probation',
  SUSPENDED: 'suspended',
  ON_LEAVE: 'on_leave',
  SEPARATED: 'separated',
  TERMINATED: 'terminated',
} as const;

export type EmployeeStatus = typeof EMPLOYEE_STATUS[keyof typeof EMPLOYEE_STATUS];

/**
 * Employment types
 */
export const EMPLOYMENT_TYPE = {
  CORE: 'core',
  PROJECT: 'project',
  CONSULTANT: 'consultant',
  PART_TIME: 'part_time',
  INTERNSHIP: 'internship',
  VOLUNTEER: 'volunteer',
  DAILY_WAGE: 'daily_wage',
} as const;

export type EmploymentType = typeof EMPLOYMENT_TYPE[keyof typeof EMPLOYMENT_TYPE];

/**
 * Gender options
 */
export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
  PREFER_NOT_TO_SAY: 'prefer_not_to_say',
} as const;

export type Gender = typeof GENDER[keyof typeof GENDER];

/**
 * Education levels
 */
export const EDUCATION_LEVEL = {
  HIGH_SCHOOL: 'high_school',
  DIPLOMA: 'diploma',
  BACHELORS: 'bachelors',
  MASTERS: 'masters',
  PHD: 'phd',
} as const;

export type EducationLevel = typeof EDUCATION_LEVEL[keyof typeof EDUCATION_LEVEL];

/**
 * Priority levels
 */
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export type Priority = typeof PRIORITY[keyof typeof PRIORITY];

/**
 * Severity levels
 */
export const SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type Severity = typeof SEVERITY[keyof typeof SEVERITY];

/**
 * Days of the week (0 = Sunday, 6 = Saturday)
 */
export const WEEKDAY = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

export type Weekday = typeof WEEKDAY[keyof typeof WEEKDAY];

/**
 * Fiscal year settings
 */
export const FISCAL_YEAR = {
  START_MONTH: 1, // January
  END_MONTH: 12,  // December
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Date format patterns
 */
export const DATE_FORMAT = {
  ISO: 'YYYY-MM-DD',
  ISO_DATETIME: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_FULL: 'MMMM DD, YYYY',
} as const;

/**
 * Code generation patterns
 */
export const CODE_PATTERNS = {
  EMPLOYEE: 'EMP',
  RECRUITMENT: 'VDO',
  CANDIDATE: 'CND',
  SEPARATION: 'SEP',
  MISCONDUCT: 'MIS',
  INVESTIGATION: 'INV',
  DISCIPLINARY_ACTION: 'DA',
  APPEAL: 'APL',
  GRIEVANCE: 'GRV',
  COMPLIANCE_INCIDENT: 'ZT',
  ADVANCE: 'ADV',
  LOAN: 'LON',
  CONTRACT: 'CON',
  REPORT: 'RPT',
} as const;
