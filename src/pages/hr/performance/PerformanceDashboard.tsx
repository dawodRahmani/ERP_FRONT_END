import { Link } from 'react-router-dom';
import {
  BarChart3,
  ClipboardCheck,
  Clock,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  FileText,
  ArrowRight,
  Star,
  Award,
  Target,
  Calendar
} from 'lucide-react';
import { evaluationWorkflowSteps, promotionWorkflowSteps } from './components/PerformanceWorkflow';

const PerformanceDashboard = () => {
  // Mock statistics - replace with actual data
  const stats = {
    pendingProbation: 8,
    upcomingAppraisals: 15,
    completedAppraisals: 42,
    pendingPromotions: 3,
  };

  const quickActions = [
    {
      label: 'Probation Evaluation',
      description: 'Evaluate probationary employees',
      icon: Clock,
      path: '/hr/performance/probation-evaluation/new',
      color: 'bg-yellow-500',
    },
    {
      label: 'Performance Appraisal',
      description: 'Annual review',
      icon: ClipboardCheck,
      path: '/hr/performance/appraisal/new',
      color: 'bg-blue-500',
    },
    {
      label: 'Promotion Feasibility',
      description: 'Assess promotion eligibility',
      icon: Target,
      path: '/hr/performance/promotion-feasibility/new',
      color: 'bg-purple-500',
    },
    {
      label: 'Promotion Letter',
      description: 'Generate promotion letter',
      icon: Award,
      path: '/hr/performance/promotion-letter/new',
      color: 'bg-green-500',
    },
  ];

  // Mock data for upcoming evaluations
  const upcomingEvaluations = [
    { name: 'Ahmad Rahimi', position: 'Project Officer', type: 'Probation', dueDate: '2026-02-15', status: 'pending' },
    { name: 'Fatima Karimi', position: 'Finance Assistant', type: 'Probation', dueDate: '2026-02-20', status: 'pending' },
    { name: 'Mohammad Hashimi', position: 'HR Officer', type: 'Annual', dueDate: '2026-03-01', status: 'in_progress' },
  ];

  const recentAppraisals = [
    { name: 'Zahra Ahmadi', position: 'Program Manager', score: 85, recommendation: 'Increment', date: '2026-01-28' },
    { name: 'Ali Nazari', position: 'M&E Specialist', score: 78, recommendation: 'Renew', date: '2026-01-25' },
    { name: 'Sara Mohammadi', position: 'Admin Officer', score: 92, recommendation: 'Promotion', date: '2026-01-20' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Management</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Probation evaluations, annual appraisals, and promotions
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900/30 p-2">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Probation</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingProbation}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming Appraisals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.upcomingAppraisals}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed This Year</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedAppraisals}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Promotions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingPromotions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

      {/* Workflow Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Evaluation */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-primary-500" />
                Performance Evaluation
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">Forms 24, 46</span>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {evaluationWorkflowSteps.map((step) => (
              <Link
                key={step.id}
                to={step.path}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{step.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{step.formNumbers}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Promotion Process */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary-500" />
                Promotion Process
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">Forms 23, 25</span>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {promotionWorkflowSteps.map((step) => (
              <Link
                key={step.id}
                to={step.path}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{step.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{step.formNumbers}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Evaluations & Recent Appraisals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Evaluations */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Upcoming Evaluations
              </h2>
              <Link to="/hr/performance/probation-evaluation" className="text-sm text-primary-500 hover:text-primary-600">
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {upcomingEvaluations.map((item, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.position}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    item.type === 'Probation'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {item.type}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Due: {item.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Appraisals */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-green-500" />
                Recent Appraisals
              </h2>
              <Link to="/hr/performance/appraisal" className="text-sm text-primary-500 hover:text-primary-600">
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentAppraisals.map((item, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.position}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.score}%</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.recommendation === 'Promotion'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                        : item.recommendation === 'Increment'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {item.recommendation}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Modules */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Related HR Modules</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Performance management connects with these modules
          </p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link
              to="/hr/employee-management"
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Employee Management</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Contract amendments for promotions</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
            <Link
              to="/hr/training"
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Training & Development</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Training needs from appraisals</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
            <Link
              to="/hr/payroll"
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Payroll</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Salary increments & adjustments</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
