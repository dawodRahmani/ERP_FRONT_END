/**
 * Database Store Registry
 *
 * Type definitions for all IndexedDB object stores in the VDO ERP database.
 * This file serves as the central type registry for the database schema.
 */

import type { BaseRecord } from './base';

// Program Module Types
import type {
  ProgramDonorRecord,
  ProgramProjectRecord,
  ProgramWorkPlanRecord,
  ProgramCertificateRecord,
  ProgramDocumentRecord,
  ProgramReportingRecord,
  ProgramBeneficiaryRecord,
  ProgramSafeguardingRecord,
} from "../modules/program";

// Compliance Types
import type {
  ComplianceProjectRecord,
  ComplianceDocumentRecord,
  ComplianceAmendmentRecord,
  ProposalRecord,
  DueDiligenceRecord,
  RegistrationRecord,
  MembershipRecord,
  CertificateRecord,
  BoardOfDirectorsRecord,
  PartnerRecord,
  DonorOutreachRecord,
  GovernmentOutreachRecord,
  BlacklistRecord,
} from "../modules/compliance";

// Audit Types
import type {
  AuditTypeRecord,
  AuditTypeRecordIndex,
  HACTAssessmentRecord,
  HACTAssessmentRecordIndex,
  DonorProjectAuditRecord,
  DonorProjectAuditRecordIndex,
  ExternalAuditRecord,
  ExternalAuditRecordIndex,
  ExternalAnnualAuditRecord,
  ExternalAnnualAuditRecordIndex,
  InternalAuditRecord,
  InternalAuditRecordIndex,
  InternalQuarterlyReportRecord,
  InternalQuarterlyReportRecordIndex,
  PartnerAuditRecord,
  PartnerAuditRecordIndex,
  CorrectiveActionRecord,
  CorrectiveActionRecordIndex,
} from "../modules/audit";

// Governance Types
import type {
  GovernanceBoardMemberRecord,
  GovernanceBoardMeetingRecord,
  GovernanceCorrespondenceRecord,
} from "../modules/governance";

// Recruitment Types
import type {
  RecruitmentDropdownRecord,
  RecruitmentDropdownRecordIndex,
} from "../modules/recruitment";

// ========== USER MANAGEMENT TYPES ==========

export interface UserRecord extends BaseRecord {
  username: string;
  email: string;
  passwordHash?: string;
  roleId?: number;
  employeeId?: number;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  [key: string]: unknown;
}

export interface RoleRecord extends BaseRecord {
  name: string;
  description?: string;
  isSystem?: boolean;
  [key: string]: unknown;
}

export interface PermissionRecord extends BaseRecord {
  name: string;
  module: string;
  action?: string;
  description?: string;
  [key: string]: unknown;
}

export interface RolePermissionRecord extends BaseRecord {
  roleId: number;
  permissionId: number;
  [key: string]: unknown;
}

// ========== TRACKING TYPES ==========

export interface InOutTrackingRecord extends BaseRecord {
  serialNumber: string;
  date: string;
  documentType: string;
  department?: string;
  description?: string;
  status: string;
  [key: string]: unknown;
}

export interface AccessTrackingRecord extends BaseRecord {
  year: number;
  quarter?: string;
  donor?: string;
  project?: string;
  location?: string;
  lineMinistry?: string;
  projectStatus?: string;
  [key: string]: unknown;
}

export interface DNRTrackingRecord extends BaseRecord {
  year: number;
  quarter?: string;
  donor?: string;
  project?: string;
  reportType?: string;
  status: string;
  dueDate?: string;
  [key: string]: unknown;
}

export interface MOUTrackingRecord extends BaseRecord {
  mouNumber: string;
  partner?: string;
  type?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  department?: string;
  [key: string]: unknown;
}

/**
 * VDO ERP Database Schema
 *
 * Defines all object stores and their indexes for type-safe database operations.
 */
export interface VDODatabase {
  // ========== USER MANAGEMENT STORES ==========

  users: {
    key: number;
    value: UserRecord;
    indexes: {
      email: string;
      username: string;
      roleId: number;
      status: string;
    };
  };

  roles: {
    key: number;
    value: RoleRecord;
    indexes: {
      name: string;
    };
  };

