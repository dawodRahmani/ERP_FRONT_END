import {
  AlertCircle,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  File,
  FileSpreadsheet,
  FileText,
  Plus,
  RefreshCw,
  Search,
  X,
  XCircle,
} from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type JSX,
} from "react";
import {
  employeeDB,
  leaveRequestDB,
  leaveTypeDB,
  seedAllDefaults,
} from "../../services/db/indexedDB";

// ==================== INTERFACES ====================

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  employeeId?: string;
  department?: string;
  position?: string;
  email?: string;
}

interface LeaveType {
  id: number;
  name: string;
  color: string;
  daysAllowed: number;
  status: "active" | "inactive";
  description?: string;
}

interface LeaveRequest {
  id: number;
  requestId: string;
  employeeId: number;
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  contactDuringLeave?: string;
  handoverTo?: string | number;
  status: "pending" | "approved" | "rejected" | "cancelled";
  createdAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  approverComments?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

interface Statistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
}

interface Filters {
  search: string;
  status: string;
  leaveTypeId: string;
  employeeId: string;
}

interface FormData {
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  contactDuringLeave: string;
  handoverTo: string;
}

interface Toast {
  show: boolean;
  message: string;
  type: "success" | "error";
}

// ==================== VDO LOGO BASE64 ====================

const VDO_LOGO_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDg4LCAyMDIwLzA3LzEwLTIyOjA2OjUzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTAxLTE1VDEwOjMwOjAwKzA1OjMwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTAxLTE1VDEwOjMwOjAwKzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wMS0xNVQxMDozMDowMCswNTozMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4YTk5YTk5YS05OTk5LTQ5OTktOTk5OS05OTk5OTk5OTk5OTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OGE5OWE5OWEtOTk5OS00OTk5LTk5OTktOTk5OTk5OTk5OTk5IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6OGE5OWE5OWEtOTk5OS00OTk5LTk5OTktOTk5OTk5OTk5OTk5IiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OGE5OWE5OWEtOTk5OS00OTk5LTk5OTktOTk5OTk5OTk5OTk5IiBzdEV2dDp3aGVuPSIyMDI0LTAxLTE1VDEwOjMwOjAwKzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoV2luZG93cykiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VkPqNgAABRdJREFVeJzt3c9rU1kYxvHnJkkT09SmVlur1p+o6FjUKrgQBBdSFy5EEAQXLmah4MKFa/8BFy5cuHDhwoULwYULF4ILQRCKoBZEi1hbrVbb2mbSJjfJuYubdKZ07nszc+85c3h/m0Jy3/ue5yS598wJBEFgAADp6tGLqHd8n7oEAKMR3oQkEj8BXPAQAYwJBEFg7h3fZ0YOW7S3P/K9DMA7Q0Fg7h3bB4hgmIaLxGBMAkMzCoxJZFiIYIyGi0Qw5sJTBIwBiSRgbA6NYCyOiWAsjolgrA6NYIwCYywOjWBMjoVgjAqN4MwCY3JoBGMvHBnBWJ0awVgdEsHYHRLBWBwSwdgbCsHYGwrB2BoKwdgaCsHYGgrBWBsKwdgaCsHYGQrB2BkKwdgYCsHYGArBWBoKwdgYCsGYGwrB2BgKwZgbCsFYGwrBGBsKwRgbCsEYGwrBGBsKwVgaCsHYGgrBWBsKwRgbCsEYGwrBGBkKwRgZCsHYGArB2BkKwdgYCsEYHArBGBsKwRgbCsEYGwrBWBoKwdgaCsHYGgrBWBsKwRgaCsHYGArBmBsKwdgaCsGYGwrB2BsKwVgbCsEYGwrBGBkKwRgZCsHYGArB2BkKwdgYCsEYHArBGBsKwRgbCsEYGwrBWBoKwdgaCsHYGgrBWBsKwRgaCsHYGArBmBsKwdgaCsGYGwrB2BsKwVgbCsEYGwrBGBkKwRgZCsHYGArB2BkKwdgYCsEYHArBGBsKwRgbCsEYGwrBWBoKwdgaCsHYGgrBWBsKwRgaCsHYGArBmBsKwdgaCsGYGwrB2BsKwVgbCsEYGwrBGBkKwRgZCsHYGArB2BkKwdgYCsEYHArBGBsKwRgbCsEYGwrBWBoKwdgaCsHYGgrBWBsKwRgaCsHYGArBmBsKwdgaCsGYGwrB2BsKwVgbCsEYGwrBGBkKwRgZCsHYGArB2BkKwdgYCsEYHArBGBsKwRgbCsEYGwrBWBoKwdgaCsHYGgrBWBsKwVh7P/QOAPwqCAKja4v/AHAbwMsgiP5JREQkIZH4bxBE5wBJABCZP/wkIn8TkTdBEBvGRxKRv4jIDSISj48RkZCIXAcQnYEgCGQQBOY/RPR2EESnAJwDMBAE0XUA1wFMAjgBAE8HQXSSiFwhIncARBuIyD8AxInoVQA9RHTkA4D/OwRBYB4F0TEicoOIvB0EsYUvA/j/4CmA60QkSkT+KiIJInoNwPlBEJuISJSIRIjI3wBEZyAIjPEgCAzDIDAMAsMwCAzDIDAMgwBYJCJPx78BwPMgMDaIyCARaR8E0WUAmwB+TET+RUQCALaDIDoCIC8I4r8BSAR4EwTGJhGJA4gCuEREnoLIBPAWEbmaiBwKgtgmgK+JyPNBEBsk8nAQxCaJ/A/ANoDVIIj/BvAUQCKA3wFIAvieiBwCsA2gL4iOAPgeQBTAtSCITRJ5AEAkCGLJIIj+HkA0COK/A/g7gH4iugTgWBDYhgD0A4gEQfzvAPqC6ACRhwCkgyDWDWAQwAYAMwCOBVEdwFMAxojIOwDiQRA7AWARwAQRaQ0C2x8A9gHMAxgPguhxAIMApoMgegDABoBlAJMAxoMgegTAOoDZIIieALAEYCYIoocALAKYDoLoHIBlADNBED0BYAnAdBBEzwDYE0T3ApgOME1EwhMAfg4C4xEAAJkgiP4YQLqNAOQCkGsD8FMRiT4C8HIQRHfZ7wFIBUF0BUCfMDCCIMYCwDIR6SJiawCqAoA3AawFgXEUwEwQRM8BOGAvAPMAxolIDMDpIIgdBrBN5HsAMkEQOwtgnYhkACQGQXQNwDYRCQIYJGK9RGQP4hgEsT0AThCRGIDpIIgeBfB/fNJMx3+iGE0AAAAASUVORK5CYII=";

