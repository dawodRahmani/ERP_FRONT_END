/**
 * Board Member Form Page
 *
 * Create or edit board member records with validation and document uploads.
 * Part of Governance module.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2, Upload, X, FileText, Mail } from 'lucide-react';
import { governanceBoardMembersDB } from '../../../services/db/governanceService';
import { boardMemberSchema, type BoardMemberFormData } from '../../../schemas/governance';
import {
  BOARD_MEMBER_STATUS_OPTIONS,
  BOARD_MEMBER_ROLE_OPTIONS,
} from '../../../data/governance';
import type { FileMetadata, BoardMemberDocuments } from '../../../types/modules/governance';

const BoardMemberForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<BoardMemberDocuments>({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BoardMemberFormData>({
    resolver: zodResolver(boardMemberSchema),
    defaultValues: {
      name: '',
      position: '',
      organization: '',
      status: 'active',
      roleInBoard: 'member',
      durationStart: '',
      durationEnd: '',
      documents: {},
      mobileNo: '',
      whatsappNo: '',
      emailId: '',
      remarks: '',
    },
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (id) {
        const member = await governanceBoardMembersDB.getById(parseInt(id));
        if (member) {
          reset({
            name: member.name,
            position: member.position,
            organization: member.organization,
            status: member.status,
            roleInBoard: member.roleInBoard,
            durationStart: member.durationStart,
            durationEnd: member.durationEnd || '',
            documents: member.documents || {},
            mobileNo: member.mobileNo || '',
            whatsappNo: member.whatsappNo || '',
            emailId: member.emailId,
            remarks: member.remarks || '',
          });
          if (member.documents) {
            setUploadedDocs(member.documents);
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentChange = (
    field: keyof BoardMemberDocuments,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      setValue('documents', updated);
    }
  };

  const handleRemoveDocument = (field: keyof BoardMemberDocuments) => {
    const updated = { ...uploadedDocs };
    delete updated[field];
    setUploadedDocs(updated);
    setValue('documents', updated);
  };

  const handleGenerateEmail = async () => {
    try {
      const email = await governanceBoardMembersDB.generateEmail();
      setValue('emailId', email);
    } catch (error) {
      console.error('Error generating email:', error);
      alert('Failed to generate email');
    }
  };

  const onSubmit = async (data: BoardMemberFormData) => {
    try {
      setSaving(true);

      const submitData = {
        ...data,
        documents: uploadedDocs,
      };

      if (isEditing) {
        await governanceBoardMembersDB.update(parseInt(id!), submitData);
      } else {
        await governanceBoardMembersDB.create(submitData);
      }

      navigate('/governance/board-members');
    } catch (error) {
      console.error('Error saving board member:', error);
      alert('Failed to save board member');
    } finally {
      setSaving(false);
    }
  };

  const documentFields: Array<{
    key: keyof BoardMemberDocuments;
    label: string;
  }> = [
    { key: 'education', label: 'Education Certificate' },
    { key: 'nid', label: 'National ID (NID)' },
    { key: 'picture', label: 'Picture' },
    { key: 'passport', label: 'Passport' },
    { key: 'cv', label: 'CV / Resume' },
    { key: 'profile', label: 'Profile Document' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/governance/board-members')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Board Members
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Board Member' : 'New Board Member'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {isEditing ? 'Update board member information' : 'Add a new board member to the system'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('position')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.position && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.position.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Organization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('organization')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.organization && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.organization.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Board Role */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Board Role</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {BOARD_MEMBER_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role in Board <span className="text-red-500">*</span>
              </label>
              <select
                {...register('roleInBoard')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {BOARD_MEMBER_ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.roleInBoard && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.roleInBoard.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('durationStart')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.durationStart && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.durationStart.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date (optional)
              </label>
              <input
                type="date"
                {...register('durationEnd')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.durationEnd && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.durationEnd.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                {...register('mobileNo')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.mobileNo && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.mobileNo.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                WhatsApp Number
              </label>
              <input
                type="tel"
                {...register('whatsappNo')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.whatsappNo && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.whatsappNo.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  {...register('emailId')}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleGenerateEmail}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  Auto-Generate
                </button>
              </div>
              {errors.emailId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.emailId.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {field.label}
                </label>
                {uploadedDocs[field.key] ? (
                  <div className="flex items-center gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white truncate">
                        {uploadedDocs[field.key]!.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(uploadedDocs[field.key]!.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(field.key)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Upload {field.label}</span>
                    <input
                      type="file"
                      onChange={(e) => handleDocumentChange(field.key, e)}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Remarks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Remarks</h3>
          <textarea
            {...register('remarks')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Additional notes or remarks..."
          />
          {errors.remarks && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.remarks.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/governance/board-members')}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {isEditing ? 'Update' : 'Save'} Board Member
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardMemberForm;
