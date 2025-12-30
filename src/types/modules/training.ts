/**
 * Training Module Types
 *
 * Type definitions for training and development system.
 * Covers: Training Types, Programs, TNAs, Calendar, Budget, Sessions, Evaluations, Certificates, Bonds
 */

import type { BaseRecord } from '../db/base';

// ========== ENUMS AND CONSTANTS ==========

export const TRAINING_CATEGORY = {
  TECHNICAL: 'technical',
  SOFT_SKILLS: 'soft_skills',
  COMPLIANCE: 'compliance',
  LEADERSHIP: 'leadership',
  SAFETY: 'safety',
  ORIENTATION: 'orientation',
} as const;

export const TRAINING_STATUS = {
  DRAFT: 'draft',
  PLANNED: 'planned',
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  POSTPONED: 'postponed',
} as const;

export const TNA_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  REVIEWED: 'reviewed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const TRAINING_LEVEL = {
  COMPLETE: 'complete',
  TARGETED: 'targeted',
  REGULAR: 'regular',
  REFRESHER: 'refresher',
  EXPERT: 'expert',
} as const;

export const BUDGET_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  REVIEWED: 'reviewed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REVISED: 'revised',
} as const;

export const INVITATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  TENTATIVE: 'tentative',
} as const;

export const SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const CERTIFICATE_STATUS = {
  DRAFT: 'draft',
  ISSUED: 'issued',
  REVOKED: 'revoked',
} as const;

export const BOND_STATUS = {
  DRAFT: 'draft',
  SIGNED: 'signed',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  BREACHED: 'breached',
  WAIVED: 'waived',
} as const;

export const CALENDAR_STATUS = {
  PLANNED: 'planned',
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const TNA_NEED_STATUS = {
  IDENTIFIED: 'identified',
  PLANNED: 'planned',
  ADDRESSED: 'addressed',
  DEFERRED: 'deferred',
} as const;

export const REPORT_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
} as const;

// Type exports
export type TrainingCategory = typeof TRAINING_CATEGORY[keyof typeof TRAINING_CATEGORY];
export type TrainingStatus = typeof TRAINING_STATUS[keyof typeof TRAINING_STATUS];
export type TNAStatus = typeof TNA_STATUS[keyof typeof TNA_STATUS];
export type TrainingLevel = typeof TRAINING_LEVEL[keyof typeof TRAINING_LEVEL];
export type BudgetStatus = typeof BUDGET_STATUS[keyof typeof BUDGET_STATUS];
export type InvitationStatus = typeof INVITATION_STATUS[keyof typeof INVITATION_STATUS];
export type SessionStatus = typeof SESSION_STATUS[keyof typeof SESSION_STATUS];
export type CertificateStatus = typeof CERTIFICATE_STATUS[keyof typeof CERTIFICATE_STATUS];
export type BondStatus = typeof BOND_STATUS[keyof typeof BOND_STATUS];
export type CalendarStatus = typeof CALENDAR_STATUS[keyof typeof CALENDAR_STATUS];
export type TNANeedStatus = typeof TNA_NEED_STATUS[keyof typeof TNA_NEED_STATUS];
export type ReportStatus = typeof REPORT_STATUS[keyof typeof REPORT_STATUS];

// ========== RECORD INTERFACES ==========

/**
 * Training Type
 */
export interface TrainingTypeRecord extends BaseRecord {
  code: string;
  name: string;
  category: TrainingCategory;
  description?: string;
  durationHours?: number;
  isMandatory: boolean;
  isActive: boolean;
  validityMonths?: number;
  requiresCertification?: boolean;
  notes?: string;
}

/**
 * Training Program
 */
export interface TrainingProgramRecord extends BaseRecord {
  programCode: string;
  name: string;
  trainingTypeId: number;
  trainingTypeName?: string;
  description?: string;
  objectives?: string;
  targetAudience?: string;
  prerequisites?: string;
  durationHours: number;
  isActive: boolean;
  minimumParticipants?: number;
  maximumParticipants?: number;
  notes?: string;
}

