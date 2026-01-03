/**
 * Asset Management Module Service
 *
 * Database services for asset management entities:
 * - Asset Types
 * - Employee Assets
 * - ID Cards
 * - SIM Cards
 * - Employee Emails
 */

import { createCRUDService } from './core/crud';
import { generateFormattedCode } from './core/utils';
import type {
  AssetTypeRecord,
  EmployeeAssetRecord,
  IDCardRecord,
  SIMCardRecord,
  EmployeeEmailRecord,
  AssetStatus,
  IDCardStatus,
  SIMStatus,
  EmailStatus,
} from '../../types/modules/assets';

// ========== ASSET TYPES ==========

const assetTypesCRUD = createCRUDService<AssetTypeRecord>('assetTypes');

export const assetTypeDB = {
  ...assetTypesCRUD,

  /**
   * Get asset type by name
   */
  async getByName(name: string): Promise<AssetTypeRecord | undefined> {
    const results = await assetTypesCRUD.getByIndex('name', name);
    return results[0];
  },

  /**
   * Get asset types by category
   */
  async getByCategory(category: string): Promise<AssetTypeRecord[]> {
    return assetTypesCRUD.getByIndex('category', category);
  },

  /**
   * Get active asset types
   */
  async getActive(): Promise<AssetTypeRecord[]> {
    return assetTypesCRUD.getByIndex('isActive', true);
  },
};

// ========== EMPLOYEE ASSETS ==========

const employeeAssetsCRUD = createCRUDService<EmployeeAssetRecord>('employeeAssets');

