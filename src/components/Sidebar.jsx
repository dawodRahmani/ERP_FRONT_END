import {
  Ban,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CalendarDays,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Clock,
  DollarSign,
  FileCheck,
  FileKey,
  FilePlus,
  FileSearch2,
  FileSignature,
  FileSpreadsheet,
  FileText,
  Fingerprint,
  FolderArchive,
  FolderKanban,
  FolderOpen,
  GraduationCap,
  HandCoins,
  Handshake,
  Heart,
  Key,
  LayoutDashboard,
  Lock,
  Network,
  PenLine,
  Scale,
  ScrollText,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Target,
  UserCheck,
  UserCog,
  UserPlus,
  UserSearch,
  Users,
  X
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openNestedDropdown, setOpenNestedDropdown] = useState(null);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/",
      type: "link",
    },
    {
      icon: Shield,
      label: "User Management",
      type: "dropdown",
      key: "user",
      subItems: [
        { icon: Users, label: "Users", path: "/user-management/users" },
        { icon: Lock, label: "Roles", path: "/user-management/roles" },
        {
          icon: Key,
          label: "Permissions",
          path: "/user-management/permissions",
        },
        {
          icon: Shield,
          label: "Role Permissions",
          path: "/user-management/role-permissions",
        },
      ],
    },
    {
      icon: ClipboardCheck,
      label: "Compliance",
      type: "dropdown",
      key: "compliance",
      subItems: [
        {
          type: "nested-dropdown",
          key: "compliance-development",
          label: "Compliance & Development Unit",
          icon: ClipboardCheck,
          items: [
            {
              icon: FolderOpen,
              label: "Init Project",
              path: "/compliance/projects",
            },
            {
              icon: FilePlus,
              label: "Amendment Project",
              path: "/compliance/amendments",
            },
            {
              icon: UserSearch,
              label: "Due Diligence",
              path: "/compliance/due-diligence",
            },
            {
              icon: FolderArchive,
              label: "Documents",
              path: "/compliance/documents",
            },
            {
              icon: ScrollText,
              label: "Certificates",
              path: "/compliance/certificates",
            },
            {
              icon: Ban,
              label: "Restricted List",
              path: "/compliance/blacklist",
            },
          ],
        },
        {
          type: "nested-dropdown",
          key: "grants-outreach",
          label: "Grants & Outreach Unit",
          icon: HandCoins,
          items: [
            {
              icon: FileCheck,
              label: "RFP Tracking",
              path: "/compliance/rfp-tracking",
            },
            {
              icon: FileKey,
              label: "Registration",
              path: "/compliance/registrations",
            },
            {
              icon: Network,
              label: "Membership",
              path: "/compliance/memberships",
            },
            {
              icon: Send,
              label: "Donor Outreach",
              path: "/compliance/donor-outreach",
            },
          ],
        },
        {
          type: "nested-dropdown",
          key: "partnerships",
          label: "Partnerships Unit",
          icon: Handshake,
          items: [
            {
              icon: Handshake,
              label: "Partners",
              path: "/compliance/partners",
            },
          ],
        },
      ],
    },
    {
      icon: FileSearch2,
      label: "Audit",
      type: "dropdown",
      key: "audit",
      subItems: [
        { icon: LayoutDashboard, label: "Dashboard", path: "/audit" },
        { icon: Settings, label: "Settings", path: "/audit/settings" },
        { icon: ShieldCheck, label: "HACT Assessments", path: "/audit/hact" },
        {
          icon: FolderKanban,
          label: "Donor Project Audits",
          path: "/audit/donor-project",
        },
        {
          icon: FileSearch2,
          label: "External Audits",
          path: "/audit/external",
        },
        {
          icon: ClipboardCheck,
          label: "Internal Audits",
          path: "/audit/internal",
        },
        { icon: Handshake, label: "Partner Audits", path: "/audit/partner" },
      ],
    },
    {
      icon: Target,
      label: "Program",
      type: "dropdown",
      key: "program",
      subItems: [
        { icon: LayoutDashboard, label: "Dashboard", path: "/program" },
        { icon: Building2, label: "Donors", path: "/program/donors" },
        { icon: FolderKanban, label: "Projects", path: "/program/projects" },
        { icon: ClipboardList, label: "Work Plans", path: "/program/work-plans" },
        { icon: ScrollText, label: "Certificates", path: "/program/certificates" },
        { icon: FolderOpen, label: "Documents", path: "/program/documents" },
        { icon: BarChart3, label: "Reporting", path: "/program/reporting" },
        { icon: Users, label: "Beneficiaries", path: "/program/beneficiaries" },
        { icon: Shield, label: "Safeguarding", path: "/program/safeguarding" },
      ],
    },
    {
      icon: Scale,
      label: "Governance",
      type: "dropdown",
      key: "governance",
      subItems: [
        { icon: Users, label: "Board Members", path: "/governance/board-members" },
        { icon: Calendar, label: "Board Meetings", path: "/governance/board-meetings" },
        { icon: FileText, label: "Correspondence", path: "/governance/correspondence" },
      ],
    },
    {
      icon: Briefcase,
      label: "Human Resources",
      type: "dropdown",
      key: "hr",
      subItems: [
        {
          type: "nested-dropdown",
          key: "hr-recruitment",
          label: "Recruitment",
          icon: UserPlus,
          items: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/hr/recruitment" },
            { icon: FileSpreadsheet, label: "Recruitment Tracker", path: "/hr/recruitment/tracker" },
            { icon: FileText, label: "Terms of Reference", path: "/hr/recruitment/terms-of-reference" },
            { icon: FilePlus, label: "Staff Requisition", path: "/hr/recruitment/staff-requisition" },
            { icon: Users, label: "Applications", path: "/hr/recruitment/applications" },
            { icon: UserCheck, label: "RC Formation", path: "/hr/recruitment/committee" },
            { icon: ShieldCheck, label: "Conflict of Interest", path: "/hr/recruitment/conflict-of-interest" },
            { icon: ClipboardList, label: "Longlisting", path: "/hr/recruitment/longlisting" },
            { icon: CheckCircle, label: "Shortlisting", path: "/hr/recruitment/shortlisting" },
            { icon: FileCheck, label: "Written Test", path: "/hr/recruitment/written-test" },
            { icon: UserSearch, label: "Interview", path: "/hr/recruitment/interview" },
            { icon: FileText, label: "Recruitment Report", path: "/hr/recruitment/report" },
            { icon: Send, label: "Offer Letter", path: "/hr/recruitment/offer-letter" },
            { icon: Shield, label: "Background Checks", path: "/hr/recruitment/background-checks" },
            { icon: ScrollText, label: "Employment Contract", path: "/hr/recruitment/employment-contract" },
            { icon: ClipboardCheck, label: "Checklist", path: "/hr/recruitment/checklist" },
            { icon: FileSearch2, label: "Sole Source", path: "/hr/recruitment/sole-source" },
            { icon: Target, label: "Candidate Sourcing", path: "/hr/recruitment/candidate-sourcing" },
            { icon: Settings, label: "Dropdown Settings", path: "/hr/recruitment/dropdown-settings" },
          ],
        },
        {
          type: "nested-dropdown",
          key: "hr-employee-management",
          label: "Employee Management",
          icon: UserCog,
          items: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/hr/employee-management" },
            { icon: FilePlus, label: "Extension Letter", path: "/hr/employee-management/contract/extension" },
            { icon: FileSignature, label: "Confirmation Letter", path: "/hr/employee-management/contract/confirmation" },
            { icon: FileText, label: "Contract Amendment", path: "/hr/employee-management/contract/amendment" },
            { icon: Ban, label: "Termination Letter", path: "/hr/employee-management/contract/termination" },
            { icon: BookOpen, label: "Induction Form", path: "/hr/employee-management/onboarding/induction" },
            { icon: ShieldCheck, label: "Code of Conduct", path: "/hr/employee-management/onboarding/code-of-conduct" },
            { icon: FolderArchive, label: "Personnel File", path: "/hr/employee-management/onboarding/personnel-file" },
            { icon: Users, label: "Mahram Form", path: "/hr/employee-management/onboarding/mahram" },
            { icon: ClipboardList, label: "Induction Pack", path: "/hr/employee-management/onboarding/induction-pack" },
            { icon: Heart, label: "Safeguarding Ack", path: "/hr/employee-management/onboarding/safeguarding" },
            { icon: Lock, label: "NDA", path: "/hr/employee-management/onboarding/nda" },
          ],
        },
        {
          type: "nested-dropdown",
          key: "hr-leave-attendance",
          label: "Leave & Attendance",
          icon: CalendarDays,
          items: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/hr/leave-attendance" },
            { icon: FileText, label: "Leave Request", path: "/hr/leave-attendance/leave/request" },
            { icon: Calendar, label: "Leave Tracker", path: "/hr/leave-attendance/leave/tracker" },
            { icon: PenLine, label: "Attendance", path: "/hr/leave-attendance/attendance/manual" },
          ],
        },
        {
          type: "nested-dropdown",
          key: "hr-training",
          label: "Training",
          icon: GraduationCap,
          items: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/hr/training" },
            { icon: ClipboardList, label: "Needs Assessment", path: "/hr/training/needs-assessment" },
            { icon: Calendar, label: "Training Calendar", path: "/hr/training/calendar" },
            { icon: DollarSign, label: "Budget Proposal", path: "/hr/training/budget" },
            { icon: FileText, label: "Training Request", path: "/hr/training/request" },
          ],
        },
        {
          type: "nested-dropdown",
          key: "hr-performance",
          label: "Performance",
          icon: Target,
          items: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/hr/performance" },
            { icon: Fingerprint, label: "Probation Evaluation", path: "/hr/performance/probation-evaluation" },
            { icon: ClipboardCheck, label: "Performance Appraisal", path: "/hr/performance/appraisal" },
            { icon: FileSearch2, label: "Promotion Feasibility", path: "/hr/performance/promotion-feasibility" },
            { icon: FileText, label: "Promotion Letter", path: "/hr/performance/promotion-letter" },
          ],
        },
        {
          type: "nested-dropdown",
          key: "hr-payroll",
          label: "Payroll",
          icon: DollarSign,
          items: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/hr/payroll" },
            { icon: ClipboardList, label: "Payroll Generation", path: "/hr/payroll/generation" },
            { icon: FileText, label: "Payslips", path: "/hr/payroll/payslips" },
            { icon: HandCoins, label: "Advances", path: "/hr/payroll/advances" },
          ],
        },
        {
          type: "nested-dropdown",
          key: "hr-exit",
          label: "Exit & Separation",
          icon: Ban,
          items: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/hr/exit" },
            { icon: ClipboardCheck, label: "Exit Checklist", path: "/hr/exit/checklist" },
            { icon: FileText, label: "Exit Interview", path: "/hr/exit/interview" },
            { icon: ScrollText, label: "Work Certificate", path: "/hr/exit/certificate" },
          ],
        },
      ],
    },
  ];

  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const toggleNestedDropdown = (key) => {
    setOpenNestedDropdown(openNestedDropdown === key ? null : key);
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-hidden bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 duration-300 ease-linear lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <NavLink to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="VDO Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              VDO ERP
            </span>
          </NavLink>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="flex-1 flex flex-col overflow-y-auto duration-300 ease-linear custom-scrollbar">
          <nav className="px-4 py-4 lg:px-6">
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                MENU
              </h3>

              <ul className="mb-6 flex flex-col gap-1.5">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;

                  if (item.type === "link") {
                    return (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `group relative flex items-center gap-2.5 rounded-lg px-4 py-2.5 font-medium duration-300 ease-in-out ${
                              isActive
                                ? "bg-primary-500 text-white"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`
                          }
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </NavLink>
                      </li>
                    );
                  }

                  if (item.type === "dropdown") {
                    const isOpen = openDropdown === item.key;
                    return (
                      <li key={item.key}>
                        {/* Dropdown Header */}
                        <button
                          onClick={() => toggleDropdown(item.key)}
                          className="group relative flex w-full items-center gap-2.5 rounded-lg px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 duration-300 ease-in-out"
                        >
                          <Icon className="h-5 w-5" />
                          <span className="flex-1 text-left">{item.label}</span>
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>

                        {/* Dropdown Items */}
                        {isOpen && (
                          <ul className="mt-2 ml-4 space-y-1">
                            {item.subItems.map((subItem) => {
                              // Handle nested dropdown
                              if (subItem.type === "nested-dropdown") {
                                const SubIcon = subItem.icon;
                                const isNestedOpen =
                                  openNestedDropdown === subItem.key;
                                return (
                                  <li key={subItem.key}>
                                    {/* Nested Dropdown Header */}
                                    <button
                                      onClick={() =>
                                        toggleNestedDropdown(subItem.key)
                                      }
                                      className="group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 duration-300 ease-in-out"
                                    >
                                      <SubIcon className="h-4 w-4" />
                                      <span className="flex-1 text-left">
                                        {subItem.label}
                                      </span>
                                      {isNestedOpen ? (
                                        <ChevronDown className="h-3 w-3" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3" />
                                      )}
                                    </button>

                                    {/* Nested Dropdown Items */}
                                    {isNestedOpen && (
                                      <ul className="mt-1 ml-4 space-y-1">
                                        {subItem.items.map((nestedItem) => {
                                          const NestedIcon = nestedItem.icon;
                                          return (
                                            <li key={nestedItem.path}>
                                              <NavLink
                                                to={nestedItem.path}
                                                className={({ isActive }) =>
                                                  `group relative flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium duration-300 ease-in-out ${
                                                    isActive
                                                      ? "bg-primary-500 text-white"
                                                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                  }`
                                                }
                                                onClick={() =>
                                                  setSidebarOpen(false)
                                                }
                                              >
                                                <NestedIcon className="h-3.5 w-3.5" />
                                                {nestedItem.label}
                                              </NavLink>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    )}
                                  </li>
                                );
                              }

                              // Handle regular sub-item
                              const SubIcon = subItem.icon;
                              return (
                                <li key={subItem.path}>
                                  <NavLink
                                    to={subItem.path}
                                    className={({ isActive }) =>
                                      `group relative flex items-center gap-2.5 rounded-lg px-4 py-2 text-sm font-medium duration-300 ease-in-out ${
                                        isActive
                                          ? "bg-primary-500 text-white"
                                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                      }`
                                    }
                                    onClick={() => setSidebarOpen(false)}
                                  >
                                    <SubIcon className="h-4 w-4" />
                                    {subItem.label}
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  }

                  return null;
                })}
              </ul>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
