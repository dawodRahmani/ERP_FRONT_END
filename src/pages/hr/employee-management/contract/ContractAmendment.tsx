import { useState } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  Save,
  Send,
  FileSignature,
  Edit3
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EmployeeWorkflow } from '../components/EmployeeWorkflow';

interface ContractAmendmentData {
  // Amendment Info
  contractNumber: string;
  amendmentNumber: string;
  amendmentDate: string;

  // Employee Info
  employeeName: string;
  employeeId: string;

  // Original Terms
  originalPosition: string;
  originalSalary: string;
  originalDepartment: string;
  originalDutyStation: string;

  // New Terms
  newPosition: string;
  newSalary: string;
  newDepartment: string;
  newDutyStation: string;

  // Amendment Details
  effectiveDate: string;
  amendmentType: 'position_change' | 'salary_change' | 'department_change' | 'location_change' | 'multiple';
  amendmentDetails: string;
  reasonForAmendment: string;

  // Signatures
  employeeSigned: boolean;
  employeeSignDate: string;
  vdoSignerName: string;
  vdoSignerPosition: string;
  vdoSigned: boolean;
  vdoSignDate: string;

  status: 'draft' | 'pending_employee' | 'pending_vdo' | 'signed' | 'active';
}

const ContractAmendmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<ContractAmendmentData>({
    contractNumber: '',
    amendmentNumber: `AMD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    amendmentDate: new Date().toISOString().split('T')[0],
    employeeName: '',
    employeeId: '',
    originalPosition: '',
    originalSalary: '',
    originalDepartment: '',
    originalDutyStation: '',
    newPosition: '',
    newSalary: '',
    newDepartment: '',
    newDutyStation: '',
    effectiveDate: '',
    amendmentType: 'position_change',
    amendmentDetails: '',
    reasonForAmendment: '',
    employeeSigned: false,
    employeeSignDate: '',
    vdoSignerName: '',
    vdoSignerPosition: 'Executive Director',
    vdoSigned: false,
    vdoSignDate: '',
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

    if (!formData.contractNumber) newErrors.contractNumber = 'Contract number is required';
    if (!formData.employeeName) newErrors.employeeName = 'Employee name is required';
    if (!formData.effectiveDate) newErrors.effectiveDate = 'Effective date is required';
    if (!formData.amendmentDetails) newErrors.amendmentDetails = 'Amendment details are required';
    if (!formData.reasonForAmendment) newErrors.reasonForAmendment = 'Reason for amendment is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    if (action === 'submit' && !validateForm()) return;

    const dataToSave = {
      ...formData,
      status: action === 'submit' ? 'pending_employee' : 'draft',
    };

    console.log('Saving Contract Amendment:', dataToSave);
    navigate('/hr/employee-management/contract/amendment');
  };

  const amendmentTypes = [
    { value: 'position_change', label: 'Position Change' },
    { value: 'salary_change', label: 'Salary Change' },
    { value: 'department_change', label: 'Department Change' },
    { value: 'location_change', label: 'Location Change' },
    { value: 'multiple', label: 'Multiple Changes' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/employee-management/contract/amendment"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Contract Amendment' : 'New Contract Amendment'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 50: Modify existing contract terms
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
            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            <Send className="h-4 w-4" />
            Submit for Signatures
          </button>
        </div>
      </div>

      {/* Workflow */}
      <EmployeeWorkflow currentStep="amendment" workflowType="contract" />

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Amendment Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Amendment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Original Contract Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contractNumber}
                  onChange={(e) => handleChange('contractNumber', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.contractNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter original contract number"
                />
                {errors.contractNumber && <p className="mt-1 text-sm text-red-500">{errors.contractNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amendment Number
                </label>
                <input
                  type="text"
                  value={formData.amendmentNumber}
                  readOnly
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amendment Date
                </label>
                <input
                  type="date"
                  value={formData.amendmentDate}
                  onChange={(e) => handleChange('amendmentDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Employee Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Employee Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </div>

          {/* Terms Comparison */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contract Terms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Terms */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Original Terms
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
                    <input
                      type="text"
                      value={formData.originalPosition}
                      onChange={(e) => handleChange('originalPosition', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      placeholder="Original position"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary</label>
                    <input
                      type="text"
                      value={formData.originalSalary}
                      onChange={(e) => handleChange('originalSalary', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      placeholder="Original salary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                    <input
                      type="text"
                      value={formData.originalDepartment}
                      onChange={(e) => handleChange('originalDepartment', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      placeholder="Original department"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duty Station</label>
                    <input
                      type="text"
                      value={formData.originalDutyStation}
                      onChange={(e) => handleChange('originalDutyStation', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      placeholder="Original duty station"
                    />
                  </div>
                </div>
              </div>

              {/* New Terms */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  New Terms
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
                    <input
                      type="text"
                      value={formData.newPosition}
                      onChange={(e) => handleChange('newPosition', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      placeholder="New position (leave blank if unchanged)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary</label>
                    <input
                      type="text"
                      value={formData.newSalary}
                      onChange={(e) => handleChange('newSalary', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      placeholder="New salary (leave blank if unchanged)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                    <input
                      type="text"
                      value={formData.newDepartment}
                      onChange={(e) => handleChange('newDepartment', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      placeholder="New department (leave blank if unchanged)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duty Station</label>
                    <input
                      type="text"
                      value={formData.newDutyStation}
                      onChange={(e) => handleChange('newDutyStation', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      placeholder="New duty station (leave blank if unchanged)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amendment Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Amendment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amendment Type
                </label>
                <select
                  value={formData.amendmentType}
                  onChange={(e) => handleChange('amendmentType', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {amendmentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Effective Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => handleChange('effectiveDate', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.effectiveDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.effectiveDate && <p className="mt-1 text-sm text-red-500">{errors.effectiveDate}</p>}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amendment Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.amendmentDetails}
                  onChange={(e) => handleChange('amendmentDetails', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.amendmentDetails ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Describe the specific changes being made to the contract..."
                />
                {errors.amendmentDetails && <p className="mt-1 text-sm text-red-500">{errors.amendmentDetails}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason for Amendment <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.reasonForAmendment}
                  onChange={(e) => handleChange('reasonForAmendment', e.target.value)}
                  rows={2}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.reasonForAmendment ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Explain why this amendment is necessary..."
                />
                {errors.reasonForAmendment && <p className="mt-1 text-sm text-red-500">{errors.reasonForAmendment}</p>}
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Signatures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Employee</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.employeeSigned}
                        onChange={(e) => handleChange('employeeSigned', e.target.checked)}
                        className="rounded border-gray-300 text-primary-500"
                      />
                      <span className="text-sm">Employee signed</span>
                    </label>
                  </div>
                  {formData.employeeSigned && (
                    <input
                      type="date"
                      value={formData.employeeSignDate}
                      onChange={(e) => handleChange('employeeSignDate', e.target.value)}
                      className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  )}
                </div>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">VDO Representative (ED/DD/HOP)</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.vdoSignerName}
                    onChange={(e) => handleChange('vdoSignerName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    placeholder="Signer name"
                  />
                  <select
                    value={formData.vdoSignerPosition}
                    onChange={(e) => handleChange('vdoSignerPosition', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  >
                    <option value="Executive Director">Executive Director</option>
                    <option value="Deputy Director">Deputy Director</option>
                    <option value="Head of Program">Head of Program</option>
                  </select>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.vdoSigned}
                        onChange={(e) => handleChange('vdoSigned', e.target.checked)}
                        className="rounded border-gray-300 text-primary-500"
                      />
                      <span className="text-sm">Signed</span>
                    </label>
                    {formData.vdoSigned && (
                      <input
                        type="date"
                        value={formData.vdoSignDate}
                        onChange={(e) => handleChange('vdoSignDate', e.target.value)}
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
    </div>
  );
};

const ContractAmendmentList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contract Amendments</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 50: Modify existing contract terms</p>
        </div>
        <Link
          to="/hr/employee-management/contract/amendment/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Amendment
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by employee or contract..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amendment #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effective Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <Edit3 className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No contract amendments found</p>
                <Link
                  to="/hr/employee-management/contract/amendment/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                >
                  <Plus className="h-4 w-4" />
                  Create Amendment
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ContractAmendment = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <ContractAmendmentForm />;
  return <ContractAmendmentList />;
};

export default ContractAmendment;
