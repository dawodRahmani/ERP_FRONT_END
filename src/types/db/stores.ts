/**
 * Database Store Registry
 *
 * Type definitions for all IndexedDB object stores in the VDO ERP database.
 * This file serves as the central type registry for the database schema.
 */

import type { DBSchema } from 'idb';

/**
 * VDO ERP Database Schema
 *
 * Defines all object stores and their indexes for type-safe database operations.
 * This schema is used by the idb library to provide TypeScript autocomplete and type checking.
 *
 * Total Stores: 80+
 * Modules: HR, Recruitment, Payroll, Leave, Performance, Training, Disciplinary, etc.
 */
export interface VDODatabase extends DBSchema {
  // ========== CORE HR STORES ==========

  employees: {
    key: number;
    value: {
      id: number;
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
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      employeeId: string;
      email: string;
      department: string;
      status: string;
      createdAt: string;
    };
  };

  employeePositionHistory: {
    key: number;
    value: {
      id: number;
      employeeId: number;
      position: string;
      department: string;
      project?: string;
      startDate: string;
      endDate?: string;
      isCurrent: boolean;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      employeeId: number;
      position: string;
      department: string;
      project: string;
      startDate: string;
      endDate: string;
      isCurrent: boolean;
      createdAt: string;
    };
  };

  departments: {
    key: number;
    value: {
      id: number;
      name: string;
      code: string;
      description?: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      name: string;
    };
  };

  positions: {
    key: number;
    value: {
      id: number;
      title: string;
      department: string;
      description?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      title: string;
      department: string;
    };
  };

  offices: {
    key: number;
    value: {
      id: number;
      name: string;
      code: string;
      type: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      name: string;
    };
  };

  grades: {
    key: number;
    value: {
      id: number;
      name: string;
      level?: number;
      description?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      name: string;
    };
  };

  employeeTypes: {
    key: number;
    value: {
      id: number;
      name: string;
      description?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      name: string;
    };
  };

  workSchedules: {
    key: number;
    value: {
      id: number;
      name: string;
      description?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      name: string;
    };
  };

  // ========== DOCUMENT MANAGEMENT ==========

  documentTypes: {
    key: number;
    value: {
      id: number;
      name: string;
      category?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      name: string;
    };
  };

  templateDocuments: {
    key: number;
    value: {
      id: number;
      name: string;
      category: string;
      fileUrl?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      name: string;
      category: string;
      createdAt: string;
    };
  };

  // ========== EXIT/SEPARATION STORES ==========

  separationTypes: {
    key: number;
    value: {
      id: number;
      code: string;
      name: string;
      description?: string;
      requiresNotice: boolean;
      defaultNoticePeriodDays?: number;
      requiresClearance: boolean;
      requiresExitInterview: boolean;
      requiresSettlement: boolean;
      isActive: boolean;
      displayOrder: number;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      code: string;
      isActive: boolean;
      displayOrder: number;
    };
  };

  separationRecords: {
    key: number;
    value: {
      id: number;
      separationNumber: string;
      employeeId: number;
      employeeName?: string;
      department?: string;
      position?: string;
      separationType: string;
      separationDate: string;
      lastWorkingDay: string;
      noticeDate?: string;
      noticePeriodDays?: number;
      reason?: string;
      comments?: string;
      status: string;
      requestedBy?: string;
      requestedAt?: string;
      approvedBy?: string;
      approvedAt?: string;
      rejectedBy?: string;
      rejectedAt?: string;
      rejectionReason?: string;
      isEligibleForRehire: boolean;
      requiresClearance: boolean;
      requiresExitInterview: boolean;
      clearanceCompletedAt?: string;
      settlementCompletedAt?: string;
      completedAt?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      separationNumber: string;
      employeeId: number;
      status: string;
      separationType: string;
      separationDate: string;
      department: string;
    };
  };

