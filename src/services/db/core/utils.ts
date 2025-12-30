/**
 * Database Utility Functions
 *
 * Shared utility functions used across database services.
 * Provides common operations like code generation, searching, and filtering.
 */

import type { BaseRecord, SortDirection } from '@/types/db/base';

/**
 * Generate a formatted code/number
 * Examples: "SEP-2025-00001", "EMP-2025-00042", "VDO-0123-2025"
 *
 * @param prefix Code prefix (e.g., "SEP", "EMP", "VDO")
 * @param count Current count/sequence number
 * @param includeYear Whether to include the year in the code
 * @param paddingLength Number of digits to pad the count to (default: 5)
 * @returns Formatted code string
 *
 * @example
 * ```typescript
 * generateFormattedCode('SEP', 42, true, 5)  // "SEP-2025-00042"
 * generateFormattedCode('EMP', 123, true, 4) // "EMP-2025-0123"
 * generateFormattedCode('TMP', 5, false, 3)  // "TMP-005"
 * ```
 */
export function generateFormattedCode(
  prefix: string,
  count: number,
  includeYear = true,
  paddingLength = 5
): string {
  const year = new Date().getFullYear();
  const paddedCount = String(count).padStart(paddingLength, '0');

  return includeYear
    ? `${prefix}-${year}-${paddedCount}`
    : `${prefix}-${paddedCount}`;
}

/**
 * Generate a unique random code (e.g., for anonymous test codes)
 * Uses alphanumeric characters excluding ambiguous ones (0, O, 1, I, l)
 *
 * @param length Length of the code (default: 6)
 * @returns Random code string
 *
 * @example
 * ```typescript
 * generateUniqueCode()     // "A3K9P2"
 * generateUniqueCode(8)    // "X7M4Q8N5"
 * ```
 */
export function generateUniqueCode(length = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars.charAt(randomIndex);
  }

  return code;
}

/**
 * Sort records by a specific field
 *
 * @template T Record type
 * @param records Array of records to sort
 * @param field Field name to sort by
 * @param direction Sort direction ('asc' or 'desc')
 * @returns Sorted array of records
 *
 * @example
 * ```typescript
 * sortRecords(employees, 'lastName', 'asc')
 * sortRecords(requests, 'createdAt', 'desc')
 * ```
 */
