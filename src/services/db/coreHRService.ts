/**
 * Core HR Module Service
 *
 * Database services for core HR entities:
 * - Employees
 * - Departments
 * - Positions
 * - Offices
 * - Grades
 * - Employee Types
 * - Work Schedules
 * - Document Types
 * - Template Documents
 * - Users, Roles, Permissions
 */

import { createCRUDService } from './core/crud';
import { generateFormattedCode } from './core/utils';
import type {
  EmployeeRecord,
  EmployeePositionHistoryRecord,
  DepartmentRecord,
  PositionRecord,
  OfficeRecord,
  GradeRecord,
  EmployeeTypeRecord,
  WorkScheduleRecord,
  DocumentTypeRecord,
  TemplateDocumentRecord,
  UserRecord,
  RoleRecord,
  PermissionRecord,
  RolePermissionRecord,
  EmployeeStatus,
} from '../../types/modules/coreHR';

// ========== EMPLOYEES ==========

const employeesCRUD = createCRUDService<EmployeeRecord>('employees');

export const employeeDB = {
  ...employeesCRUD,

  /**
   * Generate unique employee ID (EMP-####)
   */
  async generateEmployeeId(): Promise<string> {
    const all = await this.getAll();
    return generateFormattedCode('EMP', all.length + 1, false, 4);
  },

  /**
   * Get employee by employee ID string
   */
  async getByEmployeeId(employeeId: string): Promise<EmployeeRecord | undefined> {
    const results = await employeesCRUD.getByIndex('employeeId', employeeId);
    return results[0];
  },

  /**
   * Get employee by email
   */
  async getByEmail(email: string): Promise<EmployeeRecord | undefined> {
    const results = await employeesCRUD.getByIndex('email', email);
    return results[0];
  },

  /**
   * Get employees by department
   */
  async getByDepartment(department: string): Promise<EmployeeRecord[]> {
    return employeesCRUD.getByIndex('department', department);
  },

  /**
   * Get employees by status
   */
  async getByStatus(status: EmployeeStatus): Promise<EmployeeRecord[]> {
    return employeesCRUD.getByIndex('status', status);
  },

  /**
   * Get active employees
   */
  async getActive(): Promise<EmployeeRecord[]> {
    return this.getByStatus('active');
  },
};

// ========== EMPLOYEE POSITION HISTORY ==========

const employeePositionHistoryCRUD = createCRUDService<EmployeePositionHistoryRecord>('employeePositionHistory');

