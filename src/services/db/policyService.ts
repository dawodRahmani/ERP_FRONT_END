/**
 * Policy & Audit Module Service
 *
 * Database services for policy and audit entities:
 * - Policy Versions
 * - HR Audit Logs
 * - Conduct Acknowledgments
 * - PSEA Declarations
 */

import { createCRUDService } from './core/crud';
import type {
  PolicyVersionRecord,
  HRAuditLogRecord,
  ConductAcknowledgmentRecord,
  PSEADeclarationRecord,
  PolicyStatus,
  AcknowledgmentStatus,
  PSEAStatus,
} from '../../types/modules/policy';

// ========== POLICY VERSIONS ==========

const policyVersionsCRUD = createCRUDService<PolicyVersionRecord>('policyVersions');

export const policyVersionDB = {
  ...policyVersionsCRUD,

  /**
   * Get policy by name
   */
  async getByName(policyName: string): Promise<PolicyVersionRecord[]> {
    return policyVersionsCRUD.getByIndex('policyName', policyName);
  },

  /**
   * Get policy by code
   */
  async getByCode(policyCode: string): Promise<PolicyVersionRecord[]> {
    return policyVersionsCRUD.getByIndex('policyCode', policyCode);
  },

  /**
   * Get policies by category
   */
  async getByCategory(category: string): Promise<PolicyVersionRecord[]> {
    return policyVersionsCRUD.getByIndex('category', category);
  },

  /**
   * Get policies by status
   */
  async getByStatus(status: PolicyStatus): Promise<PolicyVersionRecord[]> {
    return policyVersionsCRUD.getByIndex('status', status);
  },

  /**
   * Get active policies
   */
  async getActive(): Promise<PolicyVersionRecord[]> {
    return this.getByStatus('active');
  },

  /**
   * Get latest version of a policy
   */
  async getLatestVersion(policyName: string): Promise<PolicyVersionRecord | undefined> {
    const versions = await this.getByName(policyName);
    const activeVersions = versions.filter((v) => v.status === 'active');
    if (activeVersions.length === 0) return undefined;
    return activeVersions.sort((a, b) =>
      new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()
    )[0];
  },

  /**
   * Get policies requiring acknowledgment
   */
  async getRequiringAcknowledgment(): Promise<PolicyVersionRecord[]> {
    const active = await this.getActive();
    return active.filter((p) => p.requiresAcknowledgment);
  },
};

// ========== HR AUDIT LOGS ==========

const hrAuditLogsCRUD = createCRUDService<HRAuditLogRecord>('hrAuditLogs');

export const hrAuditLogDB = {
  ...hrAuditLogsCRUD,

  /**
   * Get logs by entity type
   */
  async getByEntityType(entityType: string): Promise<HRAuditLogRecord[]> {
    return hrAuditLogsCRUD.getByIndex('entityType', entityType);
  },

  /**
   * Get logs by entity ID
   */
  async getByEntityId(entityId: number): Promise<HRAuditLogRecord[]> {
    return hrAuditLogsCRUD.getByIndex('entityId', entityId);
  },

  /**
   * Get logs by action
   */
  async getByAction(action: string): Promise<HRAuditLogRecord[]> {
    return hrAuditLogsCRUD.getByIndex('action', action);
  },

  /**
   * Get logs by performer
   */
  async getByPerformer(performedBy: string): Promise<HRAuditLogRecord[]> {
    return hrAuditLogsCRUD.getByIndex('performedBy', performedBy);
  },

  /**
   * Get logs for entity
   */
  async getForEntity(entityType: string, entityId: number): Promise<HRAuditLogRecord[]> {
    const all = await this.getAll();
    return all
      .filter((log) => log.entityType === entityType && log.entityId === entityId)
      .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());
  },

  /**
   * Get recent logs (within hours)
   */
  async getRecent(hours: number = 24): Promise<HRAuditLogRecord[]> {
    const all = await this.getAll();
    const threshold = new Date(Date.now() - hours * 60 * 60 * 1000);
    return all
      .filter((log) => new Date(log.performedAt) >= threshold)
      .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());
  },

  /**
   * Log an action
   */
  async logAction(
    entityType: string,
    entityId: number,
    action: string,
    performedBy: string,
    options?: {
      entityName?: string;
      previousValue?: string;
      newValue?: string;
      changedFields?: string[];
      reason?: string;
      ipAddress?: string;
    }
  ): Promise<HRAuditLogRecord> {
    return this.create({
      entityType,
      entityId,
      action,
      performedBy,
      performedAt: new Date().toISOString(),
      ...options,
    });
  },
};

// ========== CONDUCT ACKNOWLEDGMENTS ==========

