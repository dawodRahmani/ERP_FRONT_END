/**
 * Payroll Module Service
 *
 * Comprehensive payroll processing system covering:
 * - Payroll Periods (multi-stage workflow)
 * - Salary Structures & Components
 * - Employee Salary Details & Allowances
 * - Payroll Entry Calculation
 * - Salary Advances & Repayments
 * - Employee Loans & Repayments
 * - Overtime Management
 * - Payslip Generation
 * - Bank Transfers & Cash Payments
 */

import { createCRUDService } from './core/crud';
import { generateFormattedCode } from './core/utils';
import { getDB } from './core/connection';
import type {
  PayrollPeriodRecord,
  SalaryStructureRecord,
  EmployeeSalaryDetailRecord,
  EmployeeAllowanceRecord,
  PayrollEntryRecord,
  SalaryAdvanceRecord,
  AdvanceRepaymentRecord,
  EmployeeLoanRecord,
  LoanRepaymentRecord,
  OvertimeRecord,
  PayslipRecord,
  BankTransferRecord,
  CashPaymentRecord,
  PayrollStatus,
  AdvanceStatus,
  LoanStatus,
  OvertimeStatus,
} from '@/types/modules/payroll';

// ========== PAYROLL PERIODS ==========

const payrollPeriodsCRUD = createCRUDService<PayrollPeriodRecord>('payrollPeriods');

export const payrollPeriodsDB = {
  ...payrollPeriodsCRUD,

  /**
   * Generate unique period code (e.g., "2024-01")
   */
  async generatePeriodCode(year: number, month: number): Promise<string> {
    return `${year}-${String(month).padStart(2, '0')}`;
  },

  /**
   * Get periods by status
   */
  async getByStatus(status: PayrollStatus): Promise<PayrollPeriodRecord[]> {
    return payrollPeriodsCRUD.getByIndex('status', status);
  },

  /**
   * Get period by year and month
   */
  async getByYearMonth(year: number, month: number): Promise<PayrollPeriodRecord | undefined> {
    const db = await getDB();
    const tx = db.transaction('payrollPeriods', 'readonly');
    const store = tx.objectStore('payrollPeriods');
    const all = await store.getAll();
    return all.find(p => p.year === year && p.month === month);
  },

  /**
   * Initiate a payroll period (draft → collecting)
   */
  async initiate(id: number): Promise<PayrollPeriodRecord> {
    return this.update(id, {
      status: 'collecting',
      initiatedAt: new Date().toISOString(),
    });
  },

  /**
   * Submit to HR review (collecting → hr_review)
   */
  async submitToHR(id: number): Promise<PayrollPeriodRecord> {
    return this.update(id, {
      status: 'hr_review',
    });
  },

  /**
   * HR submit to finance (hr_review → finance_review)
   */
  async hrSubmit(id: number): Promise<PayrollPeriodRecord> {
    return this.update(id, {
      status: 'finance_review',
      hrSubmittedAt: new Date().toISOString(),
    });
  },

  /**
   * Finance verify and send for approval (finance_review → pending_approval)
   */
  async financeVerify(id: number): Promise<PayrollPeriodRecord> {
    return this.update(id, {
      status: 'pending_approval',
      financeVerifiedAt: new Date().toISOString(),
    });
  },

  /**
   * Approve payroll period (pending_approval → approved)
   */
  async approve(id: number): Promise<PayrollPeriodRecord> {
    return this.update(id, {
      status: 'approved',
      approvedAt: new Date().toISOString(),
    });
  },

  /**
   * Start disbursement (approved → disbursing)
   */
  async startDisbursement(id: number): Promise<PayrollPeriodRecord> {
    return this.update(id, {
      status: 'disbursing',
    });
  },

  /**
   * Complete payroll period (disbursing → completed)
   */
  async complete(id: number): Promise<PayrollPeriodRecord> {
    return this.update(id, {
      status: 'completed',
      disbursedAt: new Date().toISOString(),
    });
  },

  /**
   * Lock payroll period (completed → locked)
   */
  async lock(id: number): Promise<PayrollPeriodRecord> {
    return this.update(id, {
      status: 'locked',
      lockedAt: new Date().toISOString(),
    });
  },

  /**
   * Calculate totals for a payroll period
   */
  async calculateTotals(periodId: number): Promise<{
    totalGross: number;
    totalDeductions: number;
    totalNet: number;
    totalEmployees: number;
  }> {
    const entries = await payrollEntriesDB.getByPeriod(periodId);

    const totalGross = entries.reduce((sum, e) => sum + e.grossSalary, 0);
    const totalDeductions = entries.reduce((sum, e) => sum + e.totalDeductions, 0);
    const totalNet = entries.reduce((sum, e) => sum + e.netSalary, 0);
    const totalEmployees = entries.length;

    await this.update(periodId, {
      totalGross,
      totalDeductions,
      totalNet,
      totalEmployees,
    });

    return { totalGross, totalDeductions, totalNet, totalEmployees };
  },
};

