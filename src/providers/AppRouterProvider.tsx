import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';

// User Management Pages
import Users from '../pages/user-management/Users';
import Roles from '../pages/user-management/Roles';
import Permissions from '../pages/user-management/Permissions';
import RolePermissions from '../pages/user-management/RolePermissions';

// Compliance Pages
import {
  ComplianceProjects,
  ComplianceAmendments,
  RFPTracking,
  DueDiligence,
  Registrations,
  Memberships,
  Certificates,
  Partners,
  DonorOutreach,
  ComplianceDocuments,
  Blacklist
} from '../pages/compliance';

// Audit Module Pages
import {
  AuditDashboard,
  AuditSettings,
  HACTList,
  HACTForm,
  DonorProjectAuditList,
  DonorProjectAuditForm,
  ExternalAuditList,
  ExternalAuditForm,
  InternalAuditList,
  InternalAuditForm,
  PartnerAuditList,
  PartnerAuditForm
} from '../pages/audit';

// Program Module Pages
import {
  ProgramDashboard,
  DonorList,
  DonorForm,
  DonorView,
  ProjectList,
  ProjectForm,
  ProjectView,
  WorkPlanList,
  WorkPlanForm,
  WorkPlanView,
  CertificateList,
  CertificateForm,
  CertificateView,
  DocumentList,
  DocumentForm,
  DocumentView,
  ReportingList,
  ReportingForm,
  ReportingView,
  BeneficiaryList,
  BeneficiaryForm,
  BeneficiaryView,
  SafeguardingList,
  SafeguardingForm,
  SafeguardingView,
} from '../pages/program';

// Governance Module Pages
import {
  GovernanceLayout,
  BoardMemberList,
  BoardMemberForm,
  BoardMemberView,
  BoardMeetingList,
  BoardMeetingForm,
  BoardMeetingView,
  CorrespondenceList,
  CorrespondenceForm,
  CorrespondenceView,
} from '../pages/governance';

// HR Recruitment Module Pages
import {
  RecruitmentDashboard,
  RecruitmentTracker,
  TermsOfReference,
  StaffRequisition,
  JobApplications,
  RecruitmentCommittee,
  ConflictOfInterest,
  Longlisting,
  Shortlisting,
  WrittenTest,
  Interview,
  RecruitmentReport,
  OfferLetter,
  BackgroundChecks,
  EmploymentContract,
  RecruitmentChecklist,
  SoleSourceJustification,
  CandidateSourcing,
  DropdownSettings,
} from '../pages/hr/recruitment';

// HR Employee Management Module Pages
import {
  EmployeeManagementDashboard,
  ExtensionLetter,
  TerminationLetter,
  ConfirmationLetter,
  ContractAmendment,
  InductionForm,
  CodeOfConductAck,
  PersonnelFileChecklist,
  MahramForm,
  InductionPackChecklist,
  SafeguardingAck,
  NDAForm,
} from '../pages/hr/employee-management';

// HR Leave & Attendance Module Pages
import {
  LeaveAttendanceDashboard,
  LeaveRequest,
  LeaveTracker,
  ManualAttendance,
  ElectronicAttendance,
} from '../pages/hr/leave-attendance';

// HR Performance Module Pages
import {
  PerformanceDashboard,
  ProbationEvaluation,
  PerformanceAppraisal,
  InternalPromotionFeasibility,
  PromotionLetter,
} from '../pages/hr/performance';

// HR Training Module Pages
import {
  TrainingDashboard,
  TrainingNeedsAssessment,
  TrainingCalendar,
  TrainingBudget,
  TrainingRequest,
} from '../pages/hr/training';

// HR Payroll Module Pages
import {
  PayrollDashboard,
  PayrollGeneration,
  Payslips,
} from '../pages/hr/payroll';

// HR Exit & Separation Module Pages
import {
  ExitDashboard,
  WorkCertificate,
  ExitInterview,
  ExitChecklist,
} from '../pages/hr/exit';

