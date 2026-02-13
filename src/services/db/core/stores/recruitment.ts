/**
 * Recruitment Module Object Stores
 *
 * Creates IndexedDB stores for recruitment dropdown management.
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '../../../../types/db/stores';

export function createRecruitmentStores(db: IDBPDatabase<VDODatabase>): void {
  // ========== RECRUITMENT DROPDOWNS ==========
  if (!db.objectStoreNames.contains('recruitmentDropdowns')) {
    const store = db.createObjectStore('recruitmentDropdowns', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('category', 'category', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    store.createIndex('displayOrder', 'displayOrder', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
    console.log('Created recruitmentDropdowns store');
  }
}
