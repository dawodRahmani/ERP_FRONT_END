/**
 * Disciplinary Module Types
 *
 * Type definitions for disciplinary management system.
 * Covers: Misconduct Reports, Investigations, Actions, Appeals, Grievances
 */

import type { BaseRecord } from '../db/base';

// ========== ENUMS AND CONSTANTS ==========

export const REPORT_SOURCE = {
  SUPERVISOR: 'supervisor',
  EMPLOYEE: 'employee',
  HR: 'hr',
  MANAGEMENT: 'management',
  ANONYMOUS: 'anonymous',
  EXTERNAL: 'external',
} as const;

export const MISCONDUCT_CATEGORY = {
  MINOR: 'minor',
  MISCONDUCT: 'misconduct',
  GROSS_MISCONDUCT: 'gross_misconduct',
  SERIOUS_MISCONDUCT: 'serious_misconduct',
} as const;

export const MISCONDUCT_TYPE = {
  ATTENDANCE: 'attendance',
  PERFORMANCE: 'performance',
  CONDUCT: 'conduct',
  POLICY_VIOLATION: 'policy_violation',
  INSUBORDINATION: 'insubordination',
  HARASSMENT: 'harassment',
  DISCRIMINATION: 'discrimination',
  THEFT: 'theft',
  FRAUD: 'fraud',
  SAFETY_VIOLATION: 'safety_violation',
  CONFIDENTIALITY_BREACH: 'confidentiality_breach',
  CONFLICT_OF_INTEREST: 'conflict_of_interest',
} as const;

export const SEVERITY_LEVEL = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const MISCONDUCT_STATUS = {
  RECEIVED: 'received',
  ASSESSING: 'assessing',
  UNDER_INVESTIGATION: 'under_investigation',
  CLOSED_NO_ACTION: 'closed_no_action',
  CLOSED_ACTION_TAKEN: 'closed_action_taken',
  WITHDRAWN: 'withdrawn',
} as const;

export const INVESTIGATION_TYPE = {
  PRELIMINARY: 'preliminary',
  FORMAL: 'formal',
  INTERNAL: 'internal',
  EXTERNAL: 'external',
} as const;

export const INVESTIGATION_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  SUSPENDED: 'suspended',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const EVIDENCE_TYPE = {
  DOCUMENT: 'document',
  PHOTO: 'photo',
  VIDEO: 'video',
  AUDIO: 'audio',
  WITNESS_STATEMENT: 'witness_statement',
  EMAIL: 'email',
  DIGITAL: 'digital',
  PHYSICAL: 'physical',
} as const;

export const INTERVIEW_TYPE = {
  ACCUSED: 'accused',
  WITNESS: 'witness',
  COMPLAINANT: 'complainant',
  EXPERT: 'expert',
} as const;

export const SUSPENSION_TYPE = {
  WITH_PAY: 'with_pay',
  WITHOUT_PAY: 'without_pay',
  PARTIAL_PAY: 'partial_pay',
} as const;

export const SUSPENSION_STATUS = {
  ACTIVE: 'active',
  LIFTED: 'lifted',
  EXPIRED: 'expired',
  EXTENDED: 'extended',
} as const;

export const ACTION_TYPE = {
  VERBAL_WARNING: 'verbal_warning',
  FIRST_WRITTEN_WARNING: 'first_written_warning',
  FINAL_WRITTEN_WARNING: 'final_written_warning',
  SUSPENSION: 'suspension',
  DEMOTION: 'demotion',
  SALARY_REDUCTION: 'salary_reduction',
  TERMINATION: 'termination',
  COUNSELING: 'counseling',
  TRAINING: 'training',
} as const;

export const ACTION_STATUS = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  ISSUED: 'issued',
  ACKNOWLEDGED: 'acknowledged',
  UNDER_APPEAL: 'under_appeal',
  COMPLETED: 'completed',
  OVERTURNED: 'overturned',
} as const;

export const APPEAL_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  HEARING_SCHEDULED: 'hearing_scheduled',
  DECIDED: 'decided',
  WITHDRAWN: 'withdrawn',
} as const;

export const APPEAL_OUTCOME = {
  UPHELD: 'upheld',
  OVERTURNED: 'overturned',
  MODIFIED: 'modified',
  REMANDED: 'remanded',
} as const;

export const WARNING_TYPE = {
  VERBAL: 'verbal',
  FIRST_WRITTEN: 'first_written',
  FINAL_WRITTEN: 'final_written',
} as const;

export const GRIEVANCE_TYPE = {
  WORKPLACE: 'workplace',
  HARASSMENT: 'harassment',
  DISCRIMINATION: 'discrimination',
  COMPENSATION: 'compensation',
  WORKING_CONDITIONS: 'working_conditions',
  MANAGEMENT: 'management',
  POLICY: 'policy',
  OTHER: 'other',
} as const;