// HR Special Forms Module Pages
import {
  SpecialFormsDashboard,
  InternalTransferEligibility,
  DualEmploymentDeclaration,
} from '../pages/hr/special-forms';

import type { JSX } from 'react';

// User Management Routes
const userManagementRoutes: RouteObject[] = [
  { path: 'user-management/users', element: <Users /> },
  { path: 'user-management/roles', element: <Roles /> },
  { path: 'user-management/permissions', element: <Permissions /> },
  { path: 'user-management/role-permissions', element: <RolePermissions /> },
];

// Compliance Routes
const complianceRoutes: RouteObject[] = [
  { path: 'compliance/projects', element: <ComplianceProjects /> },
  { path: 'compliance/amendments', element: <ComplianceAmendments /> },
  { path: 'compliance/rfp-tracking', element: <RFPTracking /> },
  { path: 'compliance/due-diligence', element: <DueDiligence /> },
  { path: 'compliance/registrations', element: <Registrations /> },
  { path: 'compliance/memberships', element: <Memberships /> },
  { path: 'compliance/certificates', element: <Certificates /> },
  { path: 'compliance/partners', element: <Partners /> },
  { path: 'compliance/donor-outreach', element: <DonorOutreach /> },
  { path: 'compliance/documents', element: <ComplianceDocuments /> },
  { path: 'compliance/blacklist', element: <Blacklist /> },
];

// Audit Module Routes
const auditRoutes: RouteObject[] = [
  { path: 'audit', element: <AuditDashboard /> },
  { path: 'audit/settings', element: <AuditSettings /> },
  { path: 'audit/hact', element: <HACTList /> },
  { path: 'audit/hact/new', element: <HACTForm /> },
  { path: 'audit/hact/:id', element: <HACTForm /> },
  { path: 'audit/donor-project', element: <DonorProjectAuditList /> },
  { path: 'audit/donor-project/new', element: <DonorProjectAuditForm /> },
  { path: 'audit/donor-project/:id', element: <DonorProjectAuditForm /> },
  { path: 'audit/external', element: <ExternalAuditList /> },
  { path: 'audit/external/new', element: <ExternalAuditForm /> },
  { path: 'audit/external/:id', element: <ExternalAuditForm /> },
  { path: 'audit/internal', element: <InternalAuditList /> },
  { path: 'audit/internal/new', element: <InternalAuditForm /> },
  { path: 'audit/internal/:id', element: <InternalAuditForm /> },
  { path: 'audit/partner', element: <PartnerAuditList /> },
  { path: 'audit/partner/new', element: <PartnerAuditForm /> },
  { path: 'audit/partner/:id', element: <PartnerAuditForm /> },
];

