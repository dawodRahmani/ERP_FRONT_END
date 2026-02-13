import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ============================================================================
// LEAVE & ATTENDANCE WORKFLOW COMPONENT
// ============================================================================

interface WorkflowStep {
  id: string;
  label: string;
  shortLabel: string;
  path: string;
  formNumbers: string;
  description: string;
}

export const leaveWorkflowSteps: WorkflowStep[] = [
  {
    id: 'leave-request',
    label: 'Leave Request',
    shortLabel: 'Request',
    path: '/hr/leave-attendance/leave/request',
    formNumbers: 'Form 34',
    description: 'Submit leave application',
  },
  {
    id: 'leave-tracker',
    label: 'Leave Tracker',
    shortLabel: 'Tracker',
    path: '/hr/leave-attendance/leave/tracker',
    formNumbers: 'Form 35',
    description: 'Track leave balances and history',
  },
];

export const attendanceWorkflowSteps: WorkflowStep[] = [
  {
    id: 'manual-attendance',
    label: 'Attendance Records',
    shortLabel: 'Attendance',
    path: '/hr/leave-attendance/attendance/manual',
    formNumbers: 'Form 37',
    description: 'Employee attendance tracking',
  },
];

interface LeaveWorkflowProps {
  currentStep: string;
  workflowType: 'leave' | 'attendance';
}

export function LeaveWorkflow({ currentStep, workflowType }: LeaveWorkflowProps) {
  const navigate = useNavigate();
  const steps = workflowType === 'leave' ? leaveWorkflowSteps : attendanceWorkflowSteps;

  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {workflowType === 'leave' ? 'Leave Management' : 'Attendance Management'}
        </h3>
        <button
          onClick={() => navigate('/hr/leave-attendance')}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isPast = index < currentIndex;
          const isFuture = index > currentIndex;

          return (
            <React.Fragment key={step.id}>
              {/* Step */}
              <button
                onClick={() => navigate(step.path)}
                className={`flex flex-col items-center group relative ${
                  isActive ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isPast
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30'
                  }`}
                >
                  {isPast ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={`mt-2 text-xs font-medium ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.shortLabel}
                </span>

                {/* Form Number Badge */}
                <span className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                  {step.formNumbers}
                </span>

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                  <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                    <div className="font-medium">{step.label}</div>
                    <div className="text-gray-300">{step.description}</div>
                  </div>
                </div>
              </button>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    index < currentIndex
                      ? 'bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// Employee/Leave Info Banner Component
interface LeaveInfoBannerProps {
  employeeId?: string;
  employeeName?: string;
  department?: string;
  leaveBalance?: {
    annual: number;
    sick: number;
    maternity: number;
  };
}

export function LeaveInfoBanner({ employeeId, employeeName, department, leaveBalance }: LeaveInfoBannerProps) {
  if (!employeeId) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{employeeName}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{employeeId} • {department}</p>
          </div>
        </div>

        {leaveBalance && (
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{leaveBalance.annual}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Annual</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{leaveBalance.sick}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Sick</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{leaveBalance.maternity}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Maternity</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaveWorkflow;
