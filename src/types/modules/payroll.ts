/**
 * Payroll Module Types
 *
 * Type definitions for payroll processing system.
 * Covers: Periods, Salary Structures, Allowances, Advances, Loans, Overtime, Payslips
 */

import type { BaseRecord } from '../db/base';

// ========== ENUMS AND CONSTANTS ==========

export const PAYROLL_STATUS = {
  DRAFT: 'draft',
  COLLECTING: 'collecting',
  PROCESSING: 'processing',
  HR_REVIEW: 'hr_review',
  FINANCE_REVIEW: 'finance_review',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  DISBURSING: 'disbursing',
  COMPLETED: 'completed',
  LOCKED: 'locked',
} as const;

export const COMPONENT_TYPE = {
  EARNING: 'earning',
  DEDUCTION: 'deduction',
} as const;

export const CALCULATION_TYPE = {
  FIXED: 'fixed',
  FORMULA: 'formula',
  MANUAL: 'manual',
  PERCENTAGE: 'percentage',
} as const;

export const APPLICABLE_TO = {
  ALL: 'all',
  SPECIFIC: 'specific',
  CONDITIONAL: 'conditional',
} as const;

export const ENTRY_STATUS = {
  PENDING: 'pending',
  CALCULATED: 'calculated',
  VERIFIED: 'verified',
  APPROVED: 'approved',
  PAID: 'paid',
} as const;

export const ADVANCE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DISBURSED: 'disbursed',
  REPAYING: 'repaying',
  COMPLETED: 'completed',
} as const;

export const LOAN_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  ACTIVE: 'active',
  REPAYING: 'repaying',
  COMPLETED: 'completed',
  DEFAULTED: 'defaulted',
} as const;

export const LOAN_TYPE = {
  PERSONAL: 'personal',
  EMERGENCY: 'emergency',
  HOUSING: 'housing',
  EDUCATION: 'education',
  OTHER: 'other',
} as const;

export const OVERTIME_TYPE = {
  REGULAR: 'regular',
  WEEKEND: 'weekend',
  HOLIDAY: 'holiday',
  NIGHT_SHIFT: 'night_shift',
} as const;

export const OVERTIME_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PROCESSED: 'processed',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  PROCESSED: 'processed',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const TRANSFER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

// Type exports
export type PayrollStatus = typeof PAYROLL_STATUS[keyof typeof PAYROLL_STATUS];
export type ComponentType = typeof COMPONENT_TYPE[keyof typeof COMPONENT_TYPE];
export type CalculationType = typeof CALCULATION_TYPE[keyof typeof CALCULATION_TYPE];
export type ApplicableTo = typeof APPLICABLE_TO[keyof typeof APPLICABLE_TO];
export type EntryStatus = typeof ENTRY_STATUS[keyof typeof ENTRY_STATUS];
export type AdvanceStatus = typeof ADVANCE_STATUS[keyof typeof ADVANCE_STATUS];
export type LoanStatus = typeof LOAN_STATUS[keyof typeof LOAN_STATUS];
export type LoanType = typeof LOAN_TYPE[keyof typeof LOAN_TYPE];
export type OvertimeType = typeof OVERTIME_TYPE[keyof typeof OVERTIME_TYPE];
export type OvertimeStatus = typeof OVERTIME_STATUS[keyof typeof OVERTIME_STATUS];
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
export type TransferStatus = typeof TRANSFER_STATUS[keyof typeof TRANSFER_STATUS];

// ========== RECORD INTERFACES ==========

/**
 * Payroll Period
 */
export interface PayrollPeriodRecord extends BaseRecord {
  periodCode: string;
  periodName: string;
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  workingDays: number;
  status: PayrollStatus;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  totalEmployees: number;
  initiatedAt?: string;
  hrSubmittedAt?: string;
  financeVerifiedAt?: string;
  approvedAt?: string;
  disbursedAt?: string;
  lockedAt?: string;
  notes?: string;
}

/**
 * Salary Structure Component
 */
export interface SalaryStructureRecord extends BaseRecord {
  componentCode: string;
  componentName: string;
  componentType: ComponentType;
  calculationType: CalculationType;
  defaultAmount?: number;
  percentage?: number;
  isTaxable: boolean;
  isRecurring: boolean;
  applicableTo: ApplicableTo;
  displayOrder: number;
  isActive: boolean;
  description?: string;
}

/**
 * Employee Salary Details
 */
export interface EmployeeSalaryDetailRecord extends BaseRecord {
  employeeId: number;
  basicSalary: number;
  currency: string;
  effectiveFrom: string;
  effectiveTo?: string;
  isCurrent: boolean;
  salaryGrade?: string;
  salaryStep?: number;
  notes?: string;
}

