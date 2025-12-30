/**
 * Exit/Separation Management Service
 *
 * Handles employee separation workflow including:
 * - Separation records and types
 * - Clearance management
 * - Exit interviews
 * - Compliance checks
 * - Final settlements
 * - Work certificates
 * - Termination records
 * - Handover management
 */

import { createCRUDService } from './core/crud';
import { getDB } from './core/connection';
import { generateFormattedCode } from './core/utils';
import { RecordNotFoundError } from '@/types/db/errors';
import type {
  SeparationRecord,
  SeparationTypeRecord,
  ExitClearanceRecord,
  ClearanceItemRecord,
  ExitClearanceDepartmentRecord,
  ExitInterviewRecord,
  ExitComplianceCheckRecord,
  FinalSettlementRecord,
  SettlementPaymentRecord,
  WorkCertificateRecord,
  TerminationRecord,
  HandoverRecord,
  HandoverItemRecord,
  SeparationHistoryRecord,
  SEPARATION_STATUS,
  CLEARANCE_STATUS,
  SETTLEMENT_STATUS,
  PAYMENT_STATUS,
  CERTIFICATE_STATUS,
  HANDOVER_STATUS,
} from '@/types/modules/exit';

// ========== SEPARATION RECORDS SERVICE ==========

const separationCRUD = createCRUDService<SeparationRecord>('separationRecords');

export const separationService = {
  ...separationCRUD,

  /**
   * Generate next separation number (SEP-YYYY-####)
   */
  async generateSeparationNumber(): Promise<string> {
    const all = await this.getAll();
    const currentYear = new Date().getFullYear();
    const yearPrefix = `SEP-${currentYear}-`;
    const yearRecords = all.filter((r) => r.separationNumber?.startsWith(yearPrefix));
    const nextNum = yearRecords.length + 1;
    return `${yearPrefix}${String(nextNum).padStart(4, '0')}`;
  },

  /**
   * Get separations by employee
   */
  async getByEmployee(employeeId: number): Promise<SeparationRecord[]> {
    return this.getByIndex('employeeId', employeeId);
  },

  /**
   * Get separations by status
   */
  async getByStatus(status: typeof SEPARATION_STATUS[keyof typeof SEPARATION_STATUS]): Promise<SeparationRecord[]> {
    return this.getByIndex('status', status);
  },

  /**
   * Get separations by type
   */
  async getByType(type: string): Promise<SeparationRecord[]> {
    return this.getByIndex('separationType', type);
  },

  /**
   * Get separations by department
   */
  async getByDepartment(department: string): Promise<SeparationRecord[]> {
    return this.getByIndex('department', department);
  },

  /**
   * Approve separation
   */
  async approve(id: number, approverName: string): Promise<SeparationRecord> {
    const record = await this.getById(id);
    if (!record) throw new RecordNotFoundError('Separation', id);

    const updated = await this.update(id, {
      status: 'approved',
      approvedBy: approverName,
      approvedAt: new Date().toISOString(),
    });

    // Log history
    await separationHistoryService.logChange(
      id,
      approverName,
      'status',
      record.status,
      'approved',
      'Separation approved'
    );

    return updated;
  },

  /**
   * Reject separation
   */
  async reject(id: number, rejectorName: string, reason: string): Promise<SeparationRecord> {
    const record = await this.getById(id);
    if (!record) throw new RecordNotFoundError('Separation', id);

    const updated = await this.update(id, {
      status: 'rejected',
      rejectedBy: rejectorName,
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason,
    });

    // Log history
    await separationHistoryService.logChange(
      id,
      rejectorName,
      'status',
      record.status,
      'rejected',
      `Rejected: ${reason}`
    );

    return updated;
  },

  /**
   * Mark clearance as completed
   */
  async completeClearance(id: number): Promise<SeparationRecord> {
    const updated = await this.update(id, {
      status: 'clearance_completed',
      clearanceCompletedAt: new Date().toISOString(),
    });

    await separationHistoryService.logChange(
      id,
      'System',
      'status',
      'clearance_pending',
      'clearance_completed',
      'All clearances completed'
    );

    return updated;
  },

  /**
   * Complete separation
   */
  async completeSeparation(id: number): Promise<SeparationRecord> {
    const updated = await this.update(id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
    });

    await separationHistoryService.logChange(
      id,
      'System',
      'status',
      'settlement_pending',
      'completed',
      'Separation process completed'
    );

    return updated;
  },

  /**
   * Cancel separation
   */
  async cancel(id: number, cancelledBy: string, reason: string): Promise<SeparationRecord> {
    const record = await this.getById(id);
    if (!record) throw new RecordNotFoundError('Separation', id);

    const updated = await this.update(id, {
      status: 'cancelled',
      comments: reason,
    });

    await separationHistoryService.logChange(
      id,
      cancelledBy,
      'status',
      record.status,
      'cancelled',
      `Cancelled: ${reason}`
    );

    return updated;
  },
};