// ==================== EXPORT FUNCTIONS ====================

const generateExcelContent = (
  requests: LeaveRequest[],
  employees: Employee[],
  leaveTypes: LeaveType[],
  statistics: Statistics,
  getEmployeeName: (id: number) => string,
  getLeaveTypeName: (id: number) => string
): string => {
  const rows: string[] = [];

  // Header with VDO branding
  rows.push("VDO ERP - Leave Management Report");
  rows.push(
    `Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`
  );
  rows.push("");

  // Summary statistics
  rows.push("=== SUMMARY STATISTICS ===");
  rows.push(`Total Requests,${statistics.total}`);
  rows.push(`Pending,${statistics.pending}`);
  rows.push(`Approved,${statistics.approved}`);
  rows.push(`Rejected,${statistics.rejected}`);
  rows.push(`Cancelled,${statistics.cancelled}`);
  rows.push("");

  // Column headers
  rows.push("=== LEAVE REQUESTS ===");
  rows.push(
    "Request ID,Employee,Leave Type,Start Date,End Date,Total Days,Status,Reason,Contact During Leave,Handover To,Approved By,Rejected By,Rejection Reason"
  );

  // Data rows
  requests.forEach((request) => {
    const employee = getEmployeeName(request.employeeId);
    const leaveType = getLeaveTypeName(request.leaveTypeId);
    const handoverEmployee = request.handoverTo
      ? getEmployeeName(Number(request.handoverTo))
      : "";

    const row = [
      request.requestId,
      `"${employee}"`,
      `"${leaveType}"`,
      new Date(request.startDate).toLocaleDateString(),
      new Date(request.endDate).toLocaleDateString(),
      request.totalDays,
      request.status.charAt(0).toUpperCase() + request.status.slice(1),
      `"${(request.reason || "").replace(/"/g, '""')}"`,
      `"${(request.contactDuringLeave || "").replace(/"/g, '""')}"`,
      `"${handoverEmployee}"`,
      `"${request.approvedBy || ""}"`,
      `"${request.rejectedBy || ""}"`,
      `"${(request.rejectionReason || "").replace(/"/g, '""')}"`,
    ].join(",");

    rows.push(row);
  });

  return rows.join("\n");
};

