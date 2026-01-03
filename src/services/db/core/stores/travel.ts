/**
 * Travel Management Object Stores
 *
 * Creates stores for travel management:
 * - Travel Requests
 * - Travel Approvals
 * - DSA Rates
 * - DSA Payments
 * - Mahram Travel
 * - Work Related Injuries
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '../../../../types/db/stores';

/**
 * Create all travel management object stores
 */
export function createTravelStores(db: IDBPDatabase<VDODatabase>): void {
  // Travel Requests store
  if (!db.objectStoreNames.contains('travelRequests')) {
    const store = db.createObjectStore('travelRequests', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('requestNumber', 'requestNumber', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('destination', 'destination', { unique: false });
    store.createIndex('departureDate', 'departureDate', { unique: false });
    store.createIndex('returnDate', 'returnDate', { unique: false });
    store.createIndex('travelMode', 'travelMode', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('approvedBy', 'approvedBy', { unique: false });
    console.log('Created store: travelRequests');
  }

  // Travel Approvals store
  if (!db.objectStoreNames.contains('travelApprovals')) {
    const store = db.createObjectStore('travelApprovals', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('travelRequestId', 'travelRequestId', { unique: false });
    store.createIndex('approverId', 'approverId', { unique: false });
    store.createIndex('approvalLevel', 'approvalLevel', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('approvalDate', 'approvalDate', { unique: false });
    console.log('Created store: travelApprovals');
  }

  // DSA Rates store
  if (!db.objectStoreNames.contains('dsaRates')) {
    const store = db.createObjectStore('dsaRates', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('location', 'location', { unique: false });
    store.createIndex('locationType', 'locationType', { unique: false });
    store.createIndex('dailyRate', 'dailyRate', { unique: false });
    store.createIndex('effectiveFrom', 'effectiveFrom', { unique: false });
    store.createIndex('effectiveTo', 'effectiveTo', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    console.log('Created store: dsaRates');
  }

  // DSA Payments store
  if (!db.objectStoreNames.contains('dsaPayments')) {
    const store = db.createObjectStore('dsaPayments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('paymentNumber', 'paymentNumber', { unique: true });
    store.createIndex('travelRequestId', 'travelRequestId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('totalAmount', 'totalAmount', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('paymentDate', 'paymentDate', { unique: false });
    console.log('Created store: dsaPayments');
  }

  // Mahram Travel store
  if (!db.objectStoreNames.contains('mahramTravel')) {
    const store = db.createObjectStore('mahramTravel', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('travelRequestId', 'travelRequestId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('mahramName', 'mahramName', { unique: false });
    store.createIndex('relationship', 'relationship', { unique: false });
    store.createIndex('verificationStatus', 'verificationStatus', {
      unique: false,
    });
    console.log('Created store: mahramTravel');
  }

  // Work Related Injuries store
  if (!db.objectStoreNames.contains('workRelatedInjuries')) {
    const store = db.createObjectStore('workRelatedInjuries', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('incidentNumber', 'incidentNumber', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('incidentDate', 'incidentDate', { unique: false });
    store.createIndex('incidentLocation', 'incidentLocation', { unique: false });
    store.createIndex('injuryType', 'injuryType', { unique: false });
    store.createIndex('reportedDate', 'reportedDate', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('claimAmount', 'claimAmount', { unique: false });
    console.log('Created store: workRelatedInjuries');
  }
}
