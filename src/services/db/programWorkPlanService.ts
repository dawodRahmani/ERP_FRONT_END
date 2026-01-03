/**
 * Program Work Plan Tracking Service
 *
 * Manages program work plans with timeline tracking.
 * Supports timeline generation and activity tracking across years.
 */

import { createCRUDService } from './core/crud';
import { searchRecords, getUniqueValues, sortByCreatedAt } from './core/utils';
import type { ProgramWorkPlanRecord } from '../../types/modules/tracking';

const STORE_NAME = 'programWorkPlans';

// Create base CRUD service
const baseCRUD = createCRUDService<ProgramWorkPlanRecord>(STORE_NAME);

/**
 * Timeline month structure
 */
export interface TimelineMonth {
  year: number;
  month: number;
  key: string;
  label: string;
}

/**
 * Generate timeline months for a date range
 * @param startYear Starting year
 * @param startMonth Starting month (1-12)
 * @param endYear Ending year
 * @param endMonth Ending month (1-12)
 * @returns Array of timeline months
 */
export function generateTimelineMonths(
  startYear: number = 2024,
  startMonth: number = 7,
  endYear: number = 2026,
  endMonth: number = 12
): TimelineMonth[] {
  const months: TimelineMonth[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const firstMonth = year === startYear ? startMonth : 1;
    const lastMonth = year === endYear ? endMonth : 12;

    for (let month = firstMonth; month <= lastMonth; month++) {
      const date = new Date(year, month - 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });

      months.push({
        year,
        month,
        key: `${year}-${String(month).padStart(2, '0')}`,
        label: `${monthName} ${year}`,
      });
    }
  }

  return months;
}

/**
 * Program Work Plan Service
 * Provides comprehensive work plan management
 */
export const programWorkPlanService = {
  ...baseCRUD,

  /**
   * Create a new work plan with default values
   */
  async create(
    data: Omit<ProgramWorkPlanRecord, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ProgramWorkPlanRecord> {
    const planData = {
      ...data,
      status: data.status || 'draft',
    };
    return baseCRUD.create(planData);
  },

  /**
   * Get all work plans sorted by creation date
   */
  async getAll(): Promise<ProgramWorkPlanRecord[]> {
    const plans = await baseCRUD.getAll();
    return sortByCreatedAt(plans, 'desc');
  },

  /**
   * Search work plans by multiple fields
   */
  async search(searchTerm: string): Promise<ProgramWorkPlanRecord[]> {
    if (!searchTerm) {
      return this.getAll();
    }

    const allPlans = await this.getAll();
    return searchRecords(allPlans, searchTerm, [
      'donor',
      'project',
      'activity',
      'location',
      'output',
    ]);
  },

  /**
   * Filter by year
   */
  async filterByYear(year: number): Promise<ProgramWorkPlanRecord[]> {
    return baseCRUD.getByIndex('year', year);
  },

  /**
   * Filter by quarter
   */
  async filterByQuarter(quarter: number): Promise<ProgramWorkPlanRecord[]> {
    return baseCRUD.getByIndex('quarter', quarter);
  },

  /**
   * Filter by month
   */
  async filterByMonth(month: number): Promise<ProgramWorkPlanRecord[]> {
    return baseCRUD.getByIndex('month', month);
  },

  /**
   * Filter by department
   */
  async filterByDepartment(department: string): Promise<ProgramWorkPlanRecord[]> {
    return baseCRUD.getByIndex('department', department);
  },

  /**
   * Filter by responsible person
   */
  async filterByResponsible(responsible: string): Promise<ProgramWorkPlanRecord[]> {
    return baseCRUD.getByIndex('responsible', responsible);
  },

  /**
   * Filter by status
   */
  async filterByStatus(status: string): Promise<ProgramWorkPlanRecord[]> {
    return baseCRUD.getByIndex('status', status);
  },

  /**
   * Filter by donor
   */
  async filterByDonor(donor: string): Promise<ProgramWorkPlanRecord[]> {
    return baseCRUD.getByIndex('donor', donor);
  },

  /**
   * Filter by project
   */
  async filterByProject(project: string): Promise<ProgramWorkPlanRecord[]> {
    return baseCRUD.getByIndex('project', project);
  },

  /**
   * Get unique departments
   */
  async getUniqueDepartments(): Promise<string[]> {
    const allPlans = await this.getAll();
    const departments = getUniqueValues(allPlans, 'department').filter(Boolean) as string[];
    return departments.sort();
  },

  /**
   * Get unique donors
   */
  async getUniqueDonors(): Promise<string[]> {
    const allPlans = await this.getAll();
    const donors = getUniqueValues(allPlans, 'donor').filter(Boolean) as string[];
    return donors.sort();
  },

  /**
   * Get unique projects
   */
  async getUniqueProjects(): Promise<string[]> {
    const allPlans = await this.getAll();
    const projects = getUniqueValues(allPlans, 'project').filter(Boolean) as string[];
    return projects.sort();
  },

  /**
   * Get unique responsible persons
   */
  async getUniqueResponsible(): Promise<string[]> {
    const allPlans = await this.getAll();
    const responsible = getUniqueValues(allPlans, 'responsible').filter(Boolean) as string[];
    return responsible.sort();
  },

  /**
   * Bulk import work plans
   */
  async bulkImport(
    plans: Omit<ProgramWorkPlanRecord, 'id' | 'createdAt' | 'updatedAt'>[]
  ): Promise<number> {
    const now = new Date().toISOString();
    const plansWithTimestamps = plans.map(plan => ({
      ...plan,
      createdAt: now,
      updatedAt: now,
    }));

    const promises = plansWithTimestamps.map(plan => baseCRUD.create(plan));
    const results = await Promise.all(promises);
    return results.length;
  },

  /**
   * Export all work plans
   */
  async export(): Promise<ProgramWorkPlanRecord[]> {
    return this.getAll();
  },

  /**
   * Get statistics by status
   */
  async getStatistics(): Promise<{
    total: number;
    notStarted: number;
    inProgress: number;
    onHold: number;
    completed: number;
    cancelled: number;
  }> {
    const allPlans = await this.getAll();

    return {
      total: allPlans.length,
      notStarted: allPlans.filter(p => p.status === 'not_started').length,
      inProgress: allPlans.filter(p => p.status === 'in_progress').length,
      onHold: allPlans.filter(p => p.status === 'on_hold').length,
      completed: allPlans.filter(p => p.status === 'completed').length,
      cancelled: allPlans.filter(p => p.status === 'cancelled').length,
    };
  },
};

// Default export
export default programWorkPlanService;
