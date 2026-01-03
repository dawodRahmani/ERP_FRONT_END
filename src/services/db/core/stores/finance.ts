/**
 * Finance & Compliance Object Stores
 *
 * Creates stores for: Donors, Projects, Compliance Projects, Compliance Documents
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '../../../../types/db/stores';

/**
 * Create all finance and compliance object stores
 */
export function createFinanceStores(db: IDBPDatabase<VDODatabase>): void {
  // Donors store
  if (!db.objectStoreNames.contains('donors')) {
    const donorStore = db.createObjectStore('donors', {
      keyPath: 'id',
      autoIncrement: true,
    });
    donorStore.createIndex('name', 'name', { unique: false });
    donorStore.createIndex('code', 'code', { unique: true });
    donorStore.createIndex('type', 'type', { unique: false });
    donorStore.createIndex('status', 'status', { unique: false });
  }

  // Projects store
  if (!db.objectStoreNames.contains('projects')) {
    const projectStore = db.createObjectStore('projects', {
      keyPath: 'id',
      autoIncrement: true,
    });
    projectStore.createIndex('projectCode', 'projectCode', { unique: true });
    projectStore.createIndex('name', 'name', { unique: false });
    projectStore.createIndex('donorId', 'donorId', { unique: false });
    projectStore.createIndex('department', 'department', { unique: false });
    projectStore.createIndex('status', 'status', { unique: false });
    projectStore.createIndex('startDate', 'startDate', { unique: false });
    projectStore.createIndex('endDate', 'endDate', { unique: false });
  }

  // Compliance Projects store
  if (!db.objectStoreNames.contains('complianceProjects')) {
    const compProjectStore = db.createObjectStore('complianceProjects', {
      keyPath: 'id',
      autoIncrement: true,
    });
    compProjectStore.createIndex('projectId', 'projectId', { unique: false });
    compProjectStore.createIndex('complianceType', 'complianceType', {
      unique: false,
    });
    compProjectStore.createIndex('status', 'status', { unique: false });
    compProjectStore.createIndex('riskLevel', 'riskLevel', { unique: false });
    compProjectStore.createIndex('dueDate', 'dueDate', { unique: false });
  }

  // Compliance Documents store
  if (!db.objectStoreNames.contains('complianceDocuments')) {
    const compDocStore = db.createObjectStore('complianceDocuments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    compDocStore.createIndex('projectId', 'projectId', { unique: false });
    compDocStore.createIndex('complianceProjectId', 'complianceProjectId', {
      unique: false,
    });
    compDocStore.createIndex('documentType', 'documentType', { unique: false });
    compDocStore.createIndex('status', 'status', { unique: false });
    compDocStore.createIndex('expiryDate', 'expiryDate', { unique: false });
  }

  // Compliance Amendments store
  if (!db.objectStoreNames.contains('complianceAmendments')) {
    const compAmendStore = db.createObjectStore('complianceAmendments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    compAmendStore.createIndex('projectId', 'projectId', { unique: false });
    compAmendStore.createIndex('complianceProjectId', 'complianceProjectId', {
      unique: false,
    });
    compAmendStore.createIndex('amendmentType', 'amendmentType', { unique: false });
    compAmendStore.createIndex('status', 'status', { unique: false });
  }

  // Proposals (RFP Tracking) store
  if (!db.objectStoreNames.contains('proposals')) {
    const proposalStore = db.createObjectStore('proposals', {
      keyPath: 'id',
      autoIncrement: true,
    });
    proposalStore.createIndex('donor', 'donor', { unique: false });
    proposalStore.createIndex('status', 'status', { unique: false });
    proposalStore.createIndex('result', 'result', { unique: false });
    proposalStore.createIndex('createdAt', 'createdAt', { unique: false });
  }

  // Banks store
  if (!db.objectStoreNames.contains('banks')) {
    const store = db.createObjectStore('banks', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('bankName', 'bankName', { unique: false });
    store.createIndex('bankCode', 'bankCode', { unique: true });
    store.createIndex('isActive', 'isActive', { unique: false });
    console.log('Created store: banks');
  }

  // Bank Accounts store
  if (!db.objectStoreNames.contains('bankAccounts')) {
    const store = db.createObjectStore('bankAccounts', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('bankId', 'bankId', { unique: false });
    store.createIndex('accountNumber', 'accountNumber', { unique: false });
    store.createIndex('currency', 'currency', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    console.log('Created store: bankAccounts');
  }

  // Bank Signatories store
  if (!db.objectStoreNames.contains('bankSignatories')) {
    const store = db.createObjectStore('bankSignatories', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('bankAccountId', 'bankAccountId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('signatoryType', 'signatoryType', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    console.log('Created store: bankSignatories');
  }

  // Budget Categories store
  if (!db.objectStoreNames.contains('budgetCategories')) {
    const store = db.createObjectStore('budgetCategories', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('categoryName', 'categoryName', { unique: false });
    store.createIndex('categoryCode', 'categoryCode', { unique: true });
    store.createIndex('parentId', 'parentId', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    console.log('Created store: budgetCategories');
  }

  // Project Budgets store
  if (!db.objectStoreNames.contains('projectBudgets')) {
    const store = db.createObjectStore('projectBudgets', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('budgetCategoryId', 'budgetCategoryId', { unique: false });
    store.createIndex('fiscalYear', 'fiscalYear', { unique: false });
    console.log('Created store: projectBudgets');
  }

  // Budget Expenditures store
  if (!db.objectStoreNames.contains('budgetExpenditures')) {
    const store = db.createObjectStore('budgetExpenditures', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('projectBudgetId', 'projectBudgetId', { unique: false });
    store.createIndex('expenditureDate', 'expenditureDate', { unique: false });
    store.createIndex('createdBy', 'createdBy', { unique: false });
    console.log('Created store: budgetExpenditures');
  }

  // Project Staff Costs store
  if (!db.objectStoreNames.contains('projectStaffCosts')) {
    const store = db.createObjectStore('projectStaffCosts', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('amendmentNumber', 'amendmentNumber', { unique: false });
    store.createIndex('gradeLevel', 'gradeLevel', { unique: false });
    console.log('Created store: projectStaffCosts');
  }

  // Project Operational Costs store
  if (!db.objectStoreNames.contains('projectOperationalCosts')) {
    const store = db.createObjectStore('projectOperationalCosts', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('costCategory', 'costCategory', { unique: false });
    store.createIndex('amendmentNumber', 'amendmentNumber', { unique: false });
    console.log('Created store: projectOperationalCosts');
  }

  // Cash Requests store
  if (!db.objectStoreNames.contains('cashRequests')) {
    const store = db.createObjectStore('cashRequests', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('requestNumber', 'requestNumber', { unique: true });
    store.createIndex('requestMonth', 'requestMonth', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('preparedBy', 'preparedBy', { unique: false });
    store.createIndex('approvedBy', 'approvedBy', { unique: false });
    console.log('Created store: cashRequests');
  }

  // Cash Request Items store
  if (!db.objectStoreNames.contains('cashRequestItems')) {
    const store = db.createObjectStore('cashRequestItems', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('cashRequestId', 'cashRequestId', { unique: false });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('costType', 'costType', { unique: false });
    console.log('Created store: cashRequestItems');
  }

  // Installment Requests store
  if (!db.objectStoreNames.contains('installmentRequests')) {
    const store = db.createObjectStore('installmentRequests', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('dateRequested', 'dateRequested', { unique: false });
    store.createIndex('amendmentNumber', 'amendmentNumber', { unique: false });
    console.log('Created store: installmentRequests');
  }

  // Installment Receipts store
  if (!db.objectStoreNames.contains('installmentReceipts')) {
    const store = db.createObjectStore('installmentReceipts', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('installmentRequestId', 'installmentRequestId', {
      unique: false,
    });
    store.createIndex('receiptDate', 'receiptDate', { unique: false });
    store.createIndex('bankAccountId', 'bankAccountId', { unique: false });
    console.log('Created store: installmentReceipts');
  }

  // Staff Salary Allocations store
  if (!db.objectStoreNames.contains('staffSalaryAllocations')) {
    const store = db.createObjectStore('staffSalaryAllocations', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('allocationMonth', 'allocationMonth', { unique: false });
    console.log('Created store: staffSalaryAllocations');
  }

  // Payroll Distributions store
  if (!db.objectStoreNames.contains('payrollDistributions')) {
    const store = db.createObjectStore('payrollDistributions', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('payrollPeriodId', 'payrollPeriodId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('generationType', 'generationType', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
    console.log('Created store: payrollDistributions');
  }

  // Donor Reporting Schedules store
  if (!db.objectStoreNames.contains('donorReportingSchedules')) {
    const store = db.createObjectStore('donorReportingSchedules', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('dueDate', 'dueDate', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: donorReportingSchedules');
  }

  // Donor Report Periods store
  if (!db.objectStoreNames.contains('donorReportPeriods')) {
    const store = db.createObjectStore('donorReportPeriods', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('reportingScheduleId', 'reportingScheduleId', {
      unique: false,
    });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('submittedBy', 'submittedBy', { unique: false });
    console.log('Created store: donorReportPeriods');
  }

  // Government Reporting store
  if (!db.objectStoreNames.contains('governmentReporting')) {
    const store = db.createObjectStore('governmentReporting', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('ministryName', 'ministryName', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('dueDate', 'dueDate', { unique: false });
    console.log('Created store: governmentReporting');
  }

  // Project Amendments store
  if (!db.objectStoreNames.contains('projectAmendments')) {
    const store = db.createObjectStore('projectAmendments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('amendmentNumber', 'amendmentNumber', { unique: false });
    store.createIndex('amendmentDate', 'amendmentDate', { unique: false });
    console.log('Created store: projectAmendments');
  }

  // Signatory Assignments store
  if (!db.objectStoreNames.contains('signatoryAssignments')) {
    const store = db.createObjectStore('signatoryAssignments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('assignmentMonth', 'assignmentMonth', { unique: false });
    console.log('Created store: signatoryAssignments');
  }

  // Due Diligence store
  if (!db.objectStoreNames.contains('dueDiligence')) {
    const store = db.createObjectStore('dueDiligence', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('donorName', 'donorName', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
    console.log('Created store: dueDiligence');
  }

  // Registrations store
  if (!db.objectStoreNames.contains('registrations')) {
    const store = db.createObjectStore('registrations', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('organizationPlatform', 'organizationPlatform', {
      unique: false,
    });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('expiryDate', 'expiryDate', { unique: false });
    console.log('Created store: registrations');
  }

  // Memberships store
  if (!db.objectStoreNames.contains('memberships')) {
    const store = db.createObjectStore('memberships', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('organizationName', 'organizationName', { unique: false });
    store.createIndex('membershipType', 'membershipType', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('expiryDate', 'expiryDate', { unique: false });
    console.log('Created store: memberships');
  }

  // Certificates store
  if (!db.objectStoreNames.contains('certificates')) {
    const store = db.createObjectStore('certificates', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('certificateName', 'certificateName', { unique: false });
    store.createIndex('certificateNumber', 'certificateNumber', {
      unique: false,
    });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('expiryDate', 'expiryDate', { unique: false });
    console.log('Created store: certificates');
  }

  // Board of Directors store
  if (!db.objectStoreNames.contains('boardOfDirectors')) {
    const store = db.createObjectStore('boardOfDirectors', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('name', 'name', { unique: false });
    store.createIndex('position', 'position', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: boardOfDirectors');
  }

  // Partners store
  if (!db.objectStoreNames.contains('partners')) {
    const store = db.createObjectStore('partners', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('partnerName', 'partnerName', { unique: false });
    store.createIndex('partnerType', 'partnerType', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: partners');
  }

  // Donor Outreach store
  if (!db.objectStoreNames.contains('donorOutreach')) {
    const store = db.createObjectStore('donorOutreach', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('donorName', 'donorName', { unique: false });
    store.createIndex('outreachDate', 'outreachDate', { unique: false });
    console.log('Created store: donorOutreach');
  }

  // Government Outreach store
  if (!db.objectStoreNames.contains('governmentOutreach')) {
    const store = db.createObjectStore('governmentOutreach', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('ministryName', 'ministryName', { unique: false });
    store.createIndex('outreachDate', 'outreachDate', { unique: false });
    console.log('Created store: governmentOutreach');
  }

  // Blacklist store
  if (!db.objectStoreNames.contains('blacklist')) {
    const store = db.createObjectStore('blacklist', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('entityName', 'entityName', { unique: false });
    store.createIndex('entityType', 'entityType', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('blacklistDate', 'blacklistDate', { unique: false });
    console.log('Created store: blacklist');
  }
}
