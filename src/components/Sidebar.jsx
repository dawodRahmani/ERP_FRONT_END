import {
  AlertTriangle,
  Award,
  Ban,
  // Payroll icons
  Banknote,
  BarChart3,
  BookOpen,
  Briefcase,
  Building,
  Building2,
  Calculator,
  Calendar,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  // Compliance icons
  ClipboardCheck,
  ClipboardList,
  ClipboardMinus,
  ClipboardSignature,
  Clock,
  Coins,
  DollarSign,
  Download,
  FileCheck,
  // HR Extended icons
  FileEdit,
  FileKey,
  FilePlus,
  FileSearch2,
  FileText,
  FileWarning,
  FolderArchive,
  FolderClosed,
  FolderKanban,
  FolderOpen,
  // Disciplinary icons
  Gavel,
  GraduationCap,
  HandCoins,
  Handshake,
  Heart,
  Home,
  Key,
  Laptop,
  LayoutDashboard,
  ListChecks,
  Lock,
  LogOut,
  MessageSquare,
  Network,
  PiggyBank,
  Plane,
  Receipt,
  Scale,
  ScrollText,
  Search,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Target,
  TrendingUp,
  UserCheck,
  UserCog,
  UserPlus,
  // Recruitment icons
  UserRoundSearch,
  Users,
  Users2,
  UserSearch,
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
      icon: UserCog,
      label: "HR Management",
      type: "dropdown",
      key: "hr",
      subItems: [
        {
          type: "nested-dropdown",
          key: "hr-employee-admin",
          label: "Employee Administration",
          icon: Users2,
          items: [
            {
              icon: LayoutDashboard,
              label: "HR Dashboard",
              path: "/employee-admin/dashboard",
            },
            {
              icon: Users,
              label: "Employees",
              path: "/employee-admin/employees",
            },
            {
              icon: UserPlus,
              label: "New Employee",
              path: "/employee-admin/employees/new",
            },
            {
              icon: UserCheck,
              label: "Onboarding",
              path: "/employee-admin/onboarding",
            },
            {
              icon: FileEdit,
              label: "Contracts",
              path: "/employee-admin/contracts",
            },
            {
              icon: ClipboardMinus,
              label: "Interim Hiring",
              path: "/employee-admin/interim-hiring",
            },
            {
              icon: FolderClosed,
              label: "Personnel Files",
              path: "/employee-admin/personnel-files",
            },
            {
              icon: Home,
              label: "Mahram Registration",
              path: "/employee-admin/mahram",
            },
            {
              icon: BarChart3,
              label: "HR Reports",
              path: "/employee-admin/reports",
            },
          ],
        },
        {
          type: "nested-dropdown",
          key: "hr-organization",
          label: "Organization Setup",
          icon: Building2,
          items: [
            { icon: Building2, label: "Departments", path: "/hr/departments" },
            { icon: Briefcase, label: "Positions", path: "/hr/positions" },
            { icon: Building, label: "Offices", path: "/hr/offices" },
            { icon: Award, label: "Grades", path: "/hr/grades" },
            {
              icon: Users2,
              label: "Employee Types",
              path: "/hr/employee-types",
            },
          ],
        },
        {
          type: "nested-dropdown",
          key: "hr-recruitment",
          label: "Recruitment",
          icon: UserRoundSearch,
          items: [
            {
              icon: ClipboardSignature,
              label: "All Recruitments",
              path: "/recruitment",
            },
            {
              icon: UserPlus,
              label: "New Recruitment",
              path: "/recruitment/new",
            },
          ],
        },
        {
          type: "nested-dropdown",
          key: "hr-attendance",
          label: "Time & Attendance",
          icon: Clock,
          items: [
            {
              icon: Calendar,
              label: "Work Schedules",
              path: "/hr/work-schedules",
            },
            { icon: Clock, label: "Attendance", path: "/hr/attendance" },
            {
              icon: Calendar,
              label: "Leave Management",
              path: "/hr/leave-management",
            },
            { icon: ListChecks, label: "Leave Types", path: "/hr/leave-types" },
          ],
        },
        {
          type: "nested-dropdown",
          key: "hr-performance",
          label: "Performance Appraisal",
          icon: Target,
          items: [
            {
              icon: LayoutDashboard,
              label: "Dashboard",
              path: "/hr/performance",
            },
            {
              icon: Calendar,
              label: "Appraisal Cycles",
              path: "/hr/performance/cycles",
            },
            {
              icon: FileText,
              label: "Templates",
              path: "/hr/performance/templates",
            },
            {
              icon: ClipboardList,
              label: "Employee Appraisals",
              path: "/hr/performance/appraisals",
            },
            {
              icon: UserCheck,
              label: "Probation Tracking",
              path: "/hr/performance/probation",
            },
            { icon: TrendingUp, label: "PIPs", path: "/hr/performance/pips" },
          ],
        },
        {
          type: "nested-dropdown",
          key: "hr-training",
          label: "Training & Capacity Building",
          icon: GraduationCap,
          items: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/training" },
            {
              icon: BookOpen,
              label: "Training Types",
              path: "/training/types",
            },
            {
              icon: GraduationCap,
              label: "Programs",
              path: "/training/programs",
            },
            { icon: ClipboardList, label: "TNA", path: "/training/tna" },
            { icon: Calendar, label: "Trainings", path: "/training/trainings" },
            {
              icon: CalendarCheck,
              label: "Calendar",
              path: "/training/calendar",
            },
            {
              icon: Award,
              label: "Certificates",
              path: "/training/certificates",
            },
            { icon: FileText, label: "Bonds", path: "/training/bonds" },
          ],
        },
        {
          type: "nested-dropdown",
          key: "hr-compensation",
          label: "Compensation & Benefits",
          icon: DollarSign,
          items: [
            { icon: DollarSign, label: "Payroll", path: "/hr/payroll" },
            { icon: Plane, label: "Travel & DSA", path: "/hr/travel-dsa" },
          ],
        },
        {
          type: "nested-dropdown",
          key: "hr-administration",
          label: "HR Administration",
          icon: FileText,
          items: [
            {
              icon: Laptop,
              label: "Asset Management",
              path: "/hr/asset-management",
            },
            {
              icon: LogOut,
              label: "Exit Management",
              path: "/hr/exit-management",
            },
            {
              icon: Heart,
              label: "Staff Association",
              path: "/hr/staff-association",
            },
            {
              icon: Download,
              label: "Template Documents",
              path: "/hr/template-documents",
            },
          ],
        },
        {
          type: "nested-dropdown",
          key: "hr-disciplinary",
          label: "Disciplinary System",
          icon: Gavel,
          items: [
            {
              icon: LayoutDashboard,
              label: "Dashboard",
              path: "/disciplinary/dashboard",
            },
            {
              icon: FileWarning,
              label: "Misconduct Reports",
              path: "/disciplinary/reports",
            },
            {
              icon: Search,
              label: "Investigations",
              path: "/disciplinary/investigations",
            },
            {
              icon: AlertTriangle,
              label: "Warnings",
              path: "/disciplinary/actions",
            },
            { icon: Scale, label: "Appeals", path: "/disciplinary/appeals" },
            {
              icon: MessageSquare,
              label: "Grievances",
              path: "/disciplinary/grievances",
            },
          ],
        },
        {
          type: "nested-dropdown",
          key: "hr-exit",
          label: "Exit & Termination",
          icon: LogOut,
          items: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/exit" },
            { icon: LogOut, label: "Separations", path: "/exit/separations" },
            {
              icon: ClipboardCheck,
              label: "Clearances",
              path: "/exit/clearances",
            },
            {
              icon: MessageSquare,
              label: "Exit Interviews",
              path: "/exit/interviews",
            },
            {
              icon: DollarSign,
              label: "Settlements",
              path: "/exit/settlements",
            },
            { icon: Award, label: "Certificates", path: "/exit/certificates" },
          ],
        },
        {
          type: "nested-dropdown",
          key: "hr-payroll",
          label: "Payroll System",
          icon: Banknote,
          items: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/payroll" },
            {
              icon: Calendar,
              label: "Payroll Periods",
              path: "/payroll/periods",
            },
            {
              icon: FileText,
              label: "Payroll Entries",
              path: "/payroll/entries",
            },
            {
              icon: Calculator,
              label: "Salary Structures",
              path: "/payroll/structures",
            },
            { icon: Coins, label: "Advances", path: "/payroll/advances" },
            { icon: PiggyBank, label: "Loans", path: "/payroll/loans" },
            { icon: Clock, label: "Overtime", path: "/payroll/overtime" },
            { icon: Receipt, label: "Payslips", path: "/payroll/payslips" },
          ],
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
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 duration-300 ease-linear lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500 text-white">
              <span className="text-xl font-bold">V</span>
            </div>
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
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear custom-scrollbar">
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
