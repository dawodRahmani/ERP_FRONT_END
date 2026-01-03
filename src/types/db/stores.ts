/**
 * Database Store Registry
 *
 * Type definitions for all IndexedDB object stores in the VDO ERP database.
 * This file serves as the central type registry for the database schema.
 * All record types are imported from their respective module type files.
 */

// Core HR Types
import type {
  EmployeeRecord,
  EmployeeRecordIndex,
  EmployeePositionHistoryRecord,
  DepartmentRecord,
  PositionRecord,
  OfficeRecord,
  GradeRecord,
  EmployeeTypeRecord,
  WorkScheduleRecord,
  DocumentTypeRecord,
  TemplateDocumentRecord,
  UserRecord,
  RoleRecord,
  PermissionRecord,
  RolePermissionRecord,
} from "../modules/coreHR";

// Exit/Separation Types
import type {
  SeparationTypeRecord,
  SeparationRecord,
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
} from "../modules/exit";

// Tracking Types
import type {
  InOutTrackingRecord,
  AccessTrackingRecord,
  DNRTrackingRecord,
  MOUTrackingRecord,
  ProgramWorkPlanRecord,
} from "../modules/tracking";

// Recruitment Types
import type {
  RecruitmentRecord,
  TORRecord,
  SRFRecord,
  VacancyAnnouncementRecord,
  CandidateRecord,
  CandidateApplicationRecord,
  CandidateEducationRecord,
  CandidateExperienceRecord,
  RecruitmentCommitteeRecord,
  CommitteeMemberRecord,
  COIDeclarationRecord,
  LonglistingRecord,
  LonglistingCandidateRecord,
  ShortlistingRecord,
  ShortlistingCandidateRecord,
  WrittenTestRecord,
  WrittenTestCandidateRecord,
  RecruitmentInterviewRecord,
  InterviewCandidateRecord,
  InterviewEvaluationRecord,
  InterviewResultRecord,
  RecruitmentReportRecord,
  OfferLetterRecord,
  SanctionClearanceRecord,
  BackgroundCheckRecord,
  EmploymentContractRecord,
  FileChecklistRecord,
  ProvinceRecord,
} from "../modules/recruitment";

// Leave Management Types
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
} from "../modules/leave";

// Payroll Types
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
} from "../modules/payroll";

// Performance Types
import type {
  AppraisalCycleRecord,
  AppraisalTemplateRecord,
  AppraisalSectionRecord,
  AppraisalCriteriaRecord,
  EmployeeAppraisalRecord,
  AppraisalRatingRecord,
  AppraisalCommitteeMemberRecord,
  AppraisalGoalRecord,
  AppraisalTrainingNeedRecord,
  ProbationRecord,
  ProbationExtensionRecord,
  ProbationKPIRecord,
  PerformanceImprovementPlanRecord,
  PIPGoalRecord,
  PIPCheckInRecord,
  AppraisalOutcomeRecord,
} from "../modules/performance";

// Training Types
import type {
  TrainingTypeRecord,
  TrainingProgramRecord,
  TrainingNeedsAssessmentRecord,
  TNATrainingNeedRecord,
  TrainingCalendarRecord,
  TrainingBudgetProposalRecord,
  TrainingRecord,
  TrainingParticipantRecord,
  TrainingSessionRecord,
  TrainingEvaluationRecord,
  TrainingCertificateRecord,
  TrainingBondRecord,
  EmployeeTrainingHistoryRecord,
  TrainingReportRecord,
} from "../modules/training";

// Disciplinary Types
import type {
  MisconductReportRecord,
  MisconductEvidenceRecord,
  DisciplinaryInvestigationRecord,
  InvestigationInterviewRecord,
  PrecautionarySuspensionRecord,
  DisciplinaryActionRecord,
  DisciplinaryAppealRecord,
  EmployeeWarningHistoryRecord,
  EmployeeGrievanceRecord,
  ComplianceIncidentRecord,
  MisconductCaseNoteRecord,
} from "../modules/disciplinary";

// Employee Admin Types
import type {
  EmergencyContactRecord,
  EmployeeEducationRecord,
  EmployeeExperienceRecord,
  EmployeeSkillRecord,
  EmployeeMedicalRecord,
  PersonnelFileRecord,
  PersonnelDocumentRecord,
  OnboardingChecklistRecord,
  OnboardingItemRecord,
  PolicyAcknowledgementRecord,
  InterimHiringRequestRecord,
  InterimHiringApprovalRecord,
  MahramRegistrationRecord,
  EmployeeStatusHistoryRecord,
} from "../modules/employeeAdmin";

// Finance Types
import type {
  DonorRecord,
  ProjectRecord,
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
  InstallmentRequestRecord,
  InstallmentReceiptRecord,
  StaffSalaryAllocationRecord,
  PayrollDistributionRecord,
  DonorReportingScheduleRecord,
  DonorReportPeriodRecord,
  GovernmentReportingRecord,
  ProjectAmendmentRecord,
  SignatoryAssignmentRecord,
} from "../modules/finance";

// Compliance Types
import type {
  ComplianceProjectRecord,
  ComplianceDocumentRecord,
  ComplianceAmendmentRecord,
  ProposalRecord,
  DueDiligenceRecord,
  RegistrationRecord,
  MembershipRecord,
  CertificateRecord,
  BoardOfDirectorsRecord,
  PartnerRecord,
  DonorOutreachRecord,
  GovernmentOutreachRecord,
  BlacklistRecord,
} from "../modules/compliance";

// Audit Types
import type {
  AuditTypeRecord,
  AuditTypeRecordIndex,
  HACTAssessmentRecord,
  HACTAssessmentRecordIndex,
  DonorProjectAuditRecord,
  DonorProjectAuditRecordIndex,
  ExternalAuditRecord,
  ExternalAuditRecordIndex,
  ExternalAnnualAuditRecord,
  ExternalAnnualAuditRecordIndex,
  InternalAuditRecord,
  InternalAuditRecordIndex,
  InternalQuarterlyReportRecord,
  InternalQuarterlyReportRecordIndex,
  PartnerAuditRecord,
  PartnerAuditRecordIndex,
  CorrectiveActionRecord,
  CorrectiveActionRecordIndex,
} from "../modules/audit";

// Contract Types
import type {
  ContractTypeRecord,
  EmployeeContractRecord,
  ContractAmendmentRecord,
} from "../modules/contracts";

// Asset Types
import type {
  AssetTypeRecord,
  EmployeeAssetRecord,
  IDCardRecord,
  SIMCardRecord,
  EmployeeEmailRecord,
} from "../modules/assets";

// Travel Types
import type {
  TravelRequestRecord,
  TravelApprovalRecord,
  DSARateRecord,
  DSAPaymentRecord,
  MahramTravelRecord,
  WorkRelatedInjuryRecord,
} from "../modules/travel";

