/**
 * Compliance Module Service
 *
 * Database services for compliance entities:
 * - Compliance Projects
 * - Compliance Documents
 * - Compliance Amendments
 * - Proposals
 * - Due Diligence
 * - Registrations
 * - Memberships
 * - Certificates
 * - Board of Directors
 * - Partners
 * - Donor Outreach
 * - Government Outreach
 * - Blacklist
 */

import { createCRUDService } from './core/crud';
import { generateFormattedCode } from './core/utils';
import type {
  ComplianceProjectRecord,
  ComplianceDocumentRecord,
  ComplianceAmendmentRecord,
  ProposalRecord,
  ComplianceStatus,
  RiskLevel,
  DocumentStatus,
  AmendmentStatus,
  DueDiligenceRecord,
  DDStatus,
  RegistrationRecord,
  RegistrationStatus,
  MembershipRecord,
  MembershipStatus,
  CertificateRecord,
  CertificateStatus,
  BoardOfDirectorsRecord,
  BODStatus,
  PartnerRecord,
  PartnerStatus,
  DonorOutreachRecord,
  GovernmentOutreachRecord,
  BlacklistRecord,
  BlacklistStatus,
} from '../../types/modules/compliance';

// ========== COMPLIANCE PROJECTS ==========

const complianceProjectsCRUD =
  createCRUDService<ComplianceProjectRecord>('complianceProjects');

export const complianceProjectDB = {
  ...complianceProjectsCRUD,

  /**
   * Get compliance projects by project ID
   */
  async getByProject(projectId: number): Promise<ComplianceProjectRecord[]> {
    return complianceProjectsCRUD.getByIndex('projectId', projectId);
  },

  /**
   * Get compliance projects by type
   */
  async getByType(complianceType: string): Promise<ComplianceProjectRecord[]> {
    return complianceProjectsCRUD.getByIndex('complianceType', complianceType);
  },

  /**
   * Get compliance projects by status
   */
  async getByStatus(
    status: ComplianceStatus
  ): Promise<ComplianceProjectRecord[]> {
    return complianceProjectsCRUD.getByIndex('status', status);
  },

  /**
   * Get compliance projects by risk level
   */
  async getByRiskLevel(
    riskLevel: RiskLevel
  ): Promise<ComplianceProjectRecord[]> {
    return complianceProjectsCRUD.getByIndex('riskLevel', riskLevel);
  },

  /**
   * Get high risk compliance projects
   */
  async getHighRisk(): Promise<ComplianceProjectRecord[]> {
    const all = await this.getAll();
    return all.filter(
      (p) => p.riskLevel === 'high' || p.riskLevel === 'critical'
    );
  },

  /**
   * Get overdue compliance projects
   */
  async getOverdue(): Promise<ComplianceProjectRecord[]> {
    const all = await this.getAll();
    const now = new Date().toISOString();
    return all.filter(
      (p) =>
        p.dueDate &&
        p.dueDate < now &&
        p.status !== 'compliant' &&
        p.status !== 'closed'
    );
  },

  /**
   * Get pending compliance projects
   */
  async getPending(): Promise<ComplianceProjectRecord[]> {
    return this.getByStatus('pending');
  },
};

// ========== COMPLIANCE DOCUMENTS ==========

const complianceDocumentsCRUD =
  createCRUDService<ComplianceDocumentRecord>('complianceDocuments');

