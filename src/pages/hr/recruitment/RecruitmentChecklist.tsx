import { useState } from 'react';
import {
  Plus,
  Search,
  FileText,
  ChevronLeft,
  Save,
  CheckCircle,
  Circle,
  Download
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface ChecklistItem {
  id: string;
  item: string;
  checked: boolean;
  date: string;
  remarks: string;
}

interface RecruitmentChecklistData {
  vacancyNumber: string;
  positionTitle: string;
  candidateName: string;
  checklistItems: ChecklistItem[];
  preparedBy: string;
  preparedDate: string;
  verifiedBy: string;
  verifiedDate: string;
  status: 'incomplete' | 'complete';
}

const defaultChecklistItems: Omit<ChecklistItem, 'id'>[] = [
  { item: 'Approved ToR (Terms of Reference)', checked: false, date: '', remarks: '' },
  { item: 'Approved SRF (Staff Requisition Form)', checked: false, date: '', remarks: '' },
  { item: 'Job Advertisement', checked: false, date: '', remarks: '' },
  { item: 'Application Forms / CVs', checked: false, date: '', remarks: '' },
  { item: 'Longlisting Template', checked: false, date: '', remarks: '' },
  { item: 'Shortlisting Template', checked: false, date: '', remarks: '' },
  { item: 'RC Form & COI Forms', checked: false, date: '', remarks: '' },
  { item: 'Test Papers & Attendance Sheet', checked: false, date: '', remarks: '' },
  { item: 'Test Results Sheet', checked: false, date: '', remarks: '' },
  { item: 'Interview Evaluation Forms & Attendance', checked: false, date: '', remarks: '' },
  { item: 'Interview Results Sheet', checked: false, date: '', remarks: '' },
  { item: 'Recruitment Report', checked: false, date: '', remarks: '' },
  { item: 'Offer Letter (Signed)', checked: false, date: '', remarks: '' },
  { item: 'Sanction Clearance Check', checked: false, date: '', remarks: '' },
  { item: 'Reference Checks', checked: false, date: '', remarks: '' },
  { item: 'Guarantee Letter', checked: false, date: '', remarks: '' },
  { item: 'Address Verification', checked: false, date: '', remarks: '' },
  { item: 'Criminal Background Check', checked: false, date: '', remarks: '' },
  { item: 'Employment Contract (Signed)', checked: false, date: '', remarks: '' },
];

const RecruitmentChecklistForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<RecruitmentChecklistData>({
    vacancyNumber: '',
    positionTitle: '',
    candidateName: '',
    checklistItems: defaultChecklistItems.map((item, index) => ({
      ...item,
      id: String(index),
    })),
    preparedBy: '',
    preparedDate: new Date().toISOString().split('T')[0],
    verifiedBy: '',
    verifiedDate: '',
    status: 'incomplete',
  });

  const handleChange = (field: keyof RecruitmentChecklistData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateChecklistItem = (id: string, field: keyof ChecklistItem, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      checklistItems: prev.checklistItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const toggleAllChecked = () => {
    const allChecked = formData.checklistItems.every(item => item.checked);
    setFormData(prev => ({
      ...prev,
      checklistItems: prev.checklistItems.map(item => ({
        ...item,
        checked: !allChecked,
        date: !allChecked ? new Date().toISOString().split('T')[0] : item.date,
      })),
    }));
  };

  const handleSubmit = () => {
    const allComplete = formData.checklistItems.every(item => item.checked);
    const dataToSave = {
      ...formData,
      status: allComplete ? 'complete' as const : 'incomplete' as const,
    };
    console.log('Saving Checklist:', dataToSave);
    navigate('/hr/recruitment/checklist');
  };

  const completedCount = formData.checklistItems.filter(item => item.checked).length;
  const totalCount = formData.checklistItems.length;
  const completionPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/recruitment/checklist"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Recruitment File Checklist' : 'New Recruitment File Checklist'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 22: Ensure complete recruitment documentation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            <Save className="h-4 w-4" />
            Save Checklist
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Completion Progress
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {completedCount} / {totalCount} ({completionPercent}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              completionPercent === 100 ? 'bg-green-500' : 'bg-primary-500'
            }`}
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recruitment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vacancy Number
                </label>
                <input
                  type="text"
                  value={formData.vacancyNumber}
                  onChange={(e) => handleChange('vacancyNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
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
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Selected Candidate
                </label>
                <input
                  type="text"
                  value={formData.candidateName}
                  onChange={(e) => handleChange('candidateName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Document Checklist</h2>
              <button
                onClick={toggleAllChecked}
                className="text-sm text-primary-500 hover:text-primary-600"
              >
                {formData.checklistItems.every(item => item.checked) ? 'Uncheck All' : 'Check All'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-8"></th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-48">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {formData.checklistItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        item.checked ? 'bg-green-50 dark:bg-green-900/10' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            updateChecklistItem(item.id, 'checked', !item.checked);
                            if (!item.checked) {
                              updateChecklistItem(item.id, 'date', new Date().toISOString().split('T')[0]);
                            }
                          }}
                          className="focus:outline-none"
                        >
                          {item.checked ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`${item.checked ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                          {index + 1}. {item.item}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) => updateChecklistItem(item.id, 'date', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => updateChecklistItem(item.id, 'remarks', e.target.value)}
                          placeholder="Notes..."
                          className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Prepared By</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.preparedBy}
                  onChange={(e) => handleChange('preparedBy', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                />
                <input
                  type="date"
                  value={formData.preparedDate}
                  onChange={(e) => handleChange('preparedDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                />
              </div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Verified By</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.verifiedBy}
                  onChange={(e) => handleChange('verifiedBy', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                />
                <input
                  type="date"
                  value={formData.verifiedDate}
                  onChange={(e) => handleChange('verifiedDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecruitmentChecklistList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recruitment File Checklists</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 22: Documentation checklists</p>
        </div>
        <Link
          to="/hr/recruitment/checklist/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Checklist
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by position or candidate..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vacancy</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600">No checklists found</p>
                <Link
                  to="/hr/recruitment/checklist/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                >
                  <Plus className="h-4 w-4" />
                  Create Checklist
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RecruitmentChecklist = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <RecruitmentChecklistForm />;
  return <RecruitmentChecklistList />;
};

export default RecruitmentChecklist;
