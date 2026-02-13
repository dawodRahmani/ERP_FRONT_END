/**
 * Reporting Form Page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { programReportingDB, programProjectsDB } from '../../../services/db/programService';
import { reportingSchema, type ReportingFormData } from '../../../schemas/program';
import type { ProgramProjectRecord } from '../../../types/modules/program';
import { REPORT_TYPE_OPTIONS, REPORTING_FORMAT_OPTIONS, REPORT_STATUS_OPTIONS } from '../../../data/program';

const ReportingForm = () => {
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
  } = useForm<ReportingFormData>({
    resolver: zodResolver(reportingSchema) as any,
    defaultValues: {
      projectId: 0,
      projectName: '',
      reportType: 'monthly',
      reportingDescription: '',
      reportingFormat: 'narrative',
      dueDate: '',
      reminderDays: 10,
      status: 'pending',
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
        const report = await programReportingDB.getById(parseInt(id));
        if (report) {
          reset({
            projectId: report.projectId,
            projectName: report.projectName || '',
            donorId: report.donorId,
            donorName: report.donorName || '',
            location: report.location || '',
            reportType: report.reportType,
            reportingDescription: report.reportingDescription || '',
            reportingFormat: report.reportingFormat,
            dueDate: report.dueDate,
            reminderDays: report.reminderDays || 10,
            status: report.status,
            submittedDate: report.submittedDate || '',
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

  const onSubmit = async (data: ReportingFormData) => {
    try {
      setSaving(true);
      if (isEditing && id) {
        await programReportingDB.update(parseInt(id), data);
      } else {
        await programReportingDB.create(data);
      }
      navigate('/program/reporting');
    } catch (error) {
      console.error('Error saving report:', error);
      alert('Failed to save report');
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
      <div className="mb-6">
        <button
          onClick={() => navigate('/program/reporting')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reporting
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Report' : 'New Report'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Report Details
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
                Report Type *
              </label>
              <select
                {...register('reportType')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {REPORT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.reportType && (
                <p className="mt-1 text-sm text-red-600">{errors.reportType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reporting Format *
              </label>
              <select
                {...register('reportingFormat')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {REPORTING_FORMAT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.reportingFormat && (
                <p className="mt-1 text-sm text-red-600">{errors.reportingFormat.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date *
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status *
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {REPORT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                {...register('reportingDescription')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Report description..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/program/reporting')}
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
                {isEditing ? 'Update Report' : 'Create Report'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportingForm;
