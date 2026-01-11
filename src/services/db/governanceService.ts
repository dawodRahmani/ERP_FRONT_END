/**
 * Governance Module Service
 *
 * Comprehensive governance management system covering:
 * - Board Members (member tracking with documents and roles)
 * - Board Meetings (meeting management with participants)
 * - Correspondence (incoming/outgoing correspondence)
 */

import type {
  GovernanceBoardMemberRecord,
  GovernanceBoardMeetingRecord,
  GovernanceCorrespondenceRecord,
  BoardMemberStatus,
  BoardMemberRole,
  BoardMeetingType,
  CorrespondenceStatus,
  DocumentCompletionStatus,
} from '../../types/modules/governance';
import { createCRUDService } from './core/crud';

// ========== BOARD MEMBERS ==========

const boardMembersCRUD = createCRUDService<GovernanceBoardMemberRecord>('governanceBoardMembers');

export const governanceBoardMembersDB = {
  ...boardMembersCRUD,

  /**
   * Generate unique email (vdo.board{N}@vdongo.org)
   */
  async generateEmail(): Promise<string> {
    const all = await this.getAll();
    const nextNumber = all.length + 1;
    return `vdo.board${nextNumber}@vdongo.org`;
  },

  /**
   * Get active board members
   */
  async getActive(): Promise<GovernanceBoardMemberRecord[]> {
    return boardMembersCRUD.getByIndex('status', 'active' as BoardMemberStatus);
  },

  /**
   * Get inactive board members
   */
  async getInactive(): Promise<GovernanceBoardMemberRecord[]> {
    return boardMembersCRUD.getByIndex('status', 'inactive' as BoardMemberStatus);
  },

  /**
   * Get by role
   */
  async getByRole(role: BoardMemberRole): Promise<GovernanceBoardMemberRecord[]> {
    return boardMembersCRUD.getByIndex('roleInBoard', role);
  },

  /**
   * Get board head
   */
  async getBoardHead(): Promise<GovernanceBoardMemberRecord | null> {
    const heads = await this.getByRole('head');
    return heads.find((h) => h.status === 'active') || null;
  },

  /**
   * Get members for dropdown (for meeting participant selection)
   */
  async getForDropdown(): Promise<{ id: number; label: string; role: string }[]> {
    const active = await this.getActive();
    return active.map((m) => ({
      id: m.id!,
      label: `${m.name} (${m.roleInBoard})`,
      role: m.roleInBoard,
    }));
  },

  /**
   * Get by organization
   */
  async getByOrganization(organization: string): Promise<GovernanceBoardMemberRecord[]> {
    return boardMembersCRUD.getByIndex('organization', organization);
  },
};

// ========== BOARD MEETINGS ==========

const boardMeetingsCRUD = createCRUDService<GovernanceBoardMeetingRecord>('governanceBoardMeetings');

export const governanceBoardMeetingsDB = {
  ...boardMeetingsCRUD,

  /**
   * Get meetings by year
   */
  async getByYear(year: number): Promise<GovernanceBoardMeetingRecord[]> {
    return boardMeetingsCRUD.getByIndex('year', year);
  },

  /**
   * Get meetings by type
   */
  async getByType(meetingType: BoardMeetingType): Promise<GovernanceBoardMeetingRecord[]> {
    return boardMeetingsCRUD.getByIndex('meetingType', meetingType);
  },

  /**
   * Get recent meetings
   */
  async getRecent(limit: number = 10): Promise<GovernanceBoardMeetingRecord[]> {
    const all = await this.getAll();
    return all
      .sort(
        (a, b) =>
          new Date(b.meetingDate).getTime() - new Date(a.meetingDate).getTime()
      )
      .slice(0, limit);
  },

  /**
   * Get meetings for current year
   */
  async getCurrentYear(): Promise<GovernanceBoardMeetingRecord[]> {
    const currentYear = new Date().getFullYear();
    return this.getByYear(currentYear);
  },

  /**
   * Calculate document completion percentage
   */
  calculateCompletionPercentage(meeting: GovernanceBoardMeetingRecord): number {
    const status = meeting.documentCompletionStatus;
    if (!status) return 0;
    const total = Object.keys(status).length;
    const completed = Object.values(status).filter((v) => v).length;
    return Math.round((completed / total) * 100);
  },

  /**
   * Get meetings with incomplete documents
   */
  async getIncompleteDocuments(): Promise<GovernanceBoardMeetingRecord[]> {
    const all = await this.getAll();
    return all.filter((meeting) => this.calculateCompletionPercentage(meeting) < 100);
  },

  /**
   * Get meetings with complete documents
   */
  async getCompleteDocuments(): Promise<GovernanceBoardMeetingRecord[]> {
    const all = await this.getAll();
    return all.filter((meeting) => this.calculateCompletionPercentage(meeting) === 100);
  },

  /**
   * Update document completion status
   */
  updateDocumentCompletionStatus(documents: any): DocumentCompletionStatus {
    return {
      minute: !!documents.minute,
      pictures: !!documents.pictures && documents.pictures.length > 0,
      agenda: !!documents.agenda,
      workPlan: !!documents.workPlan,
      performanceEvaluation: !!documents.performanceEvaluation,
      attendanceSheet: !!documents.attendanceSheet,
    };
  },
};

