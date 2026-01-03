/**
 * Employee Administration Module Service
 *
 * Comprehensive employee administration system covering:
 * - Emergency Contacts
 * - Education Records
 * - Work Experience
 * - Skills & Certifications
 * - Medical Information
 * - Personnel Files & Documents
 * - Onboarding Management
 * - Policy Acknowledgements
 * - Interim Hiring
 * - Mahram Registration
 * - Employee Status History
 */

import { createCRUDService } from './core/crud';
import { generateFormattedCode } from './core/utils';
import { getDB } from './core/connection';
import type {
  EmergencyContactRecord,
  EmployeeEducationRecord,
  EmployeeExperienceRecord,
  EmployeeSkillRecord,
  EmployeeMedicalRecord,
  PersonnelFileRecord,
  PersonnelDocumentRecord,
  OnboardingChecklistRecord,
  OnboardingItemRecord,
  PolicyAcknowledgementRecord,
  InterimHiringRequestRecord,
  InterimHiringApprovalRecord,
  MahramRegistrationRecord,
  EmployeeStatusHistoryRecord,
} from '../../types/modules/employeeAdmin';
import type {
  OrientationChecklistRecord,
  OrientationItemRecord,
} from '../../types/modules/legacy';

// ========== EMERGENCY CONTACTS ==========

const emergencyContactsCRUD = createCRUDService<EmergencyContactRecord>('emergencyContacts');

export const emergencyContactsDB = {
  ...emergencyContactsCRUD,

  /**
   * Get emergency contacts by employee ID
   */
  async getByEmployee(employeeId: number): Promise<EmergencyContactRecord[]> {
    return emergencyContactsCRUD.getByIndex('employeeId', employeeId);
  },
};

// ========== EMPLOYEE EDUCATION ==========

const employeeEducationCRUD = createCRUDService<EmployeeEducationRecord>('employeeEducation');

