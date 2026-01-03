/**
 * Leave Management Module Service
 *
 * Comprehensive leave management system covering:
 * - Leave Types & Policies
 * - Employee Leave Balances
 * - Leave Requests & Approvals
 * - Holidays & Attendance
 * - Timesheets
 * - OIC (Officer In Charge) Assignments
 * - Leave Adjustments & Carryovers
 * - Leave Calendar & Reports
 */

import { createCRUDService } from './core/crud';
import { getDB } from './core/connection';
import type {
  LeaveTypeRecord,
  LeavePolicyRecord,
  EmployeeLeaveBalanceRecord,
  LeaveRequestRecord,
  LeaveRequestDayRecord,
  LeaveApprovalRecord,
  HolidayRecord,
  AttendanceRecord,
  TimesheetRecord,
  OICAssignmentRecord,
  LeaveAdjustmentRecord,
  LeaveCarryoverRecord,
  RequestStatus,
  TimesheetStatus,
  AdjustmentType,
} from '../../types/modules/leave';
import type {
  AllowanceTypeRecord,
  EmployeeRewardRecord,
  CTORecord,
} from '../../types/modules/legacy';

// ========== LEAVE TYPES ==========

const leaveTypesCRUD = createCRUDService<LeaveTypeRecord>('leaveTypes');

export const leaveTypesDB = {
  ...leaveTypesCRUD,

  /**
   * Get active leave types
   */
  async getActive(): Promise<LeaveTypeRecord[]> {
    return leaveTypesCRUD.getByIndex('isActive', true);
  },

  /**
   * Get by status
   */
  async getByStatus(status: string): Promise<LeaveTypeRecord[]> {
    return leaveTypesCRUD.getByIndex('status', status);
  },
};

// ========== LEAVE POLICIES ==========

const leavePoliciesCRUD = createCRUDService<LeavePolicyRecord>('leavePolicies');

export const leavePoliciesDB = {
  ...leavePoliciesCRUD,

  /**
   * Get policies by fiscal year
   */
  async getByFiscalYear(year: number): Promise<LeavePolicyRecord[]> {
    const all = await this.getAll();
    return all.filter(p => p.fiscalYear === year && p.isActive);
  },

  /**
   * Get active policies
   */
  async getActive(): Promise<LeavePolicyRecord[]> {
    return leavePoliciesCRUD.getByIndex('isActive', true);
  },
};

// ========== LEAVE BALANCES ==========

const leaveBalancesCRUD = createCRUDService<EmployeeLeaveBalanceRecord>('employeeLeaveBalances');

