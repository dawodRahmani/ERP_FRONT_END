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

// Import all store creators
import { createCoreHRStores } from './stores/coreHR';
import { createDisciplinaryStores } from './stores/disciplinary';
import { createEmployeeAdminStores } from './stores/employeeAdmin';
import { createExitStores } from './stores/exit';
import { createLeaveStores } from './stores/leave';
import { createPayrollStores } from './stores/payroll';
import { createPerformanceStores } from './stores/performance';
import { createRecruitmentStores } from './stores/recruitment';
import { createTrackingStores } from './stores/tracking';
import { createTrainingStores } from './stores/training';
import { createContractStores } from './stores/contracts';
import { createAssetStores } from './stores/assets';
import { createTravelStores } from './stores/travel';
import { createStaffAssociationStores } from './stores/staffAssociation';
import { createPolicyStores } from './stores/policy';
import { createAuditStores } from './stores/audit';
import { createProgramStores } from './stores/program';

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

    // v28: Delete old interview stores (conflicted with HR module)
    if (oldVersion < 28) {
      deleteOldInterviewStores(db);
    }

    // v27: Force delete ALL recruitment stores to fix index issues
    if (oldVersion < 27) {
      deleteAllRecruitmentStores(db);
    }

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

  // Contract management stores
  createContractStores(db);

  // Asset management stores
  createAssetStores(db);

  // Travel management stores
  createTravelStores(db);

  // Staff association stores
  createStaffAssociationStores(db);

  // Policy stores
  createPolicyStores(db);

  // Audit management stores
  createAuditStores(db);

  // Program module stores (donors, projects, work plans, etc.)
  createProgramStores(db);

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
    // These are legacy stores being deleted, use type assertion
    if ((db.objectStoreNames as DOMStringList).contains(storeName)) {
      console.log(`IndexedDB: Deleting old store ${storeName}`);
      (db as unknown as IDBDatabase).deleteObjectStore(storeName);
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
    // These are stores being deleted for migration, use type assertion
    if ((db.objectStoreNames as DOMStringList).contains(storeName)) {
      console.log(`IndexedDB: Deleting recruitment store ${storeName}`);
      (db as unknown as IDBDatabase).deleteObjectStore(storeName);
    }
  });
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