  permissions: {
    key: number;
    value: PermissionRecord;
    indexes: {
      name: string;
      module: string;
    };
  };

  rolePermissions: {
    key: number;
    value: RolePermissionRecord;
    indexes: {
      roleId: number;
      permissionId: number;
    };
  };

  // ========== TRACKING STORES ==========

  inOutTracking: {
    key: number;
    value: InOutTrackingRecord;
    indexes: {
      serialNumber: string;
      date: string;
      documentType: string;
      department: string;
      status: string;
      createdAt: string;
    };
  };

  accessTracking: {
    key: number;
    value: AccessTrackingRecord;
    indexes: {
      year: number;
      quarter: string;
      donor: string;
      project: string;
      location: string;
      lineMinistry: string;
      projectStatus: string;
      createdAt: string;
    };
  };

  dnrTracking: {
    key: number;
    value: DNRTrackingRecord;
    indexes: {
      year: number;
      quarter: string;
      donor: string;
      project: string;
      reportType: string;
      status: string;
      dueDate: string;
      createdAt: string;
    };
  };

  mouTracking: {
    key: number;
    value: MOUTrackingRecord;
    indexes: {
      mouNumber: string;
      partner: string;
      type: string;
      status: string;
      startDate: string;
      endDate: string;
      department: string;
      createdAt: string;
    };
  };

  programWorkPlans: {
    key: number;
    value: ProgramWorkPlanRecord;
    indexes: {
      projectId: number;
      thematicArea: string;
      focalPoint: string;
      location: string;
    };
  };

  // ========== COMPLIANCE STORES ==========

  complianceProjects: {
    key: number;
    value: ComplianceProjectRecord;
    indexes: {
      projectId: number;
      complianceType: string;
      status: string;
      riskLevel: string;
      dueDate: string;
    };
  };

  complianceDocuments: {
    key: number;
    value: ComplianceDocumentRecord;
    indexes: {
      projectId: number;
      complianceProjectId: number;
      documentType: string;
      status: string;
      expiryDate: string;
    };
  };

  complianceAmendments: {
    key: number;
    value: ComplianceAmendmentRecord;
    indexes: {
      projectId: number;
      complianceProjectId: number;
      amendmentType: string;
      status: string;
    };
  };

  proposals: {
    key: number;
    value: ProposalRecord;
    indexes: {
      donor: string;
      status: string;
      result: string;
      createdAt: string;
    };
  };

  dueDiligence: {
    key: number;
    value: DueDiligenceRecord;
    indexes: {
      donorName: string;
      status: string;
      createdAt: string;
    };
  };

  registrations: {
    key: number;
    value: RegistrationRecord;
    indexes: {
      organizationPlatform: string;
      status: string;
      expiryDate: string;
    };
  };

  memberships: {
    key: number;
    value: MembershipRecord;
    indexes: {
      organizationName: string;
      membershipType: string;
      status: string;
      expiryDate: string;
    };
  };

  certificates: {
    key: number;
    value: CertificateRecord;
    indexes: {
      certificateName: string;
      certificateNumber: string;
      status: string;
      expiryDate: string;
    };
  };

  boardOfDirectors: {
    key: number;
    value: BoardOfDirectorsRecord;
    indexes: {
      name: string;
      position: string;
      status: string;
    };
  };

  partners: {
    key: number;
    value: PartnerRecord;
    indexes: {
      partnerName: string;
      partnerType: string;
      status: string;
    };
  };

  donorOutreach: {
    key: number;
    value: DonorOutreachRecord;
    indexes: {
      donorName: string;
      outreachDate: string;
    };
  };

  governmentOutreach: {
    key: number;
    value: GovernmentOutreachRecord;
    indexes: {
      ministryName: string;
      outreachDate: string;
    };
  };

  blacklist: {
    key: number;
    value: BlacklistRecord;
    indexes: {
      entityName: string;
      entityType: string;
      status: string;
      blacklistDate: string;
    };
  };

  // ========== AUDIT MANAGEMENT STORES ==========

  auditTypes: {
    key: number;
    value: AuditTypeRecord;
    indexes: AuditTypeRecordIndex;
  };