// ========== SEPARATION TYPES SERVICE ==========

const separationTypesCRUD = createCRUDService<SeparationTypeRecord>('separationTypes');

export const separationTypesService = {
  ...separationTypesCRUD,

  /**
   * Get active separation types
   */
  async getActive(): Promise<SeparationTypeRecord[]> {
    return this.getByIndex('isActive', true);
  },

  /**
   * Get by code
   */
  async getByCode(code: string): Promise<SeparationTypeRecord | undefined> {
    const results = await this.getByIndex('code', code);
    return results[0];
  },
};

// ========== CLEARANCE SERVICE ==========

const clearanceCRUD = createCRUDService<ExitClearanceRecord>('exitClearances');

export const clearanceService = {
  ...clearanceCRUD,

  /**
   * Get clearances by separation
   */
  async getBySeparation(separationId: number): Promise<ExitClearanceRecord[]> {
    return this.getByIndex('separationId', separationId);
  },

  /**
   * Get clearances by department
   */
  async getByDepartment(departmentId: number): Promise<ExitClearanceRecord[]> {
    return this.getByIndex('departmentId', departmentId);
  },

  /**
   * Get pending clearances
   */
  async getPending(): Promise<ExitClearanceRecord[]> {
    return this.getByIndex('status', 'pending');
  },

  /**
   * Initialize clearances for separation
   */
  async initializeClearances(separationId: number): Promise<ExitClearanceRecord[]> {
    const departments = await clearanceDepartmentService.getActive();
    const now = new Date().toISOString();
    const clearances: ExitClearanceRecord[] = [];

    for (const dept of departments) {
      const clearance = await this.create({
        separationId,
        departmentId: dept.id,
        departmentName: dept.departmentName,
        status: 'pending',
        requestedAt: now,
      });
      clearances.push(clearance);
    }

    return clearances;
  },

  /**
   * Approve clearance
   */
  async approve(id: number, approverName: string, comments?: string): Promise<ExitClearanceRecord> {
    return this.update(id, {
      status: 'approved',
      completedAt: new Date().toISOString(),
      comments,
    });
  },

  /**
   * Reject clearance
   */
  async reject(id: number, rejectorName: string, reason: string): Promise<ExitClearanceRecord> {
    return this.update(id, {
      status: 'rejected',
      completedAt: new Date().toISOString(),
      rejectionReason: reason,
    });
  },

  /**
   * Waive clearance
   */
  async waive(id: number, waiverName: string, reason: string): Promise<ExitClearanceRecord> {
    return this.update(id, {
      status: 'waived',
      waiveReason: reason,
      waivedBy: waiverName,
      waivedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    });
  },

  /**
   * Check if all clearances are completed for a separation
   */
  async areAllCompleted(separationId: number): Promise<boolean> {
    const clearances = await this.getBySeparation(separationId);
    return clearances.every(
      (c) => c.status === 'approved' || c.status === 'waived'
    );
  },
};

// ========== CLEARANCE ITEMS SERVICE ==========

const clearanceItemsCRUD = createCRUDService<ClearanceItemRecord>('clearanceItems');

