/**
 * Core HR Module Types
 *
 * Type definitions for core HR entities:
 * - Employees
 * - Departments
 * - Positions
 * - Offices
 * - Grades
 * - Employee Types
 * - Work Schedules
 * - Document Types
 * - Template Documents
 * - Users, Roles, Permissions
 */

import type { BaseRecord, CreateIndex } from "../db/base";

// ========== EMPLOYEES ==========

export interface EmployeeRecord extends BaseRecord {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  office: string;
  status: string;
  employmentType: string;
  gender: string;
  hireDate: string;
  dateOfBirth?: string;
  nationality?: string;
  // Legacy snake_case properties (for backward compatibility)
  full_name?: string;
  project?: string;
  employment_type?: string;
  date_of_hire?: string;
  phone_primary?: string;
  personal_email?: string;
  // Allow additional dynamic properties
  [key: string]: unknown;
}

export interface EmployeeRecordIndex {
  employeeId: string;
  email: string;
  department: string;
  status: string;
  createdAt: string;
}

export const EMPLOYEE_STATUS = {
  ACTIVE: "active",
  PROBATION: "probation",
  SUSPENDED: "suspended",
  ON_LEAVE: "on_leave",
  SEPARATED: "separated",
  TERMINATED: "terminated",
} as const;

export type EmployeeStatus =
  (typeof EMPLOYEE_STATUS)[keyof typeof EMPLOYEE_STATUS];

export const EMPLOYMENT_TYPE = {
  CORE: "core",
  PROJECT: "project",
  CONSULTANT: "consultant",
  PART_TIME: "part_time",
  INTERNSHIP: "internship",
  VOLUNTEER: "volunteer",
  DAILY_WAGE: "daily_wage",
} as const;

export type EmploymentType =
  (typeof EMPLOYMENT_TYPE)[keyof typeof EMPLOYMENT_TYPE];

export const GENDER = {
  MALE: "male",
  FEMALE: "female",
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

// ========== EMPLOYEE POSITION HISTORY ==========

export interface EmployeePositionHistoryRecord extends BaseRecord {
  employeeId: number;
  position: string;
  department: string;
  project?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

// ========== DEPARTMENTS ==========

export interface DepartmentRecord extends BaseRecord {
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}

// ========== POSITIONS ==========

export interface PositionRecord extends BaseRecord {
  title: string;
  department: string;
  description?: string;
}

// ========== OFFICES ==========

export interface OfficeRecord extends BaseRecord {
  name: string;
  code: string;
  type: string;
  isActive: boolean;
}

export const OFFICE_TYPE = {
  HEADQUARTERS: "headquarters",
  REGIONAL: "regional",
  FIELD: "field",
  SATELLITE: "satellite",
} as const;

export type OfficeType = (typeof OFFICE_TYPE)[keyof typeof OFFICE_TYPE];

// ========== GRADES ==========

export interface GradeRecord extends BaseRecord {
  name: string;
  level?: number;
  description?: string;
}

// ========== EMPLOYEE TYPES ==========

export interface EmployeeTypeRecord extends BaseRecord {
  name: string;
  description?: string;
}

// ========== WORK SCHEDULES ==========

export interface WorkScheduleRecord extends BaseRecord {
  name: string;
  description?: string;
}

// ========== DOCUMENT TYPES ==========

export interface DocumentTypeRecord extends BaseRecord {
  name: string;
  category?: string;
}

// ========== TEMPLATE DOCUMENTS ==========

export interface TemplateDocumentRecord extends BaseRecord {
  name: string;
  category: string;
  fileUrl?: string;
}

// ========== USERS ==========

export interface UserRecord extends BaseRecord {
  email: string;
  username: string;
  roleId: number;
  status: string;
  employeeId?: number;
}

export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

// ========== ROLES ==========

export interface RoleRecord extends BaseRecord {
  name: string;
}

// ========== PERMISSIONS ==========

export interface PermissionRecord extends BaseRecord {
  name: string;
  module: string;
}

// ========== ROLE PERMISSIONS ==========

export interface RolePermissionRecord extends BaseRecord {
  roleId: number;
  permissionId: number;
}

// ========== ATTENDANCE ==========

export interface AttendanceRecord extends BaseRecord {
  employeeId: number;
  date: string;
  status: string;
}

export const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  HALF_DAY: "half_day",
  ON_LEAVE: "on_leave",
  HOLIDAY: "holiday",
  WEEKEND: "weekend",
} as const;

export type AttendanceStatus =
  (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];
