/**
 * Procurement Module Service
 *
 * Database services for procurement entities:
 * - Vendors
 * - Item Categories
 * - Purchase Requests
 * - RFQs
 * - Purchase Orders
 * - Goods Receipts
 * - Inventory Items
 * - Procurement Contracts
 */

import { createCRUDService } from './core/crud';
import { generateFormattedCode } from './core/utils';
import type {
  VendorRecord,
  ItemCategoryRecord,
  PurchaseRequestRecord,
  RFQRecord,
  PurchaseOrderRecord,
  GoodsReceiptRecord,
  InventoryItemRecord,
  ProcurementContractRecord,
  VendorStatus,
  PurchaseRequestStatus,
  RFQStatus,
  POStatus,
  GRStatus,
  InventoryStatus,
  ProcurementContractStatus,
} from '../../types/modules/procurement';

// ========== VENDORS ==========

const vendorsCRUD = createCRUDService<VendorRecord>('vendors');

export const vendorDB = {
  ...vendorsCRUD,

  /**
   * Generate unique vendor code (VND-####)
   */
  async generateVendorCode(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('VND', all.length + 1, false, 4);
  },

  /**
   * Get vendor by code
   */
  async getByCode(vendorCode: string): Promise<VendorRecord | undefined> {
    const results = await vendorsCRUD.getByIndex('vendorCode', vendorCode);
    return results[0];
  },

  /**
   * Get vendor by name
   */
  async getByName(name: string): Promise<VendorRecord | undefined> {
    const results = await vendorsCRUD.getByIndex('name', name);
    return results[0];
  },

  /**
   * Get vendors by category
   */
  async getByCategory(category: string): Promise<VendorRecord[]> {
    return vendorsCRUD.getByIndex('category', category);
  },

  /**
   * Get vendors by status
   */
  async getByStatus(status: VendorStatus): Promise<VendorRecord[]> {
    return vendorsCRUD.getByIndex('status', status);
  },

  /**
   * Get active vendors
   */
  async getActive(): Promise<VendorRecord[]> {
    return this.getByStatus('active');
  },

  /**
   * Get preferred vendors
   */
  async getPreferred(): Promise<VendorRecord[]> {
    return vendorsCRUD.getByIndex('isPreferred', true);
  },

  /**
   * Get blacklisted vendors
   */
  async getBlacklisted(): Promise<VendorRecord[]> {
    return vendorsCRUD.getByIndex('isBlacklisted', true);
  },
};

// ========== ITEM CATEGORIES ==========

const itemCategoriesCRUD = createCRUDService<ItemCategoryRecord>('itemCategories');

export const itemCategoryDB = {
  ...itemCategoriesCRUD,

  /**
   * Get category by code
   */
  async getByCode(categoryCode: string): Promise<ItemCategoryRecord | undefined> {
    const results = await itemCategoriesCRUD.getByIndex('categoryCode', categoryCode);
    return results[0];
  },

  /**
   * Get category by name
   */
  async getByName(name: string): Promise<ItemCategoryRecord | undefined> {
    const results = await itemCategoriesCRUD.getByIndex('name', name);
    return results[0];
  },

  /**
   * Get subcategories by parent
   */
  async getByParent(parentId: number): Promise<ItemCategoryRecord[]> {
    return itemCategoriesCRUD.getByIndex('parentId', parentId);
  },

  /**
   * Get active categories
   */
  async getActive(): Promise<ItemCategoryRecord[]> {
    return itemCategoriesCRUD.getByIndex('isActive', true);
  },

  /**
   * Get root categories (no parent)
   */
  async getRootCategories(): Promise<ItemCategoryRecord[]> {
    const all = await this.getAll();
    return all.filter((c) => !c.parentId);
  },
};

// ========== PURCHASE REQUESTS ==========

const purchaseRequestsCRUD = createCRUDService<PurchaseRequestRecord>('purchaseRequests');

export const purchaseRequestDB = {
  ...purchaseRequestsCRUD,

  /**
   * Generate unique request number (PR-YYYY-####)
   */
  async generateRequestNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode(`PR-${year}`, all.length + 1, false, 4);
  },

  /**
   * Get request by request number
   */
  async getByRequestNumber(requestNumber: string): Promise<PurchaseRequestRecord | undefined> {
    const results = await purchaseRequestsCRUD.getByIndex('requestNumber', requestNumber);
    return results[0];
  },

  /**
   * Get requests by requester
   */
  async getByRequester(requestedBy: number): Promise<PurchaseRequestRecord[]> {
    return purchaseRequestsCRUD.getByIndex('requestedBy', requestedBy);
  },

  /**
   * Get requests by department
   */
  async getByDepartment(department: string): Promise<PurchaseRequestRecord[]> {
    return purchaseRequestsCRUD.getByIndex('department', department);
  },

  /**
   * Get requests by project
   */
  async getByProject(projectId: number): Promise<PurchaseRequestRecord[]> {
    return purchaseRequestsCRUD.getByIndex('projectId', projectId);
  },

  /**
   * Get requests by status
   */
  async getByStatus(status: PurchaseRequestStatus): Promise<PurchaseRequestRecord[]> {
    return purchaseRequestsCRUD.getByIndex('status', status);
  },

  /**
   * Get pending requests
   */
  async getPending(): Promise<PurchaseRequestRecord[]> {
    return this.getByStatus('pending');
  },

  /**
   * Get approved requests
   */
  async getApproved(): Promise<PurchaseRequestRecord[]> {
    return this.getByStatus('approved');
  },
};

