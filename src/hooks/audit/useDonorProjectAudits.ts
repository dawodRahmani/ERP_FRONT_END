/**
 * Donor Project Audits React Query Hooks
 *
 * Provides data fetching and mutations for donor project audit management.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { DonorProjectAuditRecord, AuditStatus } from '../../types/modules/audit';
import type { CreateInput, UpdateInput } from '../../types/db/base';
import { donorProjectAuditsDB } from '../../services/db/auditService';

// ========== QUERY KEYS ==========

export const donorProjectAuditKeys = {
  all: ['donorProjectAudits'] as const,
  lists: () => [...donorProjectAuditKeys.all, 'list'] as const,
  list: (filters?: string) => [...donorProjectAuditKeys.lists(), { filters }] as const,
  details: () => [...donorProjectAuditKeys.all, 'detail'] as const,
  detail: (id: number) => [...donorProjectAuditKeys.details(), id] as const,
  byDonor: (donorId: number) => [...donorProjectAuditKeys.all, 'donor', donorId] as const,
  byProject: (projectId: number) => [...donorProjectAuditKeys.all, 'project', projectId] as const,
  byStatus: (status: AuditStatus) => [...donorProjectAuditKeys.all, 'status', status] as const,
};

// ========== QUERY HOOKS ==========

export const useDonorProjectAuditsList = () => {
  return useQuery({
    queryKey: donorProjectAuditKeys.lists(),
    queryFn: () => donorProjectAuditsDB.getAll(),
  });
};

export const useDonorProjectAuditDetail = (id: number) => {
  return useQuery({
    queryKey: donorProjectAuditKeys.detail(id),
    queryFn: () => donorProjectAuditsDB.getById(id),
    enabled: !!id && id > 0,
  });
};

export const useDonorProjectAuditsByDonor = (donorId: number) => {
  return useQuery({
    queryKey: donorProjectAuditKeys.byDonor(donorId),
    queryFn: () => donorProjectAuditsDB.getByDonor(donorId),
    enabled: !!donorId && donorId > 0,
  });
};

export const useDonorProjectAuditsByProject = (projectId: number) => {
  return useQuery({
    queryKey: donorProjectAuditKeys.byProject(projectId),
    queryFn: () => donorProjectAuditsDB.getByProject(projectId),
    enabled: !!projectId && projectId > 0,
  });
};

export const useDonorProjectAuditsByStatus = (status: AuditStatus) => {
  return useQuery({
    queryKey: donorProjectAuditKeys.byStatus(status),
    queryFn: () => donorProjectAuditsDB.getByStatus(status),
    enabled: !!status,
  });
};

// ========== MUTATION HOOKS ==========

export const useCreateDonorProjectAudit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInput<DonorProjectAuditRecord>) => {
      const auditNumber = await donorProjectAuditsDB.generateNumber();
      return donorProjectAuditsDB.create({ ...data, auditNumber });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donorProjectAuditKeys.all });
    },
  });
};

export const useUpdateDonorProjectAudit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInput<DonorProjectAuditRecord> }) => {
      return donorProjectAuditsDB.update(id, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: donorProjectAuditKeys.all });
      queryClient.invalidateQueries({ queryKey: donorProjectAuditKeys.detail(data.id) });
    },
  });
};

export const useDeleteDonorProjectAudit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => donorProjectAuditsDB.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donorProjectAuditKeys.all });
    },
  });
};
