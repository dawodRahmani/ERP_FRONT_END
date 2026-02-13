// ─── COI Form Types (Annex 5: Conflict of Interest Declaration) ───

export type ConflictAnswer = 'yes' | 'no' | '';

export type ReviewDecision = 'no_conflict' | 'conflict_identified' | 'pending';

export type COIStatus = 'draft' | 'submitted' | 'reviewed';

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  /** base64-encoded data URL for local storage */
  dataUrl: string;
  uploadedAt: string;
}

export interface COIFormData {
  // ─── Section 1: Personal Information ───
  memberName: string;
  positionInRC: string;
  department: string;
  declarationDate: string;
  recruitmentPosition: string;
  vacancyNumber: string;

  // ─── Section 2: Declaration of Potential Conflict of Interest ───
  q1Answer: ConflictAnswer;
  q1Details: string;
  q2Answer: ConflictAnswer;
  q2Details: string;
  q3Answer: ConflictAnswer;
  q3Details: string;

  // ─── Section 3: Declaration and Signature ───
  declarationConfirmed: boolean;
  signatureDate: string;

  // ─── Section 4: Acknowledgment by HR Specialist ───
  reviewedByName: string;
  reviewedByPosition: string;
  reviewDecision: ReviewDecision;
  reviewComments: string;
  reviewDate: string;

  // ─── File Upload ───
  uploadedFiles: FileAttachment[];

  // ─── Meta ───
  status: COIStatus;
}

/** Summary row displayed in the list view */
export interface COIListItem {
  id: number;
  memberName: string;
  positionInRC: string;
  department: string;
  vacancyNumber: string;
  recruitmentPosition: string;
  hasConflict: boolean;
  reviewDecision: ReviewDecision;
  declarationDate: string;
  status: COIStatus;
  filesCount: number;
}
