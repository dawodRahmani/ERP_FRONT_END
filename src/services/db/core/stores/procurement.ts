/**
 * Procurement Object Stores
 *
 * Creates stores for procurement management:
 * - Vendors
 * - Item Categories
 * - Purchase Requests
 * - RFQs
 * - Purchase Orders
 * - Goods Receipts
 * - Inventory Items
 * - Procurement Contracts
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '../../../../types/db/stores';

/**
 * Create all procurement object stores
 */
export function createProcurementStores(db: IDBPDatabase<VDODatabase>): void {
  // Vendors store
  if (!db.objectStoreNames.contains('vendors')) {
    const store = db.createObjectStore('vendors', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('vendorCode', 'vendorCode', { unique: true });
    store.createIndex('name', 'name', { unique: false });
    store.createIndex('email', 'email', { unique: false });
    store.createIndex('category', 'category', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('isPreferred', 'isPreferred', { unique: false });
    store.createIndex('isBlacklisted', 'isBlacklisted', { unique: false });
    console.log('Created store: vendors');
  }

  // Item Categories store
  if (!db.objectStoreNames.contains('itemCategories')) {
    const store = db.createObjectStore('itemCategories', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('categoryCode', 'categoryCode', { unique: true });
    store.createIndex('name', 'name', { unique: false });
    store.createIndex('parentId', 'parentId', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    console.log('Created store: itemCategories');
  }

  // Purchase Requests store
  if (!db.objectStoreNames.contains('purchaseRequests')) {
    const store = db.createObjectStore('purchaseRequests', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('requestNumber', 'requestNumber', { unique: true });
    store.createIndex('requestedBy', 'requestedBy', { unique: false });
    store.createIndex('department', 'department', { unique: false });
    store.createIndex('projectId', 'projectId', { unique: false });
    store.createIndex('priority', 'priority', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('requestDate', 'requestDate', { unique: false });
    console.log('Created store: purchaseRequests');
  }

  // RFQs store
  if (!db.objectStoreNames.contains('rfqs')) {
    const store = db.createObjectStore('rfqs', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('rfqNumber', 'rfqNumber', { unique: true });
    store.createIndex('purchaseRequestId', 'purchaseRequestId', {
      unique: false,
    });
    store.createIndex('issueDate', 'issueDate', { unique: false });
    store.createIndex('closingDate', 'closingDate', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('winningVendorId', 'winningVendorId', { unique: false });
    console.log('Created store: rfqs');
  }

  // Purchase Orders store
  if (!db.objectStoreNames.contains('purchaseOrders')) {
    const store = db.createObjectStore('purchaseOrders', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('poNumber', 'poNumber', { unique: true });
    store.createIndex('rfqId', 'rfqId', { unique: false });
    store.createIndex('vendorId', 'vendorId', { unique: false });
    store.createIndex('orderDate', 'orderDate', { unique: false });
    store.createIndex('deliveryDate', 'deliveryDate', { unique: false });
    store.createIndex('totalAmount', 'totalAmount', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: purchaseOrders');
  }

  // Goods Receipts store
  if (!db.objectStoreNames.contains('goodsReceipts')) {
    const store = db.createObjectStore('goodsReceipts', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('receiptNumber', 'receiptNumber', { unique: true });
    store.createIndex('purchaseOrderId', 'purchaseOrderId', { unique: false });
    store.createIndex('vendorId', 'vendorId', { unique: false });
    store.createIndex('receiptDate', 'receiptDate', { unique: false });
    store.createIndex('receivedBy', 'receivedBy', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: goodsReceipts');
  }

  // Inventory Items store
  if (!db.objectStoreNames.contains('inventoryItems')) {
    const store = db.createObjectStore('inventoryItems', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('itemCode', 'itemCode', { unique: true });
    store.createIndex('name', 'name', { unique: false });
    store.createIndex('categoryId', 'categoryId', { unique: false });
    store.createIndex('quantityOnHand', 'quantityOnHand', { unique: false });
    store.createIndex('location', 'location', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: inventoryItems');
  }

  // Procurement Contracts store
  if (!db.objectStoreNames.contains('procurementContracts')) {
    const store = db.createObjectStore('procurementContracts', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('contractNumber', 'contractNumber', { unique: true });
    store.createIndex('vendorId', 'vendorId', { unique: false });
    store.createIndex('contractType', 'contractType', { unique: false });
    store.createIndex('startDate', 'startDate', { unique: false });
    store.createIndex('endDate', 'endDate', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: procurementContracts');
  }
}
