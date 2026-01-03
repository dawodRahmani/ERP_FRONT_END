/**
 * Travel Management Module Service
 *
 * Database services for travel management entities:
 * - Travel Requests
 * - Travel Approvals
 * - DSA Rates
 * - DSA Payments
 * - Mahram Travel
 * - Work Related Injuries
 */

import { createCRUDService } from './core/crud';
import { generateFormattedCode } from './core/utils';
import type {
  TravelRequestRecord,
  TravelApprovalRecord,
  DSARateRecord,
  DSAPaymentRecord,
  MahramTravelRecord,
  WorkRelatedInjuryRecord,
  TravelStatus,
  ApprovalStatus,
  DSAPaymentStatus,
  VerificationStatus,
  InjuryStatus,
} from '../../types/modules/travel';

// ========== TRAVEL REQUESTS ==========

const travelRequestsCRUD = createCRUDService<TravelRequestRecord>('travelRequests');

export const travelRequestDB = {
  ...travelRequestsCRUD,

  /**
   * Generate unique request number (TRV-YYYY-####)
   */
  async generateRequestNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode(`TRV-${year}`, all.length + 1, false, 4);
  },

  /**
   * Get request by request number
   */
  async getByRequestNumber(requestNumber: string): Promise<TravelRequestRecord | undefined> {
    const results = await travelRequestsCRUD.getByIndex('requestNumber', requestNumber);
    return results[0];
  },

  /**
   * Get requests by employee
   */
  async getByEmployee(employeeId: number): Promise<TravelRequestRecord[]> {
    return travelRequestsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get requests by project
   */
  async getByProject(projectId: number): Promise<TravelRequestRecord[]> {
    return travelRequestsCRUD.getByIndex('projectId', projectId);
  },

  /**
   * Get requests by status
   */
  async getByStatus(status: TravelStatus): Promise<TravelRequestRecord[]> {
    return travelRequestsCRUD.getByIndex('status', status);
  },

  /**
   * Get pending requests
   */
  async getPending(): Promise<TravelRequestRecord[]> {
    return this.getByStatus('pending');
  },

  /**
   * Get approved requests
   */
  async getApproved(): Promise<TravelRequestRecord[]> {
    return this.getByStatus('approved');
  },

  /**
   * Get in-progress travel
   */
  async getInProgress(): Promise<TravelRequestRecord[]> {
    return this.getByStatus('in_progress');
  },
};

// ========== TRAVEL APPROVALS ==========

const travelApprovalsCRUD = createCRUDService<TravelApprovalRecord>('travelApprovals');

export const travelApprovalDB = {
  ...travelApprovalsCRUD,

  /**
   * Get approvals by travel request
   */
  async getByTravelRequest(travelRequestId: number): Promise<TravelApprovalRecord[]> {
    return travelApprovalsCRUD.getByIndex('travelRequestId', travelRequestId);
  },

  /**
   * Get approvals by approver
   */
  async getByApprover(approverId: number): Promise<TravelApprovalRecord[]> {
    return travelApprovalsCRUD.getByIndex('approverId', approverId);
  },

  /**
   * Get approvals by status
   */
  async getByStatus(status: ApprovalStatus): Promise<TravelApprovalRecord[]> {
    return travelApprovalsCRUD.getByIndex('status', status);
  },

  /**
   * Get pending approvals for approver
   */
  async getPendingForApprover(approverId: number): Promise<TravelApprovalRecord[]> {
    const approvals = await this.getByApprover(approverId);
    return approvals.filter((a) => a.status === 'pending');
  },
};

// ========== DSA RATES ==========

const dsaRatesCRUD = createCRUDService<DSARateRecord>('dsaRates');

export const dsaRateDB = {
  ...dsaRatesCRUD,

  /**
   * Get rates by location
   */
  async getByLocation(location: string): Promise<DSARateRecord[]> {
    return dsaRatesCRUD.getByIndex('location', location);
  },

  /**
   * Get rates by location type
   */
  async getByLocationType(locationType: string): Promise<DSARateRecord[]> {
    return dsaRatesCRUD.getByIndex('locationType', locationType);
  },

  /**
   * Get rates by province
   */
  async getByProvince(province: string): Promise<DSARateRecord[]> {
    return dsaRatesCRUD.getByIndex('province', province);
  },

  /**
   * Get active rates
   */
  async getActive(): Promise<DSARateRecord[]> {
    return dsaRatesCRUD.getByIndex('isActive', true);
  },

  /**
   * Get current rate for location
   */
  async getCurrentRate(location: string): Promise<DSARateRecord | undefined> {
    const rates = await this.getByLocation(location);
    return rates.find((r) => r.isActive);
  },
};

