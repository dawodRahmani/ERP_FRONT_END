/**
 * Procurement Module Types
 *
 * Type definitions for procurement entities:
 * - Vendors
 * - Item Categories
 * - Purchase Requests
 * - RFQs (Request for Quotation)
 * - Purchase Orders
 * - Goods Receipts
 * - Inventory Items
 * - Contracts (Procurement)
 */

import type { BaseRecord } from '../db/base';

// ========== VENDORS ==========

export interface VendorRecord extends BaseRecord {
  vendorCode: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  bankName?: string;
  bankAccount?: string;
  paymentTerms?: string;
  category?: string;
  rating?: number;
  isPreferred?: boolean;
  isBlacklisted?: boolean;
  blacklistReason?: string;
  status: string;
  notes?: string;
  [key: string]: unknown;
}

export const VENDOR_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  BLACKLISTED: 'blacklisted',
} as const;

export type VendorStatus = (typeof VENDOR_STATUS)[keyof typeof VENDOR_STATUS];

// ========== ITEM CATEGORIES ==========

export interface ItemCategoryRecord extends BaseRecord {
  categoryCode: string;
  name: string;
  description?: string;
  parentId?: number;
  level?: number;
  isActive: boolean;
  [key: string]: unknown;
}

// ========== PURCHASE REQUESTS ==========

export interface PurchaseRequestRecord extends BaseRecord {
  requestNumber: string;
  requestDate: string;
  requestedBy: number;
  department?: string;
  projectId?: number;
  purpose: string;
  priority?: string;
  requiredDate?: string;
  estimatedTotal?: number;
  currency?: string;
  items?: PurchaseRequestItem[];
  status: string;
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  notes?: string;
  [key: string]: unknown;
}

export interface PurchaseRequestItem {
  itemDescription: string;
  categoryId?: number;
  quantity: number;
  unit?: string;
  estimatedUnitPrice?: number;
  specifications?: string;
}

export const PURCHASE_REQUEST_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type PurchaseRequestStatus =
  (typeof PURCHASE_REQUEST_STATUS)[keyof typeof PURCHASE_REQUEST_STATUS];

export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export type Priority = (typeof PRIORITY)[keyof typeof PRIORITY];

// ========== RFQs (REQUEST FOR QUOTATION) ==========

export interface RFQRecord extends BaseRecord {
  rfqNumber: string;
  purchaseRequestId?: number;
  title: string;
  description?: string;
  issueDate: string;
  closingDate: string;
  items?: RFQItem[];
  invitedVendors?: number[];
  termsAndConditions?: string;
  evaluationCriteria?: string;
  status: string;
  winningVendorId?: number;
  winningQuotationId?: number;
  evaluationNotes?: string;
  createdBy?: string;
  [key: string]: unknown;
}

export interface RFQItem {
  description: string;
  quantity: number;
  unit?: string;
  specifications?: string;
}

export const RFQ_STATUS = {
  DRAFT: 'draft',
  ISSUED: 'issued',
  CLOSED: 'closed',
  EVALUATING: 'evaluating',
  AWARDED: 'awarded',
  CANCELLED: 'cancelled',
} as const;

export type RFQStatus = (typeof RFQ_STATUS)[keyof typeof RFQ_STATUS];

// ========== PURCHASE ORDERS ==========

export interface PurchaseOrderRecord extends BaseRecord {
  poNumber: string;
  rfqId?: number;
  purchaseRequestId?: number;
  vendorId: number;
  orderDate: string;
  deliveryDate?: string;
  deliveryAddress?: string;
  items?: POItem[];
  subtotal?: number;
  taxAmount?: number;
  shippingCost?: number;
  totalAmount: number;
  currency: string;
  paymentTerms?: string;
  termsAndConditions?: string;
  status: string;
  approvedBy?: string;
  approvalDate?: string;
  receivedDate?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  paidDate?: string;
  notes?: string;
  [key: string]: unknown;
}

export interface POItem {
  description: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity?: number;
}

export const PO_STATUS = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  SENT_TO_VENDOR: 'sent_to_vendor',
  PARTIALLY_RECEIVED: 'partially_received',
  RECEIVED: 'received',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type POStatus = (typeof PO_STATUS)[keyof typeof PO_STATUS];

// ========== GOODS RECEIPTS ==========

export interface GoodsReceiptRecord extends BaseRecord {
  receiptNumber: string;
  purchaseOrderId: number;
  vendorId: number;
  receiptDate: string;
  deliveryNoteNumber?: string;
  items?: GRItem[];
  receivedBy: string;
  inspectedBy?: string;
  inspectionNotes?: string;
  status: string;
  warehouseLocation?: string;
  notes?: string;
  [key: string]: unknown;
}

export interface GRItem {
  poItemIndex: number;
  description: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity?: number;
  rejectionReason?: string;
  condition?: string;
}

export const GR_STATUS = {
  PENDING_INSPECTION: 'pending_inspection',
  INSPECTED: 'inspected',
  ACCEPTED: 'accepted',
  PARTIALLY_ACCEPTED: 'partially_accepted',
  REJECTED: 'rejected',
} as const;

export type GRStatus = (typeof GR_STATUS)[keyof typeof GR_STATUS];

// ========== INVENTORY ITEMS ==========

export interface InventoryItemRecord extends BaseRecord {
  itemCode: string;
  name: string;
  description?: string;
  categoryId?: number;
  unit: string;
  quantityOnHand: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  unitCost?: number;
  currency?: string;
  location?: string;
  warehouseId?: number;
  lastReceivedDate?: string;
  lastIssuedDate?: string;
  expiryDate?: string;
  serialNumber?: string;
  batchNumber?: string;
  status: string;
  notes?: string;
  [key: string]: unknown;
}

export const INVENTORY_STATUS = {
  ACTIVE: 'active',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued',
  EXPIRED: 'expired',
} as const;

export type InventoryStatus =
  (typeof INVENTORY_STATUS)[keyof typeof INVENTORY_STATUS];

// ========== PROCUREMENT CONTRACTS ==========

export interface ProcurementContractRecord extends BaseRecord {
  contractNumber: string;
  vendorId: number;
  title: string;
  description?: string;
  contractType: string;
  startDate: string;
  endDate: string;
  totalValue?: number;
  currency?: string;
  paymentTerms?: string;
  deliverables?: string;
  termsAndConditions?: string;
  status: string;
  signedDate?: string;
  signedBy?: string;
  vendorSignedBy?: string;
  renewalDate?: string;
  isAutoRenewal?: boolean;
  terminationDate?: string;
  terminationReason?: string;
  notes?: string;
  [key: string]: unknown;
}

export const PROCUREMENT_CONTRACT_TYPE = {
  FIXED_PRICE: 'fixed_price',
  FRAMEWORK: 'framework',
  SERVICE: 'service',
  SUPPLY: 'supply',
  CONSULTANCY: 'consultancy',
} as const;

export type ProcurementContractType =
  (typeof PROCUREMENT_CONTRACT_TYPE)[keyof typeof PROCUREMENT_CONTRACT_TYPE];

export const PROCUREMENT_CONTRACT_STATUS = {
  DRAFT: 'draft',
  PENDING_SIGNATURE: 'pending_signature',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  TERMINATED: 'terminated',
  RENEWED: 'renewed',
} as const;

export type ProcurementContractStatus =
  (typeof PROCUREMENT_CONTRACT_STATUS)[keyof typeof PROCUREMENT_CONTRACT_STATUS];
