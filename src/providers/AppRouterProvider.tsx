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

// HR Management Pages
import Departments from '../pages/hr-management/Departments';
import Positions from '../pages/hr-management/Positions';
import Offices from '../pages/hr-management/Offices';
import Grades from '../pages/hr-management/Grades';
import EmployeeTypes from '../pages/hr-management/EmployeeTypes';
import WorkSchedules from '../pages/hr-management/WorkSchedules';
import Attendance from '../pages/hr-management/Attendance';
import LeaveManagement from '../pages/hr-management/LeaveManagement';
import LeaveTypes from '../pages/hr-management/LeaveTypes';
import LeavePolicies from '../pages/hr-management/LeavePolicies';
import LeaveBalances from '../pages/hr-management/LeaveBalances';
import Holidays from '../pages/hr-management/Holidays';
import LeaveCalendar from '../pages/hr-management/LeaveCalendar';
import Timesheets from '../pages/hr-management/Timesheets';
import LeaveReports from '../pages/hr-management/LeaveReports';
import Recruitment from '../pages/hr-management/Recruitment';
import Payroll from '../pages/hr-management/Payroll';
import TemplateDocuments from '../pages/hr-management/TemplateDocuments';
import ProbationOrientation from '../pages/hr-management/ProbationOrientation';
import PerformanceManagement from '../pages/hr-management/PerformanceManagement';
import TrainingDevelopment from '../pages/hr-management/TrainingDevelopment';
import DisciplinaryGrievance from '../pages/hr-management/DisciplinaryGrievance';
import TravelDSA from '../pages/hr-management/TravelDSA';
import AssetManagement from '../pages/hr-management/AssetManagement';
import ExitManagement from '../pages/hr-management/ExitManagement';
import StaffAssociation from '../pages/hr-management/StaffAssociation';

// Employee Administration Module Pages
import {
  HRDashboard,
  EmployeeList,
  EmployeeProfile,
  EmployeeForm,
  UpdatePosition,
  OnboardingDashboard,
  ContractManagement,
  InterimHiring,
  PersonnelFiles,
  MahramRegistration,
  HRReports
} from '../pages/employee-admin';

// Recruitment Module Pages
import RecruitmentList from '../pages/recruitment/RecruitmentList';
import NewRecruitment from '../pages/recruitment/NewRecruitment';
import RecruitmentDetail from '../pages/recruitment/RecruitmentDetail';

// Training Module Pages
import {
  TrainingDashboard,
  TrainingTypes,
  TrainingPrograms,
  TNAList,
  TNAForm,
  TrainingsList,
  TrainingForm,
  TrainingCalendar,
  TrainingCertificates,
  TrainingBonds,
} from '../pages/training';

// Disciplinary Module Pages
import {
  DisciplinaryDashboard,
  MisconductReports,
  MisconductReportForm,
  Investigations,
  DisciplinaryActions,
  Appeals,
  Grievances
} from '../pages/disciplinary';

// Exit & Termination Module Pages
import {
  ExitDashboard,
  SeparationsList,
  SeparationForm,
  ClearancesList,
  ExitInterviewList,
  FinalSettlements,
  WorkCertificates,
} from '../pages/exit';

// Payroll Module Pages
import {
  PayrollDashboard,
  PayrollPeriods,
  PayrollEntries,
  SalaryStructures,
  Advances,
  Loans,
  OvertimeRecords,
  Payslips,
  PayrollGeneration,
  PayrollGenerationReport
} from '../pages/payroll';

// Performance Appraisal Module Pages
import {
  PerformanceDashboard,
  AppraisalCycles,
  AppraisalTemplates,
  EmployeeAppraisals,
  AppraisalForm,
  ProbationTracking,
  PIPs
} from '../pages/performance';

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

import type { JSX } from 'react';

// User Management Routes
const userManagementRoutes: RouteObject[] = [
  { path: 'user-management/users', element: <Users /> },
  { path: 'user-management/roles', element: <Roles /> },
  { path: 'user-management/permissions', element: <Permissions /> },
  { path: 'user-management/role-permissions', element: <RolePermissions /> },
];

