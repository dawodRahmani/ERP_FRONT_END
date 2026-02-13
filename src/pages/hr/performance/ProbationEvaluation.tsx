import { useState } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  Save,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PerformanceWorkflow } from './components/PerformanceWorkflow';

interface LineManagerAssessment {
  criteria: string;
  rating: number | null;
  evidence: string;
}

interface ProbationEvaluationData {
  // Admin Details
  employeeName: string;
  employeeId: string;
  position: string;
  department: string;
  contractDetails: string;
  supervisor: string;
  appraisalCommittee: string;
  probationStartDate: string;
  probationEndDate: string;

  // Section A: Line Manager Assessment
  lineManagerAssessment: LineManagerAssessment[];

  // Section B: Appraisal Committee Review
  overallPerformanceRating: string;
  behaviorAndValues: string;
  suitabilityForEmployment: string;
  riskAssessment: string;
  committeeRecommendation: 'confirm' | 'extend' | 'terminate' | '';

  // Section C: HR Recommendation
  hrReviewNotes: string;
  hrRecommendation: 'confirm' | 'extend_with_pip' | 'terminate' | '';
  hrSpecialistName: string;
  hrSpecialistSigned: boolean;
  hrSpecialistDate: string;

  // Section D: ED/DD Approval
  finalDecision: 'confirm' | 'extend' | 'terminate' | '';
  finalDecisionRemarks: string;
  approverName: string;
  approverSigned: boolean;
  approverDate: string;

  status: 'draft' | 'pending_committee' | 'pending_hr' | 'pending_approval' | 'completed';
}

const defaultLineManagerCriteria: LineManagerAssessment[] = [
  { criteria: 'Job Knowledge', rating: null, evidence: '' },
  { criteria: 'Work Quality and Accuracy', rating: null, evidence: '' },
  { criteria: 'Productivity and Timeliness', rating: null, evidence: '' },
  { criteria: 'Attendance and Punctuality', rating: null, evidence: '' },
  { criteria: 'Communication Skills', rating: null, evidence: '' },
  { criteria: 'Professional Conduct', rating: null, evidence: '' },
  { criteria: 'Teamwork', rating: null, evidence: '' },
  { criteria: 'Adaptability', rating: null, evidence: '' },
  { criteria: 'Compliance with VDO Values', rating: null, evidence: '' },
];

const ProbationEvaluationFormComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<ProbationEvaluationData>({
    employeeName: '',
    employeeId: '',
    position: '',
    department: '',
    contractDetails: '',
    supervisor: '',
    appraisalCommittee: '',
    probationStartDate: '',
    probationEndDate: '',
    lineManagerAssessment: [...defaultLineManagerCriteria],
    overallPerformanceRating: '',
    behaviorAndValues: '',
    suitabilityForEmployment: '',
    riskAssessment: '',
    committeeRecommendation: '',
    hrReviewNotes: '',
    hrRecommendation: '',
    hrSpecialistName: '',
    hrSpecialistSigned: false,
    hrSpecialistDate: '',
    finalDecision: '',
    finalDecisionRemarks: '',
    approverName: '',
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

  const updateAssessment = (index: number, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      lineManagerAssessment: prev.lineManagerAssessment.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const calculateAverageScore = () => {
    const ratings = formData.lineManagerAssessment.filter(a => a.rating !== null);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, item) => acc + (item.rating || 0), 0);
    return (sum / ratings.length).toFixed(1);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeName) newErrors.employeeName = 'Employee name is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.probationStartDate) newErrors.probationStartDate = 'Probation start date is required';
    if (!formData.probationEndDate) newErrors.probationEndDate = 'Probation end date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    if (action === 'submit' && !validateForm()) return;

    const dataToSave = {
      ...formData,
      status: action === 'submit' ? 'pending_committee' : 'draft',
    };

    console.log('Saving Probation Evaluation:', dataToSave);
    navigate('/hr/performance/probation-evaluation');
  };

  const ratingScale = [
    { value: 1, label: '1 - Below Expectations' },
    { value: 2, label: '2 - Needs Improvement' },
    { value: 3, label: '3 - Meets Expectations' },
    { value: 4, label: '4 - Exceeds Expectations' },
    { value: 5, label: '5 - Outstanding' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/performance/probation-evaluation"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Probation Evaluation' : 'New Probation Evaluation'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 46: Evaluate employee during/after probation period
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
            Submit for Review
          </button>
        </div>
      </div>

      {/* Workflow */}
      <PerformanceWorkflow currentStep="probation" workflowType="evaluation" />

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-8">
          {/* Admin Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Employee & Probation Details</h2>
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
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.department ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter department"
                />
                {errors.department && <p className="mt-1 text-sm text-red-500">{errors.department}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contract Details
                </label>
                <input
                  type="text"
                  value={formData.contractDetails}
                  onChange={(e) => handleChange('contractDetails', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Contract type & duration"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Supervisor
                </label>
                <input
                  type="text"
                  value={formData.supervisor}
                  onChange={(e) => handleChange('supervisor', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter supervisor name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Appraisal Committee Members
                </label>
                <input
                  type="text"
                  value={formData.appraisalCommittee}
                  onChange={(e) => handleChange('appraisalCommittee', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter committee members"
                />
              </div>
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
            </div>
          </div>

          {/* Section A: Line Manager Assessment */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Section A: Line Manager Assessment</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Average Score: <span className="font-bold text-primary-600">{calculateAverageScore()}/5</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criteria</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-48">Rating (1-5)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evidence/Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {formData.lineManagerAssessment.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">{item.criteria}</td>
                      <td className="px-4 py-3">
                        <select
                          value={item.rating ?? ''}
                          onChange={(e) => updateAssessment(index, 'rating', e.target.value ? parseInt(e.target.value) : null)}
                          className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                        >
                          <option value="">Select Rating</option>
                          {ratingScale.map(r => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.evidence}
                          onChange={(e) => updateAssessment(index, 'evidence', e.target.value)}
                          className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                          placeholder="Provide evidence..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section B: Appraisal Committee Review */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section B: Appraisal Committee Review</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Overall Performance Rating
                </label>
                <textarea
                  value={formData.overallPerformanceRating}
                  onChange={(e) => handleChange('overallPerformanceRating', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Summarize overall performance..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Behavior and Values Adherence
                </label>
                <textarea
                  value={formData.behaviorAndValues}
                  onChange={(e) => handleChange('behaviorAndValues', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Assess adherence to organizational values..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Suitability for Continued Employment
                </label>
                <textarea
                  value={formData.suitabilityForEmployment}
                  onChange={(e) => handleChange('suitabilityForEmployment', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Assess suitability..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Risk Assessment
                </label>
                <textarea
                  value={formData.riskAssessment}
                  onChange={(e) => handleChange('riskAssessment', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Identify any risks..."
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Committee Recommendation
              </label>
              <div className="flex flex-wrap gap-4">
                {[
                  { value: 'confirm', label: 'Confirm Employment', icon: CheckCircle, color: 'text-green-500' },
                  { value: 'extend', label: 'Extend Probation', icon: Clock, color: 'text-yellow-500' },
                  { value: 'terminate', label: 'Terminate', icon: XCircle, color: 'text-red-500' },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <label
                      key={option.value}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                        formData.committeeRecommendation === option.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="committeeRecommendation"
                        value={option.value}
                        checked={formData.committeeRecommendation === option.value}
                        onChange={(e) => handleChange('committeeRecommendation', e.target.value)}
                        className="sr-only"
                      />
                      <Icon className={`h-5 w-5 ${option.color}`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section C: HR Recommendation */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section C: HR Recommendation</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  HR Review Notes
                </label>
                <textarea
                  value={formData.hrReviewNotes}
                  onChange={(e) => handleChange('hrReviewNotes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="HR review notes..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  HR Recommendation
                </label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { value: 'confirm', label: 'Confirm' },
                    { value: 'extend_with_pip', label: 'Extend with PIP' },
                    { value: 'terminate', label: 'Terminate' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                        formData.hrRecommendation === option.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="hrRecommendation"
                        value={option.value}
                        checked={formData.hrRecommendation === option.value}
                        onChange={(e) => handleChange('hrRecommendation', e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    HR Specialist Name
                  </label>
                  <input
                    type="text"
                    value={formData.hrSpecialistName}
                    onChange={(e) => handleChange('hrSpecialistName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter name"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.hrSpecialistSigned}
                      onChange={(e) => handleChange('hrSpecialistSigned', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Signed</span>
                  </label>
                </div>
                {formData.hrSpecialistSigned && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.hrSpecialistDate}
                      onChange={(e) => handleChange('hrSpecialistDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section D: ED/DD Approval */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section D: ED/DD Approval</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Final Decision
                </label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { value: 'confirm', label: 'Confirm Employment', icon: CheckCircle, color: 'bg-green-500' },
                    { value: 'extend', label: 'Extend Probation', icon: Clock, color: 'bg-yellow-500' },
                    { value: 'terminate', label: 'Terminate', icon: XCircle, color: 'bg-red-500' },
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.value}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          formData.finalDecision === option.value
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="finalDecision"
                          value={option.value}
                          checked={formData.finalDecision === option.value}
                          onChange={(e) => handleChange('finalDecision', e.target.value)}
                          className="sr-only"
                        />
                        <div className={`rounded-full ${option.color} p-1`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Remarks
                </label>
                <textarea
                  value={formData.finalDecisionRemarks}
                  onChange={(e) => handleChange('finalDecisionRemarks', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Additional remarks..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Approver Name
                  </label>
                  <input
                    type="text"
                    value={formData.approverName}
                    onChange={(e) => handleChange('approverName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="ED/DD Name"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.approverSigned}
                      onChange={(e) => handleChange('approverSigned', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Signed</span>
                  </label>
                </div>
                {formData.approverSigned && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.approverDate}
                      onChange={(e) => handleChange('approverDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProbationEvaluationList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data
  const evaluations = [
    {
      id: '1',
      employeeName: 'Ahmad Rahimi',
      position: 'Project Officer',
      department: 'Programs',
      probationEndDate: '2026-02-15',
      status: 'pending_committee',
    },
    {
      id: '2',
      employeeName: 'Fatima Karimi',
      position: 'Finance Assistant',
      department: 'Finance',
      probationEndDate: '2026-02-20',
      status: 'draft',
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      pending_committee: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      pending_hr: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      pending_approval: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };
    const labels: Record<string, string> = {
      draft: 'Draft',
      pending_committee: 'Pending Committee',
      pending_hr: 'Pending HR',
      pending_approval: 'Pending Approval',
      completed: 'Completed',
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Probation Evaluations</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 46: Evaluate employees during/after probation</p>
        </div>
        <Link
          to="/hr/performance/probation-evaluation/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Evaluation
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by employee name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending_committee">Pending Committee</option>
          <option value="pending_hr">Pending HR</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Probation Ends</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {evaluations.length > 0 ? (
              evaluations.map((evaluation) => (
                <tr key={evaluation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{evaluation.employeeName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{evaluation.position}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{evaluation.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{evaluation.probationEndDate}</td>
                  <td className="px-6 py-4">{getStatusBadge(evaluation.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/hr/performance/probation-evaluation/${evaluation.id}`}
                      className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No probation evaluations found</p>
                  <Link
                    to="/hr/performance/probation-evaluation/new"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                  >
                    <Plus className="h-4 w-4" />
                    Start New Evaluation
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

const ProbationEvaluation = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <ProbationEvaluationFormComponent />;
  return <ProbationEvaluationList />;
};

export default ProbationEvaluation;