  exitClearances: {
    key: number;
    value: {
      id: number;
      separationId: number;
      departmentId: number;
      departmentName: string;
      responsiblePersonId?: number;
      responsiblePersonName?: string;
      status: string;
      requestedAt: string;
      completedAt?: string;
      comments?: string;
      rejectionReason?: string;
      waiveReason?: string;
      waivedBy?: string;
      waivedAt?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      separationId: number;
      departmentId: number;
      status: string;
    };
  };

  clearanceItems: {
    key: number;
    value: {
      id: number;
      clearanceId: number;
      separationId: number;
      itemType: string;
      itemName: string;
      itemCode?: string;
      description?: string;
      serialNumber?: string;
      status: string;
      returnedAt?: string;
      condition?: string;
      damageDescription?: string;
      replacementCost?: number;
      currency?: string;
      notes?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      clearanceId: number;
      separationId: number;
      status: string;
    };
  };

  exitClearanceDepartments: {
    key: number;
    value: {
      id: number;
      departmentName: string;
      description?: string;
      isRequired: boolean;
      displayOrder: number;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      departmentName: string;
      isActive: boolean;
      displayOrder: number;
    };
  };

  exitInterviews: {
    key: number;
    value: {
      id: number;
      separationId: number;
      employeeId: number;
      interviewDate: string;
      interviewerName?: string;
      status: string;
      jobSatisfactionRating?: number;
      workEnvironmentRating?: number;
      managementRating?: number;
      compensationRating?: number;
      careerGrowthRating?: number;
      workLifeBalanceRating?: number;
      overallRating?: number;
      reasonForLeaving?: string;
      wouldRecommendOrganization?: boolean;
      wouldConsiderReturning?: boolean;
      positiveAspects?: string;
      areasForImprovement?: string;
      managementFeedback?: string;
      finalComments?: string;
      interviewerComments?: string;
      scheduledAt?: string;
      completedAt?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      separationId: number;
      employeeId: number;
      status: string;
      interviewDate: string;
    };
  };

  exitComplianceChecks: {
    key: number;
    value: {
      id: number;
      separationId: number;
      employeeId: number;
      checkDate: string;
      checkedBy?: string;
      status: string;
      outstandingLoans: boolean;
      outstandingLoansAmount?: number;
      pendingLeaveRequests: boolean;
      pendingExpenses: boolean;
      pendingExpensesAmount?: number;
      trainingBond: boolean;
      trainingBondAmount?: number;
      disciplinaryIssues: boolean;
      activeProjects: boolean;
      dataAccess: boolean;
      issuesFound?: string;
      resolutionPlan?: string;
      resolvedAt?: string;
      resolvedBy?: string;
      notes?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      separationId: number;
      employeeId: number;
      status: string;
    };
  };

  finalSettlements: {
    key: number;
    value: {
      id: number;
      settlementNumber: string;
      separationId: number;
      employeeId: number;
      employeeName?: string;
      finalSalary: number;
      leaveEncashment: number;
      gratuity: number;
      bonus: number;
      otherEarnings: number;
      totalEarnings: number;
      loansRecovery: number;
      advancesRecovery: number;
      trainingBondRecovery: number;
      assetCharges: number;
      otherDeductions: number;
      totalDeductions: number;
      netAmount: number;
      currency: string;
      calculatedBy?: string;
      calculatedAt?: string;
      calculationNotes?: string;
      status: string;
      verifiedByHR?: string;
      verifiedByHRAt?: string;
      hrComments?: string;
      verifiedByFinance?: string;
      verifiedByFinanceAt?: string;
      financeComments?: string;
      approvedBy?: string;
      approvedAt?: string;
      approvalComments?: string;
      rejectedBy?: string;
      rejectedAt?: string;
      rejectionReason?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      settlementNumber: string;
      separationId: number;
      employeeId: number;
      status: string;
    };
  };

  settlementPayments: {
    key: number;
    value: {
      id: number;
      settlementId: number;
      separationId: number;
      employeeId: number;
      amount: number;
      currency: string;
      paymentMethod: string;
      paymentDate?: string;
      status: string;
      bankName?: string;
      accountNumber?: string;
      transactionReference?: string;
      chequeNumber?: string;
      processedBy?: string;
      processedAt?: string;
      verifiedBy?: string;
      verifiedAt?: string;
      notes?: string;
      failureReason?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      settlementId: number;
      separationId: number;
      employeeId: number;
      status: string;
    };
  };

