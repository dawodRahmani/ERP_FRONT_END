/**
 * Recruitment Module Types
 *
 * Type definitions for the recruitment dropdown management system.
 */

import type { BaseRecord } from '../db/base';

/**
 * Recruitment dropdown record stored in IndexedDB
 */
export interface RecruitmentDropdownRecord extends BaseRecord {
  /** Category key, e.g. 'department', 'dutyStation' */
  category: string;
  /** Stored value */
  value: string;
  /** Display label */
  label: string;
  /** Whether this option is currently active */
  isActive: boolean;
  /** Sort order within its category */
  displayOrder: number;
}

/**
 * Index type for the recruitmentDropdowns store
 */
export interface RecruitmentDropdownRecordIndex {
  category: string;
  isActive: string;
  displayOrder: number;
  createdAt: string;
}

/**
 * Dropdown category metadata
 */
export interface DropdownCategory {
  key: string;
  label: string;
  description: string;
}
