/**
 * Performance Management Module Service
 *
 * Comprehensive performance management system covering:
 * - Appraisal Cycles & Templates
 * - Employee Appraisals with multi-stage workflow
 * - Performance Ratings & Scoring
 * - Probation Management
 * - Performance Improvement Plans (PIPs)
 * - Goals & Training Needs
 */

import { createCRUDService } from './core/crud';
import { generateFormattedCode } from './core/utils';
import { getDB } from './core/connection';
import type {
  AppraisalCycleRecord,
  AppraisalTemplateRecord,
  AppraisalSectionRecord,
  AppraisalCriteriaRecord,
  EmployeeAppraisalRecord,
  AppraisalRatingRecord,
  AppraisalCommitteeMemberRecord,
  AppraisalGoalRecord,
  AppraisalTrainingNeedRecord,
  ProbationRecord,
  ProbationExtensionRecord,
  ProbationKPIRecord,
  PerformanceImprovementPlanRecord,
  PIPGoalRecord,
  PIPCheckInRecord,
  AppraisalOutcomeRecord,
  PerformanceLevel,
} from '../../types/modules/performance';
import { RATING_SCALE } from '../../types/modules/performance';
import type {
  IDPRecord,
  IDPGoalRecord,
} from '../../types/modules/legacy';

// ========== APPRAISAL CYCLES ==========

const appraisalCyclesCRUD = createCRUDService<AppraisalCycleRecord>('appraisalCycles');

export const appraisalCyclesDB = {
  ...appraisalCyclesCRUD,
};

// ========== APPRAISAL TEMPLATES ==========

const appraisalTemplatesCRUD = createCRUDService<AppraisalTemplateRecord>('appraisalTemplates');

export const appraisalTemplatesDB = {
  ...appraisalTemplatesCRUD,

  /**
   * Get template with sections and criteria
   */
  async getTemplateWithSections(templateId: number): Promise<(AppraisalTemplateRecord & { sections?: any[] }) | null> {
    const db = await getDB();
    const template = await this.getById(templateId);
    if (!template) return null;

    const sections = await db.getAllFromIndex('appraisalSections', 'templateId', templateId);

    for (const section of sections) {
      const criteria = await db.getAllFromIndex('appraisalCriteria', 'sectionId', section.id);
      (section as any).criteria = criteria.sort((a: any, b: any) => a.displayOrder - b.displayOrder);
    }

    (template as any).sections = sections.sort((a: any, b: any) => a.displayOrder - b.displayOrder);
    return template;
  },
};

// ========== APPRAISAL SECTIONS ==========

const appraisalSectionsCRUD = createCRUDService<AppraisalSectionRecord>('appraisalSections');

export const appraisalSectionsDB = {
  ...appraisalSectionsCRUD,
};

// ========== APPRAISAL CRITERIA ==========

const appraisalCriteriaCRUD = createCRUDService<AppraisalCriteriaRecord>('appraisalCriteria');

export const appraisalCriteriaDB = {
  ...appraisalCriteriaCRUD,
};

// ========== EMPLOYEE APPRAISALS ==========

const employeeAppraisalsCRUD = createCRUDService<EmployeeAppraisalRecord>('employeeAppraisals');

