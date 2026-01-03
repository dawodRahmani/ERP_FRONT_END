/**
 * Project List Page
 *
 * Displays a list of all projects with search, filter, and CRUD operations.
 */

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  FolderOpen,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
} from 'lucide-react';
import { programProjectsDB, programDonorsDB } from '../../../services/db/programService';
import type { ProgramProjectRecord, ProgramDonorRecord } from '../../../types/modules/program';
import {
  PROJECT_STATUS_OPTIONS,
  THEMATIC_AREA_OPTIONS,
  PROJECT_STATUS_COLORS,
  formatDate,
  getReminderColor,
} from '../../../data/program';

const ProjectList = () => {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState<ProgramProjectRecord[]>([]);
  const [donors, setDonors] = useState<ProgramDonorRecord[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProgramProjectRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDonor, setFilterDonor] = useState(searchParams.get('donorId') || '');
  const [filterThematic, setFilterThematic] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterStatus, filterDonor, filterThematic, projects]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsData, donorsData] = await Promise.all([
        programProjectsDB.getAll(),
        programDonorsDB.getAll(),
      ]);
      setProjects(projectsData);
      setDonors(donorsData);
      setFilteredProjects(projectsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...projects];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.projectName?.toLowerCase().includes(term) ||
          p.projectCode?.toLowerCase().includes(term) ||
          p.location?.toLowerCase().includes(term)
      );
    }

    if (filterStatus) {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }

    if (filterDonor) {
      filtered = filtered.filter((p) => p.donorId === parseInt(filterDonor));
    }

    if (filterThematic) {
      filtered = filtered.filter((p) => p.thematicArea === filterThematic);
    }

    setFilteredProjects(filtered);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await programProjectsDB.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterDonor('');
    setFilterThematic('');
  };

  const getDonorName = (donorId: number) => {
    const donor = donors.find((d) => d.id === donorId);
    return donor?.donorName || 'Unknown Donor';
  };

  const getStatusBadgeClass = (status: string) => {
    const colors = PROJECT_STATUS_COLORS[status as keyof typeof PROJECT_STATUS_COLORS];
    if (!colors) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    return `${colors.bg} ${colors.text}`;
  };

  const getEndDateIndicator = (endDate: string) => {
    const color = getReminderColor(endDate, 30);
    const classes = {
      red: 'text-red-600 dark:text-red-400',
      yellow: 'text-yellow-600 dark:text-yellow-400',
      green: 'text-green-600 dark:text-green-400',
    };
    return classes[color];
  };

  const activeStatuses = ['not_started', 'in_progress', 'ongoing', 'amendment'];
  const stats = {
    total: projects.length,
    active: projects.filter((p) => activeStatuses.includes(p.status)).length,
    completed: projects.filter((p) => p.status === 'completed').length,
    endingSoon: projects.filter((p) => {
      if (!activeStatuses.includes(p.status)) return false;
      return getReminderColor(p.endDate, 30) !== 'green';
    }).length,
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage donor-funded projects
            </p>
          </div>
          <Link
            to="/program/projects/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Project
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
                <FolderOpen className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <Calendar className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.endingSoon}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ending Soon</p>
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
                  placeholder="Search projects..."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    {PROJECT_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Donor
                  </label>
                  <select
                    value={filterDonor}
                    onChange={(e) => setFilterDonor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Donors</option>
                    {donors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.donorName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Thematic Area
                  </label>
                  <select
                    value={filterThematic}
                    onChange={(e) => setFilterThematic(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Areas</option>
                    {THEMATIC_AREA_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(filterStatus || filterDonor || filterThematic) && (
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
            <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No projects found. Click "New Project" to create one.
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    {project.projectCode}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {project.projectName}
                  </h3>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                    project.status
                  )}`}
                >
                  {project.status?.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FolderOpen className="h-4 w-4" />
                  <span>{getDonorName(project.donorId)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatDate(project.startDate)} -{' '}
                    <span className={getEndDateIndicator(project.endDate)}>
                      {formatDate(project.endDate)}
                    </span>
                  </span>
                </div>

                {project.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{project.location}</span>
                  </div>
                )}

                {project.budget && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      {project.currency || 'USD'} {project.budget.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {project.thematicArea && (
                <div className="mb-4">
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded">
                    {project.thematicArea?.replace(/_/g, ' ')}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/program/projects/${project.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/program/projects/${project.id}/edit`}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => project.id && handleDelete(project.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredProjects.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredProjects.length} of {projects.length} project(s)
        </div>
      )}
    </div>
  );
};

export default ProjectList;
