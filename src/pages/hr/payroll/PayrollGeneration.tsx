import { useState } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  Save,
  Send,
  Download,
  Printer,
  Filter,
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PayrollInfoBanner } from './components';

// ============================================================================
// TYPES
// ============================================================================

interface PayrollEmployee {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  basicSalary: number;
  workingDays: number;
  presentDays: number;
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
  salaryForMonth: number;
  netSalary: number;
  status: 'pending' | 'calculated' | 'approved' | 'paid';
}

interface PayrollData {
  // Header
  payrollId: string;
  monthYear: string;
  solarMonthYear: string;
  generatedDate: string;
  project: string;
  donor: string;

  // Summary
  totalEmployees: number;
  totalBasicSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  totalNetSalary: number;

  // Employees
  employees: PayrollEmployee[];

  // Approval
  preparedBy: string;
  preparedByPosition: string;
  preparedDate: string;
  reviewedBy: string;
  reviewedByPosition: string;
  reviewedDate: string;
  approvedBy: string;
  approvedByPosition: string;
  approvedDate: string;

  // Status
  status: 'draft' | 'pending_review' | 'pending_approval' | 'approved' | 'paid';
}

// ============================================================================
// PAYROLL GENERATION FORM
// ============================================================================

const PayrollGenerationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<PayrollData>({
    payrollId: `PAY-${Date.now()}`,
    monthYear: new Date().toISOString().slice(0, 7),
    solarMonthYear: '',
    generatedDate: new Date().toISOString().slice(0, 10),
    project: '',
    donor: '',
    totalEmployees: 0,
    totalBasicSalary: 0,
    totalAllowances: 0,
    totalDeductions: 0,
    totalNetSalary: 0,
    employees: [],
    preparedBy: '',
    preparedByPosition: 'HR Officer',
    preparedDate: '',
    reviewedBy: '',
    reviewedByPosition: 'Finance Manager',
    reviewedDate: '',
    approvedBy: '',
    approvedByPosition: 'Executive Director',
    approvedDate: '',
    status: 'draft',
  });

  const [activeTab, setActiveTab] = useState<'details' | 'employees' | 'summary' | 'approval'>('details');

  // Sample employees for demo
  const sampleEmployees: PayrollEmployee[] = [
    {
      id: '1',
      employeeId: 'EMP001',
      name: 'Ahmad Khan',
      designation: 'Project Manager',
      department: 'Program',
      basicSalary: 45000,
      workingDays: 22,
      presentDays: 22,
      allowances: { transportation: 3000, housing: 5000, food: 2000, other: 0 },
      deductions: { tax: 2500, advances: 0, loans: 0, other: 0 },
      salaryForMonth: 45000,
      netSalary: 52500,
      status: 'calculated',
    },
    {
      id: '2',
      employeeId: 'EMP002',
      name: 'Fatima Rahimi',
      designation: 'Finance Officer',
      department: 'Finance',
      basicSalary: 35000,
      workingDays: 22,
      presentDays: 20,
      allowances: { transportation: 2500, housing: 4000, food: 1500, other: 0 },
      deductions: { tax: 1800, advances: 5000, loans: 0, other: 0 },
      salaryForMonth: 31818,
      netSalary: 33018,
      status: 'calculated',
    },
    {
      id: '3',
      employeeId: 'EMP003',
      name: 'Mohammad Ali',
      designation: 'Field Coordinator',
      department: 'Operations',
      basicSalary: 30000,
      workingDays: 22,
      presentDays: 22,
      allowances: { transportation: 2000, housing: 3000, food: 1500, other: 1000 },
      deductions: { tax: 1500, advances: 0, loans: 2000, other: 0 },
      salaryForMonth: 30000,
      netSalary: 34000,
      status: 'calculated',
    },
  ];

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const loadEmployees = () => {
    const employees = sampleEmployees;
    const totalBasicSalary = employees.reduce((sum, e) => sum + e.basicSalary, 0);
    const totalAllowances = employees.reduce((sum, e) =>
      sum + e.allowances.transportation + e.allowances.housing + e.allowances.food + e.allowances.other, 0);
    const totalDeductions = employees.reduce((sum, e) =>
      sum + e.deductions.tax + e.deductions.advances + e.deductions.loans + e.deductions.other, 0);
    const totalNetSalary = employees.reduce((sum, e) => sum + e.netSalary, 0);

    setFormData(prev => ({
      ...prev,
      employees,
      totalEmployees: employees.length,
      totalBasicSalary,
      totalAllowances,
      totalDeductions,
      totalNetSalary,
    }));
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    console.log('Saving Payroll:', formData);
    navigate('/hr/payroll/generation');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AF', {
      style: 'currency',
      currency: 'AFN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      calculated: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    };
    return styles[status] || styles.pending;
  };

  const tabs = [
    { key: 'details', label: 'Payroll Details', icon: Calendar },
    { key: 'employees', label: 'Employee Salaries', icon: Users },
    { key: 'summary', label: 'Summary', icon: DollarSign },
    { key: 'approval', label: 'Approval', icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/payroll/generation"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Payroll' : 'Generate New Payroll'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 42: VDO-AFN Monthly Payroll
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit('save')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit('submit')}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
          >
            <Send className="h-4 w-4" />
            Submit for Approval
          </button>
        </div>
      </div>

      <PayrollInfoBanner
        title="Form 42: VDO-AFN Payroll"
        description="Generate monthly payroll including basic salary, allowances, deductions, and net pay for all employees."
      />

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Tabs */}
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px flex items-center gap-2 ${
                    activeTab === tab.key
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Payroll Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payroll ID</label>
                  <input
                    type="text"
                    value={formData.payrollId}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month/Year (Gregorian) *</label>
                  <input
                    type="month"
                    value={formData.monthYear}
                    onChange={(e) => handleChange('monthYear', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month/Year (Solar)</label>
                  <input
                    type="text"
                    value={formData.solarMonthYear}
                    onChange={(e) => handleChange('solarMonthYear', e.target.value)}
                    placeholder="e.g., Dalw 1402"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
                  <select
                    value={formData.project}
                    onChange={(e) => handleChange('project', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  >
                    <option value="">All Projects</option>
                    <option value="WASH">WASH Program</option>
                    <option value="Education">Education Initiative</option>
                    <option value="Health">Health Services</option>
                    <option value="Core">Core Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Donor</label>
                  <select
                    value={formData.donor}
                    onChange={(e) => handleChange('donor', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  >
                    <option value="">All Donors</option>
                    <option value="UNICEF">UNICEF</option>
                    <option value="WFP">WFP</option>
                    <option value="UNHCR">UNHCR</option>
                    <option value="Core">Core Funding</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Generated Date</label>
                  <input
                    type="date"
                    value={formData.generatedDate}
                    onChange={(e) => handleChange('generatedDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={loadEmployees}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Users className="h-5 w-5" />
                  Load Employees & Calculate Payroll
                </button>
              </div>
            </div>
          )}

          {/* Employee Salaries Tab */}
          {activeTab === 'employees' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  </div>
                  <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {formData.employees.length} employees
                </div>
              </div>

              {formData.employees.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-sm text-gray-500">No employees loaded</p>
                  <p className="mt-1 text-xs text-gray-400">Go to "Payroll Details" tab and click "Load Employees"</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">ID</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Name</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Designation</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Basic</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Days</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Salary</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Allowances</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Deductions</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Net Salary</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {formData.employees.map((emp) => {
                        const totalAllowances = emp.allowances.transportation + emp.allowances.housing + emp.allowances.food + emp.allowances.other;
                        const totalDeductions = emp.deductions.tax + emp.deductions.advances + emp.deductions.loans + emp.deductions.other;
                        return (
                          <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{emp.employeeId}</td>
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{emp.name}</td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{emp.designation}</td>
                            <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{formatCurrency(emp.basicSalary)}</td>
                            <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">{emp.presentDays}/{emp.workingDays}</td>
                            <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{formatCurrency(emp.salaryForMonth)}</td>
                            <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400">+{formatCurrency(totalAllowances)}</td>
                            <td className="px-4 py-3 text-right text-red-600 dark:text-red-400">-{formatCurrency(totalDeductions)}</td>
                            <td className="px-4 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(emp.netSalary)}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(emp.status)}`}>
                                {emp.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formData.totalEmployees}</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400">Total Basic Salary</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(formData.totalBasicSalary)}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400">Total Allowances</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">+{formatCurrency(formData.totalAllowances)}</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">Total Deductions</p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">-{formatCurrency(formData.totalDeductions)}</p>
                </div>
              </div>

              <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">Total Net Payroll</p>
                    <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(formData.totalNetSalary)}</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30">
                      <Download className="h-4 w-4" />
                      Export
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30">
                      <Printer className="h-4 w-4" />
                      Print
                    </button>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">Allowances Breakdown</h3>
                  <div className="space-y-3">
                    {formData.employees.length > 0 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Transportation</span>
                          <span className="text-gray-900 dark:text-white">
                            {formatCurrency(formData.employees.reduce((sum, e) => sum + e.allowances.transportation, 0))}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Housing</span>
                          <span className="text-gray-900 dark:text-white">
                            {formatCurrency(formData.employees.reduce((sum, e) => sum + e.allowances.housing, 0))}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Food</span>
                          <span className="text-gray-900 dark:text-white">
                            {formatCurrency(formData.employees.reduce((sum, e) => sum + e.allowances.food, 0))}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Other</span>
                          <span className="text-gray-900 dark:text-white">
                            {formatCurrency(formData.employees.reduce((sum, e) => sum + e.allowances.other, 0))}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">Deductions Breakdown</h3>
                  <div className="space-y-3">
                    {formData.employees.length > 0 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Tax</span>
                          <span className="text-gray-900 dark:text-white">
                            {formatCurrency(formData.employees.reduce((sum, e) => sum + e.deductions.tax, 0))}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Advances</span>
                          <span className="text-gray-900 dark:text-white">
                            {formatCurrency(formData.employees.reduce((sum, e) => sum + e.deductions.advances, 0))}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Loans</span>
                          <span className="text-gray-900 dark:text-white">
                            {formatCurrency(formData.employees.reduce((sum, e) => sum + e.deductions.loans, 0))}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Other</span>
                          <span className="text-gray-900 dark:text-white">
                            {formatCurrency(formData.employees.reduce((sum, e) => sum + e.deductions.other, 0))}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Approval Tab */}
          {activeTab === 'approval' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Prepared By */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Prepared By
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Name</label>
                      <input
                        type="text"
                        value={formData.preparedBy}
                        onChange={(e) => handleChange('preparedBy', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Position</label>
                      <input
                        type="text"
                        value={formData.preparedByPosition}
                        readOnly
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Date</label>
                      <input
                        type="date"
                        value={formData.preparedDate}
                        onChange={(e) => handleChange('preparedDate', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Reviewed By */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Reviewed By
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Name</label>
                      <input
                        type="text"
                        value={formData.reviewedBy}
                        onChange={(e) => handleChange('reviewedBy', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Position</label>
                      <input
                        type="text"
                        value={formData.reviewedByPosition}
                        readOnly
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Date</label>
                      <input
                        type="date"
                        value={formData.reviewedDate}
                        onChange={(e) => handleChange('reviewedDate', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Approved By */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Approved By
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Name</label>
                      <input
                        type="text"
                        value={formData.approvedBy}
                        onChange={(e) => handleChange('approvedBy', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Position</label>
                      <input
                        type="text"
                        value={formData.approvedByPosition}
                        readOnly
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Date</label>
                      <input
                        type="date"
                        value={formData.approvedDate}
                        onChange={(e) => handleChange('approvedDate', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PAYROLL LIST
// ============================================================================

const PayrollList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const payrolls = [
    { id: '1', period: 'January 2024', employees: 145, totalAmount: 2500000, status: 'Approved', date: '2024-01-28' },
    { id: '2', period: 'December 2023', employees: 143, totalAmount: 2450000, status: 'Paid', date: '2023-12-28' },
    { id: '3', period: 'November 2023', employees: 142, totalAmount: 2420000, status: 'Paid', date: '2023-11-28' },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'Pending Review': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      Approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    };
    return styles[status] || styles.Draft;
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll Generation</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 42: Monthly payroll processing</p>
        </div>
        <Link
          to="/hr/payroll/generation/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
        >
          <Plus className="h-4 w-4" />
          Generate Payroll
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by period..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employees</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {payrolls.map((payroll) => (
              <tr key={payroll.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{payroll.period}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{payroll.employees}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{formatCurrency(payroll.totalAmount)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(payroll.status)}`}>
                    {payroll.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{payroll.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link
                    to={`/hr/payroll/generation/${payroll.id}`}
                    className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 text-sm font-medium"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN EXPORT
// ============================================================================

const PayrollGeneration = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <PayrollGenerationForm />;
  return <PayrollList />;
};

export default PayrollGeneration;