export const employeeAssetDB = {
  ...employeeAssetsCRUD,

  /**
   * Generate unique asset tag (AST-####)
   */
  async generateAssetTag(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('AST', all.length + 1, false, 6);
  },

  /**
   * Get asset by tag
   */
  async getByAssetTag(assetTag: string): Promise<EmployeeAssetRecord | undefined> {
    const results = await employeeAssetsCRUD.getByIndex('assetTag', assetTag);
    return results[0];
  },

  /**
   * Get assets by employee
   */
  async getByEmployee(employeeId: number): Promise<EmployeeAssetRecord[]> {
    return employeeAssetsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get assets by type
   */
  async getByAssetType(assetTypeId: number): Promise<EmployeeAssetRecord[]> {
    return employeeAssetsCRUD.getByIndex('assetTypeId', assetTypeId);
  },

  /**
   * Get assets by status
   */
  async getByStatus(status: AssetStatus): Promise<EmployeeAssetRecord[]> {
    return employeeAssetsCRUD.getByIndex('status', status);
  },

  /**
   * Get assigned assets
   */
  async getAssigned(): Promise<EmployeeAssetRecord[]> {
    return this.getByStatus('assigned');
  },

  /**
   * Get overdue returns
   */
  async getOverdueReturns(): Promise<EmployeeAssetRecord[]> {
    const all = await this.getAll();
    const now = new Date();
    return all.filter((a) => {
      if (!a.expectedReturnDate || a.status !== 'assigned') return false;
      return new Date(a.expectedReturnDate) < now;
    });
  },
};

// ========== ID CARDS ==========

const idCardsCRUD = createCRUDService<IDCardRecord>('idCards');

export const idCardDB = {
  ...idCardsCRUD,

  /**
   * Generate unique card number (IDC-####)
   */
  async generateCardNumber(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('IDC', all.length + 1, false, 6);
  },

  /**
   * Get ID card by card number
   */
  async getByCardNumber(cardNumber: string): Promise<IDCardRecord | undefined> {
    const results = await idCardsCRUD.getByIndex('cardNumber', cardNumber);
    return results[0];
  },

  /**
   * Get ID cards by employee
   */
  async getByEmployee(employeeId: number): Promise<IDCardRecord[]> {
    return idCardsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get ID cards by type
   */
  async getByCardType(cardType: string): Promise<IDCardRecord[]> {
    return idCardsCRUD.getByIndex('cardType', cardType);
  },

  /**
   * Get ID cards by status
   */
  async getByStatus(status: IDCardStatus): Promise<IDCardRecord[]> {
    return idCardsCRUD.getByIndex('status', status);
  },

  /**
   * Get active ID cards
   */
  async getActive(): Promise<IDCardRecord[]> {
    return this.getByStatus('active');
  },

  /**
   * Get current active ID card for employee
   */
  async getCurrentCard(employeeId: number): Promise<IDCardRecord | undefined> {
    const cards = await this.getByEmployee(employeeId);
    return cards.find((c) => c.status === 'active');
  },

  /**
   * Get expiring cards (within days)
   */
  async getExpiringSoon(days: number = 30): Promise<IDCardRecord[]> {
    const all = await this.getAll();
    const now = new Date();
    const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return all.filter((c) => {
      const expiryDate = new Date(c.expiryDate);
      return expiryDate >= now && expiryDate <= threshold && c.status === 'active';
    });
  },
};

// ========== SIM CARDS ==========

const simCardsCRUD = createCRUDService<SIMCardRecord>('simCards');

export const simCardDB = {
  ...simCardsCRUD,

  /**
   * Get SIM card by SIM number
   */
  async getBySIMNumber(simNumber: string): Promise<SIMCardRecord | undefined> {
    const results = await simCardsCRUD.getByIndex('simNumber', simNumber);
    return results[0];
  },

  /**
   * Get SIM card by phone number
   */
  async getByPhoneNumber(phoneNumber: string): Promise<SIMCardRecord | undefined> {
    const results = await simCardsCRUD.getByIndex('phoneNumber', phoneNumber);
    return results[0];
  },

  /**
   * Get SIM cards by employee
   */
  async getByEmployee(employeeId: number): Promise<SIMCardRecord[]> {
    return simCardsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get SIM cards by provider
   */
  async getByProvider(provider: string): Promise<SIMCardRecord[]> {
    return simCardsCRUD.getByIndex('provider', provider);
  },

  /**
   * Get SIM cards by status
   */
  async getByStatus(status: SIMStatus): Promise<SIMCardRecord[]> {
    return simCardsCRUD.getByIndex('status', status);
  },

  /**
   * Get active SIM cards
   */
  async getActive(): Promise<SIMCardRecord[]> {
    return this.getByStatus('active');
  },
};

// ========== EMPLOYEE EMAILS ==========

const employeeEmailsCRUD = createCRUDService<EmployeeEmailRecord>('employeeEmails');

export const employeeEmailDB = {
  ...employeeEmailsCRUD,

  /**
   * Get email by address
   */
  async getByEmailAddress(emailAddress: string): Promise<EmployeeEmailRecord | undefined> {
    const results = await employeeEmailsCRUD.getByIndex('emailAddress', emailAddress);
    return results[0];
  },

  /**
   * Get emails by employee
   */
  async getByEmployee(employeeId: number): Promise<EmployeeEmailRecord[]> {
    return employeeEmailsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get emails by status
   */
  async getByStatus(status: EmailStatus): Promise<EmployeeEmailRecord[]> {
    return employeeEmailsCRUD.getByIndex('status', status);
  },

  /**
   * Get active emails
   */
  async getActive(): Promise<EmployeeEmailRecord[]> {
    return this.getByStatus('active');
  },

  /**
   * Get primary email for employee
   */
  async getPrimaryEmail(employeeId: number): Promise<EmployeeEmailRecord | undefined> {
    const emails = await this.getByEmployee(employeeId);
    return emails.find((e) => e.status === 'active');
  },
};

// ========== MAIN EXPORT ==========

export const assetService = {
  assetTypes: assetTypeDB,
  employeeAssets: employeeAssetDB,
  idCards: idCardDB,
  simCards: simCardDB,
  employeeEmails: employeeEmailDB,
};

export default assetService;
