/**
 * Tracking Module Object Stores
 *
 * Creates stores for all tracking services:
 * - In/Out Document Tracking
 * - Access Tracking
 * - DNR (Donor-Negotiated Requirements) Tracking
 * - MOU (Memorandum of Understanding) Tracking
 * - Program Work Plan Tracking
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '../../../../types/db/stores';

/**
 * Create all tracking-related object stores
 */
export function createTrackingStores(db: IDBPDatabase<VDODatabase>): void {
  // In/Out Tracking store
  if (!db.objectStoreNames.contains('inOutTracking')) {
    const store = db.createObjectStore('inOutTracking', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('serialNumber', 'serialNumber', { unique: true });
    store.createIndex('date', 'date', { unique: false });
    store.createIndex('documentType', 'documentType', { unique: false });
    store.createIndex('department', 'department', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
  }

  // Access Tracking store
  if (!db.objectStoreNames.contains('accessTracking')) {
    const store = db.createObjectStore('accessTracking', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('year', 'year', { unique: false });
    store.createIndex('quarter', 'quarter', { unique: false });
    store.createIndex('donor', 'donor', { unique: false });
    store.createIndex('project', 'project', { unique: false });
    store.createIndex('location', 'location', { unique: false });
    store.createIndex('lineMinistry', 'lineMinistry', { unique: false });
    store.createIndex('projectStatus', 'projectStatus', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
  }

  // DNR Tracking store
  if (!db.objectStoreNames.contains('dnrTracking')) {
    const store = db.createObjectStore('dnrTracking', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('year', 'year', { unique: false });
    store.createIndex('quarter', 'quarter', { unique: false });
    store.createIndex('donor', 'donor', { unique: false });
    store.createIndex('project', 'project', { unique: false });
    store.createIndex('reportType', 'reportType', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('dueDate', 'dueDate', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
  }

  // MOU Tracking store
  if (!db.objectStoreNames.contains('mouTracking')) {
    const store = db.createObjectStore('mouTracking', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('mouNumber', 'mouNumber', { unique: true });
    store.createIndex('partner', 'partner', { unique: false });
    store.createIndex('type', 'type', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('startDate', 'startDate', { unique: false });
    store.createIndex('endDate', 'endDate', { unique: false });
    store.createIndex('department', 'department', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
  }

  // Program Work Plans store
  if (!db.objectStoreNames.contains('programWorkPlans')) {
    const store = db.createObjectStore('programWorkPlans', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('year', 'year', { unique: false });
    store.createIndex('quarter', 'quarter', { unique: false });
    store.createIndex('month', 'month', { unique: false });
    store.createIndex('department', 'department', { unique: false });
    store.createIndex('responsible', 'responsible', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('targetDate', 'targetDate', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
  }
}
