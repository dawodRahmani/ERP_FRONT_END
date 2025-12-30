/**
 * Recruitment Module Types
 *
 * Type definitions for the 15-step recruitment workflow system.
 * Covers: TOR, SRF, Vacancy, Applications, Committee, Testing, Interviews, Offers, Contracts
 * 26 services, 30+ stores
 */

import type { BaseRecord } from '../db/base';

// ========== ENUMS AND CONSTANTS ==========

export const RECRUITMENT_STATUS = {
  DRAFT: 'draft',
  TOR_PENDING: 'tor_pending',
  REQUISITION_PENDING: 'requisition_pending',
  ANNOUNCED: 'announced',
  APPLICATIONS_OPEN: 'applications_open',
  COMMITTEE_FORMED: 'committee_formed',
  LONGLISTING: 'longlisting',
  SHORTLISTING: 'shortlisting',
  TESTING: 'testing',
  INTERVIEWING: 'interviewing',
  REPORT_PENDING: 'report_pending',
  OFFER_SENT: 'offer_sent',
  BACKGROUND_CHECK: 'background_check',
  CONTRACT_PENDING: 'contract_pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const RECRUITMENT_STATUS_LABELS: Record<RecruitmentStatus, string> = {
  draft: 'Draft',
  tor_pending: 'TOR Pending Approval',
  requisition_pending: 'Requisition Pending',
  announced: 'Announced',
  applications_open: 'Applications Open',
  committee_formed: 'Committee Formed',
  longlisting: 'Longlisting',
  shortlisting: 'Shortlisting',
  testing: 'Written Test',
  interviewing: 'Interviewing',
  report_pending: 'Report Pending',
  offer_sent: 'Offer Sent',
  background_check: 'Background Check',
  contract_pending: 'Contract Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const APPLICATION_STATUS = {
  RECEIVED: 'received',
  LONGLISTED: 'longlisted',
  SHORTLISTED: 'shortlisted',
  TESTED: 'tested',
  INTERVIEWED: 'interviewed',
  SELECTED: 'selected',
  OFFERED: 'offered',
  HIRED: 'hired',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
} as const;

export const TOR_STATUS = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const SRF_STATUS = {
  DRAFT: 'draft',
  HR_REVIEW: 'hr_review',
  FINANCE_REVIEW: 'finance_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const HIRING_APPROACH = {
  OPEN_COMPETITION: 'open_competition',
  INTERNAL_PROMOTION: 'internal_promotion',
  HEADHUNTING: 'headhunting',
  INTERNAL_TRANSFER: 'internal_transfer',
  SOLE_SOURCE: 'sole_source',
  EMPLOYEE_REFERRAL: 'employee_referral',
} as const;

export const CONTRACT_TYPE = {
  CORE: 'core',
  PROJECT: 'project',
  CONSULTANT: 'consultant',
  PART_TIME: 'part_time',
  INTERNSHIP: 'internship',
  VOLUNTEER: 'volunteer',
  DAILY_WAGE: 'daily_wage',
} as const;

export const EDUCATION_LEVEL = {
  HIGH_SCHOOL: 'high_school',
  DIPLOMA: 'diploma',
  BACHELORS: 'bachelors',
  MASTERS: 'masters',
  PHD: 'phd',
} as const;

export const ANNOUNCEMENT_METHOD = {
  ACBAR: 'acbar',
  LOCAL: 'local',
  WEBSITE: 'website',
  REFERRAL: 'referral',
  SOCIAL_MEDIA: 'social_media',
} as const;

export const COMMITTEE_ROLE = {
  HR_REPRESENTATIVE: 'hr_representative',
  TECHNICAL_EXPERT: 'technical_expert',
  DEPARTMENT_REP: 'department_rep',
  ADDITIONAL: 'additional',
} as const;

export const COI_DECISION = {
  NO_CONFLICT: 'no_conflict',
  CONFLICT_RECUSAL: 'conflict_recusal',
  ACTION_TAKEN: 'action_taken',
} as const;

export const RECOMMENDATION = {
  STRONGLY_RECOMMEND: 'strongly_recommend',
  RECOMMEND: 'recommend',
  NEUTRAL: 'neutral',
  NOT_RECOMMEND: 'not_recommend',
  STRONGLY_NOT_RECOMMEND: 'strongly_not_recommend',
} as const;

