/**
 * Tracking Module Types
 *
 * Type definitions for all tracking services:
 * - In/Out Tracking
 * - Access Tracking
 * - DNR Tracking
 * - MOU Tracking
 * - Program Work Plan Tracking
 */

import type { BaseRecord } from '../db/base';

// ========== IN/OUT TRACKING ==========

export interface InOutTrackingRecord extends BaseRecord {
  serialNumber: string;
  date: string;
  documentType: string;
  subject: string;
  from?: string;
  to?: string;
  department?: string;
  status: string;
  notes?: string;
}

export const IN_OUT_DOCUMENT_TYPE = {
  INCOMING: 'incoming',
  OUTGOING: 'outgoing',
} as const;

export type InOutDocumentType = typeof IN_OUT_DOCUMENT_TYPE[keyof typeof IN_OUT_DOCUMENT_TYPE];

// ========== ACCESS TRACKING ==========

export interface AccessTrackingRecord extends BaseRecord {
  year: number;
  quarter: number;
  donor: string;
  project: string;
  location: string;
  accessType: string;
  accessDate?: string;
  lineMinistry?: string;
  projectStatus?: string;
  notes?: string;
}

export const ACCESS_TYPE = {
  PHYSICAL: 'physical',
  REMOTE: 'remote',
  VIRTUAL: 'virtual',
} as const;

export type AccessType = typeof ACCESS_TYPE[keyof typeof ACCESS_TYPE];

// ========== DNR TRACKING ==========

export interface DNRTrackingRecord extends BaseRecord {
  year: number;
  quarter: number;
  donor: string;
  project: string;
  reportType: string;
  dueDate: string;
  submissionDate?: string;
  status: string;
  notes?: string;
}

export const DNR_REPORT_TYPE = {
  FINANCIAL: 'financial',
  NARRATIVE: 'narrative',
  TECHNICAL: 'technical',
  QUARTERLY: 'quarterly',
  ANNUAL: 'annual',
} as const;

export type DNRReportType = typeof DNR_REPORT_TYPE[keyof typeof DNR_REPORT_TYPE];

export const DNR_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  OVERDUE: 'overdue',
} as const;

export type DNRStatus = typeof DNR_STATUS[keyof typeof DNR_STATUS];

// ========== MOU TRACKING ==========

export interface MOUTrackingRecord extends BaseRecord {
  mouNumber: string;
  partner: string;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  type: string;
  department?: string;
  notes?: string;
}

export const MOU_TYPE = {
  PARTNERSHIP: 'partnership',
  SERVICE: 'service',
  COLLABORATION: 'collaboration',
  FUNDING: 'funding',
} as const;

export type MOUType = typeof MOU_TYPE[keyof typeof MOU_TYPE];

export const MOU_STATUS = {
  DRAFT: 'draft',
  UNDER_REVIEW: 'under_review',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  TERMINATED: 'terminated',
} as const;

export type MOUStatus = typeof MOU_STATUS[keyof typeof MOU_STATUS];

// ========== PROGRAM WORK PLAN ==========

export interface ProgramWorkPlanRecord extends BaseRecord {
  year: number;
  quarter: number;
  month: number;
  activity: string;
  department: string;
  responsible: string;
  status: string;
  targetDate?: string;
  completionDate?: string;
  progress?: number;
  notes?: string;
}

export const WORK_PLAN_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type WorkPlanStatus = typeof WORK_PLAN_STATUS[keyof typeof WORK_PLAN_STATUS];

// ========== SHARED TYPES ==========

export interface TrackingFilters {
  search?: string;
  year?: number;
  quarter?: number;
  status?: string;
  donor?: string;
  project?: string;
  department?: string;
}