// Staff Association Types
import type {
  StaffAssociationPositionRecord,
  StaffAssociationMemberRecord,
  AssociationMeetingRecord,
  AssociationActivityRecord,
  StaffAssociationContributionRecord,
  StaffWelfareRequestRecord,
  StaffWelfarePaymentRecord,
} from "../modules/staffAssociation";

// Procurement Types
import type {
  VendorRecord,
  ItemCategoryRecord,
  PurchaseRequestRecord,
  RFQRecord,
  PurchaseOrderRecord,
  GoodsReceiptRecord,
  InventoryItemRecord,
  ProcurementContractRecord,
} from "../modules/procurement";

// Policy Types
import type {
  PolicyVersionRecord,
  HRAuditLogRecord,
  ConductAcknowledgmentRecord,
  PSEADeclarationRecord,
} from "../modules/policy";

// Legacy Types (for backward compatibility)
import type {
  JobRequisitionRecord,
  JobAnnouncementRecord,
  JobOfferRecord,
  TestResultRecord,
  ReferenceCheckRecord,
  ShortlistingScoreRecord,
  ProbationEvaluationRecord,
  SalaryComponentRecord,
  PayrollRecord,
  AllowanceTypeRecord,
  EmployeeRewardRecord,
  CTORecord,
  IDPRecord,
  IDPGoalRecord,
  DisciplinaryTypeRecord,
  GrievanceTypeRecord,
  GrievanceRecord,
  GrievanceInvestigationRecord,
  GrievanceResolutionRecord,
  OrientationChecklistRecord,
  OrientationItemRecord,
} from "../modules/legacy";

/**
 * VDO ERP Database Schema
 *
 * Defines all object stores and their indexes for type-safe database operations.
 * This schema is used by the idb library to provide TypeScript autocomplete and type checking.
 *
 * Total Stores: 141
 * Modules: HR, Recruitment, Payroll, Leave, Performance, Training, Disciplinary, etc.
 */
export interface VDODatabase {
  // ========== CORE HR STORES ==========

  employees: {
    key: number;
    value: EmployeeRecord;
    indexes: EmployeeRecordIndex;
  };

  employeePositionHistory: {
    key: number;
    value: EmployeePositionHistoryRecord;
    indexes: {
      employeeId: number;
      position: string;
      department: string;
      project: string;
      startDate: string;
      endDate: string;
      createdAt: string;
    };
  };

  departments: {
    key: number;
    value: DepartmentRecord;
    indexes: {
      name: string;
    };
  };

  positions: {
    key: number;
    value: PositionRecord;
    indexes: {
      title: string;
      department: string;
    };
  };

  offices: {
    key: number;
    value: OfficeRecord;
    indexes: {
      name: string;
    };
  };

  grades: {
    key: number;
    value: GradeRecord;
    indexes: {
      name: string;
    };
  };

  employeeTypes: {
    key: number;
    value: EmployeeTypeRecord;
    indexes: {
      name: string;
    };
  };

  workSchedules: {
    key: number;
    value: WorkScheduleRecord;
    indexes: {
      name: string;
    };
  };

  // ========== DOCUMENT MANAGEMENT ==========

  documentTypes: {
    key: number;
    value: DocumentTypeRecord;
    indexes: {
      name: string;
    };
  };

  templateDocuments: {
    key: number;
    value: TemplateDocumentRecord;
    indexes: {
      name: string;
      category: string;
      createdAt: string;
    };
  };

  // ========== EXIT/SEPARATION STORES ==========

  separationTypes: {
    key: number;
    value: SeparationTypeRecord;
    indexes: {
      code: string;
      displayOrder: number;
    };
  };

  separationRecords: {
    key: number;
    value: SeparationRecord;
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
    value: ExitClearanceRecord;
    indexes: {
      separationId: number;
      departmentId: number;
      status: string;
    };
  };

  clearanceItems: {
    key: number;
    value: ClearanceItemRecord;
    indexes: {
      clearanceId: number;
      separationId: number;
      status: string;
    };
  };

  exitClearanceDepartments: {
    key: number;
    value: ExitClearanceDepartmentRecord;
    indexes: {
      departmentName: string;
      displayOrder: number;
    };
  };

  exitInterviews: {
    key: number;
    value: ExitInterviewRecord;
    indexes: {
      separationId: number;
      employeeId: number;
      status: string;
      interviewDate: string;
    };
  };

  exitComplianceChecks: {
    key: number;
    value: ExitComplianceCheckRecord;
    indexes: {
      separationId: number;
      employeeId: number;
      status: string;
    };
  };

  finalSettlements: {
    key: number;
    value: FinalSettlementRecord;
    indexes: {
      settlementNumber: string;
      separationId: number;
      employeeId: number;
      status: string;
    };
  };

  settlementPayments: {
    key: number;
    value: SettlementPaymentRecord;
    indexes: {
      settlementId: number;
      separationId: number;
      employeeId: number;
      status: string;
    };
  };

  workCertificates: {
    key: number;
    value: WorkCertificateRecord;
    indexes: {
      certificateNumber: string;
      separationId: number;
      employeeId: number;
      status: string;
    };
  };

  terminationRecords: {
    key: number;
    value: TerminationRecord;
    indexes: {
      separationId: number;
      employeeId: number;
      terminationType: string;
    };
  };

  handovers: {
    key: number;
    value: HandoverRecord;
    indexes: {
      separationId: number;
      employeeId: number;
      handoverToId: number;
      status: string;
    };
  };

  handoverItems: {
    key: number;
    value: HandoverItemRecord;
    indexes: {
      handoverId: number;
      separationId: number;
      status: string;
    };
  };

  separationHistory: {
    key: number;
    value: SeparationHistoryRecord;
    indexes: {
      separationId: number;
      changeDate: string;
    };
  };

  // ========== TRACKING STORES ==========

  inOutTracking: {
    key: number;
    value: InOutTrackingRecord;
    indexes: {
      serialNumber: string;
      date: string;
      documentType: string;
      department: string;
      status: string;
      createdAt: string;
    };
  };

  accessTracking: {
    key: number;
    value: AccessTrackingRecord;
    indexes: {
      year: number;
      quarter: number;
      donor: string;
      project: string;
      location: string;
      lineMinistry: string;
      projectStatus: string;
      createdAt: string;
    };
  };

  dnrTracking: {
    key: number;
    value: DNRTrackingRecord;
    indexes: {
      year: number;
      quarter: number;
      donor: string;
      project: string;
      reportType: string;
      status: string;
      dueDate: string;
      createdAt: string;
    };
  };

  mouTracking: {
    key: number;
    value: MOUTrackingRecord;
    indexes: {
      mouNumber: string;
      partner: string;
      type: string;
      status: string;
      startDate: string;
      endDate: string;
      department: string;
      createdAt: string;
    };
  };

  programWorkPlans: {
    key: number;
    value: ProgramWorkPlanRecord;
    indexes: {
      year: number;
      quarter: number;
      month: number;
      department: string;
      responsible: string;
      status: string;
      targetDate: string;
      createdAt: string;
    };
  };