export const VACANCY_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CLOSED: 'closed',
} as const;

export const LONGLISTING_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
} as const;

export const SHORTLISTING_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
} as const;

export const WRITTEN_TEST_STATUS = {
  SCHEDULED: 'scheduled',
  CONDUCTED: 'conducted',
  EVALUATED: 'evaluated',
} as const;

export const INTERVIEW_STATUS = {
  SCHEDULED: 'scheduled',
  CONDUCTED: 'conducted',
  EVALUATED: 'evaluated',
} as const;

export const REPORT_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const OFFER_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  EXPIRED: 'expired',
} as const;

export const SANCTION_STATUS = {
  PENDING: 'pending',
  CLEARED: 'cleared',
  FLAGGED: 'flagged',
} as const;

export const BACKGROUND_CHECK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const EMPLOYMENT_CONTRACT_STATUS = {
  DRAFT: 'draft',
  PENDING_SIGNATURE: 'pending_signature',
  SIGNED: 'signed',
  ACTIVE: 'active',
  TERMINATED: 'terminated',
} as const;

export const CHECKLIST_STATUS = {
  INCOMPLETE: 'incomplete',
  COMPLETE: 'complete',
} as const;

// Default weights for scoring
export const DEFAULT_WEIGHTS = {
  ACADEMIC: 0.20,
  EXPERIENCE: 0.30,
  OTHER: 0.50,
  WRITTEN_TEST: 0.50,
  INTERVIEW: 0.50,
} as const;

// Recruitment steps definition
export const RECRUITMENT_STEPS = [
  { step: 1, name: 'TOR Development', status: RECRUITMENT_STATUS.DRAFT },
  { step: 2, name: 'Staff Requisition', status: RECRUITMENT_STATUS.REQUISITION_PENDING },
  { step: 3, name: 'Requisition Review', status: RECRUITMENT_STATUS.REQUISITION_PENDING },
  { step: 4, name: 'Vacancy Announcement', status: RECRUITMENT_STATUS.ANNOUNCED },
  { step: 5, name: 'Application Receipt', status: RECRUITMENT_STATUS.APPLICATIONS_OPEN },
  { step: 6, name: 'Committee Formation', status: RECRUITMENT_STATUS.COMMITTEE_FORMED },
  { step: 7, name: 'Longlisting', status: RECRUITMENT_STATUS.LONGLISTING },
  { step: 8, name: 'Shortlisting', status: RECRUITMENT_STATUS.SHORTLISTING },
  { step: 9, name: 'Written Test', status: RECRUITMENT_STATUS.TESTING },
  { step: 10, name: 'Interview', status: RECRUITMENT_STATUS.INTERVIEWING },
  { step: 11, name: 'Recruitment Report', status: RECRUITMENT_STATUS.REPORT_PENDING },
  { step: 12, name: 'Conditional Offer', status: RECRUITMENT_STATUS.OFFER_SENT },
  { step: 13, name: 'Sanction Clearance', status: RECRUITMENT_STATUS.BACKGROUND_CHECK },
  { step: 14, name: 'Background Checks', status: RECRUITMENT_STATUS.BACKGROUND_CHECK },
  { step: 15, name: 'Employment Contract', status: RECRUITMENT_STATUS.CONTRACT_PENDING },
] as const;

