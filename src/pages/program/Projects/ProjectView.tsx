/**
 * Project View Page
 *
 * Displays detailed project information with related data.
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  FolderOpen,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  FileText,
  ClipboardList,
  Shield,
  Building2,
} from "lucide-react";
import {
  programProjectsDB,
  programDonorsDB,
  programWorkPlansDB,
  programReportingDB,
  programBeneficiariesDB,
} from "../../../services/db/programService";
import type {
  ProgramProjectRecord,
  ProgramDonorRecord,
  ProgramWorkPlanRecord,
  ProgramReportingRecord,
} from "../../../types/modules/program";
import {
  PROJECT_STATUS_COLORS,
  REPORT_STATUS_COLORS,
  formatDate,
  getReminderColor,
} from "../../../data/program";

const ProjectView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [project, setProject] = useState<ProgramProjectRecord | null>(null);
  const [donor, setDonor] = useState<ProgramDonorRecord | null>(null);
  const [workPlans, setWorkPlans] = useState<ProgramWorkPlanRecord[]>([]);
  const [reports, setReports] = useState<ProgramReportingRecord[]>([]);
  const [beneficiaryCount, setBeneficiaryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      if (id) {
        const projectData = await programProjectsDB.getById(parseInt(id));
        setProject(projectData ?? null);

        if (projectData) {
          const [donorData, workPlansData, reportsData, beneficiariesData] =
            await Promise.all([
              programDonorsDB.getById(projectData.donorId),
              programWorkPlansDB.getAll(),
              programReportingDB.getByProject(projectData.id!),
              programBeneficiariesDB.getByProject(projectData.id!),
            ]);

          setDonor(donorData ?? null);
          setWorkPlans(workPlansData);
          setReports(reportsData);
          setBeneficiaryCount(beneficiariesData.length);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleDelete = async () => {
    if (!project?.id) return;
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await programProjectsDB.delete(project.id);
        navigate("/program/projects");
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project");
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const colors =
      PROJECT_STATUS_COLORS[status as keyof typeof PROJECT_STATUS_COLORS];
    if (!colors)
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    return `${colors.bg} ${colors.text}`;
  };

  const getReportStatusBadgeClass = (status: string) => {
    const colors =
      REPORT_STATUS_COLORS[status as keyof typeof REPORT_STATUS_COLORS];
    if (!colors)
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    return `${colors.bg} ${colors.text}`;
  };

  const getEndDateIndicator = (endDate: string) => {
    const color = getReminderColor(endDate, 30);
    const classes = {
      red: "text-red-600 dark:text-red-400",
      yellow: "text-yellow-600 dark:text-yellow-400",
      green: "text-green-600 dark:text-green-400",
    };
    return classes[color];
  };

  useEffect(() => {
    loadData();
  }, [id, loadData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Project not found</p>
          <button
            onClick={() => navigate("/program/projects")}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to Projects
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
          onClick={() => navigate("/program/projects")}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </button>

        <div className="flex justify-between items-start">
          <div>
            <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
              {project.projectCode}
            </span>
            <div className="flex items-center gap-3 mt-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {project.projectName}
              </h1>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                  project.status
                )}`}
              >
                {project.status?.replace(/_/g, " ")}
              </span>
            </div>
            {project.thematicArea && (
              <span className="inline-block mt-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded">
                {project.thematicArea?.replace(/_/g, " ")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/program/projects/${project.id}/edit`}
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
          {/* Project Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Project Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Donor
                  </p>
                  <Link
                    to={`/program/donors/${project.donorId}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {donor?.donorName || "Unknown"}
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Duration
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(project.startDate)} -{" "}
                    <span className={getEndDateIndicator(project.endDate)}>
                      {formatDate(project.endDate)}
                    </span>
                  </p>
                </div>
              </div>

              {project.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Location
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {project.location}
                    </p>
                  </div>
                </div>
              )}

              {project.budget && (
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Budget
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {project.currency || "USD"}{" "}
                      {project.budget.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {project.focalPoint && (
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Focal Point
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {project.focalPoint}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {project.description && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Description
                </p>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            )}
          </div>

          {/* Work Plans */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Work Plans ({workPlans.length})
              </h2>
              <Link
                to={`/program/work-plans/new?projectId=${project.id}`}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Work Plan
              </Link>
            </div>

            {workPlans.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  No work plans yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {workPlans.slice(0, 5).map((wp) => (
                  <Link
                    key={wp.id}
                    to={`/program/work-plans/${wp.id}`}
                    className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {wp.output}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {wp.activity}
                    </p>
                  </Link>
                ))}
                {workPlans.length > 5 && (
                  <Link
                    to={`/program/work-plans?projectId=${project.id}`}
                    className="block text-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    View all {workPlans.length} work plans
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Reports */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Reports ({reports.length})
              </h2>
              <Link
                to={`/program/reporting/new?projectId=${project.id}`}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Report
              </Link>
            </div>

            {reports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  No reports yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.slice(0, 5).map((report) => (
                  <Link
                    key={report.id}
                    to={`/program/reporting/${report.id}`}
                    className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {report.reportType?.replace(/_/g, " ")}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Due: {formatDate(report.dueDate)}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getReportStatusBadgeClass(
                          report.status
                        )}`}
                      >
                        {report.status}
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
                <span className="text-gray-500 dark:text-gray-400">
                  Work Plans
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {workPlans.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Reports
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {reports.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Pending Reports
                </span>
                <span className="font-semibold text-yellow-600">
                  {reports.filter((r) => r.status === "pending").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Beneficiaries
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {beneficiaryCount}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h2>
            <div className="space-y-2">
              <Link
                to={`/program/work-plans?projectId=${project.id}`}
                className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <ClipboardList className="h-4 w-4" />
                Work Plans
              </Link>
              <Link
                to={`/program/certificates?projectId=${project.id}`}
                className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <FileText className="h-4 w-4" />
                Certificates
              </Link>
              <Link
                to={`/program/documents?projectId=${project.id}`}
                className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <FolderOpen className="h-4 w-4" />
                Documents
              </Link>
              <Link
                to={`/program/reporting?projectId=${project.id}`}
                className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <FileText className="h-4 w-4" />
                Reporting
              </Link>
              <Link
                to={`/program/beneficiaries?projectId=${project.id}`}
                className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <Users className="h-4 w-4" />
                Beneficiaries
              </Link>
              <Link
                to={`/program/safeguarding?projectId=${project.id}`}
                className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <Shield className="h-4 w-4" />
                Safeguarding
              </Link>
            </div>
          </div>

          {/* Record Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Record Info
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Created
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(project.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Last Updated
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(project.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;
