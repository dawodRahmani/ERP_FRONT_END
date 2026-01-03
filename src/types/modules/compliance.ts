/**
 * Compliance Module Types
 *
 * Type definitions for compliance entities:
 * - Compliance Projects
 * - Compliance Documents
 */

import type { BaseRecord } from '../db/base';

// ========== COMPLIANCE PROJECTS ==========

export interface ComplianceProjectRecord extends BaseRecord {
  projectId: number;
  projectName?: string;
  complianceType: string;
  assessmentDate?: string;
  dueDate?: string;
  completedDate?: string;
  assignedTo?: string;
  status: string;
  riskLevel?: string;
  findings?: string;
  notes?: string;
  [key: string]: unknown;
}

export const COMPLIANCE_TYPE = {
  DONOR: 'donor',
  REGULATORY: 'regulatory',
  INTERNAL: 'internal',
  AUDIT: 'audit',
  SANCTIONS: 'sanctions',
} as const;

export type ComplianceType =
  (typeof COMPLIANCE_TYPE)[keyof typeof COMPLIANCE_TYPE];

export const COMPLIANCE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLIANT: 'compliant',
  NON_COMPLIANT: 'non_compliant',
  REMEDIATION: 'remediation',
  CLOSED: 'closed',
} as const;

export type ComplianceStatus =
  (typeof COMPLIANCE_STATUS)[keyof typeof COMPLIANCE_STATUS];

export const RISK_LEVEL = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type RiskLevel = (typeof RISK_LEVEL)[keyof typeof RISK_LEVEL];

// ========== COMPLIANCE DOCUMENTS ==========

export interface ComplianceDocumentRecord extends BaseRecord {
  projectId: number;
  complianceProjectId?: number;
  documentType: string;
  fileName: string;
  fileUrl?: string;
  fileSize?: number;
  uploadedBy?: string;
  uploadedAt?: string;
  expiryDate?: string;
  status: string;
  notes?: string;
  [key: string]: unknown;
}

export const DOCUMENT_TYPE = {
  POLICY: 'policy',
  CERTIFICATE: 'certificate',
  REPORT: 'report',
  AGREEMENT: 'agreement',
  LICENSE: 'license',
  AUDIT_REPORT: 'audit_report',
  EVIDENCE: 'evidence',
  OTHER: 'other',
} as const;

export type DocumentType = (typeof DOCUMENT_TYPE)[keyof typeof DOCUMENT_TYPE];

export const DOCUMENT_STATUS = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
  ARCHIVED: 'archived',
} as const;

export type DocumentStatus =
  (typeof DOCUMENT_STATUS)[keyof typeof DOCUMENT_STATUS];

// ========== COMPLIANCE AMENDMENTS ==========

export interface ComplianceAmendmentRecord extends BaseRecord {
  projectId: number;
  complianceProjectId?: number;
  amendmentType: string;
  description?: string;
  requestedBy?: string;
  requestedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  effectiveDate?: string;
  status: string;
  notes?: string;
  [key: string]: unknown;
}

export const AMENDMENT_TYPE = {
  SCOPE: 'scope',
  BUDGET: 'budget',
  TIMELINE: 'timeline',
  PERSONNEL: 'personnel',
  DELIVERABLES: 'deliverables',
  OTHER: 'other',
} as const;

export type AmendmentType = (typeof AMENDMENT_TYPE)[keyof typeof AMENDMENT_TYPE];

export const AMENDMENT_STATUS = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  IMPLEMENTED: 'implemented',
} as const;

export type AmendmentStatus =
  (typeof AMENDMENT_STATUS)[keyof typeof AMENDMENT_STATUS];

// ========== PROPOSALS (RFP Tracking) ==========

export interface ProposalRecord extends BaseRecord {
  donor: string;
  thematicAreas?: string;
  beneficiaries?: string;
  budget?: number;
  duration?: string;
  location?: string[];
  announcedPlatform?: string;
  customPlatform?: string;
  donorTemplates?: string;
  submissionMechanism?: string;
  submissionDate?: string;
  submissionDeadline: string;
  rmc?: string;
  proposalPackage?: string;
  status?: string;
  result?: string;
  resultAnnouncementDate?: string;
  rejectionReason?: string;
  customRejectionReason?: string;
  [key: string]: unknown;
}

export const PROPOSAL_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  REJECTED: 'rejected',
} as const;

export type ProposalStatus =
  (typeof PROPOSAL_STATUS)[keyof typeof PROPOSAL_STATUS];

export const PROPOSAL_RESULT = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const;

export type ProposalResult =
  (typeof PROPOSAL_RESULT)[keyof typeof PROPOSAL_RESULT];

export const ANNOUNCEMENT_PLATFORM = {
  UNGM: 'UNGM',
  ACBAR: 'ACBAR',
  SOLE_SOURCE: 'Sole Source',
  UNPP: 'UNPP',
  OTHER: 'Any other platform',
} as const;

export type AnnouncementPlatform =
  (typeof ANNOUNCEMENT_PLATFORM)[keyof typeof ANNOUNCEMENT_PLATFORM];

// ========== DUE DILIGENCE ==========

export interface DueDiligenceRecord extends BaseRecord {
  donorName: string;
  donorId?: number;
  projectId?: number;
  assessmentDate?: string;
  assessmentType?: string;
  conductedBy?: string;
  riskRating?: string;
  findings?: string;
  recommendations?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  status: string;
  notes?: string;
  [key: string]: unknown;
}

export const DD_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  REQUIRES_ACTION: 'requires_action',
  CLOSED: 'closed',
} as const;

