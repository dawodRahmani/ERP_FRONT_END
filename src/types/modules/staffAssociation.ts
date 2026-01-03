/**
 * Staff Association Module Types
 *
 * Type definitions for staff association entities:
 * - Staff Association Positions
 * - Staff Association Members
 * - Association Meetings
 * - Association Activities
 * - Staff Association Contributions
 * - Staff Welfare Requests
 * - Staff Welfare Payments
 */

import type { BaseRecord } from '../db/base';

// ========== STAFF ASSOCIATION POSITIONS ==========

export interface StaffAssociationPositionRecord extends BaseRecord {
  title: string;
  description?: string;
  responsibilities?: string;
  isExecutive: boolean;
  votingPower?: number;
  termLengthMonths?: number;
  maxTerms?: number;
  isActive: boolean;
  displayOrder?: number;
  [key: string]: unknown;
}

export const ASSOCIATION_POSITION = {
  PRESIDENT: 'president',
  VICE_PRESIDENT: 'vice_president',
  SECRETARY: 'secretary',
  TREASURER: 'treasurer',
  MEMBER: 'member',
} as const;

export type AssociationPosition =
  (typeof ASSOCIATION_POSITION)[keyof typeof ASSOCIATION_POSITION];

// ========== STAFF ASSOCIATION MEMBERS ==========

export interface StaffAssociationMemberRecord extends BaseRecord {
  employeeId: number;
  positionId: number;
  membershipNumber?: string;
  termStart: string;
  termEnd: string;
  electionDate?: string;
  electionVotes?: number;
  nominatedBy?: string;
  status: string;
  resignationDate?: string;
  resignationReason?: string;
  notes?: string;
  [key: string]: unknown;
}

export const MEMBER_STATUS = {
  ACTIVE: 'active',
  RESIGNED: 'resigned',
  TERM_ENDED: 'term_ended',
  REMOVED: 'removed',
  SUSPENDED: 'suspended',
} as const;

export type MemberStatus = (typeof MEMBER_STATUS)[keyof typeof MEMBER_STATUS];

// ========== ASSOCIATION MEETINGS ==========

export interface AssociationMeetingRecord extends BaseRecord {
  meetingNumber: string;
  meetingType: string;
  title?: string;
  agenda?: string;
  meetingDate: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  chairpersonId?: number;
  secretaryId?: number;
  attendeeCount?: number;
  quorumMet?: boolean;
  minutes?: string;
  decisions?: string;
  actionItems?: string;
  status: string;
  [key: string]: unknown;
}

export const MEETING_TYPE = {
  REGULAR: 'regular',
  AGM: 'agm',
  SPECIAL: 'special',
  EMERGENCY: 'emergency',
  ELECTION: 'election',
} as const;

export type MeetingType = (typeof MEETING_TYPE)[keyof typeof MEETING_TYPE];

export const MEETING_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  POSTPONED: 'postponed',
} as const;

export type MeetingStatus =
  (typeof MEETING_STATUS)[keyof typeof MEETING_STATUS];

// ========== ASSOCIATION ACTIVITIES ==========

export interface AssociationActivityRecord extends BaseRecord {
  title: string;
  activityType: string;
  description?: string;
  activityDate: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  organizedBy?: string;
  budget?: number;
  actualCost?: number;
  currency?: string;
  participantCount?: number;
  maxParticipants?: number;
  registrationDeadline?: string;
  status: string;
  feedback?: string;
  notes?: string;
  [key: string]: unknown;
}

export const ACTIVITY_TYPE = {
  SOCIAL_EVENT: 'social_event',
  TEAM_BUILDING: 'team_building',
  WELFARE: 'welfare',
  TRAINING: 'training',
  SPORTS: 'sports',
  CULTURAL: 'cultural',
  CHARITY: 'charity',
  OTHER: 'other',
} as const;

export type ActivityType = (typeof ACTIVITY_TYPE)[keyof typeof ACTIVITY_TYPE];

export const ACTIVITY_STATUS = {
  PLANNED: 'planned',
  APPROVED: 'approved',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type ActivityStatus =
  (typeof ACTIVITY_STATUS)[keyof typeof ACTIVITY_STATUS];

// ========== STAFF ASSOCIATION CONTRIBUTIONS ==========

export interface StaffAssociationContributionRecord extends BaseRecord {
  memberId: number;
  memberName?: string;
  period: string;
  amount: number;
  currency?: string;
  paymentDate?: string;
  paymentMethod?: string;
  receiptNumber?: string;
  deductedFromSalary?: boolean;
  payrollPeriodId?: number;
  status: string;
  notes?: string;
  [key: string]: unknown;
}

export const CONTRIBUTION_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  WAIVED: 'waived',
} as const;

export type ContributionStatus =
  (typeof CONTRIBUTION_STATUS)[keyof typeof CONTRIBUTION_STATUS];

// ========== STAFF WELFARE REQUESTS ==========

export interface StaffWelfareRequestRecord extends BaseRecord {
  requestNumber?: string;
  memberId: number;
  memberName?: string;
  requestType: string;
  description?: string;
  eventDate?: string;
  amountRequested: number;
  amountApproved?: number;
  currency?: string;
  supportingDocuments?: string[];
  requestDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  approvedBy?: string;
  approvalDate?: string;
  status: string;
  rejectionReason?: string;
  notes?: string;
  [key: string]: unknown;
}

export const WELFARE_REQUEST_TYPE = {
  MEDICAL: 'medical',
  DEATH: 'death',
  MARRIAGE: 'marriage',
  CHILDBIRTH: 'childbirth',
  DISASTER: 'disaster',
  EDUCATION: 'education',
  EMERGENCY: 'emergency',
  OTHER: 'other',
} as const;

export type WelfareRequestType =
  (typeof WELFARE_REQUEST_TYPE)[keyof typeof WELFARE_REQUEST_TYPE];

export const WELFARE_REQUEST_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAID: 'paid',
  CANCELLED: 'cancelled',
} as const;

export type WelfareRequestStatus =
  (typeof WELFARE_REQUEST_STATUS)[keyof typeof WELFARE_REQUEST_STATUS];

// ========== STAFF WELFARE PAYMENTS ==========

export interface StaffWelfarePaymentRecord extends BaseRecord {
  paymentNumber?: string;
  memberId: number;
  memberName?: string;
  requestId: number;
  requestReference?: string;
  amountPaid: number;
  currency?: string;
  paymentDate: string;
  paymentMethod: string;
  bankAccount?: string;
  transactionReference?: string;
  paidBy?: string;
  receivedBy?: string;
  status: string;
  notes?: string;
  [key: string]: unknown;
}

export const WELFARE_PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export type WelfarePaymentStatus =
  (typeof WELFARE_PAYMENT_STATUS)[keyof typeof WELFARE_PAYMENT_STATUS];

export const PAYMENT_METHOD = {
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
  CHEQUE: 'cheque',
  MOBILE_MONEY: 'mobile_money',
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];
