/**
 * VDO ERP IndexedDB Initialization
 *
 * Main entry point for the database system.
 * Exports the database initialization function and re-exports core utilities.
 *
 * Database: vdo-erp-db
 * Version: 39
 * Total Stores: 150+
 *
 * Modules:
 * - Core HR (employees, departments, positions, etc.)
 * - Leave Management
 * - Recruitment
 * - Payroll
 * - Performance Management
 * - Training
 * - Exit/Separation
 * - Disciplinary
 * - Employee Administration
 * - Compliance (projects, documents, proposals, registrations, etc.)
 * - Contract Management
 * - Asset Management
 * - Travel Management
 * - Staff Association
 * - Policy & Audit
 * - Program
 */

// Re-export connection utilities
export { getDB, initDB, resetDB, closeDB, deleteDatabase, deleteAndRecreateDB, isConnected, getDBVersion } from './core/connection';

// Re-export CRUD utilities
export { createCRUDService, batchCreate, batchDelete, countRecords, clearStore, clearAllData } from './core/crud';

// Re-export core HR services
export {
  employeeDB,
  employeePositionHistoryDB,
  departmentDB,
  positionDB,
  officeDB,
  gradeDB,
  employeeTypeDB,
  workScheduleDB,
  documentTypeDB,
  templateDocumentDB,
  userDB,
  roleDB,
  permissionDB,
  rolePermissionDB,
  seedCoreHRDefaults,
  seedAllDefaults,
} from './coreHRService';
// Re-export leave management services (with aliases for compatibility)
export {
  leaveTypesDB,
  leaveTypesDB as leaveTypeDB,
  leavePoliciesDB,
  leaveBalancesDB,
  leaveRequestsDB,
  leaveRequestsDB as leaveRequestDB,
  leaveRequestDaysDB,
  leaveApprovalsDB,
  holidaysDB,
  attendanceDB,
  timesheetsDB,
  oicAssignmentsDB,
  leaveAdjustmentsDB,
  leaveCarryoversDB,
  leaveCalendarService,
  leaveReportService,
  leaveManagementService,
  // Legacy backward compatibility exports
  allowanceTypeDB,
  employeeRewardDB,
  ctoRecordDB,
  leaveApprovalDB,
} from './leaveManagementService';

// Re-export compliance services
export {
  complianceProjectDB,
  complianceDocumentDB,
  complianceAmendmentDB,
  proposalDB,
  dueDiligenceDB,
  registrationDB,
  membershipDB,
  certificateDB,
  boardOfDirectorsDB,
  partnerDB,
  donorOutreachDB,
  governmentOutreachDB,
  governmentOutreachDB as govtOutreachDB, // Backward compatibility alias
  blacklistDB,
  complianceService,
} from './complianceService';

// Re-export recruitment seed function
export { seedCompleteRecruitment } from './seedRecruitment';

// Re-export recruitment services
export {
  recruitmentDB,
  torDB,
  srfDB,
  vacancyDB,
  candidateDB,
  applicationDB,
  educationDB,
  experienceDB,
  committeeDB,
  memberDB,
  coiDB,
  longlistingDB,
  longlistingCandidateDB,
  shortlistingDB,
  shortlistingCandidateDB,
  writtenTestDB,
  writtenTestCandidateDB,
  interviewDB,
  interviewCandidateDB,
  evaluationDB,
  interviewResultDB,
  reportDB,
  offerDB,
  sanctionDB,
  backgroundCheckDB,
  contractDB,
  checklistDB,
  provincesDB,
  generateRecruitmentCode,
  generateCandidateCode,
  generateApplicationCode,
  generateTestUniqueCode,
  generateContractNumber,
  generateReportNumber,
  RECRUITMENT_STATUS,
  RECRUITMENT_STATUS_LABELS,
  APPLICATION_STATUS,
  TOR_STATUS,
  SRF_STATUS,
  HIRING_APPROACH,
  CONTRACT_TYPE,
  EDUCATION_LEVEL,
  ANNOUNCEMENT_METHOD,
  COMMITTEE_ROLE,
  COI_DECISION,
  DEFAULT_WEIGHTS,
  RECOMMENDATION,
  RECRUITMENT_STEPS,
  // Legacy backward compatibility exports
  jobRequisitionDB,
  jobAnnouncementDB,
  jobOfferDB,
  probationEvaluationDB,
  recruitmentCommitteeDB,
  committeeMemberDB,
  testResultDB,
  referenceCheckDB,
  sanctionClearanceDB,
  shortlistingScoreDB,
} from './recruitmentService';

