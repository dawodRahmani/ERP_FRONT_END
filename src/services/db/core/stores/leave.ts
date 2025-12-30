/**
 * Leave Management Object Stores
 *
 * Creates stores for leave management system.
 * Covers: Leave Types, Policies, Balances, Requests, Approvals, Holidays, Timesheets, OIC
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '@/types/db/stores';

/**
 * Create all leave management object stores
 */
export function createLeaveStores(db: IDBPDatabase<VDODatabase>): void {
  // Leave Types store
  if (!db.objectStoreNames.contains('leaveTypes')) {
    const store = db.createObjectStore('leaveTypes', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('name', 'name', { unique: false });
    store.createIndex('code', 'code', { unique: true });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    store.createIndex('displayOrder', 'displayOrder', { unique: false });
    console.log('Created store: leaveTypes');
  }

  // Leave Policies store
  if (!db.objectStoreNames.contains('leavePolicies')) {
    const store = db.createObjectStore('leavePolicies', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('leaveTypeId', 'leaveTypeId', { unique: false });
    store.createIndex('fiscalYear', 'fiscalYear', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    console.log('Created store: leavePolicies');
  }

  // Employee Leave Balances store
  if (!db.objectStoreNames.contains('employeeLeaveBalances')) {
    const store = db.createObjectStore('employeeLeaveBalances', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('leaveTypeId', 'leaveTypeId', { unique: false });
    store.createIndex('fiscalYear', 'fiscalYear', { unique: false });
    store.createIndex('employeeId_leaveTypeId_fiscalYear', ['employeeId', 'leaveTypeId', 'fiscalYear'], {
      unique: true,
    });
    console.log('Created store: employeeLeaveBalances');
  }

  // Leave Requests store
  if (!db.objectStoreNames.contains('leaveRequests')) {
    const store = db.createObjectStore('leaveRequests', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('requestNumber', 'requestNumber', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('leaveTypeId', 'leaveTypeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('startDate', 'startDate', { unique: false });
    store.createIndex('endDate', 'endDate', { unique: false });
    store.createIndex('department', 'department', { unique: false });
    console.log('Created store: leaveRequests');
  }

  // Leave Request Days store
  if (!db.objectStoreNames.contains('leaveRequestDays')) {
    const store = db.createObjectStore('leaveRequestDays', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('leaveRequestId', 'leaveRequestId', { unique: false });
    store.createIndex('date', 'date', { unique: false });
    console.log('Created store: leaveRequestDays');
  }

  // Leave Approvals store
  if (!db.objectStoreNames.contains('leaveApprovals')) {
    const store = db.createObjectStore('leaveApprovals', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('leaveRequestId', 'leaveRequestId', { unique: false });
    store.createIndex('level', 'level', { unique: false });
    store.createIndex('approverId', 'approverId', { unique: false });
    store.createIndex('action', 'action', { unique: false });
    store.createIndex('isPending', 'isPending', { unique: false });
    console.log('Created store: leaveApprovals');
  }

  // Holidays store
  if (!db.objectStoreNames.contains('holidays')) {
    const store = db.createObjectStore('holidays', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('date', 'date', { unique: false });
    store.createIndex('fiscalYear', 'fiscalYear', { unique: false });
    store.createIndex('holidayType', 'holidayType', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    console.log('Created store: holidays');
  }

  // Attendance store
  if (!db.objectStoreNames.contains('attendance')) {
    const store = db.createObjectStore('attendance', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('date', 'date', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('employeeId_date', ['employeeId', 'date'], { unique: true });
    console.log('Created store: attendance');
  }

  // Timesheets store
  if (!db.objectStoreNames.contains('timesheets')) {
    const store = db.createObjectStore('timesheets', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('month', 'month', { unique: false });
    store.createIndex('year', 'year', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('employeeId_month_year', ['employeeId', 'month', 'year'], { unique: true });
    console.log('Created store: timesheets');
  }

  // OIC Assignments store
  if (!db.objectStoreNames.contains('oicAssignments')) {
    const store = db.createObjectStore('oicAssignments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('leaveRequestId', 'leaveRequestId', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('oicEmployeeId', 'oicEmployeeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: oicAssignments');
  }

  // Leave Adjustments store
  if (!db.objectStoreNames.contains('leaveAdjustments')) {
    const store = db.createObjectStore('leaveAdjustments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('leaveTypeId', 'leaveTypeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('fiscalYear', 'fiscalYear', { unique: false });
    console.log('Created store: leaveAdjustments');
  }

  // Leave Carryover Records store
  if (!db.objectStoreNames.contains('leaveCarryoverRecords')) {
    const store = db.createObjectStore('leaveCarryoverRecords', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('leaveTypeId', 'leaveTypeId', { unique: false });
    store.createIndex('fromYear', 'fromYear', { unique: false });
    store.createIndex('toYear', 'toYear', { unique: false });
    console.log('Created store: leaveCarryoverRecords');
  }
}
