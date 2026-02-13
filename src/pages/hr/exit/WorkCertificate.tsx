import { useState } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  Save,
  Send,
  Download,
  Printer,
  FileText,
  Eye,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ExitInfoBanner } from './components';

// ============================================================================
// TYPES
// ============================================================================

interface WorkCertificateData {
  // Employee Info
  id: string;
  employeeId: string;
  employeeName: string;
  fatherName: string;
  position: string;
  department: string;
  dutyStation: string;

  // Employment Details
  employmentStartDate: string;
  employmentEndDate: string;
  contractType: string;
  separationType: 'resignation' | 'end_of_contract' | 'termination' | 'transfer' | 'retirement';

  // Certificate Content
  dutiesSummary: string;
  performanceSummary: string;
  additionalRemarks: string;

  // Certificate Details
  certificateNumber: string;
  issueDate: string;
  issuedBy: string;
  issuedByPosition: string;

  // Status
  status: 'draft' | 'pending_approval' | 'approved' | 'issued';
}

// ============================================================================
// WORK CERTIFICATE FORM
// ============================================================================

const WorkCertificateForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<WorkCertificateData>({
    id: `CERT-${Date.now()}`,
    employeeId: '',
    employeeName: '',
    fatherName: '',
    position: '',
    department: '',
    dutyStation: '',
    employmentStartDate: '',
    employmentEndDate: '',
    contractType: '',
    separationType: 'resignation',
    dutiesSummary: '',
    performanceSummary: '',
    additionalRemarks: '',
    certificateNumber: `WC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    issueDate: new Date().toISOString().slice(0, 10),
    issuedBy: '',
    issuedByPosition: 'HR Department',
    status: 'draft',
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (action: 'save' | 'submit' | 'issue') => {
    console.log('Saving Work Certificate:', formData);
    navigate('/hr/exit/certificate');
  };

  const separationTypes = [
    { value: 'resignation', label: 'Resignation' },
    { value: 'end_of_contract', label: 'End of Contract' },
    { value: 'termination', label: 'Termination' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'retirement', label: 'Retirement' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/exit/certificate"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Work Certificate' : 'Issue Work Certificate'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 43: Employment verification letter
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={() => handleSubmit('save')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit('issue')}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            <Send className="h-4 w-4" />
            Issue Certificate
          </button>
        </div>
      </div>

      <ExitInfoBanner
        title="Form 43: Work Certificate"
        description="Issue employment verification letter for departing employees. This document confirms employment history and duties."
      />

      {showPreview ? (
        // Certificate Preview
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-white text-center">
            <h2 className="text-2xl font-bold">VDO Afghanistan</h2>
            <p className="text-orange-100 text-sm mt-1">Village Development Organization</p>
            <p className="text-xl font-semibold mt-4">WORK CERTIFICATE</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
              <p>Certificate No: {formData.certificateNumber}</p>
              <p>Date: {formData.issueDate}</p>
            </div>

            <div className="text-center mb-6">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">TO WHOM IT MAY CONCERN</p>
            </div>

            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                This is to certify that <strong>{formData.employeeName || '[Employee Name]'}</strong>
                {formData.fatherName && <>, son/daughter of <strong>{formData.fatherName}</strong></>},
                was employed by VDO Afghanistan as <strong>{formData.position || '[Position]'}</strong> in the{' '}
                <strong>{formData.department || '[Department]'}</strong> department
                {formData.dutyStation && <> at <strong>{formData.dutyStation}</strong></>}.
              </p>

              <p className="mt-4">
                Employment Period: <strong>{formData.employmentStartDate || '[Start Date]'}</strong> to{' '}
                <strong>{formData.employmentEndDate || '[End Date]'}</strong>
              </p>

              {formData.dutiesSummary && (
                <div className="mt-4">
                  <p><strong>Summary of Duties:</strong></p>
                  <p>{formData.dutiesSummary}</p>
                </div>
              )}

              {formData.performanceSummary && (
                <div className="mt-4">
                  <p><strong>Performance Summary:</strong></p>
                  <p>{formData.performanceSummary}</p>
                </div>
              )}

              {formData.additionalRemarks && (
                <div className="mt-4">
                  <p>{formData.additionalRemarks}</p>
                </div>
              )}

              <p className="mt-6">
                We wish {formData.employeeName || 'the employee'} all the best in their future endeavors.
              </p>
            </div>

            {/* Signature */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Issued By:</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-2">{formData.issuedBy || '_______________'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formData.issuedByPosition}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Authorized Signature & Stamp</p>
                  <div className="mt-2 w-32 h-16 border border-dashed border-gray-300 dark:border-gray-600 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <p>VDO Afghanistan - Kabul Office</p>
              <p>Contact: hr@vdo.org.af</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-8 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>
      ) : (
        // Edit Form
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="p-6 space-y-6">
            {/* Employee Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Employee Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => handleChange('employeeId', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.employeeName}
                    onChange={(e) => handleChange('employeeName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => handleChange('fatherName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position *</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleChange('position', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  >
                    <option value="">Select Department</option>
                    <option value="Program">Program</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">Human Resources</option>
                    <option value="Operations">Operations</option>
                    <option value="Admin">Administration</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duty Station</label>
                  <input
                    type="text"
                    value={formData.dutyStation}
                    onChange={(e) => handleChange('dutyStation', e.target.value)}
                    placeholder="e.g., Kabul Office"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Employment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={formData.employmentStartDate}
                    onChange={(e) => handleChange('employmentStartDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date *</label>
                  <input
                    type="date"
                    value={formData.employmentEndDate}
                    onChange={(e) => handleChange('employmentEndDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contract Type</label>
                  <select
                    value={formData.contractType}
                    onChange={(e) => handleChange('contractType', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  >
                    <option value="">Select Type</option>
                    <option value="Core">Core (Permanent)</option>
                    <option value="Project">Project</option>
                    <option value="Consultant">Consultant</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Separation Type</label>
                  <select
                    value={formData.separationType}
                    onChange={(e) => handleChange('separationType', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  >
                    {separationTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Certificate Content */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Certificate Content</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary of Duties</label>
                  <textarea
                    value={formData.dutiesSummary}
                    onChange={(e) => handleChange('dutiesSummary', e.target.value)}
                    rows={3}
                    placeholder="Brief description of main responsibilities and duties..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Performance Summary</label>
                  <textarea
                    value={formData.performanceSummary}
                    onChange={(e) => handleChange('performanceSummary', e.target.value)}
                    rows={3}
                    placeholder="Summary of employee's performance during their tenure..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Remarks</label>
                  <textarea
                    value={formData.additionalRemarks}
                    onChange={(e) => handleChange('additionalRemarks', e.target.value)}
                    rows={2}
                    placeholder="Any additional comments or remarks..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Issue Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Issue Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Certificate Number</label>
                  <input
                    type="text"
                    value={formData.certificateNumber}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => handleChange('issueDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issued By</label>
                  <input
                    type="text"
                    value={formData.issuedBy}
                    onChange={(e) => handleChange('issuedBy', e.target.value)}
                    placeholder="HR Officer Name"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
                  <input
                    type="text"
                    value={formData.issuedByPosition}
                    onChange={(e) => handleChange('issuedByPosition', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// WORK CERTIFICATE LIST
// ============================================================================

const WorkCertificateList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const certificates = [
    { id: '1', certNumber: 'WC-2024-001', employeeName: 'Nawid Stanikzai', position: 'Driver', department: 'Admin', issueDate: '2024-02-05', status: 'Issued' },
    { id: '2', certNumber: 'WC-2024-002', employeeName: 'Zahra Mohammadi', position: 'HR Officer', department: 'HR', issueDate: '2024-01-31', status: 'Issued' },
    { id: '3', certNumber: 'WC-2024-003', employeeName: 'Rahmatullah Ahmadi', position: 'Field Officer', department: 'Operations', issueDate: '', status: 'Draft' },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'Pending Approval': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      Approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      Issued: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };
    return styles[status] || styles.Draft;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Work Certificates</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 43: Employment verification letters</p>
        </div>
        <Link
          to="/hr/exit/certificate/new"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          Issue Certificate
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or certificate number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificate #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {certificates.map((cert) => (
              <tr key={cert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{cert.certNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{cert.employeeName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{cert.position}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{cert.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{cert.issueDate || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(cert.status)}`}>
                    {cert.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/hr/exit/certificate/${cert.id}`)}
                      className="p-1.5 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" title="Download">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" title="Print">
                      <Printer className="h-4 w-4" />
                    </button>
                  </div>
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

const WorkCertificate = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <WorkCertificateForm />;
  return <WorkCertificateList />;
};

export default WorkCertificate;
