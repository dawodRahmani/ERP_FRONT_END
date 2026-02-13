import { useState } from 'react';
import {
  Plus,
  Search,
  FileText,
  ChevronLeft,
  Save,
  Send,
  Download,
  Printer,
  Mail
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface OfferLetterData {
  // Basic Info
  offerDate: string;
  vacancyNumber: string;
  // Candidate Info
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateAddress: string;
  // Position Details
  positionTitle: string;
  department: string;
  dutyStation: string;
  contractDuration: string;
  startDate: string;
  salary: number;
  currency: string;
  reportingLine: string;
  // Conditions
  conditions: string;
  // Acceptance
  acceptanceDeadline: string;
  candidateAccepted: boolean;
  candidateSignatureDate: string;
  candidateComments: string;
  // Status
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';
}

const OfferLetterForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<OfferLetterData>({
    offerDate: new Date().toISOString().split('T')[0],
    vacancyNumber: '',
    candidateName: '',
    candidateEmail: '',
    candidatePhone: '',
    candidateAddress: '',
    positionTitle: '',
    department: '',
    dutyStation: '',
    contractDuration: '12 months',
    startDate: '',
    salary: 0,
    currency: 'AFN',
    reportingLine: '',
    conditions: `1. Successful completion of background checks\n2. Submission of all required documents\n3. Medical fitness certification\n4. Signing of employment contract`,
    acceptanceDeadline: '',
    candidateAccepted: false,
    candidateSignatureDate: '',
    candidateComments: '',
    status: 'draft',
  });

  const handleChange = (field: keyof OfferLetterData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (action: 'save' | 'send') => {
    const dataToSave = {
      ...formData,
      status: action === 'send' ? 'sent' as const : 'draft' as const,
    };
    console.log('Saving Offer Letter:', dataToSave);
    navigate('/hr/recruitment/offer-letter');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/recruitment/offer-letter"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Offer Letter' : 'New Offer Letter'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 15: Formal job offer to selected candidate
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
            onClick={() => handleSubmit('send')}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            <Mail className="h-4 w-4" />
            Send Offer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <div className="p-6 space-y-6">
              {/* Candidate Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Candidate Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Candidate Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.candidateName}
                      onChange={(e) => handleChange('candidateName', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.candidateEmail}
                      onChange={(e) => handleChange('candidateEmail', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.candidatePhone}
                      onChange={(e) => handleChange('candidatePhone', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                    <input
                      type="text"
                      value={formData.candidateAddress}
                      onChange={(e) => handleChange('candidateAddress', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Position Details */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Position Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Position Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.positionTitle}
                      onChange={(e) => handleChange('positionTitle', e.target.value)}
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
                      Contract Duration <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contractDuration}
                      onChange={(e) => handleChange('contractDuration', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    />
                  </div>
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reporting To</label>
                    <input
                      type="text"
                      value={formData.reportingLine}
                      onChange={(e) => handleChange('reportingLine', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Salary <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={formData.salary || ''}
                        onChange={(e) => handleChange('salary', parseInt(e.target.value) || 0)}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Acceptance Deadline <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.acceptanceDeadline}
                      onChange={(e) => handleChange('acceptanceDeadline', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Conditions */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Conditions of Employment</h2>
                <textarea
                  value={formData.conditions}
                  onChange={(e) => handleChange('conditions', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>

              {/* Acceptance Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Candidate Response</h2>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.candidateAccepted}
                        onChange={(e) => handleChange('candidateAccepted', e.target.checked)}
                        className="rounded border-gray-300 text-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Candidate has accepted the offer
                      </span>
                    </label>
                    {formData.candidateAccepted && (
                      <input
                        type="date"
                        value={formData.candidateSignatureDate}
                        onChange={(e) => handleChange('candidateSignatureDate', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                        placeholder="Signature Date"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Candidate Comments
                    </label>
                    <textarea
                      value={formData.candidateComments}
                      onChange={(e) => handleChange('candidateComments', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm sticky top-6">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Letter Preview</h3>
            </div>
            <div className="p-4 text-xs text-gray-700 dark:text-gray-300 space-y-3">
              <p className="text-right">{formData.offerDate}</p>
              <p className="font-semibold">{formData.candidateName || '[Candidate Name]'}</p>
              <p>{formData.candidateAddress || '[Address]'}</p>
              <p className="font-semibold mt-4">Subject: Offer of Employment - {formData.positionTitle || '[Position]'}</p>
              <p>Dear {formData.candidateName || '[Candidate]'},</p>
              <p>
                We are pleased to offer you the position of <strong>{formData.positionTitle || '[Position]'}</strong> at
                Village Development Organization (VDO), based in <strong>{formData.dutyStation || '[Location]'}</strong>.
              </p>
              <p><strong>Start Date:</strong> {formData.startDate || '[Start Date]'}</p>
              <p><strong>Contract Duration:</strong> {formData.contractDuration || '[Duration]'}</p>
              <p><strong>Salary:</strong> {formData.salary ? `${formData.salary.toLocaleString()} ${formData.currency}` : '[Salary]'}</p>
              <p><strong>Reporting To:</strong> {formData.reportingLine || '[Supervisor]'}</p>
              <p className="mt-3">This offer is subject to:</p>
              <div className="whitespace-pre-line text-xs">{formData.conditions}</div>
              <p className="mt-3">
                Please confirm your acceptance by <strong>{formData.acceptanceDeadline || '[Deadline]'}</strong>.
              </p>
              <p className="mt-4">Sincerely,<br />HR Department<br />VDO</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OfferLetterList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800',
    expired: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Offer Letters</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 15: Manage job offers</p>
        </div>
        <Link
          to="/hr/recruitment/offer-letter/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Offer Letter
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by candidate or position..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600">No offer letters found</p>
                <Link
                  to="/hr/recruitment/offer-letter/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                >
                  <Plus className="h-4 w-4" />
                  Create Offer Letter
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OfferLetter = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <OfferLetterForm />;
  return <OfferLetterList />;
};

export default OfferLetter;
