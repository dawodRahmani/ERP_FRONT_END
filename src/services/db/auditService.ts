/**
 * Audit Module Service
 *
 * Comprehensive audit management system covering:
 * - Audit Types (configurable)
 * - HACT Assessments
 * - Donor Project Audits
 * - External Audits
 * - Internal Audits
 * - Partner Audits
 * - Corrective Actions
 * - Dashboard Statistics
 */

import type {
  AuditTypeRecord,
  AuditTypeCategory,
  AuditStatus,
  HACTAssessmentRecord,
  DonorProjectAuditRecord,
  ExternalAuditRecord,
  ExternalAnnualAuditRecord,
  InternalAuditRecord,
  InternalQuarterlyReportRecord,
  PartnerAuditRecord,
  CorrectiveActionRecord,
  CorrectiveActionStatus,
  AuditEntityType,
  AuditDashboardStats,
  RecentAuditItem,
  UpcomingAuditItem,
} from '../../types/modules/audit';
import { createCRUDService } from './core/crud';
import { generateFormattedCode } from './core/utils';

// ========== AUDIT TYPES ==========

const auditTypesCRUD = createCRUDService<AuditTypeRecord>('auditTypes');

export const auditTypesDB = {
  ...auditTypesCRUD,

  async generateCode(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('AT', all.length + 1, false, 3);
  },

  async getActive(): Promise<AuditTypeRecord[]> {
    const all = await this.getAll();
    return all.filter((t) => t.isActive);
  },

  async getByCategory(category: AuditTypeCategory): Promise<AuditTypeRecord[]> {
    return auditTypesCRUD.getByIndex('category', category);
  },

  async getByCode(code: string): Promise<AuditTypeRecord | undefined> {
    const records = await auditTypesCRUD.getByIndex('code', code);
    return records[0];
  },
};

// ========== HACT ASSESSMENTS ==========

const hactAssessmentsCRUD = createCRUDService<HACTAssessmentRecord>('hactAssessments');

export const hactAssessmentsDB = {
  ...hactAssessmentsCRUD,

  async generateNumber(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('HACT', all.length + 1, true, 4);
  },

  async getByDonor(donorId: number): Promise<HACTAssessmentRecord[]> {
    return hactAssessmentsCRUD.getByIndex('donorId', donorId);
  },

  async getByStatus(status: AuditStatus): Promise<HACTAssessmentRecord[]> {
    return hactAssessmentsCRUD.getByIndex('status', status);
  },

  async getExpiringSoon(days = 30): Promise<HACTAssessmentRecord[]> {
    const all = await this.getAll();
    const today = new Date();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);
    const todayStr = today.toISOString().split('T')[0];
    const cutoffStr = cutoff.toISOString().split('T')[0];

    return all.filter(
      (a) => a.validUntil && a.validUntil >= todayStr && a.validUntil <= cutoffStr
    );
  },

  async getExpired(): Promise<HACTAssessmentRecord[]> {
    const all = await this.getAll();
    const today = new Date().toISOString().split('T')[0];

    return all.filter((a) => a.validUntil && a.validUntil < today);
  },
};

// ========== DONOR PROJECT AUDITS ==========

const donorProjectAuditsCRUD = createCRUDService<DonorProjectAuditRecord>('donorProjectAudits');

export const donorProjectAuditsDB = {
  ...donorProjectAuditsCRUD,

  async generateNumber(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('DPA', all.length + 1, true, 4);
  },

  async getByDonor(donorId: number): Promise<DonorProjectAuditRecord[]> {
    return donorProjectAuditsCRUD.getByIndex('donorId', donorId);
  },

  async getByProject(projectId: number): Promise<DonorProjectAuditRecord[]> {
    return donorProjectAuditsCRUD.getByIndex('projectId', projectId);
  },

  async getByStatus(status: AuditStatus): Promise<DonorProjectAuditRecord[]> {
    return donorProjectAuditsCRUD.getByIndex('status', status);
  },

  async getByDonorAndProject(
    donorId: number,
    projectId: number
  ): Promise<DonorProjectAuditRecord[]> {
    const all = await this.getAll();
    return all.filter((a) => a.donorId === donorId && a.projectId === projectId);
  },
};

