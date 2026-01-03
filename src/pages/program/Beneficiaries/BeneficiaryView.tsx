/**
 * Beneficiary View Page
 *
 * Displays detailed beneficiary information with family breakdown.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  User,
  MapPin,
  Phone,
  FileCheck,
  FolderOpen,
  CheckCircle,
  XCircle,
  Download,
  FileText,
  Home,
  Calendar,
} from 'lucide-react';
import { programBeneficiariesDB, programProjectsDB } from '../../../services/db/programService';
import type { ProgramBeneficiaryRecord, ProgramProjectRecord } from '../../../types/modules/program';
import {
  BENEFICIARY_TYPE_OPTIONS,
  BENEFICIARY_STATUS_OPTIONS,
  BENEFICIARY_STATUS_COLORS,
  BENEFICIARY_TYPE_COLORS,
  THEMATIC_AREA_OPTIONS,
  HEAD_OF_HH_GENDER_OPTIONS,
  getLabel,
  formatDate,
} from '../../../data/program';

const BeneficiaryView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [beneficiary, setBeneficiary] = useState<ProgramBeneficiaryRecord | null>(null);
  const [project, setProject] = useState<ProgramProjectRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (id) {
        const benData = await programBeneficiariesDB.getById(parseInt(id));
        setBeneficiary(benData);

        if (benData?.projectId) {
          const projectData = await programProjectsDB.getById(benData.projectId);
          setProject(projectData);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!beneficiary?.id) return;
    if (window.confirm('Are you sure you want to delete this beneficiary?')) {
      try {
        await programBeneficiariesDB.delete(beneficiary.id);
        navigate('/program/beneficiaries');
      } catch (error) {
        console.error('Error deleting beneficiary:', error);
        alert('Failed to delete beneficiary');
      }
    }
  };

  const handleVerify = async () => {
    if (!beneficiary?.id) return;
    try {
      await programBeneficiariesDB.verify(beneficiary.id);
      loadData();
    } catch (error) {
      console.error('Error verifying beneficiary:', error);
      alert('Failed to verify beneficiary');
    }
  };

  const handleReject = async () => {
    if (!beneficiary?.id) return;
    if (window.confirm('Are you sure you want to reject this beneficiary?')) {
      try {
        await programBeneficiariesDB.reject(beneficiary.id);
        loadData();
      } catch (error) {
        console.error('Error rejecting beneficiary:', error);
        alert('Failed to reject beneficiary');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!beneficiary) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Beneficiary not found</p>
          <button
            onClick={() => navigate('/program/beneficiaries')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to Beneficiaries
          </button>
        </div>
      </div>
    );
  }

  // Calculate family breakdown
  const familyBreakdown = {
    femaleUnder17: beneficiary.femaleUnder17 || 0,
    femaleOver18: beneficiary.femaleOver18 || 0,
    maleUnder18: beneficiary.maleUnder18 || 0,
    maleOver18: beneficiary.maleOver18 || 0,
    total: beneficiary.familySize || 0,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/program/beneficiaries')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Beneficiaries
        </button>

        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {beneficiary.beneficiaryName}
              </h1>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  BENEFICIARY_STATUS_COLORS[beneficiary.status] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {getLabel(BENEFICIARY_STATUS_OPTIONS, beneficiary.status)}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  BENEFICIARY_TYPE_COLORS[beneficiary.beneficiaryType] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {getLabel(BENEFICIARY_TYPE_OPTIONS, beneficiary.beneficiaryType)}
              </span>
              {beneficiary.nidNo && (
                <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <FileCheck className="h-4 w-4" />
                  NID: {beneficiary.nidNo}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {beneficiary.status === 'pending' && (
              <>
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Verify
                </button>
                <button
                  onClick={handleReject}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </>
            )}
            <Link
              to={`/program/beneficiaries/${beneficiary.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Beneficiary Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Beneficiary Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {beneficiary.beneficiaryName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Beneficiary Type</p>
                  <p className="text-gray-900 dark:text-white">
                    {getLabel(BENEFICIARY_TYPE_OPTIONS, beneficiary.beneficiaryType)}
                  </p>
                </div>
              </div>

              {beneficiary.serviceType && (
                <div className="flex items-start gap-3">
                  <FileCheck className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Service Type</p>
                    <p className="text-gray-900 dark:text-white">{beneficiary.serviceType}</p>
                  </div>
                </div>
              )}

              {beneficiary.contactNumber && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact Number</p>
                    <a
                      href={`tel:${beneficiary.contactNumber}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {beneficiary.contactNumber}
                    </a>
                  </div>
                </div>
              )}

              {beneficiary.thematicArea && (
                <div className="flex items-start gap-3">
                  <FolderOpen className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Thematic Area</p>
                    <p className="text-gray-900 dark:text-white">
                      {getLabel(THEMATIC_AREA_OPTIONS, beneficiary.thematicArea)}
                    </p>
                  </div>
                </div>
              )}

              {beneficiary.activity && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Activity</p>
                    <p className="text-gray-900 dark:text-white">{beneficiary.activity}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Location Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {beneficiary.currentResidence && (
                <div className="flex items-start gap-3">
                  <Home className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Residence</p>
                    <p className="text-gray-900 dark:text-white">{beneficiary.currentResidence}</p>
                  </div>
                </div>
              )}

              {beneficiary.origin && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Origin</p>
                    <p className="text-gray-900 dark:text-white">{beneficiary.origin}</p>
                  </div>
                </div>
              )}

              {beneficiary.district && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">District</p>
                    <p className="text-gray-900 dark:text-white">{beneficiary.district}</p>
                  </div>
                </div>
              )}

              {beneficiary.village && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Village</p>
                    <p className="text-gray-900 dark:text-white">{beneficiary.village}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Family Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Family Breakdown
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {familyBreakdown.total}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Family Size</p>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {familyBreakdown.femaleUnder17}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Female (&lt;17)</p>
              </div>
              <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                  {familyBreakdown.femaleOver18}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Female (18+)</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {familyBreakdown.maleUnder18}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Male (&lt;18)</p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {familyBreakdown.maleOver18}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Male (18+)</p>
              </div>
            </div>
            {beneficiary.headOfHHGender && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Head of Household:{' '}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {getLabel(HEAD_OF_HH_GENDER_OPTIONS, beneficiary.headOfHHGender)}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* NID Document */}
          {beneficiary.nidDocument && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                NID Document
              </h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-10 w-10 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {beneficiary.nidDocument.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(beneficiary.nidDocument.size / 1024).toFixed(2)} KB •{' '}
                      Uploaded: {formatDate(beneficiary.nidDocument.uploadDate)}
                    </p>
                  </div>
                </div>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => alert('Download will be available after API integration')}
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Project Information
            </h2>
            {project ? (
              <Link
                to={`/program/projects/${project.id}`}
                className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex items-start gap-3">
                  <FolderOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      {project.projectCode}
                    </span>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {project.projectName}
                    </h3>
                    {project.donorName && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Donor: {project.donorName}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="text-center py-4">
                <FolderOpen className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">Project not found</p>
              </div>
            )}
          </div>

          {/* Quick Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    BENEFICIARY_STATUS_COLORS[beneficiary.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {getLabel(BENEFICIARY_STATUS_OPTIONS, beneficiary.status)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Type</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {getLabel(BENEFICIARY_TYPE_OPTIONS, beneficiary.beneficiaryType)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Family Size</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {beneficiary.familySize || 0} members
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Has NID</span>
                <span
                  className={`font-semibold ${
                    beneficiary.nidNo ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {beneficiary.nidNo ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Record Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Record Info
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Created</span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(beneficiary.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(beneficiary.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryView;