export const GRIEVANCE_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  INVESTIGATING: 'investigating',
  RESOLVED: 'resolved',
  ESCALATED: 'escalated',
  CLOSED: 'closed',
} as const;

export const INCIDENT_TYPE = {
  ZERO_TOLERANCE: 'zero_tolerance',
  SAFEGUARDING: 'safeguarding',
  FRAUD: 'fraud',
  CORRUPTION: 'corruption',
  SEXUAL_EXPLOITATION: 'sexual_exploitation',
  SEXUAL_ABUSE: 'sexual_abuse',
  CHILD_ABUSE: 'child_abuse',
} as const;

export const NOTE_TYPE = {
  GENERAL: 'general',
  INTERVIEW: 'interview',
  EVIDENCE: 'evidence',
  DECISION: 'decision',
  FOLLOW_UP: 'follow_up',
} as const;

export const CASE_TYPE = {
  MISCONDUCT_REPORT: 'misconduct_report',
  INVESTIGATION: 'investigation',
  DISCIPLINARY_ACTION: 'disciplinary_action',
  APPEAL: 'appeal',
  GRIEVANCE: 'grievance',
  COMPLIANCE_INCIDENT: 'compliance_incident',
} as const;

// Type exports
export type ReportSource = typeof REPORT_SOURCE[keyof typeof REPORT_SOURCE];
export type MisconductCategory = typeof MISCONDUCT_CATEGORY[keyof typeof MISCONDUCT_CATEGORY];
export type MisconductType = typeof MISCONDUCT_TYPE[keyof typeof MISCONDUCT_TYPE];
export type SeverityLevel = typeof SEVERITY_LEVEL[keyof typeof SEVERITY_LEVEL];
export type MisconductStatus = typeof MISCONDUCT_STATUS[keyof typeof MISCONDUCT_STATUS];
export type InvestigationType = typeof INVESTIGATION_TYPE[keyof typeof INVESTIGATION_TYPE];
export type InvestigationStatus = typeof INVESTIGATION_STATUS[keyof typeof INVESTIGATION_STATUS];
export type EvidenceType = typeof EVIDENCE_TYPE[keyof typeof EVIDENCE_TYPE];
export type InterviewType = typeof INTERVIEW_TYPE[keyof typeof INTERVIEW_TYPE];
export type SuspensionType = typeof SUSPENSION_TYPE[keyof typeof SUSPENSION_TYPE];
export type SuspensionStatus = typeof SUSPENSION_STATUS[keyof typeof SUSPENSION_STATUS];
export type ActionType = typeof ACTION_TYPE[keyof typeof ACTION_TYPE];
export type ActionStatus = typeof ACTION_STATUS[keyof typeof ACTION_STATUS];
export type AppealStatus = typeof APPEAL_STATUS[keyof typeof APPEAL_STATUS];
export type AppealOutcome = typeof APPEAL_OUTCOME[keyof typeof APPEAL_OUTCOME];
export type WarningType = typeof WARNING_TYPE[keyof typeof WARNING_TYPE];
export type GrievanceType = typeof GRIEVANCE_TYPE[keyof typeof GRIEVANCE_TYPE];
export type GrievanceStatus = typeof GRIEVANCE_STATUS[keyof typeof GRIEVANCE_STATUS];
export type IncidentType = typeof INCIDENT_TYPE[keyof typeof INCIDENT_TYPE];
export type NoteType = typeof NOTE_TYPE[keyof typeof NOTE_TYPE];
export type CaseType = typeof CASE_TYPE[keyof typeof CASE_TYPE];

// ========== RECORD INTERFACES ==========

/**
 * Misconduct Report
 */
export interface MisconductReportRecord extends BaseRecord {
  reportNumber: string;
  reportDate: string;
  reportSource: ReportSource;
  reporterId?: number;
  reporterName?: string;
  isAnonymous: boolean;
  accusedEmployeeId: number;
  accusedEmployeeName: string;
  accusedDepartment: string;
  incidentDate: string;
  incidentLocation: string;
  incidentDescription: string;
  misconductCategory: MisconductCategory;
  misconductType: MisconductType;
  severityLevel: SeverityLevel;
  immediateActionRequired: boolean;
  immediateActionTaken?: string;
  witnessNames?: string;
  witnessStatements?: string;
  status: MisconductStatus;
  assessmentNotes?: string;
  assessmentBy?: string;
  assessedAt?: string;
  relatedReportIds?: number[];
}

/**
 * Misconduct Evidence
 */
export interface MisconductEvidenceRecord extends BaseRecord {
  reportId?: number;
  investigationId?: number;
  evidenceType: EvidenceType;
  description: string;
  evidenceLocation?: string;
  fileName?: string;
  fileUrl?: string;
  collectedBy: string;
  collectionDate: string;
  chainOfCustody?: string;
  notes?: string;
}

/**
 * Disciplinary Investigation
 */
