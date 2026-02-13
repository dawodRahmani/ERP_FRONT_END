import { useState } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  Save,
  Send,
  Package,
  CheckCircle
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EmployeeWorkflow } from '../components/EmployeeWorkflow';

interface ChecklistItem {
  name: string;
  checked: boolean;
}

interface InductionPackChecklistData {
  employeeName: string;
  employeeId: string;

  // Pre-employment docs (9 items)
  preEmploymentDocs: ChecklistItem[];

  // Identity & verification (4 items)
  identityVerification: ChecklistItem[];

  // Payroll & benefits (2 items)
  payrollBenefits: ChecklistItem[];

  // Induction & orientation (4 items)
  inductionOrientation: ChecklistItem[];

  // Materials provided (12 items)
  materialsProvided: ChecklistItem[];

  // IT & access (3 items)
  itAccess: ChecklistItem[];

  // Signatures
  staffSigned: boolean;
  staffSignDate: string;
  hrOfficerName: string;
  hrOfficerSigned: boolean;
  hrOfficerSignDate: string;

  status: 'draft' | 'in_progress' | 'complete';
}

const defaultChecklist: Omit<InductionPackChecklistData, 'employeeName' | 'employeeId' | 'staffSigned' | 'staffSignDate' | 'hrOfficerName' | 'hrOfficerSigned' | 'hrOfficerSignDate' | 'status'> = {
  preEmploymentDocs: [
    { name: 'Signed Offer Letter', checked: false },
    { name: 'Signed Employment Contract', checked: false },
    { name: 'Job Description', checked: false },
    { name: 'Probation Period Agreement', checked: false },
    { name: 'NDA', checked: false },
    { name: 'Code of Conduct Acknowledgement', checked: false },
    { name: 'Safeguarding & PSEAH Acknowledgement', checked: false },
    { name: 'Whistleblowing Policy Acknowledgement', checked: false },
    { name: 'COI Declaration', checked: false },
  ],
  identityVerification: [
    { name: 'National ID Copy (verified)', checked: false },
    { name: 'Educational Certificates (verified)', checked: false },
    { name: 'Previous Employment Letters', checked: false },
    { name: 'Work Permit (if foreign)', checked: false },
  ],
  payrollBenefits: [
    { name: 'Bank Account Details Form', checked: false },
    { name: 'Tax ID (if applicable)', checked: false },
  ],
  inductionOrientation: [
    { name: 'Orientation Attendance Form', checked: false },
    { name: 'Induction Checklist', checked: false },
    { name: 'Training Needs Assessment Form', checked: false },
    { name: 'Orientation Materials Provided', checked: false },
  ],
  materialsProvided: [
    { name: 'VDO Staff Handbook', checked: false },
    { name: 'Organizational Chart', checked: false },
    { name: 'Vision, Mission & Values Statement', checked: false },
    { name: 'Code of Conduct', checked: false },
    { name: 'Safeguarding & PSEAH Policy', checked: false },
    { name: 'Whistleblowing Policy', checked: false },
    { name: 'COI Policy', checked: false },
    { name: 'HR Policy Manual', checked: false },
    { name: 'Security & Safety Guidelines', checked: false },
    { name: 'IT & Communications Policy', checked: false },
    { name: 'Health & Safety Policy', checked: false },
    { name: 'Contact List', checked: false },
  ],
  itAccess: [
    { name: 'Email Account Request Form', checked: false },
    { name: 'Equipment Allocation Form', checked: false },
    { name: 'Staff ID Card Issued', checked: false },
  ],
};

const InductionPackChecklistForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<InductionPackChecklistData>({
    employeeName: '',
    employeeId: '',
    ...JSON.parse(JSON.stringify(defaultChecklist)),
    staffSigned: false,
    staffSignDate: '',
    hrOfficerName: '',
    hrOfficerSigned: false,
    hrOfficerSignDate: '',
    status: 'draft',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const toggleItem = (section: keyof typeof defaultChecklist, index: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: (prev[section] as ChecklistItem[]).map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const checkAllInSection = (section: keyof typeof defaultChecklist) => {
    setFormData(prev => ({
      ...prev,
      [section]: (prev[section] as ChecklistItem[]).map(item => ({ ...item, checked: true })),
    }));
  };

  const getSectionStats = (section: ChecklistItem[]) => {
    const checked = section.filter(i => i.checked).length;
    return { checked, total: section.length };
  };

  const getTotalStats = () => {
    const sections = [
      formData.preEmploymentDocs,
      formData.identityVerification,
      formData.payrollBenefits,
      formData.inductionOrientation,
      formData.materialsProvided,
      formData.itAccess,
    ];
    let checked = 0;
    let total = 0;
    sections.forEach(section => {
      const stats = getSectionStats(section);
      checked += stats.checked;
      total += stats.total;
    });
    return { checked, total, percentage: total > 0 ? Math.round((checked / total) * 100) : 0 };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.employeeName) newErrors.employeeName = 'Employee name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    if (action === 'submit' && !validateForm()) return;

    const totalStats = getTotalStats();
    const dataToSave = {
      ...formData,
      status: action === 'submit' ? (totalStats.percentage === 100 ? 'complete' : 'in_progress') : 'draft',
    };

    console.log('Saving Induction Pack Checklist:', dataToSave);
    navigate('/hr/employee-management/onboarding/induction-pack');
  };

  const totalStats = getTotalStats();

  const renderSection = (title: string, sectionKey: keyof typeof defaultChecklist) => {
    const section = formData[sectionKey] as ChecklistItem[];
    const stats = getSectionStats(section);

    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-900 dark:text-white">{title}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              stats.checked === stats.total
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              {stats.checked}/{stats.total}
            </span>
          </div>
          <button
            type="button"
            onClick={() => checkAllInSection(sectionKey)}
            className="text-xs text-primary-500 hover:text-primary-600"
          >
            Check All
          </button>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          {section.map((item, index) => (
            <label
              key={index}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                item.checked
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(sectionKey, index)}
                className="rounded border-gray-300 text-green-500"
              />
              <span className={`text-sm ${
                item.checked ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'
              }`}>
                {item.name}
              </span>
              {item.checked && <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />}
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/employee-management/onboarding/induction-pack"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Induction Pack Checklist' : 'New Induction Pack Checklist'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 51: Track all induction materials provided
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit('save')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Save className="h-4 w-4" />
            Save Progress
          </button>
          <button
            onClick={() => handleSubmit('submit')}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            <Send className="h-4 w-4" />
            Complete Checklist
          </button>
        </div>
      </div>

      {/* Workflow */}
      <EmployeeWorkflow currentStep="induction-pack" workflowType="onboarding" />

      {/* Progress Overview */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {totalStats.checked} / {totalStats.total} ({totalStats.percentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              totalStats.percentage === 100 ? 'bg-green-500' : 'bg-primary-500'
            }`}
            style={{ width: `${totalStats.percentage}%` }}
          />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Employee Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Employee Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => handleChange('employeeName', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.employeeName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter employee name"
                />
                {errors.employeeName && <p className="mt-1 text-sm text-red-500">{errors.employeeName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => handleChange('employeeId', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter employee ID"
                />
              </div>
            </div>
          </div>

          {/* Checklist Sections */}
          <div className="space-y-4">
            {renderSection('Pre-Employment Documents', 'preEmploymentDocs')}
            {renderSection('Identity & Verification', 'identityVerification')}
            {renderSection('Payroll & Benefits', 'payrollBenefits')}
            {renderSection('Induction & Orientation', 'inductionOrientation')}
            {renderSection('Materials Provided', 'materialsProvided')}
            {renderSection('IT & Access', 'itAccess')}
          </div>

          {/* Signatures */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Signatures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Staff Signature</h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.staffSigned}
                      onChange={(e) => handleChange('staffSigned', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500"
                    />
                    <span className="text-sm">Staff signed</span>
                  </label>
                  {formData.staffSigned && (
                    <input
                      type="date"
                      value={formData.staffSignDate}
                      onChange={(e) => handleChange('staffSignDate', e.target.value)}
                      className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  )}
                </div>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">HR Officer</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.hrOfficerName}
                    onChange={(e) => handleChange('hrOfficerName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    placeholder="HR Officer Name"
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.hrOfficerSigned}
                        onChange={(e) => handleChange('hrOfficerSigned', e.target.checked)}
                        className="rounded border-gray-300 text-primary-500"
                      />
                      <span className="text-sm">Signed</span>
                    </label>
                    {formData.hrOfficerSigned && (
                      <input
                        type="date"
                        value={formData.hrOfficerSignDate}
                        onChange={(e) => handleChange('hrOfficerSignDate', e.target.value)}
                        className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InductionPackChecklistList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Induction Pack Checklists</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 51: Track induction materials provided</p>
        </div>
        <Link
          to="/hr/employee-management/onboarding/induction-pack/new"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No induction pack checklists found</p>
                <Link
                  to="/hr/employee-management/onboarding/induction-pack/new"
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

const InductionPackChecklist = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <InductionPackChecklistForm />;
  return <InductionPackChecklistList />;
};

export default InductionPackChecklist;