export const employeeEducationDB = {
  ...employeeEducationCRUD,

  /**
   * Get education records by employee ID
   */
  async getByEmployee(employeeId: number): Promise<EmployeeEducationRecord[]> {
    return employeeEducationCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Verify an education record
   */
  async verify(id: number): Promise<EmployeeEducationRecord> {
    return this.update(id, {
      isVerified: true,
      verifiedAt: new Date().toISOString(),
    });
  },
};

// ========== EMPLOYEE EXPERIENCE ==========

const employeeExperienceCRUD = createCRUDService<EmployeeExperienceRecord>('employeeExperience');

export const employeeExperienceDB = {
  ...employeeExperienceCRUD,

  /**
   * Get experience records by employee ID
   */
  async getByEmployee(employeeId: number): Promise<EmployeeExperienceRecord[]> {
    return employeeExperienceCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Verify an experience record
   */
  async verify(id: number): Promise<EmployeeExperienceRecord> {
    return this.update(id, {
      isVerified: true,
      verifiedAt: new Date().toISOString(),
    });
  },
};

// ========== EMPLOYEE SKILLS ==========

const employeeSkillsCRUD = createCRUDService<EmployeeSkillRecord>('employeeSkills');

export const employeeSkillsDB = {
  ...employeeSkillsCRUD,

  /**
   * Get skills by employee ID
   */
  async getByEmployee(employeeId: number): Promise<EmployeeSkillRecord[]> {
    return employeeSkillsCRUD.getByIndex('employeeId', employeeId);
  },
};

// ========== EMPLOYEE MEDICAL ==========

const employeeMedicalCRUD = createCRUDService<EmployeeMedicalRecord>('employeeMedical');

export const employeeMedicalDB = {
  ...employeeMedicalCRUD,

  /**
   * Get medical record by employee ID (unique per employee)
   */
  async getByEmployee(employeeId: number): Promise<EmployeeMedicalRecord | undefined> {
    const db = await getDB();
    return db.getFromIndex('employeeMedical', 'employeeId', employeeId);
  },
};

// ========== PERSONNEL FILES ==========

const personnelFilesCRUD = createCRUDService<PersonnelFileRecord>('personnelFiles');

export const personnelFilesDB = {
  ...personnelFilesCRUD,

  /**
   * Get personnel file by employee ID (unique per employee)
   */
  async getByEmployee(employeeId: number): Promise<PersonnelFileRecord | undefined> {
    const db = await getDB();
    return db.getFromIndex('personnelFiles', 'employeeId', employeeId);
  },
};

// ========== PERSONNEL DOCUMENTS ==========

const personnelDocumentsCRUD = createCRUDService<PersonnelDocumentRecord>('personnelDocuments');

export const personnelDocumentsDB = {
  ...personnelDocumentsCRUD,

  /**
   * Get documents by personnel file ID
   */
  async getByPersonnelFile(personnelFileId: number): Promise<PersonnelDocumentRecord[]> {
    return personnelDocumentsCRUD.getByIndex('personnelFileId', personnelFileId);
  },

  /**
   * Get documents by section
   */
  async getBySection(section: string): Promise<PersonnelDocumentRecord[]> {
    return personnelDocumentsCRUD.getByIndex('section', section);
  },
};

// ========== ONBOARDING CHECKLISTS ==========

const onboardingChecklistsCRUD = createCRUDService<OnboardingChecklistRecord>('onboardingChecklists');

export const onboardingChecklistsDB = {
  ...onboardingChecklistsCRUD,

  /**
   * Get onboarding checklist by employee ID (unique per employee)
   */
  async getByEmployee(employeeId: number): Promise<OnboardingChecklistRecord | undefined> {
    const db = await getDB();
    return db.getFromIndex('onboardingChecklists', 'employeeId', employeeId);
  },

  /**
   * Get checklists by status
   */
  async getByStatus(status: string): Promise<OnboardingChecklistRecord[]> {
    return onboardingChecklistsCRUD.getByIndex('status', status);
  },

  /**
   * Complete an onboarding checklist
   */
  async complete(id: number): Promise<OnboardingChecklistRecord> {
    return this.update(id, {
      status: 'completed',
      completedDate: new Date().toISOString(),
      completionPercentage: 100,
    });
  },
};

// ========== ONBOARDING ITEMS ==========

const onboardingItemsCRUD = createCRUDService<OnboardingItemRecord>('onboardingItems');

export const onboardingItemsDB = {
  ...onboardingItemsCRUD,

  /**
   * Get items by checklist ID
   */
  async getByChecklist(checklistId: number): Promise<OnboardingItemRecord[]> {
    return onboardingItemsCRUD.getByIndex('checklistId', checklistId);
  },

  /**
   * Get items by section
   */
  async getBySection(section: string): Promise<OnboardingItemRecord[]> {
    return onboardingItemsCRUD.getByIndex('section', section);
  },

  /**
   * Complete an onboarding item
   */
  async complete(id: number): Promise<OnboardingItemRecord> {
    return this.update(id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
    });
  },
};

// ========== POLICY ACKNOWLEDGEMENTS ==========

const policyAcknowledgementsCRUD = createCRUDService<PolicyAcknowledgementRecord>('policyAcknowledgements');

export const policyAcknowledgementsDB = {
  ...policyAcknowledgementsCRUD,

  /**
   * Get acknowledgements by employee ID
   */
  async getByEmployee(employeeId: number): Promise<PolicyAcknowledgementRecord[]> {
    return policyAcknowledgementsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Record a policy acknowledgement
   */
  async acknowledge(
    employeeId: number,
    policyName: string,
    version: string
  ): Promise<PolicyAcknowledgementRecord> {
    return this.create({
      employeeId,
      policyName,
      version,
      acknowledgedDate: new Date().toISOString(),
    });
  },
};

// ========== INTERIM HIRING REQUESTS ==========

const interimHiringRequestsCRUD = createCRUDService<InterimHiringRequestRecord>('interimHiringRequests');

export const interimHiringRequestsDB = {
  ...interimHiringRequestsCRUD,

  /**
   * Generate unique request number (IHR-YYYY-####)
   */
  async generateRequestNumber(): Promise<string> {
    const all = await this.getAll();
    const year = new Date().getFullYear();
    return generateFormattedCode('IHR', all.length + 1, true, 4);
  },

  /**
   * Get requests by status
   */
  async getByStatus(status: string): Promise<InterimHiringRequestRecord[]> {
    return interimHiringRequestsCRUD.getByIndex('status', status);
  },

  /**
   * Get requests by department
   */
  async getByDepartment(department: string): Promise<InterimHiringRequestRecord[]> {
    return interimHiringRequestsCRUD.getByIndex('department', department);
  },
};

// ========== INTERIM HIRING APPROVALS ==========

const interimHiringApprovalsCRUD = createCRUDService<InterimHiringApprovalRecord>('interimHiringApprovals');

export const interimHiringApprovalsDB = {
  ...interimHiringApprovalsCRUD,

  /**
   * Get approvals by request ID
   */
  async getByRequest(requestId: number): Promise<InterimHiringApprovalRecord[]> {
    return interimHiringApprovalsCRUD.getByIndex('requestId', requestId);
  },

  /**
   * Approve a request
   */
  async approve(
    requestId: number,
    level: string,
    approvedBy: string,
    comments?: string
  ): Promise<InterimHiringApprovalRecord> {
    return this.create({
      requestId,
      level,
      status: 'approved',
      approvedBy,
      comments,
      approvalDate: new Date().toISOString(),
    });
  },

  /**
   * Reject a request
   */
  async reject(
    requestId: number,
    level: string,
    rejectedBy: string,
    reason: string
  ): Promise<InterimHiringApprovalRecord> {
    return this.create({
      requestId,
      level,
      status: 'rejected',
      approvedBy: rejectedBy,
      comments: reason,
      approvalDate: new Date().toISOString(),
    });
  },
};

// ========== MAHRAM REGISTRATIONS ==========

const mahramRegistrationsCRUD = createCRUDService<MahramRegistrationRecord>('mahramRegistrations');

export const mahramRegistrationsDB = {
  ...mahramRegistrationsCRUD,

  /**
   * Get mahram registrations by employee ID
   */
  async getByEmployee(employeeId: number): Promise<MahramRegistrationRecord[]> {
    return mahramRegistrationsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get active mahram registrations
   */
  async getActive(): Promise<MahramRegistrationRecord[]> {
    return mahramRegistrationsCRUD.getByIndex('status', 'active');
  },

  /**
   * Verify a mahram registration
   */
  async verify(id: number): Promise<MahramRegistrationRecord> {
    return this.update(id, {
      isVerified: true,
      verifiedAt: new Date().toISOString(),
    });
  },

  /**
   * Deactivate a mahram registration
   */
  async deactivate(id: number, reason: string): Promise<MahramRegistrationRecord> {
    return this.update(id, {
      status: 'inactive',
      deactivationReason: reason,
      deactivatedAt: new Date().toISOString(),
    });
  },
};

// ========== EMPLOYEE STATUS HISTORY ==========

const employeeStatusHistoryCRUD = createCRUDService<EmployeeStatusHistoryRecord>('employeeStatusHistory');

export const employeeStatusHistoryDB = {
  ...employeeStatusHistoryCRUD,

  /**
   * Get status history by employee ID (sorted by date, newest first)
   */
  async getByEmployee(employeeId: number): Promise<EmployeeStatusHistoryRecord[]> {
    const history = await employeeStatusHistoryCRUD.getByIndex('employeeId', employeeId);
    return history.sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());
  },

  /**
   * Record a status change
   */
  async record(
    employeeId: number,
    fromStatus: string,
    toStatus: string,
    changedBy: string,
    reason?: string
  ): Promise<EmployeeStatusHistoryRecord> {
    return this.create({
      employeeId,
      fromStatus,
      toStatus,
      changedBy,
      reason,
      changedAt: new Date().toISOString(),
    });
  },
};

// ========== LEGACY BACKWARD COMPATIBILITY ==========

/**
 * Legacy orientation checklists (backward compatibility)
 * Maps to orientationChecklists store
 */
const orientationChecklistsCRUD = createCRUDService<OrientationChecklistRecord>('orientationChecklists');

export const orientationChecklistDB = {
  ...orientationChecklistsCRUD,

  /**
   * Get checklist by employee ID
   */
  async getByEmployee(employeeId: number): Promise<OrientationChecklistRecord[]> {
    return orientationChecklistsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get checklists by status
   */
  async getByStatus(status: string): Promise<OrientationChecklistRecord[]> {
    return orientationChecklistsCRUD.getByIndex('status', status);
  },
};

/**
 * Legacy orientation items (backward compatibility)
 * Maps to orientationItems store
 */
const orientationItemsCRUD = createCRUDService<OrientationItemRecord>('orientationItems');

export const orientationItemDB = {
  ...orientationItemsCRUD,

  /**
   * Get items by checklist ID
   */
  async getByChecklist(checklistId: number): Promise<OrientationItemRecord[]> {
    return orientationItemsCRUD.getByIndex('checklistId', checklistId);
  },

  /**
   * Get items by status
   */
  async getByStatus(status: string): Promise<OrientationItemRecord[]> {
    return orientationItemsCRUD.getByIndex('status', status);
  },
};

// ========== INITIALIZATION ==========

/**
 * Initialize the Employee Admin module
 * This is a no-op since database initialization is handled by initDB()
 * but kept for backward compatibility
 */
export async function initEmployeeAdminDB(): Promise<void> {
  // Database is already initialized by initDB() in connection.ts
  // This function exists for backward compatibility
  return Promise.resolve();
}

// ========== MAIN EXPORT ==========

/**
 * Employee Administration Service - Main entry point
 */
export const employeeAdminService = {
  // Sub-services
  emergencyContacts: emergencyContactsDB,
  education: employeeEducationDB,
  experience: employeeExperienceDB,
  skills: employeeSkillsDB,
  medical: employeeMedicalDB,
  personnelFiles: personnelFilesDB,
  personnelDocuments: personnelDocumentsDB,
  onboarding: {
    checklists: onboardingChecklistsDB,
    items: onboardingItemsDB,
  },
  policyAcknowledgements: policyAcknowledgementsDB,
  interimHiring: {
    requests: interimHiringRequestsDB,
    approvals: interimHiringApprovalsDB,
  },
  mahram: mahramRegistrationsDB,
  statusHistory: employeeStatusHistoryDB,
};

export default employeeAdminService;
