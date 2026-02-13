import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Search, Filter } from 'lucide-react';

interface RatingArea {
  name: string;
  description: string;
  rating: number;
  comments: string;
}

interface AssessmentData {
  employeeName: string;
  position: string;
  department: string;
  supervisor: string;
  assessmentDate: string;
  corePerformance: RatingArea[];
  zeroTolerance: RatingArea[];
  orgCompetencies: RatingArea[];
  trainingRecommendations: string;
  priorityAreas: string;
  timeline: string;
  additionalComments: string;
}

const defaultCorePerformance: RatingArea[] = [
  { name: 'Job Knowledge & Technical Skills', description: 'Understanding of job requirements and technical proficiency', rating: 0, comments: '' },
  { name: 'Quality of Work', description: 'Accuracy, thoroughness, and reliability of work output', rating: 0, comments: '' },
  { name: 'Productivity & Efficiency', description: 'Volume of work and efficient use of time/resources', rating: 0, comments: '' },
  { name: 'Field Management', description: 'Ability to manage field operations effectively', rating: 0, comments: '' },
  { name: 'Proficiency in Local Languages', description: 'Dari and Pashto language skills', rating: 0, comments: '' },
  { name: 'Proficiency in English', description: 'English language proficiency', rating: 0, comments: '' },
  { name: 'Communication Skills', description: 'Written and verbal communication abilities', rating: 0, comments: '' },
  { name: 'Teamwork & Collaboration', description: 'Ability to work effectively with others', rating: 0, comments: '' },
  { name: 'Initiative, Judgment & Creativity', description: 'Proactive approach and problem-solving', rating: 0, comments: '' },
  { name: 'Public Relations', description: 'External stakeholder engagement skills', rating: 0, comments: '' },
  { name: 'Attendance & Punctuality', description: 'Regularity and timeliness', rating: 0, comments: '' },
  { name: 'Adaptability & Learning', description: 'Flexibility and willingness to learn', rating: 0, comments: '' },
  { name: 'Overall Performance', description: 'General work performance assessment', rating: 0, comments: '' },
];

const defaultZeroTolerance: RatingArea[] = [
  { name: 'AAP - Accountability to Affected Populations', description: 'Commitment to beneficiary accountability', rating: 0, comments: '' },
  { name: 'PSEAH Compliance', description: 'Prevention of Sexual Exploitation, Abuse and Harassment', rating: 0, comments: '' },
  { name: 'Safeguarding', description: 'Protection of vulnerable populations', rating: 0, comments: '' },
  { name: 'Child Protection', description: 'Child safety and protection standards', rating: 0, comments: '' },
  { name: 'Code of Conduct Compliance', description: 'Adherence to organizational code of conduct', rating: 0, comments: '' },
  { name: 'Confidentiality & Data Privacy', description: 'Protection of sensitive information', rating: 0, comments: '' },
];

const defaultOrgCompetencies: RatingArea[] = [
  { name: 'Compliance & Policy Adherence', description: 'Following organizational policies', rating: 0, comments: '' },
  { name: 'Conflict Management', description: 'Ability to resolve disputes effectively', rating: 0, comments: '' },
  { name: 'Expertise & Professional Competence', description: 'Professional knowledge and skills', rating: 0, comments: '' },
  { name: 'Commitment to Role & Organization', description: 'Dedication and organizational loyalty', rating: 0, comments: '' },
  { name: 'Contribution to Sustainability', description: 'Efforts toward organizational sustainability', rating: 0, comments: '' },
  { name: 'Communication & Behavior', description: 'Professional conduct and communication', rating: 0, comments: '' },
];

