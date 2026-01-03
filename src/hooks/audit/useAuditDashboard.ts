/**
 * Audit Dashboard React Query Hooks
 *
 * Provides data fetching for audit dashboard statistics and widgets.
 */

import { useQuery } from '@tanstack/react-query';
import { auditDashboardService } from '../../services/db/auditService';

// ========== QUERY KEYS ==========

export const auditDashboardKeys = {
  all: ['auditDashboard'] as const,
  stats: () => [...auditDashboardKeys.all, 'stats'] as const,
  recentAudits: (limit?: number) => [...auditDashboardKeys.all, 'recent', limit] as const,
  upcomingAudits: (limit?: number) => [...auditDashboardKeys.all, 'upcoming', limit] as const,
};

// ========== QUERY HOOKS ==========

export const useAuditDashboardStats = () => {
  return useQuery({
    queryKey: auditDashboardKeys.stats(),
    queryFn: () => auditDashboardService.getStats(),
  });
};

export const useRecentAudits = (limit = 10) => {
  return useQuery({
    queryKey: auditDashboardKeys.recentAudits(limit),
    queryFn: () => auditDashboardService.getRecentAudits(limit),
  });
};

export const useUpcomingAudits = (limit = 10) => {
  return useQuery({
    queryKey: auditDashboardKeys.upcomingAudits(limit),
    queryFn: () => auditDashboardService.getUpcomingAudits(limit),
  });
};