export const complianceDocumentDB = {
  ...complianceDocumentsCRUD,

  /**
   * Generate unique document code (DOC-####)
   */
  async generateCode(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('DOC', all.length + 1, false, 4);
  },

  /**
   * Get documents by project ID
   */
  async getByProject(projectId: number): Promise<ComplianceDocumentRecord[]> {
    return complianceDocumentsCRUD.getByIndex('projectId', projectId);
  },

  /**
   * Get documents by compliance project ID
   */
  async getByComplianceProject(
    complianceProjectId: number
  ): Promise<ComplianceDocumentRecord[]> {
    return complianceDocumentsCRUD.getByIndex(
      'complianceProjectId',
      complianceProjectId
    );
  },

  /**
   * Get documents by type
   */
  async getByType(documentType: string): Promise<ComplianceDocumentRecord[]> {
    return complianceDocumentsCRUD.getByIndex('documentType', documentType);
  },

  /**
   * Get documents by status
   */
  async getByStatus(
    status: DocumentStatus
  ): Promise<ComplianceDocumentRecord[]> {
    return complianceDocumentsCRUD.getByIndex('status', status);
  },

  /**
   * Get expiring documents (within days)
   */
  async getExpiring(days: number = 30): Promise<ComplianceDocumentRecord[]> {
    const all = await this.getAll();
    const now = new Date();
    const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return all.filter((d) => {
      if (!d.expiryDate) return false;
      const expiryDate = new Date(d.expiryDate);
      return expiryDate >= now && expiryDate <= threshold;
    });
  },

  /**
   * Get expired documents
   */
  async getExpired(): Promise<ComplianceDocumentRecord[]> {
    const all = await this.getAll();
    const now = new Date().toISOString();
    return all.filter((d) => d.expiryDate && d.expiryDate < now);
  },
};

// ========== COMPLIANCE AMENDMENTS ==========

const complianceAmendmentsCRUD =
  createCRUDService<ComplianceAmendmentRecord>('complianceAmendments');

export const complianceAmendmentDB = {
  ...complianceAmendmentsCRUD,

  /**
   * Get amendments by project ID
   */
  async getByProject(projectId: number): Promise<ComplianceAmendmentRecord[]> {
    return complianceAmendmentsCRUD.getByIndex('projectId', projectId);
  },

  /**
   * Get amendments by compliance project ID
   */
  async getByComplianceProject(
    complianceProjectId: number
  ): Promise<ComplianceAmendmentRecord[]> {
    return complianceAmendmentsCRUD.getByIndex(
      'complianceProjectId',
      complianceProjectId
    );
  },

  /**
   * Get amendments by type
   */
  async getByType(amendmentType: string): Promise<ComplianceAmendmentRecord[]> {
    return complianceAmendmentsCRUD.getByIndex('amendmentType', amendmentType);
  },

  /**
   * Get amendments by status
   */
  async getByStatus(
    status: AmendmentStatus
  ): Promise<ComplianceAmendmentRecord[]> {
    return complianceAmendmentsCRUD.getByIndex('status', status);
  },

  /**
   * Get pending amendments
   */
  async getPending(): Promise<ComplianceAmendmentRecord[]> {
    return this.getByStatus('pending_approval');
  },

  /**
   * Get approved amendments
   */
  async getApproved(): Promise<ComplianceAmendmentRecord[]> {
    return this.getByStatus('approved');
  },
};

// ========== PROPOSALS (RFP Tracking) ==========

const proposalsCRUD = createCRUDService<ProposalRecord>('proposals');

