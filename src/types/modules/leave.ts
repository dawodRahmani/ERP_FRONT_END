/**
 * Leave Management Module Types
 *
 * Type definitions for leave management system.
 * Covers: Leave Types, Policies, Balances, Requests, Approvals, Holidays, Timesheets, OIC
 */

import type { BaseRecord } from '../db/base';

// ========== ENUMS AND CONSTANTS ==========

export const LEAVE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

export const REQUEST_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  MANAGER_APPROVED: 'manager_approved',
  HR_APPROVED: 'hr_approved',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  TAKEN: 'taken',
  COMPLETED: 'completed',
} as const;

export const APPROVAL_LEVEL = {
  MANAGER: 'manager',
  HR: 'hr',
  DIRECTOR: 'director',
  FINAL: 'final',
} as const;

export const APPROVAL_ACTION = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
  FORWARDED: 'forwarded',
} as const;

export const HOLIDAY_TYPE = {
  NATIONAL: 'national',
  RELIGIOUS: 'religious',
  COMPANY: 'company',
  REGIONAL: 'regional',
} as const;

export const TIMESHEET_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  MANAGER_APPROVED: 'manager_approved',
  HR_VERIFIED: 'hr_verified',
  SENT_TO_PAYROLL: 'sent_to_payroll',
  COMPLETED: 'completed',
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LEAVE: 'leave',
  HOLIDAY: 'holiday',
  WEEKEND: 'weekend',
  HALF_DAY: 'half_day',
} as const;

export const OIC_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  CANCELLED: 'cancelled',
} as const;

export const ADJUSTMENT_TYPE = {
  CREDIT: 'credit',
  DEBIT: 'debit',
} as const;

export const ADJUSTMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// Type exports
export type LeaveStatus = typeof LEAVE_STATUS[keyof typeof LEAVE_STATUS];
export type RequestStatus = typeof REQUEST_STATUS[keyof typeof REQUEST_STATUS];
export type ApprovalLevel = typeof APPROVAL_LEVEL[keyof typeof APPROVAL_LEVEL];
export type ApprovalAction = typeof APPROVAL_ACTION[keyof typeof APPROVAL_ACTION];
export type HolidayType = typeof HOLIDAY_TYPE[keyof typeof HOLIDAY_TYPE];
export type TimesheetStatus = typeof TIMESHEET_STATUS[keyof typeof TIMESHEET_STATUS];
export type AttendanceStatus = typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS];
export type OICStatus = typeof OIC_STATUS[keyof typeof OIC_STATUS];
export type AdjustmentType = typeof ADJUSTMENT_TYPE[keyof typeof ADJUSTMENT_TYPE];
export type AdjustmentStatus = typeof ADJUSTMENT_STATUS[keyof typeof ADJUSTMENT_STATUS];

// ========== RECORD INTERFACES ==========

/**
 * Leave Type
 */
export interface LeaveTypeRecord extends BaseRecord {
  name: string;
  code: string;
  description?: string;
  daysAllowed: number;
  requiresApproval: boolean;
  requiresDocument: boolean;
  maxConsecutiveDays?: number;
  minNoticeDays?: number;
  maxCarryoverDays: number;
  isCarryoverAllowed: boolean;
  isPaid: boolean;
  isActive: boolean;
  gender?: string;
  applicableAfterMonths?: number;
  displayOrder: number;
  status: LeaveStatus;
  color?: string;
}

/**
 * Leave Policy
 */
export interface LeavePolicyRecord extends BaseRecord {
  leaveTypeId: number;
  fiscalYear: number;
  entitlementDays: number;
  accrualMethod?: string;
  accrualFrequency?: string;
  maxAccrualDays?: number;
  applicableTo?: string;
  department?: string;
  position?: string;
  isActive: boolean;
  effectiveFrom?: string;
  effectiveTo?: string;
  notes?: string;
}

/**
 * Employee Leave Balance
 */
