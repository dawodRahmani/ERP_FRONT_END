/**
 * In/Out Document Tracking Service
 *
 * Manages tracking of incoming and outgoing documents.
 * Tracks serial numbers, dates, senders, recipients, and statuses.
 */

import { createCRUDService } from './core/crud';
import { searchRecords, filterByDateRange, getUniqueValues } from './core/utils';
import type { InOutTrackingRecord, InOutDocumentType } from '@/types/modules/tracking';

const STORE_NAME = 'inOutTracking';

// Create base CRUD service
const baseCRUD = createCRUDService<InOutTrackingRecord>(STORE_NAME);

/**
 * In/Out Tracking Service
 * Provides comprehensive document tracking capabilities
 */
export const inOutTrackingService = {
  ...baseCRUD,

  /**
   * Create a new tracking entry with default status
   */
  async create(data: Omit<InOutTrackingRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<InOutTrackingRecord> {
    const entryData = {
      ...data,
      status: data.status || 'pending',
    };
    return baseCRUD.create(entryData);
  },

  /**
   * Get all tracking entries sorted by date
   * @returns Array of entries sorted by date (newest first)
   */
  async getAll(): Promise<InOutTrackingRecord[]> {
    const entries = await baseCRUD.getAll();

    // Sort by date (newest first) or by creation date if no date
    return entries.sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  /**
   * Search entries by multiple fields
   * @param searchTerm Search term to look for
   * @returns Filtered array of entries
   */
  async search(searchTerm: string): Promise<InOutTrackingRecord[]> {
    if (!searchTerm) {
      return this.getAll();
    }

    const allEntries = await this.getAll();
    return searchRecords(allEntries, searchTerm, [
      'subject',
      'serialNumber',
      'from',
      'to',
      'documentType',
    ]);
  },

  /**
   * Filter entries by document type
   * @param documentType Type of document (incoming/outgoing)
   * @returns Filtered entries
   */
  async filterByDocumentType(documentType: InOutDocumentType): Promise<InOutTrackingRecord[]> {
    return baseCRUD.getByIndex('documentType', documentType);
  },

  /**
   * Filter entries by status
   * @param status Status to filter by
   * @returns Filtered entries
   */
  async filterByStatus(status: string): Promise<InOutTrackingRecord[]> {
    return baseCRUD.getByIndex('status', status);
  },

  /**
   * Get entries within a date range
   * @param startDate Start of date range
   * @param endDate End of date range
   * @returns Filtered entries
   */
  async getByDateRange(startDate: string | Date, endDate: string | Date): Promise<InOutTrackingRecord[]> {
    const allEntries = await this.getAll();
    return filterByDateRange(allEntries, 'date', startDate, endDate);
  },

  /**
   * Get unique senders (from field)
   * @returns Sorted array of unique sender names
   */
  async getUniqueSenders(): Promise<string[]> {
    const allEntries = await this.getAll();
    const senders = getUniqueValues(allEntries, 'from').filter(Boolean) as string[];
    return senders.sort();
  },

  /**
   * Get unique recipients (to field)
   * @returns Sorted array of unique recipient names
   */
  async getUniqueRecipients(): Promise<string[]> {
    const allEntries = await this.getAll();
    const recipients = getUniqueValues(allEntries, 'to').filter(Boolean) as string[];
    return recipients.sort();
  },

  /**
   * Bulk import multiple entries
   * @param entries Array of entries to import
   * @returns Number of entries imported
   */
  async bulkImport(entries: Omit<InOutTrackingRecord, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<number> {
    const now = new Date().toISOString();
    const entriesWithTimestamps = entries.map(entry => ({
      ...entry,
      createdAt: now,
      updatedAt: now,
    }));

    // Use the CRUD service to create each entry
    const promises = entriesWithTimestamps.map(entry => baseCRUD.create(entry));
    const results = await Promise.all(promises);
    return results.length;
  },

  /**
   * Export all entries
   * @returns All tracking entries
   */
  async export(): Promise<InOutTrackingRecord[]> {
    return this.getAll();
  },

  /**
   * Get statistics about tracking entries
   * @returns Statistics object with counts
   */
  async getStatistics(): Promise<{
    total: number;
    incoming: number;
    outgoing: number;
    pending: number;
    processed: number;
    completed: number;
  }> {
    const allEntries = await this.getAll();

    return {
      total: allEntries.length,
      incoming: allEntries.filter(e => e.documentType === 'incoming').length,
      outgoing: allEntries.filter(e => e.documentType === 'outgoing').length,
      pending: allEntries.filter(e => e.status === 'pending').length,
      processed: allEntries.filter(e => e.status === 'processed').length,
      completed: allEntries.filter(e => e.status === 'completed').length,
    };
  },
};

// Default export
export default inOutTrackingService;
