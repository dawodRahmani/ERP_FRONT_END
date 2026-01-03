/**
 * Performance Management Module Types
 *
 * Type definitions for performance appraisal system.
 * Covers: Appraisal Cycles, Templates, Criteria, Ratings, PIPs, Probation
 */

import type { BaseRecord } from '../db/base';

// ========== ENUMS AND CONSTANTS ==========

export const CYCLE_TYPE = {
  ANNUAL: 'annual',
  MID_YEAR: 'mid_year',
  PROBATION: 'probation',
  PROJECT_END: 'project_end',
  AD_HOC: 'ad_hoc',
} as const;

export const CYCLE_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
} as const;

export const TEMPLATE_TYPE = {
  ANNUAL: 'annual',
  PROBATION: 'probation',
  MID_YEAR: 'mid_year',
  PROJECT: 'project',
  CUSTOM: 'custom',
} as const;

export const APPRAISAL_STATUS = {
  PENDING: 'pending',
  SELF_ASSESSMENT: 'self_assessment',
  MANAGER_REVIEW: 'manager_review',
  COMMITTEE_REVIEW: 'committee_review',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  COMMUNICATED: 'communicated',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PERFORMANCE_LEVEL = {
  OUTSTANDING: 'outstanding',
  EXCEEDS_EXPECTATIONS: 'exceeds_expectations',
  MEETS_EXPECTATIONS: 'meets_expectations',
  NEEDS_IMPROVEMENT: 'needs_improvement',
  UNSATISFACTORY: 'unsatisfactory',
} as const;

export const PROBATION_STATUS = {
  ACTIVE: 'active',
  EXTENDED: 'extended',
  CONFIRMED: 'confirmed',
  TERMINATED: 'terminated',
} as const;

export const PIP_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  IN_PROGRESS: 'in_progress',
  COMPLETED_SUCCESS: 'completed_success',
  COMPLETED_FAILURE: 'completed_failure',
  CANCELLED: 'cancelled',
} as const;

export const PIP_OUTCOME = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  IN_PROGRESS: 'in_progress',
} as const;

export const GOAL_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  ACHIEVED: 'achieved',
  NOT_ACHIEVED: 'not_achieved',
  PARTIALLY_ACHIEVED: 'partially_achieved',
} as const;

// Rating scale
export const RATING_SCALE = [
  { score: 0, rating: 'Unsatisfactory', description: 'Performance significantly below expectations' },
  { score: 1, rating: 'Needs Improvement', description: 'Performance below expectations, requires development' },
  { score: 2, rating: 'Basic', description: 'Meets minimum requirements' },
  { score: 3, rating: 'Good', description: 'Meets expectations consistently' },
  { score: 4, rating: 'Satisfactory', description: 'Above expectations in most areas' },
  { score: 5, rating: 'Outstanding', description: 'Exceeds expectations, exceptional performance' },
] as const;

// Type exports
export type CycleType = typeof CYCLE_TYPE[keyof typeof CYCLE_TYPE];
export type CycleStatus = typeof CYCLE_STATUS[keyof typeof CYCLE_STATUS];
export type TemplateType = typeof TEMPLATE_TYPE[keyof typeof TEMPLATE_TYPE];
export type AppraisalStatus = typeof APPRAISAL_STATUS[keyof typeof APPRAISAL_STATUS];
export type PerformanceLevel = typeof PERFORMANCE_LEVEL[keyof typeof PERFORMANCE_LEVEL];
export type ProbationStatus = typeof PROBATION_STATUS[keyof typeof PROBATION_STATUS];
export type PIPStatus = typeof PIP_STATUS[keyof typeof PIP_STATUS];
export type PIPOutcome = typeof PIP_OUTCOME[keyof typeof PIP_OUTCOME];
export type GoalStatus = typeof GOAL_STATUS[keyof typeof GOAL_STATUS];

// ========== RECORD INTERFACES ==========

/**
 * Appraisal Cycle
 */
export interface AppraisalCycleRecord extends BaseRecord {
  name: string;
  cycleType: CycleType;
  fiscalYear: number;
  startDate: string;
  endDate: string;
  selfAssessmentDeadline?: string;
  managerReviewDeadline?: string;
  committeeReviewDeadline?: string;
  finalApprovalDeadline?: string;
  status: CycleStatus;
  createdBy: string;
  notes?: string;
}

/**
 * Appraisal Template
 */
export interface AppraisalTemplateRecord extends BaseRecord {
  name: string;
  templateType: TemplateType;
  description?: string;
  isActive: boolean;
  requiresSelfAssessment: boolean;
  requiresCommitteeReview: boolean;
  version: number;
  notes?: string;
  sections?: AppraisalSectionRecord[];
}

/**
 * Appraisal Section
 */
export interface AppraisalSectionRecord extends BaseRecord {
  templateId: number;
  name: string;
  description?: string;
  weightPercentage: number;
  displayOrder: number;
  isRequired: boolean;
}

/**
 * Appraisal Criteria
 */