// ========== DSA PAYMENTS ==========

const dsaPaymentsCRUD = createCRUDService<DSAPaymentRecord>('dsaPayments');

export const dsaPaymentDB = {
  ...dsaPaymentsCRUD,

  /**
   * Generate unique payment number (DSA-YYYY-####)
   */
  async generatePaymentNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode(`DSA-${year}`, all.length + 1, false, 4);
  },

  /**
   * Get payment by payment number
   */
  async getByPaymentNumber(paymentNumber: string): Promise<DSAPaymentRecord | undefined> {
    const results = await dsaPaymentsCRUD.getByIndex('paymentNumber', paymentNumber);
    return results[0];
  },

  /**
   * Get payments by travel request
   */
  async getByTravelRequest(travelRequestId: number): Promise<DSAPaymentRecord[]> {
    return dsaPaymentsCRUD.getByIndex('travelRequestId', travelRequestId);
  },

  /**
   * Get payments by employee
   */
  async getByEmployee(employeeId: number): Promise<DSAPaymentRecord[]> {
    return dsaPaymentsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get payments by status
   */
  async getByStatus(status: DSAPaymentStatus): Promise<DSAPaymentRecord[]> {
    return dsaPaymentsCRUD.getByIndex('status', status);
  },

  /**
   * Get pending payments
   */
  async getPending(): Promise<DSAPaymentRecord[]> {
    return this.getByStatus('pending');
  },
};

// ========== MAHRAM TRAVEL ==========

const mahramTravelCRUD = createCRUDService<MahramTravelRecord>('mahramTravel');

export const mahramTravelDB = {
  ...mahramTravelCRUD,

  /**
   * Get by travel request
   */
  async getByTravelRequest(travelRequestId: number): Promise<MahramTravelRecord[]> {
    return mahramTravelCRUD.getByIndex('travelRequestId', travelRequestId);
  },

  /**
   * Get by employee
   */
  async getByEmployee(employeeId: number): Promise<MahramTravelRecord[]> {
    return mahramTravelCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get by verification status
   */
  async getByVerificationStatus(status: VerificationStatus): Promise<MahramTravelRecord[]> {
    return mahramTravelCRUD.getByIndex('verificationStatus', status);
  },

  /**
   * Get pending verification
   */
  async getPendingVerification(): Promise<MahramTravelRecord[]> {
    return this.getByVerificationStatus('pending');
  },
};

// ========== WORK RELATED INJURIES ==========

const workRelatedInjuriesCRUD = createCRUDService<WorkRelatedInjuryRecord>('workRelatedInjuries');

export const workRelatedInjuryDB = {
  ...workRelatedInjuriesCRUD,

  /**
   * Generate unique incident number (INJ-YYYY-####)
   */
  async generateIncidentNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode(`INJ-${year}`, all.length + 1, false, 4);
  },

  /**
   * Get injury by incident number
   */
  async getByIncidentNumber(incidentNumber: string): Promise<WorkRelatedInjuryRecord | undefined> {
    const results = await workRelatedInjuriesCRUD.getByIndex('incidentNumber', incidentNumber);
    return results[0];
  },

  /**
   * Get injuries by employee
   */
  async getByEmployee(employeeId: number): Promise<WorkRelatedInjuryRecord[]> {
    return workRelatedInjuriesCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get injuries by status
   */
  async getByStatus(status: InjuryStatus): Promise<WorkRelatedInjuryRecord[]> {
    return workRelatedInjuriesCRUD.getByIndex('status', status);
  },

  /**
   * Get reported injuries
   */
  async getReported(): Promise<WorkRelatedInjuryRecord[]> {
    return this.getByStatus('reported');
  },

  /**
   * Get pending approval
   */
  async getPendingApproval(): Promise<WorkRelatedInjuryRecord[]> {
    return this.getByStatus('pending_approval');
  },
};

// ========== MAIN EXPORT ==========

export const travelService = {
  travelRequests: travelRequestDB,
  travelApprovals: travelApprovalDB,
  dsaRates: dsaRateDB,
  dsaPayments: dsaPaymentDB,
  mahramTravel: mahramTravelDB,
  workRelatedInjuries: workRelatedInjuryDB,
};

export default travelService;
