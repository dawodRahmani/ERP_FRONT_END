/**
 * Program Module Type Definitions
 *
 * Type definitions for the VDO ERP Program module including:
 * - Donors (master data)
 * - Projects (master data)
 * - Work Plans
 * - Certificates
 * - Documents
 * - Reporting
 * - Beneficiaries
 * - Safeguarding
 */

import type { BaseRecord } from '../db/base';

// ============================================================================
// SHARED TYPES
// ============================================================================

/**
 * File metadata for document uploads
 * Stores only metadata, actual files handled by API
 */
export interface FileMetadata {
  name: string;
  type: string;
  size: number;
  uploadDate: string;
}

// ============================================================================
// DONORS
// ============================================================================

export const DONOR_TYPE = {
  BILATERAL: 'bilateral',
  MULTILATERAL: 'multilateral',
  UN_AGENCY: 'un_agency',
  INGO: 'ingo',
  PRIVATE: 'private',
  FOUNDATION: 'foundation',
  GOVERNMENT: 'government',
  OTHER: 'other',
} as const;

export type DonorType = (typeof DONOR_TYPE)[keyof typeof DONOR_TYPE];

export const DONOR_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PROSPECTIVE: 'prospective',
} as const;

export type DonorStatus = (typeof DONOR_STATUS)[keyof typeof DONOR_STATUS];

export interface ProgramDonorRecord extends BaseRecord {
  donorName: string;
  donorType: DonorType;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  website?: string;
  notes?: string;
  status: DonorStatus;
}

// ============================================================================
// PROJECTS
// ============================================================================

export const PROJECT_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  STOPPED: 'stopped',
  AMENDMENT: 'amendment',
  ONGOING: 'ongoing',
} as const;

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export const THEMATIC_AREA = {
  EDUCATION: 'education',
  HEALTH: 'health',
  NUTRITION: 'nutrition',
  PROTECTION: 'protection',
  WASH: 'wash',
  LIVELIHOOD: 'livelihood',
  FOOD_SECURITY: 'food_security',
  SHELTER: 'shelter',
  GENDER: 'gender',
  GOVERNANCE: 'governance',
  EMERGENCY_RESPONSE: 'emergency_response',
  OTHER: 'other',
} as const;

export type ThematicArea = (typeof THEMATIC_AREA)[keyof typeof THEMATIC_AREA];

export interface ProgramProjectRecord extends BaseRecord {
  projectCode: string;
  donorId: number;
  donorName?: string; // Denormalized for display
  projectName: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate: string;
  budget?: number;
  currency?: string;
  status: ProjectStatus;
  thematicArea?: ThematicArea;
  focalPoint?: string;
}

// ============================================================================
// WORK PLAN
// ============================================================================

export const WORK_PLAN_TIMELINE_STATUS = {
  PLANNED: 'planned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  DELAYED: 'delayed',
  CANCELLED: 'cancelled',
} as const;

export type WorkPlanTimelineStatus =
  (typeof WORK_PLAN_TIMELINE_STATUS)[keyof typeof WORK_PLAN_TIMELINE_STATUS];

export interface WorkPlanTimelineEntry {
  month: number; // 1-12
  year: number;
  status: WorkPlanTimelineStatus;
}

export interface ProgramWorkPlanRecord extends BaseRecord {
  projectId: number;
  projectName?: string; // Denormalized
  donorId?: number;
  donorName?: string;
  output: string;
  activity: string;
  focalPoint?: string;
  thematicArea?: ThematicArea;
  implementationMethodology?: string;
  complianceDocuments?: string;
  location?: string;
  branding?: string;
  socialMedia?: string;
  website?: string;
  targetMatrix?: string;
  timeline: WorkPlanTimelineEntry[];
  remarks?: string;
  reminderDays: number; // Default: 15
}

// ============================================================================
// CERTIFICATES
// ============================================================================

export const CERTIFICATE_AGENCY = {
  DONOR: 'donor',
  PARTNERS: 'partners',
  AUTHORITY: 'authority',
} as const;