  // ========== RECRUITMENT STORES ==========

  recruitments: {
    key: number;
    value: RecruitmentRecord;
    indexes: {
      recruitmentCode: string;
      status: string;
      currentStep: number;
      department: string;
      createdAt: string;
    };
  };

  termsOfReferences: {
    key: number;
    value: TORRecord;
    indexes: {
      recruitmentId: number;
      status: string;
    };
  };

  staffRequisitions: {
    key: number;
    value: SRFRecord;
    indexes: {
      recruitmentId: number;
      status: string;
    };
  };

  vacancyAnnouncements: {
    key: number;
    value: VacancyAnnouncementRecord;
    indexes: {
      recruitmentId: number;
      status: string;
      closingDate: string;
    };
  };

  recruitmentCandidates: {
    key: number;
    value: CandidateRecord;
    indexes: {
      candidateCode: string;
      email: string;
      phone: string;
    };
  };

  candidateApplications: {
    key: number;
    value: CandidateApplicationRecord;
    indexes: {
      applicationCode: string;
      recruitmentId: number;
      candidateId: number;
      status: string;
    };
  };

  candidateEducations: {
    key: number;
    value: CandidateEducationRecord;
    indexes: {
      candidateId: number;
    };
  };

  candidateExperiences: {
    key: number;
    value: CandidateExperienceRecord;
    indexes: {
      candidateId: number;
    };
  };

  recruitmentCommittees: {
    key: number;
    value: RecruitmentCommitteeRecord;
    indexes: {
      recruitmentId: number;
      status: string;
    };
  };

  committeeMembers: {
    key: number;
    value: CommitteeMemberRecord;
    indexes: {
      committeeId: number;
      employeeId: number;
    };
  };

  coiDeclarations: {
    key: number;
    value: COIDeclarationRecord;
    indexes: {
      committeeMemberId: number;
      recruitmentId: number;
    };
  };

  longlistings: {
    key: number;
    value: LonglistingRecord;
    indexes: {
      recruitmentId: number;
      status: string;
    };
  };

  longlistingCandidates: {
    key: number;
    value: LonglistingCandidateRecord;
    indexes: {
      longlistingId: number;
      candidateApplicationId: number;
    };
  };

  shortlistings: {
    key: number;
    value: ShortlistingRecord;
    indexes: {
      recruitmentId: number;
      status: string;
    };
  };

  shortlistingCandidates: {
    key: number;
    value: ShortlistingCandidateRecord;
    indexes: {
      shortlistingId: number;
      candidateApplicationId: number;
    };
  };

  writtenTests: {
    key: number;
    value: WrittenTestRecord;
    indexes: {
      recruitmentId: number;
      status: string;
    };
  };

  writtenTestCandidates: {
    key: number;
    value: WrittenTestCandidateRecord;
    indexes: {
      writtenTestId: number;
      candidateApplicationId: number;
      uniqueCode: string;
    };
  };

  recruitmentInterviews: {
    key: number;
    value: RecruitmentInterviewRecord;
    indexes: {
      recruitmentId: number;
      status: string;
    };
  };

  recruitmentInterviewCandidates: {
    key: number;
    value: InterviewCandidateRecord;
    indexes: {
      interviewId: number;
      candidateApplicationId: number;
    };
  };

  recruitmentInterviewEvaluations: {
    key: number;
    value: InterviewEvaluationRecord;
    indexes: {
      interviewCandidateId: number;
      evaluatorId: number;
    };
  };

  recruitmentInterviewResults: {
    key: number;
    value: InterviewResultRecord;
    indexes: {
      interviewCandidateId: number;
    };
  };

  recruitmentReports: {
    key: number;
    value: RecruitmentReportRecord;
    indexes: {
      recruitmentId: number;
      reportNumber: string;
      status: string;
    };
  };

  offerLetters: {
    key: number;
    value: OfferLetterRecord;
    indexes: {
      recruitmentId: number;
      candidateApplicationId: number;
      status: string;
    };
  };

  sanctionClearances: {
    key: number;
    value: SanctionClearanceRecord;
    indexes: {
      recruitmentId: number;
      candidateApplicationId: number;
      status: string;
    };
  };

  backgroundChecks: {
    key: number;
    value: BackgroundCheckRecord;
    indexes: {
      recruitmentId: number;
      candidateApplicationId: number;
      overallStatus: string;
    };
  };

  employmentContracts: {
    key: number;
    value: EmploymentContractRecord;
    indexes: {
      recruitmentId: number;
      candidateApplicationId: number;
      contractNumber: string;
      status: string;
    };
  };

  fileChecklists: {
    key: number;
    value: FileChecklistRecord;
    indexes: {
      recruitmentId: number;
      status: string;
    };
  };

  provinces: {
    key: number;
    value: ProvinceRecord;
    indexes: {
      name: string;
    };
  };

  // ========== LEAVE MANAGEMENT STORES ==========

  leaveTypes: {
    key: number;
    value: LeaveTypeRecord;
    indexes: {
      name: string;
      code: string;
      status: string;
      isActive: number;
      displayOrder: number;
    };
  };

  leavePolicies: {
    key: number;
    value: LeavePolicyRecord;
    indexes: {
      leaveTypeId: number;
      fiscalYear: string;
      isActive: number;
    };
  };

  employeeLeaveBalances: {
    key: number;
    value: EmployeeLeaveBalanceRecord;
    indexes: {
      employeeId: number;
      leaveTypeId: number;
      fiscalYear: string;
    };
  };

  leaveRequests: {
    key: number;
    value: LeaveRequestRecord;
    indexes: {
      requestNumber: string;
      employeeId: number;
      leaveTypeId: number;
      status: string;
      startDate: string;
      endDate: string;
      department: string;
    };
  };

  leaveRequestDays: {
    key: number;
    value: LeaveRequestDayRecord;
    indexes: {
      leaveRequestId: number;
      date: string;
    };
  };

  leaveApprovals: {
    key: number;
    value: LeaveApprovalRecord;
    indexes: {
      leaveRequestId: number;
      level: number;
      approverId: number;
      action: string;
      isPending: number;
    };
  };

  holidays: {
    key: number;
    value: HolidayRecord;
    indexes: {
      date: string;
      fiscalYear: string;
      holidayType: string;
      isActive: number;
    };
  };

  attendance: {
    key: number;
    value: AttendanceRecord;
    indexes: {
      employeeId: number;
      date: string;
      status: string;
    };
  };

  timesheets: {
    key: number;
    value: TimesheetRecord;
    indexes: {
      employeeId: number;
      month: number;
      year: number;
      status: string;
    };
  };

  oicAssignments: {
    key: number;
    value: OICAssignmentRecord;
    indexes: {
      leaveRequestId: number;
      employeeId: number;
      oicEmployeeId: number;
      status: string;
    };
  };

