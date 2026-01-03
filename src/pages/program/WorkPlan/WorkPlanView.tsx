/**
 * Work Plan View Page
 */

import {
  ArrowLeft,
  ClipboardList,
  Edit,
  FolderOpen,
  MapPin,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../../../data/program";
import {
  programProjectsDB,
  programWorkPlansDB,
} from "../../../services/db/programService";
import type {
  ProgramProjectRecord,
  ProgramWorkPlanRecord,
} from "../../../types/modules/program";

const WorkPlanView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [workPlan, setWorkPlan] = useState<ProgramWorkPlanRecord | null>(null);
  const [project, setProject] = useState<ProgramProjectRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (id) {
        const wpData = await programWorkPlansDB.getById(parseInt(id));
        setWorkPlan(wpData);

        if (wpData) {
          const projectData = await programProjectsDB.getById(wpData.projectId);
          setProject(projectData);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!workPlan?.id) return;
    if (window.confirm("Are you sure you want to delete this work plan?")) {
      try {
        await programWorkPlansDB.delete(workPlan.id);
        navigate("/program/work-plans");
      } catch (error) {
        console.error("Error deleting work plan:", error);
        alert("Failed to delete work plan");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!workPlan) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Work plan not found
          </p>
          <button
            onClick={() => navigate("/program/work-plans")}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to Work Plans
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
          onClick={() => navigate("/program/work-plans")}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Work Plans
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {workPlan.output}
            </h1>
            {workPlan.thematicArea && (
              <span className="inline-block mt-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded">
                {workPlan.thematicArea?.replace(/_/g, " ")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/program/work-plans/${workPlan.id}/edit`}
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
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Activity Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Activity
                </p>
                <p className="text-gray-900 dark:text-white whitespace-pre-line">
                  {workPlan.activity}
                </p>
              </div>

              {workPlan.implementationMethodology && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Implementation Methodology
                  </p>
                  <p className="text-gray-900 dark:text-white whitespace-pre-line">
                    {workPlan.implementationMethodology}
                  </p>
                </div>
              )}

              {workPlan.targetMatrix && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Target Matrix
                  </p>
                  <p className="text-gray-900 dark:text-white whitespace-pre-line">
                    {workPlan.targetMatrix}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Additional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workPlan.focalPoint && (
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Focal Point
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {workPlan.focalPoint}
                    </p>
                  </div>
                </div>
              )}

              {workPlan.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Location
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {workPlan.location}
                    </p>
                  </div>
                </div>
              )}

              {workPlan.complianceDocuments && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Compliance Documents
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {workPlan.complianceDocuments}
                  </p>
                </div>
              )}

              {workPlan.branding && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Branding
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {workPlan.branding}
                  </p>
                </div>
              )}
            </div>

            {workPlan.remarks && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Remarks
                </p>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {workPlan.remarks}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Project
            </h2>
            {project ? (
              <Link
                to={`/program/projects/${project.id}`}
                className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <span className="text-xs font-mono text-gray-500">
                      {project.projectCode}
                    </span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {project.projectName}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Project not found
              </p>
            )}
          </div>

          {/* Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Settings
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Reminder Days
                </span>
                <span className="text-gray-900 dark:text-white">
                  {workPlan.reminderDays} days
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
                <span className="text-gray-500 dark:text-gray-400">
                  Created
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(workPlan.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Last Updated
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(workPlan.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkPlanView;
