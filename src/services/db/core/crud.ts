/**
 * Generic CRUD Service Factory
 *
 * Provides type-safe CRUD operations for IndexedDB stores.
 * Eliminates code duplication across all database services.
 */

import type { BaseRecord, CRUDService, CreateInput, UpdateInput } from '../../../types/db/base';
import { RecordNotFoundError, TransactionError } from '../../../types/db/errors';
import type { StoreName } from '../../../types/db/stores';
import { getDB } from './connection';

/**
 * Create a CRUD service for a specific store
 *
 * @template T Record type extending BaseRecord
 * @param storeName Name of the IndexedDB object store
 * @returns CRUD service with type-safe operations
 *
 * @example
 * ```typescript
 * interface Employee extends BaseRecord {
 *   employeeId: string;
 *   firstName: string;
 *   lastName: string;
 * }
 *
 * const employeeService = createCRUDService<Employee>('employees');
 * const employee = await employeeService.create({
 *   employeeId: 'EMP001',
 *   firstName: 'John',
 *   lastName: 'Doe'
 * });
 * ```
 */
export function createCRUDService<T extends BaseRecord>(
  storeName: StoreName
): CRUDService<T> {
  return {
    /**
     * Create a new record in the store
     * Automatically adds timestamps (createdAt, updatedAt)
     */
    async create(data: CreateInput<T>): Promise<T> {
      try {
        const db = await getDB();
        const now = new Date().toISOString();

        const record = {
          ...data,
          createdAt: now,
          updatedAt: now,
        } as T;
        const id = await db.add(storeName, record);

        return {
          ...record,
          id: id as number,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new TransactionError(
          `Failed to create record in ${storeName}: ${message}`,
          storeName,
          error
        );
      }
    },

    /**
     * Get all records from the store
     * @returns Array of all records, sorted by creation date (newest first)
     */
    async getAll(): Promise<T[]> {
      try {
        const db = await getDB();
        const records = await db.getAll(storeName);

        // Sort by createdAt descending (newest first)
        return (records as T[]).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new TransactionError(
          `Failed to get all records from ${storeName}: ${message}`,
          storeName,
          error
        );
      }
    },

    /**
     * Get a single record by ID
     * @param id Record ID
     * @returns Record if found, undefined otherwise
     */
    async getById(id: number): Promise<T | undefined> {
      try {
        const db = await getDB();
        const record = await db.get(storeName, id);
        return record as T | undefined;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new TransactionError(
          `Failed to get record ${id} from ${storeName}: ${message}`,
          storeName,
          error
        );
      }
    },

    /**
     * Update an existing record
     * Automatically updates the updatedAt timestamp
     *
     * @param id Record ID
     * @param data Partial update data
     * @returns Updated record
     * @throws RecordNotFoundError if record doesn't exist
     */
    async update(id: number, data: UpdateInput<T>): Promise<T> {
      try {
        const db = await getDB();

        // Get existing record
        const existing = await db.get(storeName, id);
        if (!existing) {
          throw new RecordNotFoundError(storeName, id);
        }

        // Merge with updates and set new timestamp
        const updated = {
          ...existing,
          ...data,
          id,
          updatedAt: new Date().toISOString(),
        } as T;

        await db.put(storeName, updated);

        return updated;
      } catch (error) {
        if (error instanceof RecordNotFoundError) {
          throw error;
        }
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new TransactionError(
          `Failed to update record ${id} in ${storeName}: ${message}`,
          storeName,
          error
        );
      }
    },

    /**
     * Delete a record by ID
     *
     * @param id Record ID
     * @throws RecordNotFoundError if record doesn't exist
     */
    async delete(id: number): Promise<void> {
      try {
        const db = await getDB();

        // Verify record exists before deleting
        const existing = await db.get(storeName, id);
        if (!existing) {
          throw new RecordNotFoundError(storeName, id);
        }

        await db.delete(storeName, id);
      } catch (error) {
        if (error instanceof RecordNotFoundError) {
          throw error;
        }
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new TransactionError(
          `Failed to delete record ${id} from ${storeName}: ${message}`,
          storeName,
          error
        );
      }
    },

    /**
     * Query records by index
     *
     * @param indexName Name of the index to query
     * @param value Value to search for
     * @returns Array of matching records
     */
    async getByIndex<K extends keyof T>(indexName: string, value: T[K]): Promise<T[]> {
      try {
        const db = await getDB();
        const records = await db.getAllFromIndex(storeName, indexName, value as IDBValidKey);
        return records as T[];
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new TransactionError(
          `Failed to query ${storeName} by index ${indexName}: ${message}`,
          storeName,
          error
        );
      }
    },
  };
}

/**
 * Batch create multiple records
 * More efficient than calling create() multiple times
 *
 * @param storeName Name of the store
 * @param records Array of records to create
 * @returns Array of created records with IDs
 */
export async function batchCreate<T extends BaseRecord>(
  storeName: StoreName,
  records: CreateInput<T>[]
): Promise<T[]> {
  try {
    const db = await getDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const now = new Date().toISOString();

    const createdRecords: T[] = [];

    for (const data of records) {
      const record = {
        ...data,
        createdAt: now,
        updatedAt: now,
      } as T;

      const id = await store.add(record);
      createdRecords.push({
        ...record,
        id: id as number,
      });
    }

    await tx.done;
    return createdRecords;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new TransactionError(
      `Failed to batch create records in ${storeName}: ${message}`,
      storeName,
      error
    );
  }
}

/**
 * Batch delete multiple records by IDs
 *
 * @param storeName Name of the store
 * @param ids Array of record IDs to delete
 */
export async function batchDelete(
  storeName: StoreName,
  ids: number[]
): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);

    for (const id of ids) {
      await store.delete(id);
    }

    await tx.done;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new TransactionError(
      `Failed to batch delete records from ${storeName}: ${message}`,
      storeName,
      error
    );
  }
}

/**
 * Count total records in a store
 *
 * @param storeName Name of the store
 * @returns Total number of records
 */
export async function countRecords(storeName: StoreName): Promise<number> {
  try {
    const db = await getDB();
    return await db.count(storeName);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new TransactionError(
      `Failed to count records in ${storeName}: ${message}`,
      storeName,
      error
    );
  }
}

/**
 * Clear all records from a store
 * WARNING: This will delete all data in the store
 *
 * @param storeName Name of the store
 */
export async function clearStore(storeName: StoreName): Promise<void> {
  try {
    const db = await getDB();
    await db.clear(storeName);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new TransactionError(
      `Failed to clear store ${storeName}: ${message}`,
      storeName,
      error
    );
  }
}

/**
 * Clear all data from all stores in the database
 * WARNING: This will delete all data from the database
 * Only use for testing or complete data reset
 */
export async function clearAllData(): Promise<void> {
  try {
    const db = await getDB();
    const allStores = Array.from(db.objectStoreNames) as StoreName[];

    // Use a single transaction to clear all stores efficiently
    const tx = db.transaction(allStores, 'readwrite');

    await Promise.all(
      allStores.map(storeName => tx.objectStore(storeName).clear())
    );

    await tx.done;
    console.log('All data cleared from database');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new TransactionError(
      `Failed to clear all data: ${message}`,
      'multiple',
      error
    );
  }
}
