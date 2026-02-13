import { useState } from 'react';
import {
  Plus,
  Search,
  FileText,
  ChevronLeft,
  Save,
  Send,
  Users,
  Trash2,
  Linkedin,
  Mail,
  UserPlus
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface CandidateSource {
  id: string;
  candidateFullName: string;
  sourceChannel: string;
  contactNumber: string;
  email: string;
  dateReceived: string;
  eligibilityCheck: boolean;
  reasonIfNotEligible: string;
  submittedToRC: boolean;
  remarks: string;
}

interface ChannelSummary {
  channel: string;
  count: number;
  notes: string;
}

interface CandidateSourcingData {
  positionTitle: string;
  departmentProject: string;
  dutyStation: string;
  srfNumber: string;
  dateSourcingInitiated: string;
  candidates: CandidateSource[];
  channelSummary: ChannelSummary[];
  preparedBy: string;
  preparedDate: string;
  status: 'draft' | 'in_progress' | 'completed';
}

const sourceChannels = [
  'LinkedIn',
  'Professional Networks',
  'Internal CV Database',
  'Staff Referral',
  'Direct Email',
  'Job Boards',
  'University/College',
  'Other',
];

const CandidateSourcingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<CandidateSourcingData>({
    positionTitle: '',
    departmentProject: '',
    dutyStation: '',
    srfNumber: '',
    dateSourcingInitiated: new Date().toISOString().split('T')[0],
    candidates: [],
    channelSummary: sourceChannels.map(channel => ({ channel, count: 0, notes: '' })),
    preparedBy: '',
    preparedDate: new Date().toISOString().split('T')[0],
    status: 'draft',
  });

  const handleChange = (field: keyof CandidateSourcingData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCandidate = () => {
    const newCandidate: CandidateSource = {
      id: Date.now().toString(),
      candidateFullName: '',
      sourceChannel: 'LinkedIn',
      contactNumber: '',
      email: '',
      dateReceived: new Date().toISOString().split('T')[0],
      eligibilityCheck: false,
      reasonIfNotEligible: '',
      submittedToRC: false,
      remarks: '',
    };
    setFormData(prev => ({ ...prev, candidates: [...prev.candidates, newCandidate] }));
  };

  const updateCandidate = (id: string, field: keyof CandidateSource, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      candidates: prev.candidates.map(c => c.id === id ? { ...c, [field]: value } : c),
    }));
  };

  const removeCandidate = (id: string) => {
    setFormData(prev => ({
      ...prev,
      candidates: prev.candidates.filter(c => c.id !== id),
    }));
  };

  const updateChannelSummary = (channel: string, field: keyof ChannelSummary, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      channelSummary: prev.channelSummary.map(s => s.channel === channel ? { ...s, [field]: value } : s),
    }));
  };

  // Auto-calculate channel counts
  const calculateChannelCounts = () => {
    const counts: Record<string, number> = {};
    formData.candidates.forEach(c => {
      counts[c.sourceChannel] = (counts[c.sourceChannel] || 0) + 1;
    });
    setFormData(prev => ({
      ...prev,
      channelSummary: prev.channelSummary.map(s => ({
        ...s,
        count: counts[s.channel] || 0,
      })),
    }));
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    calculateChannelCounts();
    console.log('Saving Candidate Sourcing:', formData);
    navigate('/hr/recruitment/candidate-sourcing');
  };

  const eligibleCount = formData.candidates.filter(c => c.eligibilityCheck).length;
  const submittedCount = formData.candidates.filter(c => c.submittedToRC).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/recruitment/candidate-sourcing"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Candidate Sourcing' : 'New Candidate Sourcing'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 48: Track candidate sourcing for headhunting
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit('save')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
          >
            <Save className="h-4 w-4" />
            Save
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
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Sourced</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formData.candidates.length}</p>
        </div>
        <div className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <p className="text-sm text-green-600 dark:text-green-400">Eligible</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{eligibleCount}</p>
        </div>
        <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <p className="text-sm text-blue-600 dark:text-blue-400">Submitted to RC</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{submittedCount}</p>
        </div>
        <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">Not Eligible</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">{formData.candidates.length - eligibleCount}</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Position Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Position Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position Title</label>
                <input
                  type="text"
                  value={formData.positionTitle}
                  onChange={(e) => handleChange('positionTitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department/Project</label>
                <input
                  type="text"
                  value={formData.departmentProject}
                  onChange={(e) => handleChange('departmentProject', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duty Station</label>
                <input
                  type="text"
                  value={formData.dutyStation}
                  onChange={(e) => handleChange('dutyStation', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SRF Number</label>
                <input
                  type="text"
                  value={formData.srfNumber}
                  onChange={(e) => handleChange('srfNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Candidate Records */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Candidate Records</h2>
              <button
                onClick={addCandidate}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600"
              >
                <Plus className="h-4 w-4" />
                Add Candidate
              </button>
            </div>

            {formData.candidates.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  No candidates sourced yet. Click "Add Candidate" to start tracking.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">S/N</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Eligible</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">To RC</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {formData.candidates.map((candidate, index) => (
                      <tr key={candidate.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={candidate.candidateFullName}
                            onChange={(e) => updateCandidate(candidate.id, 'candidateFullName', e.target.value)}
                            className="w-32 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                            placeholder="Full Name"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={candidate.sourceChannel}
                            onChange={(e) => updateCandidate(candidate.id, 'sourceChannel', e.target.value)}
                            className="w-28 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                          >
                            {sourceChannels.map(channel => (
                              <option key={channel} value={channel}>{channel}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="tel"
                            value={candidate.contactNumber}
                            onChange={(e) => updateCandidate(candidate.id, 'contactNumber', e.target.value)}
                            className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                            placeholder="Phone"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="email"
                            value={candidate.email}
                            onChange={(e) => updateCandidate(candidate.id, 'email', e.target.value)}
                            className="w-32 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                            placeholder="Email"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="date"
                            value={candidate.dateReceived}
                            onChange={(e) => updateCandidate(candidate.id, 'dateReceived', e.target.value)}
                            className="w-28 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={candidate.eligibilityCheck}
                            onChange={(e) => updateCandidate(candidate.id, 'eligibilityCheck', e.target.checked)}
                            className="rounded border-gray-300 text-green-500"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={candidate.submittedToRC}
                            onChange={(e) => updateCandidate(candidate.id, 'submittedToRC', e.target.checked)}
                            className="rounded border-gray-300 text-blue-500"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={candidate.remarks}
                            onChange={(e) => updateCandidate(candidate.id, 'remarks', e.target.value)}
                            className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                            placeholder="Notes"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => removeCandidate(candidate.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Channel Summary */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Source Channels Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {formData.channelSummary.map(summary => {
                const channelIcons: Record<string, React.ReactNode> = {
                  'LinkedIn': <Linkedin className="h-4 w-4" />,
                  'Direct Email': <Mail className="h-4 w-4" />,
                  'Staff Referral': <Users className="h-4 w-4" />,
                };
                const count = formData.candidates.filter(c => c.sourceChannel === summary.channel).length;
                return (
                  <div key={summary.channel} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {channelIcons[summary.channel] || <UserPlus className="h-4 w-4" />}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{summary.channel}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prepared By */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prepared By</label>
              <input
                type="text"
                value={formData.preparedBy}
                onChange={(e) => handleChange('preparedBy', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input
                type="date"
                value={formData.preparedDate}
                onChange={(e) => handleChange('preparedDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidateSourcingList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Candidate Sourcing</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 48: Track headhunting activities</p>
        </div>
        <Link
          to="/hr/recruitment/candidate-sourcing/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Sourcing
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sourced</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eligible</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600">No sourcing records found</p>
                <Link
                  to="/hr/recruitment/candidate-sourcing/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                >
                  <Plus className="h-4 w-4" />
                  Start Sourcing
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CandidateSourcing = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <CandidateSourcingForm />;
  return <CandidateSourcingList />;
};

export default CandidateSourcing;
