/**
 * Finance Module Types
 *
 * Type definitions for finance entities:
 * - Donors
 * - Projects
 */

import type { BaseRecord } from '../db/base';

// ========== DONORS ==========

export interface DonorRecord extends BaseRecord {
  name: string;
  code: string;
  type: string;
  country?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  status: string;
  notes?: string;
  [key: string]: unknown;
}

export const DONOR_TYPE = {
  BILATERAL: 'bilateral',
  MULTILATERAL: 'multilateral',
  FOUNDATION: 'foundation',
  CORPORATE: 'corporate',
  GOVERNMENT: 'government',
  NGO: 'ngo',
  OTHER: 'other',
} as const;

export type DonorType = (typeof DONOR_TYPE)[keyof typeof DONOR_TYPE];

export const DONOR_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PROSPECTIVE: 'prospective',
} as const;

export type DonorStatus = (typeof DONOR_STATUS)[keyof typeof DONOR_STATUS];

// ========== PROJECTS ==========

export interface ProjectRecord extends BaseRecord {
  projectCode: string;
  name: string;
  donorId: number;
  department?: string;
  description?: string;
  startDate: string;
  endDate: string;
  budget?: number;
  currency?: string;
  projectManager?: string;
  status: string;
  notes?: string;
  [key: string]: unknown;
}

export const PROJECT_STATUS = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export const CURRENCY = {
  USD: 'USD',
  EUR: 'EUR',
  AFN: 'AFN',
  GBP: 'GBP',
} as const;

export type Currency = (typeof CURRENCY)[keyof typeof CURRENCY];

// ========== BANKS ==========

export interface BankRecord extends BaseRecord {
  bankName: string;
  bankCode: string;
  swiftCode?: string;
  country?: string;
  address?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  notes?: string;
  [key: string]: unknown;
}

// ========== BANK ACCOUNTS ==========

export interface BankAccountRecord extends BaseRecord {
  bankId: number;
  accountNumber: string;
  accountName: string;
  accountType?: string;
  currency: string;
  openingBalance?: number;
  currentBalance?: number;
  openingDate?: string;
  closingDate?: string;
  isActive: boolean;
  notes?: string;
  [key: string]: unknown;
}

// ========== BANK SIGNATORIES ==========

export interface BankSignatoryRecord extends BaseRecord {
  bankAccountId: number;
  employeeId: number;
  signatoryType: string;
  signatureSpecimen?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  notes?: string;
  [key: string]: unknown;
}

export const SIGNATORY_TYPE = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  JOINT: 'joint',
} as const;

export type SignatoryType =
  (typeof SIGNATORY_TYPE)[keyof typeof SIGNATORY_TYPE];

// ========== BUDGET CATEGORIES ==========

export interface BudgetCategoryRecord extends BaseRecord {
  categoryName: string;
  categoryCode: string;
  description?: string;
  parentId?: number;
  level?: number;
  isActive: boolean;
  [key: string]: unknown;
}

// ========== PROJECT BUDGETS ==========

export interface ProjectBudgetRecord extends BaseRecord {
  projectId: number;
  budgetCategoryId: number;
  fiscalYear: string;
  originalAmount: number;
  revisedAmount?: number;
  committedAmount?: number;
  expendedAmount?: number;
  availableAmount?: number;
  currency: string;
  notes?: string;
  [key: string]: unknown;
}

// ========== BUDGET EXPENDITURES ==========

export interface BudgetExpenditureRecord extends BaseRecord {
  projectBudgetId: number;
  expenditureDate: string;
  description: string;
  amount: number;
  voucherNumber?: string;
  referenceNumber?: string;
  createdBy: string;
  approvedBy?: string;
  status?: string;
  notes?: string;
  [key: string]: unknown;
}

// ========== PROJECT STAFF COSTS ==========

export interface ProjectStaffCostRecord extends BaseRecord {
  projectId: number;
  employeeId: number;
  amendmentNumber?: number;
  gradeLevel?: string;
  monthlySalary?: number;
  allocationPercentage?: number;
  effectiveFrom: string;
  effectiveTo?: string;
  currency?: string;
  notes?: string;
  [key: string]: unknown;
}

// ========== PROJECT OPERATIONAL COSTS ==========

export interface ProjectOperationalCostRecord extends BaseRecord {
  projectId: number;
  costCategory: string;
  description?: string;
  amendmentNumber?: number;
  budgetedAmount?: number;
  actualAmount?: number;
  currency?: string;
  period?: string;
  notes?: string;
  [key: string]: unknown;
}

// ========== CASH REQUESTS ==========

export interface CashRequestRecord extends BaseRecord {
  requestNumber: string;
  requestMonth: string;
  requestYear?: number;
  totalAmount?: number;
  currency?: string;
  purpose?: string;
  status: string;
  preparedBy: string;
  preparedDate?: string;
  reviewedBy?: string;
  reviewDate?: string;
  approvedBy?: string;
  approvalDate?: string;
  notes?: string;
  [key: string]: unknown;
}

export const CASH_REQUEST_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  REVIEWED: 'reviewed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DISBURSED: 'disbursed',
} as const;

export type CashRequestStatus =
  (typeof CASH_REQUEST_STATUS)[keyof typeof CASH_REQUEST_STATUS];

