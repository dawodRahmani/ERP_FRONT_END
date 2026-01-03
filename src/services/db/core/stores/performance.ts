/**
 * Performance Management Object Stores
 *
 * Creates stores for performance appraisal system.
 * Covers: Appraisal Cycles, Templates, Sections, Criteria, Ratings, Goals,
 * Probation Records, PIPs, and Outcomes
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '../../../../types/db/stores';

/**
 * Create all performance management object stores
 */
export function createPerformanceStores(db: IDBPDatabase<VDODatabase>): void {
  // Appraisal Cycles store
  if (!db.objectStoreNames.contains('appraisalCycles')) {
    const store = db.createObjectStore('appraisalCycles', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('startDate', 'startDate', { unique: false });
    store.createIndex('endDate', 'endDate', { unique: false });
    console.log('Created store: appraisalCycles');
  }

  // Appraisal Templates store
  if (!db.objectStoreNames.contains('appraisalTemplates')) {
    const store = db.createObjectStore('appraisalTemplates', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('name', 'name', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    console.log('Created store: appraisalTemplates');
  }

  // Appraisal Sections store
  if (!db.objectStoreNames.contains('appraisalSections')) {
    const store = db.createObjectStore('appraisalSections', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('templateId', 'templateId', { unique: false });
    store.createIndex('displayOrder', 'displayOrder', { unique: false });
    console.log('Created store: appraisalSections');
  }

  // Appraisal Criteria store
  if (!db.objectStoreNames.contains('appraisalCriteria')) {
    const store = db.createObjectStore('appraisalCriteria', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('sectionId', 'sectionId', { unique: false });
    console.log('Created store: appraisalCriteria');
  }

  // Employee Appraisals store
  if (!db.objectStoreNames.contains('employeeAppraisals')) {
    const store = db.createObjectStore('employeeAppraisals', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('cycleId', 'cycleId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('templateId', 'templateId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: employeeAppraisals');
  }

  // Appraisal Ratings store
  if (!db.objectStoreNames.contains('appraisalRatings')) {
    const store = db.createObjectStore('appraisalRatings', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('appraisalId', 'appraisalId', { unique: false });
    store.createIndex('criteriaId', 'criteriaId', { unique: false });
    console.log('Created store: appraisalRatings');
  }

  // Appraisal Committee Members store
  if (!db.objectStoreNames.contains('appraisalCommitteeMembers')) {
    const store = db.createObjectStore('appraisalCommitteeMembers', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('appraisalId', 'appraisalId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    console.log('Created store: appraisalCommitteeMembers');
  }

  // Appraisal Goals store
  if (!db.objectStoreNames.contains('appraisalGoals')) {
    const store = db.createObjectStore('appraisalGoals', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('appraisalId', 'appraisalId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: appraisalGoals');
  }

  // Appraisal Training Needs store
  if (!db.objectStoreNames.contains('appraisalTrainingNeeds')) {
    const store = db.createObjectStore('appraisalTrainingNeeds', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('appraisalId', 'appraisalId', { unique: false });
    console.log('Created store: appraisalTrainingNeeds');
  }

  // Probation Records store
  if (!db.objectStoreNames.contains('probationRecords')) {
    const store = db.createObjectStore('probationRecords', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('startDate', 'startDate', { unique: false });
    store.createIndex('endDate', 'endDate', { unique: false });
    console.log('Created store: probationRecords');
  }

  // Probation Extensions store
  if (!db.objectStoreNames.contains('probationExtensions')) {
    const store = db.createObjectStore('probationExtensions', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('probationId', 'probationId', { unique: false });
    console.log('Created store: probationExtensions');
  }

  // Probation KPIs store
  if (!db.objectStoreNames.contains('probationKpis')) {
    const store = db.createObjectStore('probationKpis', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('probationId', 'probationId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: probationKpis');
  }

  // Performance Improvement Plans store
  if (!db.objectStoreNames.contains('performanceImprovementPlans')) {
    const store = db.createObjectStore('performanceImprovementPlans', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: performanceImprovementPlans');
  }

  // PIP Goals store
  if (!db.objectStoreNames.contains('pipGoals')) {
    const store = db.createObjectStore('pipGoals', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('pipId', 'pipId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: pipGoals');
  }

  // PIP Check-ins store
  if (!db.objectStoreNames.contains('pipCheckIns')) {
    const store = db.createObjectStore('pipCheckIns', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('pipId', 'pipId', { unique: false });
    store.createIndex('checkInDate', 'checkInDate', { unique: false });
    console.log('Created store: pipCheckIns');
  }

  // Appraisal Outcomes store
  if (!db.objectStoreNames.contains('appraisalOutcomes')) {
    const store = db.createObjectStore('appraisalOutcomes', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('appraisalId', 'appraisalId', { unique: false });
    store.createIndex('outcome', 'outcome', { unique: false });
    console.log('Created store: appraisalOutcomes');
  }

  // Individual Development Plans store (Legacy support)
  if (!db.objectStoreNames.contains('individualDevelopmentPlans')) {
    const store = db.createObjectStore('individualDevelopmentPlans', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('idpId', 'idpId', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('startDate', 'startDate', { unique: false });
    store.createIndex('endDate', 'endDate', { unique: false });
    console.log('Created store: individualDevelopmentPlans');
  }

  // IDP Goals store (Legacy support)
  if (!db.objectStoreNames.contains('idpGoals')) {
    const store = db.createObjectStore('idpGoals', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('idpId', 'idpId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: idpGoals');
  }
}