// Re-export disciplinary services
export {
  misconductReportsDB,
  misconductEvidenceDB,
  investigationsDB,
  investigationInterviewsDB,
  suspensionsDB,
  disciplinaryActionsDB,
  appealsDB,
  warningHistoryDB,
  grievancesDB,
  complianceIncidentsDB,
  caseNotesDB,
  disciplinaryService,
  initDisciplinaryDB,
  // Legacy backward compatibility exports
  disciplinaryTypeDB,
  disciplinaryActionDB,
  grievanceTypeDB,
  grievanceDB,
  grievanceInvestigationDB,
  grievanceResolutionDB,
} from './disciplinaryService';

// Re-export employee admin services
export {
  emergencyContactsDB,
  employeeEducationDB,
  employeeExperienceDB,
  employeeSkillsDB,
  employeeMedicalDB,
  personnelFilesDB,
  personnelDocumentsDB,
  onboardingChecklistsDB,
  onboardingItemsDB,
  policyAcknowledgementsDB,
  interimHiringRequestsDB,
  interimHiringApprovalsDB,
  mahramRegistrationsDB,
  employeeStatusHistoryDB,
  initEmployeeAdminDB,
  employeeAdminService,
  // Legacy backward compatibility exports
  orientationChecklistDB,
  orientationItemDB,
} from './employeeAdminService';

// Re-export exit services
export {
  separationService,
  separationTypesService,
  clearanceService,
  clearanceItemService,
  clearanceDepartmentService,
  exitInterviewService,
  complianceCheckService,
  settlementService,
  settlementPaymentService,
  workCertificateService,
  terminationRecordService,
  handoverService,
  handoverItemService,
  separationHistoryService,
  exitDashboardService,
  seedSeparationTypes,
  seedClearanceDepartments,
} from './exitService';
export {
  separationService as separationDB,
  separationTypesService as separationTypesDB,
  separationTypesService as separationTypeDB, // Legacy backward compatibility alias (singular)
  clearanceService as clearanceDB,
  clearanceService as exitClearanceDB, // Legacy backward compatibility alias
  clearanceItemService as clearanceItemDB,
  clearanceDepartmentService as clearanceDepartmentDB,
  clearanceDepartmentService as exitClearanceDepartmentDB, // Legacy backward compatibility alias
  exitInterviewService as exitInterviewDB,
  complianceCheckService as complianceCheckDB,
  settlementService as settlementDB,
  settlementService as finalSettlementDB, // Legacy backward compatibility alias
  settlementPaymentService as settlementPaymentDB,
  workCertificateService as workCertificateDB,
  terminationRecordService as terminationRecordDB,
  handoverService as handoverDB,
  handoverItemService as handoverItemDB,
  separationHistoryService as separationHistoryDB,
} from './exitService';

// Re-export payroll services
export {
  payrollPeriodsDB,
  salaryStructuresDB,
  employeeSalaryDetailsDB,
  employeeAllowancesDB,
  payrollEntriesDB,
  salaryAdvancesDB,
  advanceRepaymentsDB,
  employeeLoansDB,
  loanRepaymentsDB,
  overtimeDB,
  payslipsDB,
  bankTransfersDB,
  cashPaymentsDB,
  payrollService,
  // Legacy backward compatibility exports
  salaryComponentDB,
  payrollDB,
} from './payrollService';

// Re-export performance services
export {
  appraisalCyclesDB,
  appraisalTemplatesDB,
  appraisalSectionsDB,
  appraisalCriteriaDB,
  employeeAppraisalsDB,
  appraisalRatingsDB,
  appraisalCommitteeMembersDB,
  appraisalGoalsDB,
  appraisalTrainingNeedsDB,
  probationRecordsDB,
  probationExtensionsDB,
  probationKPIsDB,
  performanceImprovementPlansDB,
  pipGoalsDB,
  pipCheckInsDB,
  appraisalOutcomesDB,
  performanceService,
  // Legacy backward compatibility exports
  idpDB,
  idpGoalDB,
  // Backward compatibility aliases (renaming)
  appraisalPeriodDB,
  performanceAppraisalDB,
  appraisalScoreDB,
  pipProgressReviewDB,
} from './performanceService';

// Re-export training services
export {
  trainingTypesDB,
  trainingProgramsDB,
  tnasDB,
  tnaTrainingNeedsDB,
  trainingCalendarDB,
  trainingBudgetsDB,
  trainingsDB,
  trainingParticipantsDB,
  trainingSessionsDB,
  trainingEvaluationsDB,
  trainingCertificatesDB,
  trainingBondsDB,
  employeeTrainingHistoryDB,
  trainingReportsDB,
  trainingDashboardService,
  trainingService,
  // Backward compatibility aliases - singular variations (*DB)
  trainingTypeDB,
  trainingProgramDB,
  tnaDB,
  trainingBudgetDB,
  trainingDB,
  trainingParticipantDB,
  trainingSessionDB,
  trainingEvaluationDB,
  trainingCertificateDB,
  trainingBondDB,
  trainingReportDB,
  tnaItemDB,
  trainingAttendanceDB,
  // Backward compatibility aliases - *Service pattern
  trainingTypesService,
  trainingTypeService,
  trainingProgramsService,
  trainingProgramService,
  tnasService,
  tnaService,
  tnaTrainingNeedsService,
  trainingCalendarService,
  trainingBudgetsService,
  trainingBudgetService,
  trainingsService,
  trainingParticipantsService,
  trainingParticipantService,
  trainingSessionsService,
  trainingSessionService,
  trainingEvaluationsService,
  trainingEvaluationService,
  trainingCertificatesService,
  trainingCertificateService,
  trainingBondsService,
  trainingBondService,
  employeeTrainingHistoryService,
  trainingReportsService,
  trainingReportService,
  tnaItemService,
  trainingAttendanceService,
} from './trainingService';

