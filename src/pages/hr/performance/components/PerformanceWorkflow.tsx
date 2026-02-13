import { CheckCircle, Circle, Clock } from 'lucide-react';

interface WorkflowStep {
  id: string;
  label: string;
  formNumbers: string;
  path: string;
}

export const evaluationWorkflowSteps: WorkflowStep[] = [
  {
    id: 'probation',
    label: 'Probation Evaluation',
    formNumbers: 'Form 46',
    path: '/hr/performance/probation-evaluation',
  },
  {
    id: 'annual',
    label: 'Annual Performance Appraisal',
    formNumbers: 'Form 24',
    path: '/hr/performance/appraisal',
  },
];

export const promotionWorkflowSteps: WorkflowStep[] = [
  {
    id: 'feasibility',
    label: 'Promotion Feasibility Review',
    formNumbers: 'Form 23',
    path: '/hr/performance/promotion-feasibility',
  },
  {
    id: 'promotion',
    label: 'Promotion Letter',
    formNumbers: 'Form 25',
    path: '/hr/performance/promotion-letter',
  },
];

interface PerformanceWorkflowProps {
  currentStep: string;
  workflowType: 'evaluation' | 'promotion';
}

export const PerformanceWorkflow = ({ currentStep, workflowType }: PerformanceWorkflowProps) => {
  const steps = workflowType === 'evaluation' ? evaluationWorkflowSteps : promotionWorkflowSteps;
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500'
                      : isCurrent
                      ? 'bg-primary-500 border-primary-500'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : isCurrent ? (
                    <Clock className="w-5 h-5 text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      isCurrent
                        ? 'text-primary-600 dark:text-primary-400'
                        : isCompleted
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-400">{step.formNumbers}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-4 ${
                    index < currentIndex ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceWorkflow;
