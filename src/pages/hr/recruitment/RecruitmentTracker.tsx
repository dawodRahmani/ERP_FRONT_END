import { useState } from 'react';
import {
  Plus,
  Download,
  Save,
  ChevronLeft,
  Edit2,
  Trash2,
  CheckCircle,
  Calendar,
  Users
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface CandidateRecord {
  id: string;
  sn: number;
  name: string;
  fatherName: string;
  gender: 'Male' | 'Female';
  location: string;
  phoneNumber: string;
  emailAddress: string;

  // 11 Stage Dates
  torDate: string;
  srfDate: string;
  advertisementDate: string;
  longlistDate: string;
  shortlistDate: string;
  writingTestDate: string;
  screeningPapersDate: string;
  interviewDate: string;
  offerSendDate: string;
  referencesCheckedDate: string;
  contractDate: string;

  // Status & Notes
  status: 'Active' | 'Shortlisted' | 'Interviewed' | 'Offered' | 'Hired' | 'Rejected' | 'Withdrawn';
  declineReasons: string;
  comments: string;
  applicationStage: number;
}

interface RecruitmentTrackerData {
  jobTitle: string;
  recruiterName: string;
  jobPostedDate: string;
  location: string;
  candidates: CandidateRecord[];
}

const RECRUITMENT_STAGES = [
  { stage: 1, name: 'TOR Date', field: 'torDate' },
  { stage: 2, name: 'SRF Date', field: 'srfDate' },
  { stage: 3, name: 'Advertisement Date', field: 'advertisementDate' },
  { stage: 4, name: 'Longlist Applications Date', field: 'longlistDate' },
  { stage: 5, name: 'Shortlist Date', field: 'shortlistDate' },
  { stage: 6, name: 'Writing Test Date', field: 'writingTestDate' },
  { stage: 7, name: 'Screening Papers Date', field: 'screeningPapersDate' },
  { stage: 8, name: 'Interview Date', field: 'interviewDate' },
  { stage: 9, name: 'Offer Send Date', field: 'offerSendDate' },
  { stage: 10, name: 'References Checked', field: 'referencesCheckedDate' },
  { stage: 11, name: 'Contract Date', field: 'contractDate' },
];

const RecruitmentTrackerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [trackerData, setTrackerData] = useState<RecruitmentTrackerData>({
    jobTitle: 'Senior Program Manager',
    recruiterName: 'Ahmad Karimi - HR Officer',
    jobPostedDate: '2026-01-15',
    location: 'Kabul',
    candidates: [
      {
        id: '1',
        sn: 1,
        name: 'Sara Mohammadi',
        fatherName: 'Mohammad Ali',
        gender: 'Female',
        location: 'Kabul',
        phoneNumber: '+93 700 123 456',
        emailAddress: 'sara.mohammadi@email.com',
        torDate: '2026-01-05',
        srfDate: '2026-01-06',
        advertisementDate: '2026-01-15',
        longlistDate: '2026-01-25',
        shortlistDate: '2026-01-28',
        writingTestDate: '2026-02-01',
        screeningPapersDate: '2026-02-02',
        interviewDate: '2026-02-05',
        offerSendDate: '2026-02-07',
        referencesCheckedDate: '2026-02-08',
        contractDate: '',
        status: 'Offered',
        declineReasons: '',
        comments: 'Strong candidate, excellent references',
        applicationStage: 9,
      },
      {
        id: '2',
        sn: 2,
        name: 'Fatima Ahmadi',
        fatherName: 'Abdul Rahman',
        gender: 'Female',
        location: 'Herat',
        phoneNumber: '+93 700 234 567',
        emailAddress: 'fatima.a@email.com',
        torDate: '2026-01-05',
        srfDate: '2026-01-06',
        advertisementDate: '2026-01-15',
        longlistDate: '2026-01-25',
        shortlistDate: '2026-01-28',
        writingTestDate: '2026-02-01',
        screeningPapersDate: '',
        interviewDate: '',
        offerSendDate: '',
        referencesCheckedDate: '',
        contractDate: '',
        status: 'Shortlisted',
        declineReasons: '',
        comments: '',
        applicationStage: 6,
      },
      {
        id: '3',
        sn: 3,
        name: 'Hassan Karimi',
        fatherName: 'Mohammad Qasim',
        gender: 'Male',
        location: 'Mazar-e-Sharif',
        phoneNumber: '+93 700 345 678',
        emailAddress: 'hassan.k@email.com',
        torDate: '2026-01-05',
        srfDate: '2026-01-06',
        advertisementDate: '2026-01-15',
        longlistDate: '2026-01-25',
        shortlistDate: '',
        writingTestDate: '',
        screeningPapersDate: '',
        interviewDate: '',
        offerSendDate: '',
        referencesCheckedDate: '',
        contractDate: '',
        status: 'Rejected',
        declineReasons: 'Insufficient experience in program management',
        comments: 'Does not meet minimum requirements',
        applicationStage: 4,
      },
    ],
  });

  const [editingCandidate, setEditingCandidate] = useState<string | null>(null);

  const handleJobMetadataChange = (field: keyof RecruitmentTrackerData, value: string) => {
    setTrackerData(prev => ({ ...prev, [field]: value }));
  };

  const handleCandidateChange = (candidateId: string, field: keyof CandidateRecord, value: any) => {
    setTrackerData(prev => ({
      ...prev,
      candidates: prev.candidates.map(c =>
        c.id === candidateId ? { ...c, [field]: value } : c
      ),
    }));
  };

  const addNewCandidate = () => {
    const newCandidate: CandidateRecord = {
      id: Date.now().toString(),
      sn: trackerData.candidates.length + 1,
      name: '',
      fatherName: '',
      gender: 'Male',
      location: '',
      phoneNumber: '',
      emailAddress: '',
      torDate: trackerData.candidates[0]?.torDate || '',
      srfDate: trackerData.candidates[0]?.srfDate || '',
      advertisementDate: trackerData.candidates[0]?.advertisementDate || '',
      longlistDate: '',
      shortlistDate: '',
      writingTestDate: '',
      screeningPapersDate: '',
      interviewDate: '',
      offerSendDate: '',
      referencesCheckedDate: '',
      contractDate: '',
      status: 'Active',
      declineReasons: '',
      comments: '',
      applicationStage: 1,
    };
    setTrackerData(prev => ({
      ...prev,
      candidates: [...prev.candidates, newCandidate],
    }));
    setEditingCandidate(newCandidate.id);
  };

  const deleteCandidate = (candidateId: string) => {
    if (confirm('Are you sure you want to delete this candidate?')) {
      setTrackerData(prev => ({
        ...prev,
        candidates: prev.candidates.filter(c => c.id !== candidateId),
      }));
    }
  };

  const handleSave = () => {
    console.log('Saving Recruitment Tracker:', trackerData);
    navigate('/hr/recruitment/tracker');
  };

  const handleExportExcel = () => {
    console.log('Exporting to Excel...');
    // Implement Excel export functionality
  };

  // Calculate statistics
  const stats = {
    totalApplications: trackerData.candidates.length,
    longlisted: trackerData.candidates.filter(c => c.longlistDate).length,
    shortlisted: trackerData.candidates.filter(c => c.shortlistDate).length,
    interviewed: trackerData.candidates.filter(c => c.interviewDate).length,
    offered: trackerData.candidates.filter(c => c.offerSendDate).length,
    hired: trackerData.candidates.filter(c => c.contractDate).length,
  };

  const getStatusColor = (status: CandidateRecord['status']) => {
    const colors: Record<CandidateRecord['status'], string> = {
      Active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      Shortlisted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      Interviewed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      Offered: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      Hired: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      Withdrawn: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/recruitment"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recruitment Tracking Sheet
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 3: Track all candidates for a specific position through recruitment stages
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4" />
            Export to Excel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            <Save className="h-4 w-4" />
            Save Tracker
          </button>
        </div>
      </div>

      {/* Job Metadata Section */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Position Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Announced Title
              </label>
              <input
                type="text"
                value={trackerData.jobTitle}
                onChange={(e) => handleJobMetadataChange('jobTitle', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Senior Program Manager"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name of The Recruiter
              </label>
              <input
                type="text"
                value={trackerData.recruiterName}
                onChange={(e) => handleJobMetadataChange('recruiterName', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Ahmad Karimi - HR Officer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Posted Date
              </label>
              <input
                type="date"
                value={trackerData.jobPostedDate}
                onChange={(e) => handleJobMetadataChange('jobPostedDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={trackerData.location}
                onChange={(e) => handleJobMetadataChange('location', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Kabul, Herat"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Applications</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalApplications}</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Longlisted</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.longlisted}</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Shortlisted</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.shortlisted}</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Interviewed</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.interviewed}</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Offered</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.offered}</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Hired</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.hired}</div>
        </div>
      </div>

      {/* Recruitment Stages Reference */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">11 Recruitment Stages</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
          {RECRUITMENT_STAGES.map((stage) => (
            <div key={stage.stage} className="flex items-center gap-1.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-500 text-white font-semibold text-[10px]">
                {stage.stage}
              </span>
              <span className="text-gray-700 dark:text-gray-300">{stage.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Tracking Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Step by Step Enter Applications Info-Details
          </h2>
          <button
            onClick={addNewCandidate}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600"
          >
            <Plus className="h-4 w-4" />
            Add Candidate
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[2400px]">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="sticky left-0 z-10 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-12">S/N</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-40">Name</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-32">Father Name</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-20">Gender</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-28">Location</th>
                {RECRUITMENT_STAGES.map((stage) => (
                  <th key={stage.field} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-32">
                    {stage.name}
                  </th>
                ))}
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-28">Phone Number</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-40">Email Address</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-24">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-40">Decline Reasons</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-40">Comments</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-16">Stage</th>
                <th className="sticky right-0 z-10 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {trackerData.candidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="sticky left-0 z-10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white">
                    {candidate.sn}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={candidate.name}
                      onChange={(e) => handleCandidateChange(candidate.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Full name"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={candidate.fatherName}
                      onChange={(e) => handleCandidateChange(candidate.id, 'fatherName', e.target.value)}
                      className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Father name"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={candidate.gender}
                      onChange={(e) => handleCandidateChange(candidate.id, 'gender', e.target.value)}
                      className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={candidate.location}
                      onChange={(e) => handleCandidateChange(candidate.id, 'location', e.target.value)}
                      className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Location"
                    />
                  </td>
                  {RECRUITMENT_STAGES.map((stage) => (
                    <td key={stage.field} className="px-3 py-2">
                      <input
                        type="date"
                        value={candidate[stage.field as keyof CandidateRecord] as string || ''}
                        onChange={(e) => handleCandidateChange(candidate.id, stage.field as keyof CandidateRecord, e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={candidate.phoneNumber}
                      onChange={(e) => handleCandidateChange(candidate.id, 'phoneNumber', e.target.value)}
                      className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="+93..."
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="email"
                      value={candidate.emailAddress}
                      onChange={(e) => handleCandidateChange(candidate.id, 'emailAddress', e.target.value)}
                      className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="email@example.com"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={candidate.status}
                      onChange={(e) => handleCandidateChange(candidate.id, 'status', e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interviewed">Interviewed</option>
                      <option value="Offered">Offered</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Withdrawn">Withdrawn</option>
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={candidate.declineReasons}
                      onChange={(e) => handleCandidateChange(candidate.id, 'declineReasons', e.target.value)}
                      className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="If rejected..."
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={candidate.comments}
                      onChange={(e) => handleCandidateChange(candidate.id, 'comments', e.target.value)}
                      className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Notes..."
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold">
                      {candidate.applicationStage}
                    </span>
                  </td>
                  <td className="sticky right-0 z-10 bg-white dark:bg-gray-800 px-3 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => deleteCandidate(candidate.id)}
                        className="p-1 text-red-500 hover:text-red-600"
                        title="Delete candidate"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
        <div className="flex gap-3">
          <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">Instructions:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Enter each candidate's information in a new row</li>
              <li>Update dates as candidates progress through each of the 11 stages</li>
              <li>The "Application Stage" number automatically reflects the current stage (1-11)</li>
              <li>Use "Status" to track overall candidate state (Active, Shortlisted, Interviewed, Offered, Hired, Rejected, Withdrawn)</li>
              <li>Record decline reasons for rejected candidates for future reference</li>
              <li>Export to Excel to share with the recruitment committee or for archival</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecruitmentTrackerList = () => {
  // Mock data for list of tracking sheets
  const trackers = [
    {
      id: '1',
      jobTitle: 'Senior Program Manager',
      location: 'Kabul',
      postedDate: '2026-01-15',
      totalCandidates: 25,
      shortlisted: 5,
      hired: 0,
      status: 'In Progress',
    },
    {
      id: '2',
      jobTitle: 'Finance Officer',
      location: 'Herat',
      postedDate: '2026-01-10',
      totalCandidates: 18,
      shortlisted: 4,
      hired: 1,
      status: 'Completed',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recruitment Tracking Sheets</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Form 3: Manage candidate tracking for all positions
          </p>
        </div>
        <Link
          to="/hr/recruitment/tracker/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Tracking Sheet
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trackers.map((tracker) => (
          <Link
            key={tracker.id}
            to={`/hr/recruitment/tracker/${tracker.id}`}
            className="block rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{tracker.jobTitle}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tracker.location}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                tracker.status === 'Completed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {tracker.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{tracker.totalCandidates} candidates</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{tracker.postedDate}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Shortlisted: <strong className="text-gray-900 dark:text-white">{tracker.shortlisted}</strong></span>
              <span className="text-gray-500 dark:text-gray-400">Hired: <strong className="text-green-600 dark:text-green-400">{tracker.hired}</strong></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const RecruitmentTracker = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <RecruitmentTrackerForm />;
  return <RecruitmentTrackerList />;
};

export default RecruitmentTracker;