export type CertificateAgency =
  (typeof CERTIFICATE_AGENCY)[keyof typeof CERTIFICATE_AGENCY];

export const CERTIFICATE_DOCUMENT_TYPE = {
  RECOMMENDATION_LETTER: 'recommendation_letter',
  WORK_COMPLETION_CERTIFICATE: 'work_completion_certificate',
  PROJECT_COMPLETION_CERTIFICATE: 'project_completion_certificate',
} as const;

export type CertificateDocumentType =
  (typeof CERTIFICATE_DOCUMENT_TYPE)[keyof typeof CERTIFICATE_DOCUMENT_TYPE];

export interface ProgramCertificateRecord extends BaseRecord {
  projectId: number;
  projectName?: string;
  stakeholderName: string;
  agency: CertificateAgency;
  documentType: CertificateDocumentType;
  year: number;
  areasOfCollaboration?: string;
  documentFile?: FileMetadata;
}

// ============================================================================
// PROJECT DOCUMENTS
// ============================================================================

export const PROJECT_DOCUMENT_TYPE = {
  PROPOSAL: 'proposal',
  WORKPLAN: 'workplan',
  BUDGET: 'budget',
  GRANT_AGREEMENT: 'grant_agreement',
  LOGFRAME: 'logframe',
  ANNEXES: 'annexes',
  COMPLIANCE_DOCS: 'compliance_docs',
} as const;

export type ProjectDocumentType =
  (typeof PROJECT_DOCUMENT_TYPE)[keyof typeof PROJECT_DOCUMENT_TYPE];

export interface ProgramDocumentRecord extends BaseRecord {
  projectId: number;
  projectName?: string;
  documentType: ProjectDocumentType;
  documentName: string;
  documentFile?: FileMetadata;
  uploadedBy?: string;
  uploadDate: string;
  description?: string;
}

// ============================================================================
// REPORTING
// ============================================================================

export const REPORT_TYPE = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  SEMI_ANNUALLY: 'semi_annually',
  ANNUAL: 'annual',
  PROJECT_CLOSING: 'project_closing_report',
  IMPACT_ASSESSMENT: 'impact_assessment',
  MID_TERM: 'mid_term',
  EVALUATION: 'evaluation',
  RISK_ASSESSMENT: 'risk_assessment',
  SAFEGUARDING: 'safeguarding',
  DAILY: 'daily',
  FINAL: 'final',
} as const;

export type ReportType = (typeof REPORT_TYPE)[keyof typeof REPORT_TYPE];

export const REPORTING_FORMAT = {
  SITREP: 'sitrep',
  NARRATIVE: 'narrative',
  FINANCIAL: 'financial',
  CUSTOM: 'custom',
} as const;

export type ReportingFormat =
  (typeof REPORTING_FORMAT)[keyof typeof REPORTING_FORMAT];

export const REPORT_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  OVERDUE: 'overdue',
} as const;

export type ReportStatus = (typeof REPORT_STATUS)[keyof typeof REPORT_STATUS];

export const REPORT_UPLOADED_BY = {
  PROGRAM: 'program',
  MEAL: 'meal',
} as const;

export type ReportUploadedBy =
  (typeof REPORT_UPLOADED_BY)[keyof typeof REPORT_UPLOADED_BY];

export interface ProgramReportingRecord extends BaseRecord {
  projectId: number;
  projectName?: string;
  donorId?: number;
  donorName?: string;
  location?: string;
  reportType: ReportType;
  reportingDescription?: string;
  reportingFormat: ReportingFormat;
  dueDate: string;
  reminderDays: number; // Default: 10
  uploadedBy?: ReportUploadedBy;
  documentFile?: FileMetadata;
  status: ReportStatus;
  submittedDate?: string;
}

// ============================================================================
// BENEFICIARIES
// ============================================================================

export const BENEFICIARY_TYPE = {
  COMMUNITY_ELDER: 'community_elder',
  DISABILITY: 'disability',
  RETURNEE: 'returnee',
  YOUTH: 'youth',
  GBV_SURVIVOR: 'gbv_survivor',
  VULNERABLE_COMMUNITIES: 'vulnerable_communities',
  FEMALE_HH: 'female_hh',
  IDP: 'idp',
  OTHER: 'other',
} as const;

