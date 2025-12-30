/**
 * Disciplinary Module Service
 *
 * Comprehensive disciplinary management system covering:
 * - Misconduct Reports
 * - Evidence Collection
 * - Investigations & Interviews
 * - Precautionary Suspensions
 * - Disciplinary Actions
 * - Appeals
 * - Warning History
 * - Grievances
 * - Compliance Incidents
 * - Case Notes
 */

import { createCRUDService } from './core/crud';
import { generateFormattedCode } from './core/utils';
import type {
  MisconductReportRecord,
  MisconductEvidenceRecord,
  DisciplinaryInvestigationRecord,
  InvestigationInterviewRecord,
  PrecautionarySuspensionRecord,
  DisciplinaryActionRecord,
  DisciplinaryAppealRecord,
  EmployeeWarningHistoryRecord,
  EmployeeGrievanceRecord,
  ComplianceIncidentRecord,
  MisconductCaseNoteRecord,
} from '@/types/modules/disciplinary';

// ========== MISCONDUCT REPORTS ==========

const misconductReportsCRUD = createCRUDService<MisconductReportRecord>('misconductReports');

export const misconductReportsDB = {
  ...misconductReportsCRUD,

  /**
   * Generate unique report number (MIS-YYYY-###)
   */
  async generateReportNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode('MIS', all.length + 1, true, 3);
  },

  /**
   * Get reports by status
   */
  async getByStatus(status: string): Promise<MisconductReportRecord[]> {
    return misconductReportsCRUD.getByIndex('status', status);
  },

  /**
   * Get reports by employee
   */
  async getByEmployee(employeeId: number): Promise<MisconductReportRecord[]> {
    return misconductReportsCRUD.getByIndex('accusedEmployeeId', employeeId);
  },

  /**
   * Get reports by category
   */
  async getByCategory(category: string): Promise<MisconductReportRecord[]> {
    return misconductReportsCRUD.getByIndex('misconductCategory', category);
  },

  /**
   * Assess a misconduct report
   */
  async assess(id: number, assessmentData: Partial<MisconductReportRecord>): Promise<MisconductReportRecord> {
    const report = await this.getById(id);
    if (!report) throw new Error('Report not found');

    return this.update(id, {
      ...assessmentData,
      status: assessmentData.status || 'assessing',
      assessedAt: new Date().toISOString(),
    });
  },
};

// ========== MISCONDUCT EVIDENCE ==========

const misconductEvidenceCRUD = createCRUDService<MisconductEvidenceRecord>('misconductEvidence');

export const misconductEvidenceDB = {
  ...misconductEvidenceCRUD,

  /**
   * Get evidence by report ID
   */
  async getByReport(reportId: number): Promise<MisconductEvidenceRecord[]> {
    return misconductEvidenceCRUD.getByIndex('reportId', reportId);
  },

  /**
   * Get evidence by investigation ID
   */
  async getByInvestigation(investigationId: number): Promise<MisconductEvidenceRecord[]> {
    return misconductEvidenceCRUD.getByIndex('investigationId', investigationId);
  },
};

// ========== INVESTIGATIONS ==========

const investigationsCRUD = createCRUDService<DisciplinaryInvestigationRecord>('disciplinaryInvestigations');

export const investigationsDB = {
  ...investigationsCRUD,

  /**
   * Generate unique investigation number (INV-YYYY-###)
   */
  async generateInvestigationNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode('INV', all.length + 1, true, 3);
  },

  /**
   * Get investigations by status
   */
  async getByStatus(status: string): Promise<DisciplinaryInvestigationRecord[]> {
    return investigationsCRUD.getByIndex('status', status);
  },

  /**
   * Get investigations by report ID
   */
  async getByReport(reportId: number): Promise<DisciplinaryInvestigationRecord[]> {
    return investigationsCRUD.getByIndex('reportId', reportId);
  },

  /**
   * Start an investigation
   */
  async start(id: number): Promise<DisciplinaryInvestigationRecord> {
    return this.update(id, {
      status: 'in_progress',
      startDate: new Date().toISOString().split('T')[0],
    });
  },

  /**
   * Complete an investigation with findings
   */
  async complete(id: number, findings: Partial<DisciplinaryInvestigationRecord>): Promise<DisciplinaryInvestigationRecord> {
    return this.update(id, {
      ...findings,
      status: 'completed',
      actualEndDate: new Date().toISOString().split('T')[0],
    });
  },
};

