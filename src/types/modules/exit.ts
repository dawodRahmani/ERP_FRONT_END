/**
 * Exit/Separation Module Types
 *
 * Type definitions for employee separation system.
 * Covers: Separation Records, Clearances, Exit Interviews, Settlements, Certificates, Terminations, Handovers
 */

import type { BaseRecord } from '../db/base';

// ========== ENUMS AND CONSTANTS ==========

export const SEPARATION_STATUS = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CLEARANCE_PENDING: 'clearance_pending',
  CLEARANCE_COMPLETED: 'clearance_completed',
  SETTLEMENT_PENDING: 'settlement_pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const SEPARATION_TYPE = {
  RESIGNATION: 'resignation',
  TERMINATION: 'termination',
  RETIREMENT: 'retirement',
  END_OF_CONTRACT: 'end_of_contract',
  DEATH: 'death',
  MUTUAL_AGREEMENT: 'mutual_agreement',
  ABANDONMENT: 'abandonment',
} as const;

export const CLEARANCE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  WAIVED: 'waived',
} as const;

export const CLEARANCE_ITEM_STATUS = {
  PENDING: 'pending',
  RETURNED: 'returned',
  DAMAGED: 'damaged',
  LOST: 'lost',
  WAIVED: 'waived',
} as const;

export const INTERVIEW_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
} as const;

export const COMPLIANCE_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  ISSUES_FOUND: 'issues_found',
  RESOLVED: 'resolved',
} as const;

export const SETTLEMENT_STATUS = {
  DRAFT: 'draft',
  PENDING_HR: 'pending_hr',
  PENDING_FINANCE: 'pending_finance',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAID: 'paid',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PAID: 'paid',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_METHOD = {
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash',
  CHEQUE: 'cheque',
} as const;

export const CERTIFICATE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  ISSUED: 'issued',
  REVOKED: 'revoked',
} as const;

export const TERMINATION_TYPE = {
  MISCONDUCT: 'misconduct',
  POOR_PERFORMANCE: 'poor_performance',
  REDUNDANCY: 'redundancy',
  CONTRACT_BREACH: 'contract_breach',
  POLICY_VIOLATION: 'policy_violation',
  OTHER: 'other',
} as const;

export const HANDOVER_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  VERIFIED: 'verified',
} as const;

export const HANDOVER_ITEM_STATUS = {
  PENDING: 'pending',
  HANDED_OVER: 'handed_over',
  VERIFIED: 'verified',
  ISSUES: 'issues',
} as const;

// Type exports
export type SeparationStatus = typeof SEPARATION_STATUS[keyof typeof SEPARATION_STATUS];
export type SeparationType = typeof SEPARATION_TYPE[keyof typeof SEPARATION_TYPE];
export type ClearanceStatus = typeof CLEARANCE_STATUS[keyof typeof CLEARANCE_STATUS];
export type ClearanceItemStatus = typeof CLEARANCE_ITEM_STATUS[keyof typeof CLEARANCE_ITEM_STATUS];
export type InterviewStatus = typeof INTERVIEW_STATUS[keyof typeof INTERVIEW_STATUS];
export type ComplianceStatus = typeof COMPLIANCE_STATUS[keyof typeof COMPLIANCE_STATUS];
export type SettlementStatus = typeof SETTLEMENT_STATUS[keyof typeof SETTLEMENT_STATUS];
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
export type PaymentMethod = typeof PAYMENT_METHOD[keyof typeof PAYMENT_METHOD];
export type CertificateStatus = typeof CERTIFICATE_STATUS[keyof typeof CERTIFICATE_STATUS];
export type TerminationType = typeof TERMINATION_TYPE[keyof typeof TERMINATION_TYPE];
export type HandoverStatus = typeof HANDOVER_STATUS[keyof typeof HANDOVER_STATUS];
export type HandoverItemStatus = typeof HANDOVER_ITEM_STATUS[keyof typeof HANDOVER_ITEM_STATUS];

