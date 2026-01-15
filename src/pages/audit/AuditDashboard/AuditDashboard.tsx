/**
 * Audit Dashboard Page
 *
 * Overview of all audit activities with statistics and widgets.
 */

import { Link } from 'react-router-dom';
import {
  BarChart3,
  ClipboardCheck,
  AlertTriangle,
  Clock,
  Building2,
  Users,
  FileSearch,
  TrendingUp,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { useAuditDashboardStats, useRecentAudits, useUpcomingAudits } from '../../../hooks/audit';
import { getStatusLabel, getStatusColor, formatDate } from '../../../data/audit';

const AuditDashboard: React.FC = () => {
  const { data: stats, isLoading: isLoadingStats } = useAuditDashboardStats();
  const { data: recentAudits = [], isLoading: isLoadingRecent } = useRecentAudits(5);
  const { data: upcomingAudits = [], isLoading: isLoadingUpcoming } = useUpcomingAudits(5);

  const statCards = [
    {
      title: 'Total Audits',
      value: stats?.totalAudits || 0,
      icon: ClipboardCheck,
      color: 'bg-blue-500',
      description: 'All audit records',
    },
    {
      title: 'In Progress',
      value: stats?.inProgressAudits || 0,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      description: 'Currently active audits',
    },
    {
      title: 'Completed',
      value: stats?.completedAudits || 0,
      icon: BarChart3,
      color: 'bg-green-500',
      description: 'Finished audits',
    },
    {
      title: 'Requiring Follow-up',
      value: stats?.auditsRequiringFollowUp || 0,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      description: 'Need attention',
    },
  ];

  const auditTypeCards = [
    {
      title: 'HACT Assessments',
      count: stats?.totalHACT || 0,
      link: '/audit/hact',
      icon: FileSearch,
      subtext: stats?.expiringHACT ? `${stats.expiringHACT} expiring soon` : undefined,
    },
    {
      title: 'Donor Project Audits',
      count: stats?.totalDonorProject || 0,
      link: '/audit/donor-project',
      icon: Building2,
    },
    {
      title: 'External Audits',
      count: stats?.totalExternal || 0,
      link: '/audit/external',
      icon: Users,
    },
    {
      title: 'Internal Audits',
      count: stats?.totalInternal || 0,
      link: '/audit/internal',
      icon: ClipboardCheck,
    },
    {
      title: 'Partner Audits',
      count: stats?.totalPartner || 0,
      link: '/audit/partner',
      icon: Users,
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Overview of all audit activities and compliance status
          </p>
        </div>
        <Link
          to="/audit/settings"
          className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {isLoadingStats ? '-' : stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {stat.description}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Corrective Actions Alert */}
      {(stats?.pendingCorrectiveActions || 0) > 0 || (stats?.overdueCorrectiveActions || 0) > 0 ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                Corrective Actions Pending
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                {stats?.pendingCorrectiveActions || 0} pending actions
                {(stats?.overdueCorrectiveActions || 0) > 0 && (
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {' '}({stats?.overdueCorrectiveActions} overdue)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Audit Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {auditTypeCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-3">
              <card.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {isLoadingStats ? '-' : card.count}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {card.title}
            </p>
            {card.subtext && (
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                {card.subtext}
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Audits */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Audits
            </h2>
          </div>
          <div className="p-6">
            {isLoadingRecent ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : recentAudits.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <ClipboardCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent audits</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAudits.map((audit) => (
                  <div
                    key={`${audit.auditCategory}-${audit.id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {audit.auditNumber || audit.assessmentNumber}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {audit.auditCategory} • {formatDate(audit.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        audit.status
                      )}`}
                    >
                      {getStatusLabel(audit.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Audits */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              Upcoming Audits
            </h2>
          </div>
          <div className="p-6">
            {isLoadingUpcoming ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : upcomingAudits.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming audits scheduled</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAudits.map((audit) => (
                  <div
                    key={`${audit.auditCategory}-${audit.id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {audit.auditNumber}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {audit.auditCategory}
                        {audit.partnerName && ` • ${audit.partnerName}`}
                        {audit.auditTypeName && ` • ${audit.auditTypeName}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {formatDate(audit.dateAuditPlanned)}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                          audit.status
                        )}`}
                      >
                        {getStatusLabel(audit.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/audit/hact/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            New HACT Assessment
          </Link>
          <Link
            to="/audit/donor-project/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            New Donor Project Audit
          </Link>
          <Link
            to="/audit/external/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            New External Audit
          </Link>
          <Link
            to="/audit/internal/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            New Internal Audit
          </Link>
          <Link
            to="/audit/partner/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            New Partner Audit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuditDashboard;