  leaveAdjustments: {
    key: number;
    value: LeaveAdjustmentRecord;
    indexes: {
      employeeId: number;
      leaveTypeId: number;
      status: string;
      fiscalYear: string;
    };
  };

  leaveCarryoverRecords: {
    key: number;
    value: LeaveCarryoverRecord;
    indexes: {
      employeeId: number;
      leaveTypeId: number;
      fromYear: string;
      toYear: string;
    };
  };

  // ========== PAYROLL STORES ==========

  payrollPeriods: {
    key: number;
    value: PayrollPeriodRecord;
    indexes: {
      periodCode: string;
      status: string;
      year: number;
      month: number;
      startDate: string;
    };
  };

  salaryStructures: {
    key: number;
    value: SalaryStructureRecord;
    indexes: {
      componentCode: string;
      componentType: string;
      isActive: number;
      applicableTo: string;
    };
  };

  employeeSalaryDetails: {
    key: number;
    value: EmployeeSalaryDetailRecord;
    indexes: {
      employeeId: number;
      effectiveFrom: string;
      isCurrent: number;
    };
  };

  employeeAllowances: {
    key: number;
    value: EmployeeAllowanceRecord;
    indexes: {
      employeeId: number;
      salaryComponentId: number;
      isActive: number;
      effectiveFrom: string;
    };
  };

  payrollEntries: {
    key: number;
    value: PayrollEntryRecord;
    indexes: {
      payrollPeriodId: number;
      employeeId: number;
      status: string;
      department: string;
    };
  };

  salaryAdvances: {
    key: number;
    value: SalaryAdvanceRecord;
    indexes: {
      advanceNumber: string;
      employeeId: number;
      status: string;
      requestDate: string;
    };
  };

  advanceRepayments: {
    key: number;
    value: AdvanceRepaymentRecord;
    indexes: {
      advanceId: number;
      payrollEntryId: number;
      repaymentDate: string;
    };
  };

  employeeLoans: {
    key: number;
    value: EmployeeLoanRecord;
    indexes: {
      loanNumber: string;
      employeeId: number;
      loanType: string;
      status: string;
      requestDate: string;
    };
  };

  loanRepayments: {
    key: number;
    value: LoanRepaymentRecord;
    indexes: {
      loanId: number;
      payrollEntryId: number;
      repaymentDate: string;
    };
  };

  overtimeRecords: {
    key: number;
    value: OvertimeRecord;
    indexes: {
      employeeId: number;
      date: string;
      overtimeType: string;
      status: string;
    };
  };

  payslips: {
    key: number;
    value: PayslipRecord;
    indexes: {
      payslipNumber: string;
      payrollEntryId: number;
      employeeId: number;
      periodYear: number;
      periodMonth: number;
    };
  };

  bankTransfers: {
    key: number;
    value: BankTransferRecord;
    indexes: {
      batchNumber: string;
      payrollPeriodId: number;
      status: string;
      transferDate: string;
    };
  };

  cashPayments: {
    key: number;
    value: CashPaymentRecord;
    indexes: {
      voucherNumber: string;
      payrollEntryId: number;
      employeeId: number;
      status: string;
      paymentDate: string;
    };
  };

  // ========== PERFORMANCE STORES ==========

  appraisalCycles: {
    key: number;
    value: AppraisalCycleRecord;
    indexes: {
      status: string;
      startDate: string;
      endDate: string;
    };
  };

  appraisalTemplates: {
    key: number;
    value: AppraisalTemplateRecord;
    indexes: {
      name: string;
      isActive: number;
    };
  };

  appraisalSections: {
    key: number;
    value: AppraisalSectionRecord;
    indexes: {
      templateId: number;
      displayOrder: number;
    };
  };

  appraisalCriteria: {
    key: number;
    value: AppraisalCriteriaRecord;
    indexes: {
      sectionId: number;
    };
  };

  employeeAppraisals: {
    key: number;
    value: EmployeeAppraisalRecord;
    indexes: {
      cycleId: number;
      employeeId: number;
      templateId: number;
      status: string;
    };
  };

  appraisalRatings: {
    key: number;
    value: AppraisalRatingRecord;
    indexes: {
      appraisalId: number;
      criteriaId: number;
    };
  };

  appraisalCommitteeMembers: {
    key: number;
    value: AppraisalCommitteeMemberRecord;
    indexes: {
      appraisalId: number;
      employeeId: number;
    };
  };

  appraisalGoals: {
    key: number;
    value: AppraisalGoalRecord;
    indexes: {
      appraisalId: number;
      status: string;
    };
  };

  appraisalTrainingNeeds: {
    key: number;
    value: AppraisalTrainingNeedRecord;
    indexes: {
      appraisalId: number;
    };
  };

  probationRecords: {
    key: number;
    value: ProbationRecord;
    indexes: {
      employeeId: number;
      status: string;
      startDate: string;
      endDate: string;
    };
  };

  probationExtensions: {
    key: number;
    value: ProbationExtensionRecord;
    indexes: {
      probationId: number;
    };
  };

  probationKpis: {
    key: number;
    value: ProbationKPIRecord;
    indexes: {
      probationId: number;
      status: string;
    };
  };

  performanceImprovementPlans: {
    key: number;
    value: PerformanceImprovementPlanRecord;
    indexes: {
      employeeId: number;
      status: string;
    };
  };

  pipGoals: {
    key: number;
    value: PIPGoalRecord;
    indexes: {
      pipId: number;
      status: string;
    };
  };

  pipCheckIns: {
    key: number;
    value: PIPCheckInRecord;
    indexes: {
      pipId: number;
      checkInDate: string;
    };
  };

  appraisalOutcomes: {
    key: number;
    value: AppraisalOutcomeRecord;
    indexes: {
      appraisalId: number;
      outcome: string;
    };
  };

  // ========== TRAINING STORES ==========

  trainingTypes: {
    key: number;
    value: TrainingTypeRecord;
    indexes: {
      code: string;
      category: string;
      isActive: number;
      isMandatory: number;
    };
  };

  trainingPrograms: {
    key: number;
    value: TrainingProgramRecord;
    indexes: {
      programCode: string;
      trainingTypeId: number;
      isActive: number;
    };
  };

  trainingNeedsAssessments: {
    key: number;
    value: TrainingNeedsAssessmentRecord;
    indexes: {
      assessmentNumber: string;
      employeeId: number;
      status: string;
      assessmentPeriod: string;
    };
  };

  tnaTrainingNeeds: {
    key: number;
    value: TNATrainingNeedRecord;
    indexes: {
      tnaId: number;
      status: string;
    };
  };

  trainingCalendar: {
    key: number;
    value: TrainingCalendarRecord;
    indexes: {
      fiscalYear: string;
      status: string;
    };
  };

  trainingBudgetProposals: {
    key: number;
    value: TrainingBudgetProposalRecord;
    indexes: {
      proposalNumber: string;
      status: string;
    };
  };

