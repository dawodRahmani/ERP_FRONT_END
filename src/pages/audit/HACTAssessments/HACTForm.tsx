/**
 * HACT Assessment Form Page
 *
 * Create/Edit form for HACT assessments.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Upload, X, FileText } from 'lucide-react';
import {
  useHACTAssessmentDetail,
  useCreateHACTAssessment,
  useUpdateHACTAssessment,
} from '../../../hooks/audit';
import { hactAssessmentSchema, type HACTAssessmentFormData } from '../../../schemas/audit';
import { AUDIT_STATUS_OPTIONS } from '../../../data/audit';
import type { FileUploadMeta } from '../../../types/modules/audit';

const HACTForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true' || !id;
  const isNew = !id;

  const [reportFile, setReportFile] = useState<FileUploadMeta | null>(null);

  const { data: assessment, isLoading: isLoadingData } = useHACTAssessmentDetail(
    id ? parseInt(id) : undefined
  );
  const createMutation = useCreateHACTAssessment();
  const updateMutation = useUpdateHACTAssessment();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<HACTAssessmentFormData>({
    resolver: zodResolver(hactAssessmentSchema),
    defaultValues: {
      donorId: 0,
      dateAssessmentStarted: '',
      auditCompany: '',
      status: 'draft',
    },
  });

  useEffect(() => {
    if (assessment) {
      reset({
        donorId: assessment.donorId,
        donorName: assessment.donorName,
        dateAssessmentStarted: assessment.dateAssessmentStarted,
        dateAssessmentEnded: assessment.dateAssessmentEnded || '',
        validUntil: assessment.validUntil || '',
        auditCompany: assessment.auditCompany,
        auditFocalPoint: assessment.auditFocalPoint || '',
        purpose: assessment.purpose || '',
        status: assessment.status,
        notes: assessment.notes || '',
      });
      setReportFile(assessment.reportUpload || null);
    }
  }, [assessment, reset]);

  const onSubmit = async (data: HACTAssessmentFormData) => {
    try {
      const payload = {
        ...data,
        reportUpload: reportFile || undefined,
      };

      if (isNew) {
        await createMutation.mutateAsync(payload);
      } else {
        await updateMutation.mutateAsync({ id: parseInt(id!), data: payload });
      }
      navigate('/compliance/audit/hact');
    } catch (error) {
      console.error('Failed to save HACT assessment:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReportFile({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
      });
    }
  };

  const handleRemoveFile = () => {
    setReportFile(null);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const currentStatus = watch('status');

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
          onClick={() => navigate('/compliance/audit/hact')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to HACT Assessments
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isNew ? 'New HACT Assessment' : isEditMode ? 'Edit HACT Assessment' : 'View HACT Assessment'}
        </h1>
        {assessment && (
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Assessment #{assessment.assessmentNumber}
          </p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.donorId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter donor ID"
              />
              {errors.donorId && (
                <p className="mt-1 text-sm text-red-500">{errors.donorId.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Will be replaced with donor dropdown when API is connected
              </p>
            </div>

            {/* Donor Name (display only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Donor Name
              </label>
              <input
                type="text"
                {...register('donorName')}
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                placeholder="Optional - will be auto-filled from donor selection"
              />
            </div>

            {/* Audit Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Audit Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('auditCompany')}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.auditCompany ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter audit company name"
              />
              {errors.auditCompany && (
                <p className="mt-1 text-sm text-red-500">{errors.auditCompany.message}</p>
              )}
            </div>

            {/* Audit Focal Point */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Audit Focal Point
              </label>
              <input
                type="text"
                {...register('auditFocalPoint')}
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                placeholder="Contact person name"
              />
            </div>

            {/* Date Assessment Started */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Started <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('dateAssessmentStarted')}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.dateAssessmentStarted ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.dateAssessmentStarted && (
                <p className="mt-1 text-sm text-red-500">{errors.dateAssessmentStarted.message}</p>
              )}
            </div>

            {/* Date Assessment Ended */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Ended
              </label>
              <input
                type="date"
                {...register('dateAssessmentEnded')}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                  errors.dateAssessmentEnded ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.dateAssessmentEnded && (
                <p className="mt-1 text-sm text-red-500">{errors.dateAssessmentEnded.message}</p>
              )}
            </div>

            {/* Valid Until */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valid Until
              </label>
              <input
                type="date"
                {...register('validUntil')}
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register('status')}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.status ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {AUDIT_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Purpose */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Purpose
            </label>
            <textarea
              {...register('purpose')}
              disabled={!isEditMode}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
              placeholder="Describe the purpose of this assessment..."
            />
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

        {/* File Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Report Upload
          </h2>

          {reportFile ? (
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {reportFile.fileName}
                  </p>
                  {reportFile.fileSize && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(reportFile.fileSize / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
              </div>
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          ) : isEditMode ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Click to upload assessment report
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileSelect}
              />
            </label>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No report uploaded</p>
          )}
        </div>

        {/* Actions */}
        {isEditMode && (
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/compliance/audit/hact')}
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
              {isLoading ? 'Saving...' : 'Save Assessment'}
            </button>
          </div>
        )}

        {!isEditMode && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate(`/compliance/audit/hact/${id}?edit=true`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Assessment
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default HACTForm;
