/**
 * Program Module Validation Schemas
 *
 * Zod schemas for form validation across all program entities.
 */

import { z } from 'zod';
import {
  DONOR_TYPE,
  DONOR_STATUS,
  PROJECT_STATUS,
  THEMATIC_AREA,
  WORK_PLAN_TIMELINE_STATUS,
  CERTIFICATE_AGENCY,
  CERTIFICATE_DOCUMENT_TYPE,
  PROJECT_DOCUMENT_TYPE,
  REPORT_TYPE,
  REPORTING_FORMAT,
  REPORT_STATUS,
  REPORT_UPLOADED_BY,
  BENEFICIARY_TYPE,
  BENEFICIARY_STATUS,
  HEAD_OF_HH_GENDER,
  SAFEGUARDING_ACTIVITY_TYPE,
  SAFEGUARDING_FREQUENCY,
  SAFEGUARDING_STATUS,
} from '../types/modules/program';

// ============================================================================
// HELPER SCHEMAS
// ============================================================================

const fileMetadataSchema = z
  .object({
    name: z.string().min(1, 'File name is required'),
    type: z.string().min(1, 'File type is required'),
    size: z.number().min(0, 'File size must be positive'),
    uploadDate: z.string().min(1, 'Upload date is required'),
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

const optionalStringSchema = z.string().optional().nullable();

// ============================================================================
// DONOR SCHEMA
// ============================================================================

export const donorSchema = z.object({
  donorName: z.string().min(1, 'Donor name is required').max(200, 'Name must be 200 characters or less'),
  donorType: z.enum(
    Object.values(DONOR_TYPE) as [string, ...string[]],
    { required_error: 'Donor type is required' }
  ),
  contactPerson: z.string().max(100, 'Contact person must be 100 characters or less').optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.string().max(20, 'Phone must be 20 characters or less').optional(),
  address: z.string().max(500, 'Address must be 500 characters or less').optional(),
  country: z.string().max(100, 'Country must be 100 characters or less').optional(),
  website: z.string().url('Invalid URL format').optional().or(z.literal('')),
  notes: z.string().max(2000, 'Notes must be 2000 characters or less').optional(),
  status: z.enum(
    Object.values(DONOR_STATUS) as [string, ...string[]],
    { required_error: 'Status is required' }
  ).default('active'),
});

export type DonorFormData = z.infer<typeof donorSchema>;

// ============================================================================
// PROJECT SCHEMA
// ============================================================================

export const projectSchema = z.object({
  projectCode: z.string().min(1, 'Project code is required').max(20, 'Code must be 20 characters or less'),
  donorId: z.number().min(1, 'Donor is required'),
  donorName: optionalStringSchema,
  projectName: z.string().min(1, 'Project name is required').max(300, 'Name must be 300 characters or less'),
  description: z.string().max(2000, 'Description must be 2000 characters or less').optional(),
  location: z.string().max(200, 'Location must be 200 characters or less').optional(),
  startDate: requiredDateSchema,
  endDate: requiredDateSchema,
  budget: z.number().min(0, 'Budget must be positive').optional(),
  currency: z.string().max(10, 'Currency code must be 10 characters or less').optional(),
  status: z.enum(
    Object.values(PROJECT_STATUS) as [string, ...string[]],
    { required_error: 'Status is required' }
  ).default('not_started'),
  thematicArea: z.enum(
    Object.values(THEMATIC_AREA) as [string, ...string[]]
  ).optional(),
  focalPoint: z.string().max(100, 'Focal point must be 100 characters or less').optional(),
}).refine(
  (data) => new Date(data.endDate) >= new Date(data.startDate),
  { message: 'End date must be on or after start date', path: ['endDate'] }
);

export type ProjectFormData = z.infer<typeof projectSchema>;

// ============================================================================
// WORK PLAN SCHEMA
// ============================================================================

const timelineEntrySchema = z.object({
  month: z.number().min(1).max(12, 'Month must be between 1 and 12'),
  year: z.number().min(2000).max(2100, 'Year must be between 2000 and 2100'),
  status: z.enum(
    Object.values(WORK_PLAN_TIMELINE_STATUS) as [string, ...string[]]
  ),
});

export const workPlanSchema = z.object({
  projectId: z.number().min(1, 'Project is required'),
  projectName: optionalStringSchema,
  donorId: z.number().optional(),
  donorName: optionalStringSchema,
  output: z.string().min(1, 'Output is required').max(500, 'Output must be 500 characters or less'),
  activity: z.string().min(1, 'Activity is required').max(500, 'Activity must be 500 characters or less'),
  focalPoint: z.string().max(100, 'Focal point must be 100 characters or less').optional(),
  thematicArea: z.enum(
    Object.values(THEMATIC_AREA) as [string, ...string[]]
  ).optional(),
  implementationMethodology: z.string().max(1000, 'Methodology must be 1000 characters or less').optional(),
  complianceDocuments: z.string().max(500, 'Compliance documents must be 500 characters or less').optional(),
  location: z.string().max(200, 'Location must be 200 characters or less').optional(),
  branding: z.string().max(200, 'Branding must be 200 characters or less').optional(),
  socialMedia: z.string().max(500, 'Social media must be 500 characters or less').optional(),
  website: z.string().max(200, 'Website must be 200 characters or less').optional(),
  targetMatrix: z.string().max(2000, 'Target matrix must be 2000 characters or less').optional(),
  timeline: z.array(timelineEntrySchema).optional().default([]),
  remarks: z.string().max(1000, 'Remarks must be 1000 characters or less').optional(),
  reminderDays: z.number().min(1).max(90, 'Reminder days must be between 1 and 90').default(15),
});

export type WorkPlanFormData = z.infer<typeof workPlanSchema>;

// ============================================================================
// CERTIFICATE SCHEMA
// ============================================================================

export const certificateSchema = z.object({
  projectId: z.number().min(1, 'Project is required'),
  projectName: optionalStringSchema,
  stakeholderName: z.string().min(1, 'Stakeholder name is required').max(200, 'Name must be 200 characters or less'),
  agency: z.enum(
    Object.values(CERTIFICATE_AGENCY) as [string, ...string[]],
    { required_error: 'Agency is required' }
  ),
  documentType: z.enum(
    Object.values(CERTIFICATE_DOCUMENT_TYPE) as [string, ...string[]],
    { required_error: 'Document type is required' }
  ),
  year: z.number().min(2000).max(2100, 'Year must be between 2000 and 2100'),
  areasOfCollaboration: z.string().max(1000, 'Areas of collaboration must be 1000 characters or less').optional(),
  documentFile: fileMetadataSchema,
});

export type CertificateFormData = z.infer<typeof certificateSchema>;

// ============================================================================
// DOCUMENT SCHEMA
// ============================================================================

export const documentSchema = z.object({
  projectId: z.number().min(1, 'Project is required'),
  projectName: optionalStringSchema,
  documentType: z.enum(
    Object.values(PROJECT_DOCUMENT_TYPE) as [string, ...string[]],
    { required_error: 'Document type is required' }
  ),
  documentName: z.string().min(1, 'Document name is required').max(200, 'Name must be 200 characters or less'),
  documentFile: fileMetadataSchema,
  uploadedBy: z.string().max(100, 'Uploader name must be 100 characters or less').optional(),
  uploadDate: requiredDateSchema,
  description: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
});

export type DocumentFormData = z.infer<typeof documentSchema>;

// ============================================================================
// REPORTING SCHEMA
// ============================================================================

export const reportingSchema = z.object({
  projectId: z.number().min(1, 'Project is required'),
  projectName: optionalStringSchema,
  donorId: z.number().optional(),
  donorName: optionalStringSchema,
  location: z.string().max(200, 'Location must be 200 characters or less').optional(),
  reportType: z.enum(
    Object.values(REPORT_TYPE) as [string, ...string[]],
    { required_error: 'Report type is required' }
  ),
  reportingDescription: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
  reportingFormat: z.enum(
    Object.values(REPORTING_FORMAT) as [string, ...string[]],
    { required_error: 'Reporting format is required' }
  ),
  dueDate: requiredDateSchema,
  reminderDays: z.number().min(1).max(90, 'Reminder days must be between 1 and 90').default(10),
  uploadedBy: z.enum(
    Object.values(REPORT_UPLOADED_BY) as [string, ...string[]]
  ).optional(),
  documentFile: fileMetadataSchema,
  status: z.enum(
    Object.values(REPORT_STATUS) as [string, ...string[]],
    { required_error: 'Status is required' }
  ).default('pending'),
  submittedDate: dateStringSchema.optional(),
});

export type ReportingFormData = z.infer<typeof reportingSchema>;

// ============================================================================
// BENEFICIARY SCHEMA
// ============================================================================

export const beneficiarySchema = z.object({
  projectId: z.number().min(1, 'Project is required'),
  projectCode: optionalStringSchema,
  projectName: optionalStringSchema,
  donorId: z.number().optional(),
  donorName: optionalStringSchema,
  thematicArea: z.enum(
    Object.values(THEMATIC_AREA) as [string, ...string[]]
  ).optional(),
  activity: z.string().max(500, 'Activity must be 500 characters or less').optional(),
  beneficiaryName: z.string().min(1, 'Beneficiary name is required').max(200, 'Name must be 200 characters or less'),
  beneficiaryType: z.enum(
    Object.values(BENEFICIARY_TYPE) as [string, ...string[]],
    { required_error: 'Beneficiary type is required' }
  ),
  serviceType: z.string().max(200, 'Service type must be 200 characters or less').optional(),
  status: z.enum(
    Object.values(BENEFICIARY_STATUS) as [string, ...string[]],
    { required_error: 'Status is required' }
  ).default('pending'),
  nidNo: z.string().max(50, 'NID number must be 50 characters or less').optional(),
  nidDocument: fileMetadataSchema,
  contactNumber: z.string().max(20, 'Contact number must be 20 characters or less').optional(),
  currentResidence: z.string().max(200, 'Current residence must be 200 characters or less').optional(),
  origin: z.string().max(200, 'Origin must be 200 characters or less').optional(),
  district: z.string().max(100, 'District must be 100 characters or less').optional(),
  village: z.string().max(100, 'Village must be 100 characters or less').optional(),
  familySize: z.number().min(0, 'Family size must be positive').max(100, 'Family size seems too large').optional(),
  femaleUnder17: z.number().min(0).max(50, 'Count seems too large').optional(),
  femaleOver18: z.number().min(0).max(50, 'Count seems too large').optional(),
  maleUnder18: z.number().min(0).max(50, 'Count seems too large').optional(),
  maleOver18: z.number().min(0).max(50, 'Count seems too large').optional(),
  headOfHHGender: z.enum(
    Object.values(HEAD_OF_HH_GENDER) as [string, ...string[]]
  ).optional(),
});

export type BeneficiaryFormData = z.infer<typeof beneficiarySchema>;

// ============================================================================
// SAFEGUARDING SCHEMA
// ============================================================================

export const safeguardingSchema = z.object({
  projectId: z.number().min(1, 'Project is required'),
  projectName: optionalStringSchema,
  activityType: z.enum(
    Object.values(SAFEGUARDING_ACTIVITY_TYPE) as [string, ...string[]],
    { required_error: 'Activity type is required' }
  ),
  frequency: z.enum(
    Object.values(SAFEGUARDING_FREQUENCY) as [string, ...string[]],
    { required_error: 'Frequency is required' }
  ),
  documentFile: fileMetadataSchema,
  responsibleOfficer: z.string().max(100, 'Officer name must be 100 characters or less').optional(),
  dueDate: dateStringSchema.optional(),
  status: z.enum(
    Object.values(SAFEGUARDING_STATUS) as [string, ...string[]],
    { required_error: 'Status is required' }
  ).default('pending'),
  completedDate: dateStringSchema.optional(),
  description: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
});

export type SafeguardingFormData = z.infer<typeof safeguardingSchema>;

// ============================================================================
// SEARCH/FILTER SCHEMAS
// ============================================================================

export const programSearchSchema = z.object({
  search: z.string().optional(),
  donorId: z.number().optional(),
  projectId: z.number().optional(),
  status: z.string().optional(),
  thematicArea: z.string().optional(),
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.optional(),
});

export type ProgramSearchParams = z.infer<typeof programSearchSchema>;
