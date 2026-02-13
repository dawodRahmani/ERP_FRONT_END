import { useState } from 'react';
import {
  Search,
  ChevronLeft,
  Download,
  Printer,
  Filter,
  Calendar,
  Mail,
  Eye,
  FileText,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PayrollInfoBanner } from './components';

// ============================================================================
// TYPES
// ============================================================================

interface PayslipData {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  monthYear: string;
  basicSalary: number;
  workingDays: number;
  presentDays: number;
  salaryForMonth: number;
  allowances: {
    transportation: number;
    housing: number;
    food: number;
    other: number;
  };
  deductions: {
    tax: number;
    advances: number;
    loans: number;
    other: number;
  };
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  paymentDate: string;
  paymentMethod: string;
  bankAccount: string;
  status: 'generated' | 'sent' | 'viewed';
}

// ============================================================================
// PAYSLIP VIEW
// ============================================================================

const PayslipView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Sample payslip data
  const payslip: PayslipData = {
    id: id || '1',
    employeeId: 'EMP001',
    employeeName: 'Ahmad Khan',
    designation: 'Project Manager',
    department: 'Program',
    monthYear: 'January 2024',
    basicSalary: 45000,
    workingDays: 22,
    presentDays: 22,
    salaryForMonth: 45000,
    allowances: {
      transportation: 3000,
      housing: 5000,
      food: 2000,
      other: 0,
    },
    deductions: {
      tax: 2500,
      advances: 0,
      loans: 0,
      other: 0,
    },
    grossSalary: 55000,
    totalDeductions: 2500,
    netSalary: 52500,
    paymentDate: '2024-01-28',
    paymentMethod: 'Bank Transfer',
    bankAccount: '****4523',
    status: 'sent',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AF', {
      style: 'currency',
      currency: 'AFN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/payroll/payslips"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payslip</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {payslip.monthYear} - {payslip.employeeName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
            <Mail className="h-4 w-4" />
            Email
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
            <Download className="h-4 w-4" />
            Download
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>

      {/* Payslip Card */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 dark:bg-emerald-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">VDO Afghanistan</h2>
              <p className="text-emerald-100 text-sm mt-1">Village Development Organization</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">PAYSLIP</p>
              <p className="text-emerald-100 text-sm mt-1">{payslip.monthYear}</p>
            </div>
          </div>
        </div>

        {/* Employee Info */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Employee ID</p>
              <p className="font-medium text-gray-900 dark:text-white">{payslip.employeeId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Name</p>
              <p className="font-medium text-gray-900 dark:text-white">{payslip.employeeName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Designation</p>
              <p className="font-medium text-gray-900 dark:text-white">{payslip.designation}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Department</p>
              <p className="font-medium text-gray-900 dark:text-white">{payslip.department}</p>
            </div>
          </div>
        </div>

        {/* Salary Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                EARNINGS
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Basic Salary</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(payslip.basicSalary)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Working Days</span>
                  <span className="text-gray-900 dark:text-white">{payslip.presentDays}/{payslip.workingDays}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Salary for Month</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(payslip.salaryForMonth)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Transportation Allowance</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(payslip.allowances.transportation)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Housing Allowance</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(payslip.allowances.housing)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Food Allowance</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(payslip.allowances.food)}</span>
                </div>
                {payslip.allowances.other > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Other Allowances</span>
                    <span className="text-gray-900 dark:text-white">{formatCurrency(payslip.allowances.other)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Gross Salary</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(payslip.grossSalary)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                DEDUCTIONS
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Income Tax</span>
                  <span className="text-red-600 dark:text-red-400">-{formatCurrency(payslip.deductions.tax)}</span>
                </div>
                {payslip.deductions.advances > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Salary Advance</span>
                    <span className="text-red-600 dark:text-red-400">-{formatCurrency(payslip.deductions.advances)}</span>
                  </div>
                )}
                {payslip.deductions.loans > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Loan Deduction</span>
                    <span className="text-red-600 dark:text-red-400">-{formatCurrency(payslip.deductions.loans)}</span>
                  </div>
                )}
                {payslip.deductions.other > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Other Deductions</span>
                    <span className="text-red-600 dark:text-red-400">-{formatCurrency(payslip.deductions.other)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Total Deductions</span>
                  <span className="text-red-600 dark:text-red-400">-{formatCurrency(payslip.totalDeductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary */}
          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">Net Salary Payable</p>
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(payslip.netSalary)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Payment Method</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{payslip.paymentMethod}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Account: {payslip.bankAccount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <p>Generated on: {new Date().toLocaleDateString()}</p>
            <p>This is a computer-generated document. No signature required.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PAYSLIPS LIST
// ============================================================================

const PayslipsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2024-01');

  // Sample payslips data
  const payslips: PayslipData[] = [
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'Ahmad Khan',
      designation: 'Project Manager',
      department: 'Program',
      monthYear: 'January 2024',
      basicSalary: 45000,
      workingDays: 22,
      presentDays: 22,
      salaryForMonth: 45000,
      allowances: { transportation: 3000, housing: 5000, food: 2000, other: 0 },
      deductions: { tax: 2500, advances: 0, loans: 0, other: 0 },
      grossSalary: 55000,
      totalDeductions: 2500,
      netSalary: 52500,
      paymentDate: '2024-01-28',
      paymentMethod: 'Bank Transfer',
      bankAccount: '****4523',
      status: 'sent',
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Fatima Rahimi',
      designation: 'Finance Officer',
      department: 'Finance',
      monthYear: 'January 2024',
      basicSalary: 35000,
      workingDays: 22,
      presentDays: 20,
      salaryForMonth: 31818,
      allowances: { transportation: 2500, housing: 4000, food: 1500, other: 0 },
      deductions: { tax: 1800, advances: 5000, loans: 0, other: 0 },
      grossSalary: 39818,
      totalDeductions: 6800,
      netSalary: 33018,
      paymentDate: '2024-01-28',
      paymentMethod: 'Bank Transfer',
      bankAccount: '****7891',
      status: 'viewed',
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: 'Mohammad Ali',
      designation: 'Field Coordinator',
      department: 'Operations',
      monthYear: 'January 2024',
      basicSalary: 30000,
      workingDays: 22,
      presentDays: 22,
      salaryForMonth: 30000,
      allowances: { transportation: 2000, housing: 3000, food: 1500, other: 1000 },
      deductions: { tax: 1500, advances: 0, loans: 2000, other: 0 },
      grossSalary: 37500,
      totalDeductions: 3500,
      netSalary: 34000,
      paymentDate: '2024-01-28',
      paymentMethod: 'Bank Transfer',
      bankAccount: '****3456',
      status: 'generated',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AF', {
      style: 'currency',
      currency: 'AFN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      generated: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      viewed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };
    return styles[status] || styles.generated;
  };

  const filteredPayslips = payslips.filter(p =>
    p.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payslips</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">View and manage employee payslips</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
            <Mail className="h-4 w-4" />
            Send All
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">
            <Download className="h-4 w-4" />
            Export All
          </button>
        </div>
      </div>

      <PayrollInfoBanner
        title="Payslip Management"
        description="View, download, print, and email payslips to employees. Filter by month to see historical records."
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
          <Filter className="h-4 w-4" />
          More Filters
        </button>
      </div>

      {/* Payslips Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Gross</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Deductions</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net Salary</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPayslips.map((payslip) => (
              <tr key={payslip.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{payslip.employeeName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{payslip.employeeId} • {payslip.designation}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{payslip.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                  {formatCurrency(payslip.grossSalary)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 dark:text-red-400">
                  -{formatCurrency(payslip.totalDeductions)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(payslip.netSalary)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(payslip.status)}`}>
                    {payslip.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/hr/payroll/payslips/${payslip.id}`)}
                      className="p-1.5 text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" title="Download">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400" title="Email">
                      <Mail className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" title="Print">
                      <Printer className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Payslips</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredPayslips.length}</p>
        </div>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <p className="text-sm text-emerald-600 dark:text-emerald-400">Total Net Salary</p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {formatCurrency(filteredPayslips.reduce((sum, p) => sum + p.netSalary, 0))}
          </p>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-600 dark:text-blue-400">Sent</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {filteredPayslips.filter(p => p.status === 'sent').length}
          </p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">Viewed</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {filteredPayslips.filter(p => p.status === 'viewed').length}
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN EXPORT
// ============================================================================

const Payslips = () => {
  const { id } = useParams();
  if (id) return <PayslipView />;
  return <PayslipsList />;
};

export default Payslips;
