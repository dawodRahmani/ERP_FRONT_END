/**
 * Beneficiaries Module
 *
 * Manages program beneficiaries with comprehensive tracking of demographics,
 * family composition, and verification status.
 *
 * Components:
 * - BeneficiaryList: Browse, search, filter beneficiaries with verification actions
 * - BeneficiaryForm: Create/edit beneficiary with family demographics
 * - BeneficiaryView: Detailed beneficiary information with family breakdown
 *
 * Features:
 * - Project-based beneficiary tracking
 * - Verification workflow (verify/reject)
 * - Family composition tracking (Female <17, Female 18+, Male <18, Male 18+)
 * - NID document upload
 * - Location tracking (District, Village, Origin)
 * - Multiple beneficiary types (IDP, Returnee, GBV Survivor, etc.)
 *
 * API Integration Points:
 * When integrating with a backend API, update programService.ts:
 *
 * 1. Replace IndexedDB operations with API calls:
 *    - GET /api/program/beneficiaries - List all beneficiaries
 *    - GET /api/program/beneficiaries/:id - Get single beneficiary
 *    - POST /api/program/beneficiaries - Create beneficiary
 *    - PUT /api/program/beneficiaries/:id - Update beneficiary
 *    - DELETE /api/program/beneficiaries/:id - Delete beneficiary
 *    - POST /api/program/beneficiaries/:id/verify - Verify beneficiary
 *    - POST /api/program/beneficiaries/:id/reject - Reject beneficiary
 *
 * 2. File upload endpoints:
 *    - POST /api/uploads/nid - Upload NID document
 *    - GET /api/uploads/nid/:id - Download NID document
 *
 * 3. Filtering and search:
 *    - GET /api/program/beneficiaries?projectId=X&type=Y&status=Z&district=W
 *    - GET /api/program/beneficiaries/search?q=query
 *
 * Data Structure (Beneficiary):
 * {
 *   id: string;
 *   projectId: string;
 *   name: string;
 *   type: BeneficiaryType;
 *   serviceType: string;
 *   status: 'verified' | 'unverified' | 'rejected';
 *   nidNumber?: string;
 *   nidDocument?: FileMetadata;
 *   contactNumber?: string;
 *   currentResidence?: string;
 *   origin?: string;
 *   district: string;
 *   village?: string;
 *   familySize: number;
 *   femaleUnder17: number;
 *   female18Plus: number;
 *   maleUnder18: number;
 *   male18Plus: number;
 *   genderOfHead: 'male' | 'female';
 *   notes?: string;
 *   createdAt: Date;
 *   updatedAt: Date;
 * }
 */

export { default as BeneficiaryList } from './BeneficiaryList';
export { default as BeneficiaryForm } from './BeneficiaryForm';
export { default as BeneficiaryView } from './BeneficiaryView';
