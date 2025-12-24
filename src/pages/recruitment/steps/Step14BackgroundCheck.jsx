import { useState, useEffect, useRef } from 'react';
import {
  ClipboardCheck,
  UserCheck,
  FileCheck,
  MapPin,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Plus,
  Phone,
  Mail,
  Building,
  Edit3,
  X as XIcon,
  Upload,
  Paperclip,
  File,
  FileText,
  Image,
  Download,
  Trash2,
  Eye,
} from 'lucide-react';
import { backgroundCheckDB, sanctionDB } from '../../../services/db/recruitmentService';

const Step14BackgroundCheck = ({ recruitment, onAdvance, isCurrentStep }) => {
  const [backgroundCheck, setBackgroundCheck] = useState(null);
  const [sanction, setSanction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('references');
  const [editMode, setEditMode] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const fileInputRef = useRef(null);

  const canEdit = editMode || isCurrentStep;
  const showEditButton = !isCurrentStep && !editMode;

  useEffect(() => {
    const load = async () => {
      try {
        const existingSanction = await sanctionDB.getByRecruitmentId(recruitment.id);
        setSanction(existingSanction);

        let existing = await backgroundCheckDB.getByRecruitmentId(recruitment.id);
        if (!existing && existingSanction?.status === 'cleared') {
          existing = await backgroundCheckDB.create({
            recruitmentId: recruitment.id,
            candidateApplicationId: existingSanction.candidateApplicationId,
            references: [],
            guaranteeLetter: {
              guarantorName: '',
              guarantorNationalId: '',
              relationship: '',
              phone: '',
              address: '',
              status: 'pending',
            },
            homeAddress: {
              province: '',
              district: '',
              village: '',
              verificationStatus: 'pending',
              verifiedBy: '',
              verificationDate: '',
            },
            criminalCheck: {
              status: 'pending',
              checkedBy: '',
              checkedDate: '',
              notes: '',
            },
            attachments: [],
          });
        }
        // Ensure attachments array exists for existing records
        if (existing && !existing.attachments) {
          existing.attachments = [];
        }
        setBackgroundCheck(existing);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [recruitment.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await backgroundCheckDB.update(backgroundCheck.id, backgroundCheck);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addReference = () => {
    setBackgroundCheck(prev => ({
      ...prev,
      references: [
        ...(prev.references || []),
        {
          id: Date.now(),
          name: '',
          organization: '',
          position: '',
          phone: '',
          email: '',
          relationship: '',
          status: 'pending',
          feedback: '',
        },
      ],
    }));
  };

  const updateReference = (id, field, value) => {
    setBackgroundCheck(prev => ({
      ...prev,
      references: (prev.references || []).map(ref => (ref.id === id ? { ...ref, [field]: value } : ref)),
    }));
  };

  const removeReference = (id) => {
    setBackgroundCheck(prev => ({
      ...prev,
      references: (prev.references || []).filter(ref => ref.id !== id),
    }));
  };

  const updateGuarantee = (field, value) => {
    setBackgroundCheck(prev => ({
      ...prev,
      guaranteeLetter: { ...(prev.guaranteeLetter || {}), [field]: value },
    }));
  };

  const updateHomeAddress = (field, value) => {
    setBackgroundCheck(prev => ({
      ...prev,
      homeAddress: { ...(prev.homeAddress || {}), [field]: value },
    }));
  };

  const updateCriminalCheck = (field, value) => {
    setBackgroundCheck(prev => ({
      ...prev,
      criminalCheck: { ...(prev.criminalCheck || {}), [field]: value },
    }));
  };

  // File handling functions
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    const maxSize = 10 * 1024 * 1024; // 10MB max
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const newAttachments = [];

    for (const file of files) {
      if (file.size > maxSize) {
        setError(`File "${file.name}" exceeds 10MB limit`);
        continue;
      }

      if (!allowedTypes.includes(file.type)) {
        setError(`File type "${file.type}" is not allowed`);
        continue;
      }

      // Convert file to base64
      const base64 = await fileToBase64(file);

      newAttachments.push({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        data: base64,
        uploadedAt: new Date().toISOString(),
        category: 'general',
      });
    }

    if (newAttachments.length > 0) {
      setBackgroundCheck(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...newAttachments],
      }));
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const removeAttachment = (id) => {
    setBackgroundCheck(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter(att => att.id !== id),
    }));
  };

  const updateAttachmentCategory = (id, category) => {
    setBackgroundCheck(prev => ({
      ...prev,
      attachments: (prev.attachments || []).map(att =>
        att.id === id ? { ...att, category } : att
      ),
    }));
  };

  const downloadAttachment = (attachment) => {
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return Image;
    if (type === 'application/pdf') return FileText;
    return File;
  };

  const handleComplete = async () => {
    // Check if all checks are completed
    const refsComplete = backgroundCheck.references?.length >= 2 &&
      backgroundCheck.references?.every(r => r.status === 'verified');
    const guaranteeComplete = backgroundCheck.guaranteeLetter?.status === 'verified';
    const addressComplete = backgroundCheck.homeAddress?.verificationStatus === 'verified';
    const criminalComplete = backgroundCheck.criminalCheck?.status === 'cleared';

    if (!refsComplete || !guaranteeComplete || !addressComplete || !criminalComplete) {
      setError('All background checks must be completed and verified before proceeding.');
      return;
    }

    setSaving(true);
    try {
      await backgroundCheckDB.complete(backgroundCheck.id);
      const updated = await backgroundCheckDB.getByRecruitmentId(recruitment.id);
      setBackgroundCheck(updated);
      if (onAdvance) await onAdvance();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!sanction || sanction.status !== 'cleared') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-500" />
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-300">Sanction Check Required</h3>
              <p className="text-yellow-700 dark:text-yellow-400">
                Please complete the sanction clearance check before proceeding with background verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'references', name: 'Reference Checks', icon: UserCheck, count: backgroundCheck?.references?.length || 0 },
    { id: 'guarantee', name: 'Guarantee Letter', icon: FileCheck },
    { id: 'address', name: 'Address Verification', icon: MapPin },
    { id: 'criminal', name: 'Criminal Check', icon: Shield },
    { id: 'attachments', name: 'Attachments', icon: Paperclip, count: backgroundCheck?.attachments?.length || 0 },
  ];

  const getCheckStatus = () => {
    if (!backgroundCheck) return 'pending';
    const refsComplete = backgroundCheck.references?.length >= 2 &&
      backgroundCheck.references?.every(r => r.status === 'verified');
    const guaranteeComplete = backgroundCheck.guaranteeLetter?.status === 'verified';
    const addressComplete = backgroundCheck.homeAddress?.verificationStatus === 'verified';
    const criminalComplete = backgroundCheck.criminalCheck?.status === 'cleared';

    if (refsComplete && guaranteeComplete && addressComplete && criminalComplete) {
      return 'completed';
    }
    return 'in_progress';
  };

  const status = backgroundCheck?.status || getCheckStatus();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
              <ClipboardCheck className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Background Verification</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Complete all background checks before contract</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showEditButton && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Enable Editing
              </button>
            )}
            {editMode && (
              <button
                onClick={() => setEditMode(false)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <XIcon className="w-4 h-4" />
                Cancel Edit
              </button>
            )}
            <span className={`px-3 py-1 rounded-full text-sm ${
              status === 'completed' ? 'bg-green-100 text-green-700' :
              status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {status}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 dark:text-red-400">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">×</button>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
                {tab.count !== undefined && (
                  <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">{tab.count}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Reference Checks Tab */}
          {activeTab === 'references' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">Minimum 2 professional references required</p>
                <button
                  onClick={addReference}
                  className="flex items-center gap-1 text-sm text-teal-600 dark:text-teal-400 hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add Reference
                </button>
              </div>

              {backgroundCheck?.references?.map((ref, index) => (
                <div key={ref.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reference #{index + 1}</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={ref.status}
                        onChange={(e) => updateReference(ref.id, 'status', e.target.value)}
                        className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="verified">Verified</option>
                        <option value="failed">Failed</option>
                      </select>
                      <button
                        onClick={() => removeReference(ref.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Name</label>
                      <input
                        type="text"
                        value={ref.name}
                        onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Organization</label>
                      <input
                        type="text"
                        value={ref.organization}
                        onChange={(e) => updateReference(ref.id, 'organization', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Position</label>
                      <input
                        type="text"
                        value={ref.position}
                        onChange={(e) => updateReference(ref.id, 'position', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <input
                        type="tel"
                        value={ref.phone}
                        onChange={(e) => updateReference(ref.id, 'phone', e.target.value)}
                        placeholder="Phone"
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <input
                        type="email"
                        value={ref.email}
                        onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                        placeholder="Email"
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Relationship</label>
                      <input
                        type="text"
                        value={ref.relationship}
                        onChange={(e) => updateReference(ref.id, 'relationship', e.target.value)}
                        placeholder="e.g., Former Supervisor"
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs text-gray-500 mb-1">Feedback / Notes</label>
                    <textarea
                      value={ref.feedback}
                      onChange={(e) => updateReference(ref.id, 'feedback', e.target.value)}
                      rows={2}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              ))}

              {backgroundCheck?.references?.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No references added yet</p>
                </div>
              )}
            </div>
          )}

          {/* Guarantee Letter Tab */}
          {activeTab === 'guarantee' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Guarantor information for employment</p>
                <select
                  value={backgroundCheck?.guaranteeLetter?.status || 'pending'}
                  onChange={(e) => updateGuarantee('status', e.target.value)}
                  className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="received">Received</option>
                  <option value="verified">Verified</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guarantor Name</label>
                  <input
                    type="text"
                    value={backgroundCheck?.guaranteeLetter?.guarantorName || ''}
                    onChange={(e) => updateGuarantee('guarantorName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">National ID</label>
                  <input
                    type="text"
                    value={backgroundCheck?.guaranteeLetter?.guarantorNationalId || ''}
                    onChange={(e) => updateGuarantee('guarantorNationalId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Relationship</label>
                  <select
                    value={backgroundCheck?.guaranteeLetter?.relationship || ''}
                    onChange={(e) => updateGuarantee('relationship', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select...</option>
                    <option value="family">Family Member</option>
                    <option value="friend">Friend</option>
                    <option value="colleague">Former Colleague</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={backgroundCheck?.guaranteeLetter?.phone || ''}
                    onChange={(e) => updateGuarantee('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <textarea
                  value={backgroundCheck?.guaranteeLetter?.address || ''}
                  onChange={(e) => updateGuarantee('address', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Address Verification Tab */}
          {activeTab === 'address' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Home address verification details</p>
                <select
                  value={backgroundCheck?.homeAddress?.verificationStatus || 'pending'}
                  onChange={(e) => updateHomeAddress('verificationStatus', e.target.value)}
                  className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="verified">Verified</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Province</label>
                  <input
                    type="text"
                    value={backgroundCheck?.homeAddress?.province || ''}
                    onChange={(e) => updateHomeAddress('province', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">District</label>
                  <input
                    type="text"
                    value={backgroundCheck?.homeAddress?.district || ''}
                    onChange={(e) => updateHomeAddress('district', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Village/Area</label>
                  <input
                    type="text"
                    value={backgroundCheck?.homeAddress?.village || ''}
                    onChange={(e) => updateHomeAddress('village', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Verified By</label>
                  <input
                    type="text"
                    value={backgroundCheck?.homeAddress?.verifiedBy || ''}
                    onChange={(e) => updateHomeAddress('verifiedBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Verification Date</label>
                  <input
                    type="date"
                    value={backgroundCheck?.homeAddress?.verificationDate || ''}
                    onChange={(e) => updateHomeAddress('verificationDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Criminal Check Tab */}
          {activeTab === 'criminal' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Criminal record verification</p>
                <select
                  value={backgroundCheck?.criminalCheck?.status || 'pending'}
                  onChange={(e) => updateCriminalCheck('status', e.target.value)}
                  className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="cleared">Cleared</option>
                  <option value="flagged">Flagged</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Checked By</label>
                  <input
                    type="text"
                    value={backgroundCheck?.criminalCheck?.checkedBy || ''}
                    onChange={(e) => updateCriminalCheck('checkedBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check Date</label>
                  <input
                    type="date"
                    value={backgroundCheck?.criminalCheck?.checkedDate || ''}
                    onChange={(e) => updateCriminalCheck('checkedDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea
                  value={backgroundCheck?.criminalCheck?.notes || ''}
                  onChange={(e) => updateCriminalCheck('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Any additional notes from the criminal background check..."
                />
              </div>

              {backgroundCheck?.criminalCheck?.status === 'cleared' && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-700 dark:text-green-400">Criminal background check cleared</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Attachments Tab */}
          {activeTab === 'attachments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Upload supporting documents (PDF, Images, Word documents - max 10MB each)
                </p>
              </div>

              {/* Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className={`w-10 h-10 mx-auto mb-3 ${dragActive ? 'text-teal-500' : 'text-gray-400'}`} />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-teal-600 dark:text-teal-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  PDF, JPG, PNG, GIF, DOC, DOCX (max 10MB)
                </p>
              </div>

              {/* Attachment Categories */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Document Categories</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">Reference Letters</span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">Guarantee Documents</span>
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">ID/Address Proof</span>
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded">Police Clearance</span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">Other</span>
                </div>
              </div>

              {/* Attachments List */}
              {backgroundCheck?.attachments?.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Uploaded Files ({backgroundCheck.attachments.length})
                  </h4>
                  {backgroundCheck.attachments.map((attachment) => {
                    const FileIcon = getFileIcon(attachment.type);
                    return (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`p-2 rounded-lg ${
                            attachment.type.startsWith('image/')
                              ? 'bg-purple-100 dark:bg-purple-900/30'
                              : attachment.type === 'application/pdf'
                              ? 'bg-red-100 dark:bg-red-900/30'
                              : 'bg-blue-100 dark:bg-blue-900/30'
                          }`}>
                            <FileIcon className={`w-5 h-5 ${
                              attachment.type.startsWith('image/')
                                ? 'text-purple-600 dark:text-purple-400'
                                : attachment.type === 'application/pdf'
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-blue-600 dark:text-blue-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {attachment.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatFileSize(attachment.size)} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <select
                            value={attachment.category || 'general'}
                            onChange={(e) => updateAttachmentCategory(attachment.id, e.target.value)}
                            className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            <option value="general">General</option>
                            <option value="reference">Reference Letter</option>
                            <option value="guarantee">Guarantee Document</option>
                            <option value="id_proof">ID/Address Proof</option>
                            <option value="police_clearance">Police Clearance</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-1 ml-3">
                          {attachment.type.startsWith('image/') && (
                            <button
                              onClick={() => setPreviewFile(attachment)}
                              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => downloadAttachment(attachment)}
                            className="p-2 text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeAttachment(attachment.id)}
                            className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Paperclip className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No attachments uploaded yet</p>
                  <p className="text-xs mt-1">Upload reference letters, guarantee documents, ID proofs, etc.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setPreviewFile(null)}>
          <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewFile(null)}
              className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <XIcon className="w-5 h-5" />
            </button>
            <img
              src={previewFile.data}
              alt={previewFile.name}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-xl"
            />
            <p className="text-center text-white mt-2">{previewFile.name}</p>
          </div>
        </div>
      )}

      {/* Progress Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Verification Progress</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className={`p-3 rounded-lg text-center ${
            backgroundCheck?.references?.length >= 2 && backgroundCheck?.references?.every(r => r.status === 'verified')
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-gray-50 dark:bg-gray-700'
          }`}>
            <UserCheck className={`w-6 h-6 mx-auto mb-1 ${
              backgroundCheck?.references?.length >= 2 && backgroundCheck?.references?.every(r => r.status === 'verified')
                ? 'text-green-500'
                : 'text-gray-400'
            }`} />
            <span className="text-xs">References</span>
          </div>
          <div className={`p-3 rounded-lg text-center ${
            backgroundCheck?.guaranteeLetter?.status === 'verified'
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-gray-50 dark:bg-gray-700'
          }`}>
            <FileCheck className={`w-6 h-6 mx-auto mb-1 ${
              backgroundCheck?.guaranteeLetter?.status === 'verified' ? 'text-green-500' : 'text-gray-400'
            }`} />
            <span className="text-xs">Guarantee</span>
          </div>
          <div className={`p-3 rounded-lg text-center ${
            backgroundCheck?.homeAddress?.verificationStatus === 'verified'
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-gray-50 dark:bg-gray-700'
          }`}>
            <MapPin className={`w-6 h-6 mx-auto mb-1 ${
              backgroundCheck?.homeAddress?.verificationStatus === 'verified' ? 'text-green-500' : 'text-gray-400'
            }`} />
            <span className="text-xs">Address</span>
          </div>
          <div className={`p-3 rounded-lg text-center ${
            backgroundCheck?.criminalCheck?.status === 'cleared'
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-gray-50 dark:bg-gray-700'
          }`}>
            <Shield className={`w-6 h-6 mx-auto mb-1 ${
              backgroundCheck?.criminalCheck?.status === 'cleared' ? 'text-green-500' : 'text-gray-400'
            }`} />
            <span className="text-xs">Criminal</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {canEdit && (
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Save Progress
          </button>
          <button
            onClick={handleComplete}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            <CheckCircle className="w-4 h-4" /> Complete & Proceed to Contract
          </button>
        </div>
      )}
    </div>
  );
};

export default Step14BackgroundCheck;
