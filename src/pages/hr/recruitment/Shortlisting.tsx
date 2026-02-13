import { useState } from 'react';
import {
  Plus,
  Search,
  FileText,
  ChevronLeft,
  Save,
  Send,
  Users,
  Calculator,
  Phone,
  Mail,
  Download
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface ShortlistCandidate {
  id: string;
  candidateName: string;
  phone: string;
  email: string;
  academicScore: number; // 0-100
  experienceScore: number; // 0-100
  otherCriteriaScore: number; // 0-100
  totalScore: number; // Weighted
  shortlistDecision: boolean;
  remarks: string;
}

interface ShortlistFormData {
  vacancyNumber: string;
  positionTitle: string;
  department: string;
  // Weights
  academicWeight: number; // Default 30%
  experienceWeight: number; // Default 50%
  otherCriteriaWeight: number; // Default 20%
  minimumScoreThreshold: number; // Default 75
  candidates: ShortlistCandidate[];
  rcChairName: string;
  rcChairConfirmed: boolean;
  hrSpecialistName: string;
  hrSpecialistConfirmed: boolean;
  status: 'draft' | 'in_progress' | 'completed';
}

// Sample longlisted candidates - In production, these would come from the longlisting database
// Only eligible candidates from longlisting are included here
const sampleLonglistedCandidates: ShortlistCandidate[] = [
  {
    id: '1',
    candidateName: 'Ahmad Ahmadi',
    phone: '+93 700 123 456',
    email: 'ahmad.ahmadi@email.com',
    academicScore: 85,
    experienceScore: 80,
    otherCriteriaScore: 75,
    totalScore: 0, // Will be calculated
    shortlistDecision: false,
    remarks: '',
  },
  {
    id: '2',
    candidateName: 'Fatima Nazari',
    phone: '+93 700 234 567',
    email: 'fatima.nazari@email.com',
    academicScore: 95,
    experienceScore: 90,
    otherCriteriaScore: 85,
    totalScore: 0,
    shortlistDecision: false,
    remarks: '',
  },
  {
    id: '4',
    candidateName: 'Zahra Rahimi',
    phone: '+93 700 456 789',
    email: 'zahra.rahimi@email.com',
    academicScore: 80,
    experienceScore: 85,
    otherCriteriaScore: 70,
    totalScore: 0,
    shortlistDecision: false,
    remarks: '',
  },
  {
    id: '6',
    candidateName: 'Maryam Hakimi',
    phone: '+93 700 678 901',
    email: 'maryam.hakimi@email.com',
    academicScore: 90,
    experienceScore: 75,
    otherCriteriaScore: 80,
    totalScore: 0,
    shortlistDecision: false,
    remarks: '',
  },
];

// Calculate initial scores for sample data
const calculateInitialScores = (candidates: ShortlistCandidate[], weights: { academic: number; experience: number; other: number; threshold: number }): ShortlistCandidate[] => {
  return candidates.map(c => {
    const totalScore = (c.academicScore * weights.academic / 100) +
      (c.experienceScore * weights.experience / 100) +
      (c.otherCriteriaScore * weights.other / 100);
    return {
      ...c,
      totalScore,
      shortlistDecision: totalScore >= weights.threshold,
    };
  });
};

const ShortlistForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const defaultWeights = { academic: 30, experience: 50, other: 20, threshold: 75 };
  const initialCandidates = calculateInitialScores(sampleLonglistedCandidates, defaultWeights);

  const [formData, setFormData] = useState<ShortlistFormData>({
    vacancyNumber: 'VAC-2026-001',
    positionTitle: 'Project Officer',
    department: 'Programs',
    academicWeight: 30,
    experienceWeight: 50,
    otherCriteriaWeight: 20,
    minimumScoreThreshold: 75,
    candidates: initialCandidates,
    rcChairName: '',
    rcChairConfirmed: false,
    hrSpecialistName: '',
    hrSpecialistConfirmed: false,
    status: 'draft',
  });

  const handleChange = (field: keyof ShortlistFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotalScore = (candidate: ShortlistCandidate): number => {
    return (
      (candidate.academicScore * formData.academicWeight / 100) +
      (candidate.experienceScore * formData.experienceWeight / 100) +
      (candidate.otherCriteriaScore * formData.otherCriteriaWeight / 100)
    );
  };

  const addCandidate = () => {
    const newCandidate: ShortlistCandidate = {
      id: Date.now().toString(),
      candidateName: '',
      phone: '',
      email: '',
      academicScore: 0,
      experienceScore: 0,
      otherCriteriaScore: 0,
      totalScore: 0,
      shortlistDecision: false,
      remarks: '',
    };
    setFormData(prev => ({ ...prev, candidates: [...prev.candidates, newCandidate] }));
  };

  const updateCandidate = (id: string, field: keyof ShortlistCandidate, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      candidates: prev.candidates.map(c => {
        if (c.id === id) {
          const updated = { ...c, [field]: value };
          // Recalculate total score
          updated.totalScore = calculateTotalScore(updated);
          // Auto-set shortlist decision based on threshold
          if (field === 'academicScore' || field === 'experienceScore' || field === 'otherCriteriaScore') {
            updated.shortlistDecision = updated.totalScore >= formData.minimumScoreThreshold;
          }
          return updated;
        }
        return c;
      }),
    }));
  };

  const removeCandidate = (id: string) => {
    setFormData(prev => ({
      ...prev,
      candidates: prev.candidates.filter(c => c.id !== id),
    }));
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    console.log('Saving Shortlist:', formData);
    navigate('/hr/recruitment/shortlisting');
  };

  const shortlistedCount = formData.candidates.filter(c => c.shortlistDecision).length;
  const totalCount = formData.candidates.length;

  // Sort candidates by total score descending
  const sortedCandidates = [...formData.candidates].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/recruitment/shortlisting"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Shortlisting' : 'New Shortlisting'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 7: Score and rank longlisted candidates
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
            Complete Shortlisting
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Longlisted Candidates</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</p>
        </div>
        <div className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <p className="text-sm text-green-600 dark:text-green-400">Shortlisted (Score ≥ {formData.minimumScoreThreshold})</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{shortlistedCount}</p>
        </div>
        <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <p className="text-sm text-blue-600 dark:text-blue-400">Minimum Threshold</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{formData.minimumScoreThreshold}%</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Vacancy Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vacancy Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vacancy Number
                </label>
                <input
                  type="text"
                  value={formData.vacancyNumber}
                  onChange={(e) => handleChange('vacancyNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position Title
                </label>
                <input
                  type="text"
                  value={formData.positionTitle}
                  onChange={(e) => handleChange('positionTitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Scoring Weights */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Scoring Weights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Academic Qualification (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.academicWeight}
                  onChange={(e) => handleChange('academicWeight', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Professional Experience (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.experienceWeight}
                  onChange={(e) => handleChange('experienceWeight', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Other Criteria (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.otherCriteriaWeight}
                  onChange={(e) => handleChange('otherCriteriaWeight', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minimum Score Threshold
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.minimumScoreThreshold}
                  onChange={(e) => handleChange('minimumScoreThreshold', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            {formData.academicWeight + formData.experienceWeight + formData.otherCriteriaWeight !== 100 && (
              <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                Warning: Weights should sum to 100% (current: {formData.academicWeight + formData.experienceWeight + formData.otherCriteriaWeight}%)
              </p>
            )}
          </div>

          {/* Candidates Scoring Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Candidate Scoring</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    // In production, this would fetch eligible candidates from longlisting database
                    console.log('Loading candidates from longlisting...');
                  }}
                  className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  <Download className="h-4 w-4" />
                  Load from Longlisting
                </button>
                <button
                  onClick={addCandidate}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600"
                >
                  <Plus className="h-4 w-4" />
                  Add Candidate
                </button>
              </div>
            </div>

            {formData.candidates.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  No candidates added. Add eligible candidates from longlisting.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Candidate Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Academic (0-100)</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Experience (0-100)</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Other (0-100)</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Total Score</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Shortlisted</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedCandidates.map((candidate, index) => (
                      <tr
                        key={candidate.id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                          candidate.shortlistDecision ? 'bg-green-50 dark:bg-green-900/10' : ''
                        }`}
                      >
                        <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">
                          #{index + 1}
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={candidate.candidateName}
                            onChange={(e) => updateCandidate(candidate.id, 'candidateName', e.target.value)}
                            className="w-32 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                            placeholder="Name"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <input
                              type="tel"
                              value={candidate.phone}
                              onChange={(e) => updateCandidate(candidate.id, 'phone', e.target.value)}
                              className="w-28 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                              placeholder="Phone"
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <input
                              type="email"
                              value={candidate.email}
                              onChange={(e) => updateCandidate(candidate.id, 'email', e.target.value)}
                              className="w-36 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                              placeholder="Email"
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={candidate.academicScore || ''}
                            onChange={(e) => updateCandidate(candidate.id, 'academicScore', parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-center"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={candidate.experienceScore || ''}
                            onChange={(e) => updateCandidate(candidate.id, 'experienceScore', parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-center"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={candidate.otherCriteriaScore || ''}
                            onChange={(e) => updateCandidate(candidate.id, 'otherCriteriaScore', parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-center"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={`font-bold ${candidate.totalScore >= formData.minimumScoreThreshold ? 'text-green-600' : 'text-gray-600'}`}>
                            {candidate.totalScore.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={candidate.shortlistDecision}
                            onChange={(e) => updateCandidate(candidate.id, 'shortlistDecision', e.target.checked)}
                            className="rounded border-gray-300 text-green-500"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={candidate.remarks}
                            onChange={(e) => updateCandidate(candidate.id, 'remarks', e.target.value)}
                            className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                            placeholder="Remarks"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => removeCandidate(candidate.id)}
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
            )}
          </div>

          {/* Confirmation */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirmation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">RC Chair</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.rcChairName}
                  onChange={(e) => handleChange('rcChairName', e.target.value)}
                  className="w-full px-3 py-2 mb-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.rcChairConfirmed}
                    onChange={(e) => handleChange('rcChairConfirmed', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Confirmed</span>
                </label>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">HR Specialist</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.hrSpecialistName}
                  onChange={(e) => handleChange('hrSpecialistName', e.target.value)}
                  className="w-full px-3 py-2 mb-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.hrSpecialistConfirmed}
                    onChange={(e) => handleChange('hrSpecialistConfirmed', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Confirmed</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShortlistList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shortlisting</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 7: Score and rank candidates</p>
        </div>
        <Link
          to="/hr/recruitment/shortlisting/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Shortlist
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Vacancy</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Longlisted</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Shortlisted</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No shortlisting records found</p>
                <Link
                  to="/hr/recruitment/shortlisting/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600"
                >
                  <Plus className="h-4 w-4" />
                  Start Shortlisting
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Shortlisting = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <ShortlistForm />;
  return <ShortlistList />;
};

export default Shortlisting;
