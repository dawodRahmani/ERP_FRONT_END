/**
 * Certificate List Page
 *
 * Displays a list of all stakeholder certificates/acknowledgements
 * with search, filter, and CRUD operations.
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
  ScrollText,
  Building2,
  Calendar,
  FileDown,
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
} from '../../../data/program';

const CertificateList = () => {
  const [certificates, setCertificates] = useState<ProgramCertificateRecord[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<ProgramCertificateRecord[]>([]);
  const [projects, setProjects] = useState<ProgramProjectRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAgency, setFilterAgency] = useState('');
  const [filterDocType, setFilterDocType] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterAgency, filterDocType, filterProject, filterYear, certificates]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [certsData, projectsData] = await Promise.all([
        programCertificatesDB.getAll(),
        programProjectsDB.getAll(),
      ]);
      setCertificates(certsData);
      setFilteredCertificates(certsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...certificates];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.stakeholderName?.toLowerCase().includes(term) ||
          c.projectName?.toLowerCase().includes(term) ||
          c.areasOfCollaboration?.toLowerCase().includes(term)
      );
    }

    if (filterAgency) {
      filtered = filtered.filter((c) => c.agency === filterAgency);
    }

    if (filterDocType) {
      filtered = filtered.filter((c) => c.documentType === filterDocType);
    }

    if (filterProject) {
      filtered = filtered.filter((c) => c.projectId === parseInt(filterProject));
    }

    if (filterYear) {
      filtered = filtered.filter((c) => c.year === parseInt(filterYear));
    }

    setFilteredCertificates(filtered);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await programCertificatesDB.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting certificate:', error);
        alert('Failed to delete certificate');
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterAgency('');
    setFilterDocType('');
    setFilterProject('');
    setFilterYear('');
  };

  // Get unique years for filter
  const years = [...new Set(certificates.map((c) => c.year))].sort((a, b) => b - a);

  // Stats
  const stats = {
    total: certificates.length,
    fromDonors: certificates.filter((c) => c.agency === 'donor').length,
    fromPartners: certificates.filter((c) => c.agency === 'partners').length,
    fromAuthority: certificates.filter((c) => c.agency === 'authority').length,
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certificates</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Acknowledgements & Certifications from VDO Stakeholders
            </p>
          </div>
          <Link
            to="/program/certificates/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Certificate
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <ScrollText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Certificates</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.fromDonors}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">From Donors</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Users className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.fromPartners}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">From Partners</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.fromAuthority}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">From Authority</p>
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
                  placeholder="Search stakeholders, projects..."
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Agency
                  </label>
                  <select
                    value={filterAgency}
                    onChange={(e) => setFilterAgency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Agencies</option>
                    {CERTIFICATE_AGENCY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

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
                    {CERTIFICATE_DOCUMENT_TYPE_OPTIONS.map((opt) => (
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Year
                  </label>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Years</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(filterAgency || filterDocType || filterProject || filterYear) && (
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

      {/* Certificates Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {filteredCertificates.length === 0 ? (
          <div className="p-12 text-center">
            <ScrollText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No certificates found. Click "New Certificate" to add one.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Stakeholder
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Agency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Document Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCertificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {cert.stakeholderName}
                        </div>
                        {cert.areasOfCollaboration && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {cert.areasOfCollaboration}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          CERTIFICATE_AGENCY_COLORS[cert.agency] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {getLabel(CERTIFICATE_AGENCY_OPTIONS, cert.agency)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          CERTIFICATE_DOCUMENT_TYPE_COLORS[cert.documentType] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {getLabel(CERTIFICATE_DOCUMENT_TYPE_OPTIONS, cert.documentType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        {cert.year}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cert.projectName ? (
                        <Link
                          to={`/program/projects/${cert.projectId}`}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          {cert.projectName}
                        </Link>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cert.documentFile ? (
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
                          to={`/program/certificates/${cert.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/program/certificates/${cert.id}/edit`}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => cert.id && handleDelete(cert.id)}
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
      {filteredCertificates.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredCertificates.length} of {certificates.length} certificate(s)
        </div>
      )}
    </div>
  );
};

export default CertificateList;
