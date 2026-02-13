import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  FileText,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  Save,
  Send,
  ArrowRight
} from 'lucide-react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { RecruitmentWorkflow, WorkflowNavigation, VacancyInfoBanner } from './components';

interface SRFFormData {
  id?: string;
  // SRF Header
  srfNumber: string;
  dateIssued: string;
  vacancyNumber: string;
  // Position Details
  jobTitle: string;
  salaryGrade: string;
  salary: string;
  // Staff Required and Gender
  numberOfMaleStaff: number;
  numberOfFemaleStaff: number;
  totalNumberOfStaff: number;
  dutyStation: string;
  // Contract Details
  contractType: string;
  contractDuration: string;
  // Hiring Approach
  hiringApproach: string;
  // Additional Fields
  nationality: string;
  projectDepartment: string;
  category: string;
  yearsOfExperience: string;
  staffRequiredByDate: string;
  jobDescription: string;
  // Education
  educationQualification: {
    highSchool: boolean;
    transcript14Years: boolean;
    bachelorsDiploma: boolean;
    mastersDegree: boolean;
    professionalCertifications: boolean;
    phd: boolean;
  };
  // Languages and Skills
  essentialLanguages: {
    dari: boolean;
    pashto: boolean;
    english: boolean;
    other: boolean;
  };
  otherLanguageSpecify: string;
  otherSkills: string;
  // Equipment
  requiredEquipment: {
    laptop: boolean;
    desktop: boolean;
    idCard: boolean;
    businessCard: boolean;
    headset: boolean;
    keyboard: boolean;
    mouse: boolean;
    simCard: boolean;
    officialEmail: boolean;
    officeDesk: boolean;
    other: boolean;
  };
  equipmentOther: string;
  // Examination and Interview
  writtenExamRequired: boolean;
  interviewType: 'physical' | 'online';
  // Justifications
  srfJustification: string;
  hiringApproachJustification: string;
  // Requestor Details
  requestorName: string;
  requestorPosition: string;
  requestorSignature: string;
  requestorDate: string;
  // HR Department Verification
  hrVerificationName: string;
  hrVerificationPosition: string;
  hrSpecialist: string;
  hrVerificationSignature: string;
  hrVerificationDate: string;
  // Budget Availability - Finance Department
  budgetLineProjectCode: string;
  availableBudgetAFN: string;
  financeManagerName: string;
  financeManagerPosition: string;
  financeManagerSignature: string;
  financeManagerDate: string;
  // Final Approval
  finalApprovalName: string;
  finalApprovalPosition: string;
  finalApprovalSignature: string;
  finalApprovalDate: string;
  status: 'draft' | 'pending_hr_verification' | 'pending_budget_check' | 'pending_approval' | 'approved' | 'rejected';
}

const salaryGrades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
const dutyStations = ['Kabul', 'Herat', 'Mazar-i-Sharif', 'Kandahar', 'Jalalabad', 'Kunduz', 'Bamyan', 'Field Office'];
const contractTypes = ['Fixed term', 'Part-time', 'Consultant', 'Project based', 'Volunteer', 'Minor', 'Consulting'];
const hiringApproaches = ['Open Competition', 'Internal promotion', 'Headhunting', 'Internal Transfer', 'Interim Hiring', 'Job Rotation', 'Sole Source Recruitment'];
const nationalityOptions = ['National', 'International'];

const statusConfig = {
  draft: { label: 'Draft', color: 'gray' },
  pending_hr_verification: { label: 'Pending HR Verification', color: 'yellow' },
  pending_budget_check: { label: 'Pending Budget Check', color: 'blue' },
  pending_approval: { label: 'Pending Approval', color: 'purple' },
  approved: { label: 'Approved', color: 'green' },
  rejected: { label: 'Rejected', color: 'red' },
};

const SRFForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id && id !== 'new');

  // Get vacancy number from URL params (passed from ToR form)
  const vacancyFromUrl = searchParams.get('vacancy') || '';

  const [formData, setFormData] = useState<SRFFormData>({
    srfNumber: '',
    dateIssued: new Date().toISOString().split('T')[0],
    vacancyNumber: vacancyFromUrl,
    jobTitle: '',
    salaryGrade: '',
    salary: '',
    numberOfMaleStaff: 0,
    numberOfFemaleStaff: 0,
    totalNumberOfStaff: 0,
    dutyStation: '',
    contractType: '',
    contractDuration: '',
    hiringApproach: '',
    nationality: '',
    projectDepartment: '',
    category: 'Human Resources',
    yearsOfExperience: '',
    staffRequiredByDate: '',
    jobDescription: 'As per TOR',
    educationQualification: {
      highSchool: false,
      transcript14Years: false,
      bachelorsDiploma: false,
      mastersDegree: false,
      professionalCertifications: false,
      phd: false,
    },
    essentialLanguages: {
      dari: false,
      pashto: false,
      english: false,
      other: false,
    },
    otherLanguageSpecify: '',
    otherSkills: '',
    requiredEquipment: {
      laptop: false,
      desktop: false,
      idCard: false,
      businessCard: false,
      headset: false,
      keyboard: false,
      mouse: false,
      simCard: false,
      officialEmail: false,
      officeDesk: false,
      other: false,
    },
    equipmentOther: '',
    writtenExamRequired: false,
    interviewType: 'physical',
    srfJustification: '',
    hiringApproachJustification: '',
    requestorName: '',
    requestorPosition: '',
    requestorSignature: '',
    requestorDate: '',
    hrVerificationName: '',
    hrVerificationPosition: '',
    hrSpecialist: '',
    hrVerificationSignature: '',
    hrVerificationDate: '',
    budgetLineProjectCode: '',
    availableBudgetAFN: '',
    financeManagerName: '',
    financeManagerPosition: '',
    financeManagerSignature: '',
    financeManagerDate: '',
    finalApprovalName: '',
    finalApprovalPosition: '',
    finalApprovalSignature: '',
    finalApprovalDate: '',
    status: 'draft',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      }
      const [parent, child] = keys;
      return {
        ...prev,
        [parent]: {
          ...(prev[parent as keyof SRFFormData] as Record<string, unknown>),
          [child]: value,
        },
      };
    });
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    console.log('Saving SRF:', formData);
    if (action === 'submit' && formData.vacancyNumber) {
      // Navigate to next step (Applications) with vacancy number
      navigate(`/hr/recruitment/applications/new?vacancy=${formData.vacancyNumber}`);
    } else {
      navigate('/hr/recruitment/staff-requisition');
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Progress */}
      <RecruitmentWorkflow currentStep="srf" vacancyId={isEdit ? id : undefined} />

      {/* Vacancy Info Banner */}
      {formData.vacancyNumber && (
        <VacancyInfoBanner
          vacancyNumber={formData.vacancyNumber}
          positionTitle={formData.jobTitle}
          department={formData.projectDepartment}
          status={formData.status}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={formData.vacancyNumber ? `/hr/recruitment/terms-of-reference/${formData.vacancyNumber}` : '/hr/recruitment/staff-requisition'}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Staff Requisition Form' : 'New Staff Requisition Form'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 2: Formal request to fill a position
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
            Submit & Continue
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* SRF Header */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SRF Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SRF Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.srfNumber}
                  onChange={(e) => handleChange('srfNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter SRF number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date Issued <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dateIssued}
                  onChange={(e) => handleChange('dateIssued', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Position Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Position Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => handleChange('jobTitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter position title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Salary Grade <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.salaryGrade}
                  onChange={(e) => handleChange('salaryGrade', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Grade</option>
                  {salaryGrades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Salary
                </label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => handleChange('salary', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter salary amount"
                />
              </div>
            </div>
          </div>

          {/* Staff Required and Gender */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">No. Staff Required and Gender</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Male Staff
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.numberOfMaleStaff}
                  onChange={(e) => {
                    const male = parseInt(e.target.value) || 0;
                    handleChange('numberOfMaleStaff', male);
                    handleChange('totalNumberOfStaff', male + formData.numberOfFemaleStaff);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Female Staff
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.numberOfFemaleStaff}
                  onChange={(e) => {
                    const female = parseInt(e.target.value) || 0;
                    handleChange('numberOfFemaleStaff', female);
                    handleChange('totalNumberOfStaff', formData.numberOfMaleStaff + female);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalNumberOfStaff}
                  onChange={(e) => handleChange('totalNumberOfStaff', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Duty Station and Other Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duty Station <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.dutyStation}
                  onChange={(e) => handleChange('dutyStation', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Station</option>
                  {dutyStations.map(station => (
                    <option key={station} value={station}>{station}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nationality <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.nationality}
                  onChange={(e) => handleChange('nationality', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Nationality</option>
                  {nationalityOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department/Project <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.projectDepartment}
                  onChange={(e) => handleChange('projectDepartment', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter department or project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Human Resources"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Years of Experience
                </label>
                <input
                  type="text"
                  value={formData.yearsOfExperience}
                  onChange={(e) => handleChange('yearsOfExperience', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., 3-5 years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Staff Required by (date)
                </label>
                <input
                  type="date"
                  value={formData.staffRequiredByDate}
                  onChange={(e) => handleChange('staffRequiredByDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Description
              </label>
              <textarea
                value={formData.jobDescription}
                onChange={(e) => handleChange('jobDescription', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="As per TOR"
              />
            </div>
          </div>

          {/* Contract Type */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contract Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contract Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.contractType}
                  onChange={(e) => handleChange('contractType', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Contract Type</option>
                  {contractTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contract Duration
                </label>
                <input
                  type="text"
                  value={formData.contractDuration}
                  onChange={(e) => handleChange('contractDuration', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., 12 months"
                />
              </div>
            </div>
          </div>

          {/* Hiring Approach */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hiring Approach</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hiring Approach <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.hiringApproach}
                  onChange={(e) => handleChange('hiringApproach', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Hiring Approach</option>
                  {hiringApproaches.map(approach => (
                    <option key={approach} value={approach}>{approach}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Brief justification of Hiring approach
                </label>
                <textarea
                  value={formData.hiringApproachJustification}
                  onChange={(e) => handleChange('hiringApproachJustification', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Why this hiring approach?"
                />
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Educational Qualification</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries({
                highSchool: 'High School',
                transcript14Years: '14 Years Transcript',
                bachelorsDiploma: 'Bachelors (diploma)',
                mastersDegree: "Master's degree",
                professionalCertifications: 'Professional Certifications',
                phd: 'PhD',
              }).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.educationQualification[key as keyof typeof formData.educationQualification]}
                    onChange={(e) => handleChange(`educationQualification.${key}`, e.target.checked)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Essential Languages</h2>
            <div className="flex flex-wrap gap-6">
              {Object.entries({
                dari: 'Dari',
                pashto: 'Pashto',
                english: 'English',
                other: 'Other',
              }).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.essentialLanguages[key as keyof typeof formData.essentialLanguages]}
                    onChange={(e) => handleChange(`essentialLanguages.${key}`, e.target.checked)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              ))}
            </div>
            {formData.essentialLanguages.other && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Specify Other Language
                </label>
                <input
                  type="text"
                  value={formData.otherLanguageSpecify}
                  onChange={(e) => handleChange('otherLanguageSpecify', e.target.value)}
                  className="w-full max-w-md px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter language name"
                />
              </div>
            )}
          </div>

          {/* Other Skills */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Other Skills</h2>
            <textarea
              value={formData.otherSkills}
              onChange={(e) => handleChange('otherSkills', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="List any other required skills..."
            />
          </div>

          {/* Required Equipment */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Required Equipment for the Position</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries({
                laptop: 'Laptop',
                desktop: 'Desktop',
                idCard: 'ID Card',
                businessCard: 'Business Card',
                headset: 'Headset',
                keyboard: 'Keyboard',
                mouse: 'Mouse',
                simCard: 'SIM Card',
                officialEmail: 'Official Email',
                officeDesk: 'Office Desk',
                other: 'Other',
              }).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.requiredEquipment[key as keyof typeof formData.requiredEquipment]}
                    onChange={(e) => handleChange(`requiredEquipment.${key}`, e.target.checked)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              ))}
            </div>
            {formData.requiredEquipment.other && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Specify Other Equipment
                </label>
                <input
                  type="text"
                  value={formData.equipmentOther}
                  onChange={(e) => handleChange('equipmentOther', e.target.value)}
                  className="w-full max-w-md px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter other equipment"
                />
              </div>
            )}
          </div>

          {/* Written Examination and Interview */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Examination and Interview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Written Examination Required?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="writtenExam"
                      checked={formData.writtenExamRequired === true}
                      onChange={() => handleChange('writtenExamRequired', true)}
                      className="text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="writtenExam"
                      checked={formData.writtenExamRequired === false}
                      onChange={() => handleChange('writtenExamRequired', false)}
                      className="text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type of Interview
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="interviewType"
                      checked={formData.interviewType === 'physical'}
                      onChange={() => handleChange('interviewType', 'physical')}
                      className="text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Physical</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="interviewType"
                      checked={formData.interviewType === 'online'}
                      onChange={() => handleChange('interviewType', 'online')}
                      className="text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Online</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Justifications */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Justifications</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Brief justification for SRF (need for staff?)
              </label>
              <textarea
                value={formData.srfJustification}
                onChange={(e) => handleChange('srfJustification', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Explain why this staff position is needed..."
              />
            </div>
          </div>

          {/* Signatures */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Approvals and Signatures</h2>
            <div className="space-y-6">
              {/* Requestor Details */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Requestor Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="Requestor name"
                      value={formData.requestorName}
                      onChange={(e) => handleChange('requestorName', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Position</label>
                    <input
                      type="text"
                      placeholder="Requestor position"
                      value={formData.requestorPosition}
                      onChange={(e) => handleChange('requestorPosition', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Signature</label>
                    <input
                      type="text"
                      placeholder="Signature"
                      value={formData.requestorSignature}
                      onChange={(e) => handleChange('requestorSignature', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.requestorDate}
                      onChange={(e) => handleChange('requestorDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* HR Department Verification */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">HR Department Verification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="HR name"
                      value={formData.hrVerificationName}
                      onChange={(e) => handleChange('hrVerificationName', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Position</label>
                    <input
                      type="text"
                      placeholder="HR Specialist"
                      value={formData.hrVerificationPosition}
                      onChange={(e) => handleChange('hrVerificationPosition', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Signature</label>
                    <input
                      type="text"
                      placeholder="Signature"
                      value={formData.hrVerificationSignature}
                      onChange={(e) => handleChange('hrVerificationSignature', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.hrVerificationDate}
                      onChange={(e) => handleChange('hrVerificationDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Budget Availability - Finance Department */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Budget Availability - Finance Department</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Budget Line / Project Code</label>
                    <input
                      type="text"
                      placeholder="Budget line or project code"
                      value={formData.budgetLineProjectCode}
                      onChange={(e) => handleChange('budgetLineProjectCode', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Available Budget (AFN)</label>
                    <input
                      type="text"
                      placeholder="Amount in AFN"
                      value={formData.availableBudgetAFN}
                      onChange={(e) => handleChange('availableBudgetAFN', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="Finance manager name"
                      value={formData.financeManagerName}
                      onChange={(e) => handleChange('financeManagerName', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Position</label>
                    <input
                      type="text"
                      placeholder="Finance Manager"
                      value={formData.financeManagerPosition}
                      onChange={(e) => handleChange('financeManagerPosition', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Signature</label>
                    <input
                      type="text"
                      placeholder="Signature"
                      value={formData.financeManagerSignature}
                      onChange={(e) => handleChange('financeManagerSignature', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.financeManagerDate}
                      onChange={(e) => handleChange('financeManagerDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Final Approval */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Final Approval</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="Approver name"
                      value={formData.finalApprovalName}
                      onChange={(e) => handleChange('finalApprovalName', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Position</label>
                    <input
                      type="text"
                      placeholder="Approver position"
                      value={formData.finalApprovalPosition}
                      onChange={(e) => handleChange('finalApprovalPosition', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Signature</label>
                    <input
                      type="text"
                      placeholder="Signature"
                      value={formData.finalApprovalSignature}
                      onChange={(e) => handleChange('finalApprovalSignature', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.finalApprovalDate}
                      onChange={(e) => handleChange('finalApprovalDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
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

const SRFList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Requisition Forms</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 2: Manage position requests</p>
        </div>
        <Link
          to="/hr/recruitment/staff-requisition/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New SRF
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by job title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Closing Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No staff requisition forms found</p>
                <Link
                  to="/hr/recruitment/staff-requisition/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600"
                >
                  <Plus className="h-4 w-4" />
                  Create New SRF
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StaffRequisition = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <SRFForm />;
  return <SRFList />;
};

export default StaffRequisition;
