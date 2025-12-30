/**
 * Database Upgrade Orchestrator
 *
 * Manages database version upgrades and schema migrations.
 * Calls modular store creators to maintain clean separation of concerns.
 */

import type { IDBPDatabase, IDBPTransaction} from 'idb';
import type { VDODatabase } from '@/types/db/stores';
import { UpgradeError } from '@/types/db/errors';
import { DB_CONFIG } from '@/types/db/constants';

// Import all store creators
import { createCoreHRStores } from './stores/coreHR';
import { createTrackingStores } from './stores/tracking';
import { createLeaveStores } from './stores/leave';
import { createRecruitmentStores } from './stores/recruitment';
import { createPayrollStores } from './stores/payroll';
import { createPerformanceStores } from './stores/performance';
import { createTrainingStores } from './stores/training';
import { createExitStores } from './stores/exit';
import { createDisciplinaryStores } from './stores/disciplinary';
import { createEmployeeAdminStores } from './stores/employeeAdmin';

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
  transaction: IDBPTransaction<VDODatabase, ArrayLike<string>, 'versionchange'>
): void {
  try {
    console.log(`IndexedDB: Upgrading from v${oldVersion} to v${newVersion || 'latest'}`);

    // v28: Delete old interview stores (conflicted with HR module)
    if (oldVersion < 28) {
      deleteOldInterviewStores(db);
    }

    // v27: Force delete ALL recruitment stores to fix index issues
    if (oldVersion < 27) {
      deleteAllRecruitmentStores(db);
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

  // Core HR stores (employees, departments, positions, users, roles, etc.)
  createCoreHRStores(db);

  // Leave management stores
  createLeaveStores(db);

  // Recruitment stores
  createRecruitmentStores(db);

  // Payroll stores
  createPayrollStores(db);

  // Performance management stores
  createPerformanceStores(db);

  // Training stores
  createTrainingStores(db);

  // Exit/Separation stores
  createExitStores(db);

  // Disciplinary stores
  createDisciplinaryStores(db);

  // Employee administration stores
  createEmployeeAdminStores(db);

  // Tracking stores (in/out, access, DNR, MOU, work plans)
  createTrackingStores(db);

  console.log('All database stores created');
}

/**
 * Delete old interview stores that conflicted with HR module (v28)
 */
function deleteOldInterviewStores(db: IDBPDatabase<VDODatabase>): void {
  const oldInterviewStores = [
    'interviewCandidates',
    'interviewEvaluations',
    'interviewResults',
  ];

  oldInterviewStores.forEach((storeName) => {
    if (db.objectStoreNames.contains(storeName)) {
      console.log(`IndexedDB: Deleting old store ${storeName}`);
      db.deleteObjectStore(storeName);
    }
  });
}

/**
 * Delete all recruitment stores to fix index issues (v27)
 */
function deleteAllRecruitmentStores(db: IDBPDatabase<VDODatabase>): void {
  const allRecruitmentStores = [
    'recruitments',
    'termsOfReferences',
    'staffRequisitions',
    'vacancyAnnouncements',
    'recruitmentCandidates',
    'candidateApplications',
    'candidateEducations',
    'candidateExperiences',
    'recruitmentCommittees',
    'committeeMembers',
    'coiDeclarations',
    'longlistings',
    'longlistingCandidates',
    'shortlistings',
    'shortlistingCandidates',
    'writtenTests',
    'writtenTestCandidates',
    'recruitmentInterviews',
    'recruitmentInterviewCandidates',
    'recruitmentInterviewEvaluations',
    'recruitmentInterviewResults',
    'recruitmentReports',
    'reportCandidates',
    'offerLetters',
    'sanctionClearances',
    'backgroundChecks',
    'referenceChecks',
    'guaranteeLetters',
    'homeAddressVerifications',
    'criminalChecks',
    'employmentContracts',
    'fileChecklists',
    'provinces',
  ];

  allRecruitmentStores.forEach((storeName) => {
    if (db.objectStoreNames.contains(storeName)) {
      console.log(`IndexedDB: Deleting recruitment store ${storeName}`);
      db.deleteObjectStore(storeName);
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
  return db.objectStoreNames.contains(storeName);
}

/**
 * Utility function to get all store names
 */
export function getAllStoreNames(db: IDBPDatabase<VDODatabase>): string[] {
  return Array.from(db.objectStoreNames);
}
