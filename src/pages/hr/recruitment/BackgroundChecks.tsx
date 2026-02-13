import { useState } from 'react';
import {
  Plus,
  Search,
  FileText,
  ChevronLeft,
  Save,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Shield,
  Phone,
  Home,
  FileKey
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface BackgroundCheckData {
  // Candidate Info
  candidateName: string;
  positionApplied: string;
  vacancyNumber: string;
  nationality: string;
  passportIdNumber: string;

  // Form 16: Sanction Clearance
  sanctionCheck: {
    employeeDeclarationSigned: boolean;
    declarationDate: string;
    unSecurityCouncilIndividuals: 'pass' | 'fail' | 'pending';
    unSecurityCouncilEntities: 'pass' | 'fail' | 'pending';
    noAffiliationWithSanctioned: 'pass' | 'fail' | 'pending';
    verifiedByName: string;
    verifiedByPosition: string;
    verificationDate: string;
    remarks: string;
  };

  // Form 17: Reference Check
  references: Array<{
    id: string;
    referenceName: string;
    referencePosition: string;
    organization: string;
    contactNumber: string;
    email: string;
    relationshipToCandidate: string;
    durationKnown: string;
    workQualityRating: number;
    punctualityRating: number;
    teamworkRating: number;
    wouldRehire: boolean;
    integrityConcerns: boolean;
    reasonForLeaving: string;
    additionalComments: string;
    checkedBy: string;
    checkDate: string;
  }>;

  // Form 18: Guarantee Letter
  guaranteeLetter: {
    guarantor1Name: string;
    guarantor1FatherName: string;
    guarantor1Position: string;
    guarantor1TazkiraNumber: string;
    guarantor1Contact: string;
    guarantor1Verified: boolean;
    guarantor2Name: string;
    guarantor2FatherName: string;
    guarantor2Position: string;
    guarantor2TazkiraNumber: string;
    guarantor2Contact: string;
    guarantor2Verified: boolean;
    wakilGozarVerification: boolean;
  };

  // Form 19: Home Address Verification
  addressVerification: {
    currentAddress: string;
    houseStatus: 'rent' | 'mortgaged' | 'owned';
    verifiedByName: string;
    verifiedByPosition: string;
    verificationDate: string;
    observations: string;
    hrOfficerSignature: boolean;
  };

  // Form 20: Criminal Background Check
  criminalCheck: {
    preparedByName: string;
    preparedByDate: string;
    moiIstilamReference: string;
    moiResponseReceived: boolean;
    moiResponseDate: string;
    clearanceStatus: 'cleared' | 'not_cleared' | 'pending';
    remarks: string;
  };

  // Overall Status
  overallStatus: 'pending' | 'in_progress' | 'cleared' | 'failed';
  activeTab: 'sanction' | 'reference' | 'guarantee' | 'address' | 'criminal';
}

const BackgroundCheckForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<BackgroundCheckData>({
    candidateName: '',
    positionApplied: '',
    vacancyNumber: '',
    nationality: 'Afghan',
    passportIdNumber: '',
    sanctionCheck: {
      employeeDeclarationSigned: false,
      declarationDate: '',
      unSecurityCouncilIndividuals: 'pending',
      unSecurityCouncilEntities: 'pending',
      noAffiliationWithSanctioned: 'pending',
      verifiedByName: '',
      verifiedByPosition: 'HR Specialist',
      verificationDate: '',
      remarks: '',
    },
    references: [],
    guaranteeLetter: {
      guarantor1Name: '',
      guarantor1FatherName: '',
      guarantor1Position: '',
      guarantor1TazkiraNumber: '',
      guarantor1Contact: '',
      guarantor1Verified: false,
      guarantor2Name: '',
      guarantor2FatherName: '',
      guarantor2Position: '',
      guarantor2TazkiraNumber: '',
      guarantor2Contact: '',
      guarantor2Verified: false,
      wakilGozarVerification: false,
    },
    addressVerification: {
      currentAddress: '',
      houseStatus: 'rent',
      verifiedByName: '',
      verifiedByPosition: '',
      verificationDate: '',
      observations: '',
      hrOfficerSignature: false,
    },
    criminalCheck: {
      preparedByName: '',
      preparedByDate: '',
      moiIstilamReference: '',
      moiResponseReceived: false,
      moiResponseDate: '',
      clearanceStatus: 'pending',
      remarks: '',
    },
    overallStatus: 'pending',
    activeTab: 'sanction',
  });

  const handleChange = (field: string, value: unknown) => {
    const keys = field.split('.');
    if (keys.length === 1) {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...(prev[keys[0] as keyof BackgroundCheckData] as Record<string, unknown>),
          [keys[1]]: value,
        },
      }));
    }
  };

  const addReference = () => {
    const newRef = {
      id: Date.now().toString(),
      referenceName: '',
      referencePosition: '',
      organization: '',
      contactNumber: '',
      email: '',
      relationshipToCandidate: '',
      durationKnown: '',
      workQualityRating: 0,
      punctualityRating: 0,
      teamworkRating: 0,
      wouldRehire: false,
      integrityConcerns: false,
      reasonForLeaving: '',
      additionalComments: '',
      checkedBy: '',
      checkDate: '',
    };
    setFormData(prev => ({ ...prev, references: [...prev.references, newRef] }));
  };

  const updateReference = (id: string, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map(r => r.id === id ? { ...r, [field]: value } : r),
    }));
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    console.log('Saving Background Checks:', formData);
    navigate('/hr/recruitment/background-checks');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
      case 'cleared':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
      case 'not_cleared':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const tabs = [
    { key: 'sanction', label: 'Sanction Check', icon: Shield, form: '16' },
    { key: 'reference', label: 'Reference Check', icon: Phone, form: '17' },
    { key: 'guarantee', label: 'Guarantee Letter', icon: FileKey, form: '18' },
    { key: 'address', label: 'Address Verification', icon: Home, form: '19' },
    { key: 'criminal', label: 'Criminal Check', icon: Shield, form: '20' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/recruitment/background-checks"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Background Checks' : 'New Background Checks'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Forms 16-20: Pre-employment verification
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit('save')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
          <button
            onClick={() => handleSubmit('submit')}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            <Send className="h-4 w-4" />
            Complete Verification
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Candidate Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Candidate Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Candidate Name</label>
                <input
                  type="text"
                  value={formData.candidateName}
                  onChange={(e) => handleChange('candidateName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position Applied</label>
                <input
                  type="text"
                  value={formData.positionApplied}
                  onChange={(e) => handleChange('positionApplied', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Passport/ID Number</label>
                <input
                  type="text"
                  value={formData.passportIdNumber}
                  onChange={(e) => handleChange('passportIdNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleChange('activeTab', tab.key)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px flex items-center gap-2 ${
                      formData.activeTab === tab.key
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="text-xs text-gray-400">(F{tab.form})</span>
                  </button>
                );
              })}
            </div>

            {/* Sanction Check Tab */}
            {formData.activeTab === 'sanction' && (
              <div className="mt-4 space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Form 16: Sanction Clearance</h3>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.sanctionCheck.employeeDeclarationSigned}
                      onChange={(e) => handleChange('sanctionCheck.employeeDeclarationSigned', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500"
                    />
                    <span className="text-sm">Employee declaration signed</span>
                  </label>
                  {formData.sanctionCheck.employeeDeclarationSigned && (
                    <input
                      type="date"
                      value={formData.sanctionCheck.declarationDate}
                      onChange={(e) => handleChange('sanctionCheck.declarationDate', e.target.value)}
                      className="mt-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  )}
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'unSecurityCouncilIndividuals', label: 'Not on UN Security Council sanction list (individuals)' },
                    { key: 'unSecurityCouncilEntities', label: 'Not on UN Security Council sanction list (entities)' },
                    { key: 'noAffiliationWithSanctioned', label: 'No affiliation with sanctioned individuals/entities' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(formData.sanctionCheck[item.key as keyof typeof formData.sanctionCheck] as string)}
                        <select
                          value={formData.sanctionCheck[item.key as keyof typeof formData.sanctionCheck] as string}
                          onChange={(e) => handleChange(`sanctionCheck.${item.key}`, e.target.value)}
                          className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="pass">Pass</option>
                          <option value="fail">Fail</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Verified By (Name)"
                    value={formData.sanctionCheck.verifiedByName}
                    onChange={(e) => handleChange('sanctionCheck.verifiedByName', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={formData.sanctionCheck.verifiedByPosition}
                    onChange={(e) => handleChange('sanctionCheck.verifiedByPosition', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                  <input
                    type="date"
                    value={formData.sanctionCheck.verificationDate}
                    onChange={(e) => handleChange('sanctionCheck.verificationDate', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Reference Check Tab */}
            {formData.activeTab === 'reference' && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Form 17: Reference Checks</h3>
                  <button
                    onClick={addReference}
                    className="inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600"
                  >
                    <Plus className="h-4 w-4" /> Add Reference
                  </button>
                </div>

                {formData.references.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <Phone className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-sm text-gray-500">No references added. Click "Add Reference" to start.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.references.map((ref, index) => (
                      <div key={ref.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Reference #{index + 1}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                          <input
                            type="text"
                            placeholder="Reference Name"
                            value={ref.referenceName}
                            onChange={(e) => updateReference(ref.id, 'referenceName', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Position"
                            value={ref.referencePosition}
                            onChange={(e) => updateReference(ref.id, 'referencePosition', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Organization"
                            value={ref.organization}
                            onChange={(e) => updateReference(ref.id, 'organization', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                          />
                          <input
                            type="tel"
                            placeholder="Contact Number"
                            value={ref.contactNumber}
                            onChange={(e) => updateReference(ref.id, 'contactNumber', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            value={ref.email}
                            onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Relationship"
                            value={ref.relationshipToCandidate}
                            onChange={(e) => updateReference(ref.id, 'relationshipToCandidate', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={ref.wouldRehire}
                              onChange={(e) => updateReference(ref.id, 'wouldRehire', e.target.checked)}
                              className="rounded border-gray-300 text-green-500"
                            />
                            <span>Would rehire</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={ref.integrityConcerns}
                              onChange={(e) => updateReference(ref.id, 'integrityConcerns', e.target.checked)}
                              className="rounded border-gray-300 text-red-500"
                            />
                            <span>Integrity concerns</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Address Verification Tab */}
            {formData.activeTab === 'address' && (
              <div className="mt-4 space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Form 19: Home Address Verification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Home Address</label>
                    <textarea
                      value={formData.addressVerification.currentAddress}
                      onChange={(e) => handleChange('addressVerification.currentAddress', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">House Status</label>
                    <div className="flex gap-4">
                      {['rent', 'mortgaged', 'owned'].map(status => (
                        <label key={status} className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={formData.addressVerification.houseStatus === status}
                            onChange={() => handleChange('addressVerification.houseStatus', status)}
                            className="text-primary-500"
                          />
                          <span className="text-sm capitalize">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Verified By (Name)"
                    value={formData.addressVerification.verifiedByName}
                    onChange={(e) => handleChange('addressVerification.verifiedByName', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={formData.addressVerification.verifiedByPosition}
                    onChange={(e) => handleChange('addressVerification.verifiedByPosition', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                  <input
                    type="date"
                    value={formData.addressVerification.verificationDate}
                    onChange={(e) => handleChange('addressVerification.verificationDate', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.addressVerification.hrOfficerSignature}
                    onChange={(e) => handleChange('addressVerification.hrOfficerSignature', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500"
                  />
                  <span className="text-sm">HR Officer Signature & Stamp</span>
                </label>
              </div>
            )}

            {/* Criminal Check Tab */}
            {formData.activeTab === 'criminal' && (
              <div className="mt-4 space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Form 20: Criminal Background Check</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Prepared By (HR Officer)"
                    value={formData.criminalCheck.preparedByName}
                    onChange={(e) => handleChange('criminalCheck.preparedByName', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                  <input
                    type="date"
                    value={formData.criminalCheck.preparedByDate}
                    onChange={(e) => handleChange('criminalCheck.preparedByDate', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="MOI Istilam Reference Number"
                    value={formData.criminalCheck.moiIstilamReference}
                    onChange={(e) => handleChange('criminalCheck.moiIstilamReference', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Clearance Status</label>
                    <select
                      value={formData.criminalCheck.clearanceStatus}
                      onChange={(e) => handleChange('criminalCheck.clearanceStatus', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="cleared">Cleared</option>
                      <option value="not_cleared">Not Cleared</option>
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.criminalCheck.moiResponseReceived}
                    onChange={(e) => handleChange('criminalCheck.moiResponseReceived', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500"
                  />
                  <span className="text-sm">MOI Response Document Received</span>
                </label>
              </div>
            )}

            {/* Guarantee Letter Tab */}
            {formData.activeTab === 'guarantee' && (
              <div className="mt-4 space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Form 18: Guarantee Letter</h3>
                <p className="text-sm text-gray-500">Two guarantors required to vouch for the candidate.</p>

                {[1, 2].map(num => (
                  <div key={num} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Guarantor {num}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Name"
                        value={formData.guaranteeLetter[`guarantor${num}Name` as keyof typeof formData.guaranteeLetter] as string}
                        onChange={(e) => handleChange(`guaranteeLetter.guarantor${num}Name`, e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Father's Name"
                        value={formData.guaranteeLetter[`guarantor${num}FatherName` as keyof typeof formData.guaranteeLetter] as string}
                        onChange={(e) => handleChange(`guaranteeLetter.guarantor${num}FatherName`, e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Position & Organization"
                        value={formData.guaranteeLetter[`guarantor${num}Position` as keyof typeof formData.guaranteeLetter] as string}
                        onChange={(e) => handleChange(`guaranteeLetter.guarantor${num}Position`, e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Tazkira Number"
                        value={formData.guaranteeLetter[`guarantor${num}TazkiraNumber` as keyof typeof formData.guaranteeLetter] as string}
                        onChange={(e) => handleChange(`guaranteeLetter.guarantor${num}TazkiraNumber`, e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Contact Number"
                        value={formData.guaranteeLetter[`guarantor${num}Contact` as keyof typeof formData.guaranteeLetter] as string}
                        onChange={(e) => handleChange(`guaranteeLetter.guarantor${num}Contact`, e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.guaranteeLetter[`guarantor${num}Verified` as keyof typeof formData.guaranteeLetter] as boolean}
                          onChange={(e) => handleChange(`guaranteeLetter.guarantor${num}Verified`, e.target.checked)}
                          className="rounded border-gray-300 text-green-500"
                        />
                        <span className="text-sm">Verified</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const BackgroundCheckList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Background Checks</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Forms 16-20: Pre-employment verification</p>
        </div>
        <Link
          to="/hr/recruitment/background-checks/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Background Check
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by candidate..."
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
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Sanction</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Reference</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Criminal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600">No background checks found</p>
                <Link
                  to="/hr/recruitment/background-checks/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500"
                >
                  <Plus className="h-4 w-4" />
                  Start Background Check
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BackgroundChecks = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <BackgroundCheckForm />;
  return <BackgroundCheckList />;
};

export default BackgroundChecks;
