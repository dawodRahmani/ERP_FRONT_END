/**
 * Audit Module Object Stores
 *
 * Creates IndexedDB stores for all audit services:
 * - Audit Types (configurable)
 * - HACT Assessments
 * - Donor Project Audits
 * - External Audits
 * - Internal Audits
 * - Partner Audits
 * - Corrective Actions
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '../../../../types/db/stores';

export function createAuditStores(db: IDBPDatabase<VDODatabase>): void {
  // ========== AUDIT TYPES ==========
  if (!db.objectStoreNames.contains('auditTypes')) {
    const store = db.createObjectStore('auditTypes', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('code', 'code', { unique: true });
    store.createIndex('category', 'category', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    store.createIndex('displayOrder', 'displayOrder', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
    console.log('Created auditTypes store');
  }

  // ========== HACT ASSESSMENTS ==========
  if (!db.objectStoreNames.contains('hactAssessments')) {
    const store = db.createObjectStore('hactAssessments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('assessmentNumber', 'assessmentNumber', { unique: true });
    store.createIndex('donorId', 'donorId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('dateAssessmentStarted', 'dateAssessmentStarted', { unique: false });
    store.createIndex('validUntil', 'validUntil', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
    console.log('Created hactAssessments store');
  }

  // ========== DONOR PROJECT AUDITS ==========
  if (!db.objectStoreNames.contains('donorProjectAudits')) {
    const store = db.createObjectStore('donorProjectAudits', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('auditNumber', 'auditNumber', { unique: true });
    store.createIndex('donorId', 'donorId', { unique: false });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('dateAuditStarted', 'dateAuditStarted', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
    console.log('Created donorProjectAudits store');
  }

  // ========== EXTERNAL AUDITS ==========
  if (!db.objectStoreNames.contains('externalAudits')) {
    const store = db.createObjectStore('externalAudits', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('auditNumber', 'auditNumber', { unique: true });
    store.createIndex('auditTypeId', 'auditTypeId', { unique: false });
    store.createIndex('frequency', 'frequency', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('dateAuditPlanned', 'dateAuditPlanned', { unique: false });
    store.createIndex('followUpNeeded', 'followUpNeeded', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
    console.log('Created externalAudits store');
  }

  // ========== EXTERNAL ANNUAL AUDITS ==========
  if (!db.objectStoreNames.contains('externalAnnualAudits')) {
    const store = db.createObjectStore('externalAnnualAudits', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('externalAuditId', 'externalAuditId', { unique: false });
    store.createIndex('year', 'year', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
    console.log('Created externalAnnualAudits store');
  }

  // ========== INTERNAL AUDITS ==========
  if (!db.objectStoreNames.contains('internalAudits')) {
    const store = db.createObjectStore('internalAudits', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('auditNumber', 'auditNumber', { unique: true });
    store.createIndex('auditTypeId', 'auditTypeId', { unique: false });
    store.createIndex('donorId', 'donorId', { unique: false });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('frequency', 'frequency', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('dateAuditPlanned', 'dateAuditPlanned', { unique: false });
    store.createIndex('followUpNeeded', 'followUpNeeded', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
    console.log('Created internalAudits store');
  }

  // ========== INTERNAL QUARTERLY REPORTS ==========
  if (!db.objectStoreNames.contains('internalQuarterlyReports')) {
    const store = db.createObjectStore('internalQuarterlyReports', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('internalAuditId', 'internalAuditId', { unique: false });
    store.createIndex('year', 'year', { unique: false });
    store.createIndex('quarter', 'quarter', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
    console.log('Created internalQuarterlyReports store');
  }

  // ========== PARTNER AUDITS ==========
  if (!db.objectStoreNames.contains('partnerAudits')) {
    const store = db.createObjectStore('partnerAudits', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('auditNumber', 'auditNumber', { unique: true });
    store.createIndex('auditTypeId', 'auditTypeId', { unique: false });
    store.createIndex('partnerName', 'partnerName', { unique: false });
    store.createIndex('auditModality', 'auditModality', { unique: false });
    store.createIndex('auditSource', 'auditSource', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('dateAuditPlanned', 'dateAuditPlanned', { unique: false });
    store.createIndex('followUpNeeded', 'followUpNeeded', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
    console.log('Created partnerAudits store');
  }

  // ========== CORRECTIVE ACTIONS ==========
  if (!db.objectStoreNames.contains('auditCorrectiveActions')) {
    const store = db.createObjectStore('auditCorrectiveActions', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('auditEntityType', 'auditEntityType', { unique: false });
    store.createIndex('auditId', 'auditId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('dueDate', 'dueDate', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
    console.log('Created auditCorrectiveActions store');
  }
}
