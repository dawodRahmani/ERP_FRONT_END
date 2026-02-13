import { useState } from 'react';
import {
  Plus,
  Search,
  FileText,
  ChevronLeft,
  Save,
  Send,
  AlertTriangle,
  UserX
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EmployeeWorkflow } from '../components/EmployeeWorkflow';

interface TerminationLetterData {
  // Letter Info
  letterDate: string;
  referenceNumber: string;

  // Employee Info
  employeeName: string;
  employeeId: string;
  position: string;
  department: string;
  location: string;
  contractNumber: string;

  // Termination Details
  terminationType: 'resignation' | 'end_of_contract' | 'termination_with_cause' | 'termination_without_cause' | 'probation_failure' | 'retirement';
  terminationReason: string;
  lastWorkingDay: string;
  noticePeriodWaived: boolean;

  // Entitlements
  salaryUntilLastDay: boolean;
  leaveEncashment: boolean;
  otherEntitlements: string;

  // Signature
  hrSignatureName: string;
  hrSignatureSigned: boolean;
  hrSignatureDate: string;

  // CC List
  ccPFile: boolean;
  ccFinance: boolean;
  ccHR: boolean;
  ccProgram: boolean;

  status: 'draft' | 'pending' | 'issued' | 'acknowledged';
}

const TerminationLetterForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<TerminationLetterData>({
    letterDate: new Date().toISOString().split('T')[0],
    referenceNumber: `TERM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    employeeName: '',
    employeeId: '',
    position: '',
    department: '',
    location: '',
    contractNumber: '',
    terminationType: 'end_of_contract',
    terminationReason: '',
    lastWorkingDay: '',
    noticePeriodWaived: false,
    salaryUntilLastDay: true,
    leaveEncashment: true,
    otherEntitlements: '',
    hrSignatureName: '',
    hrSignatureSigned: false,
    hrSignatureDate: '',
    ccPFile: true,
    ccFinance: true,
    ccHR: true,
    ccProgram: true,
    status: 'draft',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeName) newErrors.employeeName = 'Employee name is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.terminationReason) newErrors.terminationReason = 'Termination reason is required';
    if (!formData.lastWorkingDay) newErrors.lastWorkingDay = 'Last working day is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    if (action === 'submit' && !validateForm()) return;

    const dataToSave = {
      ...formData,
      status: action === 'submit' ? 'pending' : 'draft',
    };

    console.log('Saving Termination Letter:', dataToSave);
    navigate('/hr/employee-management/contract/termination');
  };

  const terminationTypes = [
    { value: 'resignation', label: 'Resignation' },
    { value: 'end_of_contract', label: 'End of Contract' },
    { value: 'termination_with_cause', label: 'Termination with Cause' },
    { value: 'termination_without_cause', label: 'Termination without Cause' },
    { value: 'probation_failure', label: 'Probation Not Passed' },
    { value: 'retirement', label: 'Retirement' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/employee-management/contract/termination"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Termination Letter' : 'New Termination Letter'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 27: Formal termination notice
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit('save')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit('submit')}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            <Send className="h-4 w-4" />
            Issue Letter
          </button>
        </div>
      </div>

      {/* Workflow */}
      <EmployeeWorkflow currentStep="termination" workflowType="contract" />

      {/* Warning Banner */}
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800 dark:text-red-300">Important Notice</h3>
            <p className="text-sm text-red-700 dark:text-red-400 mt-1">
              This letter formally terminates employment. Ensure all approvals are obtained and exit procedures are initiated before issuing.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Letter Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Letter Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={formData.referenceNumber}
                  readOnly
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Letter Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.letterDate}
                  onChange={(e) => handleChange('letterDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Employee Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Employee Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => handleChange('employeeName', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.employeeName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter employee name"
                />
                {errors.employeeName && <p className="mt-1 text-sm text-red-500">{errors.employeeName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => handleChange('employeeId', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter employee ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.position ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter position"
                />
                {errors.position && <p className="mt-1 text-sm text-red-500">{errors.position}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter department"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contract Number
                </label>
                <input
                  type="text"
                  value={formData.contractNumber}
                  onChange={(e) => handleChange('contractNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter contract number"
                />
              </div>
            </div>
          </div>

          {/* Termination Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Termination Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type of Termination <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.terminationType}
                  onChange={(e) => handleChange('terminationType', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {terminationTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Working Day <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.lastWorkingDay}
                  onChange={(e) => handleChange('lastWorkingDay', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.lastWorkingDay ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.lastWorkingDay && <p className="mt-1 text-sm text-red-500">{errors.lastWorkingDay}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Termination Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.terminationReason}
                onChange={(e) => handleChange('terminationReason', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 rounded-lg border ${errors.terminationReason ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Provide detailed reason for termination..."
              />
              {errors.terminationReason && <p className="mt-1 text-sm text-red-500">{errors.terminationReason}</p>}
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.noticePeriodWaived}
                  onChange={(e) => handleChange('noticePeriodWaived', e.target.checked)}
                  className="rounded border-gray-300 text-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Notice period waived</span>
              </label>
            </div>
          </div>

          {/* Entitlements */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Entitlements</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.salaryUntilLastDay}
                  onChange={(e) => handleChange('salaryUntilLastDay', e.target.checked)}
                  className="rounded border-gray-300 text-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Salary up to last working day</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.leaveEncashment}
                  onChange={(e) => handleChange('leaveEncashment', e.target.checked)}
                  className="rounded border-gray-300 text-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Leave encashment (if applicable)</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Other Entitlements
                </label>
                <textarea
                  value={formData.otherEntitlements}
                  onChange={(e) => handleChange('otherEntitlements', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="List any other entitlements..."
                />
              </div>
            </div>
          </div>

          {/* Signature & CC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">HR Signature</h2>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
                <input
                  type="text"
                  value={formData.hrSignatureName}
                  onChange={(e) => handleChange('hrSignatureName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  placeholder="HR Representative Name"
                />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.hrSignatureSigned}
                      onChange={(e) => handleChange('hrSignatureSigned', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500"
                    />
                    <span className="text-sm">Signed</span>
                  </label>
                  {formData.hrSignatureSigned && (
                    <input
                      type="date"
                      value={formData.hrSignatureDate}
                      onChange={(e) => handleChange('hrSignatureDate', e.target.value)}
                      className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">CC (Copy To)</h2>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.ccPFile}
                    onChange={(e) => handleChange('ccPFile', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500"
                  />
                  <span className="text-sm">P/File (Personnel File)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.ccFinance}
                    onChange={(e) => handleChange('ccFinance', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500"
                  />
                  <span className="text-sm">Finance Department</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.ccHR}
                    onChange={(e) => handleChange('ccHR', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500"
                  />
                  <span className="text-sm">HR Department</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.ccProgram}
                    onChange={(e) => handleChange('ccProgram', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500"
                  />
                  <span className="text-sm">Program Department</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TerminationLetterList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Termination Letters</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 27: Formal termination notice</p>
        </div>
        <Link
          to="/hr/employee-management/contract/termination/new"
          className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600"
        >
          <Plus className="h-4 w-4" />
          New Termination Letter
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by employee name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Day</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <UserX className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No termination letters found</p>
                <Link
                  to="/hr/employee-management/contract/termination/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                >
                  <Plus className="h-4 w-4" />
                  Create Termination Letter
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TerminationLetter = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <TerminationLetterForm />;
  return <TerminationLetterList />;
};

export default TerminationLetter;