export const clearanceItemService = {
  ...clearanceItemsCRUD,

  /**
   * Get items by clearance
   */
  async getByClearance(clearanceId: number): Promise<ClearanceItemRecord[]> {
    return this.getByIndex('clearanceId', clearanceId);
  },

  /**
   * Get items by separation
   */
  async getBySeparation(separationId: number): Promise<ClearanceItemRecord[]> {
    return this.getByIndex('separationId', separationId);
  },

  /**
   * Mark item as returned
   */
  async markReturned(id: number, condition?: string): Promise<ClearanceItemRecord> {
    return this.update(id, {
      status: 'returned',
      returnedAt: new Date().toISOString(),
      condition,
    });
  },

  /**
   * Mark item as damaged
   */
  async markDamaged(id: number, description: string, cost?: number): Promise<ClearanceItemRecord> {
    return this.update(id, {
      status: 'damaged',
      damageDescription: description,
      replacementCost: cost,
      returnedAt: new Date().toISOString(),
    });
  },

  /**
   * Mark item as lost
   */
  async markLost(id: number, cost: number): Promise<ClearanceItemRecord> {
    return this.update(id, {
      status: 'lost',
      replacementCost: cost,
    });
  },
};

// ========== CLEARANCE DEPARTMENTS SERVICE ==========

const clearanceDepartmentsCRUD = createCRUDService<ExitClearanceDepartmentRecord>('exitClearanceDepartments');

export const clearanceDepartmentService = {
  ...clearanceDepartmentsCRUD,

  /**
   * Get active departments
   */
  async getActive(): Promise<ExitClearanceDepartmentRecord[]> {
    return this.getByIndex('isActive', true);
  },
};

// ========== EXIT INTERVIEW SERVICE ==========

const exitInterviewCRUD = createCRUDService<ExitInterviewRecord>('exitInterviews');

export const exitInterviewService = {
  ...exitInterviewCRUD,

  /**
   * Get interview by separation
   */
  async getBySeparation(separationId: number): Promise<ExitInterviewRecord | undefined> {
    const results = await this.getByIndex('separationId', separationId);
    return results[0];
  },

  /**
   * Get interviews by employee
   */
  async getByEmployee(employeeId: number): Promise<ExitInterviewRecord[]> {
    return this.getByIndex('employeeId', employeeId);
  },

  /**
   * Get interviews by status
   */
  async getByStatus(status: string): Promise<ExitInterviewRecord[]> {
    return this.getByIndex('status', status);
  },

  /**
   * Calculate overall rating
   */
  calculateOverallRating(interview: Partial<ExitInterviewRecord>): number {
    const ratings = [
      interview.jobSatisfactionRating,
      interview.workEnvironmentRating,
      interview.managementRating,
      interview.compensationRating,
      interview.careerGrowthRating,
      interview.workLifeBalanceRating,
    ].filter((r) => r !== undefined) as number[];

    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  },

  /**
   * Complete interview
   */
  async complete(id: number): Promise<ExitInterviewRecord> {
    const interview = await this.getById(id);
    if (!interview) throw new RecordNotFoundError('ExitInterview', id);

    const overallRating = this.calculateOverallRating(interview);

    return this.update(id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      overallRating,
    });
  },
};

// ========== COMPLIANCE CHECK SERVICE ==========

const complianceCheckCRUD = createCRUDService<ExitComplianceCheckRecord>('exitComplianceChecks');

export const complianceCheckService = {
  ...complianceCheckCRUD,

  /**
   * Get checks by separation
   */
  async getBySeparation(separationId: number): Promise<ExitComplianceCheckRecord[]> {
    return this.getByIndex('separationId', separationId);
  },

  /**
   * Get checks by employee
   */
  async getByEmployee(employeeId: number): Promise<ExitComplianceCheckRecord[]> {
    return this.getByIndex('employeeId', employeeId);
  },

  /**
   * Check if any issues found
   */
  hasIssues(check: ExitComplianceCheckRecord): boolean {
    return (
      check.outstandingLoans ||
      check.pendingLeaveRequests ||
      check.pendingExpenses ||
      check.trainingBond ||
      check.disciplinaryIssues ||
      check.activeProjects ||
      check.dataAccess
    );
  },

  /**
   * Mark as verified
   */
  async verify(id: number): Promise<ExitComplianceCheckRecord> {
    const check = await this.getById(id);
    if (!check) throw new RecordNotFoundError('ExitComplianceCheck', id);

    const status = this.hasIssues(check) ? 'issues_found' : 'verified';

    return this.update(id, {
      status,
    });
  },

  /**
   * Mark issues as resolved
   */
  async resolve(id: number, resolvedBy: string): Promise<ExitComplianceCheckRecord> {
    return this.update(id, {
      status: 'resolved',
      resolvedBy,
      resolvedAt: new Date().toISOString(),
    });
  },
};

