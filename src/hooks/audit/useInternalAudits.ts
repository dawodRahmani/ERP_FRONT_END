/**
 * Internal Audits React Query Hooks
 *
 * Provides data fetching and mutations for internal audit management.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InternalAuditRecord, InternalQuarterlyReportRecord, AuditStatus } from '../../types/modules/audit';
import type { CreateInput, UpdateInput } from '../../types/db/base';
import { internalAuditsDB } from '../../services/db/auditService';

// ========== QUERY KEYS ==========

export const internalAuditKeys = {
  all: ['internalAudits'] as const,
  lists: () => [...internalAuditKeys.all, 'list'] as const,
  list: (filters?: string) => [...internalAuditKeys.lists(), { filters }] as const,
  details: () => [...internalAuditKeys.all, 'detail'] as const,
  detail: (id: number) => [...internalAuditKeys.details(), id] as const,
  byAuditType: (auditTypeId: number) => [...internalAuditKeys.all, 'auditType', auditTypeId] as const,
  byDonor: (donorId: number) => [...internalAuditKeys.all, 'donor', donorId] as const,
  byProject: (projectId: number) => [...internalAuditKeys.all, 'project', projectId] as const,
  byStatus: (status: AuditStatus) => [...internalAuditKeys.all, 'status', status] as const,
  requireFollowUp: () => [...internalAuditKeys.all, 'requireFollowUp'] as const,
  upcoming: (days?: number) => [...internalAuditKeys.all, 'upcoming', days] as const,
  // Quarterly reports
  quarterlyReports: (internalAuditId: number) => [...internalAuditKeys.all, 'quarterly', internalAuditId] as const,
  quarterlyByYear: (year: number) => [...internalAuditKeys.all, 'quarterly', 'year', year] as const,
};

// ========== QUERY HOOKS ==========

export const useInternalAuditsList = () => {
  return useQuery({
    queryKey: internalAuditKeys.lists(),
    queryFn: () => internalAuditsDB.getAll(),
  });
};

export const useInternalAuditDetail = (id: number) => {
  return useQuery({
    queryKey: internalAuditKeys.detail(id),
    queryFn: () => internalAuditsDB.getById(id),
    enabled: !!id && id > 0,
  });
};

export const useInternalAuditsByType = (auditTypeId: number) => {
  return useQuery({
    queryKey: internalAuditKeys.byAuditType(auditTypeId),
    queryFn: () => internalAuditsDB.getByAuditType(auditTypeId),
    enabled: !!auditTypeId && auditTypeId > 0,
  });
};

export const useInternalAuditsByDonor = (donorId: number) => {
  return useQuery({
    queryKey: internalAuditKeys.byDonor(donorId),
    queryFn: () => internalAuditsDB.getByDonor(donorId),
    enabled: !!donorId && donorId > 0,
  });
};

export const useInternalAuditsByProject = (projectId: number) => {
  return useQuery({
    queryKey: internalAuditKeys.byProject(projectId),
    queryFn: () => internalAuditsDB.getByProject(projectId),
    enabled: !!projectId && projectId > 0,
  });
};

export const useInternalAuditsByStatus = (status: AuditStatus) => {
  return useQuery({
    queryKey: internalAuditKeys.byStatus(status),
    queryFn: () => internalAuditsDB.getByStatus(status),
    enabled: !!status,
  });
};

export const useInternalAuditsRequiringFollowUp = () => {
  return useQuery({
    queryKey: internalAuditKeys.requireFollowUp(),
    queryFn: () => internalAuditsDB.getRequiringFollowUp(),
  });
};

export const useUpcomingInternalAudits = (days = 30) => {
  return useQuery({
    queryKey: internalAuditKeys.upcoming(days),
    queryFn: () => internalAuditsDB.getUpcoming(days),
  });
};

// ========== QUARTERLY REPORT HOOKS ==========

export const useInternalQuarterlyReports = (internalAuditId: number) => {
  return useQuery({
    queryKey: internalAuditKeys.quarterlyReports(internalAuditId),
    queryFn: () => internalAuditsDB.quarterlyReports.getByInternalAudit(internalAuditId),
    enabled: !!internalAuditId && internalAuditId > 0,
  });
};

export const useInternalQuarterlyReportsByYear = (year: number) => {
  return useQuery({
    queryKey: internalAuditKeys.quarterlyByYear(year),
    queryFn: () => internalAuditsDB.quarterlyReports.getByYear(year),
    enabled: !!year,
  });
};

// ========== MUTATION HOOKS ==========

export const useCreateInternalAudit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInput<InternalAuditRecord>) => {
      const auditNumber = await internalAuditsDB.generateNumber();
      return internalAuditsDB.create({ ...data, auditNumber });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: internalAuditKeys.all });
    },
  });
};

export const useUpdateInternalAudit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInput<InternalAuditRecord> }) => {
      return internalAuditsDB.update(id, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: internalAuditKeys.all });
      queryClient.invalidateQueries({ queryKey: internalAuditKeys.detail(data.id) });
    },
  });
};

export const useDeleteInternalAudit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => internalAuditsDB.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: internalAuditKeys.all });
    },
  });
};

// ========== QUARTERLY REPORT MUTATIONS ==========

export const useCreateInternalQuarterlyReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInput<InternalQuarterlyReportRecord>) => {
      return internalAuditsDB.quarterlyReports.create(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: internalAuditKeys.quarterlyReports(data.internalAuditId) });
    },
  });
};

export const useUpdateInternalQuarterlyReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInput<InternalQuarterlyReportRecord> }) => {
      return internalAuditsDB.quarterlyReports.update(id, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: internalAuditKeys.quarterlyReports(data.internalAuditId) });
    },
  });
};

export const useDeleteInternalQuarterlyReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, internalAuditId }: { id: number; internalAuditId: number }) => {
      return internalAuditsDB.quarterlyReports.delete(id).then(() => internalAuditId);
    },
    onSuccess: (internalAuditId) => {
      queryClient.invalidateQueries({ queryKey: internalAuditKeys.quarterlyReports(internalAuditId) });
    },
  });
};
