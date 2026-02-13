/**
 * Recruitment Dropdown React Query Hooks
 *
 * Provides data fetching and mutations for recruitment dropdown management.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { RecruitmentDropdownRecord } from '../../types/modules/recruitment';
import type { CreateInput, UpdateInput } from '../../types/db/base';
import { recruitmentDropdownsDB } from '../../services/db/recruitmentService';

// ========== QUERY KEYS ==========

export const recruitmentDropdownKeys = {
  all: ['recruitmentDropdowns'] as const,
  lists: () => [...recruitmentDropdownKeys.all, 'list'] as const,
  byCategory: (category: string) => [...recruitmentDropdownKeys.all, 'category', category] as const,
  activeByCategory: (category: string) => [...recruitmentDropdownKeys.all, 'active', category] as const,
  details: () => [...recruitmentDropdownKeys.all, 'detail'] as const,
  detail: (id: number) => [...recruitmentDropdownKeys.details(), id] as const,
};

// ========== QUERY HOOKS ==========

/**
 * Fetch all dropdown records
 */
export const useRecruitmentDropdownsList = () => {
  return useQuery({
    queryKey: recruitmentDropdownKeys.lists(),
    queryFn: () => recruitmentDropdownsDB.getAll(),
  });
};

/**
 * Fetch dropdown options for a specific category (all, including inactive)
 */
export const useDropdownsByCategory = (category: string) => {
  return useQuery({
    queryKey: recruitmentDropdownKeys.byCategory(category),
    queryFn: () => recruitmentDropdownsDB.getByCategory(category),
    enabled: !!category,
  });
};

/**
 * Fetch only active dropdown options for a specific category
 * This is what forms should use to populate their <select> elements
 */
export const useActiveDropdownsByCategory = (category: string) => {
  return useQuery({
    queryKey: recruitmentDropdownKeys.activeByCategory(category),
    queryFn: () => recruitmentDropdownsDB.getActiveByCategory(category),
    enabled: !!category,
  });
};

// ========== MUTATION HOOKS ==========

/**
 * Create a new dropdown option
 */
export const useCreateDropdownOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInput<RecruitmentDropdownRecord>) => {
      return recruitmentDropdownsDB.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruitmentDropdownKeys.all });
    },
  });
};

/**
 * Update an existing dropdown option
 */
export const useUpdateDropdownOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInput<RecruitmentDropdownRecord> }) => {
      return recruitmentDropdownsDB.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruitmentDropdownKeys.all });
    },
  });
};

/**
 * Delete a dropdown option
 */
export const useDeleteDropdownOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => recruitmentDropdownsDB.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruitmentDropdownKeys.all });
    },
  });
};

/**
 * Seed default dropdown values (runs once if store is empty)
 */
export const useSeedRecruitmentDropdowns = () => {
  return useMutation({
    mutationFn: () => recruitmentDropdownsDB.seedDefaults(),
  });
};