// Program Module Routes
const programRoutes: RouteObject[] = [
  // Dashboard
  { path: 'program', element: <ProgramDashboard /> },
  // Donors
  { path: 'program/donors', element: <DonorList /> },
  { path: 'program/donors/new', element: <DonorForm /> },
  { path: 'program/donors/:id', element: <DonorView /> },
  { path: 'program/donors/:id/edit', element: <DonorForm /> },
  // Projects
  { path: 'program/projects', element: <ProjectList /> },
  { path: 'program/projects/new', element: <ProjectForm /> },
  { path: 'program/projects/:id', element: <ProjectView /> },
  { path: 'program/projects/:id/edit', element: <ProjectForm /> },
  // Work Plans
  { path: 'program/work-plans', element: <WorkPlanList /> },
  { path: 'program/work-plans/new', element: <WorkPlanForm /> },
  { path: 'program/work-plans/:id', element: <WorkPlanView /> },
  { path: 'program/work-plans/:id/edit', element: <WorkPlanForm /> },
  // Certificates
  { path: 'program/certificates', element: <CertificateList /> },
  { path: 'program/certificates/new', element: <CertificateForm /> },
  { path: 'program/certificates/:id', element: <CertificateView /> },
  { path: 'program/certificates/:id/edit', element: <CertificateForm /> },
  // Documents
  { path: 'program/documents', element: <DocumentList /> },
  { path: 'program/documents/new', element: <DocumentForm /> },
  { path: 'program/documents/:id', element: <DocumentView /> },
  { path: 'program/documents/:id/edit', element: <DocumentForm /> },
  // Reporting
  { path: 'program/reporting', element: <ReportingList /> },
  { path: 'program/reporting/new', element: <ReportingForm /> },
  { path: 'program/reporting/:id', element: <ReportingView /> },
  { path: 'program/reporting/:id/edit', element: <ReportingForm /> },
  // Beneficiaries
  { path: 'program/beneficiaries', element: <BeneficiaryList /> },
  { path: 'program/beneficiaries/new', element: <BeneficiaryForm /> },
  { path: 'program/beneficiaries/:id', element: <BeneficiaryView /> },
  { path: 'program/beneficiaries/:id/edit', element: <BeneficiaryForm /> },
  // Safeguarding
  { path: 'program/safeguarding', element: <SafeguardingList /> },
  { path: 'program/safeguarding/new', element: <SafeguardingForm /> },
  { path: 'program/safeguarding/:id', element: <SafeguardingView /> },
  { path: 'program/safeguarding/:id/edit', element: <SafeguardingForm /> },
];

// Governance Routes
const governanceRoutes: RouteObject[] = [
  {
    path: 'governance',
    element: <GovernanceLayout />,
    children: [
      // Default redirect
      { index: true, element: <BoardMemberList /> },
      // Board Members
      { path: 'board-members', element: <BoardMemberList /> },
      { path: 'board-members/new', element: <BoardMemberForm /> },
      { path: 'board-members/:id', element: <BoardMemberView /> },
      { path: 'board-members/:id/edit', element: <BoardMemberForm /> },
      // Board Meetings
      { path: 'board-meetings', element: <BoardMeetingList /> },
      { path: 'board-meetings/new', element: <BoardMeetingForm /> },
      { path: 'board-meetings/:id', element: <BoardMeetingView /> },
      { path: 'board-meetings/:id/edit', element: <BoardMeetingForm /> },
      // Correspondence
      { path: 'correspondence', element: <CorrespondenceList /> },
      { path: 'correspondence/new', element: <CorrespondenceForm /> },
      { path: 'correspondence/:id', element: <CorrespondenceView /> },
      { path: 'correspondence/:id/edit', element: <CorrespondenceForm /> },
    ],
  },
];

