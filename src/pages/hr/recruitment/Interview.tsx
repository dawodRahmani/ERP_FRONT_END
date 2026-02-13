import { useState } from 'react';
import {
  Plus,
  Search,
  FileText,
  ChevronLeft,
  Save,
  Send,
  Users,
  Star,
  ClipboardList,
  CheckSquare,
  BarChart2
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Form 12: Interview Attendance Sheet
interface InterviewAttendee {
  id: string;
  candidateName: string;
  fatherName: string;
  candidateCode: string;
  attended: boolean;
  signature: boolean;
  remarks: string;
}

// Form 11: Interview Evaluation Form
interface InterviewEvaluation {
  id: string;
  candidateCode: string;
  candidateName: string;
  candidateAge: number;
  candidateGender: 'male' | 'female';
  positionApplied: string;
  // Fixed Questions (1-5 rating)
  fixedQ1Score: number;
  fixedQ2Score: number;
  fixedQ3Score: number;
  // Technical Questions (RC Defined)
  techQ1Score: number;
  techQ2Score: number;
  techQ3Score: number;
  // Other Criteria
  communicationScore: number;
  problemSolvingScore: number;
  overallImpressionScore: number;
  totalScore: number;
  maxScore: number; // 9 criteria x 5 = 45
  percentage: number;
  panelDecision: boolean;
  remarks: string;
}

// Form 13: Interview Result Sheet (Combined Written Test + Interview)
interface CombinedResult {
  id: string;
  sNo: number;
  candidateName: string;
  candidateCode: string;
  // Written Test
  writtenTestScore: number; // Percentage from Form 10
  writtenTestWeight: number; // Weight percentage (e.g., 40%)
  writtenTestWeighted: number; // Calculated: score * weight / 100
  // Interview
  interviewScore: number; // Percentage from Form 11
  interviewWeight: number; // Weight percentage (e.g., 60%)
  interviewWeighted: number; // Calculated: score * weight / 100
  // Combined
  totalWeightedScore: number; // writtenTestWeighted + interviewWeighted
  rank: number;
  rcRecommendation: 'recommended' | 'reserve' | 'not_recommended';
}

interface InterviewFormData {
  // Position Information
  vacancyNumber: string;
  positionTitle: string;
  province: string;
  interviewDate: string;
  interviewTime: string;
  interviewVenue: string;

  // Panel members
  panelMembers: { name: string; position: string; department: string }[];

  // Technical questions (defined by RC)
  technicalQuestions: string[];

  // Form 12: Attendance
  attendees: InterviewAttendee[];

  // Form 11: Evaluations
  evaluations: InterviewEvaluation[];

  // Form 13: Combined Results
  results: CombinedResult[];

  // Weights for Form 13
  writtenTestWeightPercent: number;
  interviewWeightPercent: number;

  status: 'draft' | 'attendance_taken' | 'evaluations_done' | 'completed';
  activeTab: 'attendance' | 'evaluation' | 'results';
}

const InterviewForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<InterviewFormData>({
    vacancyNumber: '',
    positionTitle: '',
    province: '',
    interviewDate: new Date().toISOString().split('T')[0],
    interviewTime: '09:00',
    interviewVenue: '',
    panelMembers: [{ name: '', position: '', department: '' }],
    technicalQuestions: ['', '', ''],
    attendees: [],
    evaluations: [],
    results: [],
    writtenTestWeightPercent: 40,
    interviewWeightPercent: 60,
    status: 'draft',
    activeTab: 'attendance',
  });

  const handleChange = (field: keyof InterviewFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Panel Member functions
  const addPanelMember = () => {
    setFormData(prev => ({
      ...prev,
      panelMembers: [...prev.panelMembers, { name: '', position: '', department: '' }],
    }));
  };

  const updatePanelMember = (index: number, field: 'name' | 'position' | 'department', value: string) => {
    setFormData(prev => ({
      ...prev,
      panelMembers: prev.panelMembers.map((m, i) => i === index ? { ...m, [field]: value } : m),
    }));
  };

  const removePanelMember = (index: number) => {
    if (formData.panelMembers.length > 1) {
      setFormData(prev => ({
        ...prev,
        panelMembers: prev.panelMembers.filter((_, i) => i !== index),
      }));
    }
  };

  // Form 12: Attendance functions
  const addAttendee = () => {
    const candidateCode = `C${String(formData.attendees.length + 1).padStart(3, '0')}`;
    const newAttendee: InterviewAttendee = {
      id: Date.now().toString(),
      candidateName: '',
      fatherName: '',
      candidateCode,
      attended: false,
      signature: false,
      remarks: '',
    };
    setFormData(prev => ({ ...prev, attendees: [...prev.attendees, newAttendee] }));
  };

  const updateAttendee = (id: string, field: keyof InterviewAttendee, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.map(a => a.id === id ? { ...a, [field]: value } : a),
    }));
  };

  const removeAttendee = (id: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(a => a.id !== id),
    }));
  };

  // Generate evaluations from attendance (attendees who attended)
  const generateEvaluationsFromAttendance = () => {
    const attendedCandidates = formData.attendees.filter(a => a.attended);
    const newEvaluations: InterviewEvaluation[] = attendedCandidates.map(a => ({
      id: a.id,
      candidateCode: a.candidateCode,
      candidateName: a.candidateName,
      candidateAge: 0,
      candidateGender: 'male' as const,
      positionApplied: formData.positionTitle,
      fixedQ1Score: 0,
      fixedQ2Score: 0,
      fixedQ3Score: 0,
      techQ1Score: 0,
      techQ2Score: 0,
      techQ3Score: 0,
      communicationScore: 0,
      problemSolvingScore: 0,
      overallImpressionScore: 0,
      totalScore: 0,
      maxScore: 45,
      percentage: 0,
      panelDecision: false,
      remarks: '',
    }));
    setFormData(prev => ({
      ...prev,
      evaluations: newEvaluations,
      activeTab: 'evaluation',
      status: 'attendance_taken'
    }));
  };

  // Form 11: Evaluation functions
  const calculateTotalScore = (eval_: InterviewEvaluation): { total: number; percentage: number } => {
    const total = (
      eval_.fixedQ1Score + eval_.fixedQ2Score + eval_.fixedQ3Score +
      eval_.techQ1Score + eval_.techQ2Score + eval_.techQ3Score +
      eval_.communicationScore + eval_.problemSolvingScore + eval_.overallImpressionScore
    );
    const percentage = (total / 45) * 100;
    return { total, percentage };
  };

  const updateEvaluation = (id: string, field: keyof InterviewEvaluation, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      evaluations: prev.evaluations.map(e => {
        if (e.id === id) {
          const updated = { ...e, [field]: value };
          const { total, percentage } = calculateTotalScore(updated);
          updated.totalScore = total;
          updated.percentage = percentage;
          return updated;
        }
        return e;
      }),
    }));
  };

  // Form 13: Generate combined results
  const generateCombinedResults = () => {
    const results: CombinedResult[] = formData.evaluations.map((eval_, index) => {
      const interviewWeighted = (eval_.percentage * formData.interviewWeightPercent) / 100;
      return {
        id: eval_.id,
        sNo: index + 1,
        candidateName: eval_.candidateName,
        candidateCode: eval_.candidateCode,
        writtenTestScore: 0, // To be filled from Form 10 data
        writtenTestWeight: formData.writtenTestWeightPercent,
        writtenTestWeighted: 0,
        interviewScore: eval_.percentage,
        interviewWeight: formData.interviewWeightPercent,
        interviewWeighted: interviewWeighted,
        totalWeightedScore: interviewWeighted, // Will update when written test score is entered
        rank: 0,
        rcRecommendation: 'not_recommended' as const,
      };
    });

    // Sort and assign ranks
    results.sort((a, b) => b.totalWeightedScore - a.totalWeightedScore);
    results.forEach((r, i) => { r.rank = i + 1; });

    setFormData(prev => ({
      ...prev,
      results,
      activeTab: 'results',
      status: 'evaluations_done'
    }));
  };

  const updateResult = (id: string, field: keyof CombinedResult, value: unknown) => {
    setFormData(prev => {
      const updatedResults = prev.results.map(r => {
        if (r.id === id) {
          const updated = { ...r, [field]: value };

          // Recalculate weighted scores when written test score changes
          if (field === 'writtenTestScore') {
            const score = typeof value === 'number' ? value : parseFloat(value as string) || 0;
            updated.writtenTestWeighted = (score * updated.writtenTestWeight) / 100;
            updated.totalWeightedScore = updated.writtenTestWeighted + updated.interviewWeighted;
          }
          return updated;
        }
        return r;
      });

      // Re-rank after score changes
      const sortedResults = [...updatedResults].sort((a, b) => b.totalWeightedScore - a.totalWeightedScore);
      sortedResults.forEach((r, i) => { r.rank = i + 1; });

      return { ...prev, results: sortedResults };
    });
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    if (action === 'submit') {
      setFormData(prev => ({ ...prev, status: 'completed' }));
    }
    console.log('Saving Interview:', formData);
    navigate('/hr/recruitment/interview');
  };

  // Star Rating Component
  const RatingInput = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(rating => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className={`p-0.5 ${value >= rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
        >
          <Star className="h-4 w-4 fill-current" />
        </button>
      ))}
    </div>
  );

  // Stats
  const attendedCount = formData.attendees.filter(a => a.attended).length;
  const evaluatedCount = formData.evaluations.filter(e => e.totalScore > 0).length;
  const recommendedCount = formData.results.filter(r => r.rcRecommendation === 'recommended').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/recruitment/interview"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Interview' : 'New Interview'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Forms 11, 12, 13: Interview attendance, evaluation, and results
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
            Complete
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Invited</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formData.attendees.length}</p>
        </div>
        <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <p className="text-sm text-blue-600 dark:text-blue-400">Attended</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{attendedCount}</p>
        </div>
        <div className="p-4 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
          <p className="text-sm text-purple-600 dark:text-purple-400">Evaluated</p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{evaluatedCount}</p>
        </div>
        <div className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <p className="text-sm text-green-600 dark:text-green-400">Recommended</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{recommendedCount}</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Interview Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interview Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position Title</label>
                <input
                  type="text"
                  value={formData.positionTitle}
                  onChange={(e) => handleChange('positionTitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vacancy Number</label>
                <input
                  type="text"
                  value={formData.vacancyNumber}
                  onChange={(e) => handleChange('vacancyNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Province</label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => handleChange('province', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interview Date</label>
                <input
                  type="date"
                  value={formData.interviewDate}
                  onChange={(e) => handleChange('interviewDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interview Time</label>
                <input
                  type="time"
                  value={formData.interviewTime}
                  onChange={(e) => handleChange('interviewTime', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Venue</label>
                <input
                  type="text"
                  value={formData.interviewVenue}
                  onChange={(e) => handleChange('interviewVenue', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Panel Members */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Interview Panel Members</h2>
              <button onClick={addPanelMember} className="inline-flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600">
                <Plus className="h-4 w-4" /> Add Member
              </button>
            </div>
            <div className="space-y-2">
              {formData.panelMembers.map((member, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) => updatePanelMember(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={member.position}
                    onChange={(e) => updatePanelMember(index, 'position', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Department"
                    value={member.department}
                    onChange={(e) => updatePanelMember(index, 'department', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                  {formData.panelMembers.length > 1 && (
                    <button
                      onClick={() => removePanelMember(index)}
                      className="text-red-500 hover:text-red-600 text-xs px-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Technical Questions (RC Defined) */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Technical Questions (RC Defined)</h2>
            <div className="space-y-2">
              {formData.technicalQuestions.map((q, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <span className="text-sm text-gray-500 w-8">Q{index + 1}:</span>
                  <input
                    type="text"
                    placeholder={`Technical Question ${index + 1}`}
                    value={q}
                    onChange={(e) => {
                      const updated = [...formData.technicalQuestions];
                      updated[index] = e.target.value;
                      handleChange('technicalQuestions', updated);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Weights for Form 13 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Score Weights (Form 13)</h2>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 dark:text-gray-300">Written Test:</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.writtenTestWeightPercent}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    handleChange('writtenTestWeightPercent', val);
                    handleChange('interviewWeightPercent', 100 - val);
                  }}
                  className="w-20 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-center"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 dark:text-gray-300">Interview:</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.interviewWeightPercent}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    handleChange('interviewWeightPercent', val);
                    handleChange('writtenTestWeightPercent', 100 - val);
                  }}
                  className="w-20 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-center"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
              <span className="text-sm text-gray-400">(Total must equal 100%)</span>
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleChange('activeTab', 'attendance')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px flex items-center gap-2 ${
                  formData.activeTab === 'attendance'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ClipboardList className="h-4 w-4" />
                Attendance (Form 12)
              </button>
              <button
                onClick={() => handleChange('activeTab', 'evaluation')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px flex items-center gap-2 ${
                  formData.activeTab === 'evaluation'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <CheckSquare className="h-4 w-4" />
                Evaluation (Form 11)
              </button>
              <button
                onClick={() => handleChange('activeTab', 'results')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px flex items-center gap-2 ${
                  formData.activeTab === 'results'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart2 className="h-4 w-4" />
                Results (Form 13)
              </button>
            </div>

            {/* Form 12: Attendance Tab */}
            {formData.activeTab === 'attendance' && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white">Interview Attendance Sheet</h3>
                  <button
                    onClick={addAttendee}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Candidate
                  </button>
                </div>

                {formData.attendees.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      No candidates added. Add shortlisted candidates for the interview.
                    </p>
                    <button
                      onClick={addAttendee}
                      className="mt-4 text-sm text-primary-500 hover:text-primary-600"
                    >
                      Add First Candidate
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">S/No</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Candidate Name</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Father's Name</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Attended</th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Signature</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                            <th className="px-3 py-2"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {formData.attendees.map((attendee, index) => (
                            <tr key={attendee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-3 py-2">{index + 1}</td>
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={attendee.candidateName}
                                  onChange={(e) => updateAttendee(attendee.id, 'candidateName', e.target.value)}
                                  className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={attendee.fatherName}
                                  onChange={(e) => updateAttendee(attendee.id, 'fatherName', e.target.value)}
                                  className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                                />
                              </td>
                              <td className="px-3 py-2 font-mono text-xs">{attendee.candidateCode}</td>
                              <td className="px-3 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={attendee.attended}
                                  onChange={(e) => updateAttendee(attendee.id, 'attended', e.target.checked)}
                                  className="rounded border-gray-300 text-primary-500"
                                />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={attendee.signature}
                                  onChange={(e) => updateAttendee(attendee.id, 'signature', e.target.checked)}
                                  className="rounded border-gray-300 text-primary-500"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={attendee.remarks}
                                  onChange={(e) => updateAttendee(attendee.id, 'remarks', e.target.value)}
                                  className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <button
                                  onClick={() => removeAttendee(attendee.id)}
                                  className="text-red-500 hover:text-red-600 text-xs"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {attendedCount > 0 && (
                      <div className="mt-4">
                        <button
                          onClick={generateEvaluationsFromAttendance}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                        >
                          Generate Evaluation Forms ({attendedCount} candidates)
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Form 11: Evaluation Tab */}
            {formData.activeTab === 'evaluation' && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white">Interview Evaluation Forms</h3>
                  <div className="text-sm text-gray-500">
                    Rating Scale: 1=Poor, 2=Fair, 3=Good, 4=Very Good, 5=Excellent
                  </div>
                </div>

                {formData.evaluations.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      No evaluations yet. Complete attendance first and generate evaluation forms.
                    </p>
                    <button
                      onClick={() => handleChange('activeTab', 'attendance')}
                      className="mt-2 text-sm text-primary-500"
                    >
                      Go to Attendance
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {formData.evaluations.map((eval_, index) => (
                      <div key={eval_.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-4">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Candidate #{index + 1}: {eval_.candidateName || 'Unnamed'}
                            </h4>
                            <span className="text-xs text-gray-500 font-mono">{eval_.candidateCode}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Score: <span className="font-bold">{eval_.totalScore}/45</span> ({eval_.percentage.toFixed(1)}%)
                            </span>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={eval_.panelDecision}
                                onChange={(e) => updateEvaluation(eval_.id, 'panelDecision', e.target.checked)}
                                className="rounded border-gray-300 text-green-500"
                              />
                              <span className="text-sm font-medium text-green-600">Panel Recommends</span>
                            </label>
                          </div>
                        </div>

                        {/* Candidate Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Age</label>
                            <input
                              type="number"
                              value={eval_.candidateAge || ''}
                              onChange={(e) => updateEvaluation(eval_.id, 'candidateAge', parseInt(e.target.value) || 0)}
                              className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Gender</label>
                            <select
                              value={eval_.candidateGender}
                              onChange={(e) => updateEvaluation(eval_.id, 'candidateGender', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs text-gray-500 mb-1">Position Applied</label>
                            <input
                              type="text"
                              value={eval_.positionApplied}
                              onChange={(e) => updateEvaluation(eval_.id, 'positionApplied', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                            />
                          </div>
                        </div>

                        {/* Scoring Grid */}
                        <div className="grid grid-cols-3 md:grid-cols-9 gap-3 text-xs">
                          {[
                            { label: 'Fixed Q1', field: 'fixedQ1Score' },
                            { label: 'Fixed Q2', field: 'fixedQ2Score' },
                            { label: 'Fixed Q3', field: 'fixedQ3Score' },
                            { label: 'Tech Q1', field: 'techQ1Score' },
                            { label: 'Tech Q2', field: 'techQ2Score' },
                            { label: 'Tech Q3', field: 'techQ3Score' },
                            { label: 'Communication', field: 'communicationScore' },
                            { label: 'Problem Solving', field: 'problemSolvingScore' },
                            { label: 'Overall', field: 'overallImpressionScore' },
                          ].map(({ label, field }) => (
                            <div key={field} className="text-center">
                              <p className="text-gray-500 dark:text-gray-400 mb-1 truncate" title={label}>{label}</p>
                              <RatingInput
                                value={eval_[field as keyof InterviewEvaluation] as number}
                                onChange={(v) => updateEvaluation(eval_.id, field as keyof InterviewEvaluation, v)}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Remarks */}
                        <div className="mt-3">
                          <input
                            type="text"
                            placeholder="Remarks / Notes"
                            value={eval_.remarks}
                            onChange={(e) => updateEvaluation(eval_.id, 'remarks', e.target.value)}
                            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={generateCombinedResults}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                    >
                      Generate Combined Results (Form 13)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Form 13: Results Tab */}
            {formData.activeTab === 'results' && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white">Interview Result Sheet (Combined)</h3>
                  <div className="text-sm text-gray-500">
                    Written Test: {formData.writtenTestWeightPercent}% | Interview: {formData.interviewWeightPercent}%
                  </div>
                </div>

                {formData.results.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <BarChart2 className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      No results yet. Complete evaluations first.
                    </p>
                    <button
                      onClick={() => handleChange('activeTab', 'evaluation')}
                      className="mt-2 text-sm text-primary-500"
                    >
                      Go to Evaluations
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Rank</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">S/No</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Candidate Name</th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                            Written Test<br />
                            <span className="text-[10px] font-normal">Score ({formData.writtenTestWeightPercent}%)</span>
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                            Weighted<br />
                            <span className="text-[10px] font-normal">Written</span>
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                            Interview<br />
                            <span className="text-[10px] font-normal">Score ({formData.interviewWeightPercent}%)</span>
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                            Weighted<br />
                            <span className="text-[10px] font-normal">Interview</span>
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                            Total<br />
                            <span className="text-[10px] font-normal">Weighted</span>
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">RC Recommendation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {formData.results.map((result) => (
                          <tr
                            key={result.id}
                            className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                              result.rank === 1 ? 'bg-green-50 dark:bg-green-900/10' :
                              result.rank === 2 ? 'bg-blue-50 dark:bg-blue-900/10' :
                              result.rank === 3 ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''
                            }`}
                          >
                            <td className="px-3 py-2 text-center">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                result.rank === 1 ? 'bg-green-500 text-white' :
                                result.rank === 2 ? 'bg-blue-500 text-white' :
                                result.rank === 3 ? 'bg-yellow-500 text-white' :
                                'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}>
                                {result.rank}
                              </span>
                            </td>
                            <td className="px-3 py-2">{result.sNo}</td>
                            <td className="px-3 py-2 font-medium">{result.candidateName}</td>
                            <td className="px-3 py-2 text-center">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={result.writtenTestScore || ''}
                                onChange={(e) => updateResult(result.id, 'writtenTestScore', parseFloat(e.target.value) || 0)}
                                className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-center"
                                placeholder="%"
                              />
                            </td>
                            <td className="px-3 py-2 text-center text-gray-600 dark:text-gray-400">
                              {result.writtenTestWeighted.toFixed(1)}
                            </td>
                            <td className="px-3 py-2 text-center">
                              {result.interviewScore.toFixed(1)}%
                            </td>
                            <td className="px-3 py-2 text-center text-gray-600 dark:text-gray-400">
                              {result.interviewWeighted.toFixed(1)}
                            </td>
                            <td className="px-3 py-2 text-center font-bold text-lg">
                              {result.totalWeightedScore.toFixed(1)}
                            </td>
                            <td className="px-3 py-2 text-center">
                              <select
                                value={result.rcRecommendation}
                                onChange={(e) => updateResult(result.id, 'rcRecommendation', e.target.value)}
                                className={`px-2 py-1 rounded border text-xs ${
                                  result.rcRecommendation === 'recommended'
                                    ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : result.rcRecommendation === 'reserve'
                                    ? 'border-yellow-300 bg-yellow-50 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                                }`}
                              >
                                <option value="recommended">Recommended</option>
                                <option value="reserve">Reserve</option>
                                <option value="not_recommended">Not Recommended</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Summary */}
                {formData.results.length > 0 && (
                  <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Summary</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Recommended:</span>
                        <span className="ml-2 font-medium text-green-600">{formData.results.filter(r => r.rcRecommendation === 'recommended').length}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Reserve:</span>
                        <span className="ml-2 font-medium text-yellow-600">{formData.results.filter(r => r.rcRecommendation === 'reserve').length}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Not Recommended:</span>
                        <span className="ml-2 font-medium text-red-600">{formData.results.filter(r => r.rcRecommendation === 'not_recommended').length}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InterviewList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interviews</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Forms 11, 12, 13: Interview management</p>
        </div>
        <Link
          to="/hr/recruitment/interview/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Interview
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by position..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No interviews found</p>
                <Link
                  to="/hr/recruitment/interview/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                >
                  <Plus className="h-4 w-4" />
                  Schedule Interview
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Interview = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <InterviewForm />;
  return <InterviewList />;
};

export default Interview;
