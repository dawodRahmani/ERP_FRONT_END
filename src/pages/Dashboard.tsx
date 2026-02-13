import { useState, useEffect } from 'react';
import {
  FileText,
  ClipboardCheck,
  Target,
  Scale,
  FileSearch2,
  Users
} from 'lucide-react';
import {
  complianceProjectDB,
  complianceDocumentDB,
  programProjectsDB,
  programDonorsDB,
  governanceBoardMembersDB,
  auditService
} from '../services/db/indexedDB';

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: 'Compliance Projects', value: 0, icon: ClipboardCheck, color: 'blue' },
    { title: 'Compliance Documents', value: 0, icon: FileText, color: 'purple' },
    { title: 'Program Projects', value: 0, icon: Target, color: 'green' },
    { title: 'Program Donors', value: 0, icon: Users, color: 'indigo' },
    { title: 'Board Members', value: 0, icon: Scale, color: 'pink' },
    { title: 'Total Audits', value: 0, icon: FileSearch2, color: 'red' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [
        complianceProjects,
        documents,
        projects,
        donors,
        boardMembers,
        auditStats
      ] = await Promise.all([
        complianceProjectDB.getAll(),
        complianceDocumentDB.getAll(),
        programProjectsDB.getAll(),
        programDonorsDB.getAll(),
        governanceBoardMembersDB.getAll(),
        auditService.getDashboardStats()
      ]);

      const activeComplianceProjects = complianceProjects.filter(p => p.status === 'in_progress' || p.status === 'pending').length;
      const activeDocuments = documents.filter(d => d.status === 'approved').length;
      const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'ongoing').length;
      const activeDonors = donors.filter(d => d.status === 'active').length;
      const activeBoardMembers = boardMembers.filter(m => m.status === 'active').length;

      setStats([
        { title: 'Compliance Projects', value: activeComplianceProjects, icon: ClipboardCheck, color: 'blue' },
        { title: 'Compliance Documents', value: activeDocuments, icon: FileText, color: 'purple' },
        { title: 'Program Projects', value: activeProjects, icon: Target, color: 'green' },
        { title: 'Active Donors', value: activeDonors, icon: Users, color: 'indigo' },
        { title: 'Board Members', value: activeBoardMembers, icon: Scale, color: 'pink' },
        { title: 'Total Audits', value: auditStats.totalAudits, icon: FileSearch2, color: 'red' },
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <img
          src="/logo.png"
          alt="VDO Logo"
          className="h-16 w-16 object-contain"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Welcome back! Here's an overview of your organization.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`rounded-full p-3 ${colorClasses[stat.color]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
