// ─── Record Types (dynamic array items) ───

export interface LanguageRecord {
  id: string;
  language: string;
  reading: 'fair' | 'good' | 'excellent';
  writing: 'fair' | 'good' | 'excellent';
  speaking: 'fair' | 'good' | 'excellent';
}

export interface EducationRecord {
  id: string;
  institutionName: string;
  place: string;
  country: string;
  attendedFrom: string;
  attendedTo: string;
  degreesObtained: string;
  mainCourses: string;
}

export interface TrainingRecord {
  id: string;
  trainingName: string;
  place: string;
  country: string;
  type: string;
  attendedFrom: string;
  attendedTo: string;
  degreesObtained: string;
  certificatesDiploma: string;
}

export interface EmploymentRecord {
  id: string;
  from: string;
  to: string;
  jobTitle: string;
  majorDuties: string;
  employerNameAddressContact: string;
  reasonForLeaving: string;
}

export interface ReferenceRecord {
  id: string;
  fullName: string;
  fullAddressPhone: string;
  businessOccupation: string;
}

export interface ExaminerRecord {
  id: string;
  name: string;
  department: string;
  position: string;
}

// ─── Main Form Data ───

export interface ApplicationFormData {
  // Position
  positionApplied: string;

  // Personal Information
  name: string;
  fatherName: string;
  nationality: string;
  dateOfBirth: string;
  maritalStatus: 'single' | 'married';
  numberOfChildren: string;
  permanentAddress: string;
  presentAddress: string;
  contactPhone: string;
  photo: string;

  // Dynamic Sections
  languages: LanguageRecord[];
  education: EducationRecord[];
  trainings: TrainingRecord[];
  employment: EmploymentRecord[];
  references: ReferenceRecord[];

  // Organizational Questions
  hasRelativeInOrg: boolean;
  relativeDetails: string;
  everArrested: boolean;
  everConvicted: boolean;

  // Consent & Signature
  dataConsent: boolean;
  signatureDate: string;

  // For Official Use Only
  applicationReceivedBy: string;
  dateOfAppointment: string;
  placeOfAppointment: string;
  salary: string;
  examiners: ExaminerRecord[];
  scoreObtained: string;
  scoreOutOf: string;
  papersAttached: boolean | null;
  notSuitable: boolean | null;
  keepPending: boolean | null;
  notEmployedReason: string;
  hrSpecialist: string;
}
