import { useState } from 'react';
import {
  Plus,
  Search,
  FileText,
  ChevronLeft,
  Save,
  Send,
  AlertTriangle
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface ApprovalRecord {
  role: string;
  name: string;
  date: string;
  signature: boolean;
  comments: string;
}

interface SoleSourceData {
  positionTitle: string;
  departmentProject: string;
  dutyStation: string;
  employmentType: string;
  candidateName: string;
  justificationSummary: string;
  // Reasons for sole sourcing
  reasons: {
    urgentOperationalNeed: boolean;
    rareSpecializedSkills: boolean;
    securityAccessConstraints: boolean;
    continuityOfOngoingWork: boolean;
    donorRequirement: boolean;
    noQualifiedApplicants: boolean;
    other: boolean;
    otherDescription: string;
  };
  timelineRisk: string;
  marketAnalysis: string;
  coiCheckCompleted: boolean;
  salaryGradeVerified: boolean;
  cvAttached: boolean;
  // Approvals
  approvals: ApprovalRecord[];
  finalDecision: 'approved' | 'not_approved' | 'pending';
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
}

const SoleSourceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<SoleSourceData>({
    positionTitle: '',
    departmentProject: '',
    dutyStation: '',
    employmentType: 'project',
    candidateName: '',
    justificationSummary: '',
    reasons: {
      urgentOperationalNeed: false,
      rareSpecializedSkills: false,
      securityAccessConstraints: false,
      continuityOfOngoingWork: false,
      donorRequirement: false,
      noQualifiedApplicants: false,
      other: false,
      otherDescription: '',
    },
    timelineRisk: '',
    marketAnalysis: '',
    coiCheckCompleted: false,
    salaryGradeVerified: false,
    cvAttached: false,
    approvals: [
      { role: 'Hiring Manager', name: '', date: '', signature: false, comments: '' },
      { role: 'HR Manager', name: '', date: '', signature: false, comments: '' },
      { role: 'Finance', name: '', date: '', signature: false, comments: '' },
      { role: 'Compliance', name: '', date: '', signature: false, comments: '' },
      { role: 'Executive Director', name: '', date: '', signature: false, comments: '' },
    ],
    finalDecision: 'pending',
    status: 'draft',
  });

  const handleChange = (field: string, value: unknown) => {
    const keys = field.split('.');
    if (keys.length === 1) {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...(prev[keys[0] as keyof SoleSourceData] as Record<string, unknown>),
          [keys[1]]: value,
        },
      }));
    }
  };

  const updateApproval = (index: number, field: keyof ApprovalRecord, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      approvals: prev.approvals.map((a, i) => i === index ? { ...a, [field]: value } : a),
    }));
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    console.log('Saving Sole Source Justification:', formData);
    navigate('/hr/recruitment/sole-source');
  };

  const employmentTypes = [
    { value: 'core', label: 'Core (Permanent)' },
    { value: 'project', label: 'Project-based' },
    { value: 'consultant', label: 'Consultant' },
    { value: 'part_time', label: 'Part-time' },
  ];

  const reasonLabels: Record<string, string> = {
    urgentOperationalNeed: 'Urgent operational need',
    rareSpecializedSkills: 'Rare/specialized skills required',
    securityAccessConstraints: 'Security/access constraints',
    continuityOfOngoingWork: 'Continuity of ongoing work',
    donorRequirement: 'Donor requirement',
    noQualifiedApplicants: 'No qualified applicants from previous recruitment',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/recruitment/sole-source"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Sole Source Justification' : 'New Sole Source Justification'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 38: Justify hiring without competitive process
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit('save')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
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

      {/* Warning Banner */}
      <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Sole source recruitment requires strong justification and ED approval. Use only when competitive recruitment is not feasible.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Position Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Position Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.positionTitle}
                  onChange={(e) => handleChange('positionTitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department/Project <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.departmentProject}
                  onChange={(e) => handleChange('departmentProject', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
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
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employment Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => handleChange('employmentType', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  {employmentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Candidate Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.candidateName}
                  onChange={(e) => handleChange('candidateName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Justification */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Justification</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Justification Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.justificationSummary}
                onChange={(e) => handleChange('justificationSummary', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                placeholder="Provide a detailed justification for why sole source recruitment is necessary..."
              />
            </div>
          </div>

          {/* Reasons */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reason for Sole Sourcing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(reasonLabels).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <input
                    type="checkbox"
                    checked={formData.reasons[key as keyof typeof formData.reasons] as boolean}
                    onChange={(e) => handleChange(`reasons.${key}`, e.target.checked)}
                    className="rounded border-gray-300 text-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              ))}
              <div className="md:col-span-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.reasons.other}
                    onChange={(e) => handleChange('reasons.other', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Other</span>
                </label>
                {formData.reasons.other && (
                  <input
                    type="text"
                    value={formData.reasons.otherDescription}
                    onChange={(e) => handleChange('reasons.otherDescription', e.target.value)}
                    placeholder="Please specify..."
                    className="mt-2 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Risk & Analysis */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk & Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Timeline Risk <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.timelineRisk}
                  onChange={(e) => handleChange('timelineRisk', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="What are the risks if competitive recruitment is used?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Market Analysis
                </label>
                <textarea
                  value={formData.marketAnalysis}
                  onChange={(e) => handleChange('marketAnalysis', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="Describe the labor market situation for this role..."
                />
              </div>
            </div>
          </div>

          {/* Verification Checks */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Verification Checks</h2>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.coiCheckCompleted}
                  onChange={(e) => handleChange('coiCheckCompleted', e.target.checked)}
                  className="rounded border-gray-300 text-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">COI Check Completed</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.salaryGradeVerified}
                  onChange={(e) => handleChange('salaryGradeVerified', e.target.checked)}
                  className="rounded border-gray-300 text-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Salary Grade Verified</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.cvAttached}
                  onChange={(e) => handleChange('cvAttached', e.target.checked)}
                  className="rounded border-gray-300 text-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">CV Attached</span>
              </label>
            </div>
          </div>

          {/* Approval Table */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Approval Chain</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Signed</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {formData.approvals.map((approval, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{approval.role}</td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={approval.name}
                          onChange={(e) => updateApproval(index, 'name', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="date"
                          value={approval.date}
                          onChange={(e) => updateApproval(index, 'date', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={approval.signature}
                          onChange={(e) => updateApproval(index, 'signature', e.target.checked)}
                          className="rounded border-gray-300 text-primary-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={approval.comments}
                          onChange={(e) => updateApproval(index, 'comments', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Final Decision */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Final Decision</h2>
            <div className="flex gap-4">
              {['approved', 'not_approved', 'pending'].map(decision => (
                <label key={decision} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.finalDecision === decision}
                    onChange={() => handleChange('finalDecision', decision)}
                    className="text-primary-500"
                  />
                  <span className="text-sm capitalize">{decision.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SoleSourceList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sole Source Justifications</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 38: Non-competitive hiring justifications</p>
        </div>
        <Link
          to="/hr/recruitment/sole-source/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Justification
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by position or candidate..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Decision</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600">No sole source justifications found</p>
                <Link
                  to="/hr/recruitment/sole-source/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                >
                  <Plus className="h-4 w-4" />
                  Create Justification
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SoleSourceJustification = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <SoleSourceForm />;
  return <SoleSourceList />;
};

export default SoleSourceJustification;
