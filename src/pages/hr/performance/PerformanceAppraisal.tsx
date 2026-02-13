import { useState } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  Save,
  Send,
  Star,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PerformanceWorkflow } from './components/PerformanceWorkflow';

interface PerformanceArea {
  area: string;
  score: number | null;
  remarks: string;
}

interface PerformanceAppraisalData {
  // Staff Section
  staffName: string;
  staffId: string;
  position: string;
  department: string;
  lineManager: string;
  joiningDate: string;
  reviewDate: string;
  reviewPeriod: string;

  // Self-Assessment
  coreResponsibilities: string;
  achievements: string;
  selfEvaluation: string;
  otherComments: string;

  // Line Manager Evaluation
  performanceAreas: PerformanceArea[];

  // Detailed Assessment
  strengths: string;
  weaknesses: string;
  developmentGoals: string;
  conflictObservations: string;

  // Management Decision
  contractDecision: 'renew' | 'terminate' | 'project_end' | '';
  benefitDecision: 'increment' | 'promotion' | 'na' | '';
  incrementPercentage: string;
  newPositionTitle: string;
  recommendForPromotion: boolean;

  // Signatures
  staffSigned: boolean;
  staffSignDate: string;
  lineManagerSigned: boolean;
  lineManagerSignDate: string;
  hrReceiptSigned: boolean;
  hrReceiptDate: string;

  status: 'draft' | 'self_assessment' | 'manager_review' | 'committee_review' | 'completed';
}

const defaultPerformanceAreas: PerformanceArea[] = [
  { area: 'Work Approach & Productivity', score: null, remarks: '' },
  { area: 'Quality, Accuracy & Efficiency', score: null, remarks: '' },
  { area: 'Punctuality & Time Management', score: null, remarks: '' },
  { area: 'Communication Skills (Including English)', score: null, remarks: '' },
  { area: 'Technical Competence & Work Capacity', score: null, remarks: '' },
  { area: 'Problem Solving & Adaptability', score: null, remarks: '' },
  { area: 'Teamwork & Collaboration', score: null, remarks: '' },
  { area: 'Behavior with Beneficiaries', score: null, remarks: '' },
  { area: 'Integrity & Professional Conduct', score: null, remarks: '' },
  { area: 'Commitment to VDO Values & Ethics', score: null, remarks: '' },
];

const PerformanceAppraisalFormComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<PerformanceAppraisalData>({
    staffName: '',
    staffId: '',
    position: '',
    department: '',
    lineManager: '',
    joiningDate: '',
    reviewDate: '',
    reviewPeriod: new Date().getFullYear().toString(),
    coreResponsibilities: '',
    achievements: '',
    selfEvaluation: '',
    otherComments: '',
    performanceAreas: [...defaultPerformanceAreas],
    strengths: '',
    weaknesses: '',
    developmentGoals: '',
    conflictObservations: '',
    contractDecision: '',
    benefitDecision: '',
    incrementPercentage: '',
    newPositionTitle: '',
    recommendForPromotion: false,
    staffSigned: false,
    staffSignDate: '',
    lineManagerSigned: false,
    lineManagerSignDate: '',
    hrReceiptSigned: false,
    hrReceiptDate: '',
    status: 'draft',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'self' | 'manager' | 'decision'>('self');

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

  const updatePerformanceArea = (index: number, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      performanceAreas: prev.performanceAreas.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const calculateTotalScore = () => {
    const scored = formData.performanceAreas.filter(a => a.score !== null);
    if (scored.length === 0) return { total: 0, average: 0, percentage: 0 };
    const total = scored.reduce((acc, item) => acc + (item.score || 0), 0);
    const average = total / scored.length;
    const percentage = (average / 4) * 100;
    return { total, average: average.toFixed(2), percentage: percentage.toFixed(0) };
  };

  const getScoreLabel = (percentage: number) => {
    if (percentage >= 90) return { label: 'Excellent', color: 'text-green-600' };
    if (percentage >= 75) return { label: 'Very Good', color: 'text-blue-600' };
    if (percentage >= 60) return { label: 'Good', color: 'text-yellow-600' };
    if (percentage >= 50) return { label: 'Needs Improvement', color: 'text-orange-600' };
    return { label: 'Below Expectations', color: 'text-red-600' };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.staffName) newErrors.staffName = 'Staff name is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.lineManager) newErrors.lineManager = 'Line manager is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    if (action === 'submit' && !validateForm()) return;

    const dataToSave = {
      ...formData,
      status: action === 'submit' ? 'self_assessment' : 'draft',
    };

    console.log('Saving Performance Appraisal:', dataToSave);
    navigate('/hr/performance/appraisal');
  };

  const scores = calculateTotalScore();
  const scoreLabel = getScoreLabel(parseInt(scores.percentage.toString()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/performance/appraisal"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Performance Appraisal' : 'New Performance Appraisal'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 24: Annual performance evaluation (V2)
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
            Submit
          </button>
        </div>
      </div>

      {/* Workflow */}
      <PerformanceWorkflow currentStep="annual" workflowType="evaluation" />

      {/* Score Summary Card */}
      {formData.performanceAreas.some(a => a.score !== null) && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary-100 dark:bg-primary-900/30 p-3">
                <Star className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Overall Performance Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {scores.average}/4 <span className="text-lg">({scores.percentage}%)</span>
                </p>
              </div>
            </div>
            <span className={`text-lg font-semibold ${scoreLabel.color}`}>
              {scoreLabel.label}
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          {[
            { id: 'self', label: 'Staff Self-Assessment' },
            { id: 'manager', label: 'Line Manager Evaluation' },
            { id: 'decision', label: 'Management Decision' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'self' | 'manager' | 'decision')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Staff Information - Always visible */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Staff Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Staff Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.staffName}
                  onChange={(e) => handleChange('staffName', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.staffName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter staff name"
                />
                {errors.staffName && <p className="mt-1 text-sm text-red-500">{errors.staffName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Staff ID
                </label>
                <input
                  type="text"
                  value={formData.staffId}
                  onChange={(e) => handleChange('staffId', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter staff ID"
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
                  Line Manager <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lineManager}
                  onChange={(e) => handleChange('lineManager', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.lineManager ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter line manager"
                />
                {errors.lineManager && <p className="mt-1 text-sm text-red-500">{errors.lineManager}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Joining Date
                </label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => handleChange('joiningDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Review Date
                </label>
                <input
                  type="date"
                  value={formData.reviewDate}
                  onChange={(e) => handleChange('reviewDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Review Period (Year)
                </label>
                <input
                  type="text"
                  value={formData.reviewPeriod}
                  onChange={(e) => handleChange('reviewPeriod', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., 2026"
                />
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'self' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Staff Self-Assessment</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Core Responsibilities Understanding
                  </label>
                  <textarea
                    value={formData.coreResponsibilities}
                    onChange={(e) => handleChange('coreResponsibilities', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Describe your understanding of your core responsibilities..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Key Achievements
                  </label>
                  <textarea
                    value={formData.achievements}
                    onChange={(e) => handleChange('achievements', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="List your key achievements during this review period..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Self-Evaluation
                  </label>
                  <textarea
                    value={formData.selfEvaluation}
                    onChange={(e) => handleChange('selfEvaluation', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Provide an honest assessment of your performance..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Other Comments
                  </label>
                  <textarea
                    value={formData.otherComments}
                    onChange={(e) => handleChange('otherComments', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Any additional comments or feedback..."
                  />
                </div>
              </div>

              {/* Staff Signature */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Staff Acknowledgment</h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.staffSigned}
                      onChange={(e) => handleChange('staffSigned', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">I acknowledge this self-assessment</span>
                  </label>
                  {formData.staffSigned && (
                    <input
                      type="date"
                      value={formData.staffSignDate}
                      onChange={(e) => handleChange('staffSignDate', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manager' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Line Manager Evaluation</h2>
                <div className="text-sm text-gray-500">
                  Rating Scale: 1 = Needs Improvement, 2 = Basic, 3 = Good, 4 = Excellent
                </div>
              </div>

              {/* Performance Areas Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key Performance Area</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-32">Score (1-4)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {formData.performanceAreas.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">{item.area}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4].map((score) => (
                              <button
                                key={score}
                                type="button"
                                onClick={() => updatePerformanceArea(index, 'score', score)}
                                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                                  item.score === score
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                              >
                                {score}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.remarks}
                            onChange={(e) => updatePerformanceArea(index, 'remarks', e.target.value)}
                            className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                            placeholder="Add remarks..."
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Detailed Assessment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Strengths
                  </label>
                  <textarea
                    value={formData.strengths}
                    onChange={(e) => handleChange('strengths', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Key strengths observed..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Areas for Improvement
                  </label>
                  <textarea
                    value={formData.weaknesses}
                    onChange={(e) => handleChange('weaknesses', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Areas needing improvement..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Development Goals
                  </label>
                  <textarea
                    value={formData.developmentGoals}
                    onChange={(e) => handleChange('developmentGoals', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Goals for the next review period..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Conflict/Zero Tolerance Observations
                  </label>
                  <textarea
                    value={formData.conflictObservations}
                    onChange={(e) => handleChange('conflictObservations', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Any observations related to conflicts or zero tolerance policy..."
                  />
                </div>
              </div>

              {/* Line Manager Signature */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Line Manager Acknowledgment</h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.lineManagerSigned}
                      onChange={(e) => handleChange('lineManagerSigned', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">I confirm this evaluation</span>
                  </label>
                  {formData.lineManagerSigned && (
                    <input
                      type="date"
                      value={formData.lineManagerSignDate}
                      onChange={(e) => handleChange('lineManagerSignDate', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'decision' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Management Decision</h2>

              {/* Contract Decision */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Employment Contract Decision
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'renew', label: 'Renew Contract', color: 'bg-green-500' },
                    { value: 'terminate', label: 'Terminate', color: 'bg-red-500' },
                    { value: 'project_end', label: 'Project End', color: 'bg-yellow-500' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        formData.contractDecision === option.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="contractDecision"
                        value={option.value}
                        checked={formData.contractDecision === option.value}
                        onChange={(e) => handleChange('contractDecision', e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-3 h-3 rounded-full ${option.color}`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Benefit Decision */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Employee Benefit Decision
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'increment', label: 'Salary Increment', icon: TrendingUp },
                    { value: 'promotion', label: 'Promotion', icon: Star },
                    { value: 'na', label: 'N/A', icon: AlertTriangle },
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.value}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          formData.benefitDecision === option.value
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="benefitDecision"
                          value={option.value}
                          checked={formData.benefitDecision === option.value}
                          onChange={(e) => handleChange('benefitDecision', e.target.value)}
                          className="sr-only"
                        />
                        <Icon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Conditional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.benefitDecision === 'increment' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Increment Percentage
                    </label>
                    <input
                      type="text"
                      value={formData.incrementPercentage}
                      onChange={(e) => handleChange('incrementPercentage', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., 5%"
                    />
                  </div>
                )}
                {formData.benefitDecision === 'promotion' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Position Title
                    </label>
                    <input
                      type="text"
                      value={formData.newPositionTitle}
                      onChange={(e) => handleChange('newPositionTitle', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter new position"
                    />
                  </div>
                )}
              </div>

              {/* Recommend for Future Promotion */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.recommendForPromotion}
                    onChange={(e) => handleChange('recommendForPromotion', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500 w-5 h-5"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Recommend for Future Promotion</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Mark this employee as eligible for promotion consideration</p>
                  </div>
                </label>
              </div>

              {/* HR Receipt */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">HR Receipt Confirmation</h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.hrReceiptSigned}
                      onChange={(e) => handleChange('hrReceiptSigned', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">HR has received and filed this appraisal</span>
                  </label>
                  {formData.hrReceiptSigned && (
                    <input
                      type="date"
                      value={formData.hrReceiptDate}
                      onChange={(e) => handleChange('hrReceiptDate', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PerformanceAppraisalList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString());

  // Mock data
  const appraisals = [
    {
      id: '1',
      staffName: 'Zahra Ahmadi',
      position: 'Program Manager',
      department: 'Programs',
      reviewPeriod: '2025',
      score: 85,
      decision: 'Increment',
      status: 'completed',
    },
    {
      id: '2',
      staffName: 'Mohammad Hashimi',
      position: 'HR Officer',
      department: 'HR',
      reviewPeriod: '2025',
      score: 0,
      decision: '',
      status: 'manager_review',
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      self_assessment: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      manager_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      committee_review: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };
    const labels: Record<string, string> = {
      draft: 'Draft',
      self_assessment: 'Self Assessment',
      manager_review: 'Manager Review',
      committee_review: 'Committee Review',
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Appraisals</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 24: Annual performance evaluations</p>
        </div>
        <Link
          to="/hr/performance/appraisal/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Appraisal
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by staff name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          />
        </div>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        >
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Decision</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {appraisals.length > 0 ? (
              appraisals.map((appraisal) => (
                <tr key={appraisal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{appraisal.staffName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{appraisal.department}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{appraisal.position}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{appraisal.reviewPeriod}</td>
                  <td className="px-6 py-4">
                    {appraisal.score > 0 ? (
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{appraisal.score}%</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {appraisal.decision || '-'}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(appraisal.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/hr/performance/appraisal/${appraisal.id}`}
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
                  <Star className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No performance appraisals found</p>
                  <Link
                    to="/hr/performance/appraisal/new"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                  >
                    <Plus className="h-4 w-4" />
                    Start New Appraisal
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

const PerformanceAppraisal = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <PerformanceAppraisalFormComponent />;
  return <PerformanceAppraisalList />;
};

export default PerformanceAppraisal;