const conductAcknowledgmentsCRUD = createCRUDService<ConductAcknowledgmentRecord>('conductAcknowledgments');

export const conductAcknowledgmentDB = {
  ...conductAcknowledgmentsCRUD,

  /**
   * Get acknowledgments by employee
   */
  async getByEmployee(employeeId: number): Promise<ConductAcknowledgmentRecord[]> {
    return conductAcknowledgmentsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get acknowledgments by policy version
   */
  async getByPolicyVersion(policyVersionId: number): Promise<ConductAcknowledgmentRecord[]> {
    return conductAcknowledgmentsCRUD.getByIndex('policyVersionId', policyVersionId);
  },

  /**
   * Get acknowledgments by policy name
   */
  async getByPolicyName(policyName: string): Promise<ConductAcknowledgmentRecord[]> {
    return conductAcknowledgmentsCRUD.getByIndex('policyName', policyName);
  },

  /**
   * Get acknowledgments by type
   */
  async getByType(acknowledgmentType: string): Promise<ConductAcknowledgmentRecord[]> {
    return conductAcknowledgmentsCRUD.getByIndex('acknowledgmentType', acknowledgmentType);
  },

  /**
   * Get acknowledgments by status
   */
  async getByStatus(status: AcknowledgmentStatus): Promise<ConductAcknowledgmentRecord[]> {
    return conductAcknowledgmentsCRUD.getByIndex('status', status);
  },

  /**
   * Get pending acknowledgments
   */
  async getPending(): Promise<ConductAcknowledgmentRecord[]> {
    return this.getByStatus('pending');
  },

  /**
   * Check if employee has acknowledged policy
   */
  async hasAcknowledged(employeeId: number, policyName: string): Promise<boolean> {
    const acks = await this.getByEmployee(employeeId);
    return acks.some((a) => a.policyName === policyName && a.status === 'acknowledged');
  },

  /**
   * Get expired acknowledgments needing renewal
   */
  async getExpiredNeedingRenewal(): Promise<ConductAcknowledgmentRecord[]> {
    return this.getByStatus('renewal_required');
  },
};

// ========== PSEA DECLARATIONS ==========

const pseaDeclarationsCRUD = createCRUDService<PSEADeclarationRecord>('pseaDeclarations');

export const pseaDeclarationDB = {
  ...pseaDeclarationsCRUD,

  /**
   * Get declarations by employee
   */
  async getByEmployee(employeeId: number): Promise<PSEADeclarationRecord[]> {
    return pseaDeclarationsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get declarations by type
   */
  async getByType(declarationType: string): Promise<PSEADeclarationRecord[]> {
    return pseaDeclarationsCRUD.getByIndex('declarationType', declarationType);
  },

  /**
   * Get declarations by fiscal year
   */
  async getByFiscalYear(fiscalYear: string): Promise<PSEADeclarationRecord[]> {
    return pseaDeclarationsCRUD.getByIndex('fiscalYear', fiscalYear);
  },

  /**
   * Get declarations with conflicts
   */
  async getWithConflicts(): Promise<PSEADeclarationRecord[]> {
    return pseaDeclarationsCRUD.getByIndex('hasConflict', true);
  },

  /**
   * Get declarations by status
   */
  async getByStatus(status: PSEAStatus): Promise<PSEADeclarationRecord[]> {
    return pseaDeclarationsCRUD.getByIndex('status', status);
  },

  /**
   * Get pending declarations
   */
  async getPending(): Promise<PSEADeclarationRecord[]> {
    return this.getByStatus('pending');
  },

  /**
   * Get declarations under review
   */
  async getUnderReview(): Promise<PSEADeclarationRecord[]> {
    return this.getByStatus('under_review');
  },

  /**
   * Get current declaration for employee
   */
  async getCurrentDeclaration(employeeId: number): Promise<PSEADeclarationRecord | undefined> {
    const declarations = await this.getByEmployee(employeeId);
    const approved = declarations.filter((d) => d.status === 'approved');
    if (approved.length === 0) return undefined;
    return approved.sort((a, b) =>
      new Date(b.declarationDate).getTime() - new Date(a.declarationDate).getTime()
    )[0];
  },

  /**
   * Check if employee has valid declaration
   */
  async hasValidDeclaration(employeeId: number): Promise<boolean> {
    const current = await this.getCurrentDeclaration(employeeId);
    if (!current) return false;
    if (current.expiryDate) {
      return new Date(current.expiryDate) > new Date();
    }
    return true;
  },
};

// ========== MAIN EXPORT ==========

export const policyService = {
  policyVersions: policyVersionDB,
  hrAuditLogs: hrAuditLogDB,
  conductAcknowledgments: conductAcknowledgmentDB,
  pseaDeclarations: pseaDeclarationDB,
};

export default policyService;
