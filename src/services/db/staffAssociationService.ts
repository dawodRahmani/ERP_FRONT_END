/**
 * Staff Association Module Service
 *
 * Database services for staff association entities:
 * - Staff Association Positions
 * - Staff Association Members
 * - Association Meetings
 * - Association Activities
 * - Staff Association Contributions
 * - Staff Welfare Requests
 * - Staff Welfare Payments
 */

import { createCRUDService } from './core/crud';
import { generateFormattedCode } from './core/utils';
import type {
  StaffAssociationPositionRecord,
  StaffAssociationMemberRecord,
  AssociationMeetingRecord,
  AssociationActivityRecord,
  StaffAssociationContributionRecord,
  StaffWelfareRequestRecord,
  StaffWelfarePaymentRecord,
  MemberStatus,
  MeetingStatus,
  ActivityStatus,
  ContributionStatus,
  WelfareRequestStatus,
  WelfarePaymentStatus,
} from '../../types/modules/staffAssociation';

// ========== STAFF ASSOCIATION POSITIONS ==========

const positionsCRUD = createCRUDService<StaffAssociationPositionRecord>('staffAssociationPositions');

export const associationPositionDB = {
  ...positionsCRUD,

  /**
   * Get position by title
   */
  async getByTitle(title: string): Promise<StaffAssociationPositionRecord | undefined> {
    const results = await positionsCRUD.getByIndex('title', title);
    return results[0];
  },

  /**
   * Get executive positions
   */
  async getExecutive(): Promise<StaffAssociationPositionRecord[]> {
    return positionsCRUD.getByIndex('isExecutive', true);
  },

  /**
   * Get active positions
   */
  async getActive(): Promise<StaffAssociationPositionRecord[]> {
    return positionsCRUD.getByIndex('isActive', true);
  },
};

// ========== STAFF ASSOCIATION MEMBERS ==========

const membersCRUD = createCRUDService<StaffAssociationMemberRecord>('staffAssociationMembers');

export const associationMemberDB = {
  ...membersCRUD,

  /**
   * Generate unique membership number (MBR-####)
   */
  async generateMembershipNumber(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('MBR', all.length + 1, false, 4);
  },

  /**
   * Get member by employee
   */
  async getByEmployee(employeeId: number): Promise<StaffAssociationMemberRecord[]> {
    return membersCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get members by position
   */
  async getByPosition(positionId: number): Promise<StaffAssociationMemberRecord[]> {
    return membersCRUD.getByIndex('positionId', positionId);
  },

  /**
   * Get members by status
   */
  async getByStatus(status: MemberStatus): Promise<StaffAssociationMemberRecord[]> {
    return membersCRUD.getByIndex('status', status);
  },

  /**
   * Get active members
   */
  async getActive(): Promise<StaffAssociationMemberRecord[]> {
    return this.getByStatus('active');
  },

  /**
   * Get current member record for employee
   */
  async getCurrentMember(employeeId: number): Promise<StaffAssociationMemberRecord | undefined> {
    const members = await this.getByEmployee(employeeId);
    return members.find((m) => m.status === 'active');
  },
};

// ========== ASSOCIATION MEETINGS ==========

const meetingsCRUD = createCRUDService<AssociationMeetingRecord>('associationMeetings');

export const associationMeetingDB = {
  ...meetingsCRUD,

  /**
   * Generate unique meeting number (MTG-YYYY-####)
   */
  async generateMeetingNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode(`MTG-${year}`, all.length + 1, false, 4);
  },

  /**
   * Get meeting by meeting number
   */
  async getByMeetingNumber(meetingNumber: string): Promise<AssociationMeetingRecord | undefined> {
    const results = await meetingsCRUD.getByIndex('meetingNumber', meetingNumber);
    return results[0];
  },

  /**
   * Get meetings by type
   */
  async getByType(meetingType: string): Promise<AssociationMeetingRecord[]> {
    return meetingsCRUD.getByIndex('meetingType', meetingType);
  },

  /**
   * Get meetings by status
   */
  async getByStatus(status: MeetingStatus): Promise<AssociationMeetingRecord[]> {
    return meetingsCRUD.getByIndex('status', status);
  },

  /**
   * Get scheduled meetings
   */
  async getScheduled(): Promise<AssociationMeetingRecord[]> {
    return this.getByStatus('scheduled');
  },

  /**
   * Get upcoming meetings (within days)
   */
  async getUpcoming(days: number = 30): Promise<AssociationMeetingRecord[]> {
    const all = await this.getAll();
    const now = new Date();
    const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return all.filter((m) => {
      const meetingDate = new Date(m.meetingDate);
      return meetingDate >= now && meetingDate <= threshold && m.status === 'scheduled';
    });
  },
};

// ========== ASSOCIATION ACTIVITIES ==========

const activitiesCRUD = createCRUDService<AssociationActivityRecord>('associationActivities');

