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

// Main recruitment workflow according to HR_SYSTEM_FLOW.md:
// Form 1 → Form 2 → Form 3 → Form 4 → Form 45 → Form 5 → Form 6 → Form 7
// → Form 8,9,10 → Form 11,12,13 → Form 14 → Form 15
// → Form 16,17,18,19,20 → Form 21 → Form 22
export const recruitmentWorkflowSteps: WorkflowStep[] = [
  {
    id: 'tor',
    label: 'Terms of Reference',
    shortLabel: 'ToR',
    path: '/hr/recruitment/terms-of-reference',
    formNumbers: 'Form 1',
    description: 'Define job requirements for the vacancy'
  },
  {
    id: 'srf',
    label: 'Staff Requisition',
    shortLabel: 'SRF',
    path: '/hr/recruitment/staff-requisition',
    formNumbers: 'Form 2',
    description: 'Request position with budget and approvals'
  },
  {
    id: 'applications',
    label: 'Applications',
    shortLabel: 'Apps',
    path: '/hr/recruitment/applications',
    formNumbers: 'Form 4',
    description: 'Receive and track candidate applications'
  },
  {
    id: 'rc',
    label: 'RC Formation',
    shortLabel: 'RC',
    path: '/hr/recruitment/committee',
    formNumbers: 'Form 45',
    description: 'Form the Recruitment Committee'
  },
  {
    id: 'coi',
    label: 'Conflict of Interest',
    shortLabel: 'COI',
    path: '/hr/recruitment/conflict-of-interest',
    formNumbers: 'Form 5',
    description: 'RC members sign conflict of interest declarations'
  },
  {
    id: 'longlist',
    label: 'Longlisting',
    shortLabel: 'Long',
    path: '/hr/recruitment/longlisting',
    formNumbers: 'Form 6',
    description: 'Check eligibility against minimum requirements'
  },
  {
    id: 'shortlist',
    label: 'Shortlisting',
    shortLabel: 'Short',
    path: '/hr/recruitment/shortlisting',
    formNumbers: 'Form 7',
    description: 'Score and rank eligible candidates'
  },
  {
    id: 'test',
    label: 'Written Test',
    shortLabel: 'Test',
    path: '/hr/recruitment/written-test',
    formNumbers: 'Forms 8-10',
    description: 'Conduct and score written examination'
  },
  {
    id: 'interview',
    label: 'Interview',
    shortLabel: 'Int',
    path: '/hr/recruitment/interview',
    formNumbers: 'Forms 11-13',
    description: 'Panel interview and evaluation'
  },
  {
    id: 'report',
    label: 'RC Report',
    shortLabel: 'Report',
    path: '/hr/recruitment/report',
    formNumbers: 'Form 14',
    description: 'Generate recruitment report with recommendations'
  },
  {
    id: 'offer',
    label: 'Offer Letter',
    shortLabel: 'Offer',
    path: '/hr/recruitment/offer-letter',
    formNumbers: 'Form 15',
    description: 'Send offer letter to selected candidate'
  },
  {
    id: 'background',
    label: 'Background Checks',
    shortLabel: 'BG',
    path: '/hr/recruitment/background-checks',
    formNumbers: 'Forms 16-20',
    description: 'Sanction, reference, guarantee, address, criminal checks'
  },
  {
    id: 'contract',
    label: 'Employment Contract',
    shortLabel: 'Contract',
    path: '/hr/recruitment/employment-contract',
    formNumbers: 'Form 21',
    description: 'Generate and sign employment contract'
  },
  {
    id: 'checklist',
    label: 'Checklist',
    shortLabel: 'Check',
    path: '/hr/recruitment/checklist',
    formNumbers: 'Form 22',
    description: 'Verify all recruitment documents are complete'
  },
];

// Special forms not in main workflow
export const specialRecruitmentForms = [
  {
    id: 'sole-source',
    label: 'Sole Source Justification',
    path: '/hr/recruitment/sole-source',
    formNumbers: 'Form 38',
    description: 'Justify non-competitive recruitment'
  },
  {
    id: 'candidate-sourcing',
    label: 'Candidate Sourcing',
    path: '/hr/recruitment/candidate-sourcing',
    formNumbers: 'Form 48',
    description: 'Track headhunting and sourcing activities'
  },
];

interface RecruitmentWorkflowProps {
  currentStep: string;
  vacancyId?: string;
  completedSteps?: string[];
}

