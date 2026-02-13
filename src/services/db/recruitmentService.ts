/**
 * Recruitment Service
 *
 * Database operations for recruitment dropdown management.
 * Uses the generic CRUD factory and adds category-specific methods.
 */

import type { RecruitmentDropdownRecord } from '../../types/modules/recruitment';
import { createCRUDService } from './core/crud';
import { DEFAULT_RECRUITMENT_DROPDOWNS } from '../../data/recruitment';

// ========== BASE CRUD ==========

const baseCRUD = createCRUDService<RecruitmentDropdownRecord>('recruitmentDropdowns');

// ========== EXTENDED SERVICE ==========

export const recruitmentDropdownsDB = {
  ...baseCRUD,

  /**
   * Get all dropdown options for a specific category
   * Sorted by displayOrder ascending
   */
  async getByCategory(category: string): Promise<RecruitmentDropdownRecord[]> {
    const records = await baseCRUD.getByIndex('category', category as never);
    return records.sort((a, b) => a.displayOrder - b.displayOrder);
  },

  /**
   * Get only active dropdown options for a specific category
   * This is what forms should use to populate their dropdowns
   */
  async getActiveByCategory(category: string): Promise<RecruitmentDropdownRecord[]> {
    const records = await this.getByCategory(category);
    return records.filter(r => r.isActive);
  },

  /**
   * Seed default dropdown values if the store is empty
   */
  async seedDefaults(): Promise<void> {
    const existing = await baseCRUD.getAll();
    if (existing.length > 0) return;

    console.log('Seeding recruitment dropdown defaults...');
    for (const item of DEFAULT_RECRUITMENT_DROPDOWNS) {
      await baseCRUD.create(item);
    }
    console.log(`Seeded ${DEFAULT_RECRUITMENT_DROPDOWNS.length} recruitment dropdown options`);
  },

  /**
   * Get the next display order for a category
   */
  async getNextDisplayOrder(category: string): Promise<number> {
    const records = await this.getByCategory(category);
    if (records.length === 0) return 1;
    return Math.max(...records.map(r => r.displayOrder)) + 1;
  },
};

// ========== AGGREGATE SERVICE ==========

export const recruitmentDropdownService = {
  dropdowns: recruitmentDropdownsDB,
};
