/**
 * Safeguarding View Page
 *
 * Displays detailed safeguarding activity information.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Shield,
  Calendar,
  Clock,
  User,
  FolderOpen,
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { programSafeguardingDB, programProjectsDB } from '../../../services/db/programService';
import type { ProgramSafeguardingRecord, ProgramProjectRecord } from '../../../types/modules/program';
import {
  SAFEGUARDING_ACTIVITY_TYPE_OPTIONS,
  SAFEGUARDING_FREQUENCY_OPTIONS,
  SAFEGUARDING_STATUS_OPTIONS,
  SAFEGUARDING_STATUS_COLORS,
  getLabel,
  formatDate,
  getReminderColor,
  getReminderColorClasses,
  getDaysUntilDue,
  formatDaysUntilDue,
} from '../../../data/program';

const SafeguardingView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activity, setActivity] = useState<ProgramSafeguardingRecord | null>(null);
  const [project, setProject] = useState<ProgramProjectRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (id) {
        const activityData = await programSafeguardingDB.getById(parseInt(id));
        setActivity(activityData);

        if (activityData?.projectId) {
          const projectData = await programProjectsDB.getById(activityData.projectId);
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
    if (!activity?.id) return;
    if (window.confirm('Are you sure you want to delete this safeguarding activity?')) {
      try {
        await programSafeguardingDB.delete(activity.id);
        navigate('/program/safeguarding');
      } catch (error) {
        console.error('Error deleting activity:', error);
        alert('Failed to delete activity');
      }
    }
  };

  const handleMarkCompleted = async () => {
    if (!activity?.id) return;
    try {
      await programSafeguardingDB.markCompleted(activity.id);
      loadData();
    } catch (error) {
      console.error('Error marking activity as completed:', error);
      alert('Failed to mark activity as completed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Safeguarding activity not found</p>
          <button
            onClick={() => navigate('/program/safeguarding')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to Safeguarding
          </button>
        </div>
      </div>
    );
  }

  const isOverdue = activity.status === 'pending' && activity.dueDate && new Date(activity.dueDate) < new Date();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/program/safeguarding')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Safeguarding
        </button>

        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getLabel(SAFEGUARDING_ACTIVITY_TYPE_OPTIONS, activity.activityType)}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      SAFEGUARDING_STATUS_COLORS[activity.status] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {getLabel(SAFEGUARDING_STATUS_OPTIONS, activity.status)}
                  </span>
                  {isOverdue && (
                    <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                      <AlertTriangle className="h-3 w-3" />
                      Overdue
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(activity.status === 'pending' || activity.status === 'in_progress') && (
              <button
                onClick={handleMarkCompleted}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                Mark Completed
              </button>
            )}
            <Link
              to={`/program/safeguarding/${activity.id}/edit`}
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
          {/* Activity Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Activity Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Activity Type</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {getLabel(SAFEGUARDING_ACTIVITY_TYPE_OPTIONS, activity.activityType)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Frequency</p>
                  <p className="text-gray-900 dark:text-white">
                    {getLabel(SAFEGUARDING_FREQUENCY_OPTIONS, activity.frequency)}
                  </p>
                </div>
              </div>

              {activity.responsibleOfficer && (
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Responsible Officer</p>
                    <p className="text-gray-900 dark:text-white">{activity.responsibleOfficer}</p>
                  </div>
                </div>
              )}

              {activity.dueDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(activity.dueDate)}</p>
                    {activity.status !== 'completed' && (
                      <p
                        className={`text-sm mt-1 ${
                          getReminderColor(activity.dueDate) === 'red'
                            ? 'text-red-600'
                            : getReminderColor(activity.dueDate) === 'yellow'
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}
                      >
                        {formatDaysUntilDue(activity.dueDate)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activity.completedDate && (
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Completed Date</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(activity.completedDate)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {activity.description && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {activity.description}
              </p>
            </div>
          )}

          {/* Document */}
          {activity.documentFile && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Attached Document
              </h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-10 w-10 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activity.documentFile.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(activity.documentFile.size / 1024).toFixed(2)} KB •{' '}
                      Uploaded: {formatDate(activity.documentFile.uploadDate)}
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
                    SAFEGUARDING_STATUS_COLORS[activity.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {getLabel(SAFEGUARDING_STATUS_OPTIONS, activity.status)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Activity Type</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {getLabel(SAFEGUARDING_ACTIVITY_TYPE_OPTIONS, activity.activityType)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Frequency</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {getLabel(SAFEGUARDING_FREQUENCY_OPTIONS, activity.frequency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Has Document</span>
                <span
                  className={`font-semibold ${
                    activity.documentFile ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {activity.documentFile ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Due Date Alert */}
          {activity.dueDate && activity.status !== 'completed' && (
            <div
              className={`rounded-lg shadow-sm p-6 border ${getReminderColorClasses(
                getReminderColor(activity.dueDate)
              )}`}
            >
              <div className="flex items-center gap-3">
                {getReminderColor(activity.dueDate) === 'red' ? (
                  <AlertTriangle className="h-6 w-6" />
                ) : (
                  <Clock className="h-6 w-6" />
                )}
                <div>
                  <h3 className="font-semibold">Due Date Reminder</h3>
                  <p className="text-sm">{formatDaysUntilDue(activity.dueDate)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Record Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Record Info
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Created</span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(activity.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(activity.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeguardingView;