// ========== RFQs ==========

const rfqsCRUD = createCRUDService<RFQRecord>('rfqs');

export const rfqDB = {
  ...rfqsCRUD,

  /**
   * Generate unique RFQ number (RFQ-YYYY-####)
   */
  async generateRFQNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode(`RFQ-${year}`, all.length + 1, false, 4);
  },

  /**
   * Get RFQ by RFQ number
   */
  async getByRFQNumber(rfqNumber: string): Promise<RFQRecord | undefined> {
    const results = await rfqsCRUD.getByIndex('rfqNumber', rfqNumber);
    return results[0];
  },

  /**
   * Get RFQs by purchase request
   */
  async getByPurchaseRequest(purchaseRequestId: number): Promise<RFQRecord[]> {
    return rfqsCRUD.getByIndex('purchaseRequestId', purchaseRequestId);
  },

  /**
   * Get RFQs by status
   */
  async getByStatus(status: RFQStatus): Promise<RFQRecord[]> {
    return rfqsCRUD.getByIndex('status', status);
  },

  /**
   * Get open RFQs
   */
  async getOpen(): Promise<RFQRecord[]> {
    return this.getByStatus('issued');
  },

  /**
   * Get closed RFQs pending evaluation
   */
  async getClosedPendingEvaluation(): Promise<RFQRecord[]> {
    const closed = await this.getByStatus('closed');
    const evaluating = await this.getByStatus('evaluating');
    return [...closed, ...evaluating];
  },
};

// ========== PURCHASE ORDERS ==========

const purchaseOrdersCRUD = createCRUDService<PurchaseOrderRecord>('purchaseOrders');

export const purchaseOrderDB = {
  ...purchaseOrdersCRUD,

  /**
   * Generate unique PO number (PO-YYYY-####)
   */
  async generatePONumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode(`PO-${year}`, all.length + 1, false, 4);
  },

  /**
   * Get PO by PO number
   */
  async getByPONumber(poNumber: string): Promise<PurchaseOrderRecord | undefined> {
    const results = await purchaseOrdersCRUD.getByIndex('poNumber', poNumber);
    return results[0];
  },

  /**
   * Get POs by vendor
   */
  async getByVendor(vendorId: number): Promise<PurchaseOrderRecord[]> {
    return purchaseOrdersCRUD.getByIndex('vendorId', vendorId);
  },

  /**
   * Get POs by RFQ
   */
  async getByRFQ(rfqId: number): Promise<PurchaseOrderRecord[]> {
    return purchaseOrdersCRUD.getByIndex('rfqId', rfqId);
  },

  /**
   * Get POs by purchase request
   */
  async getByPurchaseRequest(purchaseRequestId: number): Promise<PurchaseOrderRecord[]> {
    return purchaseOrdersCRUD.getByIndex('purchaseRequestId', purchaseRequestId);
  },

  /**
   * Get POs by status
   */
  async getByStatus(status: POStatus): Promise<PurchaseOrderRecord[]> {
    return purchaseOrdersCRUD.getByIndex('status', status);
  },

  /**
   * Get pending approval POs
   */
  async getPendingApproval(): Promise<PurchaseOrderRecord[]> {
    return this.getByStatus('pending_approval');
  },

  /**
   * Get approved POs
   */
  async getApproved(): Promise<PurchaseOrderRecord[]> {
    return this.getByStatus('approved');
  },
};

// ========== GOODS RECEIPTS ==========

const goodsReceiptsCRUD = createCRUDService<GoodsReceiptRecord>('goodsReceipts');

