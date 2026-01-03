/**
 * Partner Audit Form Page
 *
 * Create/Edit form for partner audits.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Upload, X, FileText } from 'lucide-react';
import {
  usePartnerAuditDetail,
  useCreatePartnerAudit,
  useUpdatePartnerAudit,
  useAuditTypesList,
} from '../../../hooks/audit';
import { partnerAuditSchema, type PartnerAuditFormData } from '../../../schemas/audit';
import {
  AUDIT_STATUS_OPTIONS,
  AUDIT_FREQUENCY_OPTIONS,
  AUDIT_MODALITY_OPTIONS,
  AUDIT_SOURCE_OPTIONS,
} from '../../../data/audit';
import type { FileUploadMeta } from '../../../types/modules/audit';

interface FileState {
  auditReport: FileUploadMeta | null;
  correctiveActionPlan: FileUploadMeta | null;
  correctiveActionTakenReport: FileUploadMeta | null;
}

const PartnerAuditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true' || !id;
  const isNew = !id;

  const [files, setFiles] = useState<FileState>({
    auditReport: null,
    correctiveActionPlan: null,
    correctiveActionTakenReport: null,
  });

  const { data: audit, isLoading: isLoadingData } = usePartnerAuditDetail(
    id ? parseInt(id) : undefined
  );
  const { data: auditTypes = [] } = useAuditTypesList();
  const createMutation = useCreatePartnerAudit();
  const updateMutation = useUpdatePartnerAudit();

  const activeAuditTypes = auditTypes.filter((t) => t.isActive);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PartnerAuditFormData>({
    resolver: zodResolver(partnerAuditSchema),
    defaultValues: {
      auditTypeId: 0,
      partnerName: '',
      auditModality: 'in_person',
      period: '',
      auditSource: 'vdo_internal',
      frequency: 'annual',
      dateAuditPlanned: '',
      followUpNeeded: false,
      status: 'draft',
    },
  });

  useEffect(() => {
    if (audit) {
      reset({
        auditTypeId: audit.auditTypeId,
        auditTypeName: audit.auditTypeName,
        donorId: audit.donorId,
        donorName: audit.donorName,
        projectId: audit.projectId,
        projectName: audit.projectName,
        partnerName: audit.partnerName,
        partnerLocation: audit.partnerLocation || '',
        auditModality: audit.auditModality,
        period: audit.period,
        auditSource: audit.auditSource,
        specification: audit.specification || '',
        frequency: audit.frequency,
        dateAuditPlanned: audit.dateAuditPlanned,
        actualDateAuditStarted: audit.actualDateAuditStarted || '',
        dateAuditEnded: audit.dateAuditEnded || '',
        auditCompanyName: audit.auditCompanyName || '',
        auditFocalPointName: audit.auditFocalPointName || '',
        followUpNeeded: audit.followUpNeeded,
        status: audit.status,
        notes: audit.notes || '',
      });
      setFiles({
        auditReport: audit.auditReport || null,
        correctiveActionPlan: audit.correctiveActionPlan || null,
        correctiveActionTakenReport: audit.correctiveActionTakenReport || null,
      });
    }
  }, [audit, reset]);

  const onSubmit = async (data: PartnerAuditFormData) => {
    try {
      const selectedType = activeAuditTypes.find((t) => t.id === data.auditTypeId);
      const payload = {
        ...data,
        auditTypeName: selectedType?.name,
        auditReport: files.auditReport || undefined,
        correctiveActionPlan: files.correctiveActionPlan || undefined,
        correctiveActionTakenReport: files.correctiveActionTakenReport || undefined,
      };

      if (isNew) {
        await createMutation.mutateAsync(payload);
      } else {
        await updateMutation.mutateAsync({ id: parseInt(id!), data: payload });
      }
      navigate('/compliance/audit/partner');
    } catch (error) {
      console.error('Failed to save partner audit:', error);
    }
  };

  const handleFileSelect = (field: keyof FileState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({
        ...prev,
        [field]: {
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          uploadedAt: new Date().toISOString(),
        },
      }));
    }
  };

  const handleRemoveFile = (field: keyof FileState) => () => {
    setFiles((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  const renderFileUpload = (field: keyof FileState, label: string) => {
    const file = files[field];
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
        {file ? (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {file.fileName}
                </p>
                {file.fileSize && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.fileSize / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
            </div>
            {isEditMode && (
              <button
                type="button"
                onClick={handleRemoveFile(field)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        ) : isEditMode ? (
          <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Upload className="h-5 w-5" />
              <span className="text-sm">Click to upload</span>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleFileSelect(field)}
            />
          </label>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No file uploaded</p>
        )}
      </div>
    );
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const followUpNeeded = watch('followUpNeeded');
  const auditSource = watch('auditSource');

  if (isLoadingData && !isNew) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/compliance/audit/partner')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Partner Audits
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isNew ? 'New Partner Audit' : isEditMode ? 'Edit Partner Audit' : 'View Partner Audit'}
        </h1>
        {audit && (
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Audit #{audit.auditNumber}
          </p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Partner Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Partner Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Partner Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Partner Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('partnerName')}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                  errors.partnerName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter partner organization name"
              />
              {errors.partnerName && (
                <p className="mt-1 text-sm text-red-500">{errors.partnerName.message}</p>
              )}
            </div>

            {/* Partner Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Partner Location
              </label>
              <input
                type="text"
                {...register('partnerLocation')}
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                placeholder="City, Province/State"
              />
            </div>

            {/* Donor ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Donor (Optional)
              </label>
              <input
                type="number"
                {...register('donorId', { valueAsNumber: true })}
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                placeholder="Enter donor ID if applicable"
              />
            </div>

            {/* Project ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project (Optional)
              </label>
              <input
                type="number"
                {...register('projectId', { valueAsNumber: true })}
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                placeholder="Enter project ID if applicable"
              />
            </div>
          </div>
        </div>

        {/* Audit Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Audit Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Audit Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Audit Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('auditTypeId', { valueAsNumber: true })}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                  errors.auditTypeId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value={0}>Select audit type</option>
                {activeAuditTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.code})
                  </option>
                ))}
              </select>
              {errors.auditTypeId && (
                <p className="mt-1 text-sm text-red-500">{errors.auditTypeId.message}</p>
              )}
            </div>

            {/* Audit Modality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Audit Modality <span className="text-red-500">*</span>
              </label>
              <select
                {...register('auditModality')}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                  errors.auditModality ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {AUDIT_MODALITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.auditModality && (
                <p className="mt-1 text-sm text-red-500">{errors.auditModality.message}</p>
              )}
            </div>

            {/* Audit Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Audit Source <span className="text-red-500">*</span>
              </label>
              <select
                {...register('auditSource')}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                  errors.auditSource ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {AUDIT_SOURCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.auditSource && (
                <p className="mt-1 text-sm text-red-500">{errors.auditSource.message}</p>
              )}
            </div>

            {/* Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Audit Period <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('period')}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                  errors.period ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g., Jan 2024 - Dec 2024"
              />
              {errors.period && (
                <p className="mt-1 text-sm text-red-500">{errors.period.message}</p>
              )}
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Frequency <span className="text-red-500">*</span>
              </label>
              <select
                {...register('frequency')}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                  errors.frequency ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {AUDIT_FREQUENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.frequency && (
                <p className="mt-1 text-sm text-red-500">{errors.frequency.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register('status')}
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {AUDIT_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Specification */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Specification
              </label>
              <input
                type="text"
                {...register('specification')}
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                placeholder="Additional specification details..."
              />
            </div>

            {/* Audit Company (for TPM source) */}
            {auditSource === 'outsource_tpm' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  TPM Company
                </label>
                <input
                  type="text"
                  {...register('auditCompanyName')}
                  disabled={!isEditMode}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                  placeholder="Third-party monitoring company"
                />
              </div>
            )}

            {/* Focal Point */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Audit Focal Point
              </label>
              <input
                type="text"
                {...register('auditFocalPointName')}
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                placeholder="Contact person name"
              />
            </div>

            {/* Date Planned */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Planned Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('dateAuditPlanned')}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                  errors.dateAuditPlanned ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.dateAuditPlanned && (
                <p className="mt-1 text-sm text-red-500">{errors.dateAuditPlanned.message}</p>
              )}
            </div>

            {/* Actual Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Actual Start Date
              </label>
              <input
                type="date"
                {...register('actualDateAuditStarted')}
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                {...register('dateAuditEnded')}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                  errors.dateAuditEnded ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.dateAuditEnded && (
                <p className="mt-1 text-sm text-red-500">{errors.dateAuditEnded.message}</p>
              )}
            </div>

            {/* Follow-up Needed */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="followUpNeeded"
                {...register('followUpNeeded')}
                disabled={!isEditMode}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
              />
              <label
                htmlFor="followUpNeeded"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Follow-up Required
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              {...register('notes')}
              disabled={!isEditMode}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
              placeholder="Additional notes..."
            />
          </div>
        </div>

        {/* File Uploads */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Documents
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderFileUpload('auditReport', 'Audit Report')}
            {followUpNeeded && (
              <>
                {renderFileUpload('correctiveActionPlan', 'Corrective Action Plan')}
                {renderFileUpload('correctiveActionTakenReport', 'Action Taken Report')}
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        {isEditMode && (
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/compliance/audit/partner')}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save Audit'}
            </button>
          </div>
        )}

        {!isEditMode && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate(`/compliance/audit/partner/${id}?edit=true`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Audit
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PartnerAuditForm;
