import type {
  ApplicationFormData,
  LanguageRecord,
  EducationRecord,
  TrainingRecord,
  EmploymentRecord,
  ReferenceRecord,
  ExaminerRecord,
} from './types';

// ─── Factory functions for new records ───

export const createLanguageRecord = (): LanguageRecord => ({
  id: Date.now().toString(),
  language: '',
  reading: 'fair',
  writing: 'fair',
  speaking: 'fair',
});

export const createEducationRecord = (): EducationRecord => ({
  id: Date.now().toString(),
  institutionName: '',
  place: '',
  country: '',
  attendedFrom: '',
  attendedTo: '',
  degreesObtained: '',
  mainCourses: '',
});

export const createTrainingRecord = (): TrainingRecord => ({
  id: Date.now().toString(),
  trainingName: '',
  place: '',
  country: '',
  type: '',
  attendedFrom: '',
  attendedTo: '',
  degreesObtained: '',
  certificatesDiploma: '',
});

export const createEmploymentRecord = (): EmploymentRecord => ({
  id: Date.now().toString(),
  from: '',
  to: '',
  jobTitle: '',
  majorDuties: '',
  employerNameAddressContact: '',
  reasonForLeaving: '',
});

export const createReferenceRecord = (): ReferenceRecord => ({
  id: Date.now().toString(),
  fullName: '',
  fullAddressPhone: '',
  businessOccupation: '',
});

export const createExaminerRecord = (): ExaminerRecord => ({
  id: Date.now().toString(),
  name: '',
  department: '',
  position: '',
});

// ─── Default form values ───

export const defaultFormData: ApplicationFormData = {
  positionApplied: '',
  name: '',
  fatherName: '',
  nationality: 'Afghan',
  dateOfBirth: '',
  maritalStatus: 'single',
  numberOfChildren: '',
  permanentAddress: '',
  presentAddress: '',
  contactPhone: '',
  photo: '',
  languages: [],
  education: [],
  trainings: [],
  employment: [],
  references: [],
  hasRelativeInOrg: false,
  relativeDetails: '',
  everArrested: false,
  everConvicted: false,
  dataConsent: false,
  signatureDate: new Date().toISOString().split('T')[0],
  applicationReceivedBy: '',
  dateOfAppointment: '',
  placeOfAppointment: '',
  salary: '',
  examiners: [],
  scoreObtained: '',
  scoreOutOf: '',
  papersAttached: null,
  notSuitable: null,
  keepPending: null,
  notEmployedReason: '',
  hrSpecialist: '',
};

// ─── Dropdown / radio options ───

export const PROFICIENCY_LEVELS = [
  { value: 'fair', label: 'Fair' },
  { value: 'good', label: 'Good' },
  { value: 'excellent', label: 'Excellent' },
] as const;

export const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
] as const;

export const YES_NO_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
] as const;

export const NATIONALITY_OPTIONS = [
  'Afghan',
  'Pakistani',
  'Iranian',
  'Indian',
  'Tajik',
  'Uzbek',
  'Turkmen',
  'Other',
];
