/**
 * Recruitment Management Service
 *
 * Handles 15-step recruitment workflow:
 * 1. TOR Development
 * 2. Staff Requisition
 * 3. Requisition Review
 * 4. Vacancy Announcement
 * 5. Application Receipt
 * 6. Committee Formation
 * 7. Longlisting
 * 8. Shortlisting
 * 9. Written Test
 * 10. Interview
 * 11. Recruitment Report
 * 12. Conditional Offer
 * 13. Sanction Clearance
 * 14. Background Checks
 * 15. Employment Contract
 *
 * 26 services, 30+ stores
 */

import { createCRUDService } from "./core/crud";
import { getDB } from "./core/connection";
import { RecordNotFoundError } from "../../types/db/errors";
import type { CreateInput } from "../../types/db/base";
import {
  RECRUITMENT_STATUS,
  RECRUITMENT_STEPS,
  APPLICATION_STATUS,
  TOR_STATUS,
  SRF_STATUS,
  DEFAULT_WEIGHTS,
  type RecruitmentRecord,
  type TORRecord,
  type SRFRecord,
  type VacancyAnnouncementRecord,
  type CandidateRecord,
  type CandidateApplicationRecord,
  type CandidateEducationRecord,
  type CandidateExperienceRecord,
  type RecruitmentCommitteeRecord,
  type CommitteeMemberRecord,
  type COIDeclarationRecord,
  type LonglistingRecord,
  type LonglistingCandidateRecord,
  type ShortlistingRecord,
  type ShortlistingCandidateRecord,
  type WrittenTestRecord,
  type WrittenTestCandidateRecord,
  type RecruitmentInterviewRecord,
  type InterviewCandidateRecord,
  type InterviewEvaluationRecord,
  type InterviewResultRecord,
  type RecruitmentReportRecord,
  type OfferLetterRecord,
  type SanctionClearanceRecord,
  type BackgroundCheckRecord,
  type EmploymentContractRecord,
  type FileChecklistRecord,
  type ProvinceRecord,
  type RecruitmentStatus,
  type ApplicationStatus,
  type COIDecision,
} from "../../types/modules/recruitment";
import type {
  JobRequisitionRecord,
  JobAnnouncementRecord,
  JobOfferRecord,
  TestResultRecord,
  ReferenceCheckRecord,
  ShortlistingScoreRecord,
  ProbationEvaluationRecord,
} from '../../types/modules/legacy';

// Re-export enums and constants for backward compatibility
export {
  RECRUITMENT_STATUS,
  RECRUITMENT_STATUS_LABELS,
  APPLICATION_STATUS,
  TOR_STATUS,
  SRF_STATUS,
  HIRING_APPROACH,
  CONTRACT_TYPE,
  EDUCATION_LEVEL,
  ANNOUNCEMENT_METHOD,
  COMMITTEE_ROLE,
  COI_DECISION,
  DEFAULT_WEIGHTS,
  RECOMMENDATION,
  RECRUITMENT_STEPS,
} from "../../types/modules/recruitment";

// ========== CODE GENERATION ==========

export async function generateRecruitmentCode(): Promise<string> {
  const db = await getDB();
  const count = await db.count("recruitments");
  const year = new Date().getFullYear();
  return `VDO-${String(count + 1).padStart(4, "0")}-${year}`;
}

export async function generateCandidateCode(): Promise<string> {
  const db = await getDB();
  const count = await db.count("recruitmentCandidates");
  const year = new Date().getFullYear();
  return `CND-${year}-${String(count + 1).padStart(5, "0")}`;
}

export async function generateApplicationCode(
  recruitmentCode: string
): Promise<string> {
  const db = await getDB();
  const all = await db.getAll("candidateApplications");
  const count = all.length + 1;
  return `${recruitmentCode}-APP-${String(count).padStart(3, "0")}`;
}

