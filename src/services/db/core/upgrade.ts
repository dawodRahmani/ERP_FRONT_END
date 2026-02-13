/**
 * Database Upgrade Orchestrator
 *
 * Manages database version upgrades and schema migrations.
 * Calls modular store creators to maintain clean separation of concerns.
 */

import type { IDBPDatabase } from 'idb';
import { DB_CONFIG } from '../../../types/db/constants';
import { UpgradeError } from '../../../types/db/errors';
import type { VDODatabase } from '../../../types/db/stores';

// Import store creators for remaining modules
import { createTrackingStores } from './stores/tracking';
import { createAuditStores } from './stores/audit';
import { createProgramStores } from './stores/program';
import { createGovernanceStores } from './stores/governance';
import { createRecruitmentStores } from './stores/recruitment';

/**
 * Main database upgrade function
 * Called by idb when database version changes
 *
 * @param db Database instance
 * @param oldVersion Previous database version
 * @param newVersion New database version
 * @param transaction Upgrade transaction
 */
export function upgradeDatabase(
  db: IDBPDatabase<VDODatabase>,
  oldVersion: number,
  newVersion: number | null,
): void {
  try {
    console.log(`IndexedDB: Upgrading from v${oldVersion} to v${newVersion || 'latest'}`);

    // v40: Recreate program stores with proper indexes
    if (oldVersion < 40) {
      deleteProgramStores(db);
    }

    // Create all stores (store creators handle "if not exists" logic)
    createAllStores(db);

    console.log(`IndexedDB: Upgrade to v${newVersion || 'latest'} completed successfully`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Database upgrade failed:', error);
    throw new UpgradeError(
      message,
      oldVersion,
      newVersion || DB_CONFIG.VERSION,
      error
    );
  }
}

/**
 * Create all object stores by calling modular store creators
 */
function createAllStores(db: IDBPDatabase<VDODatabase>): void {
  console.log('Creating database stores...');

  // Tracking stores (compliance tracking)
  createTrackingStores(db);

  // Audit management stores
  createAuditStores(db);

  // Program module stores (donors, projects, work plans, etc.)
  createProgramStores(db);

  // Governance module stores (board members, meetings, correspondence)
  createGovernanceStores(db);

  // Recruitment module stores (dropdown management)
  createRecruitmentStores(db);

  console.log('All database stores created');
}

/**
 * Delete all program stores to recreate with proper indexes (v40)
 */
function deleteProgramStores(db: IDBPDatabase<VDODatabase>): void {
  const programStores = [
    'programDonors',
    'programProjects',
    'programWorkPlans',
    'programCertificates',
    'programDocuments',
    'programReporting',
    'programBeneficiaries',
    'programSafeguarding',
  ];

  programStores.forEach((storeName) => {
    if ((db.objectStoreNames as DOMStringList).contains(storeName)) {
      console.log(`IndexedDB: Deleting program store ${storeName}`);
      (db as unknown as IDBDatabase).deleteObjectStore(storeName);
    }
  });
}

/**
 * Utility function to check if a store exists
 */
export function storeExists(
  db: IDBPDatabase<VDODatabase>,
  storeName: string
): boolean {
  return (db.objectStoreNames as DOMStringList).contains(storeName);
}

/**
 * Utility function to get all store names
 */
export function getAllStoreNames(db: IDBPDatabase<VDODatabase>): string[] {
  return Array.from(db.objectStoreNames);
}
