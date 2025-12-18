import {
  AlertCircle,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Save,
  Search,
  User,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  attendanceDB,
  departmentDB,
  employeeDB,
  seedAllDefaults,
} from "../../services/db/indexedDB";

// ==================== TYPES ====================

interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  department: string;
  position?: string;
  email?: string;
  phone?: string;
  status?: string;
}

interface AttendanceRecord {
  id?: number;
  employeeId: number;
  date: string;
  status: string;
  checkIn: string;
  checkOut: string;
  notes: string;
}

interface MergedRecord {
  employee: Employee;
  attendance: AttendanceRecord | null;
  status: string;
  checkIn: string;
  checkOut: string;
  notes: string;
  selected?: boolean;
}

interface Department {
  id: number;
  name: string;
}

interface Stats {
  total: number;
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  onLeave: number;
}

interface StatusOption {
  value: string;
  label: string;
  color: string;
  icon: React.FC<{ className?: string }>;
}

interface ExportDateRange {
  startDate: string;
  endDate: string;
}

// ==================== CONSTANTS ====================

const STATUS_OPTIONS: StatusOption[] = [
  { value: "present", label: "Present", color: "green", icon: UserCheck },
  { value: "absent", label: "Absent", color: "red", icon: UserX },
  { value: "late", label: "Late", color: "yellow", icon: Clock },
  { value: "half_day", label: "Half Day", color: "orange", icon: AlertCircle },
  { value: "on_leave", label: "On Leave", color: "blue", icon: Calendar },
];

const VDO_LOGO_BASE64 =
  "data:image/png;base64,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";

// ==================== HELPER FUNCTIONS ====================

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateShort = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusColor = (status: string): string => {
  const option = STATUS_OPTIONS.find((o) => o.value === status);
  if (!option)
    return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";

  const colors: Record<string, string> = {
    green:
      "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
    red: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
    yellow:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
    orange:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
  };
  return colors[option.color];
};

const getStatusLabel = (status: string): string => {
  const option = STATUS_OPTIONS.find((o) => o.value === status);
  return option?.label || status;
};

// ==================== EXPORT FUNCTIONS ====================

const generateExcelContent = (
  records: MergedRecord[],
  date: string,
  stats: Stats
): string => {
  const headers = [
    "S.No",
    "Employee ID",
    "Employee Name",
    "Department",
    "Position",
    "Status",
    "Check In",
    "Check Out",
    "Notes",
  ];

  let csvContent = "";

  // Add title with date
  csvContent += `VDO - Attendance Report\n`;
  csvContent += `Date: ${formatDateShort(date)}\n`;
  csvContent += `Generated: ${new Date().toLocaleString()}\n\n`;

  // Add summary
  csvContent += `Summary\n`;
  csvContent += `Total Employees,${stats.total}\n`;
  csvContent += `Present,${stats.present}\n`;
  csvContent += `Absent,${stats.absent}\n`;
  csvContent += `Late,${stats.late}\n`;
  csvContent += `Half Day,${stats.halfDay}\n`;
  csvContent += `On Leave,${stats.onLeave}\n\n`;

  // Add headers
  csvContent += headers.join(",") + "\n";

  // Add data rows
  records.forEach((record, index) => {
    const row = [
      index + 1,
      record.employee.employeeId || "-",
      `${record.employee.firstName} ${record.employee.lastName}`,
      record.employee.department || "-",
      record.employee.position || "-",
      getStatusLabel(record.status) || "Not Marked",
      record.checkIn || "-",
      record.checkOut || "-",
      `"${record.notes || "-"}"`,
    ];
    csvContent += row.join(",") + "\n";
  });

  return csvContent;
};

