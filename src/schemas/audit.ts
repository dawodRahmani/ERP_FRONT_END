/**
 * Audit Module Validation Schemas
 *
 * Zod schemas for form validation across all audit entities.
 */

import { z } from 'zod';
import {
  AUDIT_TYPE_CATEGORY,
  AUDIT_STATUS,
  AUDIT_FREQUENCY,
  AUDIT_MODALITY,
  AUDIT_SOURCE,
  QUARTER,
  CORRECTIVE_ACTION_STATUS,
  AUDIT_ENTITY_TYPE,
} from '../types/modules/audit';

// ========== HELPER SCHEMAS ==========

const fileUploadMetaSchema = z
  .object({
    fileName: z.string().min(1, 'File name is required'),
    fileSize: z.number().optional(),
    mimeType: z.string().optional(),
    uploadedAt: z.string().optional(),
    uploadedBy: z.string().optional(),
    fileUrl: z.string().optional(),
    fileId: z.string().optional(),
  })
  .optional()
  .nullable();

const dateStringSchema = z.string().refine(
  (val) => !val || !isNaN(Date.parse(val)),
  { message: 'Invalid date format' }
);

const requiredDateSchema = z.string().min(1, 'Date is required').refine(
  (val) => !isNaN(Date.parse(val)),
  { message: 'Invalid date format' }
);

// ========== AUDIT TYPE SCHEMA ==========