// ========== SETTLEMENT SERVICE ==========

const settlementCRUD = createCRUDService<FinalSettlementRecord>('finalSettlements');

export const settlementService = {
  ...settlementCRUD,

  /**
   * Generate settlement number (SETT-YYYY-####)
   */
  async generateSettlementNumber(): Promise<string> {
    const all = await this.getAll();
    const currentYear = new Date().getFullYear();
    const yearPrefix = `SETT-${currentYear}-`;
    const yearRecords = all.filter((r) => r.settlementNumber?.startsWith(yearPrefix));
    const nextNum = yearRecords.length + 1;
    return `${yearPrefix}${String(nextNum).padStart(4, '0')}`;
  },

  /**
   * Get settlement by separation
   */
  async getBySeparation(separationId: number): Promise<FinalSettlementRecord | undefined> {
    const results = await this.getByIndex('separationId', separationId);
    return results[0];
  },

  /**
   * Get settlements by employee
   */
  async getByEmployee(employeeId: number): Promise<FinalSettlementRecord[]> {
    return this.getByIndex('employeeId', employeeId);
  },

  /**
   * Get settlements by status
   */
  async getByStatus(status: typeof SETTLEMENT_STATUS[keyof typeof SETTLEMENT_STATUS]): Promise<FinalSettlementRecord[]> {
    return this.getByIndex('status', status);
  },

  /**
   * Calculate totals
   */
  calculateTotals(settlement: Partial<FinalSettlementRecord>): {
    totalEarnings: number;
    totalDeductions: number;
    netAmount: number;
  } {
    const totalEarnings =
      (settlement.finalSalary || 0) +
      (settlement.leaveEncashment || 0) +
      (settlement.gratuity || 0) +
      (settlement.bonus || 0) +
      (settlement.otherEarnings || 0);

    const totalDeductions =
      (settlement.loansRecovery || 0) +
      (settlement.advancesRecovery || 0) +
      (settlement.trainingBondRecovery || 0) +
      (settlement.assetCharges || 0) +
      (settlement.otherDeductions || 0);

    const netAmount = totalEarnings - totalDeductions;

    return { totalEarnings, totalDeductions, netAmount };
  },

  /**
   * Verify by HR
   */
  async verifyByHR(id: number, verifierName: string, comments?: string): Promise<FinalSettlementRecord> {
    return this.update(id, {
      status: 'pending_finance',
      verifiedByHR: verifierName,
      verifiedByHRAt: new Date().toISOString(),
      hrComments: comments,
    });
  },

  /**
   * Verify by Finance
   */
  async verifyByFinance(id: number, verifierName: string, comments?: string): Promise<FinalSettlementRecord> {
    return this.update(id, {
      status: 'pending_approval',
      verifiedByFinance: verifierName,
      verifiedByFinanceAt: new Date().toISOString(),
      financeComments: comments,
    });
  },

  /**
   * Approve settlement
   */
  async approve(id: number, approverName: string, comments?: string): Promise<FinalSettlementRecord> {
    return this.update(id, {
      status: 'approved',
      approvedBy: approverName,
      approvedAt: new Date().toISOString(),
      approvalComments: comments,
    });
  },

  /**
   * Reject settlement
   */
  async reject(id: number, rejectorName: string, reason: string): Promise<FinalSettlementRecord> {
    return this.update(id, {
      status: 'rejected',
      rejectedBy: rejectorName,
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason,
    });
  },

  /**
   * Mark as paid
   */
  async markPaid(id: number): Promise<FinalSettlementRecord> {
    return this.update(id, {
      status: 'paid',
    });
  },
};

// ========== SETTLEMENT PAYMENT SERVICE ==========

const settlementPaymentCRUD = createCRUDService<SettlementPaymentRecord>('settlementPayments');

