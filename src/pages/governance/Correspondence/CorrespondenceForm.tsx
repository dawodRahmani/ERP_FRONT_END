/**
 * Correspondence Form Page
 *
 * Create/Edit correspondence with dynamic fields based on direction (incoming/outgoing).
 * Part of Governance module.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { governanceCorrespondenceDB, governanceBoardMeetingsDB } from '../../../services/db/governanceService';
import type { GovernanceCorrespondenceRecord, FileMetadata } from '../../../types/modules/governance';
import { correspondenceSchema } from '../../../schemas/governance';
import {
  CORRESPONDENCE_DIRECTION_OPTIONS,
  CORRESPONDENCE_STATUS_OPTIONS,
  CORRESPONDENCE_PRIORITY_OPTIONS,
} from '../../../data/governance';

const CorrespondenceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [uploadedDocs, setUploadedDocs] = useState<FileMetadata[]>([]);
  const [boardMeetings, setBoardMeetings] = useState<{ id: number; label: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<GovernanceCorrespondenceRecord>({
    resolver: zodResolver(correspondenceSchema),
    defaultValues: {
      direction: 'in',
      status: 'pending',
      priority: 'medium',
      responseRequired: false,
      documents: [],
    },
  });

  const watchedDirection = watch('direction');
  const watchedResponseRequired = watch('responseRequired');

  useEffect(() => {
    loadBoardMeetings();
    if (isEditMode) {
      loadData();
    }
  }, [id]);

  const loadBoardMeetings = async () => {
    try {
      const meetings = await governanceBoardMeetingsDB.getAll();
      const options = meetings.map((m) => ({
        id: m.id!,
        label: `${new Date(m.meetingDate).toLocaleDateString()} - ${m.meetingType}`,
      }));
      setBoardMeetings(options);
    } catch (error) {
      console.error('Error loading board meetings:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await governanceCorrespondenceDB.getById(parseInt(id!));

      // Set form values
      Object.keys(data).forEach((key) => {
        setValue(key as keyof GovernanceCorrespondenceRecord, data[key as keyof GovernanceCorrespondenceRecord]);
      });

      // Set uploaded documents
      if (data.documents && data.documents.length > 0) {
        setUploadedDocs(data.documents);
      }
    } catch (error) {
      console.error('Error loading correspondence:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newDocs: FileMetadata[] = Array.from(files).map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
      }));

      const updatedDocs = [...uploadedDocs, ...newDocs];
      setUploadedDocs(updatedDocs);
      setValue('documents', updatedDocs);
    }
  };

  const handleRemoveDocument = (index: number) => {
    const updatedDocs = uploadedDocs.filter((_, i) => i !== index);
    setUploadedDocs(updatedDocs);
    setValue('documents', updatedDocs);
  };

  const onSubmit = async (data: GovernanceCorrespondenceRecord) => {
    try {
      setLoading(true);

      const recordData = {
        ...data,
        documents: uploadedDocs,
      };

      if (isEditMode) {
        await governanceCorrespondenceDB.update(parseInt(id!), recordData);
      } else {
        await governanceCorrespondenceDB.create(recordData);
      }

      navigate('/governance/correspondence');
    } catch (error) {
      console.error('Error saving correspondence:', error);
      alert('Failed to save correspondence');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (loading && isEditMode) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/governance/correspondence')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Correspondence
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEditMode ? 'Edit Correspondence' : 'New Correspondence'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {isEditMode ? 'Update correspondence details' : 'Add a new correspondence record'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Direction */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Direction</h3>
          <div className="grid grid-cols-2 gap-4">
            {CORRESPONDENCE_DIRECTION_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  watchedDirection === option.value
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  {...register('direction')}
                  value={option.value}
                  className="sr-only"
                />
                <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.direction && (
            <p className="text-sm text-red-600 mt-1">{errors.direction.message}</p>
          )}
        </div>

        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('date')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.date && (
                <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reference Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('referenceNumber')}
                placeholder="e.g., REF-2024-001"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.referenceNumber && (
                <p className="text-sm text-red-600 mt-1">{errors.referenceNumber.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('subject')}
                placeholder="Enter subject"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.subject && (
                <p className="text-sm text-red-600 mt-1">{errors.subject.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Parties (Dynamic based on direction) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {watchedDirection === 'in' ? 'From (Sender)' : 'To (Recipient)'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {watchedDirection === 'in' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From Organization
                  </label>
                  <input
                    type="text"
                    {...register('fromOrganization')}
                    placeholder="Organization name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.fromOrganization && (
                    <p className="text-sm text-red-600 mt-1">{errors.fromOrganization.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From Person
                  </label>
                  <input
                    type="text"
                    {...register('fromPerson')}
                    placeholder="Person name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.fromPerson && (
                    <p className="text-sm text-red-600 mt-1">{errors.fromPerson.message}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To Organization
                  </label>
                  <input
                    type="text"
                    {...register('toOrganization')}
                    placeholder="Organization name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.toOrganization && (
                    <p className="text-sm text-red-600 mt-1">{errors.toOrganization.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To Person
                  </label>
                  <input
                    type="text"
                    {...register('toPerson')}
                    placeholder="Person name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.toPerson && (
                    <p className="text-sm text-red-600 mt-1">{errors.toPerson.message}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Documents <span className="text-red-500">*</span>
          </h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PDF, DOC, DOCX, or images (Multiple files supported)
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={handleDocumentChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </label>
              {errors.documents && (
                <p className="text-sm text-red-600 mt-1">{errors.documents.message}</p>
              )}
            </div>

            {uploadedDocs.length > 0 && (
              <div className="space-y-2">
                {uploadedDocs.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-blue-600 dark:text-blue-400">📄</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(doc.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(index)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                {...register('priority')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CORRESPONDENCE_PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.priority && (
                <p className="text-sm text-red-600 mt-1">{errors.priority.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CORRESPONDENCE_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Enter detailed description..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Response Tracking */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Response Tracking
          </h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('responseRequired')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Response Required
                </span>
              </label>
            </div>
            {watchedResponseRequired && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Response Deadline
                </label>
                <input
                  type="date"
                  {...register('responseDeadline')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Related Board Meeting */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Related Board Meeting (Optional)
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Board Meeting
            </label>
            <Controller
              name="relatedBoardMeetingId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None</option>
                  {boardMeetings.map((meeting) => (
                    <option key={meeting.id} value={meeting.id}>
                      {meeting.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/governance/correspondence')}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            {loading ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CorrespondenceForm;
