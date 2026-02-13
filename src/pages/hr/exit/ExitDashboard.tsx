import React from 'react';
import { useNavigate } from 'react-router-dom';
import { exitWorkflowSteps } from './components';

// ============================================================================
// EXIT & SEPARATION DASHBOARD
// ============================================================================

export default function ExitDashboard() {
  const navigate = useNavigate();

  // Statistics cards data
  const stats = [
    { label: 'Pending Exits', value: 3, change: '+1', changeType: 'increase', color: 'orange' },
    { label: 'In Clearance', value: 5, change: '-2', changeType: 'decrease', color: 'yellow' },
    { label: 'Completed This Month', value: 2, change: '0', changeType: 'neutral', color: 'green' },
    { label: 'Certificates Issued', value: 8, change: '+3', changeType: 'increase', color: 'blue' },
  ];

  // Recent exit processes
  const recentExits = [
    { id: 1, name: 'Rahmatullah Ahmadi', position: 'Field Officer', department: 'Operations', type: 'Resignation', lastDay: '2024-02-15', status: 'In Clearance' },
    { id: 2, name: 'Mariam Karimi', position: 'Finance Assistant', department: 'Finance', type: 'End of Contract', lastDay: '2024-02-10', status: 'Interview Pending' },
    { id: 3, name: 'Nawid Stanikzai', position: 'Driver', department: 'Admin', type: 'Resignation', lastDay: '2024-02-05', status: 'Completed' },
    { id: 4, name: 'Zahra Mohammadi', position: 'HR Officer', department: 'HR', type: 'Transfer', lastDay: '2024-01-31', status: 'Certificate Issued' },
  ];

  // Pending clearances
  const pendingClearances = [
    { id: 1, name: 'Rahmatullah Ahmadi', department: 'IT', status: 'Pending', items: 3 },
    { id: 2, name: 'Rahmatullah Ahmadi', department: 'Finance', status: 'Approved', items: 2 },
    { id: 3, name: 'Mariam Karimi', department: 'Admin', status: 'Pending', items: 4 },
  ];

  const getStatColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
      orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    };
    return colors[color] || colors.blue;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'In Clearance': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'Interview Pending': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'Certificate Issued': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      'Approved': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };
    return styles[status] || styles.Pending;
  };

  const getExitTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      'Resignation': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      'End of Contract': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'Termination': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'Transfer': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'Retirement': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return styles[type] || styles.Resignation;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exit & Separation</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage employee separations, clearances, and work certificates
          </p>
        </div>
        <button
          onClick={() => navigate('/hr/exit/checklist/new')}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Exit Process
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
        {/* Exit Management Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Exit Workflow */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Exit Process Workflow</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exitWorkflowSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => navigate(step.path)}
                  className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* Recent Exit Processes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Exits</h2>
              <button
                onClick={() => navigate('/hr/exit/checklist')}
                className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Last Day</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentExits.map((exit) => (
                    <tr key={exit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{exit.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{exit.position} • {exit.department}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getExitTypeBadge(exit.type)}`}>
                          {exit.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{exit.lastDay}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(exit.status)}`}>
                          {exit.status}
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
          {/* Exit Process Flow */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Exit Process Flow</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-sm font-bold text-orange-600 dark:text-orange-400">1</div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Notice/Termination</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Employee submits resignation or receives notice</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-sm font-bold text-orange-600 dark:text-orange-400">2</div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Exit Checklist</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Complete departmental clearances</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-sm font-bold text-orange-600 dark:text-orange-400">3</div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Exit Interview</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Conduct feedback interview</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-sm font-bold text-orange-600 dark:text-orange-400">4</div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Final Settlement</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Process final payments</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm font-bold text-green-600 dark:text-green-400">5</div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Work Certificate</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Issue employment verification</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Clearances */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Clearances</h2>
            <div className="space-y-3">
              {pendingClearances.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.department} • {item.items} items</p>
                  </div>
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/hr/exit/checklist/new')}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Start Exit Process
              </button>
              <button
                onClick={() => navigate('/hr/exit/interview/new')}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Conduct Exit Interview
              </button>
              <button
                onClick={() => navigate('/hr/exit/certificate/new')}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Issue Work Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
