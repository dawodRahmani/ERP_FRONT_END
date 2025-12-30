/**
 * DNR (Donor Report) Tracking Service
 *
 * Manages tracking of donor reports and project deliverables.
 * Tracks donors, projects, report types, statuses, and quarterly timelines.
 */

import { createCRUDService } from './core/crud';
import { searchRecords, getUniqueValues } from './core/utils';
import type { DNRTrackingRecord, DNRTimelineMonth, QuarterlyTimeline } from '@/types/modules/tracking';

const STORE_NAME = 'dnrTracking';

// Create base CRUD service
const baseCRUD = createCRUDService<DNRTrackingRecord>(STORE_NAME);

/**
 * Generate months array for quarterly timeline
 * @param startYear Starting year (default: 2022)
 * @param startMonth Starting month (default: 6/June)
 * @param endYear Ending year (default: 2027)
 * @param endMonth Ending month (default: 1/January)
 * @returns Array of timeline months with year, month, quarter, key, and labels
 */
export function generateTimelineMonths(
  startYear = 2022,
  startMonth = 6,
  endYear = 2027,
  endMonth = 1
): DNRTimelineMonth[] {
  const months: DNRTimelineMonth[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const firstMonth = year === startYear ? startMonth : 1;
    const lastMonth = year === endYear ? endMonth : 12;

    for (let month = firstMonth; month <= lastMonth; month++) {
      const quarter = Math.ceil(month / 3) as 1 | 2 | 3 | 4;
      months.push({
        year,
        month,
        quarter,
        key: `${year}-${String(month).padStart(2, '0')}`,
        label: new Date(year, month - 1).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        quarterLabel: `Q${quarter}`,
      });
    }
  }

  return months;
}

/**
 * Group timeline months by year and quarter
 * @returns Object with years as keys and quarters (Q1-Q4) as nested keys
 */
export function groupMonthsByYearAndQuarter(): QuarterlyTimeline {
  const months = generateTimelineMonths();
  const grouped: QuarterlyTimeline = {};

  months.forEach((month) => {
    if (!grouped[month.year]) {
      grouped[month.year] = {
        Q1: [],
        Q2: [],
        Q3: [],
        Q4: [],
      };
    }
    grouped[month.year][`Q${month.quarter}`].push(month);
  });

  return grouped;
}

/**
 * DNR Tracking Service
 */
export const dnrTrackingService = {
  ...baseCRUD,

  /**
   * Create a new DNR tracking entry with default status and timeline data
   */
  async create(data: Omit<DNRTrackingRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<DNRTrackingRecord> {
    const entryData = {
      ...data,
      projectStatus: data.projectStatus || 'active',
      timelineData: data.timelineData || {},
    };
    return baseCRUD.create(entryData);
  },

  /**
   * Get all DNR tracking entries sorted by serial number or creation date
   */
  async getAll(): Promise<DNRTrackingRecord[]> {
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
   * Search DNR tracking entries by multiple fields
   */
  async search(searchTerm: string): Promise<DNRTrackingRecord[]> {
    if (!searchTerm) {
      return this.getAll();
    }

    const allEntries = await this.getAll();
    return searchRecords(allEntries, searchTerm, [
      'donor',
      'projectName',
      'location',
      'reportType',
      'reportingDescription',
    ]);
  },

  /**
   * Filter by donor
   */
  async filterByDonor(donor: string): Promise<DNRTrackingRecord[]> {
    return baseCRUD.getByIndex('donor', donor);
  },

  /**
   * Filter by project status
   */
  async filterByProjectStatus(status: string): Promise<DNRTrackingRecord[]> {
    return baseCRUD.getByIndex('projectStatus', status);
  },

  /**
   * Filter by report type
   */
  async filterByReportType(reportType: string): Promise<DNRTrackingRecord[]> {
    return baseCRUD.getByIndex('reportType', reportType);
  },

  /**
   * Get active projects
   */
  async getActiveProjects(): Promise<DNRTrackingRecord[]> {
    return this.filterByProjectStatus('active');
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
   * Get unique report types
   */
  async getUniqueReportTypes(): Promise<string[]> {
    const allEntries = await this.getAll();
    const reportTypes = getUniqueValues(allEntries, 'reportType').filter(Boolean) as string[];
    return reportTypes.sort();
  },

  /**
   * Get entries by date range (overlapping date ranges)
   * Includes entries that:
   * - Start within the range
   * - End within the range
   * - Span across the entire range
   */
  async getByDateRange(startDate: string | Date, endDate: string | Date): Promise<DNRTrackingRecord[]> {
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
   * Bulk import DNR tracking entries
   */
  async bulkImport(entries: Omit<DNRTrackingRecord, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<number> {
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
   * Export all DNR tracking entries
   */
  async export(): Promise<DNRTrackingRecord[]> {
    return this.getAll();
  },

  /**
   * Get statistics
   */
  async getStatistics(): Promise<{
    total: number;
    active: number;
    completed: number;
    onHold: number;
    byDonor: Record<string, number>;
    byReportType: Record<string, number>;
  }> {
    const allEntries = await this.getAll();

    // Count by donor
    const byDonor: Record<string, number> = {};
    allEntries.forEach(entry => {
      if (entry.donor) {
        byDonor[entry.donor] = (byDonor[entry.donor] || 0) + 1;
      }
    });

    // Count by report type
    const byReportType: Record<string, number> = {};
    allEntries.forEach(entry => {
      if (entry.reportType) {
        byReportType[entry.reportType] = (byReportType[entry.reportType] || 0) + 1;
      }
    });

    return {
      total: allEntries.length,
      active: allEntries.filter(e => e.projectStatus === 'active').length,
      completed: allEntries.filter(e => e.projectStatus === 'completed').length,
      onHold: allEntries.filter(e => e.projectStatus === 'on-hold').length,
      byDonor,
      byReportType,
    };
  },
};

// Default export
export default dnrTrackingService;