export const proposalDB = {
  ...proposalsCRUD,

  /**
   * Get all proposals with optional filtering
   */
  async getAll(
    filters: { status?: string; result?: string } = {}
  ): Promise<ProposalRecord[]> {
    let all = await proposalsCRUD.getAll();
    if (filters.status) {
      all = all.filter((p) => p.status === filters.status);
    }
    if (filters.result) {
      all = all.filter((p) => p.result === filters.result);
    }
    return all.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  /**
   * Get proposals by status
   */
  async getByStatus(status: string): Promise<ProposalRecord[]> {
    return proposalsCRUD.getByIndex('status', status);
  },

  /**
   * Get proposals by result
   */
  async getByResult(result: string): Promise<ProposalRecord[]> {
    return proposalsCRUD.getByIndex('result', result);
  },

  /**
   * Get proposals by donor
   */
  async getByDonor(donor: string): Promise<ProposalRecord[]> {
    return proposalsCRUD.getByIndex('donor', donor);
  },

  /**
   * Get submitted proposals
   */
  async getSubmitted(): Promise<ProposalRecord[]> {
    return this.getByStatus('submitted');
  },

  /**
   * Get accepted proposals
   */
  async getAccepted(): Promise<ProposalRecord[]> {
    return this.getByResult('accepted');
  },
};

// ========== DUE DILIGENCE ==========

const dueDiligenceCRUD = createCRUDService<DueDiligenceRecord>('dueDiligence');

export const dueDiligenceDB = {
  ...dueDiligenceCRUD,

  async getByDonor(donorName: string): Promise<DueDiligenceRecord[]> {
    return dueDiligenceCRUD.getByIndex('donorName', donorName);
  },

  async getByStatus(status: DDStatus): Promise<DueDiligenceRecord[]> {
    return dueDiligenceCRUD.getByIndex('status', status);
  },

  async getPending(): Promise<DueDiligenceRecord[]> {
    return this.getByStatus('pending');
  },

  async getRequiringAction(): Promise<DueDiligenceRecord[]> {
    return this.getByStatus('requires_action');
  },
};

// ========== REGISTRATIONS ==========

const registrationsCRUD = createCRUDService<RegistrationRecord>('registrations');

export const registrationDB = {
  ...registrationsCRUD,

  async getByPlatform(organizationPlatform: string): Promise<RegistrationRecord[]> {
    return registrationsCRUD.getByIndex('organizationPlatform', organizationPlatform);
  },

  async getByStatus(status: RegistrationStatus): Promise<RegistrationRecord[]> {
    return registrationsCRUD.getByIndex('status', status);
  },

  async getActive(): Promise<RegistrationRecord[]> {
    return this.getByStatus('active');
  },

  async getExpiring(days: number = 30): Promise<RegistrationRecord[]> {
    const all = await this.getAll();
    const now = new Date();
    const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return all.filter((r) => {
      if (!r.expiryDate) return false;
      const expiryDate = new Date(r.expiryDate);
      return expiryDate >= now && expiryDate <= threshold;
    });
  },
};

// ========== MEMBERSHIPS ==========

const membershipsCRUD = createCRUDService<MembershipRecord>('memberships');

export const membershipDB = {
  ...membershipsCRUD,

  async getByOrganization(organizationName: string): Promise<MembershipRecord[]> {
    return membershipsCRUD.getByIndex('organizationName', organizationName);
  },

  async getByType(membershipType: string): Promise<MembershipRecord[]> {
    return membershipsCRUD.getByIndex('membershipType', membershipType);
  },

  async getByStatus(status: MembershipStatus): Promise<MembershipRecord[]> {
    return membershipsCRUD.getByIndex('status', status);
  },

  async getActive(): Promise<MembershipRecord[]> {
    return this.getByStatus('active');
  },

  async getExpiring(days: number = 30): Promise<MembershipRecord[]> {
    const all = await this.getAll();
    const now = new Date();
    const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return all.filter((m) => {
      if (!m.expiryDate) return false;
      const expiryDate = new Date(m.expiryDate);
      return expiryDate >= now && expiryDate <= threshold;
    });
  },
};

// ========== CERTIFICATES ==========

const certificatesCRUD = createCRUDService<CertificateRecord>('certificates');

export const certificateDB = {
  ...certificatesCRUD,

  async getByName(certificateName: string): Promise<CertificateRecord[]> {
    return certificatesCRUD.getByIndex('certificateName', certificateName);
  },

  async getByNumber(certificateNumber: string): Promise<CertificateRecord | undefined> {
    const results = await certificatesCRUD.getByIndex('certificateNumber', certificateNumber);
    return results[0];
  },

  async getByStatus(status: CertificateStatus): Promise<CertificateRecord[]> {
    return certificatesCRUD.getByIndex('status', status);
  },

  async getValid(): Promise<CertificateRecord[]> {
    return this.getByStatus('valid');
  },

  async getExpiring(days: number = 30): Promise<CertificateRecord[]> {
    const all = await this.getAll();
    const now = new Date();
    const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return all.filter((c) => {
      if (!c.expiryDate) return false;
      const expiryDate = new Date(c.expiryDate);
      return expiryDate >= now && expiryDate <= threshold;
    });
  },
};

// ========== BOARD OF DIRECTORS ==========

const boardOfDirectorsCRUD = createCRUDService<BoardOfDirectorsRecord>('boardOfDirectors');

export const boardOfDirectorsDB = {
  ...boardOfDirectorsCRUD,

  async getByPosition(position: string): Promise<BoardOfDirectorsRecord[]> {
    return boardOfDirectorsCRUD.getByIndex('position', position);
  },

  async getByStatus(status: BODStatus): Promise<BoardOfDirectorsRecord[]> {
    return boardOfDirectorsCRUD.getByIndex('status', status);
  },

  async getActive(): Promise<BoardOfDirectorsRecord[]> {
    return this.getByStatus('active');
  },

  async getChairperson(): Promise<BoardOfDirectorsRecord | undefined> {
    const all = await this.getAll();
    return all.find((m) => m.isChairperson && m.status === 'active');
  },
};

// ========== PARTNERS ==========

const partnersCRUD = createCRUDService<PartnerRecord>('partners');

export const partnerDB = {
  ...partnersCRUD,

  async getByName(partnerName: string): Promise<PartnerRecord[]> {
    return partnersCRUD.getByIndex('partnerName', partnerName);
  },

  async getByType(partnerType: string): Promise<PartnerRecord[]> {
    return partnersCRUD.getByIndex('partnerType', partnerType);
  },

  async getByStatus(status: PartnerStatus): Promise<PartnerRecord[]> {
    return partnersCRUD.getByIndex('status', status);
  },

  async getActive(): Promise<PartnerRecord[]> {
    return this.getByStatus('active');
  },
};

// ========== DONOR OUTREACH ==========

const donorOutreachCRUD = createCRUDService<DonorOutreachRecord>('donorOutreach');

export const donorOutreachDB = {
  ...donorOutreachCRUD,

  async getByDonor(donorName: string): Promise<DonorOutreachRecord[]> {
    return donorOutreachCRUD.getByIndex('donorName', donorName);
  },

  async getRecent(days: number = 30): Promise<DonorOutreachRecord[]> {
    const all = await this.getAll();
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - days);
    return all.filter((o) => {
      if (!o.outreachDate) return false;
      return new Date(o.outreachDate) >= threshold;
    });
  },
};

