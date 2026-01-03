/**
 * Certificates Module
 *
 * Manages stakeholder acknowledgements and certifications.
 *
 * Features:
 * - Track certificates from Donors, Partners, and Authorities
 * - Document types: Recommendation Letter, Work Completion, Project Completion
 * - File upload support (metadata stored, ready for API integration)
 * - Linked to projects
 *
 * API Format:
 * GET /api/program/certificates - List all certificates
 * GET /api/program/certificates/:id - Get certificate by ID
 * POST /api/program/certificates - Create certificate
 * PUT /api/program/certificates/:id - Update certificate
 * DELETE /api/program/certificates/:id - Delete certificate
 * GET /api/program/certificates/by-project/:projectId - Get certificates by project
 * GET /api/program/certificates/by-agency/:agency - Get certificates by agency
 * GET /api/program/certificates/by-year/:year - Get certificates by year
 * POST /api/program/certificates/:id/upload - Upload document file
 * GET /api/program/certificates/:id/download - Download document file
 */

export { default as CertificateList } from './CertificateList';
export { default as CertificateForm } from './CertificateForm';
export { default as CertificateView } from './CertificateView';
