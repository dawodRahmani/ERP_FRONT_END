/**
 * Governance Module Data & Constants
 *
 * Dropdown options, color mappings, and helper functions for Governance module
 */

import type {
  BoardMemberStatus,
  BoardMemberRole,
  BoardMeetingType,
  CorrespondenceDirection,
  CorrespondenceStatus,
  CorrespondencePriority,
} from '../types/modules/governance';

// ============================================================================
// BOARD MEMBER OPTIONS
// ============================================================================

export const BOARD_MEMBER_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'resigned', label: 'Resigned' },
  { value: 'retired', label: 'Retired' },
] as const;

export const BOARD_MEMBER_ROLE_OPTIONS = [
  { value: 'head', label: 'Board Head' },
  { value: 'member', label: 'Board Member' },
  { value: 'secretary', label: 'Secretary' },
  { value: 'treasurer', label: 'Treasurer' },
] as const;

export const BOARD_MEMBER_STATUS_COLORS: Record<BoardMemberStatus, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  resigned: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  retired: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};

export const BOARD_MEMBER_ROLE_COLORS: Record<BoardMemberRole, string> = {
  head: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  member: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  secretary: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  treasurer: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
};

// ============================================================================
// BOARD MEETING OPTIONS
// ============================================================================

export const BOARD_MEETING_TYPE_OPTIONS = [
  { value: 'general_assembly', label: 'General Assembly' },
  { value: 'regular_board_meeting', label: 'Regular Board Meeting' },
  { value: 'ad_hoc_meeting', label: 'Ad Hoc Meeting' },
  { value: 'emergency_meeting', label: 'Emergency Meeting' },
  { value: 'annual_meeting', label: 'Annual Meeting' },
] as const;

export const BOARD_MEETING_TYPE_COLORS: Record<BoardMeetingType, string> = {
  general_assembly: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  regular_board_meeting: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  ad_hoc_meeting: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  emergency_meeting: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  annual_meeting: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

// ============================================================================
// CORRESPONDENCE OPTIONS
// ============================================================================

export const CORRESPONDENCE_DIRECTION_OPTIONS = [
  { value: 'in', label: 'Incoming' },
  { value: 'out', label: 'Outgoing' },
] as const;

export const CORRESPONDENCE_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'processed', label: 'Processed' },
  { value: 'archived', label: 'Archived' },
] as const;

export const CORRESPONDENCE_PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
] as const;

export const CORRESPONDENCE_STATUS_COLORS: Record<CorrespondenceStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  processed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

export const CORRESPONDENCE_PRIORITY_COLORS: Record<CorrespondencePriority, string> = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  high: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export const CORRESPONDENCE_DIRECTION_COLORS: Record<CorrespondenceDirection, string> = {
  in: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  out: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get label from options array
 */
export function getLabel<T extends string>(
  options: ReadonlyArray<{ value: T; label: string }>,
  value: T | undefined
): string {
  if (!value) return '-';
  const option = options.find((opt) => opt.value === value);
  return option?.label || value;
}

/**
 * Format date string to readable format
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Format date range
 */
export function formatDateRange(startDate: string, endDate?: string): string {
  const start = formatDate(startDate);
  if (!endDate) return `${start} - Present`;
  const end = formatDate(endDate);
  return `${start} - ${end}`;
}

/**
 * Calculate days between dates
 */
export function getDaysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate days until due date
 */
export function getDaysUntilDue(dueDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if date is overdue
 */
export function isOverdue(dueDate: string): boolean {
  return getDaysUntilDue(dueDate) < 0;
}

/**
 * Get year from date string
 */
export function getYearFromDate(dateString: string): number {
  return new Date(dateString).getFullYear();
}

/**
 * Count uploaded documents
 */
export function countDocuments(documents: Record<string, any>): number {
  if (!documents) return 0;
  return Object.values(documents).filter(
    (doc) => doc !== null && doc !== undefined
  ).length;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
