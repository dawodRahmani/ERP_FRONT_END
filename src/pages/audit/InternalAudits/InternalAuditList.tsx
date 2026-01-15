/**
 * Internal Audits List Page
 *
 * Displays all internal audits with filtering and search.
 */

import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Edit2, Trash2, Check, X, AlertCircle, Building2 } from 'lucide-react';
import { useInternalAuditsList, useDeleteInternalAudit } from '../../../hooks/audit';
import {
  AUDIT_STATUS_OPTIONS,
  AUDIT_FREQUENCY_OPTIONS,
  getStatusLabel,
  getStatusColor,
  getFrequencyLabel,
  formatDate,
} from '../../../data/audit';
import type { AuditStatus, AuditFrequency } from '../../../types/modules/audit';

const InternalAuditList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AuditStatus | ''>('');
  const [frequencyFilter, setFrequencyFilter] = useState<AuditFrequency | ''>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { data: audits = [], isLoading, error } = useInternalAuditsList();
  const deleteMutation = useDeleteInternalAudit();

  const filteredAudits = useMemo(() => {
    return audits.filter((item) => {
      const matchesSearch =
        item.auditNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.auditTypeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.auditEmployeeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.departmentsAudited.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesFrequency = !frequencyFilter || item.frequency === frequencyFilter;

      return matchesSearch && matchesStatus && matchesFrequency;
    });
  }, [audits, searchTerm, statusFilter, frequencyFilter]);

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete internal audit:', error);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          Error loading internal audits: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Internal Audits</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Audits conducted internally by VDO staff
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by number, type, employee, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
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

          <select
            value={frequencyFilter}
            onChange={(e) => setFrequencyFilter(e.target.value as AuditFrequency | '')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Frequencies</option>
            {AUDIT_FREQUENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Link
            to="/audit/internal/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Audit
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
                  Audit #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Departments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Planned Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Auditor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Follow-up
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
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredAudits.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm || statusFilter || frequencyFilter
                      ? 'No audits match your filters'
                      : 'No internal audits yet'}
                  </td>
                </tr>
              ) : (
                filteredAudits.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-gray-900 dark:text-white">
                        {item.auditNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {item.auditTypeName || `Type #${item.auditTypeId}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {item.departmentsAudited.slice(0, 2).map((dept, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                          >
                            <Building2 className="h-3 w-3" />
                            {dept}
                          </span>
                        ))}
                        {item.departmentsAudited.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                            +{item.departmentsAudited.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {getFrequencyLabel(item.frequency)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatDate(item.dateAuditPlanned)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {item.auditEmployeeName || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.followUpNeeded ? (
                        <span className="inline-flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">Required</span>
                        </span>
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
                            onClick={() => navigate(`/audit/internal/${item.id}`)}
                            className="text-gray-600 hover:text-gray-800 dark:text-gray-400"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/audit/internal/${item.id}?edit=true`)}
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

export default InternalAuditList;