/**
 * Training Needs Assessment (TNA)
 */
export interface TrainingNeedsAssessmentRecord extends BaseRecord {
  assessmentNumber: string;
  employeeId: number;
  employeeName?: string;
  department?: string;
  position?: string;
  assessmentPeriod: string;
  assessmentDate?: string;

  // Performance scores (5 rating scale)
  jobKnowledgeScore?: number;
  qualityOfWorkScore?: number;
  productivityScore?: number;
  fieldManagementScore?: number;
  localLanguageScore?: number;
  englishScore?: number;
  communicationScore?: number;
  teamworkScore?: number;
  initiativeScore?: number;
  publicRelationsScore?: number;
  punctualityScore?: number;
  adaptabilityScore?: number;
  overallPerformanceScore?: number;

  // Policy & compliance scores
  aapScore?: number;
  pseahScore?: number;
  safeguardingScore?: number;
  childProtectionScore?: number;
  codeOfConductScore?: number;
  confidentialityScore?: number;
  policyAdherenceScore?: number;
  conflictManagementScore?: number;

  // Additional scores
  expertiseScore?: number;
  commitmentScore?: number;
  sustainabilityScore?: number;
  behaviorScore?: number;

  // Calculated fields
  totalScore: number;
  maxScore: number;
  percentageScore: number;
  trainingLevel: TrainingLevel;

  // Additional data
  assessorName?: string;
  assessorComments?: string;
  employeeComments?: string;
  status: TNAStatus;
  approvedBy?: string;
  approvedAt?: string;
}

/**
 * TNA Training Need
 */
export interface TNATrainingNeedRecord extends BaseRecord {
  tnaId: number;
  trainingArea: string;
  priority: string;
  currentLevel?: string;
  desiredLevel?: string;
  justification?: string;
  recommendedProgram?: string;
  status: TNANeedStatus;
  addressedAt?: string;
  notes?: string;
}

/**
 * Training Calendar Entry
 */
export interface TrainingCalendarRecord extends BaseRecord {
  fiscalYear: number;
  quarter?: number;
  month?: number;
  trainingProgramId: number;
  programName?: string;
  plannedStartDate: string;
  plannedEndDate?: string;
  targetParticipants?: number;
  estimatedBudget?: number;
  currency?: string;
  status: CalendarStatus;
  notes?: string;
}

/**
 * Training Budget Proposal
 */
export interface TrainingBudgetProposalRecord extends BaseRecord {
  proposalNumber: string;
  trainingProgramId?: number;
  programName?: string;
  fiscalYear: number;
  proposalDate?: string;

  // Cost breakdown
  trainerFees: number;
  materialsCost: number;
  venueCost: number;
  travelAccommodation: number;
  refreshmentsCost: number;
  technologyCost: number;
  miscellaneousCost: number;

  // Calculated totals
  subtotal: number;
  contingencyPercentage: number;
  contingencyAmount: number;
  totalBudget: number;

  currency: string;
  status: BudgetStatus;
  submittedBy?: string;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

/**
 * Training (Session/Event)
 */
export interface TrainingRecord extends BaseRecord {
  trainingCode: string;
  trainingProgramId: number;
  programName?: string;
  title: string;
  description?: string;
  objectives?: string;
  startDate: string;
  endDate: string;
  location?: string;
  venue?: string;
  trainerName?: string;
  trainerBio?: string;
  isExternal: boolean;
  organizingBody?: string;
  targetParticipants: number;
  actualParticipants: number;
  status: TrainingStatus;
  budgetAllocated?: number;
  actualCost?: number;
  currency?: string;
  notes?: string;
}

/**
 * Training Participant
 */
export interface TrainingParticipantRecord extends BaseRecord {
  trainingId: number;
  employeeId: number;
  employeeName?: string;
  department?: string;
  position?: string;

  // Invitation
  invitationStatus: InvitationStatus;
  invitedAt: string;
  invitedBy?: string;
  respondedAt?: string;