export const employeeAppraisalsDB = {
  ...employeeAppraisalsCRUD,

  /**
   * Generate unique appraisal number (APR-YYYY-#####)
   */
  async generateAppraisalNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode('APR', all.length + 1, true, 5);
  },

  /**
   * Calculate appraisal score
   */
  async calculateScore(appraisalId: number): Promise<{ totalScore: number; maxScore: number; percentage: number }> {
    const db = await getDB();
    const ratings = await db.getAllFromIndex('appraisalRatings', 'appraisalId', appraisalId);

    if (ratings.length === 0) return { totalScore: 0, maxScore: 0, percentage: 0 };

    let totalScore = 0;
    let maxScore = 0;

    for (const rating of ratings) {
      const criteria = await db.get('appraisalCriteria', (rating as any).criteriaId);
      if (criteria) {
        const weight = (criteria as any).weight || 1;
        totalScore += ((rating as any).managerRating || 0) * weight;
        maxScore += ((criteria as any).maxRating || 5) * weight;
      }
    }

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    return { totalScore, maxScore, percentage };
  },

  /**
   * Get performance level from percentage score
   */
  getPerformanceLevel(percentageScore: number): {
    level: PerformanceLevel;
    label: string;
    recommendation: string;
  } {
    if (percentageScore >= 80) return { level: 'outstanding', label: 'Outstanding', recommendation: 'Recommended for promotion' };
    if (percentageScore >= 70) return { level: 'exceeds_expectations', label: 'Exceeds Expectations', recommendation: 'Recommended for promotion' };
    if (percentageScore >= 50) return { level: 'meets_expectations', label: 'Meets Expectations', recommendation: 'Extend contract' };
    if (percentageScore >= 30) return { level: 'needs_improvement', label: 'Needs Improvement', recommendation: 'Extend contract with PIP' };
    return { level: 'unsatisfactory', label: 'Unsatisfactory', recommendation: 'Do not extend contract' };
  },

  /**
   * Submit self-assessment
   */
  async submitSelfAssessment(appraisalId: number, data: Partial<EmployeeAppraisalRecord>): Promise<EmployeeAppraisalRecord> {
    return this.update(appraisalId, {
      selfAssessmentSubmitted: true,
      selfAssessmentDate: new Date().toISOString(),
      employeeAchievements: data.employeeAchievements,
      employeeChallenges: data.employeeChallenges,
      employeeComments: data.employeeComments,
      status: 'manager_review',
    });
  },

  /**
   * Submit manager review
   */
  async submitManagerReview(appraisalId: number, data: Partial<EmployeeAppraisalRecord>): Promise<EmployeeAppraisalRecord> {
    const scores = await this.calculateScore(appraisalId);
    const performanceLevel = this.getPerformanceLevel(scores.percentage);

    return this.update(appraisalId, {
      managerReviewSubmitted: true,
      managerReviewDate: new Date().toISOString(),
      managerOverallComments: data.managerOverallComments,
      managerStrengths: data.managerStrengths,
      managerImprovements: data.managerImprovements,
      managerTrainingRecommendations: data.managerTrainingRecommendations,
      managerRecommendation: data.managerRecommendation,
      totalScore: scores.totalScore,
      maxPossibleScore: scores.maxScore,
      percentageScore: scores.percentage,
      performanceLevel: performanceLevel.level,
      status: 'committee_review',
    });
  },

  /**
   * Submit committee review
   */
  async submitCommitteeReview(appraisalId: number, data: Partial<EmployeeAppraisalRecord>): Promise<EmployeeAppraisalRecord> {
    return this.update(appraisalId, {
      committeeReviewed: true,
      committeeReviewedAt: new Date().toISOString(),
      committeeComments: data.committeeComments,
      committeeRecommendation: data.committeeRecommendation,
      status: 'pending_approval',
    });
  },

  /**
   * Approve appraisal
   */
  async approve(appraisalId: number, approvedBy: string, decision: string, comments?: string): Promise<EmployeeAppraisalRecord> {
    return this.update(appraisalId, {
      approvedBy,
      approvedAt: new Date().toISOString(),
      approvalComments: comments,
      finalDecision: decision,
      status: 'approved',
    });
  },

  /**
   * Communicate decision to employee
   */
  async communicateDecision(appraisalId: number): Promise<EmployeeAppraisalRecord> {
    return this.update(appraisalId, {
      communicatedToEmployee: true,
      communicatedAt: new Date().toISOString(),
      status: 'communicated',
    });
  },

  /**
   * Employee acknowledges appraisal
   */
  async acknowledge(appraisalId: number, feedback?: string): Promise<EmployeeAppraisalRecord> {
    return this.update(appraisalId, {
      employeeAcknowledged: true,
      employeeAcknowledgedAt: new Date().toISOString(),
      employeeFeedback: feedback,
      status: 'completed',
    });
  },

  /**
   * Get appraisal with all related data
   */
  async getWithDetails(appraisalId: number): Promise<(EmployeeAppraisalRecord & { ratings?: any[]; committeeMembers?: any[]; goals?: any[]; trainingNeeds?: any[] }) | null> {
    const db = await getDB();
    const appraisal = await this.getById(appraisalId);
    if (!appraisal) return null;

    const ratings = await db.getAllFromIndex('appraisalRatings', 'appraisalId', appraisalId);
    const committeeMembers = await db.getAllFromIndex('appraisalCommitteeMembers', 'appraisalId', appraisalId);
    const goals = await db.getAllFromIndex('appraisalGoals', 'appraisalId', appraisalId);
    const trainingNeeds = await db.getAllFromIndex('appraisalTrainingNeeds', 'appraisalId', appraisalId);

    return {
      ...appraisal,
      ratings,
      committeeMembers,
      goals,
      trainingNeeds,
    };
  },
};

