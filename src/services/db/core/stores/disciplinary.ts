/**
 * Disciplinary Module Object Stores
 *
 * Creates stores for disciplinary management system.
 * Covers: Misconduct Reports, Investigations, Actions, Appeals, Grievances
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '@/types/db/stores';

/**
 * Create all disciplinary-related object stores
 */
export function createDisciplinaryStores(db: IDBPDatabase<VDODatabase>): void {
  // Misconduct Reports store
  if (!db.objectStoreNames.contains('misconductReports')) {
    const store = db.createObjectStore('misconductReports', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('reportNumber', 'reportNumber', { unique: true });
    store.createIndex('accusedEmployeeId', 'accusedEmployeeId', { unique: false });
    store.createIndex('reportSource', 'reportSource', { unique: false });
    store.createIndex('misconductCategory', 'misconductCategory', { unique: false });
    store.createIndex('misconductType', 'misconductType', { unique: false });
    store.createIndex('severityLevel', 'severityLevel', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('reportDate', 'reportDate', { unique: false });
    console.log('Created store: misconductReports');
  }

  // Misconduct Evidence store
  if (!db.objectStoreNames.contains('misconductEvidence')) {
    const store = db.createObjectStore('misconductEvidence', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('reportId', 'reportId', { unique: false });
    store.createIndex('investigationId', 'investigationId', { unique: false });
    store.createIndex('evidenceType', 'evidenceType', { unique: false });
    console.log('Created store: misconductEvidence');
  }

  // Investigations store
  if (!db.objectStoreNames.contains('disciplinaryInvestigations')) {
    const store = db.createObjectStore('disciplinaryInvestigations', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('investigationNumber', 'investigationNumber', { unique: true });
    store.createIndex('reportId', 'reportId', { unique: false });
    store.createIndex('accusedEmployeeId', 'accusedEmployeeId', { unique: false });
    store.createIndex('investigationType', 'investigationType', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('leadInvestigatorId', 'leadInvestigatorId', { unique: false });
    console.log('Created store: disciplinaryInvestigations');
  }

  // Investigation Interviews store
  if (!db.objectStoreNames.contains('investigationInterviews')) {
    const store = db.createObjectStore('investigationInterviews', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('investigationId', 'investigationId', { unique: false });
    store.createIndex('interviewType', 'interviewType', { unique: false });
    store.createIndex('interviewDate', 'interviewDate', { unique: false });
    console.log('Created store: investigationInterviews');
  }

  // Precautionary Suspensions store
  if (!db.objectStoreNames.contains('precautionarySuspensions')) {
    const store = db.createObjectStore('precautionarySuspensions', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('reportId', 'reportId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('suspensionType', 'suspensionType', { unique: false });
    console.log('Created store: precautionarySuspensions');
  }

  // Disciplinary Actions store
  if (!db.objectStoreNames.contains('disciplinaryActions')) {
    const store = db.createObjectStore('disciplinaryActions', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('actionNumber', 'actionNumber', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('actionType', 'actionType', { unique: false });
    store.createIndex('actionLevel', 'actionLevel', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('issueDate', 'issueDate', { unique: false });
    store.createIndex('expiryDate', 'expiryDate', { unique: false });
    console.log('Created store: disciplinaryActions');
  }

  // Disciplinary Appeals store
  if (!db.objectStoreNames.contains('disciplinaryAppeals')) {
    const store = db.createObjectStore('disciplinaryAppeals', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('appealNumber', 'appealNumber', { unique: true });
    store.createIndex('disciplinaryActionId', 'disciplinaryActionId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: disciplinaryAppeals');
  }

  // Employee Warning History store
  if (!db.objectStoreNames.contains('employeeWarningHistory')) {
    const store = db.createObjectStore('employeeWarningHistory', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('warningType', 'warningType', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    store.createIndex('expiryDate', 'expiryDate', { unique: false });
    console.log('Created store: employeeWarningHistory');
  }

  // Grievances store
  if (!db.objectStoreNames.contains('employeeGrievances')) {
    const store = db.createObjectStore('employeeGrievances', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('grievanceNumber', 'grievanceNumber', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('grievanceType', 'grievanceType', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('assignedTo', 'assignedTo', { unique: false });
    console.log('Created store: employeeGrievances');
  }

  // Compliance Incidents store
  if (!db.objectStoreNames.contains('complianceIncidents')) {
    const store = db.createObjectStore('complianceIncidents', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('incidentNumber', 'incidentNumber', { unique: true });
    store.createIndex('reportId', 'reportId', { unique: false });
    store.createIndex('incidentType', 'incidentType', { unique: false });
    store.createIndex('severity', 'severity', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: complianceIncidents');
  }

  // Case Notes store
  if (!db.objectStoreNames.contains('misconductCaseNotes')) {
    const store = db.createObjectStore('misconductCaseNotes', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('caseType', 'caseType', { unique: false });
    store.createIndex('caseId', 'caseId', { unique: false });
    store.createIndex('noteType', 'noteType', { unique: false });
    console.log('Created store: misconductCaseNotes');
  }
}
