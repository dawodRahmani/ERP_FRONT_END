import { Link } from 'react-router-dom';
import { BookOpen, Calendar, DollarSign, FileText, TrendingUp, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const TrainingDashboard = () => {
  const stats = { totalTrainings: 24, upcomingTrainings: 5, pendingRequests: 8, budgetUtilized: 65 };

  const quickActions = [
    { label: 'Needs Assessment', description: 'Assess training needs', icon: FileText, path: '/hr/training/needs-assessment/new', color: 'bg-blue-500' },
    { label: 'Training Calendar', description: 'View/manage schedule', icon: Calendar, path: '/hr/training/calendar', color: 'bg-green-500' },
    { label: 'Budget Proposal', description: 'Request training budget', icon: DollarSign, path: '/hr/training/budget/new', color: 'bg-purple-500' },
    { label: 'Training Request', description: 'Submit request', icon: BookOpen, path: '/hr/training/request/new', color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Training & Development</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Training needs assessment, calendar, and budget management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2"><BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" /></div>
            <div><p className="text-sm text-gray-500 dark:text-gray-400">Total Trainings</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTrainings}</p></div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2"><Calendar className="h-5 w-5 text-green-600 dark:text-green-400" /></div>
            <div><p className="text-sm text-gray-500 dark:text-gray-400">Upcoming</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.upcomingTrainings}</p></div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900/30 p-2"><Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" /></div>
            <div><p className="text-sm text-gray-500 dark:text-gray-400">Pending Requests</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingRequests}</p></div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2"><TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" /></div>
            <div><p className="text-sm text-gray-500 dark:text-gray-400">Budget Utilized</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.budgetUtilized}%</p></div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700"><h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2></div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} to={action.path} className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-center">
                  <div className={`rounded-lg ${action.color} p-2 mb-2`}><Icon className="h-5 w-5 text-white" /></div>
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"><FileText className="h-5 w-5 text-primary-500" />Training Forms</h2>
        </div>
        <div className="p-4 space-y-2">
          {[
            { path: '/hr/training/needs-assessment', label: 'Training Needs Assessment', form: 'Form 29' },
            { path: '/hr/training/calendar', label: 'Training Calendar', form: 'Form 30' },
            { path: '/hr/training/budget', label: 'Budget Proposal', form: 'Form 31' },
            { path: '/hr/training/request', label: 'Training Request', form: 'Form 41' },
          ].map((item) => (
            <Link key={item.path} to={item.path} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-gray-400" />
                <div><p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p><p className="text-xs text-gray-500 dark:text-gray-400">{item.form}</p></div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainingDashboard;
