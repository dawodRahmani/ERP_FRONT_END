/**
 * Donor View Page
 *
 * Displays detailed donor information with related projects.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileText,
  FolderOpen,
  Calendar,
} from 'lucide-react';
import { programDonorsDB, programProjectsDB } from '../../../services/db/programService';
import type { ProgramDonorRecord, ProgramProjectRecord } from '../../../types/modules/program';
import {
  DONOR_STATUS_COLORS,
  DONOR_TYPE_COLORS,
  PROJECT_STATUS_COLORS,
  formatDate,
} from '../../../data/program';

const DonorView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [donor, setDonor] = useState<ProgramDonorRecord | null>(null);
  const [projects, setProjects] = useState<ProgramProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (id) {
        const donorData = await programDonorsDB.getById(parseInt(id));
        setDonor(donorData);

        if (donorData) {
          const projectsData = await programProjectsDB.getByDonor(donorData.id!);
          setProjects(projectsData);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!donor?.id) return;
    if (window.confirm('Are you sure you want to delete this donor?')) {
      try {
        await programDonorsDB.delete(donor.id);
        navigate('/program/donors');
      } catch (error) {
        console.error('Error deleting donor:', error);
        alert('Failed to delete donor');
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const colors = DONOR_STATUS_COLORS[status as keyof typeof DONOR_STATUS_COLORS];
    if (!colors) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    return `${colors.bg} ${colors.text}`;
  };

  const getTypeBadgeClass = (type: string) => {
    const colors = DONOR_TYPE_COLORS[type as keyof typeof DONOR_TYPE_COLORS];
    if (!colors) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    return `${colors.bg} ${colors.text}`;
  };

  const getProjectStatusBadgeClass = (status: string) => {
    const colors = PROJECT_STATUS_COLORS[status as keyof typeof PROJECT_STATUS_COLORS];
    if (!colors) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    return `${colors.bg} ${colors.text}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Donor not found</p>
          <button
            onClick={() => navigate('/program/donors')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to Donors
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
          onClick={() => navigate('/program/donors')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Donors
        </button>

        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {donor.donorName}
              </h1>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                  donor.status
                )}`}
              >
                {donor.status}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeClass(
                  donor.donorType
                )}`}
              >
                {donor.donorType?.replace(/_/g, ' ')}
              </span>
              {donor.country && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  • {donor.country}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/program/donors/${donor.id}/edit`}
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
          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {donor.contactPerson && (
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact Person</p>
                    <p className="text-gray-900 dark:text-white">{donor.contactPerson}</p>
                  </div>
                </div>
              )}

              {donor.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <a
                      href={`mailto:${donor.email}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {donor.email}
                    </a>
                  </div>
                </div>
              )}

              {donor.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <a
                      href={`tel:${donor.phone}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {donor.phone}
                    </a>
                  </div>
                </div>
              )}

              {donor.website && (
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                    <a
                      href={donor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {donor.website}
                    </a>
                  </div>
                </div>
              )}

              {donor.address && (
                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="text-gray-900 dark:text-white whitespace-pre-line">
                      {donor.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {donor.notes && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Notes
              </h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {donor.notes}
              </p>
            </div>
          )}

          {/* Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Projects ({projects.length})
              </h2>
              <Link
                to={`/program/projects/new?donorId=${donor.id}`}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Project
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No projects yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/program/projects/${project.id}`}
                    className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                          {project.projectCode}
                        </span>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {project.projectName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3" />
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getProjectStatusBadgeClass(
                          project.status
                        )}`}
                      >
                        {project.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Summary
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Total Projects</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {projects.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Active Projects</span>
                <span className="font-semibold text-green-600">
                  {projects.filter((p) => ['in_progress', 'ongoing'].includes(p.status)).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Completed</span>
                <span className="font-semibold text-blue-600">
                  {projects.filter((p) => p.status === 'completed').length}
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
                  {formatDate(donor.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(donor.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorView;
