/**
 * Governance Module Type Definitions
 *
 * Type definitions for the VDO ERP Governance module including:
 * - Board Members (board member tracking)
 * - Board Meetings (meeting management)
 * - Correspondence (incoming/outgoing correspondence)
 */

import type { BaseRecord } from '../db/base';
import type { FileMetadata as ProgramFileMetadata } from './program';

// Re-export FileMetadata for use by governance components
export type FileMetadata = ProgramFileMetadata;

// ============================================================================
// BOARD MEMBERS
// ============================================================================

export const BOARD_MEMBER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  RESIGNED: 'resigned',
  RETIRED: 'retired',
} as const;

export type BoardMemberStatus =
  (typeof BOARD_MEMBER_STATUS)[keyof typeof BOARD_MEMBER_STATUS];

export const BOARD_MEMBER_ROLE = {
  HEAD: 'head',
  MEMBER: 'member',
  SECRETARY: 'secretary',
  TREASURER: 'treasurer',
} as const;

export type BoardMemberRole =
  (typeof BOARD_MEMBER_ROLE)[keyof typeof BOARD_MEMBER_ROLE];

/**
 * Board member documents
 */
export interface BoardMemberDocuments {
  education?: FileMetadata;
  nid?: FileMetadata;
  picture?: FileMetadata;
  passport?: FileMetadata;
  cv?: FileMetadata;
  profile?: FileMetadata;
}

/**
 * Governance Board Member Record
 */
export interface GovernanceBoardMemberRecord extends BaseRecord {
  serialNumber?: number;
  name: string;
  position: string;
  organization: string;
  status: BoardMemberStatus;
  roleInBoard: BoardMemberRole;
  durationStart: string; // ISO date string
  durationEnd?: string; // ISO date string (optional for ongoing)
  documents: BoardMemberDocuments;
  mobileNo?: string;
  whatsappNo?: string;
  emailId: string; // Auto-generated or custom (vdo.board1@vdongo.org)
  remarks?: string;
}

// ============================================================================
// BOARD MEETINGS
// ============================================================================

export const BOARD_MEETING_TYPE = {
  GENERAL_ASSEMBLY: 'general_assembly',
  REGULAR: 'regular_board_meeting',
  AD_HOC: 'ad_hoc_meeting',
  EMERGENCY: 'emergency_meeting',
  ANNUAL: 'annual_meeting',
} as const;

export type BoardMeetingType =
  (typeof BOARD_MEETING_TYPE)[keyof typeof BOARD_MEETING_TYPE];

/**
 * Board meeting documents
 */
export interface BoardMeetingDocuments {
  minute?: FileMetadata;
  pictures?: FileMetadata[]; // Multiple pictures
  agenda?: FileMetadata;
  workPlan?: FileMetadata;
  performanceEvaluation?: FileMetadata;
  attendanceSheet?: FileMetadata;
}

/**
 * Document completion status
 */
export interface DocumentCompletionStatus {
  minute: boolean;
  pictures: boolean;
  agenda: boolean;
  workPlan: boolean;
  performanceEvaluation: boolean;
  attendanceSheet: boolean;
}

/**
 * Governance Board Meeting Record
 */
export interface GovernanceBoardMeetingRecord extends BaseRecord {
  serialNumber?: number;
  meetingDate: string; // ISO date string
  year: number; // Extracted from meetingDate
  participants: number[]; // Array of BoardMember IDs
  participantNames?: string[]; // Denormalized for display
  meetingType: BoardMeetingType;
  documents: BoardMeetingDocuments;
  location?: string;
  agenda?: string; // Meeting agenda text
  minutes?: string; // Meeting minutes text
  decisions?: string; // Key decisions made
  actionItems?: string; // Action items from meeting
  nextMeetingDate?: string;
  documentCompletionStatus?: DocumentCompletionStatus;
}

// ============================================================================
// CORRESPONDENCE
// ============================================================================

export const CORRESPONDENCE_DIRECTION = {
  IN: 'in',
  OUT: 'out',
} as const;

export type CorrespondenceDirection =
  (typeof CORRESPONDENCE_DIRECTION)[keyof typeof CORRESPONDENCE_DIRECTION];

export const CORRESPONDENCE_STATUS = {
  PENDING: 'pending',
  PROCESSED: 'processed',
  ARCHIVED: 'archived',
} as const;

export type CorrespondenceStatus =
  (typeof CORRESPONDENCE_STATUS)[keyof typeof CORRESPONDENCE_STATUS];

export const CORRESPONDENCE_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export type CorrespondencePriority =
  (typeof CORRESPONDENCE_PRIORITY)[keyof typeof CORRESPONDENCE_PRIORITY];

/**
 * Governance Correspondence Record
 */
export interface GovernanceCorrespondenceRecord extends BaseRecord {
  serialNumber?: number;
  direction: CorrespondenceDirection; // 'in' or 'out'
  date: string; // ISO date string
  referenceNumber?: string;
  subject: string;
  fromOrganization?: string; // For incoming
  toOrganization?: string; // For outgoing
  fromPerson?: string;
  toPerson?: string;
  documents: FileMetadata[]; // Multiple document uploads
  status: CorrespondenceStatus;
  priority?: CorrespondencePriority;
  description?: string;
  responseRequired?: boolean;
  responseDeadline?: string;
  relatedBoardMeetingId?: number; // Link to board meeting if applicable
}
