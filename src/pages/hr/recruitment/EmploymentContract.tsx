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

interface EmploymentContractData {
  contractNumber: string;
  employeeName: string;
  position: string;
  department: string;
  dutyStation: string;
  contractType: 'core' | 'project' | 'consultant' | 'part_time' | 'internship' | 'daily_wage';
  // Duration
  startDate: string;
  endDate: string;
  // Probation
  probationDuration: string;
  probationConditions: string;
  // Working Conditions
  workingHours: string;
  holidays: string;
  // Compensation
  basicSalary: number;
  currency: string;
  allowances: string;
  benefits: string;
  // Duties
  dutiesResponsibilities: string;
  reportingLine: string;
  // Standards
  professionalStandards: string;
  confidentiality: string;
  terminationConditions: string;
  // Zero Tolerance
  zeroToleranceItems: string;
  // ToR Reference
  torAttached: boolean;
  // Signatures
  employeeSignature: boolean;
  employeeSignatureDate: string;
  vdoSignatoryName: string;
  vdoSignatoryPosition: string;
  vdoSignature: boolean;
  vdoSignatureDate: string;
  status: 'draft' | 'pending_employee' | 'pending_vdo' | 'signed' | 'active' | 'terminated';
}

const EmploymentContractForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<EmploymentContractData>({
    contractNumber: `VDO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    employeeName: '',
    position: '',
    department: '',
    dutyStation: '',
    contractType: 'project',
    startDate: '',
    endDate: '',
    probationDuration: '3 months',
    probationConditions: 'Performance evaluation at the end of probation period. Continuation of employment subject to satisfactory performance.',
    workingHours: 'Sunday to Thursday, 08:00 - 16:00 (40 hours per week)',
    holidays: 'As per VDO HR Policy and Afghan government holidays',
    basicSalary: 0,
    currency: 'AFN',
    allowances: '',
    benefits: 'Health insurance, annual leave, sick leave as per VDO HR Policy',
    dutiesResponsibilities: '',
    reportingLine: '',
    professionalStandards: 'Employee shall maintain high professional standards and comply with VDO policies and procedures.',
    confidentiality: 'Employee shall maintain strict confidentiality of all VDO and beneficiary information during and after employment.',
    terminationConditions: 'Either party may terminate this contract with 30 days written notice. Immediate termination for gross misconduct.',
    zeroToleranceItems: '- Sexual exploitation and abuse (SEA)\n- Child abuse and exploitation\n- Fraud and corruption\n- Harassment and discrimination\n- Breach of confidentiality',
    torAttached: false,
    employeeSignature: false,
    employeeSignatureDate: '',
    vdoSignatoryName: '',
    vdoSignatoryPosition: '',
    vdoSignature: false,
    vdoSignatureDate: '',
    status: 'draft',
  });

  const handleChange = (field: keyof EmploymentContractData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    console.log('Saving Contract:', formData);
    navigate('/hr/recruitment/employment-contract');
  };

  const contractTypes = [
    { value: 'core', label: 'Core (Permanent)' },
    { value: 'project', label: 'Project-based' },
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
            to="/hr/recruitment/employment-contract"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Employment Contract' : 'New Employment Contract'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 21: Legal employment agreement
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
            Export PDF
          </button>
          <button
            onClick={() => handleSubmit('save')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit('submit')}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            <Send className="h-4 w-4" />
            Finalize Contract
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Contract Header */}
          <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">EMPLOYMENT CONTRACT</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Contract Number: <span className="font-mono">{formData.contractNumber}</span>
            </p>
          </div>

          {/* Employee Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Employee Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => handleChange('employeeName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
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
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duty Station <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.dutyStation}
                  onChange={(e) => handleChange('dutyStation', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contract Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.contractType}
                  onChange={(e) => handleChange('contractType', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  {contractTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reporting To</label>
                <input
                  type="text"
                  value={formData.reportingLine}
                  onChange={(e) => handleChange('reportingLine', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Contract Duration */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">1. Duration of Contract</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Probation Period */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">2. Probationary Period</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                <input
                  type="text"
                  value={formData.probationDuration}
                  onChange={(e) => handleChange('probationDuration', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Conditions</label>
                <textarea
                  value={formData.probationConditions}
                  onChange={(e) => handleChange('probationConditions', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">3. Working Hours and Holidays</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Working Hours</label>
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={(e) => handleChange('workingHours', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Holidays</label>
                <input
                  type="text"
                  value={formData.holidays}
                  onChange={(e) => handleChange('holidays', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Compensation */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">4. Compensation and Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Basic Salary <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.basicSalary || ''}
                    onChange={(e) => handleChange('basicSalary', parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  >
                    <option value="AFN">AFN</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Allowances</label>
                <input
                  type="text"
                  value={formData.allowances}
                  onChange={(e) => handleChange('allowances', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="e.g., Transportation, Communication"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Benefits</label>
                <textarea
                  value={formData.benefits}
                  onChange={(e) => handleChange('benefits', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Duties */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">5. Duties and Responsibilities</h3>
            <textarea
              value={formData.dutiesResponsibilities}
              onChange={(e) => handleChange('dutiesResponsibilities', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              placeholder="As detailed in the attached Terms of Reference (ToR)"
            />
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={formData.torAttached}
                onChange={(e) => handleChange('torAttached', e.target.checked)}
                className="rounded border-gray-300 text-primary-500"
              />
              <span className="text-sm">Terms of Reference (ToR) attached as Annex A</span>
            </label>
          </div>

          {/* Professional Standards & Confidentiality */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">6-8. Standards, Confidentiality & Termination</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Professional Standards</label>
                <textarea
                  value={formData.professionalStandards}
                  onChange={(e) => handleChange('professionalStandards', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confidentiality</label>
                <textarea
                  value={formData.confidentiality}
                  onChange={(e) => handleChange('confidentiality', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Termination Conditions</label>
                <textarea
                  value={formData.terminationConditions}
                  onChange={(e) => handleChange('terminationConditions', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Zero Tolerance */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">9. Zero Tolerance Policy</h3>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <textarea
                value={formData.zeroToleranceItems}
                onChange={(e) => handleChange('zeroToleranceItems', e.target.value)}
                rows={5}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Signatures */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Signatures</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee Signature */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Employee</h4>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name: {formData.employeeName || '_______________'}</p>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.employeeSignature}
                      onChange={(e) => handleChange('employeeSignature', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500"
                    />
                    <span className="text-sm">Signed</span>
                  </label>
                  {formData.employeeSignature && (
                    <input
                      type="date"
                      value={formData.employeeSignatureDate}
                      onChange={(e) => handleChange('employeeSignatureDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  )}
                </div>
              </div>

              {/* VDO Signature */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">VDO (ED/DD/HOP)</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Signatory Name"
                    value={formData.vdoSignatoryName}
                    onChange={(e) => handleChange('vdoSignatoryName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={formData.vdoSignatoryPosition}
                    onChange={(e) => handleChange('vdoSignatoryPosition', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.vdoSignature}
                      onChange={(e) => handleChange('vdoSignature', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500"
                    />
                    <span className="text-sm">Signed</span>
                  </label>
                  {formData.vdoSignature && (
                    <input
                      type="date"
                      value={formData.vdoSignatureDate}
                      onChange={(e) => handleChange('vdoSignatureDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
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

const EmploymentContractList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employment Contracts</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 21: Manage employment agreements</p>
        </div>
        <Link
          to="/hr/recruitment/employment-contract/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Contract
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by employee or position..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contract #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600">No employment contracts found</p>
                <Link
                  to="/hr/recruitment/employment-contract/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                >
                  <Plus className="h-4 w-4" />
                  Create Contract
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EmploymentContract = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <EmploymentContractForm />;
  return <EmploymentContractList />;
};

export default EmploymentContract;
