/**
 * Program Module Service
 *
 * Comprehensive program management system covering:
 * - Donors (master data)
 * - Projects (master data linked to donors)
 * - Work Plans (project activities)
 * - Certificates (stakeholder certificates)
 * - Documents (project documentation)
 * - Reporting (donor/project reports)
 * - Beneficiaries (program beneficiaries)
 * - Safeguarding (safeguarding activities)
 */

import type {
  ProgramDonorRecord,
  ProgramProjectRecord,
  ProgramWorkPlanRecord,
  ProgramCertificateRecord,
  ProgramDocumentRecord,
  ProgramReportingRecord,
  ProgramBeneficiaryRecord,
  ProgramSafeguardingRecord,
  DonorStatus,
  ProjectStatus,
  ReportStatus,
  BeneficiaryStatus,
  SafeguardingStatus,
  ThematicArea,
} from '../../types/modules/program';
import { createCRUDService } from './core/crud';
import { generateFormattedCode } from './core/utils';

// ========== DONORS ==========

const donorsCRUD = createCRUDService<ProgramDonorRecord>('programDonors');

export const programDonorsDB = {
  ...donorsCRUD,

  /**
   * Generate unique code (DNR-####)
   */
  async generateCode(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('DNR', all.length + 1, false, 4);
  },

  /**
   * Get active donors
   */
  async getActive(): Promise<ProgramDonorRecord[]> {
    return donorsCRUD.getByIndex('status', 'active' as DonorStatus);
  },

  /**
   * Get donors by type
   */
  async getByType(donorType: string): Promise<ProgramDonorRecord[]> {
    return donorsCRUD.getByIndex('donorType', donorType);
  },

  /**
   * Get donors by country
   */
  async getByCountry(country: string): Promise<ProgramDonorRecord[]> {
    return donorsCRUD.getByIndex('country', country);
  },

  /**
   * Get donors for dropdown
   */
  async getForDropdown(): Promise<{ id: number; label: string }[]> {
    const donors = await this.getActive();
    return donors.map(d => ({ id: d.id!, label: d.donorName }));
  },
};

// ========== PROJECTS ==========

const projectsCRUD = createCRUDService<ProgramProjectRecord>('programProjects');

export const programProjectsDB = {
  ...projectsCRUD,

  /**
   * Get projects by donor
   */
  async getByDonor(donorId: number): Promise<ProgramProjectRecord[]> {
    return projectsCRUD.getByIndex('donorId', donorId);
  },

  /**
   * Get projects by status
   */
  async getByStatus(status: ProjectStatus): Promise<ProgramProjectRecord[]> {
    return projectsCRUD.getByIndex('status', status);
  },

  /**
   * Get active projects (not cancelled/stopped/completed)
   */
  async getActive(): Promise<ProgramProjectRecord[]> {
    const all = await this.getAll();
    const activeStatuses: ProjectStatus[] = ['not_started', 'in_progress', 'ongoing', 'amendment'];
    return all.filter(p => activeStatuses.includes(p.status));
  },

  /**
   * Get projects by thematic area
   */
  async getByThematicArea(area: ThematicArea): Promise<ProgramProjectRecord[]> {
    return projectsCRUD.getByIndex('thematicArea', area);
  },

  /**
   * Get projects for dropdown
   */
  async getForDropdown(): Promise<{ id: number; label: string; code: string; donorId?: number }[]> {
    const projects = await this.getActive();
    return projects.map(p => ({
      id: p.id!,
      label: p.projectName,
      code: p.projectCode,
      donorId: p.donorId,
    }));
  },

  /**
   * Check if project code exists
   */
  async codeExists(code: string, excludeId?: number): Promise<boolean> {
    const existing = await projectsCRUD.getByIndex('projectCode', code);
    if (excludeId) {
      return existing.some(p => p.id !== excludeId);
    }
    return existing.length > 0;
  },

  /**
   * Get projects ending soon (within days)
   */
  async getEndingSoon(days: number = 30): Promise<ProgramProjectRecord[]> {
    const all = await this.getActive();
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return all.filter(p => {
      const endDate = new Date(p.endDate);
      return endDate >= today && endDate <= futureDate;
    });
  },
};

// ========== WORK PLANS ==========

const workPlansCRUD = createCRUDService<ProgramWorkPlanRecord>('programWorkPlans');