// Type exports
export type RecruitmentStatus = typeof RECRUITMENT_STATUS[keyof typeof RECRUITMENT_STATUS];
export type ApplicationStatus = typeof APPLICATION_STATUS[keyof typeof APPLICATION_STATUS];
export type TORStatus = typeof TOR_STATUS[keyof typeof TOR_STATUS];
export type SRFStatus = typeof SRF_STATUS[keyof typeof SRF_STATUS];
export type HiringApproach = typeof HIRING_APPROACH[keyof typeof HIRING_APPROACH];
export type ContractType = typeof CONTRACT_TYPE[keyof typeof CONTRACT_TYPE];
export type EducationLevel = typeof EDUCATION_LEVEL[keyof typeof EDUCATION_LEVEL];
export type AnnouncementMethod = typeof ANNOUNCEMENT_METHOD[keyof typeof ANNOUNCEMENT_METHOD];
export type CommitteeRole = typeof COMMITTEE_ROLE[keyof typeof COMMITTEE_ROLE];
export type COIDecision = typeof COI_DECISION[keyof typeof COI_DECISION];
export type Recommendation = typeof RECOMMENDATION[keyof typeof RECOMMENDATION];
export type VacancyStatus = typeof VACANCY_STATUS[keyof typeof VACANCY_STATUS];
export type LonglistingStatus = typeof LONGLISTING_STATUS[keyof typeof LONGLISTING_STATUS];
export type ShortlistingStatus = typeof SHORTLISTING_STATUS[keyof typeof SHORTLISTING_STATUS];
export type WrittenTestStatus = typeof WRITTEN_TEST_STATUS[keyof typeof WRITTEN_TEST_STATUS];
export type InterviewStatusType = typeof INTERVIEW_STATUS[keyof typeof INTERVIEW_STATUS];
export type ReportStatus = typeof REPORT_STATUS[keyof typeof REPORT_STATUS];
export type OfferStatus = typeof OFFER_STATUS[keyof typeof OFFER_STATUS];
export type SanctionStatus = typeof SANCTION_STATUS[keyof typeof SANCTION_STATUS];
export type BackgroundCheckStatus = typeof BACKGROUND_CHECK_STATUS[keyof typeof BACKGROUND_CHECK_STATUS];
export type EmploymentContractStatus = typeof EMPLOYMENT_CONTRACT_STATUS[keyof typeof EMPLOYMENT_CONTRACT_STATUS];
export type ChecklistStatus = typeof CHECKLIST_STATUS[keyof typeof CHECKLIST_STATUS];

// ========== RECORD INTERFACES ==========

/**
 * Recruitment Record (Main table)
 */
export interface RecruitmentRecord extends BaseRecord {
  recruitmentCode: string;
  positionTitle: string;
  department?: string;
  project?: string;
  office?: string;
  numberOfPositions?: number;
  hiringApproach?: HiringApproach;
  contractType?: ContractType;
  grade?: string;
  status: RecruitmentStatus;
  currentStep: number;
  startDate?: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  createdBy?: string;
  notes?: string;
}

/**
 * Terms of Reference (TOR)
 */
