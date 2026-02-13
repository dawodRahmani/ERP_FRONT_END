import React from 'react';
import { useNavigate } from 'react-router-dom';
import { leaveWorkflowSteps, attendanceWorkflowSteps } from './components';

// ============================================================================
// LEAVE & ATTENDANCE DASHBOARD
// ============================================================================

export default function LeaveAttendanceDashboard() {
  const navigate = useNavigate();

  // Statistics cards data
  const stats = [
    { label: 'Pending Requests', value: 12, change: '+3', changeType: 'increase', color: 'blue' },
    { label: 'On Leave Today', value: 8, change: '-2', changeType: 'decrease', color: 'yellow' },
    { label: 'Late Arrivals', value: 5, change: '+1', changeType: 'increase', color: 'red' },
    { label: 'Present Today', value: 142, change: '+5', changeType: 'increase', color: 'green' },
  ];

  // Recent leave requests
  const recentRequests = [
    { id: 1, name: 'Ahmad Khan', type: 'Annual', from: '2024-02-05', to: '2024-02-08', days: 4, status: 'Pending' },
    { id: 2, name: 'Fatima Rahimi', type: 'Sick', from: '2024-02-04', to: '2024-02-04', days: 1, status: 'Approved' },
    { id: 3, name: 'Mohammad Ali', type: 'Annual', from: '2024-02-10', to: '2024-02-12', days: 3, status: 'Pending' },
    { id: 4, name: 'Sarah Ahmadi', type: 'Maternity', from: '2024-02-15', to: '2024-05-15', days: 90, status: 'Approved' },
  ];

  // Attendance summary
  const attendanceSummary = {
    totalEmployees: 150,
    present: 142,
    absent: 3,
    onLeave: 5,
    lateArrivals: 5,
  };

  const getStatColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
      red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      Approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[status as keyof typeof styles] || styles.Pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave & Attendance</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage employee leave requests and track attendance
          </p>
        </div>
        <button
          onClick={() => navigate('/hr/leave-attendance/leave/request/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Leave Request
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
                <span className="text-lg font-bold">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Management Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Leave Workflow */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leave Management</h2>
            <div className="grid grid-cols-2 gap-4">
              {leaveWorkflowSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => navigate(step.path)}
                  className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

          {/* Attendance Workflow */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Management</h2>
            <div className="grid grid-cols-2 gap-4">
              {attendanceWorkflowSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => navigate(step.path)}
                  className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-cyan-500 dark:hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/10 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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

          {/* Recent Leave Requests */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Leave Requests</h2>
              <button
                onClick={() => navigate('/hr/leave-attendance/leave/request')}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">From</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{request.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{request.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{request.from}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{request.to}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{request.days}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Attendance Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Attendance</h2>

            {/* Circular Progress */}
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
                    strokeDasharray={`${(attendanceSummary.present / attendanceSummary.totalEmployees) * 352} 352`}
                    className="text-green-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round((attendanceSummary.present / attendanceSummary.totalEmployees) * 100)}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Present</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Employees</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{attendanceSummary.totalEmployees}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Present
                </span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">{attendanceSummary.present}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Absent
                </span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">{attendanceSummary.absent}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  On Leave
                </span>
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{attendanceSummary.onLeave}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  Late Arrivals
                </span>
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">{attendanceSummary.lateArrivals}</span>
              </div>
            </div>
          </div>

          {/* Leave Balance Legend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leave Types Legend</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm font-bold text-green-600 dark:text-green-400">A</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Annual Leave</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-sm font-bold text-yellow-600 dark:text-yellow-400">S</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Sick Leave</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-sm font-bold text-purple-600 dark:text-purple-400">M</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Maternity Leave</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-sm font-bold text-red-600 dark:text-red-400">U</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Unpaid Leave</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400">H</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Holiday</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/hr/leave-attendance/leave/request/new')}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Leave Request
              </button>
              <button
                onClick={() => navigate('/hr/leave-attendance/leave/tracker')}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View Leave Tracker
              </button>
              <button
                onClick={() => navigate('/hr/leave-attendance/attendance/electronic')}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Attendance Records
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