  trainings: {
    key: number;
    value: TrainingRecord;
    indexes: {
      trainingCode: string;
      status: string;
      startDate: string;
    };
  };

  trainingParticipants: {
    key: number;
    value: TrainingParticipantRecord;
    indexes: {
      trainingId: number;
      employeeId: number;
    };
  };

  trainingSessions: {
    key: number;
    value: TrainingSessionRecord;
    indexes: {
      trainingId: number;
      status: string;
    };
  };

  trainingEvaluations: {
    key: number;
    value: TrainingEvaluationRecord;
    indexes: {
      trainingId: number;
      participantId: number;
    };
  };

  trainingCertificates: {
    key: number;
    value: TrainingCertificateRecord;
    indexes: {
      certificateNumber: string;
      trainingId: number;
      employeeId: number;
      status: string;
    };
  };

  trainingBonds: {
    key: number;
    value: TrainingBondRecord;
    indexes: {
      bondNumber: string;
      employeeId: number;
      status: string;
    };
  };

  employeeTrainingHistory: {
    key: number;
    value: EmployeeTrainingHistoryRecord;
    indexes: {
      employeeId: number;
    };
  };

  trainingReports: {
    key: number;
    value: TrainingReportRecord;
    indexes: {
      reportNumber: string;
      trainingId: number;
      status: string;
    };
  };

  // ========== DISCIPLINARY STORES ==========

  misconductReports: {
    key: number;
    value: MisconductReportRecord;
    indexes: {
      reportNumber: string;
      accusedEmployeeId: number;
      reportSource: string;
      misconductCategory: string;
      misconductType: string;
      severityLevel: string;
      status: string;
      reportDate: string;
    };
  };

  misconductEvidence: {
    key: number;
    value: MisconductEvidenceRecord;
    indexes: {
      reportId: number;
      investigationId: number;
      evidenceType: string;
    };
  };

  disciplinaryInvestigations: {
    key: number;
    value: DisciplinaryInvestigationRecord;
    indexes: {
      investigationNumber: string;
      reportId: number;
      accusedEmployeeId: number;
      investigationType: string;
      status: string;
      leadInvestigatorId: number;
    };
  };

  investigationInterviews: {
    key: number;
    value: InvestigationInterviewRecord;
    indexes: {
      investigationId: number;
      interviewType: string;
      interviewDate: string;
    };
  };

  precautionarySuspensions: {
    key: number;
    value: PrecautionarySuspensionRecord;
    indexes: {
      employeeId: number;
      reportId: number;
      status: string;
      suspensionType: string;
    };
  };

  disciplinaryActions: {
    key: number;
    value: DisciplinaryActionRecord;
    indexes: {
      actionNumber: string;
      employeeId: number;
      actionType: string;
      actionLevel: string;
      status: string;
      issueDate: string;
      expiryDate: string;
    };
  };

  disciplinaryAppeals: {
    key: number;
    value: DisciplinaryAppealRecord;
    indexes: {
      appealNumber: string;
      disciplinaryActionId: number;
      employeeId: number;
      status: string;
    };
  };

  employeeWarningHistory: {
    key: number;
    value: EmployeeWarningHistoryRecord;
    indexes: {
      employeeId: number;
      warningType: string;
      isActive: number;
      expiryDate: string;
    };
  };

  employeeGrievances: {
    key: number;
    value: EmployeeGrievanceRecord;
    indexes: {
      grievanceNumber: string;
      employeeId: number;
      grievanceType: string;
      status: string;
      assignedTo: number;
    };
  };

  complianceIncidents: {
    key: number;
    value: ComplianceIncidentRecord;
    indexes: {
      incidentNumber: string;
      reportId: number;
      incidentType: string;
      severity: string;
      status: string;
    };
  };

  misconductCaseNotes: {
    key: number;
    value: MisconductCaseNoteRecord;
    indexes: {
      caseType: string;
      caseId: number;
      noteType: string;
    };
  };

  // ========== EMPLOYEE ADMIN STORES ==========

  emergencyContacts: {
    key: number;
    value: EmergencyContactRecord;
    indexes: {
      employeeId: number;
      relationship: string;
      isPrimary: number;
    };
  };

  employeeEducation: {
    key: number;
    value: EmployeeEducationRecord;
    indexes: {
      employeeId: number;
      level: string;
      isVerified: number;
    };
  };

  employeeExperience: {
    key: number;
    value: EmployeeExperienceRecord;
    indexes: {
      employeeId: number;
      isVerified: number;
    };
  };

  employeeSkills: {
    key: number;
    value: EmployeeSkillRecord;
    indexes: {
      employeeId: number;
      skillType: string;
      proficiency: string;
    };
  };

  employeeMedical: {
    key: number;
    value: EmployeeMedicalRecord;
    indexes: {
      employeeId: number;
      bloodType: string;
    };
  };

  personnelFiles: {
    key: number;
    value: PersonnelFileRecord;
    indexes: {
      employeeId: number;
      status: string;
      lastAuditDate: string;
    };
  };

  personnelDocuments: {
    key: number;
    value: PersonnelDocumentRecord;
    indexes: {
      personnelFileId: number;
      section: string;
      documentType: string;
      isVerified: number;
    };
  };

  onboardingChecklists: {
    key: number;
    value: OnboardingChecklistRecord;
    indexes: {
      employeeId: number;
      status: string;
      startDate: string;
      completedDate: string;
    };
  };

  onboardingItems: {
    key: number;
    value: OnboardingItemRecord;
    indexes: {
      checklistId: number;
      section: string;
      status: string;
      assignedTo: number;
    };
  };

  policyAcknowledgements: {
    key: number;
    value: PolicyAcknowledgementRecord;
    indexes: {
      employeeId: number;
      policyName: string;
      acknowledgedDate: string;
      version: string;
    };
  };

  interimHiringRequests: {
    key: number;
    value: InterimHiringRequestRecord;
    indexes: {
      requestNumber: string;
      department: string;
      status: string;
      requestedBy: string;
      requestDate: string;
      urgency: string;
    };
  };

  interimHiringApprovals: {
    key: number;
    value: InterimHiringApprovalRecord;
    indexes: {
      requestId: number;
      level: number;
      status: string;
      approvedBy: string;
      approvalDate: string;
    };
  };

  mahramRegistrations: {
    key: number;
    value: MahramRegistrationRecord;
    indexes: {
      employeeId: number;
      mahramName: string;
      relationship: string;
      status: string;
      availability: string;
      isVerified: number;
    };
  };

  employeeStatusHistory: {
    key: number;
    value: EmployeeStatusHistoryRecord;
    indexes: {
      employeeId: number;
      fromStatus: string;
      toStatus: string;
      changedAt: string;
      changedBy: string;
    };
  };

  // ========== ADDITIONAL CORE HR STORES ==========

  users: {
    key: number;
    value: UserRecord;
    indexes: {
      email: string;
      username: string;
      roleId: number;
      status: string;
      employeeId: number;
    };
  };

