/**
 * Finance Module Service
 *
 * Database services for finance entities:
 * - Donors
 * - Projects
 * - Banks & Bank Accounts
 * - Budgets & Expenditures
 * - Cash Requests & Installments
 * - Staff Allocations & Payroll Distributions
 * - Reporting Schedules
 * - Project Amendments
 * - Signatory Assignments
 */

import { createCRUDService } from './core/crud';
import { generateFormattedCode } from './core/utils';
import type {
  DonorRecord,
  ProjectRecord,
  DonorStatus,
  ProjectStatus,
  BankRecord,
  BankAccountRecord,
  BankSignatoryRecord,
  BudgetCategoryRecord,
  ProjectBudgetRecord,
  BudgetExpenditureRecord,
  ProjectStaffCostRecord,
  ProjectOperationalCostRecord,
  CashRequestRecord,
  CashRequestItemRecord,
  CashRequestStatus,
  InstallmentRequestRecord,
  InstallmentReceiptRecord,
  InstallmentStatus,
  StaffSalaryAllocationRecord,
  PayrollDistributionRecord,
  DonorReportingScheduleRecord,
  DonorReportPeriodRecord,
  GovernmentReportingRecord,
  ProjectAmendmentRecord,
  SignatoryAssignmentRecord,
} from '../../types/modules/finance';

// ========== DONORS ==========

const donorsCRUD = createCRUDService<DonorRecord>('donors');

export const donorDB = {
  ...donorsCRUD,

  /**
   * Generate unique donor code (DNR-####)
   */
  async generateCode(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('DNR', all.length + 1, false, 4);
  },

  /**
   * Get donor by code
   */
  async getByCode(code: string): Promise<DonorRecord | undefined> {
    const results = await donorsCRUD.getByIndex('code', code);
    return results[0];
  },

  /**
   * Get donor by name
   */
  async getByName(name: string): Promise<DonorRecord | undefined> {
    const results = await donorsCRUD.getByIndex('name', name);
    return results[0];
  },

  /**
   * Get donors by type
   */
  async getByType(type: string): Promise<DonorRecord[]> {
    return donorsCRUD.getByIndex('type', type);
  },

  /**
   * Get donors by status
   */
  async getByStatus(status: DonorStatus): Promise<DonorRecord[]> {
    return donorsCRUD.getByIndex('status', status);
  },

  /**
   * Get active donors
   */
  async getActive(): Promise<DonorRecord[]> {
    return this.getByStatus('active');
  },
};

// ========== PROJECTS ==========

const projectsCRUD = createCRUDService<ProjectRecord>('projects');

export const projectDB = {
  ...projectsCRUD,

  /**
   * Generate unique project code (PRJ-####)
   */
  async generateCode(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('PRJ', all.length + 1, false, 4);
  },

  /**
   * Get project by code
   */
  async getByCode(code: string): Promise<ProjectRecord | undefined> {
    const results = await projectsCRUD.getByIndex('projectCode', code);
    return results[0];
  },

  /**
   * Get project by name
   */
  async getByName(name: string): Promise<ProjectRecord | undefined> {
    const results = await projectsCRUD.getByIndex('name', name);
    return results[0];
  },

  /**
   * Get projects by donor
   */
  async getByDonor(donorId: number): Promise<ProjectRecord[]> {
    return projectsCRUD.getByIndex('donorId', donorId);
  },

  /**
   * Get projects by department
   */
  async getByDepartment(department: string): Promise<ProjectRecord[]> {
    return projectsCRUD.getByIndex('department', department);
  },

  /**
   * Get projects by status
   */
  async getByStatus(status: ProjectStatus): Promise<ProjectRecord[]> {
    return projectsCRUD.getByIndex('status', status);
  },

  /**
   * Get active projects
   */
  async getActive(): Promise<ProjectRecord[]> {
    return this.getByStatus('active');
  },

  /**
   * Get projects ending soon (within days)
   */
  async getEndingSoon(days: number = 30): Promise<ProjectRecord[]> {
    const all = await this.getAll();
    const now = new Date();
    const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return all.filter((p) => {
      const endDate = new Date(p.endDate);
      return endDate >= now && endDate <= threshold && p.status === 'active';
    });
  },
};

