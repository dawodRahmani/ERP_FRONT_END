/**
 * Training Module Service
 *
 * Comprehensive training and development system covering:
 * - Training Types & Programs
 * - Training Needs Assessments (TNA)
 * - Training Calendar & Budget
 * - Training Sessions & Participants
 * - Evaluations & Certificates
 * - Training Bonds
 * - Employee Training History
 * - Training Reports & Dashboard
 */

import type {
  BondStatus,
  BudgetStatus,
  EmployeeTrainingHistoryRecord,
  TNAStatus,
  TNATrainingNeedRecord,
  TrainingBondRecord,
  TrainingBudgetProposalRecord,
  TrainingCalendarRecord,
  TrainingCategory,
  TrainingCertificateRecord,
  TrainingEvaluationRecord,
  TrainingLevel,
  TrainingNeedsAssessmentRecord,
  TrainingParticipantRecord,
  TrainingProgramRecord,
  TrainingRecord,
  TrainingReportRecord,
  TrainingSessionRecord,
  TrainingStatus,
  TrainingTypeRecord
} from '../../types/modules/training';
import { createCRUDService } from './core/crud';
import { generateFormattedCode } from './core/utils';
import type { CreateInput } from './indexedDB';

// ========== TRAINING TYPES ==========

const trainingTypesCRUD = createCRUDService<TrainingTypeRecord>('trainingTypes');

export const trainingTypesDB = {
  ...trainingTypesCRUD,

  /**
   * Generate unique code (TT-####)
   */
  async generateCode(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('TT', all.length + 1, false, 4);
  },

  /**
   * Get active training types
   */
  async getActive(): Promise<TrainingTypeRecord[]> {
    return trainingTypesCRUD.getByIndex('isActive', true);
  },

  /**
   * Get by category
   */
  async getByCategory(category: TrainingCategory): Promise<TrainingTypeRecord[]> {
    return trainingTypesCRUD.getByIndex('category', category);
  },

  /**
   * Get mandatory training types
   */
  async getMandatory(): Promise<TrainingTypeRecord[]> {
    return trainingTypesCRUD.getByIndex('isMandatory', true);
  },
};

// ========== TRAINING PROGRAMS ==========

const trainingProgramsCRUD = createCRUDService<TrainingProgramRecord>('trainingPrograms');

export const trainingProgramsDB = {
  ...trainingProgramsCRUD,

  /**
   * Generate unique code (TP-####)
   */
  async generateCode(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('TP', all.length + 1, false, 4);
  },

  /**
   * Get active programs
   */
  async getActive(): Promise<TrainingProgramRecord[]> {
    return trainingProgramsCRUD.getByIndex('isActive', true);
  },

  /**
   * Get programs by training type
   */
  async getByType(trainingTypeId: number): Promise<TrainingProgramRecord[]> {
    return trainingProgramsCRUD.getByIndex('trainingTypeId', trainingTypeId);
  },
};

// ========== TRAINING NEEDS ASSESSMENTS (TNA) ==========

const tnasCRUD = createCRUDService<TrainingNeedsAssessmentRecord>('trainingNeedsAssessments');