  roles: {
    key: number;
    value: RoleRecord;
    indexes: {
      name: string;
    };
  };

  permissions: {
    key: number;
    value: PermissionRecord;
    indexes: {
      name: string;
      module: string;
    };
  };

  rolePermissions: {
    key: number;
    value: RolePermissionRecord;
    indexes: {
      roleId: number;
      permissionId: number;
    };
  };

  // ========== FINANCE STORES ==========

  donors: {
    key: number;
    value: DonorRecord;
    indexes: {
      name: string;
      code: string;
      type: string;
      status: string;
    };
  };

  projects: {
    key: number;
    value: ProjectRecord;
    indexes: {
      projectCode: string;
      name: string;
      donorId: number;
      department: string;
      status: string;
      startDate: string;
      endDate: string;
    };
  };

  // ========== COMPLIANCE STORES ==========

  complianceProjects: {
    key: number;
    value: ComplianceProjectRecord;
    indexes: {
      projectId: number;
      complianceType: string;
      status: string;
      riskLevel: string;
      dueDate: string;
    };
  };

  complianceDocuments: {
    key: number;
    value: ComplianceDocumentRecord;
    indexes: {
      projectId: number;
      complianceProjectId: number;
      documentType: string;
      status: string;
      expiryDate: string;
    };
  };

  complianceAmendments: {
    key: number;
    value: ComplianceAmendmentRecord;
    indexes: {
      projectId: number;
      complianceProjectId: number;
      amendmentType: string;
      status: string;
    };
  };

  proposals: {
    key: number;
    value: ProposalRecord;
    indexes: {
      donor: string;
      status: string;
      result: string;
      createdAt: string;
    };
  };

  // ========== EXTENDED FINANCE STORES ==========

  banks: {
    key: number;
    value: BankRecord;
    indexes: {
      bankName: string;
      bankCode: string;
      isActive: boolean;
    };
  };

  bankAccounts: {
    key: number;
    value: BankAccountRecord;
    indexes: {
      bankId: number;
      accountNumber: string;
      currency: string;
      isActive: boolean;
    };
  };

  bankSignatories: {
    key: number;
    value: BankSignatoryRecord;
    indexes: {
      bankAccountId: number;
      employeeId: number;
      signatoryType: string;
      isActive: boolean;
    };
  };

  budgetCategories: {
    key: number;
    value: BudgetCategoryRecord;
    indexes: {
      categoryName: string;
      categoryCode: string;
      parentId: number;
      isActive: boolean;
    };
  };

  projectBudgets: {
    key: number;
    value: ProjectBudgetRecord;
    indexes: {
      projectId: number;
      budgetCategoryId: number;
      fiscalYear: string;
    };
  };

  budgetExpenditures: {
    key: number;
    value: BudgetExpenditureRecord;
    indexes: {
      projectBudgetId: number;
      expenditureDate: string;
      createdBy: string;
    };
  };

  projectStaffCosts: {
    key: number;
    value: ProjectStaffCostRecord;
    indexes: {
      projectId: number;
      employeeId: number;
      amendmentNumber: number;
      gradeLevel: string;
    };
  };

  projectOperationalCosts: {
    key: number;
    value: ProjectOperationalCostRecord;
    indexes: {
      projectId: number;
      costCategory: string;
      amendmentNumber: number;
    };
  };

  cashRequests: {
    key: number;
    value: CashRequestRecord;
    indexes: {
      requestNumber: string;
      requestMonth: string;
      status: string;
      preparedBy: string;
      approvedBy: string;
    };
  };

  cashRequestItems: {
    key: number;
    value: CashRequestItemRecord;
    indexes: {
      cashRequestId: number;
      projectId: number;
      costType: string;
    };
  };

  installmentRequests: {
    key: number;
    value: InstallmentRequestRecord;
    indexes: {
      projectId: number;
      status: string;
      dateRequested: string;
      amendmentNumber: number;
    };
  };

  installmentReceipts: {
    key: number;
    value: InstallmentReceiptRecord;
    indexes: {
      installmentRequestId: number;
      receiptDate: string;
      bankAccountId: number;
    };
  };

  staffSalaryAllocations: {
    key: number;
    value: StaffSalaryAllocationRecord;
    indexes: {
      employeeId: number;
      projectId: number;
      allocationMonth: string;
    };
  };

  payrollDistributions: {
    key: number;
    value: PayrollDistributionRecord;
    indexes: {
      payrollPeriodId: number;
      employeeId: number;
      generationType: string;
      status: string;
      createdAt: string;
    };
  };

  donorReportingSchedules: {
    key: number;
    value: DonorReportingScheduleRecord;
    indexes: {
      projectId: number;
      dueDate: string;
      status: string;
    };
  };

  donorReportPeriods: {
    key: number;
    value: DonorReportPeriodRecord;
    indexes: {
      reportingScheduleId: number;
      status: string;
      submittedBy: string;
    };
  };

  governmentReporting: {
    key: number;
    value: GovernmentReportingRecord;
    indexes: {
      projectId: number;
      ministryName: string;
      status: string;
      dueDate: string;
    };
  };

  projectAmendments: {
    key: number;
    value: ProjectAmendmentRecord;
    indexes: {
      projectId: number;
      amendmentNumber: number;
      amendmentDate: string;
    };
  };

  signatoryAssignments: {
    key: number;
    value: SignatoryAssignmentRecord;
    indexes: {
      projectId: number;
      assignmentMonth: string;
    };
  };

  // ========== EXTENDED COMPLIANCE STORES ==========

  dueDiligence: {
    key: number;
    value: DueDiligenceRecord;
    indexes: {
      donorName: string;
      status: string;
      createdAt: string;
    };
  };

  registrations: {
    key: number;
    value: RegistrationRecord;
    indexes: {
      organizationPlatform: string;
      status: string;
      expiryDate: string;
    };
  };

  memberships: {
    key: number;
    value: MembershipRecord;
    indexes: {
      organizationName: string;
      membershipType: string;
      status: string;
      expiryDate: string;
    };
  };

  certificates: {
    key: number;
    value: CertificateRecord;
    indexes: {
      certificateName: string;
      certificateNumber: string;
      status: string;
      expiryDate: string;
    };
  };

  boardOfDirectors: {
    key: number;
    value: BoardOfDirectorsRecord;
    indexes: {
      name: string;
      position: string;
      status: string;
    };
  };

  partners: {
    key: number;
    value: PartnerRecord;
    indexes: {
      partnerName: string;
      partnerType: string;
      status: string;
    };
  };

  donorOutreach: {
    key: number;
    value: DonorOutreachRecord;
    indexes: {
      donorName: string;
      outreachDate: string;
    };
  };

  governmentOutreach: {
    key: number;
    value: GovernmentOutreachRecord;
    indexes: {
      ministryName: string;
      outreachDate: string;
    };
  };

