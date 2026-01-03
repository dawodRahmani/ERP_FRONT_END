/**
 * Database Connection Management
 *
 * Provides centralized singleton database connection for the VDO ERP system.
 * Ensures single source of truth for database version and connection handling.
 */

import { openDB, type IDBPDatabase } from 'idb';
import type { VDODatabase } from '../../../types/db/stores';
import { DB_CONFIG } from '../../../types/db/constants';
import { ConnectionError } from '../../../types/db/errors';

/** Singleton database instance */
let dbInstance: IDBPDatabase<VDODatabase> | null = null;

/**
 * Get or create database connection
 * Uses lazy initialization pattern - database is only opened when first requested
 *
 * @returns Promise resolving to the database instance
 * @throws ConnectionError if database cannot be opened
 */
export async function getDB(): Promise<IDBPDatabase<VDODatabase>> {
  if (!dbInstance) {
    dbInstance = await initDB();
  }
  return dbInstance;
}

/**
 * Initialize the database connection
 * This is called automatically by getDB() on first access
 *
 * @returns Promise resolving to the database instance
 * @throws ConnectionError if initialization fails
 */
export async function initDB(): Promise<IDBPDatabase<VDODatabase>> {
  try {
    // Import upgrade logic dynamically to avoid circular dependencies
    const { upgradeDatabase } = await import('./upgrade');

    const db = await openDB<VDODatabase>(
      DB_CONFIG.NAME,
      DB_CONFIG.VERSION,
      {
        upgrade(db, oldVersion, newVersion) {
          upgradeDatabase(db, oldVersion, newVersion);
        },
        blocked() {
          console.warn(
            'Database upgrade blocked. Please close all other tabs using this application.'
          );
        },
        blocking() {
          console.warn(
            'This tab is blocking a database upgrade. The application may need to refresh.'
          );
        },
      }
    );

    console.log(`IndexedDB connected: ${DB_CONFIG.NAME} v${DB_CONFIG.VERSION}`);
    return db;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to initialize IndexedDB:', error);
    throw new ConnectionError(`Failed to initialize database: ${message}`, error);
  }
}

/**
 * Reset the database connection
 * Closes the current connection and clears the singleton instance
 * Useful for testing or forcing a reconnection
 */
export function resetDB(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    console.log('Database connection reset');
  }
}

/**
 * Close the database connection
 * Alias for resetDB() for clarity
 */
export function closeDB(): void {
  resetDB();
}

/**
 * Check if database is currently connected
 *
 * @returns True if database instance exists, false otherwise
 */
export function isConnected(): boolean {
  return dbInstance !== null;
}

/**
 * Get current database version
 *
 * @returns Current database version
 */
export function getDBVersion(): number {
  return DB_CONFIG.VERSION;
}

/**
 * Delete the entire database
 * WARNING: This will permanently delete all data
 * Only use for testing or complete data reset
 *
 * @returns Promise that resolves when database is deleted
 */
export async function deleteDatabase(): Promise<void> {
  try {
    // Close existing connection first
    resetDB();

    // Delete the database
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_CONFIG.NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => {
        console.warn('Database deletion blocked. Close all tabs and try again.');
      };
    });

    console.log(`Database ${DB_CONFIG.NAME} deleted successfully`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new ConnectionError(`Failed to delete database: ${message}`, error);
  }
}

/**
 * Delete and recreate the database
 * WARNING: This will permanently delete all data and reinitialize
 * Useful for complete reset during development/testing
 *
 * @returns Promise resolving to the new database instance
 */
export async function deleteAndRecreateDB(): Promise<IDBPDatabase<VDODatabase>> {
  await deleteDatabase();
  dbInstance = await initDB();
  return dbInstance;
}