// ========== BANKS ==========

const banksCRUD = createCRUDService<BankRecord>('banks');

export const bankDB = {
  ...banksCRUD,

  async getByCode(code: string): Promise<BankRecord | undefined> {
    const results = await banksCRUD.getByIndex('bankCode', code);
    return results[0];
  },

  async getByName(name: string): Promise<BankRecord[]> {
    return banksCRUD.getByIndex('bankName', name);
  },

  async getActive(): Promise<BankRecord[]> {
    return banksCRUD.getByIndex('isActive', true);
  },
};

// ========== BANK ACCOUNTS ==========

const bankAccountsCRUD = createCRUDService<BankAccountRecord>('bankAccounts');

export const bankAccountDB = {
  ...bankAccountsCRUD,

  async getByBank(bankId: number): Promise<BankAccountRecord[]> {
    return bankAccountsCRUD.getByIndex('bankId', bankId);
  },

  async getByCurrency(currency: string): Promise<BankAccountRecord[]> {
    return bankAccountsCRUD.getByIndex('currency', currency);
  },

  async getActive(): Promise<BankAccountRecord[]> {
    return bankAccountsCRUD.getByIndex('isActive', true);
  },
};

// ========== BANK SIGNATORIES ==========

const bankSignatoriesCRUD = createCRUDService<BankSignatoryRecord>('bankSignatories');

export const bankSignatoryDB = {
  ...bankSignatoriesCRUD,

  async getByBankAccount(bankAccountId: number): Promise<BankSignatoryRecord[]> {
    return bankSignatoriesCRUD.getByIndex('bankAccountId', bankAccountId);
  },

  async getByEmployee(employeeId: number): Promise<BankSignatoryRecord[]> {
    return bankSignatoriesCRUD.getByIndex('employeeId', employeeId);
  },

  async getByType(signatoryType: string): Promise<BankSignatoryRecord[]> {
    return bankSignatoriesCRUD.getByIndex('signatoryType', signatoryType);
  },

  async getActive(): Promise<BankSignatoryRecord[]> {
    return bankSignatoriesCRUD.getByIndex('isActive', true);
  },
};

// ========== BUDGET CATEGORIES ==========

const budgetCategoriesCRUD = createCRUDService<BudgetCategoryRecord>('budgetCategories');

export const budgetCategoryDB = {
  ...budgetCategoriesCRUD,

  async getByCode(code: string): Promise<BudgetCategoryRecord | undefined> {
    const results = await budgetCategoriesCRUD.getByIndex('categoryCode', code);
    return results[0];
  },

  async getByParent(parentId: number): Promise<BudgetCategoryRecord[]> {
    return budgetCategoriesCRUD.getByIndex('parentId', parentId);
  },

  async getActive(): Promise<BudgetCategoryRecord[]> {
    return budgetCategoriesCRUD.getByIndex('isActive', true);
  },

  async getRootCategories(): Promise<BudgetCategoryRecord[]> {
    const all = await this.getAll();
    return all.filter((c) => !c.parentId);
  },
};

// ========== PROJECT BUDGETS ==========

const projectBudgetsCRUD = createCRUDService<ProjectBudgetRecord>('projectBudgets');

export const projectBudgetDB = {
  ...projectBudgetsCRUD,

  async getByProject(projectId: number): Promise<ProjectBudgetRecord[]> {
    return projectBudgetsCRUD.getByIndex('projectId', projectId);
  },

  async getByCategory(budgetCategoryId: number): Promise<ProjectBudgetRecord[]> {
    return projectBudgetsCRUD.getByIndex('budgetCategoryId', budgetCategoryId);
  },

  async getByFiscalYear(fiscalYear: string): Promise<ProjectBudgetRecord[]> {
    return projectBudgetsCRUD.getByIndex('fiscalYear', fiscalYear);
  },
};

// ========== BUDGET EXPENDITURES ==========

const budgetExpendituresCRUD = createCRUDService<BudgetExpenditureRecord>('budgetExpenditures');

