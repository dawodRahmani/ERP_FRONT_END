/**
 * Audit Module Constants and Static Data
 *
 * Contains dropdown options, color mappings, and default values
 * for the audit management module.
 */

import type {
  AuditTypeCategory,
  AuditStatus,
  AuditFrequency,
  AuditModality,
  AuditSource,
  Quarter,
  CorrectiveActionStatus,
} from '../types/modules/audit';

// ========== DROPDOWN OPTIONS ==========

export const AUDIT_TYPE_CATEGORY_OPTIONS: { value: AuditTypeCategory; label: string }[] = [
  { value: 'external', label: 'External Audit' },
  { value: 'internal', label: 'Internal Audit' },
  { value: 'project', label: 'Project Audit' },
  { value: 'project_completion', label: 'Project Completion Audit' },
  { value: 'hact', label: 'HACT Assessment' },
  { value: 'ad_hoc', label: 'Ad hoc/Case-based' },
];

export const AUDIT_FREQUENCY_OPTIONS: { value: AuditFrequency; label: string }[] = [
  { value: 'annual', label: 'Annual' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'ad_hoc', label: 'Ad hoc' },
  { value: 'per_donor_schedule', label: 'Per Donor Schedule' },
];

export const AUDIT_STATUS_OPTIONS: { value: AuditStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'planned', label: 'Planned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'on_hold', label: 'On Hold' },
];

export const AUDIT_MODALITY_OPTIONS: { value: AuditModality; label: string }[] = [
  { value: 'online', label: 'Online' },
  { value: 'in_person', label: 'In-Person' },
  { value: 'hybrid', label: 'Hybrid' },
];

export const AUDIT_SOURCE_OPTIONS: { value: AuditSource; label: string }[] = [
  { value: 'outsource_tpm', label: 'Outsource - TPM' },
  { value: 'vdo_internal', label: 'VDO Internal Team' },
];

export const DEPARTMENT_OPTIONS: { value: string; label: string }[] = [
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'operations', label: 'Operations' },
  { value: 'programs', label: 'Programs' },
  { value: 'procurement', label: 'Procurement' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'it', label: 'IT' },
  { value: 'admin', label: 'Administration' },
  { value: 'security', label: 'Security' },
  { value: 'meal', label: 'M&E / MEAL' },
];

export const QUARTER_OPTIONS: { value: Quarter; label: string }[] = [
  { value: 'q1', label: 'Q1 (Jan-Mar)' },
  { value: 'q2', label: 'Q2 (Apr-Jun)' },
  { value: 'q3', label: 'Q3 (Jul-Sep)' },
  { value: 'q4', label: 'Q4 (Oct-Dec)' },
];

export const CORRECTIVE_ACTION_STATUS_OPTIONS: { value: CorrectiveActionStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
];

// ========== COLOR MAPPINGS ==========

export const AUDIT_STATUS_COLORS: Record<AuditStatus, string> = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  planned: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  on_hold: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
};

export const CORRECTIVE_ACTION_STATUS_COLORS: Record<CorrectiveActionStatus, string> = {
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export const AUDIT_MODALITY_COLORS: Record<AuditModality, string> = {
  online: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  in_person: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  hybrid: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
};

export const AUDIT_SOURCE_COLORS: Record<AuditSource, string> = {
  outsource_tpm: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  vdo_internal: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
};

export const AUDIT_FREQUENCY_COLORS: Record<AuditFrequency, string> = {
  annual: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  quarterly: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  ad_hoc: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  per_donor_schedule: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
};

// ========== DEFAULT AUDIT TYPES (SEED DATA) ==========

export const DEFAULT_AUDIT_TYPES = [
  {
    code: 'EXT',
    name: 'External Audit',
    category: 'external' as AuditTypeCategory,
    description: 'Audit conducted by external auditors hired by the company',
    isActive: true,
    displayOrder: 1,
  },
  {
    code: 'INT',
    name: 'Internal Audit',
    category: 'internal' as AuditTypeCategory,
    description: 'Audit conducted by VDO internal audit team',
    isActive: true,
    displayOrder: 2,
  },
  {
    code: 'PRJ',
    name: 'Project Audit',
    category: 'project' as AuditTypeCategory,
    description: 'Audit of specific project activities and finances',
    isActive: true,
    displayOrder: 3,
  },
  {
    code: 'PRC',
    name: 'Project Completion Audit',
    category: 'project_completion' as AuditTypeCategory,
    description: 'Final audit conducted at project completion',
    isActive: true,
    displayOrder: 4,
  },
  {
    code: 'HACT',
    name: 'HACT Assessment',
    category: 'hact' as AuditTypeCategory,
    description: 'Harmonized Approach to Cash Transfers assessment',
    isActive: true,
    displayOrder: 5,
  },
  {
    code: 'ADH',
    name: 'Ad hoc/Case-based',
    category: 'ad_hoc' as AuditTypeCategory,
    description: 'Special audit conducted on case-by-case basis',
    isActive: true,
    displayOrder: 6,
  },
];

// ========== HELPER FUNCTIONS ==========

export const getStatusLabel = (status: AuditStatus): string => {
  const option = AUDIT_STATUS_OPTIONS.find((o) => o.value === status);
  return option?.label || status;
};

export const getStatusColor = (status: AuditStatus): string => {
  return AUDIT_STATUS_COLORS[status] || AUDIT_STATUS_COLORS.draft;
};

export const getFrequencyLabel = (frequency: AuditFrequency): string => {
  const option = AUDIT_FREQUENCY_OPTIONS.find((o) => o.value === frequency);
  return option?.label || frequency;
};

export const getModalityLabel = (modality: AuditModality): string => {
  const option = AUDIT_MODALITY_OPTIONS.find((o) => o.value === modality);
  return option?.label || modality;
};

export const getSourceLabel = (source: AuditSource): string => {
  const option = AUDIT_SOURCE_OPTIONS.find((o) => o.value === source);
  return option?.label || source;
};

export const getQuarterLabel = (quarter: Quarter): string => {
  const option = QUARTER_OPTIONS.find((o) => o.value === quarter);
  return option?.label || quarter;
};

export const getCorrectiveActionStatusLabel = (status: CorrectiveActionStatus): string => {
  const option = CORRECTIVE_ACTION_STATUS_OPTIONS.find((o) => o.value === status);
  return option?.label || status;
};

export const getCategoryLabel = (category: AuditTypeCategory): string => {
  const option = AUDIT_TYPE_CATEGORY_OPTIONS.find((o) => o.value === category);
  return option?.label || category;
};

// ========== DATE FORMATTING ==========

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString: string | undefined): string => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

// ========== CURRENCY OPTIONS ==========

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'AFN', label: 'AFN - Afghan Afghani' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
];

// ========== FILE UPLOAD CONSTANTS ==========

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const FILE_TYPE_LABELS: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'Word Document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
  'application/vnd.ms-excel': 'Excel Spreadsheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
  'image/jpeg': 'JPEG Image',
  'image/png': 'PNG Image',
};

// ========== YEARS FOR DROPDOWN ==========

export const getYearOptions = (startYear = 2020, futureYears = 5): { value: number; label: string }[] => {
  const currentYear = new Date().getFullYear();
  const endYear = currentYear + futureYears;
  const years: { value: number; label: string }[] = [];

  for (let year = endYear; year >= startYear; year--) {
    years.push({ value: year, label: year.toString() });
  }

  return years;
};

// ========== CURRENCY FORMATTING ==========

export const formatCurrency = (amount: number, currency?: string): string => {
  const currencyCode = currency || 'USD';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toLocaleString()}`;
  }
};
