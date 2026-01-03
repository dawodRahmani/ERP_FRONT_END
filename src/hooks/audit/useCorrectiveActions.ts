/**
 * Corrective Actions React Query Hooks
 *
 * Provides data fetching and mutations for corrective action management.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CorrectiveActionRecord, AuditEntityType, CorrectiveActionStatus } from '../../types/modules/audit';
import type { CreateInput, UpdateInput } from '../../types/db/base';
import { correctiveActionsDB } from '../../services/db/auditService';

// ========== QUERY KEYS ==========

export const correctiveActionKeys = {
  all: ['correctiveActions'] as const,
  lists: () => [...correctiveActionKeys.all, 'list'] as const,
  list: (filters?: string) => [...correctiveActionKeys.lists(), { filters }] as const,
  details: () => [...correctiveActionKeys.all, 'detail'] as const,
  detail: (id: number) => [...correctiveActionKeys.details(), id] as const,
  byAudit: (auditEntityType: AuditEntityType, auditId: number) =>
    [...correctiveActionKeys.all, 'audit', auditEntityType, auditId] as const,
  byStatus: (status: CorrectiveActionStatus) => [...correctiveActionKeys.all, 'status', status] as const,
  overdue: () => [...correctiveActionKeys.all, 'overdue'] as const,
  pending: () => [...correctiveActionKeys.all, 'pending'] as const,
  inProgress: () => [...correctiveActionKeys.all, 'inProgress'] as const,
  dueSoon: (days?: number) => [...correctiveActionKeys.all, 'dueSoon', days] as const,
};

// ========== QUERY HOOKS ==========

export const useCorrectiveActionsList = () => {
  return useQuery({
    queryKey: correctiveActionKeys.lists(),
    queryFn: () => correctiveActionsDB.getAll(),
  });
};

export const useCorrectiveActionDetail = (id: number) => {
  return useQuery({
    queryKey: correctiveActionKeys.detail(id),
    queryFn: () => correctiveActionsDB.getById(id),
    enabled: !!id && id > 0,
  });
};

export const useCorrectiveActionsByAudit = (auditEntityType: AuditEntityType, auditId: number) => {
  return useQuery({
    queryKey: correctiveActionKeys.byAudit(auditEntityType, auditId),
    queryFn: () => correctiveActionsDB.getByAudit(auditEntityType, auditId),
    enabled: !!auditEntityType && !!auditId && auditId > 0,
  });
};

export const useCorrectiveActionsByStatus = (status: CorrectiveActionStatus) => {
  return useQuery({
    queryKey: correctiveActionKeys.byStatus(status),
    queryFn: () => correctiveActionsDB.getByStatus(status),
    enabled: !!status,
  });
};

export const useOverdueCorrectiveActions = () => {
  return useQuery({
    queryKey: correctiveActionKeys.overdue(),
    queryFn: () => correctiveActionsDB.getOverdue(),
  });
};

export const usePendingCorrectiveActions = () => {
  return useQuery({
    queryKey: correctiveActionKeys.pending(),
    queryFn: () => correctiveActionsDB.getPending(),
  });
};

export const useInProgressCorrectiveActions = () => {
  return useQuery({
    queryKey: correctiveActionKeys.inProgress(),
    queryFn: () => correctiveActionsDB.getInProgress(),
  });
};

export const useCorrectiveActionsDueSoon = (days = 7) => {
  return useQuery({
    queryKey: correctiveActionKeys.dueSoon(days),
    queryFn: () => correctiveActionsDB.getDueSoon(days),
  });
};

// ========== MUTATION HOOKS ==========

export const useCreateCorrectiveAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInput<CorrectiveActionRecord>) => {
      return correctiveActionsDB.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: correctiveActionKeys.all });
    },
  });
};

export const useUpdateCorrectiveAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInput<CorrectiveActionRecord> }) => {
      return correctiveActionsDB.update(id, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: correctiveActionKeys.all });
      queryClient.invalidateQueries({ queryKey: correctiveActionKeys.detail(data.id) });
    },
  });
};

export const useDeleteCorrectiveAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => correctiveActionsDB.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: correctiveActionKeys.all });
    },
  });
};