export const tnasDB = {
  ...tnasCRUD,

  /**
   * Generate unique number (TNA-YYYY-####)
   */
  async generateNumber(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('TNA', all.length + 1, true, 4);
  },

  /**
   * Calculate training level based on percentage score
   */
  calculateTrainingLevel(percentageScore: number): TrainingLevel {
    if (percentageScore <= 20) return 'complete';
    if (percentageScore <= 40) return 'targeted';
    if (percentageScore <= 60) return 'regular';
    if (percentageScore <= 80) return 'refresher';
    return 'expert';
  },

  /**
   * Calculate scores from TNA data
   */
  calculateScores(data: Partial<TrainingNeedsAssessmentRecord>): {
    totalScore: number;
    maxScore: number;
    percentageScore: number;
    trainingLevel: TrainingLevel;
  } {
    const scoreFields: (keyof TrainingNeedsAssessmentRecord)[] = [
      'jobKnowledgeScore',
      'qualityOfWorkScore',
      'productivityScore',
      'fieldManagementScore',
      'localLanguageScore',
      'englishScore',
      'communicationScore',
      'teamworkScore',
      'initiativeScore',
      'publicRelationsScore',
      'punctualityScore',
      'adaptabilityScore',
      'overallPerformanceScore',
      'aapScore',
      'pseahScore',
      'safeguardingScore',
      'childProtectionScore',
      'codeOfConductScore',
      'confidentialityScore',
      'policyAdherenceScore',
      'conflictManagementScore',
      'expertiseScore',
      'commitmentScore',
      'sustainabilityScore',
      'behaviorScore',
    ];

    const totalScore = scoreFields.reduce((sum, field) => sum + (Number(data[field]) || 0), 0);
    const maxScore = 125; // 25 criteria * 5 max
    const percentageScore = Math.round((totalScore / maxScore) * 100);
    const trainingLevel = this.calculateTrainingLevel(percentageScore);

    return { totalScore, maxScore, percentageScore, trainingLevel };
  },

  /**
   * Get TNAs by employee
   */
  async getByEmployee(employeeId: number): Promise<TrainingNeedsAssessmentRecord[]> {
    return tnasCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get TNAs by status
   */
  async getByStatus(status: TNAStatus): Promise<TrainingNeedsAssessmentRecord[]> {
    return tnasCRUD.getByIndex('status', status);
  },

  /**
   * Get TNAs by assessment period
   */
  async getByPeriod(period: string): Promise<TrainingNeedsAssessmentRecord[]> {
    return tnasCRUD.getByIndex('assessmentPeriod', period);
  },

  /**
   * Override create to calculate scores
   */
  async create(data: CreateInput<TrainingNeedsAssessmentRecord>): Promise<TrainingNeedsAssessmentRecord> {
    const scores = this.calculateScores(data);
    return tnasCRUD.create({
      ...data,
      ...scores,
      status: (data.status || 'draft') as TNAStatus,
    });
  },

  /**
   * Override update to recalculate scores
   */
  async update(id: number, data: Partial<TrainingNeedsAssessmentRecord>): Promise<TrainingNeedsAssessmentRecord> {
    const existing = await this.getById(id);
    if (!existing) throw new Error('TNA not found');

    const scores = this.calculateScores({ ...existing, ...data });
    return tnasCRUD.update(id, {
      ...data,
      ...scores,
    });
  },
};

// ========== TNA TRAINING NEEDS ==========

const tnaTrainingNeedsCRUD = createCRUDService<TNATrainingNeedRecord>('tnaTrainingNeeds');

export const tnaTrainingNeedsDB = {
  ...tnaTrainingNeedsCRUD,

  /**
   * Get training needs by TNA ID
   */
  async getByTNA(tnaId: number): Promise<TNATrainingNeedRecord[]> {
    return tnaTrainingNeedsCRUD.getByIndex('tnaId', tnaId);
  },
};

// ========== TRAINING CALENDAR ==========

const trainingCalendarCRUD = createCRUDService<TrainingCalendarRecord>('trainingCalendar');

export const trainingCalendarDB = {
  ...trainingCalendarCRUD,

  /**
   * Get calendar entries by fiscal year
   */
  async getByYear(fiscalYear: number): Promise<TrainingCalendarRecord[]> {
    return trainingCalendarCRUD.getByIndex('fiscalYear', fiscalYear);
  },
};

// ========== TRAINING BUDGET PROPOSALS ==========

const trainingBudgetsCRUD = createCRUDService<TrainingBudgetProposalRecord>('trainingBudgetProposals');

export const trainingBudgetsDB = {
  ...trainingBudgetsCRUD,

  /**
   * Generate unique number (TBP-YYYY-####)
   */
  async generateNumber(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('TBP', all.length + 1, true, 4);
  },

  /**
   * Calculate budget totals
   */
  calculateTotals(data: Partial<TrainingBudgetProposalRecord>): {
    subtotal: number;
    contingencyAmount: number;
    totalBudget: number;
  } {
    const subtotal =
      (parseFloat(String(data.trainerFees)) || 0) +
      (parseFloat(String(data.materialsCost)) || 0) +
      (parseFloat(String(data.venueCost)) || 0) +
      (parseFloat(String(data.travelAccommodation)) || 0) +
      (parseFloat(String(data.refreshmentsCost)) || 0) +
      (parseFloat(String(data.technologyCost)) || 0) +
      (parseFloat(String(data.miscellaneousCost)) || 0);

    const contingencyPercentage = parseFloat(String(data.contingencyPercentage)) || 5;
    const contingencyAmount = subtotal * (contingencyPercentage / 100);
    const totalBudget = subtotal + contingencyAmount;

    return { subtotal, contingencyAmount, totalBudget };
  },

  /**
   * Get budgets by status
   */
  async getByStatus(status: BudgetStatus): Promise<TrainingBudgetProposalRecord[]> {
    return trainingBudgetsCRUD.getByIndex('status', status);
  },

  /**
   * Override create to calculate totals
   */
  async create(data: CreateInput<TrainingBudgetProposalRecord>): Promise<TrainingBudgetProposalRecord> {
    const totals = this.calculateTotals(data);
    return trainingBudgetsCRUD.create({
      ...data,
      ...totals,
      status: (data.status || 'draft') as BudgetStatus,
      currency: data.currency || 'AFN',
    });
  },

  /**
   * Override update to recalculate totals
   */
  async update(id: number, data: Partial<TrainingBudgetProposalRecord>): Promise<TrainingBudgetProposalRecord> {
    const existing = await this.getById(id);
    if (!existing) throw new Error('Budget proposal not found');

    const totals = this.calculateTotals({ ...existing, ...data });
    return trainingBudgetsCRUD.update(id, {
      ...data,
      ...totals,
    });
  },
};

// ========== TRAININGS (SESSIONS/EVENTS) ==========

const trainingsCRUD = createCRUDService<TrainingRecord>('trainings');

export const trainingsDB = {
  ...trainingsCRUD,

  /**
   * Generate unique code (TRN-YYYY-###)
   */
  async generateCode(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('TRN', all.length + 1, true, 3);
  },

  /**
   * Get trainings by status
   */
  async getByStatus(status: TrainingStatus): Promise<TrainingRecord[]> {
    return trainingsCRUD.getByIndex('status', status);
  },

  /**
   * Get upcoming trainings
   */
  async getUpcoming(): Promise<TrainingRecord[]> {
    const all = await this.getAll();
    const today = new Date().toISOString().split('T')[0];
    return all.filter(t => t.startDate >= today && ['scheduled', 'confirmed'].includes(t.status));
  },
};

// ========== TRAINING PARTICIPANTS ==========

const trainingParticipantsCRUD = createCRUDService<TrainingParticipantRecord>('trainingParticipants');

export const trainingParticipantsDB = {
  ...trainingParticipantsCRUD,

  /**
   * Get participants by training
   */
  async getByTraining(trainingId: number): Promise<TrainingParticipantRecord[]> {
    return trainingParticipantsCRUD.getByIndex('trainingId', trainingId);
  },

  /**
   * Get participants by employee
   */
  async getByEmployee(employeeId: number): Promise<TrainingParticipantRecord[]> {
    return trainingParticipantsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Override create to update training participant count
   */
  async create(data: CreateInput<TrainingParticipantRecord>): Promise<TrainingParticipantRecord> {
    const participant = await trainingParticipantsCRUD.create({
      ...data,
      invitationStatus: data.invitationStatus || 'pending',
      attended: data.attended || false,
      feedbackSubmitted: data.feedbackSubmitted || false,
      certificateEligible: data.certificateEligible || false,
      certificateIssued: data.certificateIssued || false,
      invitedAt: data.invitedAt || new Date().toISOString(),
    });

    // Update training participant count
    if (data.trainingId) {
      const training = await trainingsDB.getById(data.trainingId);
      if (training) {
        await trainingsDB.update(data.trainingId, {
          actualParticipants: (training.actualParticipants || 0) + 1,
        });
      }
    }

    return participant;
  },

  /**
   * Override delete to update training participant count
   */
  async delete(id: number): Promise<void> {
    const participant = await this.getById(id);
    if (participant) {
      const training = await trainingsDB.getById(participant.trainingId);
      if (training && training.actualParticipants > 0) {
        await trainingsDB.update(participant.trainingId, {
          actualParticipants: training.actualParticipants - 1,
        });
      }
    }
    await trainingParticipantsCRUD.delete(id);
  },

  /**
   * Record attendance
   */
  async recordAttendance(id: number, attended: boolean, attendancePercentage = 100): Promise<TrainingParticipantRecord> {
    return this.update(id, {
      attended,
      attendancePercentage,
    });
  },

  /**
   * Submit assessment scores
   */
  async submitAssessment(
    id: number,
    preScore: number,
    postScore: number,
    passed: boolean
  ): Promise<TrainingParticipantRecord> {
    const participant = await this.getById(id);
    if (!participant) throw new Error('Participant not found');

    const improvementPercentage = preScore > 0 ? Math.round(((postScore - preScore) / preScore) * 100) : 0;

    const certificateEligible = (participant.attendancePercentage || 0) >= 80 && passed;

    return this.update(id, {
      preAssessmentScore: preScore,
      postAssessmentScore: postScore,
      improvementPercentage,
      passed,
      certificateEligible,
    });
  },
};

// ========== TRAINING SESSIONS ==========

const trainingSessionsCRUD = createCRUDService<TrainingSessionRecord>('trainingSessions');

export const trainingSessionsDB = {
  ...trainingSessionsCRUD,

  /**
   * Get sessions by training
   */
  async getByTraining(trainingId: number): Promise<TrainingSessionRecord[]> {
    const sessions = await trainingSessionsCRUD.getByIndex('trainingId', trainingId);
    return sessions.sort((a, b) => a.sessionNumber - b.sessionNumber);
  },
};

// ========== TRAINING EVALUATIONS ==========

const trainingEvaluationsCRUD = createCRUDService<TrainingEvaluationRecord>('trainingEvaluations');

export const trainingEvaluationsDB = {
  ...trainingEvaluationsCRUD,

  /**
   * Get evaluations by training
   */
  async getByTraining(trainingId: number): Promise<TrainingEvaluationRecord[]> {
    return trainingEvaluationsCRUD.getByIndex('trainingId', trainingId);
  },

  /**
   * Override create to update participant feedback status
   */
  async create(data: CreateInput<TrainingEvaluationRecord>): Promise<TrainingEvaluationRecord> {
    const evaluation = await trainingEvaluationsCRUD.create({
      ...data,
      evaluationDate: data.evaluationDate || new Date().toISOString().split('T')[0],
    });

    // Update participant feedback status
    if (data.participantId) {
      await trainingParticipantsDB.update(data.participantId, {
        feedbackSubmitted: true,
        feedbackRating: data.overallRating,
      });
    }

    return evaluation;
  },

  /**
   * Get average ratings for a training
   */
  async getAverageRatings(trainingId: number): Promise<{
    averageContentRating: number;
    averageTrainerRating: number;
    averageOverallRating: number;
    totalResponses: number;
    recommendationRate: number;
  } | null> {
    const evaluations = await this.getByTraining(trainingId);

    if (evaluations.length === 0) return null;

    const sum = (field: keyof TrainingEvaluationRecord) =>
      evaluations.reduce((acc, e) => acc + (Number(e[field]) || 0), 0);
    const avg = (field: keyof TrainingEvaluationRecord) =>
      Math.round((sum(field) / evaluations.length) * 10) / 10;

    return {
      averageContentRating: avg('contentQualityRating'),
      averageTrainerRating: avg('trainerDeliveryRating'),
      averageOverallRating: avg('overallRating'),
      totalResponses: evaluations.length,
      recommendationRate: Math.round((evaluations.filter(e => e.wouldRecommend).length / evaluations.length) * 100),
    };
  },
};

// ========== TRAINING CERTIFICATES ==========

const trainingCertificatesCRUD = createCRUDService<TrainingCertificateRecord>('trainingCertificates');

export const trainingCertificatesDB = {
  ...trainingCertificatesCRUD,

  /**
   * Generate unique number (CERT-YYYY-#####)
   */
  async generateNumber(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('CERT', all.length + 1, true, 5);
  },

  /**
   * Get certificates by training
   */
  async getByTraining(trainingId: number): Promise<TrainingCertificateRecord[]> {
    return trainingCertificatesCRUD.getByIndex('trainingId', trainingId);
  },

  /**
   * Get certificates by employee
   */
  async getByEmployee(employeeId: number): Promise<TrainingCertificateRecord[]> {
    return trainingCertificatesCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Issue a certificate
   */
  async issue(id: number): Promise<TrainingCertificateRecord> {
    const certificate = await this.getById(id);
    if (!certificate) throw new Error('Certificate not found');

    const updated = await this.update(id, {
      status: 'issued',
      issueDate: new Date().toISOString().split('T')[0],
    });

    // Update participant certificate status
    if (certificate.participantId) {
      await trainingParticipantsDB.update(certificate.participantId, {
        certificateIssued: true,
        certificateId: id,
      });
    }

    return updated;
  },
};

// ========== TRAINING BONDS ==========

const trainingBondsCRUD = createCRUDService<TrainingBondRecord>('trainingBonds');

export const trainingBondsDB = {
  ...trainingBondsCRUD,

  /**
   * Generate unique number (BOND-YYYY-####)
   */
  async generateNumber(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('BOND', all.length + 1, true, 4);
  },

  /**
   * Get bonds by employee
   */
  async getByEmployee(employeeId: number): Promise<TrainingBondRecord[]> {
    return trainingBondsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get bonds by status
   */
  async getByStatus(status: BondStatus): Promise<TrainingBondRecord[]> {
    return trainingBondsCRUD.getByIndex('status', status);
  },

  /**
   * Get active bonds
   */
  async getActive(): Promise<TrainingBondRecord[]> {
    return this.getByStatus('active');
  },

  /**
   * Sign a bond
   */
  async sign(id: number): Promise<TrainingBondRecord> {
    return this.update(id, {
      employeeSigned: true,
      employeeSignedAt: new Date().toISOString(),
      status: 'signed',
    });
  },

  /**
   * Activate a bond
   */
  async activate(id: number): Promise<TrainingBondRecord> {
    return this.update(id, {
      status: 'active',
    });
  },

  /**
   * Calculate bond recovery amount
   */
  calculateRecovery(
    bond: TrainingBondRecord,
    terminationDate: string
  ): {
    totalMonths: number;
    servedMonths: number;
    remainingMonths: number;
    recoveryAmount: number;
  } {
    const startDate = new Date(bond.bondStartDate);
    // const endDate = new Date(bond.bondEndDate);
    const termDate = new Date(terminationDate);

    const totalMonths = bond.bondDurationMonths;
    const servedMonths = Math.floor((termDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const remainingMonths = Math.max(0, totalMonths - servedMonths);

    const recoveryAmount = (bond.trainingCost / totalMonths) * remainingMonths;

    return {
      totalMonths,
      servedMonths,
      remainingMonths,
      recoveryAmount: Math.round(recoveryAmount * 100) / 100,
    };
  },
};

// ========== EMPLOYEE TRAINING HISTORY ==========

const employeeTrainingHistoryCRUD = createCRUDService<EmployeeTrainingHistoryRecord>('employeeTrainingHistory');

export const employeeTrainingHistoryDB = {
  ...employeeTrainingHistoryCRUD,

  /**
   * Get history by employee
   */
  async getByEmployee(employeeId: number): Promise<EmployeeTrainingHistoryRecord[]> {
    const items = await employeeTrainingHistoryCRUD.getByIndex('employeeId', employeeId);
    return items.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  },
};

// ========== TRAINING REPORTS ==========

const trainingReportsCRUD = createCRUDService<TrainingReportRecord>('trainingReports');

export const trainingReportsDB = {
  ...trainingReportsCRUD,

  /**
   * Generate unique number (TRPT-YYYY-####)
   */
  async generateNumber(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('TRPT', all.length + 1, true, 4);
  },

  /**
   * Get reports by training
   */
  async getByTraining(trainingId: number): Promise<TrainingReportRecord[]> {
    return trainingReportsCRUD.getByIndex('trainingId', trainingId);
  },

  /**
   * Generate report from training data
   */
  async generateFromTraining(trainingId: number): Promise<TrainingReportRecord> {
    const training = await trainingsDB.getById(trainingId);
    if (!training) throw new Error('Training not found');
    const participants = await trainingParticipantsDB.getByTraining(trainingId);
    // const evaluations = await trainingEvaluationsDB.getByTraining(trainingId);
    const evalRatings = await trainingEvaluationsDB.getAverageRatings(trainingId);

    const attended = participants.filter(p => p.attended);
    const passed = participants.filter(p => p.passed);

    const avgPreScore =
      attended.length > 0 ? attended.reduce((sum, p) => sum + (p.preAssessmentScore || 0), 0) / attended.length : 0;
    const avgPostScore =
      attended.length > 0 ? attended.reduce((sum, p) => sum + (p.postAssessmentScore || 0), 0) / attended.length : 0;

    const reportData: CreateInput<TrainingReportRecord> = {
      trainingId,
      reportNumber: training.trainingCode,
      reportDate: training.endDate,
      status: "draft",
      totalInvited: participants.length,
      totalAttended: attended.length,
      attendanceRate: participants.length > 0 ? Math.round((attended.length / participants.length) * 100) : 0,
      averagePreScore: Math.round(avgPreScore * 10) / 10,
      averagePostScore: Math.round(avgPostScore * 10) / 10,
      averageImprovement: Math.round((avgPostScore - avgPreScore) * 10) / 10,
      passRate: attended.length > 0 ? Math.round((passed.length / attended.length) * 100) : 0,
      ...evalRatings,
    };

    return await this.create(reportData);
  },
};

// ========== DASHBOARD STATISTICS ==========

export const trainingDashboardService = {
  /**
   * Get training dashboard statistics
   */
  async getStats() {

    const [trainings, tnas, budgets, certificates, bonds] = await Promise.all([
      trainingsDB.getAll(),
      tnasDB.getAll(),
      trainingBudgetsDB.getAll(),
      trainingCertificatesDB.getAll(),
      trainingBondsDB.getAll(),
    ]);

    const today = new Date().toISOString().split('T')[0];
    const currentYear = new Date().getFullYear();
    const thisYearTrainings = trainings.filter(t => t.startDate?.startsWith(String(currentYear)));

    return {
      totalTrainings: trainings.length,
      upcomingTrainings: trainings.filter(t => t.startDate >= today && ['scheduled', 'confirmed'].includes(t.status))
        .length,
      completedTrainings: trainings.filter(t => t.status === 'completed').length,
      inProgressTrainings: trainings.filter(t => t.status === 'in_progress').length,
      totalTNAs: tnas.length,
      pendingTNAs: tnas.filter(t => t.status === 'draft' || t.status === 'submitted').length,
      totalBudgetProposals: budgets.length,
      pendingBudgets: budgets.filter(b => b.status === 'submitted').length,
      approvedBudgets: budgets.filter(b => b.status === 'approved').length,
      totalCertificates: certificates.length,
      issuedCertificates: certificates.filter(c => c.status === 'issued').length,
      activeBonds: bonds.filter(b => b.status === 'active').length,
      thisYearTrainings: thisYearTrainings.length,
      thisYearCompleted: thisYearTrainings.filter(t => t.status === 'completed').length,
    };
  },

  /**
   * Get recent trainings
   */
  async getRecentTrainings(limit = 5): Promise<TrainingRecord[]> {
    const trainings = await trainingsDB.getAll();
    return trainings.slice(0, limit);
  },

  /**
   * Get upcoming trainings
   */
  async getUpcomingTrainings(limit = 5): Promise<TrainingRecord[]> {
    const upcoming = await trainingsDB.getUpcoming();
    return upcoming.slice(0, limit);
  },
};

// ========== BACKWARD COMPATIBILITY ALIASES ==========

/**
 * Backward compatibility aliases for renamed services
 * Maps old naming conventions to new ones (plural to singular, *DB to *Service, alternative names)
 */

// Singular variations (*DB pattern)
export const trainingTypeDB = trainingTypesDB;
export const trainingProgramDB = trainingProgramsDB;
export const tnaDB = tnasDB;
export const trainingBudgetDB = trainingBudgetsDB;
export const trainingDB = trainingsDB;
export const trainingParticipantDB = trainingParticipantsDB;
export const trainingSessionDB = trainingSessionsDB;
export const trainingEvaluationDB = trainingEvaluationsDB;
export const trainingCertificateDB = trainingCertificatesDB;
export const trainingBondDB = trainingBondsDB;
export const trainingReportDB = trainingReportsDB;

// Service pattern aliases (*Service instead of *DB)
export const trainingTypesService = trainingTypesDB;
export const trainingTypeService = trainingTypesDB;
export const trainingProgramsService = trainingProgramsDB;
export const trainingProgramService = trainingProgramsDB;
export const tnasService = tnasDB;
export const tnaService = tnasDB;
export const tnaTrainingNeedsService = tnaTrainingNeedsDB;
export const trainingCalendarService = trainingCalendarDB;
export const trainingBudgetsService = trainingBudgetsDB;
export const trainingBudgetService = trainingBudgetsDB;
export const trainingsService = trainingsDB;
export const trainingParticipantsService = trainingParticipantsDB;
export const trainingParticipantService = trainingParticipantsDB;
export const trainingSessionsService = trainingSessionsDB;
export const trainingSessionService = trainingSessionsDB;
export const trainingEvaluationsService = trainingEvaluationsDB;
export const trainingEvaluationService = trainingEvaluationsDB;
export const trainingCertificatesService = trainingCertificatesDB;
export const trainingCertificateService = trainingCertificatesDB;
export const trainingBondsService = trainingBondsDB;
export const trainingBondService = trainingBondsDB;
export const employeeTrainingHistoryService = employeeTrainingHistoryDB;
export const trainingReportsService = trainingReportsDB;
export const trainingReportService = trainingReportsDB;

// Alternative naming conventions
export const tnaItemDB = tnaTrainingNeedsDB;
export const tnaItemService = tnaTrainingNeedsDB;
export const trainingAttendanceDB = trainingParticipantsDB;
export const trainingAttendanceService = trainingParticipantsDB;

// ========== MAIN EXPORT ==========

/**
 * Training Service - Main entry point
 */
export const trainingService = {
  // Core training setup
  types: trainingTypesDB,
  programs: trainingProgramsDB,

  // Training Needs Assessment
  tnas: tnasDB,
  tnaNeeds: tnaTrainingNeedsDB,

  // Planning
  calendar: trainingCalendarDB,
  budgets: trainingBudgetsDB,

  // Training execution
  trainings: trainingsDB,
  participants: trainingParticipantsDB,
  sessions: trainingSessionsDB,

  // Evaluation & certification
  evaluations: trainingEvaluationsDB,
  certificates: trainingCertificatesDB,

  // Bonds & history
  bonds: trainingBondsDB,
  history: employeeTrainingHistoryDB,

  // Reporting
  reports: trainingReportsDB,
  dashboard: trainingDashboardService,
};

export default trainingService;
