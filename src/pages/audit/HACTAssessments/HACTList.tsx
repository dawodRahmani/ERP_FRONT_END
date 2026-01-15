/**
 * HACT Assessments List Page
 *
 * Displays all HACT assessments with filtering and search.
 */

import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Edit2, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import { useHACTAssessmentsList, useDeleteHACTAssessment } from '../../../hooks/audit';
import { AUDIT_STATUS_OPTIONS, getStatusLabel, getStatusColor, formatDate } from '../../../data/audit';
import type { AuditStatus } from '../../../types/modules/audit';

const HACTList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AuditStatus | ''>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { data: assessments = [], isLoading, error } = useHACTAssessmentsList();
  const deleteMutation = useDeleteHACTAssessment();

  const filteredAssessments = useMemo(() => {
    return assessments.filter((item) => {
      const matchesSearch =
        item.assessmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.donorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.auditCompany.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [assessments, searchTerm, statusFilter]);

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete HACT assessment:', error);
    }
  };

  const isExpiringSoon = (validUntil?: string) => {
    if (!validUntil) return false;
    const daysUntil = Math.ceil(
      (new Date(validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntil > 0 && daysUntil <= 30;
  };

  const isExpired = (validUntil?: string) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          Error loading HACT assessments: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">HACT Assessments</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Harmonized Approach to Cash Transfers assessments
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by number, donor, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AuditStatus | '')}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Statuses</option>
              {AUDIT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Link
            to="/audit/hact/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Assessment
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Assessment #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Donor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Audit Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Valid Until
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredAssessments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm || statusFilter
                      ? 'No assessments match your filters'
                      : 'No HACT assessments yet'}
                  </td>
                </tr>
              ) : (
                filteredAssessments.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-gray-900 dark:text-white">
                        {item.assessmentNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {item.donorName || `Donor #${item.donorId}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {item.auditCompany}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(item.dateAssessmentStarted)}
                      </div>
                      {item.dateAssessmentEnded && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          to {formatDate(item.dateAssessmentEnded)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.validUntil ? (
                        <div className="flex items-center gap-1">
                          <span
                            className={`text-sm ${
                              isExpired(item.validUntil)
                                ? 'text-red-600 dark:text-red-400'
                                : isExpiringSoon(item.validUntil)
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            {formatDate(item.validUntil)}
                          </span>
                          {(isExpired(item.validUntil) || isExpiringSoon(item.validUntil)) && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {deleteConfirmId === item.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400"
                            title="Confirm delete"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-gray-600 hover:text-gray-800 dark:text-gray-400"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/audit/hact/${item.id}`)}
                            className="text-gray-600 hover:text-gray-800 dark:text-gray-400"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/audit/hact/${item.id}?edit=true`)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
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

export default HACTList;
