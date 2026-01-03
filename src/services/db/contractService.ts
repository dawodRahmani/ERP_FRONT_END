/**
 * Contract Management Module Service
 *
 * Database services for contract management entities:
 * - Contract Types
 * - Employee Contracts
 * - Contract Amendments
 */

import { createCRUDService } from './core/crud';
import { generateFormattedCode } from './core/utils';
import type {
  ContractTypeRecord,
  EmployeeContractRecord,
  ContractAmendmentRecord,
  ContractStatus,
  ContractAmendmentStatus,
} from '../../types/modules/contracts';

// ========== CONTRACT TYPES ==========

const contractTypesCRUD = createCRUDService<ContractTypeRecord>('contractTypes');

export const contractTypeDB = {
  ...contractTypesCRUD,

  /**
   * Get contract type by name
   */
  async getByName(name: string): Promise<ContractTypeRecord | undefined> {
    const results = await contractTypesCRUD.getByIndex('name', name);
    return results[0];
  },

  /**
   * Get contract types by category
   */
  async getByCategory(category: string): Promise<ContractTypeRecord[]> {
    return contractTypesCRUD.getByIndex('category', category);
  },

  /**
   * Get active contract types
   */
  async getActive(): Promise<ContractTypeRecord[]> {
    return contractTypesCRUD.getByIndex('isActive', true);
  },
};

// ========== EMPLOYEE CONTRACTS ==========

const employeeContractsCRUD = createCRUDService<EmployeeContractRecord>('employeeContracts');

export const employeeContractDB = {
  ...employeeContractsCRUD,

  /**
   * Generate unique contract number (CNT-YYYY-####)
   */
  async generateContractNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode(`CNT-${year}`, all.length + 1, false, 4);
  },

  /**
   * Get contract by contract number
   */
  async getByContractNumber(contractNumber: string): Promise<EmployeeContractRecord | undefined> {
    const results = await employeeContractsCRUD.getByIndex('contractNumber', contractNumber);
    return results[0];
  },

  /**
   * Get contracts by employee
   */
  async getByEmployee(employeeId: number): Promise<EmployeeContractRecord[]> {
    return employeeContractsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get contracts by contract type
   */
  async getByContractType(contractTypeId: number): Promise<EmployeeContractRecord[]> {
    return employeeContractsCRUD.getByIndex('contractTypeId', contractTypeId);
  },

  /**
   * Get contracts by project
   */
  async getByProject(projectId: number): Promise<EmployeeContractRecord[]> {
    return employeeContractsCRUD.getByIndex('projectId', projectId);
  },

  /**
   * Get contracts by status
   */
  async getByStatus(status: ContractStatus): Promise<EmployeeContractRecord[]> {
    return employeeContractsCRUD.getByIndex('status', status);
  },

  /**
   * Get active contracts
   */
  async getActive(): Promise<EmployeeContractRecord[]> {
    return this.getByStatus('active');
  },

  /**
   * Get contracts expiring soon (within days)
   */
  async getExpiringSoon(days: number = 30): Promise<EmployeeContractRecord[]> {
    const all = await this.getAll();
    const now = new Date();
    const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return all.filter((c) => {
      const endDate = new Date(c.endDate);
      return endDate >= now && endDate <= threshold && c.status === 'active';
    });
  },

  /**
   * Get current contract for employee
   */
  async getCurrentContract(employeeId: number): Promise<EmployeeContractRecord | undefined> {
    const contracts = await this.getByEmployee(employeeId);
    return contracts.find((c) => c.status === 'active');
  },
};

// ========== CONTRACT AMENDMENTS ==========

const contractAmendmentsCRUD = createCRUDService<ContractAmendmentRecord>('contractAmendments');

export const contractAmendmentDB = {
  ...contractAmendmentsCRUD,

  /**
   * Generate unique amendment number (AMD-####)
   */
  async generateAmendmentNumber(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('AMD', all.length + 1, false, 4);
  },

  /**
   * Get amendment by amendment number
   */
  async getByAmendmentNumber(amendmentNumber: string): Promise<ContractAmendmentRecord | undefined> {
    const results = await contractAmendmentsCRUD.getByIndex('amendmentNumber', amendmentNumber);
    return results[0];
  },

  /**
   * Get amendments by contract
   */
  async getByContract(contractId: number): Promise<ContractAmendmentRecord[]> {
    return contractAmendmentsCRUD.getByIndex('contractId', contractId);
  },

  /**
   * Get amendments by type
   */
  async getByType(amendmentType: string): Promise<ContractAmendmentRecord[]> {
    return contractAmendmentsCRUD.getByIndex('amendmentType', amendmentType);
  },

  /**
   * Get amendments by status
   */
  async getByStatus(status: ContractAmendmentStatus): Promise<ContractAmendmentRecord[]> {
    return contractAmendmentsCRUD.getByIndex('status', status);
  },

  /**
   * Get pending amendments
   */
  async getPending(): Promise<ContractAmendmentRecord[]> {
    return this.getByStatus('pending_approval');
  },
};

// ========== MAIN EXPORT ==========

export const contractService = {
  contractTypes: contractTypeDB,
  employeeContracts: employeeContractDB,
  contractAmendments: contractAmendmentDB,
};

export default contractService;
