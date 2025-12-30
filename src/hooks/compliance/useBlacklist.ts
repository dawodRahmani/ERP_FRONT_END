import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  BlacklistEntry,
  BlacklistFormInput,
  BlacklistStatistics,
} from '../../types/compliance/blacklist';
// import axios from '../../config/axios';

// ==================== QUERY KEYS ====================

export const blacklistKeys = {
  all: ['blacklist'] as const,
  lists: () => [...blacklistKeys.all, 'list'] as const,
  list: (filters: string) => [...blacklistKeys.lists(), { filters }] as const,
  details: () => [...blacklistKeys.all, 'detail'] as const,
  detail: (id: number) => [...blacklistKeys.details(), id] as const,
  statistics: () => [...blacklistKeys.all, 'statistics'] as const,
};

// ==================== API CONFIGURATION ====================

const API_BASE = '/api/v1/compliance/blacklist';

// ==================== API FUNCTIONS ====================

/**
 * Fetch all blacklist entries
 * TODO: Replace with actual API call when backend is ready
 */
const fetchBlacklist = async (): Promise<BlacklistEntry[]> => {
  // Uncomment when API is ready:
  // const response = await axios.get<BlacklistListResponse>(API_BASE);
  // return response.data.data;

  // Mock implementation with delay to simulate API
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [];
};

/**
 * Fetch single blacklist entry by ID
 * TODO: Replace with actual API call when backend is ready
 */
const fetchBlacklistById = async (id: number): Promise<BlacklistEntry> => {
  // Uncomment when API is ready:
  // const response = await axios.get<BlacklistDetailResponse>(`${API_BASE}/${id}`);
  // return response.data.data;

  await new Promise((resolve) => setTimeout(resolve, 300));
  throw new Error(`Entry with ID ${id} not found`);
};

/**
 * Create new blacklist entry
 * TODO: Replace with actual API call when backend is ready
 */
const createBlacklistEntry = async (
  data: BlacklistFormInput
): Promise<BlacklistEntry> => {
  // Uncomment when API is ready:
  // const response = await axios.post<BlacklistDetailResponse>(API_BASE, data);
  // return response.data.data;

  // Mock implementation
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newEntry: BlacklistEntry = {
    id: Math.floor(Math.random() * 100000),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return newEntry;
};

/**
 * Update existing blacklist entry
 * TODO: Replace with actual API call when backend is ready
 */
const updateBlacklistEntry = async ({
  id,
  data,
}: {
  id: number;
  data: BlacklistFormInput;
}): Promise<BlacklistEntry> => {
  // Uncomment when API is ready:
  // const response = await axios.put<BlacklistDetailResponse>(`${API_BASE}/${id}`, data);
  // return response.data.data;

  // Mock implementation
  await new Promise((resolve) => setTimeout(resolve, 500));
  const updatedEntry: BlacklistEntry = {
    id,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return updatedEntry;
};

/**
 * Delete blacklist entry
 * TODO: Replace with actual API call when backend is ready
 */
const deleteBlacklistEntry = async (id: number): Promise<void> => {
  // Uncomment when API is ready:
  // await axios.delete(`${API_BASE}/${id}`);

  // Mock implementation
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Deleted entry with ID: ${id}`);
};

/**
 * Fetch blacklist statistics
 * TODO: Replace with actual API call when backend is ready
 */
const fetchStatistics = async (): Promise<BlacklistStatistics> => {
  // Uncomment when API is ready:
  // const response = await axios.get<{data: BlacklistStatistics}>(`${API_BASE}/statistics`);
  // return response.data.data;

  // Mock implementation
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    total: 0,
    active: 0,
    expired: 0,
    byCategory: {
      Staff: 0,
      'Supplier/Vendor/Contractor': 0,
      Partner: 0,
      Visitor: 0,
      Participants: 0,
    },
    byAccess: {
      'Department Head': 0,
      'HR Only': 0,
      'Finance Only': 0,
      'All Departments': 0,
      'Senior Management': 0,
      'Restricted - Confidential': 0,
    },
  };
};

// ==================== REACT QUERY HOOKS ====================

/**
 * Hook to fetch all blacklist entries
 */
export const useBlacklistList = () => {
  return useQuery({
    queryKey: blacklistKeys.lists(),
    queryFn: fetchBlacklist,
  });
};

/**
 * Hook to fetch single blacklist entry by ID
 * @param id - Entry ID
 */
export const useBlacklistDetail = (id: number) => {
  return useQuery({
    queryKey: blacklistKeys.detail(id),
    queryFn: () => fetchBlacklistById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch blacklist statistics
 */
export const useBlacklistStatistics = () => {
  return useQuery({
    queryKey: blacklistKeys.statistics(),
    queryFn: fetchStatistics,
  });
};

/**
 * Hook to create new blacklist entry
 * Automatically invalidates list and statistics queries on success
 */
export const useCreateBlacklistEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlacklistEntry,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: blacklistKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blacklistKeys.statistics() });
    },
  });
};

/**
 * Hook to update existing blacklist entry
 * Automatically invalidates related queries on success
 */
export const useUpdateBlacklistEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBlacklistEntry,
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: blacklistKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blacklistKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: blacklistKeys.statistics() });
    },
  });
};

/**
 * Hook to delete blacklist entry
 * Automatically invalidates list and statistics queries on success
 */
export const useDeleteBlacklistEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlacklistEntry,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: blacklistKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blacklistKeys.statistics() });
    },
  });
};