// ========== RECORD INTERFACES ==========

/**
 * Separation Record (Main table)
 */
export interface SeparationRecord extends BaseRecord {
  separationNumber: string;
  employeeId: number;
  employeeName?: string;
  department?: string;
  position?: string;
  separationType: SeparationType;
  separationDate: string;
  lastWorkingDay: string;
  noticeDate?: string;
  noticePeriodDays?: number;
  reason?: string;
  comments?: string;
  status: SeparationStatus;

  // Approval tracking
  requestedBy?: string;
  requestedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;

  // Flags
  isEligibleForRehire: boolean;
  requiresClearance: boolean;
  requiresExitInterview: boolean;

  // Completion tracking
  clearanceCompletedAt?: string;
  settlementCompletedAt?: string;
  completedAt?: string;
}

/**
 * Separation Type (Configuration)
 */
export interface SeparationTypeRecord extends BaseRecord {
  code: string;
  name: string;
  description?: string;
  requiresNotice: boolean;
  defaultNoticePeriodDays?: number;
  requiresClearance: boolean;
  requiresExitInterview: boolean;
  requiresSettlement: boolean;
  isActive: boolean;
  displayOrder: number;
}

/**
 * Exit Clearance (Department clearances)
 */
export interface ExitClearanceRecord extends BaseRecord {
  separationId: number;
  departmentId: number;
  departmentName: string;
  responsiblePersonId?: number;
  responsiblePersonName?: string;
  status: ClearanceStatus;
  requestedAt: string;
  completedAt?: string;
  comments?: string;
  rejectionReason?: string;
  waiveReason?: string;
  waivedBy?: string;
  waivedAt?: string;
}

/**
 * Clearance Item (Items to be returned)
 */
export interface ClearanceItemRecord extends BaseRecord {
  clearanceId: number;
  separationId: number;
  itemType: string;
  itemName: string;
  itemCode?: string;
  description?: string;
  serialNumber?: string;
  status: ClearanceItemStatus;
  returnedAt?: string;
  condition?: string;
  damageDescription?: string;
  replacementCost?: number;
  currency?: string;
  notes?: string;
}

/**
 * Exit Clearance Department (Configuration)
 */
export interface ExitClearanceDepartmentRecord extends BaseRecord {
  departmentName: string;
  description?: string;
  isRequired: boolean;
  displayOrder: number;
  isActive: boolean;
}

/**
 * Exit Interview
 */
export interface ExitInterviewRecord extends BaseRecord {
  separationId: number;
  employeeId: number;
  interviewDate: string;
  interviewerName?: string;
  status: InterviewStatus;

  // Ratings (1-5 scale)
  jobSatisfactionRating?: number;
  workEnvironmentRating?: number;
  managementRating?: number;
  compensationRating?: number;
  careerGrowthRating?: number;
  workLifeBalanceRating?: number;
  overallRating?: number;

  // Questions
  reasonForLeaving?: string;
  wouldRecommendOrganization?: boolean;
  wouldConsiderReturning?: boolean;
  positiveAspects?: string;
  areasForImprovement?: string;
  managementFeedback?: string;
  finalComments?: string;

  // Tracking
  interviewerComments?: string;
  scheduledAt?: string;
  completedAt?: string;
}

/**
 * Exit Compliance Check
 */
export interface ExitComplianceCheckRecord extends BaseRecord {
  separationId: number;
  employeeId: number;
  checkDate: string;
  checkedBy?: string;
  status: ComplianceStatus;

  // Check items
  outstandingLoans: boolean;
  outstandingLoansAmount?: number;
  pendingLeaveRequests: boolean;
  pendingExpenses: boolean;
  pendingExpensesAmount?: number;
  trainingBond: boolean;
  trainingBondAmount?: number;
  disciplinaryIssues: boolean;
  activeProjects: boolean;
  dataAccess: boolean;

