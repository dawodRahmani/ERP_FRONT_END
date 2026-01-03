/**
 * External Audits React Query Hooks
 *
 * Provides data fetching and mutations for external audit management.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ExternalAuditRecord, ExternalAnnualAuditRecord, AuditStatus } from '../../types/modules/audit';
import type { CreateInput, UpdateInput } from '../../types/db/base';
import { externalAuditsDB } from '../../services/db/auditService';

// ========== QUERY KEYS ==========

export const externalAuditKeys = {
  all: ['externalAudits'] as const,
  lists: () => [...externalAuditKeys.all, 'list'] as const,
  list: (filters?: string) => [...externalAuditKeys.lists(), { filters }] as const,
  details: () => [...externalAuditKeys.all, 'detail'] as const,
  detail: (id: number) => [...externalAuditKeys.details(), id] as const,
  byAuditType: (auditTypeId: number) => [...externalAuditKeys.all, 'auditType', auditTypeId] as const,
  byStatus: (status: AuditStatus) => [...externalAuditKeys.all, 'status', status] as const,
  requireFollowUp: () => [...externalAuditKeys.all, 'requireFollowUp'] as const,
  upcoming: (days?: number) => [...externalAuditKeys.all, 'upcoming', days] as const,
  // Annual audits
  annualAudits: (externalAuditId: number) => [...externalAuditKeys.all, 'annual', externalAuditId] as const,
  annualByYear: (year: number) => [...externalAuditKeys.all, 'annual', 'year', year] as const,
};

// ========== QUERY HOOKS ==========

export const useExternalAuditsList = () => {
  return useQuery({
    queryKey: externalAuditKeys.lists(),
    queryFn: () => externalAuditsDB.getAll(),
  });
};

export const useExternalAuditDetail = (id: number) => {
  return useQuery({
    queryKey: externalAuditKeys.detail(id),
    queryFn: () => externalAuditsDB.getById(id),
    enabled: !!id && id > 0,
  });
};

export const useExternalAuditsByType = (auditTypeId: number) => {
  return useQuery({
    queryKey: externalAuditKeys.byAuditType(auditTypeId),
    queryFn: () => externalAuditsDB.getByAuditType(auditTypeId),
    enabled: !!auditTypeId && auditTypeId > 0,
  });
};

export const useExternalAuditsByStatus = (status: AuditStatus) => {
  return useQuery({
    queryKey: externalAuditKeys.byStatus(status),
    queryFn: () => externalAuditsDB.getByStatus(status),
    enabled: !!status,
  });
};

export const useExternalAuditsRequiringFollowUp = () => {
  return useQuery({
    queryKey: externalAuditKeys.requireFollowUp(),
    queryFn: () => externalAuditsDB.getRequiringFollowUp(),
  });
};

export const useUpcomingExternalAudits = (days = 30) => {
  return useQuery({
    queryKey: externalAuditKeys.upcoming(days),
    queryFn: () => externalAuditsDB.getUpcoming(days),
  });
};

// ========== ANNUAL AUDIT HOOKS ==========

export const useExternalAnnualAudits = (externalAuditId: number) => {
  return useQuery({
    queryKey: externalAuditKeys.annualAudits(externalAuditId),
    queryFn: () => externalAuditsDB.annualAudits.getByExternalAudit(externalAuditId),
    enabled: !!externalAuditId && externalAuditId > 0,
  });
};

export const useExternalAnnualAuditsByYear = (year: number) => {
  return useQuery({
    queryKey: externalAuditKeys.annualByYear(year),
    queryFn: () => externalAuditsDB.annualAudits.getByYear(year),
    enabled: !!year,
  });
};

// ========== MUTATION HOOKS ==========

export const useCreateExternalAudit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInput<ExternalAuditRecord>) => {
      const auditNumber = await externalAuditsDB.generateNumber();
      return externalAuditsDB.create({ ...data, auditNumber });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: externalAuditKeys.all });
    },
  });
};

export const useUpdateExternalAudit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInput<ExternalAuditRecord> }) => {
      return externalAuditsDB.update(id, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: externalAuditKeys.all });
      queryClient.invalidateQueries({ queryKey: externalAuditKeys.detail(data.id) });
    },
  });
};

export const useDeleteExternalAudit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => externalAuditsDB.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: externalAuditKeys.all });
    },
  });
};

// ========== ANNUAL AUDIT MUTATIONS ==========

export const useCreateExternalAnnualAudit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInput<ExternalAnnualAuditRecord>) => {
      return externalAuditsDB.annualAudits.create(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: externalAuditKeys.annualAudits(data.externalAuditId) });
    },
  });
};

export const useUpdateExternalAnnualAudit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInput<ExternalAnnualAuditRecord> }) => {
      return externalAuditsDB.annualAudits.update(id, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: externalAuditKeys.annualAudits(data.externalAuditId) });
    },
  });
};

export const useDeleteExternalAnnualAudit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, externalAuditId }: { id: number; externalAuditId: number }) => {
      return externalAuditsDB.annualAudits.delete(id).then(() => externalAuditId);
    },
    onSuccess: (externalAuditId) => {
      queryClient.invalidateQueries({ queryKey: externalAuditKeys.annualAudits(externalAuditId) });
    },
  });
};