export const budgetExpenditureDB = {
  ...budgetExpendituresCRUD,

  async getByProjectBudget(projectBudgetId: number): Promise<BudgetExpenditureRecord[]> {
    return budgetExpendituresCRUD.getByIndex('projectBudgetId', projectBudgetId);
  },

  async getByCreator(createdBy: string): Promise<BudgetExpenditureRecord[]> {
    return budgetExpendituresCRUD.getByIndex('createdBy', createdBy);
  },
};

// ========== PROJECT STAFF COSTS ==========

const projectStaffCostsCRUD = createCRUDService<ProjectStaffCostRecord>('projectStaffCosts');

export const projectStaffCostDB = {
  ...projectStaffCostsCRUD,

  async getByProject(projectId: number): Promise<ProjectStaffCostRecord[]> {
    return projectStaffCostsCRUD.getByIndex('projectId', projectId);
  },

  async getByEmployee(employeeId: number): Promise<ProjectStaffCostRecord[]> {
    return projectStaffCostsCRUD.getByIndex('employeeId', employeeId);
  },

  async getByGrade(gradeLevel: string): Promise<ProjectStaffCostRecord[]> {
    return projectStaffCostsCRUD.getByIndex('gradeLevel', gradeLevel);
  },
};

// ========== PROJECT OPERATIONAL COSTS ==========

const projectOperationalCostsCRUD = createCRUDService<ProjectOperationalCostRecord>('projectOperationalCosts');

export const projectOperationalCostDB = {
  ...projectOperationalCostsCRUD,

  async getByProject(projectId: number): Promise<ProjectOperationalCostRecord[]> {
    return projectOperationalCostsCRUD.getByIndex('projectId', projectId);
  },

  async getByCategory(costCategory: string): Promise<ProjectOperationalCostRecord[]> {
    return projectOperationalCostsCRUD.getByIndex('costCategory', costCategory);
  },
};

// ========== CASH REQUESTS ==========

const cashRequestsCRUD = createCRUDService<CashRequestRecord>('cashRequests');

export const cashRequestDB = {
  ...cashRequestsCRUD,

  async generateCode(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('CR', all.length + 1, false, 4);
  },

  async getByNumber(requestNumber: string): Promise<CashRequestRecord | undefined> {
    const results = await cashRequestsCRUD.getByIndex('requestNumber', requestNumber);
    return results[0];
  },

  async getByStatus(status: CashRequestStatus): Promise<CashRequestRecord[]> {
    return cashRequestsCRUD.getByIndex('status', status);
  },

  async getByMonth(requestMonth: string): Promise<CashRequestRecord[]> {
    return cashRequestsCRUD.getByIndex('requestMonth', requestMonth);
  },

  async getPending(): Promise<CashRequestRecord[]> {
    const all = await this.getAll();
    return all.filter((r) => r.status === 'submitted' || r.status === 'reviewed');
  },
};

// ========== CASH REQUEST ITEMS ==========

const cashRequestItemsCRUD = createCRUDService<CashRequestItemRecord>('cashRequestItems');

export const cashRequestItemDB = {
  ...cashRequestItemsCRUD,

  async getByCashRequest(cashRequestId: number): Promise<CashRequestItemRecord[]> {
    return cashRequestItemsCRUD.getByIndex('cashRequestId', cashRequestId);
  },

  async getByProject(projectId: number): Promise<CashRequestItemRecord[]> {
    return cashRequestItemsCRUD.getByIndex('projectId', projectId);
  },

  async getByCostType(costType: string): Promise<CashRequestItemRecord[]> {
    return cashRequestItemsCRUD.getByIndex('costType', costType);
  },
};

// ========== INSTALLMENT REQUESTS ==========

const installmentRequestsCRUD = createCRUDService<InstallmentRequestRecord>('installmentRequests');

export const installmentRequestDB = {
  ...installmentRequestsCRUD,

  async getByProject(projectId: number): Promise<InstallmentRequestRecord[]> {
    return installmentRequestsCRUD.getByIndex('projectId', projectId);
  },

  async getByStatus(status: InstallmentStatus): Promise<InstallmentRequestRecord[]> {
    return installmentRequestsCRUD.getByIndex('status', status);
  },

  async getPending(): Promise<InstallmentRequestRecord[]> {
    return this.getByStatus('pending');
  },

  async getApproved(): Promise<InstallmentRequestRecord[]> {
    return this.getByStatus('approved');
  },
};