export interface DisciplinaryInvestigationRecord extends BaseRecord {
  investigationNumber: string;
  reportId: number;
  reportNumber?: string;
  accusedEmployeeId: number;
  accusedEmployeeName: string;
  investigationType: InvestigationType;
  status: InvestigationStatus;
  leadInvestigatorId: number;
  leadInvestigatorName: string;
  teamMembers?: string;
  startDate?: string;
  targetEndDate?: string;
  actualEndDate?: string;
  investigationScope: string;
  findingsProven?: boolean;
  findings?: string;
  recommendations?: string;
  finalReport?: string;
  approvedBy?: string;
  approvedAt?: string;
}

/**
 * Investigation Interview
 */
export interface InvestigationInterviewRecord extends BaseRecord {
  investigationId: number;
  interviewType: InterviewType;
  intervieweeName: string;
  intervieweeId?: number;
  interviewerName: string;
  interviewDate: string;
  location: string;
  summary: string;
  keyPoints?: string;
  documentUrl?: string;
  witnessPresent?: string;
}

/**
 * Precautionary Suspension
 */
export interface PrecautionarySuspensionRecord extends BaseRecord {
  employeeId: number;
  employeeName: string;
  reportId?: number;
  investigationId?: number;
  suspensionType: SuspensionType;
  status: SuspensionStatus;
  startDate: string;
  plannedEndDate?: string;
  actualEndDate?: string;
  reason: string;
  approvedBy: string;
  approvedDate: string;
  outcomeNotes?: string;
  liftedBy?: string;
  liftedDate?: string;
}

/**
 * Disciplinary Action
 */
export interface DisciplinaryActionRecord extends BaseRecord {
  actionNumber: string;
  employeeId: number;
  employeeName: string;
  department: string;
  reportId?: number;
  investigationId?: number;
  actionType: ActionType;
  actionLevel: number;
  issueDate?: string;
  effectiveDate?: string;
  expiryDate?: string;
  misconductDescription: string;
  expectedImprovement: string;
  consequencesIfRepeated: string;
  supportProvided?: string;
  employeeAcknowledged: boolean;
  employeeAcknowledgedAt?: string;
  employeeComments?: string;
  issuedBy: string;
  approvedBy?: string;
  approvedDate?: string;
  status: ActionStatus;
  appealDeadline?: string;
  outcomeNotes?: string;
}

/**
 * Disciplinary Appeal
 */
export interface DisciplinaryAppealRecord extends BaseRecord {
  appealNumber: string;
  disciplinaryActionId: number;
  actionNumber?: string;
  employeeId: number;
  employeeName: string;
  appealDate: string;
  appealGrounds: string;
  supportingEvidence?: string;
  desiredOutcome: string;
  status: AppealStatus;
  reviewedBy?: string;
  hearingDate?: string;
  hearingLocation?: string;
  decisionMaker?: string;
  decisionDate?: string;
  appealOutcome?: AppealOutcome;
  decisionRationale?: string;
  actionsTaken?: string;
}

/**
 * Employee Warning History
 */
export interface EmployeeWarningHistoryRecord extends BaseRecord {
  employeeId: number;
  employeeName: string;
  disciplinaryActionId: number;
  actionNumber?: string;
  warningType: WarningType;
  issueDate: string;
  expiryDate?: string;
  misconductSummary: string;
  isActive: boolean;
  expiredAt?: string;
  removedBy?: string;
  removalReason?: string;
}

/**
 * Employee Grievance
 */
export interface EmployeeGrievanceRecord extends BaseRecord {
  grievanceNumber: string;
  employeeId: number;
  employeeName: string;
  department: string;
  grievanceDate: string;
  grievanceType: GrievanceType;
  description: string;
  affectedParties?: string;
  desiredResolution: string;
  assignedTo?: string;
  investigationNotes?: string;
  status: GrievanceStatus;
  resolutionDate?: string;
  resolutionDetails?: string;
  employeeSatisfied?: boolean;
  escalatedTo?: string;
  escalationDate?: string;
}

/**
 * Compliance Incident
 */
export interface ComplianceIncidentRecord extends BaseRecord {
  incidentNumber: string;
  reportId?: number;
  incidentType: IncidentType;
  severity: SeverityLevel;
  incidentDate: string;
  location: string;
  description: string;
  involvedParties?: string;
  reportedBy: string;
  reportedDate: string;
  status: string;
  investigationRequired: boolean;
  investigationId?: number;
  actionsTaken?: string;
  preventiveMeasures?: string;
  reportedToAuthorities?: boolean;
  authorityReportDate?: string;
  resolutionDate?: string;
}

/**
 * Misconduct Case Notes
 */
export interface MisconductCaseNoteRecord extends BaseRecord {
  caseType: CaseType;
  caseId: number;
  caseNumber?: string;
  noteType: NoteType;
  noteDate: string;
  author: string;
  note: string;
  isConfidential: boolean;
  attachments?: string;
}