// ========== GOVERNMENT OUTREACH ==========

const governmentOutreachCRUD = createCRUDService<GovernmentOutreachRecord>('governmentOutreach');

export const governmentOutreachDB = {
  ...governmentOutreachCRUD,

  async getByMinistry(ministryName: string): Promise<GovernmentOutreachRecord[]> {
    return governmentOutreachCRUD.getByIndex('ministryName', ministryName);
  },

  async getRecent(days: number = 30): Promise<GovernmentOutreachRecord[]> {
    const all = await this.getAll();
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - days);
    return all.filter((o) => {
      if (!o.outreachDate) return false;
      return new Date(o.outreachDate) >= threshold;
    });
  },
};

// ========== BLACKLIST ==========

const blacklistCRUD = createCRUDService<BlacklistRecord>('blacklist');

export const blacklistDB = {
  ...blacklistCRUD,

  async getByEntityName(entityName: string): Promise<BlacklistRecord[]> {
    return blacklistCRUD.getByIndex('entityName', entityName);
  },

  async getByEntityType(entityType: string): Promise<BlacklistRecord[]> {
    return blacklistCRUD.getByIndex('entityType', entityType);
  },

  async getByStatus(status: BlacklistStatus): Promise<BlacklistRecord[]> {
    return blacklistCRUD.getByIndex('status', status);
  },

  async getActive(): Promise<BlacklistRecord[]> {
    return this.getByStatus('active');
  },

  async checkEntity(entityName: string): Promise<boolean> {
    const results = await this.getByEntityName(entityName);
    return results.some((r) => r.status === 'active');
  },
};

// ========== MAIN EXPORT ==========

export const complianceService = {
  projects: complianceProjectDB,
  documents: complianceDocumentDB,
  amendments: complianceAmendmentDB,
  proposals: proposalDB,
  dueDiligence: dueDiligenceDB,
  registrations: registrationDB,
  memberships: membershipDB,
  certificates: certificateDB,
  boardOfDirectors: boardOfDirectorsDB,
  partners: partnerDB,
  donorOutreach: donorOutreachDB,
  governmentOutreach: governmentOutreachDB,
  blacklist: blacklistDB,
};

export default complianceService;
