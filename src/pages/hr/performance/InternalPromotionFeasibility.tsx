import { useState } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  Save,
  Send,
  Target,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PerformanceWorkflow } from './components/PerformanceWorkflow';

interface TORRequirement {
  requirement: string;
  details: string;
  status: 'meets' | 'does_not_meet' | '';
  remarks: string;
}

interface PromotionFeasibilityData {
  // Section 1: Vacancy Information
  vacancyTitle: string;
  department: string;
  dutyStation: string;
  vacancyIdentifiedDate: string;
  torAvailable: boolean;
  torUpdateDate: string;

  // Section 2: Eligibility Basis
  hasRecommendedStaff: boolean;
  recommendedStaffDetails: string;
  meetsRequirements: boolean;

  // Section 3: TOR Alignment
  torRequirements: TORRequirement[];

  // Section 4: Feasibility Determination
  atLeastOneMeets: boolean;
  internalPromotionFeasible: boolean;
  justification: string;

  // Section 5: Recommended Next Step
  nextStep: 'internal_promotion' | 'open_competition' | '';

  // Section 6: Approvals
  hrOfficerName: string;
  hrOfficerSigned: boolean;
  hrOfficerDate: string;
  hrSpecialistName: string;
  hrSpecialistSigned: boolean;
  hrSpecialistDate: string;
  departmentHeadName: string;
  departmentHeadSigned: boolean;
  departmentHeadDate: string;
  approverName: string;
  approverSigned: boolean;
  approverDate: string;

  status: 'draft' | 'pending_review' | 'pending_approval' | 'approved' | 'rejected';
}

const defaultTORRequirements: TORRequirement[] = [
  { requirement: 'Academic Qualification', details: '', status: '', remarks: '' },
  { requirement: 'Minimum Years of Experience', details: '', status: '', remarks: '' },
  { requirement: 'Technical Competencies', details: '', status: '', remarks: '' },
  { requirement: 'Behavioral Competencies', details: '', status: '', remarks: '' },
  { requirement: 'Required Certifications', details: '', status: '', remarks: '' },
  { requirement: 'Language Requirements', details: '', status: '', remarks: '' },
];

const InternalPromotionFeasibilityFormComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<PromotionFeasibilityData>({
    vacancyTitle: '',
    department: '',
    dutyStation: '',
    vacancyIdentifiedDate: '',
    torAvailable: false,
    torUpdateDate: '',
    hasRecommendedStaff: false,
    recommendedStaffDetails: '',
    meetsRequirements: false,
    torRequirements: [...defaultTORRequirements],
    atLeastOneMeets: false,
    internalPromotionFeasible: false,
    justification: '',
    nextStep: '',
    hrOfficerName: '',
    hrOfficerSigned: false,
    hrOfficerDate: '',
    hrSpecialistName: '',
    hrSpecialistSigned: false,
    hrSpecialistDate: '',
    departmentHeadName: '',
    departmentHeadSigned: false,
    departmentHeadDate: '',
    approverName: '',
    approverSigned: false,
    approverDate: '',
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

  const updateTORRequirement = (index: number, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      torRequirements: prev.torRequirements.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.vacancyTitle) newErrors.vacancyTitle = 'Vacancy title is required';
    if (!formData.department) newErrors.department = 'Department is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    if (action === 'submit' && !validateForm()) return;

    const dataToSave = {
      ...formData,
      status: action === 'submit' ? 'pending_review' : 'draft',
    };

    console.log('Saving Promotion Feasibility:', dataToSave);
    navigate('/hr/performance/promotion-feasibility');
  };

  const meetsCount = formData.torRequirements.filter(r => r.status === 'meets').length;
  const totalWithStatus = formData.torRequirements.filter(r => r.status !== '').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/performance/promotion-feasibility"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Promotion Feasibility' : 'New Promotion Feasibility Review'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 23: Assess if internal promotion is possible
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
            Submit for Review
          </button>
        </div>
      </div>

      {/* Workflow */}
      <PerformanceWorkflow currentStep="feasibility" workflowType="promotion" />

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-8">
          {/* Section 1: Vacancy Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section 1: Vacancy Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vacancy Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.vacancyTitle}
                  onChange={(e) => handleChange('vacancyTitle', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.vacancyTitle ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter vacancy title"
                />
                {errors.vacancyTitle && <p className="mt-1 text-sm text-red-500">{errors.vacancyTitle}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department/Unit <span className="text-red-500">*</span>
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
                  Date Vacancy Identified
                </label>
                <input
                  type="date"
                  value={formData.vacancyIdentifiedDate}
                  onChange={(e) => handleChange('vacancyIdentifiedDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.torAvailable}
                    onChange={(e) => handleChange('torAvailable', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Updated TOR Available</span>
                </label>
              </div>
              {formData.torAvailable && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    TOR Update Date
                  </label>
                  <input
                    type="date"
                    value={formData.torUpdateDate}
                    onChange={(e) => handleChange('torUpdateDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Eligibility Basis */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section 2: Eligibility Basis</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.hasRecommendedStaff}
                    onChange={(e) => handleChange('hasRecommendedStaff', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500 mt-1"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Recent appraisal lists staff as "Recommended for Promotion"
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Check if any employee has been flagged for promotion in their latest performance appraisal
                    </p>
                  </div>
                </label>
              </div>

              {formData.hasRecommendedStaff && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Names and Positions of Recommended Staff
                  </label>
                  <textarea
                    value={formData.recommendedStaffDetails}
                    onChange={(e) => handleChange('recommendedStaffDetails', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="List staff members recommended for promotion..."
                  />
                </div>
              )}

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.meetsRequirements}
                    onChange={(e) => handleChange('meetsRequirements', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500 mt-1"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Recommended employees meet TOR requirements
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Confirm that at least one recommended staff meets all TOR requirements
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: TOR Alignment */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Section 3: TOR Alignment Check</h2>
              {totalWithStatus > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {meetsCount}/{totalWithStatus} requirements met
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TOR Requirement</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requirement Details</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-40">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {formData.torRequirements.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">{item.requirement}</td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.details}
                          onChange={(e) => updateTORRequirement(index, 'details', e.target.value)}
                          className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                          placeholder="Specify requirement..."
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateTORRequirement(index, 'status', 'meets')}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                              item.status === 'meets'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-green-50'
                            }`}
                          >
                            <CheckCircle className="h-3 w-3" />
                            Meets
                          </button>
                          <button
                            type="button"
                            onClick={() => updateTORRequirement(index, 'status', 'does_not_meet')}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                              item.status === 'does_not_meet'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-red-50'
                            }`}
                          >
                            <XCircle className="h-3 w-3" />
                            Does Not
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => updateTORRequirement(index, 'remarks', e.target.value)}
                          className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                          placeholder="Add remarks..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Feasibility Determination */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section 4: Feasibility Determination</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.atLeastOneMeets}
                      onChange={(e) => handleChange('atLeastOneMeets', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      At least one recommended staff meets TOR requirements
                    </span>
                  </label>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.internalPromotionFeasible}
                      onChange={(e) => handleChange('internalPromotionFeasible', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Internal promotion is feasible
                    </span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Summary Justification
                </label>
                <textarea
                  value={formData.justification}
                  onChange={(e) => handleChange('justification', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Provide justification for the feasibility determination..."
                />
              </div>
            </div>
          </div>

          {/* Section 5: Recommended Next Step */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section 5: Recommended Next Step</h2>
            <div className="flex flex-wrap gap-4">
              <label
                className={`flex items-center gap-3 px-6 py-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  formData.nextStep === 'internal_promotion'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="nextStep"
                  value="internal_promotion"
                  checked={formData.nextStep === 'internal_promotion'}
                  onChange={(e) => handleChange('nextStep', e.target.value)}
                  className="sr-only"
                />
                <CheckCircle className={`h-6 w-6 ${formData.nextStep === 'internal_promotion' ? 'text-green-500' : 'text-gray-400'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Proceed with Internal Promotion</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Recommended staff meets all requirements</p>
                </div>
              </label>
              <label
                className={`flex items-center gap-3 px-6 py-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  formData.nextStep === 'open_competition'
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="nextStep"
                  value="open_competition"
                  checked={formData.nextStep === 'open_competition'}
                  onChange={(e) => handleChange('nextStep', e.target.value)}
                  className="sr-only"
                />
                <AlertTriangle className={`h-6 w-6 ${formData.nextStep === 'open_competition' ? 'text-yellow-500' : 'text-gray-400'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Proceed with Open Competition</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Internal promotion not feasible</p>
                </div>
              </label>
            </div>
          </div>

          {/* Section 6: Approvals */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section 6: Approvals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* HR Officer */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">HR Officer (Prepared By)</h3>
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

              {/* HR Specialist */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">HR Specialist (Reviewed By)</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.hrSpecialistName}
                    onChange={(e) => handleChange('hrSpecialistName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    placeholder="Name"
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
                        className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Department Head */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Department Head (Consulted)</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.departmentHeadName}
                    onChange={(e) => handleChange('departmentHeadName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    placeholder="Name"
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.departmentHeadSigned}
                        onChange={(e) => handleChange('departmentHeadSigned', e.target.checked)}
                        className="rounded border-gray-300 text-primary-500"
                      />
                      <span className="text-sm">Signed</span>
                    </label>
                    {formData.departmentHeadSigned && (
                      <input
                        type="date"
                        value={formData.departmentHeadDate}
                        onChange={(e) => handleChange('departmentHeadDate', e.target.value)}
                        className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* ED/Delegate Approval */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">ED/Delegate (Approval)</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.approverName}
                    onChange={(e) => handleChange('approverName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    placeholder="Name"
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.approverSigned}
                        onChange={(e) => handleChange('approverSigned', e.target.checked)}
                        className="rounded border-gray-300 text-primary-500"
                      />
                      <span className="text-sm">Approved</span>
                    </label>
                    {formData.approverSigned && (
                      <input
                        type="date"
                        value={formData.approverDate}
                        onChange={(e) => handleChange('approverDate', e.target.value)}
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
    </div>
  );
};

const InternalPromotionFeasibilityList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const reviews = [
    {
      id: '1',
      vacancyTitle: 'Senior Program Manager',
      department: 'Programs',
      recommendedStaff: 'Sara Mohammadi',
      nextStep: 'internal_promotion',
      status: 'approved',
    },
    {
      id: '2',
      vacancyTitle: 'Finance Manager',
      department: 'Finance',
      recommendedStaff: 'None eligible',
      nextStep: 'open_competition',
      status: 'pending_approval',
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      pending_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      pending_approval: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    const labels: Record<string, string> = {
      draft: 'Draft',
      pending_review: 'Pending Review',
      pending_approval: 'Pending Approval',
      approved: 'Approved',
      rejected: 'Rejected',
    };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Promotion Feasibility Reviews</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 23: Assess internal promotion eligibility</p>
        </div>
        <Link
          to="/hr/performance/promotion-feasibility/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Review
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by vacancy title..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommended Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Decision</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{review.vacancyTitle}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{review.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{review.recommendedStaff}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      review.nextStep === 'internal_promotion'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {review.nextStep === 'internal_promotion' ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Internal
                        </>
                      ) : (
                        <>
                          <Users className="h-3 w-3" />
                          Open Competition
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(review.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/hr/performance/promotion-feasibility/${review.id}`}
                      className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <Target className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No feasibility reviews found</p>
                  <Link
                    to="/hr/performance/promotion-feasibility/new"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                  >
                    <Plus className="h-4 w-4" />
                    Start New Review
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InternalPromotionFeasibility = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <InternalPromotionFeasibilityFormComponent />;
  return <InternalPromotionFeasibilityList />;
};

export default InternalPromotionFeasibility;
