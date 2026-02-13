import { useState } from 'react';
import {
  Plus,
  Search,
  FileText,
  ChevronLeft,
  Save,
  Send,
  Download,
  Printer
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface TopCandidate {
  rank: number;
  name: string;
  writtenScore: number;
  interviewScore: number;
  totalScore: number;
  strengths: string;
  concerns: string;
}

interface RCMember {
  name: string;
  position: string;
  signed: boolean;
}

interface RecruitmentReportData {
  // Position Details
  positionTitle: string;
  location: string;
  announcementDate: string;
  closingDate: string;
  vacancyNumber: string;
  // Overview
  purposeAndScope: string;
  // Timeline
  announcementPeriodStart: string;
  announcementPeriodEnd: string;
  applicationReviewSummary: string;
  longlistingCriteria: string;
  longlistingNumber: number;
  shortlistingCriteria: string;
  shortlistingNumber: number;
  // Interview Details
  interviewDates: string;
  interviewMethod: string;
  // Panel
  rcMembers: RCMember[];
  // Top Candidates
  topCandidates: TopCandidate[];
  // Recommendation
  recommendationNarrative: string;
  recommendedCandidate: string;
  // Annexes
  annexes: {
    srf: boolean;
    shortlist: boolean;
    rcForm: boolean;
    testPapers: boolean;
    interviewForms: boolean;
    resultSheet: boolean;
  };
  // Date
  reportDate: string;
  status: 'draft' | 'submitted' | 'approved';
}

const RecruitmentReportForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<RecruitmentReportData>({
    positionTitle: '',
    location: '',
    announcementDate: '',
    closingDate: '',
    vacancyNumber: '',
    purposeAndScope: '',
    announcementPeriodStart: '',
    announcementPeriodEnd: '',
    applicationReviewSummary: '',
    longlistingCriteria: '',
    longlistingNumber: 0,
    shortlistingCriteria: '',
    shortlistingNumber: 0,
    interviewDates: '',
    interviewMethod: 'In-person',
    rcMembers: [
      { name: '', position: '', signed: false },
      { name: '', position: '', signed: false },
      { name: '', position: '', signed: false },
    ],
    topCandidates: [
      { rank: 1, name: '', writtenScore: 0, interviewScore: 0, totalScore: 0, strengths: '', concerns: '' },
      { rank: 2, name: '', writtenScore: 0, interviewScore: 0, totalScore: 0, strengths: '', concerns: '' },
      { rank: 3, name: '', writtenScore: 0, interviewScore: 0, totalScore: 0, strengths: '', concerns: '' },
    ],
    recommendationNarrative: '',
    recommendedCandidate: '',
    annexes: {
      srf: false,
      shortlist: false,
      rcForm: false,
      testPapers: false,
      interviewForms: false,
      resultSheet: false,
    },
    reportDate: new Date().toISOString().split('T')[0],
    status: 'draft',
  });

  const handleChange = (field: keyof RecruitmentReportData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateRCMember = (index: number, field: keyof RCMember, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      rcMembers: prev.rcMembers.map((m, i) => i === index ? { ...m, [field]: value } : m),
    }));
  };

  const updateTopCandidate = (index: number, field: keyof TopCandidate, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      topCandidates: prev.topCandidates.map((c, i) => {
        if (i === index) {
          const updated = { ...c, [field]: value };
          if (field === 'writtenScore' || field === 'interviewScore') {
            updated.totalScore = updated.writtenScore + updated.interviewScore;
          }
          return updated;
        }
        return c;
      }),
    }));
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    console.log('Saving Report:', formData);
    navigate('/hr/recruitment/report');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/recruitment/report"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Recruitment Report' : 'New Recruitment Report'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 14: Summarize recruitment process and recommend candidates
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Download className="h-4 w-4" />
            Export
          </button>
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
            Submit for Approval
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Section 1: Position Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">1. Position Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vacancy Number</label>
                <input
                  type="text"
                  value={formData.vacancyNumber}
                  onChange={(e) => handleChange('vacancyNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Announcement Date</label>
                <input
                  type="date"
                  value={formData.announcementDate}
                  onChange={(e) => handleChange('announcementDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Closing Date</label>
                <input
                  type="date"
                  value={formData.closingDate}
                  onChange={(e) => handleChange('closingDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Overview */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">2. Overview</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purpose and Scope of Position</label>
              <textarea
                value={formData.purposeAndScope}
                onChange={(e) => handleChange('purposeAndScope', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Section 3: Timeline */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">3. Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Application Review Summary</label>
                <textarea
                  value={formData.applicationReviewSummary}
                  onChange={(e) => handleChange('applicationReviewSummary', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Longlisted</label>
                  <input
                    type="number"
                    value={formData.longlistingNumber || ''}
                    onChange={(e) => handleChange('longlistingNumber', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shortlisted</label>
                  <input
                    type="number"
                    value={formData.shortlistingNumber || ''}
                    onChange={(e) => handleChange('shortlistingNumber', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Interview Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">4. Interview Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interview Dates</label>
                <input
                  type="text"
                  value={formData.interviewDates}
                  onChange={(e) => handleChange('interviewDates', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="e.g., Dec 1-3, 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interview Method</label>
                <select
                  value={formData.interviewMethod}
                  onChange={(e) => handleChange('interviewMethod', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <option value="In-person">In-person</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Panel Members</h3>
            <div className="space-y-2">
              {formData.rcMembers.map((member, index) => (
                <div key={index} className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) => updateRCMember(index, 'name', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={member.position}
                    onChange={(e) => updateRCMember(index, 'position', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={member.signed}
                      onChange={(e) => updateRCMember(index, 'signed', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500"
                    />
                    <span className="text-sm">Signed</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Top 3 Candidates */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">5. Top 3 Candidates</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-3 py-2 text-left">Rank</th>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-center">Written</th>
                    <th className="px-3 py-2 text-center">Interview</th>
                    <th className="px-3 py-2 text-center">Total</th>
                    <th className="px-3 py-2 text-left">Strengths</th>
                    <th className="px-3 py-2 text-left">Concerns</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {formData.topCandidates.map((candidate, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 font-bold">#{candidate.rank}</td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={candidate.name}
                          onChange={(e) => updateTopCandidate(index, 'name', e.target.value)}
                          className="w-32 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="number"
                          value={candidate.writtenScore || ''}
                          onChange={(e) => updateTopCandidate(index, 'writtenScore', parseFloat(e.target.value) || 0)}
                          className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-center"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="number"
                          value={candidate.interviewScore || ''}
                          onChange={(e) => updateTopCandidate(index, 'interviewScore', parseFloat(e.target.value) || 0)}
                          className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-center"
                        />
                      </td>
                      <td className="px-3 py-2 text-center font-bold">{candidate.totalScore.toFixed(1)}</td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={candidate.strengths}
                          onChange={(e) => updateTopCandidate(index, 'strengths', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={candidate.concerns}
                          onChange={(e) => updateTopCandidate(index, 'concerns', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 6: RC Recommendation */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">6. RC Recommendation</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recommendation Narrative</label>
                <textarea
                  value={formData.recommendationNarrative}
                  onChange={(e) => handleChange('recommendationNarrative', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="Based on the evaluation results, the Recruitment Committee recommends..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recommended Candidate</label>
                <input
                  type="text"
                  value={formData.recommendedCandidate}
                  onChange={(e) => handleChange('recommendedCandidate', e.target.value)}
                  className="w-full max-w-md px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Section 7: Annexes */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">7. Annexes Checklist</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: 'srf', label: 'Staff Requisition Form (SRF)' },
                { key: 'shortlist', label: 'Shortlist Template' },
                { key: 'rcForm', label: 'RC Form & COI Forms' },
                { key: 'testPapers', label: 'Test Papers & Attendance' },
                { key: 'interviewForms', label: 'Interview Forms & Attendance' },
                { key: 'resultSheet', label: 'Result Sheet' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.annexes[key as keyof typeof formData.annexes]}
                    onChange={(e) => handleChange('annexes', { ...formData.annexes, [key]: e.target.checked })}
                    className="rounded border-gray-300 text-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Report Date */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Report Date:</label>
              <input
                type="date"
                value={formData.reportDate}
                onChange={(e) => handleChange('reportDate', e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecruitmentReportList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recruitment Reports</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 14: Final recruitment summaries</p>
        </div>
        <Link
          to="/hr/recruitment/report/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Report
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommended</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600">No recruitment reports found</p>
                <Link
                  to="/hr/recruitment/report/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                >
                  <Plus className="h-4 w-4" />
                  Create Report
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RecruitmentReport = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <RecruitmentReportForm />;
  return <RecruitmentReportList />;
};

export default RecruitmentReport;
