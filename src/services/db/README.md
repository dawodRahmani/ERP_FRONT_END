# VDO ERP Database Layer

A comprehensive IndexedDB database system for the VDO ERP application, providing offline-first data management for HR, Recruitment, Payroll, and other enterprise modules.

## Overview

- **Database Name**: `vdo-erp-db`
- **Version**: 35
- **Library**: [idb](https://github.com/jakearchibald/idb) v8.0.3 (Promise-based IndexedDB wrapper)
- **Total Stores**: 80+
- **Architecture**: Modular TypeScript services with centralized connection management

## Directory Structure

```
src/services/db/
├── core/
│   ├── connection.ts      # Singleton database connection
│   ├── crud.ts            # Generic CRUD factory
│   ├── utils.ts           # Shared utility functions
│   └── stores/
│       ├── index.ts       # Store creator orchestrator
│       ├── hr.ts          # HR module stores
│       ├── recruitment.ts # Recruitment module stores (30+)
│       ├── payroll.ts     # Payroll module stores
│       ├── leave.ts       # Leave management stores
│       ├── performance.ts # Performance module stores
│       ├── training.ts    # Training module stores (14)
│       ├── disciplinary.ts# Disciplinary module stores
│       ├── exit.ts        # Exit/Separation stores (14)
│       └── tracking.ts    # Tracking module stores
├── indexedDB.ts           # Main database initialization
├── recruitmentService.ts  # 26 services, 30+ stores
├── trainingService.ts     # 14 stores
├── exitService.ts         # 14 stores
├── payrollService.ts      # 13 stores
├── leaveManagementService.ts # 12 stores
├── performanceService.ts  # 16 stores
├── employeeAdminService.ts# 14 stores
├── disciplinaryService.ts # 11 stores
├── inOutTrackingService.ts
├── programWorkPlanService.ts
├── mouTrackingService.ts
├── accessTrackingService.ts
└── dnrTrackingService.ts
```

## Type System

```
src/types/db/
├── base.ts       # BaseRecord, CRUDService<T>, CreateInput<T>, UpdateInput<T>
├── errors.ts     # Custom error classes (8 types)
├── constants.ts  # DB_CONFIG, centralized version
└── stores.ts     # VDODatabase schema (DBSchema interface)

src/types/modules/
├── recruitment.ts # 25+ enums, 30+ interfaces
├── training.ts    # 12 enums, 14 interfaces
├── exit.ts        # 13 enums, 14 interfaces
├── payroll.ts     # Payroll types
├── leave.ts       # Leave types
├── performance.ts # Performance types
├── disciplinary.ts# Disciplinary types
└── tracking.ts    # Tracking types
```

## Core Concepts

### 1. Singleton Connection

```typescript
import { getDB } from './core/connection';

const db = await getDB(); // Returns cached IDBPDatabase instance
```

### 2. Generic CRUD Factory

```typescript
import { createCRUDService } from './core/crud';

const employeeCRUD = createCRUDService<EmployeeRecord>('employees');
// Provides: create, getAll, getById, update, delete, getByIndex
```

### 3. BaseRecord Interface

All records extend BaseRecord:

```typescript
interface BaseRecord {
  id: number;
  createdAt: string;
  updatedAt: string;
}
```

### 4. Type-Safe Enums

Using `as const` for type inference:

```typescript
const RECRUITMENT_STATUS = {
  DRAFT: 'draft',
  ANNOUNCED: 'announced',
  COMPLETED: 'completed',
} as const;

type RecruitmentStatus = typeof RECRUITMENT_STATUS[keyof typeof RECRUITMENT_STATUS];
// = 'draft' | 'announced' | 'completed'
```

## Module Documentation

### Recruitment Module (30+ stores, 15-step workflow)

**Stores:**
- `recruitments` - Main recruitment records
- `termsOfReferences` - TOR documents
- `staffRequisitions` - SRF forms
- `vacancyAnnouncements` - Job postings
- `recruitmentCandidates` - Candidate profiles
- `candidateApplications` - Applications
- `candidateEducations` - Education records
- `candidateExperiences` - Work experience
- `recruitmentCommittees` - Hiring committees
- `committeeMembers` - Committee membership
- `coiDeclarations` - Conflict of interest
- `longlistings` / `longlistingCandidates` - Initial screening
- `shortlistings` / `shortlistingCandidates` - Detailed evaluation
- `writtenTests` / `writtenTestCandidates` - Testing phase
- `recruitmentInterviews` / `recruitmentInterviewCandidates` - Interview phase
- `recruitmentInterviewEvaluations` - Individual evaluations
- `recruitmentInterviewResults` - Aggregated results
- `recruitmentReports` - Final reports
- `offerLetters` - Job offers
- `sanctionClearances` - Compliance checks
- `backgroundChecks` - Background verification
- `employmentContracts` - Employment agreements
- `fileChecklists` - Document checklists
- `provinces` - Lookup data

**15-Step Workflow:**
1. TOR Development
2. Staff Requisition
3. Requisition Review
4. Vacancy Announcement
5. Application Receipt
6. Committee Formation
7. Longlisting
8. Shortlisting
9. Written Test
10. Interview
11. Recruitment Report
12. Conditional Offer
13. Sanction Clearance
14. Background Checks
15. Employment Contract

**Key Services:**
```typescript
import { recruitmentDB, applicationDB, interviewResultDB } from './recruitmentService';

// Create recruitment
const recruitment = await recruitmentDB.create({
  positionTitle: 'Software Engineer',
  department: 'IT',
});

// Advance through steps
await recruitmentDB.advanceStep(recruitment.id);

// Rank candidates
const ranked = await interviewResultDB.rankCandidates(interviewId);
```

### Training Module (14 stores)

**Stores:**
- `trainingTypes` - Training categories
- `trainingPrograms` - Program definitions
- `trainingNeedsAssessments` - TNA with 25 scoring criteria
- `trainingCalendars` - Annual calendar
- `trainingBudgets` - Budget allocation
- `trainingSessions` - Individual sessions
- `trainingParticipants` - Session participants
- `trainingEvaluations` - Feedback evaluations
- `trainingCertificates` - Issued certificates
- `trainingBonds` - Bond agreements
- `externalTrainings` - External training records
- `trainingVenues` - Venue management
- `trainingProviders` - Provider registry
- `trainingHistory` - Audit trail

**TNA Scoring System:**
25 criteria scored on 1-5 scale across categories:
- Job Knowledge, Quality of Work, Productivity
- Communication, Problem Solving, Leadership
- Teamwork, Adaptability, Initiative
- ... (25 total criteria)

Scoring levels:
- 0-20%: Complete training needed
- 21-40%: Targeted training
- 41-60%: Regular training
- 61-80%: Refresher training
- 81-100%: Expert level

### Exit/Separation Module (14 stores)

**Stores:**
- `separationTypes` - Separation categories
- `separationRecords` - Main separation records
- `exitClearances` - Department clearances
- `clearanceItems` - Items to return
- `exitClearanceDepartments` - Department configuration
- `exitInterviews` - Exit interviews
- `exitComplianceChecks` - Compliance verification
- `finalSettlements` - Settlement calculation
- `settlementPayments` - Payment processing
- `workCertificates` - Work certificates
- `terminationRecords` - Termination details
- `handovers` / `handoverItems` - Handover management
- `separationHistory` - Audit trail

**Settlement Workflow:**
1. Draft
2. Pending HR Verification
3. Pending Finance Verification
4. Pending Approval
5. Approved
6. Paid

### Payroll Module (13 stores)

**Stores:**
- `payrollPeriods` - Monthly periods
- `payrollRecords` - Individual payslips
- `payrollAllowances` - Allowance types
- `payrollDeductions` - Deduction types
- `employeeAllowances` - Employee-specific allowances
- `employeeDeductions` - Employee-specific deductions
- `salaryAdjustments` - Salary changes
- `payrollTaxSlabs` - Tax brackets
- `bankAccounts` - Employee bank details
- `payrollBatches` - Batch processing
- `payrollApprovals` - Approval workflow
- `payrollHistory` - Audit trail
- `payrollSettings` - Configuration

**Tax Calculation (Progressive):**
```typescript
calculateTax(grossSalary: number): number {
  if (grossSalary <= 5000) return 0;
  if (grossSalary <= 12500) return (grossSalary - 5000) * 0.02;
  if (grossSalary <= 100000) return 150 + (grossSalary - 12500) * 0.10;
  return 8900 + (grossSalary - 100000) * 0.20;
}
```

### Leave Management Module (12 stores)

**Stores:**
- `leaveTypes` - Leave categories
- `leaveBalances` - Employee balances
- `leaveRequests` - Leave applications
- `leaveApprovals` - Approval records
- `leaveAccruals` - Balance accruals
- `leaveCarryovers` - Year-end carryover
- `holidays` - Public holidays
- `leaveCalendar` - Leave calendar
- `leavePolicies` - Policy configuration
- `compensatoryLeaves` - Comp-off tracking
- `leaveEncashments` - Leave encashment
- `leaveHistory` - Audit trail

### Performance Module (16 stores)

**Stores:**
- `performanceCycles` - Review periods
- `performanceTemplates` - Evaluation templates
- `performanceGoals` - Individual goals
- `performanceReviews` - Review records
- `performanceRatings` - Rating submissions
- `performanceComments` - Feedback comments
- `performanceCompetencies` - Competency frameworks
- `performanceScores` - Score calculations
- `performanceApprovals` - Approval workflow
- `pip` - Performance improvement plans
- `pipMilestones` - PIP milestones
- `pipReviews` - PIP review meetings
- `promotions` - Promotion records
- `increments` - Salary increments
- `rewards` - Recognition records
- `performanceHistory` - Audit trail

### Disciplinary Module (11 stores)

**Stores:**
- `disciplinaryCases` - Case records
- `disciplinaryActions` - Action types
- `warnings` - Warning letters
- `suspensions` - Suspension records
- `investigations` - Investigation records
- `hearings` - Hearing records
- `appeals` - Appeal records
- `witnesses` - Witness statements
- `evidence` - Evidence documents
- `sanctions` - Applied sanctions
- `disciplinaryHistory` - Audit trail

### Employee Admin Module (14 stores)

**Stores:**
- `employees` - Employee records
- `employeePositionHistory` - Position changes
- `departments` - Department configuration
- `positions` - Position definitions
- `offices` - Office locations
- `grades` - Grade/level configuration
- `employeeTypes` - Employment types
- `workSchedules` - Work schedule definitions
- `documentTypes` - Document categories
- `templateDocuments` - Document templates
- `employeeDocuments` - Employee documents
- `employeeContacts` - Emergency contacts
- `employeeQualifications` - Qualifications
- `employeeBankAccounts` - Bank details

### Tracking Modules (5 services)

- **In/Out Tracking** - Employee attendance tracking
- **Program Work Plan** - Project work tracking
- **MOU Tracking** - MOU management
- **Access Tracking** - System access logs
- **DNR Tracking** - Do-not-rehire list

## Error Handling

Custom error classes in `src/types/db/errors.ts`:

```typescript
class DatabaseError extends Error
class ConnectionError extends DatabaseError
class TransactionError extends DatabaseError
class RecordNotFoundError extends DatabaseError
class DuplicateRecordError extends DatabaseError
class ValidationError extends DatabaseError
class VersionMismatchError extends DatabaseError
class StoreNotFoundError extends DatabaseError
```

Usage:
```typescript
import { RecordNotFoundError } from '@/types/db/errors';

const record = await service.getById(id);
if (!record) throw new RecordNotFoundError('Employee', id);
```

## Code Generation Utilities

```typescript
// Recruitment codes
generateRecruitmentCode(): 'VDO-0001-2025'
generateCandidateCode(): 'CND-2025-00001'
generateApplicationCode(): 'VDO-0001-2025-APP-001'
generateContractNumber(): 'VDO-CON-2025-0001'
generateReportNumber(): 'VDO-RPT-2025-0001'

// Training codes
generateTNANumber(): 'TNA-2025-0001'
generateCertificateNumber(): 'CERT-2025-0001'

// Exit codes
generateSeparationNumber(): 'SEP-2025-0001'
generateSettlementNumber(): 'SETT-2025-0001'

// Anonymous test codes
generateTestUniqueCode(): 'A3B5C7' (6 alphanumeric)
```

## Database Upgrade

Version upgrades are handled in `src/services/db/indexedDB.ts`:

```typescript
import { openDB } from 'idb';
import { DB_CONFIG } from '@/types/db/constants';
import { createAllStores } from './core/stores';

export async function initDB() {
  return openDB(DB_CONFIG.NAME, DB_CONFIG.VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log(`Upgrading from v${oldVersion} to v${newVersion}`);
      createAllStores(db);
    },
  });
}
```

## Seed Data

Default data is seeded on first run:

```typescript
// Separation types (7 types)
await seedSeparationTypes();

// Clearance departments (6 departments)
await seedClearanceDepartments();

// Afghanistan provinces (34 provinces)
await provincesDB.seed();
```

## Best Practices

1. **Always use the factory pattern** for consistent CRUD operations
2. **Use TypeScript generics** for type-safe database operations
3. **Use const assertions** for enum definitions
4. **Centralize configuration** in `constants.ts`
5. **Handle errors** with custom error classes
6. **Use transactions** for multi-store operations
7. **Index frequently queried fields** for performance

## Migration Notes

- Original JavaScript files remain intact for reference
- TypeScript files provide the new implementation
- Single DB_VERSION = 35 as source of truth
- No breaking changes until full migration testing

## License

Internal use only - VDO ERP Project
