/**
 * Recruitment Seeding Service
 *
 * Seeds a complete recruitment process with all 15 steps filled in.
 * This allows you to see how the entire recruitment workflow operates.
 */

import {
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
  RECRUITMENT_STATUS,
  TOR_STATUS,
  SRF_STATUS,
  HIRING_APPROACH,
  CONTRACT_TYPE,
  EDUCATION_LEVEL,
  ANNOUNCEMENT_METHOD,
  COMMITTEE_ROLE,
  COI_DECISION,
  APPLICATION_STATUS,
  RECOMMENDATION,
} from './recruitmentService';

import type { RecruitmentRecord, CandidateRecord } from '../../types/modules/recruitment';

interface CandidateData {
  fullName: string;
  fatherName: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  email: string;
  phone: string;
  province: string;
  education: string;
  experienceYears: number;
  score: number;
}

interface SeedResult {
  recruitment: RecruitmentRecord;
  topCandidate: CandidateRecord;
  stats: {
    totalApplications: number;
    longlisted: number;
    shortlisted: number;
    tested: number;
    interviewed: number;
  };
}

/**
 * Seeds a complete recruitment process with all 15 steps filled in
 * This allows you to see how the entire recruitment workflow operates
 */
export const seedCompleteRecruitment = async (): Promise<SeedResult> => {
  console.log('Starting complete recruitment seed...');

  try {
    // ============================================
    // STEP 1: TOR Development
    // ============================================
    console.log('Step 1: Creating TOR...');
    const recruitment = await recruitmentDB.create({
      recruitmentCode: `REC-${Date.now()}`,
      positionTitle: 'Senior Program Manager',
      department: 'Programs',
      numberOfPositions: 1,
      hiringApproach: HIRING_APPROACH.OPEN_COMPETITION,
      contractType: CONTRACT_TYPE.CORE,
      status: RECRUITMENT_STATUS.DRAFT,
      currentStep: 1,
    });

    const tor = await torDB.create({
      recruitmentId: recruitment.id,
      positionTitle: 'Senior Program Manager',
      department: 'Programs',
      reportsTo: 'Country Director',
      location: 'Kabul, Afghanistan',
      purpose:
        'Lead and coordinate all program activities ensuring quality implementation and compliance with donor requirements.',
      responsibilities: JSON.stringify([
        'Oversee implementation of all program activities',
        'Manage program budget and financial reporting',
        'Coordinate with partners and stakeholders',
        'Ensure compliance with donor regulations',
        'Supervise program staff and provide technical guidance',
      ]),
      requiredEducation: EDUCATION_LEVEL.MASTERS,
      requiredExperience: 5,
      skills: JSON.stringify([
        'Project management',
        'Budget management',
        'Report writing',
        'Donor compliance',
        'Team leadership',
      ]),
      languages: JSON.stringify([
        { language: 'English', level: 'Fluent' },
        { language: 'Dari', level: 'Fluent' },
        { language: 'Pashto', level: 'Good' },
      ]),
      status: TOR_STATUS.APPROVED,
      approvedBy: 'Country Director',
      approvedAt: new Date().toISOString(),
    });

    // ============================================
    // STEP 2: Staff Requisition Form
    // ============================================
    console.log('Step 2: Creating SRF...');
    await srfDB.create({
      recruitmentId: recruitment.id,
      requestedBy: 'Program Director',
      requestedAt: new Date().toISOString(),
      positionTitle: 'Senior Program Manager',
      department: 'Programs',
      numberOfPositions: 1,
      justification:
        'Expansion of program activities requires dedicated senior management to ensure quality and compliance.',
      budgetCode: 'PROG-2025-001',
      budgetAmount: 36000,
      currency: 'USD',
      hrVerified: true,
      hrVerifiedBy: 'HR Manager',
      hrVerifiedAt: new Date().toISOString(),
      budgetVerified: true,
      budgetVerifiedBy: 'Finance Manager',
      budgetVerifiedAt: new Date().toISOString(),
      status: SRF_STATUS.APPROVED,
      approvedBy: 'Country Director',
      approvedAt: new Date().toISOString(),
    });

    // ============================================
    // STEP 3: Requisition Review (Auto-approved)
    // ============================================
    console.log('Step 3: Requisition Review completed');

    // ============================================
    // STEP 4: Vacancy Announcement
    // ============================================
    console.log('Step 4: Creating Vacancy Announcement...');
    await vacancyDB.create({
      recruitmentId: recruitment.id,
      title: 'Senior Program Manager',
      description:
        'VDO Afghanistan is seeking a qualified Senior Program Manager to lead program implementation.',
      requirements: JSON.stringify({
        education: `${tor.requiredEducation} in International Development`,
        experience: `${tor.requiredExperience} years of relevant experience`,
        skills: JSON.parse(tor.skills as string),
        languages: JSON.parse(tor.languages as string),
      }),
      benefits: JSON.stringify(['Health insurance', 'Annual leave (30 days)', 'Professional development opportunities']),
      announcementMethod: ANNOUNCEMENT_METHOD.ACBAR,
      announcementDate: new Date().toISOString().split('T')[0],
      closingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      status: 'published',
      viewsCount: 0,
      publishedAt: new Date().toISOString(),
    });

    // ============================================
    // STEP 5: Application Receipt
    // ============================================
    console.log('Step 5: Creating Candidates and Applications...');

    const candidatesData: CandidateData[] = [
      {
        fullName: 'Ahmad Khalil',
        fatherName: 'Abdul Khalil',
        gender: 'male',
        dateOfBirth: '1988-03-15',
        email: 'ahmad.khalil@example.com',
        phone: '+93 700 111 222',
        province: 'Kabul',
        education: EDUCATION_LEVEL.MASTERS,
        experienceYears: 6,
        score: 85,
      },
      {
        fullName: 'Fatima Ahmadi',
        fatherName: 'Mohammad Ahmadi',
        gender: 'female',
        dateOfBirth: '1990-07-22',
        email: 'fatima.ahmadi@example.com',
        phone: '+93 700 222 333',
        province: 'Herat',
        education: EDUCATION_LEVEL.MASTERS,
        experienceYears: 5,
        score: 82,
      },
      {
        fullName: 'Hassan Karimi',
        fatherName: 'Ali Karimi',
        gender: 'male',
        dateOfBirth: '1987-11-10',
        email: 'hassan.karimi@example.com',
        phone: '+93 700 333 444',
        province: 'Balkh',
        education: EDUCATION_LEVEL.MASTERS,
        experienceYears: 7,
        score: 88,
      },
      {
        fullName: 'Mariam Nouri',
        fatherName: 'Noor Nouri',
        gender: 'female',
        dateOfBirth: '1991-05-18',
        email: 'mariam.nouri@example.com',
        phone: '+93 700 444 555',
        province: 'Kabul',
        education: EDUCATION_LEVEL.MASTERS,
        experienceYears: 4,
        score: 75,
      },
      {
        fullName: 'Rashid Qasimi',
        fatherName: 'Qasim Qasimi',
        gender: 'male',
        dateOfBirth: '1989-09-25',
        email: 'rashid.qasimi@example.com',
        phone: '+93 700 555 666',
        province: 'Nangarhar',
        education: EDUCATION_LEVEL.BACHELORS,
        experienceYears: 3,
        score: 55,
      },
    ];

    interface ApplicationWithCandidate {
      id: number;
      candidate: CandidateRecord;
      score: number;
      [key: string]: unknown;
    }

    const applications: ApplicationWithCandidate[] = [];
    for (const candData of candidatesData) {
      const candidate = await candidateDB.create({
        candidateCode: `CAND-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        fullName: candData.fullName,
        fatherName: candData.fatherName,
        gender: candData.gender,
        dateOfBirth: candData.dateOfBirth,
        email: candData.email,
        phone: candData.phone,
        address: `${candData.province}, Afghanistan`,
        province: candData.province,
      });

      const application = await applicationDB.create({
        applicationCode: `APP-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        recruitmentId: recruitment.id,
        candidateId: candidate.id,
        applicationDate: new Date().toISOString().split('T')[0],
        status: APPLICATION_STATUS.RECEIVED,
      }, recruitment.recruitmentCode);

      // Add education
      await educationDB.create({
        candidateId: candidate.id,
        level: candData.education as typeof EDUCATION_LEVEL[keyof typeof EDUCATION_LEVEL],
        degree: candData.education === EDUCATION_LEVEL.MASTERS ? 'Master of Arts' : 'Bachelor of Arts',
        fieldOfStudy: 'International Development',
        institution: 'Kabul University',
        endDate: '2015-06-30',
      });

      // Add experience
      await experienceDB.create({
        candidateId: candidate.id,
        jobTitle: 'Program Officer',
        organization: 'International NGO',
        startDate: '2018-01-01',
        endDate: '2024-12-31',
        isCurrent: false,
        responsibilities: 'Managed program activities',
      });

      applications.push({
        ...application,
        candidate,
        score: candData.score,
      });
    }

    // ============================================
    // STEP 6: Committee Formation
    // ============================================
    console.log('Step 6: Creating Recruitment Committee...');
    const committee = await committeeDB.create({
      recruitmentId: recruitment.id,
      name: 'Senior Program Manager Recruitment Committee',
      formedDate: new Date().toISOString().split('T')[0],
      status: 'active',
    });

    const members = [
      { name: 'HR Manager', role: COMMITTEE_ROLE.HR_REPRESENTATIVE },
      { name: 'Program Director', role: COMMITTEE_ROLE.TECHNICAL_EXPERT },
      { name: 'Finance Manager', role: COMMITTEE_ROLE.ADDITIONAL },
    ];

    for (const memberData of members) {
      const member = await memberDB.create({
        committeeId: committee.id,
        memberName: memberData.name,
        role: memberData.role,
      });

      // COI Declaration
      await coiDB.create({
        recruitmentId: recruitment.id,
        committeeMemberId: member.id,
        declarationDate: new Date().toISOString().split('T')[0],
        hasConflict: false,
        hrDecision: COI_DECISION.NO_CONFLICT,
        hrReviewedBy: 'HR Manager',
        hrReviewedAt: new Date().toISOString(),
      });
    }

    // ============================================
    // STEP 7: Longlisting
    // ============================================
    console.log('Step 7: Performing Longlisting...');
    const longlisting = await longlistingDB.create({
      recruitmentId: recruitment.id,
      conductedDate: new Date().toISOString().split('T')[0],
      conductedBy: 'Recruitment Committee',
      status: 'pending',
      totalApplications: applications.length,
      totalLonglisted: 0,
    });

    let longlistedCount = 0;
    for (const app of applications) {
      const isLonglisted = app.score >= 70; // 4 out of 5 pass
      await longlistingCandidateDB.create({
        longlistingId: longlisting.id,
        candidateApplicationId: app.id,
        isLonglisted,
        reason: isLonglisted ? 'Meets minimum requirements' : 'Does not meet minimum requirements',
      });

      if (isLonglisted) {
        longlistedCount++;
        await applicationDB.update(app.id, { status: APPLICATION_STATUS.LONGLISTED });
      }
    }

    await longlistingDB.update(longlisting.id, {
      status: 'completed',
      totalLonglisted: longlistedCount
    });

    // ============================================
    // STEP 8: Shortlisting
    // ============================================
    console.log('Step 8: Performing Shortlisting...');
    const shortlisting = await shortlistingDB.create({
      recruitmentId: recruitment.id,
      conductedDate: new Date().toISOString().split('T')[0],
      conductedBy: 'Recruitment Committee',
      status: 'pending',
      academicWeight: 0.2,
      experienceWeight: 0.3,
      otherWeight: 0.5,
      passingScore: 60,
    });

    const longlistedApps = applications.filter((a) => a.score >= 70);
    for (const app of longlistedApps) {
      const academicScore = Math.min(app.score, 100);
      const experienceScore = Math.min(app.score - 5, 100);
      const otherScore = Math.min(app.score + 5, 100);
      const totalScore = academicScore * 0.2 + experienceScore * 0.3 + otherScore * 0.5;

      await shortlistingCandidateDB.create({
        shortlistingId: shortlisting.id,
        candidateApplicationId: app.id,
        academicScore,
        experienceScore,
        otherCriteriaScore: otherScore,
        totalScore,
        isShortlisted: totalScore >= 60,
      }, shortlisting);

      if (totalScore >= 60) {
        await applicationDB.update(app.id, { status: APPLICATION_STATUS.SHORTLISTED });
      }
    }

    await shortlistingDB.update(shortlisting.id, { status: 'completed' });

    // ============================================
    // STEP 9: Written Test
    // ============================================
    console.log('Step 9: Conducting Written Test...');
    const writtenTest = await writtenTestDB.create({
      recruitmentId: recruitment.id,
      testDate: new Date().toISOString().split('T')[0],
      venue: 'VDO Office',
      totalMarks: 100,
      passingMarks: 50,
      testWeight: 0.5,
      status: 'scheduled',
    });

    const shortlistedApps = applications.filter((a) => a.score >= 70);
    for (const app of shortlistedApps) {
      const marks = Math.max(40, Math.min(app.score, 95));
      await writtenTestCandidateDB.create({
        writtenTestId: writtenTest.id,
        candidateApplicationId: app.id,
        uniqueCode: `WT-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        attended: true,
        attendanceTime: new Date().toISOString(),
        marksObtained: marks,
        isPassed: marks >= 50,
      });

      if (marks >= 50) {
        await applicationDB.update(app.id, { status: APPLICATION_STATUS.TESTED });
      }
    }

    await writtenTestDB.update(writtenTest.id, { status: 'evaluated' });

    // ============================================
    // STEP 10: Interview
    // ============================================
    console.log('Step 10: Conducting Interviews...');
    const interview = await interviewDB.create({
      recruitmentId: recruitment.id,
      interviewDate: new Date().toISOString().split('T')[0],
      venue: 'VDO Conference Room',
      totalMarks: 100,
      passingMarks: 50,
      interviewWeight: 0.5,
      status: 'scheduled',
    });

    const passedTestApps = applications.filter((a) => a.score >= 75); // Top 3
    for (const app of passedTestApps) {
      const intCandidate = await interviewCandidateDB.create({
        interviewId: interview.id,
        candidateApplicationId: app.id,
        attended: true,
        attendanceTime: new Date().toISOString(),
      });

      // Committee members evaluate
      let totalEvalScore = 0;
      for (let i = 0; i < 3; i++) {
        const baseScore = Math.floor(app.score / 20);
        const techScore = Math.min(5, baseScore);
        const commScore = Math.min(5, baseScore);
        const probScore = Math.min(5, baseScore - 1);
        const expScore = Math.min(5, baseScore);
        const fitScore = Math.min(5, baseScore);
        const evalTotalScore = techScore + commScore + probScore + expScore + fitScore;
        totalEvalScore += evalTotalScore;

        await evaluationDB.create({
          interviewCandidateId: intCandidate.id,
          evaluatorId: i + 1,
          evaluatorName: members[i].name,
          technicalKnowledgeScore: techScore,
          communicationScore: commScore,
          problemSolvingScore: probScore,
          experienceRelevanceScore: expScore,
          culturalFitScore: fitScore,
          totalScore: evalTotalScore,
          recommendation:
            app.score >= 85 ? RECOMMENDATION.STRONGLY_RECOMMEND : RECOMMENDATION.RECOMMEND,
          comments: 'Strong candidate with relevant experience',
          evaluatedAt: new Date().toISOString(),
        });
      }

      // Calculate results
      const avgScore = totalEvalScore / 3;
      await interviewResultDB.create({
        interviewCandidateId: intCandidate.id,
        averageScore: avgScore,
        writtenTestScore: app.score,
        combinedScore: (avgScore + app.score) / 2,
      });

      await applicationDB.update(app.id, { status: APPLICATION_STATUS.INTERVIEWED });
    }

    await interviewDB.update(interview.id, { status: 'evaluated' });

    // ============================================
    // STEP 11: Recruitment Report
    // ============================================
    console.log('Step 11: Creating Recruitment Report...');
    await reportDB.create({
      recruitmentId: recruitment.id,
      reportNumber: `RPT-${Date.now()}`,
      title: 'Senior Program Manager Recruitment Report',
      summary: `The recruitment process for Senior Program Manager position was conducted. We received ${applications.length} applications, longlisted ${longlistedApps.length}, shortlisted ${shortlistedApps.length}, and interviewed ${passedTestApps.length} candidates.`,
      methodology: 'Standard recruitment process followed with TOR, SRF, public announcement, screening, written test, and interviews.',
      findings: `Top candidate: ${applications[2].candidate.fullName} with combined score of ${applications[2].score}. All candidates demonstrated strong qualifications.`,
      recommendations: `We recommend hiring ${applications[2].candidate.fullName} for the Senior Program Manager position.`,
      selectedCandidates: JSON.stringify([
        { name: applications[2].candidate.fullName, rank: 1, score: applications[2].score },
        { name: applications[0].candidate.fullName, rank: 2, score: applications[0].score },
        { name: applications[1].candidate.fullName, rank: 3, score: applications[1].score },
      ]),
      status: 'approved',
      preparedBy: 'Recruitment Committee',
      preparedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      approvedBy: 'Country Director',
      approvedAt: new Date().toISOString(),
    });

    // ============================================
    // STEP 12: Conditional Offer
    // ============================================
    console.log('Step 12: Sending Offer Letter...');
    const topCandidate = applications[2]; // Highest score
    await offerDB.create({
      recruitmentId: recruitment.id,
      candidateApplicationId: topCandidate.id,
      offerDate: new Date().toISOString().split('T')[0],
      position: 'Senior Program Manager',
      department: 'Programs',
      salary: 3000,
      currency: 'USD',
      benefits: JSON.stringify([
        'Health insurance',
        'Annual leave',
        'Professional development',
      ]),
      startDate: '2025-02-01',
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      conditions: JSON.stringify([
        'Satisfactory reference checks',
        'Sanction list clearance',
        'Background verification',
      ]),
      status: 'accepted',
      sentAt: new Date().toISOString(),
      respondedAt: new Date().toISOString(),
    });

    await applicationDB.update(topCandidate.id, { status: APPLICATION_STATUS.OFFERED });

    // ============================================
    // STEP 13: Sanction Clearance
    // ============================================
    console.log('Step 13: Performing Sanction Clearance...');
    await sanctionDB.create({
      recruitmentId: recruitment.id,
      candidateApplicationId: topCandidate.id,
      declarationDate: new Date().toISOString().split('T')[0],
      candidateName: topCandidate.candidate.fullName,
      dateOfBirth: topCandidate.candidate.dateOfBirth,
      status: 'cleared',
      checkedDate: new Date().toISOString().split('T')[0],
      verifiedBy: 'Compliance Officer',
      verifiedAt: new Date().toISOString(),
      notes: 'No matches found on UN, OFAC, or EU sanctions lists',
    });

    // ============================================
    // STEP 14: Background Checks
    // ============================================
    console.log('Step 14: Conducting Background Checks...');
    await backgroundCheckDB.create({
      recruitmentId: recruitment.id,
      candidateApplicationId: topCandidate.id,
      referenceCheck1Status: 'verified',
      referenceCheck1Notes: 'Excellent performer - Previous Employer',
      referenceCheck2Status: 'verified',
      referenceCheck2Notes: 'Outstanding student - Academic Supervisor',
      guaranteeLetterStatus: 'received',
      guaranteeLetterNotes: 'Received from father Abdul Khalil',
      addressVerificationStatus: 'verified',
      addressVerificationNotes: 'Address verified by field officer',
      criminalRecordStatus: 'clear',
      criminalRecordNotes: 'No criminal record found',
      overallStatus: 'completed',
      verifiedBy: 'HR Manager',
      completedAt: new Date().toISOString(),
    });

    // ============================================
    // STEP 15: Employment Contract
    // ============================================
    console.log('Step 15: Creating Employment Contract...');
    await contractDB.create({
      recruitmentId: recruitment.id,
      candidateApplicationId: topCandidate.id,
      contractNumber: `CON-${Date.now()}`,
      position: 'Senior Program Manager',
      department: 'Programs',
      grade: 'Senior',
      salary: 3000,
      currency: 'USD',
      startDate: '2025-02-01',
      endDate: '2026-01-31',
      contractType: CONTRACT_TYPE.CORE,
      probationPeriodMonths: 3,
      status: 'active',
      employeeSignedAt: new Date().toISOString(),
      employerSignedAt: new Date().toISOString(),
      employerSignatoryId: 1,
    });

    await applicationDB.update(topCandidate.id, { status: APPLICATION_STATUS.HIRED });

    // ============================================
    // File Checklist
    // ============================================
    console.log('Creating File Checklist...');
    await checklistDB.create({
      recruitmentId: recruitment.id,
      torAttached: true,
      srfAttached: true,
      shortlistFormAttached: true,
      rcFormAttached: true,
      writtenTestPapersAttached: true,
      interviewFormsAttached: true,
      interviewResultAttached: true,
      recruitmentReportAttached: true,
      offerLetterAttached: true,
      sanctionClearanceAttached: true,
      referenceChecksAttached: true,
      guaranteeLetterAttached: true,
      addressVerificationAttached: true,
      criminalCheckAttached: true,
      contractAttached: true,
      personalInfoFormAttached: true,
      status: 'complete',
      verifiedBy: 'HR Manager',
      verifiedAt: new Date().toISOString(),
    });

    // Mark recruitment as completed
    await recruitmentDB.update(recruitment.id, {
      status: RECRUITMENT_STATUS.COMPLETED,
      currentStep: 15,
    });

    console.log('Complete recruitment seeded successfully!');
    console.log(`Recruitment Code: ${recruitment.recruitmentCode}`);
    console.log(`Hired Candidate: ${topCandidate.candidate.fullName}`);
    console.log(`Total Applications: ${applications.length}`);
    console.log(`Longlisted: ${longlistedApps.length}`);
    console.log(`Shortlisted: ${shortlistedApps.length}`);
    console.log(`Tested: ${shortlistedApps.length}`);
    console.log(`Interviewed: ${passedTestApps.length}`);

    return {
      recruitment,
      topCandidate: topCandidate.candidate,
      stats: {
        totalApplications: applications.length,
        longlisted: longlistedApps.length,
        shortlisted: shortlistedApps.length,
        tested: shortlistedApps.length,
        interviewed: passedTestApps.length,
      },
    };
  } catch (error) {
    console.error('Error seeding recruitment:', error);
    throw error;
  }
};

// Extend Window interface for global access
declare global {
  interface Window {
    seedCompleteRecruitment: typeof seedCompleteRecruitment;
  }
}

// Make it globally available for easy testing
if (typeof window !== 'undefined') {
  window.seedCompleteRecruitment = seedCompleteRecruitment;
}

export default seedCompleteRecruitment;
