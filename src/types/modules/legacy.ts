/**
 * Legacy Store Type Definitions
 *
 * Minimal type definitions for legacy stores to maintain backward compatibility.
 * These are simple extensions of BaseRecord with only essential fields.
 */

import type { BaseRecord } from '../db/base';

// ========== RECRUITMENT LEGACY TYPES ==========

export interface JobRequisitionRecord extends BaseRecord {
  requisitionId: string;
  title?: string;
  department?: string;
  priority?: string;
  status?: string;
}

export interface JobAnnouncementRecord extends BaseRecord {
  requisitionId?: number;
  closingDate?: string;
  status?: string;
}

export interface JobOfferRecord extends BaseRecord {
  candidateId?: number;
  requisitionId?: number;
  status?: string;
}

export interface TestResultRecord extends BaseRecord {
  writtenTestId?: number;
  candidateId?: number;
  score?: number;
}

export interface ReferenceCheckRecord extends BaseRecord {
  candidateId?: number;
  recruitmentId?: number;
  status?: string;
}

export interface ShortlistingScoreRecord extends BaseRecord {
  candidateApplicationId?: number;
  recruitmentId?: number;
  score?: number;
}

export interface ProbationEvaluationRecord extends BaseRecord {
  probationRecordId?: number;
  employeeId?: number;
  evaluationDate?: string;
  status?: string;
}

// ========== PAYROLL LEGACY TYPES ==========

export interface SalaryComponentRecord extends BaseRecord {
  componentCode: string;
  componentType?: string;
  name?: string;
  isActive?: boolean;
}

export interface PayrollRecord extends BaseRecord {
  payrollId: string;
  employeeId?: number;
  month?: number;
  year?: number;
  status?: string;
  grossSalary?: number;
  netSalary?: number;
}

// ========== LEAVE/COMPENSATION LEGACY TYPES ==========

export interface AllowanceTypeRecord extends BaseRecord {
  code: string;
  name?: string;
  isActive?: boolean;
}

export interface EmployeeRewardRecord extends BaseRecord {
  employeeId?: number;
  rewardType?: string;
  rewardDate?: string;
  amount?: number;
}

export interface CTORecord extends BaseRecord {
  employeeId?: number;
  earnedDate?: string;
  status?: string;
  hours?: number;
}

// Note: leaveApprovals already exists in leave module, no need to redefine

// ========== PERFORMANCE LEGACY TYPES ==========

export interface IDPRecord extends BaseRecord {
  idpId: string;
  employeeId?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface IDPGoalRecord extends BaseRecord {
  idpId?: number;
  goal?: string;
  status?: string;
}

// ========== DISCIPLINARY LEGACY TYPES ==========

export interface DisciplinaryTypeRecord extends BaseRecord {
  code: string;
  name?: string;
  isActive?: boolean;
}

export interface GrievanceTypeRecord extends BaseRecord {
  code: string;
  name?: string;
  isActive?: boolean;
}

export interface GrievanceRecord extends BaseRecord {
  employeeId?: number;
  grievanceType?: string;
  status?: string;
  description?: string;
}

export interface GrievanceInvestigationRecord extends BaseRecord {
  grievanceId?: number;
  investigatorId?: number;
  status?: string;
}

export interface GrievanceResolutionRecord extends BaseRecord {
  grievanceId?: number;
  resolutionDate?: string;
  resolution?: string;
}

// ========== EMPLOYEE ADMIN LEGACY TYPES ==========

export interface OrientationChecklistRecord extends BaseRecord {
  employeeId?: number;
  status?: string;
}

export interface OrientationItemRecord extends BaseRecord {
  checklistId?: number;
  itemName?: string;
  status?: string;
}
