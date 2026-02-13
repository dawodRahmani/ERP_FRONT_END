import { useState } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  Save,
  Send,
  Users,
  User
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EmployeeWorkflow } from '../components/EmployeeWorkflow';

interface MahramFormData {
  // Section 1: Personal Information
  employeeFullName: string;
  employeeId: string;
  departmentPosition: string;
  contactNumber: string;
  workLocation: string;

  // Section 2: Mahram Details
  mahramName: string;
  mahramRelationship: 'father' | 'husband' | 'brother' | 'son' | 'other';
  mahramRelationshipOther: string;
  mahramNationalId: string;
  mahramContactNumber: string;
  mahramAddress: string;
  mahramAvailability: 'full_time' | 'part_time' | 'on_call';

  // Section 3: Declarations
  employeeDeclarationSigned: boolean;
  employeeDeclarationDate: string;
  mahramConsentSigned: boolean;
  mahramConsentDate: string;

  // Section 4: Official Use
  receivedByHR: string;
  receivedDate: string;
  remarks: string;
  approvedBy: string;
  approverSigned: boolean;
  approverSignDate: string;

  status: 'draft' | 'pending' | 'approved';
}

const MahramFormComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<MahramFormData>({
    employeeFullName: '',
    employeeId: '',
    departmentPosition: '',
    contactNumber: '',
    workLocation: '',
    mahramName: '',
    mahramRelationship: 'father',
    mahramRelationshipOther: '',
    mahramNationalId: '',
    mahramContactNumber: '',
    mahramAddress: '',
    mahramAvailability: 'full_time',
    employeeDeclarationSigned: false,
    employeeDeclarationDate: '',
    mahramConsentSigned: false,
    mahramConsentDate: '',
    receivedByHR: '',
    receivedDate: new Date().toISOString().split('T')[0],
    remarks: '',
    approvedBy: '',
    approverSigned: false,
    approverSignDate: '',
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeFullName) newErrors.employeeFullName = 'Employee name is required';
    if (!formData.mahramName) newErrors.mahramName = 'Mahram name is required';
    if (!formData.mahramNationalId) newErrors.mahramNationalId = 'Mahram National ID is required';
    if (!formData.mahramContactNumber) newErrors.mahramContactNumber = 'Mahram contact number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    if (action === 'submit' && !validateForm()) return;

    const dataToSave = {
      ...formData,
      status: action === 'submit' ? 'pending' : 'draft',
    };

    console.log('Saving Mahram Form:', dataToSave);
    navigate('/hr/employee-management/onboarding/mahram');
  };

  const relationshipOptions = [
    { value: 'father', label: 'Father' },
    { value: 'husband', label: 'Husband' },
    { value: 'brother', label: 'Brother' },
    { value: 'son', label: 'Son' },
    { value: 'other', label: 'Other' },
  ];

  const availabilityOptions = [
    { value: 'full_time', label: 'Full-time' },
    { value: 'part_time', label: 'Part-time' },
    { value: 'on_call', label: 'On-call' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/employee-management/onboarding/mahram"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Mahram Form' : 'New Mahram Form'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 40/52: Female Staff Mahram Registration
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
            Submit for Approval
          </button>
        </div>
      </div>

      {/* Workflow */}
      <EmployeeWorkflow currentStep="mahram" workflowType="onboarding" />

      {/* Info Banner */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-300">Mahram Registration</h3>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              This form is required for female staff members to register their Mahram (male guardian) information for work-related travel and field activities.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Section 1: Personal Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section 1: Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name <span className="text-red-500">*</span>
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
                  Department/Position
                </label>
                <input
                  type="text"
                  value={formData.departmentPosition}
                  onChange={(e) => handleChange('departmentPosition', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter department/position"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => handleChange('contactNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter contact number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Work Location
                </label>
                <input
                  type="text"
                  value={formData.workLocation}
                  onChange={(e) => handleChange('workLocation', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter work location"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Mahram Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section 2: Mahram Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name of Mahram <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.mahramName}
                  onChange={(e) => handleChange('mahramName', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.mahramName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter Mahram name"
                />
                {errors.mahramName && <p className="mt-1 text-sm text-red-500">{errors.mahramName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Relationship
                </label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {relationshipOptions.map(option => (
                    <label key={option.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mahramRelationship"
                        checked={formData.mahramRelationship === option.value}
                        onChange={() => handleChange('mahramRelationship', option.value)}
                        className="text-primary-500"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
                {formData.mahramRelationship === 'other' && (
                  <input
                    type="text"
                    value={formData.mahramRelationshipOther}
                    onChange={(e) => handleChange('mahramRelationshipOther', e.target.value)}
                    className="mt-2 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    placeholder="Specify relationship"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  National ID Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.mahramNationalId}
                  onChange={(e) => handleChange('mahramNationalId', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.mahramNationalId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter Tazkira number"
                />
                {errors.mahramNationalId && <p className="mt-1 text-sm text-red-500">{errors.mahramNationalId}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.mahramContactNumber}
                  onChange={(e) => handleChange('mahramContactNumber', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.mahramContactNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter contact number"
                />
                {errors.mahramContactNumber && <p className="mt-1 text-sm text-red-500">{errors.mahramContactNumber}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.mahramAddress}
                  onChange={(e) => handleChange('mahramAddress', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Availability
                </label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {availabilityOptions.map(option => (
                    <label key={option.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mahramAvailability"
                        checked={formData.mahramAvailability === option.value}
                        onChange={() => handleChange('mahramAvailability', option.value)}
                        className="text-primary-500"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Declarations */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section 3: Declarations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Employee Declaration</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  I hereby declare that the information provided above is accurate and I consent to VDO contacting my Mahram for work-related travel and field activities.
                </p>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.employeeDeclarationSigned}
                      onChange={(e) => handleChange('employeeDeclarationSigned', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500"
                    />
                    <span className="text-sm">Signed</span>
                  </label>
                  {formData.employeeDeclarationSigned && (
                    <input
                      type="date"
                      value={formData.employeeDeclarationDate}
                      onChange={(e) => handleChange('employeeDeclarationDate', e.target.value)}
                      className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  )}
                </div>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Mahram Consent</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  I consent to be registered as the Mahram for the above-named employee and agree to accompany her during work-related travel as required.
                </p>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.mahramConsentSigned}
                      onChange={(e) => handleChange('mahramConsentSigned', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500"
                    />
                    <span className="text-sm">Signed</span>
                  </label>
                  {formData.mahramConsentSigned && (
                    <input
                      type="date"
                      value={formData.mahramConsentDate}
                      onChange={(e) => handleChange('mahramConsentDate', e.target.value)}
                      className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Official Use */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section 4: Official Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Received By (HR)
                </label>
                <input
                  type="text"
                  value={formData.receivedByHR}
                  onChange={(e) => handleChange('receivedByHR', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="HR Officer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date Received
                </label>
                <input
                  type="date"
                  value={formData.receivedDate}
                  onChange={(e) => handleChange('receivedDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Approved By
                </label>
                <input
                  type="text"
                  value={formData.approvedBy}
                  onChange={(e) => handleChange('approvedBy', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Approver name"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => handleChange('remarks', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Any additional remarks..."
                />
              </div>
              <div className="flex items-end">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.approverSigned}
                      onChange={(e) => handleChange('approverSigned', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500"
                    />
                    <span className="text-sm">Approver Signed</span>
                  </label>
                  {formData.approverSigned && (
                    <input
                      type="date"
                      value={formData.approverSignDate}
                      onChange={(e) => handleChange('approverSignDate', e.target.value)}
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

const MahramFormList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mahram Forms</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 40/52: Female staff Mahram registration</p>
        </div>
        <Link
          to="/hr/employee-management/onboarding/mahram/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Mahram Form
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mahram</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Relationship</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No Mahram forms found</p>
                <Link
                  to="/hr/employee-management/onboarding/mahram/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                >
                  <Plus className="h-4 w-4" />
                  Register Mahram
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MahramForm = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <MahramFormComponent />;
  return <MahramFormList />;
};

export default MahramForm;