export const settlementPaymentService = {
  ...settlementPaymentCRUD,

  /**
   * Get payment by settlement
   */
  async getBySettlement(settlementId: number): Promise<SettlementPaymentRecord | undefined> {
    const results = await this.getByIndex('settlementId', settlementId);
    return results[0];
  },

  /**
   * Get payments by separation
   */
  async getBySeparation(separationId: number): Promise<SettlementPaymentRecord[]> {
    return this.getByIndex('separationId', separationId);
  },

  /**
   * Get payments by employee
   */
  async getByEmployee(employeeId: number): Promise<SettlementPaymentRecord[]> {
    return this.getByIndex('employeeId', employeeId);
  },

  /**
   * Get payments by status
   */
  async getByStatus(status: typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS]): Promise<SettlementPaymentRecord[]> {
    return this.getByIndex('status', status);
  },

  /**
   * Process payment
   */
  async process(id: number, processedBy: string): Promise<SettlementPaymentRecord> {
    return this.update(id, {
      status: 'processing',
      processedBy,
      processedAt: new Date().toISOString(),
    });
  },

  /**
   * Mark as paid
   */
  async markPaid(id: number, transactionRef: string, verifierName: string): Promise<SettlementPaymentRecord> {
    return this.update(id, {
      status: 'paid',
      transactionReference: transactionRef,
      paymentDate: new Date().toISOString(),
      verifiedBy: verifierName,
      verifiedAt: new Date().toISOString(),
    });
  },

  /**
   * Mark as failed
   */
  async markFailed(id: number, reason: string): Promise<SettlementPaymentRecord> {
    return this.update(id, {
      status: 'failed',
      failureReason: reason,
    });
  },
};

// ========== WORK CERTIFICATE SERVICE ==========

const workCertificateCRUD = createCRUDService<WorkCertificateRecord>('workCertificates');

export const workCertificateService = {
  ...workCertificateCRUD,

  /**
   * Generate certificate number (CERT-YYYY-####)
   */
  async generateCertificateNumber(): Promise<string> {
    const all = await this.getAll();
    const currentYear = new Date().getFullYear();
    const yearPrefix = `CERT-${currentYear}-`;
    const yearRecords = all.filter((r) => r.certificateNumber?.startsWith(yearPrefix));
    const nextNum = yearRecords.length + 1;
    return `${yearPrefix}${String(nextNum).padStart(4, '0')}`;
  },

  /**
   * Get certificate by separation
   */
  async getBySeparation(separationId: number): Promise<WorkCertificateRecord | undefined> {
    const results = await this.getByIndex('separationId', separationId);
    return results[0];
  },

  /**
   * Get certificates by employee
   */
  async getByEmployee(employeeId: number): Promise<WorkCertificateRecord[]> {
    return this.getByIndex('employeeId', employeeId);
  },

  /**
   * Get certificates by status
   */
  async getByStatus(status: typeof CERTIFICATE_STATUS[keyof typeof CERTIFICATE_STATUS]): Promise<WorkCertificateRecord[]> {
    return this.getByIndex('status', status);
  },

  /**
   * Issue certificate
   */
  async issue(id: number, issuedBy: string, approvedBy: string): Promise<WorkCertificateRecord> {
    return this.update(id, {
      status: 'issued',
      issuedBy,
      approvedBy,
      approvedAt: new Date().toISOString(),
    });
  },

  /**
   * Revoke certificate
   */
  async revoke(id: number, revokedBy: string, reason: string): Promise<WorkCertificateRecord> {
    return this.update(id, {
      status: 'revoked',
      revokedBy,
      revokedAt: new Date().toISOString(),
      revocationReason: reason,
    });
  },
};

// ========== TERMINATION RECORD SERVICE ==========

const terminationRecordCRUD = createCRUDService<TerminationRecord>('terminationRecords');