const downloadExcel = (
  requests: LeaveRequest[],
  employees: Employee[],
  leaveTypes: LeaveType[],
  statistics: Statistics,
  getEmployeeName: (id: number) => string,
  getLeaveTypeName: (id: number) => string,
  fileName?: string
): void => {
  const csvContent = generateExcelContent(
    requests,
    employees,
    leaveTypes,
    statistics,
    getEmployeeName,
    getLeaveTypeName
  );
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    fileName || `leave_requests_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const generatePDFContent = (
  requests: LeaveRequest[],
  employees: Employee[],
  leaveTypes: LeaveType[],
  statistics: Statistics,
  getEmployeeName: (id: number) => string,
  getLeaveTypeName: (id: number) => string,
  title?: string
): string => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "approved":
        return "#10B981";
      case "rejected":
        return "#EF4444";
      case "pending":
        return "#F59E0B";
      case "cancelled":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const getStatusBg = (status: string): string => {
    switch (status) {
      case "approved":
        return "#D1FAE5";
      case "rejected":
        return "#FEE2E2";
      case "pending":
        return "#FEF3C7";
      case "cancelled":
        return "#F3F4F6";
      default:
        return "#F3F4F6";
    }
  };

  const tableRows = requests
    .map(
      (request) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 500;">${
        request.requestId
      }</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${getEmployeeName(
        request.employeeId
      )}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${getLeaveTypeName(
        request.leaveTypeId
      )}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${new Date(
        request.startDate
      ).toLocaleDateString()}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${new Date(
        request.endDate
      ).toLocaleDateString()}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${
        request.totalDays
      }</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <span style="padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; background-color: ${getStatusBg(
          request.status
        )}; color: ${getStatusColor(request.status)};">
          ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${
        request.reason || "-"
      }</td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title || "Leave Management Report"}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f9fafb;
          color: #1f2937;
          line-height: 1.5;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 30px 40px;
          border-radius: 12px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .logo {
          width: 80px;
          height: 80px;
          background-color: white;
          border-radius: 12px;
          padding: 10px;
        }
        .logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .company-info h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .company-info p {
          font-size: 14px;
          opacity: 0.9;
        }
        .report-info {
          text-align: right;
        }
        .report-info h2 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .report-info p {
          font-size: 13px;
          opacity: 0.9;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          text-align: center;
        }
        .stat-card.total { border-left: 4px solid #3B82F6; }
        .stat-card.pending { border-left: 4px solid #F59E0B; }
        .stat-card.approved { border-left: 4px solid #10B981; }
        .stat-card.rejected { border-left: 4px solid #EF4444; }
        .stat-card.cancelled { border-left: 4px solid #6B7280; }
        .stat-value {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .stat-card.total .stat-value { color: #3B82F6; }
        .stat-card.pending .stat-value { color: #F59E0B; }
        .stat-card.approved .stat-value { color: #10B981; }
        .stat-card.rejected .stat-value { color: #EF4444; }
        .stat-card.cancelled .stat-value { color: #6B7280; }
        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }
        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .table-header {
          background: #f8fafc;
          padding: 16px 24px;
          border-bottom: 1px solid #e5e7eb;
        }
        .table-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          background-color: #f8fafc;
          padding: 14px 12px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: #6b7280;
          border-bottom: 2px solid #e5e7eb;
        }
        td {
          font-size: 14px;
          color: #374151;
        }
        tr:hover {
          background-color: #f9fafb;
        }
        .footer {
          margin-top: 30px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          text-align: center;
        }
        .footer p {
          font-size: 12px;
          color: #9ca3af;
        }
        .footer .company-name {
          font-weight: 600;
          color: #1e40af;
        }
        @media print {
          body {
            background-color: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .container {
            padding: 0;
          }
          .header {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .stat-card {
            break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo-section">
            <div class="logo">
              <img src="${VDO_LOGO_BASE64}" alt="VDO Logo" />
            </div>
            <div class="company-info">
              <h1>VDO ERP</h1>
              <p>Enterprise Resource Planning System</p>
            </div>
          </div>
          <div class="report-info">
            <h2>${title || "Leave Management Report"}</h2>
            <p>Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card total">
            <div class="stat-value">${statistics.total}</div>
            <div class="stat-label">Total Requests</div>
          </div>
          <div class="stat-card pending">
            <div class="stat-value">${statistics.pending}</div>
            <div class="stat-label">Pending</div>
          </div>
          <div class="stat-card approved">
            <div class="stat-value">${statistics.approved}</div>
            <div class="stat-label">Approved</div>
          </div>
          <div class="stat-card rejected">
            <div class="stat-value">${statistics.rejected}</div>
            <div class="stat-label">Rejected</div>
          </div>
          <div class="stat-card cancelled">
            <div class="stat-value">${statistics.cancelled}</div>
            <div class="stat-label">Cancelled</div>
          </div>
        </div>

        <div class="table-container">
          <div class="table-header">
            <h3>Leave Requests (${requests.length} records)</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>This report was generated by <span class="company-name">VDO ERP System</span></p>
          <p>© ${new Date().getFullYear()} VDO. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const downloadPDF = (
  requests: LeaveRequest[],
  employees: Employee[],
  leaveTypes: LeaveType[],
  statistics: Statistics,
  getEmployeeName: (id: number) => string,
  getLeaveTypeName: (id: number) => string,
  title?: string
): void => {
  const htmlContent = generatePDFContent(
    requests,
    employees,
    leaveTypes,
    statistics,
    getEmployeeName,
    getLeaveTypeName,
    title
  );
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};

// ==================== MAIN COMPONENT ====================

const LeaveManagement: React.FC = () => {
  // State
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statistics, setStatistics] = useState<Statistics>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  });

  // Filters
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "",
    leaveTypeId: "",
    employeeId: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  // Modals
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null
  );

  // Export dropdown
  const [showExportDropdown, setShowExportDropdown] = useState<boolean>(false);

  // Selection for export
  const [selectedRequests, setSelectedRequests] = useState<Set<number>>(
    new Set()
  );

  // Form state
  const [formData, setFormData] = useState<FormData>({
    employeeId: "",
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
    contactDuringLeave: "",
    handoverTo: "",
  });

  // Approval/Rejection state
  const [approverComments, setApproverComments] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState<string>("");

  // Toast
  const [toast, setToast] = useState<Toast>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success"): void => {
      setToast({ show: true, message, type });
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
    },
    []
  );
  const loadData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      await seedAllDefaults();

      const [requestsData, employeesData, leaveTypesData, stats] =
        await Promise.all([
          leaveRequestDB.getAll(),
          employeeDB.getAll(),
          leaveTypeDB.getAll(),
          leaveRequestDB.getStatistics(),
        ]);

      setRequests(requestsData as LeaveRequest[]);
      setEmployees(employeesData as Employee[]);
      setLeaveTypes(leaveTypesData as LeaveType[]);
      setStatistics(stats as Statistics);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Load data
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".export-dropdown-container")) {
        setShowExportDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get employee name by ID
  const getEmployeeName = useCallback(
    (employeeId: number): string => {
      const employee = employees.find((e) => e.id === employeeId);
      return employee
        ? `${employee.firstName} ${employee.lastName}`
        : "Unknown";
    },
    [employees]
  );

  // Get leave type name by ID
  const getLeaveTypeName = useCallback(
    (leaveTypeId: number): string => {
      const leaveType = leaveTypes.find((lt) => lt.id === leaveTypeId);
      return leaveType ? leaveType.name : "Unknown";
    },
    [leaveTypes]
  );

  // Get leave type color by ID
  const getLeaveTypeColor = useCallback(
    (leaveTypeId: number): string => {
      const leaveType = leaveTypes.find((lt) => lt.id === leaveTypeId);
      return leaveType?.color || "gray";
    },
    [leaveTypes]
  );

  // Calculate total days
  const calculateTotalDays = useCallback(
    (startDate: string, endDate: string): number => {
      if (!startDate || !endDate) return 0;
      return leaveRequestDB.calculateDays(startDate, endDate);
    },
    []
  );

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      if (
        filters.search &&
        !request.requestId?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.status && request.status !== filters.status) {
        return false;
      }
      if (
        filters.leaveTypeId &&
        request.leaveTypeId !== Number(filters.leaveTypeId)
      ) {
        return false;
      }
      if (
        filters.employeeId &&
        request.employeeId !== Number(filters.employeeId)
      ) {
        return false;
      }
      return true;
    });
  }, [requests, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = useMemo(() => {
    return filteredRequests.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredRequests, currentPage, itemsPerPage]);

  // Handle form change
  const handleFormChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ): void => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Submit leave request
  const handleSubmitRequest = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (
      !formData.employeeId ||
      !formData.leaveTypeId ||
      !formData.startDate ||
      !formData.endDate
    ) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      showToast("End date must be after start date", "error");
      return;
    }

    try {
      const totalDays = calculateTotalDays(
        formData.startDate,
        formData.endDate
      );

      await leaveRequestDB.create({
        ...formData,
        employeeId: Number(formData.employeeId),
        leaveTypeId: Number(formData.leaveTypeId),
        totalDays,
      });

      showToast("Leave request submitted successfully");
      setShowRequestModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Error submitting request:", error);
      showToast("Failed to submit request", "error");
    }
  };

  // Approve request
  const handleApprove = async (): Promise<void> => {
    if (!selectedRequest) return;

    try {
      await leaveRequestDB.approve(selectedRequest.id, {
        approvedBy: "HR Admin",
        comments: approverComments,
      });

      showToast("Request approved successfully");
      setShowApproveModal(false);
      setApproverComments("");
      setSelectedRequest(null);
      loadData();
    } catch (error) {
      console.error("Error approving request:", error);
      showToast("Failed to approve request", "error");
    }
  };

  // Reject request
  const handleReject = async (): Promise<void> => {
    if (!selectedRequest || !rejectionReason) {
      showToast("Please provide a reason for rejection", "error");
      return;
    }

    try {
      await leaveRequestDB.reject(selectedRequest.id, {
        rejectedBy: "HR Admin",
        reason: rejectionReason,
      });

      showToast("Request rejected");
      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedRequest(null);
      loadData();
    } catch (error) {
      console.error("Error rejecting request:", error);
      showToast("Failed to reject request", "error");
    }
  };

  // Cancel request
  const handleCancel = async (request: LeaveRequest): Promise<void> => {
    if (request.status !== "pending") {
      showToast("Only pending requests can be cancelled", "error");
      return;
    }

    try {
      await leaveRequestDB.cancel(request.id);
      showToast("Request cancelled");
      loadData();
    } catch (error) {
      console.error("Error cancelling request:", error);
      showToast("Failed to cancel request", "error");
    }
  };

  // Reset form
  const resetForm = useCallback((): void => {
    setFormData({
      employeeId: "",
      leaveTypeId: "",
      startDate: "",
      endDate: "",
      reason: "",
      contactDuringLeave: "",
      handoverTo: "",
    });
  }, []);

  // Toggle request selection
  const toggleRequestSelection = useCallback((requestId: number): void => {
    setSelectedRequests((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(requestId)) {
        newSet.delete(requestId);
      } else {
        newSet.add(requestId);
      }
      return newSet;
    });
  }, []);

  // Toggle all selections
  const toggleAllSelections = useCallback((): void => {
    if (selectedRequests.size === filteredRequests.length) {
      setSelectedRequests(new Set());
    } else {
      setSelectedRequests(new Set(filteredRequests.map((r) => r.id)));
    }
  }, [filteredRequests, selectedRequests.size]);

  // Export handlers
  const handleExportExcelAll = useCallback((): void => {
    downloadExcel(
      filteredRequests,
      employees,
      leaveTypes,
      statistics,
      getEmployeeName,
      getLeaveTypeName,
      "leave_requests_all.csv"
    );
    setShowExportDropdown(false);
    showToast("Excel file downloaded successfully");
  }, [
    filteredRequests,
    employees,
    leaveTypes,
    statistics,
    getEmployeeName,
    getLeaveTypeName,
    showToast,
  ]);

  const handleExportExcelSelected = useCallback((): void => {
    if (selectedRequests.size === 0) {
      showToast("Please select at least one request", "error");
      return;
    }
    const selectedData = filteredRequests.filter((r) =>
      selectedRequests.has(r.id)
    );
    const selectedStats: Statistics = {
      total: selectedData.length,
      pending: selectedData.filter((r) => r.status === "pending").length,
      approved: selectedData.filter((r) => r.status === "approved").length,
      rejected: selectedData.filter((r) => r.status === "rejected").length,
      cancelled: selectedData.filter((r) => r.status === "cancelled").length,
    };
    downloadExcel(
      selectedData,
      employees,
      leaveTypes,
      selectedStats,
      getEmployeeName,
      getLeaveTypeName,
      "leave_requests_selected.csv"
    );
    setShowExportDropdown(false);
    showToast("Excel file downloaded successfully");
  }, [
    filteredRequests,
    selectedRequests,
    employees,
    leaveTypes,
    getEmployeeName,
    getLeaveTypeName,
    showToast,
  ]);

  const handleExportPDFAll = useCallback((): void => {
    downloadPDF(
      filteredRequests,
      employees,
      leaveTypes,
      statistics,
      getEmployeeName,
      getLeaveTypeName,
      "Leave Management Report - All Requests"
    );
    setShowExportDropdown(false);
    showToast("PDF generated successfully");
  }, [
    filteredRequests,
    employees,
    leaveTypes,
    statistics,
    getEmployeeName,
    getLeaveTypeName,
    showToast,
  ]);

  const handleExportPDFSelected = useCallback((): void => {
    if (selectedRequests.size === 0) {
      showToast("Please select at least one request", "error");
      return;
    }
    const selectedData = filteredRequests.filter((r) =>
      selectedRequests.has(r.id)
    );
    const selectedStats: Statistics = {
      total: selectedData.length,
      pending: selectedData.filter((r) => r.status === "pending").length,
      approved: selectedData.filter((r) => r.status === "approved").length,
      rejected: selectedData.filter((r) => r.status === "rejected").length,
      cancelled: selectedData.filter((r) => r.status === "cancelled").length,
    };
    downloadPDF(
      selectedData,
      employees,
      leaveTypes,
      selectedStats,
      getEmployeeName,
      getLeaveTypeName,
      "Leave Management Report - Selected Requests"
    );
    setShowExportDropdown(false);
    showToast("PDF generated successfully");
  }, [
    filteredRequests,
    selectedRequests,
    employees,
    leaveTypes,
    getEmployeeName,
    getLeaveTypeName,
    showToast,
  ]);

  // Get status badge
  const getStatusBadge = useCallback((status: string): JSX.Element => {
    const badges: Record<
      string,
      { color: string; icon: React.FC<{ className?: string }> }
    > = {
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        icon: Clock,
      },
      approved: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        icon: CheckCircle,
      },
      rejected: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        icon: XCircle,
      },
      cancelled: {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400",
        icon: AlertCircle,
      },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.color}`}
      >
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Leave Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage employee leave requests and approvals
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Export Dropdown */}
          <div className="relative export-dropdown-container">
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export
              <ChevronDown className="w-4 h-4" />
            </button>
            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-2">
                  <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Excel Export
                  </p>
                  <button
                    onClick={handleExportExcelAll}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    Export All to Excel
                  </button>
                  <button
                    onClick={handleExportExcelSelected}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    Export Selected ({selectedRequests.size})
                  </button>
                  <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
                  <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    PDF Export
                  </p>
                  <button
                    onClick={handleExportPDFAll}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <File className="w-4 h-4 text-red-600" />
                    Export All to PDF
                  </button>
                  <button
                    onClick={handleExportPDFSelected}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <File className="w-4 h-4 text-red-600" />
                    Export Selected ({selectedRequests.size})
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowRequestModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Request
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {statistics.total}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pending
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {statistics.pending}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Approved
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {statistics.approved}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Rejected
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {statistics.rejected}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cancelled
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {statistics.cancelled}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filters.leaveTypeId}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, leaveTypeId: e.target.value }))
            }
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Leave Types</option>
            {leaveTypes.map((lt) => (
              <option key={lt.id} value={lt.id}>
                {lt.name}
              </option>
            ))}
          </select>
          <select
            value={filters.employeeId}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, employeeId: e.target.value }))
            }
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Employees</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
          {(filters.search ||
            filters.status ||
            filters.leaveTypeId ||
            filters.employeeId) && (
            <button
              onClick={() =>
                setFilters({
                  search: "",
                  status: "",
                  leaveTypeId: "",
                  employeeId: "",
                })
              }
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedRequests.size === filteredRequests.length &&
                      filteredRequests.length > 0
                    }
                    onChange={toggleAllSelections}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Leave Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    No leave requests found
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRequests.has(request.id)}
                        onChange={() => toggleRequestSelection(request.id)}
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {request.requestId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 dark:text-white">
                        {getEmployeeName(request.employeeId)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getLeaveTypeColor(
                          request.leaveTypeId
                        )}-100 text-${getLeaveTypeColor(
                          request.leaveTypeId
                        )}-800 dark:bg-${getLeaveTypeColor(
                          request.leaveTypeId
                        )}-900/30 dark:text-${getLeaveTypeColor(
                          request.leaveTypeId
                        )}-400`}
                      >
                        {getLeaveTypeName(request.leaveTypeId)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900 dark:text-white">
                          {new Date(request.startDate).toLocaleDateString()} -{" "}
                          {new Date(request.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {request.totalDays} day
                          {request.totalDays !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowViewModal(true);
                          }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        {request.status === "pending" && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowApproveModal(true);
                              }}
                              className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowRejectModal(true);
                              }}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4 text-red-500 dark:text-red-400" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of{" "}
              {filteredRequests.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <option key={page} value={page}>
                      Page {page}
                    </option>
                  )
                )}
              </select>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                New Leave Request
              </h2>
            </div>
            <form onSubmit={handleSubmitRequest} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Employee *
                  </label>
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Leave Type *
                  </label>
                  <select
                    name="leaveTypeId"
                    value={formData.leaveTypeId}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Leave Type</option>
                    {leaveTypes
                      .filter((lt) => lt.status === "active")
                      .map((lt) => (
                        <option key={lt.id} value={lt.id}>
                          {lt.name} ({lt.daysAllowed} days)
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {formData.startDate && formData.endDate && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Total Days:{" "}
                    <strong>
                      {calculateTotalDays(formData.startDate, formData.endDate)}
                    </strong>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason for Leave *
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleFormChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Please provide a reason for your leave request..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact During Leave
                  </label>
                  <input
                    type="text"
                    name="contactDuringLeave"
                    value={formData.contactDuringLeave}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Phone or email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Handover To
                  </label>
                  <select
                    name="handoverTo"
                    value={formData.handoverTo}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Employee</option>
                    {employees
                      .filter((emp) => emp.id !== Number(formData.employeeId))
                      .map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowRequestModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Request Modal */}
      {showViewModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Leave Request Details
              </h2>
              {getStatusBadge(selectedRequest.status)}
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Request ID
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedRequest.requestId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Employee
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {getEmployeeName(selectedRequest.employeeId)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Leave Type
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {getLeaveTypeName(selectedRequest.leaveTypeId)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Days
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedRequest.totalDays} day
                    {selectedRequest.totalDays !== 1 ? "s" : ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Start Date
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedRequest.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    End Date
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedRequest.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Reason
                </p>
                <p className="font-medium text-gray-900 dark:text-white mt-1">
                  {selectedRequest.reason || "N/A"}
                </p>
              </div>

              {selectedRequest.contactDuringLeave && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Contact During Leave
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedRequest.contactDuringLeave}
                  </p>
                </div>
              )}

              {selectedRequest.handoverTo && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Handover To
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {getEmployeeName(Number(selectedRequest.handoverTo))}
                  </p>
                </div>
              )}

              {selectedRequest.status === "approved" && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    Approved
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    By: {selectedRequest.approvedBy}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Date:{" "}
                    {selectedRequest.approvedAt
                      ? new Date(selectedRequest.approvedAt).toLocaleString()
                      : "N/A"}
                  </p>
                  {selectedRequest.approverComments && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Comments: {selectedRequest.approverComments}
                    </p>
                  )}
                </div>
              )}

              {selectedRequest.status === "rejected" && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">
                    Rejected
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    By: {selectedRequest.rejectedBy}
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Date:{" "}
                    {selectedRequest.rejectedAt
                      ? new Date(selectedRequest.rejectedAt).toLocaleString()
                      : "N/A"}
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    Reason: {selectedRequest.rejectionReason}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Close
                </button>
                {selectedRequest.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        setShowApproveModal(true);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        setShowRejectModal(true);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md m-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Approve Request
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Request ID: {selectedRequest.requestId}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Comments (Optional)
                </label>
                <textarea
                  value={approverComments}
                  onChange={(e) => setApproverComments(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Add any comments..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowApproveModal(false);
                    setApproverComments("");
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md m-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Reject Request
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Request ID: {selectedRequest.requestId}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason for Rejection *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Please provide a reason..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
