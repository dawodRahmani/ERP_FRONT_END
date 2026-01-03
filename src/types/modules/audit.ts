/**
 * Audit Module Types
 *
 * Type definitions for audit management:
 * - Audit Types (configurable)
 * - HACT Assessments
 * - Donor Project Audits
 * - External Audits
 * - Internal Audits
 * - Partner Audits
 * - Corrective Actions
 */

import type { BaseRecord } from '../db/base';

// ========== ENUMS AND CONSTANTS ==========

export const AUDIT_TYPE_CATEGORY = {
  EXTERNAL: 'external',
  INTERNAL: 'internal',
  PROJECT: 'project',
  PROJECT_COMPLETION: 'project_completion',
  HACT: 'hact',
  AD_HOC: 'ad_hoc',
} as const;

export type AuditTypeCategory =
  (typeof AUDIT_TYPE_CATEGORY)[keyof typeof AUDIT_TYPE_CATEGORY];

export const AUDIT_STATUS = {
  DRAFT: 'draft',
  PLANNED: 'planned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ON_HOLD: 'on_hold',
} as const;

export type AuditStatus = (typeof AUDIT_STATUS)[keyof typeof AUDIT_STATUS];

export const AUDIT_FREQUENCY = {
  ANNUAL: 'annual',
  QUARTERLY: 'quarterly',
  AD_HOC: 'ad_hoc',
  PER_DONOR_SCHEDULE: 'per_donor_schedule',
} as const;

export type AuditFrequency =
  (typeof AUDIT_FREQUENCY)[keyof typeof AUDIT_FREQUENCY];

export const AUDIT_MODALITY = {
  ONLINE: 'online',
  IN_PERSON: 'in_person',
  HYBRID: 'hybrid',
} as const;

export type AuditModality =
  (typeof AUDIT_MODALITY)[keyof typeof AUDIT_MODALITY];

export const AUDIT_SOURCE = {
  OUTSOURCE_TPM: 'outsource_tpm',
  VDO_INTERNAL: 'vdo_internal',
} as const;

export type AuditSource = (typeof AUDIT_SOURCE)[keyof typeof AUDIT_SOURCE];

export const QUARTER = {
  Q1: 'q1',
  Q2: 'q2',
  Q3: 'q3',
  Q4: 'q4',
} as const;

export type Quarter = (typeof QUARTER)[keyof typeof QUARTER];

export const CORRECTIVE_ACTION_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
} as const;

export type CorrectiveActionStatus =
  (typeof CORRECTIVE_ACTION_STATUS)[keyof typeof CORRECTIVE_ACTION_STATUS];

export const AUDIT_ENTITY_TYPE = {
  HACT: 'hact',
  DONOR_PROJECT: 'donor_project',
  EXTERNAL: 'external',
  INTERNAL: 'internal',
  PARTNER: 'partner',
} as const;

export type AuditEntityType =
  (typeof AUDIT_ENTITY_TYPE)[keyof typeof AUDIT_ENTITY_TYPE];

// ========== FILE UPLOAD METADATA ==========

export interface FileUploadMeta {
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  uploadedAt?: string;
  uploadedBy?: string;
  fileUrl?: string;
  fileId?: string;
}

// ========== AUDIT TYPES (CONFIGURABLE) ==========

