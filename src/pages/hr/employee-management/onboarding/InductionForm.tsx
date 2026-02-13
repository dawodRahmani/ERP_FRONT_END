import { useState } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  Save,
  Send,
  UserPlus,
  CheckCircle,
  Circle
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EmployeeWorkflow } from '../components/EmployeeWorkflow';

interface OrientationItem {
  topic: string;
  completed: boolean | null;
  remarks: string;
}

interface SystemAccessItem {
  item: string;
  provided: boolean;
  providedDate: string;
}

interface InductionFormData {
  // Section A: Employee Information
  employeeFullName: string;
  employeeId: string;
  position: string;
  department: string;
  dutyStation: string;
  startDate: string;
  contractType: string;
  probationDuration: string;

  // Section C: HR Orientation Checklist (9 items)
  hrOrientationChecklist: OrientationItem[];

  // Section C2: Job-Specific Orientation (4 items)
  jobSpecificOrientation: OrientationItem[];

  // Section D: Systems & Tools Access (4 items)
  systemsAccess: SystemAccessItem[];

  // Section E: Probation Understanding
  probationUnderstandingConfirmed: boolean;

  // Section F: Signatures
  hrOfficerName: string;
  hrOfficerSigned: boolean;
  hrOfficerDate: string;
  supervisorName: string;
  supervisorSigned: boolean;
  supervisorDate: string;
  employeeSigned: boolean;
  employeeSignDate: string;

  status: 'draft' | 'in_progress' | 'completed';
}

const defaultHROrientationItems: OrientationItem[] = [
  { topic: 'Introduction to VDO (Mission, Vision, Values)', completed: null, remarks: '' },
  { topic: 'Organizational Structure Explained', completed: null, remarks: '' },
  { topic: 'HR Policies & Procedures Overview', completed: null, remarks: '' },
  { topic: 'Code of Conduct & Ethics', completed: null, remarks: '' },
  { topic: 'PSEA, Safeguarding & AAP Policies', completed: null, remarks: '' },
  { topic: 'Working Hours, Leave & Attendance System', completed: null, remarks: '' },
  { topic: 'Payroll, Allowances & Benefits Explained', completed: null, remarks: '' },
  { topic: 'Security & Safety Briefing', completed: null, remarks: '' },
  { topic: 'Induction Documents Completed', completed: null, remarks: '' },
];

const defaultJobSpecificItems: OrientationItem[] = [
  { topic: 'Explanation of Job Description/TOR', completed: null, remarks: '' },
  { topic: 'Key Duties & Responsibilities', completed: null, remarks: '' },
  { topic: 'Performance Expectations & KPIs', completed: null, remarks: '' },
  { topic: 'Reporting Lines & Communication Flow', completed: null, remarks: '' },
];

const defaultSystemsAccess: SystemAccessItem[] = [
  { item: 'Email Account', provided: false, providedDate: '' },
  { item: 'System Access', provided: false, providedDate: '' },
  { item: 'Laptop/Desktop', provided: false, providedDate: '' },
  { item: 'ID Card', provided: false, providedDate: '' },
];

const InductionFormComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<InductionFormData>({
    employeeFullName: '',
    employeeId: '',
    position: '',
    department: '',
    dutyStation: '',
    startDate: '',
    contractType: 'project',
    probationDuration: '3 months',
    hrOrientationChecklist: [...defaultHROrientationItems],
    jobSpecificOrientation: [...defaultJobSpecificItems],
    systemsAccess: [...defaultSystemsAccess],
    probationUnderstandingConfirmed: false,
    hrOfficerName: '',
    hrOfficerSigned: false,
    hrOfficerDate: '',
    supervisorName: '',
    supervisorSigned: false,
    supervisorDate: '',
    employeeSigned: false,
    employeeSignDate: '',
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

  const updateOrientationItem = (type: 'hr' | 'job', index: number, field: string, value: unknown) => {
    const listKey = type === 'hr' ? 'hrOrientationChecklist' : 'jobSpecificOrientation';
    setFormData(prev => ({
      ...prev,
      [listKey]: prev[listKey].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateSystemAccess = (index: number, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      systemsAccess: prev.systemsAccess.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeFullName) newErrors.employeeFullName = 'Employee name is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    if (action === 'submit' && !validateForm()) return;

    const dataToSave = {
      ...formData,
      status: action === 'submit' ? 'completed' : 'in_progress',
    };

    console.log('Saving Induction Form:', dataToSave);
    navigate('/hr/employee-management/onboarding/induction');
  };

  const contractTypes = [
    { value: 'core', label: 'Core (Permanent)' },
    { value: 'project', label: 'Project' },
    { value: 'consultant', label: 'Consultant' },
    { value: 'part_time', label: 'Part-time' },
    { value: 'internship', label: 'Internship/Volunteer' },
    { value: 'daily_wage', label: 'Daily Wage' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/employee-management/onboarding/induction"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Induction Form' : 'New Induction Form'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 28: Track new employee orientation
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
            Complete Induction
          </button>
        </div>
      </div>

      {/* Workflow */}
      <EmployeeWorkflow currentStep="induction" workflowType="onboarding" />

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Section A: Employee Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section A: Employee Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employee Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.employeeFullName}
                  onChange={(e) => handleChange('employeeFullName', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.employeeFullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter full name"
                />
                {errors.employeeFullName && <p className="mt-1 text-sm text-red-500">{errors.employeeFullName}</p>}
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
                  Position/Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.position ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter position"
                />
                {errors.position && <p className="mt-1 text-sm text-red-500">{errors.position}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.department ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter department"
                />
                {errors.department && <p className="mt-1 text-sm text-red-500">{errors.department}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duty Station
                </label>
                <input
                  type="text"
                  value={formData.dutyStation}
                  onChange={(e) => handleChange('dutyStation', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter duty station"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.startDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contract Type
                </label>
                <select
                  value={formData.contractType}
                  onChange={(e) => handleChange('contractType', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {contractTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Probation Period Duration
                </label>
                <select
                  value={formData.probationDuration}
                  onChange={(e) => handleChange('probationDuration', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="1 month">1 month</option>
                  <option value="2 months">2 months</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section C: HR Orientation Checklist */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section C: HR Orientation Checklist</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Topic</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase w-20">Yes</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase w-20">No</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-48">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {formData.hrOrientationChecklist.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.topic}</td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="radio"
                          name={`hr-orientation-${index}`}
                          checked={item.completed === true}
                          onChange={() => updateOrientationItem('hr', index, 'completed', true)}
                          className="text-green-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="radio"
                          name={`hr-orientation-${index}`}
                          checked={item.completed === false}
                          onChange={() => updateOrientationItem('hr', index, 'completed', false)}
                          className="text-red-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => updateOrientationItem('hr', index, 'remarks', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                          placeholder="Remarks..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section C2: Job-Specific Orientation */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Job-Specific Orientation</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Topic</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase w-20">Yes</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase w-20">No</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-48">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {formData.jobSpecificOrientation.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.topic}</td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="radio"
                          name={`job-orientation-${index}`}
                          checked={item.completed === true}
                          onChange={() => updateOrientationItem('job', index, 'completed', true)}
                          className="text-green-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="radio"
                          name={`job-orientation-${index}`}
                          checked={item.completed === false}
                          onChange={() => updateOrientationItem('job', index, 'completed', false)}
                          className="text-red-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => updateOrientationItem('job', index, 'remarks', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                          placeholder="Remarks..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section D: Systems & Tools Access */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section D: Systems & Tools Access</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase w-24">Provided</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-40">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {formData.systemsAccess.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.item}</td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={item.provided}
                          onChange={(e) => updateSystemAccess(index, 'provided', e.target.checked)}
                          className="rounded border-gray-300 text-primary-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="date"
                          value={item.providedDate}
                          onChange={(e) => updateSystemAccess(index, 'providedDate', e.target.value)}
                          disabled={!item.provided}
                          className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm disabled:opacity-50"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section E: Probation Understanding */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section E: Probation Understanding</h2>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.probationUnderstandingConfirmed}
                  onChange={(e) => handleChange('probationUnderstandingConfirmed', e.target.checked)}
                  className="rounded border-gray-300 text-primary-500 mt-1"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  I understand that I am on a probationary period of <strong>{formData.probationDuration}</strong> and that my performance will be evaluated during this time. I understand the conditions of my probation and what is expected of me.
                </span>
              </label>
            </div>
          </div>

          {/* Section F: Signatures */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section F: Signatures</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">HR Officer</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.hrOfficerName}
                    onChange={(e) => handleChange('hrOfficerName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    placeholder="Name"
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
                        value={formData.hrOfficerDate}
                        onChange={(e) => handleChange('hrOfficerDate', e.target.value)}
                        className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Supervisor/Line Manager</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.supervisorName}
                    onChange={(e) => handleChange('supervisorName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    placeholder="Name"
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.supervisorSigned}
                        onChange={(e) => handleChange('supervisorSigned', e.target.checked)}
                        className="rounded border-gray-300 text-primary-500"
                      />
                      <span className="text-sm">Signed</span>
                    </label>
                    {formData.supervisorSigned && (
                      <input
                        type="date"
                        value={formData.supervisorDate}
                        onChange={(e) => handleChange('supervisorDate', e.target.value)}
                        className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">New Employee</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.employeeSigned}
                        onChange={(e) => handleChange('employeeSigned', e.target.checked)}
                        className="rounded border-gray-300 text-primary-500"
                      />
                      <span className="text-sm">Employee signed</span>
                    </label>
                  </div>
                  {formData.employeeSigned && (
                    <input
                      type="date"
                      value={formData.employeeSignDate}
                      onChange={(e) => handleChange('employeeSignDate', e.target.value)}
                      className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InductionFormList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Induction Forms</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 28: Track new employee orientation</p>
        </div>
        <Link
          to="/hr/employee-management/onboarding/induction/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Induction Form
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No induction forms found</p>
                <Link
                  to="/hr/employee-management/onboarding/induction/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                >
                  <Plus className="h-4 w-4" />
                  Start New Induction
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InductionForm = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <InductionFormComponent />;
  return <InductionFormList />;
};

export default InductionForm;