export function generateTestUniqueCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function generateContractNumber(): Promise<string> {
  const db = await getDB();
  const count = await db.count("employmentContracts");
  const year = new Date().getFullYear();
  return `VDO-CON-${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function generateReportNumber(): Promise<string> {
  const db = await getDB();
  const count = await db.count("recruitmentReports");
  const year = new Date().getFullYear();
  return `VDO-RPT-${year}-${String(count + 1).padStart(4, "0")}`;
}

// ========== RECRUITMENT SERVICE ==========

const recruitmentCRUD = createCRUDService<RecruitmentRecord>("recruitments");

export const recruitmentDB = {
  ...recruitmentCRUD,

  async create(
    data: CreateInput<RecruitmentRecord>
  ): Promise<RecruitmentRecord> {
    const recruitmentCode = await generateRecruitmentCode();
    return recruitmentCRUD.create({
      ...data,
      recruitmentCode,
      status: RECRUITMENT_STATUS.DRAFT,
      currentStep: 1,
    } as CreateInput<RecruitmentRecord>);
  },

  async getAll(): Promise<RecruitmentRecord[]> {
    const all = await recruitmentCRUD.getAll();
    return all.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getByCode(code: string): Promise<RecruitmentRecord | undefined> {
    const results = await this.getByIndex("recruitmentCode", code);
    return results[0];
  },

  /**
   * Validate that a step is complete before advancing
   */
  async validateStepCompletion(recruitmentId: number, step: number): Promise<void> {
    switch (step) {
      case 7: // Longlisting
        const longlisting = await longlistingDB.getByRecruitmentId(recruitmentId);
        if (!longlisting) {
          throw new Error('Longlisting record not found');
        }
        // Check that at least one candidate is longlisted
        const llCandidates = await longlistingCandidateDB.getByLonglistingId(longlisting.id);
        if (!llCandidates.some(c => c.isLonglisted)) {
          throw new Error('At least one candidate must be longlisted');
        }
        // Note: We don't validate status === 'completed' here because the complete() method
        // is called immediately before advanceStep, and the DB transaction might not be
        // visible yet. The component already calls complete() before advancing.
        break;

      case 8: // Shortlisting
        const shortlisting = await shortlistingDB.getByRecruitmentId(recruitmentId);
        if (!shortlisting) {
          throw new Error('Shortlisting record not found');
        }
        // Check that at least one candidate is shortlisted
        const slCandidates = await shortlistingCandidateDB.getByShortlistingId(shortlisting.id);
        if (!slCandidates.some(c => c.isShortlisted)) {
          throw new Error('At least one candidate must be shortlisted');
        }
        // Note: Status validation skipped due to transaction timing (see longlisting note)
        break;

      case 9: // Written Test
        const writtenTest = await writtenTestDB.getByRecruitmentId(recruitmentId);
        if (!writtenTest) {
          throw new Error('Written test record not found');
        }
        // Check that at least one candidate passed
        const testCandidates = await writtenTestCandidateDB.getByTestId(writtenTest.id);
        if (!testCandidates.some(c => c.isPassed)) {
          throw new Error('At least one candidate must pass the written test');
        }
        // Note: Status validation skipped due to transaction timing
        break;

      case 10: // Interview
        const interviewRecord = await interviewDB.getByRecruitmentId(recruitmentId);
        if (!interviewRecord) {
          throw new Error('Interview record not found');
        }
        // Check that at least one candidate attended
        const interviewCandidates = await interviewCandidateDB.getByInterviewId(interviewRecord.id);
        if (!interviewCandidates.some(c => c.attended)) {
          throw new Error('At least one candidate must attend the interview');
        }
        // Note: Status validation skipped due to transaction timing
        break;

      case 14: // Background Check
        const bgCheck = await backgroundCheckDB.getByRecruitmentId(recruitmentId);
        if (!bgCheck) {
          throw new Error('Background check not found');
        }
        const validation = await backgroundCheckDB.validateCompletion(bgCheck.id);
        if (!validation.valid) {
          throw new Error(`Background check incomplete: ${validation.errors.join(', ')}`);
        }
        break;

      // Add validation for other critical steps as needed
      default:
        // No specific validation required for this step
        break;
    }
  },

  async advanceStep(id: number): Promise<RecruitmentRecord> {
    const recruitment = await this.getById(id);
    if (!recruitment) {
      throw new RecordNotFoundError("Recruitment", id);
    }

    if (recruitment.currentStep >= 15) {
      throw new Error("Cannot advance: already at final step");
    }

    const currentStep = recruitment.currentStep;
    const nextStep = currentStep + 1;
    const stepInfo = RECRUITMENT_STEPS.find((s) => s.step === nextStep);

    try {
      // Validate current step is complete before advancing
      await this.validateStepCompletion(id, currentStep);

      // Update to next step
      const updated = await this.update(id, {
        currentStep: nextStep,
        status: (stepInfo?.status || recruitment.status) as RecruitmentStatus,
      });

      console.log(`Advanced recruitment ${id} from step ${currentStep} to ${nextStep}`);
      return updated;
    } catch (error) {
      console.error(`Failed to advance recruitment ${id} from step ${currentStep}:`, error);
      throw new Error(`Cannot advance to next step: ${error.message}`);
    }
  },

  async filterByStatus(
    status: RecruitmentStatus
  ): Promise<RecruitmentRecord[]> {
    return this.getByIndex("status", status);
  },

  async search(term: string): Promise<RecruitmentRecord[]> {
    const all = await this.getAll();
    if (!term) return all;
    const lowerTerm = term.toLowerCase();
    return all.filter(
      (r) =>
        r.recruitmentCode?.toLowerCase().includes(lowerTerm) ||
        r.positionTitle?.toLowerCase().includes(lowerTerm)
    );
  },

  async getStats(): Promise<{
    total: number;
    draft: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  }> {
    const all = await this.getAll();
    return {
      total: all.length,
      draft: all.filter((r) => r.status === RECRUITMENT_STATUS.DRAFT).length,
      inProgress: all.filter(
        (r) =>
          !(
            r.status === RECRUITMENT_STATUS.DRAFT ||
            r.status === RECRUITMENT_STATUS.COMPLETED ||
            r.status === RECRUITMENT_STATUS.CANCELLED
          )
        // ![
        //   RECRUITMENT_STATUS.DRAFT,
        //   RECRUITMENT_STATUS.COMPLETED,
        //   RECRUITMENT_STATUS.CANCELLED,
        // ].includes(r.status as "draft" | "completed" | "cancelled")
      ).length,
      completed: all.filter((r) => r.status === RECRUITMENT_STATUS.COMPLETED)
        .length,
      cancelled: all.filter((r) => r.status === RECRUITMENT_STATUS.CANCELLED)
        .length,
    };
  },
};

// ========== TOR SERVICE ==========

const torCRUD = createCRUDService<TORRecord>("termsOfReferences");

export const torDB = {
  ...torCRUD,

  async getByRecruitmentId(
    recruitmentId: number
  ): Promise<TORRecord | undefined> {
    const results = await this.getByIndex("recruitmentId", recruitmentId);
    return results[0];
  },

  async approve(id: number, approvedBy: string): Promise<TORRecord> {
    return this.update(id, {
      status: TOR_STATUS.APPROVED,
      approvedBy,
      approvedAt: new Date().toISOString(),
    });
  },

  async reject(
    id: number,
    rejectedBy: string,
    reason: string
  ): Promise<TORRecord> {
    return this.update(id, {
      status: TOR_STATUS.REJECTED,
      rejectedBy,
      rejectionReason: reason,
    });
  },
};

// ========== SRF SERVICE ==========

const srfCRUD = createCRUDService<SRFRecord>("staffRequisitions");

export const srfDB = {
  ...srfCRUD,

  async create(data: CreateInput<SRFRecord>): Promise<SRFRecord> {
    return srfCRUD.create({
      ...data,
      status: SRF_STATUS.DRAFT,
      hrVerified: false,
      budgetVerified: false,
    } as CreateInput<SRFRecord>);
  },

  async getByRecruitmentId(
    recruitmentId: number
  ): Promise<SRFRecord | undefined> {
    const results = await this.getByIndex("recruitmentId", recruitmentId);
    return results[0];
  },

  async hrVerify(id: number, verifiedBy: string): Promise<SRFRecord> {
    return this.update(id, {
      hrVerified: true,
      hrVerifiedBy: verifiedBy,
      hrVerifiedAt: new Date().toISOString(),
      status: SRF_STATUS.FINANCE_REVIEW,
    });
  },

  async financeVerify(id: number, verifiedBy: string): Promise<SRFRecord> {
    return this.update(id, {
      budgetVerified: true,
      budgetVerifiedBy: verifiedBy,
      budgetVerifiedAt: new Date().toISOString(),
    });
  },

  async approve(id: number, approvedBy: string): Promise<SRFRecord> {
    return this.update(id, {
      status: SRF_STATUS.APPROVED,
      approvedBy,
      approvedAt: new Date().toISOString(),
    });
  },
};

// ========== VACANCY SERVICE ==========

const vacancyCRUD = createCRUDService<VacancyAnnouncementRecord>(
  "vacancyAnnouncements"
);

export const vacancyDB = {
  ...vacancyCRUD,

  async create(
    data: CreateInput<VacancyAnnouncementRecord>
  ): Promise<VacancyAnnouncementRecord> {
    return vacancyCRUD.create({
      ...data,
      status: "draft",
      viewsCount: 0,
    } as CreateInput<VacancyAnnouncementRecord>);
  },

  async getByRecruitmentId(
    recruitmentId: number
  ): Promise<VacancyAnnouncementRecord[]> {
    return this.getByIndex("recruitmentId", recruitmentId);
  },

  async publish(id: number): Promise<VacancyAnnouncementRecord> {
    return this.update(id, {
      status: "published",
      publishedAt: new Date().toISOString(),
    });
  },

  async close(id: number): Promise<VacancyAnnouncementRecord> {
    return this.update(id, {
      status: "closed",
      closedAt: new Date().toISOString(),
    });
  },
};

// ========== CANDIDATE SERVICE ==========

const candidateCRUD = createCRUDService<CandidateRecord>(
  "recruitmentCandidates"
);

export const candidateDB = {
  ...candidateCRUD,

  async create(data: CreateInput<CandidateRecord>): Promise<CandidateRecord> {
    const candidateCode = await generateCandidateCode();
    return candidateCRUD.create({
      ...data,
      candidateCode,
    } as CreateInput<CandidateRecord>);
  },

  async getByCode(code: string): Promise<CandidateRecord | undefined> {
    const results = await this.getByIndex("candidateCode", code);
    return results[0];
  },

  async search(term: string): Promise<CandidateRecord[]> {
    const all = await this.getAll();
    if (!term) return all;
    const lowerTerm = term.toLowerCase();
    return all.filter(
      (c) =>
        c.fullName?.toLowerCase().includes(lowerTerm) ||
        c.email?.toLowerCase().includes(lowerTerm) ||
        c.candidateCode?.toLowerCase().includes(lowerTerm)
    );
  },
};

// ========== APPLICATION SERVICE ==========

const applicationCRUD = createCRUDService<CandidateApplicationRecord>(
  "candidateApplications"
);

export const applicationDB = {
  ...applicationCRUD,

  async create(
    data: CreateInput<CandidateApplicationRecord>,
    recruitmentCode: string
  ): Promise<CandidateApplicationRecord> {
    const applicationCode = await generateApplicationCode(recruitmentCode);
    return applicationCRUD.create({
      ...data,
      applicationCode,
      status: APPLICATION_STATUS.RECEIVED,
      applicationDate: new Date().toISOString(),
    } as CreateInput<CandidateApplicationRecord>);
  },

  async getByRecruitmentId(
    recruitmentId: number
  ): Promise<CandidateApplicationRecord[]> {
    return this.getByIndex("recruitmentId", recruitmentId);
  },

  async getByCandidateId(
    candidateId: number
  ): Promise<CandidateApplicationRecord[]> {
    return this.getByIndex("candidateId", candidateId);
  },

  async updateStatus(
    id: number,
    status: ApplicationStatus,
    reason?: string
  ): Promise<CandidateApplicationRecord> {
    const existing = await this.getById(id);
    if (!existing) throw new RecordNotFoundError("CandidateApplication", id);

    return this.update(id, {
      status,
      rejectionReason:
        status === APPLICATION_STATUS.REJECTED
          ? reason
          : existing.rejectionReason,
    });
  },

  async getStatsByRecruitment(recruitmentId: number): Promise<{
    total: number;
    male: number;
    female: number;
    byStatus: Record<string, number>;
  }> {
    const applications = await this.getByRecruitmentId(recruitmentId);
    return {
      total: applications.length,
      male: applications.filter((a) => a.gender === "male").length,
      female: applications.filter((a) => a.gender === "female").length,
      byStatus: Object.values(APPLICATION_STATUS).reduce((acc, status) => {
        acc[status] = applications.filter((a) => a.status === status).length;
        return acc;
      }, {} as Record<string, number>),
    };
  },
};

// ========== EDUCATION SERVICE ==========

const educationCRUD = createCRUDService<CandidateEducationRecord>(
  "candidateEducations"
);

export const educationDB = {
  ...educationCRUD,

  async getByCandidateId(
    candidateId: number
  ): Promise<CandidateEducationRecord[]> {
    return this.getByIndex("candidateId", candidateId);
  },
};

// ========== EXPERIENCE SERVICE ==========

const experienceCRUD = createCRUDService<CandidateExperienceRecord>(
  "candidateExperiences"
);

export const experienceDB = {
  ...experienceCRUD,

  async getByCandidateId(
    candidateId: number
  ): Promise<CandidateExperienceRecord[]> {
    return this.getByIndex("candidateId", candidateId);
  },

  async calculateTotalYears(candidateId: number): Promise<number> {
    const experiences = await this.getByCandidateId(candidateId);
    let totalMonths = 0;
    experiences.forEach((exp) => {
      const start = new Date(exp.startDate);
      const end = exp.isCurrent
        ? new Date()
        : new Date(exp.endDate || new Date());
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      totalMonths += months;
    });
    return Math.round((totalMonths / 12) * 10) / 10;
  },
};

// ========== COMMITTEE SERVICE ==========

const committeeCRUD = createCRUDService<RecruitmentCommitteeRecord>(
  "recruitmentCommittees"
);

export const committeeDB = {
  ...committeeCRUD,

  async create(
    data: CreateInput<RecruitmentCommitteeRecord>
  ): Promise<RecruitmentCommitteeRecord> {
    return committeeCRUD.create({
      ...data,
      status: "pending",
    } as CreateInput<RecruitmentCommitteeRecord>);
  },

  async getByRecruitmentId(
    recruitmentId: number
  ): Promise<RecruitmentCommitteeRecord | undefined> {
    const results = await this.getByIndex("recruitmentId", recruitmentId);
    return results[0];
  },
};

// ========== MEMBER SERVICE ==========

const memberCRUD = createCRUDService<CommitteeMemberRecord>("committeeMembers");

export const memberDB = {
  ...memberCRUD,

  async getByCommitteeId(
    committeeId: number
  ): Promise<CommitteeMemberRecord[]> {
    return this.getByIndex("committeeId", committeeId);
  },
};

// ========== COI SERVICE ==========

const coiCRUD = createCRUDService<COIDeclarationRecord>("coiDeclarations");

export const coiDB = {
  ...coiCRUD,

  async create(
    data: CreateInput<COIDeclarationRecord>
  ): Promise<COIDeclarationRecord> {
    return coiCRUD.create({
      ...data,
      declarationDate: new Date().toISOString().split("T")[0],
    } as CreateInput<COIDeclarationRecord>);
  },

  async getByMemberId(
    committeeMemberId: number
  ): Promise<COIDeclarationRecord | undefined> {
    const results = await this.getByIndex(
      "committeeMemberId",
      committeeMemberId
    );
    return results[0];
  },

  async getByRecruitmentId(
    recruitmentId: number
  ): Promise<COIDeclarationRecord[]> {
    return this.getByIndex("recruitmentId", recruitmentId);
  },

  async review(
    id: number,
    reviewedBy: string,
    decision: COIDecision,
    comments = ""
  ): Promise<COIDeclarationRecord> {
    return this.update(id, {
      hrReviewedBy: reviewedBy,
      hrDecision: decision,
      hrComments: comments,
      hrReviewedAt: new Date().toISOString(),
    });
  },
};

// ========== LONGLISTING SERVICE ==========

const longlistingCRUD = createCRUDService<LonglistingRecord>("longlistings");

export const longlistingDB = {
  ...longlistingCRUD,

  async create(
    data: CreateInput<LonglistingRecord>
  ): Promise<LonglistingRecord> {
    return longlistingCRUD.create({
      ...data,
      status: "pending",
      totalApplications: 0,
      totalLonglisted: 0,
      conductedDate: new Date().toISOString().split("T")[0],
    } as CreateInput<LonglistingRecord>);
  },

  async getByRecruitmentId(
    recruitmentId: number
  ): Promise<LonglistingRecord | undefined> {
    const results = await this.getByIndex("recruitmentId", recruitmentId);
    return results[0];
  },

  async complete(id: number): Promise<LonglistingRecord> {
    const candidates = await longlistingCandidateDB.getByLonglistingId(id);

    return this.update(id, {
      status: "completed",
      totalApplications: candidates.length,
      totalLonglisted: candidates.filter((c) => c.isLonglisted).length,
    });
  },
};

// ========== LONGLISTING CANDIDATE SERVICE ==========

const longlistingCandidateCRUD = createCRUDService<LonglistingCandidateRecord>(
  "longlistingCandidates"
);

export const longlistingCandidateDB = {
  ...longlistingCandidateCRUD,

  async getByLonglistingId(
    longlistingId: number
  ): Promise<LonglistingCandidateRecord[]> {
    return this.getByIndex("longlistingId", longlistingId);
  },

  async bulkCreate(
    records: CreateInput<LonglistingCandidateRecord>[]
  ): Promise<boolean> {
    const db = await getDB();
    const tx = db.transaction("longlistingCandidates", "readwrite");
    const store = tx.objectStore("longlistingCandidates");
    const now = new Date().toISOString();

    try {
      const promises = records.map((r) =>
        // Let IndexedDB auto-generate unique IDs (removed: id: r.longlistingId)
        store.add({ ...r, createdAt: now, updatedAt: now })
      );
      await Promise.all(promises);
      await tx.done;
      return true;
    } catch (error) {
      console.error('Failed to bulk create longlisting candidates:', error);
      throw new Error(`Failed to create longlisting candidates: ${error.message}`);
    }
  },
};

// ========== SHORTLISTING SERVICE ==========

const shortlistingCRUD = createCRUDService<ShortlistingRecord>("shortlistings");

export const shortlistingDB = {
  ...shortlistingCRUD,

  async create(
    data: CreateInput<ShortlistingRecord>
  ): Promise<ShortlistingRecord> {
    return shortlistingCRUD.create({
      ...data,
      status: "pending",
      academicWeight: data.academicWeight ?? DEFAULT_WEIGHTS.ACADEMIC,
      experienceWeight: data.experienceWeight ?? DEFAULT_WEIGHTS.EXPERIENCE,
      otherWeight: data.otherWeight ?? DEFAULT_WEIGHTS.OTHER,
      passingScore: data.passingScore ?? 60,
      conductedDate: new Date().toISOString().split("T")[0],
    } as CreateInput<ShortlistingRecord>);
  },

  async getByRecruitmentId(
    recruitmentId: number
  ): Promise<ShortlistingRecord | undefined> {
    const results = await this.getByIndex("recruitmentId", recruitmentId);
    return results[0];
  },

  async complete(id: number): Promise<ShortlistingRecord> {
    return this.update(id, { status: "completed" });
  },
};

// ========== SHORTLISTING CANDIDATE SERVICE ==========

const shortlistingCandidateCRUD =
  createCRUDService<ShortlistingCandidateRecord>("shortlistingCandidates");

export const shortlistingCandidateDB = {
  ...shortlistingCandidateCRUD,

  async create(
    data: CreateInput<ShortlistingCandidateRecord>,
    shortlisting: ShortlistingRecord
  ): Promise<ShortlistingCandidateRecord> {
    const totalScore =
      (data.academicScore || 0) * shortlisting.academicWeight +
      (data.experienceScore || 0) * shortlisting.experienceWeight +
      (data.otherCriteriaScore || 0) * shortlisting.otherWeight;

    return shortlistingCandidateCRUD.create({
      ...data,
      totalScore,
      isShortlisted: totalScore >= shortlisting.passingScore,
    } as CreateInput<ShortlistingCandidateRecord>);
  },

  async getByShortlistingId(
    shortlistingId: number
  ): Promise<ShortlistingCandidateRecord[]> {
    const candidates = await this.getByIndex("shortlistingId", shortlistingId);
    return candidates.sort((a, b) => b.totalScore - a.totalScore);
  },

  async recalculateScore(
    id: number,
    shortlisting: ShortlistingRecord
  ): Promise<ShortlistingCandidateRecord> {
    const existing = await this.getById(id);
    if (!existing) throw new RecordNotFoundError("ShortlistingCandidate", id);

    const totalScore =
      existing.academicScore * shortlisting.academicWeight +
      existing.experienceScore * shortlisting.experienceWeight +
      existing.otherCriteriaScore * shortlisting.otherWeight;

    return this.update(id, {
      totalScore,
      isShortlisted: totalScore >= shortlisting.passingScore,
    });
  },
};

// ========== WRITTEN TEST SERVICE ==========

const writtenTestCRUD = createCRUDService<WrittenTestRecord>("writtenTests");

export const writtenTestDB = {
  ...writtenTestCRUD,

  async create(
    data: CreateInput<WrittenTestRecord>
  ): Promise<WrittenTestRecord> {
    return writtenTestCRUD.create({
      ...data,
      status: "scheduled",
      totalMarks: data.totalMarks || 100,
      passingMarks: data.passingMarks || 50,
      testWeight: data.testWeight || DEFAULT_WEIGHTS.WRITTEN_TEST,
    } as CreateInput<WrittenTestRecord>);
  },

  async getByRecruitmentId(
    recruitmentId: number
  ): Promise<WrittenTestRecord | undefined> {
    const results = await this.getByIndex("recruitmentId", recruitmentId);
    return results[0];
  },

  async complete(id: number): Promise<WrittenTestRecord> {
    return this.update(id, { status: "evaluated" });
  },
};

// ========== WRITTEN TEST CANDIDATE SERVICE ==========

const writtenTestCandidateCRUD = createCRUDService<WrittenTestCandidateRecord>(
  "writtenTestCandidates"
);

export const writtenTestCandidateDB = {
  ...writtenTestCandidateCRUD,

  async create(
    data: CreateInput<WrittenTestCandidateRecord>
  ): Promise<WrittenTestCandidateRecord> {
    const uniqueCode = generateTestUniqueCode();
    return writtenTestCandidateCRUD.create({
      ...data,
      uniqueCode,
      attended: false,
    } as CreateInput<WrittenTestCandidateRecord>);
  },

  async getByTestId(
    writtenTestId: number
  ): Promise<WrittenTestCandidateRecord[]> {
    return this.getByIndex("writtenTestId", writtenTestId);
  },

  async recordAttendance(id: number): Promise<WrittenTestCandidateRecord> {
    return this.update(id, {
      attended: true,
      attendanceTime: new Date().toISOString(),
    });
  },

  async submitScore(
    id: number,
    marks: number,
    testData: WrittenTestRecord
  ): Promise<WrittenTestCandidateRecord> {
    return this.update(id, {
      marksObtained: marks,
      isPassed: marks >= testData.passingMarks,
    });
  },
};

// ========== INTERVIEW SERVICE ==========

const interviewCRUD = createCRUDService<RecruitmentInterviewRecord>(
  "recruitmentInterviews"
);

export const interviewDB = {
  ...interviewCRUD,

  async create(
    data: CreateInput<RecruitmentInterviewRecord>
  ): Promise<RecruitmentInterviewRecord> {
    return interviewCRUD.create({
      ...data,
      status: "scheduled",
      totalMarks: data.totalMarks || 100,
      passingMarks: data.passingMarks || 50,
      interviewWeight: data.interviewWeight || DEFAULT_WEIGHTS.INTERVIEW,
    } as CreateInput<RecruitmentInterviewRecord>);
  },

  async getByRecruitmentId(
    recruitmentId: number
  ): Promise<RecruitmentInterviewRecord | undefined> {
    const results = await this.getByIndex("recruitmentId", recruitmentId);
    return results[0];
  },

  async complete(id: number): Promise<RecruitmentInterviewRecord> {
    return this.update(id, { status: "evaluated" });
  },
};

// ========== INTERVIEW CANDIDATE SERVICE ==========

const interviewCandidateCRUD = createCRUDService<InterviewCandidateRecord>(
  "recruitmentInterviewCandidates"
);

export const interviewCandidateDB = {
  ...interviewCandidateCRUD,

  async create(
    data: CreateInput<InterviewCandidateRecord>
  ): Promise<InterviewCandidateRecord> {
    return interviewCandidateCRUD.create({
      ...data,
      attended: false,
    } as CreateInput<InterviewCandidateRecord>);
  },

  async getByInterviewId(
    interviewId: number
  ): Promise<InterviewCandidateRecord[]> {
    return this.getByIndex("interviewId", interviewId);
  },

  async recordAttendance(id: number): Promise<InterviewCandidateRecord> {
    return this.update(id, {
      attended: true,
      attendanceTime: new Date().toISOString(),
    });
  },
};

// ========== EVALUATION SERVICE ==========

const evaluationCRUD = createCRUDService<InterviewEvaluationRecord>(
  "recruitmentInterviewEvaluations"
);

export const evaluationDB = {
  ...evaluationCRUD,

  async create(
    data: CreateInput<InterviewEvaluationRecord>
  ): Promise<InterviewEvaluationRecord> {
    const totalScore =
      (((data.technicalKnowledgeScore || 0) +
        (data.communicationScore || 0) +
        (data.problemSolvingScore || 0) +
        (data.experienceRelevanceScore || 0) +
        (data.culturalFitScore || 0)) /
        5) *
      20;

    return evaluationCRUD.create({
      ...data,
      totalScore,
      evaluatedAt: new Date().toISOString(),
    } as CreateInput<InterviewEvaluationRecord>);
  },

  async getByInterviewCandidateId(
    interviewCandidateId: number
  ): Promise<InterviewEvaluationRecord[]> {
    return this.getByIndex("interviewCandidateId", interviewCandidateId);
  },

  calculateTotalScore(data: Partial<InterviewEvaluationRecord>): number {
    return (
      (((data.technicalKnowledgeScore || 0) +
        (data.communicationScore || 0) +
        (data.problemSolvingScore || 0) +
        (data.experienceRelevanceScore || 0) +
        (data.culturalFitScore || 0)) /
        5) *
      20
    );
  },
};

// ========== INTERVIEW RESULT SERVICE ==========

const interviewResultCRUD = createCRUDService<InterviewResultRecord>(
  "recruitmentInterviewResults"
);

export const interviewResultDB = {
  ...interviewResultCRUD,

  async calculateAndSave(
    interviewCandidateId: number,
    writtenTestScore: number | null = null,
    testWeight = 0.5,
    interviewWeight = 0.5
  ): Promise<InterviewResultRecord> {
    const evaluations = await evaluationDB.getByInterviewCandidateId(
      interviewCandidateId
    );
    if (evaluations.length === 0) throw new Error("No evaluations found");

    const averageScore =
      evaluations.reduce((sum, e) => sum + e.totalScore, 0) /
      evaluations.length;
    let combinedScore: number;

    if (writtenTestScore !== null) {
      combinedScore =
        writtenTestScore * testWeight + averageScore * interviewWeight;
    } else {
      combinedScore = averageScore;
    }

    return this.create({
      interviewCandidateId,
      averageScore,
      writtenTestScore: writtenTestScore ?? undefined,
      combinedScore,
    });
  },

  async getByInterviewCandidateId(
    interviewCandidateId: number
  ): Promise<InterviewResultRecord | undefined> {
    const results = await this.getByIndex(
      "interviewCandidateId",
      interviewCandidateId
    );
    return results[0];
  },

  async rankCandidates(interviewId: number): Promise<InterviewResultRecord[]> {
    const candidates = await interviewCandidateDB.getByInterviewId(interviewId);
    const results: InterviewResultRecord[] = [];

    for (const candidate of candidates) {
      const result = await this.getByInterviewCandidateId(candidate.id);
      if (result) {
        results.push(result);
      }
    }

    results.sort((a, b) => b.combinedScore - a.combinedScore);

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const updated = await this.update(result.id, {
        finalRank: i + 1,
        isSelected: i < 3,
      });
      results[i] = updated;
    }

    return results;
  },

  async getByRecruitmentId(recruitmentId: number): Promise<
    Array<
      InterviewResultRecord & {
        candidateId: number;
        rank: number | undefined;
        finalScore: number;
        recommendation: string;
      }
    >
  > {
    const interview = await interviewDB.getByRecruitmentId(recruitmentId);
    if (!interview) return [];

    const candidates = await interviewCandidateDB.getByInterviewId(
      interview.id
    );
    const results: Array<
      InterviewResultRecord & {
        candidateId: number;
        rank: number | undefined;
        finalScore: number;
        recommendation: string;
      }
    > = [];

    for (const candidate of candidates) {
      const result = await this.getByInterviewCandidateId(candidate.id);
      if (result) {
        results.push({
          ...result,
          candidateId: candidate.candidateApplicationId,
          rank: result.finalRank,
          finalScore: Math.round(result.combinedScore),
          recommendation: result.isSelected ? "hire" : "consider",
        });
      }
    }

    return results.sort((a, b) => (a.rank || 999) - (b.rank || 999));
  },
};

// ========== REPORT SERVICE ==========

const reportCRUD =
  createCRUDService<RecruitmentReportRecord>("recruitmentReports");

export const reportDB = {
  ...reportCRUD,

  async create(
    data: CreateInput<RecruitmentReportRecord>
  ): Promise<RecruitmentReportRecord> {
    const reportNumber = await generateReportNumber();
    return reportCRUD.create({
      ...data,
      reportNumber,
      status: "draft",
    } as CreateInput<RecruitmentReportRecord>);
  },

  async getByRecruitmentId(
    recruitmentId: number
  ): Promise<RecruitmentReportRecord | undefined> {
    const results = await this.getByIndex("recruitmentId", recruitmentId);
    return results[0];
  },

  async submit(id: number): Promise<RecruitmentReportRecord> {
    return this.update(id, {
      status: "submitted",
      submittedAt: new Date().toISOString(),
    });
  },

  async approve(
    id: number,
    approvedBy: string
  ): Promise<RecruitmentReportRecord> {
    return this.update(id, {
      status: "approved",
      approvedBy,
      approvedAt: new Date().toISOString(),
    });
  },
};

// ========== OFFER SERVICE ==========

const offerCRUD = createCRUDService<OfferLetterRecord>("offerLetters");

export const offerDB = {
  ...offerCRUD,

  async create(
    data: CreateInput<OfferLetterRecord>
  ): Promise<OfferLetterRecord> {
    return offerCRUD.create({
      ...data,
      status: "draft",
      offerDate: new Date().toISOString().split("T")[0],
    } as CreateInput<OfferLetterRecord>);
  },

  async getByRecruitmentId(
    recruitmentId: number
  ): Promise<OfferLetterRecord | undefined> {
    const results = await this.getByIndex("recruitmentId", recruitmentId);
    return results[0];
  },

  async send(id: number): Promise<OfferLetterRecord> {
    return this.update(id, {
      status: "sent",
      sentAt: new Date().toISOString(),
    });
  },

  async respond(
    id: number,
    accepted: boolean,
    declineReason?: string
  ): Promise<OfferLetterRecord> {
    return this.update(id, {
      status: accepted ? "accepted" : "declined",
      declineReason: accepted ? undefined : declineReason,
      respondedAt: new Date().toISOString(),
    });
  },
};

// ========== SANCTION SERVICE ==========

const sanctionCRUD =
  createCRUDService<SanctionClearanceRecord>("sanctionClearances");

export const sanctionDB = {
  ...sanctionCRUD,

  async create(
    data: CreateInput<SanctionClearanceRecord>
  ): Promise<SanctionClearanceRecord> {
    return sanctionCRUD.create({
      ...data,
      status: "pending",
      declarationDate: new Date().toISOString().split("T")[0],
    } as CreateInput<SanctionClearanceRecord>);
  },

  async getByRecruitmentId(
    recruitmentId: number
  ): Promise<SanctionClearanceRecord | undefined> {
    const results = await this.getByIndex("recruitmentId", recruitmentId);
    return results[0];
  },

  async verify(
    id: number,
    verifiedBy: string,
    isClear: boolean
  ): Promise<SanctionClearanceRecord> {
    return this.update(id, {
      status: isClear ? "cleared" : "flagged",
      verifiedBy,
      verifiedAt: new Date().toISOString(),
      checkedDate: new Date().toISOString().split("T")[0],
    });
  },

  async runCheck(
    id: number,
    isClear: boolean
  ): Promise<SanctionClearanceRecord> {
    return this.verify(id, "System", isClear);
  },
};

// ========== BACKGROUND CHECK SERVICE ==========

const backgroundCheckCRUD =
  createCRUDService<BackgroundCheckRecord>("backgroundChecks");

export const backgroundCheckDB = {
  ...backgroundCheckCRUD,

  async create(
    data: CreateInput<BackgroundCheckRecord>
  ): Promise<BackgroundCheckRecord> {
    // Ensure nested structures are initialized with defaults
    const defaultData: CreateInput<BackgroundCheckRecord> = {
      ...data,
      overallStatus: "pending",
      references: data.references || [],
      guaranteeLetter: data.guaranteeLetter || {
        guarantorName: '',
        guarantorNationalId: '',
        relationship: '',
        phone: '',
        address: '',
        status: 'pending',
      },
      homeAddress: data.homeAddress || {
        province: '',
        district: '',
        village: '',
        verificationStatus: 'pending',
        verifiedBy: '',
        verificationDate: '',
      },
      criminalCheck: data.criminalCheck || {
        status: 'pending',
        checkedBy: '',
        checkedDate: '',
        notes: '',
      },
      attachments: data.attachments || [],
    };

    return backgroundCheckCRUD.create(defaultData as CreateInput<BackgroundCheckRecord>);
  },

  async getByRecruitmentId(
    recruitmentId: number
  ): Promise<BackgroundCheckRecord | undefined> {
    const results = await this.getByIndex("recruitmentId", recruitmentId);
    return results[0];
  },

  /**
   * Validate background check completion before advancing
   */
  async validateCompletion(id: number): Promise<{ valid: boolean; errors: string[] }> {
    const record = await this.getById(id);
    if (!record) {
      return { valid: false, errors: ['Background check record not found'] };
    }

    const errors: string[] = [];

    // Check references (minimum 2 verified)
    if (!record.references || record.references.length < 2) {
      errors.push('At least 2 references are required');
    } else if (!record.references.every(r => r.status === 'verified')) {
      errors.push('All references must be verified');
    }

    // Check guarantee letter
    if (record.guaranteeLetter?.status !== 'verified') {
      errors.push('Guarantee letter must be verified');
    }

    // Check address verification
    if (record.homeAddress?.verificationStatus !== 'verified') {
      errors.push('Home address must be verified');
    }

    // Check criminal record
    if (record.criminalCheck?.status !== 'cleared') {
      errors.push('Criminal record check must be cleared');
    }

    return { valid: errors.length === 0, errors };
  },

  /**
   * Complete background check with validation
   */
  async complete(id: number, passed = true): Promise<BackgroundCheckRecord> {
    // Validate before completing
    const validation = await this.validateCompletion(id);

    if (!validation.valid) {
      throw new Error(
        `Cannot complete background check: ${validation.errors.join(', ')}`
      );
    }

    return this.update(id, {
      overallStatus: passed ? "completed" : "failed",
      completedAt: new Date().toISOString(),
    });
  },
};

// ========== CONTRACT SERVICE ==========

const contractCRUD = createCRUDService<EmploymentContractRecord>(
  "employmentContracts"
);

export const contractDB = {
  ...contractCRUD,

  async create(
    data: CreateInput<EmploymentContractRecord>
  ): Promise<EmploymentContractRecord> {
    const contractNumber = await generateContractNumber();
    return contractCRUD.create({
      ...data,
      contractNumber,
      status: "draft",
      probationPeriodMonths: data.probationPeriodMonths || 3,
    } as CreateInput<EmploymentContractRecord>);
  },

  async getByRecruitmentId(
    recruitmentId: number
  ): Promise<EmploymentContractRecord | undefined> {
    const results = await this.getByIndex("recruitmentId", recruitmentId);
    return results[0];
  },

  async signEmployee(
    id: number,
    signaturePath?: string
  ): Promise<EmploymentContractRecord> {
    return this.update(id, {
      employeeSignedAt: new Date().toISOString(),
      employeeSignaturePath: signaturePath,
      status: "pending_signature",
    });
  },

  async signEmployer(
    id: number,
    signatoryId: number,
    signaturePath?: string
  ): Promise<EmploymentContractRecord> {
    return this.update(id, {
      employerSignedAt: new Date().toISOString(),
      employerSignatoryId: signatoryId,
      employerSignaturePath: signaturePath,
      status: "signed",
    });
  },

  async activate(id: number): Promise<EmploymentContractRecord> {
    return this.update(id, { status: "active" });
  },
};

// ========== CHECKLIST SERVICE ==========

const checklistCRUD = createCRUDService<FileChecklistRecord>("fileChecklists");

const CHECKLIST_FIELDS = [
  "torAttached",
  "srfAttached",
  "shortlistFormAttached",
  "rcFormAttached",
  "writtenTestPapersAttached",
  "interviewFormsAttached",
  "interviewResultAttached",
  "recruitmentReportAttached",
  "offerLetterAttached",
  "sanctionClearanceAttached",
  "referenceChecksAttached",
  "guaranteeLetterAttached",
  "addressVerificationAttached",
  "criminalCheckAttached",
  "contractAttached",
  "personalInfoFormAttached",
] as const;

export const checklistDB = {
  ...checklistCRUD,

  async create(
    data: CreateInput<FileChecklistRecord>
  ): Promise<FileChecklistRecord> {
    const defaults = CHECKLIST_FIELDS.reduce((acc, field) => {
      acc[field] = false;
      return acc;
    }, {} as Record<string, boolean>);

    return checklistCRUD.create({
      ...defaults,
      ...data,
      status: "incomplete",
    } as CreateInput<FileChecklistRecord>);
  },

  async getByRecruitmentId(
    recruitmentId: number
  ): Promise<FileChecklistRecord | undefined> {
    const results = await this.getByIndex("recruitmentId", recruitmentId);
    return results[0];
  },

  async update(
    id: number,
    data: Partial<FileChecklistRecord>
  ): Promise<FileChecklistRecord> {
    const existing = await this.getById(id);
    if (!existing) throw new RecordNotFoundError("FileChecklist", id);

    const updated = { ...existing, ...data };
    const allAttached = CHECKLIST_FIELDS.every(
      (field) => updated[field] === true
    );
    updated.status = allAttached ? "complete" : "incomplete";

    return checklistCRUD.update(id, updated);
  },

  async verify(id: number, verifiedBy: string): Promise<FileChecklistRecord> {
    return this.update(id, {
      verifiedBy,
      verifiedAt: new Date().toISOString(),
    });
  },
};

// ========== PROVINCES SERVICE ==========

const provincesCRUD = createCRUDService<ProvinceRecord>("provinces");

export const provincesDB = {
  ...provincesCRUD,

  async seed(): Promise<ProvinceRecord[]> {
    const existing = await this.getAll();
    if (existing.length > 0) return existing;

    const afghanistanProvinces = [
      { name: "Kabul", nameDari: "کابل", namePashto: "کابل" },
      { name: "Herat", nameDari: "هرات", namePashto: "هرات" },
      { name: "Balkh", nameDari: "بلخ", namePashto: "بلخ" },
      { name: "Kandahar", nameDari: "قندهار", namePashto: "کندهار" },
      { name: "Nangarhar", nameDari: "ننگرهار", namePashto: "ننګرهار" },
      { name: "Baghlan", nameDari: "بغلان", namePashto: "بغلان" },
      { name: "Kunduz", nameDari: "کندز", namePashto: "کندوز" },
      { name: "Takhar", nameDari: "تخار", namePashto: "تخار" },
      { name: "Badakhshan", nameDari: "بدخشان", namePashto: "بدخشان" },
      { name: "Ghazni", nameDari: "غزنی", namePashto: "غزني" },
      { name: "Parwan", nameDari: "پروان", namePashto: "پروان" },
      { name: "Bamyan", nameDari: "بامیان", namePashto: "بامیان" },
      { name: "Paktia", nameDari: "پکتیا", namePashto: "پکتیا" },
      { name: "Paktika", nameDari: "پکتیکا", namePashto: "پکتیکا" },
      { name: "Khost", nameDari: "خوست", namePashto: "خوست" },
      { name: "Logar", nameDari: "لوگر", namePashto: "لوګر" },
      { name: "Wardak", nameDari: "وردک", namePashto: "وردګ" },
      { name: "Kapisa", nameDari: "کاپیسا", namePashto: "کاپیسا" },
      { name: "Laghman", nameDari: "لغمان", namePashto: "لغمان" },
      { name: "Kunar", nameDari: "کنر", namePashto: "کنړ" },
      { name: "Nuristan", nameDari: "نورستان", namePashto: "نورستان" },
      { name: "Panjshir", nameDari: "پنجشیر", namePashto: "پنجشیر" },
      { name: "Samangan", nameDari: "سمنگان", namePashto: "سمنګان" },
      { name: "Sar-e Pol", nameDari: "سرپل", namePashto: "سرپل" },
      { name: "Jowzjan", nameDari: "جوزجان", namePashto: "جوزجان" },
      { name: "Faryab", nameDari: "فاریاب", namePashto: "فاریاب" },
      { name: "Badghis", nameDari: "بادغیس", namePashto: "بادغیس" },
      { name: "Ghor", nameDari: "غور", namePashto: "غور" },
      { name: "Daykundi", nameDari: "دایکندی", namePashto: "دایکندي" },
      { name: "Uruzgan", nameDari: "ارزگان", namePashto: "اروزګان" },
      { name: "Zabul", nameDari: "زابل", namePashto: "زابل" },
      { name: "Helmand", nameDari: "هلمند", namePashto: "هلمند" },
      { name: "Farah", nameDari: "فراه", namePashto: "فراه" },
      { name: "Nimroz", nameDari: "نیمروز", namePashto: "نیمروز" },
    ];

    const results: ProvinceRecord[] = [];
    for (const province of afghanistanProvinces) {
      const created = await this.create(province);
      results.push(created);
    }

    console.log("Seeded provinces:", results.length);
    return results;
  },
};

// ========== LEGACY BACKWARD COMPATIBILITY ==========

/**
 * Legacy job requisitions (backward compatibility)
 * Maps to jobRequisitions store
 */
const jobRequisitionsCRUD = createCRUDService<JobRequisitionRecord>('jobRequisitions');

export const jobRequisitionDB = {
  ...jobRequisitionsCRUD,

  /**
   * Get requisitions by department
   */
  async getByDepartment(department: string): Promise<JobRequisitionRecord[]> {
    return jobRequisitionsCRUD.getByIndex('department', department);
  },

  /**
   * Get requisitions by status
   */
  async getByStatus(status: string): Promise<JobRequisitionRecord[]> {
    return jobRequisitionsCRUD.getByIndex('status', status);
  },

  /**
   * Get requisitions by priority
   */
  async getByPriority(priority: string): Promise<JobRequisitionRecord[]> {
    return jobRequisitionsCRUD.getByIndex('priority', priority);
  },
};

/**
 * Legacy job announcements (backward compatibility)
 * Maps to jobAnnouncements store
 */
const jobAnnouncementsCRUD = createCRUDService<JobAnnouncementRecord>('jobAnnouncements');

export const jobAnnouncementDB = {
  ...jobAnnouncementsCRUD,

  /**
   * Get announcements by requisition ID
   */
  async getByRequisition(requisitionId: number): Promise<JobAnnouncementRecord[]> {
    return jobAnnouncementsCRUD.getByIndex('requisitionId', requisitionId);
  },

  /**
   * Get announcements by status
   */
  async getByStatus(status: string): Promise<JobAnnouncementRecord[]> {
    return jobAnnouncementsCRUD.getByIndex('status', status);
  },
};

/**
 * Legacy job offers (backward compatibility)
 * Maps to jobOffers store
 */
const jobOffersCRUD = createCRUDService<JobOfferRecord>('jobOffers');

export const jobOfferDB = {
  ...jobOffersCRUD,

  /**
   * Get offers by candidate ID
   */
  async getByCandidate(candidateId: number): Promise<JobOfferRecord[]> {
    return jobOffersCRUD.getByIndex('candidateId', candidateId);
  },

  /**
   * Get offers by requisition ID
   */
  async getByRequisition(requisitionId: number): Promise<JobOfferRecord[]> {
    return jobOffersCRUD.getByIndex('requisitionId', requisitionId);
  },

  /**
   * Get offers by status
   */
  async getByStatus(status: string): Promise<JobOfferRecord[]> {
    return jobOffersCRUD.getByIndex('status', status);
  },
};

/**
 * Legacy probation evaluations (backward compatibility)
 * Maps to probationEvaluations store
 */
const probationEvaluationsCRUD = createCRUDService<ProbationEvaluationRecord>('probationEvaluations');

export const probationEvaluationDB = {
  ...probationEvaluationsCRUD,

  /**
   * Get evaluations by probation record ID
   */
  async getByProbationRecord(probationRecordId: number): Promise<ProbationEvaluationRecord[]> {
    return probationEvaluationsCRUD.getByIndex('probationRecordId', probationRecordId);
  },

  /**
   * Get evaluations by employee ID
   */
  async getByEmployee(employeeId: number): Promise<ProbationEvaluationRecord[]> {
    return probationEvaluationsCRUD.getByIndex('employeeId', employeeId);
  },

  /**
   * Get evaluations by status
   */
  async getByStatus(status: string): Promise<ProbationEvaluationRecord[]> {
    return probationEvaluationsCRUD.getByIndex('status', status);
  },
};

/**
 * Legacy test results (backward compatibility)
 * Maps to testResults store
 */
const testResultsCRUD = createCRUDService<TestResultRecord>('testResults');

export const testResultDB = {
  ...testResultsCRUD,

  /**
   * Get results by written test ID
   */
  async getByWrittenTest(writtenTestId: number): Promise<TestResultRecord[]> {
    return testResultsCRUD.getByIndex('writtenTestId', writtenTestId);
  },

  /**
   * Get results by candidate ID
   */
  async getByCandidate(candidateId: number): Promise<TestResultRecord[]> {
    return testResultsCRUD.getByIndex('candidateId', candidateId);
  },
};

/**
 * Legacy reference checks (backward compatibility)
 * Maps to referenceChecks store
 */
const referenceChecksCRUD = createCRUDService<ReferenceCheckRecord>('referenceChecks');

export const referenceCheckDB = {
  ...referenceChecksCRUD,

  /**
   * Get reference checks by candidate ID
   */
  async getByCandidate(candidateId: number): Promise<ReferenceCheckRecord[]> {
    return referenceChecksCRUD.getByIndex('candidateId', candidateId);
  },

  /**
   * Get reference checks by recruitment ID
   */
  async getByRecruitment(recruitmentId: number): Promise<ReferenceCheckRecord[]> {
    return referenceChecksCRUD.getByIndex('recruitmentId', recruitmentId);
  },

  /**
   * Get reference checks by status
   */
  async getByStatus(status: string): Promise<ReferenceCheckRecord[]> {
    return referenceChecksCRUD.getByIndex('status', status);
  },
};

/**
 * Legacy shortlisting scores (backward compatibility)
 * Maps to shortlistingScores store
 */
const shortlistingScoresCRUD = createCRUDService<ShortlistingScoreRecord>('shortlistingScores');

export const shortlistingScoreDB = {
  ...shortlistingScoresCRUD,

  /**
   * Get scores by candidate application ID
   */
  async getByCandidateApplication(candidateApplicationId: number): Promise<ShortlistingScoreRecord[]> {
    return shortlistingScoresCRUD.getByIndex('candidateApplicationId', candidateApplicationId);
  },

  /**
   * Get scores by recruitment ID
   */
  async getByRecruitment(recruitmentId: number): Promise<ShortlistingScoreRecord[]> {
    return shortlistingScoresCRUD.getByIndex('recruitmentId', recruitmentId);
  },
};

/**
 * Legacy backward compatibility aliases
 * Maps old naming conventions to existing services
 */
export const recruitmentCommitteeDB = committeeDB;
export const committeeMemberDB = memberDB;
export const sanctionClearanceDB = sanctionDB;

// ========== DEFAULT EXPORT ==========

export default {
  recruitmentDB,
  torDB,
  srfDB,
  vacancyDB,
  candidateDB,
  applicationDB,
  educationDB,
  experienceDB,
  committeeDB,
  memberDB,
  coiDB,
  longlistingDB,
  longlistingCandidateDB,
  shortlistingDB,
  shortlistingCandidateDB,
  writtenTestDB,
  writtenTestCandidateDB,
  interviewDB,
  interviewCandidateDB,
  evaluationDB,
  interviewResultDB,
  reportDB,
  offerDB,
  sanctionDB,
  backgroundCheckDB,
  contractDB,
  checklistDB,
  provincesDB,
};
