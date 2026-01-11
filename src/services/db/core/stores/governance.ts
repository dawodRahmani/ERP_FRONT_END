/**
 * Governance Module Object Stores
 *
 * Creates stores for governance management system.
 * Covers: Board Members, Board Meetings, Correspondence
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '../../../../types/db/stores';

/**
 * Create all governance-related object stores
 */
export function createGovernanceStores(db: IDBPDatabase<VDODatabase>): void {
  // Governance Board Members store
  if (!db.objectStoreNames.contains('governanceBoardMembers')) {
    const store = db.createObjectStore('governanceBoardMembers', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('roleInBoard', 'roleInBoard', { unique: false });
    store.createIndex('name', 'name', { unique: false });
    store.createIndex('organization', 'organization', { unique: false });
    console.log('Created store: governanceBoardMembers');
  }

  // Governance Board Meetings store
  if (!db.objectStoreNames.contains('governanceBoardMeetings')) {
    const store = db.createObjectStore('governanceBoardMeetings', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('year', 'year', { unique: false });
    store.createIndex('meetingType', 'meetingType', { unique: false });
    store.createIndex('meetingDate', 'meetingDate', { unique: false });
    console.log('Created store: governanceBoardMeetings');
  }

  // Governance Correspondence store
  if (!db.objectStoreNames.contains('governanceCorrespondence')) {
    const store = db.createObjectStore('governanceCorrespondence', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('direction', 'direction', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('date', 'date', { unique: false });
    store.createIndex('priority', 'priority', { unique: false });
    console.log('Created store: governanceCorrespondence');
  }
}
