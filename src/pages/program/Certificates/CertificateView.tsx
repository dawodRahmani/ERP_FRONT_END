/**
 * Certificate View Page
 *
 * Displays detailed certificate information.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  ScrollText,
  Building2,
  Calendar,
  FileText,
  FolderOpen,
  Download,
  Users,
  Award,
} from 'lucide-react';
import { programCertificatesDB, programProjectsDB } from '../../../services/db/programService';
import type { ProgramCertificateRecord, ProgramProjectRecord } from '../../../types/modules/program';
import {
  CERTIFICATE_AGENCY_OPTIONS,
  CERTIFICATE_DOCUMENT_TYPE_OPTIONS,
  CERTIFICATE_AGENCY_COLORS,
  CERTIFICATE_DOCUMENT_TYPE_COLORS,
  getLabel,
  formatDate,
} from '../../../data/program';

const CertificateView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [certificate, setCertificate] = useState<ProgramCertificateRecord | null>(null);
  const [project, setProject] = useState<ProgramProjectRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (id) {
        const certData = await programCertificatesDB.getById(parseInt(id));
        setCertificate(certData);

        if (certData?.projectId) {
          const projectData = await programProjectsDB.getById(certData.projectId);
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
    if (!certificate?.id) return;
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await programCertificatesDB.delete(certificate.id);
        navigate('/program/certificates');
      } catch (error) {
        console.error('Error deleting certificate:', error);
        alert('Failed to delete certificate');
      }
    }
  };

  const getAgencyIcon = (agency: string) => {
    switch (agency) {
      case 'donor':
        return <Building2 className="h-5 w-5" />;
      case 'partners':
        return <Users className="h-5 w-5" />;
      case 'authority':
        return <Award className="h-5 w-5" />;
      default:
        return <ScrollText className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ScrollText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Certificate not found</p>
          <button
            onClick={() => navigate('/program/certificates')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to Certificates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/program/certificates')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Certificates
        </button>

        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {certificate.stakeholderName}
              </h1>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  CERTIFICATE_AGENCY_COLORS[certificate.agency] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {getLabel(CERTIFICATE_AGENCY_OPTIONS, certificate.agency)}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  CERTIFICATE_DOCUMENT_TYPE_COLORS[certificate.documentType] ||
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {getLabel(CERTIFICATE_DOCUMENT_TYPE_OPTIONS, certificate.documentType)}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                {certificate.year}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/program/certificates/${certificate.id}/edit`}
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
          {/* Certificate Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Certificate Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                {getAgencyIcon(certificate.agency)}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Stakeholder Name</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {certificate.stakeholderName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Agency Type</p>
                  <p className="text-gray-900 dark:text-white">
                    {getLabel(CERTIFICATE_AGENCY_OPTIONS, certificate.agency)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ScrollText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Document Type</p>
                  <p className="text-gray-900 dark:text-white">
                    {getLabel(CERTIFICATE_DOCUMENT_TYPE_OPTIONS, certificate.documentType)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Year</p>
                  <p className="text-gray-900 dark:text-white">{certificate.year}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Areas of Collaboration */}
          {certificate.areasOfCollaboration && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Areas of Collaboration
              </h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {certificate.areasOfCollaboration}
              </p>
            </div>
          )}

          {/* Document */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Attached Document
            </h2>
            {certificate.documentFile ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-10 w-10 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {certificate.documentFile.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(certificate.documentFile.size / 1024).toFixed(2)} KB •{' '}
                      {certificate.documentFile.type}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Uploaded: {formatDate(certificate.documentFile.uploadDate)}
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
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <FileText className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No document attached</p>
                <Link
                  to={`/program/certificates/${certificate.id}/edit`}
                  className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
                >
                  + Add Document
                </Link>
              </div>
            )}
          </div>
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

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Agency</span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    CERTIFICATE_AGENCY_COLORS[certificate.agency] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {getLabel(CERTIFICATE_AGENCY_OPTIONS, certificate.agency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Document Type</span>
                <span className="font-medium text-gray-900 dark:text-white text-sm">
                  {getLabel(CERTIFICATE_DOCUMENT_TYPE_OPTIONS, certificate.documentType)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Year</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {certificate.year}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Has Document</span>
                <span
                  className={`font-semibold ${
                    certificate.documentFile ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {certificate.documentFile ? 'Yes' : 'No'}
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
                  {formatDate(certificate.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(certificate.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