export const terminationRecordService = {
  ...terminationRecordCRUD,

  /**
   * Get termination by separation
   */
  async getBySeparation(separationId: number): Promise<TerminationRecord | undefined> {
    const results = await this.getByIndex('separationId', separationId);
    return results[0];
  },

  /**
   * Get terminations by employee
   */
  async getByEmployee(employeeId: number): Promise<TerminationRecord[]> {
    return this.getByIndex('employeeId', employeeId);
  },

  /**
   * Get terminations by type
   */
  async getByType(type: string): Promise<TerminationRecord[]> {
    return this.getByIndex('terminationType', type);
  },

  /**
   * File appeal
   */
  async fileAppeal(id: number): Promise<TerminationRecord> {
    return this.update(id, {
      appealFiled: true,
      appealDate: new Date().toISOString(),
    });
  },

  /**
   * Record appeal outcome
   */
  async recordAppealOutcome(id: number, outcome: string): Promise<TerminationRecord> {
    return this.update(id, {
      appealOutcome: outcome,
    });
  },
};

// ========== HANDOVER SERVICE ==========

const handoverCRUD = createCRUDService<HandoverRecord>('handovers');

export const handoverService = {
  ...handoverCRUD,

  /**
   * Get handover by separation
   */
  async getBySeparation(separationId: number): Promise<HandoverRecord | undefined> {
    const results = await this.getByIndex('separationId', separationId);
    return results[0];
  },

  /**
   * Get handovers by employee
   */
  async getByEmployee(employeeId: number): Promise<HandoverRecord[]> {
    return this.getByIndex('employeeId', employeeId);
  },

  /**
   * Get handovers by recipient
   */
  async getByRecipient(handoverToId: number): Promise<HandoverRecord[]> {
    return this.getByIndex('handoverToId', handoverToId);
  },

  /**
   * Get handovers by status
   */
  async getByStatus(status: typeof HANDOVER_STATUS[keyof typeof HANDOVER_STATUS]): Promise<HandoverRecord[]> {
    return this.getByIndex('status', status);
  },

  /**
   * Start handover
   */
  async start(id: number): Promise<HandoverRecord> {
    return this.update(id, {
      status: 'in_progress',
      startDate: new Date().toISOString(),
    });
  },

  /**
   * Complete handover
   */
  async complete(id: number): Promise<HandoverRecord> {
    return this.update(id, {
      status: 'completed',
      actualCompletionDate: new Date().toISOString(),
    });
  },

  /**
   * Verify handover
   */
  async verify(id: number, verifierName: string, comments?: string): Promise<HandoverRecord> {
    return this.update(id, {
      status: 'verified',
      verifiedBy: verifierName,
      verifiedAt: new Date().toISOString(),
      verificationComments: comments,
    });
  },
};

// ========== HANDOVER ITEMS SERVICE ==========

const handoverItemsCRUD = createCRUDService<HandoverItemRecord>('handoverItems');

export const handoverItemService = {
  ...handoverItemsCRUD,

  /**
   * Get items by handover
   */
  async getByHandover(handoverId: number): Promise<HandoverItemRecord[]> {
    return this.getByIndex('handoverId', handoverId);
  },

  /**
   * Get items by separation
   */
  async getBySeparation(separationId: number): Promise<HandoverItemRecord[]> {
    return this.getByIndex('separationId', separationId);
  },

  /**
   * Mark as handed over
   */
  async markHandedOver(id: number): Promise<HandoverItemRecord> {
    return this.update(id, {
      status: 'handed_over',
      handedOverAt: new Date().toISOString(),
    });
  },

  /**
   * Verify item
   */
  async verify(id: number): Promise<HandoverItemRecord> {
    return this.update(id, {
      status: 'verified',
      verifiedAt: new Date().toISOString(),
    });
  },

  /**
   * Mark issues
   */
  async markIssues(id: number, issues: string): Promise<HandoverItemRecord> {
    return this.update(id, {
      status: 'issues',
      issues,
    });
  },
};

// ========== SEPARATION HISTORY SERVICE ==========

const separationHistoryCRUD = createCRUDService<SeparationHistoryRecord>('separationHistory');

export const separationHistoryService = {
  ...separationHistoryCRUD,

  /**
   * Get history by separation
   */
  async getBySeparation(separationId: number): Promise<SeparationHistoryRecord[]> {
    return this.getByIndex('separationId', separationId);
  },

  /**
   * Log change
   */
  async logChange(
    separationId: number,
    changedBy: string,
    fieldChanged: string,
    oldValue: string | undefined,
    newValue: string | undefined,
    action: string,
    comments?: string
  ): Promise<SeparationHistoryRecord> {
    return this.create({
      separationId,
      changedBy,
      changeDate: new Date().toISOString(),
      fieldChanged,
      oldValue,
      newValue,
      action,
      comments,
    });
  },
};

