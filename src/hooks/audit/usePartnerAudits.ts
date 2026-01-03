/**
 * Partner Audits React Query Hooks
 *
 * Provides data fetching and mutations for partner audit management.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PartnerAuditRecord, AuditStatus, AuditModality, AuditSource } from '../../types/modules/audit';
import type { CreateInput, UpdateInput } from '../../types/db/base';
import { partnerAuditsDB } from '../../services/db/auditService';

// ========== QUERY KEYS ==========

export const partnerAuditKeys = {
  all: ['partnerAudits'] as const,
  lists: () => [...partnerAuditKeys.all, 'list'] as const,
  list: (filters?: string) => [...partnerAuditKeys.lists(), { filters }] as const,
  details: () => [...partnerAuditKeys.all, 'detail'] as const,
  detail: (id: number) => [...partnerAuditKeys.details(), id] as const,
  byPartner: (partnerName: string) => [...partnerAuditKeys.all, 'partner', partnerName] as const,
  byAuditType: (auditTypeId: number) => [...partnerAuditKeys.all, 'auditType', auditTypeId] as const,
  byModality: (modality: AuditModality) => [...partnerAuditKeys.all, 'modality', modality] as const,
  bySource: (source: AuditSource) => [...partnerAuditKeys.all, 'source', source] as const,
  byStatus: (status: AuditStatus) => [...partnerAuditKeys.all, 'status', status] as const,
  requireFollowUp: () => [...partnerAuditKeys.all, 'requireFollowUp'] as const,
  upcoming: (days?: number) => [...partnerAuditKeys.all, 'upcoming', days] as const,
};

// ========== QUERY HOOKS ==========

export const usePartnerAuditsList = () => {
  return useQuery({
    queryKey: partnerAuditKeys.lists(),
    queryFn: () => partnerAuditsDB.getAll(),
  });
};

export const usePartnerAuditDetail = (id: number) => {
  return useQuery({
    queryKey: partnerAuditKeys.detail(id),
    queryFn: () => partnerAuditsDB.getById(id),
    enabled: !!id && id > 0,
  });
};

export const usePartnerAuditsByPartner = (partnerName: string) => {
  return useQuery({
    queryKey: partnerAuditKeys.byPartner(partnerName),
    queryFn: () => partnerAuditsDB.getByPartner(partnerName),
    enabled: !!partnerName,
  });
};

export const usePartnerAuditsByType = (auditTypeId: number) => {
  return useQuery({
    queryKey: partnerAuditKeys.byAuditType(auditTypeId),
    queryFn: () => partnerAuditsDB.getByAuditType(auditTypeId),
    enabled: !!auditTypeId && auditTypeId > 0,
  });
};

export const usePartnerAuditsByModality = (modality: AuditModality) => {
  return useQuery({
    queryKey: partnerAuditKeys.byModality(modality),
    queryFn: () => partnerAuditsDB.getByModality(modality),
    enabled: !!modality,
  });
};

export const usePartnerAuditsBySource = (source: AuditSource) => {
  return useQuery({
    queryKey: partnerAuditKeys.bySource(source),
    queryFn: () => partnerAuditsDB.getBySource(source),
    enabled: !!source,
  });
};

export const usePartnerAuditsByStatus = (status: AuditStatus) => {
  return useQuery({
    queryKey: partnerAuditKeys.byStatus(status),
    queryFn: () => partnerAuditsDB.getByStatus(status),
    enabled: !!status,
  });
};

export const usePartnerAuditsRequiringFollowUp = () => {
  return useQuery({
    queryKey: partnerAuditKeys.requireFollowUp(),
    queryFn: () => partnerAuditsDB.getRequiringFollowUp(),
  });
};

export const useUpcomingPartnerAudits = (days = 30) => {
  return useQuery({
    queryKey: partnerAuditKeys.upcoming(days),
    queryFn: () => partnerAuditsDB.getUpcoming(days),
  });
};

// ========== MUTATION HOOKS ==========

export const useCreatePartnerAudit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInput<PartnerAuditRecord>) => {
      const auditNumber = await partnerAuditsDB.generateNumber();
      return partnerAuditsDB.create({ ...data, auditNumber });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerAuditKeys.all });
    },
  });
};

export const useUpdatePartnerAudit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInput<PartnerAuditRecord> }) => {
      return partnerAuditsDB.update(id, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: partnerAuditKeys.all });
      queryClient.invalidateQueries({ queryKey: partnerAuditKeys.detail(data.id) });
    },
  });
};

export const useDeletePartnerAudit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => partnerAuditsDB.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerAuditKeys.all });
    },
  });
};
