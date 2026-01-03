/**
 * Training Module Object Stores
 *
 * Creates stores for training and development system.
 * Covers: Training Types, Programs, TNAs, Calendar, Budget, Sessions, Evaluations, Certificates, Bonds
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '../../../../types/db/stores';

/**
 * Create all training-related object stores
 */
export function createTrainingStores(db: IDBPDatabase<VDODatabase>): void {
  // Training Types store
  if (!db.objectStoreNames.contains('trainingTypes')) {
    const store = db.createObjectStore('trainingTypes', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('code', 'code', { unique: true });
    store.createIndex('category', 'category', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    store.createIndex('isMandatory', 'isMandatory', { unique: false });
    console.log('Created store: trainingTypes');
  }

  // Training Programs store
  if (!db.objectStoreNames.contains('trainingPrograms')) {
    const store = db.createObjectStore('trainingPrograms', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('programCode', 'programCode', { unique: true });
    store.createIndex('trainingTypeId', 'trainingTypeId', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    console.log('Created store: trainingPrograms');
  }

  // Training Needs Assessments store
  if (!db.objectStoreNames.contains('trainingNeedsAssessments')) {
    const store = db.createObjectStore('trainingNeedsAssessments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('assessmentNumber', 'assessmentNumber', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('assessmentPeriod', 'assessmentPeriod', { unique: false });
    console.log('Created store: trainingNeedsAssessments');
  }

  // TNA Training Needs store
  if (!db.objectStoreNames.contains('tnaTrainingNeeds')) {
    const store = db.createObjectStore('tnaTrainingNeeds', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('tnaId', 'tnaId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: tnaTrainingNeeds');
  }

  // Training Calendar store
  if (!db.objectStoreNames.contains('trainingCalendar')) {
    const store = db.createObjectStore('trainingCalendar', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('fiscalYear', 'fiscalYear', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: trainingCalendar');
  }

  // Training Budget Proposals store
  if (!db.objectStoreNames.contains('trainingBudgetProposals')) {
    const store = db.createObjectStore('trainingBudgetProposals', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('proposalNumber', 'proposalNumber', { unique: true });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: trainingBudgetProposals');
  }

  // Trainings store
  if (!db.objectStoreNames.contains('trainings')) {
    const store = db.createObjectStore('trainings', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('trainingCode', 'trainingCode', { unique: true });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('startDate', 'startDate', { unique: false });
    console.log('Created store: trainings');
  }

  // Training Participants store
  if (!db.objectStoreNames.contains('trainingParticipants')) {
    const store = db.createObjectStore('trainingParticipants', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('trainingId', 'trainingId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    console.log('Created store: trainingParticipants');
  }

  // Training Sessions store
  if (!db.objectStoreNames.contains('trainingSessions')) {
    const store = db.createObjectStore('trainingSessions', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('trainingId', 'trainingId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: trainingSessions');
  }

  // Training Evaluations store
  if (!db.objectStoreNames.contains('trainingEvaluations')) {
    const store = db.createObjectStore('trainingEvaluations', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('trainingId', 'trainingId', { unique: false });
    store.createIndex('participantId', 'participantId', { unique: false });
    console.log('Created store: trainingEvaluations');
  }

  // Training Certificates store
  if (!db.objectStoreNames.contains('trainingCertificates')) {
    const store = db.createObjectStore('trainingCertificates', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('certificateNumber', 'certificateNumber', { unique: true });
    store.createIndex('trainingId', 'trainingId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: trainingCertificates');
  }

  // Training Bonds store
  if (!db.objectStoreNames.contains('trainingBonds')) {
    const store = db.createObjectStore('trainingBonds', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('bondNumber', 'bondNumber', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: trainingBonds');
  }

  // Employee Training History store
  if (!db.objectStoreNames.contains('employeeTrainingHistory')) {
    const store = db.createObjectStore('employeeTrainingHistory', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    console.log('Created store: employeeTrainingHistory');
  }

  // Training Reports store
  if (!db.objectStoreNames.contains('trainingReports')) {
    const store = db.createObjectStore('trainingReports', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('reportNumber', 'reportNumber', { unique: true });
    store.createIndex('trainingId', 'trainingId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: trainingReports');
  }
}