/**
 * Employee Allowance
 */
export interface EmployeeAllowanceRecord extends BaseRecord {
  employeeId: number;
  salaryComponentId: number;
  componentName?: string;
  amount: number;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  notes?: string;
}

/**
 * Payroll Entry
 */
export interface PayrollEntryRecord extends BaseRecord {
  payrollPeriodId: number;
  employeeId: number;
  employeeName: string;
  employeeNumber?: string;
  department: string;
  position: string;

  // Basic salary
  basicSalary: number;
  currency: string;

  // Attendance
  workingDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;

  // Earnings
  proratedSalary: number;
  transportationAllowance?: number;
  overtimeHours: number;
  overtimeAmount: number;
  otherAllowances?: number;
  grossSalary: number;

  // Deductions
  taxAmount: number;
  advanceDeduction?: number;
  loanDeduction?: number;
  absenceDeduction?: number;
  otherDeductions?: number;
  totalDeductions: number;

  // Net
  netSalary: number;

  // Payment
  paymentMode?: string;
  bankName?: string;
  accountNumber?: string;
  paymentReference?: string;
  paidAt?: string;

  status: EntryStatus;
  notes?: string;
}

/**
 * Salary Advance
 */
export interface SalaryAdvanceRecord extends BaseRecord {
  advanceNumber: string;
  employeeId: number;
  employeeName: string;
  requestDate: string;
  amountRequested: number;
  amountApproved?: number;
  currency: string;
  reason: string;
  repaymentMonths: number;
  monthlyDeduction?: number;
  balanceRemaining?: number;
  status: AdvanceStatus;
  approvedAt?: string;
  approvedBy?: string;
  disbursedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

/**
 * Advance Repayment
 */
export interface AdvanceRepaymentRecord extends BaseRecord {
  advanceId: number;
  payrollEntryId: number;
  payrollPeriodId?: number;
  repaymentAmount: number;
  balanceAfter: number;
  repaymentDate: string;
}

/**
 * Employee Loan
 */
export interface EmployeeLoanRecord extends BaseRecord {
  loanNumber: string;
  employeeId: number;
  employeeName: string;
  loanType: LoanType;
  requestDate: string;
  totalAmount: number;
  approvedAmount?: number;
  currency: string;
  interestRate?: number;
  repaymentMonths: number;
  monthlyInstallment?: number;
  balanceRemaining?: number;
  startDate?: string;
  endDate?: string;
  purpose: string;
  status: LoanStatus;
  approvedAt?: string;
  approvedBy?: string;
  notes?: string;
}

/**
 * Loan Repayment
 */
export interface LoanRepaymentRecord extends BaseRecord {
  loanId: number;
  payrollEntryId: number;
  payrollPeriodId?: number;
  principalAmount: number;
  interestAmount?: number;
  totalAmount: number;
  balanceAfter: number;
  repaymentDate: string;
}

/**
 * Overtime Record
 */
export interface OvertimeRecord extends BaseRecord {
  employeeId: number;
  employeeName: string;
  date: string;
  overtimeType: OvertimeType;
  hoursWorked: number;
  rate?: number;
  totalAmount?: number;
  approvedHours?: number;
  approvedAmount?: number;
  reason?: string;
  status: OvertimeStatus;
  approvedAt?: string;
  approvedBy?: string;
  notes?: string;
}

/**
 * Payslip
 */
export interface PayslipRecord extends BaseRecord {
  payslipNumber: string;
  payrollEntryId: number;
  employeeId: number;
  employeeName: string;
  employeeNumber?: string;
  department: string;
  position: string;
  periodMonth: number;
  periodYear: number;
  periodName: string;

  // Salary details (copied from payroll entry for historical record)
  basicSalary: number;
  proratedSalary: number;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;

  // Payment details
  paymentDate?: string;
  paymentMode?: string;
  paymentReference?: string;

  // Document
  generatedAt: string;
  generatedBy: string;
  documentUrl?: string;
}

/**
 * Bank Transfer Batch
 */
export interface BankTransferRecord extends BaseRecord {
  batchNumber: string;
  payrollPeriodId: number;
  periodName?: string;
  totalAmount: number;
  totalEmployees: number;
  currency: string;
  bankName?: string;
  transferDate?: string;
  status: TransferStatus;
  bankReference?: string;
  processedAt?: string;
  notes?: string;
}

/**
 * Cash Payment
 */
export interface CashPaymentRecord extends BaseRecord {
  payrollEntryId: number;
  voucherNumber: string;
  employeeId: number;
  employeeName: string;
  amount: number;
  currency: string;
  paymentDate?: string;
  receivedBy?: string;
  witnessName?: string;
  status: PaymentStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}
