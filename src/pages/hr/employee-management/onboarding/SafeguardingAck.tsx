import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmployeeWorkflow, EmployeeInfoBanner } from '../components';

// ============================================================================
// FORM 53: SAFEGUARDING/PSEAH ACKNOWLEDGEMENT
// ============================================================================

interface SafeguardingFormData {
  // Employee Information
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  dateOfJoining: string;

  // Acknowledgement Statements
  acknowledgements: {
    readPolicy: boolean;
    understandDefinitions: boolean;
    reportingProcedures: boolean;
    zeroTolerance: boolean;
    commitToUphold: boolean;
    confidentiality: boolean;
    noRetaliation: boolean;
    ongoingTraining: boolean;
    consequencesUnderstood: boolean;
    reportObligations: boolean;
  };

  // Declaration
  declarationConfirmed: boolean;

  // Signatures
  employeeSignature: string;
  employeeSignatureDate: string;
  hrOfficerName: string;
  hrOfficerSignature: string;
  hrOfficerSignatureDate: string;

  // Additional Notes
  trainingCompleted: boolean;
  trainingDate: string;
  notes: string;
}

const initialFormData: SafeguardingFormData = {
  employeeId: '',
  employeeName: '',
  position: '',
  department: '',
  dateOfJoining: '',
  acknowledgements: {
    readPolicy: false,
    understandDefinitions: false,
    reportingProcedures: false,
    zeroTolerance: false,
    commitToUphold: false,
    confidentiality: false,
    noRetaliation: false,
    ongoingTraining: false,
    consequencesUnderstood: false,
    reportObligations: false,
  },
  declarationConfirmed: false,
  employeeSignature: '',
  employeeSignatureDate: '',
  hrOfficerName: '',
  hrOfficerSignature: '',
  hrOfficerSignatureDate: '',
  trainingCompleted: false,
  trainingDate: '',
  notes: '',
};

const acknowledgementItems = [
  {
    key: 'readPolicy',
    label: 'Policy Review',
    text: 'I have read and understood the organization\'s Safeguarding and Protection from Sexual Exploitation, Abuse, and Harassment (PSEAH) Policy.',
  },
  {
    key: 'understandDefinitions',
    label: 'Definitions',
    text: 'I understand the definitions of sexual exploitation, sexual abuse, and sexual harassment as outlined in the policy.',
  },
  {
    key: 'reportingProcedures',
    label: 'Reporting',
    text: 'I am aware of the reporting procedures and know how to report any concerns or incidents through appropriate channels.',
  },
  {
    key: 'zeroTolerance',
    label: 'Zero Tolerance',
    text: 'I understand that the organization maintains a zero-tolerance approach to sexual exploitation, abuse, and harassment.',
  },
  {
    key: 'commitToUphold',
    label: 'Commitment',
    text: 'I commit to upholding the highest standards of personal and professional conduct in line with this policy.',
  },
  {
    key: 'confidentiality',
    label: 'Confidentiality',
    text: 'I understand the importance of maintaining confidentiality in safeguarding matters and will handle sensitive information appropriately.',
  },
  {
    key: 'noRetaliation',
    label: 'No Retaliation',
    text: 'I understand that retaliation against anyone who reports concerns in good faith is prohibited and will result in disciplinary action.',
  },
  {
    key: 'ongoingTraining',
    label: 'Training',
    text: 'I agree to participate in mandatory safeguarding training sessions and refresher courses as required.',
  },
  {
    key: 'consequencesUnderstood',
    label: 'Consequences',
    text: 'I understand that violations of this policy may result in disciplinary action, up to and including termination of employment.',
  },
  {
    key: 'reportObligations',
    label: 'Obligations',
    text: 'I understand my obligation to report any suspected or actual violations of this policy, whether involving myself or others.',
  },
];

