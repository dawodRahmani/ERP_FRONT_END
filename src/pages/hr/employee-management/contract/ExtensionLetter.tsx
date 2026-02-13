import { useState } from 'react';
import {
  Plus,
  Search,
  FileText,
  ChevronLeft,
  Save,
  Send,
  Clock,
  Trash2
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EmployeeWorkflow, EmployeeInfoBanner } from '../components/EmployeeWorkflow';

interface KPIImprovementArea {
  id: string;
  area: string;
  comments: string;
  actions: string;
}

interface ExtensionLetterData {
  // Letter Info
  letterDate: string;
  referenceNumber: string;

  // Employee Info
  employeeName: string;
  employeeId: string;
  position: string;
  department: string;
  contractNumber: string;

  // Probation Dates
  originalProbationEndDate: string;
  extensionStartDate: string;
  extensionEndDate: string;
  extensionDuration: string;

  // KPI Improvement Areas
  kpiImprovementAreas: KPIImprovementArea[];

  // Reason for Extension
  extensionReason: string;

  // Signatures
  hrSpecialistName: string;
  hrSpecialistSigned: boolean;
  hrSpecialistDate: string;
  employeeAcknowledged: boolean;
  employeeAcknowledgeDate: string;

  status: 'draft' | 'pending' | 'acknowledged' | 'active';
}

const ExtensionLetterForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<ExtensionLetterData>({
    letterDate: new Date().toISOString().split('T')[0],
    referenceNumber: `EXT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    employeeName: '',
    employeeId: '',
    position: '',
    department: '',
    contractNumber: '',
    originalProbationEndDate: '',
    extensionStartDate: '',
    extensionEndDate: '',
    extensionDuration: '3 months',
    kpiImprovementAreas: [],
    extensionReason: '',
    hrSpecialistName: '',
    hrSpecialistSigned: false,
    hrSpecialistDate: '',
    employeeAcknowledged: false,
    employeeAcknowledgeDate: '',
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

  const addKPIArea = () => {
    const newArea: KPIImprovementArea = {
      id: Date.now().toString(),
      area: '',
      comments: '',
      actions: '',
    };
    setFormData(prev => ({
      ...prev,
      kpiImprovementAreas: [...prev.kpiImprovementAreas, newArea],
    }));
  };

  const updateKPIArea = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      kpiImprovementAreas: prev.kpiImprovementAreas.map(area =>
        area.id === id ? { ...area, [field]: value } : area
      ),
    }));
  };

  const removeKPIArea = (id: string) => {
    setFormData(prev => ({
      ...prev,
      kpiImprovementAreas: prev.kpiImprovementAreas.filter(area => area.id !== id),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeName) newErrors.employeeName = 'Employee name is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.originalProbationEndDate) newErrors.originalProbationEndDate = 'Original probation end date is required';
    if (!formData.extensionStartDate) newErrors.extensionStartDate = 'Extension start date is required';
    if (!formData.extensionEndDate) newErrors.extensionEndDate = 'Extension end date is required';
    if (!formData.extensionReason) newErrors.extensionReason = 'Reason for extension is required';
    if (formData.kpiImprovementAreas.length === 0) {
      newErrors.kpiImprovementAreas = 'At least one KPI improvement area is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    if (action === 'submit' && !validateForm()) return;

    const dataToSave = {
      ...formData,
      status: action === 'submit' ? 'pending' : 'draft',
    };

    console.log('Saving Extension Letter:', dataToSave);
    navigate('/hr/employee-management/contract/extension');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/employee-management/contract/extension"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Extension Letter' : 'New Extension Letter'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 26: Extend probation period
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
            Issue Letter
          </button>
        </div>
      </div>

      {/* Workflow */}
      <EmployeeWorkflow currentStep="extension" workflowType="contract" />

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Letter Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Letter Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={formData.referenceNumber}
                  readOnly
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Letter Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.letterDate}
                  onChange={(e) => handleChange('letterDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

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
                  Position <span className="text-red-500">*</span>
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
                  Contract Number
                </label>
                <input
                  type="text"
                  value={formData.contractNumber}
                  onChange={(e) => handleChange('contractNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter contract number"
                />
              </div>
            </div>
          </div>

          {/* Probation Period */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Probation Period</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Original Probation End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.originalProbationEndDate}
                  onChange={(e) => handleChange('originalProbationEndDate', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.originalProbationEndDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.originalProbationEndDate && <p className="mt-1 text-sm text-red-500">{errors.originalProbationEndDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Extension Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.extensionStartDate}
                  onChange={(e) => handleChange('extensionStartDate', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.extensionStartDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.extensionStartDate && <p className="mt-1 text-sm text-red-500">{errors.extensionStartDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Extension End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.extensionEndDate}
                  onChange={(e) => handleChange('extensionEndDate', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.extensionEndDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.extensionEndDate && <p className="mt-1 text-sm text-red-500">{errors.extensionEndDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Extension Duration
                </label>
                <select
                  value={formData.extensionDuration}
                  onChange={(e) => handleChange('extensionDuration', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="1 month">1 month</option>
                  <option value="2 months">2 months</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reason for Extension */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reason for Extension <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.extensionReason}
              onChange={(e) => handleChange('extensionReason', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border ${errors.extensionReason ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              placeholder="Explain the reason for extending the probation period..."
            />
            {errors.extensionReason && <p className="mt-1 text-sm text-red-500">{errors.extensionReason}</p>}
          </div>

          {/* KPI Improvement Areas */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">KPI Improvement Areas</h2>
              <button
                type="button"
                onClick={addKPIArea}
                className="inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600"
              >
                <Plus className="h-4 w-4" /> Add Area
              </button>
            </div>
            {errors.kpiImprovementAreas && (
              <p className="mb-2 text-sm text-red-500">{errors.kpiImprovementAreas}</p>
            )}

            {formData.kpiImprovementAreas.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-500">No improvement areas added. Click "Add Area" to start.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.kpiImprovementAreas.map((area, index) => (
                  <div key={area.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Area #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeKPIArea(area.id)}
                        className="p-1 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          KPI Area
                        </label>
                        <input
                          type="text"
                          value={area.area}
                          onChange={(e) => updateKPIArea(area.id, 'area', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                          placeholder="e.g., Communication Skills"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Comments
                        </label>
                        <input
                          type="text"
                          value={area.comments}
                          onChange={(e) => updateKPIArea(area.id, 'comments', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                          placeholder="Current performance issues"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Actions Required
                        </label>
                        <input
                          type="text"
                          value={area.actions}
                          onChange={(e) => updateKPIArea(area.id, 'actions', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                          placeholder="Required improvements"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Signatures */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Signatures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">HR Specialist</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.hrSpecialistName}
                    onChange={(e) => handleChange('hrSpecialistName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    placeholder="HR Specialist Name"
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.hrSpecialistSigned}
                        onChange={(e) => handleChange('hrSpecialistSigned', e.target.checked)}
                        className="rounded border-gray-300 text-primary-500"
                      />
                      <span className="text-sm">Signed</span>
                    </label>
                    {formData.hrSpecialistSigned && (
                      <input
                        type="date"
                        value={formData.hrSpecialistDate}
                        onChange={(e) => handleChange('hrSpecialistDate', e.target.value)}
                        className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Employee Acknowledgment</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.employeeAcknowledged}
                        onChange={(e) => handleChange('employeeAcknowledged', e.target.checked)}
                        className="rounded border-gray-300 text-primary-500"
                      />
                      <span className="text-sm">Employee acknowledged and signed</span>
                    </label>
                  </div>
                  {formData.employeeAcknowledged && (
                    <input
                      type="date"
                      value={formData.employeeAcknowledgeDate}
                      onChange={(e) => handleChange('employeeAcknowledgeDate', e.target.value)}
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
  );
};

const ExtensionLetterList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Extension Letters</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 26: Extend probation period</p>
        </div>
        <Link
          to="/hr/employee-management/contract/extension/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Extension Letter
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Extension Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No extension letters found</p>
                <Link
                  to="/hr/employee-management/contract/extension/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                >
                  <Plus className="h-4 w-4" />
                  Create Extension Letter
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ExtensionLetter = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <ExtensionLetterForm />;
  return <ExtensionLetterList />;
};

export default ExtensionLetter;