export function sortRecords<T extends Record<string, any>>(
  records: T[],
  field: keyof T,
  direction: SortDirection = 'asc'
): T[] {
  return [...records].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    // Handle null/undefined
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return direction === 'asc' ? 1 : -1;
    if (bValue == null) return direction === 'asc' ? -1 : 1;

    // Compare values
    let comparison = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    } else {
      // Convert to string for comparison
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Sort records by creation date
 * Convenience function for the common case of sorting by createdAt
 *
 * @template T Record type with createdAt field
 * @param records Array of records to sort
 * @param direction Sort direction (default: 'desc' for newest first)
 * @returns Sorted array of records
 */
export function sortByCreatedAt<T extends BaseRecord>(
  records: T[],
  direction: SortDirection = 'desc'
): T[] {
  return sortRecords(records, 'createdAt', direction);
}

/**
 * Search records by term across multiple fields
 * Performs case-insensitive partial matching
 *
 * @template T Record type
 * @param records Array of records to search
 * @param searchTerm Search term to look for
 * @param fields Array of field names to search in
 * @returns Filtered array of records matching the search term
 *
 * @example
 * ```typescript
 * searchRecords(employees, 'john', ['firstName', 'lastName', 'email'])
 * searchRecords(requests, 'urgent', ['description', 'notes', 'status'])
 * ```
 */
export function searchRecords<T extends Record<string, any>>(
  records: T[],
  searchTerm: string,
  fields: (keyof T)[]
): T[] {
  if (!searchTerm || searchTerm.trim() === '') {
    return records;
  }

  const term = searchTerm.toLowerCase().trim();

  return records.filter(record =>
    fields.some(field => {
      const value = record[field];
      if (value == null) return false;

      const stringValue = String(value).toLowerCase();
      return stringValue.includes(term);
    })
  );
}

/**
 * Filter records by status
 * Convenience function for the common case of filtering by status field
 *
 * @template T Record type with status field
 * @param records Array of records to filter
 * @param status Status value to filter by
 * @returns Filtered array of records
 */
export function filterByStatus<T extends { status: string }>(
  records: T[],
  status: string | string[]
): T[] {
  const statuses = Array.isArray(status) ? status : [status];
  return records.filter(record => statuses.includes(record.status));
}

/**
 * Filter records by date range
 *
 * @template T Record type
 * @param records Array of records to filter
 * @param field Date field name to filter on
 * @param startDate Start of date range (inclusive)
 * @param endDate End of date range (inclusive)
 * @returns Filtered array of records
 *
 * @example
 * ```typescript
 * filterByDateRange(requests, 'createdAt', '2025-01-01', '2025-01-31')
 * filterByDateRange(leaves, 'startDate', startDate, endDate)
 * ```
 */
export function filterByDateRange<T extends Record<string, any>>(
  records: T[],
  field: keyof T,
  startDate: string | Date,
  endDate: string | Date
): T[] {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Set time to start/end of day for inclusive range
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return records.filter(record => {
    const value = record[field];
    if (!value) return false;

    const date = new Date(value);
    return date >= start && date <= end;
  });
}

/**
 * Paginate an array of records
 *
 * @template T Record type
 * @param records Array of records to paginate
 * @param page Page number (1-indexed)
 * @param pageSize Number of items per page
 * @returns Paginated subset of records
 *
 * @example
 * ```typescript
 * paginate(employees, 1, 20)  // First 20 employees
 * paginate(employees, 2, 20)  // Employees 21-40
 * ```
 */
export function paginate<T>(
  records: T[],
  page: number,
  pageSize: number
): T[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return records.slice(startIndex, endIndex);
}

/**
 * Calculate total pages for pagination
 *
 * @param totalRecords Total number of records
 * @param pageSize Number of items per page
 * @returns Total number of pages
 */
export function calculateTotalPages(
  totalRecords: number,
  pageSize: number
): number {
  return Math.ceil(totalRecords / pageSize);
}

/**
 * Get unique values from an array of records for a specific field
 * Useful for generating filter options
 *
 * @template T Record type
 * @param records Array of records
 * @param field Field name to extract unique values from
 * @returns Array of unique values
 *
 * @example
 * ```typescript
 * getUniqueValues(employees, 'department')  // ['HR', 'IT', 'Finance']
 * getUniqueValues(requests, 'status')       // ['pending', 'approved', 'rejected']
 * ```
 */
export function getUniqueValues<T extends Record<string, any>>(
  records: T[],
  field: keyof T
): any[] {
  const values = records
    .map(record => record[field])
    .filter(value => value != null);

  return Array.from(new Set(values));
}

/**
 * Group records by a specific field
 *
 * @template T Record type
 * @param records Array of records
 * @param field Field name to group by
 * @returns Object with grouped records
 *
 * @example
 * ```typescript
 * groupBy(employees, 'department')
 * // { 'HR': [...], 'IT': [...], 'Finance': [...] }
 * ```
 */
export function groupBy<T extends Record<string, any>>(
  records: T[],
  field: keyof T
): Record<string, T[]> {
  return records.reduce((groups, record) => {
    const key = String(record[field] ?? 'undefined');
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(record);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Check if a date is within a range
 *
 * @param date Date to check
 * @param startDate Start of range
 * @param endDate End of range
 * @returns True if date is within range
 */
export function isDateInRange(
  date: string | Date,
  startDate: string | Date,
  endDate: string | Date
): boolean {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);

  return d >= start && d <= end;
}

/**
 * Calculate the number of days between two dates
 *
 * @param startDate Start date
 * @param endDate End date
 * @returns Number of days (inclusive)
 */
export function daysBetween(
  startDate: string | Date,
  endDate: string | Date
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays + 1; // +1 to make it inclusive
}

/**
 * Format a date to ISO date string (YYYY-MM-DD)
 *
 * @param date Date to format
 * @returns ISO date string
 */
export function formatISODate(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

/**
 * Get current fiscal year
 * Assumes fiscal year starts in January
 *
 * @returns Current fiscal year
 */
export function getCurrentFiscalYear(): number {
  return new Date().getFullYear();
}

/**
 * Debounce function for search operations
 * Returns a debounced version of the provided function
 *
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