// HR Recruitment Routes
const hrRecruitmentRoutes: RouteObject[] = [
  // Dashboard
  { path: 'hr/recruitment', element: <RecruitmentDashboard /> },
  // Recruitment Tracker (Form 3)
  { path: 'hr/recruitment/tracker', element: <RecruitmentTracker /> },
  { path: 'hr/recruitment/tracker/new', element: <RecruitmentTracker /> },
  { path: 'hr/recruitment/tracker/:id', element: <RecruitmentTracker /> },
  // Terms of Reference (Form 1)
  { path: 'hr/recruitment/terms-of-reference', element: <TermsOfReference /> },
  { path: 'hr/recruitment/terms-of-reference/new', element: <TermsOfReference /> },
  { path: 'hr/recruitment/terms-of-reference/:id', element: <TermsOfReference /> },
  // Staff Requisition (Form 2)
  { path: 'hr/recruitment/staff-requisition', element: <StaffRequisition /> },
  { path: 'hr/recruitment/staff-requisition/new', element: <StaffRequisition /> },
  { path: 'hr/recruitment/staff-requisition/:id', element: <StaffRequisition /> },
  // Job Applications (Form 4)
  { path: 'hr/recruitment/applications', element: <JobApplications /> },
  { path: 'hr/recruitment/applications/new', element: <JobApplications /> },
  { path: 'hr/recruitment/applications/:id', element: <JobApplications /> },
  // Recruitment Committee (Form 45)
  { path: 'hr/recruitment/committee', element: <RecruitmentCommittee /> },
  { path: 'hr/recruitment/committee/new', element: <RecruitmentCommittee /> },
  { path: 'hr/recruitment/committee/:id', element: <RecruitmentCommittee /> },
  // Conflict of Interest (Form 5)
  { path: 'hr/recruitment/conflict-of-interest', element: <ConflictOfInterest /> },
  { path: 'hr/recruitment/conflict-of-interest/new', element: <ConflictOfInterest /> },
  { path: 'hr/recruitment/conflict-of-interest/:id', element: <ConflictOfInterest /> },
  // Longlisting (Form 6)
  { path: 'hr/recruitment/longlisting', element: <Longlisting /> },
  { path: 'hr/recruitment/longlisting/new', element: <Longlisting /> },
  { path: 'hr/recruitment/longlisting/:id', element: <Longlisting /> },
  // Shortlisting (Form 7)
  { path: 'hr/recruitment/shortlisting', element: <Shortlisting /> },
  { path: 'hr/recruitment/shortlisting/new', element: <Shortlisting /> },
  { path: 'hr/recruitment/shortlisting/:id', element: <Shortlisting /> },
  // Written Test (Forms 8, 9, 10)
  { path: 'hr/recruitment/written-test', element: <WrittenTest /> },
  { path: 'hr/recruitment/written-test/new', element: <WrittenTest /> },
  { path: 'hr/recruitment/written-test/:id', element: <WrittenTest /> },
  // Interview (Forms 11, 12, 13)
  { path: 'hr/recruitment/interview', element: <Interview /> },
  { path: 'hr/recruitment/interview/new', element: <Interview /> },
  { path: 'hr/recruitment/interview/:id', element: <Interview /> },
  // Recruitment Report (Form 14)
  { path: 'hr/recruitment/report', element: <RecruitmentReport /> },
  { path: 'hr/recruitment/report/new', element: <RecruitmentReport /> },
  { path: 'hr/recruitment/report/:id', element: <RecruitmentReport /> },
  // Offer Letter (Form 15)
  { path: 'hr/recruitment/offer-letter', element: <OfferLetter /> },
  { path: 'hr/recruitment/offer-letter/new', element: <OfferLetter /> },
  { path: 'hr/recruitment/offer-letter/:id', element: <OfferLetter /> },
  // Background Checks (Forms 16-20)
  { path: 'hr/recruitment/background-checks', element: <BackgroundChecks /> },
  { path: 'hr/recruitment/background-checks/new', element: <BackgroundChecks /> },
  { path: 'hr/recruitment/background-checks/:id', element: <BackgroundChecks /> },
  // Employment Contract (Form 21)
  { path: 'hr/recruitment/employment-contract', element: <EmploymentContract /> },
  { path: 'hr/recruitment/employment-contract/new', element: <EmploymentContract /> },
  { path: 'hr/recruitment/employment-contract/:id', element: <EmploymentContract /> },
  // Recruitment Checklist (Form 22)
  { path: 'hr/recruitment/checklist', element: <RecruitmentChecklist /> },
  { path: 'hr/recruitment/checklist/new', element: <RecruitmentChecklist /> },
  { path: 'hr/recruitment/checklist/:id', element: <RecruitmentChecklist /> },
  // Sole Source Justification (Form 38)
  { path: 'hr/recruitment/sole-source', element: <SoleSourceJustification /> },
  { path: 'hr/recruitment/sole-source/new', element: <SoleSourceJustification /> },
  { path: 'hr/recruitment/sole-source/:id', element: <SoleSourceJustification /> },
  // Candidate Sourcing (Form 48)
  { path: 'hr/recruitment/candidate-sourcing', element: <CandidateSourcing /> },
  { path: 'hr/recruitment/candidate-sourcing/new', element: <CandidateSourcing /> },
  { path: 'hr/recruitment/candidate-sourcing/:id', element: <CandidateSourcing /> },
  // Dropdown Settings
  { path: 'hr/recruitment/dropdown-settings', element: <DropdownSettings /> },
];

