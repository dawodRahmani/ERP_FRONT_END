import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ApplicationFormData } from './types';
import {
  defaultFormData,
  createLanguageRecord,
  createEducationRecord,
  createTrainingRecord,
  createEmploymentRecord,
  createReferenceRecord,
  createExaminerRecord,
} from './data';

type ArrayField = 'languages' | 'education' | 'trainings' | 'employment' | 'references' | 'examiners';

export function useApplicationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<ApplicationFormData>(defaultFormData);

  // ─── Scalar field handler ───

  const handleChange = useCallback(
    (field: keyof ApplicationFormData, value: unknown) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    [],
  );

  // ─── Generic array handlers ───

  const addRecord = useCallback((field: ArrayField) => {
    const factories: Record<ArrayField, () => unknown> = {
      languages: createLanguageRecord,
      education: createEducationRecord,
      trainings: createTrainingRecord,
      employment: createEmploymentRecord,
      references: createReferenceRecord,
      examiners: createExaminerRecord,
    };

    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as Array<{ id: string }>), factories[field]()],
    }));
  }, []);

  const updateRecord = useCallback(
    (field: ArrayField, id: string, key: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        [field]: (prev[field] as Array<{ id: string }>).map(item =>
          item.id === id ? { ...item, [key]: value } : item,
        ),
      }));
    },
    [],
  );

  const removeRecord = useCallback((field: ArrayField, id: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as Array<{ id: string }>).filter(item => item.id !== id),
    }));
  }, []);

  // ─── Submit ───

  const handleSubmit = useCallback(() => {
    console.log('Submitting application:', formData);
    navigate('/hr/recruitment/applications');
  }, [formData, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/hr/recruitment/applications');
  }, [navigate]);

  return {
    formData,
    isEdit,
    handleChange,
    addRecord,
    updateRecord,
    removeRecord,
    handleSubmit,
    handleCancel,
  };
}
