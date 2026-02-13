import type { COIFormData, FileAttachment } from './types';

// ─── Default form values ───

export const defaultCOIFormData: COIFormData = {
  // Section 1
  memberName: '',
  positionInRC: '',
  department: '',
  declarationDate: new Date().toISOString().split('T')[0],
  recruitmentPosition: '',
  vacancyNumber: '',

  // Section 2
  q1Answer: '',
  q1Details: '',
  q2Answer: '',
  q2Details: '',
  q3Answer: '',
  q3Details: '',

  // Section 3
  declarationConfirmed: false,
  signatureDate: '',

  // Section 4
  reviewedByName: '',
  reviewedByPosition: 'HR Specialist',
  reviewDecision: 'pending',
  reviewComments: '',
  reviewDate: '',

  // Files
  uploadedFiles: [],

  // Meta
  status: 'draft',
};

// ─── Conflict questions (Annex 5 - Section 2) ───

export const CONFLICT_QUESTIONS = [
  {
    key: 'q1' as const,
    answerField: 'q1Answer' as const,
    detailsField: 'q1Details' as const,
    text: 'Do you have any personal, financial, or professional relationship with any of the candidates applying for this position?',
    detailsPlaceholder: 'If yes, please describe the nature of the relationship...',
  },
  {
    key: 'q2' as const,
    answerField: 'q2Answer' as const,
    detailsField: 'q2Details' as const,
    text: 'Have you previously worked with, mentored, or directly supervised any of the candidates?',
    detailsPlaceholder: 'If yes, please provide details about the nature of the prior interaction...',
  },
  {
    key: 'q3' as const,
    answerField: 'q3Answer' as const,
    detailsField: 'q3Details' as const,
    text: 'Are there any other potential conflicts of interest that may affect your ability to impartially evaluate the candidates?',
    detailsPlaceholder: 'If yes, please describe the potential conflict...',
  },
] as const;

// ─── Declaration text (Annex 5 - Section 3) ───

export const DECLARATION_TEXT =
  'I hereby affirm that the information provided above is accurate and complete to the best of my knowledge. ' +
  'I understand that any undisclosed conflict of interest may result in disciplinary action and ' +
  'invalidation of the recruitment process. I commit to maintaining impartiality and confidentiality ' +
  'throughout the recruitment process.';

// ─── Note text (Annex 5 - footer note) ───

export const TRANSPARENCY_NOTE =
  'Note: This form is part of the organization\'s commitment to transparency, accountability, and fairness in ' +
  'recruitment. All members of the Recruitment Committee (RC) are required to declare any potential conflicts of ' +
  'interest before participating in the recruitment process. This ensures confidentiality and avoids nepotism, ' +
  'favoritism, or any undue influence in the hiring process.';

// ─── Yes / No radio options ───

export const YES_NO_OPTIONS = [
  { value: 'yes' as const, label: 'Yes' },
  { value: 'no' as const, label: 'No' },
] as const;

// ─── Factory for file attachments ───

export const createFileAttachment = (file: File, dataUrl: string): FileAttachment => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: file.name,
  size: file.size,
  type: file.type,
  dataUrl,
  uploadedAt: new Date().toISOString(),
});

// ─── Accepted file types ───

export const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