// HR Employee Management Routes
const hrEmployeeManagementRoutes: RouteObject[] = [
  // Dashboard
  { path: 'hr/employee-management', element: <EmployeeManagementDashboard /> },

  // Contract Management
  // Extension Letter (Form 26)
  { path: 'hr/employee-management/contract/extension', element: <ExtensionLetter /> },
  { path: 'hr/employee-management/contract/extension/new', element: <ExtensionLetter /> },
  { path: 'hr/employee-management/contract/extension/:id', element: <ExtensionLetter /> },
  // Termination Letter (Form 27)
  { path: 'hr/employee-management/contract/termination', element: <TerminationLetter /> },
  { path: 'hr/employee-management/contract/termination/new', element: <TerminationLetter /> },
  { path: 'hr/employee-management/contract/termination/:id', element: <TerminationLetter /> },
  // Confirmation Letter (Form 49)
  { path: 'hr/employee-management/contract/confirmation', element: <ConfirmationLetter /> },
  { path: 'hr/employee-management/contract/confirmation/new', element: <ConfirmationLetter /> },
  { path: 'hr/employee-management/contract/confirmation/:id', element: <ConfirmationLetter /> },
  // Contract Amendment (Form 50)
  { path: 'hr/employee-management/contract/amendment', element: <ContractAmendment /> },
  { path: 'hr/employee-management/contract/amendment/new', element: <ContractAmendment /> },
  { path: 'hr/employee-management/contract/amendment/:id', element: <ContractAmendment /> },

  // Onboarding
  // Induction Form (Form 28)
  { path: 'hr/employee-management/onboarding/induction', element: <InductionForm /> },
  { path: 'hr/employee-management/onboarding/induction/new', element: <InductionForm /> },
  { path: 'hr/employee-management/onboarding/induction/:id', element: <InductionForm /> },
  // Code of Conduct Acknowledgement (Form 32)
  { path: 'hr/employee-management/onboarding/code-of-conduct', element: <CodeOfConductAck /> },
  { path: 'hr/employee-management/onboarding/code-of-conduct/new', element: <CodeOfConductAck /> },
  { path: 'hr/employee-management/onboarding/code-of-conduct/:id', element: <CodeOfConductAck /> },
  // Personnel File Checklist (Form 33)
  { path: 'hr/employee-management/onboarding/personnel-file', element: <PersonnelFileChecklist /> },
  { path: 'hr/employee-management/onboarding/personnel-file/new', element: <PersonnelFileChecklist /> },
  { path: 'hr/employee-management/onboarding/personnel-file/:id', element: <PersonnelFileChecklist /> },
  // Mahram Form (Form 40/52)
  { path: 'hr/employee-management/onboarding/mahram', element: <MahramForm /> },
  { path: 'hr/employee-management/onboarding/mahram/new', element: <MahramForm /> },
  { path: 'hr/employee-management/onboarding/mahram/:id', element: <MahramForm /> },
  // Induction Pack Checklist (Form 51)
  { path: 'hr/employee-management/onboarding/induction-pack', element: <InductionPackChecklist /> },
  { path: 'hr/employee-management/onboarding/induction-pack/new', element: <InductionPackChecklist /> },
  { path: 'hr/employee-management/onboarding/induction-pack/:id', element: <InductionPackChecklist /> },
  // Safeguarding/PSEAH Acknowledgement (Form 53)
  { path: 'hr/employee-management/onboarding/safeguarding', element: <SafeguardingAck /> },
  { path: 'hr/employee-management/onboarding/safeguarding/new', element: <SafeguardingAck /> },
  { path: 'hr/employee-management/onboarding/safeguarding/:id', element: <SafeguardingAck /> },
  // NDA Form (Form 55)
  { path: 'hr/employee-management/onboarding/nda', element: <NDAForm /> },
  { path: 'hr/employee-management/onboarding/nda/new', element: <NDAForm /> },
  { path: 'hr/employee-management/onboarding/nda/:id', element: <NDAForm /> },
];