export const employeePositionHistoryDB = {
  ...employeePositionHistoryCRUD,

  /**
   * Get position history by employee ID
   */
  async getByEmployee(employeeId: number): Promise<EmployeePositionHistoryRecord[]> {
    return employeePositionHistoryCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get position history by employee ID (alias for getByEmployee)
   */
  async getByEmployeeId(employeeId: number): Promise<EmployeePositionHistoryRecord[]> {
    return this.getByEmployee(employeeId);
  },

  /**
   * Get current position for employee
   */
  async getCurrentPosition(employeeId: number): Promise<EmployeePositionHistoryRecord | undefined> {
    const history = await this.getByEmployee(employeeId);
    return history.find(h => h.isCurrent);
  },
};

// ========== DEPARTMENTS ==========

const departmentsCRUD = createCRUDService<DepartmentRecord>('departments');

export const departmentDB = {
  ...departmentsCRUD,

  /**
   * Get department by name
   */
  async getByName(name: string): Promise<DepartmentRecord | undefined> {
    const results = await departmentsCRUD.getByIndex('name', name);
    return results[0];
  },

  /**
   * Get active departments
   */
  async getActive(): Promise<DepartmentRecord[]> {
    const all = await this.getAll();
    return all.filter(d => d.isActive);
  },
};

// ========== POSITIONS ==========

const positionsCRUD = createCRUDService<PositionRecord>('positions');

export const positionDB = {
  ...positionsCRUD,

  /**
   * Get position by title
   */
  async getByTitle(title: string): Promise<PositionRecord | undefined> {
    const results = await positionsCRUD.getByIndex('title', title);
    return results[0];
  },

  /**
   * Get positions by department
   */
  async getByDepartment(department: string): Promise<PositionRecord[]> {
    return positionsCRUD.getByIndex('department', department);
  },
};

// ========== OFFICES ==========

const officesCRUD = createCRUDService<OfficeRecord>('offices');

export const officeDB = {
  ...officesCRUD,

  /**
   * Get office by name
   */
  async getByName(name: string): Promise<OfficeRecord | undefined> {
    const results = await officesCRUD.getByIndex('name', name);
    return results[0];
  },

  /**
   * Get active offices
   */
  async getActive(): Promise<OfficeRecord[]> {
    const all = await this.getAll();
    return all.filter(o => o.isActive);
  },
};

// ========== GRADES ==========

const gradesCRUD = createCRUDService<GradeRecord>('grades');

export const gradeDB = {
  ...gradesCRUD,

  /**
   * Get grade by name
   */
  async getByName(name: string): Promise<GradeRecord | undefined> {
    const results = await gradesCRUD.getByIndex('name', name);
    return results[0];
  },
};

// ========== EMPLOYEE TYPES ==========

const employeeTypesCRUD = createCRUDService<EmployeeTypeRecord>('employeeTypes');

export const employeeTypeDB = {
  ...employeeTypesCRUD,

  /**
   * Get employee type by name
   */
  async getByName(name: string): Promise<EmployeeTypeRecord | undefined> {
    const results = await employeeTypesCRUD.getByIndex('name', name);
    return results[0];
  },
};

// ========== WORK SCHEDULES ==========

const workSchedulesCRUD = createCRUDService<WorkScheduleRecord>('workSchedules');

export const workScheduleDB = {
  ...workSchedulesCRUD,

  /**
   * Get work schedule by name
   */
  async getByName(name: string): Promise<WorkScheduleRecord | undefined> {
    const results = await workSchedulesCRUD.getByIndex('name', name);
    return results[0];
  },
};

// ========== DOCUMENT TYPES ==========

const documentTypesCRUD = createCRUDService<DocumentTypeRecord>('documentTypes');

export const documentTypeDB = {
  ...documentTypesCRUD,

  /**
   * Get document type by name
   */
  async getByName(name: string): Promise<DocumentTypeRecord | undefined> {
    const results = await documentTypesCRUD.getByIndex('name', name);
    return results[0];
  },
};

// ========== TEMPLATE DOCUMENTS ==========

const templateDocumentsCRUD = createCRUDService<TemplateDocumentRecord>('templateDocuments');

export const templateDocumentDB = {
  ...templateDocumentsCRUD,

  /**
   * Get template documents by category
   */
  async getByCategory(category: string): Promise<TemplateDocumentRecord[]> {
    return templateDocumentsCRUD.getByIndex('category', category);
  },
};

// ========== USERS ==========

const usersCRUD = createCRUDService<UserRecord>('users');

export const userDB = {
  ...usersCRUD,

  /**
   * Get user by email
   */
  async getByEmail(email: string): Promise<UserRecord | undefined> {
    const results = await usersCRUD.getByIndex('email', email);
    return results[0];
  },

  /**
   * Get user by username
   */
  async getByUsername(username: string): Promise<UserRecord | undefined> {
    const results = await usersCRUD.getByIndex('username', username);
    return results[0];
  },

  /**
   * Get users by role
   */
  async getByRole(roleId: number): Promise<UserRecord[]> {
    return usersCRUD.getByIndex('roleId', roleId);
  },

  /**
   * Get active users
   */
  async getActive(): Promise<UserRecord[]> {
    return usersCRUD.getByIndex('status', 'active');
  },
};

// ========== ROLES ==========

const rolesCRUD = createCRUDService<RoleRecord>('roles');

export const roleDB = {
  ...rolesCRUD,

  /**
   * Get role by name
   */
  async getByName(name: string): Promise<RoleRecord | undefined> {
    const results = await rolesCRUD.getByIndex('name', name);
    return results[0];
  },
};

// ========== PERMISSIONS ==========

const permissionsCRUD = createCRUDService<PermissionRecord>('permissions');

export const permissionDB = {
  ...permissionsCRUD,

  /**
   * Get permission by name
   */
  async getByName(name: string): Promise<PermissionRecord | undefined> {
    const results = await permissionsCRUD.getByIndex('name', name);
    return results[0];
  },

  /**
   * Get permissions by module
   */
  async getByModule(module: string): Promise<PermissionRecord[]> {
    return permissionsCRUD.getByIndex('module', module);
  },
};

// ========== ROLE PERMISSIONS ==========

const rolePermissionsCRUD = createCRUDService<RolePermissionRecord>('rolePermissions');

export const rolePermissionDB = {
  ...rolePermissionsCRUD,

  /**
   * Get permissions for a role
   */
  async getByRole(roleId: number): Promise<RolePermissionRecord[]> {
    return rolePermissionsCRUD.getByIndex('roleId', roleId);
  },

  /**
   * Check if role has permission
   */
  async hasPermission(roleId: number, permissionId: number): Promise<boolean> {
    const results = await this.getByRole(roleId);
    return results.some(rp => rp.permissionId === permissionId);
  },

  /**
   * Assign permission to role
   */
  async assignPermission(roleId: number, permissionId: number): Promise<RolePermissionRecord> {
    const existing = await this.hasPermission(roleId, permissionId);
    if (existing) {
      const records = await this.getByRole(roleId);
      const record = records.find(rp => rp.permissionId === permissionId);
      if (record) return record;
    }
    return this.create({ roleId, permissionId });
  },

  /**
   * Remove permission from role
   */
  async removePermission(roleId: number, permissionId: number): Promise<void> {
    const records = await this.getByRole(roleId);
    const record = records.find(rp => rp.permissionId === permissionId);
    if (record) {
      await this.delete(record.id);
    }
  },
};

// ========== SEED DEFAULTS ==========

/**
 * Seed default data for core HR entities
 */
export async function seedCoreHRDefaults(): Promise<void> {
  // Seed default departments if none exist
  const existingDepts = await departmentDB.getAll();
  if (existingDepts.length === 0) {
    const defaultDepartments = [
      { name: 'Human Resources', code: 'HR', description: 'Human Resources Department', isActive: true },
      { name: 'Finance', code: 'FIN', description: 'Finance Department', isActive: true },
      { name: 'Operations', code: 'OPS', description: 'Operations Department', isActive: true },
      { name: 'IT', code: 'IT', description: 'Information Technology Department', isActive: true },
      { name: 'Administration', code: 'ADMIN', description: 'Administration Department', isActive: true },
    ];
    for (const dept of defaultDepartments) {
      await departmentDB.create(dept);
    }
  }

  // Seed default offices if none exist
  const existingOffices = await officeDB.getAll();
  if (existingOffices.length === 0) {
    const defaultOffices = [
      { name: 'Head Office', code: 'HQ', type: 'headquarters', isActive: true },
      { name: 'Regional Office', code: 'REG', type: 'regional', isActive: true },
    ];
    for (const office of defaultOffices) {
      await officeDB.create(office);
    }
  }

  // Seed default grades if none exist
  const existingGrades = await gradeDB.getAll();
  if (existingGrades.length === 0) {
    const defaultGrades = [
      { name: 'Grade 1', level: 1, description: 'Entry Level' },
      { name: 'Grade 2', level: 2, description: 'Junior Level' },
      { name: 'Grade 3', level: 3, description: 'Mid Level' },
      { name: 'Grade 4', level: 4, description: 'Senior Level' },
      { name: 'Grade 5', level: 5, description: 'Management Level' },
    ];
    for (const grade of defaultGrades) {
      await gradeDB.create(grade);
    }
  }

  // Seed default employee types if none exist
  const existingTypes = await employeeTypeDB.getAll();
  if (existingTypes.length === 0) {
    const defaultTypes = [
      { name: 'Core Staff', description: 'Full-time core employees' },
      { name: 'Project Staff', description: 'Project-based employees' },
      { name: 'Consultant', description: 'External consultants' },
      { name: 'Intern', description: 'Internship positions' },
    ];
    for (const type of defaultTypes) {
      await employeeTypeDB.create(type);
    }
  }

  // Seed default roles if none exist
  const existingRoles = await roleDB.getAll();
  if (existingRoles.length === 0) {
    const defaultRoles = [
      { name: 'Administrator' },
      { name: 'HR Manager' },
      { name: 'Department Manager' },
      { name: 'Employee' },
    ];
    for (const role of defaultRoles) {
      await roleDB.create(role);
    }
  }
}

/**
 * Seed all default data
 * Combines all module seed functions
 */
export async function seedAllDefaults(): Promise<void> {
  await seedCoreHRDefaults();
  // Other module seed functions can be called here
}
