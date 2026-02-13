import { useState } from 'react';
import {
  Plus,
  Search,
  FileText,
  Eye,
  ChevronLeft,
  Save,
  Send,
  CheckCircle,
  XCircle,
  Users,
  Phone,
  Mail,
  Download
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface CandidateRecord {
  id: string;
  candidateName: string;
  phone: string;
  email: string;
  age: number;
  gender: 'male' | 'female';
  nativeProvince: string;
  currentResidency: string;
  nativeLanguage: string;
  degree: string;
  universityCountry: string;
  relevantExperienceYears: number;
  meetsMinimumEducation: boolean;
  meetsMinimumExperience: boolean;
  eligible: boolean;
  remarks: string;
}

interface LonglistFormData {
  vacancyNumber: string;
  positionTitle: string;
  department: string;
  announcementDate: string;
  closingDate: string;
  minimumEducation: string;
  minimumExperience: number;
  candidates: CandidateRecord[];
  rcChairName: string;
  rcChairConfirmed: boolean;
  hrSpecialistName: string;
  hrSpecialistConfirmed: boolean;
  status: 'draft' | 'in_progress' | 'completed';
}

// Sample candidates data - In production, this would come from applications database
const sampleCandidates: CandidateRecord[] = [
  {
    id: '1',
    candidateName: 'Ahmad Ahmadi',
    phone: '+93 700 123 456',
    email: 'ahmad.ahmadi@email.com',
    age: 28,
    gender: 'male',
    nativeProvince: 'Kabul',
    currentResidency: 'Kabul',
    nativeLanguage: 'Dari',
    degree: 'Bachelor',
    universityCountry: 'Afghanistan',
    relevantExperienceYears: 4,
    meetsMinimumEducation: true,
    meetsMinimumExperience: true,
    eligible: true,
    remarks: '',
  },
  {
    id: '2',
    candidateName: 'Fatima Nazari',
    phone: '+93 700 234 567',
    email: 'fatima.nazari@email.com',
    age: 32,
    gender: 'female',
    nativeProvince: 'Herat',
    currentResidency: 'Kabul',
    nativeLanguage: 'Dari',
    degree: 'Master',
    universityCountry: 'India',
    relevantExperienceYears: 6,
    meetsMinimumEducation: true,
    meetsMinimumExperience: true,
    eligible: true,
    remarks: '',
  },
  {
    id: '3',
    candidateName: 'Mohammad Karimi',
    phone: '+93 700 345 678',
    email: 'mohammad.karimi@email.com',
    age: 25,
    gender: 'male',
    nativeProvince: 'Balkh',
    currentResidency: 'Mazar-i-Sharif',
    nativeLanguage: 'Pashto',
    degree: 'Bachelor',
    universityCountry: 'Afghanistan',
    relevantExperienceYears: 1,
    meetsMinimumEducation: true,
    meetsMinimumExperience: false,
    eligible: false,
    remarks: 'Insufficient experience',
  },
  {
    id: '4',
    candidateName: 'Zahra Rahimi',
    phone: '+93 700 456 789',
    email: 'zahra.rahimi@email.com',
    age: 30,
    gender: 'female',
    nativeProvince: 'Kandahar',
    currentResidency: 'Kabul',
    nativeLanguage: 'Pashto',
    degree: 'Bachelor',
    universityCountry: 'Pakistan',
    relevantExperienceYears: 5,
    meetsMinimumEducation: true,
    meetsMinimumExperience: true,
    eligible: true,
    remarks: '',
  },
  {
    id: '5',
    candidateName: 'Ali Mohammadi',
    phone: '+93 700 567 890',
    email: 'ali.mohammadi@email.com',
    age: 27,
    gender: 'male',
    nativeProvince: 'Nangarhar',
    currentResidency: 'Jalalabad',
    nativeLanguage: 'Pashto',
    degree: 'Diploma',
    universityCountry: 'Afghanistan',
    relevantExperienceYears: 3,
    meetsMinimumEducation: false,
    meetsMinimumExperience: true,
    eligible: false,
    remarks: 'Does not meet education requirement',
  },
  {
    id: '6',
    candidateName: 'Maryam Hakimi',
    phone: '+93 700 678 901',
    email: 'maryam.hakimi@email.com',
    age: 29,
    gender: 'female',
    nativeProvince: 'Kabul',
    currentResidency: 'Kabul',
    nativeLanguage: 'Dari',
    degree: 'Master',
    universityCountry: 'Turkey',
    relevantExperienceYears: 4,
    meetsMinimumEducation: true,
    meetsMinimumExperience: true,
    eligible: true,
    remarks: '',
  },
];

const LonglistForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<LonglistFormData>({
    vacancyNumber: 'VAC-2026-001',
    positionTitle: 'Project Officer',
    department: 'Programs',
    announcementDate: '2026-01-15',
    closingDate: '2026-02-01',
    minimumEducation: 'Bachelor',
    minimumExperience: 2,
    candidates: sampleCandidates,
    rcChairName: '',
    rcChairConfirmed: false,
    hrSpecialistName: '',
    hrSpecialistConfirmed: false,
    status: 'draft',
  });

  const handleChange = (field: keyof LonglistFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCandidate = () => {
    const newCandidate: CandidateRecord = {
      id: Date.now().toString(),
      candidateName: '',
      phone: '',
      email: '',
      age: 0,
      gender: 'male',
      nativeProvince: '',
      currentResidency: '',
      nativeLanguage: '',
      degree: '',
      universityCountry: '',
      relevantExperienceYears: 0,
      meetsMinimumEducation: false,
      meetsMinimumExperience: false,
      eligible: false,
      remarks: '',
    };
    setFormData(prev => ({ ...prev, candidates: [...prev.candidates, newCandidate] }));
  };

  const updateCandidate = (id: string, field: keyof CandidateRecord, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      candidates: prev.candidates.map(c => {
        if (c.id === id) {
          const updated = { ...c, [field]: value };
          // Auto-calculate eligibility
          if (field === 'meetsMinimumEducation' || field === 'meetsMinimumExperience') {
            updated.eligible = updated.meetsMinimumEducation && updated.meetsMinimumExperience;
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
    console.log('Saving Longlist:', formData);
    navigate('/hr/recruitment/longlisting');
  };

  const eligibleCount = formData.candidates.filter(c => c.eligible).length;
  const totalCount = formData.candidates.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/recruitment/longlisting"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Longlisting' : 'New Longlisting'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 6: Initial eligibility screening of applicants
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
            Complete Longlisting
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Applications</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</p>
        </div>
        <div className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <p className="text-sm text-green-600 dark:text-green-400">Eligible</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{eligibleCount}</p>
        </div>
        <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">Not Eligible</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">{totalCount - eligibleCount}</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Vacancy Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vacancy Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minimum Education
                </label>
                <select
                  value={formData.minimumEducation}
                  onChange={(e) => handleChange('minimumEducation', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Baccalaureate">Baccalaureate</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minimum Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimumExperience}
                  onChange={(e) => handleChange('minimumExperience', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Candidates Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Candidate Screening</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    // In production, this would fetch from applications database
                    console.log('Loading candidates from applications...');
                  }}
                  className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  <Download className="h-4 w-4" />
                  Load from Applications
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
                  No candidates added. Click "Add Candidate" to start screening.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">S/No</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Province</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Degree</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Exp (Yrs)</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Meets Edu</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Meets Exp</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Eligible</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {formData.candidates.map((candidate, index) => (
                      <tr key={candidate.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{index + 1}</td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={candidate.candidateName}
                            onChange={(e) => updateCandidate(candidate.id, 'candidateName', e.target.value)}
                            className="w-32 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
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
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={candidate.age || ''}
                            onChange={(e) => updateCandidate(candidate.id, 'age', parseInt(e.target.value) || 0)}
                            className="w-14 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={candidate.gender}
                            onChange={(e) => updateCandidate(candidate.id, 'gender', e.target.value)}
                            className="w-20 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={candidate.nativeProvince}
                            onChange={(e) => updateCandidate(candidate.id, 'nativeProvince', e.target.value)}
                            className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                            placeholder="Province"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={candidate.degree}
                            onChange={(e) => updateCandidate(candidate.id, 'degree', e.target.value)}
                            className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                            placeholder="Degree"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={candidate.relevantExperienceYears || ''}
                            onChange={(e) => updateCandidate(candidate.id, 'relevantExperienceYears', parseInt(e.target.value) || 0)}
                            className="w-14 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={candidate.meetsMinimumEducation}
                            onChange={(e) => updateCandidate(candidate.id, 'meetsMinimumEducation', e.target.checked)}
                            className="rounded border-gray-300 text-primary-500"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={candidate.meetsMinimumExperience}
                            onChange={(e) => updateCandidate(candidate.id, 'meetsMinimumExperience', e.target.checked)}
                            className="rounded border-gray-300 text-primary-500"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          {candidate.eligible ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={candidate.remarks}
                            onChange={(e) => updateCandidate(candidate.id, 'remarks', e.target.value)}
                            className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                            placeholder="Remarks"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => removeCandidate(candidate.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <XCircle className="h-4 w-4" />
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

const LonglistList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Longlisting</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 6: Initial eligibility screening</p>
        </div>
        <Link
          to="/hr/recruitment/longlisting/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Longlist
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Candidates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Eligible</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No longlisting records found</p>
                <Link
                  to="/hr/recruitment/longlisting/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600"
                >
                  <Plus className="h-4 w-4" />
                  Start Longlisting
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Longlisting = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <LonglistForm />;
  return <LonglistList />;
};

export default Longlisting;
