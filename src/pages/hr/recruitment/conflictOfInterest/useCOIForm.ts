import { useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { COIFormData, FileAttachment, ConflictAnswer } from './types';
import {
  defaultCOIFormData,
  createFileAttachment,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from './data';

export function useCOIForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<COIFormData>(defaultCOIFormData);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Scalar field handler ───

  const handleChange = useCallback(
    (field: keyof COIFormData, value: unknown) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    [],
  );

  // ─── Computed: has any conflict ───

  const hasAnyConflict =
    formData.q1Answer === 'yes' ||
    formData.q2Answer === 'yes' ||
    formData.q3Answer === 'yes';

  // ─── Conflict question handler ───

  const handleConflictAnswer = useCallback(
    (answerField: 'q1Answer' | 'q2Answer' | 'q3Answer', value: ConflictAnswer) => {
      setFormData(prev => {
        const detailsField = answerField.replace('Answer', 'Details') as 'q1Details' | 'q2Details' | 'q3Details';
        return {
          ...prev,
          [answerField]: value,
          // Clear details when switching to "no"
          ...(value === 'no' ? { [detailsField]: '' } : {}),
        };
      });
    },
    [],
  );

  // ─── File upload ───

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    setFileError('');

    Array.from(files).forEach(file => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`File "${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const attachment = createFileAttachment(file, dataUrl);
        setFormData(prev => ({
          ...prev,
          uploadedFiles: [...prev.uploadedFiles, attachment],
        }));
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setFormData(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter(f => f.id !== fileId),
    }));
  }, []);

  const downloadFile = useCallback((file: FileAttachment) => {
    const link = document.createElement('a');
    link.href = file.dataUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // ─── Submit ───

  const handleSubmit = useCallback(
    (action: 'save' | 'submit') => {
      if (action === 'submit') {
        setFormData(prev => ({ ...prev, status: 'submitted' }));
      }
      console.log('Saving COI declaration:', formData);
      navigate('/hr/recruitment/conflict-of-interest');
    },
    [formData, navigate],
  );

  const handleCancel = useCallback(() => {
    navigate('/hr/recruitment/conflict-of-interest');
  }, [navigate]);

  // ─── File size formatter ───

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, []);

  return {
    formData,
    isEdit,
    hasAnyConflict,
    fileError,
    fileInputRef,
    handleChange,
    handleConflictAnswer,
    handleFileUpload,
    removeFile,
    downloadFile,
    triggerFileInput,
    formatFileSize,
    handleSubmit,
    handleCancel,
  };
}