// ========== CASH REQUEST ITEMS ==========

export interface CashRequestItemRecord extends BaseRecord {
  cashRequestId: number;
  projectId: number;
  budgetCategoryId?: number;
  costType: string;
  description?: string;
  requestedAmount: number;
  approvedAmount?: number;
  currency?: string;
  notes?: string;
  [key: string]: unknown;
}

// ========== INSTALLMENT REQUESTS ==========

export interface InstallmentRequestRecord extends BaseRecord {
  projectId: number;
  requestNumber?: string;
  amendmentNumber?: number;
  installmentNumber?: number;
  requestedAmount: number;
  currency?: string;
  dateRequested: string;
  expectedDate?: string;
  purpose?: string;
  status: string;
  requestedBy?: string;
  approvedBy?: string;
  approvalDate?: string;
  notes?: string;
  [key: string]: unknown;
}

export const INSTALLMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RECEIVED: 'received',
  CANCELLED: 'cancelled',
} as const;

export type InstallmentStatus =
  (typeof INSTALLMENT_STATUS)[keyof typeof INSTALLMENT_STATUS];

// ========== INSTALLMENT RECEIPTS ==========

export interface InstallmentReceiptRecord extends BaseRecord {
  installmentRequestId: number;
  receiptNumber?: string;
  receiptDate: string;
  receivedAmount: number;
  bankAccountId: number;
  exchangeRate?: number;
  localAmount?: number;
  currency?: string;
  receivedBy?: string;
  notes?: string;
  [key: string]: unknown;
}

// ========== STAFF SALARY ALLOCATIONS ==========

export interface StaffSalaryAllocationRecord extends BaseRecord {
  employeeId: number;
  projectId: number;
  allocationMonth: string;
  allocationYear?: number;
  allocationPercentage: number;
  amount?: number;
  currency?: string;
  status?: string;
  notes?: string;
  [key: string]: unknown;
}

// ========== PAYROLL DISTRIBUTIONS ==========

export interface PayrollDistributionRecord extends BaseRecord {
  payrollPeriodId: number;
  employeeId: number;
  projectId?: number;
  generationType: string;
  grossAmount?: number;
  deductions?: number;
  netAmount?: number;
  currency?: string;
  status: string;
  processedBy?: string;
  processedDate?: string;
  notes?: string;
  [key: string]: unknown;
}

export const DISTRIBUTION_TYPE = {
  SALARY: 'salary',
  BONUS: 'bonus',
  ALLOWANCE: 'allowance',
  DEDUCTION: 'deduction',
} as const;

export type DistributionType =
  (typeof DISTRIBUTION_TYPE)[keyof typeof DISTRIBUTION_TYPE];

// ========== DONOR REPORTING SCHEDULES ==========

export interface DonorReportingScheduleRecord extends BaseRecord {
  projectId: number;
  reportType: string;
  frequency: string;
  dueDate: string;
  reminderDays?: number;
  responsiblePerson?: string;
  status: string;
  notes?: string;
  [key: string]: unknown;
}

export const REPORT_FREQUENCY = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  SEMI_ANNUAL: 'semi_annual',
  ANNUAL: 'annual',
  AD_HOC: 'ad_hoc',
} as const;

export type ReportFrequency =
  (typeof REPORT_FREQUENCY)[keyof typeof REPORT_FREQUENCY];

// ========== DONOR REPORT PERIODS ==========

export interface DonorReportPeriodRecord extends BaseRecord {
  reportingScheduleId: number;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  submittedDate?: string;
  submittedBy?: string;
  reportUrl?: string;
  status: string;
  feedback?: string;
  notes?: string;
  [key: string]: unknown;
}

export const REPORT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  ACCEPTED: 'accepted',
  REVISION_REQUIRED: 'revision_required',
  OVERDUE: 'overdue',
} as const;

export type ReportStatus = (typeof REPORT_STATUS)[keyof typeof REPORT_STATUS];

// ========== GOVERNMENT REPORTING ==========

export interface GovernmentReportingRecord extends BaseRecord {
  projectId: number;
  ministryName: string;
  reportType?: string;
  reportPeriod?: string;
  dueDate: string;
  submittedDate?: string;
  submittedBy?: string;
  reportUrl?: string;
  status: string;
  feedback?: string;
  notes?: string;
  [key: string]: unknown;
}

// ========== PROJECT AMENDMENTS ==========

export interface ProjectAmendmentRecord extends BaseRecord {
  projectId: number;
  amendmentNumber: number;
  amendmentType?: string;
  amendmentDate: string;
  description?: string;
  previousValue?: string;
  newValue?: string;
  budgetChange?: number;
  timelineChange?: number;
  requestedBy?: string;
  approvedBy?: string;
  approvalDate?: string;
  status?: string;
  notes?: string;
  [key: string]: unknown;
}

// ========== SIGNATORY ASSIGNMENTS ==========

export interface SignatoryAssignmentRecord extends BaseRecord {
  projectId: number;
  assignmentMonth: string;
  primarySignatoryId?: number;
  secondarySignatoryId?: number;
  effectiveFrom?: string;
  effectiveTo?: string;
  notes?: string;
  [key: string]: unknown;
}
