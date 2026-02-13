/**
 * Recruitment Module Data
 *
 * Default dropdown values, category definitions, and helper functions
 * for the recruitment dropdown management system.
 */

import type { DropdownCategory } from '../types/modules/recruitment';

// ========== DROPDOWN CATEGORIES ==========

export const DROPDOWN_CATEGORIES: DropdownCategory[] = [
  { key: 'department', label: 'Department', description: 'Organizational departments' },
  { key: 'dutyStation', label: 'Duty Station', description: 'Work locations and duty stations' },
  { key: 'gradeStep', label: 'Grade / Step', description: 'Salary grade and step levels' },
  { key: 'contractType', label: 'Contract Type', description: 'Types of employment contracts' },
  { key: 'contractDurationUnit', label: 'Duration Unit', description: 'Units for contract duration' },
  { key: 'country', label: 'Country', description: 'Countries for recruitment' },
  { key: 'salaryGrade', label: 'Salary Grade', description: 'Salary grade levels' },
  { key: 'hiringApproach', label: 'Hiring Approach', description: 'Recruitment hiring methods' },
  { key: 'nationality', label: 'Nationality', description: 'Nationality categories' },
  { key: 'languageProficiency', label: 'Language Proficiency', description: 'Language skill levels' },
  { key: 'committeeRole', label: 'Committee Role', description: 'Roles within recruitment committee' },
  { key: 'reviewDecision', label: 'Review Decision', description: 'Conflict of interest review decisions' },
  { key: 'minimumEducation', label: 'Minimum Education', description: 'Minimum education requirements' },
  { key: 'gender', label: 'Gender', description: 'Gender options' },
  { key: 'rcRecommendation', label: 'RC Recommendation', description: 'Recruitment committee recommendations' },
  { key: 'currency', label: 'Currency', description: 'Currency options for compensation' },
];

/**
 * Get category label from key
 */
export function getCategoryLabel(key: string): string {
  const category = DROPDOWN_CATEGORIES.find(c => c.key === key);
  return category?.label ?? key;
}

/**
 * Get category description from key
 */
export function getCategoryDescription(key: string): string {
  const category = DROPDOWN_CATEGORIES.find(c => c.key === key);
  return category?.description ?? '';
}

// ========== DEFAULT SEED DATA ==========

interface SeedItem {
  category: string;
  value: string;
  label: string;
  isActive: boolean;
  displayOrder: number;
}

function buildSeed(category: string, items: { value: string; label: string }[]): SeedItem[] {
  return items.map((item, index) => ({
    category,
    value: item.value,
    label: item.label,
    isActive: true,
    displayOrder: index + 1,
  }));
}

function buildSimpleSeed(category: string, items: string[]): SeedItem[] {
  return items.map((item, index) => ({
    category,
    value: item.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    label: item,
    isActive: true,
    displayOrder: index + 1,
  }));
}

