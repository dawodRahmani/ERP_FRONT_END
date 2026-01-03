/**
 * Work Plan List Page
 */

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye, ClipboardList, Calendar } from 'lucide-react';
import { programWorkPlansDB, programProjectsDB } from '../../../services/db/programService';
import type { ProgramWorkPlanRecord, ProgramProjectRecord } from '../../../types/modules/program';
import { THEMATIC_AREA_OPTIONS, formatDate } from '../../../data/program';

const WorkPlanList = () => {
  const [searchParams] = useSearchParams();
  const [workPlans, setWorkPlans] = useState<ProgramWorkPlanRecord[]>([]);
  const [projects, setProjects] = useState<ProgramProjectRecord[]>([]);
  const [filteredWorkPlans, setFilteredWorkPlans] = useState<ProgramWorkPlanRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState(searchParams.get('projectId') || '');
  const [filterThematic, setFilterThematic] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterProject, filterThematic, workPlans]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [workPlansData, projectsData] = await Promise.all([
        programWorkPlansDB.getAll(),
        programProjectsDB.getAll(),
      ]);
      setWorkPlans(workPlansData);
      setProjects(projectsData);
      setFilteredWorkPlans(workPlansData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...workPlans];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (wp) =>
          wp.output?.toLowerCase().includes(term) ||
          wp.activity?.toLowerCase().includes(term) ||
          wp.focalPoint?.toLowerCase().includes(term)
      );
    }

    if (filterProject) {
      filtered = filtered.filter((wp) => wp.projectId === parseInt(filterProject));
    }

    if (filterThematic) {
      filtered = filtered.filter((wp) => wp.thematicArea === filterThematic);
    }

    setFilteredWorkPlans(filtered);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this work plan?')) {
      try {
        await programWorkPlansDB.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting work plan:', error);
        alert('Failed to delete work plan');
      }
    }
  };

  const getProjectName = (projectId: number) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.projectName || 'Unknown Project';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterProject('');
    setFilterThematic('');
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Work Plans</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage project activities and timelines
            </p>
          </div>
          <Link
            to="/program/work-plans/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Work Plan
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{workPlans.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Plans</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(workPlans.map((wp) => wp.projectId)).size}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Projects</p>
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
                  placeholder="Search work plans..."
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
                        {p.projectName}
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

              {(filterProject || filterThematic) && (
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

      {/* Work Plans Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {filteredWorkPlans.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No work plans found. Click "New Work Plan" to add one.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Output / Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Focal Point
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Thematic Area
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredWorkPlans.map((wp) => (
                  <tr key={wp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{wp.output}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{wp.activity}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {getProjectName(wp.projectId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {wp.focalPoint || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {wp.thematicArea && (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded">
                          {wp.thematicArea?.replace(/_/g, ' ')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/program/work-plans/${wp.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/program/work-plans/${wp.id}/edit`}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => wp.id && handleDelete(wp.id)}
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
      {filteredWorkPlans.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredWorkPlans.length} of {workPlans.length} work plan(s)
        </div>
      )}
    </div>
  );
};

export default WorkPlanList;
