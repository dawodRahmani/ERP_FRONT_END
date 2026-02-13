import { useState } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  Save,
  Send,
  MessageSquare,
  Star,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ExitInfoBanner } from './components';

// ============================================================================
// TYPES
// ============================================================================

interface ExitInterviewData {
  // Section 1: Employee Information
  employeeName: string;
  employeeId: string;
  position: string;
  department: string;
  officeLocation: string;
  supervisorName: string;
  startDate: string;
  exitDate: string;
  exitType: string[];

  // Section 2: Reasons for Leaving
  workEnvironmentReasons: string[];
  compensationReasons: string[];
  jobSatisfactionReasons: string[];
  careerPersonalReasons: string[];
  organizationalReasons: string[];
  otherReasons: string;

  // Section 3: Experience Rating (1-5)
  ratings: {
    overallJobSatisfaction: number;
    workEnvironment: number;
    managementSupport: number;
    careerDevelopment: number;
    compensationFairness: number;
    workLifeBalance: number;
  };

  // Section 4: Compliance Evaluation
  unreportedConcerns: boolean;
  unreportedConcernsDetails: string;
  witnessedViolations: boolean;
  witnessedViolationsDetails: string;
  suggestionsForImprovement: string;

  // Section 5-7: Open-ended Questions
  relationshipWithSupervisor: string;
  workRecognition: string;
  guidanceReceived: string;
  likedMost: string;
  likedLeast: string;
  suggestions: string;

  // Section 8: HR Clearance
  clearanceItems: {
    idCardReturned: boolean;
    laptopReturned: boolean;
    keysReturned: boolean;
    documentsReturned: boolean;
    handoverCompleted: boolean;
    exitClearanceSigned: boolean;
    finalPaymentProcessed: boolean;
  };

  // Section 9: Signatures
  employeeSignature: boolean;
  employeeSignatureDate: string;
  hrRepresentative: string;
  hrSignatureDate: string;

  // Status
  status: 'draft' | 'scheduled' | 'completed' | 'reviewed';
  interviewDate: string;
}

// ============================================================================
// EXIT INTERVIEW FORM
// ============================================================================

const ExitInterviewForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<ExitInterviewData>({
    employeeName: '',
    employeeId: '',
    position: '',
    department: '',
    officeLocation: '',
    supervisorName: '',
    startDate: '',
    exitDate: '',
    exitType: [],
    workEnvironmentReasons: [],
    compensationReasons: [],
    jobSatisfactionReasons: [],
    careerPersonalReasons: [],
    organizationalReasons: [],
    otherReasons: '',
    ratings: {
      overallJobSatisfaction: 0,
      workEnvironment: 0,
      managementSupport: 0,
      careerDevelopment: 0,
      compensationFairness: 0,
      workLifeBalance: 0,
    },
    unreportedConcerns: false,
    unreportedConcernsDetails: '',
    witnessedViolations: false,
    witnessedViolationsDetails: '',
    suggestionsForImprovement: '',
    relationshipWithSupervisor: '',
    workRecognition: '',
    guidanceReceived: '',
    likedMost: '',
    likedLeast: '',
    suggestions: '',
    clearanceItems: {
      idCardReturned: false,
      laptopReturned: false,
      keysReturned: false,
      documentsReturned: false,
      handoverCompleted: false,
      exitClearanceSigned: false,
      finalPaymentProcessed: false,
    },
    employeeSignature: false,
    employeeSignatureDate: '',
    hrRepresentative: '',
    hrSignatureDate: '',
    status: 'draft',
    interviewDate: '',
  });

  const [activeTab, setActiveTab] = useState<'info' | 'reasons' | 'feedback' | 'clearance'>('info');

  const handleChange = (field: string, value: unknown) => {
    const keys = field.split('.');
    if (keys.length === 1) {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else if (keys.length === 2) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...(prev[keys[0] as keyof ExitInterviewData] as Record<string, unknown>),
          [keys[1]]: value,
        },
      }));
    }
  };

  const toggleArrayItem = (field: string, item: string) => {
    const array = formData[field as keyof ExitInterviewData] as string[];
    if (array.includes(item)) {
      handleChange(field, array.filter(i => i !== item));
    } else {
      handleChange(field, [...array, item]);
    }
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    console.log('Saving Exit Interview:', formData);
    navigate('/hr/exit/interview');
  };

  const exitTypes = [
    'Resignation',
    'End of Contract',
    'Termination by VDO',
    'Probation Not Passed',
    'Retirement',
    'Other',
  ];

  const workEnvironmentOptions = [
    'Relationship with supervisor',
    'Conflict with colleagues',
    'Workplace culture',
    'Lack of support/recognition',
    'Harassment/discrimination',
    'Safety/security concerns',
  ];

  const compensationOptions = [
    'Salary not competitive',
    'Benefits insufficient',
    'Inconsistent incentives',
    'Increased financial needs',
  ];

  const jobSatisfactionOptions = [
    'Limited growth opportunities',
    'Responsibilities unclear',
    'High workload/overtime',
    'Lack of training',
    'Job not aligned with expectations',
  ];

  const careerPersonalOptions = [
    'Better job opportunity',
    'Career change',
    'Education',
    'Family/personal reasons',
    'Relocation',
  ];

  const organizationalOptions = [
    'Lack of job security',
    'Project closure',
    'Management/leadership issues',
    'Poor communication',
  ];

  const ratingLabels = [
    { key: 'overallJobSatisfaction', label: 'Overall Job Satisfaction' },
    { key: 'workEnvironment', label: 'Work Environment' },
    { key: 'managementSupport', label: 'Management Support' },
    { key: 'careerDevelopment', label: 'Career Development' },
    { key: 'compensationFairness', label: 'Compensation Fairness' },
    { key: 'workLifeBalance', label: 'Work-Life Balance' },
  ];

  const tabs = [
    { key: 'info', label: 'Employee Info', icon: MessageSquare },
    { key: 'reasons', label: 'Reasons', icon: AlertTriangle },
    { key: 'feedback', label: 'Feedback', icon: Star },
    { key: 'clearance', label: 'Clearance', icon: CheckCircle },
  ];

  const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`p-1 ${star <= value ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
        >
          <Star className={`h-5 w-5 ${star <= value ? 'fill-current' : ''}`} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/exit/interview"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Exit Interview' : 'New Exit Interview'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 44: Gather feedback from departing employee
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
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            <Send className="h-4 w-4" />
            Complete Interview
          </button>
        </div>
      </div>

      <ExitInfoBanner
        title="Form 44: Exit Interview"
        description="Document feedback from departing employees to identify areas for improvement and ensure smooth transition."
      />

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Tabs */}
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px flex items-center gap-2 ${
                    activeTab === tab.key
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Employee Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee Name *</label>
                  <input
                    type="text"
                    value={formData.employeeName}
                    onChange={(e) => handleChange('employeeName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => handleChange('employeeId', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleChange('position', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supervisor Name</label>
                  <input
                    type="text"
                    value={formData.supervisorName}
                    onChange={(e) => handleChange('supervisorName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Office Location</label>
                  <input
                    type="text"
                    value={formData.officeLocation}
                    onChange={(e) => handleChange('officeLocation', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exit Date *</label>
                  <input
                    type="date"
                    value={formData.exitDate}
                    onChange={(e) => handleChange('exitDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interview Date</label>
                  <input
                    type="date"
                    value={formData.interviewDate}
                    onChange={(e) => handleChange('interviewDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type of Exit</label>
                <div className="flex flex-wrap gap-2">
                  {exitTypes.map(type => (
                    <label key={type} className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                      <input
                        type="checkbox"
                        checked={formData.exitType.includes(type)}
                        onChange={() => toggleArrayItem('exitType', type)}
                        className="rounded border-gray-300 text-orange-500"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reasons Tab */}
          {activeTab === 'reasons' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Work Environment & Management</h3>
                <div className="flex flex-wrap gap-2">
                  {workEnvironmentOptions.map(option => (
                    <label key={option} className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.workEnvironmentReasons.includes(option)}
                        onChange={() => toggleArrayItem('workEnvironmentReasons', option)}
                        className="rounded border-gray-300 text-orange-500"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Compensation & Benefits</h3>
                <div className="flex flex-wrap gap-2">
                  {compensationOptions.map(option => (
                    <label key={option} className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.compensationReasons.includes(option)}
                        onChange={() => toggleArrayItem('compensationReasons', option)}
                        className="rounded border-gray-300 text-orange-500"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Job Satisfaction</h3>
                <div className="flex flex-wrap gap-2">
                  {jobSatisfactionOptions.map(option => (
                    <label key={option} className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.jobSatisfactionReasons.includes(option)}
                        onChange={() => toggleArrayItem('jobSatisfactionReasons', option)}
                        className="rounded border-gray-300 text-orange-500"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Career & Personal</h3>
                <div className="flex flex-wrap gap-2">
                  {careerPersonalOptions.map(option => (
                    <label key={option} className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.careerPersonalReasons.includes(option)}
                        onChange={() => toggleArrayItem('careerPersonalReasons', option)}
                        className="rounded border-gray-300 text-orange-500"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Organizational Factors</h3>
                <div className="flex flex-wrap gap-2">
                  {organizationalOptions.map(option => (
                    <label key={option} className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.organizationalReasons.includes(option)}
                        onChange={() => toggleArrayItem('organizationalReasons', option)}
                        className="rounded border-gray-300 text-orange-500"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Other Reasons</label>
                <textarea
                  value={formData.otherReasons}
                  onChange={(e) => handleChange('otherReasons', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              {/* Ratings */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Experience Rating (1-5 stars)</h3>
                <div className="space-y-4">
                  {ratingLabels.map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                      <StarRating
                        value={formData.ratings[key as keyof typeof formData.ratings]}
                        onChange={(v) => handleChange(`ratings.${key}`, v)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Open-ended Questions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">What did you like most about working here?</label>
                  <textarea
                    value={formData.likedMost}
                    onChange={(e) => handleChange('likedMost', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">What did you like least?</label>
                  <textarea
                    value={formData.likedLeast}
                    onChange={(e) => handleChange('likedLeast', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Suggestions for improvement</label>
                  <textarea
                    value={formData.suggestions}
                    onChange={(e) => handleChange('suggestions', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
              </div>

              {/* Compliance */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Compliance Evaluation</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={formData.unreportedConcerns}
                        onChange={(e) => handleChange('unreportedConcerns', e.target.checked)}
                        className="rounded border-gray-300 text-orange-500"
                      />
                      <span className="text-sm font-medium">Any unreported concerns during employment?</span>
                    </label>
                    {formData.unreportedConcerns && (
                      <textarea
                        value={formData.unreportedConcernsDetails}
                        onChange={(e) => handleChange('unreportedConcernsDetails', e.target.value)}
                        rows={2}
                        placeholder="Please provide details..."
                        className="w-full mt-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                    )}
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={formData.witnessedViolations}
                        onChange={(e) => handleChange('witnessedViolations', e.target.checked)}
                        className="rounded border-gray-300 text-orange-500"
                      />
                      <span className="text-sm font-medium">Witnessed any policy violations?</span>
                    </label>
                    {formData.witnessedViolations && (
                      <textarea
                        value={formData.witnessedViolationsDetails}
                        onChange={(e) => handleChange('witnessedViolationsDetails', e.target.value)}
                        rows={2}
                        placeholder="Please provide details..."
                        className="w-full mt-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Clearance Tab */}
          {activeTab === 'clearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">HR Clearance Checklist</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { key: 'idCardReturned', label: 'ID Card Returned' },
                    { key: 'laptopReturned', label: 'Laptop/IT Equipment Returned' },
                    { key: 'keysReturned', label: 'Keys/Access Cards Returned' },
                    { key: 'documentsReturned', label: 'Documents/Files Returned' },
                    { key: 'handoverCompleted', label: 'Handover Completed' },
                    { key: 'exitClearanceSigned', label: 'Exit Clearance Form Signed' },
                    { key: 'finalPaymentProcessed', label: 'Final Payment Settlement Processed' },
                  ].map(item => (
                    <label key={item.key} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                      <input
                        type="checkbox"
                        checked={formData.clearanceItems[item.key as keyof typeof formData.clearanceItems]}
                        onChange={(e) => handleChange(`clearanceItems.${item.key}`, e.target.checked)}
                        className="rounded border-gray-300 text-green-500"
                      />
                      <span className="text-sm">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Signatures</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Employee</h4>
                    <label className="flex items-center gap-2 mb-3">
                      <input
                        type="checkbox"
                        checked={formData.employeeSignature}
                        onChange={(e) => handleChange('employeeSignature', e.target.checked)}
                        className="rounded border-gray-300 text-orange-500"
                      />
                      <span className="text-sm">Employee has signed</span>
                    </label>
                    <input
                      type="date"
                      value={formData.employeeSignatureDate}
                      onChange={(e) => handleChange('employeeSignatureDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">HR Representative</h4>
                    <input
                      type="text"
                      value={formData.hrRepresentative}
                      onChange={(e) => handleChange('hrRepresentative', e.target.value)}
                      placeholder="HR Representative Name"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm mb-3"
                    />
                    <input
                      type="date"
                      value={formData.hrSignatureDate}
                      onChange={(e) => handleChange('hrSignatureDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXIT INTERVIEW LIST
// ============================================================================

const ExitInterviewList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const interviews = [
    { id: '1', employeeName: 'Rahmatullah Ahmadi', position: 'Field Officer', department: 'Operations', exitDate: '2024-02-15', interviewDate: '2024-02-12', status: 'Scheduled' },
    { id: '2', employeeName: 'Mariam Karimi', position: 'Finance Assistant', department: 'Finance', exitDate: '2024-02-10', interviewDate: '', status: 'Pending' },
    { id: '3', employeeName: 'Nawid Stanikzai', position: 'Driver', department: 'Admin', exitDate: '2024-02-05', interviewDate: '2024-02-03', status: 'Completed' },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      Scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      Completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Reviewed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    };
    return styles[status] || styles.Pending;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exit Interviews</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 44: Feedback from departing employees</p>
        </div>
        <Link
          to="/hr/exit/interview/new"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          New Interview
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exit Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interview Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {interviews.map((interview) => (
              <tr key={interview.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{interview.employeeName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{interview.position}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{interview.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{interview.exitDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{interview.interviewDate || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(interview.status)}`}>
                    {interview.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => navigate(`/hr/exit/interview/${interview.id}`)}
                    className="text-orange-600 hover:text-orange-700 dark:text-orange-400 text-sm font-medium"
                  >
                    {interview.status === 'Pending' ? 'Start' : 'View'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN EXPORT
// ============================================================================

const ExitInterview = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <ExitInterviewForm />;
  return <ExitInterviewList />;
};

export default ExitInterview;
