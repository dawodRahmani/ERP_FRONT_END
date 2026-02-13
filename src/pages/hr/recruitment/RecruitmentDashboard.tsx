import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  MoreVertical
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecruitmentRecord {
  id: string;
  vacancyNumber: string;
  positionTitle: string;
  department: string;
  srfDate: string;
  announcementDate: string;
  closingDate: string;
  totalApplications: number;
  longlistedCandidates: number;
  shortlistedCandidates: number;
  interviewDate: string;
  selectedCandidate: string;
  offerDate: string;
  contractDate: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'announced' | 'longlisting' | 'shortlisting' | 'testing' | 'interviewing' | 'selected' | 'offer_sent' | 'offer_accepted' | 'background_check' | 'contract' | 'hired' | 'cancelled';
  remarks: string;
}

const statusConfig = {
  draft: { label: 'Draft', color: 'gray', icon: FileText },
  pending_approval: { label: 'Pending Approval', color: 'yellow', icon: Clock },
  approved: { label: 'Approved', color: 'blue', icon: CheckCircle },
  announced: { label: 'Announced', color: 'indigo', icon: FileText },
  longlisting: { label: 'Longlisting', color: 'purple', icon: Users },
  shortlisting: { label: 'Shortlisting', color: 'pink', icon: Users },
  testing: { label: 'Testing', color: 'orange', icon: FileText },
  interviewing: { label: 'Interviewing', color: 'cyan', icon: Users },
  selected: { label: 'Selected', color: 'teal', icon: CheckCircle },
  offer_sent: { label: 'Offer Sent', color: 'lime', icon: FileText },
  offer_accepted: { label: 'Offer Accepted', color: 'green', icon: CheckCircle },
  background_check: { label: 'Background Check', color: 'amber', icon: AlertCircle },
  contract: { label: 'Contract', color: 'emerald', icon: FileText },
  hired: { label: 'Hired', color: 'green', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'red', icon: AlertCircle },
};

const RecruitmentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [recruitments] = useState<RecruitmentRecord[]>([
    // Sample data - in real app this would come from state/API
  ]);

  const stats = [
    { label: 'Active Recruitments', value: 12, color: 'blue', icon: FileText },
    { label: 'Open Positions', value: 8, color: 'green', icon: Users },
    { label: 'Pending Approvals', value: 3, color: 'yellow', icon: Clock },
    { label: 'Hired This Month', value: 5, color: 'emerald', icon: CheckCircle },
  ];

  const getStatusBadge = (status: RecruitmentRecord['status']) => {
    const config = statusConfig[status];
    const colorClasses: Record<string, string> = {
      gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
      orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      cyan: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
      teal: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
      lime: 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-400',
      green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[config.color]}`}>
        {config.label}
      </span>
    );
  };

  const filteredRecruitments = recruitments.filter(r => {
    const matchesSearch = r.positionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vacancyNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recruitment Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Track and manage all recruitment activities
          </p>
        </div>
        <Link
          to="/hr/recruitment/terms-of-reference/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Recruitment
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses: Record<string, string> = {
            blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
            green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
            yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
            emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
          };
          return (
            <div
              key={index}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-full p-3 ${colorClasses[stat.color]}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'ToR', path: '/hr/recruitment/terms-of-reference', icon: FileText },
          { label: 'SRF', path: '/hr/recruitment/staff-requisition', icon: FileText },
          { label: 'Applications', path: '/hr/recruitment/applications', icon: Users },
          { label: 'RC Form', path: '/hr/recruitment/committee', icon: Users },
          { label: 'Interviews', path: '/hr/recruitment/interview', icon: Users },
          { label: 'Offers', path: '/hr/recruitment/offer-letter', icon: FileText },
        ].map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              to={action.path}
              className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Recruitment Tracker Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        {/* Table Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recruitment Tracker
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search positions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-9 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Status</option>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Vacancy #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Closing Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRecruitments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      No recruitment records found
                    </p>
                    <Link
                      to="/hr/recruitment/terms-of-reference/new"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600"
                    >
                      <Plus className="h-4 w-4" />
                      Start New Recruitment
                    </Link>
                  </td>
                </tr>
              ) : (
                filteredRecruitments.map((recruitment) => (
                  <tr key={recruitment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {recruitment.vacancyNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {recruitment.positionTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {recruitment.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {recruitment.totalApplications}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(recruitment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {recruitment.closingDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1 text-gray-500 hover:text-primary-500 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentDashboard;