  blacklist: {
    key: number;
    value: BlacklistRecord;
    indexes: {
      entityName: string;
      entityType: string;
      status: string;
      blacklistDate: string;
    };
  };

  // ========== CONTRACT MANAGEMENT STORES ==========

  contractTypes: {
    key: number;
    value: ContractTypeRecord;
    indexes: {
      name: string;
      category: string;
      isActive: boolean;
    };
  };

  employeeContracts: {
    key: number;
    value: EmployeeContractRecord;
    indexes: {
      contractNumber: string;
      employeeId: number;
      contractTypeId: number;
      projectId: number;
      startDate: string;
      endDate: string;
      status: string;
      createdAt: string;
    };
  };

  contractAmendments: {
    key: number;
    value: ContractAmendmentRecord;
    indexes: {
      amendmentNumber: string;
      contractId: number;
      amendmentType: string;
      effectiveDate: string;
      status: string;
      approvedBy: string;
      createdAt: string;
    };
  };

  // ========== ASSET MANAGEMENT STORES ==========

  assetTypes: {
    key: number;
    value: AssetTypeRecord;
    indexes: {
      name: string;
      category: string;
      requiresReturn: boolean;
      isActive: boolean;
    };
  };

  employeeAssets: {
    key: number;
    value: EmployeeAssetRecord;
    indexes: {
      assetTag: string;
      employeeId: number;
      assetTypeId: number;
      assignedDate: string;
      returnedDate: string;
      status: string;
      condition: string;
      issuedBy: string;
    };
  };

  idCards: {
    key: number;
    value: IDCardRecord;
    indexes: {
      cardNumber: string;
      employeeId: number;
      cardType: string;
      issueDate: string;
      expiryDate: string;
      status: string;
    };
  };

  simCards: {
    key: number;
    value: SIMCardRecord;
    indexes: {
      simNumber: string;
      phoneNumber: string;
      employeeId: number;
      provider: string;
      assignedDate: string;
      returnedDate: string;
      status: string;
    };
  };

  employeeEmails: {
    key: number;
    value: EmployeeEmailRecord;
    indexes: {
      emailAddress: string;
      employeeId: number;
      createdDate: string;
      deactivatedDate: string;
      status: string;
    };
  };

  // ========== TRAVEL MANAGEMENT STORES ==========

  travelRequests: {
    key: number;
    value: TravelRequestRecord;
    indexes: {
      requestNumber: string;
      employeeId: number;
      projectId: number;
      destination: string;
      departureDate: string;
      returnDate: string;
      travelMode: string;
      status: string;
      approvedBy: string;
    };
  };

  travelApprovals: {
    key: number;
    value: TravelApprovalRecord;
    indexes: {
      travelRequestId: number;
      approverId: number;
      approvalLevel: number;
      status: string;
      approvalDate: string;
    };
  };

  dsaRates: {
    key: number;
    value: DSARateRecord;
    indexes: {
      location: string;
      locationType: string;
      dailyRate: number;
      effectiveFrom: string;
      effectiveTo: string;
      isActive: boolean;
    };
  };

  dsaPayments: {
    key: number;
    value: DSAPaymentRecord;
    indexes: {
      paymentNumber: string;
      travelRequestId: number;
      employeeId: number;
      totalAmount: number;
      status: string;
      paymentDate: string;
    };
  };

  mahramTravel: {
    key: number;
    value: MahramTravelRecord;
    indexes: {
      travelRequestId: number;
      employeeId: number;
      mahramName: string;
      relationship: string;
      verificationStatus: string;
    };
  };

  workRelatedInjuries: {
    key: number;
    value: WorkRelatedInjuryRecord;
    indexes: {
      incidentNumber: string;
      employeeId: number;
      incidentDate: string;
      incidentLocation: string;
      injuryType: string;
      reportedDate: string;
      status: string;
      claimAmount: number;
    };
  };

  // ========== STAFF ASSOCIATION STORES ==========

  staffAssociationPositions: {
    key: number;
    value: StaffAssociationPositionRecord;
    indexes: {
      title: string;
      isExecutive: boolean;
      isActive: boolean;
    };
  };

  staffAssociationMembers: {
    key: number;
    value: StaffAssociationMemberRecord;
    indexes: {
      employeeId: number;
      positionId: number;
      termStart: string;
      termEnd: string;
      status: string;
      electionDate: string;
    };
  };

  associationMeetings: {
    key: number;
    value: AssociationMeetingRecord;
    indexes: {
      meetingNumber: string;
      meetingType: string;
      meetingDate: string;
      status: string;
      attendeeCount: number;
    };
  };

  associationActivities: {
    key: number;
    value: AssociationActivityRecord;
    indexes: {
      activityType: string;
      activityDate: string;
      organizedBy: string;
      status: string;
      budget: number;
      participantCount: number;
    };
  };

  staffAssociationContributions: {
    key: number;
    value: StaffAssociationContributionRecord;
    indexes: {
      memberId: number;
      memberName: string;
      period: string;
      amount: number;
      paymentDate: string;
      paymentMethod: string;
      status: string;
    };
  };

  staffWelfareRequests: {
    key: number;
    value: StaffWelfareRequestRecord;
    indexes: {
      memberId: number;
      memberName: string;
      requestType: string;
      amountRequested: number;
      amountApproved: number;
      requestDate: string;
      status: string;
    };
  };

  staffWelfarePayments: {
    key: number;
    value: StaffWelfarePaymentRecord;
    indexes: {
      memberId: number;
      memberName: string;
      requestId: number;
      requestReference: string;
      amountPaid: number;
      paymentDate: string;
      paymentMethod: string;
      status: string;
    };
  };

  // ========== PROCUREMENT STORES ==========

  vendors: {
    key: number;
    value: VendorRecord;
    indexes: {
      vendorCode: string;
      name: string;
      email: string;
      category: string;
      status: string;
      isPreferred: boolean;
      isBlacklisted: boolean;
    };
  };

  itemCategories: {
    key: number;
    value: ItemCategoryRecord;
    indexes: {
      categoryCode: string;
      name: string;
      parentId: number;
      isActive: boolean;
    };
  };

  purchaseRequests: {
    key: number;
    value: PurchaseRequestRecord;
    indexes: {
      requestNumber: string;
      requestedBy: number;
      department: string;
      projectId: number;
      priority: string;
      status: string;
      requestDate: string;
    };
  };

  rfqs: {
    key: number;
    value: RFQRecord;
    indexes: {
      rfqNumber: string;
      purchaseRequestId: number;
      issueDate: string;
      closingDate: string;
      status: string;
      winningVendorId: number;
    };
  };

  purchaseOrders: {
    key: number;
    value: PurchaseOrderRecord;
    indexes: {
      poNumber: string;
      rfqId: number;
      vendorId: number;
      orderDate: string;
      deliveryDate: string;
      totalAmount: number;
      status: string;
    };
  };

