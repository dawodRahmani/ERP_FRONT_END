/**
 * Document List Page
 *
 * Displays a list of all project documents with search, filter, and CRUD operations.
 * Document types: Proposal, Work Plan, Budget, Grant Agreement, Logframe, Annexes, Compliance Docs
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  FolderOpen,
  FileText,
  Calendar,
  FileDown,
  User,
  File,
  FileSpreadsheet,
  FileCheck,
  FileCog,
} from 'lucide-react';
import { programDocumentsDB, programProjectsDB } from '../../../services/db/programService';
import type { ProgramDocumentRecord, ProgramProjectRecord } from '../../../types/modules/program';
import {
  PROJECT_DOCUMENT_TYPE_OPTIONS,
  PROJECT_DOCUMENT_TYPE_COLORS,
  getLabel,
  formatDate,
} from '../../../data/program';

const DocumentList = () => {
  const [documents, setDocuments] = useState<ProgramDocumentRecord[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<ProgramDocumentRecord[]>([]);
  const [projects, setProjects] = useState<ProgramProjectRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDocType, setFilterDocType] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterDocType, filterProject, documents]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [docsData, projectsData] = await Promise.all([
        programDocumentsDB.getAll(),
        programProjectsDB.getAll(),
      ]);
      setDocuments(docsData);
      setFilteredDocuments(docsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...documents];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.documentName?.toLowerCase().includes(term) ||
          d.projectName?.toLowerCase().includes(term) ||
          d.description?.toLowerCase().includes(term) ||
          d.uploadedBy?.toLowerCase().includes(term)
      );
    }

    if (filterDocType) {
      filtered = filtered.filter((d) => d.documentType === filterDocType);
    }

    if (filterProject) {
      filtered = filtered.filter((d) => d.projectId === parseInt(filterProject));
    }

    setFilteredDocuments(filtered);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await programDocumentsDB.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Failed to delete document');
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterDocType('');
    setFilterProject('');
  };

  const getDocTypeIcon = (docType: string) => {
    switch (docType) {
      case 'proposal':
        return <FileText className="h-4 w-4" />;
      case 'workplan':
        return <FileCheck className="h-4 w-4" />;
      case 'budget':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'grant_agreement':
        return <FileText className="h-4 w-4" />;
      case 'logframe':
        return <FileCog className="h-4 w-4" />;
      case 'annexes':
        return <FolderOpen className="h-4 w-4" />;
      case 'compliance_docs':
        return <FileCheck className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  // Stats by document type
  const stats = {
    total: documents.length,
    proposals: documents.filter((d) => d.documentType === 'proposal').length,
    budgets: documents.filter((d) => d.documentType === 'budget').length,
    agreements: documents.filter((d) => d.documentType === 'grant_agreement').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Documents</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage project proposals, work plans, budgets, agreements, and compliance documents
            </p>
          </div>
          <Link
            to="/program/documents/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Upload Document
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Documents</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.proposals}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Proposals</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.budgets}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Budgets</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FileCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.agreements}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Agreements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents, projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Document Type
                  </label>
                  <select
                    value={filterDocType}
                    onChange={(e) => setFilterDocType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    {PROJECT_DOCUMENT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project
                  </label>
                  <select
                    value={filterProject}
                    onChange={(e) => setFilterProject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Projects</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.projectCode} - {p.projectName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(filterDocType || filterProject) && (
                <div className="mt-4">
                  <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700">
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {filteredDocuments.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No documents found. Click "Upload Document" to add one.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          {getDocTypeIcon(doc.documentType)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {doc.documentName}
                          </div>
                          {doc.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {doc.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          PROJECT_DOCUMENT_TYPE_COLORS[doc.documentType] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {getLabel(PROJECT_DOCUMENT_TYPE_OPTIONS, doc.documentType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {doc.projectName ? (
                        <Link
                          to={`/program/projects/${doc.projectId}`}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          {doc.projectName}
                        </Link>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Calendar className="h-3 w-3" />
                          {formatDate(doc.uploadDate)}
                        </div>
                        {doc.uploadedBy && (
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-500 text-xs mt-1">
                            <User className="h-3 w-3" />
                            {doc.uploadedBy}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {doc.documentFile ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <FileDown className="h-4 w-4" />
                          Attached
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">No file</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/program/documents/${doc.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/program/documents/${doc.id}/edit`}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => doc.id && handleDelete(doc.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {filteredDocuments.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredDocuments.length} of {documents.length} document(s)
        </div>
      )}
    </div>
  );
};

export default DocumentList;