// Employee Administration Routes
const employeeAdminRoutes: RouteObject[] = [
  { path: 'employee-admin', element: <HRDashboard /> },
  { path: 'employee-admin/dashboard', element: <HRDashboard /> },
  { path: 'employee-admin/employees', element: <EmployeeList /> },
  { path: 'employee-admin/employees/new', element: <EmployeeForm /> },
  { path: 'employee-admin/employees/:id', element: <EmployeeProfile /> },
  { path: 'employee-admin/employees/:id/edit', element: <EmployeeForm /> },
  { path: 'employee-admin/employees/:id/update-position', element: <UpdatePosition /> },
  { path: 'employee-admin/onboarding', element: <OnboardingDashboard /> },
  { path: 'employee-admin/contracts', element: <ContractManagement /> },
  { path: 'employee-admin/interim-hiring', element: <InterimHiring /> },
  { path: 'employee-admin/personnel-files', element: <PersonnelFiles /> },
  { path: 'employee-admin/personnel-files/:id', element: <PersonnelFiles /> },
  { path: 'employee-admin/mahram', element: <MahramRegistration /> },
  { path: 'employee-admin/reports', element: <HRReports /> },
];

// HR Settings Routes
const hrSettingsRoutes: RouteObject[] = [
  { path: 'hr/departments', element: <Departments /> },
  { path: 'hr/positions', element: <Positions /> },
  { path: 'hr/offices', element: <Offices /> },
  { path: 'hr/grades', element: <Grades /> },
  { path: 'hr/employee-types', element: <EmployeeTypes /> },
  { path: 'hr/work-schedules', element: <WorkSchedules /> },
  { path: 'hr/attendance', element: <Attendance /> },
  { path: 'hr/leave-management', element: <LeaveManagement /> },
  { path: 'hr/leave-types', element: <LeaveTypes /> },
  { path: 'hr/leave-policies', element: <LeavePolicies /> },
  { path: 'hr/leave-balances', element: <LeaveBalances /> },
  { path: 'hr/holidays', element: <Holidays /> },
  { path: 'hr/leave-calendar', element: <LeaveCalendar /> },
  { path: 'hr/timesheets', element: <Timesheets /> },
  { path: 'hr/leave-reports', element: <LeaveReports /> },
  { path: 'hr/recruitment', element: <Recruitment /> },
  { path: 'hr/probation-orientation', element: <ProbationOrientation /> },
  { path: 'hr/performance', element: <PerformanceManagement /> },
  { path: 'hr/training', element: <TrainingDevelopment /> },
  { path: 'hr/disciplinary-grievance', element: <DisciplinaryGrievance /> },
  { path: 'hr/travel-dsa', element: <TravelDSA /> },
  { path: 'hr/asset-management', element: <AssetManagement /> },
  { path: 'hr/exit-management', element: <ExitManagement /> },
  { path: 'hr/staff-association', element: <StaffAssociation /> },
  { path: 'hr/payroll', element: <Payroll /> },
  { path: 'hr/template-documents', element: <TemplateDocuments /> },
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

// Recruitment Module Routes
const recruitmentRoutes: RouteObject[] = [
  { path: 'recruitment', element: <RecruitmentList /> },
  { path: 'recruitment/new', element: <NewRecruitment /> },
  { path: 'recruitment/:id', element: <RecruitmentDetail /> },
];

// Training Module Routes
const trainingRoutes: RouteObject[] = [
  { path: 'training', element: <TrainingDashboard /> },
  { path: 'training/types', element: <TrainingTypes /> },
  { path: 'training/programs', element: <TrainingPrograms /> },
  { path: 'training/tna', element: <TNAList /> },
  { path: 'training/tna/new', element: <TNAForm /> },
  { path: 'training/tna/:id', element: <TNAForm /> },
  { path: 'training/tna/:id/edit', element: <TNAForm /> },
  { path: 'training/trainings', element: <TrainingsList /> },
  { path: 'training/trainings/new', element: <TrainingForm /> },
  { path: 'training/trainings/:id', element: <TrainingForm /> },
  { path: 'training/trainings/:id/edit', element: <TrainingForm /> },
  { path: 'training/calendar', element: <TrainingCalendar /> },
  { path: 'training/certificates', element: <TrainingCertificates /> },
  { path: 'training/bonds', element: <TrainingBonds /> },
];

// Disciplinary Module Routes
const disciplinaryRoutes: RouteObject[] = [
  { path: 'disciplinary', element: <DisciplinaryDashboard /> },
  { path: 'disciplinary/dashboard', element: <DisciplinaryDashboard /> },
  { path: 'disciplinary/reports', element: <MisconductReports /> },
  { path: 'disciplinary/reports/new', element: <MisconductReportForm /> },
  { path: 'disciplinary/reports/:id', element: <MisconductReportForm /> },
  { path: 'disciplinary/reports/:id/edit', element: <MisconductReportForm /> },
  { path: 'disciplinary/investigations', element: <Investigations /> },
  { path: 'disciplinary/investigations/:id', element: <Investigations /> },
  { path: 'disciplinary/actions', element: <DisciplinaryActions /> },
  { path: 'disciplinary/actions/:id', element: <DisciplinaryActions /> },
  { path: 'disciplinary/appeals', element: <Appeals /> },
  { path: 'disciplinary/appeals/:id', element: <Appeals /> },
  { path: 'disciplinary/grievances', element: <Grievances /> },
  { path: 'disciplinary/grievances/:id', element: <Grievances /> },
];

// Exit & Termination Module Routes
const exitRoutes: RouteObject[] = [
  { path: 'exit', element: <ExitDashboard /> },
  { path: 'exit/dashboard', element: <ExitDashboard /> },
  { path: 'exit/separations', element: <SeparationsList /> },
  { path: 'exit/separations/new', element: <SeparationForm /> },
  { path: 'exit/separations/:id', element: <SeparationForm /> },
  { path: 'exit/separations/:id/edit', element: <SeparationForm /> },
  { path: 'exit/clearances', element: <ClearancesList /> },
  { path: 'exit/interviews', element: <ExitInterviewList /> },
  { path: 'exit/interviews/new', element: <ExitInterviewList /> },
  { path: 'exit/interviews/:id', element: <ExitInterviewList /> },
  { path: 'exit/settlements', element: <FinalSettlements /> },
  { path: 'exit/certificates', element: <WorkCertificates /> },
];

// Payroll Module Routes
const payrollRoutes: RouteObject[] = [
  { path: 'payroll', element: <PayrollDashboard /> },
  { path: 'payroll/dashboard', element: <PayrollDashboard /> },
  { path: 'payroll/periods', element: <PayrollPeriods /> },
  { path: 'payroll/periods/new', element: <PayrollPeriods /> },
  { path: 'payroll/periods/:id', element: <PayrollPeriods /> },
  { path: 'payroll/entries', element: <PayrollEntries /> },
  { path: 'payroll/structures', element: <SalaryStructures /> },
  { path: 'payroll/advances', element: <Advances /> },
  { path: 'payroll/loans', element: <Loans /> },
  { path: 'payroll/overtime', element: <OvertimeRecords /> },
  { path: 'payroll/payslips', element: <Payslips /> },
  { path: 'payroll/generation', element: <PayrollGeneration /> },
  { path: 'payroll/generation/:id', element: <PayrollGenerationReport /> },
];

// Performance Appraisal Module Routes
const performanceRoutes: RouteObject[] = [
  { path: 'hr/performance', element: <PerformanceDashboard /> },
  { path: 'hr/performance/dashboard', element: <PerformanceDashboard /> },
  { path: 'hr/performance/cycles', element: <AppraisalCycles /> },
  { path: 'hr/performance/templates', element: <AppraisalTemplates /> },
  { path: 'hr/performance/appraisals', element: <EmployeeAppraisals /> },
  { path: 'hr/performance/appraisal/:id', element: <AppraisalForm /> },
  { path: 'hr/performance/probation', element: <ProbationTracking /> },
  { path: 'hr/performance/pips', element: <PIPs /> },
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

// Combine all routes
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      ...userManagementRoutes,
      ...employeeAdminRoutes,
      ...hrSettingsRoutes,
      ...complianceRoutes,
      ...recruitmentRoutes,
      ...trainingRoutes,
      ...disciplinaryRoutes,
      ...exitRoutes,
      ...payrollRoutes,
      ...performanceRoutes,
      ...auditRoutes,
      ...programRoutes,
      ...governanceRoutes,
    ],
  },
];

const router = createBrowserRouter(routes);

export function AppRouterProvider(): JSX.Element {
  return <RouterProvider router={router} />;
}

export default AppRouterProvider;
