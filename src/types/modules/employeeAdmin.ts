/**
 * Employee Administration Module Types
 *
 * Type definitions for employee administration system.
 * Covers: Emergency Contacts, Education, Experience, Skills, Medical, Personnel Files, Onboarding
 */

import type { BaseRecord } from '../db/base';

// ========== ENUMS AND CONSTANTS ==========

export const RELATIONSHIP_TYPE = {
  SPOUSE: 'spouse',
  PARENT: 'parent',
  CHILD: 'child',
  SIBLING: 'sibling',
  RELATIVE: 'relative',
  FRIEND: 'friend',
  OTHER: 'other',
} as const;

export const EDUCATION_LEVEL = {
  HIGH_SCHOOL: 'high_school',
  DIPLOMA: 'diploma',
  BACHELORS: 'bachelors',
  MASTERS: 'masters',
  PHD: 'phd',
  CERTIFICATE: 'certificate',
  OTHER: 'other',
} as const;

export const SKILL_TYPE = {
  TECHNICAL: 'technical',
  LANGUAGE: 'language',
  SOFT_SKILL: 'soft_skill',
  CERTIFICATION: 'certification',
  OTHER: 'other',
} as const;

export const PROFICIENCY_LEVEL = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
} as const;

export const BLOOD_TYPE = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
  UNKNOWN: 'unknown',
} as const;

export const FILE_STATUS = {
  INCOMPLETE: 'incomplete',
  COMPLETE: 'complete',
  UNDER_REVIEW: 'under_review',
  ARCHIVED: 'archived',
} as const;

export const PERSONNEL_DOCUMENT_SECTION = {
  PERSONAL: 'personal',
  EDUCATION: 'education',
  EXPERIENCE: 'experience',
  CONTRACTS: 'contracts',
  PERFORMANCE: 'performance',
  MEDICAL: 'medical',
  CERTIFICATIONS: 'certifications',
  OTHER: 'other',
} as const;

export const DOCUMENT_TYPE = {
  ID_CARD: 'id_card',
  PASSPORT: 'passport',
  DEGREE: 'degree',
  CERTIFICATE: 'certificate',
  CONTRACT: 'contract',
  MEDICAL_REPORT: 'medical_report',
  REFERENCE_LETTER: 'reference_letter',
  POLICE_CHECK: 'police_check',
  OTHER: 'other',
} as const;

export const ONBOARDING_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ON_HOLD: 'on_hold',
} as const;

export const ONBOARDING_SECTION = {
  PRE_ARRIVAL: 'pre_arrival',
  FIRST_DAY: 'first_day',
  FIRST_WEEK: 'first_week',
  FIRST_MONTH: 'first_month',
  PROBATION: 'probation',
} as const;

export const ITEM_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  NOT_APPLICABLE: 'not_applicable',
} as const;

export const URGENCY_LEVEL = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const APPROVAL_LEVEL = {
  SUPERVISOR: 'supervisor',
  DEPARTMENT_HEAD: 'department_head',
  HR_MANAGER: 'hr_manager',
  DIRECTOR: 'director',
  EXECUTIVE: 'executive',
} as const;

export const MAHRAM_RELATIONSHIP = {
  HUSBAND: 'husband',
  FATHER: 'father',
  BROTHER: 'brother',
  SON: 'son',
  UNCLE: 'uncle',
  GRANDFATHER: 'grandfather',
} as const;

export const MAHRAM_AVAILABILITY = {
  ALWAYS: 'always',
  DURING_TRAVEL: 'during_travel',
  FIELD_VISITS: 'field_visits',
  EMERGENCY: 'emergency',
} as const;

export const MAHRAM_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  TEMPORARY: 'temporary',
} as const;

// Type exports
export type RelationshipType = typeof RELATIONSHIP_TYPE[keyof typeof RELATIONSHIP_TYPE];
export type EducationLevel = typeof EDUCATION_LEVEL[keyof typeof EDUCATION_LEVEL];
export type SkillType = typeof SKILL_TYPE[keyof typeof SKILL_TYPE];
export type ProficiencyLevel = typeof PROFICIENCY_LEVEL[keyof typeof PROFICIENCY_LEVEL];
export type BloodType = typeof BLOOD_TYPE[keyof typeof BLOOD_TYPE];
export type FileStatus = typeof FILE_STATUS[keyof typeof FILE_STATUS];
export type PersonnelDocumentSection = typeof PERSONNEL_DOCUMENT_SECTION[keyof typeof PERSONNEL_DOCUMENT_SECTION];
export type DocumentType = typeof DOCUMENT_TYPE[keyof typeof DOCUMENT_TYPE];
export type OnboardingStatus = typeof ONBOARDING_STATUS[keyof typeof ONBOARDING_STATUS];
export type OnboardingSection = typeof ONBOARDING_SECTION[keyof typeof ONBOARDING_SECTION];
export type ItemStatus = typeof ITEM_STATUS[keyof typeof ITEM_STATUS];
export type UrgencyLevel = typeof URGENCY_LEVEL[keyof typeof URGENCY_LEVEL];
export type ApprovalLevel = typeof APPROVAL_LEVEL[keyof typeof APPROVAL_LEVEL];
export type MahramRelationship = typeof MAHRAM_RELATIONSHIP[keyof typeof MAHRAM_RELATIONSHIP];
export type MahramAvailability = typeof MAHRAM_AVAILABILITY[keyof typeof MAHRAM_AVAILABILITY];
export type MahramStatus = typeof MAHRAM_STATUS[keyof typeof MAHRAM_STATUS];

