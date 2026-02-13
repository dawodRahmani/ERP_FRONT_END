import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  ClipboardCheck,
  UserPlus,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileSignature,
  Shield,
  BookOpen,
  FolderOpen,
  UserCheck,
  FilePlus,
  FileKey,
  ArrowRight
} from 'lucide-react';
import { contractWorkflowSteps, onboardingWorkflowSteps } from './components/EmployeeWorkflow';

const EmployeeManagementDashboard = () => {
  // Mock statistics - replace with actual data
  const stats = {
    activeOnboarding: 5,
    pendingProbation: 8,
    contractsExpiring: 3,
    pendingConfirmations: 4,
  };

  const quickActions = [
    {
      label: 'New Induction',
      description: 'Start employee onboarding',
      icon: UserPlus,
      path: '/hr/employee-management/onboarding/induction/new',
      color: 'bg-blue-500',
    },
    {
      label: 'Confirmation Letter',
      description: 'Confirm after probation',
      icon: CheckCircle,
      path: '/hr/employee-management/contract/confirmation/new',
      color: 'bg-green-500',
    },
    {
      label: 'Extension Letter',
      description: 'Extend probation period',
      icon: Clock,
      path: '/hr/employee-management/contract/extension/new',
      color: 'bg-yellow-500',
    },
    {
      label: 'Contract Amendment',
      description: 'Modify contract terms',
      icon: FileSignature,
      path: '/hr/employee-management/contract/amendment/new',
      color: 'bg-purple-500',
    },
    {
      label: 'Personnel File',
      description: 'Document checklist',
      icon: FolderOpen,
      path: '/hr/employee-management/onboarding/personnel-file/new',
      color: 'bg-indigo-500',
    },
    {
      label: 'Termination',
      description: 'Process separation',
      icon: AlertTriangle,
      path: '/hr/employee-management/contract/termination/new',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Contract management and employee onboarding
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
              <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Onboarding</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeOnboarding}</p>
            </div>
          </div>
        </div>

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
            <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Confirmations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingConfirmations}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-2">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Contracts Expiring</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.contractsExpiring}</p>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
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
        {/* Contract Management */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileSignature className="h-5 w-5 text-primary-500" />
                Contract Management
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">Forms 26, 27, 49, 50</span>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {contractWorkflowSteps.map((step) => (
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

        {/* Onboarding Process */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary-500" />
                Onboarding Process
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">Forms 28, 32, 33, 40/52, 51, 53, 55</span>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {onboardingWorkflowSteps.map((step) => (
              <Link
                key={step.id}
                to={step.path}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="h-4 w-4 text-gray-400" />
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

      {/* Link to Recruitment Module */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Related Recruitment Forms</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pre-employment verification and initial contract are handled in the Recruitment module
          </p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link
              to="/hr/recruitment/background-checks"
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Background Checks</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Forms 16-20: Pre-employment verification</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
            <Link
              to="/hr/recruitment/employment-contract"
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileKey className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Employment Contract</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Form 21: Initial employment agreement</p>
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

export default EmployeeManagementDashboard;