  // Attendance
  attended: boolean;
  attendancePercentage?: number;

  // Assessment
  preAssessmentScore?: number;
  postAssessmentScore?: number;
  improvementPercentage?: number;
  passed?: boolean;

  // Feedback
  feedbackSubmitted: boolean;
  feedbackRating?: number;

  // Certificate
  certificateEligible: boolean;
  certificateIssued: boolean;
  certificateId?: number;

  notes?: string;
}

/**
 * Training Session (Multi-day breakdown)
 */
export interface TrainingSessionRecord extends BaseRecord {
  trainingId: number;
  sessionNumber: number;
  sessionDate: string;
  startTime?: string;
  endTime?: string;
  topic?: string;
  facilitator?: string;
  location?: string;
  status: SessionStatus;
  attendanceRecorded: boolean;
  notes?: string;
}

/**
 * Training Evaluation
 */
export interface TrainingEvaluationRecord extends BaseRecord {
  trainingId: number;
  participantId: number;
  employeeId?: number;
  evaluationDate: string;

  // Content ratings (1-5)
  contentQualityRating?: number;
  contentRelevanceRating?: number;
  contentClarityRating?: number;

  // Trainer ratings (1-5)
  trainerDeliveryRating?: number;
  trainerKnowledgeRating?: number;
  trainerEngagementRating?: number;

  // Logistics ratings (1-5)
  venueRating?: number;
  materialsRating?: number;
  organizationRating?: number;

  // Overall
  overallRating: number;
  wouldRecommend: boolean;

  // Comments
  strengths?: string;
  improvements?: string;
  additionalComments?: string;
}

/**
 * Training Certificate
 */
export interface TrainingCertificateRecord extends BaseRecord {
  certificateNumber: string;
  trainingId: number;
  trainingTitle?: string;
  participantId: number;
  employeeId: number;
  employeeName: string;
  issueDate: string;
  expiryDate?: string;
  grade?: string;
  score?: number;
  status: CertificateStatus;
  issuedBy?: string;
  documentUrl?: string;
  notes?: string;
}

/**
 * Training Bond
 */
export interface TrainingBondRecord extends BaseRecord {
  bondNumber: string;
  employeeId: number;
  employeeName?: string;
  trainingId?: number;
  trainingTitle?: string;
  trainingCost: number;
  currency: string;
  bondStartDate: string;
  bondEndDate: string;
  bondDurationMonths: number;
  terms?: string;
  employeeSigned: boolean;
  employeeSignedAt?: string;
  witnessName?: string;
  witnessSignedAt?: string;
  status: BondStatus;
  breachDate?: string;
  breachReason?: string;
  recoveryAmount?: number;
  notes?: string;
}

/**
 * Employee Training History
 */
export interface EmployeeTrainingHistoryRecord extends BaseRecord {
  employeeId: number;
  employeeName?: string;
  trainingTitle: string;
  trainingType?: string;
  provider?: string;
  startDate: string;
  endDate: string;
  durationHours?: number;
  location?: string;
  isExternal: boolean;
  certificateObtained: boolean;
  certificateNumber?: string;
  grade?: string;
  score?: number;
  notes?: string;
}

/**
 * Training Report
 */
export interface TrainingReportRecord extends BaseRecord {
  reportNumber: string;
  trainingId: number;
  reportDate: string;
  reportType?: string;

  // Attendance
  totalInvited?: number;
  totalAttended?: number;
  attendanceRate?: number;

  // Assessment
  averagePreScore?: number;
  averagePostScore?: number;
  averageImprovement?: number;
  passRate?: number;

  // Evaluation
  averageContentRating?: number;
  averageTrainerRating?: number;
  averageOverallRating?: number;
  totalResponses?: number;
  recommendationRate?: number;

  // Summary
  keyFindings?: string;
  recommendations?: string;
  lessonsLearned?: string;

  status: ReportStatus;
  preparedBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  documentUrl?: string;
}