// ========== EXTERNAL AUDITS ==========

const externalAuditsCRUD = createCRUDService<ExternalAuditRecord>('externalAudits');
const externalAnnualAuditsCRUD = createCRUDService<ExternalAnnualAuditRecord>('externalAnnualAudits');

export const externalAuditsDB = {
  ...externalAuditsCRUD,

  async generateNumber(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('EXT', all.length + 1, true, 4);
  },

  async getByAuditType(auditTypeId: number): Promise<ExternalAuditRecord[]> {
    return externalAuditsCRUD.getByIndex('auditTypeId', auditTypeId);
  },

  async getByStatus(status: AuditStatus): Promise<ExternalAuditRecord[]> {
    return externalAuditsCRUD.getByIndex('status', status);
  },

  async getRequiringFollowUp(): Promise<ExternalAuditRecord[]> {
    const all = await this.getAll();
    return all.filter((a) => a.followUpNeeded);
  },

  async getUpcoming(days = 30): Promise<ExternalAuditRecord[]> {
    const all = await this.getAll();
    const today = new Date().toISOString().split('T')[0];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    return all.filter(
      (a) =>
        a.dateAuditPlanned >= today &&
        a.dateAuditPlanned <= cutoffStr &&
        ['planned', 'draft'].includes(a.status)
    );
  },

  // Annual audit sub-records
  annualAudits: {
    ...externalAnnualAuditsCRUD,

    async getByExternalAudit(externalAuditId: number): Promise<ExternalAnnualAuditRecord[]> {
      const records = await externalAnnualAuditsCRUD.getByIndex(
        'externalAuditId',
        externalAuditId
      );
      return records.sort((a, b) => b.year - a.year);
    },

    async getByYear(year: number): Promise<ExternalAnnualAuditRecord[]> {
      return externalAnnualAuditsCRUD.getByIndex('year', year);
    },
  },
};

// ========== INTERNAL AUDITS ==========

const internalAuditsCRUD = createCRUDService<InternalAuditRecord>('internalAudits');
const internalQuarterlyReportsCRUD =
  createCRUDService<InternalQuarterlyReportRecord>('internalQuarterlyReports');

export const internalAuditsDB = {
  ...internalAuditsCRUD,

  async generateNumber(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('INT', all.length + 1, true, 4);
  },

  async getByAuditType(auditTypeId: number): Promise<InternalAuditRecord[]> {
    return internalAuditsCRUD.getByIndex('auditTypeId', auditTypeId);
  },

  async getByDonor(donorId: number): Promise<InternalAuditRecord[]> {
    return internalAuditsCRUD.getByIndex('donorId', donorId);
  },

  async getByProject(projectId: number): Promise<InternalAuditRecord[]> {
    return internalAuditsCRUD.getByIndex('projectId', projectId);
  },

  async getByStatus(status: AuditStatus): Promise<InternalAuditRecord[]> {
    return internalAuditsCRUD.getByIndex('status', status);
  },

  async getRequiringFollowUp(): Promise<InternalAuditRecord[]> {
    const all = await this.getAll();
    return all.filter((a) => a.followUpNeeded);
  },

  async getUpcoming(days = 30): Promise<InternalAuditRecord[]> {
    const all = await this.getAll();
    const today = new Date().toISOString().split('T')[0];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    return all.filter(
      (a) =>
        a.dateAuditPlanned >= today &&
        a.dateAuditPlanned <= cutoffStr &&
        ['planned', 'draft'].includes(a.status)
    );
  },

  // Quarterly reports sub-records
  quarterlyReports: {
    ...internalQuarterlyReportsCRUD,

    async getByInternalAudit(
      internalAuditId: number
    ): Promise<InternalQuarterlyReportRecord[]> {
      return internalQuarterlyReportsCRUD.getByIndex('internalAuditId', internalAuditId);
    },

    async getByYear(year: number): Promise<InternalQuarterlyReportRecord[]> {
      return internalQuarterlyReportsCRUD.getByIndex('year', year);
    },

    async getByYearQuarter(
      year: number,
      quarter: string
    ): Promise<InternalQuarterlyReportRecord[]> {
      const all = await this.getAll();
      return all.filter((r) => r.year === year && r.quarter === quarter);
    },
  },
};

