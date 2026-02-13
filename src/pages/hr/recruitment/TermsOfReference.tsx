import { useState, useRef, useEffect } from 'react';
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
  ArrowRight,
  ChevronDown,
  X
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RecruitmentWorkflow, WorkflowNavigation, VacancyInfoBanner } from './components';
import { useActiveDropdownsByCategory } from '../../../hooks/recruitment';

// Searchable Country Dropdown Component
interface CountryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  countries: { value: string; label: string }[];
}

const CountryDropdown = ({ value, onChange, error, countries }: CountryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCountries = countries.filter(c =>
    c.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setSearchTerm('');
    setIsOpen(false);
  };

  const selectedLabel = countries.find(c => c.value === value)?.label || value;

  return (
    <div ref={dropdownRef} className="relative">
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className={`w-full px-3 py-2 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer flex items-center justify-between`}
      >
        <span className={value ? '' : 'text-gray-500'}>{value ? selectedLabel : 'Select Country'}</span>
        <div className="flex items-center gap-1">
          {value && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
            >
              <X className="h-3 w-3 text-gray-400" />
            </button>
          )}
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search country..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">No countries found</div>
            ) : (
              filteredCountries.map(c => (
                <div
                  key={c.value}
                  onClick={() => handleSelect(c.value)}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    value === c.value ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {c.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

interface ToRFormData {
  id?: string;
  vacancyNumber: string;
  donor: string;
  project: string;
  department: string;
  positionTitle: string;
  reportsTo: string;
  dutyStation: string;
  country: string;
  gradeStep: string;
  contractType: string;
  contractDuration: number;
  contractDurationUnit: string;
  jobPurpose: string;
  tasksSpecificObjectives: string;
  tasksMeasurableTargets: string;
  tasksAchievableGoals: string;
  tasksRelevantOutcomes: string;
  tasksTimeBoundDeliverables: string;
  requiredQualifications: string;
  requiredSkills: string;
  minimumExperience: number;
  languageDari: boolean;
  languagePashto: boolean;
  languageEnglish: boolean;
  commitmentDedication: string;
  status: 'draft' | 'pending_review' | 'pending_approval' | 'approved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

interface ToRRecord extends ToRFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig = {
  draft: { label: 'Draft', color: 'gray', icon: FileText },
  pending_review: { label: 'Pending Review', color: 'yellow', icon: Clock },
  pending_approval: { label: 'Pending Approval', color: 'blue', icon: Clock },
  approved: { label: 'Approved', color: 'green', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'red', icon: XCircle },
};

// Generate vacancy number
const generateVacancyNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `VDO-${year}-${random}`;
};

// Form Component
const ToRForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  // Dynamic dropdown data from the centralized management system
  const { data: departments = [] } = useActiveDropdownsByCategory('department');
  const { data: dutyStations = [] } = useActiveDropdownsByCategory('dutyStation');
  const { data: gradeSteps = [] } = useActiveDropdownsByCategory('gradeStep');
  const { data: contractTypes = [] } = useActiveDropdownsByCategory('contractType');
  const { data: durationUnits = [] } = useActiveDropdownsByCategory('contractDurationUnit');
  const { data: countries = [] } = useActiveDropdownsByCategory('country');

  const [formData, setFormData] = useState<ToRFormData>({
    vacancyNumber: generateVacancyNumber(),
    donor: '',
    project: '',
    department: '',
    positionTitle: '',
    reportsTo: '',
    dutyStation: '',
    country: 'afghanistan',
    gradeStep: '',
    contractType: '',
    contractDuration: 0,
    contractDurationUnit: 'months',
    jobPurpose: '',
    tasksSpecificObjectives: '',
    tasksMeasurableTargets: '',
    tasksAchievableGoals: '',
    tasksRelevantOutcomes: '',
    tasksTimeBoundDeliverables: '',
    requiredQualifications: '',
    requiredSkills: '',
    minimumExperience: 0,
    languageDari: false,
    languagePashto: false,
    languageEnglish: false,
    commitmentDedication: '',
    status: 'draft',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.donor) newErrors.donor = 'Donor is required';
    if (!formData.project) newErrors.project = 'Project is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.positionTitle) newErrors.positionTitle = 'Position title is required';
    if (!formData.reportsTo) newErrors.reportsTo = 'Reports to is required';
    if (!formData.dutyStation) newErrors.dutyStation = 'Duty station is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.gradeStep) newErrors.gradeStep = 'Grade/Step is required';
    if (!formData.contractType) newErrors.contractType = 'Contract type is required';
    if (!formData.contractDuration || formData.contractDuration <= 0) newErrors.contractDuration = 'Contract duration must be greater than 0';
    if (!formData.contractDurationUnit) newErrors.contractDurationUnit = 'Duration unit is required';
    if (!formData.jobPurpose) newErrors.jobPurpose = 'Job purpose is required';
    if (!formData.tasksSpecificObjectives) newErrors.tasksSpecificObjectives = 'Specific objectives are required';
    if (!formData.tasksMeasurableTargets) newErrors.tasksMeasurableTargets = 'Measurable targets are required';
    if (!formData.tasksAchievableGoals) newErrors.tasksAchievableGoals = 'Achievable goals are required';
    if (!formData.tasksRelevantOutcomes) newErrors.tasksRelevantOutcomes = 'Relevant outcomes are required';
    if (!formData.tasksTimeBoundDeliverables) newErrors.tasksTimeBoundDeliverables = 'Time-bound deliverables are required';
    if (!formData.requiredQualifications) newErrors.requiredQualifications = 'Required qualifications are required';
    if (!formData.requiredSkills) newErrors.requiredSkills = 'Required skills are required';
    if (formData.minimumExperience < 0) newErrors.minimumExperience = 'Experience must be positive';
    if (!formData.languageDari && !formData.languagePashto && !formData.languageEnglish) {
      newErrors.languages = 'At least one language is required';
    }
    if (!formData.commitmentDedication) newErrors.commitmentDedication = 'Commitment & dedication section is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    if (action === 'submit' && !validateForm()) return;

    const dataToSave = {
      ...formData,
      status: action === 'submit' ? 'pending_review' as const : 'draft' as const,
    };

    console.log('Saving ToR:', dataToSave);
    // After saving, navigate to next step (SRF) with vacancy number
    if (action === 'submit') {
      navigate(`/hr/recruitment/staff-requisition/new?vacancy=${formData.vacancyNumber}`);
    } else {
      navigate('/hr/recruitment/terms-of-reference');
    }
  };

  const handleChange = (field: keyof ToRFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Progress */}
      <RecruitmentWorkflow currentStep="tor" vacancyId={isEdit ? id : undefined} />

      {/* Vacancy Info Banner (only for edit mode) */}
      {isEdit && (
        <VacancyInfoBanner
          vacancyNumber={formData.vacancyNumber}
          positionTitle={formData.positionTitle}
          department={formData.department}
          status={formData.status}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/recruitment/terms-of-reference"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Terms of Reference' : 'New Terms of Reference'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 1: Define job requirements for a vacancy
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
            Submit & Continue to SRF
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Vacancy Number - Read Only */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vacancy Number
                </label>
                <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                  {formData.vacancyNumber}
                </p>
                <p className="text-xs text-gray-500 mt-1">Auto-generated. This number links all recruitment forms.</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Donor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.donor}
                  onChange={(e) => handleChange('donor', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.donor ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                  placeholder="Enter donor name"
                />
                {errors.donor && <p className="mt-1 text-sm text-red-500">{errors.donor}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => handleChange('project', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.project ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                  placeholder="Enter project name"
                />
                {errors.project && <p className="mt-1 text-sm text-red-500">{errors.project}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.department ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                  ))}
                </select>
                {errors.department && <p className="mt-1 text-sm text-red-500">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.positionTitle}
                  onChange={(e) => handleChange('positionTitle', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.positionTitle ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                  placeholder="Enter position title"
                />
                {errors.positionTitle && <p className="mt-1 text-sm text-red-500">{errors.positionTitle}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reports To <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.reportsTo}
                  onChange={(e) => handleChange('reportsTo', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.reportsTo ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                  placeholder="Position reports to"
                />
                {errors.reportsTo && <p className="mt-1 text-sm text-red-500">{errors.reportsTo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duty Station <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.dutyStation}
                  onChange={(e) => handleChange('dutyStation', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.dutyStation ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                >
                  <option value="">Select Duty Station</option>
                  {dutyStations.map(station => (
                    <option key={station.value} value={station.value}>{station.label}</option>
                  ))}
                </select>
                {errors.dutyStation && <p className="mt-1 text-sm text-red-500">{errors.dutyStation}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <CountryDropdown
                  value={formData.country}
                  onChange={(value) => handleChange('country', value)}
                  error={errors.country}
                  countries={countries}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Grade/Step <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gradeStep}
                  onChange={(e) => handleChange('gradeStep', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.gradeStep ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                >
                  <option value="">Select Grade/Step</option>
                  {gradeSteps.map(grade => (
                    <option key={grade.value} value={grade.value}>{grade.label}</option>
                  ))}
                </select>
                {errors.gradeStep && <p className="mt-1 text-sm text-red-500">{errors.gradeStep}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contract Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.contractType}
                  onChange={(e) => handleChange('contractType', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.contractType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                >
                  <option value="">Select Contract Type</option>
                  {contractTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {errors.contractType && <p className="mt-1 text-sm text-red-500">{errors.contractType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contract Duration <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={formData.contractDuration || ''}
                    onChange={(e) => handleChange('contractDuration', parseInt(e.target.value) || 0)}
                    className={`flex-1 px-3 py-2 rounded-lg border ${errors.contractDuration ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                    placeholder="Enter duration"
                  />
                  <select
                    value={formData.contractDurationUnit}
                    onChange={(e) => handleChange('contractDurationUnit', e.target.value)}
                    className={`w-28 px-3 py-2 rounded-lg border ${errors.contractDurationUnit ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                  >
                    {durationUnits.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.label}</option>
                    ))}
                  </select>
                </div>
                {errors.contractDuration && <p className="mt-1 text-sm text-red-500">{errors.contractDuration}</p>}
              </div>
            </div>
          </div>

          {/* Job Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Purpose <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.jobPurpose}
              onChange={(e) => handleChange('jobPurpose', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border ${errors.jobPurpose ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
              placeholder="Describe the main purpose of this position"
            />
            {errors.jobPurpose && <p className="mt-1 text-sm text-red-500">{errors.jobPurpose}</p>}
          </div>

          {/* Tasks and Responsibilities (SMART Format) */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tasks and Responsibilities (SMART Format)
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Specific Objectives <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.tasksSpecificObjectives}
                  onChange={(e) => handleChange('tasksSpecificObjectives', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.tasksSpecificObjectives ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                  placeholder="List specific objectives"
                />
                {errors.tasksSpecificObjectives && <p className="mt-1 text-sm text-red-500">{errors.tasksSpecificObjectives}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Measurable Targets <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.tasksMeasurableTargets}
                  onChange={(e) => handleChange('tasksMeasurableTargets', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.tasksMeasurableTargets ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                  placeholder="List measurable targets"
                />
                {errors.tasksMeasurableTargets && <p className="mt-1 text-sm text-red-500">{errors.tasksMeasurableTargets}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Achievable Goals <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.tasksAchievableGoals}
                  onChange={(e) => handleChange('tasksAchievableGoals', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.tasksAchievableGoals ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                  placeholder="List achievable goals"
                />
                {errors.tasksAchievableGoals && <p className="mt-1 text-sm text-red-500">{errors.tasksAchievableGoals}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Relevant Outcomes <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.tasksRelevantOutcomes}
                  onChange={(e) => handleChange('tasksRelevantOutcomes', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.tasksRelevantOutcomes ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                  placeholder="List relevant outcomes"
                />
                {errors.tasksRelevantOutcomes && <p className="mt-1 text-sm text-red-500">{errors.tasksRelevantOutcomes}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time-bound Deliverables <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.tasksTimeBoundDeliverables}
                  onChange={(e) => handleChange('tasksTimeBoundDeliverables', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.tasksTimeBoundDeliverables ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                  placeholder="List time-bound deliverables"
                />
                {errors.tasksTimeBoundDeliverables && <p className="mt-1 text-sm text-red-500">{errors.tasksTimeBoundDeliverables}</p>}
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Requirements
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Required Qualifications <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.requiredQualifications}
                  onChange={(e) => handleChange('requiredQualifications', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.requiredQualifications ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                  placeholder="List required qualifications"
                />
                {errors.requiredQualifications && <p className="mt-1 text-sm text-red-500">{errors.requiredQualifications}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Required Skills <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.requiredSkills}
                  onChange={(e) => handleChange('requiredSkills', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.requiredSkills ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                  placeholder="List required skills"
                />
                {errors.requiredSkills && <p className="mt-1 text-sm text-red-500">{errors.requiredSkills}</p>}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minimum Experience (Years) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimumExperience}
                  onChange={(e) => handleChange('minimumExperience', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.minimumExperience ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                />
                {errors.minimumExperience && <p className="mt-1 text-sm text-red-500">{errors.minimumExperience}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Language Proficiency <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.languageDari}
                      onChange={(e) => handleChange('languageDari', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Dari</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.languagePashto}
                      onChange={(e) => handleChange('languagePashto', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Pashto</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.languageEnglish}
                      onChange={(e) => handleChange('languageEnglish', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">English</span>
                  </label>
                </div>
                {errors.languages && <p className="mt-1 text-sm text-red-500">{errors.languages}</p>}
              </div>
            </div>
          </div>

          {/* Commitment & Dedication */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Commitment & Dedication <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.commitmentDedication}
              onChange={(e) => handleChange('commitmentDedication', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border ${errors.commitmentDedication ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
              placeholder="Describe expected commitment and dedication"
            />
            {errors.commitmentDedication && <p className="mt-1 text-sm text-red-500">{errors.commitmentDedication}</p>}
          </div>

          {/* Workflow Navigation */}
          <WorkflowNavigation
            currentStep="tor"
            vacancyId={isEdit ? id : undefined}
            onSave={() => handleSubmit('save')}
            canProceed={formData.status === 'approved' || formData.status === 'draft'}
          />
        </div>
      </div>
    </div>
  );
};

// List Component
const ToRList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [records] = useState<ToRRecord[]>([]);

  const getStatusBadge = (status: ToRRecord['status']) => {
    const config = statusConfig[status];
    const colorClasses: Record<string, string> = {
      gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[config.color]}`}>
        {config.label}
      </span>
    );
  };

  const filteredRecords = records.filter(r =>
    r.positionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.vacancyNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Terms of Reference
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Form 1: Manage job requirements for vacancies
          </p>
        </div>
        <Link
          to="/hr/recruitment/terms-of-reference/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New ToR
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by vacancy #, position or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Vacancy #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Position Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    No Terms of Reference found
                  </p>
                  <Link
                    to="/hr/recruitment/terms-of-reference/new"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600"
                  >
                    <Plus className="h-4 w-4" />
                    Create New ToR
                  </Link>
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600 dark:text-primary-400">
                    {record.vacancyNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {record.positionTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {record.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {record.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/hr/recruitment/terms-of-reference/${record.id}`}
                        className="p-1 text-gray-500 hover:text-primary-500 transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/hr/recruitment/terms-of-reference/${record.id}/edit`}
                        className="p-1 text-gray-500 hover:text-primary-500 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      {record.status === 'approved' && (
                        <Link
                          to={`/hr/recruitment/staff-requisition/new?vacancy=${record.vacancyNumber}`}
                          className="p-1 text-green-500 hover:text-green-600 transition-colors"
                          title="Continue to SRF"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                      <button className="p-1 text-gray-500 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Component - conditionally renders Form or List
const TermsOfReference = () => {
  const { id } = useParams();
  const location = window.location.pathname;

  // If there's an id or 'new' in the URL, show the form
  if (id || location.endsWith('/new')) {
    return <ToRForm />;
  }

  // Otherwise show the list
  return <ToRList />;
};

export default TermsOfReference;
