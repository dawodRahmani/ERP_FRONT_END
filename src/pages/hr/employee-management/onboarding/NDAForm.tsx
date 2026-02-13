import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmployeeWorkflow, EmployeeInfoBanner } from '../components';

// ============================================================================
// FORM 55: NON-DISCLOSURE AGREEMENT (NDA)
// ============================================================================

interface NDAFormData {
  // Agreement Information
  agreementNumber: string;
  agreementDate: string;
  effectiveDate: string;

  // Employee Information
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  dateOfJoining: string;

  // Confidentiality Commitments
  commitments: {
    protectInfo: boolean;
    noDisclosure: boolean;
    properUseOnly: boolean;
    returnMaterials: boolean;
    reportBreaches: boolean;
    postEmployment: boolean;
    noCompeting: boolean;
    intellectualProperty: boolean;
    dataProtection: boolean;
    electronicSecurity: boolean;
  };

  // Agreement Terms
  agreementDuration: string;
  postTerminationPeriod: string;
  jurisdictionCountry: string;
  jurisdictionCity: string;

  // Witness Information
  witnessName: string;
  witnessPosition: string;
  witnessSignature: string;
  witnessSignatureDate: string;

  // Employee Signature
  employeeSignature: string;
  employeeSignatureDate: string;

  // Organization Representative
  orgRepName: string;
  orgRepPosition: string;
  orgRepSignature: string;
  orgRepSignatureDate: string;

  // Additional
  specialClauses: string;
  notes: string;
}

const initialFormData: NDAFormData = {
  agreementNumber: '',
  agreementDate: '',
  effectiveDate: '',
  employeeId: '',
  employeeName: '',
  position: '',
  department: '',
  dateOfJoining: '',
  commitments: {
    protectInfo: false,
    noDisclosure: false,
    properUseOnly: false,
    returnMaterials: false,
    reportBreaches: false,
    postEmployment: false,
    noCompeting: false,
    intellectualProperty: false,
    dataProtection: false,
    electronicSecurity: false,
  },
  agreementDuration: 'indefinite',
  postTerminationPeriod: '2-years',
  jurisdictionCountry: 'Afghanistan',
  jurisdictionCity: '',
  witnessName: '',
  witnessPosition: '',
  witnessSignature: '',
  witnessSignatureDate: '',
  employeeSignature: '',
  employeeSignatureDate: '',
  orgRepName: '',
  orgRepPosition: '',
  orgRepSignature: '',
  orgRepSignatureDate: '',
  specialClauses: '',
  notes: '',
};

const commitmentItems = [
  {
    key: 'protectInfo',
    label: 'Protect Confidential Information',
    text: 'I agree to protect all confidential information, trade secrets, and proprietary data belonging to the organization.',
  },
  {
    key: 'noDisclosure',
    label: 'Non-Disclosure',
    text: 'I will not disclose, publish, or otherwise reveal any confidential information to any third party without prior written authorization.',
  },
  {
    key: 'properUseOnly',
    label: 'Proper Use Only',
    text: 'I will use confidential information solely for the purpose of performing my duties and responsibilities within the organization.',
  },
  {
    key: 'returnMaterials',
    label: 'Return of Materials',
    text: 'Upon termination of employment, I will return all materials, documents, and data containing confidential information.',
  },
  {
    key: 'reportBreaches',
    label: 'Report Breaches',
    text: 'I will immediately report any suspected or actual breach of confidentiality to my supervisor or the appropriate authority.',
  },
  {
    key: 'postEmployment',
    label: 'Post-Employment Obligations',
    text: 'I understand that my confidentiality obligations continue even after termination of my employment.',
  },
  {
    key: 'noCompeting',
    label: 'Non-Competition',
    text: 'I will not use confidential information to compete with the organization or assist competitors during or after employment.',
  },
  {
    key: 'intellectualProperty',
    label: 'Intellectual Property',
    text: 'I acknowledge that all intellectual property created during my employment belongs to the organization.',
  },
  {
    key: 'dataProtection',
    label: 'Data Protection',
    text: 'I will comply with all data protection laws and regulations applicable to personal and sensitive information.',
  },
  {
    key: 'electronicSecurity',
    label: 'Electronic Security',
    text: 'I will maintain the security of all electronic systems, passwords, and access credentials.',
  },
];