// ========== RECORD INTERFACES ==========

/**
 * Emergency Contact
 */
export interface EmergencyContactRecord extends BaseRecord {
  employeeId: number;
  name: string;
  relationship: RelationshipType;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
  notes?: string;
}

/**
 * Employee Education
 */
export interface EmployeeEducationRecord extends BaseRecord {
  employeeId: number;
  level: EducationLevel;
  institution: string;
  fieldOfStudy: string;
  degree?: string;
  startDate?: string;
  endDate?: string;
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  documentUrl?: string;
  notes?: string;
}

/**
 * Employee Experience
 */
export interface EmployeeExperienceRecord extends BaseRecord {
  employeeId: number;
  organization: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  responsibilities?: string;
  achievements?: string;
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  documentUrl?: string;
  notes?: string;
}

/**
 * Employee Skills
 */
export interface EmployeeSkillRecord extends BaseRecord {
  employeeId: number;
  skillName: string;
  skillType: SkillType;
  proficiency: ProficiencyLevel;
  yearsOfExperience?: number;
  certificationName?: string;
  certificationDate?: string;
  notes?: string;
}

/**
 * Employee Medical Information
 */
export interface EmployeeMedicalRecord extends BaseRecord {
  employeeId: number;
  bloodType?: BloodType;
  allergies?: string;
  chronicConditions?: string;
  medications?: string;
  emergencyMedicalInfo?: string;
  lastCheckupDate?: string;
  nextCheckupDate?: string;
  doctorName?: string;
  doctorPhone?: string;
  notes?: string;
}

/**
 * Personnel File
 */
export interface PersonnelFileRecord extends BaseRecord {
  employeeId: number;
  employeeName?: string;
  fileLocation?: string;
  status: FileStatus;
  completenessPercentage?: number;
  lastAuditDate?: string;
  lastAuditBy?: string;
  notes?: string;
}

/**
 * Personnel Document
 */
export interface PersonnelDocumentRecord extends BaseRecord {
  personnelFileId: number;
  section: PersonnelDocumentSection;
  documentType: DocumentType;
  documentName: string;
  documentUrl?: string;
  uploadedBy?: string;
  uploadedDate?: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
  expiryDate?: string;
  notes?: string;
}

/**
 * Onboarding Checklist
 */
export interface OnboardingChecklistRecord extends BaseRecord {
  employeeId: number;
  employeeName: string;
  department: string;
  position: string;
  startDate: string;
  status: OnboardingStatus;
  totalItems: number;
  completedItems: number;
  completionPercentage: number;
  assignedTo?: string;
  completedDate?: string;
  notes?: string;
}

/**
 * Onboarding Item
 */
export interface OnboardingItemRecord extends BaseRecord {
  checklistId: number;
  section: OnboardingSection;
  title: string;
  description?: string;
  status: ItemStatus;
  dueDate?: string;
  completedAt?: string;
  completedBy?: string;
  assignedTo?: string;
  priority?: number;
  notes?: string;
}

/**
 * Policy Acknowledgement
 */
export interface PolicyAcknowledgementRecord extends BaseRecord {
  employeeId: number;
  employeeName?: string;
  policyName: string;
  version: string;
  acknowledgedDate: string;
  acknowledgedBy?: string;
  documentUrl?: string;
  notes?: string;
}

/**
 * Interim Hiring Request
 */
export interface InterimHiringRequestRecord extends BaseRecord {
  requestNumber: string;
  requestDate: string;
  requestedBy: string;
  requestedByDepartment: string;
  department: string;
  position: string;
  numberOfPositions: number;
  duration?: string;
  startDate?: string;
  endDate?: string;
  justification: string;
  urgency: UrgencyLevel;
  budgetAvailable: boolean;
  budgetSource?: string;
  status: string;
  currentApprovalLevel?: ApprovalLevel;
  finalDecision?: string;
  notes?: string;
}

/**
 * Interim Hiring Approval
 */
export interface InterimHiringApprovalRecord extends BaseRecord {
  requestId: number;
  level: ApprovalLevel;
  status: string;
  approvedBy: string;
  approvalDate: string;
  comments?: string;
  conditions?: string;
}

/**
 * Mahram Registration
 */
export interface MahramRegistrationRecord extends BaseRecord {
  employeeId: number;
  employeeName: string;
  mahramName: string;
  relationship: MahramRelationship;
  mahramAge?: number;
  mahramOccupation?: string;
  mahramPhone: string;
  mahramIdCardNumber?: string;
  relationshipProofUrl?: string;
  availability: MahramAvailability;
  status: MahramStatus;
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  startDate: string;
  endDate?: string;
  deactivationReason?: string;
  deactivatedAt?: string;
  notes?: string;
}

/**
 * Employee Status History
 */
export interface EmployeeStatusHistoryRecord extends BaseRecord {
  employeeId: number;
  employeeName?: string;
  fromStatus: string;
  toStatus: string;
  changedAt: string;
  changedBy: string;
  reason?: string;
  effectiveDate?: string;
  notes?: string;
}
