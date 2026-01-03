/**
 * HACT Assessments React Query Hooks
 *
 * Provides data fetching and mutations for HACT assessment management.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { HACTAssessmentRecord, AuditStatus } from '../../types/modules/audit';
import type { CreateInput, UpdateInput } from '../../types/db/base';
import { hactAssessmentsDB } from '../../services/db/auditService';

// ========== QUERY KEYS ==========

export const hactAssessmentKeys = {
  all: ['hactAssessments'] as const,
  lists: () => [...hactAssessmentKeys.all, 'list'] as const,
  list: (filters?: string) => [...hactAssessmentKeys.lists(), { filters }] as const,
  details: () => [...hactAssessmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...hactAssessmentKeys.details(), id] as const,
  byDonor: (donorId: number) => [...hactAssessmentKeys.all, 'donor', donorId] as const,
  byStatus: (status: AuditStatus) => [...hactAssessmentKeys.all, 'status', status] as const,
  expiringSoon: (days?: number) => [...hactAssessmentKeys.all, 'expiring', days] as const,
  expired: () => [...hactAssessmentKeys.all, 'expired'] as const,
};

// ========== QUERY HOOKS ==========

export const useHACTAssessmentsList = () => {
  return useQuery({
    queryKey: hactAssessmentKeys.lists(),
    queryFn: () => hactAssessmentsDB.getAll(),
  });
};

export const useHACTAssessmentDetail = (id: number) => {
  return useQuery({
    queryKey: hactAssessmentKeys.detail(id),
    queryFn: () => hactAssessmentsDB.getById(id),
    enabled: !!id && id > 0,
  });
};

export const useHACTAssessmentsByDonor = (donorId: number) => {
  return useQuery({
    queryKey: hactAssessmentKeys.byDonor(donorId),
    queryFn: () => hactAssessmentsDB.getByDonor(donorId),
    enabled: !!donorId && donorId > 0,
  });
};

export const useHACTAssessmentsByStatus = (status: AuditStatus) => {
  return useQuery({
    queryKey: hactAssessmentKeys.byStatus(status),
    queryFn: () => hactAssessmentsDB.getByStatus(status),
    enabled: !!status,
  });
};

export const useHACTAssessmentsExpiringSoon = (days = 30) => {
  return useQuery({
    queryKey: hactAssessmentKeys.expiringSoon(days),
    queryFn: () => hactAssessmentsDB.getExpiringSoon(days),
  });
};

export const useHACTAssessmentsExpired = () => {
  return useQuery({
    queryKey: hactAssessmentKeys.expired(),
    queryFn: () => hactAssessmentsDB.getExpired(),
  });
};

// ========== MUTATION HOOKS ==========

export const useCreateHACTAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInput<HACTAssessmentRecord>) => {
      const assessmentNumber = await hactAssessmentsDB.generateNumber();
      return hactAssessmentsDB.create({ ...data, assessmentNumber });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hactAssessmentKeys.all });
    },
  });
};

export const useUpdateHACTAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInput<HACTAssessmentRecord> }) => {
      return hactAssessmentsDB.update(id, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: hactAssessmentKeys.all });
      queryClient.invalidateQueries({ queryKey: hactAssessmentKeys.detail(data.id) });
    },
  });
};

export const useDeleteHACTAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => hactAssessmentsDB.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hactAssessmentKeys.all });
    },
  });
};
