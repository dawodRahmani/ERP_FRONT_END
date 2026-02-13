// Exit & Separation Workflow Components

export interface ExitStep {
  id: string;
  label: string;
  formNumbers: string;
  description: string;
  path: string;
}

export const exitWorkflowSteps: ExitStep[] = [
  {
    id: 'exit-checklist',
    label: 'Exit Checklist',
    formNumbers: 'Form 47',
    description: 'Track clearance process for departing employees',
    path: '/hr/exit/checklist',
  },
  {
    id: 'exit-interview',
    label: 'Exit Interview',
    formNumbers: 'Form 44',
    description: 'Gather feedback from departing employees',
    path: '/hr/exit/interview',
  },
  {
    id: 'work-certificate',
    label: 'Work Certificate',
    formNumbers: 'Form 43',
    description: 'Issue employment verification letters',
    path: '/hr/exit/certificate',
  },
];

export function ExitWorkflow() {
  return null;
}

export function ExitInfoBanner({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-medium text-orange-800 dark:text-orange-300">{title}</h3>
          <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}