export interface AppraisalCriteriaRecord extends BaseRecord {
  sectionId: number;
  name: string;
  description?: string;
  minRating: number;
  maxRating: number;
  weight: number;
  displayOrder: number;
  isRequired: boolean;
  requiresComment: boolean;
}

/**
 * Employee Appraisal
 */
export interface EmployeeAppraisalRecord extends BaseRecord {
  appraisalNumber: string;
  cycleId: number;
  employeeId: number;
  employeeName: string;
  department: string;
  position: string;
  templateId: number;
  reviewPeriodStart: string;
  reviewPeriodEnd: string;

  // Self assessment
  selfAssessmentSubmitted: boolean;
  selfAssessmentDate?: string;
  employeeAchievements?: string;
  employeeChallenges?: string;
  employeeComments?: string;

  // Manager review
  managerReviewSubmitted: boolean;
  managerReviewDate?: string;
  managerOverallComments?: string;
  managerStrengths?: string;
  managerImprovements?: string;
  managerTrainingRecommendations?: string;
  managerRecommendation?: string;

  // Committee review
  committeeReviewed: boolean;
  committeeReviewedAt?: string;
  committeeComments?: string;
  committeeRecommendation?: string;

  // Scoring
  totalScore?: number;
  maxPossibleScore?: number;
  percentageScore?: number;
  performanceLevel?: PerformanceLevel;

  // Approval
  approvedBy?: string;
  approvedAt?: string;
  approvalComments?: string;
  finalDecision?: string;

  // Communication
  communicatedToEmployee: boolean;
  communicatedAt?: string;
  employeeAcknowledged: boolean;
  employeeAcknowledgedAt?: string;
  employeeFeedback?: string;

  status: AppraisalStatus;
}

/**
 * Appraisal Rating
 */
export interface AppraisalRatingRecord extends BaseRecord {
  appraisalId: number;
  criteriaId: number;
  criteriaName?: string;
  selfRating?: number;
  selfComment?: string;
  managerRating?: number;
  managerComment?: string;
  finalRating?: number;
}

/**
 * Appraisal Committee Member
 */
export interface AppraisalCommitteeMemberRecord extends BaseRecord {
  appraisalId: number;
  memberId: number;
  memberName: string;
  memberRole: string;
  hasReviewed: boolean;
  reviewedAt?: string;
  comments?: string;
}

/**
 * Appraisal Goal
 */
export interface AppraisalGoalRecord extends BaseRecord {
  appraisalId: number;
  goalDescription: string;
  targetDate?: string;
  status: GoalStatus;
  achievementNotes?: string;
}

/**
 * Appraisal Training Need
 */
export interface AppraisalTrainingNeedRecord extends BaseRecord {
  appraisalId: number;
  trainingArea: string;
  priority: string;
  suggestedCourse?: string;
  notes?: string;
}

/**
 * Probation Record
 */
export interface ProbationRecord extends BaseRecord {
  employeeId: number;
  employeeName: string;
  department: string;
  position: string;
  startDate: string;
  originalEndDate: string;
  currentEndDate: string;
  extensionCount: number;
  status: ProbationStatus;
  initialAppraisalId?: number;
  finalAppraisalId?: number;
  notes?: string;
}

/**
 * Probation Extension
 */
export interface ProbationExtensionRecord extends BaseRecord {
  probationId: number;
  appraisalId: number;
  extensionNumber: number;
  previousEndDate: string;
  newEndDate: string;
  extensionReason: string;
  approvedBy: string;
  approvedAt: string;
}

/**
 * Probation KPI
 */
export interface ProbationKPIRecord extends BaseRecord {
  probationId: number;
  kpiDescription: string;
  targetValue?: string;
  weight?: number;
  evaluationNotes?: string;
  achieved: boolean;
}

/**
 * Performance Improvement Plan
 */
export interface PerformanceImprovementPlanRecord extends BaseRecord {
  pipNumber: string;
  employeeId: number;
  employeeName: string;
  department: string;
  position: string;
  appraisalId?: number;
  startDate: string;
  endDate: string;
  performanceIssues: string;
  improvementObjectives: string;
  supportProvided?: string;
  status: PIPStatus;
  outcome?: PIPOutcome;
  completedAt?: string;
  finalComments?: string;
}

/**
 * PIP Goal
 */
export interface PIPGoalRecord extends BaseRecord {
  pipId: number;
  goalDescription: string;
  measurementCriteria: string;
  targetDate: string;
  status: GoalStatus;
  achievementNotes?: string;
}

/**
 * PIP Check-in
 */
export interface PIPCheckInRecord extends BaseRecord {
  pipId: number;
  checkInDate: string;
  checkInNumber: number;
  progressSummary: string;
  goalsReviewed?: string;
  managerFeedback?: string;
  employeeComments?: string;
  nextSteps?: string;
  conductedBy: string;
}

/**
 * Appraisal Outcome
 */
export interface AppraisalOutcomeRecord extends BaseRecord {
  appraisalId: number;
  employeeId: number;
  outcomeType: string;
  effectiveDate?: string;
  details?: string;
  implementedBy?: string;
  implementedAt?: string;
}
