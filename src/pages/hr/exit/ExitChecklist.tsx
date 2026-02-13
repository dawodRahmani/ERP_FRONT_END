import { useState } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  Save,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  Monitor,
  Briefcase,
  Users,
  FileCheck,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ExitInfoBanner } from './components';

// ============================================================================
// TYPES
// ============================================================================

interface ClearanceSection {
  department: string;
  icon: string;
  items: { key: string; label: string; cleared: boolean; remarks: string }[];
  signedBy: string;
  signedDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface ExitChecklistData {
  // Employee Information
  employeeName: string;
  employeeId: string;
  position: string;
  department: string;
  lastWorkingDay: string;
  separationType: string;

  // Clearance Sections
  accountsClearance: {
    salaryAdvancesCleared: boolean;
    travelAdvancesSettled: boolean;
    loansCleared: boolean;
    signedBy: string;
    signedDate: string;
    remarks: string;
  };

  itClearance: {
    emailAccessDisabled: boolean;
    laptopReturned: boolean;
    phoneSimReturned: boolean;
    otherDevicesReturned: boolean;
    signedBy: string;
    signedDate: string;
    remarks: string;
  };

  adminClearance: {
    keysReturned: boolean;
    idCardReturned: boolean;
    parkingCardReturned: boolean;
    officeEquipmentReturned: boolean;
    signedBy: string;
    signedDate: string;
    remarks: string;
  };

  supervisorClearance: {
    taskHandoverCompleted: boolean;
    documentHandoverCompleted: boolean;
    knowledgeTransferCompleted: boolean;
    finalWorkDayConfirmed: boolean;
    signedBy: string;
    signedDate: string;
    remarks: string;
  };

  hrClearance: {
    allSectionsSigned: boolean;
    exitInterviewCompleted: boolean;
    finalSettlementCalculated: boolean;
    signedBy: string;
    signedDate: string;
    remarks: string;
  };

  // Final Approval
  finalApproval: {
    approvedBy: string;
    approvedDate: string;
    approved: boolean;
  };

  // Status
  status: 'pending' | 'in_progress' | 'completed';
  createdDate: string;
}

// ============================================================================
// EXIT CHECKLIST FORM
// ============================================================================

const ExitChecklistForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<ExitChecklistData>({
    employeeName: '',
    employeeId: '',
    position: '',
    department: '',
    lastWorkingDay: '',
    separationType: 'resignation',
    accountsClearance: {
      salaryAdvancesCleared: false,
      travelAdvancesSettled: false,
      loansCleared: false,
      signedBy: '',
      signedDate: '',
      remarks: '',
    },
    itClearance: {
      emailAccessDisabled: false,
      laptopReturned: false,
      phoneSimReturned: false,
      otherDevicesReturned: false,
      signedBy: '',
      signedDate: '',
      remarks: '',
    },
    adminClearance: {
      keysReturned: false,
      idCardReturned: false,
      parkingCardReturned: false,
      officeEquipmentReturned: false,
      signedBy: '',
      signedDate: '',
      remarks: '',
    },
    supervisorClearance: {
      taskHandoverCompleted: false,
      documentHandoverCompleted: false,
      knowledgeTransferCompleted: false,
      finalWorkDayConfirmed: false,
      signedBy: '',
      signedDate: '',
      remarks: '',
    },
    hrClearance: {
      allSectionsSigned: false,
      exitInterviewCompleted: false,
      finalSettlementCalculated: false,
      signedBy: '',
      signedDate: '',
      remarks: '',
    },
    finalApproval: {
      approvedBy: '',
      approvedDate: '',
      approved: false,
    },
    status: 'pending',
    createdDate: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (section: string, field: string, value: unknown) => {
    if (section === 'root') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof ExitChecklistData] as Record<string, unknown>),
          [field]: value,
        },
      }));
    }
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    console.log('Saving Exit Checklist:', formData);
    navigate('/hr/exit/checklist');
  };

  const getSectionStatus = (section: Record<string, unknown>) => {
    const booleanFields = Object.entries(section).filter(([key, value]) => typeof value === 'boolean');
    const clearedCount = booleanFields.filter(([, value]) => value === true).length;
    const totalCount = booleanFields.length;

    if (clearedCount === 0) return { status: 'pending', label: 'Pending', color: 'yellow' };
    if (clearedCount === totalCount) return { status: 'completed', label: 'Completed', color: 'green' };
    return { status: 'in_progress', label: 'In Progress', color: 'blue' };
  };

  const separationTypes = [
    { value: 'resignation', label: 'Resignation' },
    { value: 'end_of_contract', label: 'End of Contract' },
    { value: 'termination', label: 'Termination' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'retirement', label: 'Retirement' },
  ];

  const clearanceSections = [
    {
      key: 'accountsClearance',
      title: 'Accounts Clearance',
      icon: Building2,
      items: [
        { key: 'salaryAdvancesCleared', label: 'Salary advances cleared' },
        { key: 'travelAdvancesSettled', label: 'Travel advances settled' },
        { key: 'loansCleared', label: 'Any loans cleared' },
      ],
    },
    {
      key: 'itClearance',
      title: 'IT Clearance',
      icon: Monitor,
      items: [
        { key: 'emailAccessDisabled', label: 'Email/Network access disabled' },
        { key: 'laptopReturned', label: 'Laptop returned' },
        { key: 'phoneSimReturned', label: 'Phone/SIM returned' },
        { key: 'otherDevicesReturned', label: 'Other devices returned' },
      ],
    },
    {
      key: 'adminClearance',
      title: 'Admin Clearance',
      icon: Briefcase,
      items: [
        { key: 'keysReturned', label: 'Keys returned' },
        { key: 'idCardReturned', label: 'ID card returned' },
        { key: 'parkingCardReturned', label: 'Parking card returned' },
        { key: 'officeEquipmentReturned', label: 'Office equipment returned' },
      ],
    },
    {
      key: 'supervisorClearance',
      title: 'Supervisor Clearance',
      icon: Users,
      items: [
        { key: 'taskHandoverCompleted', label: 'Task handover completed' },
        { key: 'documentHandoverCompleted', label: 'Document handover completed' },
        { key: 'knowledgeTransferCompleted', label: 'Knowledge transfer completed' },
        { key: 'finalWorkDayConfirmed', label: 'Final work day confirmed' },
      ],
    },
    {
      key: 'hrClearance',
      title: 'HR Final Clearance',
      icon: FileCheck,
      items: [
        { key: 'allSectionsSigned', label: 'All sections signed' },
        { key: 'exitInterviewCompleted', label: 'Exit interview completed' },
        { key: 'finalSettlementCalculated', label: 'Final settlement calculated' },
      ],
    },
  ];

  const getStatusBadgeColor = (color: string) => {
    const colors: Record<string, string> = {
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };
    return colors[color] || colors.yellow;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/exit/checklist"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Exit Checklist' : 'New Exit Checklist'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 47: Employee exit clearance process
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
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            <Send className="h-4 w-4" />
            Complete Clearance
          </button>
        </div>
      </div>

      <ExitInfoBanner
        title="Form 47: Employee Exit Checklist"
        description="Track clearance process across all departments to ensure smooth separation."
      />

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Employee Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Employee Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee Name *</label>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => handleChange('root', 'employeeName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee ID</label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => handleChange('root', 'employeeId', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleChange('root', 'position', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleChange('root', 'department', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Working Day *</label>
                <input
                  type="date"
                  value={formData.lastWorkingDay}
                  onChange={(e) => handleChange('root', 'lastWorkingDay', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Separation Type</label>
                <select
                  value={formData.separationType}
                  onChange={(e) => handleChange('root', 'separationType', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  {separationTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Clearance Sections */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Departmental Clearances</h2>
            <div className="space-y-4">
              {clearanceSections.map(section => {
                const Icon = section.icon;
                const sectionData = formData[section.key as keyof ExitChecklistData] as Record<string, unknown>;
                const status = getSectionStatus(sectionData);

                return (
                  <div key={section.key} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{section.title}</h3>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(status.color)}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {section.items.map(item => (
                          <label key={item.key} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer">
                            <input
                              type="checkbox"
                              checked={sectionData[item.key] as boolean}
                              onChange={(e) => handleChange(section.key, item.key, e.target.checked)}
                              className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <input
                          type="text"
                          placeholder="Signed By"
                          value={sectionData.signedBy as string}
                          onChange={(e) => handleChange(section.key, 'signedBy', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                        />
                        <input
                          type="date"
                          value={sectionData.signedDate as string}
                          onChange={(e) => handleChange(section.key, 'signedDate', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Remarks"
                          value={sectionData.remarks as string}
                          onChange={(e) => handleChange(section.key, 'remarks', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Final Approval */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Final Approval</h2>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Approved By (ED/HR Specialist)</label>
                  <input
                    type="text"
                    value={formData.finalApproval.approvedBy}
                    onChange={(e) => handleChange('finalApproval', 'approvedBy', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Approval Date</label>
                  <input
                    type="date"
                    value={formData.finalApproval.approvedDate}
                    onChange={(e) => handleChange('finalApproval', 'approvedDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 p-2">
                    <input
                      type="checkbox"
                      checked={formData.finalApproval.approved}
                      onChange={(e) => handleChange('finalApproval', 'approved', e.target.checked)}
                      className="rounded border-gray-300 text-green-500 focus:ring-green-500 h-5 w-5"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Final Approval Granted</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXIT CHECKLIST LIST
// ============================================================================

const ExitChecklistList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const checklists = [
    { id: '1', employeeName: 'Rahmatullah Ahmadi', position: 'Field Officer', department: 'Operations', lastDay: '2024-02-15', progress: 60, status: 'In Progress' },
    { id: '2', employeeName: 'Mariam Karimi', position: 'Finance Assistant', department: 'Finance', lastDay: '2024-02-10', progress: 20, status: 'Pending' },
    { id: '3', employeeName: 'Nawid Stanikzai', position: 'Driver', department: 'Admin', lastDay: '2024-02-05', progress: 100, status: 'Completed' },
    { id: '4', employeeName: 'Zahra Mohammadi', position: 'HR Officer', department: 'HR', lastDay: '2024-01-31', progress: 100, status: 'Completed' },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      Completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };
    return styles[status] || styles.Pending;
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exit Checklists</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 47: Employee exit clearance tracking</p>
        </div>
        <Link
          to="/hr/exit/checklist/new"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Day</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {checklists.map((checklist) => (
              <tr key={checklist.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{checklist.employeeName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{checklist.position}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{checklist.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{checklist.lastDay}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(checklist.progress)} rounded-full`}
                        style={{ width: `${checklist.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{checklist.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(checklist.status)}`}>
                    {checklist.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => navigate(`/hr/exit/checklist/${checklist.id}`)}
                    className="text-orange-600 hover:text-orange-700 dark:text-orange-400 text-sm font-medium"
                  >
                    {checklist.status === 'Completed' ? 'View' : 'Continue'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN EXPORT
// ============================================================================

const ExitChecklist = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <ExitChecklistForm />;
  return <ExitChecklistList />;
};

export default ExitChecklist;
