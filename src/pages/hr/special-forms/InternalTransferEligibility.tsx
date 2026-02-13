import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Search, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface CriteriaCheck {
  criteria: string;
  result: 'yes' | 'no' | 'na';
  remarks: string;
}

interface TransferData {
  // Section 1 - Basic Information
  employeeName: string;
  employeeId: string;
  currentPosition: string;
  currentDepartment: string;
  proposedPosition: string;
  proposedDepartment: string;
  transferType: string[];
  requestInitiatedBy: string;
  requestDate: string;

  // Section 2 - Contract & Employment Status
  contractStatus: CriteriaCheck[];

  // Section 3 - Performance Check
  performanceCheck: CriteriaCheck[];

  // Section 4 - Qualification & Skills Match
  qualificationMatch: CriteriaCheck[];

  // Section 5 - Supervisor Feedback
  currentSupervisorName: string;
  supervisorFeedback: string;
  supervisorSignature: string;
  supervisorDate: string;

  // Section 6 - HR Assessment
  hrOfficerDocComplete: 'yes' | 'no';
  hrOfficerCriteriaReviewed: 'yes' | 'no';
  hrOfficerRecommendation: 'eligible' | 'not-eligible';
  hrOfficerSignature: string;
  hrOfficerDate: string;

  hrSpecialistSummary: string;
  hrSpecialistRecommendation: 'eligible' | 'not-eligible' | 'eligible-with-conditions';
  hrSpecialistSignature: string;
  hrSpecialistDate: string;

  // Section 7 - Approval
  approvalDecision: 'approved' | 'not-approved';
  effectiveDate: string;
  hrToIssue: string[];
}

const defaultContractStatus: CriteriaCheck[] = [
  { criteria: 'Valid employment contract', result: 'na', remarks: '' },
  { criteria: 'Contract allows transfer', result: 'na', remarks: '' },
  { criteria: 'Not under notice period', result: 'na', remarks: '' },
  { criteria: 'No active disciplinary process', result: 'na', remarks: '' },
  { criteria: 'Required clearances completed', result: 'na', remarks: '' },
];

const defaultPerformanceCheck: CriteriaCheck[] = [
  { criteria: 'Last appraisal meets VDO standards', result: 'na', remarks: '' },
  { criteria: 'Attendance acceptable', result: 'na', remarks: '' },
  { criteria: 'Behavioral standards met', result: 'na', remarks: '' },
];

const defaultQualificationMatch: CriteriaCheck[] = [
  { criteria: 'Education requirements met', result: 'na', remarks: '' },
  { criteria: 'Experience requirements met', result: 'na', remarks: '' },
  { criteria: 'Technical skills aligned with TOR', result: 'na', remarks: '' },
  { criteria: 'Language proficiency requirements met', result: 'na', remarks: '' },
  { criteria: 'Competencies aligned with new role', result: 'na', remarks: '' },
];

