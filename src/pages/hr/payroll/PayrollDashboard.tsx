import React from 'react';
import { useNavigate } from 'react-router-dom';
import { payrollWorkflowSteps } from './components';

// ============================================================================
// PAYROLL DASHBOARD
// ============================================================================

export default function PayrollDashboard() {
  const navigate = useNavigate();

  // Statistics cards data
  const stats = [
    { label: 'Total Payroll', value: 'AFN 2.5M', change: '+5%', changeType: 'increase', color: 'emerald' },
    { label: 'Employees Paid', value: 145, change: '+2', changeType: 'increase', color: 'blue' },
    { label: 'Pending Advances', value: 8, change: '-3', changeType: 'decrease', color: 'yellow' },
    { label: 'This Month', value: 'Jan 2024', change: 'Active', changeType: 'neutral', color: 'green' },
  ];

  // Recent payroll records
  const recentPayrolls = [
    { id: 1, period: 'January 2024', employees: 145, totalAmount: 2500000, status: 'Completed', date: '2024-01-28' },
    { id: 2, period: 'December 2023', employees: 143, totalAmount: 2450000, status: 'Completed', date: '2023-12-28' },
    { id: 3, period: 'November 2023', employees: 142, totalAmount: 2420000, status: 'Completed', date: '2023-11-28' },
    { id: 4, period: 'October 2023', employees: 140, totalAmount: 2380000, status: 'Completed', date: '2023-10-28' },
  ];

  // Pending advances
  const pendingAdvances = [
    { id: 1, name: 'Ahmad Khan', amount: 15000, requestDate: '2024-01-25', status: 'Pending' },
    { id: 2, name: 'Fatima Rahimi', amount: 10000, requestDate: '2024-01-24', status: 'Pending' },
    { id: 3, name: 'Mohammad Ali', amount: 20000, requestDate: '2024-01-23', status: 'Approved' },
  ];

  const getStatColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
      red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    };
    return colors[color] || colors.blue;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      Approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      Completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[status] || styles.Pending;
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage employee salaries, deductions, and payslips
          </p>
        </div>
        <button
          onClick={() => navigate('/hr/payroll/generation/new')}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Generate Payroll
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatColor(stat.color)}`}>
                <span className="text-sm font-bold">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payroll Management Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payroll Workflow */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payroll Operations</h2>
            <div className="grid grid-cols-2 gap-4">
              {payrollWorkflowSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => navigate(step.path)}
                  className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{step.label}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{step.formNumbers}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Payroll Records */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Payroll Records</h2>
              <button
                onClick={() => navigate('/hr/payroll/generation')}
                className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Employees</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentPayrolls.map((payroll) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payroll Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Summary</h2>

            {/* Progress Circle */}
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="318 352"
                    className="text-emerald-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">90%</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Processed</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Basic Salary</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">AFN 2,000,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Allowances
                </span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">AFN 350,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Deductions
                </span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">-AFN 150,000</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Net Payroll</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">AFN 2,200,000</span>
              </div>
            </div>
          </div>

          {/* Pending Advances */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Advances</h2>
            <div className="space-y-3">
              {pendingAdvances.map((advance) => (
                <div key={advance.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{advance.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{advance.requestDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(advance.amount)}</p>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(advance.status)}`}>
                      {advance.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/hr/payroll/advances')}
              className="w-full mt-4 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            >
              View All Advances
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/hr/payroll/generation/new')}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Generate New Payroll
              </button>
              <button
                onClick={() => navigate('/hr/payroll/payslips')}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Payslips
              </button>
              <button
                onClick={() => navigate('/hr/payroll/advances')}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Manage Advances
              </button>
              <button
                onClick={() => navigate('/hr/leave-attendance/attendance/electronic')}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Attendance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
