/**
 * Beneficiary Form Page
 *
 * Create or edit beneficiary records with comprehensive validation.
 * Based on VDO Master Beneficiary Database template.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2, Upload, X, FileText } from 'lucide-react';
import { programBeneficiariesDB, programProjectsDB, programDonorsDB } from '../../../services/db/programService';
import { beneficiarySchema, type BeneficiaryFormData } from '../../../schemas/program';
import {
  BENEFICIARY_TYPE_OPTIONS,
  BENEFICIARY_STATUS_OPTIONS,
  THEMATIC_AREA_OPTIONS,
  HEAD_OF_HH_GENDER_OPTIONS,
  AFGHANISTAN_PROVINCES,
} from '../../../data/program';
import type { ProgramProjectRecord, ProgramDonorRecord, FileMetadata } from '../../../types/modules/program';

const BeneficiaryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState<ProgramProjectRecord[]>([]);
  const [donors, setDonors] = useState<ProgramDonorRecord[]>([]);
  const [uploadedNID, setUploadedNID] = useState<FileMetadata | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BeneficiaryFormData>({
    resolver: zodResolver(beneficiarySchema) as any,
    defaultValues: {
      projectId: 0,
      projectCode: '',
      projectName: '',
      donorId: undefined,
      donorName: '',
      thematicArea: undefined,
      activity: '',
      beneficiaryName: '',
      beneficiaryType: 'other',
      serviceType: '',
      status: 'pending',
      nidNo: '',
      nidDocument: null,
      contactNumber: '',
      currentResidence: '',
      origin: '',
      district: '',
      village: '',
      familySize: undefined,
      femaleUnder17: undefined,
      femaleOver18: undefined,
      maleUnder18: undefined,
      maleOver18: undefined,
      headOfHHGender: undefined,
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
        setValue('projectCode', project.projectCode);
        setValue('donorId', project.donorId);
        setValue('donorName', project.donorName || '');
        if (project.thematicArea) {
          setValue('thematicArea', project.thematicArea);
        }
      }
    }
  }, [selectedProjectId, projects, setValue]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsData, donorsData] = await Promise.all([
        programProjectsDB.getAll(),
        programDonorsDB.getAll(),
      ]);
      setProjects(projectsData);
      setDonors(donorsData);

      if (id) {
        const beneficiary = await programBeneficiariesDB.getById(parseInt(id));
        if (beneficiary) {
          reset({
            projectId: beneficiary.projectId,
            projectCode: beneficiary.projectCode || '',
            projectName: beneficiary.projectName || '',
            donorId: beneficiary.donorId,
            donorName: beneficiary.donorName || '',
            thematicArea: beneficiary.thematicArea,
            activity: beneficiary.activity || '',
            beneficiaryName: beneficiary.beneficiaryName || '',
            beneficiaryType: beneficiary.beneficiaryType,
            serviceType: beneficiary.serviceType || '',
            status: beneficiary.status,
            nidNo: beneficiary.nidNo || '',
            nidDocument: beneficiary.nidDocument || null,
            contactNumber: beneficiary.contactNumber || '',
            currentResidence: beneficiary.currentResidence || '',
            origin: beneficiary.origin || '',
            district: beneficiary.district || '',
            village: beneficiary.village || '',
            familySize: beneficiary.familySize,
            femaleUnder17: beneficiary.femaleUnder17,
            femaleOver18: beneficiary.femaleOver18,
            maleUnder18: beneficiary.maleUnder18,
            maleOver18: beneficiary.maleOver18,
            headOfHHGender: beneficiary.headOfHHGender,
          });
          if (beneficiary.nidDocument) {
            setUploadedNID(beneficiary.nidDocument);
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const metadata: FileMetadata = {
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
      };
      setUploadedNID(metadata);
      setValue('nidDocument', metadata);
    }
  };

  const removeNID = () => {
    setUploadedNID(null);
    setValue('nidDocument', null);
  };

  const onSubmit = async (data: BeneficiaryFormData) => {
    try {
      setSaving(true);
      const submitData = {
        ...data,
        nidDocument: uploadedNID,
      };

      if (isEditing && id) {
        await programBeneficiariesDB.update(parseInt(id), submitData);
      } else {
        await programBeneficiariesDB.create(submitData);
      }
      navigate('/program/beneficiaries');
    } catch (error) {
      console.error('Error saving beneficiary:', error);
      alert('Failed to save beneficiary');
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
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/program/beneficiaries')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Beneficiaries
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Beneficiary' : 'Register New Beneficiary'}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          VDO Master Beneficiary Database Registration Form
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Project Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Project Information
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
                Thematic Area
              </label>
              <select
                {...register('thematicArea')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select thematic area</option>
                {THEMATIC_AREA_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Activity
              </label>
              <input
                type="text"
                {...register('activity')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Activity under which beneficiary is registered"
              />
            </div>
          </div>
        </div>

        {/* Beneficiary Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Beneficiary Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name of Beneficiary *
              </label>
              <input
                type="text"
                {...register('beneficiaryName')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Full name of beneficiary"
              />
              {errors.beneficiaryName && (
                <p className="mt-1 text-sm text-red-600">{errors.beneficiaryName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type of Beneficiary *
              </label>
              <select
                {...register('beneficiaryType')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {BENEFICIARY_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.beneficiaryType && (
                <p className="mt-1 text-sm text-red-600">{errors.beneficiaryType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type of Service
              </label>
              <input
                type="text"
                {...register('serviceType')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Service provided to beneficiary"
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
                {BENEFICIARY_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                NID Number
              </label>
              <input
                type="text"
                {...register('nidNo')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="National ID number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                {...register('contactNumber')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Phone number"
              />
            </div>
          </div>

          {/* NID Upload */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload NID Document
            </label>
            {uploadedNID ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {uploadedNID.name}
                    </p>
                    <p className="text-xs text-gray-500">{(uploadedNID.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeNID}
                  className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Upload className="h-5 w-5" />
                  <span className="text-sm">Click to upload NID</span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleNIDChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Location Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Place of Residence
              </label>
              <input
                type="text"
                {...register('currentResidence')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Current residence address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Origin
              </label>
              <input
                type="text"
                {...register('origin')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Place of origin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                District
              </label>
              <select
                {...register('district')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select district</option>
                {AFGHANISTAN_PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Village (if applicable)
              </label>
              <input
                type="text"
                {...register('village')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Village name"
              />
            </div>
          </div>
        </div>

        {/* Family Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Family Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Family Size
              </label>
              <Controller
                name="familySize"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    value={field.value ?? ''}
                    min={0}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Total"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Female (&lt;17)
              </label>
              <Controller
                name="femaleUnder17"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    value={field.value ?? ''}
                    min={0}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Female (18+)
              </label>
              <Controller
                name="femaleOver18"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    value={field.value ?? ''}
                    min={0}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Male (&lt;18)
              </label>
              <Controller
                name="maleUnder18"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    value={field.value ?? ''}
                    min={0}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Male (18+)
              </label>
              <Controller
                name="maleOver18"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    value={field.value ?? ''}
                    min={0}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                HH Gender
              </label>
              <select
                {...register('headOfHHGender')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {HEAD_OF_HH_GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/program/beneficiaries')}
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
                {isEditing ? 'Update Beneficiary' : 'Register Beneficiary'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BeneficiaryForm;
