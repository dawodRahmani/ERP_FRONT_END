/**
 * Program Module Constants and Data
 *
 * Dropdown options, color mappings, and helper functions
 * for the VDO ERP Program module.
 */

import type {
  DonorType,
  DonorStatus,
  ProjectStatus,
  ThematicArea,
  WorkPlanTimelineStatus,
  CertificateAgency,
  CertificateDocumentType,
  ProjectDocumentType,
  ReportType,
  ReportingFormat,
  ReportStatus,
  ReportUploadedBy,
  BeneficiaryType,
  BeneficiaryStatus,
  HeadOfHHGender,
  SafeguardingActivityType,
  SafeguardingFrequency,
  SafeguardingStatus,
} from '../types/modules/program';

// ============================================================================
// DONOR OPTIONS
// ============================================================================

export const DONOR_TYPE_OPTIONS: { value: DonorType; label: string }[] = [
  { value: 'bilateral', label: 'Bilateral' },
  { value: 'multilateral', label: 'Multilateral' },
  { value: 'un_agency', label: 'UN Agency' },
  { value: 'ingo', label: 'INGO' },
  { value: 'private', label: 'Private' },
  { value: 'foundation', label: 'Foundation' },
  { value: 'government', label: 'Government' },
  { value: 'other', label: 'Other' },
];

export const DONOR_STATUS_OPTIONS: { value: DonorStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'prospective', label: 'Prospective' },
];

export const DONOR_STATUS_COLORS: Record<DonorStatus, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  prospective: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};
export const DONOR_TYPE_COLORS: Record<DonorType, string> = {
  bilateral: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  multilateral: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  un_agency: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  ingo: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  private: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  foundation: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  government: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  other: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
};
// ============================================================================
// PROJECT OPTIONS
// ============================================================================

export const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'stopped', label: 'Stopped' },
  { value: 'amendment', label: 'Amendment' },
];

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  not_started: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  ongoing: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  stopped: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  amendment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

export const THEMATIC_AREA_OPTIONS: { value: ThematicArea; label: string }[] = [
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'protection', label: 'Protection' },
  { value: 'wash', label: 'WASH' },
  { value: 'livelihood', label: 'Livelihood' },
  { value: 'food_security', label: 'Food Security' },
  { value: 'shelter', label: 'Shelter' },
  { value: 'gender', label: 'Gender' },
  { value: 'governance', label: 'Governance' },
  { value: 'emergency_response', label: 'Emergency Response' },
  { value: 'other', label: 'Other' },
];

// ============================================================================
// WORK PLAN OPTIONS
// ============================================================================

