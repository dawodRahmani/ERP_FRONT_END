/**
 * Contract Management Module Types
 *
 * Type definitions for contract management entities:
 * - Contract Types
 * - Employee Contracts
 * - Contract Amendments
 */

import type { BaseRecord } from '../db/base';

// ========== CONTRACT TYPES ==========

export interface ContractTypeRecord extends BaseRecord {
  name: string;
  category: string;
  description?: string;
  noticePeriodDays?: number;
  maxDurationMonths?: number;
  isRenewable?: boolean;
  isActive: boolean;
  [key: string]: unknown;
}

export const CONTRACT_CATEGORY = {
  PERMANENT: 'permanent',
  PROJECT: 'project',
  CONSULTANT: 'consultant',
  TEMPORARY: 'temporary',
  INTERNSHIP: 'internship',
} as const;

export type ContractCategory =
  (typeof CONTRACT_CATEGORY)[keyof typeof CONTRACT_CATEGORY];

// ========== EMPLOYEE CONTRACTS ==========

export interface EmployeeContractRecord extends BaseRecord {
  contractNumber: string;
  employeeId: number;
  contractTypeId: number;
  projectId?: number;
  positionId?: number;
  departmentId?: number;
  startDate: string;
  endDate: string;
  salary?: number;
  currency?: string;
  probationPeriodMonths?: number;
  noticePeriodDays?: number;
  terms?: string;
  status: string;
  signedDate?: string;
  signedBy?: string;
  terminationDate?: string;
  terminationReason?: string;
  [key: string]: unknown;
}

export const CONTRACT_STATUS = {
  DRAFT: 'draft',
  PENDING_SIGNATURE: 'pending_signature',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  TERMINATED: 'terminated',
  RENEWED: 'renewed',
} as const;

export type ContractStatus =
  (typeof CONTRACT_STATUS)[keyof typeof CONTRACT_STATUS];

// ========== CONTRACT AMENDMENTS ==========

export interface ContractAmendmentRecord extends BaseRecord {
  amendmentNumber: string;
  contractId: number;
  amendmentType: string;
  description?: string;
  effectiveDate: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
  status: string;
  requestedBy?: string;
  approvedBy?: string;
  approvalDate?: string;
  [key: string]: unknown;
}

export const AMENDMENT_TYPE = {
  EXTENSION: 'extension',
  SALARY: 'salary',
  POSITION: 'position',
  DEPARTMENT: 'department',
  TERMS: 'terms',
  TERMINATION: 'termination',
  OTHER: 'other',
} as const;

export type AmendmentType =
  (typeof AMENDMENT_TYPE)[keyof typeof AMENDMENT_TYPE];

export const CONTRACT_AMENDMENT_STATUS = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  IMPLEMENTED: 'implemented',
} as const;

export type ContractAmendmentStatus =
  (typeof CONTRACT_AMENDMENT_STATUS)[keyof typeof CONTRACT_AMENDMENT_STATUS];