// ========== APPRAISAL RATINGS ==========

const appraisalRatingsCRUD = createCRUDService<AppraisalRatingRecord>('appraisalRatings');

export const appraisalRatingsDB = {
  ...appraisalRatingsCRUD,
};

// ========== APPRAISAL COMMITTEE MEMBERS ==========

const appraisalCommitteeMembersCRUD = createCRUDService<AppraisalCommitteeMemberRecord>('appraisalCommitteeMembers');

export const appraisalCommitteeMembersDB = {
  ...appraisalCommitteeMembersCRUD,
};

// ========== APPRAISAL GOALS ==========

const appraisalGoalsCRUD = createCRUDService<AppraisalGoalRecord>('appraisalGoals');

export const appraisalGoalsDB = {
  ...appraisalGoalsCRUD,
};

// ========== APPRAISAL TRAINING NEEDS ==========

const appraisalTrainingNeedsCRUD = createCRUDService<AppraisalTrainingNeedRecord>('appraisalTrainingNeeds');

export const appraisalTrainingNeedsDB = {
  ...appraisalTrainingNeedsCRUD,
};

// ========== PROBATION RECORDS ==========

const probationRecordsCRUD = createCRUDService<ProbationRecord>('probationRecords');

export const probationRecordsDB = {
  ...probationRecordsCRUD,

  /**
   * Confirm probation (successful completion)
   */
  async confirm(probationId: number, appraisalId: number): Promise<ProbationRecord> {
    return this.update(probationId, {
      status: 'confirmed',
      finalAppraisalId: appraisalId,
    });
  },

  /**
   * Extend probation period
   */
  async extend(probationId: number, extensionData: {
    appraisalId: number;
    newEndDate: string;
    reason: string;
    approvedBy: string;
  }): Promise<{ probation: ProbationRecord; extensionId: number }> {
    const probation = await this.getById(probationId);
    if (!probation) throw new Error('Probation record not found');

    if (probation.extensionCount >= 2) {
      throw new Error('Maximum 2 probation extensions allowed');
    }

    const db = await getDB();

    // Create extension record
    const extensionId = await db.add('probationExtensions', {
      probationId,
      appraisalId: extensionData.appraisalId,
      extensionNumber: probation.extensionCount + 1,
      previousEndDate: probation.currentEndDate,
      newEndDate: extensionData.newEndDate,
      extensionReason: extensionData.reason,
      approvedBy: extensionData.approvedBy,
      approvedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Update probation record
    const updated = await this.update(probationId, {
      currentEndDate: extensionData.newEndDate,
      extensionCount: probation.extensionCount + 1,
      status: 'extended',
    });

    return { probation: updated, extensionId: extensionId as number };
  },
};

// ========== PROBATION EXTENSIONS ==========

const probationExtensionsCRUD = createCRUDService<ProbationExtensionRecord>('probationExtensions');

export const probationExtensionsDB = {
  ...probationExtensionsCRUD,
};

// ========== PROBATION KPIs ==========

const probationKPIsCRUD = createCRUDService<ProbationKPIRecord>('probationKpis');

export const probationKPIsDB = {
  ...probationKPIsCRUD,
};

// ========== PERFORMANCE IMPROVEMENT PLANS ==========

const performanceImprovementPlansCRUD = createCRUDService<PerformanceImprovementPlanRecord>('performanceImprovementPlans');

export const performanceImprovementPlansDB = {
  ...performanceImprovementPlansCRUD,

  /**
   * Generate unique PIP number (PIP-YYYY-#####)
   */
  async generatePIPNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode('PIP', all.length + 1, true, 5);
  },

  /**
   * Activate a PIP
   */
  async activate(pipId: number): Promise<PerformanceImprovementPlanRecord> {
    return this.update(pipId, {
      status: 'active',
    });
  },

  /**
   * Complete a PIP
   */
  async complete(pipId: number, outcome: 'success' | 'failure'): Promise<PerformanceImprovementPlanRecord> {
    const status = outcome === 'success' ? 'completed_success' : 'completed_failure';

    return this.update(pipId, {
      status: status as any,
      completedAt: new Date().toISOString(),
      outcome,
    });
  },

  /**
   * Get PIP with all related data
   */
  async getWithDetails(pipId: number): Promise<(PerformanceImprovementPlanRecord & { goals?: any[]; checkIns?: any[] }) | null> {
    const db = await getDB();
    const pip = await this.getById(pipId);
    if (!pip) return null;

    const goals = await db.getAllFromIndex('pipGoals', 'pipId', pipId);
    const checkIns = await db.getAllFromIndex('pipCheckIns', 'pipId', pipId);

    return {
      ...pip,
      goals,
      checkIns: (checkIns as any[]).sort((a, b) => a.checkInNumber - b.checkInNumber),
    };
  },
};

// ========== PIP GOALS ==========

const pipGoalsCRUD = createCRUDService<PIPGoalRecord>('pipGoals');

export const pipGoalsDB = {
  ...pipGoalsCRUD,
};

// ========== PIP CHECK-INS ==========

const pipCheckInsCRUD = createCRUDService<PIPCheckInRecord>('pipCheckIns');

export const pipCheckInsDB = {
  ...pipCheckInsCRUD,

  /**
   * Record a PIP check-in
   */
  async record(pipId: number, checkInData: Omit<PIPCheckInRecord, 'id' | 'createdAt' | 'updatedAt' | 'pipId' | 'checkInNumber' | 'checkInDate'>): Promise<PIPCheckInRecord> {
    const db = await getDB();
    const existingCheckIns = await db.getAllFromIndex('pipCheckIns', 'pipId', pipId);

    return this.create({
      pipId,
      checkInDate: new Date().toISOString(),
      checkInNumber: existingCheckIns.length + 1,
      ...checkInData,
    });
  },
};

// ========== APPRAISAL OUTCOMES ==========

const appraisalOutcomesCRUD = createCRUDService<AppraisalOutcomeRecord>('appraisalOutcomes');

export const appraisalOutcomesDB = {
  ...appraisalOutcomesCRUD,
};

// ========== LEGACY BACKWARD COMPATIBILITY ==========

/**
 * Legacy Individual Development Plans (backward compatibility)
 * Maps to individualDevelopmentPlans store
 */
const idpsCRUD = createCRUDService<IDPRecord>('individualDevelopmentPlans');

export const idpDB = {
  ...idpsCRUD,

  /**
   * Generate unique IDP ID
   */
  async generateIDPId(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('IDP', all.length + 1, true, 4);
  },

  /**
   * Get IDPs by employee ID
   */
  async getByEmployee(employeeId: number): Promise<IDPRecord[]> {
    return idpsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get IDPs by status
   */
  async getByStatus(status: string): Promise<IDPRecord[]> {
    return idpsCRUD.getByIndex('status', status);
  },
};

/**
 * Legacy IDP Goals (backward compatibility)
 * Maps to idpGoals store
 */
const idpGoalsCRUD = createCRUDService<IDPGoalRecord>('idpGoals');

export const idpGoalDB = {
  ...idpGoalsCRUD,

  /**
   * Get goals by IDP ID
   */
  async getByIDP(idpId: number): Promise<IDPGoalRecord[]> {
    return idpGoalsCRUD.getByIndex('idpId', idpId);
  },

  /**
   * Get goals by status
   */
  async getByStatus(status: string): Promise<IDPGoalRecord[]> {
    return idpGoalsCRUD.getByIndex('status', status);
  },
};

// ========== BACKWARD COMPATIBILITY ALIASES ==========

/**
 * Backward compatibility aliases for renamed services
 * Maps old naming conventions to new ones
 */
export const appraisalPeriodDB = appraisalCyclesDB;
export const performanceAppraisalDB = employeeAppraisalsDB;
export const appraisalScoreDB = appraisalRatingsDB;
export const pipProgressReviewDB = pipCheckInsDB;

// ========== MAIN EXPORT ==========

/**
 * Performance Service - Main entry point
 */
export const performanceService = {
  // Constants
  RATING_SCALE,

  // Sub-services
  cycles: appraisalCyclesDB,
  templates: appraisalTemplatesDB,
  sections: appraisalSectionsDB,
  criteria: appraisalCriteriaDB,
  appraisals: employeeAppraisalsDB,
  ratings: appraisalRatingsDB,
  committeeMembers: appraisalCommitteeMembersDB,
  goals: appraisalGoalsDB,
  trainingNeeds: appraisalTrainingNeedsDB,
  probation: {
    records: probationRecordsDB,
    extensions: probationExtensionsDB,
    kpis: probationKPIsDB,
  },
  pips: {
    plans: performanceImprovementPlansDB,
    goals: pipGoalsDB,
    checkIns: pipCheckInsDB,
  },
  outcomes: appraisalOutcomesDB,
};

export default performanceService;
