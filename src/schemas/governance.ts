/**
 * Governance Module Validation Schemas
 *
 * Zod validation schemas for Governance module forms
 */

import { z } from 'zod';
import {
  BOARD_MEMBER_STATUS,
  BOARD_MEMBER_ROLE,
  BOARD_MEETING_TYPE,
  CORRESPONDENCE_DIRECTION,
  CORRESPONDENCE_STATUS,
  CORRESPONDENCE_PRIORITY,
} from '../types/modules/governance';

// ============================================================================
// REUSABLE SCHEMAS
// ============================================================================

const fileMetadataSchema = z
  .object({
    name: z.string().min(1),
    type: z.string().min(1),
    size: z.number().min(0),
    uploadDate: z.string().min(1),
  })
  .optional()
  .nullable();

const requiredDateSchema = z
  .string()
  .min(1, 'Date is required')
  .refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  });

const optionalDateSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val) return true;
      return !isNaN(Date.parse(val));
    },
    {
      message: 'Invalid date format',
    }
  );

const optionalStringSchema = z.string().optional();

// ============================================================================
// BOARD MEMBER SCHEMA
// ============================================================================

export const boardMemberSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(200),
    position: z.string().min(1, 'Position is required').max(200),
    organization: z.string().min(1, 'Organization is required').max(200),
    status: z.enum(Object.values(BOARD_MEMBER_STATUS) as [string, ...string[]], {
      required_error: 'Status is required',
    }),
    roleInBoard: z.enum(Object.values(BOARD_MEMBER_ROLE) as [string, ...string[]], {
      required_error: 'Role is required',
    }),
    durationStart: requiredDateSchema,
    durationEnd: optionalDateSchema,
    documents: z
      .object({
        education: fileMetadataSchema,
        nid: fileMetadataSchema,
        picture: fileMetadataSchema,
        passport: fileMetadataSchema,
        cv: fileMetadataSchema,
        profile: fileMetadataSchema,
      })
      .optional()
      .default({}),
    mobileNo: z.string().max(20).optional(),
    whatsappNo: z.string().max(20).optional(),
    emailId: z.string().email('Invalid email format'),
    remarks: z.string().max(1000).optional(),
  })
  .refine(
    (data) => {
      if (!data.durationEnd) return true;
      return new Date(data.durationEnd) >= new Date(data.durationStart);
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['durationEnd'],
    }
  );

export type BoardMemberFormData = z.output<typeof boardMemberSchema>;

// ============================================================================
// BOARD MEETING SCHEMA
// ============================================================================

export const boardMeetingSchema = z.object({
  meetingDate: requiredDateSchema,
  year: z.number().min(2000).max(2100),
  participants: z.array(z.number()).min(1, 'At least one participant is required'),
  participantNames: z.array(z.string()).optional(),
  meetingType: z.enum(Object.values(BOARD_MEETING_TYPE) as [string, ...string[]], {
    required_error: 'Meeting type is required',
  }),
  documents: z
    .object({
      minute: fileMetadataSchema,
      pictures: z.array(fileMetadataSchema).optional(),
      agenda: fileMetadataSchema,
      workPlan: fileMetadataSchema,
      performanceEvaluation: fileMetadataSchema,
      attendanceSheet: fileMetadataSchema,
    })
    .optional()
    .default({}),
  location: z.string().max(200).optional(),
  agenda: z.string().max(2000).optional(),
  minutes: z.string().max(5000).optional(),
  decisions: z.string().max(2000).optional(),
  actionItems: z.string().max(2000).optional(),
  nextMeetingDate: optionalDateSchema,
  documentCompletionStatus: z
    .object({
      minute: z.boolean(),
      pictures: z.boolean(),
      agenda: z.boolean(),
      workPlan: z.boolean(),
      performanceEvaluation: z.boolean(),
      attendanceSheet: z.boolean(),
    })
    .optional(),
});

export type BoardMeetingFormData = z.output<typeof boardMeetingSchema>;

// ============================================================================
// CORRESPONDENCE SCHEMA
// ============================================================================

export const correspondenceSchema = z.object({
  direction: z.enum(Object.values(CORRESPONDENCE_DIRECTION) as [string, ...string[]], {
    required_error: 'Direction is required',
  }),
  date: requiredDateSchema,
  referenceNumber: z.string().max(100).optional(),
  subject: z.string().min(1, 'Subject is required').max(500),
  fromOrganization: z.string().max(200).optional(),
  toOrganization: z.string().max(200).optional(),
  fromPerson: z.string().max(200).optional(),
  toPerson: z.string().max(200).optional(),
  documents: z.array(fileMetadataSchema).min(1, 'At least one document is required'),
  status: z.enum(Object.values(CORRESPONDENCE_STATUS) as [string, ...string[]], {
    required_error: 'Status is required',
  }),
  priority: z
    .enum(Object.values(CORRESPONDENCE_PRIORITY) as [string, ...string[]])
    .optional(),
  description: z.string().max(2000).optional(),
  responseRequired: z.boolean().optional(),
  responseDeadline: optionalDateSchema,
  relatedBoardMeetingId: z.number().optional(),
});

export type CorrespondenceFormData = z.output<typeof correspondenceSchema>;
