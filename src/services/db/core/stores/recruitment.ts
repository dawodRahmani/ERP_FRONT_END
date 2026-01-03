/**
 * Recruitment Module Object Stores
 *
 * Creates stores for 15-step recruitment workflow system.
 * Covers: TOR, SRF, Vacancy, Applications, Committee, Testing, Interviews, Offers, Contracts
 * 30+ stores total
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '../../../../types/db/stores';

/**
 * Create all recruitment-related object stores
 */
export function createRecruitmentStores(db: IDBPDatabase<VDODatabase>): void {
  // Job Requisitions store (Legacy support)
  if (!db.objectStoreNames.contains('jobRequisitions')) {
    const store = db.createObjectStore('jobRequisitions', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('requisitionId', 'requisitionId', { unique: true });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('department', 'department', { unique: false });
    store.createIndex('priority', 'priority', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
    console.log('Created store: jobRequisitions');
  }

  // Job Announcements store (Legacy support)
  if (!db.objectStoreNames.contains('jobAnnouncements')) {
    const store = db.createObjectStore('jobAnnouncements', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('requisitionId', 'requisitionId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('closingDate', 'closingDate', { unique: false });
    console.log('Created store: jobAnnouncements');
  }

  // Job Offers store (Legacy support)
  if (!db.objectStoreNames.contains('jobOffers')) {
    const store = db.createObjectStore('jobOffers', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('candidateId', 'candidateId', { unique: false });
    store.createIndex('requisitionId', 'requisitionId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: jobOffers');
  }

  // Test Results store
  if (!db.objectStoreNames.contains('testResults')) {
    const store = db.createObjectStore('testResults', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('writtenTestId', 'writtenTestId', { unique: false });
    store.createIndex('candidateId', 'candidateId', { unique: false });
    console.log('Created store: testResults');
  }

  // Reference Checks store
  if (!db.objectStoreNames.contains('referenceChecks')) {
    const store = db.createObjectStore('referenceChecks', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('candidateId', 'candidateId', { unique: false });
    store.createIndex('recruitmentId', 'recruitmentId', { unique: false });
    console.log('Created store: referenceChecks');
  }

  // Shortlisting Scores store
  if (!db.objectStoreNames.contains('shortlistingScores')) {
    const store = db.createObjectStore('shortlistingScores', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('candidateApplicationId', 'candidateApplicationId', { unique: false });
    store.createIndex('recruitmentId', 'recruitmentId', { unique: false });
    console.log('Created store: shortlistingScores');
  }

  // Probation Evaluations store
  if (!db.objectStoreNames.contains('probationEvaluations')) {
    const store = db.createObjectStore('probationEvaluations', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('probationRecordId', 'probationRecordId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    console.log('Created store: probationEvaluations');
  }

  // Recruitments store (Main table)
  if (!db.objectStoreNames.contains('recruitments')) {
    const store = db.createObjectStore('recruitments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('recruitmentCode', 'recruitmentCode', { unique: true });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('currentStep', 'currentStep', { unique: false });
    store.createIndex('department', 'department', { unique: false });
    store.createIndex('createdAt', 'createdAt', { unique: false });
    console.log('Created store: recruitments');
  }

  // Terms of References store
  if (!db.objectStoreNames.contains('termsOfReferences')) {
    const store = db.createObjectStore('termsOfReferences', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('recruitmentId', 'recruitmentId', { unique: true });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: termsOfReferences');
  }

  // Staff Requisitions store
  if (!db.objectStoreNames.contains('staffRequisitions')) {
    const store = db.createObjectStore('staffRequisitions', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('recruitmentId', 'recruitmentId', { unique: true });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: staffRequisitions');
  }

  // Vacancy Announcements store
  if (!db.objectStoreNames.contains('vacancyAnnouncements')) {
    const store = db.createObjectStore('vacancyAnnouncements', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('recruitmentId', 'recruitmentId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('closingDate', 'closingDate', { unique: false });
    console.log('Created store: vacancyAnnouncements');
  }

  // Recruitment Candidates store
  if (!db.objectStoreNames.contains('recruitmentCandidates')) {
    const store = db.createObjectStore('recruitmentCandidates', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('candidateCode', 'candidateCode', { unique: true });
    store.createIndex('email', 'email', { unique: false });
    store.createIndex('phone', 'phone', { unique: false });
    console.log('Created store: recruitmentCandidates');
  }

  // Candidate Applications store
  if (!db.objectStoreNames.contains('candidateApplications')) {
    const store = db.createObjectStore('candidateApplications', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('applicationCode', 'applicationCode', { unique: true });
    store.createIndex('recruitmentId', 'recruitmentId', { unique: false });
    store.createIndex('candidateId', 'candidateId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: candidateApplications');
  }

  // Candidate Educations store
  if (!db.objectStoreNames.contains('candidateEducations')) {
    const store = db.createObjectStore('candidateEducations', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('candidateId', 'candidateId', { unique: false });
    console.log('Created store: candidateEducations');
  }

  // Candidate Experiences store
  if (!db.objectStoreNames.contains('candidateExperiences')) {
    const store = db.createObjectStore('candidateExperiences', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('candidateId', 'candidateId', { unique: false });
    console.log('Created store: candidateExperiences');
  }

  // Recruitment Committees store
  if (!db.objectStoreNames.contains('recruitmentCommittees')) {
    const store = db.createObjectStore('recruitmentCommittees', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('recruitmentId', 'recruitmentId', { unique: true });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: recruitmentCommittees');
  }

  // Committee Members store
  if (!db.objectStoreNames.contains('committeeMembers')) {
    const store = db.createObjectStore('committeeMembers', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('committeeId', 'committeeId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    console.log('Created store: committeeMembers');
  }

  // COI Declarations store
  if (!db.objectStoreNames.contains('coiDeclarations')) {
    const store = db.createObjectStore('coiDeclarations', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('committeeMemberId', 'committeeMemberId', { unique: false });
    store.createIndex('recruitmentId', 'recruitmentId', { unique: false });
    console.log('Created store: coiDeclarations');
  }

  // Longlistings store
  if (!db.objectStoreNames.contains('longlistings')) {
    const store = db.createObjectStore('longlistings', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('recruitmentId', 'recruitmentId', { unique: true });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: longlistings');
  }

  // Longlisting Candidates store
  if (!db.objectStoreNames.contains('longlistingCandidates')) {
    const store = db.createObjectStore('longlistingCandidates', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('longlistingId', 'longlistingId', { unique: false });
    store.createIndex('candidateApplicationId', 'candidateApplicationId', { unique: false });
    console.log('Created store: longlistingCandidates');
  }

  // Shortlistings store
  if (!db.objectStoreNames.contains('shortlistings')) {
    const store = db.createObjectStore('shortlistings', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('recruitmentId', 'recruitmentId', { unique: true });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: shortlistings');
  }

  // Shortlisting Candidates store
  if (!db.objectStoreNames.contains('shortlistingCandidates')) {
    const store = db.createObjectStore('shortlistingCandidates', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('shortlistingId', 'shortlistingId', { unique: false });
    store.createIndex('candidateApplicationId', 'candidateApplicationId', { unique: false });
    console.log('Created store: shortlistingCandidates');
  }

  // Written Tests store
  if (!db.objectStoreNames.contains('writtenTests')) {
    const store = db.createObjectStore('writtenTests', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('recruitmentId', 'recruitmentId', { unique: true });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: writtenTests');
  }

  // Written Test Candidates store
  if (!db.objectStoreNames.contains('writtenTestCandidates')) {
    const store = db.createObjectStore('writtenTestCandidates', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('writtenTestId', 'writtenTestId', { unique: false });
    store.createIndex('candidateApplicationId', 'candidateApplicationId', { unique: false });
    store.createIndex('uniqueCode', 'uniqueCode', { unique: true });
    console.log('Created store: writtenTestCandidates');
  }

  // Recruitment Interviews store
  if (!db.objectStoreNames.contains('recruitmentInterviews')) {
    const store = db.createObjectStore('recruitmentInterviews', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('recruitmentId', 'recruitmentId', { unique: true });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: recruitmentInterviews');
  }

  // Recruitment Interview Candidates store
  if (!db.objectStoreNames.contains('recruitmentInterviewCandidates')) {
    const store = db.createObjectStore('recruitmentInterviewCandidates', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('interviewId', 'interviewId', { unique: false });
    store.createIndex('candidateApplicationId', 'candidateApplicationId', { unique: false });
    console.log('Created store: recruitmentInterviewCandidates');
  }

  // Recruitment Interview Evaluations store
  if (!db.objectStoreNames.contains('recruitmentInterviewEvaluations')) {
    const store = db.createObjectStore('recruitmentInterviewEvaluations', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('interviewCandidateId', 'interviewCandidateId', { unique: false });
    store.createIndex('evaluatorId', 'evaluatorId', { unique: false });
    console.log('Created store: recruitmentInterviewEvaluations');
  }

  // Recruitment Interview Results store
  if (!db.objectStoreNames.contains('recruitmentInterviewResults')) {
    const store = db.createObjectStore('recruitmentInterviewResults', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('interviewCandidateId', 'interviewCandidateId', { unique: true });
    console.log('Created store: recruitmentInterviewResults');
  }

  // Recruitment Reports store
  if (!db.objectStoreNames.contains('recruitmentReports')) {
    const store = db.createObjectStore('recruitmentReports', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('recruitmentId', 'recruitmentId', { unique: true });
    store.createIndex('reportNumber', 'reportNumber', { unique: true });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: recruitmentReports');
  }

  // Offer Letters store
  if (!db.objectStoreNames.contains('offerLetters')) {
    const store = db.createObjectStore('offerLetters', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('recruitmentId', 'recruitmentId', { unique: false });
    store.createIndex('candidateApplicationId', 'candidateApplicationId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: offerLetters');
  }

  // Sanction Clearances store
  if (!db.objectStoreNames.contains('sanctionClearances')) {
    const store = db.createObjectStore('sanctionClearances', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('recruitmentId', 'recruitmentId', { unique: false });
    store.createIndex('candidateApplicationId', 'candidateApplicationId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: sanctionClearances');
  }

  // Background Checks store
  if (!db.objectStoreNames.contains('backgroundChecks')) {
    const store = db.createObjectStore('backgroundChecks', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('recruitmentId', 'recruitmentId', { unique: false });
    store.createIndex('candidateApplicationId', 'candidateApplicationId', { unique: false });
    store.createIndex('overallStatus', 'overallStatus', { unique: false });
    console.log('Created store: backgroundChecks');
  }

  // Employment Contracts store
  if (!db.objectStoreNames.contains('employmentContracts')) {
    const store = db.createObjectStore('employmentContracts', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('recruitmentId', 'recruitmentId', { unique: false });
    store.createIndex('candidateApplicationId', 'candidateApplicationId', { unique: false });
    store.createIndex('contractNumber', 'contractNumber', { unique: true });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: employmentContracts');
  }

  // File Checklists store
  if (!db.objectStoreNames.contains('fileChecklists')) {
    const store = db.createObjectStore('fileChecklists', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('recruitmentId', 'recruitmentId', { unique: true });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: fileChecklists');
  }

  // Provinces store (Lookup data)
  if (!db.objectStoreNames.contains('provinces')) {
    const store = db.createObjectStore('provinces', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('name', 'name', { unique: true });
    console.log('Created store: provinces');
  }
}