// ========== CORRESPONDENCE ==========

const correspondenceCRUD = createCRUDService<GovernanceCorrespondenceRecord>('governanceCorrespondence');

export const governanceCorrespondenceDB = {
  ...correspondenceCRUD,

  /**
   * Get incoming correspondence
   */
  async getIncoming(): Promise<GovernanceCorrespondenceRecord[]> {
    return correspondenceCRUD.getByIndex('direction', 'in');
  },

  /**
   * Get outgoing correspondence
   */
  async getOutgoing(): Promise<GovernanceCorrespondenceRecord[]> {
    return correspondenceCRUD.getByIndex('direction', 'out');
  },

  /**
   * Get by status
   */
  async getByStatus(status: CorrespondenceStatus): Promise<GovernanceCorrespondenceRecord[]> {
    return correspondenceCRUD.getByIndex('status', status);
  },

  /**
   * Get pending items
   */
  async getPending(): Promise<GovernanceCorrespondenceRecord[]> {
    return this.getByStatus('pending');
  },

  /**
   * Get processed items
   */
  async getProcessed(): Promise<GovernanceCorrespondenceRecord[]> {
    return this.getByStatus('processed');
  },

  /**
   * Get pending items requiring response
   */
  async getPendingResponses(): Promise<GovernanceCorrespondenceRecord[]> {
    const all = await this.getAll();
    const today = new Date().toISOString().split('T')[0];
    return all.filter(
      (c) =>
        c.responseRequired &&
        c.status === 'pending' &&
        c.responseDeadline &&
        c.responseDeadline >= today
    );
  },

  /**
   * Get overdue responses
   */
  async getOverdueResponses(): Promise<GovernanceCorrespondenceRecord[]> {
    const all = await this.getAll();
    const today = new Date().toISOString().split('T')[0];
    return all.filter(
      (c) =>
        c.responseRequired &&
        c.status === 'pending' &&
        c.responseDeadline &&
        c.responseDeadline < today
    );
  },

  /**
   * Get by priority
   */
  async getByPriority(priority: string): Promise<GovernanceCorrespondenceRecord[]> {
    return correspondenceCRUD.getByIndex('priority', priority);
  },

  /**
   * Get urgent items
   */
  async getUrgent(): Promise<GovernanceCorrespondenceRecord[]> {
    return this.getByPriority('urgent');
  },

  /**
   * Get by date range
   */
  async getByDateRange(startDate: string, endDate: string): Promise<GovernanceCorrespondenceRecord[]> {
    const all = await this.getAll();
    return all.filter((c) => c.date >= startDate && c.date <= endDate);
  },
};

// ========== MAIN SERVICE EXPORT ==========

export const governanceService = {
  boardMembers: governanceBoardMembersDB,
  boardMeetings: governanceBoardMeetingsDB,
  correspondence: governanceCorrespondenceDB,
};

export default governanceService;

// ========== BACKWARD COMPATIBILITY ALIASES ==========

// Singular aliases for consistency with other services
export const governanceBoardMemberDB = governanceBoardMembersDB;
export const governanceBoardMeetingDB = governanceBoardMeetingsDB;
export const governanceCorrespondenceService = governanceCorrespondenceDB;