export const associationActivityDB = {
  ...activitiesCRUD,

  /**
   * Get activities by type
   */
  async getByType(activityType: string): Promise<AssociationActivityRecord[]> {
    return activitiesCRUD.getByIndex('activityType', activityType);
  },

  /**
   * Get activities by status
   */
  async getByStatus(status: ActivityStatus): Promise<AssociationActivityRecord[]> {
    return activitiesCRUD.getByIndex('status', status);
  },

  /**
   * Get planned activities
   */
  async getPlanned(): Promise<AssociationActivityRecord[]> {
    return this.getByStatus('planned');
  },

  /**
   * Get upcoming activities (within days)
   */
  async getUpcoming(days: number = 30): Promise<AssociationActivityRecord[]> {
    const all = await this.getAll();
    const now = new Date();
    const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return all.filter((a) => {
      const activityDate = new Date(a.activityDate);
      return activityDate >= now && activityDate <= threshold &&
        (a.status === 'planned' || a.status === 'approved');
    });
  },
};

// ========== STAFF ASSOCIATION CONTRIBUTIONS ==========

const contributionsCRUD = createCRUDService<StaffAssociationContributionRecord>('staffAssociationContributions');

export const associationContributionDB = {
  ...contributionsCRUD,

  /**
   * Get contributions by member
   */
  async getByMember(memberId: number): Promise<StaffAssociationContributionRecord[]> {
    return contributionsCRUD.getByIndex('memberId', memberId);
  },

  /**
   * Get contributions by period
   */
  async getByPeriod(period: string): Promise<StaffAssociationContributionRecord[]> {
    return contributionsCRUD.getByIndex('period', period);
  },

  /**
   * Get contributions by status
   */
  async getByStatus(status: ContributionStatus): Promise<StaffAssociationContributionRecord[]> {
    return contributionsCRUD.getByIndex('status', status);
  },

  /**
   * Get pending contributions
   */
  async getPending(): Promise<StaffAssociationContributionRecord[]> {
    return this.getByStatus('pending');
  },

  /**
   * Get overdue contributions
   */
  async getOverdue(): Promise<StaffAssociationContributionRecord[]> {
    return this.getByStatus('overdue');
  },
};

// ========== STAFF WELFARE REQUESTS ==========

const welfareRequestsCRUD = createCRUDService<StaffWelfareRequestRecord>('staffWelfareRequests');

export const welfareRequestDB = {
  ...welfareRequestsCRUD,

  /**
   * Generate unique request number (WFR-YYYY-####)
   */
  async generateRequestNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode(`WFR-${year}`, all.length + 1, false, 4);
  },

  /**
   * Get requests by member
   */
  async getByMember(memberId: number): Promise<StaffWelfareRequestRecord[]> {
    return welfareRequestsCRUD.getByIndex('memberId', memberId);
  },

  /**
   * Get requests by type
   */
  async getByType(requestType: string): Promise<StaffWelfareRequestRecord[]> {
    return welfareRequestsCRUD.getByIndex('requestType', requestType);
  },

  /**
   * Get requests by status
   */
  async getByStatus(status: WelfareRequestStatus): Promise<StaffWelfareRequestRecord[]> {
    return welfareRequestsCRUD.getByIndex('status', status);
  },

  /**
   * Get pending requests
   */
  async getPending(): Promise<StaffWelfareRequestRecord[]> {
    return this.getByStatus('pending');
  },

  /**
   * Get under review requests
   */
  async getUnderReview(): Promise<StaffWelfareRequestRecord[]> {
    return this.getByStatus('under_review');
  },

  /**
   * Get approved requests
   */
  async getApproved(): Promise<StaffWelfareRequestRecord[]> {
    return this.getByStatus('approved');
  },
};

// ========== STAFF WELFARE PAYMENTS ==========

const welfarePaymentsCRUD = createCRUDService<StaffWelfarePaymentRecord>('staffWelfarePayments');

export const welfarePaymentDB = {
  ...welfarePaymentsCRUD,

  /**
   * Generate unique payment number (WFP-YYYY-####)
   */
  async generatePaymentNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode(`WFP-${year}`, all.length + 1, false, 4);
  },

  /**
   * Get payments by member
   */
  async getByMember(memberId: number): Promise<StaffWelfarePaymentRecord[]> {
    return welfarePaymentsCRUD.getByIndex('memberId', memberId);
  },

  /**
   * Get payments by request
   */
  async getByRequest(requestId: number): Promise<StaffWelfarePaymentRecord[]> {
    return welfarePaymentsCRUD.getByIndex('requestId', requestId);
  },

  /**
   * Get payments by status
   */
  async getByStatus(status: WelfarePaymentStatus): Promise<StaffWelfarePaymentRecord[]> {
    return welfarePaymentsCRUD.getByIndex('status', status);
  },

  /**
   * Get pending payments
   */
  async getPending(): Promise<StaffWelfarePaymentRecord[]> {
    return this.getByStatus('pending');
  },
};

// ========== LEGACY BACKWARD COMPATIBILITY ==========

/**
 * Backward compatibility aliases for staff association services
 * Maps old naming conventions with "staff" prefix to new ones
 */
export const staffAssociationMemberDB = associationMemberDB;
export const staffAssociationContributionDB = associationContributionDB;
export const staffWelfareRequestDB = welfareRequestDB;
export const staffWelfarePaymentDB = welfarePaymentDB;

// ========== MAIN EXPORT ==========

export const staffAssociationService = {
  positions: associationPositionDB,
  members: associationMemberDB,
  meetings: associationMeetingDB,
  activities: associationActivityDB,
  contributions: associationContributionDB,
  welfareRequests: welfareRequestDB,
  welfarePayments: welfarePaymentDB,
};

export default staffAssociationService;