export const leaveBalancesDB = {
  ...leaveBalancesCRUD,

  /**
   * Get balances by employee ID
   */
  async getByEmployee(employeeId: number, fiscalYear?: number): Promise<EmployeeLeaveBalanceRecord[]> {
    const all = await leaveBalancesCRUD.getByIndex('employeeId', employeeId);
    if (fiscalYear) {
      return all.filter(b => b.fiscalYear === fiscalYear);
    }
    return all;
  },

  /**
   * Get balance by employee, leave type, and fiscal year
   */
  async getByEmployeeAndType(
    employeeId: number,
    leaveTypeId: number,
    fiscalYear: number
  ): Promise<EmployeeLeaveBalanceRecord | undefined> {
    const all = await this.getByEmployee(employeeId);
    return all.find(b => b.leaveTypeId === leaveTypeId && b.fiscalYear === fiscalYear);
  },

  /**
   * Calculate available balance
   */
  calculateAvailable(balance: EmployeeLeaveBalanceRecord): number {
    return (
      (balance.openingBalance || 0) +
      (balance.carriedForward || 0) +
      (balance.accrued || 0) +
      (balance.adjustment || 0) -
      (balance.used || 0) -
      (balance.pending || 0)
    );
  },

  /**
   * Initialize balances for an employee
   */
  async initializeForEmployee(employeeId: number, fiscalYear: number): Promise<EmployeeLeaveBalanceRecord[]> {
    const db = await getDB();
    const leaveTypes = await leaveTypesDB.getActive();
    const policies = await leavePoliciesDB.getByFiscalYear(fiscalYear);

    const results: EmployeeLeaveBalanceRecord[] = [];
    for (const leaveType of leaveTypes) {
      const policy = policies.find(p => p.leaveTypeId === leaveType.id);
      const entitlement = policy?.entitlementDays || leaveType.daysAllowed || 0;

      const existing = await this.getByEmployeeAndType(employeeId, leaveType.id, fiscalYear);
      if (!existing) {
        const balance = await this.create({
          employeeId,
          leaveTypeId: leaveType.id,
          fiscalYear,
          openingBalance: entitlement,
          carriedForward: 0,
          accrued: 0,
          adjustment: 0,
          used: 0,
          pending: 0,
        });
        results.push(balance);
      }
    }
    return results;
  },

  /**
   * Adjust balance (credit or debit)
   */
  async adjustBalance(
    employeeId: number,
    leaveTypeId: number,
    fiscalYear: number,
    days: number,
    type: AdjustmentType = 'debit'
  ): Promise<EmployeeLeaveBalanceRecord> {
    const balance = await this.getByEmployeeAndType(employeeId, leaveTypeId, fiscalYear);
    if (!balance) throw new Error('Balance not found');

    const adjustmentValue = type === 'credit' ? Math.abs(days) : -Math.abs(days);
    return this.update(balance.id, {
      adjustment: (balance.adjustment || 0) + adjustmentValue,
    });
  },

  /**
   * Use leave (deduct from used)
   */
  async useLeave(
    employeeId: number,
    leaveTypeId: number,
    fiscalYear: number,
    days: number
  ): Promise<EmployeeLeaveBalanceRecord> {
    const balance = await this.getByEmployeeAndType(employeeId, leaveTypeId, fiscalYear);
    if (!balance) throw new Error('Balance not found');

    return this.update(balance.id, {
      used: (balance.used || 0) + days,
    });
  },

  /**
   * Update pending leave days
   */
  async updatePending(
    employeeId: number,
    leaveTypeId: number,
    fiscalYear: number,
    days: number
  ): Promise<EmployeeLeaveBalanceRecord> {
    const balance = await this.getByEmployeeAndType(employeeId, leaveTypeId, fiscalYear);
    if (!balance) throw new Error('Balance not found');

    return this.update(balance.id, {
      pending: (balance.pending || 0) + days,
    });
  },
};

// ========== LEAVE REQUESTS ==========

const leaveRequestsCRUD = createCRUDService<LeaveRequestRecord>('leaveRequests');

