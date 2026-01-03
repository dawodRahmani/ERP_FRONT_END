/**
 * Reporting View Page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, FileText, Calendar, CheckCircle } from 'lucide-react';
import { programReportingDB, programProjectsDB } from '../../../services/db/programService';
import type { ProgramReportingRecord, ProgramProjectRecord } from '../../../types/modules/program';
import { REPORT_STATUS_COLORS, formatDate, formatDaysUntilDue, getReminderColor } from '../../../data/program';

const ReportingView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [report, setReport] = useState<ProgramReportingRecord | null>(null);
  const [project, setProject] = useState<ProgramProjectRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (id) {
        const reportData = await programReportingDB.getById(parseInt(id));
        setReport(reportData);
        if (reportData) {
          const projectData = await programProjectsDB.getById(reportData.projectId);
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
    if (!report?.id) return;
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await programReportingDB.delete(report.id);
        navigate('/program/reporting');
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Failed to delete report');
      }
    }
  };

  const handleMarkSubmitted = async () => {
    if (!report?.id) return;
    try {
      await programReportingDB.markSubmitted(report.id);
      loadData();
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const colors = REPORT_STATUS_COLORS[status as keyof typeof REPORT_STATUS_COLORS];
    if (!colors) return 'bg-gray-100 text-gray-800';
    return `${colors.bg} ${colors.text}`;
  };

  const getDueDateClass = (dueDate: string) => {
    const color = getReminderColor(dueDate, 10);
    const classes = {
      red: 'text-red-600 dark:text-red-400',
      yellow: 'text-yellow-600 dark:text-yellow-400',
      green: 'text-green-600 dark:text-green-400',
    };
    return classes[color];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Report not found</p>
          <button
            onClick={() => navigate('/program/reporting')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to Reporting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/program/reporting')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reporting
        </button>

        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {report.reportType?.replace(/_/g, ' ')} Report
              </h1>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(report.status)}`}>
                {report.status}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {report.reportingFormat?.replace(/_/g, ' ')} format
            </p>
          </div>

          <div className="flex items-center gap-2">
            {report.status === 'pending' && (
              <button
                onClick={handleMarkSubmitted}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                Mark Submitted
              </button>
            )}
            <Link
              to={`/program/reporting/${report.id}/edit`}
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
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                  <p className={getDueDateClass(report.dueDate)}>
                    {formatDate(report.dueDate)}
                    {report.status === 'pending' && (
                      <span className="block text-sm">{formatDaysUntilDue(report.dueDate)}</span>
                    )}
                  </p>
                </div>
              </div>

              {report.submittedDate && (
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Submitted Date</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(report.submittedDate)}</p>
                  </div>
                </div>
              )}
            </div>

            {report.reportingDescription && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Description</p>
                <p className="text-gray-600 dark:text-gray-400">{report.reportingDescription}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project</h2>
            {project ? (
              <Link
                to={`/program/projects/${project.id}`}
                className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="text-xs font-mono text-gray-500">{project.projectCode}</span>
                <p className="font-medium text-gray-900 dark:text-white">{project.projectName}</p>
              </Link>
            ) : (
              <p className="text-gray-500">Project not found</p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Record Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Created</span>
                <span className="text-gray-900 dark:text-white">{formatDate(report.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                <span className="text-gray-900 dark:text-white">{formatDate(report.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingView;
