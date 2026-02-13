import { CheckCircle, Circle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface WorkflowStep {
  id: string;
  label: string;
  shortLabel: string;
  path: string;
  formNumbers: string;
  description: string;
}

// Contract Management Workflow (Forms 26, 27, 49, 50)
export const contractWorkflowSteps: WorkflowStep[] = [
  {
    id: 'extension',
    label: 'Extension Letter',
    shortLabel: 'Ext',
    path: '/hr/employee-management/contract/extension',
    formNumbers: 'Form 26',
    description: 'Extend probation period with KPI improvement areas'
  },
  {
    id: 'confirmation',
    label: 'Confirmation Letter',
    shortLabel: 'Conf',
    path: '/hr/employee-management/contract/confirmation',
    formNumbers: 'Form 49',
    description: 'Confirm employee after successful probation'
  },
  {
    id: 'amendment',
    label: 'Contract Amendment',
    shortLabel: 'Amend',
    path: '/hr/employee-management/contract/amendment',
    formNumbers: 'Form 50',
    description: 'Modify existing contract terms'
  },
  {
    id: 'termination',
    label: 'Termination Letter',
    shortLabel: 'Term',
    path: '/hr/employee-management/contract/termination',
    formNumbers: 'Form 27',
    description: 'Formal termination notice'
  },
];

// Onboarding Workflow (Forms 28, 32, 33, 40/52, 51, 53, 55)
export const onboardingWorkflowSteps: WorkflowStep[] = [
  {
    id: 'induction',
    label: 'Induction Form',
    shortLabel: 'Induct',
    path: '/hr/employee-management/onboarding/induction',
    formNumbers: 'Form 28',
    description: 'New employee orientation and checklist'
  },
  {
    id: 'code-of-conduct',
    label: 'Code of Conduct',
    shortLabel: 'CoC',
    path: '/hr/employee-management/onboarding/code-of-conduct',
    formNumbers: 'Form 32',
    description: 'Code of conduct acknowledgement'
  },
  {
    id: 'personnel-file',
    label: 'Personnel File',
    shortLabel: 'P-File',
    path: '/hr/employee-management/onboarding/personnel-file',
    formNumbers: 'Form 33',
    description: 'Personnel file documentation checklist'
  },
  {
    id: 'mahram',
    label: 'Mahram Form',
    shortLabel: 'Mahram',
    path: '/hr/employee-management/onboarding/mahram',
    formNumbers: 'Form 40/52',
    description: 'Female staff mahram registration (conditional)'
  },
  {
    id: 'induction-pack',
    label: 'Induction Pack',
    shortLabel: 'Pack',
    path: '/hr/employee-management/onboarding/induction-pack',
    formNumbers: 'Form 51',
    description: 'Induction materials checklist'
  },
  {
    id: 'safeguarding',
    label: 'Safeguarding/PSEAH',
    shortLabel: 'Safe',
    path: '/hr/employee-management/onboarding/safeguarding',
    formNumbers: 'Form 53',
    description: 'Safeguarding policy acknowledgement'
  },
  {
    id: 'nda',
    label: 'NDA',
    shortLabel: 'NDA',
    path: '/hr/employee-management/onboarding/nda',
    formNumbers: 'Form 55',
    description: 'Non-disclosure agreement'
  },
];

interface EmployeeWorkflowProps {
  currentStep: string;
  workflowType: 'contract' | 'onboarding';
  employeeId?: string;
  completedSteps?: string[];
}

export const EmployeeWorkflow = ({ currentStep, workflowType, employeeId, completedSteps = [] }: EmployeeWorkflowProps) => {
  const steps = workflowType === 'contract' ? contractWorkflowSteps : onboardingWorkflowSteps;
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="mb-6">
      {/* Workflow Type Label */}
      <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {workflowType === 'contract' ? 'Contract Management' : 'Onboarding Process'}
      </div>

      {/* Workflow Steps - Horizontal Scrollable */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-1 min-w-max">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStep;
            const isPast = index < currentIndex;
            const stepPath = employeeId ? `${step.path}/${employeeId}` : step.path;

            return (
              <div key={step.id} className="flex items-center">
                <Link
                  to={stepPath}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isCurrent
                      ? 'bg-primary-500 text-white'
                      : isCompleted || isPast
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={`${step.label} (${step.formNumbers}) - ${step.description}`}
                >
                  {isCompleted || isPast ? (
                    <CheckCircle className="h-3.5 w-3.5" />
                  ) : (
                    <Circle className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">{step.shortLabel}</span>
                  <span className="sm:hidden">{index + 1}</span>
                </Link>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-3 w-3 text-gray-400 mx-0.5 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Info */}
      {currentIndex >= 0 && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Step {currentIndex + 1} of {steps.length}: {steps[currentIndex].label} ({steps[currentIndex].formNumbers})
        </div>
      )}
    </div>
  );
};

// Employee Info Banner Component
interface EmployeeInfoBannerProps {
  employeeId?: string;
  employeeName?: string;
  position?: string;
  department?: string;
  contractNumber?: string;
  status?: string;
}

export const EmployeeInfoBanner = ({
  employeeId,
  employeeName,
  position,
  department,
  contractNumber,
  status
}: EmployeeInfoBannerProps) => {
  if (!employeeId && !employeeName) return null;

  return (
    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
        {employeeId && (
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Employee ID:</span>
            <span className="ml-1 text-blue-800 dark:text-blue-300">{employeeId}</span>
          </div>
        )}
        {employeeName && (
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Name:</span>
            <span className="ml-1 text-blue-800 dark:text-blue-300">{employeeName}</span>
          </div>
        )}
        {position && (
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Position:</span>
            <span className="ml-1 text-blue-800 dark:text-blue-300">{position}</span>
          </div>
        )}
        {department && (
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Department:</span>
            <span className="ml-1 text-blue-800 dark:text-blue-300">{department}</span>
          </div>
        )}
        {contractNumber && (
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Contract #:</span>
            <span className="ml-1 text-blue-800 dark:text-blue-300">{contractNumber}</span>
          </div>
        )}
        {status && (
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Status:</span>
            <span className="ml-1 text-blue-800 dark:text-blue-300">{status}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeWorkflow;
