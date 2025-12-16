import {
  Award,
  Cake,
  Calendar,
  CheckSquare,
  ChevronRight,
  Clock,
  Download,
  FileSpreadsheet,
  FileWarning,
  Filter,
  Mail,
  Phone,
  Printer,
  RefreshCw,
  Square,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

// Types
interface ReportType {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

interface Filters {
  department: string;
  office: string;
  status: string;
  startDate: string;
  endDate: string;
  month: number;
  year: number;
  days: number;
}

interface StaffListItem {
  id: number;
  employee_id: string;
  name: string;
  department: string;
  position: string;
  office: string;
  status: string;
  hire_date: string;
  employment_type: string;
}

interface DirectoryItem {
  id: number;
  name: string;
  department: string;
  position: string;
  office: string;
  email: string;
  phone: string;
  extension: string;
}

interface BirthdayItem {
  id: number;
  name: string;
  department: string;
  birth_date: string;
  upcoming_date: string;
  days_until: number;
}

interface AnniversaryItem {
  id: number;
  name: string;
  department: string;
  hire_date: string;
  years: number;
  anniversary_date: string;
}

interface ExpiringContractItem {
  id: number;
  name: string;
  department: string;
  position: string;
  contract_end: string;
  days_remaining: number;
  contract_type: string;
}

interface ProbationItem {
  id: number;
  name: string;
  department: string;
  position: string;
  hire_date: string;
  probation_end: string;
  days_remaining: number;
  supervisor: string;
}

interface HeadcountItem {
  month: string;
  total: number;
  core: number;
  project: number;
  consultant: number;
  intern: number;
  new_hires: number;
  terminations: number;
}

type ReportDataItem =
  | StaffListItem
  | DirectoryItem
  | BirthdayItem
  | AnniversaryItem
  | ExpiringContractItem
  | ProbationItem
  | HeadcountItem;

interface MockData {
  "staff-list": StaffListItem[];
  directory: DirectoryItem[];
  birthdays: BirthdayItem[];
  anniversaries: AnniversaryItem[];
  "expiring-contracts": ExpiringContractItem[];
  "probation-ending": ProbationItem[];
  "headcount-history": HeadcountItem[];
}

const HRReports: React.FC = () => {
  const [activeReport, setActiveReport] = useState<string>("staff-list");
  const [loading, setLoading] = useState<boolean>(false);
  const [reportData, setReportData] = useState<ReportDataItem[]>([]);
  const [selectedReportsForBulk, setSelectedReportsForBulk] = useState<
    string[]
  >([]);
  const [showBulkExportModal, setShowBulkExportModal] =
    useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    department: "",
    office: "",
    status: "",
    startDate: "",
    endDate: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    days: 30,
  });

  const reportTypes: ReportType[] = [
    {
      id: "staff-list",
      name: "Staff List",
      icon: Users,
      description: "Complete list of all employees",
    },
    {
      id: "directory",
      name: "Staff Directory",
      icon: Phone,
      description: "Contact information directory",
    },
    {
      id: "birthdays",
      name: "Birthdays",
      icon: Cake,
      description: "Upcoming employee birthdays",
    },
    {
      id: "anniversaries",
      name: "Work Anniversaries",
      icon: Award,
      description: "Work anniversary dates",
    },
    {
      id: "expiring-contracts",
      name: "Expiring Contracts",
      icon: FileWarning,
      description: "Contracts expiring soon",
    },
    {
      id: "probation-ending",
      name: "Probation Ending",
      icon: Clock,
      description: "Employees ending probation",
    },
    {
      id: "headcount-history",
      name: "Headcount History",
      icon: TrendingUp,
      description: "Historical headcount data",
    },
  ];

  // Simulated data
  const mockData = useMemo(
    () => ({
      "staff-list": [
        {
          id: 1,
          employee_id: "EMP001",
          name: "Ahmad Rahimi",
          department: "Programs",
          position: "Program Manager",
          office: "Kabul",
          status: "active",
          hire_date: "2022-03-15",
          employment_type: "core",
        },
        {
          id: 2,
          employee_id: "EMP002",
          name: "Fatima Ahmadi",
          department: "Finance",
          position: "Finance Officer",
          office: "Kabul",
          status: "active",
          hire_date: "2021-06-01",
          employment_type: "core",
        },
        {
          id: 3,
          employee_id: "EMP003",
          name: "Mohammad Karimi",
          department: "Operations",
          position: "Logistics Coordinator",
          office: "Herat",
          status: "active",
          hire_date: "2023-01-10",
          employment_type: "project",
        },
        {
          id: 4,
          employee_id: "EMP004",
          name: "Zahra Noori",
          department: "HR",
          position: "HR Assistant",
          office: "Kabul",
          status: "probation",
          hire_date: "2024-10-01",
          employment_type: "core",
        },
        {
          id: 5,
          employee_id: "EMP005",
          name: "Ali Mohammadi",
          department: "IT",
          position: "IT Specialist",
          office: "Mazar",
          status: "active",
          hire_date: "2022-08-20",
          employment_type: "core",
        },
      ],
      directory: [
        {
          id: 1,
          name: "Ahmad Rahimi",
          department: "Programs",
          position: "Program Manager",
          office: "Kabul",
          email: "ahmad.rahimi@vdo.org",
          phone: "+93 700 123 456",
          extension: "101",
        },
        {
          id: 2,
          name: "Fatima Ahmadi",
          department: "Finance",
          position: "Finance Officer",
          office: "Kabul",
          email: "fatima.ahmadi@vdo.org",
          phone: "+93 700 234 567",
          extension: "102",
        },
        {
          id: 3,
          name: "Mohammad Karimi",
          department: "Operations",
          position: "Logistics Coordinator",
          office: "Herat",
          email: "mohammad.karimi@vdo.org",
          phone: "+93 700 345 678",
          extension: "201",
        },
        {
          id: 4,
          name: "Zahra Noori",
          department: "HR",
          position: "HR Assistant",
          office: "Kabul",
          email: "zahra.noori@vdo.org",
          phone: "+93 700 456 789",
          extension: "103",
        },
        {
          id: 5,
          name: "Ali Mohammadi",
          department: "IT",
          position: "IT Specialist",
          office: "Mazar",
          email: "ali.mohammadi@vdo.org",
          phone: "+93 700 567 890",
          extension: "301",
        },
      ],
      birthdays: [
        {
          id: 1,
          name: "Ahmad Rahimi",
          department: "Programs",
          birth_date: "1990-12-15",
          upcoming_date: "Dec 15",
          days_until: 7,
        },
        {
          id: 2,
          name: "Fatima Ahmadi",
          department: "Finance",
          birth_date: "1988-12-20",
          upcoming_date: "Dec 20",
          days_until: 12,
        },
        {
          id: 3,
          name: "Mohammad Karimi",
          department: "Operations",
          birth_date: "1992-12-25",
          upcoming_date: "Dec 25",
          days_until: 17,
        },
        {
          id: 4,
          name: "Ali Mohammadi",
          department: "IT",
          birth_date: "1995-01-05",
          upcoming_date: "Jan 05",
          days_until: 28,
        },
      ],
      anniversaries: [
        {
          id: 1,
          name: "Fatima Ahmadi",
          department: "Finance",
          hire_date: "2021-06-01",
          years: 3,
          anniversary_date: "Jun 01",
        },
        {
          id: 2,
          name: "Ahmad Rahimi",
          department: "Programs",
          hire_date: "2022-03-15",
          years: 2,
          anniversary_date: "Mar 15",
        },
        {
          id: 3,
          name: "Ali Mohammadi",
          department: "IT",
          hire_date: "2022-08-20",
          years: 2,
          anniversary_date: "Aug 20",
        },
        {
          id: 4,
          name: "Mohammad Karimi",
          department: "Operations",
          hire_date: "2023-01-10",
          years: 1,
          anniversary_date: "Jan 10",
        },
      ],
      "expiring-contracts": [
        {
          id: 1,
          name: "Mohammad Karimi",
          department: "Operations",
          position: "Logistics Coordinator",
          contract_end: "2024-12-31",
          days_remaining: 23,
          contract_type: "project",
        },
        {
          id: 2,
          name: "Zahra Noori",
          department: "HR",
          position: "HR Assistant",
          contract_end: "2025-01-15",
          days_remaining: 38,
          contract_type: "fixed_term",
        },
        {
          id: 3,
          name: "Ali Mohammadi",
          department: "IT",
          position: "IT Specialist",
          contract_end: "2025-02-28",
          days_remaining: 82,
          contract_type: "fixed_term",
        },
      ],
      "probation-ending": [
        {
          id: 1,
          name: "Zahra Noori",
          department: "HR",
          position: "HR Assistant",
          hire_date: "2024-10-01",
          probation_end: "2025-01-01",
          days_remaining: 24,
          supervisor: "HR Manager",
        },
        {
          id: 2,
          name: "New Employee",
          department: "Programs",
          position: "Field Officer",
          hire_date: "2024-11-01",
          probation_end: "2025-02-01",
          days_remaining: 55,
          supervisor: "Program Manager",
        },
      ],
      "headcount-history": [
        {
          month: "Jan 2024",
          total: 145,
          core: 80,
          project: 45,
          consultant: 12,
          intern: 8,
          new_hires: 5,
          terminations: 2,
        },
        {
          month: "Feb 2024",
          total: 148,
          core: 82,
          project: 46,
          consultant: 12,
          intern: 8,
          new_hires: 4,
          terminations: 1,
        },
        {
          month: "Mar 2024",
          total: 150,
          core: 83,
          project: 47,
          consultant: 12,
          intern: 8,
          new_hires: 3,
          terminations: 1,
        },
        {
          month: "Apr 2024",
          total: 152,
          core: 84,
          project: 48,
          consultant: 12,
          intern: 8,
          new_hires: 4,
          terminations: 2,
        },
        {
          month: "May 2024",
          total: 155,
          core: 85,
          project: 50,
          consultant: 12,
          intern: 8,
          new_hires: 5,
          terminations: 2,
        },
        {
          month: "Jun 2024",
          total: 158,
          core: 86,
          project: 52,
          consultant: 12,
          intern: 8,
          new_hires: 4,
          terminations: 1,
        },
        {
          month: "Jul 2024",
          total: 160,
          core: 87,
          project: 53,
          consultant: 12,
          intern: 8,
          new_hires: 3,
          terminations: 1,
        },
        {
          month: "Aug 2024",
          total: 163,
          core: 88,
          project: 55,
          consultant: 12,
          intern: 8,
          new_hires: 4,
          terminations: 1,
        },
        {
          month: "Sep 2024",
          total: 165,
          core: 89,
          project: 56,
          consultant: 12,
          intern: 8,
          new_hires: 3,
          terminations: 1,
        },
        {
          month: "Oct 2024",
          total: 168,
          core: 90,
          project: 58,
          consultant: 12,
          intern: 8,
          new_hires: 4,
          terminations: 1,
        },
        {
          month: "Nov 2024",
          total: 170,
          core: 91,
          project: 59,
          consultant: 12,
          intern: 8,
          new_hires: 3,
          terminations: 1,
        },
        {
          month: "Dec 2024",
          total: 172,
          core: 92,
          project: 60,
          consultant: 12,
          intern: 8,
          new_hires: 3,
          terminations: 1,
        },
      ],
    }),
    []
  );

  const loadReportData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      // In production, use actual API calls with date filters
      // const data = await employeeAdminService.getStaffList({
      //   ...filters,
      //   startDate: filters.startDate,
      //   endDate: filters.endDate
      // });
      setTimeout(() => {
        const data = mockData[activeReport as keyof MockData] || [];

        // Apply all filtering
        let filteredData = [...data];

        // Apply department filter (case-insensitive)
        if (filters.department) {
          filteredData = filteredData.filter((item) => {
            if ("department" in item) {
              return (
                (item as { department: string }).department.toLowerCase() ===
                filters.department.toLowerCase()
              );
            }
            return true;
          });
        }

        // Apply office filter (case-insensitive)
        if (filters.office) {
          filteredData = filteredData.filter((item) => {
            if ("office" in item) {
              return (
                (item as { office: string }).office.toLowerCase() ===
                filters.office.toLowerCase()
              );
            }
            return true;
          });
        }

        // Apply status filter (case-insensitive) - only for staff-list
        if (filters.status && activeReport === "staff-list") {
          filteredData = filteredData.filter((item) => {
            if ("status" in item) {
              return (
                (item as { status: string }).status.toLowerCase() ===
                filters.status.toLowerCase()
              );
            }
            return true;
          });
        }

        // Apply date filtering for reports that have date fields
        if (filters.startDate || filters.endDate) {
          filteredData = filteredData.filter((item) => {
            let itemDate: string | undefined;

            // Get the relevant date field based on report type
            if ("hire_date" in item) {
              itemDate = (item as { hire_date: string }).hire_date;
            } else if ("birth_date" in item) {
              itemDate = (item as { birth_date: string }).birth_date;
            } else if ("contract_end" in item) {
              itemDate = (item as { contract_end: string }).contract_end;
            } else if ("probation_end" in item) {
              itemDate = (item as { probation_end: string }).probation_end;
            }

            if (!itemDate) return true;

            const date = new Date(itemDate);
            const start = filters.startDate
              ? new Date(filters.startDate)
              : null;
            const end = filters.endDate ? new Date(filters.endDate) : null;

            if (start && end) {
              return date >= start && date <= end;
            } else if (start) {
              return date >= start;
            } else if (end) {
              return date <= end;
            }
            return true;
          });
        }

        setReportData(filteredData);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error loading report:", error);
      setLoading(false);
    }
  }, [
    activeReport,
    filters.department,
    filters.office,
    filters.status,
    filters.startDate,
    filters.endDate,
    mockData,
  ]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadReportData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [loadReportData]);

  const handleExport = (format: string): void => {
    const dateRange =
      filters.startDate && filters.endDate
        ? ` (${filters.startDate} to ${filters.endDate})`
        : "";
    console.log(`Exporting ${activeReport} as ${format}${dateRange}`);
    alert(
      `Exporting ${activeReport} report as ${format.toUpperCase()}${dateRange}`
    );
  };

  const handleBulkExport = (): void => {
    if (selectedReportsForBulk.length === 0) {
      alert("Please select at least one report section to export");
      return;
    }

    const dateRange =
      filters.startDate && filters.endDate
        ? ` (${filters.startDate} to ${filters.endDate})`
        : "";

    console.log("Bulk exporting reports:", selectedReportsForBulk, dateRange);

    // In production, this would call an API to generate a multi-sheet Excel file
    alert(
      `Generating bulk Excel report with ${selectedReportsForBulk.length} sections:\n\n` +
        selectedReportsForBulk
          .map((id) => reportTypes.find((r) => r.id === id)?.name)
          .join("\n") +
        `\n\nDate Range: ${dateRange || "All dates"}`
    );

    setShowBulkExportModal(false);
  };

  const toggleReportSelection = (reportId: string): void => {
    setSelectedReportsForBulk((prev) =>
      prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : [...prev, reportId]
    );
  };

  const selectAllReports = (): void => {
    if (selectedReportsForBulk.length === reportTypes.length) {
      setSelectedReportsForBulk([]);
    } else {
      setSelectedReportsForBulk(reportTypes.map((r) => r.id));
    }
  };

  const handlePrint = (): void => {
    window.print();
  };

  const clearDateFilters = (): void => {
    setFilters((prev) => ({ ...prev, startDate: "", endDate: "" }));
  };

  const getStatusBadge = (status: string): string => {
    const styles: Record<string, string> = {
      active:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      probation:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      on_leave: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return (
      styles[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    );
  };

  const renderStaffList = (): React.ReactNode => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Employee ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Office
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Hire Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {(reportData as StaffListItem[]).map((employee) => (
            <tr
              key={employee.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {employee.employee_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {employee.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {employee.department}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {employee.position}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {employee.office}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                    employee.status
                  )}`}
                >
                  {employee.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {employee.hire_date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {employee.employment_type}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderDirectory = (): React.ReactNode => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Office
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Ext
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {(reportData as DirectoryItem[]).map((person) => (
            <tr
              key={person.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {person.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {person.department}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {person.position}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {person.office}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                <a
                  href={`mailto:${person.email}`}
                  className="flex items-center gap-1"
                >
                  <Mail className="w-4 h-4" />
                  {person.email}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {person.phone}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {person.extension}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBirthdays = (): React.ReactNode => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {(reportData as BirthdayItem[]).map((person) => (
        <div
          key={person.id}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
            <Cake className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {person.name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {person.department}
            </p>
            <p className="text-sm text-pink-600 dark:text-pink-400">
              {person.upcoming_date}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                person.days_until <= 7
                  ? "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {person.days_until} days
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnniversaries = (): React.ReactNode => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {(reportData as AnniversaryItem[]).map((person) => (
        <div
          key={person.id}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {person.name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {person.department}
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              {person.anniversary_date}
            </p>
          </div>
          <div className="text-right">
            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full">
              {person.years} years
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderExpiringContracts = (): React.ReactNode => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Contract Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              End Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Days Remaining
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {(reportData as ExpiringContractItem[]).map((contract) => (
            <tr
              key={contract.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {contract.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {contract.department}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {contract.position}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {contract.contract_type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {contract.contract_end}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    contract.days_remaining <= 30
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      : contract.days_remaining <= 60
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  }`}
                >
                  {contract.days_remaining} days
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderProbationEnding = (): React.ReactNode => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Hire Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Probation End
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Days Remaining
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Supervisor
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {(reportData as ProbationItem[]).map((emp) => (
            <tr
              key={emp.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {emp.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {emp.department}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {emp.position}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {emp.hire_date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {emp.probation_end}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    emp.days_remaining <= 14
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  }`}
                >
                  {emp.days_remaining} days
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {emp.supervisor}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderHeadcountHistory = (): React.ReactNode => {
    const headcountData = reportData as HeadcountItem[];
    const lastItem = headcountData[headcountData.length - 1];

    return (
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Current Total
            </p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {lastItem?.total || 0}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">
              Core Staff
            </p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {lastItem?.core || 0}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Project Staff
            </p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {lastItem?.project || 0}
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
            <p className="text-sm text-orange-600 dark:text-orange-400">
              Consultants
            </p>
            <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
              {lastItem?.consultant || 0}
            </p>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Core
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Consultant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Intern
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  New Hires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Terminations
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {headcountData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {row.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">
                    {row.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {row.core}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {row.project}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {row.consultant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {row.intern}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-green-600 dark:text-green-400">
                      +{row.new_hires}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-red-600 dark:text-red-400">
                      -{row.terminations}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderReportContent = (): React.ReactNode => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      );
    }

    switch (activeReport) {
      case "staff-list":
        return renderStaffList();
      case "directory":
        return renderDirectory();
      case "birthdays":
        return renderBirthdays();
      case "anniversaries":
        return renderAnniversaries();
      case "expiring-contracts":
        return renderExpiringContracts();
      case "probation-ending":
        return renderProbationEnding();
      case "headcount-history":
        return renderHeadcountHistory();
      default:
        return <p className="text-gray-500">Select a report type</p>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            HR Reports
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Generate and view HR analytics reports
          </p>
        </div>
        <button
          onClick={() => setShowBulkExportModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <FileSpreadsheet className="w-5 h-5" />
          Bulk Export to Excel
        </button>
      </div>

      {/* Global Date Range Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Date Range Filter:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              From:
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              To:
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          {(filters.startDate || filters.endDate) && (
            <button
              onClick={clearDateFilters}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Clear Dates
            </button>
          )}
          {filters.startDate && filters.endDate && (
            <span className="text-sm text-green-600 dark:text-green-400">
              Filtering by date range
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report Type Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Report Types
              </h2>
            </div>
            <nav className="p-2">
              {reportTypes.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setActiveReport(report.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                    activeReport === report.id
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <report.icon className="w-5 h-5" />
                  <div className="text-left flex-1">
                    <p className="font-medium text-sm">{report.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {report.description}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ${
                      activeReport === report.id
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Report Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Report Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {reportTypes.find((r) => r.id === activeReport)?.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {reportData.length} records found
                  {(filters.startDate || filters.endDate) && " (filtered)"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadReportData()}
                  className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <div className="relative group">
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <div className="absolute right-0 hidden group-hover:block z-10">
                    <div className="mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handleExport("excel")}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Export as Excel
                      </button>
                      <button
                        onClick={() => handleExport("pdf")}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Export as PDF
                      </button>
                      <button
                        onClick={() => handleExport("csv")}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Export as CSV
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Filters for specific reports */}
            {(activeReport === "staff-list" ||
              activeReport === "directory") && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Filters:
                    </span>
                  </div>
                  <select
                    value={filters.department}
                    onChange={(e) =>
                      setFilters({ ...filters, department: e.target.value })
                    }
                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">All Departments</option>
                    <option value="Programs">Programs</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                  </select>
                  <select
                    value={filters.office}
                    onChange={(e) =>
                      setFilters({ ...filters, office: e.target.value })
                    }
                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">All Offices</option>
                    <option value="Kabul">Kabul</option>
                    <option value="Herat">Herat</option>
                    <option value="Mazar">Mazar-i-Sharif</option>
                    <option value="Kandahar">Kandahar</option>
                  </select>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="probation">Probation</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>
            )}

            {/* Report Content */}
            <div className="p-4">{renderReportContent()}</div>
          </div>
        </div>
      </div>

      {/* Bulk Export Modal */}
      {showBulkExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bulk Export to Excel
              </h3>
              <button
                onClick={() => setShowBulkExportModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                &times;
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Select the report sections you want to include. Each section will
              be exported as a separate sheet in the Excel file.
            </p>

            {/* Date Range for Bulk Export */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range for Export:
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    From:
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters({ ...filters, startDate: e.target.value })
                    }
                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    To:
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters({ ...filters, endDate: e.target.value })
                    }
                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Select All */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
              <button
                onClick={selectAllReports}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                {selectedReportsForBulk.length === reportTypes.length ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
                Select All Sections
              </button>
            </div>

            {/* Report Selection */}
            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {reportTypes.map((report) => (
                <button
                  key={report.id}
                  onClick={() => toggleReportSelection(report.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    selectedReportsForBulk.includes(report.id)
                      ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700"
                      : "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  {selectedReportsForBulk.includes(report.id) ? (
                    <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                  <report.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div className="text-left flex-1">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {report.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {report.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedReportsForBulk.length} section(s) selected
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkExportModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkExport}
                  disabled={selectedReportsForBulk.length === 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Generate Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRReports;
