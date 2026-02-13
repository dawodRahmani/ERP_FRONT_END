import { useState } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  Save,
  Send,
  CheckCircle,
  Award
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EmployeeWorkflow } from '../components/EmployeeWorkflow';

interface ConfirmationLetterData {
  // Letter Info
  referenceNumber: string;
  letterDate: string;

  // Employee Info
  employeeName: string;
  employeeId: string;
  position: string;
  department: string;
  dutyStation: string;
  contractNumber: string;

  // Probation Details
  probationStartDate: string;
  probationEndDate: string;
  confirmationDate: string;

  // Performance Summary
  performanceSummary: string;
  recommendedBy: string;

  // Signature
  hrSpecialistName: string;
  hrSpecialistSigned: boolean;
  hrSpecialistDate: string;

  status: 'draft' | 'pending' | 'issued';
}

const ConfirmationLetterForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<ConfirmationLetterData>({
    referenceNumber: `CONF-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    letterDate: new Date().toISOString().split('T')[0],
    employeeName: '',
    employeeId: '',
    position: '',
    department: '',
    dutyStation: '',
    contractNumber: '',
    probationStartDate: '',
    probationEndDate: '',
    confirmationDate: '',
    performanceSummary: '',
    recommendedBy: '',
    hrSpecialistName: '',
    hrSpecialistSigned: false,
    hrSpecialistDate: '',
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
    if (!formData.dutyStation) newErrors.dutyStation = 'Duty station is required';
    if (!formData.probationStartDate) newErrors.probationStartDate = 'Probation start date is required';
    if (!formData.probationEndDate) newErrors.probationEndDate = 'Probation end date is required';
    if (!formData.confirmationDate) newErrors.confirmationDate = 'Confirmation date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    if (action === 'submit' && !validateForm()) return;

    const dataToSave = {
      ...formData,
      status: action === 'submit' ? 'pending' : 'draft',
    };

    console.log('Saving Confirmation Letter:', dataToSave);
    navigate('/hr/employee-management/contract/confirmation');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/employee-management/contract/confirmation"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Confirmation Letter' : 'New Confirmation Letter'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 49: Confirm employee after successful probation
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
            className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
          >
            <Send className="h-4 w-4" />
            Issue Letter
          </button>
        </div>
      </div>

      {/* Workflow */}
      <EmployeeWorkflow currentStep="confirmation" workflowType="contract" />

      {/* Success Banner */}
      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Award className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-800 dark:text-green-300">Successful Probation Completion</h3>
            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
              This letter confirms the employee has successfully completed their probation period and is now a confirmed staff member.
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
                  Letter Date
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
                  Position Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.position ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter position title"
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
                  Duty Station <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.dutyStation}
                  onChange={(e) => handleChange('dutyStation', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.dutyStation ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter duty station"
                />
                {errors.dutyStation && <p className="mt-1 text-sm text-red-500">{errors.dutyStation}</p>}
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

          {/* Probation Period */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Probation Period</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Probation Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.probationStartDate}
                  onChange={(e) => handleChange('probationStartDate', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.probationStartDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.probationStartDate && <p className="mt-1 text-sm text-red-500">{errors.probationStartDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Probation End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.probationEndDate}
                  onChange={(e) => handleChange('probationEndDate', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.probationEndDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.probationEndDate && <p className="mt-1 text-sm text-red-500">{errors.probationEndDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirmation Effective Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.confirmationDate}
                  onChange={(e) => handleChange('confirmationDate', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.confirmationDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.confirmationDate && <p className="mt-1 text-sm text-red-500">{errors.confirmationDate}</p>}
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Summary</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Performance Summary (Optional)
                </label>
                <textarea
                  value={formData.performanceSummary}
                  onChange={(e) => handleChange('performanceSummary', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Brief summary of employee's performance during probation..."
                />
              </div>
              <div className="md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recommended By
                </label>
                <input
                  type="text"
                  value={formData.recommendedBy}
                  onChange={(e) => handleChange('recommendedBy', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Line Manager / Supervisor name"
                />
              </div>
            </div>
          </div>

          {/* Signature */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">HR Specialist Signature</h2>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg max-w-md">
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.hrSpecialistName}
                  onChange={(e) => handleChange('hrSpecialistName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  placeholder="HR Specialist Name"
                />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.hrSpecialistSigned}
                      onChange={(e) => handleChange('hrSpecialistSigned', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500"
                    />
                    <span className="text-sm">Signed</span>
                  </label>
                  {formData.hrSpecialistSigned && (
                    <input
                      type="date"
                      value={formData.hrSpecialistDate}
                      onChange={(e) => handleChange('hrSpecialistDate', e.target.value)}
                      className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfirmationLetterList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Confirmation Letters</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 49: Confirm employee after probation</p>
        </div>
        <Link
          to="/hr/employee-management/contract/confirmation/new"
          className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-600"
        >
          <Plus className="h-4 w-4" />
          New Confirmation Letter
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confirmation Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No confirmation letters found</p>
                <Link
                  to="/hr/employee-management/contract/confirmation/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                >
                  <Plus className="h-4 w-4" />
                  Create Confirmation Letter
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ConfirmationLetter = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <ConfirmationLetterForm />;
  return <ConfirmationLetterList />;
};

export default ConfirmationLetter;
