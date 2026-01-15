/**
 * Donor Project Audit Form Page
 *
 * Create/Edit form for donor project audits.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Upload, X, FileText } from 'lucide-react';
import {
  useDonorProjectAuditDetail,
  useCreateDonorProjectAudit,
  useUpdateDonorProjectAudit,
} from '../../../hooks/audit';
import { donorProjectAuditSchema, type DonorProjectAuditFormData } from '../../../schemas/audit';
import { AUDIT_STATUS_OPTIONS, CURRENCY_OPTIONS } from '../../../data/audit';
import type { FileUploadMeta } from '../../../types/modules/audit';

interface FileState {
  auditReport: FileUploadMeta | null;
  correctiveActionPlan: FileUploadMeta | null;
  correctiveActionTakenReport: FileUploadMeta | null;
}

const DonorProjectAuditForm: React.FC = () => {
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

  const { data: audit, isLoading: isLoadingData } = useDonorProjectAuditDetail(
    id ? parseInt(id) : undefined
  );
  const createMutation = useCreateDonorProjectAudit();
  const updateMutation = useUpdateDonorProjectAudit();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DonorProjectAuditFormData>({
    resolver: zodResolver(donorProjectAuditSchema),
    defaultValues: {
      donorId: 0,
      projectId: 0,
      periodAudit: '',
      dateAuditStarted: '',
      auditCompanyName: '',
      status: 'draft',
    },
  });

  useEffect(() => {
    if (audit) {
      reset({
        donorId: audit.donorId,
        donorName: audit.donorName,
        projectId: audit.projectId,
        projectName: audit.projectName,
        periodAudit: audit.periodAudit,
        amount: audit.amount,
        currency: audit.currency,
        dateAuditStarted: audit.dateAuditStarted,
        dateAuditEnded: audit.dateAuditEnded || '',
        auditCompanyName: audit.auditCompanyName,
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

  const onSubmit = async (data: DonorProjectAuditFormData) => {
    try {
      const payload = {
        ...data,
        auditReport: files.auditReport || undefined,
        correctiveActionPlan: files.correctiveActionPlan || undefined,
        correctiveActionTakenReport: files.correctiveActionTakenReport || undefined,
      };

      if (isNew) {
        await createMutation.mutateAsync(payload);
      } else {
        await updateMutation.mutateAsync({ id: parseInt(id!), data: payload });
      }
      navigate('/audit/donor-project');
    } catch (error) {
      console.error('Failed to save donor project audit:', error);
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

  const renderFileUpload = (
    field: keyof FileState,
    label: string
  ) => {
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
          onClick={() => navigate('/audit/donor-project')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Donor Project Audits
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isNew ? 'New Donor Project Audit' : isEditMode ? 'Edit Donor Project Audit' : 'View Donor Project Audit'}
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
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donor ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Donor <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('donorId', { valueAsNumber: true })}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                  errors.donorId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter donor ID"
              />
              {errors.donorId && (
                <p className="mt-1 text-sm text-red-500">{errors.donorId.message}</p>
              )}
            </div>

            {/* Donor Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Donor Name
              </label>
              <input
                type="text"
                {...register('donorName')}
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                placeholder="Auto-filled from donor selection"
              />
            </div>

            {/* Project ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('projectId', { valueAsNumber: true })}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                  errors.projectId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter project ID"
              />
              {errors.projectId && (
                <p className="mt-1 text-sm text-red-500">{errors.projectId.message}</p>
              )}
            </div>

            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Name
              </label>
              <input
                type="text"
                {...register('projectName')}
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                placeholder="Auto-filled from project selection"
              />
            </div>

            {/* Period Audit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Audit Period <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('periodAudit')}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                  errors.periodAudit ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g., Jan 2024 - Dec 2024"
              />
              {errors.periodAudit && (
                <p className="mt-1 text-sm text-red-500">{errors.periodAudit.message}</p>
              )}
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

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                placeholder="Audit amount"
              />
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currency
              </label>
              <select
                {...register('currency')}
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                <option value="">Select currency</option>
                {CURRENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Audit Started */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Started <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('dateAuditStarted')}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                  errors.dateAuditStarted ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.dateAuditStarted && (
                <p className="mt-1 text-sm text-red-500">{errors.dateAuditStarted.message}</p>
              )}
            </div>

            {/* Date Audit Ended */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Ended
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
            {renderFileUpload('correctiveActionPlan', 'Corrective Action Plan')}
            {renderFileUpload('correctiveActionTakenReport', 'Action Taken Report')}
          </div>
        </div>

        {/* Actions */}
        {isEditMode && (
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/audit/donor-project')}
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
              onClick={() => navigate(`/audit/donor-project/${id}?edit=true`)}
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

export default DonorProjectAuditForm;
