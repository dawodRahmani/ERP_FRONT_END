import { useState } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  Save,
  Send,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EmployeeWorkflow } from '../components/EmployeeWorkflow';

interface CodeOfConductAckData {
  // Employee Info
  employeeName: string;
  employeeId: string;
  position: string;
  department: string;

  // Commitment Statements
  commitments: {
    statement: string;
    acknowledged: boolean;
  }[];

  // Signatures
  employeeSigned: boolean;
  employeeSignDate: string;
  hrOfficerName: string;
  hrOfficerSigned: boolean;
  hrOfficerSignDate: string;

  status: 'draft' | 'pending' | 'acknowledged';
}

const defaultCommitments = [
  'I have read and understood the VDO Code of Conduct',
  'I commit to upholding the highest standards of professional conduct',
  'I will treat all colleagues, beneficiaries, and stakeholders with respect and dignity',
  'I will maintain confidentiality of sensitive information',
  'I will avoid conflicts of interest and disclose any potential conflicts',
  'I will comply with all VDO policies and procedures',
  'I understand that violations may result in disciplinary action',
  'I will report any violations of the Code of Conduct that I witness',
  'I commit to promoting a safe and inclusive work environment',
];

const CodeOfConductAckForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<CodeOfConductAckData>({
    employeeName: '',
    employeeId: '',
    position: '',
    department: '',
    commitments: defaultCommitments.map(statement => ({ statement, acknowledged: false })),
    employeeSigned: false,
    employeeSignDate: '',
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

  const toggleCommitment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      commitments: prev.commitments.map((c, i) =>
        i === index ? { ...c, acknowledged: !c.acknowledged } : c
      ),
    }));
  };

  const acknowledgeAll = () => {
    setFormData(prev => ({
      ...prev,
      commitments: prev.commitments.map(c => ({ ...c, acknowledged: true })),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeName) newErrors.employeeName = 'Employee name is required';
    if (!formData.position) newErrors.position = 'Position is required';

    const allAcknowledged = formData.commitments.every(c => c.acknowledged);
    if (!allAcknowledged) {
      newErrors.commitments = 'All commitment statements must be acknowledged';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    if (action === 'submit' && !validateForm()) return;

    const dataToSave = {
      ...formData,
      status: action === 'submit' ? 'acknowledged' : 'draft',
    };

    console.log('Saving Code of Conduct Acknowledgement:', dataToSave);
    navigate('/hr/employee-management/onboarding/code-of-conduct');
  };

  const acknowledgedCount = formData.commitments.filter(c => c.acknowledged).length;
  const totalCount = formData.commitments.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/employee-management/onboarding/code-of-conduct"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Code of Conduct Acknowledgement' : 'New Code of Conduct Acknowledgement'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 32: Employee acknowledges reading Code of Conduct
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
            Submit Acknowledgement
          </button>
        </div>
      </div>

      {/* Workflow */}
      <EmployeeWorkflow currentStep="code-of-conduct" workflowType="onboarding" />

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Employee Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Employee Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          {/* Commitment Statements */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Commitment Statements</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Acknowledged: {acknowledgedCount} of {totalCount}
                </p>
              </div>
              <button
                type="button"
                onClick={acknowledgeAll}
                className="text-sm text-primary-500 hover:text-primary-600"
              >
                Acknowledge All
              </button>
            </div>
            {errors.commitments && (
              <p className="mb-4 text-sm text-red-500">{errors.commitments}</p>
            )}
            <div className="space-y-3">
              {formData.commitments.map((commitment, index) => (
                <label
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    commitment.acknowledged
                      ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={commitment.acknowledged}
                    onChange={() => toggleCommitment(index)}
                    className="rounded border-gray-300 text-green-500 mt-0.5"
                  />
                  <span className={`text-sm ${
                    commitment.acknowledged
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {commitment.statement}
                  </span>
                  {commitment.acknowledged && (
                    <CheckCircle className="h-4 w-4 text-green-500 ml-auto flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Signatures */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Signatures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Employee</h3>
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

const CodeOfConductAckList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Code of Conduct Acknowledgements</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 32: Code of Conduct acknowledgement</p>
        </div>
        <Link
          to="/hr/employee-management/onboarding/code-of-conduct/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Acknowledgement
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No acknowledgements found</p>
                <Link
                  to="/hr/employee-management/onboarding/code-of-conduct/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                >
                  <Plus className="h-4 w-4" />
                  Create Acknowledgement
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CodeOfConductAck = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <CodeOfConductAckForm />;
  return <CodeOfConductAckList />;
};

export default CodeOfConductAck;
