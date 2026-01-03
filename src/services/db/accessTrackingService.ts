/**
 * Access Tracking Service
 *
 * Manages tracking of access permissions and project activities.
 * Tracks donors, projects, locations, line ministries, and timeline data.
 */

import type { AccessTrackingRecord, TimelineMonth } from '../../types/modules/tracking';
import { createCRUDService } from './core/crud';
import { getUniqueValues, searchRecords } from './core/utils';

const STORE_NAME = 'accessTracking';

// Create base CRUD service
const baseCRUD = createCRUDService<AccessTrackingRecord>(STORE_NAME);

/**
 * Generate months array for timeline
 * @param startYear Starting year (default: 2024)
 * @param startMonth Starting month (default: 1/January)
 * @param endYear Ending year (default: 2026)
 * @param endMonth Ending month (default: 12/December)
 * @returns Array of timeline months with year, month, key, and label
 */
export function generateTimelineMonths(
  startYear = 2024,
  startMonth = 1,
  endYear = 2026,
  endMonth = 12
): TimelineMonth[] {
  const months: TimelineMonth[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const firstMonth = year === startYear ? startMonth : 1;
    const lastMonth = year === endYear ? endMonth : 12;

    for (let month = firstMonth; month <= lastMonth; month++) {
      months.push({
        year,
        month,
        key: `${year}-${String(month).padStart(2, '0')}`,
        label: new Date(year, month - 1).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
      });
    }
  }

  return months;
}

/**
 * Group timeline months by year
 * @returns Object with years as keys and arrays of months as values
 */
export function groupMonthsByYear(): Record<number, TimelineMonth[]> {
  const months = generateTimelineMonths();
  const grouped: Record<number, TimelineMonth[]> = {};

  months.forEach((month) => {
    if (!grouped[month.year]) {
      grouped[month.year] = [];
    }
    grouped[month.year].push(month);
  });

  return grouped;
}

/**
 * Access Tracking Service
 */
export const accessTrackingService = {
  ...baseCRUD,

  /**
   * Create a new access tracking entry with timeline data
   */
  async create(data: Omit<AccessTrackingRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<AccessTrackingRecord> {
    const entryData = {
      ...data,
      timelineData: data.timelineData || {},
    };
    return baseCRUD.create(entryData);
  },

  /**
   * Get all access tracking entries sorted by serial number or creation date
   */
  async getAll(): Promise<AccessTrackingRecord[]> {
    const entries = await baseCRUD.getAll();

    // Sort by serial number or created date
    return entries.sort((a, b) => {
      if (a.serialNumber && b.serialNumber) {
        return a.serialNumber - b.serialNumber;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  /**
   * Search access tracking entries by multiple fields
   */
  async search(searchTerm: string): Promise<AccessTrackingRecord[]> {
    if (!searchTerm) {
      return this.getAll();
    }

    const allEntries = await this.getAll();
    return searchRecords(allEntries, searchTerm, [
      'donor',
      'projectName',
      'location',
      'lineMinistry',
      'activities',
    ]);
  },

  /**
   * Filter by donor
   */
  async filterByDonor(donor: string): Promise<AccessTrackingRecord[]> {
    return baseCRUD.getByIndex('donor', donor);
  },

  /**
   * Filter by line ministry
   */
  async filterByLineMinistry(ministry: string): Promise<AccessTrackingRecord[]> {
    return baseCRUD.getByIndex('lineMinistry', ministry);
  },

  /**
   * Get unique donors
   */
  async getUniqueDonors(): Promise<string[]> {
    const allEntries = await this.getAll();
    const donors = getUniqueValues(allEntries, 'donor').filter(Boolean) as string[];
    return donors.sort();
  },

  /**
   * Get unique projects
   */
  async getUniqueProjects(): Promise<string[]> {
    const allEntries = await this.getAll();
    const projects = getUniqueValues(allEntries, 'projectName').filter(Boolean) as string[];
    return projects.sort();
  },

  /**
   * Get unique line ministries
   */
  async getUniqueLineMinistries(): Promise<string[]> {
    const allEntries = await this.getAll();
    const ministries = getUniqueValues(allEntries, 'lineMinistry').filter(Boolean) as string[];
    return ministries.sort();
  },

  /**
   * Get entries by date range (overlapping date ranges)
   * Includes entries that:
   * - Start within the range
   * - End within the range
   * - Span across the entire range
   */
  async getByDateRange(startDate: string | Date, endDate: string | Date): Promise<AccessTrackingRecord[]> {
    const allEntries = await this.getAll();
    const filterStart = new Date(startDate);
    const filterEnd = new Date(endDate);

    return allEntries.filter((entry) => {
      if (!entry.startDate || !entry.endDate) return false;

      const entryStart = new Date(entry.startDate);
      const entryEnd = new Date(entry.endDate);

      // Check if entry overlaps with the filter range
      return (
        (entryStart >= filterStart && entryStart <= filterEnd) ||
        (entryEnd >= filterStart && entryEnd <= filterEnd) ||
        (entryStart <= filterStart && entryEnd >= filterEnd)
      );
    });
  },

  /**
   * Bulk import access tracking entries
   */
  async bulkImport(entries: Omit<AccessTrackingRecord, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<number> {
    const now = new Date().toISOString();
    const entriesWithTimestamps = entries.map(entry => ({
      ...entry,
      createdAt: now,
      updatedAt: now,
    }));

    const promises = entriesWithTimestamps.map(entry => baseCRUD.create(entry));
    const results = await Promise.all(promises);
    return results.length;
  },

  /**
   * Export all access tracking entries
   */
  async export(): Promise<AccessTrackingRecord[]> {
    return this.getAll();
  },
};

// Default export
export default accessTrackingService;
