/**
 * Document Form Page
 *
 * Create or edit project document records with validation.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2, Upload, X, FileText } from 'lucide-react';
import { programDocumentsDB, programProjectsDB } from '../../../services/db/programService';
import { documentSchema, type DocumentFormData } from '../../../schemas/program';
import { PROJECT_DOCUMENT_TYPE_OPTIONS } from '../../../data/program';
import type { ProgramProjectRecord, FileMetadata } from '../../../types/modules/program';

const DocumentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState<ProgramProjectRecord[]>([]);
  const [uploadedFile, setUploadedFile] = useState<FileMetadata | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      projectId: 0,
      projectName: '',
      documentType: 'proposal',
      documentName: '',
      documentFile: null,
      uploadedBy: '',
      uploadDate: today,
      description: '',
    },
  });

  const selectedProjectId = watch('projectId');

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    // Update project name when project is selected
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
        const document = await programDocumentsDB.getById(parseInt(id));
        if (document) {
          reset({
            projectId: document.projectId,
            projectName: document.projectName || '',
            documentType: document.documentType,
            documentName: document.documentName || '',
            documentFile: document.documentFile || null,
            uploadedBy: document.uploadedBy || '',
            uploadDate: document.uploadDate || today,
            description: document.description || '',
          });
          if (document.documentFile) {
            setUploadedFile(document.documentFile);
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const metadata: FileMetadata = {
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
      };
      setUploadedFile(metadata);
      setValue('documentFile', metadata);
      // Auto-fill document name if empty
      const currentName = watch('documentName');
      if (!currentName) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setValue('documentName', nameWithoutExt);
      }
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setValue('documentFile', null);
  };

  const onSubmit = async (data: DocumentFormData) => {
    try {
      setSaving(true);
      const submitData = {
        ...data,
        documentFile: uploadedFile,
      };

      if (isEditing && id) {
        await programDocumentsDB.update(parseInt(id), submitData);
      } else {
        await programDocumentsDB.create(submitData);
      }
      navigate('/program/documents');
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Failed to save document');
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
          onClick={() => navigate('/program/documents')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Documents
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Document' : 'Upload Document'}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Upload project proposals, work plans, budgets, agreements, and other documents
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Project Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Project Information
          </h2>
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
        </div>

        {/* Document Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Document Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Document Name *
              </label>
              <input
                type="text"
                {...register('documentName')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Project Proposal - Phase 1"
              />
              {errors.documentName && (
                <p className="mt-1 text-sm text-red-600">{errors.documentName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Document Type *
              </label>
              <select
                {...register('documentType')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {PROJECT_DOCUMENT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.documentType && (
                <p className="mt-1 text-sm text-red-600">{errors.documentType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Upload Date *
              </label>
              <input
                type="date"
                {...register('uploadDate')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              {errors.uploadDate && (
                <p className="mt-1 text-sm text-red-600">{errors.uploadDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Uploaded By
              </label>
              <input
                type="text"
                {...register('uploadedBy')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Name of uploader"
              />
              {errors.uploadedBy && (
                <p className="mt-1 text-sm text-red-600">{errors.uploadedBy.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the document..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            File Upload
          </h2>
          <div>
            {uploadedFile ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(uploadedFile.size / 1024).toFixed(2)} KB • {uploadedFile.type || 'Unknown type'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Max 25MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </label>
            )}
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Note: File metadata is stored locally. Actual file upload will be handled by API
              integration.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/program/documents')}
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
                {isEditing ? 'Update Document' : 'Upload Document'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentForm;