export const leaveRequestsDB = {
  ...leaveRequestsCRUD,

  /**
   * Get requests by employee
   */
  async getByEmployee(employeeId: number): Promise<LeaveRequestRecord[]> {
    return leaveRequestsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get requests by status
   */
  async getByStatus(status: RequestStatus): Promise<LeaveRequestRecord[]> {
    return leaveRequestsCRUD.getByIndex('status', status);
  },

  /**
   * Get requests by leave type
   */
  async getByLeaveType(leaveTypeId: number): Promise<LeaveRequestRecord[]> {
    return leaveRequestsCRUD.getByIndex('leaveTypeId', leaveTypeId);
  },

  /**
   * Get requests by date range
   */
  async getByDateRange(startDate: string, endDate: string): Promise<LeaveRequestRecord[]> {
    const all = await this.getAll();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return all.filter(r => {
      const reqStart = new Date(r.startDate);
      const reqEnd = new Date(r.endDate);
      return (
        (reqStart >= start && reqStart <= end) ||
        (reqEnd >= start && reqEnd <= end) ||
        (reqStart <= start && reqEnd >= end)
      );
    });
  },

  /**
   * Submit a leave request
   */
  async submit(id: number): Promise<LeaveRequestRecord> {
    return this.update(id, {
      status: 'pending',
      submittedAt: new Date().toISOString(),
    });
  },

  /**
   * Approve a leave request
   */
  async approve(id: number): Promise<LeaveRequestRecord> {
    const request = await this.getById(id);
    if (!request) throw new Error('Leave request not found');

    // Move from pending to used
    await leaveBalancesDB.updatePending(
      request.employeeId,
      request.leaveTypeId,
      new Date(request.startDate).getFullYear(),
      -request.totalDays
    );
    await leaveBalancesDB.useLeave(
      request.employeeId,
      request.leaveTypeId,
      new Date(request.startDate).getFullYear(),
      request.totalDays
    );

    return this.update(id, {
      status: 'approved',
      approvedAt: new Date().toISOString(),
    });
  },

  /**
   * Reject a leave request
   */
  async reject(id: number): Promise<LeaveRequestRecord> {
    const request = await this.getById(id);
    if (!request) throw new Error('Leave request not found');

    // Remove from pending
    await leaveBalancesDB.updatePending(
      request.employeeId,
      request.leaveTypeId,
      new Date(request.startDate).getFullYear(),
      -request.totalDays
    );

    return this.update(id, {
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
    });
  },

  /**
   * Cancel a leave request
   */
  async cancel(id: number, reason: string): Promise<LeaveRequestRecord> {
    const request = await this.getById(id);
    if (!request) throw new Error('Leave request not found');

    // If approved, restore to balance
    if (request.status === 'approved') {
      await leaveBalancesDB.useLeave(
        request.employeeId,
        request.leaveTypeId,
        new Date(request.startDate).getFullYear(),
        -request.totalDays
      );
    } else if (request.status === 'pending') {
      // Remove from pending
      await leaveBalancesDB.updatePending(
        request.employeeId,
        request.leaveTypeId,
        new Date(request.startDate).getFullYear(),
        -request.totalDays
      );
    }

    return this.update(id, {
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      cancellationReason: reason,
    });
  },

  /**
   * Mark leave as taken
   */
  async markTaken(id: number): Promise<LeaveRequestRecord> {
    return this.update(id, {
      status: 'taken',
    });
  },

  /**
   * Mark leave as completed
   */
  async markCompleted(id: number): Promise<LeaveRequestRecord> {
    return this.update(id, {
      status: 'completed',
    });
  },
};

// ========== LEAVE REQUEST DAYS ==========

const leaveRequestDaysCRUD = createCRUDService<LeaveRequestDayRecord>('leaveRequestDays');

export const leaveRequestDaysDB = {
  ...leaveRequestDaysCRUD,

  /**
   * Get days by leave request
   */
  async getByRequest(leaveRequestId: number): Promise<LeaveRequestDayRecord[]> {
    return leaveRequestDaysCRUD.getByIndex('leaveRequestId', leaveRequestId);
  },
};

// ========== LEAVE APPROVALS ==========

const leaveApprovalsCRUD = createCRUDService<LeaveApprovalRecord>('leaveApprovals');

export const leaveApprovalsDB = {
  ...leaveApprovalsCRUD,

  /**
   * Get approvals by leave request
   */
  async getByRequest(leaveRequestId: number): Promise<LeaveApprovalRecord[]> {
    return leaveApprovalsCRUD.getByIndex('leaveRequestId', leaveRequestId);
  },

  /**
   * Get pending approvals for an approver
   */
  async getPendingForApprover(approverId: number): Promise<LeaveApprovalRecord[]> {
    const all = await this.getAll();
    return all.filter(a => a.approverId === approverId && a.isPending);
  },
};

// ========== HOLIDAYS ==========

const holidaysCRUD = createCRUDService<HolidayRecord>('holidays');

export const holidaysDB = {
  ...holidaysCRUD,

  /**
   * Get holidays by year
   */
  async getByYear(year: number): Promise<HolidayRecord[]> {
    const all = await this.getAll();
    return all.filter(h => h.fiscalYear === year && h.isActive).sort((a, b) => a.date.localeCompare(b.date));
  },

  /**
   * Get holidays by date range
   */
  async getByDateRange(startDate: string, endDate: string): Promise<HolidayRecord[]> {
    const all = await this.getAll();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return all.filter(h => {
      const date = new Date(h.date);
      return date >= start && date <= end && h.isActive;
    });
  },

  /**
   * Check if a date is a holiday
   */
  async isHoliday(date: Date | string): Promise<boolean> {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    const all = await this.getAll();
    return all.some(h => h.date === dateStr && h.isActive);
  },

  /**
   * Seed default holidays for a year
   */
  async seedDefaults(year = new Date().getFullYear()): Promise<HolidayRecord[]> {
    const defaults = [
      { name: 'New Year', date: `${year}-01-01`, holidayType: 'national' as const },
      { name: 'Independence Day', date: `${year}-08-19`, holidayType: 'national' as const },
      { name: 'Victory Day', date: `${year}-04-28`, holidayType: 'national' as const },
      { name: 'Labor Day', date: `${year}-05-01`, holidayType: 'national' as const },
    ];

    const existing = await this.getByYear(year);
    const results: HolidayRecord[] = [];

    for (const holiday of defaults) {
      if (!existing.some(e => e.date === holiday.date)) {
        const created = await this.create({
          ...holiday,
          fiscalYear: year,
          isRecurring: true,
          isActive: true,
        });
        results.push(created);
      }
    }
    return results;
  },
};

// ========== ATTENDANCE ==========

const attendanceCRUD = createCRUDService<AttendanceRecord>('attendance');

export const attendanceDB = {
  ...attendanceCRUD,

  /**
   * Get attendance by employee
   */
  async getByEmployee(employeeId: number): Promise<AttendanceRecord[]> {
    return attendanceCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get attendance by date
   */
  async getByDate(date: string): Promise<AttendanceRecord[]> {
    return attendanceCRUD.getByIndex('date', date);
  },

  /**
   * Get attendance by employee and date range
   */
  async getByEmployeeAndDateRange(
    employeeId: number,
    startDate: string,
    endDate: string
  ): Promise<AttendanceRecord[]> {
    const all = await this.getByEmployee(employeeId);
    const start = new Date(startDate);
    const end = new Date(endDate);

    return all.filter(a => {
      const date = new Date(a.date);
      return date >= start && date <= end;
    });
  },

  /**
   * Verify attendance record
   */
  async verify(id: number, verifiedBy: string): Promise<AttendanceRecord> {
    return this.update(id, {
      verifiedBy,
      verifiedAt: new Date().toISOString(),
    });
  },
};

// ========== TIMESHEETS ==========

const timesheetsCRUD = createCRUDService<TimesheetRecord>('timesheets');

export const timesheetsDB = {
  ...timesheetsCRUD,

  /**
   * Get timesheets by employee
   */
  async getByEmployee(employeeId: number): Promise<TimesheetRecord[]> {
    return timesheetsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get timesheets by month and year
   */
  async getByMonthYear(month: number, year: number): Promise<TimesheetRecord[]> {
    const all = await this.getAll();
    return all.filter(t => t.month === month && t.year === year);
  },

  /**
   * Get timesheet by employee, month, and year
   */
  async getByEmployeeMonthYear(
    employeeId: number,
    month: number,
    year: number
  ): Promise<TimesheetRecord | undefined> {
    const all = await this.getByEmployee(employeeId);
    return all.find(t => t.month === month && t.year === year);
  },

  /**
   * Get timesheets by status
   */
  async getByStatus(status: TimesheetStatus): Promise<TimesheetRecord[]> {
    return timesheetsCRUD.getByIndex('status', status);
  },

  /**
   * Submit timesheet
   */
  async submit(id: number): Promise<TimesheetRecord> {
    return this.update(id, {
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    });
  },

  /**
   * Manager approve timesheet
   */
  async managerApprove(id: number, managerId: string): Promise<TimesheetRecord> {
    return this.update(id, {
      status: 'manager_approved',
      managerId,
      managerApproved: true,
      managerApprovedAt: new Date().toISOString(),
    });
  },

  /**
   * HR verify timesheet
   */
  async hrVerify(id: number, hrUserId: string): Promise<TimesheetRecord> {
    return this.update(id, {
      status: 'hr_verified',
      hrVerifiedBy: hrUserId,
      hrVerified: true,
      hrVerifiedAt: new Date().toISOString(),
    });
  },

  /**
   * Send to payroll
   */
  async sendToPayroll(id: number): Promise<TimesheetRecord> {
    return this.update(id, {
      status: 'sent_to_payroll',
      sentToPayrollAt: new Date().toISOString(),
    });
  },

  /**
   * Generate timesheet for employee for a specific month
   */
  async generate(employeeId: number, month: number, year: number): Promise<TimesheetRecord> {
    // Check if already exists
    const existing = await this.getByEmployeeMonthYear(employeeId, month, year);
    if (existing) return existing;

    // Get attendance records for the month
    const attendance = await attendanceDB.getByEmployee(employeeId);
    const monthAttendance = attendance.filter(a => {
      const date = new Date(a.date);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    });

    // Calculate totals
    const daysInMonth = new Date(year, month, 0).getDate();
    let totalWorkingDays = 0;
    let totalPresentDays = 0;
    let totalAbsentDays = 0;
    let totalLeaveDays = 0;
    let totalOvertimeHours = 0;
    let totalHolidays = 0;
    let totalWeekends = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Friday-Saturday
      const isHoliday = await holidaysDB.isHoliday(date);

      if (isWeekend) {
        totalWeekends++;
      } else if (isHoliday) {
        totalHolidays++;
      } else {
        totalWorkingDays++;
        const record = monthAttendance.find(a => new Date(a.date).getDate() === day);
        if (record) {
          if (record.status === 'present') totalPresentDays++;
          else if (record.status === 'absent') totalAbsentDays++;
          else if (record.status === 'leave') totalLeaveDays++;
          totalOvertimeHours += record.overtimeHours || 0;
        }
      }
    }

    return this.create({
      employeeId,
      month,
      year,
      totalWorkingDays,
      totalPresentDays,
      totalAbsentDays,
      totalLeaveDays,
      totalOvertimeHours,
      totalHolidays,
      totalWeekends,
      status: 'draft',
      managerApproved: false,
      hrVerified: false,
    });
  },
};

// ========== OIC ASSIGNMENTS ==========

const oicAssignmentsCRUD = createCRUDService<OICAssignmentRecord>('oicAssignments');

export const oicAssignmentsDB = {
  ...oicAssignmentsCRUD,

  /**
   * Get assignment by leave request
   */
  async getByLeaveRequest(leaveRequestId: number): Promise<OICAssignmentRecord | undefined> {
    const db = await getDB();
    return db.getFromIndex('oicAssignments', 'leaveRequestId', leaveRequestId);
  },

  /**
   * Get assignments by OIC employee
   */
  async getByOIC(oicEmployeeId: number): Promise<OICAssignmentRecord[]> {
    return oicAssignmentsCRUD.getByIndex('oicEmployeeId', oicEmployeeId);
  },

  /**
   * Get assignments by employee
   */
  async getByEmployee(employeeId: number): Promise<OICAssignmentRecord[]> {
    return oicAssignmentsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Accept OIC assignment
   */
  async accept(id: number): Promise<OICAssignmentRecord> {
    return this.update(id, {
      status: 'accepted',
      oicAccepted: true,
      oicAcceptedAt: new Date().toISOString(),
    });
  },

  /**
   * Decline OIC assignment
   */
  async decline(id: number): Promise<OICAssignmentRecord> {
    return this.update(id, {
      status: 'declined',
      oicAccepted: false,
    });
  },
};

// ========== LEAVE ADJUSTMENTS ==========

const leaveAdjustmentsCRUD = createCRUDService<LeaveAdjustmentRecord>('leaveAdjustments');

export const leaveAdjustmentsDB = {
  ...leaveAdjustmentsCRUD,

  /**
   * Get adjustments by employee
   */
  async getByEmployee(employeeId: number): Promise<LeaveAdjustmentRecord[]> {
    return leaveAdjustmentsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get pending adjustments
   */
  async getPending(): Promise<LeaveAdjustmentRecord[]> {
    return leaveAdjustmentsCRUD.getByIndex('status', 'pending');
  },

  /**
   * Approve adjustment
   */
  async approve(id: number, approvedBy: string): Promise<LeaveAdjustmentRecord> {
    const adjustment = await this.getById(id);
    if (!adjustment) throw new Error('Adjustment not found');

    // Apply adjustment to balance
    await leaveBalancesDB.adjustBalance(
      adjustment.employeeId,
      adjustment.leaveTypeId,
      adjustment.fiscalYear,
      adjustment.days,
      adjustment.adjustmentType
    );

    return this.update(id, {
      status: 'approved',
      approvedBy,
      approvedAt: new Date().toISOString(),
    });
  },

  /**
   * Reject adjustment
   */
  async reject(id: number, rejectedBy: string, reason: string): Promise<LeaveAdjustmentRecord> {
    return this.update(id, {
      status: 'rejected',
      rejectedBy,
      rejectionReason: reason,
    });
  },
};

// ========== LEAVE CARRYOVERS ==========

const leaveCarryoversCRUD = createCRUDService<LeaveCarryoverRecord>('leaveCarryoverRecords');

export const leaveCarryoversDB = {
  ...leaveCarryoversCRUD,

  /**
   * Get carryovers by employee
   */
  async getByEmployee(employeeId: number): Promise<LeaveCarryoverRecord[]> {
    return leaveCarryoversCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Process year-end carryover
   */
  async processYearEnd(fromYear: number, toYear: number, processedBy: string): Promise<LeaveCarryoverRecord[]> {
    const db = await getDB();
    const employees = await db.getAll('employees');
    const leaveTypes = await leaveTypesDB.getActive();

    const results: LeaveCarryoverRecord[] = [];

    for (const employee of employees.filter((e: any) => e.status === 'active')) {
      for (const leaveType of leaveTypes.filter(lt => lt.maxCarryoverDays > 0)) {
        const balance = await leaveBalancesDB.getByEmployeeAndType(employee.id, leaveType.id, fromYear);

        if (balance) {
          const available = leaveBalancesDB.calculateAvailable(balance);
          const maxCarryover = leaveType.maxCarryoverDays || 0;
          const carriedDays = Math.min(available, maxCarryover);
          const forfeitedDays = Math.max(0, available - maxCarryover);

          // Create carryover record
          const record = await this.create({
            employeeId: employee.id,
            leaveTypeId: leaveType.id,
            fromYear,
            toYear,
            eligibleDays: available,
            carriedDays,
            forfeitedDays,
            processedBy,
            processedAt: new Date().toISOString(),
          });
          results.push(record);

          // Create new year balance with carryover
          await leaveBalancesDB.create({
            employeeId: employee.id,
            leaveTypeId: leaveType.id,
            fiscalYear: toYear,
            carriedForward: carriedDays,
            openingBalance: leaveType.daysAllowed || 0,
            accrued: 0,
            adjustment: 0,
            used: 0,
            pending: 0,
          });
        }
      }
    }

    return results;
  },
};

// ========== LEAVE CALENDAR ==========

export const leaveCalendarService = {
  /**
   * Get team calendar for specific employees and date range
   */
  async getTeamCalendar(employeeIds: number[], startDate: string, endDate: string): Promise<LeaveRequestRecord[]> {
    const all = await leaveRequestsDB.getAll();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return all.filter(r => {
      if (!employeeIds.includes(r.employeeId)) return false;
      if (!['approved', 'taken', 'completed'].includes(r.status)) return false;

      const reqStart = new Date(r.startDate);
      const reqEnd = new Date(r.endDate);

      return (
        (reqStart >= start && reqStart <= end) ||
        (reqEnd >= start && reqEnd <= end) ||
        (reqStart <= start && reqEnd >= end)
      );
    });
  },

  /**
   * Calculate working days between two dates (excluding weekends and holidays)
   */
  async getWorkingDays(startDate: string, endDate: string): Promise<number> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let workingDays = 0;

    const current = new Date(start);
    while (current <= end) {
      const dayOfWeek = current.getDay();
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Friday-Saturday
      const isHoliday = await holidaysDB.isHoliday(current);

      if (!isWeekend && !isHoliday) {
        workingDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return workingDays;
  },
};

// ========== LEAVE REPORTS ==========

export const leaveReportService = {
  /**
   * Get leave summary for fiscal year
   */
  async getLeaveSummary(fiscalYear = new Date().getFullYear()) {
    const db = await getDB();
    const requests = await leaveRequestsDB.getAll();
    const leaveTypes = await leaveTypesDB.getAll();

    const yearRequests = requests.filter(r => {
      const date = new Date(r.startDate);
      return date.getFullYear() === fiscalYear;
    });

    return {
      totalRequests: yearRequests.length,
      byStatus: {
        pending: yearRequests.filter(r => r.status === 'pending').length,
        approved: yearRequests.filter(r => r.status === 'approved').length,
        rejected: yearRequests.filter(r => r.status === 'rejected').length,
        cancelled: yearRequests.filter(r => r.status === 'cancelled').length,
        taken: yearRequests.filter(r => r.status === 'taken').length,
        completed: yearRequests.filter(r => r.status === 'completed').length,
      },
      byLeaveType: leaveTypes.map(lt => ({
        leaveType: lt.name,
        count: yearRequests.filter(r => r.leaveTypeId === lt.id).length,
        totalDays: yearRequests
          .filter(r => r.leaveTypeId === lt.id)
          .reduce((sum, r) => sum + (r.totalDays || 0), 0),
      })),
      totalDaysTaken: yearRequests
        .filter(r => ['approved', 'taken', 'completed'].includes(r.status))
        .reduce((sum, r) => sum + (r.totalDays || 0), 0),
      employeesOnLeave: [
        ...new Set(yearRequests.filter(r => r.status === 'taken').map(r => r.employeeId)),
      ].length,
    };
  },

  /**
   * Get employee yearly leave report
   */
  async getEmployeeYearly(employeeId: number, fiscalYear = new Date().getFullYear()) {
    const requests = await leaveRequestsDB.getByEmployee(employeeId);
    const balances = await leaveBalancesDB.getByEmployee(employeeId, fiscalYear);
    const leaveTypes = await leaveTypesDB.getAll();

    const yearRequests = requests.filter(r => {
      const date = new Date(r.startDate);
      return date.getFullYear() === fiscalYear;
    });

    return {
      requests: yearRequests,
      balances: balances.map(b => {
        const leaveType = leaveTypes.find(lt => lt.id === b.leaveTypeId);
        return {
          ...b,
          leaveTypeName: leaveType?.name || 'Unknown',
          available: leaveBalancesDB.calculateAvailable(b),
        };
      }),
      totalDaysTaken: yearRequests
        .filter(r => ['approved', 'taken', 'completed'].includes(r.status))
        .reduce((sum, r) => sum + (r.totalDays || 0), 0),
    };
  },

  /**
   * Get department leave summary
   */
  async getDepartmentSummary(departmentId: number, fiscalYear = new Date().getFullYear()) {
    const db = await getDB();
    const employees = await db.getAll('employees');
    const requests = await leaveRequestsDB.getAll();

    const deptEmployees = employees.filter((e: any) => e.departmentId === departmentId);
    const employeeIds = deptEmployees.map((e: any) => e.id);

    const deptRequests = requests.filter(r => {
      const date = new Date(r.startDate);
      return employeeIds.includes(r.employeeId) && date.getFullYear() === fiscalYear;
    });

    return {
      totalEmployees: deptEmployees.length,
      totalRequests: deptRequests.length,
      totalDaysTaken: deptRequests
        .filter(r => ['approved', 'taken', 'completed'].includes(r.status))
        .reduce((sum, r) => sum + (r.totalDays || 0), 0),
      pendingRequests: deptRequests.filter(r => r.status === 'pending').length,
      employeesCurrentlyOnLeave: deptRequests.filter(r => {
        const today = new Date();
        const start = new Date(r.startDate);
        const end = new Date(r.endDate);
        return r.status === 'taken' && today >= start && today <= end;
      }).length,
    };
  },

  /**
   * Get absenteeism report for date range
   */
  async getAbsenteeismReport(startDate: string, endDate: string) {
    const db = await getDB();
    const attendance = await attendanceDB.getAll();
    const employees = await db.getAll('employees');

    const start = new Date(startDate);
    const end = new Date(endDate);

    const periodAttendance = attendance.filter(a => {
      const date = new Date(a.date);
      return date >= start && date <= end;
    });

    const employeeAbsenteeism = employees
      .filter((e: any) => e.status === 'active')
      .map((e: any) => {
        const empAttendance = periodAttendance.filter(a => a.employeeId === e.id);
        const absentDays = empAttendance.filter(a => a.status === 'absent').length;
        const leaveDays = empAttendance.filter(a => a.status === 'leave').length;
        const presentDays = empAttendance.filter(a => a.status === 'present').length;
        const totalRecords = empAttendance.length;

        return {
          employeeId: e.id,
          employeeName: `${e.firstName} ${e.lastName}`,
          department: e.department,
          absentDays,
          leaveDays,
          presentDays,
          totalRecords,
          absenteeismRate: totalRecords > 0 ? ((absentDays / totalRecords) * 100).toFixed(2) : 0,
        };
      })
      .sort((a: any, b: any) => b.absentDays - a.absentDays);

    return {
      period: { startDate, endDate },
      totalAbsences: employeeAbsenteeism.reduce((sum: number, e: any) => sum + e.absentDays, 0),
      averageAbsenteeismRate: (
        employeeAbsenteeism.reduce((sum: number, e: any) => sum + parseFloat(e.absenteeismRate), 0) /
        employeeAbsenteeism.length
      ).toFixed(2),
      employeeBreakdown: employeeAbsenteeism,
    };
  },
};

// ========== LEGACY BACKWARD COMPATIBILITY ==========

/**
 * Legacy allowance types (backward compatibility)
 * Maps to allowanceTypes store
 */
const allowanceTypesCRUD = createCRUDService<AllowanceTypeRecord>('allowanceTypes');

export const allowanceTypeDB = {
  ...allowanceTypesCRUD,

  /**
   * Get active allowance types
   */
  async getActive(): Promise<AllowanceTypeRecord[]> {
    return allowanceTypesCRUD.getByIndex('isActive', true);
  },
};

/**
 * Legacy employee rewards (backward compatibility)
 * Maps to employeeRewards store
 */
const employeeRewardsCRUD = createCRUDService<EmployeeRewardRecord>('employeeRewards');

export const employeeRewardDB = {
  ...employeeRewardsCRUD,

  /**
   * Get rewards by employee ID
   */
  async getByEmployee(employeeId: number): Promise<EmployeeRewardRecord[]> {
    return employeeRewardsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get rewards by reward type
   */
  async getByType(rewardType: string): Promise<EmployeeRewardRecord[]> {
    return employeeRewardsCRUD.getByIndex('rewardType', rewardType);
  },
};

/**
 * Legacy CTO (Compensatory Time Off) records (backward compatibility)
 * Maps to ctoRecords store
 */
const ctoRecordsCRUD = createCRUDService<CTORecord>('ctoRecords');

export const ctoRecordDB = {
  ...ctoRecordsCRUD,

  /**
   * Get CTO records by employee ID
   */
  async getByEmployee(employeeId: number): Promise<CTORecord[]> {
    return ctoRecordsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get CTO records by status
   */
  async getByStatus(status: string): Promise<CTORecord[]> {
    return ctoRecordsCRUD.getByIndex('status', status);
  },
};

/**
 * Legacy leave approval DB (backward compatibility alias)
 * Maps to existing leaveApprovalsDB
 */
export const leaveApprovalDB = leaveApprovalsDB;

// ========== MAIN EXPORT ==========

/**
 * Leave Management Service - Main entry point
 */
export const leaveManagementService = {
  // Core leave management
  leaveTypes: leaveTypesDB,
  policies: leavePoliciesDB,
  balances: leaveBalancesDB,

  // Leave requests
  requests: leaveRequestsDB,
  requestDays: leaveRequestDaysDB,
  approvals: leaveApprovalsDB,

  // Time management
  holidays: holidaysDB,
  attendance: attendanceDB,
  timesheets: timesheetsDB,

  // Additional features
  oic: oicAssignmentsDB,
  adjustments: leaveAdjustmentsDB,
  carryovers: leaveCarryoversDB,

  // Utilities
  calendar: leaveCalendarService,
  reports: leaveReportService,
};

export default leaveManagementService;