export const WORK_PLAN_TIMELINE_STATUS_OPTIONS: {
  value: WorkPlanTimelineStatus;
  label: string;
}[] = [
  { value: 'planned', label: 'Planned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const WORK_PLAN_TIMELINE_STATUS_COLORS: Record<WorkPlanTimelineStatus, string> = {
  planned: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  delayed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

// ============================================================================
// CERTIFICATE OPTIONS
// ============================================================================

export const CERTIFICATE_AGENCY_OPTIONS: { value: CertificateAgency; label: string }[] = [
  { value: 'donor', label: 'Donor' },
  { value: 'partners', label: 'Partners' },
  { value: 'authority', label: 'Authority' },
];

export const CERTIFICATE_DOCUMENT_TYPE_OPTIONS: {
  value: CertificateDocumentType;
  label: string;
}[] = [
  { value: 'recommendation_letter', label: 'Recommendation Letter' },
  { value: 'work_completion_certificate', label: 'Work Completion Certificate' },
  { value: 'project_completion_certificate', label: 'Project Completion Certificate' },
];

export const CERTIFICATE_AGENCY_COLORS: Record<CertificateAgency, string> = {
  donor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  partners: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  authority: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

export const CERTIFICATE_DOCUMENT_TYPE_COLORS: Record<CertificateDocumentType, string> = {
  recommendation_letter: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  work_completion_certificate: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  project_completion_certificate: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};

// ============================================================================
// DOCUMENT OPTIONS
// ============================================================================

export const PROJECT_DOCUMENT_TYPE_OPTIONS: {
  value: ProjectDocumentType;
  label: string;
}[] = [
  { value: 'proposal', label: 'Project Proposal' },
  { value: 'workplan', label: 'Work Plan' },
  { value: 'budget', label: 'Budget' },
  { value: 'grant_agreement', label: 'Grant Agreement' },
  { value: 'logframe', label: 'Logframe' },
  { value: 'annexes', label: 'Annexes/Templates' },
  { value: 'compliance_docs', label: 'Compliance Documents' },
];

export const PROJECT_DOCUMENT_TYPE_COLORS: Record<ProjectDocumentType, string> = {
  proposal: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  workplan: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  budget: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  grant_agreement: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  logframe: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  annexes: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  compliance_docs: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

// ============================================================================
// REPORTING OPTIONS
// ============================================================================

export const REPORT_TYPE_OPTIONS: { value: ReportType; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'semi_annually', label: 'Semi-Annually' },
  { value: 'annual', label: 'Annual' },
  { value: 'mid_term', label: 'Mid-Term Report' },
  { value: 'final', label: 'Final Report' },
  { value: 'project_closing_report', label: 'Project Closing Report' },
  { value: 'impact_assessment', label: 'Impact Assessment Report' },
  { value: 'evaluation', label: 'Evaluation Report' },
  { value: 'risk_assessment', label: 'Risk Assessment Report' },
  { value: 'safeguarding', label: 'Safeguarding Report' },
];

export const REPORTING_FORMAT_OPTIONS: { value: ReportingFormat; label: string }[] = [
  { value: 'sitrep', label: 'SitRep' },
  { value: 'narrative', label: 'Narrative' },
  { value: 'financial', label: 'Financial' },
  { value: 'custom', label: 'Custom Format' },
];

export const REPORT_STATUS_OPTIONS: { value: ReportStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'overdue', label: 'Overdue' },
];

export const REPORT_STATUS_COLORS: Record<ReportStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  submitted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export const REPORT_UPLOADED_BY_OPTIONS: { value: ReportUploadedBy; label: string }[] = [
  { value: 'program', label: 'Program' },
  { value: 'meal', label: 'MEAL' },
];

// ============================================================================
// BENEFICIARY OPTIONS
// ============================================================================

export const BENEFICIARY_TYPE_OPTIONS: { value: BeneficiaryType; label: string }[] = [
  { value: 'community_elder', label: 'Community Elder' },
  { value: 'disability', label: 'Person with Disability' },
  { value: 'returnee', label: 'Returnee' },
  { value: 'youth', label: 'Youth' },
  { value: 'gbv_survivor', label: 'GBV Survivor' },
  { value: 'vulnerable_communities', label: 'Vulnerable Communities' },
  { value: 'female_hh', label: 'Female-Headed Household' },
  { value: 'idp', label: 'IDP' },
  { value: 'other', label: 'Other' },
];

export const BENEFICIARY_STATUS_OPTIONS: { value: BeneficiaryStatus; label: string }[] = [
  { value: 'verified', label: 'Verified' },
  { value: 'pending', label: 'Pending Verification' },
  { value: 'rejected', label: 'Rejected' },
];

export const BENEFICIARY_STATUS_COLORS: Record<BeneficiaryStatus, string> = {
  verified: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export const BENEFICIARY_TYPE_COLORS: Record<BeneficiaryType, string> = {
  community_elder: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  disability: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  returnee: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  youth: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  gbv_survivor: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  vulnerable_communities: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  female_hh: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
  idp: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

export const HEAD_OF_HH_GENDER_OPTIONS: { value: HeadOfHHGender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

// ============================================================================
// SAFEGUARDING OPTIONS
// ============================================================================

export const SAFEGUARDING_ACTIVITY_TYPE_OPTIONS: {
  value: SafeguardingActivityType;
  label: string;
}[] = [
  { value: 'report', label: 'Safeguarding Report' },
  { value: 'awareness_raising', label: 'Awareness Raising' },
  { value: 'training', label: 'Training' },
  { value: 'banners_visibility', label: 'Banners & Visibility Materials' },
  { value: 'work_plan', label: 'Work Plan' },
];

export const SAFEGUARDING_FREQUENCY_OPTIONS: {
  value: SafeguardingFrequency;
  label: string;
}[] = [
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
  { value: 'as_per_plan', label: 'As Per Plan' },
];

export const SAFEGUARDING_STATUS_OPTIONS: { value: SafeguardingStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
];

export const SAFEGUARDING_STATUS_COLORS: Record<SafeguardingStatus, string> = {
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get label for a status/type value
 */
export function getLabel<T extends string>(
  options: { value: T; label: string }[],
  value: T | undefined
): string {
  if (!value) return '-';
  const option = options.find((opt) => opt.value === value);
  return option?.label || value;
}

/**
 * Calculate reminder color based on due date
 * @param dueDate - Due date string (ISO format)
 * @param reminderDays - Days before due date to show warning (default: 15)
 * @returns Color class name
 */
export function getReminderColor(
  dueDate: string,
  reminderDays: number = 15
): 'red' | 'yellow' | 'green' {
  const now = new Date();
  const due = new Date(dueDate);
  const daysUntilDue = Math.ceil(
    (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilDue < 0) return 'red'; // Overdue
  if (daysUntilDue <= 5) return 'red'; // Critical
  if (daysUntilDue <= reminderDays) return 'yellow'; // Warning
  return 'green'; // OK
}

/**
 * Get Tailwind classes for reminder indicator
 */
export function getReminderColorClasses(color: 'red' | 'yellow' | 'green'): string {
  const colorMap = {
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800',
    yellow:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    green:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800',
  };
  return colorMap[color];
}

/**
 * Format date to localized string
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number | undefined, currency?: string): string {
  if (amount === undefined || amount === null) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
}

/**
 * Calculate days until due date
 */
export function getDaysUntilDue(dueDate: string): number {
  const now = new Date();
  const due = new Date(dueDate);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Format days until due as human-readable string
 */
export function formatDaysUntilDue(dueDate: string): string {
  const days = getDaysUntilDue(dueDate);
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `${days} days remaining`;
}

/**
 * Generate month/year options for timeline grid
 */
export function generateMonthYearOptions(
  startYear: number,
  endYear: number
): { month: number; year: number; label: string }[] {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const options: { month: number; year: number; label: string }[] = [];

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 1; month <= 12; month++) {
      options.push({
        month,
        year,
        label: `${months[month - 1]} ${year}`,
      });
    }
  }

  return options;
}

// ============================================================================
// AFGHANISTAN PROVINCES (commonly used locations)
// ============================================================================

export const AFGHANISTAN_PROVINCES = [
  'Badakhshan',
  'Badghis',
  'Baghlan',
  'Balkh',
  'Bamyan',
  'Daykundi',
  'Farah',
  'Faryab',
  'Ghazni',
  'Ghor',
  'Helmand',
  'Herat',
  'Jowzjan',
  'Kabul',
  'Kandahar',
  'Kapisa',
  'Khost',
  'Kunar',
  'Kunduz',
  'Laghman',
  'Logar',
  'Nangarhar',
  'Nimroz',
  'Nuristan',
  'Paktia',
  'Paktika',
  'Panjshir',
  'Parwan',
  'Samangan',
  'Sar-e Pol',
  'Takhar',
  'Uruzgan',
  'Wardak',
  'Zabul',
];

export const PROVINCE_OPTIONS = AFGHANISTAN_PROVINCES.map((province) => ({
  value: province.toLowerCase().replace(/\s+/g, '_'),
  label: province,
}));