export const DEFAULT_RECRUITMENT_DROPDOWNS: SeedItem[] = [
  // Department
  ...buildSimpleSeed('department', [
    'Program', 'Finance', 'HR', 'Admin', 'IT',
    'Compliance', 'M&E', 'Communications', 'Security', 'Logistics',
  ]),

  // Duty Station
  ...buildSimpleSeed('dutyStation', [
    'Kabul', 'Herat', 'Mazar-i-Sharif', 'Kandahar',
    'Jalalabad', 'Kunduz', 'Bamyan', 'Field Office',
  ]),

  // Grade / Step
  ...buildSeed('gradeStep', [
    { value: 'A-1', label: 'A-1' }, { value: 'A-2', label: 'A-2' },
    { value: 'A-3', label: 'A-3' }, { value: 'A-4', label: 'A-4' },
    { value: 'A-5', label: 'A-5' }, { value: 'B-1', label: 'B-1' },
    { value: 'B-2', label: 'B-2' }, { value: 'B-3', label: 'B-3' },
    { value: 'B-4', label: 'B-4' }, { value: 'B-5', label: 'B-5' },
    { value: 'C-1', label: 'C-1' }, { value: 'C-2', label: 'C-2' },
    { value: 'C-3', label: 'C-3' }, { value: 'C-4', label: 'C-4' },
    { value: 'C-5', label: 'C-5' }, { value: 'D-1', label: 'D-1' },
    { value: 'D-2', label: 'D-2' }, { value: 'D-3', label: 'D-3' },
    { value: 'D-4', label: 'D-4' }, { value: 'D-5', label: 'D-5' },
    { value: 'E-1', label: 'E-1' }, { value: 'E-2', label: 'E-2' },
    { value: 'E-3', label: 'E-3' }, { value: 'E-4', label: 'E-4' },
    { value: 'E-5', label: 'E-5' },
  ]),

  // Contract Type
  ...buildSeed('contractType', [
    { value: 'core', label: 'Core (Permanent)' },
    { value: 'project', label: 'Project' },
    { value: 'consultant', label: 'Consultant' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'internship', label: 'Internship/Volunteer' },
    { value: 'daily-wage', label: 'Daily Wage' },
  ]),

  // Contract Duration Unit
  ...buildSeed('contractDurationUnit', [
    { value: 'days', label: 'Days' },
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' },
  ]),

  // Country
  ...buildSimpleSeed('country', [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia',
    'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Bhutan', 'Bolivia',
    'Bosnia and Herzegovina', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Cambodia', 'Cameroon',
    'Canada', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus',
    'Czech Republic', 'Denmark', 'Ecuador', 'Egypt', 'El Salvador', 'Estonia', 'Ethiopia', 'Finland',
    'France', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Guatemala', 'Haiti', 'Honduras', 'Hungary',
    'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan',
    'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Libya',
    'Lithuania', 'Luxembourg', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mexico', 'Moldova', 'Mongolia',
    'Montenegro', 'Morocco', 'Myanmar', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger',
    'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama',
    'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
    'Saudi Arabia', 'Senegal', 'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'Somalia', 'South Africa',
    'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
    'Tanzania', 'Thailand', 'Tunisia', 'Turkey', 'Turkmenistan', 'UAE', 'Uganda', 'Ukraine',
    'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
  ]),

  // Salary Grade
  ...buildSeed('salaryGrade', [
    { value: 'grade_1', label: 'Grade 1' }, { value: 'grade_2', label: 'Grade 2' },
    { value: 'grade_3', label: 'Grade 3' }, { value: 'grade_4', label: 'Grade 4' },
    { value: 'grade_5', label: 'Grade 5' }, { value: 'grade_6', label: 'Grade 6' },
    { value: 'grade_7', label: 'Grade 7' }, { value: 'grade_8', label: 'Grade 8' },
    { value: 'grade_9', label: 'Grade 9' }, { value: 'grade_10', label: 'Grade 10' },
  ]),

  // Hiring Approach
  ...buildSeed('hiringApproach', [
    { value: 'open_competition', label: 'Open Competition' },
    { value: 'internal_promotion', label: 'Internal Promotion' },
    { value: 'headhunting', label: 'Headhunting' },
    { value: 'internal_transfer', label: 'Internal Transfer' },
    { value: 'interim_hiring', label: 'Interim Hiring' },
    { value: 'job_rotation', label: 'Job Rotation' },
    { value: 'sole_source', label: 'Sole Source Recruitment' },
  ]),

  // Nationality
  ...buildSeed('nationality', [
    { value: 'national', label: 'National' },
    { value: 'international', label: 'International' },
  ]),

  // Language Proficiency
  ...buildSeed('languageProficiency', [
    { value: 'basic', label: 'Basic' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'fluent', label: 'Fluent' },
  ]),

  // Committee Role
  ...buildSeed('committeeRole', [
    { value: 'chair', label: 'Chair' },
    { value: 'technical', label: 'Technical Expert' },
    { value: 'hr', label: 'HR Representative' },
    { value: 'member', label: 'Member' },
  ]),

  // Review Decision
  ...buildSeed('reviewDecision', [
    { value: 'pending', label: 'Pending' },
    { value: 'no_conflict', label: 'No Conflict' },
    { value: 'conflict_identified', label: 'Conflict Identified' },
  ]),

  // Minimum Education
  ...buildSeed('minimumEducation', [
    { value: 'baccalaureate', label: 'Baccalaureate' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'bachelor', label: 'Bachelor' },
    { value: 'master', label: 'Master' },
  ]),

  // Gender
  ...buildSeed('gender', [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ]),

  // RC Recommendation
  ...buildSeed('rcRecommendation', [
    { value: 'recommended', label: 'Recommended' },
    { value: 'reserve', label: 'Reserve' },
    { value: 'not_recommended', label: 'Not Recommended' },
  ]),

  // Currency
  ...buildSeed('currency', [
    { value: 'AFN', label: 'AFN' },
    { value: 'USD', label: 'USD' },
  ]),
];