// ========== INSTALLMENT RECEIPTS ==========

const installmentReceiptsCRUD = createCRUDService<InstallmentReceiptRecord>('installmentReceipts');

export const installmentReceiptDB = {
  ...installmentReceiptsCRUD,

  async getByInstallmentRequest(installmentRequestId: number): Promise<InstallmentReceiptRecord[]> {
    return installmentReceiptsCRUD.getByIndex('installmentRequestId', installmentRequestId);
  },

  async getByBankAccount(bankAccountId: number): Promise<InstallmentReceiptRecord[]> {
    return installmentReceiptsCRUD.getByIndex('bankAccountId', bankAccountId);
  },
};

// ========== STAFF SALARY ALLOCATIONS ==========

const staffSalaryAllocationsCRUD = createCRUDService<StaffSalaryAllocationRecord>('staffSalaryAllocations');

export const staffSalaryAllocationDB = {
  ...staffSalaryAllocationsCRUD,

  async getByEmployee(employeeId: number): Promise<StaffSalaryAllocationRecord[]> {
    return staffSalaryAllocationsCRUD.getByIndex('employeeId', employeeId);
  },

  async getByProject(projectId: number): Promise<StaffSalaryAllocationRecord[]> {
    return staffSalaryAllocationsCRUD.getByIndex('projectId', projectId);
  },

  async getByMonth(allocationMonth: string): Promise<StaffSalaryAllocationRecord[]> {
    return staffSalaryAllocationsCRUD.getByIndex('allocationMonth', allocationMonth);
  },
};

// ========== PAYROLL DISTRIBUTIONS ==========

const payrollDistributionsCRUD = createCRUDService<PayrollDistributionRecord>('payrollDistributions');

export const payrollDistributionDB = {
  ...payrollDistributionsCRUD,

  async getByPayrollPeriod(payrollPeriodId: number): Promise<PayrollDistributionRecord[]> {
    return payrollDistributionsCRUD.getByIndex('payrollPeriodId', payrollPeriodId);
  },

  async getByEmployee(employeeId: number): Promise<PayrollDistributionRecord[]> {
    return payrollDistributionsCRUD.getByIndex('employeeId', employeeId);
  },

  async getByType(generationType: string): Promise<PayrollDistributionRecord[]> {
    return payrollDistributionsCRUD.getByIndex('generationType', generationType);
  },

  async getByStatus(status: string): Promise<PayrollDistributionRecord[]> {
    return payrollDistributionsCRUD.getByIndex('status', status);
  },
};

// ========== DONOR REPORTING SCHEDULES ==========

const donorReportingSchedulesCRUD = createCRUDService<DonorReportingScheduleRecord>('donorReportingSchedules');

export const donorReportingScheduleDB = {
  ...donorReportingSchedulesCRUD,

  async getByProject(projectId: number): Promise<DonorReportingScheduleRecord[]> {
    return donorReportingSchedulesCRUD.getByIndex('projectId', projectId);
  },

  async getByStatus(status: string): Promise<DonorReportingScheduleRecord[]> {
    return donorReportingSchedulesCRUD.getByIndex('status', status);
  },

  async getUpcoming(days: number = 30): Promise<DonorReportingScheduleRecord[]> {
    const all = await this.getAll();
    const now = new Date();
    const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return all.filter((s) => {
      const dueDate = new Date(s.dueDate);
      return dueDate >= now && dueDate <= threshold;
    });
  },
};

// ========== DONOR REPORT PERIODS ==========

const donorReportPeriodsCRUD = createCRUDService<DonorReportPeriodRecord>('donorReportPeriods');

export const donorReportPeriodDB = {
  ...donorReportPeriodsCRUD,

  async getBySchedule(reportingScheduleId: number): Promise<DonorReportPeriodRecord[]> {
    return donorReportPeriodsCRUD.getByIndex('reportingScheduleId', reportingScheduleId);
  },

  async getByStatus(status: string): Promise<DonorReportPeriodRecord[]> {
    return donorReportPeriodsCRUD.getByIndex('status', status);
  },

  async getPending(): Promise<DonorReportPeriodRecord[]> {
    return this.getByStatus('pending');
  },
};