  // Details
  issuesFound?: string;
  resolutionPlan?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  notes?: string;
}

/**
 * Final Settlement
 */
export interface FinalSettlementRecord extends BaseRecord {
  settlementNumber: string;
  separationId: number;
  employeeId: number;
  employeeName?: string;

  // Earnings
  finalSalary: number;
  leaveEncashment: number;
  gratuity: number;
  bonus: number;
  otherEarnings: number;
  totalEarnings: number;

  // Deductions
  loansRecovery: number;
  advancesRecovery: number;
  trainingBondRecovery: number;
  assetCharges: number;
  otherDeductions: number;
  totalDeductions: number;

  // Net settlement
  netAmount: number;
  currency: string;

  // Calculation details
  calculatedBy?: string;
  calculatedAt?: string;
  calculationNotes?: string;

  // Verification stages
  status: SettlementStatus;
  verifiedByHR?: string;
  verifiedByHRAt?: string;
  hrComments?: string;
  verifiedByFinance?: string;
  verifiedByFinanceAt?: string;
  financeComments?: string;
  approvedBy?: string;
  approvedAt?: string;
  approvalComments?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

/**
 * Settlement Payment
 */
export interface SettlementPaymentRecord extends BaseRecord {
  settlementId: number;
  separationId: number;
  employeeId: number;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentDate?: string;
  status: PaymentStatus;

  // Payment details
  bankName?: string;
  accountNumber?: string;
  transactionReference?: string;
  chequeNumber?: string;

  // Tracking
  processedBy?: string;
  processedAt?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  failureReason?: string;
}

/**
 * Work Certificate
 */
export interface WorkCertificateRecord extends BaseRecord {
  certificateNumber: string;
  separationId: number;
  employeeId: number;
  employeeName: string;
  position: string;
  department: string;
  joinDate: string;
  separationDate: string;
  certificateText?: string;
  issueDate: string;
  status: CertificateStatus;
  issuedBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  documentUrl?: string;
  notes?: string;
  revokedBy?: string;
  revokedAt?: string;
  revocationReason?: string;
}

/**
 * Termination Record
 */
export interface TerminationRecord extends BaseRecord {
  separationId: number;
  employeeId: number;
  terminationType: TerminationType;
  terminationDate: string;
  effectiveDate: string;
  reason: string;
  details?: string;

  // Supporting evidence
  documentationProvided: boolean;
  documentUrls?: string;
  witnessNames?: string;

  // Legal
  noticePeriodWaived: boolean;
  waiveReason?: string;
  severancePaid: boolean;
  severanceAmount?: number;
  currency?: string;

  // Appeal
  appealable: boolean;
  appealDeadline?: string;
  appealFiled: boolean;
  appealDate?: string;
  appealOutcome?: string;

  // Tracking
  initiatedBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

/**
 * Handover
 */
export interface HandoverRecord extends BaseRecord {
  separationId: number;
  employeeId: number;
  employeeName?: string;
  position?: string;
  handoverToId?: number;
  handoverToName?: string;
  startDate: string;
  targetCompletionDate: string;
  actualCompletionDate?: string;
  status: HandoverStatus;
  notes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  verificationComments?: string;
}

/**
 * Handover Item
 */
export interface HandoverItemRecord extends BaseRecord {
  handoverId: number;
  separationId: number;
  itemType: string;
  itemName: string;
  description?: string;
  location?: string;
  accessCredentials?: string;
  documentation?: string;
  status: HandoverItemStatus;
  handedOverAt?: string;
  verifiedAt?: string;
  issues?: string;
  notes?: string;
}

/**
 * Separation History (Audit trail)
 */
export interface SeparationHistoryRecord extends BaseRecord {
  separationId: number;
  changedBy: string;
  changeDate: string;
  fieldChanged: string;
  oldValue?: string;
  newValue?: string;
  action: string;
  comments?: string;
}
