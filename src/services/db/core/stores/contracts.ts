/**
 * Contract Management Object Stores
 *
 * Creates stores for contract management:
 * - Contract Types
 * - Employee Contracts
 * - Contract Amendments
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '../../../../types/db/stores';

/**
 * Create all contract management object stores
 */
export function createContractStores(db: IDBPDatabase<VDODatabase>): void {
  // Contract Types store
  if (!db.objectStoreNames.contains('contractTypes')) {
    const store = db.createObjectStore('contractTypes', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('name', 'name', { unique: true });
    store.createIndex('category', 'category', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    console.log('Created store: contractTypes');
  }

  // Employee Contracts store
  if (!db.objectStoreNames.contains('employeeContracts')) {
    const store = db.createObjectStore('employeeContracts', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('contractNumber', 'contractNumber', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('contractTypeId', 'contractTypeId', { unique: false });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('startDate', 'startDate', { unique: false });
    store.createIndex('endDate', 'endDate', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
    console.log('Created store: employeeContracts');
  }

  // Contract Amendments store
  if (!db.objectStoreNames.contains('contractAmendments')) {
    const store = db.createObjectStore('contractAmendments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('amendmentNumber', 'amendmentNumber', { unique: true });
    store.createIndex('contractId', 'contractId', { unique: false });
    store.createIndex('amendmentType', 'amendmentType', { unique: false });
    store.createIndex('effectiveDate', 'effectiveDate', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('approvedBy', 'approvedBy', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
    console.log('Created store: contractAmendments');
  }
}
