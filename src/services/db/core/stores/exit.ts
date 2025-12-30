/**
 * Exit/Separation Module Object Stores
 *
 * Creates stores for employee separation system.
 * Covers: Separations, Clearances, Interviews, Compliance, Settlements, Certificates, Terminations, Handovers
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '@/types/db/stores';

/**
 * Create all exit/separation object stores
 */
export function createExitStores(db: IDBPDatabase<VDODatabase>): void {
  // Separation Types store (Configuration)
  if (!db.objectStoreNames.contains('separationTypes')) {
    const store = db.createObjectStore('separationTypes', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('code', 'code', { unique: true });
    store.createIndex('isActive', 'isActive', { unique: false });
    store.createIndex('displayOrder', 'displayOrder', { unique: false });
    console.log('Created store: separationTypes');
  }

  // Separation Records store (Main table)
  if (!db.objectStoreNames.contains('separationRecords')) {
    const store = db.createObjectStore('separationRecords', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('separationNumber', 'separationNumber', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('separationType', 'separationType', { unique: false });
    store.createIndex('separationDate', 'separationDate', { unique: false });
    store.createIndex('department', 'department', { unique: false });
    console.log('Created store: separationRecords');
  }

  // Exit Clearances store
  if (!db.objectStoreNames.contains('exitClearances')) {
    const store = db.createObjectStore('exitClearances', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('separationId', 'separationId', { unique: false });
    store.createIndex('departmentId', 'departmentId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: exitClearances');
  }

  // Clearance Items store
  if (!db.objectStoreNames.contains('clearanceItems')) {
    const store = db.createObjectStore('clearanceItems', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('clearanceId', 'clearanceId', { unique: false });
    store.createIndex('separationId', 'separationId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: clearanceItems');
  }

  // Exit Clearance Departments store (Configuration)
  if (!db.objectStoreNames.contains('exitClearanceDepartments')) {
    const store = db.createObjectStore('exitClearanceDepartments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('departmentName', 'departmentName', { unique: true });
    store.createIndex('isActive', 'isActive', { unique: false });
    store.createIndex('displayOrder', 'displayOrder', { unique: false });
    console.log('Created store: exitClearanceDepartments');
  }

  // Exit Interviews store
  if (!db.objectStoreNames.contains('exitInterviews')) {
    const store = db.createObjectStore('exitInterviews', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('separationId', 'separationId', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('interviewDate', 'interviewDate', { unique: false });
    console.log('Created store: exitInterviews');
  }

  // Exit Compliance Checks store
  if (!db.objectStoreNames.contains('exitComplianceChecks')) {
    const store = db.createObjectStore('exitComplianceChecks', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('separationId', 'separationId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: exitComplianceChecks');
  }

  // Final Settlements store
  if (!db.objectStoreNames.contains('finalSettlements')) {
    const store = db.createObjectStore('finalSettlements', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('settlementNumber', 'settlementNumber', { unique: true });
    store.createIndex('separationId', 'separationId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: finalSettlements');
  }

  // Settlement Payments store
  if (!db.objectStoreNames.contains('settlementPayments')) {
    const store = db.createObjectStore('settlementPayments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('settlementId', 'settlementId', { unique: false });
    store.createIndex('separationId', 'separationId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: settlementPayments');
  }

  // Work Certificates store
  if (!db.objectStoreNames.contains('workCertificates')) {
    const store = db.createObjectStore('workCertificates', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('certificateNumber', 'certificateNumber', { unique: true });
    store.createIndex('separationId', 'separationId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: workCertificates');
  }

  // Termination Records store
  if (!db.objectStoreNames.contains('terminationRecords')) {
    const store = db.createObjectStore('terminationRecords', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('separationId', 'separationId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('terminationType', 'terminationType', { unique: false });
    console.log('Created store: terminationRecords');
  }

  // Handovers store
  if (!db.objectStoreNames.contains('handovers')) {
    const store = db.createObjectStore('handovers', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('separationId', 'separationId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('handoverToId', 'handoverToId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: handovers');
  }

  // Handover Items store
  if (!db.objectStoreNames.contains('handoverItems')) {
    const store = db.createObjectStore('handoverItems', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('handoverId', 'handoverId', { unique: false });
    store.createIndex('separationId', 'separationId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: handoverItems');
  }

  // Separation History store (Audit trail)
  if (!db.objectStoreNames.contains('separationHistory')) {
    const store = db.createObjectStore('separationHistory', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('separationId', 'separationId', { unique: false });
    store.createIndex('changeDate', 'changeDate', { unique: false });
    console.log('Created store: separationHistory');
  }
}
