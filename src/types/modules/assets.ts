/**
 * Asset Management Module Types
 *
 * Type definitions for asset management entities:
 * - Asset Types
 * - Employee Assets
 * - ID Cards
 * - SIM Cards
 * - Employee Emails
 */

import type { BaseRecord } from '../db/base';

// ========== ASSET TYPES ==========

export interface AssetTypeRecord extends BaseRecord {
  name: string;
  category: string;
  description?: string;
  requiresReturn: boolean;
  depreciationYears?: number;
  isActive: boolean;
  [key: string]: unknown;
}

export const ASSET_CATEGORY = {
  IT: 'IT',
  FURNITURE: 'furniture',
  VEHICLE: 'vehicle',
  COMMUNICATION: 'communication',
  OFFICE_EQUIPMENT: 'office_equipment',
  SECURITY: 'security',
  OTHER: 'other',
} as const;

export type AssetCategory =
  (typeof ASSET_CATEGORY)[keyof typeof ASSET_CATEGORY];

// ========== EMPLOYEE ASSETS ==========

export interface EmployeeAssetRecord extends BaseRecord {
  assetTag: string;
  employeeId: number;
  assetTypeId: number;
  assetName?: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  assignedDate: string;
  returnedDate?: string;
  expectedReturnDate?: string;
  status: string;
  condition: string;
  location?: string;
  notes?: string;
  issuedBy?: string;
  receivedBy?: string;
  [key: string]: unknown;
}

export const ASSET_STATUS = {
  ASSIGNED: 'assigned',
  RETURNED: 'returned',
  LOST: 'lost',
  DAMAGED: 'damaged',
  UNDER_REPAIR: 'under_repair',
  DISPOSED: 'disposed',
} as const;

export type AssetStatus = (typeof ASSET_STATUS)[keyof typeof ASSET_STATUS];

export const ASSET_CONDITION = {
  NEW: 'new',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
  DAMAGED: 'damaged',
} as const;

export type AssetCondition =
  (typeof ASSET_CONDITION)[keyof typeof ASSET_CONDITION];

// ========== ID CARDS ==========

export interface IDCardRecord extends BaseRecord {
  cardNumber: string;
  employeeId: number;
  cardType: string;
  issueDate: string;
  expiryDate: string;
  status: string;
  photoUrl?: string;
  issuedBy?: string;
  replacementCount?: number;
  replacementFee?: number;
  lastReplacementDate?: string;
  lastReplacementReason?: string;
  [key: string]: unknown;
}

export const ID_CARD_TYPE = {
  PROBATION: 'probation',
  REGULAR: 'regular',
  CONTRACTOR: 'contractor',
  VISITOR: 'visitor',
} as const;

export type IDCardType = (typeof ID_CARD_TYPE)[keyof typeof ID_CARD_TYPE];

export const ID_CARD_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  LOST: 'lost',
  RETURNED: 'returned',
  CANCELLED: 'cancelled',
} as const;

export type IDCardStatus =
  (typeof ID_CARD_STATUS)[keyof typeof ID_CARD_STATUS];

// ========== SIM CARDS ==========

export interface SIMCardRecord extends BaseRecord {
  simNumber: string;
  phoneNumber: string;
  employeeId: number;
  provider: string;
  planType?: string;
  monthlyLimit?: number;
  assignedDate: string;
  returnedDate?: string;
  status: string;
  notes?: string;
  [key: string]: unknown;
}

export const SIM_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  RETURNED: 'returned',
  LOST: 'lost',
  CANCELLED: 'cancelled',
} as const;

export type SIMStatus = (typeof SIM_STATUS)[keyof typeof SIM_STATUS];

// ========== EMPLOYEE EMAILS ==========

export interface EmployeeEmailRecord extends BaseRecord {
  emailAddress: string;
  employeeId: number;
  emailType?: string;
  createdDate: string;
  deactivatedDate?: string;
  status: string;
  forwardingAddress?: string;
  storageQuotaMB?: number;
  notes?: string;
  [key: string]: unknown;
}

export const EMAIL_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  DEACTIVATED: 'deactivated',
} as const;

export type EmailStatus = (typeof EMAIL_STATUS)[keyof typeof EMAIL_STATUS];