// List Component
const TransferList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const transfers = [
    { id: '1', employeeName: 'Ahmad Ahmadi', currentPosition: 'Project Officer', proposedPosition: 'Senior Project Officer', requestDate: '2024-01-15', status: 'pending' },
    { id: '2', employeeName: 'Fatima Rahimi', currentPosition: 'Finance Assistant', proposedPosition: 'Finance Officer', requestDate: '2024-01-10', status: 'approved' },
    { id: '3', employeeName: 'Mohammad Karimi', currentPosition: 'Field Coordinator', proposedPosition: 'Program Manager', requestDate: '2024-01-08', status: 'not-approved' },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (status === 'not-approved') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Internal Transfer Eligibility Reviews</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 39: Assess if employee qualifies for transfer</p>
        </div>
        <Link to="/hr/special-forms/transfer/new" className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> New Review
        </Link>
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="not-approved">Not Approved</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Current Position</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Proposed Position</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Request Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{transfer.employeeName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{transfer.currentPosition}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{transfer.proposedPosition}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{transfer.requestDate}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(transfer.status)}`}>
                      {transfer.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/hr/special-forms/transfer/${transfer.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
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
const TransferForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<TransferData>({
    employeeName: '',
    employeeId: '',
    currentPosition: '',
    currentDepartment: '',
    proposedPosition: '',
    proposedDepartment: '',
    transferType: [],
    requestInitiatedBy: '',
    requestDate: new Date().toISOString().split('T')[0],
    contractStatus: defaultContractStatus,
    performanceCheck: defaultPerformanceCheck,
    qualificationMatch: defaultQualificationMatch,
    currentSupervisorName: '',
    supervisorFeedback: '',
    supervisorSignature: '',
    supervisorDate: '',
    hrOfficerDocComplete: 'no',
    hrOfficerCriteriaReviewed: 'no',
    hrOfficerRecommendation: 'not-eligible',
    hrOfficerSignature: '',
    hrOfficerDate: '',
    hrSpecialistSummary: '',
    hrSpecialistRecommendation: 'not-eligible',
    hrSpecialistSignature: '',
    hrSpecialistDate: '',
    approvalDecision: 'not-approved',
    effectiveDate: '',
    hrToIssue: [],
  });

  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'contract', label: 'Contract Status' },
    { id: 'performance', label: 'Performance' },
    { id: 'qualification', label: 'Qualifications' },
    { id: 'supervisor', label: 'Supervisor' },
    { id: 'hr', label: 'HR Assessment' },
    { id: 'approval', label: 'Approval' },
  ];

  const transferTypes = [
    { value: 'department', label: 'Department Transfer' },
    { value: 'project', label: 'Project Transfer' },
    { value: 'duty-station', label: 'Duty Station Transfer' },
    { value: 'role', label: 'Role Transfer' },
  ];

  const updateCriteriaCheck = (
    section: 'contractStatus' | 'performanceCheck' | 'qualificationMatch',
    index: number,
    field: 'result' | 'remarks',
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleTransferTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      transferType: prev.transferType.includes(type)
        ? prev.transferType.filter(t => t !== type)
        : [...prev.transferType, type]
    }));
  };

  const handleHrToIssueChange = (item: string) => {
    setFormData(prev => ({
      ...prev,
      hrToIssue: prev.hrToIssue.includes(item)
        ? prev.hrToIssue.filter(i => i !== item)
        : [...prev.hrToIssue, item]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving transfer review:', formData);
    navigate('/hr/special-forms/transfer');
  };

  const CriteriaTable = ({
    section,
    sectionKey,
    title
  }: {
    section: CriteriaCheck[],
    sectionKey: 'contractStatus' | 'performanceCheck' | 'qualificationMatch',
    title: string
  }) => (
    <div>
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Criteria</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-32">Yes</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-32">No</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {section.map((item, index) => (
              <tr key={item.criteria}>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.criteria}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => updateCriteriaCheck(sectionKey, index, 'result', 'yes')}
                    className={`p-1.5 rounded-full transition-colors ${
                      item.result === 'yes'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-400 dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => updateCriteriaCheck(sectionKey, index, 'result', 'no')}
                    className={`p-1.5 rounded-full transition-colors ${
                      item.result === 'no'
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-400 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={item.remarks}
                    onChange={(e) => updateCriteriaCheck(sectionKey, index, 'remarks', e.target.value)}
                    placeholder="Add remarks..."
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/hr/special-forms/transfer" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNew ? 'New Transfer Eligibility Review' : 'Edit Transfer Eligibility Review'}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 39: Assess if employee qualifies for transfer</p>
        </div>
      </div>

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
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Section 1: Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Employee Name *</label>
                  <input
                    type="text"
                    value={formData.employeeName}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Employee ID *</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Position *</label>
                  <input
                    type="text"
                    value={formData.currentPosition}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPosition: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Department/Project *</label>
                  <input
                    type="text"
                    value={formData.currentDepartment}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentDepartment: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Proposed Position for Transfer *</label>
                  <input
                    type="text"
                    value={formData.proposedPosition}
                    onChange={(e) => setFormData(prev => ({ ...prev, proposedPosition: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Proposed Department/Duty Station *</label>
                  <input
                    type="text"
                    value={formData.proposedDepartment}
                    onChange={(e) => setFormData(prev => ({ ...prev, proposedDepartment: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type of Transfer *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {transferTypes.map((type) => (
                    <label key={type.value} className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <input
                        type="checkbox"
                        checked={formData.transferType.includes(type.value)}
                        onChange={() => handleTransferTypeChange(type.value)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Request Initiated By *</label>
                  <select
                    value={formData.requestInitiatedBy}
                    onChange={(e) => setFormData(prev => ({ ...prev, requestInitiatedBy: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="employee">Employee</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="hr">HR Department</option>
                    <option value="management">Management</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Request *</label>
                  <input
                    type="date"
                    value={formData.requestDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, requestDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contract Status Tab */}
          {activeTab === 'contract' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Section 2: Contract & Employment Status</h3>
              <CriteriaTable section={formData.contractStatus} sectionKey="contractStatus" title="Contract & Employment Criteria" />
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Section 3: Performance Check</h3>
              <CriteriaTable section={formData.performanceCheck} sectionKey="performanceCheck" title="Performance Indicators" />
            </div>
          )}

          {/* Qualification Tab */}
          {activeTab === 'qualification' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Section 4: Qualification & Skills Match</h3>
              <CriteriaTable section={formData.qualificationMatch} sectionKey="qualificationMatch" title="TOR Alignment Checklist" />
            </div>
          )}

          {/* Supervisor Tab */}
          {activeTab === 'supervisor' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Section 5: Supervisor Feedback</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Supervisor Name</label>
                  <input
                    type="text"
                    value={formData.currentSupervisorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentSupervisorName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.supervisorDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, supervisorDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Feedback on Suitability</label>
                <textarea
                  value={formData.supervisorFeedback}
                  onChange={(e) => setFormData(prev => ({ ...prev, supervisorFeedback: e.target.value }))}
                  rows={4}
                  placeholder="Provide feedback on employee's suitability for the proposed transfer..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Supervisor Signature</label>
                <input
                  type="text"
                  value={formData.supervisorSignature}
                  onChange={(e) => setFormData(prev => ({ ...prev, supervisorSignature: e.target.value }))}
                  placeholder="Type name as signature"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* HR Assessment Tab */}
          {activeTab === 'hr' && (
            <div className="p-6 space-y-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Section 6: HR Assessment</h3>

              {/* HR Officer Review */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">HR Officer Review</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Documentation Complete</label>
                    <select
                      value={formData.hrOfficerDocComplete}
                      onChange={(e) => setFormData(prev => ({ ...prev, hrOfficerDocComplete: e.target.value as 'yes' | 'no' }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">All Criteria Reviewed</label>
                    <select
                      value={formData.hrOfficerCriteriaReviewed}
                      onChange={(e) => setFormData(prev => ({ ...prev, hrOfficerCriteriaReviewed: e.target.value as 'yes' | 'no' }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Initial Recommendation</label>
                    <select
                      value={formData.hrOfficerRecommendation}
                      onChange={(e) => setFormData(prev => ({ ...prev, hrOfficerRecommendation: e.target.value as 'eligible' | 'not-eligible' }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="not-eligible">Not Eligible</option>
                      <option value="eligible">Eligible</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Signature</label>
                    <input
                      type="text"
                      value={formData.hrOfficerSignature}
                      onChange={(e) => setFormData(prev => ({ ...prev, hrOfficerSignature: e.target.value }))}
                      placeholder="Type name as signature"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.hrOfficerDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, hrOfficerDate: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* HR Specialist Evaluation */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">HR Specialist Evaluation</h4>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Summary of Suitability</label>
                  <textarea
                    value={formData.hrSpecialistSummary}
                    onChange={(e) => setFormData(prev => ({ ...prev, hrSpecialistSummary: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Final HR Recommendation</label>
                  <select
                    value={formData.hrSpecialistRecommendation}
                    onChange={(e) => setFormData(prev => ({ ...prev, hrSpecialistRecommendation: e.target.value as 'eligible' | 'not-eligible' | 'eligible-with-conditions' }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="not-eligible">Not Eligible</option>
                    <option value="eligible">Eligible</option>
                    <option value="eligible-with-conditions">Eligible with Conditions</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Signature</label>
                    <input
                      type="text"
                      value={formData.hrSpecialistSignature}
                      onChange={(e) => setFormData(prev => ({ ...prev, hrSpecialistSignature: e.target.value }))}
                      placeholder="Type name as signature"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.hrSpecialistDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, hrSpecialistDate: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Approval Tab */}
          {activeTab === 'approval' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Section 7: Approval</h3>

              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Decision</h4>
                <div className="flex gap-4">
                  <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    formData.approvalDecision === 'approved'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}>
                    <input
                      type="radio"
                      name="approval"
                      value="approved"
                      checked={formData.approvalDecision === 'approved'}
                      onChange={() => setFormData(prev => ({ ...prev, approvalDecision: 'approved' }))}
                      className="sr-only"
                    />
                    <CheckCircle className={`h-6 w-6 ${formData.approvalDecision === 'approved' ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Approved for Internal Transfer</span>
                  </label>
                  <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    formData.approvalDecision === 'not-approved'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}>
                    <input
                      type="radio"
                      name="approval"
                      value="not-approved"
                      checked={formData.approvalDecision === 'not-approved'}
                      onChange={() => setFormData(prev => ({ ...prev, approvalDecision: 'not-approved' }))}
                      className="sr-only"
                    />
                    <XCircle className={`h-6 w-6 ${formData.approvalDecision === 'not-approved' ? 'text-red-500' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Not Approved</span>
                  </label>
                </div>

                {formData.approvalDecision === 'approved' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Effective Date</label>
                    <input
                      type="date"
                      value={formData.effectiveDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}
              </div>

              {formData.approvalDecision === 'approved' && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">HR to Issue</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: 'transfer-letter', label: 'Transfer Letter' },
                      { value: 'contract-amendment', label: 'Contract Amendment' },
                      { value: 'duty-station-memo', label: 'Duty Station Change Memo' },
                    ].map((item) => (
                      <label key={item.value} className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <input
                          type="checkbox"
                          checked={formData.hrToIssue.includes(item.value)}
                          onChange={() => handleHrToIssueChange(item.value)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Link to="/hr/special-forms/transfer" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </Link>
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Save className="h-4 w-4" />
            Save Review
          </button>
        </div>
      </form>
    </div>
  );
};

// Main Component
const InternalTransferEligibility = () => {
  const { id } = useParams();
  return id ? <TransferForm /> : <TransferList />;
};

export default InternalTransferEligibility;
