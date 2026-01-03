/**
 * Travel Management Module Types
 *
 * Type definitions for travel management entities:
 * - Travel Requests
 * - Travel Approvals
 * - DSA Rates
 * - DSA Payments
 * - Mahram Travel
 * - Work Related Injuries
 */

import type { BaseRecord } from '../db/base';

// ========== TRAVEL REQUESTS ==========

export interface TravelRequestRecord extends BaseRecord {
  requestNumber: string;
  employeeId: number;
  projectId?: number;
  purpose: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  travelMode: string;
  estimatedCost?: number;
  currency?: string;
  numberOfDays?: number;
  accommodationType?: string;
  vehicleRequired?: boolean;
  securityClearance?: boolean;
  status: string;
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  completionDate?: string;
  notes?: string;
  [key: string]: unknown;
}

export const TRAVEL_MODE = {
  ROAD: 'road',
  AIR: 'air',
  MIXED: 'mixed',
} as const;

export type TravelMode = (typeof TRAVEL_MODE)[keyof typeof TRAVEL_MODE];

export const TRAVEL_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type TravelStatus = (typeof TRAVEL_STATUS)[keyof typeof TRAVEL_STATUS];

// ========== TRAVEL APPROVALS ==========

export interface TravelApprovalRecord extends BaseRecord {
  travelRequestId: number;
  approverId: number;
  approvalLevel: number;
  status: string;
  approvalDate?: string;
  comments?: string;
  [key: string]: unknown;
}

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type ApprovalStatus =
  (typeof APPROVAL_STATUS)[keyof typeof APPROVAL_STATUS];

// ========== DSA RATES ==========

export interface DSARateRecord extends BaseRecord {
  location: string;
  locationType: string;
  province?: string;
  country?: string;
  dailyRate: number;
  accommodationRate?: number;
  mealsRate?: number;
  incidentalsRate?: number;
  currency: string;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  notes?: string;
  [key: string]: unknown;
}

export const DSA_LOCATION_TYPE = {
  DOMESTIC: 'domestic',
  INTERNATIONAL: 'international',
} as const;

export type DSALocationType =
  (typeof DSA_LOCATION_TYPE)[keyof typeof DSA_LOCATION_TYPE];

// ========== DSA PAYMENTS ==========

export interface DSAPaymentRecord extends BaseRecord {
  paymentNumber: string;
  travelRequestId: number;
  employeeId: number;
  numberOfDays: number;
  dailyRate: number;
  accommodationAmount?: number;
  mealsAmount?: number;
  transportAmount?: number;
  otherExpenses?: number;
  totalAmount: number;
  advanceAmount?: number;
  settlementAmount?: number;
  currency: string;
  status: string;
  paymentDate?: string;
  paymentMethod?: string;
  receiptNumber?: string;
  notes?: string;
  [key: string]: unknown;
}

export const DSA_PAYMENT_STATUS = {
  PENDING: 'pending',
  ADVANCE_PAID: 'advance_paid',
  SETTLED: 'settled',
  CANCELLED: 'cancelled',
} as const;

export type DSAPaymentStatus =
  (typeof DSA_PAYMENT_STATUS)[keyof typeof DSA_PAYMENT_STATUS];

// ========== MAHRAM TRAVEL ==========

export interface MahramTravelRecord extends BaseRecord {
  travelRequestId: number;
  employeeId: number;
  mahramName: string;
  relationship: string;
  idNumber?: string;
  phoneNumber?: string;
  accommodationAllowance?: number;
  dsaAmount?: number;
  transportAmount?: number;
  totalAmount?: number;
  currency?: string;
  verificationStatus: string;
  verifiedBy?: string;
  verificationDate?: string;
  notes?: string;
  [key: string]: unknown;
}

export const MAHRAM_RELATIONSHIP = {
  HUSBAND: 'husband',
  FATHER: 'father',
  BROTHER: 'brother',
  SON: 'son',
  UNCLE: 'uncle',
  NEPHEW: 'nephew',
} as const;

export type MahramRelationship =
  (typeof MAHRAM_RELATIONSHIP)[keyof typeof MAHRAM_RELATIONSHIP];

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

export type VerificationStatus =
  (typeof VERIFICATION_STATUS)[keyof typeof VERIFICATION_STATUS];

// ========== WORK RELATED INJURIES ==========

export interface WorkRelatedInjuryRecord extends BaseRecord {
  incidentNumber: string;
  employeeId: number;
  incidentDate: string;
  incidentTime?: string;
  incidentLocation: string;
  incidentDescription: string;
  injuryType: string;
  injuryDescription?: string;
  bodyPartAffected?: string;
  treatmentReceived?: string;
  hospitalName?: string;
  doctorName?: string;
  medicalCertificate?: string;
  witnessNames?: string;
  reportedDate: string;
  reportedBy?: string;
  investigationFindings?: string;
  preventiveMeasures?: string;
  claimAmount?: number;
  approvedAmount?: number;
  currency?: string;
  status: string;
  approvedBy?: string;
  approvalDate?: string;
  settlementDate?: string;
  notes?: string;
  [key: string]: unknown;
}

export const INCIDENT_LOCATION = {
  OFFICE: 'office',
  TRAVEL: 'travel',
  FIELD: 'field',
  REMOTE: 'remote',
} as const;

export type IncidentLocation =
  (typeof INCIDENT_LOCATION)[keyof typeof INCIDENT_LOCATION];

export const INJURY_STATUS = {
  REPORTED: 'reported',
  INVESTIGATING: 'investigating',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SETTLED: 'settled',
  CLOSED: 'closed',
} as const;

export type InjuryStatus = (typeof INJURY_STATUS)[keyof typeof INJURY_STATUS];
