/**
 * Document View Page
 *
 * Displays detailed document information with download options.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  FolderOpen,
  FileText,
  Calendar,
  Download,
  User,
  FileSpreadsheet,
  FileCheck,
  FileCog,
  File,
} from 'lucide-react';
import { programDocumentsDB, programProjectsDB } from '../../../services/db/programService';
import type { ProgramDocumentRecord, ProgramProjectRecord } from '../../../types/modules/program';
import {
  PROJECT_DOCUMENT_TYPE_OPTIONS,
  PROJECT_DOCUMENT_TYPE_COLORS,
  getLabel,
  formatDate,
} from '../../../data/program';

const DocumentView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [document, setDocument] = useState<ProgramDocumentRecord | null>(null);
  const [project, setProject] = useState<ProgramProjectRecord | null>(null);
  const [relatedDocs, setRelatedDocs] = useState<ProgramDocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (id) {
        const docData = await programDocumentsDB.getById(parseInt(id));
        setDocument(docData);

        if (docData?.projectId) {
          const [projectData, projectDocs] = await Promise.all([
            programProjectsDB.getById(docData.projectId),
            programDocumentsDB.getByProject(docData.projectId),
          ]);
          setProject(projectData);
          // Get related docs (same project, different document)
          setRelatedDocs(projectDocs.filter((d) => d.id !== docData.id).slice(0, 5));
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!document?.id) return;
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await programDocumentsDB.delete(document.id);
        navigate('/program/documents');
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Failed to delete document');
      }
    }
  };

  const getDocTypeIcon = (docType: string, size: string = 'h-5 w-5') => {
    const iconClass = `${size} text-gray-400`;
    switch (docType) {
      case 'proposal':
        return <FileText className={iconClass} />;
      case 'workplan':
        return <FileCheck className={iconClass} />;
      case 'budget':
        return <FileSpreadsheet className={iconClass} />;
      case 'grant_agreement':
        return <FileText className={iconClass} />;
      case 'logframe':
        return <FileCog className={iconClass} />;
      case 'annexes':
        return <FolderOpen className={iconClass} />;
      case 'compliance_docs':
        return <FileCheck className={iconClass} />;
      default:
        return <File className={iconClass} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Document not found</p>
          <button
            onClick={() => navigate('/program/documents')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to Documents
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
          onClick={() => navigate('/program/documents')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Documents
        </button>

        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {document.documentName}
              </h1>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  PROJECT_DOCUMENT_TYPE_COLORS[document.documentType] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {getLabel(PROJECT_DOCUMENT_TYPE_OPTIONS, document.documentType)}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                {formatDate(document.uploadDate)}
              </span>
              {document.uploadedBy && (
                <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  {document.uploadedBy}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/program/documents/${document.id}/edit`}
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
          {/* Document Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Document Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                {getDocTypeIcon(document.documentType)}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Document Type</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {getLabel(PROJECT_DOCUMENT_TYPE_OPTIONS, document.documentType)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Upload Date</p>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(document.uploadDate)}
                  </p>
                </div>
              </div>

              {document.uploadedBy && (
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Uploaded By</p>
                    <p className="text-gray-900 dark:text-white">{document.uploadedBy}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <FolderOpen className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Project</p>
                  {project ? (
                    <Link
                      to={`/program/projects/${project.id}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {project.projectName}
                    </Link>
                  ) : (
                    <p className="text-gray-400">-</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {document.description && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Description
              </h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {document.description}
              </p>
            </div>
          )}

          {/* File Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Attached File
            </h2>
            {document.documentFile ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {document.documentFile.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(document.documentFile.size / 1024).toFixed(2)} KB •{' '}
                      {document.documentFile.type || 'Unknown type'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Uploaded: {formatDate(document.documentFile.uploadDate)}
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
                <p className="text-gray-500 dark:text-gray-400">No file attached</p>
                <Link
                  to={`/program/documents/${document.id}/edit`}
                  className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
                >
                  + Add File
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

          {/* Related Documents */}
          {relatedDocs.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Related Documents
              </h2>
              <div className="space-y-3">
                {relatedDocs.map((doc) => (
                  <Link
                    key={doc.id}
                    to={`/program/documents/${doc.id}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {getDocTypeIcon(doc.documentType, 'h-4 w-4')}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {doc.documentName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {getLabel(PROJECT_DOCUMENT_TYPE_OPTIONS, doc.documentType)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Type</span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    PROJECT_DOCUMENT_TYPE_COLORS[document.documentType] ||
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {getLabel(PROJECT_DOCUMENT_TYPE_OPTIONS, document.documentType)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Has File</span>
                <span
                  className={`font-semibold ${
                    document.documentFile ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {document.documentFile ? 'Yes' : 'No'}
                </span>
              </div>
              {document.documentFile && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">File Size</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {(document.documentFile.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              )}
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
                  {formatDate(document.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(document.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentView;
