/**
 * Safeguarding Form Page
 *
 * Create or edit safeguarding activity records with validation.
 * Based on VDO Safeguarding template.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2, Upload, X, FileText } from 'lucide-react';
import { programSafeguardingDB, programProjectsDB } from '../../../services/db/programService';
import { safeguardingSchema, type SafeguardingFormData } from '../../../schemas/program';
import {
  SAFEGUARDING_ACTIVITY_TYPE_OPTIONS,
  SAFEGUARDING_FREQUENCY_OPTIONS,
  SAFEGUARDING_STATUS_OPTIONS,
} from '../../../data/program';
import type { ProgramProjectRecord, FileMetadata } from '../../../types/modules/program';

const SafeguardingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState<ProgramProjectRecord[]>([]);
  const [uploadedDocument, setUploadedDocument] = useState<FileMetadata | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SafeguardingFormData>({
    resolver: zodResolver(safeguardingSchema),
    defaultValues: {
      projectId: 0,
      projectName: '',
      activityType: 'report',
      frequency: 'quarterly',
      documentFile: null,
      responsibleOfficer: '',
      dueDate: '',
      status: 'pending',
      completedDate: '',
      description: '',
    },
  });

  const selectedProjectId = watch('projectId');

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    // Update project-related fields when project is selected
    if (selectedProjectId) {
      const project = projects.find((p) => p.id === selectedProjectId);
      if (project) {
        setValue('projectName', project.projectName);
      }
    }
  }, [selectedProjectId, projects, setValue]);

  const loadData = async () => {
    try {
      setLoading(true);
      const projectsData = await programProjectsDB.getAll();
      setProjects(projectsData);

      if (id) {
        const activity = await programSafeguardingDB.getById(parseInt(id));
        if (activity) {
          reset({
            projectId: activity.projectId,
            projectName: activity.projectName || '',
            activityType: activity.activityType,
            frequency: activity.frequency,
            documentFile: activity.documentFile || null,
            responsibleOfficer: activity.responsibleOfficer || '',
            dueDate: activity.dueDate || '',
            status: activity.status,
            completedDate: activity.completedDate || '',
            description: activity.description || '',
          });
          if (activity.documentFile) {
            setUploadedDocument(activity.documentFile);
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const metadata: FileMetadata = {
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
      };
      setUploadedDocument(metadata);
      setValue('documentFile', metadata);
    }
  };

  const removeDocument = () => {
    setUploadedDocument(null);
    setValue('documentFile', null);
  };

  const onSubmit = async (data: SafeguardingFormData) => {
    try {
      setSaving(true);
      const submitData = {
        ...data,
        documentFile: uploadedDocument,
      };

      if (isEditing && id) {
        await programSafeguardingDB.update(parseInt(id), submitData);
      } else {
        await programSafeguardingDB.create(submitData);
      }
      navigate('/program/safeguarding');
    } catch (error) {
      console.error('Error saving safeguarding activity:', error);
      alert('Failed to save safeguarding activity');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/program/safeguarding')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Safeguarding
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Safeguarding Activity' : 'New Safeguarding Activity'}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Track safeguarding reports, trainings, awareness raising, and visibility materials
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Project & Activity Type */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Activity Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project *
              </label>
              <Controller
                name="projectId"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Select a project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.projectCode} - {p.projectName}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.projectId && (
                <p className="mt-1 text-sm text-red-600">{errors.projectId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Activity Type *
              </label>
              <select
                {...register('activityType')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {SAFEGUARDING_ACTIVITY_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.activityType && (
                <p className="mt-1 text-sm text-red-600">{errors.activityType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Frequency *
              </label>
              <select
                {...register('frequency')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {SAFEGUARDING_FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.frequency && (
                <p className="mt-1 text-sm text-red-600">{errors.frequency.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status *
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {SAFEGUARDING_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Responsible Officer & Dates */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Assignment & Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Responsible Officer
              </label>
              <input
                type="text"
                {...register('responsibleOfficer')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Safeguarding Officer"
              />
              {errors.responsibleOfficer && (
                <p className="mt-1 text-sm text-red-600">{errors.responsibleOfficer.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                {...register('dueDate')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Completed Date
              </label>
              <input
                type="date"
                {...register('completedDate')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              {errors.completedDate && (
                <p className="mt-1 text-sm text-red-600">{errors.completedDate.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Description & Document */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Details & Documentation
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the safeguarding activity, key points covered, participants, etc."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload Report/Document
            </label>
            {uploadedDocument ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {uploadedDocument.name}
                    </p>
                    <p className="text-xs text-gray-500">{(uploadedDocument.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeDocument}
                  className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Upload className="h-6 w-6" />
                  <span className="text-sm">Click to upload report or document</span>
                  <span className="text-xs text-gray-400">PDF, DOC, DOCX, or images</span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleDocumentChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/program/safeguarding')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEditing ? 'Update Activity' : 'Create Activity'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SafeguardingForm;
