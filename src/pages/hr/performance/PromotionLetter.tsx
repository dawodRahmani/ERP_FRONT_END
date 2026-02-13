import { useState } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  Save,
  Send,
  Award,
  Printer,
  Download,
  FileText
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PerformanceWorkflow } from './components/PerformanceWorkflow';

interface PromotionLetterData {
  // Letter Details
  referenceNumber: string;
  letterDate: string;

  // Employee Information
  employeeName: string;
  employeeId: string;
  currentPosition: string;
  department: string;
  project: string;

  // Promotion Details
  newPosition: string;
  effectiveDate: string;
  newResponsibilities: string[];
  revisedSalary: string;
  salaryGrade: string;
  allowances: string;

  // Supporting Information
  feasibilityReviewRef: string;
  appraisalRef: string;
  remarks: string;

  // Acknowledgment
  employeeSigned: boolean;
  employeeSignDate: string;

  // Approval
  approverName: string;
  approverTitle: string;
  approverSigned: boolean;
  approverDate: string;

  status: 'draft' | 'pending_approval' | 'approved' | 'acknowledged';
}

const PromotionLetterFormComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<PromotionLetterData>({
    referenceNumber: '',
    letterDate: new Date().toISOString().split('T')[0],
    employeeName: '',
    employeeId: '',
    currentPosition: '',
    department: '',
    project: '',
    newPosition: '',
    effectiveDate: '',
    newResponsibilities: [''],
    revisedSalary: '',
    salaryGrade: '',
    allowances: '',
    feasibilityReviewRef: '',
    appraisalRef: '',
    remarks: '',
    employeeSigned: false,
    employeeSignDate: '',
    approverName: '',
    approverTitle: '',
    approverSigned: false,
    approverDate: '',
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

  const addResponsibility = () => {
    setFormData(prev => ({
      ...prev,
      newResponsibilities: [...prev.newResponsibilities, ''],
    }));
  };

  const updateResponsibility = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      newResponsibilities: prev.newResponsibilities.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const removeResponsibility = (index: number) => {
    if (formData.newResponsibilities.length > 1) {
      setFormData(prev => ({
        ...prev,
        newResponsibilities: prev.newResponsibilities.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeName) newErrors.employeeName = 'Employee name is required';
    if (!formData.currentPosition) newErrors.currentPosition = 'Current position is required';
    if (!formData.newPosition) newErrors.newPosition = 'New position is required';
    if (!formData.effectiveDate) newErrors.effectiveDate = 'Effective date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    if (action === 'submit' && !validateForm()) return;

    const dataToSave = {
      ...formData,
      status: action === 'submit' ? 'pending_approval' : 'draft',
    };

    console.log('Saving Promotion Letter:', dataToSave);
    navigate('/hr/performance/promotion-letter');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/performance/promotion-letter"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Promotion Letter' : 'New Promotion Letter'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 25: Formal notification of promotion
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isEdit && (
            <>
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Printer className="h-4 w-4" />
                Print
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </>
          )}
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
            Submit for Approval
          </button>
        </div>
      </div>

      {/* Workflow */}
      <PerformanceWorkflow currentStep="promotion" workflowType="promotion" />

      {/* Letter Preview & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Letter Details</h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Letter Header */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={formData.referenceNumber}
                  onChange={(e) => handleChange('referenceNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., VDO/HR/PROM/2026/001"
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

            {/* Employee Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Employee Information</h3>
              <div className="grid grid-cols-2 gap-4">
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
                    Current Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.currentPosition}
                    onChange={(e) => handleChange('currentPosition', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${errors.currentPosition ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="Enter current position"
                  />
                  {errors.currentPosition && <p className="mt-1 text-sm text-red-500">{errors.currentPosition}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department/Project
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter department"
                  />
                </div>
              </div>
            </div>

            {/* Promotion Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Promotion Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.newPosition}
                    onChange={(e) => handleChange('newPosition', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${errors.newPosition ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="Enter new position"
                  />
                  {errors.newPosition && <p className="mt-1 text-sm text-red-500">{errors.newPosition}</p>}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Revised Salary
                  </label>
                  <input
                    type="text"
                    value={formData.revisedSalary}
                    onChange={(e) => handleChange('revisedSalary', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., 50,000 AFN"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Salary Grade
                  </label>
                  <input
                    type="text"
                    value={formData.salaryGrade}
                    onChange={(e) => handleChange('salaryGrade', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Grade 5"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Allowances
                </label>
                <input
                  type="text"
                  value={formData.allowances}
                  onChange={(e) => handleChange('allowances', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Specify any allowances..."
                />
              </div>
            </div>

            {/* New Responsibilities */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  New Responsibilities
                </label>
                <button
                  type="button"
                  onClick={addResponsibility}
                  className="text-sm text-primary-500 hover:text-primary-600"
                >
                  + Add Responsibility
                </button>
              </div>
              <div className="space-y-2">
                {formData.newResponsibilities.map((resp, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                    <input
                      type="text"
                      value={resp}
                      onChange={(e) => updateResponsibility(index, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="Enter responsibility..."
                    />
                    {formData.newResponsibilities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeResponsibility(index)}
                        className="text-red-500 hover:text-red-600 p-1"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* References */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Feasibility Review Ref
                </label>
                <input
                  type="text"
                  value={formData.feasibilityReviewRef}
                  onChange={(e) => handleChange('feasibilityReviewRef', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Link to Form 23"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Performance Appraisal Ref
                </label>
                <input
                  type="text"
                  value={formData.appraisalRef}
                  onChange={(e) => handleChange('appraisalRef', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Link to Form 24"
                />
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Additional Remarks
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Any additional remarks..."
              />
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Approver</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.approverName}
                    onChange={(e) => handleChange('approverName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={formData.approverTitle}
                    onChange={(e) => handleChange('approverTitle', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    placeholder="Title (e.g., Executive Director)"
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.approverSigned}
                        onChange={(e) => handleChange('approverSigned', e.target.checked)}
                        className="rounded border-gray-300 text-primary-500"
                      />
                      <span className="text-sm">Signed</span>
                    </label>
                    {formData.approverSigned && (
                      <input
                        type="date"
                        value={formData.approverDate}
                        onChange={(e) => handleChange('approverDate', e.target.value)}
                        className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Employee Acknowledgment</h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Employee accepts promotion and new responsibilities
                  </p>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.employeeSigned}
                        onChange={(e) => handleChange('employeeSigned', e.target.checked)}
                        className="rounded border-gray-300 text-primary-500"
                      />
                      <span className="text-sm">Acknowledged</span>
                    </label>
                    {formData.employeeSigned && (
                      <input
                        type="date"
                        value={formData.employeeSignDate}
                        onChange={(e) => handleChange('employeeSignDate', e.target.value)}
                        className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Letter Preview */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Letter Preview</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">Live preview</span>
          </div>
          <div className="p-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-8 min-h-[600px] text-sm">
              {/* Letterhead */}
              <div className="text-center mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">VDO AFGHANISTAN</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Voice of Deprived Organization</p>
              </div>

              {/* Reference & Date */}
              <div className="flex justify-between mb-6 text-xs">
                <div>
                  <p><strong>Ref:</strong> {formData.referenceNumber || 'VDO/HR/PROM/____/___'}</p>
                </div>
                <div>
                  <p><strong>Date:</strong> {formData.letterDate || '____/____/____'}</p>
                </div>
              </div>

              {/* Subject */}
              <div className="mb-6">
                <p className="font-semibold text-gray-900 dark:text-white underline">
                  Subject: Promotion Letter
                </p>
              </div>

              {/* Recipient */}
              <div className="mb-6">
                <p>Dear <strong>{formData.employeeName || '[Employee Name]'}</strong>,</p>
              </div>

              {/* Body */}
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We are pleased to inform you that based on your excellent performance and demonstrated capabilities,
                  you have been promoted from <strong>{formData.currentPosition || '[Current Position]'}</strong> to{' '}
                  <strong>{formData.newPosition || '[New Position]'}</strong>, effective{' '}
                  <strong>{formData.effectiveDate || '[Date]'}</strong>.
                </p>

                {formData.newResponsibilities.some(r => r.trim()) && (
                  <div>
                    <p className="mb-2">Your new responsibilities will include:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      {formData.newResponsibilities.filter(r => r.trim()).map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {(formData.revisedSalary || formData.salaryGrade) && (
                  <p>
                    Your revised compensation package will be{' '}
                    {formData.revisedSalary && <><strong>{formData.revisedSalary}</strong></>}
                    {formData.revisedSalary && formData.salaryGrade && ' at '}
                    {formData.salaryGrade && <strong>{formData.salaryGrade}</strong>}
                    {formData.allowances && <>, with additional allowances: {formData.allowances}</>}.
                  </p>
                )}

                <p>
                  We congratulate you on this well-deserved promotion and look forward to your continued
                  contributions to VDO Afghanistan.
                </p>
              </div>

              {/* Signatures */}
              <div className="mt-12 flex justify-between">
                <div>
                  <p className="mb-8">Sincerely,</p>
                  <div className="border-t border-gray-300 pt-2 w-48">
                    <p className="font-semibold">{formData.approverName || '[Approver Name]'}</p>
                    <p className="text-xs text-gray-500">{formData.approverTitle || '[Title]'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="mb-8">Acknowledged by:</p>
                  <div className="border-t border-gray-300 pt-2 w-48">
                    <p className="font-semibold">{formData.employeeName || '[Employee Name]'}</p>
                    <p className="text-xs text-gray-500">Date: {formData.employeeSignDate || '____/____/____'}</p>
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

const PromotionLetterList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const letters = [
    {
      id: '1',
      referenceNumber: 'VDO/HR/PROM/2026/001',
      employeeName: 'Sara Mohammadi',
      currentPosition: 'Program Officer',
      newPosition: 'Senior Program Manager',
      effectiveDate: '2026-02-01',
      status: 'acknowledged',
    },
    {
      id: '2',
      referenceNumber: 'VDO/HR/PROM/2026/002',
      employeeName: 'Ahmad Karimi',
      currentPosition: 'Finance Assistant',
      newPosition: 'Finance Officer',
      effectiveDate: '2026-03-01',
      status: 'pending_approval',
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      pending_approval: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      acknowledged: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };
    const labels: Record<string, string> = {
      draft: 'Draft',
      pending_approval: 'Pending Approval',
      approved: 'Approved',
      acknowledged: 'Acknowledged',
    };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Promotion Letters</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 25: Formal promotion notifications</p>
        </div>
        <Link
          to="/hr/performance/promotion-letter/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Promotion Letter
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">New Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effective Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {letters.length > 0 ? (
              letters.map((letter) => (
                <tr key={letter.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{letter.referenceNumber}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{letter.employeeName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{letter.currentPosition}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{letter.newPosition}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{letter.effectiveDate}</td>
                  <td className="px-6 py-4">{getStatusBadge(letter.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/hr/performance/promotion-letter/${letter.id}`}
                      className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <Award className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No promotion letters found</p>
                  <Link
                    to="/hr/performance/promotion-letter/new"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                  >
                    <Plus className="h-4 w-4" />
                    Create Promotion Letter
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PromotionLetter = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <PromotionLetterFormComponent />;
  return <PromotionLetterList />;
};

export default PromotionLetter;
