/**
 * Work Plan Form Page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { programWorkPlansDB, programProjectsDB } from '../../../services/db/programService';
import { workPlanSchema, type WorkPlanFormData } from '../../../schemas/program';
import type { ProgramProjectRecord } from '../../../types/modules/program';
import { THEMATIC_AREA_OPTIONS } from '../../../data/program';

const WorkPlanForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = Boolean(id);

  const [projects, setProjects] = useState<ProgramProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WorkPlanFormData>({
    resolver: zodResolver(workPlanSchema) as any,
    defaultValues: {
      projectId: 0,
      projectName: '',
      output: '',
      activity: '',
      focalPoint: '',
      thematicArea: undefined,
      implementationMethodology: '',
      complianceDocuments: '',
      location: '',
      branding: '',
      socialMedia: '',
      website: '',
      targetMatrix: '',
      timeline: [],
      remarks: '',
      reminderDays: 15,
    },
  });

  const watchProjectId = watch('projectId');

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (watchProjectId) {
      const project = projects.find((p) => p.id === Number(watchProjectId));
      if (project) {
        setValue('projectName', project.projectName);
        setValue('donorId', project.donorId);
        setValue('donorName', project.donorName || '');
      }
    }
  }, [watchProjectId, projects, setValue]);

  const loadData = async () => {
    try {
      setLoading(true);
      const projectsData = await programProjectsDB.getActive();
      setProjects(projectsData);

      if (id) {
        const workPlan = await programWorkPlansDB.getById(parseInt(id));
        if (workPlan) {
          reset({
            projectId: workPlan.projectId,
            projectName: workPlan.projectName || '',
            donorId: workPlan.donorId,
            donorName: workPlan.donorName || '',
            output: workPlan.output || '',
            activity: workPlan.activity || '',
            focalPoint: workPlan.focalPoint || '',
            thematicArea: workPlan.thematicArea,
            implementationMethodology: workPlan.implementationMethodology || '',
            complianceDocuments: workPlan.complianceDocuments || '',
            location: workPlan.location || '',
            branding: workPlan.branding || '',
            socialMedia: workPlan.socialMedia || '',
            website: workPlan.website || '',
            targetMatrix: workPlan.targetMatrix || '',
            timeline: workPlan.timeline || [],
            remarks: workPlan.remarks || '',
            reminderDays: workPlan.reminderDays || 15,
          });
        }
      } else {
        const projectIdParam = searchParams.get('projectId');
        if (projectIdParam) {
          const project = projectsData.find((p) => p.id === parseInt(projectIdParam));
          if (project) {
            setValue('projectId', project.id!);
            setValue('projectName', project.projectName);
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: WorkPlanFormData) => {
    try {
      setSaving(true);
      if (isEditing && id) {
        await programWorkPlansDB.update(parseInt(id), data);
      } else {
        await programWorkPlansDB.create(data);
      }
      navigate('/program/work-plans');
    } catch (error) {
      console.error('Error saving work plan:', error);
      alert('Failed to save work plan');
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
          onClick={() => navigate('/program/work-plans')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Work Plans
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Work Plan' : 'New Work Plan'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Project Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Project Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project *
              </label>
              <select
                {...register('projectId', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectCode} - {p.projectName}
                  </option>
                ))}
              </select>
              {errors.projectId && (
                <p className="mt-1 text-sm text-red-600">{errors.projectId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thematic Area
              </label>
              <select
                {...register('thematicArea')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Area</option>
                {THEMATIC_AREA_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Activity Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Activity Details
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Output *
              </label>
              <input
                type="text"
                {...register('output')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Expected output"
              />
              {errors.output && (
                <p className="mt-1 text-sm text-red-600">{errors.output.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Activity *
              </label>
              <textarea
                {...register('activity')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Activity description"
              />
              {errors.activity && (
                <p className="mt-1 text-sm text-red-600">{errors.activity.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Focal Point
                </label>
                <input
                  type="text"
                  {...register('focalPoint')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Responsible person"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  {...register('location')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Implementation location"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Implementation Methodology
              </label>
              <textarea
                {...register('implementationMethodology')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="How will this be implemented?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Matrix
              </label>
              <textarea
                {...register('targetMatrix')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Targets and indicators"
              />
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Additional Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Compliance Documents
              </label>
              <input
                type="text"
                {...register('complianceDocuments')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Required documents"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Branding
              </label>
              <input
                type="text"
                {...register('branding')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Branding requirements"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Social Media
              </label>
              <input
                type="text"
                {...register('socialMedia')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Social media links"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reminder Days
              </label>
              <input
                type="number"
                {...register('reminderDays', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                min={1}
                max={90}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Remarks
              </label>
              <textarea
                {...register('remarks')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/program/work-plans')}
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
                {isEditing ? 'Update Work Plan' : 'Create Work Plan'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkPlanForm;