// HR Leave & Attendance Routes
const hrLeaveAttendanceRoutes: RouteObject[] = [
  // Dashboard
  { path: 'hr/leave-attendance', element: <LeaveAttendanceDashboard /> },

  // Leave Management
  // Leave Request (Form 34)
  { path: 'hr/leave-attendance/leave/request', element: <LeaveRequest /> },
  { path: 'hr/leave-attendance/leave/request/new', element: <LeaveRequest /> },
  { path: 'hr/leave-attendance/leave/request/:id', element: <LeaveRequest /> },
  // Leave Tracker (Form 35)
  { path: 'hr/leave-attendance/leave/tracker', element: <LeaveTracker /> },

  // Attendance Management
  // Manual Attendance (Form 37)
  { path: 'hr/leave-attendance/attendance/manual', element: <ManualAttendance /> },
  { path: 'hr/leave-attendance/attendance/manual/new', element: <ManualAttendance /> },
  { path: 'hr/leave-attendance/attendance/manual/:id', element: <ManualAttendance /> },
  // Electronic Attendance (Form 36)
  { path: 'hr/leave-attendance/attendance/electronic', element: <ElectronicAttendance /> },
  { path: 'hr/leave-attendance/attendance/electronic/new', element: <ElectronicAttendance /> },
  { path: 'hr/leave-attendance/attendance/electronic/:id', element: <ElectronicAttendance /> },
];

// HR Performance Routes
const hrPerformanceRoutes: RouteObject[] = [
  // Dashboard
  { path: 'hr/performance', element: <PerformanceDashboard /> },

  // Probation Evaluation (Form 46)
  { path: 'hr/performance/probation-evaluation', element: <ProbationEvaluation /> },
  { path: 'hr/performance/probation-evaluation/new', element: <ProbationEvaluation /> },
  { path: 'hr/performance/probation-evaluation/:id', element: <ProbationEvaluation /> },

  // Performance Appraisal (Form 24)
  { path: 'hr/performance/appraisal', element: <PerformanceAppraisal /> },
  { path: 'hr/performance/appraisal/new', element: <PerformanceAppraisal /> },
  { path: 'hr/performance/appraisal/:id', element: <PerformanceAppraisal /> },

  // Internal Promotion Feasibility (Form 23)
  { path: 'hr/performance/promotion-feasibility', element: <InternalPromotionFeasibility /> },
  { path: 'hr/performance/promotion-feasibility/new', element: <InternalPromotionFeasibility /> },
  { path: 'hr/performance/promotion-feasibility/:id', element: <InternalPromotionFeasibility /> },

  // Promotion Letter (Form 25)
  { path: 'hr/performance/promotion-letter', element: <PromotionLetter /> },
  { path: 'hr/performance/promotion-letter/new', element: <PromotionLetter /> },
  { path: 'hr/performance/promotion-letter/:id', element: <PromotionLetter /> },
];

// HR Training Routes
const hrTrainingRoutes: RouteObject[] = [
  // Dashboard
  { path: 'hr/training', element: <TrainingDashboard /> },

  // Training Needs Assessment (Form 29)
  { path: 'hr/training/needs-assessment', element: <TrainingNeedsAssessment /> },
  { path: 'hr/training/needs-assessment/new', element: <TrainingNeedsAssessment /> },
  { path: 'hr/training/needs-assessment/:id', element: <TrainingNeedsAssessment /> },

  // Training Calendar (Form 30)
  { path: 'hr/training/calendar', element: <TrainingCalendar /> },
  { path: 'hr/training/calendar/new', element: <TrainingCalendar /> },
  { path: 'hr/training/calendar/:id', element: <TrainingCalendar /> },

  // Training Budget (Form 31)
  { path: 'hr/training/budget', element: <TrainingBudget /> },
  { path: 'hr/training/budget/new', element: <TrainingBudget /> },
  { path: 'hr/training/budget/:id', element: <TrainingBudget /> },

  // Training Request (Form 41)
  { path: 'hr/training/request', element: <TrainingRequest /> },
  { path: 'hr/training/request/new', element: <TrainingRequest /> },
  { path: 'hr/training/request/:id', element: <TrainingRequest /> },
];

