/**
 * Safeguarding Module
 *
 * Manages safeguarding activities including reports, trainings, awareness raising,
 * and visibility materials.
 *
 * Components:
 * - SafeguardingList: Browse, search, filter safeguarding activities with status tracking
 * - SafeguardingForm: Create/edit safeguarding activities with document uploads
 * - SafeguardingView: Detailed activity information with project context
 *
 * Features:
 * - Project-based activity tracking
 * - Multiple activity types (Report, Training, Awareness, Banners, Work Plan)
 * - Frequency tracking (Quarterly, Annually, As Per Plan)
 * - Due date reminders with color-coded alerts
 * - Document upload for reports and materials
 * - Status workflow (Pending, In Progress, Completed, Overdue)
 * - Responsible officer assignment
 *
 * Activity Types (from VDO Safeguarding template):
 * - Safeguarding Report: Quarterly/Annually reports
 * - Awareness Raising: Per plan awareness activities
 * - Training: Safeguarding trainings as per plan
 * - Banners & Visibility Materials: Annual design and production
 * - Work Plan: Safeguarding work plan tracking
 *
 * API Integration Points:
 * When integrating with a backend API, update programService.ts:
 *
 * 1. Replace IndexedDB operations with API calls:
 *    - GET /api/program/safeguarding - List all activities
 *    - GET /api/program/safeguarding/:id - Get single activity
 *    - POST /api/program/safeguarding - Create activity
 *    - PUT /api/program/safeguarding/:id - Update activity
 *    - DELETE /api/program/safeguarding/:id - Delete activity
 *    - POST /api/program/safeguarding/:id/complete - Mark as completed
 *
 * 2. File upload endpoints:
 *    - POST /api/uploads/safeguarding - Upload safeguarding document
 *    - GET /api/uploads/safeguarding/:id - Download document
 *
 * 3. Filtering and search:
 *    - GET /api/program/safeguarding?projectId=X&type=Y&status=Z
 *    - GET /api/program/safeguarding/overdue - Get overdue activities
 *    - GET /api/program/safeguarding/due-soon?days=15 - Get activities due soon
 *
 * Data Structure (Safeguarding):
 * {
 *   id: number;
 *   projectId: number;
 *   projectName?: string;
 *   activityType: 'report' | 'awareness_raising' | 'training' | 'banners_visibility' | 'work_plan';
 *   frequency: 'quarterly' | 'annually' | 'as_per_plan';
 *   documentFile?: FileMetadata;
 *   responsibleOfficer?: string;
 *   dueDate?: string;
 *   status: 'pending' | 'in_progress' | 'completed' | 'overdue';
 *   completedDate?: string;
 *   description?: string;
 *   createdAt: string;
 *   updatedAt: string;
 * }
 */

export { default as SafeguardingList } from './SafeguardingList';
export { default as SafeguardingForm } from './SafeguardingForm';
export { default as SafeguardingView } from './SafeguardingView';