export interface TORRecord extends BaseRecord {
  recruitmentId: number;
  positionTitle: string;
  department?: string;
  reportsTo?: string;
  location?: string;
  purpose?: string;
  responsibilities?: string;
  qualifications?: string;
  requiredEducation?: EducationLevel;
  requiredExperience?: number;
  skills?: string;
  languages?: string;
  status: TORStatus;
  preparedBy?: string;
  preparedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

/**
 * Staff Requisition Form (SRF)
 */
export interface SRFRecord extends BaseRecord {
  recruitmentId: number;
  positionTitle: string;
  department?: string;
  project?: string;
  numberOfPositions: number;
  justification?: string;
  budgetCode?: string;
  budgetAmount?: number;
  currency?: string;
  status: SRFStatus;
  requestedBy?: string;
  requestedAt?: string;
  hrVerified: boolean;
  hrVerifiedBy?: string;
  hrVerifiedAt?: string;
  budgetVerified: boolean;
  budgetVerifiedBy?: string;
  budgetVerifiedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
}

/**
 * Vacancy Announcement
 */
export interface VacancyAnnouncementRecord extends BaseRecord {
  recruitmentId: number;
  title: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  announcementMethod?: AnnouncementMethod;
  announcementDate?: string;
  closingDate?: string;
  status: VacancyStatus;
  viewsCount: number;
  publishedAt?: string;
  closedAt?: string;
}

/**
 * Recruitment Candidate
 */
export interface CandidateRecord extends BaseRecord {
  candidateCode: string;
  fullName: string;
  fatherName?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  gender?: string;
  dateOfBirth?: string;
  nationalId?: string;
  province?: string;
  district?: string;
  address?: string;
  currentAddress?: string;
  nationality?: string;
  maritalStatus?: string;
  photoUrl?: string;
  cvUrl?: string;
  notes?: string;
}

/**
 * Candidate Application
 */
export interface CandidateApplicationRecord extends BaseRecord {
  applicationCode: string;
  recruitmentId: number;
  candidateId: number;
  applicationDate: string;
  status: ApplicationStatus;
  gender?: string;
  source?: string;
  coverLetter?: string;
  expectedSalary?: number;
  currency?: string;
  availableFrom?: string;
  rejectionReason?: string;
  notes?: string;
}

/**
 * Candidate Education
 */
export interface CandidateEducationRecord extends BaseRecord {
  candidateId: number;
  level: EducationLevel;
  degree?: string;
  fieldOfStudy?: string;
  institution?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  isOngoing?: boolean;
  grade?: string;
  certificateUrl?: string;
}

/**
 * Candidate Experience
 */
export interface CandidateExperienceRecord extends BaseRecord {
  candidateId: number;
  jobTitle: string;
  organization?: string;
  department?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  responsibilities?: string;
  achievements?: string;
  reasonForLeaving?: string;
  referenceContact?: string;
}

/**
 * Recruitment Committee
 */
export interface RecruitmentCommitteeRecord extends BaseRecord {
  recruitmentId: number;
  name?: string;
  formedDate?: string;
  status: string;
  notes?: string;
}

/**
 * Committee Member
 */
export interface CommitteeMemberRecord extends BaseRecord {
  committeeId: number;
  employeeId?: number;
  memberName: string;
  role: CommitteeRole;
  department?: string;
  email?: string;
  phone?: string;
  isChair?: boolean;
}

/**
 * COI Declaration
 */
export interface COIDeclarationRecord extends BaseRecord {
  committeeMemberId: number;
  recruitmentId: number;
  declarationDate: string;
  hasConflict: boolean;
  conflictDescription?: string;
  relatedCandidateIds?: string;
  hrReviewedBy?: string;
  hrDecision?: COIDecision;
  hrComments?: string;
  hrReviewedAt?: string;
}

/**
 * Longlisting
 */
export interface LonglistingRecord extends BaseRecord {
  recruitmentId: number;
  conductedDate: string;
  conductedBy?: string;
  status: LonglistingStatus;
  totalApplications: number;
  totalLonglisted: number;
  criteria?: string;
  notes?: string;
}

/**
 * Longlisting Candidate
 */
export interface LonglistingCandidateRecord extends BaseRecord {
  longlistingId: number;
  candidateApplicationId: number;
  isLonglisted: boolean;
  reason?: string;
  notes?: string;
}

/**
 * Shortlisting
 */
export interface ShortlistingRecord extends BaseRecord {
  recruitmentId: number;
  conductedDate: string;
  conductedBy?: string;
  status: ShortlistingStatus;
  academicWeight: number;
  experienceWeight: number;
  otherWeight: number;
  passingScore: number;
  notes?: string;
}

/**
 * Shortlisting Candidate
 */
export interface ShortlistingCandidateRecord extends BaseRecord {
  shortlistingId: number;
  candidateApplicationId: number;
  academicScore: number;
  experienceScore: number;
  otherCriteriaScore: number;
  totalScore: number;
  isShortlisted: boolean;
  notes?: string;
}

/**
 * Written Test
 */
export interface WrittenTestRecord extends BaseRecord {
  recruitmentId: number;
  testDate: string;
  testTime?: string;
  venue?: string;
  duration?: number;
  totalMarks: number;
  passingMarks: number;
  testWeight: number;
  status: WrittenTestStatus;
  instructions?: string;
  notes?: string;
}

/**
 * Written Test Candidate
 */
export interface WrittenTestCandidateRecord extends BaseRecord {
  writtenTestId: number;
  candidateApplicationId: number;
  uniqueCode: string;
  attended: boolean;
  attendanceTime?: string;
  marksObtained?: number;
  isPassed?: boolean;
  notes?: string;
}

/**
 * Recruitment Interview
 */
export interface RecruitmentInterviewRecord extends BaseRecord {
  recruitmentId: number;
  interviewDate: string;
  interviewTime?: string;
  venue?: string;
  totalMarks: number;
  passingMarks: number;
  interviewWeight: number;
  status: InterviewStatusType;
  notes?: string;
}

/**
 * Interview Candidate
 */
export interface InterviewCandidateRecord extends BaseRecord {
  interviewId: number;
  candidateApplicationId: number;
  scheduledTime?: string;
  attended: boolean;
  attendanceTime?: string;
  notes?: string;
}

/**
 * Interview Evaluation
 */
export interface InterviewEvaluationRecord extends BaseRecord {
  interviewCandidateId: number;
  evaluatorId?: number;
  evaluatorName?: string;
  technicalKnowledgeScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  experienceRelevanceScore: number;
  culturalFitScore: number;
  totalScore: number;
  strengths?: string;
  weaknesses?: string;
  recommendation?: Recommendation;
  comments?: string;
  evaluatedAt: string;
}

/**
 * Interview Result
 */
export interface InterviewResultRecord extends BaseRecord {
  interviewCandidateId: number;
  averageScore: number;
  writtenTestScore?: number;
  combinedScore: number;
  finalRank?: number;
  isSelected?: boolean;
}

/**
 * Recruitment Report
 */
export interface RecruitmentReportRecord extends BaseRecord {
  recruitmentId: number;
  reportNumber: string;
  title?: string;
  summary?: string;
  methodology?: string;
  findings?: string;
  recommendations?: string;
  selectedCandidates?: string;
  status: ReportStatus;
  preparedBy?: string;
  preparedAt?: string;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
}

/**
 * Offer Letter
 */
export interface OfferLetterRecord extends BaseRecord {
  recruitmentId: number;
  candidateApplicationId: number;
  offerDate: string;
  position?: string;
  department?: string;
  salary?: number;
  currency?: string;
  benefits?: string;
  startDate?: string;
  expiryDate?: string;
  conditions?: string;
  status: OfferStatus;
  sentAt?: string;
  respondedAt?: string;
  declineReason?: string;
}

/**
 * Sanction Clearance
 */
export interface SanctionClearanceRecord extends BaseRecord {
  recruitmentId: number;
  candidateApplicationId: number;
  declarationDate: string;
  candidateName?: string;
  fatherName?: string;
  dateOfBirth?: string;
  nationalId?: string;
  status: SanctionStatus;
  checkedDate?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

/**
 * Background Check
 */
export interface BackgroundCheckRecord extends BaseRecord {
  recruitmentId: number;
  candidateApplicationId: number;
  referenceCheck1Status?: string;
  referenceCheck1Notes?: string;
  referenceCheck2Status?: string;
  referenceCheck2Notes?: string;
  guaranteeLetterStatus?: string;
  guaranteeLetterNotes?: string;
  addressVerificationStatus?: string;
  addressVerificationNotes?: string;
  criminalRecordStatus?: string;
  criminalRecordNotes?: string;
  overallStatus: BackgroundCheckStatus;
  verifiedBy?: string;
  completedAt?: string;
  notes?: string;
}

/**
 * Employment Contract
 */
export interface EmploymentContractRecord extends BaseRecord {
  recruitmentId: number;
  candidateApplicationId: number;
  contractNumber: string;
  position?: string;
  department?: string;
  grade?: string;
  salary?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  contractType?: ContractType;
  probationPeriodMonths: number;
  status: EmploymentContractStatus;
  employeeSignedAt?: string;
  employeeSignaturePath?: string;
  employerSignedAt?: string;
  employerSignatoryId?: number;
  employerSignaturePath?: string;
  notes?: string;
}

/**
 * File Checklist
 */
export interface FileChecklistRecord extends BaseRecord {
  recruitmentId: number;
  torAttached: boolean;
  srfAttached: boolean;
  shortlistFormAttached: boolean;
  rcFormAttached: boolean;
  writtenTestPapersAttached: boolean;
  interviewFormsAttached: boolean;
  interviewResultAttached: boolean;
  recruitmentReportAttached: boolean;
  offerLetterAttached: boolean;
  sanctionClearanceAttached: boolean;
  referenceChecksAttached: boolean;
  guaranteeLetterAttached: boolean;
  addressVerificationAttached: boolean;
  criminalCheckAttached: boolean;
  contractAttached: boolean;
  personalInfoFormAttached: boolean;
  status: ChecklistStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

/**
 * Province (Lookup data)
 */
export interface ProvinceRecord extends BaseRecord {
  name: string;
  nameDari?: string;
  namePashto?: string;
}