// List Component
const AssessmentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const assessments = [
    { id: '1', employeeName: 'Ahmad Ahmadi', position: 'Project Officer', department: 'Programs', assessmentDate: '2024-01-15', totalScore: 45, result: 'Regular trainings required' },
    { id: '2', employeeName: 'Fatima Rahimi', position: 'Finance Assistant', department: 'Finance', assessmentDate: '2024-01-10', totalScore: 28, result: 'Targeted training needed' },
    { id: '3', employeeName: 'Mohammad Karimi', position: 'Field Coordinator', department: 'Operations', assessmentDate: '2024-01-08', totalScore: 52, result: 'Regular trainings required' },
  ];

  const getResultBadge = (result: string) => {
    if (result.includes('Complete')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    if (result.includes('Targeted')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Training Needs Assessments</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 29: Assess employee training needs</p>
        </div>
        <Link to="/hr/training/needs-assessment/new" className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> New Assessment
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by employee name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Departments</option>
                <option value="Programs">Programs</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="HR">HR</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Position</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Result</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {assessments.map((assessment) => (
                <tr key={assessment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{assessment.employeeName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{assessment.position}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{assessment.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{assessment.assessmentDate}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{assessment.totalScore}/60</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultBadge(assessment.result)}`}>
                      {assessment.result}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/hr/training/needs-assessment/${assessment.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Link to="/hr/training" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700">
        <ArrowLeft className="h-4 w-4" /> Back to Training Dashboard
      </Link>
    </div>
  );
};

// Form Component
const AssessmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<AssessmentData>({
    employeeName: '',
    position: '',
    department: '',
    supervisor: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    corePerformance: defaultCorePerformance,
    zeroTolerance: defaultZeroTolerance,
    orgCompetencies: defaultOrgCompetencies,
    trainingRecommendations: '',
    priorityAreas: '',
    timeline: '',
    additionalComments: '',
  });

  const [activeTab, setActiveTab] = useState('employee');

  const updateRating = (section: 'corePerformance' | 'zeroTolerance' | 'orgCompetencies', index: number, field: 'rating' | 'comments', value: number | string) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const calculateSectionScore = (section: RatingArea[]) => {
    return section.reduce((sum, item) => sum + item.rating, 0);
  };

  const totalScore = calculateSectionScore(formData.corePerformance) +
                     calculateSectionScore(formData.zeroTolerance) +
                     calculateSectionScore(formData.orgCompetencies);

  const getResult = (score: number) => {
    if (score <= 20) return { text: 'Complete training required', color: 'text-red-600' };
    if (score <= 40) return { text: 'Targeted training in specific areas', color: 'text-yellow-600' };
    return { text: 'Regular trainings required', color: 'text-green-600' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving assessment:', formData);
    navigate('/hr/training/needs-assessment');
  };

  const tabs = [
    { id: 'employee', label: 'Employee Info' },
    { id: 'core', label: 'Core Performance' },
    { id: 'compliance', label: 'Zero Tolerance' },
    { id: 'competencies', label: 'Competencies' },
    { id: 'action', label: 'Action Plan' },
  ];

  const RatingTable = ({ section, sectionKey }: { section: RatingArea[], sectionKey: 'corePerformance' | 'zeroTolerance' | 'orgCompetencies' }) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Evaluation Area</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-32">Rating (1-5)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Comments</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {section.map((item, index) => (
            <tr key={item.name}>
              <td className="px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => updateRating(sectionKey, index, 'rating', rating)}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                        item.rating === rating
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={item.comments}
                  onChange={(e) => updateRating(sectionKey, index, 'comments', e.target.value)}
                  placeholder="Add comments..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Section Score: {calculateSectionScore(section)} / {section.length * 5}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/hr/training/needs-assessment" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNew ? 'New Training Needs Assessment' : 'Edit Training Needs Assessment'}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 29: Assess employee training needs</p>
        </div>
      </div>

      {/* Score Summary */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Score</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalScore} / 125</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Assessment Result</p>
            <p className={`text-lg font-semibold ${getResult(totalScore).color}`}>{getResult(totalScore).text}</p>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Rating Scale: 1 = Needs Training, 5 = Expert
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          {/* Employee Info Tab */}
          {activeTab === 'employee' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Employee Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Employee Name *</label>
                  <input
                    type="text"
                    value={formData.employeeName}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position *</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Programs">Programs</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="HR">Human Resources</option>
                    <option value="Admin">Administration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Supervisor *</label>
                  <input
                    type="text"
                    value={formData.supervisor}
                    onChange={(e) => setFormData(prev => ({ ...prev, supervisor: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assessment Date *</label>
                  <input
                    type="date"
                    value={formData.assessmentDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, assessmentDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Core Performance Tab */}
          {activeTab === 'core' && (
            <div>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Section 1: Core Job Performance</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Evaluate the employee's core job-related competencies</p>
              </div>
              <RatingTable section={formData.corePerformance} sectionKey="corePerformance" />
            </div>
          )}

          {/* Zero Tolerance Tab */}
          {activeTab === 'compliance' && (
            <div>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Section 2: Zero Tolerance Compliance</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Evaluate compliance with organizational zero-tolerance policies</p>
              </div>
              <RatingTable section={formData.zeroTolerance} sectionKey="zeroTolerance" />
            </div>
          )}

          {/* Competencies Tab */}
          {activeTab === 'competencies' && (
            <div>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Section 3: Organizational Competencies</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Evaluate organizational and professional competencies</p>
              </div>
              <RatingTable section={formData.orgCompetencies} sectionKey="orgCompetencies" />
            </div>
          )}

          {/* Action Plan Tab */}
          {activeTab === 'action' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Action Plan</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Training Recommendations</label>
                <textarea
                  value={formData.trainingRecommendations}
                  onChange={(e) => setFormData(prev => ({ ...prev, trainingRecommendations: e.target.value }))}
                  rows={4}
                  placeholder="List recommended training programs based on the assessment..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority Areas</label>
                <textarea
                  value={formData.priorityAreas}
                  onChange={(e) => setFormData(prev => ({ ...prev, priorityAreas: e.target.value }))}
                  rows={3}
                  placeholder="Identify priority areas that need immediate attention..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timeline</label>
                <input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                  placeholder="e.g., Q1 2024, Within 3 months"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Comments</label>
                <textarea
                  value={formData.additionalComments}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalComments: e.target.value }))}
                  rows={3}
                  placeholder="Any additional observations or comments..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Link to="/hr/training/needs-assessment" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </Link>
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Save className="h-4 w-4" />
            Save Assessment
          </button>
        </div>
      </form>
    </div>
  );
};

// Main Component
const TrainingNeedsAssessment = () => {
  const { id } = useParams();
  return id ? <AssessmentForm /> : <AssessmentList />;
};

export default TrainingNeedsAssessment;