// Re-export contract management services
export {
  contractTypeDB,
  employeeContractDB,
  contractAmendmentDB,
  contractService,
} from './contractService';

// Re-export asset management services
export {
  assetTypeDB,
  employeeAssetDB,
  idCardDB,
  simCardDB,
  employeeEmailDB,
  assetService,
} from './assetService';

// Re-export travel management services
export {
  travelRequestDB,
  travelApprovalDB,
  dsaRateDB,
  dsaPaymentDB,
  mahramTravelDB,
  workRelatedInjuryDB,
  travelService,
} from './travelService';

// Re-export staff association services
export {
  associationPositionDB,
  associationMemberDB,
  associationMeetingDB,
  associationActivityDB,
  associationContributionDB,
  welfareRequestDB,
  welfarePaymentDB,
  staffAssociationService,
  // Legacy backward compatibility exports
  staffAssociationMemberDB,
  staffAssociationContributionDB,
  staffWelfareRequestDB,
  staffWelfarePaymentDB,
} from './staffAssociationService';

// Re-export policy services
export {
  policyVersionDB,
  hrAuditLogDB,
  conductAcknowledgmentDB,
  pseaDeclarationDB,
  policyService,
} from './policyService';

// Re-export audit services
export {
  auditTypesDB,
  hactAssessmentsDB,
  donorProjectAuditsDB,
  externalAuditsDB,
  internalAuditsDB,
  partnerAuditsDB,
  correctiveActionsDB,
  auditDashboardService,
  auditService,
} from './auditService';

// Re-export program services
export {
  programDonorsDB,
  programProjectsDB,
  programWorkPlansDB,
  programCertificatesDB,
  programDocumentsDB,
  programReportingDB,
  programBeneficiariesDB,
  programSafeguardingDB,
  programDashboardService,
  programService,
  // Backward compatibility aliases
  programDonorDB,
  programProjectDB,
  programWorkPlanDB,
  programCertificateDB,
  programDocumentDB,
  programReportDB,
  programBeneficiaryDB,
  programSafeguardDB,
} from './programService';

// Re-export governance services
export {
  governanceBoardMembersDB,
  governanceBoardMeetingsDB,
  governanceCorrespondenceDB,
  governanceService,
  // Backward compatibility aliases
  governanceBoardMemberDB,
  governanceBoardMeetingDB,
  governanceCorrespondenceService,
} from './governanceService';

// Re-export utility functions
export {
  generateFormattedCode,
  generateUniqueCode,
  sortRecords,
  sortByCreatedAt,
  searchRecords,
  filterByStatus,
  filterByDateRange,
  paginate,
  calculateTotalPages,
  getUniqueValues,
  groupBy,
  isDateInRange,
  daysBetween,
  formatISODate,
  getCurrentFiscalYear,
  debounce,
} from './core/utils';

// Re-export upgrade utilities
export { upgradeDatabase, storeExists, getAllStoreNames } from './core/upgrade';

// Re-export types
export type {
  BaseRecord,
  CreateInput,
  UpdateInput,
  CRUDService,
  TransactionMode,
  BaseFilters,
  PaginationParams,
  PaginatedResult,
  SortDirection,
  SortParams,
  CommonStatus,
} from '../../types/db/base';

export type { VDODatabase, StoreName, StoreValue, StoreKey, StoreIndexes } from '../../types/db/stores';

export {
  DatabaseError,
  RecordNotFoundError,
  ValidationError,
  VersionMismatchError,
  DuplicateRecordError,
  TransactionError,
  ConnectionError,
  UpgradeError,
  ConstraintError,
  isDatabaseError,
  isRecordNotFoundError,
  isValidationError,
} from '../../types/db/errors';

export { DB_CONFIG, APPROVAL_STATUS, RECORD_STATUS, EMPLOYEE_STATUS, CODE_PATTERNS } from '../../types/db/constants';

/**
 * Initialize the database
 * This is the main function to call when starting the application
 *
 * @returns Promise resolving to the database instance
 *
 * @example
 * ```typescript
 * import { initDB } from './indexedDB';
 *
 * // Initialize database when app starts
 * await initDB();
 * ```
 */
export { initDB as default } from "./core/connection";