export const auditTypeSchema = z.object({
  code: z.string().min(1, 'Code is required').max(10, 'Code must be 10 characters or less'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  category: z.enum(
    Object.values(AUDIT_TYPE_CATEGORY) as [string, ...string[]],
    { required_error: 'Category is required' }
  ),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

export type AuditTypeFormData = z.output<typeof auditTypeSchema>;

// ========== HACT ASSESSMENT SCHEMA ==========

export const hactAssessmentSchema = z.object({
  donorId: z.number().min(1, 'Donor is required'),
  donorName: z.string().optional(),
  dateAssessmentStarted: requiredDateSchema,
  dateAssessmentEnded: dateStringSchema.optional(),
  validUntil: dateStringSchema.optional(),
  auditCompany: z.string().min(1, 'Audit company is required'),
  auditFocalPoint: z.string().optional(),
  purpose: z.string().max(1000, 'Purpose must be 1000 characters or less').optional(),
  reportUpload: fileUploadMetaSchema,
  status: z.enum(
    Object.values(AUDIT_STATUS) as [string, ...string[]],
    { required_error: 'Status is required' }
  ).default('draft'),
  notes: z.string().max(2000, 'Notes must be 2000 characters or less').optional(),
}).refine(
  (data) => {
    if (data.dateAssessmentEnded && data.dateAssessmentStarted) {
      return new Date(data.dateAssessmentEnded) >= new Date(data.dateAssessmentStarted);
    }
    return true;
  },
  { message: 'End date must be on or after start date', path: ['dateAssessmentEnded'] }
);

export type HACTAssessmentFormData = z.output<typeof hactAssessmentSchema>;

// ========== DONOR PROJECT AUDIT SCHEMA ==========

export const donorProjectAuditSchema = z.object({
  donorId: z.number().min(1, 'Donor is required'),
  donorName: z.string().optional(),
  projectId: z.number().min(1, 'Project is required'),
  projectName: z.string().optional(),
  periodAudit: z.string().min(1, 'Audit period is required'),
  amount: z.number().min(0, 'Amount must be positive').optional(),
  currency: z.string().optional(),
  dateAuditStarted: requiredDateSchema,
  dateAuditEnded: dateStringSchema.optional(),
  auditCompanyName: z.string().min(1, 'Audit company is required'),
  auditReport: fileUploadMetaSchema,
  correctiveActionPlan: fileUploadMetaSchema,
  correctiveActionTakenReport: fileUploadMetaSchema,
  status: z.enum(
    Object.values(AUDIT_STATUS) as [string, ...string[]],
    { required_error: 'Status is required' }
  ).default('draft'),
  notes: z.string().max(2000, 'Notes must be 2000 characters or less').optional(),
}).refine(
  (data) => {
    if (data.dateAuditEnded && data.dateAuditStarted) {
      return new Date(data.dateAuditEnded) >= new Date(data.dateAuditStarted);
    }
    return true;
  },
  { message: 'End date must be on or after start date', path: ['dateAuditEnded'] }
);

export type DonorProjectAuditFormData = z.output<typeof donorProjectAuditSchema>;

// ========== EXTERNAL AUDIT SCHEMA ==========

export const externalAuditSchema = z.object({
  auditTypeId: z.number().min(1, 'Audit type is required'),
  auditTypeName: z.string().optional(),
  specification: z.string().max(500, 'Specification must be 500 characters or less').optional(),
  frequency: z.enum(
    Object.values(AUDIT_FREQUENCY) as [string, ...string[]],
    { required_error: 'Frequency is required' }
  ),
  dateAuditPlanned: requiredDateSchema,
  actualDateAuditStarted: dateStringSchema.optional(),
  dateAuditEnded: dateStringSchema.optional(),
  auditCompanyName: z.string().min(1, 'Audit company is required'),
  auditFocalPointName: z.string().optional(),
  auditReport: fileUploadMetaSchema,
  followUpNeeded: z.boolean().default(false),
  correctiveActionPlan: fileUploadMetaSchema,
  correctiveActionTakenReport: fileUploadMetaSchema,
  status: z.enum(
    Object.values(AUDIT_STATUS) as [string, ...string[]],
    { required_error: 'Status is required' }
  ).default('draft'),
  notes: z.string().max(2000, 'Notes must be 2000 characters or less').optional(),
}).refine(
  (data) => {
    if (data.dateAuditEnded && data.actualDateAuditStarted) {
      return new Date(data.dateAuditEnded) >= new Date(data.actualDateAuditStarted);
    }
    return true;
  },
  { message: 'End date must be on or after start date', path: ['dateAuditEnded'] }
);

export type ExternalAuditFormData = z.output<typeof externalAuditSchema>;

// ========== EXTERNAL ANNUAL AUDIT SCHEMA ==========

export const externalAnnualAuditSchema = z.object({
  externalAuditId: z.number().min(1, 'External audit reference is required'),
  year: z.number().min(2000).max(2100, 'Year must be between 2000 and 2100'),
  auditReport: fileUploadMetaSchema,
  managementLetter: fileUploadMetaSchema,
  notes: z.string().max(1000, 'Notes must be 1000 characters or less').optional(),
});

export type ExternalAnnualAuditFormData = z.output<typeof externalAnnualAuditSchema>;

// ========== INTERNAL AUDIT SCHEMA ==========

export const internalAuditSchema = z.object({
  auditTypeId: z.number().min(1, 'Audit type is required'),
  auditTypeName: z.string().optional(),
  donorId: z.number().optional(),
  donorName: z.string().optional(),
  projectId: z.number().optional(),
  projectName: z.string().optional(),
  departmentsAudited: z.array(z.string()).min(1, 'At least one department is required'),
  specification: z.string().max(500, 'Specification must be 500 characters or less').optional(),
  frequency: z.enum(
    Object.values(AUDIT_FREQUENCY) as [string, ...string[]],
    { required_error: 'Frequency is required' }
  ),
  dateAuditPlanned: requiredDateSchema,
  actualDateAuditStarted: dateStringSchema.optional(),
  dateAuditEnded: dateStringSchema.optional(),
  auditEmployeeId: z.number().optional(),
  auditEmployeeName: z.string().optional(),
  auditReport: fileUploadMetaSchema,
  followUpNeeded: z.boolean().default(false),
  correctiveActionPlan: fileUploadMetaSchema,
  correctiveActionTakenReport: fileUploadMetaSchema,
  status: z.enum(
    Object.values(AUDIT_STATUS) as [string, ...string[]],
    { required_error: 'Status is required' }
  ).default('draft'),
  notes: z.string().max(2000, 'Notes must be 2000 characters or less').optional(),
}).refine(
  (data) => {
    if (data.dateAuditEnded && data.actualDateAuditStarted) {
      return new Date(data.dateAuditEnded) >= new Date(data.actualDateAuditStarted);
    }
    return true;
  },
  { message: 'End date must be on or after start date', path: ['dateAuditEnded'] }
);

export type InternalAuditFormData = z.output<typeof internalAuditSchema>;

// ========== INTERNAL QUARTERLY REPORT SCHEMA ==========

export const internalQuarterlyReportSchema = z.object({
  internalAuditId: z.number().min(1, 'Internal audit reference is required'),
  year: z.number().min(2000).max(2100, 'Year must be between 2000 and 2100'),
  quarter: z.enum(
    Object.values(QUARTER) as [string, ...string[]],
    { required_error: 'Quarter is required' }
  ),
  auditReport: fileUploadMetaSchema,
  correctiveActionPlan: fileUploadMetaSchema,
  actionTakenReport: fileUploadMetaSchema,
  notes: z.string().max(1000, 'Notes must be 1000 characters or less').optional(),
});

export type InternalQuarterlyReportFormData = z.output<typeof internalQuarterlyReportSchema>;

// ========== PARTNER AUDIT SCHEMA ==========

export const partnerAuditSchema = z.object({
  auditTypeId: z.number().min(1, 'Audit type is required'),
  auditTypeName: z.string().optional(),
  donorId: z.number().optional(),
  donorName: z.string().optional(),
  projectId: z.number().optional(),
  projectName: z.string().optional(),
  partnerName: z.string().min(1, 'Partner name is required'),
  partnerLocation: z.string().optional(),
  auditModality: z.enum(
    Object.values(AUDIT_MODALITY) as [string, ...string[]],
    { required_error: 'Audit modality is required' }
  ),
  period: z.string().min(1, 'Audit period is required'),
  auditSource: z.enum(
    Object.values(AUDIT_SOURCE) as [string, ...string[]],
    { required_error: 'Audit source is required' }
  ),
  specification: z.string().max(500, 'Specification must be 500 characters or less').optional(),
  frequency: z.enum(
    Object.values(AUDIT_FREQUENCY) as [string, ...string[]],
    { required_error: 'Frequency is required' }
  ),
  dateAuditPlanned: requiredDateSchema,
  actualDateAuditStarted: dateStringSchema.optional(),
  dateAuditEnded: dateStringSchema.optional(),
  auditCompanyName: z.string().optional(),
  auditFocalPointName: z.string().optional(),
  auditReport: fileUploadMetaSchema,
  followUpNeeded: z.boolean().default(false),
  correctiveActionPlan: fileUploadMetaSchema,
  correctiveActionTakenReport: fileUploadMetaSchema,
  status: z.enum(
    Object.values(AUDIT_STATUS) as [string, ...string[]],
    { required_error: 'Status is required' }
  ).default('draft'),
  notes: z.string().max(2000, 'Notes must be 2000 characters or less').optional(),
}).refine(
  (data) => {
    if (data.dateAuditEnded && data.actualDateAuditStarted) {
      return new Date(data.dateAuditEnded) >= new Date(data.actualDateAuditStarted);
    }
    return true;
  },
  { message: 'End date must be on or after start date', path: ['dateAuditEnded'] }
);

export type PartnerAuditFormData = z.output<typeof partnerAuditSchema>;

// ========== CORRECTIVE ACTION SCHEMA ==========

export const correctiveActionSchema = z.object({
  auditEntityType: z.enum(
    Object.values(AUDIT_ENTITY_TYPE) as [string, ...string[]],
    { required_error: 'Audit type is required' }
  ),
  auditId: z.number().min(1, 'Audit reference is required'),
  auditNumber: z.string().optional(),
  description: z.string().min(1, 'Description is required').max(2000, 'Description must be 2000 characters or less'),
  responsiblePerson: z.string().optional(),
  dueDate: dateStringSchema.optional(),
  completedDate: dateStringSchema.optional(),
  status: z.enum(
    Object.values(CORRECTIVE_ACTION_STATUS) as [string, ...string[]],
    { required_error: 'Status is required' }
  ).default('pending'),
  notes: z.string().max(2000, 'Notes must be 2000 characters or less').optional(),
}).refine(
  (data) => {
    if (data.completedDate && data.status !== 'completed') {
      return false;
    }
    return true;
  },
  { message: 'Status must be "Completed" when completion date is set', path: ['status'] }
);

export type CorrectiveActionFormData = z.output<typeof correctiveActionSchema>;