// ========== SALARY STRUCTURES ==========

const salaryStructuresCRUD = createCRUDService<SalaryStructureRecord>('salaryStructures');

export const salaryStructuresDB = {
  ...salaryStructuresCRUD,

  /**
   * Get active salary components
   */
  async getActive(): Promise<SalaryStructureRecord[]> {
    return salaryStructuresCRUD.getByIndex('isActive', true);
  },

  /**
   * Get components by type (earning/deduction)
   */
  async getByType(componentType: string): Promise<SalaryStructureRecord[]> {
    return salaryStructuresCRUD.getByIndex('componentType', componentType);
  },
};

// ========== EMPLOYEE SALARY DETAILS ==========

const employeeSalaryDetailsCRUD = createCRUDService<EmployeeSalaryDetailRecord>('employeeSalaryDetails');

export const employeeSalaryDetailsDB = {
  ...employeeSalaryDetailsCRUD,

  /**
   * Get salary details by employee ID
   */
  async getByEmployee(employeeId: number): Promise<EmployeeSalaryDetailRecord[]> {
    return employeeSalaryDetailsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get current salary for an employee
   */
  async getCurrentSalary(employeeId: number): Promise<EmployeeSalaryDetailRecord | undefined> {
    const db = await getDB();
    return db.getFromIndex('employeeSalaryDetails', 'employeeId_isCurrent', [employeeId, true]);
  },
};

// ========== EMPLOYEE ALLOWANCES ==========

const employeeAllowancesCRUD = createCRUDService<EmployeeAllowanceRecord>('employeeAllowances');

export const employeeAllowancesDB = {
  ...employeeAllowancesCRUD,

  /**
   * Get allowances by employee ID
   */
  async getByEmployee(employeeId: number): Promise<EmployeeAllowanceRecord[]> {
    return employeeAllowancesCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get active allowances for an employee
   */
  async getActiveByEmployee(employeeId: number): Promise<EmployeeAllowanceRecord[]> {
    const db = await getDB();
    const all = await db.getAllFromIndex('employeeAllowances', 'employeeId', employeeId);
    return all.filter(a => a.isActive);
  },
};

// ========== PAYROLL ENTRIES ==========

const payrollEntriesCRUD = createCRUDService<PayrollEntryRecord>('payrollEntries');

export const payrollEntriesDB = {
  ...payrollEntriesCRUD,

  /**
   * Get entries by payroll period
   */
  async getByPeriod(payrollPeriodId: number): Promise<PayrollEntryRecord[]> {
    return payrollEntriesCRUD.getByIndex('payrollPeriodId', payrollPeriodId);
  },

  /**
   * Get entries by employee
   */
  async getByEmployee(employeeId: number): Promise<PayrollEntryRecord[]> {
    return payrollEntriesCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get entry by period and employee
   */
  async getByPeriodAndEmployee(
    payrollPeriodId: number,
    employeeId: number
  ): Promise<PayrollEntryRecord | undefined> {
    const db = await getDB();
    return db.getFromIndex('payrollEntries', 'payrollPeriodId_employeeId', [payrollPeriodId, employeeId]);
  },

  /**
   * Calculate tax based on gross salary (progressive rates)
   */
  calculateTax(grossSalary: number): number {
    let tax = 0;
    if (grossSalary <= 5000) {
      tax = 0;
    } else if (grossSalary <= 12500) {
      tax = (grossSalary - 5000) * 0.02;
    } else if (grossSalary <= 100000) {
      tax = 7500 * 0.02 + (grossSalary - 12500) * 0.1;
    } else {
      tax = 7500 * 0.02 + 87500 * 0.1 + (grossSalary - 100000) * 0.2;
    }
    return Math.round(tax);
  },

  /**
   * Calculate complete payroll entry for an employee
   */
  async calculate(
    payrollPeriodId: number,
    employeeId: number,
    attendanceData: {
      presentDays: number;
      absentDays: number;
      leaveDays: number;
    }
  ): Promise<Partial<PayrollEntryRecord>> {
    // Get period data
    const period = await payrollPeriodsDB.getById(payrollPeriodId);
    if (!period) throw new Error('Payroll period not found');

    // Get employee salary
    const salary = await employeeSalaryDetailsDB.getCurrentSalary(employeeId);
    if (!salary) throw new Error('Employee salary not found');

    const basicSalary = salary.basicSalary;
    const workingDays = period.workingDays;
    const { presentDays, absentDays, leaveDays } = attendanceData;

    // Calculate prorated salary
    const proratedSalary = Math.round((basicSalary / workingDays) * presentDays);

    // Get allowances
    const allowances = await employeeAllowancesDB.getActiveByEmployee(employeeId);
    const otherAllowances = allowances.reduce((sum, a) => sum + a.amount, 0);

    // Get overtime
    const overtimeRecords = await overtimeDB.getByEmployeeAndPeriod(employeeId, period.year, period.month);
    const overtimeHours = overtimeRecords.reduce((sum, ot) => sum + (ot.approvedHours || 0), 0);
    const overtimeAmount = overtimeRecords.reduce((sum, ot) => sum + (ot.approvedAmount || 0), 0);

    // Calculate gross salary
    const grossSalary = proratedSalary + otherAllowances + overtimeAmount;

    // Calculate tax
    const taxAmount = this.calculateTax(grossSalary);

    // Get advance deduction
    const advances = await salaryAdvancesDB.getActiveByEmployee(employeeId);
    const advanceDeduction = advances.reduce((sum, a) => sum + (a.monthlyDeduction || 0), 0);

    // Get loan deduction
    const loans = await employeeLoansDB.getActiveByEmployee(employeeId);
    const loanDeduction = loans.reduce((sum, l) => sum + (l.monthlyInstallment || 0), 0);

    // Calculate absence deduction
    const absenceDeduction = Math.round((basicSalary / workingDays) * absentDays);

    // Total deductions
    const totalDeductions = taxAmount + advanceDeduction + loanDeduction + absenceDeduction;

    // Net salary
    const netSalary = grossSalary - totalDeductions;

    return {
      payrollPeriodId,
      employeeId,
      basicSalary,
      currency: salary.currency,
      workingDays,
      presentDays,
      absentDays,
      leaveDays,
      proratedSalary,
      overtimeHours,
      overtimeAmount,
      otherAllowances,
      grossSalary,
      taxAmount,
      advanceDeduction,
      loanDeduction,
      absenceDeduction,
      totalDeductions,
      netSalary,
      status: 'calculated',
    };
  },

  /**
   * Verify a payroll entry
   */
  async verify(id: number): Promise<PayrollEntryRecord> {
    return this.update(id, {
      status: 'verified',
    });
  },

  /**
   * Approve a payroll entry
   */
  async approve(id: number): Promise<PayrollEntryRecord> {
    return this.update(id, {
      status: 'approved',
    });
  },

  /**
   * Mark as paid
   */
  async markPaid(id: number, paymentReference: string): Promise<PayrollEntryRecord> {
    return this.update(id, {
      status: 'paid',
      paidAt: new Date().toISOString(),
      paymentReference,
    });
  },
};

// ========== SALARY ADVANCES ==========

const salaryAdvancesCRUD = createCRUDService<SalaryAdvanceRecord>('salaryAdvances');

export const salaryAdvancesDB = {
  ...salaryAdvancesCRUD,

  /**
   * Generate unique advance number (ADV-YYYY-####)
   */
  async generateAdvanceNumber(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('ADV', all.length + 1, true, 4);
  },

  /**
   * Get advances by employee
   */
  async getByEmployee(employeeId: number): Promise<SalaryAdvanceRecord[]> {
    return salaryAdvancesCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get advances by status
   */
  async getByStatus(status: AdvanceStatus): Promise<SalaryAdvanceRecord[]> {
    return salaryAdvancesCRUD.getByIndex('status', status);
  },

  /**
   * Get active advances for an employee (approved, disbursed, or repaying)
   */
  async getActiveByEmployee(employeeId: number): Promise<SalaryAdvanceRecord[]> {
    const all = await this.getByEmployee(employeeId);
    return all.filter(a => ['approved', 'disbursed', 'repaying'].includes(a.status));
  },

  /**
   * Approve an advance
   */
  async approve(
    id: number,
    amountApproved: number,
    approvedBy: string
  ): Promise<SalaryAdvanceRecord> {
    const advance = await this.getById(id);
    if (!advance) throw new Error('Advance not found');

    const monthlyDeduction = Math.ceil(amountApproved / advance.repaymentMonths);

    return this.update(id, {
      status: 'approved',
      amountApproved,
      monthlyDeduction,
      balanceRemaining: amountApproved,
      approvedAt: new Date().toISOString(),
      approvedBy,
    });
  },

  /**
   * Reject an advance
   */
  async reject(id: number, reason: string): Promise<SalaryAdvanceRecord> {
    return this.update(id, {
      status: 'rejected',
      rejectionReason: reason,
    });
  },

  /**
   * Disburse an advance
   */
  async disburse(id: number): Promise<SalaryAdvanceRecord> {
    return this.update(id, {
      status: 'disbursed',
      disbursedAt: new Date().toISOString(),
    });
  },

  /**
   * Start repayment
   */
  async startRepayment(id: number): Promise<SalaryAdvanceRecord> {
    return this.update(id, {
      status: 'repaying',
    });
  },

  /**
   * Complete repayment
   */
  async completeRepayment(id: number): Promise<SalaryAdvanceRecord> {
    return this.update(id, {
      status: 'completed',
      balanceRemaining: 0,
    });
  },
};

// ========== ADVANCE REPAYMENTS ==========

const advanceRepaymentsCRUD = createCRUDService<AdvanceRepaymentRecord>('advanceRepayments');

export const advanceRepaymentsDB = {
  ...advanceRepaymentsCRUD,

  /**
   * Get repayments by advance ID
   */
  async getByAdvance(advanceId: number): Promise<AdvanceRepaymentRecord[]> {
    return advanceRepaymentsCRUD.getByIndex('advanceId', advanceId);
  },

  /**
   * Record a repayment
   */
  async record(
    advanceId: number,
    payrollEntryId: number,
    repaymentAmount: number
  ): Promise<AdvanceRepaymentRecord> {
    const advance = await salaryAdvancesDB.getById(advanceId);
    if (!advance) throw new Error('Advance not found');

    const balanceAfter = (advance.balanceRemaining || 0) - repaymentAmount;

    // Create repayment record
    const repayment = await this.create({
      advanceId,
      payrollEntryId,
      repaymentAmount,
      balanceAfter,
      repaymentDate: new Date().toISOString(),
    });

    // Update advance balance
    await salaryAdvancesDB.update(advanceId, {
      balanceRemaining: balanceAfter,
      status: balanceAfter <= 0 ? 'completed' : 'repaying',
    });

    return repayment;
  },
};

// ========== EMPLOYEE LOANS ==========

const employeeLoansCRUD = createCRUDService<EmployeeLoanRecord>('employeeLoans');

export const employeeLoansDB = {
  ...employeeLoansCRUD,

  /**
   * Generate unique loan number (LOAN-YYYY-####)
   */
  async generateLoanNumber(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('LOAN', all.length + 1, true, 4);
  },

  /**
   * Get loans by employee
   */
  async getByEmployee(employeeId: number): Promise<EmployeeLoanRecord[]> {
    return employeeLoansCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get loans by status
   */
  async getByStatus(status: LoanStatus): Promise<EmployeeLoanRecord[]> {
    return employeeLoansCRUD.getByIndex('status', status);
  },

  /**
   * Get active loans for an employee
   */
  async getActiveByEmployee(employeeId: number): Promise<EmployeeLoanRecord[]> {
    const all = await this.getByEmployee(employeeId);
    return all.filter(l => ['active', 'repaying'].includes(l.status));
  },

  /**
   * Approve a loan
   */
  async approve(
    id: number,
    approvedAmount: number,
    approvedBy: string,
    startDate: string
  ): Promise<EmployeeLoanRecord> {
    const loan = await this.getById(id);
    if (!loan) throw new Error('Loan not found');

    const interestRate = loan.interestRate || 0;
    const totalWithInterest = approvedAmount * (1 + interestRate / 100);
    const monthlyInstallment = Math.ceil(totalWithInterest / loan.repaymentMonths);

    // Calculate end date
    const start = new Date(startDate);
    const endDate = new Date(start.setMonth(start.getMonth() + loan.repaymentMonths));

    return this.update(id, {
      status: 'approved',
      approvedAmount,
      monthlyInstallment,
      balanceRemaining: totalWithInterest,
      startDate,
      endDate: endDate.toISOString().split('T')[0],
      approvedAt: new Date().toISOString(),
      approvedBy,
    });
  },

  /**
   * Activate a loan (start repayment)
   */
  async activate(id: number): Promise<EmployeeLoanRecord> {
    return this.update(id, {
      status: 'repaying',
    });
  },

  /**
   * Complete loan repayment
   */
  async complete(id: number): Promise<EmployeeLoanRecord> {
    return this.update(id, {
      status: 'completed',
      balanceRemaining: 0,
    });
  },

  /**
   * Mark loan as defaulted
   */
  async markDefaulted(id: number): Promise<EmployeeLoanRecord> {
    return this.update(id, {
      status: 'defaulted',
    });
  },
};

// ========== LOAN REPAYMENTS ==========

const loanRepaymentsCRUD = createCRUDService<LoanRepaymentRecord>('loanRepayments');

export const loanRepaymentsDB = {
  ...loanRepaymentsCRUD,

  /**
   * Get repayments by loan ID
   */
  async getByLoan(loanId: number): Promise<LoanRepaymentRecord[]> {
    return loanRepaymentsCRUD.getByIndex('loanId', loanId);
  },

  /**
   * Record a loan repayment
   */
  async record(
    loanId: number,
    payrollEntryId: number,
    principalAmount: number,
    interestAmount: number
  ): Promise<LoanRepaymentRecord> {
    const loan = await employeeLoansDB.getById(loanId);
    if (!loan) throw new Error('Loan not found');

    const totalAmount = principalAmount + interestAmount;
    const balanceAfter = (loan.balanceRemaining || 0) - totalAmount;

    // Create repayment record
    const repayment = await this.create({
      loanId,
      payrollEntryId,
      principalAmount,
      interestAmount,
      totalAmount,
      balanceAfter,
      repaymentDate: new Date().toISOString(),
    });

    // Update loan balance
    await employeeLoansDB.update(loanId, {
      balanceRemaining: balanceAfter,
      status: balanceAfter <= 0 ? 'completed' : 'repaying',
    });

    return repayment;
  },
};

// ========== OVERTIME ==========

const overtimeCRUD = createCRUDService<OvertimeRecord>('overtimeRecords');

export const overtimeDB = {
  ...overtimeCRUD,

  /**
   * Get overtime by employee
   */
  async getByEmployee(employeeId: number): Promise<OvertimeRecord[]> {
    return overtimeCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get overtime by status
   */
  async getByStatus(status: OvertimeStatus): Promise<OvertimeRecord[]> {
    return overtimeCRUD.getByIndex('status', status);
  },

  /**
   * Get overtime for employee in a specific period
   */
  async getByEmployeeAndPeriod(
    employeeId: number,
    year: number,
    month: number
  ): Promise<OvertimeRecord[]> {
    const all = await this.getByEmployee(employeeId);
    return all.filter(ot => {
      const date = new Date(ot.date);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });
  },

  /**
   * Approve overtime
   */
  async approve(
    id: number,
    approvedHours: number,
    approvedAmount: number,
    approvedBy: string
  ): Promise<OvertimeRecord> {
    return this.update(id, {
      status: 'approved',
      approvedHours,
      approvedAmount,
      approvedAt: new Date().toISOString(),
      approvedBy,
    });
  },

  /**
   * Reject overtime
   */
  async reject(id: number): Promise<OvertimeRecord> {
    return this.update(id, {
      status: 'rejected',
    });
  },

  /**
   * Process overtime (mark as processed)
   */
  async process(id: number): Promise<OvertimeRecord> {
    return this.update(id, {
      status: 'processed',
    });
  },
};

// ========== PAYSLIPS ==========

const payslipsCRUD = createCRUDService<PayslipRecord>('payslips');

export const payslipsDB = {
  ...payslipsCRUD,

  /**
   * Generate unique payslip number (PS-YYYY-MM-####)
   */
  async generatePayslipNumber(year: number, month: number): Promise<string> {
    const all = await this.getAll();
    const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
    const count = all.filter(p => p.payslipNumber.startsWith(`PS-${yearMonth}`)).length;
    return `PS-${yearMonth}-${String(count + 1).padStart(4, '0')}`;
  },

  /**
   * Get payslips by employee
   */
  async getByEmployee(employeeId: number): Promise<PayslipRecord[]> {
    return payslipsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get payslip by payroll entry
   */
  async getByPayrollEntry(payrollEntryId: number): Promise<PayslipRecord | undefined> {
    const db = await getDB();
    return db.getFromIndex('payslips', 'payrollEntryId', payrollEntryId);
  },

  /**
   * Generate payslip from payroll entry
   */
  async generate(
    payrollEntryId: number,
    generatedBy: string
  ): Promise<PayslipRecord> {
    const entry = await payrollEntriesDB.getById(payrollEntryId);
    if (!entry) throw new Error('Payroll entry not found');

    const period = await payrollPeriodsDB.getById(entry.payrollPeriodId);
    if (!period) throw new Error('Payroll period not found');

    const payslipNumber = await this.generatePayslipNumber(period.year, period.month);

    return this.create({
      payslipNumber,
      payrollEntryId,
      employeeId: entry.employeeId,
      employeeName: entry.employeeName,
      employeeNumber: entry.employeeNumber,
      department: entry.department,
      position: entry.position,
      periodMonth: period.month,
      periodYear: period.year,
      periodName: period.periodName,
      basicSalary: entry.basicSalary,
      proratedSalary: entry.proratedSalary,
      grossSalary: entry.grossSalary,
      totalDeductions: entry.totalDeductions,
      netSalary: entry.netSalary,
      paymentDate: entry.paidAt,
      paymentMode: entry.paymentMode,
      paymentReference: entry.paymentReference,
      generatedAt: new Date().toISOString(),
      generatedBy,
    });
  },
};

// ========== BANK TRANSFERS ==========

const bankTransfersCRUD = createCRUDService<BankTransferRecord>('bankTransfers');

export const bankTransfersDB = {
  ...bankTransfersCRUD,

  /**
   * Generate unique batch number (BT-YYYY-MM-####)
   */
  async generateBatchNumber(year: number, month: number): Promise<string> {
    const all = await this.getAll();
    const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
    const count = all.filter(b => b.batchNumber.startsWith(`BT-${yearMonth}`)).length;
    return `BT-${yearMonth}-${String(count + 1).padStart(4, '0')}`;
  },

  /**
   * Get transfers by payroll period
   */
  async getByPeriod(payrollPeriodId: number): Promise<BankTransferRecord[]> {
    return bankTransfersCRUD.getByIndex('payrollPeriodId', payrollPeriodId);
  },

  /**
   * Get transfers by status
   */
  async getByStatus(status: string): Promise<BankTransferRecord[]> {
    return bankTransfersCRUD.getByIndex('status', status);
  },

  /**
   * Process a bank transfer
   */
  async process(id: number, bankReference: string): Promise<BankTransferRecord> {
    return this.update(id, {
      status: 'processing',
    });
  },

  /**
   * Complete a bank transfer
   */
  async complete(id: number, bankReference: string): Promise<BankTransferRecord> {
    return this.update(id, {
      status: 'completed',
      bankReference,
      processedAt: new Date().toISOString(),
    });
  },

  /**
   * Mark transfer as failed
   */
  async markFailed(id: number, notes: string): Promise<BankTransferRecord> {
    return this.update(id, {
      status: 'failed',
      notes,
    });
  },
};

// ========== CASH PAYMENTS ==========

const cashPaymentsCRUD = createCRUDService<CashPaymentRecord>('cashPayments');

export const cashPaymentsDB = {
  ...cashPaymentsCRUD,

  /**
   * Generate unique voucher number (CP-YYYY-MM-####)
   */
  async generateVoucherNumber(year: number, month: number): Promise<string> {
    const all = await this.getAll();
    const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
    const count = all.filter(c => c.voucherNumber.startsWith(`CP-${yearMonth}`)).length;
    return `CP-${yearMonth}-${String(count + 1).padStart(4, '0')}`;
  },

  /**
   * Get cash payments by employee
   */
  async getByEmployee(employeeId: number): Promise<CashPaymentRecord[]> {
    return cashPaymentsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get cash payments by status
   */
  async getByStatus(status: string): Promise<CashPaymentRecord[]> {
    return cashPaymentsCRUD.getByIndex('status', status);
  },

  /**
   * Verify a cash payment
   */
  async verify(id: number, verifiedBy: string): Promise<CashPaymentRecord> {
    return this.update(id, {
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      verifiedBy,
    });
  },

  /**
   * Process a cash payment
   */
  async process(id: number): Promise<CashPaymentRecord> {
    return this.update(id, {
      status: 'processed',
    });
  },

  /**
   * Complete a cash payment
   */
  async complete(id: number, receivedBy: string): Promise<CashPaymentRecord> {
    return this.update(id, {
      status: 'completed',
      paymentDate: new Date().toISOString(),
      receivedBy,
    });
  },

  /**
   * Mark payment as failed
   */
  async markFailed(id: number, notes: string): Promise<CashPaymentRecord> {
    return this.update(id, {
      status: 'failed',
      notes,
    });
  },
};

// ========== MAIN EXPORT ==========

/**
 * Payroll Service - Main entry point
 */
export const payrollService = {
  // Core payroll
  periods: payrollPeriodsDB,
  salaryStructures: salaryStructuresDB,
  salaryDetails: employeeSalaryDetailsDB,
  allowances: employeeAllowancesDB,
  entries: payrollEntriesDB,

  // Advances & Loans
  advances: {
    advances: salaryAdvancesDB,
    repayments: advanceRepaymentsDB,
  },
  loans: {
    loans: employeeLoansDB,
    repayments: loanRepaymentsDB,
  },

  // Additional components
  overtime: overtimeDB,
  payslips: payslipsDB,

  // Payments
  payments: {
    bankTransfers: bankTransfersDB,
    cashPayments: cashPaymentsDB,
  },
};

export default payrollService;