export function NDAFormComponent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<NDAFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof NDAFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCommitmentChange = (key: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      commitments: {
        ...prev.commitments,
        [key]: checked,
      },
    }));
  };

  const handleAcceptAll = () => {
    const allChecked = Object.values(formData.commitments).every(v => v);
    const newState = !allChecked;

    setFormData(prev => ({
      ...prev,
      commitments: {
        protectInfo: newState,
        noDisclosure: newState,
        properUseOnly: newState,
        returnMaterials: newState,
        reportBreaches: newState,
        postEmployment: newState,
        noCompeting: newState,
        intellectualProperty: newState,
        dataProtection: newState,
        electronicSecurity: newState,
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.agreementNumber.trim()) newErrors.agreementNumber = 'Agreement number is required';
    if (!formData.agreementDate) newErrors.agreementDate = 'Agreement date is required';
    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
    if (!formData.employeeName.trim()) newErrors.employeeName = 'Employee name is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';

    const uncheckedItems = Object.entries(formData.commitments)
      .filter(([_, value]) => !value)
      .map(([key, _]) => key);

    if (uncheckedItems.length > 0) {
      newErrors.commitments = 'All commitment items must be accepted';
    }

    if (!formData.employeeSignature.trim()) newErrors.employeeSignature = 'Employee signature is required';
    if (!formData.employeeSignatureDate) newErrors.employeeSignatureDate = 'Employee signature date is required';
    if (!formData.orgRepName.trim()) newErrors.orgRepName = 'Organization representative name is required';
    if (!formData.orgRepSignature.trim()) newErrors.orgRepSignature = 'Organization representative signature is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      navigate('/hr/employee-management/onboarding/nda');
    }
  };

  const acceptedCount = Object.values(formData.commitments).filter(v => v).length;
  const totalCommitments = Object.keys(formData.commitments).length;
  const allAccepted = acceptedCount === totalCommitments;

  return (
    <div className="space-y-6">
      <EmployeeWorkflow currentStep="nda" workflowType="onboarding" />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Form 55: Non-Disclosure Agreement (NDA)
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Confidentiality Agreement for Employees
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
              Form 55
            </span>
          </div>
        </div>

        {/* Legal Notice Banner */}
        <div className="mx-6 mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                Legal Document
              </h4>
              <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-1">
                This Non-Disclosure Agreement is a legally binding document. By signing this agreement,
                you commit to protecting the organization's confidential information. Please read all
                terms carefully before signing.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Agreement Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Agreement Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Agreement Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.agreementNumber}
                  onChange={(e) => handleInputChange('agreementNumber', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.agreementNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="NDA-2024-001"
                />
                {errors.agreementNumber && <p className="text-red-500 text-xs mt-1">{errors.agreementNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Agreement Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.agreementDate}
                  onChange={(e) => handleInputChange('agreementDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.agreementDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.agreementDate && <p className="text-red-500 text-xs mt-1">{errors.agreementDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Effective Date
                </label>
                <input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Employee Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Employee Information (The "Recipient")</h3>
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
                  Date of Joining
                </label>
                <input
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Confidentiality Commitments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Confidentiality Commitments</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Review and accept all confidentiality terms ({acceptedCount}/{totalCommitments} accepted)
                </p>
              </div>
              <button
                type="button"
                onClick={handleAcceptAll}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  allAccepted
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {allAccepted ? 'Uncheck All' : 'Accept All Terms'}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(acceptedCount / totalCommitments) * 100}%` }}
                />
              </div>
            </div>

            {errors.commitments && (
              <p className="text-red-500 text-sm mb-4">{errors.commitments}</p>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {commitmentItems.map((item, index) => (
                <div
                  key={item.key}
                  className={`p-4 border rounded-lg transition-colors ${
                    formData.commitments[item.key as keyof typeof formData.commitments]
                      ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900/20'
                      : 'border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700'
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.commitments[item.key as keyof typeof formData.commitments]}
                      onChange={(e) => handleCommitmentChange(item.key, e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {index + 1}.
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.text}</p>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Agreement Terms */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Agreement Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Agreement Duration
                </label>
                <select
                  value={formData.agreementDuration}
                  onChange={(e) => handleInputChange('agreementDuration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="indefinite">Indefinite (During Employment)</option>
                  <option value="1-year">1 Year</option>
                  <option value="2-years">2 Years</option>
                  <option value="5-years">5 Years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Post-Termination Period
                </label>
                <select
                  value={formData.postTerminationPeriod}
                  onChange={(e) => handleInputChange('postTerminationPeriod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="1-year">1 Year</option>
                  <option value="2-years">2 Years</option>
                  <option value="3-years">3 Years</option>
                  <option value="5-years">5 Years</option>
                  <option value="indefinite">Indefinite</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Jurisdiction (Country)
                </label>
                <input
                  type="text"
                  value={formData.jurisdictionCountry}
                  onChange={(e) => handleInputChange('jurisdictionCountry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Jurisdiction (City)
                </label>
                <input
                  type="text"
                  value={formData.jurisdictionCity}
                  onChange={(e) => handleInputChange('jurisdictionCity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter city"
                />
              </div>
            </div>
          </div>

          {/* Special Clauses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Special Clauses or Conditions
            </label>
            <textarea
              value={formData.specialClauses}
              onChange={(e) => handleInputChange('specialClauses', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Any additional clauses or conditions specific to this agreement..."
            />
          </div>

          {/* Signatures Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Signatures</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Employee Signature */}
              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    1
                  </span>
                  Employee (Recipient)
                </h4>
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

              {/* Organization Representative */}
              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    2
                  </span>
                  Organization Representative
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.orgRepName}
                      onChange={(e) => handleInputChange('orgRepName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                        errors.orgRepName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter name"
                    />
                    {errors.orgRepName && <p className="text-red-500 text-xs mt-1">{errors.orgRepName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      value={formData.orgRepPosition}
                      onChange={(e) => handleInputChange('orgRepPosition', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter position"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Signature <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.orgRepSignature}
                      onChange={(e) => handleInputChange('orgRepSignature', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                        errors.orgRepSignature ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Type full name as signature"
                    />
                    {errors.orgRepSignature && <p className="text-red-500 text-xs mt-1">{errors.orgRepSignature}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.orgRepSignatureDate}
                      onChange={(e) => handleInputChange('orgRepSignatureDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Witness */}
              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                    3
                  </span>
                  Witness (Optional)
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.witnessName}
                      onChange={(e) => handleInputChange('witnessName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter witness name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      value={formData.witnessPosition}
                      onChange={(e) => handleInputChange('witnessPosition', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter position"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Signature
                    </label>
                    <input
                      type="text"
                      value={formData.witnessSignature}
                      onChange={(e) => handleInputChange('witnessSignature', e.target.value)}
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
                      value={formData.witnessSignatureDate}
                      onChange={(e) => handleInputChange('witnessSignatureDate', e.target.value)}
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
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Any additional notes..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/hr/employee-management/onboarding/nda')}
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
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {isEditMode ? 'Update Agreement' : 'Submit Agreement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function NDAFormList() {
  const navigate = useNavigate();

  const mockData = [
    { id: '1', agreementNumber: 'NDA-2024-001', employeeId: 'EMP-001', employeeName: 'Ahmad Khan', position: 'Field Officer', department: 'Programs', agreementDate: '2024-01-10', status: 'Active' },
    { id: '2', agreementNumber: 'NDA-2024-002', employeeId: 'EMP-002', employeeName: 'Fatima Rahimi', position: 'Finance Assistant', department: 'Finance', agreementDate: '2024-01-12', status: 'Active' },
    { id: '3', agreementNumber: 'NDA-2024-003', employeeId: 'EMP-003', employeeName: 'Mohammad Ali', position: 'Driver', department: 'Operations', agreementDate: '2024-01-15', status: 'Active' },
    { id: '4', agreementNumber: 'NDA-2024-004', employeeId: 'EMP-004', employeeName: 'Sarah Ahmadi', position: 'HR Officer', department: 'Human Resources', agreementDate: '', status: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      <EmployeeWorkflow currentStep="nda" workflowType="onboarding" />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Non-Disclosure Agreements (NDA)
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Confidentiality Agreements for Employees
              </p>
            </div>
            <button
              onClick={() => navigate('/hr/employee-management/onboarding/nda/new')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New NDA
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Agreement #
                </th>
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
                  Agreement Date
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {item.agreementNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.employeeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.employeeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {item.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {item.agreementDate || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      item.status === 'Active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => navigate(`/hr/employee-management/onboarding/nda/${item.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
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

export default function NDAForm() {
  const { id } = useParams();
  const isNewOrEdit = window.location.pathname.includes('/new') || id;

  return isNewOrEdit ? <NDAFormComponent /> : <NDAFormList />;
}
