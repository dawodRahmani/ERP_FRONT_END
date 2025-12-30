/**
 * Performance Management Object Stores
 *
 * Creates stores for performance appraisal system.
 * This file will be fully populated during performanceService.ts migration (Phase 5)
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '@/types/db/stores';

/**
 * Create all performance management object stores
 */
export function createPerformanceStores(db: IDBPDatabase<VDODatabase>): void {
  // Performance stores will be added during migration:
  // - appraisalCycles
  // - appraisalTemplates
  // - appraisalSections
  // - appraisalCriteria
  // - employeeAppraisals
  // - appraisalRatings
  // - appraisalCommitteeMembers
  // - appraisalGoals
  // - appraisalTrainingNeeds
  // - probationRecords
  // - probationExtensions
  // - probationKpis
  // - performanceImprovementPlans
  // - pipGoals
  // - pipCheckIns
  // - appraisalOutcomes
}
