/**
 * Employee Administration Object Stores
 *
 * Creates stores for employee administration system.
 * Covers: Emergency Contacts, Education, Experience, Skills, Medical, Personnel Files, Onboarding
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '@/types/db/stores';

/**
 * Create all employee administration object stores
 */
export function createEmployeeAdminStores(db: IDBPDatabase<VDODatabase>): void {
  // Emergency Contacts store
  if (!db.objectStoreNames.contains('emergencyContacts')) {
    const store = db.createObjectStore('emergencyContacts', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('relationship', 'relationship', { unique: false });
    store.createIndex('isPrimary', 'isPrimary', { unique: false });
    console.log('Created store: emergencyContacts');
  }

  // Employee Education store
  if (!db.objectStoreNames.contains('employeeEducation')) {
    const store = db.createObjectStore('employeeEducation', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('level', 'level', { unique: false });
    store.createIndex('isVerified', 'isVerified', { unique: false });
    console.log('Created store: employeeEducation');
  }

  // Employee Experience store
  if (!db.objectStoreNames.contains('employeeExperience')) {
    const store = db.createObjectStore('employeeExperience', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('isVerified', 'isVerified', { unique: false });
    console.log('Created store: employeeExperience');
  }

  // Employee Skills store
  if (!db.objectStoreNames.contains('employeeSkills')) {
    const store = db.createObjectStore('employeeSkills', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('skillType', 'skillType', { unique: false });
    store.createIndex('proficiency', 'proficiency', { unique: false });
    console.log('Created store: employeeSkills');
  }

  // Employee Medical Info store
  if (!db.objectStoreNames.contains('employeeMedical')) {
    const store = db.createObjectStore('employeeMedical', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: true });
    store.createIndex('bloodType', 'bloodType', { unique: false });
    console.log('Created store: employeeMedical');
  }

  // Personnel Files store
  if (!db.objectStoreNames.contains('personnelFiles')) {
    const store = db.createObjectStore('personnelFiles', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: true });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('lastAuditDate', 'lastAuditDate', { unique: false });
    console.log('Created store: personnelFiles');
  }

  // Personnel Documents store
  if (!db.objectStoreNames.contains('personnelDocuments')) {
    const store = db.createObjectStore('personnelDocuments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('personnelFileId', 'personnelFileId', { unique: false });
    store.createIndex('section', 'section', { unique: false });
    store.createIndex('documentType', 'documentType', { unique: false });
    store.createIndex('isVerified', 'isVerified', { unique: false });
    console.log('Created store: personnelDocuments');
  }

  // Onboarding Checklists store
  if (!db.objectStoreNames.contains('onboardingChecklists')) {
    const store = db.createObjectStore('onboardingChecklists', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: true });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('startDate', 'startDate', { unique: false });
    store.createIndex('completedDate', 'completedDate', { unique: false });
    console.log('Created store: onboardingChecklists');
  }

  // Onboarding Items store
  if (!db.objectStoreNames.contains('onboardingItems')) {
    const store = db.createObjectStore('onboardingItems', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('checklistId', 'checklistId', { unique: false });
    store.createIndex('section', 'section', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('assignedTo', 'assignedTo', { unique: false });
    console.log('Created store: onboardingItems');
  }

  // Policy Acknowledgements store
  if (!db.objectStoreNames.contains('policyAcknowledgements')) {
    const store = db.createObjectStore('policyAcknowledgements', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('policyName', 'policyName', { unique: false });
    store.createIndex('acknowledgedDate', 'acknowledgedDate', { unique: false });
    store.createIndex('version', 'version', { unique: false });
    console.log('Created store: policyAcknowledgements');
  }

  // Interim Hiring Requests store
  if (!db.objectStoreNames.contains('interimHiringRequests')) {
    const store = db.createObjectStore('interimHiringRequests', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('requestNumber', 'requestNumber', { unique: true });
    store.createIndex('department', 'department', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('requestedBy', 'requestedBy', { unique: false });
    store.createIndex('requestDate', 'requestDate', { unique: false });
    store.createIndex('urgency', 'urgency', { unique: false });
    console.log('Created store: interimHiringRequests');
  }

  // Interim Hiring Approvals store
  if (!db.objectStoreNames.contains('interimHiringApprovals')) {
    const store = db.createObjectStore('interimHiringApprovals', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('requestId', 'requestId', { unique: false });
    store.createIndex('level', 'level', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('approvedBy', 'approvedBy', { unique: false });
    store.createIndex('approvalDate', 'approvalDate', { unique: false });
    console.log('Created store: interimHiringApprovals');
  }

  // Mahram Registrations store
  if (!db.objectStoreNames.contains('mahramRegistrations')) {
    const store = db.createObjectStore('mahramRegistrations', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('mahramName', 'mahramName', { unique: false });
    store.createIndex('relationship', 'relationship', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('availability', 'availability', { unique: false });
    store.createIndex('isVerified', 'isVerified', { unique: false });
    console.log('Created store: mahramRegistrations');
  }

  // Employee Status History store
  if (!db.objectStoreNames.contains('employeeStatusHistory')) {
    const store = db.createObjectStore('employeeStatusHistory', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('fromStatus', 'fromStatus', { unique: false });
    store.createIndex('toStatus', 'toStatus', { unique: false });
    store.createIndex('changedAt', 'changedAt', { unique: false });
    store.createIndex('changedBy', 'changedBy', { unique: false });
    console.log('Created store: employeeStatusHistory');
  }
}