export const RecruitmentWorkflow = ({ currentStep, vacancyId, completedSteps = [] }: RecruitmentWorkflowProps) => {
  const currentIndex = recruitmentWorkflowSteps.findIndex(s => s.id === currentStep);

  return (
    <div className="mb-6">
      {/* Workflow Steps - Horizontal Scrollable */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-1 min-w-max">
          {recruitmentWorkflowSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStep;
            const isPast = index < currentIndex;
            const stepPath = vacancyId ? `${step.path}/${vacancyId}` : step.path;

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
                {index < recruitmentWorkflowSteps.length - 1 && (
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
          Step {currentIndex + 1} of {recruitmentWorkflowSteps.length}: {recruitmentWorkflowSteps[currentIndex].label} ({recruitmentWorkflowSteps[currentIndex].formNumbers})
        </div>
      )}
    </div>
  );
};

interface WorkflowNavigationProps {
  currentStep: string;
  vacancyId?: string;
  onSave?: () => void;
  canProceed?: boolean;
}

export const WorkflowNavigation = ({ currentStep, vacancyId, onSave, canProceed = true }: WorkflowNavigationProps) => {
  const currentIndex = recruitmentWorkflowSteps.findIndex(s => s.id === currentStep);
  const prevStep = currentIndex > 0 ? recruitmentWorkflowSteps[currentIndex - 1] : null;
  const nextStep = currentIndex < recruitmentWorkflowSteps.length - 1 ? recruitmentWorkflowSteps[currentIndex + 1] : null;

  const getPrevPath = () => {
    if (!prevStep) return null;
    return vacancyId ? `${prevStep.path}/${vacancyId}` : prevStep.path;
  };

  const getNextPath = () => {
    if (!nextStep) return null;
    return vacancyId ? `${nextStep.path}/${vacancyId}` : `${nextStep.path}/new`;
  };

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
      <div>
        {prevStep && (
          <Link
            to={getPrevPath()!}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to {prevStep.label}
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        {onSave && (
          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Save & Stay
          </button>
        )}

        {nextStep && canProceed && (
          <Link
            to={getNextPath()!}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600"
          >
            Continue to {nextStep.label}
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}

        {!nextStep && canProceed && (
          <Link
            to="/hr/recruitment"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600"
          >
            <CheckCircle className="h-4 w-4" />
            Complete Recruitment
          </Link>
        )}
      </div>
    </div>
  );
};

// Vacancy Info Banner Component
interface VacancyInfoBannerProps {
  vacancyNumber?: string;
  positionTitle?: string;
  department?: string;
  status?: string;
}

export const VacancyInfoBanner = ({ vacancyNumber, positionTitle, department, status }: VacancyInfoBannerProps) => {
  if (!vacancyNumber && !positionTitle) return null;

  return (
    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
        {vacancyNumber && (
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Vacancy #:</span>
            <span className="ml-1 text-blue-800 dark:text-blue-300">{vacancyNumber}</span>
          </div>
        )}
        {positionTitle && (
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Position:</span>
            <span className="ml-1 text-blue-800 dark:text-blue-300">{positionTitle}</span>
          </div>
        )}
        {department && (
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Department:</span>
            <span className="ml-1 text-blue-800 dark:text-blue-300">{department}</span>
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

// Related Forms Section - Shows what other forms are linked to current recruitment
interface RelatedFormsProps {
  vacancyId?: string;
  currentStep: string;
  completedForms?: { stepId: string; formId: string; date: string }[];
}

export const RelatedForms = ({ vacancyId, currentStep, completedForms = [] }: RelatedFormsProps) => {
  const currentIndex = recruitmentWorkflowSteps.findIndex(s => s.id === currentStep);

  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Related Forms</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {recruitmentWorkflowSteps.map((step, index) => {
          const isCompleted = completedForms.some(f => f.stepId === step.id);
          const isCurrent = step.id === currentStep;
          const stepPath = vacancyId ? `${step.path}/${vacancyId}` : step.path;

          return (
            <Link
              key={step.id}
              to={stepPath}
              className={`flex items-center gap-2 p-2 rounded text-xs transition-colors ${
                isCurrent
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border border-primary-300 dark:border-primary-700'
                  : isCompleted
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="h-3.5 w-3.5 flex-shrink-0" />
              )}
              <div className="min-w-0">
                <div className="font-medium truncate">{step.shortLabel}</div>
                <div className="text-[10px] opacity-70">{step.formNumbers}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecruitmentWorkflow;