export const goodsReceiptDB = {
  ...goodsReceiptsCRUD,

  /**
   * Generate unique receipt number (GR-YYYY-####)
   */
  async generateReceiptNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode(`GR-${year}`, all.length + 1, false, 4);
  },

  /**
   * Get receipt by receipt number
   */
  async getByReceiptNumber(receiptNumber: string): Promise<GoodsReceiptRecord | undefined> {
    const results = await goodsReceiptsCRUD.getByIndex('receiptNumber', receiptNumber);
    return results[0];
  },

  /**
   * Get receipts by purchase order
   */
  async getByPurchaseOrder(purchaseOrderId: number): Promise<GoodsReceiptRecord[]> {
    return goodsReceiptsCRUD.getByIndex('purchaseOrderId', purchaseOrderId);
  },

  /**
   * Get receipts by vendor
   */
  async getByVendor(vendorId: number): Promise<GoodsReceiptRecord[]> {
    return goodsReceiptsCRUD.getByIndex('vendorId', vendorId);
  },

  /**
   * Get receipts by status
   */
  async getByStatus(status: GRStatus): Promise<GoodsReceiptRecord[]> {
    return goodsReceiptsCRUD.getByIndex('status', status);
  },

  /**
   * Get pending inspection
   */
  async getPendingInspection(): Promise<GoodsReceiptRecord[]> {
    return this.getByStatus('pending_inspection');
  },
};

// ========== INVENTORY ITEMS ==========

const inventoryItemsCRUD = createCRUDService<InventoryItemRecord>('inventoryItems');

export const inventoryItemDB = {
  ...inventoryItemsCRUD,

  /**
   * Generate unique item code (ITM-####)
   */
  async generateItemCode(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('ITM', all.length + 1, false, 6);
  },

  /**
   * Get item by code
   */
  async getByItemCode(itemCode: string): Promise<InventoryItemRecord | undefined> {
    const results = await inventoryItemsCRUD.getByIndex('itemCode', itemCode);
    return results[0];
  },

  /**
   * Get items by category
   */
  async getByCategory(categoryId: number): Promise<InventoryItemRecord[]> {
    return inventoryItemsCRUD.getByIndex('categoryId', categoryId);
  },

  /**
   * Get items by status
   */
  async getByStatus(status: InventoryStatus): Promise<InventoryItemRecord[]> {
    return inventoryItemsCRUD.getByIndex('status', status);
  },

  /**
   * Get active items
   */
  async getActive(): Promise<InventoryItemRecord[]> {
    return this.getByStatus('active');
  },

  /**
   * Get low stock items
   */
  async getLowStock(): Promise<InventoryItemRecord[]> {
    return this.getByStatus('low_stock');
  },

  /**
   * Get out of stock items
   */
  async getOutOfStock(): Promise<InventoryItemRecord[]> {
    return this.getByStatus('out_of_stock');
  },

  /**
   * Get items needing reorder
   */
  async getNeedingReorder(): Promise<InventoryItemRecord[]> {
    const all = await this.getAll();
    return all.filter((i) => i.reorderLevel && i.quantityOnHand <= i.reorderLevel);
  },
};

// ========== PROCUREMENT CONTRACTS ==========

const procurementContractsCRUD = createCRUDService<ProcurementContractRecord>('procurementContracts');

export const procurementContractDB = {
  ...procurementContractsCRUD,

  /**
   * Generate unique contract number (PCT-YYYY-####)
   */
  async generateContractNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode(`PCT-${year}`, all.length + 1, false, 4);
  },

  /**
   * Get contract by contract number
   */
  async getByContractNumber(contractNumber: string): Promise<ProcurementContractRecord | undefined> {
    const results = await procurementContractsCRUD.getByIndex('contractNumber', contractNumber);
    return results[0];
  },

  /**
   * Get contracts by vendor
   */
  async getByVendor(vendorId: number): Promise<ProcurementContractRecord[]> {
    return procurementContractsCRUD.getByIndex('vendorId', vendorId);
  },

  /**
   * Get contracts by type
   */
  async getByType(contractType: string): Promise<ProcurementContractRecord[]> {
    return procurementContractsCRUD.getByIndex('contractType', contractType);
  },

  /**
   * Get contracts by status
   */
  async getByStatus(status: ProcurementContractStatus): Promise<ProcurementContractRecord[]> {
    return procurementContractsCRUD.getByIndex('status', status);
  },

  /**
   * Get active contracts
   */
  async getActive(): Promise<ProcurementContractRecord[]> {
    return this.getByStatus('active');
  },

  /**
   * Get contracts expiring soon (within days)
   */
  async getExpiringSoon(days: number = 30): Promise<ProcurementContractRecord[]> {
    const all = await this.getAll();
    const now = new Date();
    const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return all.filter((c) => {
      const endDate = new Date(c.endDate);
      return endDate >= now && endDate <= threshold && c.status === 'active';
    });
  },
};

// ========== MAIN EXPORT ==========

export const procurementService = {
  vendors: vendorDB,
  itemCategories: itemCategoryDB,
  purchaseRequests: purchaseRequestDB,
  rfqs: rfqDB,
  purchaseOrders: purchaseOrderDB,
  goodsReceipts: goodsReceiptDB,
  inventoryItems: inventoryItemDB,
  procurementContracts: procurementContractDB,
};

export default procurementService;