  hactAssessments: {
    key: number;
    value: HACTAssessmentRecord;
    indexes: HACTAssessmentRecordIndex;
  };

  donorProjectAudits: {
    key: number;
    value: DonorProjectAuditRecord;
    indexes: DonorProjectAuditRecordIndex;
  };

  externalAudits: {
    key: number;
    value: ExternalAuditRecord;
    indexes: ExternalAuditRecordIndex;
  };

  externalAnnualAudits: {
    key: number;
    value: ExternalAnnualAuditRecord;
    indexes: ExternalAnnualAuditRecordIndex;
  };

  internalAudits: {
    key: number;
    value: InternalAuditRecord;
    indexes: InternalAuditRecordIndex;
  };

  internalQuarterlyReports: {
    key: number;
    value: InternalQuarterlyReportRecord;
    indexes: InternalQuarterlyReportRecordIndex;
  };

  partnerAudits: {
    key: number;
    value: PartnerAuditRecord;
    indexes: PartnerAuditRecordIndex;
  };

  auditCorrectiveActions: {
    key: number;
    value: CorrectiveActionRecord;
    indexes: CorrectiveActionRecordIndex;
  };

  // ========== PROGRAM MODULE STORES ==========

  programDonors: {
    key: number;
    value: ProgramDonorRecord;
    indexes: {
      donorName: string;
      donorType: string;
      status: string;
      country: string;
    };
  };

  programProjects: {
    key: number;
    value: ProgramProjectRecord;
    indexes: {
      projectCode: string;
      donorId: number;
      status: string;
      thematicArea: string;
      location: string;
      startDate: string;
      endDate: string;
    };
  };

  programCertificates: {
    key: number;
    value: ProgramCertificateRecord;
    indexes: {
      projectId: number;
      agency: string;
      documentType: string;
      year: number;
    };
  };

  programDocuments: {
    key: number;
    value: ProgramDocumentRecord;
    indexes: {
      projectId: number;
      documentType: string;
      uploadedBy: string;
      uploadDate: string;
    };
  };

  programReporting: {
    key: number;
    value: ProgramReportingRecord;
    indexes: {
      projectId: number;
      reportType: string;
      reportingFormat: string;
      status: string;
      dueDate: string;
      uploadedBy: string;
    };
  };

  programBeneficiaries: {
    key: number;
    value: ProgramBeneficiaryRecord;
    indexes: {
      projectId: number;
      beneficiaryType: string;
      serviceType: string;
      status: string;
      district: string;
      nidNo: string;
    };
  };

  programSafeguarding: {
    key: number;
    value: ProgramSafeguardingRecord;
    indexes: {
      projectId: number;
      activityType: string;
      frequency: string;
      status: string;
      dueDate: string;
    };
  };

  // ========== GOVERNANCE STORES ==========

  governanceBoardMembers: {
    key: number;
    value: GovernanceBoardMemberRecord;
    indexes: {
      name: string;
      position: string;
      status: string;
      roleInBoard: string;
    };
  };

  governanceBoardMeetings: {
    key: number;
    value: GovernanceBoardMeetingRecord;
    indexes: {
      meetingDate: string;
      year: number;
      meetingType: string;
    };
  };

  governanceCorrespondence: {
    key: number;
    value: GovernanceCorrespondenceRecord;
    indexes: {
      direction: string;
      date: string;
      status: string;
      priority: string;
    };
  };

  // ========== RECRUITMENT STORES ==========

  recruitmentDropdowns: {
    key: number;
    value: RecruitmentDropdownRecord;
    indexes: RecruitmentDropdownRecordIndex;
  };
}

/**
 * Store names as string literal union type
 */
export type StoreName = keyof VDODatabase;

/**
 * Get the value type for a specific store
 */
export type StoreValue<K extends StoreName> = VDODatabase[K]["value"];

/**
 * Get the key type for a specific store
 */
export type StoreKey<K extends StoreName> = VDODatabase[K]["key"];

/**
 * Get the index names for a specific store
 */
export type StoreIndexes<K extends StoreName> = VDODatabase[K] extends {
  indexes: infer I;
}
  ? keyof I
  : never;
