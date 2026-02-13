import { Link } from 'react-router-dom';
import { FileText, ArrowRight, ArrowRightLeft, Briefcase, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const SpecialFormsDashboard = () => {
  const stats = {
    pendingTransfers: 3,
    approvedTransfers: 12,
    dualEmploymentActive: 5,
    pendingReview: 2,
  };

  const quickActions = [
    { label: 'Internal Transfer', description: 'Review eligibility', icon: ArrowRightLeft, path: '/hr/special-forms/transfer/new', color: 'bg-blue-500' },
    { label: 'Dual Employment', description: 'Declare secondary job', icon: Briefcase, path: '/hr/special-forms/dual-employment/new', color: 'bg-purple-500' },
  ];

  const recentActivity = [
    { id: '1', type: 'Transfer', employee: 'Ahmad Ahmadi', status: 'pending', date: '2024-01-15' },
    { id: '2', type: 'Dual Employment', employee: 'Fatima Rahimi', status: 'approved', date: '2024-01-14' },
    { id: '3', type: 'Transfer', employee: 'Mohammad Karimi', status: 'approved', date: '2024-01-12' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Special Forms</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Internal transfers and dual employment declarations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900/30 p-2">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Transfers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingTransfers}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Approved Transfers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approvedTransfers}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
              <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Dual Employment</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.dualEmploymentActive}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingReview}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.path}
                  className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-center"
                >
                  <div className={`rounded-lg ${action.color} p-2 mb-2`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{action.description}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-500" />
            Special Forms
          </h2>
        </div>
        <div className="p-4 space-y-2">
          {[
            { path: '/hr/special-forms/transfer', label: 'Internal Transfer Eligibility Review', form: 'Form 39' },
            { path: '/hr/special-forms/dual-employment', label: 'Dual Employment Declaration', form: 'Form 54' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.form}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentActivity.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.type === 'Transfer' ? (
                  <ArrowRightLeft className="h-5 w-5 text-blue-500" />
                ) : (
                  <Briefcase className="h-5 w-5 text-purple-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.employee}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.type} - {item.date}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                item.status === 'approved'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialFormsDashboard;