// ========== PARTNER AUDITS ==========

const partnerAuditsCRUD = createCRUDService<PartnerAuditRecord>('partnerAudits');

export const partnerAuditsDB = {
  ...partnerAuditsCRUD,

  async generateNumber(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('PTR', all.length + 1, true, 4);
  },

  async getByPartner(partnerName: string): Promise<PartnerAuditRecord[]> {
    return partnerAuditsCRUD.getByIndex('partnerName', partnerName);
  },

  async getByAuditType(auditTypeId: number): Promise<PartnerAuditRecord[]> {
    return partnerAuditsCRUD.getByIndex('auditTypeId', auditTypeId);
  },

  async getByModality(modality: string): Promise<PartnerAuditRecord[]> {
    return partnerAuditsCRUD.getByIndex('auditModality', modality);
  },

  async getBySource(source: string): Promise<PartnerAuditRecord[]> {
    return partnerAuditsCRUD.getByIndex('auditSource', source);
  },

  async getByStatus(status: AuditStatus): Promise<PartnerAuditRecord[]> {
    return partnerAuditsCRUD.getByIndex('status', status);
  },

  async getRequiringFollowUp(): Promise<PartnerAuditRecord[]> {
    const all = await this.getAll();
    return all.filter((a) => a.followUpNeeded);
  },

  async getUpcoming(days = 30): Promise<PartnerAuditRecord[]> {
    const all = await this.getAll();
    const today = new Date().toISOString().split('T')[0];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    return all.filter(
      (a) =>
        a.dateAuditPlanned >= today &&
        a.dateAuditPlanned <= cutoffStr &&
        ['planned', 'draft'].includes(a.status)
    );
  },
};

// ========== CORRECTIVE ACTIONS ==========

const correctiveActionsCRUD =
  createCRUDService<CorrectiveActionRecord>('auditCorrectiveActions');

export const correctiveActionsDB = {
  ...correctiveActionsCRUD,

  async getByAudit(
    auditEntityType: AuditEntityType,
    auditId: number
  ): Promise<CorrectiveActionRecord[]> {
    const all = await this.getAll();
    return all.filter((ca) => ca.auditEntityType === auditEntityType && ca.auditId === auditId);
  },

  async getByStatus(status: CorrectiveActionStatus): Promise<CorrectiveActionRecord[]> {
    return correctiveActionsCRUD.getByIndex('status', status);
  },

  async getOverdue(): Promise<CorrectiveActionRecord[]> {
    const all = await this.getAll();
    const today = new Date().toISOString().split('T')[0];
    return all.filter((ca) => ca.dueDate && ca.dueDate < today && ca.status !== 'completed');
  },

  async getPending(): Promise<CorrectiveActionRecord[]> {
    return this.getByStatus('pending');
  },

  async getInProgress(): Promise<CorrectiveActionRecord[]> {
    return this.getByStatus('in_progress');
  },

  async getDueSoon(days = 7): Promise<CorrectiveActionRecord[]> {
    const all = await this.getAll();
    const today = new Date();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);
    const todayStr = today.toISOString().split('T')[0];
    const cutoffStr = cutoff.toISOString().split('T')[0];

    return all.filter(
      (ca) =>
        ca.dueDate &&
        ca.dueDate >= todayStr &&
        ca.dueDate <= cutoffStr &&
        ca.status !== 'completed'
    );
  },
};