// ========== INVESTIGATION INTERVIEWS ==========

const investigationInterviewsCRUD = createCRUDService<InvestigationInterviewRecord>('investigationInterviews');

export const investigationInterviewsDB = {
  ...investigationInterviewsCRUD,

  /**
   * Get interviews by investigation ID
   */
  async getByInvestigation(investigationId: number): Promise<InvestigationInterviewRecord[]> {
    return investigationInterviewsCRUD.getByIndex('investigationId', investigationId);
  },
};

// ========== PRECAUTIONARY SUSPENSIONS ==========

const suspensionsCRUD = createCRUDService<PrecautionarySuspensionRecord>('precautionarySuspensions');

export const suspensionsDB = {
  ...suspensionsCRUD,

  /**
   * Get suspensions by employee ID
   */
  async getByEmployee(employeeId: number): Promise<PrecautionarySuspensionRecord[]> {
    return suspensionsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get active suspensions
   */
  async getActive(): Promise<PrecautionarySuspensionRecord[]> {
    return suspensionsCRUD.getByIndex('status', 'active');
  },

  /**
   * Lift a suspension
   */
  async lift(id: number, notes?: string): Promise<PrecautionarySuspensionRecord> {
    return this.update(id, {
      status: 'lifted',
      actualEndDate: new Date().toISOString().split('T')[0],
      outcomeNotes: notes,
    });
  },
};

// ========== DISCIPLINARY ACTIONS ==========

const disciplinaryActionsCRUD = createCRUDService<DisciplinaryActionRecord>('disciplinaryActions');

export const disciplinaryActionsDB = {
  ...disciplinaryActionsCRUD,

  /**
   * Generate unique action number (DA-YYYY-###)
   */
  async generateActionNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode('DA', all.length + 1, true, 3);
  },

  /**
   * Get actions by employee ID
   */
  async getByEmployee(employeeId: number): Promise<DisciplinaryActionRecord[]> {
    return disciplinaryActionsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get actions by status
   */
  async getByStatus(status: string): Promise<DisciplinaryActionRecord[]> {
    return disciplinaryActionsCRUD.getByIndex('status', status);
  },

  /**
   * Get active warnings for an employee
   */
  async getActiveWarnings(employeeId: number): Promise<DisciplinaryActionRecord[]> {
    const actions = await this.getByEmployee(employeeId);
    const today = new Date().toISOString().split('T')[0];

    return actions.filter(
      a =>
        ['verbal_warning', 'first_written_warning', 'final_written_warning'].includes(a.actionType) &&
        a.status === 'acknowledged' &&
        (!a.expiryDate || a.expiryDate >= today)
    );
  },

  /**
   * Issue a disciplinary action
   */
  async issue(id: number): Promise<DisciplinaryActionRecord> {
    return this.update(id, {
      status: 'issued',
      issueDate: new Date().toISOString().split('T')[0],
    });
  },

  /**
   * Employee acknowledges disciplinary action
   */
  async acknowledge(id: number): Promise<DisciplinaryActionRecord> {
    return this.update(id, {
      employeeAcknowledged: true,
      employeeAcknowledgedAt: new Date().toISOString(),
      status: 'acknowledged',
    });
  },
};

// ========== APPEALS ==========

const appealsCRUD = createCRUDService<DisciplinaryAppealRecord>('disciplinaryAppeals');

export const appealsDB = {
  ...appealsCRUD,

  /**
   * Generate unique appeal number (APL-YYYY-###)
   */
  async generateAppealNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode('APL', all.length + 1, true, 3);
  },

  /**
   * Get appeals by employee ID
   */
  async getByEmployee(employeeId: number): Promise<DisciplinaryAppealRecord[]> {
    return appealsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get appeals by status
   */
  async getByStatus(status: string): Promise<DisciplinaryAppealRecord[]> {
    return appealsCRUD.getByIndex('status', status);
  },

  /**
   * Decide on an appeal
   */
  async decide(id: number, decision: Partial<DisciplinaryAppealRecord>): Promise<DisciplinaryAppealRecord> {
    return this.update(id, {
      ...decision,
      status: 'decided',
      decisionDate: new Date().toISOString().split('T')[0],
    });
  },
};

// ========== WARNING HISTORY ==========

const warningHistoryCRUD = createCRUDService<EmployeeWarningHistoryRecord>('employeeWarningHistory');

export const warningHistoryDB = {
  ...warningHistoryCRUD,

  /**
   * Get warning history by employee ID
   */
  async getByEmployee(employeeId: number): Promise<EmployeeWarningHistoryRecord[]> {
    return warningHistoryCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get active warnings by employee ID
   */
  async getActiveByEmployee(employeeId: number): Promise<EmployeeWarningHistoryRecord[]> {
    const history = await this.getByEmployee(employeeId);
    const today = new Date().toISOString().split('T')[0];
    return history.filter(w => w.isActive && (!w.expiryDate || w.expiryDate >= today));
  },

  /**
   * Expire warnings that have passed their expiry date
   */
  async expireWarnings(): Promise<number> {
    const all = await this.getAll();
    const today = new Date().toISOString().split('T')[0];
    const expired = all.filter(w => w.isActive && w.expiryDate && w.expiryDate < today);

    for (const warning of expired) {
      await this.update(warning.id, {
        isActive: false,
        expiredAt: new Date().toISOString(),
      });
    }

    return expired.length;
  },
};

// ========== GRIEVANCES ==========

const grievancesCRUD = createCRUDService<EmployeeGrievanceRecord>('employeeGrievances');

export const grievancesDB = {
  ...grievancesCRUD,

  /**
   * Generate unique grievance number (GRV-YYYY-###)
   */
  async generateGrievanceNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode('GRV', all.length + 1, true, 3);
  },

  /**
   * Get grievances by employee ID
   */
  async getByEmployee(employeeId: number): Promise<EmployeeGrievanceRecord[]> {
    return grievancesCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get grievances by status
   */
  async getByStatus(status: string): Promise<EmployeeGrievanceRecord[]> {
    return grievancesCRUD.getByIndex('status', status);
  },

  /**
   * Resolve a grievance
   */
  async resolve(id: number, resolution: Partial<EmployeeGrievanceRecord>): Promise<EmployeeGrievanceRecord> {
    return this.update(id, {
      ...resolution,
      status: 'resolved',
      resolutionDate: new Date().toISOString().split('T')[0],
    });
  },
};

// ========== COMPLIANCE INCIDENTS ==========

const complianceIncidentsCRUD = createCRUDService<ComplianceIncidentRecord>('complianceIncidents');

export const complianceIncidentsDB = {
  ...complianceIncidentsCRUD,

  /**
   * Generate unique incident number (ZT-YYYY-###)
   */
  async generateIncidentNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode('ZT', all.length + 1, true, 3);
  },

  /**
   * Get incidents by type
   */
  async getByType(type: string): Promise<ComplianceIncidentRecord[]> {
    return complianceIncidentsCRUD.getByIndex('incidentType', type);
  },

  /**
   * Get incidents by status
   */
  async getByStatus(status: string): Promise<ComplianceIncidentRecord[]> {
    return complianceIncidentsCRUD.getByIndex('status', status);
  },
};

// ========== CASE NOTES ==========

const caseNotesCRUD = createCRUDService<MisconductCaseNoteRecord>('misconductCaseNotes');

export const caseNotesDB = {
  ...caseNotesCRUD,

  /**
   * Get notes by case type and ID
   */
  async getByCase(caseType: string, caseId: number): Promise<MisconductCaseNoteRecord[]> {
    const notes = await this.getAll();
    return notes.filter(n => n.caseType === caseType && n.caseId === caseId);
  },
};

// ========== MAIN EXPORT ==========

/**
 * Disciplinary Service - Main entry point
 */
export const disciplinaryService = {
  // Sub-services
  misconductReports: misconductReportsDB,
  evidence: misconductEvidenceDB,
  investigations: investigationsDB,
  interviews: investigationInterviewsDB,
  suspensions: suspensionsDB,
  actions: disciplinaryActionsDB,
  appeals: appealsDB,
  warningHistory: warningHistoryDB,
  grievances: grievancesDB,
  complianceIncidents: complianceIncidentsDB,
  caseNotes: caseNotesDB,
};

export default disciplinaryService;