const downloadExcel = (
  records: MergedRecord[],
  date: string,
  stats: Stats,
  fileName?: string
): void => {
  const csvContent = generateExcelContent(records, date, stats);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", fileName || `VDO_Attendance_${date}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const generatePDFContent = (
  records: MergedRecord[],
  date: string,
  stats: Stats,
  employeeName?: string
): string => {
  const isIndividual = !!employeeName;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>VDO Attendance Report - ${formatDateShort(date)}</title>
      <style>
        @page { size: A4; margin: 20mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #333; }
        .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; }
        .logo-section { display: flex; align-items: center; gap: 15px; }
        .logo { width: 60px; height: 60px; }
        .company-name { font-size: 28px; font-weight: bold; color: #2563eb; }
        .company-subtitle { font-size: 12px; color: #666; }
        .report-title { text-align: right; }
        .report-title h2 { font-size: 18px; color: #333; margin-bottom: 5px; }
        .report-title p { color: #666; font-size: 11px; }
        .summary-section { background: #f8fafc; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
        .summary-title { font-size: 14px; font-weight: bold; color: #333; margin-bottom: 10px; }
        .summary-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
        .summary-item { text-align: center; padding: 10px; background: white; border-radius: 6px; border: 1px solid #e2e8f0; }
        .summary-value { font-size: 20px; font-weight: bold; }
        .summary-label { font-size: 10px; color: #666; margin-top: 2px; }
        .present { color: #16a34a; }
        .absent { color: #dc2626; }
        .late { color: #ca8a04; }
        .half-day { color: #ea580c; }
        .on-leave { color: #2563eb; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background: #2563eb; color: white; padding: 10px 8px; text-align: left; font-size: 11px; font-weight: 600; }
        td { padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
        tr:hover { background: #f8fafc; }
        .status-badge { padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 500; }
        .status-present { background: #dcfce7; color: #166534; }
        .status-absent { background: #fee2e2; color: #991b1b; }
        .status-late { background: #fef3c7; color: #92400e; }
        .status-half_day { background: #ffedd5; color: #9a3412; }
        .status-on_leave { background: #dbeafe; color: #1e40af; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; text-align: center; color: #666; font-size: 10px; }
        .employee-info { background: #eff6ff; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
        .employee-name { font-size: 16px; font-weight: bold; color: #1e40af; }
        .employee-details { color: #666; margin-top: 5px; }
        @media print {
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-section">
          <img src="${VDO_LOGO_BASE64}" alt="VDO Logo" class="logo" />
          <div>
            <div class="company-name">VDO</div>
            <div class="company-subtitle">Village Development Organization</div>
          </div>
        </div>
        <div class="report-title">
          <h2>${
            isIndividual ? "Individual Attendance Report" : "Attendance Report"
          }</h2>
          <p>Date: ${formatDateShort(date)}</p>
          <p>Generated: ${new Date().toLocaleString()}</p>
        </div>
      </div>

      ${
        isIndividual && records.length > 0
          ? `
        <div class="employee-info">
          <div class="employee-name">${records[0].employee.firstName} ${
              records[0].employee.lastName
            }</div>
          <div class="employee-details">
            ID: ${records[0].employee.employeeId || "-"} |
            Department: ${records[0].employee.department || "-"} |
            Position: ${records[0].employee.position || "-"}
          </div>
        </div>
      `
          : `
        <div class="summary-section">
          <div class="summary-title">Attendance Summary</div>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-value">${stats.total}</div>
              <div class="summary-label">Total</div>
            </div>
            <div class="summary-item">
              <div class="summary-value present">${stats.present}</div>
              <div class="summary-label">Present</div>
            </div>
            <div class="summary-item">
              <div class="summary-value absent">${stats.absent}</div>
              <div class="summary-label">Absent</div>
            </div>
            <div class="summary-item">
              <div class="summary-value late">${stats.late}</div>
              <div class="summary-label">Late</div>
            </div>
            <div class="summary-item">
              <div class="summary-value half-day">${stats.halfDay}</div>
              <div class="summary-label">Half Day</div>
            </div>
            <div class="summary-item">
              <div class="summary-value on-leave">${stats.onLeave}</div>
              <div class="summary-label">On Leave</div>
            </div>
          </div>
        </div>
      `
      }

      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Department</th>
            <th>Status</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${records
            .map(
              (record, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${record.employee.employeeId || "-"}</td>
              <td>${record.employee.firstName} ${record.employee.lastName}</td>
              <td>${record.employee.department || "-"}</td>
              <td>
                <span class="status-badge status-${record.status || "absent"}">
                  ${getStatusLabel(record.status) || "Not Marked"}
                </span>
              </td>
              <td>${record.checkIn || "-"}</td>
              <td>${record.checkOut || "-"}</td>
              <td>${record.notes || "-"}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <div class="footer">
        <p>VDO - Village Development Organization | Attendance Management System</p>
        <p>This is a computer-generated document. No signature required.</p>
      </div>
    </body>
    </html>
  `;
};

const downloadPDF = (
  records: MergedRecord[],
  date: string,
  stats: Stats,
  employeeName?: string
): void => {
  const htmlContent = generatePDFContent(records, date, stats, employeeName);
  const printWindow = window.open("", "_blank");

  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};

// ==================== MAIN COMPONENT ====================

const Attendance: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<MergedRecord[]>(
    []
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
    onLeave: 0,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Set<number>>(
    new Set()
  );
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateMode, setGenerateMode] = useState<"individual" | "bulk">(
    "bulk"
  );
  const [dateRange, setDateRange] = useState<ExportDateRange>({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  // Update stats
  const updateStats = useCallback((records: MergedRecord[]) => {
    const newStats: Stats = {
      total: records.length,
      present: records.filter((r) => r.status === "present").length,
      absent: records.filter((r) => r.status === "absent").length,
      late: records.filter((r) => r.status === "late").length,
      halfDay: records.filter((r) => r.status === "half_day").length,
      onLeave: records.filter((r) => r.status === "on_leave").length,
    };
    setStats(newStats);
  }, []);

  // Load attendance
  const loadAttendance = useCallback(async () => {
    try {
      const records = await attendanceDB.getByDate(selectedDate);
      const attendanceMap: Record<number, AttendanceRecord> = {};
      records.forEach((record: AttendanceRecord) => {
        attendanceMap[record.employeeId] = record;
      });

      const mergedRecords: MergedRecord[] = employees.map((emp) => ({
        employee: emp,
        attendance: attendanceMap[emp.id] || null,
        status: attendanceMap[emp.id]?.status || "",
        checkIn: attendanceMap[emp.id]?.checkIn || "",
        checkOut: attendanceMap[emp.id]?.checkOut || "",
        notes: attendanceMap[emp.id]?.notes || "",
        selected: false,
      }));

      setAttendanceRecords(mergedRecords);
      updateStats(mergedRecords);
      setHasChanges(false);
    } catch (error) {
      console.error("Error loading attendance:", error);
    }
  }, [selectedDate, employees, updateStats]);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await seedAllDefaults();
      const [employeesData, departmentsData] = await Promise.all([
        employeeDB.getAll({ status: "active" }),
        departmentDB.getAll(),
      ]);

      setEmployees(employeesData as Employee[]);
      setDepartments(departmentsData as Department[]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (employees.length > 0) {
      loadAttendance();
    }
  }, [employees, loadAttendance]);

  // Handle status change
  const handleStatusChange = useCallback(
    (employeeId: number, status: string) => {
      setAttendanceRecords((prev) => {
        const updated = prev.map((record) => {
          if (record.employee.id === employeeId) {
            return { ...record, status };
          }
          return record;
        });
        updateStats(updated);
        return updated;
      });
      setHasChanges(true);
    },
    [updateStats]
  );

  // Handle time change
  const handleTimeChange = useCallback(
    (employeeId: number, field: "checkIn" | "checkOut", value: string) => {
      setAttendanceRecords((prev) => {
        return prev.map((record) => {
          if (record.employee.id === employeeId) {
            return { ...record, [field]: value };
          }
          return record;
        });
      });
      setHasChanges(true);
    },
    []
  );

  // Filter employees
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((record) => {
      const matchesSearch =
        !searchTerm ||
        `${record.employee.firstName} ${record.employee.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        record.employee.employeeId
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesDepartment =
        !selectedDepartment ||
        record.employee.department === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [attendanceRecords, searchTerm, selectedDepartment]);

  // Handle notes change
  const handleNotesChange = useCallback((employeeId: number, notes: string) => {
    setAttendanceRecords((prev) => {
      return prev.map((record) => {
        if (record.employee.id === employeeId) {
          return { ...record, notes };
        }
        return record;
      });
    });
    setHasChanges(true);
  }, []);

  // Save all attendance
  const handleSaveAll = useCallback(async () => {
    setSaving(true);
    try {
      for (const record of attendanceRecords) {
        if (record.status) {
          await attendanceDB.markAttendance(record.employee.id, selectedDate, {
            status: record.status,
            checkIn: record.checkIn,
            checkOut: record.checkOut,
            notes: record.notes,
          });
        }
      }
      setHasChanges(false);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  }, [attendanceRecords, selectedDate]);

  // Mark all with a specific status
  const handleMarkAll = useCallback(
    (status: string) => {
      setAttendanceRecords((prev) => {
        const updated = prev.map((record) => ({
          ...record,
          status: status,
        }));
        updateStats(updated);
        return updated;
      });
      setHasChanges(true);
    },
    [updateStats]
  );

  // Navigate dates
  const navigateDate = useCallback(
    (direction: number) => {
      const current = new Date(selectedDate);
      current.setDate(current.getDate() + direction);
      setSelectedDate(current.toISOString().split("T")[0]);
    },
    [selectedDate]
  );

  // Toggle employee selection
  const toggleEmployeeSelection = useCallback((employeeId: number) => {
    setSelectedEmployees((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  }, []);

  // Select all employees
  const selectAllEmployees = useCallback(() => {
    if (selectedEmployees.size === filteredRecords.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(filteredRecords.map((r) => r.employee.id)));
    }
  }, [filteredRecords, selectedEmployees.size]);

  // Export handlers
  const handleExportExcel = useCallback(
    (mode: "all" | "selected" | "individual") => {
      let recordsToExport = filteredRecords;
      let fileName = `VDO_Attendance_${selectedDate}.csv`;

      if (mode === "selected" && selectedEmployees.size > 0) {
        recordsToExport = filteredRecords.filter((r) =>
          selectedEmployees.has(r.employee.id)
        );
        fileName = `VDO_Attendance_Selected_${selectedDate}.csv`;
      } else if (mode === "individual" && selectedEmployees.size === 1) {
        recordsToExport = filteredRecords.filter((r) =>
          selectedEmployees.has(r.employee.id)
        );
        const emp = recordsToExport[0]?.employee;
        fileName = `VDO_Attendance_${emp?.firstName}_${emp?.lastName}_${selectedDate}.csv`;
      }

      downloadExcel(recordsToExport, selectedDate, stats, fileName);
      setShowExportMenu(false);
    },
    [filteredRecords, selectedDate, selectedEmployees, stats]
  );

  const handleExportPDF = useCallback(
    (mode: "all" | "selected" | "individual") => {
      let recordsToExport = filteredRecords;
      let employeeName: string | undefined;

      if (mode === "selected" && selectedEmployees.size > 0) {
        recordsToExport = filteredRecords.filter((r) =>
          selectedEmployees.has(r.employee.id)
        );
      } else if (mode === "individual" && selectedEmployees.size === 1) {
        recordsToExport = filteredRecords.filter((r) =>
          selectedEmployees.has(r.employee.id)
        );
        const emp = recordsToExport[0]?.employee;
        employeeName = `${emp?.firstName} ${emp?.lastName}`;
      }

      downloadPDF(recordsToExport, selectedDate, stats, employeeName);
      setShowExportMenu(false);
    },
    [filteredRecords, selectedDate, selectedEmployees, stats]
  );

  // Generate random attendance data
  const generateAttendanceData = useCallback(async () => {
    const statusValues = ["present", "absent", "late", "half_day", "on_leave"];
    const employeesToGenerate =
      generateMode === "individual"
        ? filteredRecords.filter((r) => selectedEmployees.has(r.employee.id))
        : filteredRecords;

    if (employeesToGenerate.length === 0) {
      alert("Please select at least one employee for individual generation");
      return;
    }

    setAttendanceRecords((prev) => {
      const updated = prev.map((record) => {
        const shouldGenerate =
          generateMode === "bulk" || selectedEmployees.has(record.employee.id);
        if (shouldGenerate) {
          const randomStatus =
            statusValues[Math.floor(Math.random() * statusValues.length)];
          const checkIn =
            randomStatus === "present" || randomStatus === "late"
              ? `0${8 + Math.floor(Math.random() * 2)}:${Math.floor(
                  Math.random() * 60
                )
                  .toString()
                  .padStart(2, "0")}`
              : "";
          const checkOut = checkIn
            ? `${17 + Math.floor(Math.random() * 2)}:${Math.floor(
                Math.random() * 60
              )
                .toString()
                .padStart(2, "0")}`
            : "";

          return {
            ...record,
            status: randomStatus,
            checkIn,
            checkOut,
            notes: "",
          };
        }
        return record;
      });
      updateStats(updated);
      return updated;
    });
    setHasChanges(true);
    setShowGenerateModal(false);
  }, [generateMode, filteredRecords, selectedEmployees, updateStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Attendance
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Mark and manage employee attendance
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {savedMessage && (
            <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
              <Check className="h-4 w-4" />
              Saved successfully
            </span>
          )}

          {/* Generate Data Button */}
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            Generate Data
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              Export
              <ChevronDown className="h-4 w-4" />
            </button>

            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-20">
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Excel Export (CSV)
                    </div>
                    <button
                      onClick={() => handleExportExcel("all")}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-green-600" />
                      Export All to Excel
                    </button>
                    {selectedEmployees.size > 0 && (
                      <button
                        onClick={() => handleExportExcel("selected")}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Users className="h-4 w-4 text-green-600" />
                        Export Selected ({selectedEmployees.size})
                      </button>
                    )}
                    {selectedEmployees.size === 1 && (
                      <button
                        onClick={() => handleExportExcel("individual")}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <User className="h-4 w-4 text-green-600" />
                        Export Individual
                      </button>
                    )}

                    <hr className="my-1 border-gray-200 dark:border-gray-700" />

                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      PDF Export (with VDO Logo)
                    </div>
                    <button
                      onClick={() => handleExportPDF("all")}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FileText className="h-4 w-4 text-red-600" />
                      Export All to PDF
                    </button>
                    {selectedEmployees.size > 0 && (
                      <button
                        onClick={() => handleExportPDF("selected")}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Users className="h-4 w-4 text-red-600" />
                        Export Selected ({selectedEmployees.size})
                      </button>
                    )}
                    {selectedEmployees.size === 1 && (
                      <button
                        onClick={() => handleExportPDF("individual")}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <User className="h-4 w-4 text-red-600" />
                        Export Individual PDF
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bulk Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowBulkMenu(!showBulkMenu)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <UserCheck className="h-5 w-5" />
              Bulk Actions
              <ChevronDown className="h-4 w-4" />
            </button>

            {showBulkMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowBulkMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-20">
                  <div className="py-1">
                    {STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          handleMarkAll(option.value);
                          setShowBulkMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <option.icon
                          className={`h-4 w-4 text-${option.color}-600`}
                        />
                        Mark All {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleSaveAll}
            disabled={!hasChanges || saving}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-white transition-colors ${
              hasChanges && !saving
                ? "bg-primary-500 hover:bg-primary-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <Save className="h-5 w-5" />
            {saving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      {/* Date Navigation & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Date Picker */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateDate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-lg font-semibold text-gray-900 dark:text-white border-none focus:outline-none"
              />
            </div>
            <button
              onClick={() => navigateDate(1)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            {formatDate(selectedDate)}
          </p>
        </div>

        {/* Stats */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {stats.present}
              </p>
              <p className="text-xs text-gray-500">Present</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              <p className="text-xs text-gray-500">Absent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
              <p className="text-xs text-gray-500">Late</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {stats.halfDay}
              </p>
              <p className="text-xs text-gray-500">Half Day</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {stats.onLeave}
              </p>
              <p className="text-xs text-gray-500">On Leave</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {/* Selection Info */}
      {selectedEmployees.size > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-blue-700 dark:text-blue-300">
            {selectedEmployees.size} employee(s) selected
          </span>
          <button
            onClick={() => setSelectedEmployees(new Set())}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Attendance Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedEmployees.size === filteredRecords.length &&
                      filteredRecords.length > 0
                    }
                    onChange={selectAllEmployees}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    {employees.length === 0
                      ? "No active employees found"
                      : "No employees match your search"}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr
                    key={record.employee.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      selectedEmployees.has(record.employee.id)
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.has(record.employee.id)}
                        onChange={() =>
                          toggleEmployeeSelection(record.employee.id)
                        }
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold">
                          {record.employee.firstName?.[0]}
                          {record.employee.lastName?.[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {record.employee.firstName}{" "}
                            {record.employee.lastName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {record.employee.employeeId}{" "}
                            {record.employee.department &&
                              `| ${record.employee.department}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={record.status}
                        onChange={(e) =>
                          handleStatusChange(record.employee.id, e.target.value)
                        }
                        className={`rounded-lg border-0 px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 ${getStatusColor(
                          record.status
                        )}`}
                      >
                        <option value="">Select...</option>
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="time"
                        value={record.checkIn}
                        onChange={(e) =>
                          handleTimeChange(
                            record.employee.id,
                            "checkIn",
                            e.target.value
                          )
                        }
                        className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="time"
                        value={record.checkOut}
                        onChange={(e) =>
                          handleTimeChange(
                            record.employee.id,
                            "checkOut",
                            e.target.value
                          )
                        }
                        className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={record.notes}
                        onChange={(e) =>
                          handleNotesChange(record.employee.id, e.target.value)
                        }
                        placeholder="Add notes..."
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {hasChanges && (
        <div className="fixed bottom-4 right-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            You have unsaved changes. Don&apos;t forget to save!
          </p>
        </div>
      )}

      {/* Generate Data Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Generate Attendance Data
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Generation Mode
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="generateMode"
                      value="bulk"
                      checked={generateMode === "bulk"}
                      onChange={() => setGenerateMode("bulk")}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Bulk (All Employees)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="generateMode"
                      value="individual"
                      checked={generateMode === "individual"}
                      onChange={() => setGenerateMode("individual")}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Individual (Selected)
                    </span>
                  </label>
                </div>
              </div>

              {generateMode === "individual" && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {selectedEmployees.size > 0
                      ? `${selectedEmployees.size} employee(s) selected for data generation`
                      : "Please select employees from the table first"}
                  </p>
                </div>
              )}

              <p className="text-sm text-gray-500 dark:text-gray-400">
                This will generate random attendance data (Present, Absent,
                Late, Half Day, On Leave) with random check-in/out times for the
                selected date.
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={generateAttendanceData}
                disabled={
                  generateMode === "individual" && selectedEmployees.size === 0
                }
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
