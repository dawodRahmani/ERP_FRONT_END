/**
 * Audit Types React Query Hooks
 *
 * Provides data fetching and mutations for audit type management.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AuditTypeRecord, AuditTypeCategory } from '../../types/modules/audit';
import type { CreateInput, UpdateInput } from '../../types/db/base';
import { auditTypesDB } from '../../services/db/auditService';

// ========== QUERY KEYS ==========

export const auditTypeKeys = {
  all: ['auditTypes'] as const,
  lists: () => [...auditTypeKeys.all, 'list'] as const,
  list: (filters?: string) => [...auditTypeKeys.lists(), { filters }] as const,
  details: () => [...auditTypeKeys.all, 'detail'] as const,
  detail: (id: number) => [...auditTypeKeys.details(), id] as const,
  active: () => [...auditTypeKeys.all, 'active'] as const,
  byCategory: (category: AuditTypeCategory) => [...auditTypeKeys.all, 'category', category] as const,
};

// ========== QUERY HOOKS ==========

export const useAuditTypesList = () => {
  return useQuery({
    queryKey: auditTypeKeys.lists(),
    queryFn: () => auditTypesDB.getAll(),
  });
};

export const useActiveAuditTypes = () => {
  return useQuery({
    queryKey: auditTypeKeys.active(),
    queryFn: () => auditTypesDB.getActive(),
  });
};

export const useAuditTypesByCategory = (category: AuditTypeCategory) => {
  return useQuery({
    queryKey: auditTypeKeys.byCategory(category),
    queryFn: () => auditTypesDB.getByCategory(category),
    enabled: !!category,
  });
};

export const useAuditTypeDetail = (id: number) => {
  return useQuery({
    queryKey: auditTypeKeys.detail(id),
    queryFn: () => auditTypesDB.getById(id),
    enabled: !!id && id > 0,
  });
};

// ========== MUTATION HOOKS ==========

export const useCreateAuditType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInput<AuditTypeRecord>) => {
      const code = await auditTypesDB.generateCode();
      return auditTypesDB.create({ ...data, code });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auditTypeKeys.all });
    },
  });
};

export const useUpdateAuditType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInput<AuditTypeRecord> }) => {
      return auditTypesDB.update(id, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: auditTypeKeys.all });
      queryClient.invalidateQueries({ queryKey: auditTypeKeys.detail(data.id) });
    },
  });
};

export const useDeleteAuditType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => auditTypesDB.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auditTypeKeys.all });
    },
  });
};

// ========== UTILITY HOOKS ==========

export const useGenerateAuditTypeCode = () => {
  return useQuery({
    queryKey: [...auditTypeKeys.all, 'generateCode'],
    queryFn: () => auditTypesDB.generateCode(),
  });
};
