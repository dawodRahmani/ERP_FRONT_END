/**
 * Board Meeting Form Page
 *
 * Create or edit board meeting records with participant selection and documents.
 * Part of Governance module.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2, Upload, X, FileText } from 'lucide-react';
import { governanceBoardMeetingsDB, governanceBoardMembersDB } from '../../../services/db/governanceService';
import { boardMeetingSchema, type BoardMeetingFormData } from '../../../schemas/governance';
import { BOARD_MEETING_TYPE_OPTIONS } from '../../../data/governance';
import type { FileMetadata, BoardMeetingDocuments } from '../../../types/modules/governance';

const BoardMeetingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<BoardMeetingDocuments>({});
  const [uploadedPictures, setUploadedPictures] = useState<FileMetadata[]>([]);
  const [boardMembers, setBoardMembers] = useState<Array<{ id: number; label: string; role: string }>>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<BoardMeetingFormData>({
    resolver: zodResolver(boardMeetingSchema) as any,
    defaultValues: {
      meetingDate: '',
      year: new Date().getFullYear(),
      participants: [],
      participantNames: [],
      meetingType: 'regular_board_meeting',
      documents: {},
      location: '',
      agenda: '',
      minutes: '',
      decisions: '',
      actionItems: '',
      nextMeetingDate: '',
    },
  });

  const watchedDate = watch('meetingDate');
  const watchedParticipants = watch('participants');

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    // Auto-populate year from meeting date
    if (watchedDate) {
      const year = new Date(watchedDate).getFullYear();
      setValue('year', year);
    }
  }, [watchedDate, setValue]);

  useEffect(() => {
    // Denormalize participant names
    if (watchedParticipants && watchedParticipants.length > 0) {
      const names = watchedParticipants.map((participantId) => {
        const member = boardMembers.find((m) => m.id === participantId);
        return member?.label.split(' (')[0] || 'Unknown';
      });
      setValue('participantNames', names);
    }
  }, [watchedParticipants, boardMembers, setValue]);

  useEffect(() => {
    // Update document completion status
    const status = governanceBoardMeetingsDB.updateDocumentCompletionStatus({
      ...uploadedDocs,
      pictures: uploadedPictures,
    });
    setValue('documentCompletionStatus', status);
  }, [uploadedDocs, uploadedPictures, setValue]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load board members for dropdown
      const members = await governanceBoardMembersDB.getForDropdown();
      setBoardMembers(members);

      if (id) {
        const meeting = await governanceBoardMeetingsDB.getById(parseInt(id));
        if (meeting) {
          reset({
            meetingDate: meeting.meetingDate,
            year: meeting.year,
            participants: meeting.participants,
            participantNames: meeting.participantNames || [],
            meetingType: meeting.meetingType,
            documents: meeting.documents || {},
            location: meeting.location || '',
            agenda: meeting.agenda || '',
            minutes: meeting.minutes || '',
            decisions: meeting.decisions || '',
            actionItems: meeting.actionItems || '',
            nextMeetingDate: meeting.nextMeetingDate || '',
            documentCompletionStatus: meeting.documentCompletionStatus,
          });
          if (meeting.documents) {
            setUploadedDocs(meeting.documents);
            if (meeting.documents.pictures) {
              setUploadedPictures(meeting.documents.pictures);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentChange = (field: keyof BoardMeetingDocuments, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const metadata: FileMetadata = {
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
      };
      const updated = { ...uploadedDocs, [field]: metadata };
      setUploadedDocs(updated);
      setValue('documents', updated as any);
    }
  };

  const handlePictureAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const metadata: FileMetadata = {
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
      };
      const updated = [...uploadedPictures, metadata];
      setUploadedPictures(updated);
    }
  };

  const handleRemoveDocument = (field: keyof BoardMeetingDocuments) => {
    const updated = { ...uploadedDocs };
    delete updated[field];
    setUploadedDocs(updated);
    setValue('documents', updated as any);
  };

  const handleRemovePicture = (index: number) => {
    const updated = uploadedPictures.filter((_, i) => i !== index);
    setUploadedPictures(updated);
  };

  const onSubmit = async (data: BoardMeetingFormData) => {
    try {
      setSaving(true);

      const submitData = {
        ...data,
        documents: {
          ...uploadedDocs,
          pictures: uploadedPictures,
        },
      };

      if (isEditing) {
        await governanceBoardMeetingsDB.update(parseInt(id!), submitData);
      } else {
        await governanceBoardMeetingsDB.create(submitData);
      }

      navigate('/governance/board-meetings');
    } catch (error) {
      console.error('Error saving meeting:', error);
      alert('Failed to save meeting');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const documentFields = [
    { key: 'minute' as const, label: 'Minute of the Meeting' },
    { key: 'agenda' as const, label: 'Meeting Agenda' },
    { key: 'workPlan' as const, label: 'Annual Board Work Plan' },
    { key: 'performanceEvaluation' as const, label: 'Annual Board Performance Evaluation' },
    { key: 'attendanceSheet' as const, label: 'Attendance Sheet' },
  ];

  return (
    <div>
      <button
        onClick={() => navigate('/governance/board-meetings')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Board Meetings
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Board Meeting' : 'New Board Meeting'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {isEditing ? 'Update meeting information' : 'Schedule a new board meeting'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Meeting Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meeting Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meeting Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('meetingDate')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.meetingDate && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.meetingDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
              <input
                type="number"
                {...register('year', { valueAsNumber: true })}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meeting Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('meetingType')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {BOARD_MEETING_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
              <input
                type="text"
                {...register('location')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Main Office, Boardroom"
              />
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Participants</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Board Members <span className="text-red-500">*</span>
            </label>
            <Controller
              name="participants"
              control={control}
              render={({ field }) => (
                <select
                  multiple
                  {...field}
                  value={field.value.map(String)}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map((opt) => parseInt(opt.value));
                    field.onChange(selected);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                >
                  {boardMembers.map((member) => (
                    <option key={member.id} value={member.id}>{member.label}</option>
                  ))}
                </select>
              )}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Hold Ctrl/Cmd to select multiple members</p>
            {errors.participants && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.participants.message}</p>
            )}
          </div>
        </div>

        {/* Meeting Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meeting Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Agenda</label>
              <textarea {...register('agenda')} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Meeting agenda items..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minutes</label>
              <textarea {...register('minutes')} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Meeting minutes..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Decisions</label>
              <textarea {...register('decisions')} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Key decisions..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Action Items</label>
              <textarea {...register('actionItems')} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Action items..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Next Meeting Date</label>
              <input type="date" {...register('nextMeetingDate')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{field.label}</label>
                {uploadedDocs[field.key] ? (
                  <div className="flex items-center gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white truncate">{uploadedDocs[field.key]!.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{(uploadedDocs[field.key]!.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button type="button" onClick={() => handleRemoveDocument(field.key)} className="text-red-600 hover:text-red-900"><X className="h-5 w-5" /></button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Upload</span>
                    <input type="file" onChange={(e) => handleDocumentChange(field.key, e)} className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                  </label>
                )}
              </div>
            ))}

            {/* Pictures */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meeting Pictures</label>
              <div className="space-y-2">
                {uploadedPictures.map((pic, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white truncate">{pic.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{(pic.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button type="button" onClick={() => handleRemovePicture(index)} className="text-red-600 hover:text-red-900"><X className="h-5 w-5" /></button>
                  </div>
                ))}
                <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Add Picture</span>
                  <input type="file" onChange={handlePictureAdd} className="hidden" accept=".jpg,.jpeg,.png" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate('/governance/board-meetings')} className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
            {saving ? (<><Loader2 className="h-5 w-5 animate-spin" />Saving...</>) : (<><Save className="h-5 w-5" />{isEditing ? 'Update' : 'Save'} Meeting</>)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardMeetingForm;
