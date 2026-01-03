/**
 * Program Module Object Stores
 *
 * Creates stores for program management system.
 * Covers: Donors, Projects, Work Plans, Certificates, Documents, Reporting, Beneficiaries, Safeguarding
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '../../../../types/db/stores';

/**
 * Create all program-related object stores
 */
export function createProgramStores(db: IDBPDatabase<VDODatabase>): void {
  // Program Donors store (Master Data)
  if (!db.objectStoreNames.contains('programDonors')) {
    const store = db.createObjectStore('programDonors', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('donorName', 'donorName', { unique: false });
    store.createIndex('donorType', 'donorType', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('country', 'country', { unique: false });
    console.log('Created store: programDonors');
  }

  // Program Projects store (Master Data)
  if (!db.objectStoreNames.contains('programProjects')) {
    const store = db.createObjectStore('programProjects', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('projectCode', 'projectCode', { unique: true });
    store.createIndex('donorId', 'donorId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('thematicArea', 'thematicArea', { unique: false });
    store.createIndex('location', 'location', { unique: false });
    store.createIndex('startDate', 'startDate', { unique: false });
    store.createIndex('endDate', 'endDate', { unique: false });
    console.log('Created store: programProjects');
  }

  // Program Work Plans store
  if (!db.objectStoreNames.contains('programWorkPlans')) {
    const store = db.createObjectStore('programWorkPlans', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('thematicArea', 'thematicArea', { unique: false });
    store.createIndex('focalPoint', 'focalPoint', { unique: false });
    store.createIndex('location', 'location', { unique: false });
    console.log('Created store: programWorkPlans');
  }

  // Program Certificates store
  if (!db.objectStoreNames.contains('programCertificates')) {
    const store = db.createObjectStore('programCertificates', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('agency', 'agency', { unique: false });
    store.createIndex('documentType', 'documentType', { unique: false });
    store.createIndex('year', 'year', { unique: false });
    console.log('Created store: programCertificates');
  }

  // Program Documents store
  if (!db.objectStoreNames.contains('programDocuments')) {
    const store = db.createObjectStore('programDocuments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('documentType', 'documentType', { unique: false });
    store.createIndex('uploadedBy', 'uploadedBy', { unique: false });
    store.createIndex('uploadDate', 'uploadDate', { unique: false });
    console.log('Created store: programDocuments');
  }

  // Program Reporting store
  if (!db.objectStoreNames.contains('programReporting')) {
    const store = db.createObjectStore('programReporting', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('reportType', 'reportType', { unique: false });
    store.createIndex('reportingFormat', 'reportingFormat', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('dueDate', 'dueDate', { unique: false });
    store.createIndex('uploadedBy', 'uploadedBy', { unique: false });
    console.log('Created store: programReporting');
  }

  // Program Beneficiaries store
  if (!db.objectStoreNames.contains('programBeneficiaries')) {
    const store = db.createObjectStore('programBeneficiaries', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('beneficiaryType', 'beneficiaryType', { unique: false });
    store.createIndex('serviceType', 'serviceType', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('district', 'district', { unique: false });
    store.createIndex('nidNo', 'nidNo', { unique: false });
    console.log('Created store: programBeneficiaries');
  }

  // Program Safeguarding store
  if (!db.objectStoreNames.contains('programSafeguarding')) {
    const store = db.createObjectStore('programSafeguarding', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('activityType', 'activityType', { unique: false });
    store.createIndex('frequency', 'frequency', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('dueDate', 'dueDate', { unique: false });
    console.log('Created store: programSafeguarding');
  }
}
