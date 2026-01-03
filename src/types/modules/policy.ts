/**
 * Policy & Audit Module Types
 *
 * Type definitions for policy and audit entities:
 * - Policy Versions
 * - HR Audit Logs
 * - Conduct Acknowledgments
 * - PSEA Declarations
 */

import type { BaseRecord } from '../db/base';

// ========== POLICY VERSIONS ==========

export interface PolicyVersionRecord extends BaseRecord {
  policyName: string;
  policyCode?: string;
  version: string;
  category?: string;
  description?: string;
  content?: string;
  documentUrl?: string;
  effectiveDate: string;
  expiryDate?: string;
  supersededVersion?: string;
  approvedBy?: string;
  approvalDate?: string;
  reviewDate?: string;
  reviewedBy?: string;
  status: string;
  changelog?: string;
  requiresAcknowledgment?: boolean;
  notes?: string;
  [key: string]: unknown;
}

export const POLICY_CATEGORY = {
  HR: 'hr',
  FINANCE: 'finance',
  OPERATIONS: 'operations',
  SECURITY: 'security',
  COMPLIANCE: 'compliance',
  IT: 'it',
  TRAVEL: 'travel',
  PROCUREMENT: 'procurement',
  OTHER: 'other',
} as const;

export type PolicyCategory =
  (typeof POLICY_CATEGORY)[keyof typeof POLICY_CATEGORY];

export const POLICY_STATUS = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  ACTIVE: 'active',
  SUPERSEDED: 'superseded',
  ARCHIVED: 'archived',
} as const;

export type PolicyStatus = (typeof POLICY_STATUS)[keyof typeof POLICY_STATUS];

// ========== HR AUDIT LOGS ==========

export interface HRAuditLogRecord extends BaseRecord {
  entityType: string;
  entityId: number;
  entityName?: string;
  action: string;
  previousValue?: string;
  newValue?: string;
  changedFields?: string[];
  performedBy: string;
  performedById?: number;
  performedAt: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  reason?: string;
  notes?: string;
  [key: string]: unknown;
}

export const AUDIT_ACTION = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  VIEW: 'view',
  APPROVE: 'approve',
  REJECT: 'reject',
  SUBMIT: 'submit',
  CANCEL: 'cancel',
  LOGIN: 'login',
  LOGOUT: 'logout',
  EXPORT: 'export',
  IMPORT: 'import',
} as const;

export type AuditAction = (typeof AUDIT_ACTION)[keyof typeof AUDIT_ACTION];

export const ENTITY_TYPE = {
  EMPLOYEE: 'employee',
  LEAVE_REQUEST: 'leave_request',
  PAYROLL: 'payroll',
  RECRUITMENT: 'recruitment',
  TRAINING: 'training',
  PERFORMANCE: 'performance',
  DISCIPLINARY: 'disciplinary',
  CONTRACT: 'contract',
  USER: 'user',
  ROLE: 'role',
  POLICY: 'policy',
  TRAVEL: 'travel',
  ASSET: 'asset',
  OTHER: 'other',
} as const;

export type EntityType = (typeof ENTITY_TYPE)[keyof typeof ENTITY_TYPE];

// ========== CONDUCT ACKNOWLEDGMENTS ==========

export interface ConductAcknowledgmentRecord extends BaseRecord {
  employeeId: number;
  policyVersionId?: number;
  policyName: string;
  policyVersion?: string;
  acknowledgmentType: string;
  acknowledgedDate: string;
  expiryDate?: string;
  signatureUrl?: string;
  signedDigitally?: boolean;
  ipAddress?: string;
  deviceInfo?: string;
  witnessName?: string;
  witnessSignature?: string;
  status: string;
  notes?: string;
  [key: string]: unknown;
}

export const ACKNOWLEDGMENT_TYPE = {
  CODE_OF_CONDUCT: 'code_of_conduct',
  ANTI_HARASSMENT: 'anti_harassment',
  CONFLICT_OF_INTEREST: 'conflict_of_interest',
  DATA_PROTECTION: 'data_protection',
  IT_SECURITY: 'it_security',
  TRAVEL_POLICY: 'travel_policy',
  PROCUREMENT_POLICY: 'procurement_policy',
  OTHER: 'other',
} as const;

export type AcknowledgmentType =
  (typeof ACKNOWLEDGMENT_TYPE)[keyof typeof ACKNOWLEDGMENT_TYPE];

export const ACKNOWLEDGMENT_STATUS = {
  PENDING: 'pending',
  ACKNOWLEDGED: 'acknowledged',
  EXPIRED: 'expired',
  RENEWAL_REQUIRED: 'renewal_required',
} as const;

export type AcknowledgmentStatus =
  (typeof ACKNOWLEDGMENT_STATUS)[keyof typeof ACKNOWLEDGMENT_STATUS];

// ========== PSEA DECLARATIONS ==========

export interface PSEADeclarationRecord extends BaseRecord {
  employeeId: number;
  declarationType: string;
  declarationDate: string;
  expiryDate?: string;
  fiscalYear?: string;
  hasConflict?: boolean;
  conflictDescription?: string;
  mitigationMeasures?: string;
  signatureUrl?: string;
  signedDigitally?: boolean;
  witnessName?: string;
  witnessSignature?: string;
  reviewedBy?: string;
  reviewDate?: string;
  status: string;
  notes?: string;
  [key: string]: unknown;
}

export const PSEA_DECLARATION_TYPE = {
  ANNUAL: 'annual',
  ONBOARDING: 'onboarding',
  PROJECT_SPECIFIC: 'project_specific',
  RENEWAL: 'renewal',
} as const;

export type PSEADeclarationType =
  (typeof PSEA_DECLARATION_TYPE)[keyof typeof PSEA_DECLARATION_TYPE];

export const PSEA_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const;

export type PSEAStatus = (typeof PSEA_STATUS)[keyof typeof PSEA_STATUS];