export const programWorkPlansDB = {
  ...workPlansCRUD,

  /**
   * Generate unique code (WP-YYYY-####)
   */
  async generateCode(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('WP', all.length + 1, true, 4);
  },

  /**
   * Get work plans by project
   */
  async getByProject(projectId: number): Promise<ProgramWorkPlanRecord[]> {
    return workPlansCRUD.getByIndex('projectId', projectId);
  },

  /**
   * Get work plans by thematic area
   */
  async getByThematicArea(area: ThematicArea): Promise<ProgramWorkPlanRecord[]> {
    return workPlansCRUD.getByIndex('thematicArea', area);
  },

  /**
   * Get work plans by focal point
   */
  async getByFocalPoint(focalPoint: string): Promise<ProgramWorkPlanRecord[]> {
    return workPlansCRUD.getByIndex('focalPoint', focalPoint);
  },

  /**
   * Get work plans with upcoming timeline activities
   */
  async getWithUpcomingActivities(days: number = 15): Promise<ProgramWorkPlanRecord[]> {
    const all = await this.getAll();
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    return all.filter(wp => {
      if (!wp.timeline || wp.timeline.length === 0) return false;
      return wp.timeline.some(t => {
        if (t.status === 'completed') return false;
        if (t.year < currentYear) return false;
        if (t.year === currentYear && t.month < currentMonth) return false;
        if (t.year === currentYear && t.month === currentMonth) return true;
        // Check if within reminder days
        const activityDate = new Date(t.year, t.month - 1, 1);
        const diffDays = Math.ceil((activityDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= days;
      });
    });
  },
};

// ========== CERTIFICATES ==========

const certificatesCRUD = createCRUDService<ProgramCertificateRecord>('programCertificates');

export const programCertificatesDB = {
  ...certificatesCRUD,

  /**
   * Generate unique code (CERT-YYYY-####)
   */
  async generateCode(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('PCERT', all.length + 1, true, 4);
  },

  /**
   * Get certificates by project
   */
  async getByProject(projectId: number): Promise<ProgramCertificateRecord[]> {
    return certificatesCRUD.getByIndex('projectId', projectId);
  },

  /**
   * Get certificates by agency
   */
  async getByAgency(agency: string): Promise<ProgramCertificateRecord[]> {
    return certificatesCRUD.getByIndex('agency', agency);
  },

  /**
   * Get certificates by year
   */
  async getByYear(year: number): Promise<ProgramCertificateRecord[]> {
    return certificatesCRUD.getByIndex('year', year);
  },

  /**
   * Get certificates by document type
   */
  async getByDocumentType(docType: string): Promise<ProgramCertificateRecord[]> {
    return certificatesCRUD.getByIndex('documentType', docType);
  },
};

// ========== DOCUMENTS ==========

const documentsCRUD = createCRUDService<ProgramDocumentRecord>('programDocuments');

export const programDocumentsDB = {
  ...documentsCRUD,

  /**
   * Generate unique code (DOC-YYYY-####)
   */
  async generateCode(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('PDOC', all.length + 1, true, 4);
  },

  /**
   * Get documents by project
   */
  async getByProject(projectId: number): Promise<ProgramDocumentRecord[]> {
    return documentsCRUD.getByIndex('projectId', projectId);
  },

  /**
   * Get documents by type
   */
  async getByType(docType: string): Promise<ProgramDocumentRecord[]> {
    return documentsCRUD.getByIndex('documentType', docType);
  },

  /**
   * Get documents uploaded by user
   */
  async getByUploader(uploadedBy: string): Promise<ProgramDocumentRecord[]> {
    return documentsCRUD.getByIndex('uploadedBy', uploadedBy);
  },

  /**
   * Get recent documents
   */
  async getRecent(limit: number = 10): Promise<ProgramDocumentRecord[]> {
    const all = await this.getAll();
    return all
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      .slice(0, limit);
  },
};

// ========== REPORTING ==========

const reportingCRUD = createCRUDService<ProgramReportingRecord>('programReporting');

export const programReportingDB = {
  ...reportingCRUD,

  /**
   * Generate unique code (RPT-YYYY-####)
   */
  async generateCode(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('PRPT', all.length + 1, true, 4);
  },

  /**
   * Get reports by project
   */
  async getByProject(projectId: number): Promise<ProgramReportingRecord[]> {
    return reportingCRUD.getByIndex('projectId', projectId);
  },

  /**
   * Get reports by status
   */
  async getByStatus(status: ReportStatus): Promise<ProgramReportingRecord[]> {
    return reportingCRUD.getByIndex('status', status);
  },

  /**
   * Get pending reports
   */
  async getPending(): Promise<ProgramReportingRecord[]> {
    return this.getByStatus('pending');
  },

  /**
   * Get overdue reports
   */
  async getOverdue(): Promise<ProgramReportingRecord[]> {
    const all = await this.getAll();
    const today = new Date().toISOString().split('T')[0];
    return all.filter(r => r.status === 'pending' && r.dueDate < today);
  },

  /**
   * Get reports due soon (within reminder days)
   */
  async getDueSoon(days: number = 10): Promise<ProgramReportingRecord[]> {
    const all = await this.getAll();
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    const todayStr = today.toISOString().split('T')[0];
    const futureStr = futureDate.toISOString().split('T')[0];

    return all.filter(r =>
      r.status === 'pending' &&
      r.dueDate >= todayStr &&
      r.dueDate <= futureStr
    );
  },

  /**
   * Mark report as submitted
   */
  async markSubmitted(id: number): Promise<ProgramReportingRecord> {
    return this.update(id, {
      status: 'submitted',
      submittedDate: new Date().toISOString().split('T')[0],
    });
  },

  /**
   * Get reports by type
   */
  async getByType(reportType: string): Promise<ProgramReportingRecord[]> {
    return reportingCRUD.getByIndex('reportType', reportType);
  },
};

// ========== BENEFICIARIES ==========

const beneficiariesCRUD = createCRUDService<ProgramBeneficiaryRecord>('programBeneficiaries');

export const programBeneficiariesDB = {
  ...beneficiariesCRUD,

  /**
   * Generate unique code (BEN-YYYY-#####)
   */
  async generateCode(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('BEN', all.length + 1, true, 5);
  },

  /**
   * Get beneficiaries by project
   */
  async getByProject(projectId: number): Promise<ProgramBeneficiaryRecord[]> {
    return beneficiariesCRUD.getByIndex('projectId', projectId);
  },

  /**
   * Get beneficiaries by type
   */
  async getByType(beneficiaryType: string): Promise<ProgramBeneficiaryRecord[]> {
    return beneficiariesCRUD.getByIndex('beneficiaryType', beneficiaryType);
  },

  /**
   * Get beneficiaries by status
   */
  async getByStatus(status: BeneficiaryStatus): Promise<ProgramBeneficiaryRecord[]> {
    return beneficiariesCRUD.getByIndex('status', status);
  },

  /**
   * Get verified beneficiaries
   */
  async getVerified(): Promise<ProgramBeneficiaryRecord[]> {
    return this.getByStatus('verified');
  },

  /**
   * Get pending verification
   */
  async getPendingVerification(): Promise<ProgramBeneficiaryRecord[]> {
    return this.getByStatus('pending');
  },

  /**
   * Get beneficiaries by district
   */
  async getByDistrict(district: string): Promise<ProgramBeneficiaryRecord[]> {
    return beneficiariesCRUD.getByIndex('district', district);
  },

  /**
   * Get beneficiaries by NID
   */
  async getByNID(nidNo: string): Promise<ProgramBeneficiaryRecord[]> {
    return beneficiariesCRUD.getByIndex('nidNo', nidNo);
  },

  /**
   * Verify beneficiary
   */
  async verify(id: number): Promise<ProgramBeneficiaryRecord> {
    return this.update(id, { status: 'verified' });
  },

  /**
   * Reject beneficiary
   */
  async reject(id: number): Promise<ProgramBeneficiaryRecord> {
    return this.update(id, { status: 'rejected' });
  },

  /**
   * Get beneficiary statistics
   */
  async getStats(): Promise<{
    total: number;
    verified: number;
    pending: number;
    rejected: number;
    byType: Record<string, number>;
    totalFamilyMembers: number;
  }> {
    const all = await this.getAll();
    const byType: Record<string, number> = {};

    let totalFamilyMembers = 0;
    all.forEach(b => {
      byType[b.beneficiaryType] = (byType[b.beneficiaryType] || 0) + 1;
      totalFamilyMembers += b.familySize || 0;
    });

    return {
      total: all.length,
      verified: all.filter(b => b.status === 'verified').length,
      pending: all.filter(b => b.status === 'pending').length,
      rejected: all.filter(b => b.status === 'rejected').length,
      byType,
      totalFamilyMembers,
    };
  },
};

// ========== SAFEGUARDING ==========

const safeguardingCRUD = createCRUDService<ProgramSafeguardingRecord>('programSafeguarding');

export const programSafeguardingDB = {
  ...safeguardingCRUD,

  /**
   * Generate unique code (SG-YYYY-####)
   */
  async generateCode(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('SG', all.length + 1, true, 4);
  },

  /**
   * Get safeguarding by project
   */
  async getByProject(projectId: number): Promise<ProgramSafeguardingRecord[]> {
    return safeguardingCRUD.getByIndex('projectId', projectId);
  },

  /**
   * Get by activity type
   */
  async getByActivityType(activityType: string): Promise<ProgramSafeguardingRecord[]> {
    return safeguardingCRUD.getByIndex('activityType', activityType);
  },

  /**
   * Get by status
   */
  async getByStatus(status: SafeguardingStatus): Promise<ProgramSafeguardingRecord[]> {
    return safeguardingCRUD.getByIndex('status', status);
  },

  /**
   * Get pending activities
   */
  async getPending(): Promise<ProgramSafeguardingRecord[]> {
    return this.getByStatus('pending');
  },

  /**
   * Get overdue activities
   */
  async getOverdue(): Promise<ProgramSafeguardingRecord[]> {
    const all = await this.getAll();
    const today = new Date().toISOString().split('T')[0];
    return all.filter(s => s.status === 'pending' && s.dueDate && s.dueDate < today);
  },

  /**
   * Get activities due soon
   */
  async getDueSoon(days: number = 15): Promise<ProgramSafeguardingRecord[]> {
    const all = await this.getAll();
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    const todayStr = today.toISOString().split('T')[0];
    const futureStr = futureDate.toISOString().split('T')[0];

    return all.filter(s =>
      s.status === 'pending' &&
      s.dueDate &&
      s.dueDate >= todayStr &&
      s.dueDate <= futureStr
    );
  },

  /**
   * Mark activity as completed
   */
  async markCompleted(id: number): Promise<ProgramSafeguardingRecord> {
    return this.update(id, {
      status: 'completed',
      completedDate: new Date().toISOString().split('T')[0],
    });
  },
};

// ========== DASHBOARD STATISTICS ==========

export const programDashboardService = {
  /**
   * Get program dashboard statistics
   */
  async getStats() {
    const [donors, projects, workPlans, certificates, documents, reporting, beneficiaries, safeguarding] =
      await Promise.all([
        programDonorsDB.getAll(),
        programProjectsDB.getAll(),
        programWorkPlansDB.getAll(),
        programCertificatesDB.getAll(),
        programDocumentsDB.getAll(),
        programReportingDB.getAll(),
        programBeneficiariesDB.getAll(),
        programSafeguardingDB.getAll(),
      ]);

    const today = new Date().toISOString().split('T')[0];
    const activeStatuses: ProjectStatus[] = ['not_started', 'in_progress', 'ongoing', 'amendment'];

    return {
      // Donors
      totalDonors: donors.length,
      activeDonors: donors.filter(d => d.status === 'active').length,

      // Projects
      totalProjects: projects.length,
      activeProjects: projects.filter(p => activeStatuses.includes(p.status)).length,
      completedProjects: projects.filter(p => p.status === 'completed').length,

      // Work Plans
      totalWorkPlans: workPlans.length,

      // Documents
      totalCertificates: certificates.length,
      totalDocuments: documents.length,

      // Reporting
      totalReports: reporting.length,
      pendingReports: reporting.filter(r => r.status === 'pending').length,
      overdueReports: reporting.filter(r => r.status === 'pending' && r.dueDate < today).length,

      // Beneficiaries
      totalBeneficiaries: beneficiaries.length,
      verifiedBeneficiaries: beneficiaries.filter(b => b.status === 'verified').length,
      pendingBeneficiaries: beneficiaries.filter(b => b.status === 'pending').length,

      // Safeguarding
      totalSafeguarding: safeguarding.length,
      pendingSafeguarding: safeguarding.filter(s => s.status === 'pending').length,
      overdueSafeguarding: safeguarding.filter(s =>
        s.status === 'pending' && s.dueDate && s.dueDate < today
      ).length,
    };
  },

  /**
   * Get upcoming deadlines across all modules
   */
  async getUpcomingDeadlines(days: number = 30): Promise<{
    type: string;
    title: string;
    dueDate: string;
    projectId?: number;
    projectName?: string;
    id: number;
  }[]> {
    const [reporting, safeguarding, projects] = await Promise.all([
      programReportingDB.getDueSoon(days),
      programSafeguardingDB.getDueSoon(days),
      programProjectsDB.getEndingSoon(days),
    ]);

    const deadlines: {
      type: string;
      title: string;
      dueDate: string;
      projectId?: number;
      projectName?: string;
      id: number;
    }[] = [];

    // Reports
    reporting.forEach(r => {
      deadlines.push({
        type: 'report',
        title: `${r.reportType} Report`,
        dueDate: r.dueDate,
        projectId: r.projectId,
        projectName: r.projectName,
        id: r.id!,
      });
    });

    // Safeguarding
    safeguarding.forEach(s => {
      if (s.dueDate) {
        deadlines.push({
          type: 'safeguarding',
          title: `${s.activityType} Activity`,
          dueDate: s.dueDate,
          projectId: s.projectId,
          projectName: s.projectName,
          id: s.id!,
        });
      }
    });

    // Projects ending
    projects.forEach(p => {
      deadlines.push({
        type: 'project_end',
        title: `Project: ${p.projectName}`,
        dueDate: p.endDate,
        projectId: p.id,
        projectName: p.projectName,
        id: p.id!,
      });
    });

    // Sort by due date
    return deadlines.sort((a, b) =>
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  },

  /**
   * Get recent activities
   */
  async getRecentActivities(limit: number = 10): Promise<{
    type: string;
    title: string;
    date: string;
    id: number;
  }[]> {
    const [documents, beneficiaries, reporting] = await Promise.all([
      programDocumentsDB.getRecent(limit),
      programBeneficiariesDB.getAll(),
      programReportingDB.getAll(),
    ]);

    const activities: { type: string; title: string; date: string; id: number }[] = [];

    documents.forEach(d => {
      activities.push({
        type: 'document',
        title: `Document: ${d.documentName}`,
        date: d.uploadDate,
        id: d.id!,
      });
    });

    beneficiaries
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
      .forEach(b => {
        activities.push({
          type: 'beneficiary',
          title: `Beneficiary: ${b.beneficiaryName}`,
          date: b.createdAt,
          id: b.id!,
        });
      });

    reporting
      .filter(r => r.submittedDate)
      .sort((a, b) => new Date(b.submittedDate!).getTime() - new Date(a.submittedDate!).getTime())
      .slice(0, limit)
      .forEach(r => {
        activities.push({
          type: 'report_submitted',
          title: `Report Submitted: ${r.reportType}`,
          date: r.submittedDate!,
          id: r.id!,
        });
      });

    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  },

  /**
   * Get project status distribution
   */
  async getProjectStatusDistribution(): Promise<Record<ProjectStatus, number>> {
    const projects = await programProjectsDB.getAll();
    const distribution: Record<string, number> = {};

    projects.forEach(p => {
      distribution[p.status] = (distribution[p.status] || 0) + 1;
    });

    return distribution as Record<ProjectStatus, number>;
  },

  /**
   * Get thematic area distribution
   */
  async getThematicAreaDistribution(): Promise<Record<string, number>> {
    const projects = await programProjectsDB.getAll();
    const distribution: Record<string, number> = {};

    projects.forEach(p => {
      if (p.thematicArea) {
        distribution[p.thematicArea] = (distribution[p.thematicArea] || 0) + 1;
      }
    });

    return distribution;
  },
};

// ========== BACKWARD COMPATIBILITY ALIASES ==========

// Singular variations
export const programDonorDB = programDonorsDB;
export const programProjectDB = programProjectsDB;
export const programWorkPlanDB = programWorkPlansDB;
export const programCertificateDB = programCertificatesDB;
export const programDocumentDB = programDocumentsDB;
export const programReportDB = programReportingDB;
export const programBeneficiaryDB = programBeneficiariesDB;
export const programSafeguardDB = programSafeguardingDB;

// Service pattern aliases
export const programDonorsService = programDonorsDB;
export const programDonorService = programDonorsDB;
export const programProjectsService = programProjectsDB;
export const programProjectService = programProjectsDB;
export const programWorkPlansService = programWorkPlansDB;
export const programWorkPlanService = programWorkPlansDB;
export const programCertificatesService = programCertificatesDB;
export const programCertificateService = programCertificatesDB;
export const programDocumentsService = programDocumentsDB;
export const programDocumentService = programDocumentsDB;
export const programReportingService = programReportingDB;
export const programBeneficiariesService = programBeneficiariesDB;
export const programBeneficiaryService = programBeneficiariesDB;
export const programSafeguardingService = programSafeguardingDB;

// ========== MAIN EXPORT ==========

/**
 * Program Service - Main entry point
 */
export const programService = {
  // Master data
  donors: programDonorsDB,
  projects: programProjectsDB,

  // Project activities
  workPlans: programWorkPlansDB,
  certificates: programCertificatesDB,
  documents: programDocumentsDB,

  // Reporting & monitoring
  reporting: programReportingDB,
  beneficiaries: programBeneficiariesDB,
  safeguarding: programSafeguardingDB,

  // Dashboard
  dashboard: programDashboardService,
};

export default programService;