// ========== GOVERNMENT REPORTING ==========

const governmentReportingCRUD = createCRUDService<GovernmentReportingRecord>('governmentReporting');

export const governmentReportingDB = {
  ...governmentReportingCRUD,

  async getByProject(projectId: number): Promise<GovernmentReportingRecord[]> {
    return governmentReportingCRUD.getByIndex('projectId', projectId);
  },

  async getByMinistry(ministryName: string): Promise<GovernmentReportingRecord[]> {
    return governmentReportingCRUD.getByIndex('ministryName', ministryName);
  },

  async getByStatus(status: string): Promise<GovernmentReportingRecord[]> {
    return governmentReportingCRUD.getByIndex('status', status);
  },
};

// ========== PROJECT AMENDMENTS ==========

const projectAmendmentsCRUD = createCRUDService<ProjectAmendmentRecord>('projectAmendments');

export const projectAmendmentDB = {
  ...projectAmendmentsCRUD,

  async getByProject(projectId: number): Promise<ProjectAmendmentRecord[]> {
    return projectAmendmentsCRUD.getByIndex('projectId', projectId);
  },

  async getByAmendmentNumber(amendmentNumber: number): Promise<ProjectAmendmentRecord[]> {
    return projectAmendmentsCRUD.getByIndex('amendmentNumber', amendmentNumber);
  },

  async getLatestByProject(projectId: number): Promise<ProjectAmendmentRecord | undefined> {
    const amendments = await this.getByProject(projectId);
    if (amendments.length === 0) return undefined;
    return amendments.sort((a, b) => b.amendmentNumber - a.amendmentNumber)[0];
  },
};

// ========== SIGNATORY ASSIGNMENTS ==========

const signatoryAssignmentsCRUD = createCRUDService<SignatoryAssignmentRecord>('signatoryAssignments');

export const signatoryAssignmentDB = {
  ...signatoryAssignmentsCRUD,

  async getByProject(projectId: number): Promise<SignatoryAssignmentRecord[]> {
    return signatoryAssignmentsCRUD.getByIndex('projectId', projectId);
  },

  async getByMonth(assignmentMonth: string): Promise<SignatoryAssignmentRecord[]> {
    return signatoryAssignmentsCRUD.getByIndex('assignmentMonth', assignmentMonth);
  },
};

// ========== SEED DEFAULTS ==========

/**
 * Seed default data for finance entities
 */
export async function seedFinanceDefaults(): Promise<void> {
  // Seed default donors if none exist
  const existingDonors = await donorDB.getAll();
  if (existingDonors.length === 0) {
    const defaultDonors = [
      {
        name: 'USAID',
        code: 'DNR-0001',
        type: 'bilateral',
        country: 'United States',
        status: 'active',
      },
      {
        name: 'World Bank',
        code: 'DNR-0002',
        type: 'multilateral',
        status: 'active',
      },
      {
        name: 'UNDP',
        code: 'DNR-0003',
        type: 'multilateral',
        status: 'active',
      },
    ];
    for (const donor of defaultDonors) {
      await donorDB.create(donor);
    }
  }
}

// ========== MAIN EXPORT ==========

export const financeService = {
  donors: donorDB,
  projects: projectDB,
  banks: bankDB,
  bankAccounts: bankAccountDB,
  bankSignatories: bankSignatoryDB,
  budgetCategories: budgetCategoryDB,
  projectBudgets: projectBudgetDB,
  budgetExpenditures: budgetExpenditureDB,
  projectStaffCosts: projectStaffCostDB,
  projectOperationalCosts: projectOperationalCostDB,
  cashRequests: cashRequestDB,
  cashRequestItems: cashRequestItemDB,
  installmentRequests: installmentRequestDB,
  installmentReceipts: installmentReceiptDB,
  staffSalaryAllocations: staffSalaryAllocationDB,
  payrollDistributions: payrollDistributionDB,
  donorReportingSchedules: donorReportingScheduleDB,
  donorReportPeriods: donorReportPeriodDB,
  governmentReporting: governmentReportingDB,
  projectAmendments: projectAmendmentDB,
  signatoryAssignments: signatoryAssignmentDB,
  seedDefaults: seedFinanceDefaults,
};

export default financeService;