export interface AuditTypeRecord extends BaseRecord {
  code: string;
  name: string;
  category: AuditTypeCategory;
  description?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface AuditTypeRecordIndex {
  code: string;
  category: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

// ========== HACT ASSESSMENTS ==========

export interface HACTAssessmentRecord extends BaseRecord {
  assessmentNumber: string;
  donorId: number;
  donorName?: string;
  dateAssessmentStarted: string;
  dateAssessmentEnded?: string;
  validUntil?: string;
  auditCompany: string;
  auditFocalPoint?: string;
  purpose?: string;
  reportUpload?: FileUploadMeta;
  status: AuditStatus;
  notes?: string;
}

export interface HACTAssessmentRecordIndex {
  assessmentNumber: string;
  donorId: number;
  status: string;
  dateAssessmentStarted: string;
  validUntil: string;
  createdAt: string;
}

// ========== DONOR PROJECT AUDITS ==========

export interface DonorProjectAuditRecord extends BaseRecord {
  auditNumber: string;
  donorId: number;
  donorName?: string;
  projectId: number;
  projectName?: string;
  periodAudit: string;
  amount?: number;
  currency?: string;
  dateAuditStarted: string;
  dateAuditEnded?: string;
  auditCompanyName: string;
  auditReport?: FileUploadMeta;
  correctiveActionPlan?: FileUploadMeta;
  correctiveActionTakenReport?: FileUploadMeta;
  status: AuditStatus;
  notes?: string;
}

export interface DonorProjectAuditRecordIndex {
  auditNumber: string;
  donorId: number;
  projectId: number;
  status: string;
  dateAuditStarted: string;
  createdAt: string;
}

// ========== EXTERNAL AUDITS ==========

export interface ExternalAuditRecord extends BaseRecord {
  auditNumber: string;
  auditTypeId: number;
  auditTypeName?: string;
  specification?: string;
  frequency: AuditFrequency;
  dateAuditPlanned: string;
  actualDateAuditStarted?: string;
  dateAuditEnded?: string;
  auditCompanyName: string;
  auditFocalPointName?: string;
  auditReport?: FileUploadMeta;
  followUpNeeded: boolean;
  correctiveActionPlan?: FileUploadMeta;
  correctiveActionTakenReport?: FileUploadMeta;
  status: AuditStatus;
  notes?: string;
}

export interface ExternalAuditRecordIndex {
  auditNumber: string;
  auditTypeId: number;
  frequency: string;
  status: string;
  dateAuditPlanned: string;
  followUpNeeded: boolean;
  createdAt: string;
}

// ========== EXTERNAL ANNUAL AUDITS ==========

export interface ExternalAnnualAuditRecord extends BaseRecord {
  externalAuditId: number;
  year: number;
  auditReport?: FileUploadMeta;
  managementLetter?: FileUploadMeta;
  notes?: string;
}

export interface ExternalAnnualAuditRecordIndex {
  externalAuditId: number;
  year: number;
}

// ========== INTERNAL AUDITS ==========

export interface InternalAuditRecord extends BaseRecord {
  auditNumber: string;
  auditTypeId: number;
  auditTypeName?: string;
  donorId?: number;
  donorName?: string;
  projectId?: number;
  projectName?: string;
  departmentsAudited: string[];
  specification?: string;
  frequency: AuditFrequency;
  dateAuditPlanned: string;
  actualDateAuditStarted?: string;
  dateAuditEnded?: string;
  auditEmployeeId?: number;
  auditEmployeeName?: string;
  auditReport?: FileUploadMeta;
  followUpNeeded: boolean;
  correctiveActionPlan?: FileUploadMeta;
  correctiveActionTakenReport?: FileUploadMeta;
  status: AuditStatus;
  notes?: string;
}

export interface InternalAuditRecordIndex {
  auditNumber: string;
  auditTypeId: number;
  donorId: number;
  projectId: number;
  frequency: string;
  status: string;
  dateAuditPlanned: string;
  followUpNeeded: boolean;
  createdAt: string;
}

// ========== INTERNAL QUARTERLY REPORTS ==========

export interface InternalQuarterlyReportRecord extends BaseRecord {
  internalAuditId: number;
  year: number;
  quarter: Quarter;
  auditReport?: FileUploadMeta;
  correctiveActionPlan?: FileUploadMeta;
  actionTakenReport?: FileUploadMeta;
  notes?: string;
}

export interface InternalQuarterlyReportRecordIndex {
  internalAuditId: number;
  year: number;
  quarter: string;
}

// ========== PARTNER AUDITS ==========

export interface PartnerAuditRecord extends BaseRecord {
  auditNumber: string;
  auditTypeId: number;
  auditTypeName?: string;
  donorId?: number;
  donorName?: string;
  projectId?: number;
  projectName?: string;
  partnerName: string;
  partnerLocation?: string;
  auditModality: AuditModality;
  period: string;
  auditSource: AuditSource;
  specification?: string;
  frequency: AuditFrequency;
  dateAuditPlanned: string;
  actualDateAuditStarted?: string;
  dateAuditEnded?: string;
  auditCompanyName?: string;
  auditFocalPointName?: string;
  auditReport?: FileUploadMeta;
  followUpNeeded: boolean;
  correctiveActionPlan?: FileUploadMeta;
  correctiveActionTakenReport?: FileUploadMeta;
  status: AuditStatus;
  notes?: string;
}

export interface PartnerAuditRecordIndex {
  auditNumber: string;
  auditTypeId: number;
  partnerName: string;
  auditModality: string;
  auditSource: string;
  status: string;
  dateAuditPlanned: string;
  followUpNeeded: boolean;
  createdAt: string;
}

// ========== CORRECTIVE ACTIONS ==========

export interface CorrectiveActionRecord extends BaseRecord {
  auditEntityType: AuditEntityType;
  auditId: number;
  auditNumber?: string;
  description: string;
  responsiblePerson?: string;
  dueDate?: string;
  completedDate?: string;
  status: CorrectiveActionStatus;
  notes?: string;
}

export interface CorrectiveActionRecordIndex {
  auditEntityType: string;
  auditId: number;
  status: string;
  dueDate: string;
  createdAt: string;
}

// ========== DASHBOARD TYPES ==========

export interface AuditDashboardStats {
  totalHACT: number;
  totalDonorProject: number;
  totalExternal: number;
  totalInternal: number;
  totalPartner: number;
  totalAudits: number;
  inProgressAudits: number;
  completedAudits: number;
  plannedAudits: number;
  upcomingAudits: number;
  expiringHACT: number;
  pendingCorrectiveActions: number;
  overdueCorrectiveActions: number;
  auditsRequiringFollowUp: number;
}

export interface RecentAuditItem {
  id: number;
  auditNumber?: string;
  assessmentNumber?: string;
  auditCategory: string;
  status: AuditStatus;
  createdAt: string;
  donorName?: string;
  partnerName?: string;
  auditCompanyName?: string;
}

export interface UpcomingAuditItem {
  id: number;
  auditNumber: string;
  auditCategory: string;
  dateAuditPlanned: string;
  status: AuditStatus;
  auditTypeName?: string;
  partnerName?: string;
  auditCompanyName?: string;
}