export interface EmployeeLeaveBalanceRecord extends BaseRecord {
  employeeId: number;
  leaveTypeId: number;
  fiscalYear: number;
  openingBalance: number;
  carriedForward: number;
  accrued: number;
  adjustment: number;
  used: number;
  pending: number;
  available?: number;
  notes?: string;
}

/**
 * Leave Request
 */
export interface LeaveRequestRecord extends BaseRecord {
  requestNumber: string;
  employeeId: number;
  employeeName: string;
  employeeNumber?: string;
  department: string;
  position: string;
  leaveTypeId: number;
  leaveTypeName?: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  halfDayStart?: boolean;
  halfDayEnd?: boolean;
  reason?: string;
  contactNumber?: string;
  contactAddress?: string;
  emergencyContact?: string;
  documentPath?: string;
  status: RequestStatus;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  notes?: string;
}

/**
 * Leave Request Day
 */
export interface LeaveRequestDayRecord extends BaseRecord {
  leaveRequestId: number;
  date: string;
  isHalfDay: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  isCounted: boolean;
}

/**
 * Leave Approval
 */
export interface LeaveApprovalRecord extends BaseRecord {
  leaveRequestId: number;
  level: ApprovalLevel;
  sequence: number;
  approverId: number;
  approverName: string;
  approverRole?: string;
  action: ApprovalAction;
  comments?: string;
  approvedAt?: string;
  isRequired: boolean;
  isPending: boolean;
}

/**
 * Holiday
 */
export interface HolidayRecord extends BaseRecord {
  name: string;
  date: string;
  holidayType: HolidayType;
  fiscalYear: number;
  isRecurring: boolean;
  description?: string;
  isActive: boolean;
  applicableTo?: string;
  duration?: number;
}

/**
 * Attendance Record
 */
export interface AttendanceRecord extends BaseRecord {
  employeeId: number;
  date: string;
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  hoursWorked?: number;
  overtimeHours?: number;
  leaveRequestId?: number;
  remarks?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

/**
 * Timesheet
 */
export interface TimesheetRecord extends BaseRecord {
  employeeId: number;
  employeeName?: string;
  department?: string;
  month: number;
  year: number;
  totalWorkingDays: number;
  totalPresentDays: number;
  totalAbsentDays: number;
  totalLeaveDays: number;
  totalHolidays: number;
  totalWeekends: number;
  totalOvertimeHours: number;
  status: TimesheetStatus;
  submittedAt?: string;
  managerId?: string;
  managerApproved: boolean;
  managerApprovedAt?: string;
  hrVerifiedBy?: string;
  hrVerified: boolean;
  hrVerifiedAt?: string;
  sentToPayrollAt?: string;
  notes?: string;
}

/**
 * OIC Assignment (Officer In Charge)
 */
export interface OICAssignmentRecord extends BaseRecord {
  leaveRequestId: number;
  employeeId: number;
  employeeName?: string;
  oicEmployeeId: number;
  oicEmployeeName?: string;
  startDate: string;
  endDate: string;
  responsibilities?: string;
  status: OICStatus;
  oicAccepted: boolean;
  oicAcceptedAt?: string;
  notes?: string;
}

/**
 * Leave Adjustment
 */
export interface LeaveAdjustmentRecord extends BaseRecord {
  adjustmentNumber?: string;
  employeeId: number;
  employeeName?: string;
  leaveTypeId: number;
  leaveTypeName?: string;
  fiscalYear: number;
  adjustmentType: AdjustmentType;
  days: number;
  reason: string;
  requestedBy: string;
  status: AdjustmentStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  notes?: string;
}

/**
 * Leave Carryover Record
 */
export interface LeaveCarryoverRecord extends BaseRecord {
  employeeId: number;
  employeeName?: string;
  leaveTypeId: number;
  leaveTypeName?: string;
  fromYear: number;
  toYear: number;
  eligibleDays: number;
  carriedDays: number;
  forfeitedDays: number;
  processedBy: string;
  processedAt: string;
  notes?: string;
}
