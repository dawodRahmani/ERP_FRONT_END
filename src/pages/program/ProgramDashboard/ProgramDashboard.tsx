/**
 * Program Dashboard Page
 *
 * Overview of program module with stats, upcoming deadlines, and recent activities.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  FolderOpen,
  ClipboardList,
  FileText,
  Users,
  Shield,
  AlertCircle,
  Calendar,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { programDashboardService } from '../../../services/db/programService';
import { formatDate, getReminderColor, formatDaysUntilDue } from '../../../data/program';

interface DashboardStats {
  totalDonors: number;
  activeDonors: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalWorkPlans: number;
  totalCertificates: number;
  totalDocuments: number;
  totalReports: number;
  pendingReports: number;
  overdueReports: number;
  totalBeneficiaries: number;
  verifiedBeneficiaries: number;
  pendingBeneficiaries: number;
  totalSafeguarding: number;
  pendingSafeguarding: number;
  overdueSafeguarding: number;
}

interface Deadline {
  type: string;
  title: string;
  dueDate: string;
  projectId?: number;
  projectName?: string;
  id: number;
}

interface Activity {
  type: string;
  title: string;
  date: string;
  id: number;
}

const ProgramDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, deadlinesData, activitiesData] = await Promise.all([
        programDashboardService.getStats(),
        programDashboardService.getUpcomingDeadlines(30),
        programDashboardService.getRecentActivities(10),
      ]);
      setStats(statsData);
      setDeadlines(deadlinesData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDeadlineColor = (dueDate: string) => {
    const color = getReminderColor(dueDate, 15);
    const classes = {
      red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
      green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    };
    return classes[color];
  };

  const getDeadlineLink = (deadline: Deadline) => {
    switch (deadline.type) {
      case 'report':
        return `/program/reporting/${deadline.id}`;
      case 'safeguarding':
        return `/program/safeguarding/${deadline.id}`;
      case 'project_end':
        return `/program/projects/${deadline.id}`;
      default:
        return '/program';
    }
  };

  const getActivityLink = (activity: Activity) => {
    switch (activity.type) {
      case 'document':
        return `/program/documents/${activity.id}`;
      case 'beneficiary':
        return `/program/beneficiaries/${activity.id}`;
      case 'report_submitted':
        return `/program/reporting/${activity.id}`;
      default:
        return '/program';
    }
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Program Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Overview of program management
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Link
          to="/program/donors"
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.activeDonors || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Donors</p>
            </div>
          </div>
        </Link>

        <Link
          to="/program/projects"
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <FolderOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.activeProjects || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
            </div>
          </div>
        </Link>

        <Link
          to="/program/reporting?status=pending"
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <FileText className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.pendingReports || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Reports</p>
            </div>
          </div>
        </Link>

        <Link
          to="/program/beneficiaries"
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalBeneficiaries || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Beneficiaries</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Alerts */}
      {((stats?.overdueReports || 0) > 0 || (stats?.overdueSafeguarding || 0) > 0) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">Attention Required</p>
              <p className="text-sm text-red-600 dark:text-red-300">
                You have {stats?.overdueReports || 0} overdue report(s) and{' '}
                {stats?.overdueSafeguarding || 0} overdue safeguarding activity(ies).
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upcoming Deadlines
              </h2>
              <Link
                to="/program/reporting"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="p-4">
              {deadlines.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No upcoming deadlines</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {deadlines.slice(0, 8).map((deadline, index) => (
                    <Link
                      key={`${deadline.type}-${deadline.id}-${index}`}
                      to={getDeadlineLink(deadline)}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{deadline.title}</p>
                        {deadline.projectName && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {deadline.projectName}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getDeadlineColor(deadline.dueDate)}`}>
                          {formatDate(deadline.dueDate)}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDaysUntilDue(deadline.dueDate)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats & Recent Activity */}
        <div className="space-y-6">
          {/* Module Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Module Overview
            </h2>
            <div className="space-y-3">
              <Link
                to="/program/work-plans"
                className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
              >
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Work Plans</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats?.totalWorkPlans || 0}
                </span>
              </Link>
              <Link
                to="/program/certificates"
                className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Certificates</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats?.totalCertificates || 0}
                </span>
              </Link>
              <Link
                to="/program/documents"
                className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
              >
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Documents</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats?.totalDocuments || 0}
                </span>
              </Link>
              <Link
                to="/program/safeguarding"
                className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Safeguarding</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats?.totalSafeguarding || 0}
                </span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            {activities.length === 0 ? (
              <div className="text-center py-4">
                <TrendingUp className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity, index) => (
                  <Link
                    key={`${activity.type}-${activity.id}-${index}`}
                    to={getActivityLink(activity)}
                    className="block p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(activity.date)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDashboard;
