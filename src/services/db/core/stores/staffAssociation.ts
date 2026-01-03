/**
 * Staff Association Object Stores
 *
 * Creates stores for staff association:
 * - Staff Association Positions
 * - Staff Association Members
 * - Association Meetings
 * - Association Activities
 * - Staff Association Contributions
 * - Staff Welfare Requests
 * - Staff Welfare Payments
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '../../../../types/db/stores';

/**
 * Create all staff association object stores
 */
export function createStaffAssociationStores(
  db: IDBPDatabase<VDODatabase>
): void {
  // Staff Association Positions store
  if (!db.objectStoreNames.contains('staffAssociationPositions')) {
    const store = db.createObjectStore('staffAssociationPositions', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('title', 'title', { unique: true });
    store.createIndex('isExecutive', 'isExecutive', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    console.log('Created store: staffAssociationPositions');
  }

  // Staff Association Members store
  if (!db.objectStoreNames.contains('staffAssociationMembers')) {
    const store = db.createObjectStore('staffAssociationMembers', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('positionId', 'positionId', { unique: false });
    store.createIndex('termStart', 'termStart', { unique: false });
    store.createIndex('termEnd', 'termEnd', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('electionDate', 'electionDate', { unique: false });
    console.log('Created store: staffAssociationMembers');
  }

  // Association Meetings store
  if (!db.objectStoreNames.contains('associationMeetings')) {
    const store = db.createObjectStore('associationMeetings', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('meetingNumber', 'meetingNumber', { unique: true });
    store.createIndex('meetingType', 'meetingType', { unique: false });
    store.createIndex('meetingDate', 'meetingDate', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('attendeeCount', 'attendeeCount', { unique: false });
    console.log('Created store: associationMeetings');
  }

  // Association Activities store
  if (!db.objectStoreNames.contains('associationActivities')) {
    const store = db.createObjectStore('associationActivities', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('activityType', 'activityType', { unique: false });
    store.createIndex('activityDate', 'activityDate', { unique: false });
    store.createIndex('organizedBy', 'organizedBy', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('budget', 'budget', { unique: false });
    store.createIndex('participantCount', 'participantCount', { unique: false });
    console.log('Created store: associationActivities');
  }

  // Staff Association Contributions store
  if (!db.objectStoreNames.contains('staffAssociationContributions')) {
    const store = db.createObjectStore('staffAssociationContributions', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('memberId', 'memberId', { unique: false });
    store.createIndex('memberName', 'memberName', { unique: false });
    store.createIndex('period', 'period', { unique: false });
    store.createIndex('amount', 'amount', { unique: false });
    store.createIndex('paymentDate', 'paymentDate', { unique: false });
    store.createIndex('paymentMethod', 'paymentMethod', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: staffAssociationContributions');
  }

  // Staff Welfare Requests store
  if (!db.objectStoreNames.contains('staffWelfareRequests')) {
    const store = db.createObjectStore('staffWelfareRequests', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('memberId', 'memberId', { unique: false });
    store.createIndex('memberName', 'memberName', { unique: false });
    store.createIndex('requestType', 'requestType', { unique: false });
    store.createIndex('amountRequested', 'amountRequested', { unique: false });
    store.createIndex('amountApproved', 'amountApproved', { unique: false });
    store.createIndex('requestDate', 'requestDate', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: staffWelfareRequests');
  }

  // Staff Welfare Payments store
  if (!db.objectStoreNames.contains('staffWelfarePayments')) {
    const store = db.createObjectStore('staffWelfarePayments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('memberId', 'memberId', { unique: false });
    store.createIndex('memberName', 'memberName', { unique: false });
    store.createIndex('requestId', 'requestId', { unique: false });
    store.createIndex('requestReference', 'requestReference', { unique: false });
    store.createIndex('amountPaid', 'amountPaid', { unique: false });
    store.createIndex('paymentDate', 'paymentDate', { unique: false });
    store.createIndex('paymentMethod', 'paymentMethod', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: staffWelfarePayments');
  }
}
