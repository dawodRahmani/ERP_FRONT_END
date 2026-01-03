/**
 * Policy & Audit Object Stores
 *
 * Creates stores for policy and audit management:
 * - Policy Versions
 * - HR Audit Logs
 * - Conduct Acknowledgments
 * - PSEA Declarations
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '../../../../types/db/stores';

/**
 * Create all policy and audit object stores
 */
export function createPolicyStores(db: IDBPDatabase<VDODatabase>): void {
  // Policy Versions store
  if (!db.objectStoreNames.contains('policyVersions')) {
    const store = db.createObjectStore('policyVersions', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('policyName', 'policyName', { unique: false });
    store.createIndex('policyCode', 'policyCode', { unique: false });
    store.createIndex('version', 'version', { unique: false });
    store.createIndex('category', 'category', { unique: false });
    store.createIndex('effectiveDate', 'effectiveDate', { unique: false });
    store.createIndex('approvedBy', 'approvedBy', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: policyVersions');
  }

  // HR Audit Logs store
  if (!db.objectStoreNames.contains('hrAuditLogs')) {
    const store = db.createObjectStore('hrAuditLogs', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('entityType', 'entityType', { unique: false });
    store.createIndex('entityId', 'entityId', { unique: false });
    store.createIndex('action', 'action', { unique: false });
    store.createIndex('performedBy', 'performedBy', { unique: false });
    store.createIndex('performedAt', 'performedAt', { unique: false });
    store.createIndex('ipAddress', 'ipAddress', { unique: false });
    console.log('Created store: hrAuditLogs');
  }

  // Conduct Acknowledgments store
  if (!db.objectStoreNames.contains('conductAcknowledgments')) {
    const store = db.createObjectStore('conductAcknowledgments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('policyVersionId', 'policyVersionId', { unique: false });
    store.createIndex('policyName', 'policyName', { unique: false });
    store.createIndex('acknowledgmentType', 'acknowledgmentType', {
      unique: false,
    });
    store.createIndex('acknowledgedDate', 'acknowledgedDate', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: conductAcknowledgments');
  }

  // PSEA Declarations store
  if (!db.objectStoreNames.contains('pseaDeclarations')) {
    const store = db.createObjectStore('pseaDeclarations', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('declarationType', 'declarationType', { unique: false });
    store.createIndex('declarationDate', 'declarationDate', { unique: false });
    store.createIndex('fiscalYear', 'fiscalYear', { unique: false });
    store.createIndex('hasConflict', 'hasConflict', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: pseaDeclarations');
  }
}