// ========== DASHBOARD SERVICE ==========

export const auditDashboardService = {
  async getStats(): Promise<AuditDashboardStats> {
    const [hactAssessments, donorProjectAudits, externalAudits, internalAudits, partnerAudits, correctiveActions] =
      await Promise.all([
        hactAssessmentsDB.getAll(),
        donorProjectAuditsDB.getAll(),
        externalAuditsDB.getAll(),
        internalAuditsDB.getAll(),
        partnerAuditsDB.getAll(),
        correctiveActionsDB.getAll(),
      ]);

    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const thirtyDaysStr = thirtyDaysFromNow.toISOString().split('T')[0];

    // Combine all audits for aggregate statistics
    const allAudits = [
      ...hactAssessments.map((a) => ({ ...a, type: 'hact' as const })),
      ...donorProjectAudits.map((a) => ({ ...a, type: 'donor_project' as const })),
      ...externalAudits.map((a) => ({ ...a, type: 'external' as const })),
      ...internalAudits.map((a) => ({ ...a, type: 'internal' as const })),
      ...partnerAudits.map((a) => ({ ...a, type: 'partner' as const })),
    ];

    // Calculate upcoming audits (those with dateAuditPlanned)
    const upcomingAuditCount = [...externalAudits, ...internalAudits, ...partnerAudits].filter(
      (a) =>
        a.dateAuditPlanned >= today &&
        a.dateAuditPlanned <= thirtyDaysStr &&
        ['planned', 'draft'].includes(a.status)
    ).length;

    // Calculate expiring HACT assessments
    const expiringHACTCount = hactAssessments.filter(
      (a) => a.validUntil && a.validUntil >= today && a.validUntil <= thirtyDaysStr
    ).length;

    // Calculate corrective actions stats
    const pendingCACount = correctiveActions.filter(
      (ca) => ca.status === 'pending' || ca.status === 'in_progress'
    ).length;

    const overdueCACount = correctiveActions.filter(
      (ca) => ca.dueDate && ca.dueDate < today && ca.status !== 'completed'
    ).length;

    // Calculate audits requiring follow-up
    const followUpCount = [
      ...externalAudits.filter((a) => a.followUpNeeded),
      ...internalAudits.filter((a) => a.followUpNeeded),
      ...partnerAudits.filter((a) => a.followUpNeeded),
    ].length;

    return {
      totalHACT: hactAssessments.length,
      totalDonorProject: donorProjectAudits.length,
      totalExternal: externalAudits.length,
      totalInternal: internalAudits.length,
      totalPartner: partnerAudits.length,
      totalAudits: allAudits.length,
      inProgressAudits: allAudits.filter((a) => a.status === 'in_progress').length,
      completedAudits: allAudits.filter((a) => a.status === 'completed').length,
      plannedAudits: allAudits.filter((a) => a.status === 'planned').length,
      upcomingAudits: upcomingAuditCount,
      expiringHACT: expiringHACTCount,
      pendingCorrectiveActions: pendingCACount,
      overdueCorrectiveActions: overdueCACount,
      auditsRequiringFollowUp: followUpCount,
    };
  },

  async getRecentAudits(limit = 10): Promise<RecentAuditItem[]> {
    const [hact, donor, external, internal, partner] = await Promise.all([
      hactAssessmentsDB.getAll(),
      donorProjectAuditsDB.getAll(),
      externalAuditsDB.getAll(),
      internalAuditsDB.getAll(),
      partnerAuditsDB.getAll(),
    ]);

    const all: RecentAuditItem[] = [
      ...hact.map((a) => ({
        id: a.id,
        assessmentNumber: a.assessmentNumber,
        auditCategory: 'HACT Assessment',
        status: a.status,
        createdAt: a.createdAt,
        donorName: a.donorName,
      })),
      ...donor.map((a) => ({
        id: a.id,
        auditNumber: a.auditNumber,
        auditCategory: 'Donor Project Audit',
        status: a.status,
        createdAt: a.createdAt,
        donorName: a.donorName,
        auditCompanyName: a.auditCompanyName,
      })),
      ...external.map((a) => ({
        id: a.id,
        auditNumber: a.auditNumber,
        auditCategory: 'External Audit',
        status: a.status,
        createdAt: a.createdAt,
        auditCompanyName: a.auditCompanyName,
      })),
      ...internal.map((a) => ({
        id: a.id,
        auditNumber: a.auditNumber,
        auditCategory: 'Internal Audit',
        status: a.status,
        createdAt: a.createdAt,
        donorName: a.donorName,
      })),
      ...partner.map((a) => ({
        id: a.id,
        auditNumber: a.auditNumber,
        auditCategory: 'Partner Audit',
        status: a.status,
        createdAt: a.createdAt,
        partnerName: a.partnerName,
        auditCompanyName: a.auditCompanyName,
      })),
    ];

    return all
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  async getUpcomingAudits(limit = 10): Promise<UpcomingAuditItem[]> {
    const today = new Date().toISOString().split('T')[0];
    const sixtyDays = new Date();
    sixtyDays.setDate(sixtyDays.getDate() + 60);
    const sixtyDaysStr = sixtyDays.toISOString().split('T')[0];

    const [external, internal, partner] = await Promise.all([
      externalAuditsDB.getAll(),
      internalAuditsDB.getAll(),
      partnerAuditsDB.getAll(),
    ]);

    const upcoming: UpcomingAuditItem[] = [
      ...external
        .filter(
          (a) =>
            a.dateAuditPlanned >= today &&
            a.dateAuditPlanned <= sixtyDaysStr &&
            ['planned', 'draft'].includes(a.status)
        )
        .map((a) => ({
          id: a.id,
          auditNumber: a.auditNumber,
          auditCategory: 'External Audit',
          dateAuditPlanned: a.dateAuditPlanned,
          status: a.status,
          auditTypeName: a.auditTypeName,
          auditCompanyName: a.auditCompanyName,
        })),
      ...internal
        .filter(
          (a) =>
            a.dateAuditPlanned >= today &&
            a.dateAuditPlanned <= sixtyDaysStr &&
            ['planned', 'draft'].includes(a.status)
        )
        .map((a) => ({
          id: a.id,
          auditNumber: a.auditNumber,
          auditCategory: 'Internal Audit',
          dateAuditPlanned: a.dateAuditPlanned,
          status: a.status,
          auditTypeName: a.auditTypeName,
        })),
      ...partner
        .filter(
          (a) =>
            a.dateAuditPlanned >= today &&
            a.dateAuditPlanned <= sixtyDaysStr &&
            ['planned', 'draft'].includes(a.status)
        )
        .map((a) => ({
          id: a.id,
          auditNumber: a.auditNumber,
          auditCategory: 'Partner Audit',
          dateAuditPlanned: a.dateAuditPlanned,
          status: a.status,
          auditTypeName: a.auditTypeName,
          partnerName: a.partnerName,
          auditCompanyName: a.auditCompanyName,
        })),
    ];

    return upcoming
      .sort((a, b) => new Date(a.dateAuditPlanned).getTime() - new Date(b.dateAuditPlanned).getTime())
      .slice(0, limit);
  },
};

// ========== MAIN EXPORT ==========

export const auditService = {
  types: auditTypesDB,
  hact: hactAssessmentsDB,
  donorProject: donorProjectAuditsDB,
  external: externalAuditsDB,
  internal: internalAuditsDB,
  partner: partnerAuditsDB,
  correctiveActions: correctiveActionsDB,
  dashboard: auditDashboardService,
};

export default auditService;
