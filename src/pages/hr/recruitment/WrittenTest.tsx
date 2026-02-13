import { useState } from 'react';
import {
  Plus,
  Search,
  FileText,
  ChevronLeft,
  Save,
  Send,
  Users,
  ClipboardList,
  CheckSquare
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface TestAttendee {
  id: string;
  candidateName: string;
  fatherName: string;
  candidateCode: string;
  attended: boolean;
  signature: boolean;
  remarks: string;
}

interface TestResult {
  id: string;
  sNo: number;
  candidateCode: string;
  candidateName: string;
  section1Score: number;
  section2Score: number;
  section3Score: number;
  totalScore: number;
  percentage: number;
  passFail: 'pass' | 'fail';
}

interface WrittenTestFormData {
  vacancyNumber: string;
  positionTitle: string;
  province: string;
  testDate: string;
  testTime: string;
  totalMarks: number;
  passingPercentage: number;
  // Attendance
  attendees: TestAttendee[];
  // Results
  results: TestResult[];
  // Examiner
  examinerName: string;
  examinerSignature: boolean;
  examinerDate: string;
  status: 'draft' | 'attendance_taken' | 'graded' | 'completed';
  activeTab: 'attendance' | 'results';
}

const WrittenTestForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<WrittenTestFormData>({
    vacancyNumber: '',
    positionTitle: '',
    province: '',
    testDate: new Date().toISOString().split('T')[0],
    testTime: '09:00',
    totalMarks: 100,
    passingPercentage: 50,
    attendees: [],
    results: [],
    examinerName: '',
    examinerSignature: false,
    examinerDate: '',
    status: 'draft',
    activeTab: 'attendance',
  });

  const handleChange = (field: keyof WrittenTestFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Attendance functions
  const addAttendee = () => {
    const candidateCode = `C${String(formData.attendees.length + 1).padStart(3, '0')}`;
    const newAttendee: TestAttendee = {
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

  const updateAttendee = (id: string, field: keyof TestAttendee, value: unknown) => {
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

  // Results functions
  const generateResultsFromAttendance = () => {
    const attendedCandidates = formData.attendees.filter(a => a.attended);
    const newResults: TestResult[] = attendedCandidates.map((a, index) => ({
      id: a.id,
      sNo: index + 1,
      candidateCode: a.candidateCode,
      candidateName: a.candidateName,
      section1Score: 0,
      section2Score: 0,
      section3Score: 0,
      totalScore: 0,
      percentage: 0,
      passFail: 'fail' as const,
    }));
    setFormData(prev => ({ ...prev, results: newResults, activeTab: 'results', status: 'attendance_taken' }));
  };

  const updateResult = (id: string, field: keyof TestResult, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      results: prev.results.map(r => {
        if (r.id === id) {
          const updated = { ...r, [field]: value };
          // Recalculate totals
          if (field === 'section1Score' || field === 'section2Score' || field === 'section3Score') {
            updated.totalScore = updated.section1Score + updated.section2Score + updated.section3Score;
            updated.percentage = (updated.totalScore / formData.totalMarks) * 100;
            updated.passFail = updated.percentage >= formData.passingPercentage ? 'pass' : 'fail';
          }
          return updated;
        }
        return r;
      }),
    }));
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    console.log('Saving Written Test:', formData);
    navigate('/hr/recruitment/written-test');
  };

  const attendedCount = formData.attendees.filter(a => a.attended).length;
  const passedCount = formData.results.filter(r => r.passFail === 'pass').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/recruitment/written-test"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Written Test' : 'New Written Test'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Forms 8, 9, 10: Test paper, attendance, and results
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
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Candidates</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formData.attendees.length}</p>
        </div>
        <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <p className="text-sm text-blue-600 dark:text-blue-400">Attended</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{attendedCount}</p>
        </div>
        <div className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <p className="text-sm text-green-600 dark:text-green-400">Passed</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{passedCount}</p>
        </div>
        <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">Failed</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">{formData.results.length - passedCount}</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Test Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Test Date</label>
                <input
                  type="date"
                  value={formData.testDate}
                  onChange={(e) => handleChange('testDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Test Time</label>
                <input
                  type="time"
                  value={formData.testTime}
                  onChange={(e) => handleChange('testTime', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleChange('activeTab', 'attendance')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  formData.activeTab === 'attendance'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ClipboardList className="inline-block h-4 w-4 mr-2" />
                Attendance (Form 9)
              </button>
              <button
                onClick={() => handleChange('activeTab', 'results')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  formData.activeTab === 'results'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <CheckSquare className="inline-block h-4 w-4 mr-2" />
                Results (Form 10)
              </button>
            </div>

            {/* Attendance Tab */}
            {formData.activeTab === 'attendance' && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white">Test Attendance Sheet</h3>
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
                      No candidates added. Add shortlisted candidates for the test.
                    </p>
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
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Signed</th>
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
                                  className="w-32 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={attendee.fatherName}
                                  onChange={(e) => updateAttendee(attendee.id, 'fatherName', e.target.value)}
                                  className="w-32 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
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
                                  className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
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
                    <div className="mt-4">
                      <button
                        onClick={generateResultsFromAttendance}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                      >
                        Generate Results Sheet
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Results Tab */}
            {formData.activeTab === 'results' && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white">Test Results Sheet</h3>
                  <div className="text-sm text-gray-500">
                    Total Marks: {formData.totalMarks} | Pass: ≥{formData.passingPercentage}%
                  </div>
                </div>

                {formData.results.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      No results yet. Complete attendance first and generate results sheet.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">S/No</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Section 1</th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Section 2</th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Section 3</th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">%</th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {formData.results.map((result, index) => (
                          <tr
                            key={result.id}
                            className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                              result.passFail === 'pass' ? 'bg-green-50 dark:bg-green-900/10' : ''
                            }`}
                          >
                            <td className="px-3 py-2">{index + 1}</td>
                            <td className="px-3 py-2 font-mono text-xs">{result.candidateCode}</td>
                            <td className="px-3 py-2">{result.candidateName}</td>
                            <td className="px-3 py-2 text-center">
                              <input
                                type="number"
                                min="0"
                                value={result.section1Score || ''}
                                onChange={(e) => updateResult(result.id, 'section1Score', parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-center"
                              />
                            </td>
                            <td className="px-3 py-2 text-center">
                              <input
                                type="number"
                                min="0"
                                value={result.section2Score || ''}
                                onChange={(e) => updateResult(result.id, 'section2Score', parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-center"
                              />
                            </td>
                            <td className="px-3 py-2 text-center">
                              <input
                                type="number"
                                min="0"
                                value={result.section3Score || ''}
                                onChange={(e) => updateResult(result.id, 'section3Score', parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-center"
                              />
                            </td>
                            <td className="px-3 py-2 text-center font-medium">{result.totalScore}</td>
                            <td className="px-3 py-2 text-center">{result.percentage.toFixed(1)}%</td>
                            <td className="px-3 py-2 text-center">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                result.passFail === 'pass'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {result.passFail === 'pass' ? 'PASS' : 'FAIL'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Examiner Signature */}
                <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Examiner Signature</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Examiner Name"
                      value={formData.examinerName}
                      onChange={(e) => handleChange('examinerName', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                    <input
                      type="date"
                      value={formData.examinerDate}
                      onChange={(e) => handleChange('examinerDate', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.examinerSignature}
                        onChange={(e) => handleChange('examinerSignature', e.target.checked)}
                        className="rounded border-gray-300 text-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Signed</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const WrittenTestList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Written Tests</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Forms 8, 9, 10: Test management</p>
        </div>
        <Link
          to="/hr/recruitment/written-test/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Test
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No written tests found</p>
                <Link
                  to="/hr/recruitment/written-test/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                >
                  <Plus className="h-4 w-4" />
                  Schedule New Test
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const WrittenTest = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <WrittenTestForm />;
  return <WrittenTestList />;
};

export default WrittenTest;
