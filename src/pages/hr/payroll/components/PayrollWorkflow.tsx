// Payroll Workflow Components

export interface PayrollStep {
  id: string;
  label: string;
  formNumbers: string;
  description: string;
  path: string;
}

export const payrollWorkflowSteps: PayrollStep[] = [
  {
    id: 'payroll-generation',
    label: 'Payroll Generation',
    formNumbers: 'Form 42',
    description: 'Generate monthly payroll for all employees',
    path: '/hr/payroll/generation',
  },
  {
    id: 'payslips',
    label: 'Payslips',
    formNumbers: 'Form 42',
    description: 'View and print individual employee payslips',
    path: '/hr/payroll/payslips',
  },
  {
    id: 'salary-advances',
    label: 'Salary Advances',
    formNumbers: '-',
    description: 'Manage employee salary advance requests',
    path: '/hr/payroll/advances',
  },
  {
    id: 'deductions',
    label: 'Deductions',
    formNumbers: '-',
    description: 'Manage payroll deductions and taxes',
    path: '/hr/payroll/deductions',
  },
];

export function PayrollWorkflow() {
  return null;
}

export function PayrollInfoBanner({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{title}</h3>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}