export function SafeguardingAckForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<SafeguardingFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof SafeguardingFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAcknowledgementChange = (key: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      acknowledgements: {
        ...prev.acknowledgements,
        [key]: checked,
      },
    }));
  };

  const handleAcknowledgeAll = () => {
    const allChecked = Object.values(formData.acknowledgements).every(v => v);
    const newState = !allChecked;

    setFormData(prev => ({
      ...prev,
      acknowledgements: {
        readPolicy: newState,
        understandDefinitions: newState,
        reportingProcedures: newState,
        zeroTolerance: newState,
        commitToUphold: newState,
        confidentiality: newState,
        noRetaliation: newState,
        ongoingTraining: newState,
        consequencesUnderstood: newState,
        reportObligations: newState,
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
    if (!formData.employeeName.trim()) newErrors.employeeName = 'Employee name is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.dateOfJoining) newErrors.dateOfJoining = 'Date of joining is required';

    const uncheckedItems = Object.entries(formData.acknowledgements)
      .filter(([_, value]) => !value)
      .map(([key, _]) => key);

    if (uncheckedItems.length > 0) {
      newErrors.acknowledgements = 'All acknowledgement items must be checked';
    }

    if (!formData.declarationConfirmed) {
      newErrors.declarationConfirmed = 'Declaration must be confirmed';
    }

    if (!formData.employeeSignature.trim()) newErrors.employeeSignature = 'Employee signature is required';
    if (!formData.employeeSignatureDate) newErrors.employeeSignatureDate = 'Employee signature date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      navigate('/hr/employee-management/onboarding/safeguarding');
    }
  };

  const acknowledgedCount = Object.values(formData.acknowledgements).filter(v => v).length;
  const totalAcknowledgements = Object.keys(formData.acknowledgements).length;
  const allAcknowledged = acknowledgedCount === totalAcknowledgements;

  return (
    <div className="space-y-6">
      <EmployeeWorkflow currentStep="safeguarding" workflowType="onboarding" />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Form 53: Safeguarding/PSEAH Acknowledgement
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Protection from Sexual Exploitation, Abuse, and Harassment Policy Acknowledgement
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
              Form 53
            </span>
          </div>
        </div>

        {/* Important Notice Banner */}
        <div className="mx-6 mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-purple-800 dark:text-purple-300">
                Safeguarding Commitment
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                This acknowledgement confirms your understanding of and commitment to the organization's safeguarding
                policies. All staff members are required to complete this form as part of their onboarding process.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Employee Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Employee Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.employeeId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter employee ID"
                />
                {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => handleInputChange('employeeName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.employeeName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.employeeName && <p className="text-red-500 text-xs mt-1">{errors.employeeName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.position ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter position"
                />
                {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.department ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter department"
                />
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date of Joining <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.dateOfJoining ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.dateOfJoining && <p className="text-red-500 text-xs mt-1">{errors.dateOfJoining}</p>}
              </div>
            </div>
          </div>

          {/* Acknowledgement Statements */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Acknowledgement Statements</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Please read and acknowledge each statement ({acknowledgedCount}/{totalAcknowledgements} completed)
                </p>
              </div>
              <button
                type="button"
                onClick={handleAcknowledgeAll}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  allAcknowledged
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {allAcknowledged ? 'Uncheck All' : 'Acknowledge All'}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(acknowledgedCount / totalAcknowledgements) * 100}%` }}
                />
              </div>
            </div>

            {errors.acknowledgements && (
              <p className="text-red-500 text-sm mb-4">{errors.acknowledgements}</p>
            )}

            <div className="space-y-3">
              {acknowledgementItems.map((item) => (
                <div
                  key={item.key}
                  className={`p-4 border rounded-lg transition-colors ${
                    formData.acknowledgements[item.key as keyof typeof formData.acknowledgements]
                      ? 'border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20'
                      : 'border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700'
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.acknowledgements[item.key as keyof typeof formData.acknowledgements]}
                      onChange={(e) => handleAcknowledgementChange(item.key, e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300 mb-1">
                        {item.label}
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{item.text}</p>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Declaration */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Declaration</h3>
            <div className={`p-4 border-2 rounded-lg ${
              formData.declarationConfirmed
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.declarationConfirmed}
                  onChange={(e) => handleInputChange('declarationConfirmed', e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    I hereby declare that:
                  </p>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                    <li>I have read and fully understood the Safeguarding and PSEAH Policy</li>
                    <li>I agree to comply with all provisions of this policy</li>
                    <li>I understand the consequences of violating this policy</li>
                    <li>I will report any concerns or incidents through proper channels</li>
                    <li>I acknowledge that this form will be kept in my personnel file</li>
                  </ul>
                </div>
              </label>
            </div>
            {errors.declarationConfirmed && (
              <p className="text-red-500 text-sm mt-2">{errors.declarationConfirmed}</p>
            )}
          </div>

          {/* Training Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Training Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="trainingCompleted"
                  checked={formData.trainingCompleted}
                  onChange={(e) => handleInputChange('trainingCompleted', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="trainingCompleted" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Safeguarding Training Completed
                </label>
              </div>

              {formData.trainingCompleted && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Training Date
                  </label>
                  <input
                    type="date"
                    value={formData.trainingDate}
                    onChange={(e) => handleInputChange('trainingDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Signatures */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Signatures</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee Signature */}
              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Employee Signature</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Signature <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.employeeSignature}
                      onChange={(e) => handleInputChange('employeeSignature', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                        errors.employeeSignature ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Type full name as signature"
                    />
                    {errors.employeeSignature && <p className="text-red-500 text-xs mt-1">{errors.employeeSignature}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.employeeSignatureDate}
                      onChange={(e) => handleInputChange('employeeSignatureDate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                        errors.employeeSignatureDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.employeeSignatureDate && <p className="text-red-500 text-xs mt-1">{errors.employeeSignatureDate}</p>}
                  </div>
                </div>
              </div>

              {/* HR Officer Signature */}
              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">HR Officer Signature</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      HR Officer Name
                    </label>
                    <input
                      type="text"
                      value={formData.hrOfficerName}
                      onChange={(e) => handleInputChange('hrOfficerName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter HR officer name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Signature
                    </label>
                    <input
                      type="text"
                      value={formData.hrOfficerSignature}
                      onChange={(e) => handleInputChange('hrOfficerSignature', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Type full name as signature"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.hrOfficerSignatureDate}
                      onChange={(e) => handleInputChange('hrOfficerSignatureDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Any additional notes or observations..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/hr/employee-management/onboarding/safeguarding')}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setFormData(initialFormData)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {isEditMode ? 'Update Acknowledgement' : 'Submit Acknowledgement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SafeguardingAckList() {
  const navigate = useNavigate();

  const mockData = [
    { id: '1', employeeId: 'EMP-001', employeeName: 'Ahmad Khan', position: 'Field Officer', department: 'Programs', dateCompleted: '2024-01-10', status: 'Completed' },
    { id: '2', employeeId: 'EMP-002', employeeName: 'Fatima Rahimi', position: 'Finance Assistant', department: 'Finance', dateCompleted: '2024-01-12', status: 'Completed' },
    { id: '3', employeeId: 'EMP-003', employeeName: 'Mohammad Ali', position: 'Driver', department: 'Operations', dateCompleted: '2024-01-15', status: 'Completed' },
    { id: '4', employeeId: 'EMP-004', employeeName: 'Sarah Ahmadi', position: 'HR Officer', department: 'Human Resources', dateCompleted: '', status: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      <EmployeeWorkflow currentStep="safeguarding" workflowType="onboarding" />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Safeguarding/PSEAH Acknowledgements
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Protection from Sexual Exploitation, Abuse, and Harassment Policy Acknowledgements
              </p>
            </div>
            <button
              onClick={() => navigate('/hr/employee-management/onboarding/safeguarding/new')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Acknowledgement
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Employee Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.employeeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.employeeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {item.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {item.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {item.dateCompleted || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      item.status === 'Completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => navigate(`/hr/employee-management/onboarding/safeguarding/${item.id}`)}
                      className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function SafeguardingAck() {
  const { id } = useParams();
  const isNewOrEdit = window.location.pathname.includes('/new') || id;

  return isNewOrEdit ? <SafeguardingAckForm /> : <SafeguardingAckList />;
}