// ========== SEED DATA ==========

/**
 * Seed default separation types
 */
export async function seedSeparationTypes(): Promise<void> {
  const db = await getDB();
  const count = await db.count('separationTypes');

  if (count === 0) {
    const types = [
      {
        code: 'RESIGN',
        name: 'Resignation',
        description: 'Voluntary resignation by employee',
        requiresNotice: true,
        defaultNoticePeriodDays: 30,
        requiresClearance: true,
        requiresExitInterview: true,
        requiresSettlement: true,
        isActive: true,
        displayOrder: 1,
      },
      {
        code: 'TERMIN',
        name: 'Termination',
        description: 'Involuntary termination by employer',
        requiresNotice: true,
        defaultNoticePeriodDays: 30,
        requiresClearance: true,
        requiresExitInterview: true,
        requiresSettlement: true,
        isActive: true,
        displayOrder: 2,
      },
      {
        code: 'RETIRE',
        name: 'Retirement',
        description: 'Retirement due to age',
        requiresNotice: true,
        defaultNoticePeriodDays: 60,
        requiresClearance: true,
        requiresExitInterview: true,
        requiresSettlement: true,
        isActive: true,
        displayOrder: 3,
      },
      {
        code: 'EOC',
        name: 'End of Contract',
        description: 'Contract term completed',
        requiresNotice: false,
        requiresClearance: true,
        requiresExitInterview: true,
        requiresSettlement: true,
        isActive: true,
        displayOrder: 4,
      },
      {
        code: 'DEATH',
        name: 'Death',
        description: 'Employee deceased',
        requiresNotice: false,
        requiresClearance: false,
        requiresExitInterview: false,
        requiresSettlement: true,
        isActive: true,
        displayOrder: 5,
      },
      {
        code: 'MUTUAL',
        name: 'Mutual Agreement',
        description: 'Separation by mutual agreement',
        requiresNotice: true,
        defaultNoticePeriodDays: 15,
        requiresClearance: true,
        requiresExitInterview: true,
        requiresSettlement: true,
        isActive: true,
        displayOrder: 6,
      },
      {
        code: 'ABANDON',
        name: 'Abandonment',
        description: 'Job abandonment (AWOL)',
        requiresNotice: false,
        requiresClearance: false,
        requiresExitInterview: false,
        requiresSettlement: true,
        isActive: true,
        displayOrder: 7,
      },
    ];

    for (const type of types) {
      await separationTypesService.create(type);
    }

    console.log('Seeded separation types:', types.length);
  }
}

/**
 * Seed default clearance departments
 */
export async function seedClearanceDepartments(): Promise<void> {
  const db = await getDB();
  const count = await db.count('exitClearanceDepartments');

  if (count === 0) {
    const departments = [
      {
        departmentName: 'HR Department',
        description: 'Return employee file, ID badge, and HR forms',
        isRequired: true,
        displayOrder: 1,
        isActive: true,
      },
      {
        departmentName: 'IT Department',
        description: 'Return laptop, phone, access cards, and software licenses',
        isRequired: true,
        displayOrder: 2,
        isActive: true,
      },
      {
        departmentName: 'Finance Department',
        description: 'Clear outstanding advances, loans, and expenses',
        isRequired: true,
        displayOrder: 3,
        isActive: true,
      },
      {
        departmentName: 'Administration',
        description: 'Return office keys, parking pass, and office equipment',
        isRequired: true,
        displayOrder: 4,
        isActive: true,
      },
      {
        departmentName: 'Direct Supervisor',
        description: 'Complete handover and knowledge transfer',
        isRequired: true,
        displayOrder: 5,
        isActive: true,
      },
      {
        departmentName: 'Library',
        description: 'Return any borrowed books or materials',
        isRequired: false,
        displayOrder: 6,
        isActive: true,
      },
    ];

    for (const dept of departments) {
      await clearanceDepartmentService.create(dept);
    }

    console.log('Seeded clearance departments:', departments.length);
  }
}
