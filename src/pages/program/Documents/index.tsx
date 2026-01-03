/**
 * Documents Module
 *
 * Manages project documents and file uploads.
 *
 * Document Types:
 * - Project Proposal
 * - Work Plan
 * - Budget
 * - Grant Agreement
 * - Logframe
 * - Annexes/Templates
 * - Compliance Documents (donor policies related to project)
 *
 * Features:
 * - Upload and manage project-related documents
 * - File metadata storage (ready for API integration)
 * - Filter by document type and project
 * - Track upload date and uploader
 * - View related documents from same project
 *
 * API Format:
 * GET /api/program/documents - List all documents
 * GET /api/program/documents/:id - Get document by ID
 * POST /api/program/documents - Create document metadata
 * PUT /api/program/documents/:id - Update document metadata
 * DELETE /api/program/documents/:id - Delete document
 * GET /api/program/documents/by-project/:projectId - Get documents by project
 * GET /api/program/documents/by-type/:documentType - Get documents by type
 * POST /api/program/documents/:id/upload - Upload actual file
 * GET /api/program/documents/:id/download - Download file
 * GET /api/program/documents/recent - Get recent documents
 */

export { default as DocumentList } from './DocumentList';
export { default as DocumentForm } from './DocumentForm';
export { default as DocumentView } from './DocumentView';
