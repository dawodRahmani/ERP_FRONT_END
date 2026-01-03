/**
 * External Audit Form Page
 *
 * Create/Edit form for external audits with annual audit sub-records.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Upload, X, FileText, Plus, Calendar } from 'lucide-react';
import {
  useExternalAuditDetail,
  useCreateExternalAudit,
  useUpdateExternalAudit,
  useAuditTypesList,
} from '../../../hooks/audit';
import { externalAuditSchema, type ExternalAuditFormData } from '../../../schemas/audit';
import { AUDIT_STATUS_OPTIONS, AUDIT_FREQUENCY_OPTIONS } from '../../../data/audit';
import type { FileUploadMeta, ExternalAnnualAuditRecord } from '../../../types/modules/audit';

interface FileState {
  auditReport: FileUploadMeta | null;
  correctiveActionPlan: FileUploadMeta | null;
  correctiveActionTakenReport: FileUploadMeta | null;
}

const ExternalAuditForm: React.FC = () => {
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

  const { data: audit, isLoading: isLoadingData } = useExternalAuditDetail(
    id ? parseInt(id) : undefined
  );
  const { data: auditTypes = [] } = useAuditTypesList();
  const createMutation = useCreateExternalAudit();
  const updateMutation = useUpdateExternalAudit();

  const activeAuditTypes = auditTypes.filter((t) => t.isActive && t.category === 'external');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ExternalAuditFormData>({
    resolver: zodResolver(externalAuditSchema),
    defaultValues: {
      auditTypeId: 0,
      frequency: 'annual',
      dateAuditPlanned: '',
      auditCompanyName: '',
      followUpNeeded: false,
      status: 'draft',
    },
  });

  useEffect(() => {
    if (audit) {
      reset({
        auditTypeId: audit.auditTypeId,
        auditTypeName: audit.auditTypeName,
        specification: audit.specification || '',
        frequency: audit.frequency,
        dateAuditPlanned: audit.dateAuditPlanned,
        actualDateAuditStarted: audit.actualDateAuditStarted || '',
        dateAuditEnded: audit.dateAuditEnded || '',
        auditCompanyName: audit.auditCompanyName,
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

  const onSubmit = async (data: ExternalAuditFormData) => {
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
      navigate('/compliance/audit/external');
    } catch (error) {
      console.error('Failed to save external audit:', error);
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
          onClick={() => navigate('/compliance/audit/external')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to External Audits
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isNew ? 'New External Audit' : isEditMode ? 'Edit External Audit' : 'View External Audit'}
        </h1>
        {audit && (
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Audit #{audit.auditNumber}
          </p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Audit Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Specification */}
            <div className="md:col-span-2">
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

            {/* Audit Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Audit Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('auditCompanyName')}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                  errors.auditCompanyName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter audit company name"
              />
              {errors.auditCompanyName && (
                <p className="mt-1 text-sm text-red-500">{errors.auditCompanyName.message}</p>
              )}
            </div>

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

        {/* Annual Audits Section (View Mode Only) */}
        {!isNew && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Annual Audit Records
              </h2>
              {isEditMode && (
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Year
                </button>
              )}
            </div>

            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Annual audit records will appear here</p>
              <p className="text-sm mt-1">Add yearly reports and management letters</p>
            </div>
          </div>
        )}

        {/* Actions */}
        {isEditMode && (
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/compliance/audit/external')}
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
              onClick={() => navigate(`/compliance/audit/external/${id}?edit=true`)}
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

export default ExternalAuditForm;
