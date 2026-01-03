/**
 * Core HR Object Stores
 *
 * Creates fundamental HR stores: Employees, Departments, Positions, Offices, etc.
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '../../../../types/db/stores';

/**
 * Create all core HR object stores
 */
export function createCoreHRStores(db: IDBPDatabase<VDODatabase>): void {
  // Employees store
  if (!db.objectStoreNames.contains('employees')) {
    const employeeStore = db.createObjectStore('employees', {
      keyPath: 'id',
      autoIncrement: true,
    });
    employeeStore.createIndex('employeeId', 'employeeId', { unique: true });
    employeeStore.createIndex('email', 'email', { unique: false });
    employeeStore.createIndex('department', 'department', { unique: false });
    employeeStore.createIndex('status', 'status', { unique: false });
    employeeStore.createIndex('createdAt', 'createdAt', { unique: false });
  }

  // Employee Position History store
  if (!db.objectStoreNames.contains('employeePositionHistory')) {
    const positionHistoryStore = db.createObjectStore('employeePositionHistory', {
      keyPath: 'id',
      autoIncrement: true,
    });
    positionHistoryStore.createIndex('employeeId', 'employeeId', { unique: false });
    positionHistoryStore.createIndex('position', 'position', { unique: false });
    positionHistoryStore.createIndex('department', 'department', { unique: false });
    positionHistoryStore.createIndex('project', 'project', { unique: false });
    positionHistoryStore.createIndex('startDate', 'startDate', { unique: false });
    positionHistoryStore.createIndex('endDate', 'endDate', { unique: false });
    positionHistoryStore.createIndex('createdAt', 'createdAt', { unique: false });

  }

  // Departments store
  if (!db.objectStoreNames.contains('departments')) {
    const deptStore = db.createObjectStore('departments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    deptStore.createIndex('name', 'name', { unique: true });
  }

  // Positions store
  if (!db.objectStoreNames.contains('positions')) {
    const posStore = db.createObjectStore('positions', {
      keyPath: 'id',
      autoIncrement: true,
    });
    posStore.createIndex('title', 'title', { unique: false });
    posStore.createIndex('department', 'department', { unique: false });
  }

  // Offices store
  if (!db.objectStoreNames.contains('offices')) {
    const officeStore = db.createObjectStore('offices', {
      keyPath: 'id',
      autoIncrement: true,
    });
    officeStore.createIndex('name', 'name', { unique: true });
  }

  // Grades store
  if (!db.objectStoreNames.contains('grades')) {
    const gradeStore = db.createObjectStore('grades', {
      keyPath: 'id',
      autoIncrement: true,
    });
    gradeStore.createIndex('name', 'name', { unique: true });
  }

  // Employee Types store
  if (!db.objectStoreNames.contains('employeeTypes')) {
    const typeStore = db.createObjectStore('employeeTypes', {
      keyPath: 'id',
      autoIncrement: true,
    });
    typeStore.createIndex('name', 'name', { unique: true });
  }

  // Work Schedules store
  if (!db.objectStoreNames.contains('workSchedules')) {
    const scheduleStore = db.createObjectStore('workSchedules', {
      keyPath: 'id',
      autoIncrement: true,
    });
    scheduleStore.createIndex('name', 'name', { unique: true });
  }

  // Document Types store
  if (!db.objectStoreNames.contains('documentTypes')) {
    const docTypeStore = db.createObjectStore('documentTypes', {
      keyPath: 'id',
      autoIncrement: true,
    });
    docTypeStore.createIndex('name', 'name', { unique: true });
  }

  // Template Documents store
  if (!db.objectStoreNames.contains('templateDocuments')) {
    const templateStore = db.createObjectStore('templateDocuments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    templateStore.createIndex('name', 'name', { unique: false });
    templateStore.createIndex('category', 'category', { unique: false });
    templateStore.createIndex('createdAt', 'createdAt', { unique: false });
  }

  // Users store
  if (!db.objectStoreNames.contains('users')) {
    const userStore = db.createObjectStore('users', {
      keyPath: 'id',
      autoIncrement: true,
    });
    userStore.createIndex('email', 'email', { unique: true });
    userStore.createIndex('username', 'username', { unique: true });
    userStore.createIndex('roleId', 'roleId', { unique: false });
    userStore.createIndex('status', 'status', { unique: false });
    userStore.createIndex('employeeId', 'employeeId', { unique: false });
  }

  // Roles store
  if (!db.objectStoreNames.contains('roles')) {
    const roleStore = db.createObjectStore('roles', {
      keyPath: 'id',
      autoIncrement: true,
    });
    roleStore.createIndex('name', 'name', { unique: true });
  }

  // Permissions store
  if (!db.objectStoreNames.contains('permissions')) {
    const permStore = db.createObjectStore('permissions', {
      keyPath: 'id',
      autoIncrement: true,
    });
    permStore.createIndex('name', 'name', { unique: true });
    permStore.createIndex('module', 'module', { unique: false });
  }

  // Role Permissions store (junction table)
  if (!db.objectStoreNames.contains('rolePermissions')) {
    const rpStore = db.createObjectStore('rolePermissions', {
      keyPath: 'id',
      autoIncrement: true,
    });
    rpStore.createIndex('roleId', 'roleId', { unique: false });
    rpStore.createIndex('permissionId', 'permissionId', { unique: false });
  }

  // Attendance store
  if (!db.objectStoreNames.contains('attendance')) {
    const attendanceStore = db.createObjectStore('attendance', {
      keyPath: 'id',
      autoIncrement: true,
    });
    attendanceStore.createIndex('employeeId', 'employeeId', { unique: false });
    attendanceStore.createIndex('date', 'date', { unique: false });
    attendanceStore.createIndex('status', 'status', { unique: false });
  }
}
