/**
 * Beneficiary List Page
 *
 * Displays a master beneficiary database with search, filter, and CRUD operations.
 * Based on VDO Master Beneficiary Database template.
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
  Users,
  UserCheck,
  UserX,
  Clock,
  MapPin,
  Phone,
  FileCheck,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { programBeneficiariesDB, programProjectsDB } from '../../../services/db/programService';
import type { ProgramBeneficiaryRecord, ProgramProjectRecord } from '../../../types/modules/program';
import {
  BENEFICIARY_TYPE_OPTIONS,
  BENEFICIARY_STATUS_OPTIONS,
  BENEFICIARY_STATUS_COLORS,
  BENEFICIARY_TYPE_COLORS,
  THEMATIC_AREA_OPTIONS,
  getLabel,
} from '../../../data/program';

const BeneficiaryList = () => {
  const [beneficiaries, setBeneficiaries] = useState<ProgramBeneficiaryRecord[]>([]);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState<ProgramBeneficiaryRecord[]>([]);
  const [projects, setProjects] = useState<ProgramProjectRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterType, filterStatus, filterProject, filterDistrict, beneficiaries]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [benData, projectsData] = await Promise.all([
        programBeneficiariesDB.getAll(),
        programProjectsDB.getAll(),
      ]);
      setBeneficiaries(benData);
      setFilteredBeneficiaries(benData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading beneficiaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...beneficiaries];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.beneficiaryName?.toLowerCase().includes(term) ||
          b.projectName?.toLowerCase().includes(term) ||
          b.nidNo?.toLowerCase().includes(term) ||
          b.contactNumber?.toLowerCase().includes(term) ||
          b.district?.toLowerCase().includes(term) ||
          b.village?.toLowerCase().includes(term)
      );
    }

    if (filterType) {
      filtered = filtered.filter((b) => b.beneficiaryType === filterType);
    }

    if (filterStatus) {
      filtered = filtered.filter((b) => b.status === filterStatus);
    }

    if (filterProject) {
      filtered = filtered.filter((b) => b.projectId === parseInt(filterProject));
    }

    if (filterDistrict) {
      filtered = filtered.filter((b) => b.district === filterDistrict);
    }

    setFilteredBeneficiaries(filtered);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this beneficiary?')) {
      try {
        await programBeneficiariesDB.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting beneficiary:', error);
        alert('Failed to delete beneficiary');
      }
    }
  };

  const handleVerify = async (id: number) => {
    try {
      await programBeneficiariesDB.verify(id);
      loadData();
    } catch (error) {
      console.error('Error verifying beneficiary:', error);
      alert('Failed to verify beneficiary');
    }
  };

  const handleReject = async (id: number) => {
    if (window.confirm('Are you sure you want to reject this beneficiary?')) {
      try {
        await programBeneficiariesDB.reject(id);
        loadData();
      } catch (error) {
        console.error('Error rejecting beneficiary:', error);
        alert('Failed to reject beneficiary');
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterStatus('');
    setFilterProject('');
    setFilterDistrict('');
  };

  // Get unique districts
  const districts = [...new Set(beneficiaries.map((b) => b.district).filter(Boolean))].sort();

  // Calculate stats
  const stats = {
    total: beneficiaries.length,
    verified: beneficiaries.filter((b) => b.status === 'verified').length,
    pending: beneficiaries.filter((b) => b.status === 'pending').length,
    totalFamilyMembers: beneficiaries.reduce((sum, b) => sum + (b.familySize || 0), 0),
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Master Beneficiary Database
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              VDO Program beneficiary registration and verification
            </p>
          </div>
          <Link
            to="/program/beneficiaries/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Register Beneficiary
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Beneficiaries</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.verified}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Verified</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Verification</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalFamilyMembers}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Family Members</p>
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
                  placeholder="Search by name, NID, contact, district..."
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
                    Beneficiary Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    {BENEFICIARY_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    {BENEFICIARY_STATUS_OPTIONS.map((opt) => (
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
                    District
                  </label>
                  <select
                    value={filterDistrict}
                    onChange={(e) => setFilterDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Districts</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(filterType || filterStatus || filterProject || filterDistrict) && (
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

      {/* Beneficiaries Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {filteredBeneficiaries.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No beneficiaries found. Click "Register Beneficiary" to add one.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Beneficiary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Family
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBeneficiaries.map((ben) => (
                  <tr key={ben.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {ben.beneficiaryName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-0.5">
                          {ben.nidNo && (
                            <div className="flex items-center gap-1">
                              <FileCheck className="h-3 w-3" />
                              NID: {ben.nidNo}
                            </div>
                          )}
                          {ben.contactNumber && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {ben.contactNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          BENEFICIARY_TYPE_COLORS[ben.beneficiaryType] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {getLabel(BENEFICIARY_TYPE_OPTIONS, ben.beneficiaryType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ben.projectName ? (
                        <Link
                          to={`/program/projects/${ben.projectId}`}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          {ben.projectName}
                        </Link>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {ben.district && (
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <MapPin className="h-3 w-3" />
                            {ben.district}
                          </div>
                        )}
                        {ben.village && (
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            {ben.village}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <div>{ben.familySize || 0} members</div>
                        {ben.headOfHHGender && (
                          <div className="text-xs text-gray-500">
                            HH: {ben.headOfHHGender === 'male' ? 'Male' : 'Female'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          BENEFICIARY_STATUS_COLORS[ben.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {getLabel(BENEFICIARY_STATUS_OPTIONS, ben.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        {ben.status === 'pending' && (
                          <>
                            <button
                              onClick={() => ben.id && handleVerify(ben.id)}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                              title="Verify"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => ben.id && handleReject(ben.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <Link
                          to={`/program/beneficiaries/${ben.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/program/beneficiaries/${ben.id}/edit`}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => ben.id && handleDelete(ben.id)}
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
      {filteredBeneficiaries.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredBeneficiaries.length} of {beneficiaries.length} beneficiary(ies)
        </div>
      )}
    </div>
  );
};

export default BeneficiaryList;