export type DDStatus = (typeof DD_STATUS)[keyof typeof DD_STATUS];

// ========== REGISTRATIONS ==========

export interface RegistrationRecord extends BaseRecord {
  organizationPlatform: string;
  registrationNumber?: string;
  registrationDate?: string;
  expiryDate?: string;
  status: string;
  documentUrl?: string;
  renewalDate?: string;
  responsiblePerson?: string;
  notes?: string;
  [key: string]: unknown;
}

export const REGISTRATION_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  PENDING_RENEWAL: 'pending_renewal',
  SUSPENDED: 'suspended',
} as const;

export type RegistrationStatus =
  (typeof REGISTRATION_STATUS)[keyof typeof REGISTRATION_STATUS];

// ========== MEMBERSHIPS ==========

export interface MembershipRecord extends BaseRecord {
  organizationName: string;
  membershipType?: string;
  membershipNumber?: string;
  joinDate?: string;
  expiryDate?: string;
  annualFee?: number;
  currency?: string;
  benefits?: string;
  status: string;
  renewalDate?: string;
  notes?: string;
  [key: string]: unknown;
}

export const MEMBERSHIP_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  PENDING_RENEWAL: 'pending_renewal',
  CANCELLED: 'cancelled',
} as const;

export type MembershipStatus =
  (typeof MEMBERSHIP_STATUS)[keyof typeof MEMBERSHIP_STATUS];

// ========== CERTIFICATES ==========

export interface CertificateRecord extends BaseRecord {
  certificateName: string;
  certificateNumber?: string;
  issuingAuthority?: string;
  issueDate: string;
  expiryDate?: string;
  certificateType?: string;
  documentUrl?: string;
  status: string;
  renewalDate?: string;
  notes?: string;
  [key: string]: unknown;
}

export const CERTIFICATE_STATUS = {
  VALID: 'valid',
  EXPIRED: 'expired',
  PENDING_RENEWAL: 'pending_renewal',
  REVOKED: 'revoked',
} as const;

export type CertificateStatus =
  (typeof CERTIFICATE_STATUS)[keyof typeof CERTIFICATE_STATUS];

// ========== BOARD OF DIRECTORS ==========

export interface BoardOfDirectorsRecord extends BaseRecord {
  name: string;
  position: string;
  email?: string;
  phone?: string;
  appointmentDate?: string;
  termEndDate?: string;
  biography?: string;
  expertise?: string;
  isChairperson?: boolean;
  status: string;
  notes?: string;
  [key: string]: unknown;
}

export const BOD_STATUS = {
  ACTIVE: 'active',
  TERM_ENDED: 'term_ended',
  RESIGNED: 'resigned',
  REMOVED: 'removed',
} as const;

export type BODStatus = (typeof BOD_STATUS)[keyof typeof BOD_STATUS];

// ========== PARTNERS ==========

export interface PartnerRecord extends BaseRecord {
  partnerName: string;
  partnerType: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  website?: string;
  partnershipStartDate?: string;
  partnershipEndDate?: string;
  mouReference?: string;
  status: string;
  notes?: string;
  [key: string]: unknown;
}

export const PARTNER_TYPE = {
  IMPLEMENTING: 'implementing',
  FUNDING: 'funding',
  TECHNICAL: 'technical',
  GOVERNMENT: 'government',
  NGO: 'ngo',
  PRIVATE_SECTOR: 'private_sector',
  ACADEMIC: 'academic',
  OTHER: 'other',
} as const;

export type PartnerType = (typeof PARTNER_TYPE)[keyof typeof PARTNER_TYPE];

export const PARTNER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PROSPECTIVE: 'prospective',
  TERMINATED: 'terminated',
} as const;

export type PartnerStatus =
  (typeof PARTNER_STATUS)[keyof typeof PARTNER_STATUS];

// ========== DONOR OUTREACH ==========

export interface DonorOutreachRecord extends BaseRecord {
  donorName: string;
  donorId?: number;
  outreachType?: string;
  outreachDate?: string;
  contactPerson?: string;
  discussion?: string;
  outcome?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  conductedBy?: string;
  status?: string;
  notes?: string;
  [key: string]: unknown;
}

// ========== GOVERNMENT OUTREACH ==========

export interface GovernmentOutreachRecord extends BaseRecord {
  ministryName: string;
  departmentName?: string;
  contactPerson?: string;
  outreachType?: string;
  outreachDate?: string;
  discussion?: string;
  outcome?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  conductedBy?: string;
  status?: string;
  notes?: string;
  [key: string]: unknown;
}

// ========== BLACKLIST ==========

export interface BlacklistRecord extends BaseRecord {
  entityName: string;
  entityType: string;
  reason: string;
  blacklistDate: string;
  source?: string;
  verifiedBy?: string;
  verificationDate?: string;
  expiryDate?: string;
  status: string;
  notes?: string;
  [key: string]: unknown;
}

export const BLACKLIST_ENTITY_TYPE = {
  VENDOR: 'vendor',
  INDIVIDUAL: 'individual',
  ORGANIZATION: 'organization',
  PARTNER: 'partner',
} as const;

export type BlacklistEntityType =
  (typeof BLACKLIST_ENTITY_TYPE)[keyof typeof BLACKLIST_ENTITY_TYPE];

export const BLACKLIST_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  REMOVED: 'removed',
} as const;

export type BlacklistStatus =
  (typeof BLACKLIST_STATUS)[keyof typeof BLACKLIST_STATUS];
