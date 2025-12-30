/**
 * MOU (Memorandum of Understanding) Tracking Service
 *
 * Manages MOU agreements and partnerships tracking.
 * Tracks MOU numbers, partners, types, status, and dates.
 */

import { createCRUDService } from './core/crud';
import { searchRecords, filterByDateRange, getUniqueValues, sortByCreatedAt } from './core/utils';
import type { MOUTrackingRecord } from '@/types/modules/tracking';

const STORE_NAME = 'mouTracking';

// Create base CRUD service
const baseCRUD = createCRUDService<MOUTrackingRecord>(STORE_NAME);

/**
 * MOU Tracking Service
 */
export const mouTrackingService = {
  ...baseCRUD,

  /**
   * Create a new MOU tracking entry with default status
   */
  async create(data: Omit<MOUTrackingRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<MOUTrackingRecord> {
    const entryData = {
      ...data,
      status: data.status || 'draft',
    };
    return baseCRUD.create(entryData);
  },

  /**
   * Get all MOUs sorted by MOU number or creation date
   */
  async getAll(): Promise<MOUTrackingRecord[]> {
    const entries = await baseCRUD.getAll();
    return sortByCreatedAt(entries, 'desc');
  },

  /**
   * Search MOUs by multiple fields
   */
  async search(searchTerm: string): Promise<MOUTrackingRecord[]> {
    if (!searchTerm) {
      return this.getAll();
    }

    const allEntries = await this.getAll();
    return searchRecords(allEntries, searchTerm, [
      'mouNumber',
      'partner',
      'title',
      'department',
      'notes',
    ]);
  },

  /**
   * Filter by partner
   */
  async filterByPartner(partner: string): Promise<MOUTrackingRecord[]> {
    return baseCRUD.getByIndex('partner', partner);
  },

  /**
   * Filter by MOU type
   */
  async filterByType(type: string): Promise<MOUTrackingRecord[]> {
    return baseCRUD.getByIndex('type', type);
  },

  /**
   * Filter by status
   */
  async filterByStatus(status: string): Promise<MOUTrackingRecord[]> {
    return baseCRUD.getByIndex('status', status);
  },

  /**
   * Filter by department
   */
  async filterByDepartment(department: string): Promise<MOUTrackingRecord[]> {
    return baseCRUD.getByIndex('department', department);
  },

  /**
   * Get MOUs by date range (start date)
   */
  async getByDateRange(startDate: string | Date, endDate: string | Date): Promise<MOUTrackingRecord[]> {
    const allEntries = await this.getAll();
    return filterByDateRange(allEntries, 'startDate', startDate, endDate);
  },

  /**
   * Get active MOUs (status = active)
   */
  async getActive(): Promise<MOUTrackingRecord[]> {
    return this.filterByStatus('active');
  },

  /**
   * Get expired MOUs
   */
  async getExpired(): Promise<MOUTrackingRecord[]> {
    return this.filterByStatus('expired');
  },

  /**
   * Get unique partners
   */
  async getUniquePartners(): Promise<string[]> {
    const allEntries = await this.getAll();
    const partners = getUniqueValues(allEntries, 'partner').filter(Boolean) as string[];
    return partners.sort();
  },

  /**
   * Get unique departments
   */
  async getUniqueDepartments(): Promise<string[]> {
    const allEntries = await this.getAll();
    const departments = getUniqueValues(allEntries, 'department').filter(Boolean) as string[];
    return departments.sort();
  },

  /**
   * Bulk import MOUs
   */
  async bulkImport(entries: Omit<MOUTrackingRecord, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<number> {
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
   * Export all MOUs
   */
  async export(): Promise<MOUTrackingRecord[]> {
    return this.getAll();
  },

  /**
   * Get statistics
   */
  async getStatistics(): Promise<{
    total: number;
    active: number;
    expired: number;
    draft: number;
    terminated: number;
  }> {
    const allEntries = await this.getAll();

    return {
      total: allEntries.length,
      active: allEntries.filter(e => e.status === 'active').length,
      expired: allEntries.filter(e => e.status === 'expired').length,
      draft: allEntries.filter(e => e.status === 'draft').length,
      terminated: allEntries.filter(e => e.status === 'terminated').length,
    };
  },
};

// Default export
export default mouTrackingService;
