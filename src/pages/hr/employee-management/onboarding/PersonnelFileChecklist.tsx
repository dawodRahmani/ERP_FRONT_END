import { useState } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  Save,
  Send,
  FolderOpen,
  CheckCircle,
  Circle
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EmployeeWorkflow } from '../components/EmployeeWorkflow';

interface ChecklistItem {
  name: string;
  checked: boolean;
  date: string;
  remarks: string;
}

interface Section {
  name: string;
  items: ChecklistItem[];
}

interface PersonnelFileChecklistData {
  employeeName: string;
  employeeId: string;
  department: string;
  sections: Section[];
  checkedByName: string;
  checkedDate: string;
  status: 'draft' | 'in_progress' | 'complete';
}

const defaultSections: Section[] = [
  {
    name: 'Section 1: Recruitment & Selection',
    items: [
      { name: 'Job Application Form/CV', checked: false, date: '', remarks: '' },
      { name: 'Job Advertisement', checked: false, date: '', remarks: '' },
      { name: 'Shortlisting Form & Notes', checked: false, date: '', remarks: '' },
      { name: 'Interview Assessment Form', checked: false, date: '', remarks: '' },
      { name: 'Reference Check Form', checked: false, date: '', remarks: '' },
      { name: 'Background & Sanction Check Report', checked: false, date: '', remarks: '' },
      { name: 'Selection Approval Form', checked: false, date: '', remarks: '' },
    ],
  },
  {
    name: 'Section 2: Employment Documentation',
    items: [
      { name: 'Signed Employment Contract', checked: false, date: '', remarks: '' },
      { name: 'Job Description', checked: false, date: '', remarks: '' },
      { name: 'Probation Period Terms', checked: false, date: '', remarks: '' },
      { name: 'Offer Letter (Signed)', checked: false, date: '', remarks: '' },
      { name: 'Confidentiality/NDA', checked: false, date: '', remarks: '' },
      { name: 'Code of Conduct Acknowledgement', checked: false, date: '', remarks: '' },
      { name: 'Safeguarding/PSEAH Acknowledgement', checked: false, date: '', remarks: '' },
      { name: 'Whistleblowing Policy Acknowledgement', checked: false, date: '', remarks: '' },
      { name: 'Conflict of Interest Declaration', checked: false, date: '', remarks: '' },
    ],
  },
  {
    name: 'Section 3: Identity & Legal Documents',
    items: [
      { name: 'Copy of National ID (Tazkira)/Passport', checked: false, date: '', remarks: '' },
      { name: 'Educational Certificates (verified)', checked: false, date: '', remarks: '' },
      { name: 'Professional Licenses/Certifications', checked: false, date: '', remarks: '' },
      { name: 'Previous Employment Letters', checked: false, date: '', remarks: '' },
      { name: 'Work Permit (if foreign)', checked: false, date: '', remarks: '' },
    ],
  },
  {
    name: 'Section 4: Payroll & Benefits',
    items: [
      { name: 'Bank Account Details Form', checked: false, date: '', remarks: '' },
      { name: 'Tax ID (if applicable)', checked: false, date: '', remarks: '' },
      { name: 'Salary Scale/Grade Confirmation', checked: false, date: '', remarks: '' },
      { name: 'Allowances & Benefits Approval', checked: false, date: '', remarks: '' },
    ],
  },
  {
    name: 'Section 5: Performance & Development',
    items: [
      { name: 'Probation Evaluation Form', checked: false, date: '', remarks: '' },
      { name: 'Annual Performance Appraisals', checked: false, date: '', remarks: '' },
      { name: 'Training & Development Records', checked: false, date: '', remarks: '' },
      { name: 'Capacity Building Certificates', checked: false, date: '', remarks: '' },
      { name: 'Promotion Approval Letters', checked: false, date: '', remarks: '' },
    ],
  },
  {
    name: 'Section 6: Leave & Attendance',
    items: [
      { name: 'Leave Request Forms', checked: false, date: '', remarks: '' },
      { name: 'Attendance & Timesheet Records', checked: false, date: '', remarks: '' },
      { name: 'Sick Leave Medical Certificates', checked: false, date: '', remarks: '' },
    ],
  },
  {
    name: 'Section 7: Disciplinary & Grievances',
    items: [
      { name: 'Written Warnings/Notices', checked: false, date: '', remarks: '' },
      { name: 'Disciplinary Hearing Records', checked: false, date: '', remarks: '' },
      { name: 'Grievance Forms & Investigation Records', checked: false, date: '', remarks: '' },
      { name: 'Resolution/Outcome Reports', checked: false, date: '', remarks: '' },
    ],
  },
  {
    name: 'Section 8: Separation & Exit',
    items: [
      { name: 'Resignation Letter', checked: false, date: '', remarks: '' },
      { name: 'Exit Interview Form', checked: false, date: '', remarks: '' },
      { name: 'Clearance Form', checked: false, date: '', remarks: '' },
      { name: 'Final Settlement Form', checked: false, date: '', remarks: '' },
    ],
  },
];

const PersonnelFileChecklistForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<PersonnelFileChecklistData>({
    employeeName: '',
    employeeId: '',
    department: '',
    sections: defaultSections.map(s => ({
      ...s,
      items: s.items.map(i => ({ ...i })),
    })),
    checkedByName: '',
    checkedDate: new Date().toISOString().split('T')[0],
    status: 'draft',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({
    0: true,
    1: true,
  });

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

  const updateItem = (sectionIndex: number, itemIndex: number, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, si) =>
        si === sectionIndex
          ? {
              ...section,
              items: section.items.map((item, ii) =>
                ii === itemIndex ? { ...item, [field]: value } : item
              ),
            }
          : section
      ),
    }));
  };

  const toggleSection = (index: number) => {
    setExpandedSections(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const getSectionStats = (section: Section) => {
    const checked = section.items.filter(i => i.checked).length;
    return { checked, total: section.items.length };
  };

  const getTotalStats = () => {
    let checked = 0;
    let total = 0;
    formData.sections.forEach(section => {
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

    console.log('Saving Personnel File Checklist:', dataToSave);
    navigate('/hr/employee-management/onboarding/personnel-file');
  };

  const totalStats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/employee-management/onboarding/personnel-file"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Personnel File Checklist' : 'New Personnel File Checklist'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 33: Ensure complete employee documentation
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
            Submit Checklist
          </button>
        </div>
      </div>

      {/* Workflow */}
      <EmployeeWorkflow currentStep="personnel-file" workflowType="onboarding" />

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter department"
                />
              </div>
            </div>
          </div>

          {/* Checklist Sections */}
          <div className="space-y-4">
            {formData.sections.map((section, sectionIndex) => {
              const stats = getSectionStats(section);
              const isExpanded = expandedSections[sectionIndex];

              return (
                <div key={sectionIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection(sectionIndex)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900 dark:text-white">{section.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        stats.checked === stats.total
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {stats.checked}/{stats.total}
                      </span>
                    </div>
                    <ChevronLeft className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? '-rotate-90' : 'rotate-180'}`} />
                  </button>
                  {isExpanded && (
                    <div className="p-4">
                      <table className="w-full">
                        <thead>
                          <tr className="text-xs text-gray-500 uppercase">
                            <th className="text-left pb-2 w-8"></th>
                            <th className="text-left pb-2">Document</th>
                            <th className="text-left pb-2 w-32">Date</th>
                            <th className="text-left pb-2 w-40">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                          {section.items.map((item, itemIndex) => (
                            <tr key={itemIndex}>
                              <td className="py-2">
                                <input
                                  type="checkbox"
                                  checked={item.checked}
                                  onChange={(e) => updateItem(sectionIndex, itemIndex, 'checked', e.target.checked)}
                                  className="rounded border-gray-300 text-green-500"
                                />
                              </td>
                              <td className="py-2">
                                <span className={`text-sm ${item.checked ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                  {item.name}
                                </span>
                              </td>
                              <td className="py-2">
                                <input
                                  type="date"
                                  value={item.date}
                                  onChange={(e) => updateItem(sectionIndex, itemIndex, 'date', e.target.value)}
                                  className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                />
                              </td>
                              <td className="py-2">
                                <input
                                  type="text"
                                  value={item.remarks}
                                  onChange={(e) => updateItem(sectionIndex, itemIndex, 'remarks', e.target.value)}
                                  className="w-full px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                  placeholder="Notes..."
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Checked By */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Checked By (Name)
              </label>
              <input
                type="text"
                value={formData.checkedByName}
                onChange={(e) => handleChange('checkedByName', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="HR Officer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Checked Date
              </label>
              <input
                type="date"
                value={formData.checkedDate}
                onChange={(e) => handleChange('checkedDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PersonnelFileChecklistList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Personnel File Checklists</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 33: Personnel file documentation</p>
        </div>
        <Link
          to="/hr/employee-management/onboarding/personnel-file/new"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
                <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No personnel file checklists found</p>
                <Link
                  to="/hr/employee-management/onboarding/personnel-file/new"
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

const PersonnelFileChecklist = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <PersonnelFileChecklistForm />;
  return <PersonnelFileChecklistList />;
};

export default PersonnelFileChecklist;
