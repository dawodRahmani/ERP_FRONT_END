import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Search, Filter, AlertTriangle, CheckCircle, XCircle, Briefcase } from 'lucide-react';

interface DualEmploymentData {
  // Employee Information
  fullName: string;
  jobTitle: string;
  department: string;
  vdoContractStartDate: string;
  vdoContractEndDate: string;

  // Secondary Employment Details
  secondaryOrgName: string;
  secondaryJobTitle: string;
  secondaryDepartment: string;
  secondaryMonthlyIncome: number;
  secondaryContractStartDate: string;
  secondaryContractEndDate: string;
  secondaryWorkSchedule: 'part-time' | 'full-time';

  // Employee Declaration
  declarationAcknowledged: boolean;
  employeeSignature: string;
  employeeSignatureDate: string;

  // HR Review
  hasConflictOfInterest: 'yes' | 'no' | 'pending';
  conflictExplanation: string;
  dataPrivacyConcerns: string;
  documentSharingConcerns: string;
  intellectualPropertyConflicts: string;

  // Verification
  verifiedByName: string;
  verifiedByPosition: string;
  verifiedBySignature: string;
  verifiedDate: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
}

// List Component
const DeclarationList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const declarations = [
    { id: '1', fullName: 'Ahmad Ahmadi', secondaryOrgName: 'ABC Consulting', workSchedule: 'part-time', submittedDate: '2024-01-15', status: 'approved' },
    { id: '2', fullName: 'Fatima Rahimi', secondaryOrgName: 'XYZ Foundation', workSchedule: 'part-time', submittedDate: '2024-01-10', status: 'pending' },
    { id: '3', fullName: 'Mohammad Karimi', secondaryOrgName: 'DEF Institute', workSchedule: 'part-time', submittedDate: '2024-01-08', status: 'rejected' },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (status === 'rejected') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    if (status === 'draft') return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dual Employment Declarations</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 54: Disclose secondary employment</p>
        </div>
        <Link to="/hr/special-forms/dual-employment/new" className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> New Declaration
        </Link>
      </div>

      {/* Info Alert */}
      <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Important Notice</h4>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              All employees engaged in secondary employment must submit a declaration for HR review to ensure no conflict of interest with VDO activities.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by employee name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Secondary Organization</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Work Schedule</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Submitted Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {declarations.map((declaration) => (
                <tr key={declaration.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{declaration.fullName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{declaration.secondaryOrgName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 capitalize">{declaration.workSchedule}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{declaration.submittedDate}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(declaration.status)}`}>
                      {declaration.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/hr/special-forms/dual-employment/${declaration.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Link to="/hr/special-forms" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700">
        <ArrowLeft className="h-4 w-4" /> Back to Special Forms
      </Link>
    </div>
  );
};

// Form Component
const DeclarationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<DualEmploymentData>({
    fullName: '',
    jobTitle: '',
    department: '',
    vdoContractStartDate: '',
    vdoContractEndDate: '',
    secondaryOrgName: '',
    secondaryJobTitle: '',
    secondaryDepartment: '',
    secondaryMonthlyIncome: 0,
    secondaryContractStartDate: '',
    secondaryContractEndDate: '',
    secondaryWorkSchedule: 'part-time',
    declarationAcknowledged: false,
    employeeSignature: '',
    employeeSignatureDate: new Date().toISOString().split('T')[0],
    hasConflictOfInterest: 'pending',
    conflictExplanation: '',
    dataPrivacyConcerns: '',
    documentSharingConcerns: '',
    intellectualPropertyConflicts: '',
    verifiedByName: '',
    verifiedByPosition: '',
    verifiedBySignature: '',
    verifiedDate: '',
    status: 'draft',
  });

  const [activeTab, setActiveTab] = useState('employee');

  const tabs = [
    { id: 'employee', label: 'Employee Info' },
    { id: 'secondary', label: 'Secondary Employment' },
    { id: 'declaration', label: 'Declaration' },
    { id: 'review', label: 'HR Review' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving dual employment declaration:', formData);
    navigate('/hr/special-forms/dual-employment');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/hr/special-forms/dual-employment" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNew ? 'New Dual Employment Declaration' : 'Edit Dual Employment Declaration'}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 54: Disclose secondary employment</p>
        </div>
      </div>

      {/* Status Card */}
      {formData.hasConflictOfInterest !== 'pending' && (
        <div className={`rounded-lg border p-4 ${
          formData.hasConflictOfInterest === 'no'
            ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
            : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
        }`}>
          <div className="flex items-center gap-3">
            {formData.hasConflictOfInterest === 'no' ? (
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            )}
            <div>
              <h4 className={`text-sm font-medium ${
                formData.hasConflictOfInterest === 'no'
                  ? 'text-green-800 dark:text-green-300'
                  : 'text-red-800 dark:text-red-300'
              }`}>
                {formData.hasConflictOfInterest === 'no' ? 'No Conflict of Interest Identified' : 'Conflict of Interest Identified'}
              </h4>
              <p className={`text-sm mt-1 ${
                formData.hasConflictOfInterest === 'no'
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-red-700 dark:text-red-400'
              }`}>
                {formData.hasConflictOfInterest === 'no'
                  ? 'The secondary employment has been reviewed and approved.'
                  : 'Please review the HR comments below for more information.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          {/* Employee Info Tab */}
          {activeTab === 'employee' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Employee Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Programs">Programs</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="HR">Human Resources</option>
                    <option value="Admin">Administration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">VDO Contract Start Date *</label>
                  <input
                    type="date"
                    value={formData.vdoContractStartDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, vdoContractStartDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">VDO Contract End Date *</label>
                  <input
                    type="date"
                    value={formData.vdoContractEndDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, vdoContractEndDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Secondary Employment Tab */}
          {activeTab === 'secondary' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Secondary Employment Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Organization Name *</label>
                  <input
                    type="text"
                    value={formData.secondaryOrgName}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryOrgName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={formData.secondaryJobTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryJobTitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
                  <input
                    type="text"
                    value={formData.secondaryDepartment}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryDepartment: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Income</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={formData.secondaryMonthlyIncome || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, secondaryMonthlyIncome: parseFloat(e.target.value) || 0 }))}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contract Start Date *</label>
                  <input
                    type="date"
                    value={formData.secondaryContractStartDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryContractStartDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contract End Date</label>
                  <input
                    type="date"
                    value={formData.secondaryContractEndDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryContractEndDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Work Schedule *</label>
                <div className="flex gap-4">
                  <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors flex-1 ${
                    formData.secondaryWorkSchedule === 'part-time'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}>
                    <input
                      type="radio"
                      name="workSchedule"
                      value="part-time"
                      checked={formData.secondaryWorkSchedule === 'part-time'}
                      onChange={() => setFormData(prev => ({ ...prev, secondaryWorkSchedule: 'part-time' }))}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.secondaryWorkSchedule === 'part-time'
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-400'
                    }`}>
                      {formData.secondaryWorkSchedule === 'part-time' && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Part-time</span>
                  </label>
                  <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors flex-1 ${
                    formData.secondaryWorkSchedule === 'full-time'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}>
                    <input
                      type="radio"
                      name="workSchedule"
                      value="full-time"
                      checked={formData.secondaryWorkSchedule === 'full-time'}
                      onChange={() => setFormData(prev => ({ ...prev, secondaryWorkSchedule: 'full-time' }))}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.secondaryWorkSchedule === 'full-time'
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-400'
                    }`}>
                      {formData.secondaryWorkSchedule === 'full-time' && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Full-time</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Declaration Tab */}
          {activeTab === 'declaration' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Employee Declaration</h3>

              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Declaration Statement</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3">
                  <p>I hereby declare that:</p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>The information provided about my secondary employment is true and complete.</li>
                    <li>I understand that this secondary employment should not interfere with my primary duties at VDO.</li>
                    <li>I will not use VDO resources, time, or proprietary information for my secondary employment.</li>
                    <li>I will promptly notify HR of any changes to my secondary employment status.</li>
                    <li>I understand that any conflict of interest may result in disciplinary action.</li>
                    <li>I will maintain confidentiality of VDO information in all circumstances.</li>
                  </ul>
                </div>
              </div>

              <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <input
                  type="checkbox"
                  checked={formData.declarationAcknowledged}
                  onChange={(e) => setFormData(prev => ({ ...prev, declarationAcknowledged: e.target.checked }))}
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  I have read and understood the above declaration, and I confirm that all information provided is accurate and complete.
                </span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Employee Signature *</label>
                  <input
                    type="text"
                    value={formData.employeeSignature}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeSignature: e.target.value }))}
                    placeholder="Type your full name as signature"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.employeeSignatureDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeSignatureDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* HR Review Tab */}
          {activeTab === 'review' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">HR Review</h3>

              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Conflict of Interest with VDO?</label>
                  <div className="flex gap-4">
                    <label className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.hasConflictOfInterest === 'no'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}>
                      <input
                        type="radio"
                        name="conflict"
                        value="no"
                        checked={formData.hasConflictOfInterest === 'no'}
                        onChange={() => setFormData(prev => ({ ...prev, hasConflictOfInterest: 'no' }))}
                        className="sr-only"
                      />
                      <CheckCircle className={`h-5 w-5 ${formData.hasConflictOfInterest === 'no' ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">No</span>
                    </label>
                    <label className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.hasConflictOfInterest === 'yes'
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}>
                      <input
                        type="radio"
                        name="conflict"
                        value="yes"
                        checked={formData.hasConflictOfInterest === 'yes'}
                        onChange={() => setFormData(prev => ({ ...prev, hasConflictOfInterest: 'yes' }))}
                        className="sr-only"
                      />
                      <XCircle className={`h-5 w-5 ${formData.hasConflictOfInterest === 'yes' ? 'text-red-500' : 'text-gray-400'}`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Yes</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Explanation</label>
                  <textarea
                    value={formData.conflictExplanation}
                    onChange={(e) => setFormData(prev => ({ ...prev, conflictExplanation: e.target.value }))}
                    rows={3}
                    placeholder="Provide explanation if conflict exists..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Privacy Concerns</label>
                  <textarea
                    value={formData.dataPrivacyConcerns}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataPrivacyConcerns: e.target.value }))}
                    rows={2}
                    placeholder="Any data privacy concerns..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Document Sharing Concerns</label>
                  <textarea
                    value={formData.documentSharingConcerns}
                    onChange={(e) => setFormData(prev => ({ ...prev, documentSharingConcerns: e.target.value }))}
                    rows={2}
                    placeholder="Any document sharing concerns..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Intellectual Property Conflicts</label>
                  <textarea
                    value={formData.intellectualPropertyConflicts}
                    onChange={(e) => setFormData(prev => ({ ...prev, intellectualPropertyConflicts: e.target.value }))}
                    rows={2}
                    placeholder="Any intellectual property conflicts..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Verification */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Verified By</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.verifiedByName}
                      onChange={(e) => setFormData(prev => ({ ...prev, verifiedByName: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Position</label>
                    <input
                      type="text"
                      value={formData.verifiedByPosition}
                      onChange={(e) => setFormData(prev => ({ ...prev, verifiedByPosition: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Signature & Stamp</label>
                    <input
                      type="text"
                      value={formData.verifiedBySignature}
                      onChange={(e) => setFormData(prev => ({ ...prev, verifiedBySignature: e.target.value }))}
                      placeholder="Type name as signature"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.verifiedDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, verifiedDate: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Link to="/hr/special-forms/dual-employment" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Save as Draft
          </button>
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Save className="h-4 w-4" />
            Submit Declaration
          </button>
        </div>
      </form>
    </div>
  );
};

// Main Component
const DualEmploymentDeclaration = () => {
  const { id } = useParams();
  return id ? <DeclarationForm /> : <DeclarationList />;
};

export default DualEmploymentDeclaration;