  goodsReceipts: {
    key: number;
    value: GoodsReceiptRecord;
    indexes: {
      receiptNumber: string;
      purchaseOrderId: number;
      vendorId: number;
      receiptDate: string;
      receivedBy: string;
      status: string;
    };
  };

  inventoryItems: {
    key: number;
    value: InventoryItemRecord;
    indexes: {
      itemCode: string;
      name: string;
      categoryId: number;
      quantityOnHand: number;
      location: string;
      status: string;
    };
  };

  procurementContracts: {
    key: number;
    value: ProcurementContractRecord;
    indexes: {
      contractNumber: string;
      vendorId: number;
      contractType: string;
      startDate: string;
      endDate: string;
      status: string;
    };
  };

  // ========== POLICY & AUDIT STORES ==========

  policyVersions: {
    key: number;
    value: PolicyVersionRecord;
    indexes: {
      policyName: string;
      policyCode: string;
      version: string;
      category: string;
      effectiveDate: string;
      approvedBy: string;
      status: string;
    };
  };

  hrAuditLogs: {
    key: number;
    value: HRAuditLogRecord;
    indexes: {
      entityType: string;
      entityId: number;
      action: string;
      performedBy: string;
      performedAt: string;
      ipAddress: string;
    };
  };

  conductAcknowledgments: {
    key: number;
    value: ConductAcknowledgmentRecord;
    indexes: {
      employeeId: number;
      policyVersionId: number;
      policyName: string;
      acknowledgmentType: string;
      acknowledgedDate: string;
      status: string;
    };
  };

  pseaDeclarations: {
    key: number;
    value: PSEADeclarationRecord;
    indexes: {
      employeeId: number;
      declarationType: string;
      declarationDate: string;
      fiscalYear: string;
      hasConflict: boolean;
      status: string;
    };
  };

  // ========== AUDIT MANAGEMENT STORES ==========

  auditTypes: {
    key: number;
    value: AuditTypeRecord;
    indexes: AuditTypeRecordIndex;
  };

  hactAssessments: {
    key: number;
    value: HACTAssessmentRecord;
    indexes: HACTAssessmentRecordIndex;
  };

  donorProjectAudits: {
    key: number;
    value: DonorProjectAuditRecord;
    indexes: DonorProjectAuditRecordIndex;
  };

  externalAudits: {
    key: number;
    value: ExternalAuditRecord;
    indexes: ExternalAuditRecordIndex;
  };

  externalAnnualAudits: {
    key: number;
    value: ExternalAnnualAuditRecord;
    indexes: ExternalAnnualAuditRecordIndex;
  };

  internalAudits: {
    key: number;
    value: InternalAuditRecord;
    indexes: InternalAuditRecordIndex;
  };

  internalQuarterlyReports: {
    key: number;
    value: InternalQuarterlyReportRecord;
    indexes: InternalQuarterlyReportRecordIndex;
  };

  partnerAudits: {
    key: number;
    value: PartnerAuditRecord;
    indexes: PartnerAuditRecordIndex;
  };

  auditCorrectiveActions: {
    key: number;
    value: CorrectiveActionRecord;
    indexes: CorrectiveActionRecordIndex;
  };

  // ========== LEGACY STORES (Backward Compatibility) ==========

  jobRequisitions: {
    key: number;
    value: JobRequisitionRecord;
    indexes: { requisitionId: string; status: string; department: string; priority: string; createdAt: string };
  };

  jobAnnouncements: {
    key: number;
    value: JobAnnouncementRecord;
    indexes: { requisitionId: number; status: string; closingDate: string };
  };

  jobOffers: {
    key: number;
    value: JobOfferRecord;
    indexes: { candidateId: number; requisitionId: number; status: string };
  };

  testResults: {
    key: number;
    value: TestResultRecord;
    indexes: { writtenTestId: number; candidateId: number };
  };

  referenceChecks: {
    key: number;
    value: ReferenceCheckRecord;
    indexes: { candidateId: number; recruitmentId: number };
  };

  shortlistingScores: {
    key: number;
    value: ShortlistingScoreRecord;
    indexes: { candidateApplicationId: number; recruitmentId: number };
  };

  probationEvaluations: {
    key: number;
    value: ProbationEvaluationRecord;
    indexes: { probationRecordId: number; employeeId: number };
  };

  salaryComponents: {
    key: number;
    value: SalaryComponentRecord;
    indexes: { componentCode: string; componentType: string; isActive: boolean };
  };

  payrolls: {
    key: number;
    value: PayrollRecord;
    indexes: { payrollId: string; employeeId: number; month: number; year: number; status: string };
  };

  allowanceTypes: {
    key: number;
    value: AllowanceTypeRecord;
    indexes: { code: string; name: string; isActive: boolean };
  };

  employeeRewards: {
    key: number;
    value: EmployeeRewardRecord;
    indexes: { employeeId: number; rewardType: string; rewardDate: string };
  };

  ctoRecords: {
    key: number;
    value: CTORecord;
    indexes: { employeeId: number; earnedDate: string; status: string };
  };

  individualDevelopmentPlans: {
    key: number;
    value: IDPRecord;
    indexes: { idpId: string; employeeId: number; status: string; startDate: string; endDate: string };
  };

  idpGoals: {
    key: number;
    value: IDPGoalRecord;
    indexes: { idpId: number; status: string };
  };

  disciplinaryTypes: {
    key: number;
    value: DisciplinaryTypeRecord;
    indexes: { code: string; name: string; isActive: boolean };
  };

  grievanceTypes: {
    key: number;
    value: GrievanceTypeRecord;
    indexes: { code: string; name: string; isActive: boolean };
  };

  grievances: {
    key: number;
    value: GrievanceRecord;
    indexes: { employeeId: number; status: string; grievanceType: string };
  };

  grievanceInvestigations: {
    key: number;
    value: GrievanceInvestigationRecord;
    indexes: { grievanceId: number; investigatorId: number; status: string };
  };

  grievanceResolutions: {
    key: number;
    value: GrievanceResolutionRecord;
    indexes: { grievanceId: number; resolutionDate: string };
  };

  orientationChecklists: {
    key: number;
    value: OrientationChecklistRecord;
    indexes: { employeeId: number; status: string };
  };

  orientationItems: {
    key: number;
    value: OrientationItemRecord;
    indexes: { checklistId: number; status: string };
  };
}

/**
 * Store names as string literal union type
 * Provides autocomplete for store names
 */

export type StoreName = keyof VDODatabase;

/**
 * Get the value type for a specific store
 */
export type StoreValue<K extends StoreName> = VDODatabase[K]["value"];

/**
 * Get the key type for a specific store
 */
export type StoreKey<K extends StoreName> = VDODatabase[K]["key"];

/**
 * Get the index names for a specific store
 */
export type StoreIndexes<K extends StoreName> = VDODatabase[K] extends {
  indexes: infer I;
}
  ? keyof I
  : never;
