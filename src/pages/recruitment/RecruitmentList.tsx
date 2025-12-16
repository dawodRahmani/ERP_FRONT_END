import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  RefreshCw,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Zap,
  Briefcase,
  UserCheck,
  Calendar,
} from "lucide-react";
import { useRecruitment } from "../../contexts/RecruitmentContext";
import StatusBadge from "../../components/recruitment/StatusBadge";
import Modal from "../../components/Modal";
import seedCompleteRecruitment from "../../services/db/seedRecruitment";

// ==================== TYPES ====================

interface Recruitment {
  id: number;
  recruitmentCode: string;
  positionTitle: string;
  hiringApproach: string;
  status: string;
  currentStep: number;
  createdAt: string;
  applications?: Application[];
}

interface Application {
  id: number;
  recruitmentId: number;
  status: string;
}

interface RecruitmentStats {
  total: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  // New stats
  totalApplications: number;
  openPositions: number;
  shortlisted: number;
  interviewsScheduled: number;
}

interface StatCard {
  title: string;
  value: number;
  icon: React.FC<{ className?: string }>;
  color: string;
  bgColor: string;
}

// ==================== COMPONENT ====================

const RecruitmentList: React.FC = () => {
  const navigate = useNavigate();
  const {
    recruitments,
    loading,
    error,
    stats,
    fetchRecruitments,
    fetchStats,
    deleteRecruitment,
    filterByStatus,
    RECRUITMENT_STATUS,
  } = useRecruitment();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredRecruitments, setFilteredRecruitments] = useState<
    Recruitment[]
  >([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recruitmentToDelete, setRecruitmentToDelete] =
    useState<Recruitment | null>(null);
  const [seeding, setSeeding] = useState(false);

  // Filter and search
  useEffect(() => {
    const filterData = async () => {
      let result = recruitments as Recruitment[];

      if (statusFilter !== "all") {
        result = (await filterByStatus(statusFilter)) as Recruitment[];
      }

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        result = result.filter(
          (r) =>
            r.recruitmentCode?.toLowerCase().includes(searchLower) ||
            r.positionTitle?.toLowerCase().includes(searchLower)
        );
      }

      setFilteredRecruitments(result);
    };
    filterData();
  }, [recruitments, searchTerm, statusFilter, filterByStatus]);

  const handleRefresh = useCallback(async () => {
    await fetchRecruitments();
    await fetchStats();
  }, [fetchRecruitments, fetchStats]);

  const handleDelete = useCallback(async () => {
    if (recruitmentToDelete) {
      await deleteRecruitment(recruitmentToDelete.id);
      setDeleteModalOpen(false);
      setRecruitmentToDelete(null);
      await fetchStats();
    }
  }, [recruitmentToDelete, deleteRecruitment, fetchStats]);

  const openDeleteModal = useCallback((recruitment: Recruitment) => {
    setRecruitmentToDelete(recruitment);
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setRecruitmentToDelete(null);
  }, []);

  const handleSeedDemoData = useCallback(async () => {
    setSeeding(true);
    try {
      const result = await seedCompleteRecruitment();
      alert(
        `Demo recruitment created successfully!\n\nRecruitment Code: ${result.recruitment.recruitmentCode}\nHired Candidate: ${result.topCandidate.fullName}\n\nTotal Applications: ${result.stats.totalApplications}\nLonglisted: ${result.stats.longlisted}\nShortlisted: ${result.stats.shortlisted}\nTested: ${result.stats.tested}\nInterviewed: ${result.stats.interviewed}`
      );
      await fetchRecruitments();
      await fetchStats();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      alert(`Error seeding demo data: ${errorMessage}`);
    } finally {
      setSeeding(false);
    }
  }, [fetchRecruitments, fetchStats]);

  // Calculate stats from recruitments data
  const calculatedStats = useMemo((): RecruitmentStats => {
    const typedRecruitments = recruitments as Recruitment[];

    // Count total applications across all recruitments
    let totalApplications = 0;
    let shortlisted = 0;
    let interviewsScheduled = 0;

    typedRecruitments.forEach((r) => {
      if (r.applications) {
        totalApplications += r.applications.length;
        // Count shortlisted candidates (those who passed initial screening)
        shortlisted += r.applications.filter(
          (a) =>
            a.status === "shortlisted" ||
            a.status === "interviewed" ||
            a.status === "hired"
        ).length;
        // Count interviews scheduled
        interviewsScheduled += r.applications.filter(
          (a) => a.status === "interview_scheduled" || a.status === "interviewed"
        ).length;
      }
    });

    // Count open positions (recruitments that are in progress)
    const openPositions = typedRecruitments.filter(
      (r) => r.status === "in_progress" || r.status === "draft"
    ).length;

    return {
      total: stats?.total || typedRecruitments.length,
      inProgress: stats?.inProgress || 0,
      completed: stats?.completed || 0,
      cancelled: stats?.cancelled || 0,
      totalApplications: stats?.totalApplications || totalApplications,
      openPositions: stats?.openPositions || openPositions,
      shortlisted: stats?.shortlisted || shortlisted,
      interviewsScheduled: stats?.interviewsScheduled || interviewsScheduled,
    };
  }, [recruitments, stats]);

  // Updated stat cards with new metrics
  const statCards: StatCard[] = useMemo(
    () => [
      {
        title: "Total Applications",
        value: calculatedStats.totalApplications,
        icon: FileText,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
      },
      {
        title: "Open Positions",
        value: calculatedStats.openPositions,
        icon: Briefcase,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900/30",
      },
      {
        title: "Shortlisted",
        value: calculatedStats.shortlisted,
        icon: UserCheck,
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
      },
      {
        title: "Interviews Scheduled",
        value: calculatedStats.interviewsScheduled,
        icon: Calendar,
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
      },
    ],
    [calculatedStats]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recruitment Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage the complete 15-step recruitment process
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={handleSeedDemoData}
            disabled={seeding}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            title="Create a complete demo recruitment with all 15 steps filled"
          >
            <Zap className={`w-4 h-4 ${seeding ? "animate-pulse" : ""}`} />
            {seeding ? "Creating..." : "Seed Demo"}
          </button>
          <button
            onClick={() => navigate("/recruitment/new")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Recruitment
          </button>
        </div>
      </div>

      {/* Stats Cards - Updated with new metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by code or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              {Object.entries(RECRUITMENT_STATUS).map(([key, value]) => (
                <option key={value} value={value}>
                  {key.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Recruitments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500" />
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Loading recruitments...
            </p>
          </div>
        ) : filteredRecruitments.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              No recruitments found
            </h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating a new recruitment"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <button
                onClick={() => navigate("/recruitment/new")}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create First Recruitment
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRecruitments.map((recruitment) => (
                  <tr
                    key={recruitment.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-medium text-blue-600 dark:text-blue-400">
                        {recruitment.recruitmentCode}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {recruitment.positionTitle || "Not set"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {recruitment.hiringApproach?.replace(/_/g, " ") ||
                          "Open Competition"}
                      </p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={recruitment.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Step {recruitment.currentStep}/15
                        </span>
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{
                              width: `${(recruitment.currentStep / 15) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(recruitment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/recruitment/${recruitment.id}`)
                          }
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(recruitment)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Recruitment"
      >
        <div className="p-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete recruitment{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {recruitmentToDelete?.recruitmentCode}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={closeDeleteModal}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RecruitmentList;