  workCertificates: {
    key: number;
    value: {
      id: number;
      certificateNumber: string;
      separationId: number;
      employeeId: number;
      employeeName: string;
      position: string;
      department: string;
      joinDate: string;
      separationDate: string;
      certificateText?: string;
      issueDate: string;
      status: string;
      issuedBy?: string;
      approvedBy?: string;
      approvedAt?: string;
      documentUrl?: string;
      notes?: string;
      revokedBy?: string;
      revokedAt?: string;
      revocationReason?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      certificateNumber: string;
      separationId: number;
      employeeId: number;
      status: string;
    };
  };

  terminationRecords: {
    key: number;
    value: {
      id: number;
      separationId: number;
      employeeId: number;
      terminationType: string;
      terminationDate: string;
      effectiveDate: string;
      reason: string;
      details?: string;
      documentationProvided: boolean;
      documentUrls?: string;
      witnessNames?: string;
      noticePeriodWaived: boolean;
      waiveReason?: string;
      severancePaid: boolean;
      severanceAmount?: number;
      currency?: string;
      appealable: boolean;
      appealDeadline?: string;
      appealFiled: boolean;
      appealDate?: string;
      appealOutcome?: string;
      initiatedBy?: string;
      approvedBy?: string;
      approvedAt?: string;
      notes?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      separationId: number;
      employeeId: number;
      terminationType: string;
    };
  };

  handovers: {
    key: number;
    value: {
      id: number;
      separationId: number;
      employeeId: number;
      employeeName?: string;
      position?: string;
      handoverToId?: number;
      handoverToName?: string;
      startDate: string;
      targetCompletionDate: string;
      actualCompletionDate?: string;
      status: string;
      notes?: string;
      verifiedBy?: string;
      verifiedAt?: string;
      verificationComments?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      separationId: number;
      employeeId: number;
      handoverToId: number;
      status: string;
    };
  };

  handoverItems: {
    key: number;
    value: {
      id: number;
      handoverId: number;
      separationId: number;
      itemType: string;
      itemName: string;
      description?: string;
      location?: string;
      accessCredentials?: string;
      documentation?: string;
      status: string;
      handedOverAt?: string;
      verifiedAt?: string;
      issues?: string;
      notes?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      handoverId: number;
      separationId: number;
      status: string;
    };
  };

  separationHistory: {
    key: number;
    value: {
      id: number;
      separationId: number;
      changedBy: string;
      changeDate: string;
      fieldChanged: string;
      oldValue?: string;
      newValue?: string;
      action: string;
      comments?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: unknown;
    };
    indexes: {
      separationId: number;
      changeDate: string;
    };
  };

  // Note: Additional 50+ stores will be defined as we migrate remaining services
  // This file will be progressively enhanced during the migration process
  // Stores to be added:
  // - Recruitment stores (30+ stores)
  // - Payroll stores (12+ stores)
  // - Leave management stores (12+ stores)
  // - Performance stores (16+ stores)
  // - Training stores (13+ stores)
  // - Disciplinary stores (11+ stores)
  // - Employee Admin stores (14+ stores)
  // - Tracking stores (5+ stores)
}

/**
 * Store names as string literal union type
 * Provides autocomplete for store names
 */
export type StoreName = keyof VDODatabase;

/**
 * Get the value type for a specific store
 */
export type StoreValue<K extends StoreName> = VDODatabase[K]['value'];

/**
 * Get the key type for a specific store
 */
export type StoreKey<K extends StoreName> = VDODatabase[K]['key'];

/**
 * Get the index names for a specific store
 */
export type StoreIndexes<K extends StoreName> = VDODatabase[K] extends {
  indexes: infer I;
}
  ? keyof I
  : never;