// HR Payroll Routes
const hrPayrollRoutes: RouteObject[] = [
  // Dashboard
  { path: 'hr/payroll', element: <PayrollDashboard /> },

  // Payroll Generation (Form 42)
  { path: 'hr/payroll/generation', element: <PayrollGeneration /> },
  { path: 'hr/payroll/generation/new', element: <PayrollGeneration /> },
  { path: 'hr/payroll/generation/:id', element: <PayrollGeneration /> },

  // Payslips
  { path: 'hr/payroll/payslips', element: <Payslips /> },
  { path: 'hr/payroll/payslips/:id', element: <Payslips /> },

  // Advances (placeholder for future)
  { path: 'hr/payroll/advances', element: <PayrollDashboard /> },

  // Deductions (placeholder for future)
  { path: 'hr/payroll/deductions', element: <PayrollDashboard /> },
];

// HR Exit & Separation Routes
const hrExitRoutes: RouteObject[] = [
  // Dashboard
  { path: 'hr/exit', element: <ExitDashboard /> },

  // Exit Checklist (Form 47)
  { path: 'hr/exit/checklist', element: <ExitChecklist /> },
  { path: 'hr/exit/checklist/new', element: <ExitChecklist /> },
  { path: 'hr/exit/checklist/:id', element: <ExitChecklist /> },

  // Exit Interview (Form 44)
  { path: 'hr/exit/interview', element: <ExitInterview /> },
  { path: 'hr/exit/interview/new', element: <ExitInterview /> },
  { path: 'hr/exit/interview/:id', element: <ExitInterview /> },

  // Work Certificate (Form 43)
  { path: 'hr/exit/certificate', element: <WorkCertificate /> },
  { path: 'hr/exit/certificate/new', element: <WorkCertificate /> },
  { path: 'hr/exit/certificate/:id', element: <WorkCertificate /> },
];

// HR Special Forms Routes
const hrSpecialFormsRoutes: RouteObject[] = [
  // Dashboard
  { path: 'hr/special-forms', element: <SpecialFormsDashboard /> },

  // Internal Transfer Eligibility (Form 39)
  { path: 'hr/special-forms/transfer', element: <InternalTransferEligibility /> },
  { path: 'hr/special-forms/transfer/new', element: <InternalTransferEligibility /> },
  { path: 'hr/special-forms/transfer/:id', element: <InternalTransferEligibility /> },

  // Dual Employment Declaration (Form 54)
  { path: 'hr/special-forms/dual-employment', element: <DualEmploymentDeclaration /> },
  { path: 'hr/special-forms/dual-employment/new', element: <DualEmploymentDeclaration /> },
  { path: 'hr/special-forms/dual-employment/:id', element: <DualEmploymentDeclaration /> },
];

// Combine all routes
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      ...userManagementRoutes,
      ...complianceRoutes,
      ...auditRoutes,
      ...programRoutes,
      ...governanceRoutes,
      ...hrRecruitmentRoutes,
      ...hrEmployeeManagementRoutes,
      ...hrLeaveAttendanceRoutes,
      ...hrPerformanceRoutes,
      ...hrTrainingRoutes,
      ...hrPayrollRoutes,
      ...hrExitRoutes,
      ...hrSpecialFormsRoutes,
    ],
  },
];

const router = createBrowserRouter(routes);

export function AppRouterProvider(): JSX.Element {
  return <RouterProvider router={router} />;
}

export default AppRouterProvider;