export type BeneficiaryType =
  (typeof BENEFICIARY_TYPE)[keyof typeof BENEFICIARY_TYPE];

export const BENEFICIARY_STATUS = {
  VERIFIED: 'verified',
  PENDING: 'pending',
  REJECTED: 'rejected',
} as const;

export type BeneficiaryStatus =
  (typeof BENEFICIARY_STATUS)[keyof typeof BENEFICIARY_STATUS];

export const HEAD_OF_HH_GENDER = {
  MALE: 'male',
  FEMALE: 'female',
} as const;

export type HeadOfHHGender =
  (typeof HEAD_OF_HH_GENDER)[keyof typeof HEAD_OF_HH_GENDER];

export interface ProgramBeneficiaryRecord extends BaseRecord {
  projectId: number;
  projectCode?: string;
  projectName?: string;
  donorId?: number;
  donorName?: string;
  thematicArea?: ThematicArea;
  activity?: string;
  beneficiaryName: string;
  beneficiaryType: BeneficiaryType;
  serviceType?: string;
  status: BeneficiaryStatus;
  nidNo?: string;
  nidDocument?: FileMetadata;
  contactNumber?: string;
  currentResidence?: string;
  origin?: string;
  district?: string;
  village?: string;
  familySize?: number;
  femaleUnder17?: number;
  femaleOver18?: number;
  maleUnder18?: number;
  maleOver18?: number;
  headOfHHGender?: HeadOfHHGender;
}

// ============================================================================
// SAFEGUARDING
// ============================================================================

export const SAFEGUARDING_ACTIVITY_TYPE = {
  REPORT: 'report',
  AWARENESS_RAISING: 'awareness_raising',
  TRAINING: 'training',
  BANNERS_VISIBILITY: 'banners_visibility',
  WORK_PLAN: 'work_plan',
} as const;

export type SafeguardingActivityType =
  (typeof SAFEGUARDING_ACTIVITY_TYPE)[keyof typeof SAFEGUARDING_ACTIVITY_TYPE];

export const SAFEGUARDING_FREQUENCY = {
  QUARTERLY: 'quarterly',
  ANNUALLY: 'annually',
  AS_PER_PLAN: 'as_per_plan',
} as const;

export type SafeguardingFrequency =
  (typeof SAFEGUARDING_FREQUENCY)[keyof typeof SAFEGUARDING_FREQUENCY];

export const SAFEGUARDING_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
} as const;

export type SafeguardingStatus =
  (typeof SAFEGUARDING_STATUS)[keyof typeof SAFEGUARDING_STATUS];

export interface ProgramSafeguardingRecord extends BaseRecord {
  projectId: number;
  projectName?: string;
  activityType: SafeguardingActivityType;
  frequency: SafeguardingFrequency;
  documentFile?: FileMetadata;
  responsibleOfficer?: string;
  dueDate?: string;
  status: SafeguardingStatus;
  completedDate?: string;
  description?: string;
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface ProgramDashboardStats {
  // Donors
  totalDonors: number;
  activeDonors: number;

  // Projects
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  projectsEndingSoon: number;

  // Work Plans
  totalWorkPlans: number;

  // Reporting
  totalReports: number;
  pendingReports: number;
  overdueReports: number;
  submittedReports: number;

  // Beneficiaries
  totalBeneficiaries: number;
  verifiedBeneficiaries: number;
  pendingVerification: number;

  // Safeguarding
  totalSafeguardingActivities: number;
  pendingSafeguarding: number;
  completedSafeguarding: number;
}

export interface UpcomingDeadline {
  type: 'report' | 'safeguarding' | 'project_end';
  title: string;
  projectName?: string;
  dueDate: string;
  id: number;
}

export interface RecentActivity {
  type: 'report' | 'document' | 'beneficiary';
  action: string;
  title: string;
  date: string;
}
