/**
 * Asset Management Object Stores
 *
 * Creates stores for asset management:
 * - Asset Types
 * - Employee Assets
 * - ID Cards
 * - SIM Cards
 * - Employee Emails
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '../../../../types/db/stores';

/**
 * Create all asset management object stores
 */
export function createAssetStores(db: IDBPDatabase<VDODatabase>): void {
  // Asset Types store
  if (!db.objectStoreNames.contains('assetTypes')) {
    const store = db.createObjectStore('assetTypes', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('name', 'name', { unique: true });
    store.createIndex('category', 'category', { unique: false });
    store.createIndex('requiresReturn', 'requiresReturn', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    console.log('Created store: assetTypes');
  }

  // Employee Assets store
  if (!db.objectStoreNames.contains('employeeAssets')) {
    const store = db.createObjectStore('employeeAssets', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('assetTag', 'assetTag', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('assetTypeId', 'assetTypeId', { unique: false });
    store.createIndex('assignedDate', 'assignedDate', { unique: false });
    store.createIndex('returnedDate', 'returnedDate', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('condition', 'condition', { unique: false });
    store.createIndex('issuedBy', 'issuedBy', { unique: false });
    console.log('Created store: employeeAssets');
  }

  // ID Cards store
  if (!db.objectStoreNames.contains('idCards')) {
    const store = db.createObjectStore('idCards', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('cardNumber', 'cardNumber', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('cardType', 'cardType', { unique: false });
    store.createIndex('issueDate', 'issueDate', { unique: false });
    store.createIndex('expiryDate', 'expiryDate', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: idCards');
  }

  // SIM Cards store
  if (!db.objectStoreNames.contains('simCards')) {
    const store = db.createObjectStore('simCards', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('simNumber', 'simNumber', { unique: true });
    store.createIndex('phoneNumber', 'phoneNumber', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('provider', 'provider', { unique: false });
    store.createIndex('assignedDate', 'assignedDate', { unique: false });
    store.createIndex('returnedDate', 'returnedDate', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: simCards');
  }

  // Employee Emails store
  if (!db.objectStoreNames.contains('employeeEmails')) {
    const store = db.createObjectStore('employeeEmails', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('emailAddress', 'emailAddress', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('createdDate', 'createdDate', { unique: false });
    store.createIndex('deactivatedDate', 'deactivatedDate', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: employeeEmails');
  }
}
