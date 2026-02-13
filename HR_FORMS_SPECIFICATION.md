# VDO HR System - Forms Specification

This document describes 55 HR forms for frontend development. Forms are grouped by HR module/process.

---

## Module Overview

| Module | Forms |
|--------|-------|
| Recruitment | 1-15, 22, 38, 45, 48 |
| Pre-Employment Verification | 16-20 |
| Employment & Contract | 21, 26, 27, 49, 50 |
| Onboarding | 28, 32, 33, 40, 51, 52, 53, 55 |
| Performance Management | 23, 24, 25, 46 |
| Training & Development | 29, 30, 31, 41 |
| Leave & Attendance | 34, 35, 36, 37 |
| Payroll | 42 |
| Exit & Separation | 43, 44, 47 |
| Special Forms | 39, 54 |

---

## 1. RECRUITMENT MODULE

### Form 1: Terms of Reference (ToR)
**Purpose:** Define job requirements for a vacancy
**File Type:** DOCX (Digital Form)
**Used In:** Step 1 of all recruitment cycles

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Donor | Text | Yes |
| Project | Text | Yes |
| Department | Dropdown | Yes |
| Position Title | Text | Yes |
| Reports To | Text | Yes |
| Duty Station | Text | Yes |
| Job Purpose | Textarea | Yes |
| Information about VDO | Static Text | No |
| Tasks and Responsibilities | Textarea (SMART format) | Yes |
| - Specific objectives | Textarea | Yes |
| - Measurable targets | Textarea | Yes |
| - Achievable goals | Textarea | Yes |
| - Relevant outcomes | Textarea | Yes |
| - Time-bound deliverables | Textarea | Yes |
| Required Qualifications | Textarea | Yes |
| Required Skills | Textarea | Yes |
| Minimum Experience (years) | Number | Yes |
| Language Proficiency - Dari | Checkbox | Yes |
| Language Proficiency - Pashto | Checkbox | Yes |
| Language Proficiency - English | Checkbox | Yes |
| Commitment & Dedication | Textarea | Yes |

**Approval Workflow:**
1. Department Head (Draft)
2. HR Specialist (Review)
3. ED/DD (SMT positions) OR HOP (Other positions)

---

### Form 2: Staff Requisition Form (SRF)
**Purpose:** Formal request to fill a position
**File Type:** DOCX (Digital Form)
**Used In:** Step 2 of all recruitment cycles

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Job Title | Text | Yes |
| Salary Grade | Dropdown | Yes |
| Number of Staff Required | Number | Yes |
| Gender Preference | Radio (Male/Female/Any) | No |
| Duty Station | Dropdown | Yes |
| Contract Type | Checkbox Group | Yes |
| - Core (Permanent) | Checkbox | - |
| - Project | Checkbox | - |
| - Consultant | Checkbox | - |
| - Part-time | Checkbox | - |
| - Internship/Volunteer | Checkbox | - |
| - Daily Wage | Checkbox | - |
| Contract Duration | Text | Conditional |
| Hiring Approach | Checkbox Group | Yes |
| - Internal Promotion | Checkbox | - |
| - Open Competition | Checkbox | - |
| - Employee Referral | Checkbox | - |
| - Headhunting | Checkbox | - |
| Project/Department Name | Text | Yes |
| Educational Qualification | Checkbox Group | Yes |
| - Baccalaureate | Checkbox | - |
| - Diploma | Checkbox | - |
| - Bachelor | Checkbox | - |
| - Master | Checkbox | - |
| Education Specifications | Textarea | No |
| Job Experience Qualification | Textarea | Yes |
| Essential Languages | Checkbox Group | Yes |
| Required Equipment | Checkbox Group | No |
| - Laptop/Desktop | Checkbox | - |
| - ID Card | Checkbox | - |
| - Business Card | Checkbox | - |
| - SIM Card | Checkbox | - |
| - Official Email | Checkbox | - |
| - Office Desk | Checkbox | - |
| Other Qualifications | Textarea | No |
| Application Closing Date | Date | Yes |
| Written Exam Required | Radio (Yes/No) | Yes |
| Exam Question Writer | Text | Conditional |
| Is New Designation | Radio (Yes/No) | Yes |

**Signatures:**
- Requested By (Head of Section): Name, Position, Sign, Date
- Verified By (HR Dept): Sign, Date
- Budget Availability (Finance Dept): Sign, Date
- Approved By: Name, Sign, Date

---

### Form 3: Recruitment Tracker
**Purpose:** Track all recruitment activities
**File Type:** XLSX (Spreadsheet)
**Used In:** Throughout recruitment process

**Columns:**
| Column | Type |
|--------|------|
| Position Title | Text |
| Vacancy Number | Auto-generated |
| SRF Date | Date |
| Announcement Date | Date |
| Closing Date | Date |
| Total Applications | Number |
| Longlisted Candidates | Number |
| Shortlisted Candidates | Number |
| Interview Date | Date |
| Selected Candidate | Text |
| Offer Date | Date |
| Contract Date | Date |
| Status | Dropdown |
| Remarks | Text |

---

### Form 4: Job Application Template
**Purpose:** Candidate application form
**File Type:** DOC (Legacy - needs digital conversion)

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Full Name | Text | Yes |
| Father's Name | Text | Yes |
| Date of Birth | Date | Yes |
| Gender | Radio | Yes |
| Nationality | Text | Yes |
| National ID (Tazkira) | Text | Yes |
| Contact Phone | Text | Yes |
| Email | Email | Yes |
| Current Address | Textarea | Yes |
| Permanent Address | Textarea | Yes |
| Position Applied For | Text | Yes |
| Education History | Table (Degree, Institution, Year, Country) | Yes |
| Work Experience | Table (Organization, Position, Duration, Responsibilities) | Yes |
| References | Table (Name, Position, Contact) | Yes |
| Languages | Table (Language, Read, Write, Speak) | Yes |
| Declaration | Checkbox | Yes |
| Signature | Signature | Yes |
| Date | Date | Yes |

---

### Form 5: Conflict of Interest (COI) Declaration
**Purpose:** RC members declare no conflict with candidates
**File Type:** DOCX (Digital Form)

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Name | Text | Yes |
| Position in RC | Text | Yes |
| Department | Text | Yes |
| Date | Date | Yes |
| Personal/Financial relationship with candidates | Radio (Yes/No) | Yes |
| - Details if Yes | Textarea | Conditional |
| Previously worked/supervised any candidate | Radio (Yes/No) | Yes |
| - Details if Yes | Textarea | Conditional |
| Other potential conflicts | Radio (Yes/No) | Yes |
| - Details if Yes | Textarea | Conditional |
| Signature | Signature | Yes |
| HR Specialist Review | Section | - |
| - Reviewed By (Name & Position) | Text | Yes |
| - Decision | Radio (No conflict/Conflict identified) | Yes |

---

### Form 6: Longlisting Template
**Purpose:** Initial eligibility screening of applicants
**File Type:** XLSX

**Columns:**
| Column | Type |
|--------|------|
| S/No | Auto |
| Candidate Name | Text |
| Age | Number |
| Gender | Dropdown |
| Native Province | Text |
| Current Residency | Text |
| Native Language | Text |
| Degree | Text |
| University/Country | Text |
| Relevant Experience (Years) | Number |
| Meets Minimum Education | Radio (Yes/No) |
| Meets Minimum Experience | Radio (Yes/No) |
| Eligible | Radio (Yes/No) |
| Remarks | Text |

---

### Form 7: Shortlisting Scoring Template
**Purpose:** Score and rank longlisted candidates
**File Type:** XLSX

**Columns:**
| Column | Type | Weight |
|--------|------|--------|
| S/No | Auto | - |
| Candidate Name | Text | - |
| Academic Qualification Score (0-100) | Number | 30% |
| Professional Experience Score (0-100) | Number | 50% |
| Other Criteria Score (0-100) | Number | 20% |
| Total Score | Formula | Auto |
| Shortlist Decision | Formula (>=75 = Yes) | Auto |
| RC Chair Confirmation | Checkbox | - |
| HR Specialist Confirmation | Checkbox | - |

---

### Form 8: Test Paper Template
**Purpose:** Written examination for candidates
**File Type:** DOC (Legacy)

**Structure:**
- Header (Position, Date, Time, Candidate Code)
- Instructions Section
- Questions (Multiple choice, Short answer, Essay)
- Scoring Guide (Internal use)

---

### Form 9: Test Attendance Sheet
**Purpose:** Record candidate attendance at written test
**File Type:** XLSX

**Fields:**
| Field | Type |
|-------|------|
| Position Title | Text |
| Vacancy Number | Text |
| Province | Text |
| Date | Date |
| Time | Time |

**Columns:**
| Column | Type |
|--------|------|
| S/No | Auto |
| Candidate Name | Text |
| Father's Name | Text |
| Candidate Code | Text |
| Signature | Signature |
| Remarks | Text |

---

### Form 10: Test Results Sheet
**Purpose:** Record written test scores
**File Type:** XLSX

**Columns:**
| Column | Type |
|--------|------|
| S/No | Auto |
| Candidate Code | Text |
| Section 1 Score | Number |
| Section 2 Score | Number |
| Section 3 Score | Number |
| Total Score | Formula |
| Percentage | Formula |
| Pass/Fail | Formula |
| Examiner Signature | - |

---

### Form 11: Interview Evaluation Form
**Purpose:** Score candidates during interviews
**File Type:** XLSX (Digital Form)

**Header Fields:**
| Field | Type |
|-------|------|
| Candidate Name | Text |
| Age | Number |
| Gender | Dropdown |
| Position Applied | Text |
| Interview Date | Date |
| Panel Decision | Radio (Yes/No) |

**Scoring Section:**
| Criteria | Score (1-5) |
|----------|-------------|
| Fixed Question 1 | Rating |
| Fixed Question 2 | Rating |
| Fixed Question 3 | Rating |
| Technical Question 1 (RC Defined) | Rating |
| Technical Question 2 (RC Defined) | Rating |
| Technical Question 3 (RC Defined) | Rating |
| Communication Skills | Rating |
| Problem Solving | Rating |
| Overall Impression | Rating |

**Rating Scale:**
- 5 = Excellent
- 4 = Very Good
- 3 = Good
- 2 = Fair
- 1 = Poor

---

### Form 12: Interview Attendance Sheet
**Purpose:** Record candidate attendance at interview
**File Type:** XLSX

Same structure as Form 9 (Test Attendance)

---

### Form 13: Interview Result Sheet
**Purpose:** Consolidate interview scores
**File Type:** XLSX

**Columns:**
| Column | Type |
|--------|------|
| S/No | Auto |
| Candidate Name | Text |
| Written Test Score | Number |
| Written Test Weight | Percentage |
| Interview Score | Number |
| Interview Weight | Percentage |
| Total Weighted Score | Formula |
| Rank | Auto |
| RC Recommendation | Radio |

---

### Form 14: Recruitment Report Template
**Purpose:** Summarize recruitment process and recommend candidates
**File Type:** DOCX

**Sections:**
1. **Position Details:** Title, Location, Announcement Date, Closing Date
2. **Overview:** Purpose and scope of position
3. **Timeline:**
   - Announcement Period (Start/End Date)
   - Application Review Summary
   - Longlisting Criteria & Numbers
   - Shortlisting Criteria & Numbers
4. **Interview Details:**
   - Panel Members (Name, Position)
   - Interview Dates
   - Interview Method
5. **Top 3 Candidates Table:**
   | Column | Type |
   |--------|------|
   | Rank | Number |
   | Name | Text |
   | Written Score | Number |
   | Interview Score | Number |
   | Total Score | Number |
   | Strengths | Text |
   | Concerns | Text |
6. **RC Recommendation:** Narrative with signatures
7. **Annexes List:** SRF, Shortlist, RC Form, Test Papers, Interview Forms, Result Sheet

**Signatures:**
- RC Member 1: Name, Position, Signature
- RC Member 2: Name, Position, Signature
- RC Member 3: Name, Position, Signature
- Date

---

### Form 15: Offer Letter Template
**Purpose:** Formal job offer to selected candidate
**File Type:** DOCX

**Fields:**
| Field | Type |
|-------|------|
| Date | Date |
| Candidate Name | Text |
| Position Title | Text |
| Duty Station | Text |
| Contract Duration | Text |
| Start Date | Date |
| Salary | Number |
| Reporting Line | Text |
| Conditions | Textarea |

**Acceptance Section:**
- Candidate Signature
- Date

---

### Form 22: Recruitment File Checklist
**Purpose:** Ensure complete recruitment documentation
**File Type:** DOCX

**Checklist Items:**
| Item | Checkbox |
|------|----------|
| Approved ToR | [ ] |
| Approved SRF | [ ] |
| Job Advertisement | [ ] |
| Application Forms | [ ] |
| Longlisting Template | [ ] |
| Shortlisting Template | [ ] |
| RC Form & COI Forms | [ ] |
| Test Papers & Attendance | [ ] |
| Test Results | [ ] |
| Interview Forms & Attendance | [ ] |
| Interview Results | [ ] |
| Recruitment Report | [ ] |
| Offer Letter (Signed) | [ ] |
| Background Checks | [ ] |
| Employment Contract | [ ] |

---

### Form 38: Sole Source Recruitment Justification
**Purpose:** Justify hiring without competitive process
**File Type:** DOCX

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Position Title | Text | Yes |
| Department/Project | Text | Yes |
| Duty Station | Text | Yes |
| Employment Type | Dropdown | Yes |
| Candidate Name | Text | Yes |
| Justification Summary | Textarea | Yes |
| Reason for Sole Sourcing | Checkbox Group | Yes |
| - Urgent operational need | Checkbox | - |
| - Rare/specialized skills | Checkbox | - |
| - Security/access constraints | Checkbox | - |
| - Continuity of ongoing work | Checkbox | - |
| - Donor requirement | Checkbox | - |
| - No qualified applicants | Checkbox | - |
| - Other | Text | - |
| Timeline Risk | Textarea | Yes |
| Market Analysis | Textarea | No |
| COI Check Completed | Radio (Yes/No) | Yes |
| Salary Grade Verified | Radio (Yes/No) | Yes |
| CV Attached | Radio (Yes/No) | Yes |

**Approval Table:**
| Role | Name | Date | Signature | Comments |
|------|------|------|-----------|----------|
| Hiring Manager | | | | |
| HR Manager | | | | |
| Finance | | | | |
| Compliance | | | | |
| Executive Director | | | | |

**Final Decision:** Approved / Not Approved

---

### Form 45: Recruitment Committee (RC) Form
**Purpose:** Establish and document recruitment committee
**File Type:** DOCX

**Fields:**
| Field | Type |
|-------|------|
| Committee Establishment Date | Date |
| Position Title(s) | Text |
| Project | Text |
| Donor | Text |

**Committee Members Table:**
| S/N | Staff Name | Position | Role in Committee |
|-----|------------|----------|-------------------|
| 1 | | | Chair/Technical/HR |
| 2 | | | |
| 3 | | | |
| 4 | | | (Optional) |

**ToR Section:**
- Purpose statement
- Accountability
- Membership requirements
- Duties & Responsibilities list

**Approval:** ED signature required

---

### Form 48: Digital Candidate Sourcing List
**Purpose:** Track candidate sourcing for headhunting
**File Type:** DOCX/XLSX

**Header:**
| Field | Type |
|-------|------|
| Position Title | Text |
| Department/Project | Text |
| Duty Station | Text |
| SRF No. | Text |
| Date Sourcing Initiated | Date |

**Candidate Record Table:**
| Column | Type |
|--------|------|
| S/N | Auto |
| Candidate Full Name | Text |
| Source Channel | Dropdown |
| Contact Number | Text |
| Email | Email |
| Date Received | Date |
| Eligibility Check | Radio (Yes/No) |
| Reason if Not Eligible | Text |
| Submitted to RC | Radio (Yes/No) |
| Remarks | Text |

**Source Channels Summary:**
| Channel | Count | Notes |
|---------|-------|-------|
| LinkedIn | | |
| Professional Networks | | |
| Internal CV Database | | |
| Staff Referral | | |
| Direct Email | | |
| Others | | |

---

## 2. PRE-EMPLOYMENT VERIFICATION MODULE

### Form 16: Sanction Clearance Form
**Purpose:** Verify candidate not on UN sanction lists
**File Type:** DOCX

**Employee Declaration:**
| Field | Type |
|-------|------|
| Employee Name | Text |
| Declaration Text | Static |
| Signature | Signature |
| Date | Date |

**HR Verification Section:**
| Field | Type |
|-------|------|
| Employee Name | Text |
| Nationality | Text |
| Designation | Text |
| Passport/ID Number | Text |
| Verified By (Name) | Text |
| Designation | Text (HR Specialist) |

**Checklist:**
| Check Item | Result | Remarks |
|------------|--------|---------|
| Not on UN Security Council sanction list (individuals) | Pass/Fail | |
| Not on UN Security Council sanction list (entities) | Pass/Fail | |
| No affiliation with sanctioned individuals/entities | Pass/Fail | |

---

### Form 17: Reference Check Form
**Purpose:** Verify employment history and character
**File Type:** DOC (Legacy)

**Candidate Info:**
| Field | Type |
|-------|------|
| Candidate Name | Text |
| Position Applied | Text |

**Reference Info:**
| Field | Type |
|-------|------|
| Reference Name | Text |
| Reference Position | Text |
| Organization | Text |
| Contact Number | Text |
| Email | Email |
| Relationship to Candidate | Text |
| Duration Known | Text |

**Questions:**
| Question | Rating (1-5) | Comments |
|----------|--------------|----------|
| How would you rate the candidate's work quality? | | |
| How would you rate punctuality and reliability? | | |
| How well did they work with others? | | |
| Would you rehire this person? | Yes/No | |
| Any concerns about integrity/ethics? | Yes/No | |
| Reason for leaving? | | |
| Additional comments | | |

---

### Form 18: Guarantee Letter (Dari)
**Purpose:** Two guarantors vouch for candidate
**File Type:** DOCX

**Candidate Section:**
| Field | Type |
|-------|------|
| Photo | Image |
| Name | Text |
| Father's Name | Text |
| Tazkira Number | Text |
| Contact Number | Text |
| Wakil Gozar Verification | Signature/Stamp |

**Guarantor Section (x2):**
| Field | Type |
|-------|------|
| Photo | Image |
| Name | Text |
| Father's Name | Text |
| Position & Organization | Text |
| Tazkira Number | Text |
| Contact Number | Text |
| Employment Verification | Document/Stamp |
| Guarantee Statement | Static Text |
| Signature | Signature |

---

### Form 19: Home Address Verification
**Purpose:** Verify candidate's residence
**File Type:** DOCX

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Staff Name | Text | Yes |
| Designation | Text | Yes |
| Project Name | Text | Yes |
| Donor | Text | Yes |
| Current Home Address | Textarea | Yes |
| House Status | Radio (Rent/Mortgaged/Owned) | Yes |
| Verified By (Name) | Text | Yes |
| Position | Text | Yes |
| Verification Date | Date | Yes |
| Observations/Comments | Textarea | No |
| HR Officer Signature & Stamp | Signature | Yes |

---

### Form 20: Criminal Background Check
**Purpose:** Verify no criminal record
**File Type:** DOCX

**Fields:**
| Field | Type |
|-------|------|
| Candidate Name | Text |
| Position | Text |
| Prepared By | Text (HR Officer) |
| Signature | Signature |
| Date | Date |
| MOI Istilam Reference | Text |
| MOI Response Document | File Attachment |

---

## 3. EMPLOYMENT & CONTRACT MODULE

### Form 21: Employment Contract Template
**Purpose:** Legal employment agreement
**File Type:** DOCX

**Header:**
| Field | Type |
|-------|------|
| Contract Number | Auto-generated |
| Employee Name | Text |
| Position | Text |
| Duty Station | Text |
| Contract Type | Dropdown |

**Clauses:**
1. Duration of Contract (Start Date, End Date)
2. Probationary Period (Duration, Conditions)
3. Working Hours and Holidays
4. Compensation and Benefits
5. Duties and Responsibilities
6. Reporting Line
7. Professional Standards
8. Confidentiality
9. Termination Conditions
10. Zero Tolerance Policy Items

**Signatures:**
| Party | Name | Position | Date | Signature |
|-------|------|----------|------|-----------|
| Employee | | | | |
| VDO (ED/DD/HOP) | | | | |

**Annex A:** Terms of Reference (attached)

---

### Form 26: Extension Letter
**Purpose:** Extend probation period
**File Type:** DOCX

**Fields:**
| Field | Type |
|-------|------|
| Date | Date |
| Employee Name | Text |
| Position | Text |
| Department | Text |
| Original Probation End Date | Date |
| Extension Start Date | Date |
| Extension End Date | Date |
| Extension Duration | Text |

**KPI Improvement Areas Table:**
| KPI Area | Comments/Actions Required |
|----------|---------------------------|
| | |
| | |

**Signatures:**
- HR Specialist: Name, Date
- Employee Acknowledgment: Signature, Date

---

### Form 27: Termination Letter
**Purpose:** Formal termination notice
**File Type:** DOCX

**Fields:**
| Field | Type |
|-------|------|
| Date | Date |
| Employee Name | Text |
| Position | Text |
| Location | Text |
| Contract Number | Text |
| Termination Reason | Textarea |
| Last Working Day | Date |

**Signature:** HR Department

**CC:** P/File, Finance, HR, Program

---

### Form 49: Confirmation Letter
**Purpose:** Confirm employee after probation
**File Type:** DOCX

**Fields:**
| Field | Type |
|-------|------|
| Reference Number | Auto |
| Date | Date |
| Employee Name | Text |
| Position Title | Text |
| Duty Station | Text |
| Probation Start Date | Date |
| Probation End Date | Date |
| Confirmation Date | Date |

**Content:** Standard confirmation text

**Signature:** HR Specialist

---

### Form 50: Contract Amendment
**Purpose:** Modify existing contract terms
**File Type:** DOCX

**Fields:**
| Field | Type |
|-------|------|
| Contract Number | Text |
| Amendment Number | Auto |
| Employee Name | Text |
| Original Position | Text |
| New Position | Text |
| Original Salary | Number |
| New Salary | Number |
| Effective Date | Date |
| Amendment Details | Textarea |

**Signatures:**
- Employee
- ED/DD/HOP

---

## 4. ONBOARDING MODULE

### Form 28: Induction Form
**Purpose:** Track new employee orientation
**File Type:** DOCX

**Section A - Employee Information:**
| Field | Type |
|-------|------|
| Employee Full Name | Text |
| Employee ID | Text |
| Position/Job Title | Text |
| Department | Text |
| Duty Station | Text |
| Start Date | Date |
| Contract Type | Dropdown |
| Probation Period Duration | Text |

**Section B - Purpose:** Static text explaining orientation goals

**Section C - HR Orientation Checklist:**
| Topic | Yes | No | Remarks |
|-------|-----|-----|---------|
| Introduction to VDO (Mission, Vision, Values) | | | |
| Organizational Structure Explained | | | |
| HR Policies & Procedures Overview | | | |
| Code of Conduct & Ethics | | | |
| PSEA, Safeguarding & AAP Policies | | | |
| Working Hours, Leave & Attendance System | | | |
| Payroll, Allowances & Benefits Explained | | | |
| Security & Safety Briefing | | | |
| Induction Documents Completed | | | |

**Section C - Job-Specific Orientation:**
| Topic | Yes | No | Remarks |
|-------|-----|-----|---------|
| Explanation of Job Description/TOR | | | |
| Key Duties & Responsibilities | | | |
| Performance Expectations & KPIs | | | |
| Reporting Lines & Communication Flow | | | |

**Section D - Systems & Tools Access:**
| Item | Provided | Date |
|------|----------|------|
| Email Account | | |
| System Access | | |
| Laptop/Desktop | | |
| ID Card | | |

**Section E - Probation Understanding:** Checkbox confirmation

**Section F - Signatures:**
- HR Officer: Name, Signature, Date
- Supervisor/Line Manager: Name, Signature, Date
- New Employee: Name, Signature, Date

---

### Form 32: Code of Conduct Acknowledgement
**Purpose:** Employee acknowledges reading Code of Conduct
**File Type:** DOCX

**Fields:**
| Field | Type |
|-------|------|
| Employee Name | Text |
| Position | Text |
| Commitment Statements | Static Checklist |
| Employee Name & Signature | Signature |
| Date | Date |
| HR Officer Signature | Signature |
| Date | Date |

---

### Form 33: Personnel File Checklist
**Purpose:** Ensure complete employee documentation
**File Type:** DOCX

**Sections and Items:**

**Section 1: Recruitment & Selection**
- [ ] Job Application Form/CV
- [ ] Job Advertisement
- [ ] Shortlisting Form & Notes
- [ ] Interview Assessment Form
- [ ] Reference Check Form
- [ ] Background & Sanction Check Report
- [ ] Selection Approval Form

**Section 2: Employment Documentation**
- [ ] Signed Employment Contract
- [ ] Job Description
- [ ] Probation Period Terms
- [ ] Offer Letter (Signed)
- [ ] Confidentiality/NDA
- [ ] Code of Conduct Acknowledgement
- [ ] Safeguarding/PSEAH Acknowledgement
- [ ] Whistleblowing Policy Acknowledgement
- [ ] Conflict of Interest Declaration

**Section 3: Identity & Legal Documents**
- [ ] Copy of National ID (Tazkira)/Passport
- [ ] Educational Certificates (verified)
- [ ] Professional Licenses/Certifications
- [ ] Previous Employment Letters
- [ ] Work Permit (if foreign)

**Section 4: Payroll & Benefits**
- [ ] Bank Account Details Form
- [ ] Tax ID (if applicable)
- [ ] Salary Scale/Grade Confirmation
- [ ] Allowances & Benefits Approval

**Section 5: Performance & Development**
- [ ] Probation Evaluation Form
- [ ] Annual Performance Appraisals
- [ ] Training & Development Records
- [ ] Capacity Building Certificates
- [ ] Promotion Approval Letters

**Section 6: Leave & Attendance**
- [ ] Leave Request Forms
- [ ] Attendance & Timesheet Records
- [ ] Sick Leave Medical Certificates

**Section 7: Disciplinary & Grievances**
- [ ] Written Warnings/Notices
- [ ] Disciplinary Hearing Records
- [ ] Grievance Forms & Investigation Records
- [ ] Resolution/Outcome Reports

**Section 8: Separation & Exit**
- [ ] Resignation Letter
- [ ] Exit Interview Form
- [ ] Clearance Form
- [ ] Final Settlement Form

---

### Form 40 & 52: Female Staff Mahram Form
**Purpose:** Document Mahram information for female staff
**File Type:** DOCX

**Section 1 - Personal Information:**
| Field | Type |
|-------|------|
| Full Name | Text |
| Employee ID | Text |
| Department/Position | Text |
| Contact Number | Text |
| Current Work Location | Text |

**Section 2 - Mahram Details:**
| Field | Type |
|-------|------|
| Name of Mahram | Text |
| Relationship | Radio (Father/Husband/Brother/Son) |
| National ID Number | Text |
| Contact Number | Text |
| Address | Textarea |
| Availability | Radio (Full-time/Part-time/On-call) |

**Section 3 - Declarations:**
- Employee Declaration & Signature
- Mahram Consent & Signature

**Section 4 - Official Use:**
- Received By (HR)
- Date Received
- Remarks
- Approved By
- Signature

---

### Form 51: Induction Pack Checklist
**Purpose:** Track all induction materials provided
**File Type:** DOCX

**Pre-Employment Documents:**
- [ ] Signed Offer Letter
- [ ] Signed Employment Contract
- [ ] Job Description
- [ ] Probation Period Agreement
- [ ] NDA
- [ ] Code of Conduct Acknowledgement
- [ ] Safeguarding & PSEAH Acknowledgement
- [ ] Whistleblowing Policy Acknowledgement
- [ ] COI Declaration

**Identity & Verification:**
- [ ] National ID Copy (verified)
- [ ] Educational Certificates (verified)
- [ ] Previous Employment Letters
- [ ] Work Permit (if foreign)

**Payroll & Benefits:**
- [ ] Bank Account Details Form
- [ ] Tax ID (if applicable)

**Induction & Orientation:**
- [ ] Orientation Attendance Form
- [ ] Induction Checklist
- [ ] Training Needs Assessment Form
- [ ] Orientation Materials Provided

**Materials Provided:**
- [ ] VDO Staff Handbook
- [ ] Organizational Chart
- [ ] Vision, Mission & Values Statement
- [ ] Code of Conduct
- [ ] Safeguarding & PSEAH Policy
- [ ] Whistleblowing Policy
- [ ] COI Policy
- [ ] HR Policy Manual
- [ ] Security & Safety Guidelines
- [ ] IT & Communications Policy
- [ ] Health & Safety Policy
- [ ] Contact List

**IT & Access:**
- [ ] Email Account Request Form
- [ ] Equipment Allocation Form
- [ ] Staff ID Card Issued

**Signatures:**
- Staff Signature
- HR Officer Signature

---

### Form 53: Safeguarding/PSEAH Acknowledgement
**Purpose:** Employee acknowledges safeguarding policy
**File Type:** DOCX

**Fields:**
| Field | Type |
|-------|------|
| Employee Name | Text |
| Position | Text |
| Acknowledgment Statements | Static Checklist |
| Employee Name & Signature | Signature |
| Date | Date |
| HR/Authorized Signature | Signature |
| Date | Date |

---

### Form 55: Non-Disclosure Agreement (NDA)
**Purpose:** Employee agrees to confidentiality obligations
**File Type:** DOCX

**Fields:**
| Field | Type |
|-------|------|
| Agreement Date | Date |
| Employee Name | Text |
| Position | Text |
| Purpose Statement | Static |
| Definition of Confidential Information | Static List |
| Employee Commitments | Static Numbered List |
| Breach Consequences | Static |
| Acknowledgment Statement | Static |
| Employee Name & Signature | Signature |
| Date | Date |
| HR/Authorized Signature | Signature |
| Date | Date |

---

## 5. PERFORMANCE MANAGEMENT MODULE

### Form 23: Internal Promotion Feasibility Form
**Purpose:** Assess if internal promotion is possible
**File Type:** DOCX

**Section 1 - Vacancy Information:**
| Field | Type |
|-------|------|
| Vacancy Title | Text |
| Department/Unit | Text |
| Duty Station | Text |
| Date Vacancy Identified | Date |
| Updated TOR Available | Radio (Yes/No) |
| TOR Update Date | Date |

**Section 2 - Eligibility Basis:**
| Criterion | Yes/No | Notes |
|-----------|--------|-------|
| Recent appraisal lists staff as "Recommended for Promotion" | | |
| Names and positions of recommended staff | | |
| Recommended employees meet TOR requirements | | |

**Section 3 - TOR Alignment:**
| TOR Requirement | Requirement | Status | Remarks |
|-----------------|-------------|--------|---------|
| Academic Qualification | | Meets/Does Not Meet | |
| Minimum Years of Experience | | Meets/Does Not Meet | |
| Technical Competencies | | Meets/Does Not Meet | |
| Behavioral Competencies | | Meets/Does Not Meet | |
| Required Certifications | | Meets/Does Not Meet | |
| Language Requirements | | Meets/Does Not Meet | |

**Section 4 - Feasibility Determination:**
| Assessment | Conclusion |
|------------|------------|
| At least one recommended staff meets TOR | Yes/No |
| Internal promotion is feasible | Yes/No |
| Summary Justification | |

**Section 5 - Recommended Next Step:**
- [ ] Proceed with Internal Promotion Process
- [ ] Internal Promotion Not Feasible - Proceed with Open Competition

**Section 6 - Approvals:**
| Role | Name | Signature | Date |
|------|------|-----------|------|
| HR Officer (Prepared By) | | | |
| HR Specialist (Reviewed By) | | | |
| Department Head (Consulted) | | | |
| ED/Delegate (Approval) | | | |

---

### Form 24: Performance Appraisal (V2)
**Purpose:** Annual performance evaluation
**File Type:** DOCX

**Staff Section:**
| Field | Type |
|-------|------|
| Staff Name | Text |
| Position | Text |
| Department/Unit/Project | Text |
| Line Manager | Text |
| Joining Date | Date |
| Review Date | Date |
| Core Responsibilities Understanding | Textarea |
| Achievements | Textarea |
| Self-Evaluation | Textarea |
| Other Comments | Textarea |

**HR Officer Section:** Objectives and rating scale explanation

**Line Manager Evaluation:**

**Rating Scale:** 1 = Needs Improvement, 2 = Basic, 3 = Good, 4 = Excellent

| Key Performance Area | Score | Remarks |
|---------------------|-------|---------|
| Work Approach & Productivity | | |
| Quality, Accuracy & Efficiency | | |
| Punctuality & Time Management | | |
| Communication Skills (Including English) | | |
| Technical Competence & Work Capacity | | |
| Problem Solving & Adaptability | | |
| Teamwork & Collaboration | | |
| Behavior with Beneficiaries (If Applicable) | | |
| Integrity & Professional Conduct | | |
| Commitment to VDO Values & Ethics | | |
| **Total Score** | | |

**Detailed Questions per Area (with 1-4 rating):**
- Work Approach: Attitude, responsibility, initiative, productivity
- Quality: Output quality, accuracy, efficiency, performance under pressure
- Punctuality: Reporting, time management, deadline meeting
- Communication: Written, verbal, listening, report quality
- etc.

**Strengths & Weaknesses:** Textarea for each

**Development Goals:** Textarea

**Conflict/Zero Tolerance Observations:** Textarea

**Management Decision:**
| Decision Type | Option |
|---------------|--------|
| Employment Contract | Renew / Terminate / Project End |
| Employee Benefit | Increment / Promotion / N/A |
| Increment Percentage | |
| New Position Title | |

**Signatures:**
- Staff Signature & Date
- Line Manager Signature & Date
- HR Receipt Signature & Date

---

### Form 25: Promotion Letter
**Purpose:** Formal notification of promotion
**File Type:** DOCX

**Fields:**
| Field | Type |
|-------|------|
| Date | Date |
| Employee Name | Text |
| Current Position | Text |
| Department/Project | Text |
| New Position | Text |
| Effective Date | Date |
| New Responsibilities | List |
| Revised Salary | Number |

**Acknowledgment Section:**
- Employee Name
- Employee Signature
- Date

**Approval:**
- Approver Name
- Title
- Signature
- Date

---

### Form 46: Probation Evaluation Form
**Purpose:** Evaluate employee during/after probation
**File Type:** DOC (Legacy - needs conversion)

**Admin Details:**
| Field | Type |
|-------|------|
| Employee Name | Text |
| Position | Text |
| Department | Text |
| Contract Details | Text |
| Supervisor | Text |
| Appraisal Committee Members | Text |
| Probation Start Date | Date |
| Probation End Date | Date |

**Section A - Line Manager Assessment:**
| Criteria | Rating | Evidence |
|----------|--------|----------|
| Job Knowledge | 1-5 | |
| Work Quality and Accuracy | 1-5 | |
| Productivity and Timeliness | 1-5 | |
| Attendance and Punctuality | 1-5 | |
| Communication Skills | 1-5 | |
| Professional Conduct | 1-5 | |
| Teamwork | 1-5 | |
| Adaptability | 1-5 | |
| Compliance with Values | 1-5 | |

**Section B - Appraisal Committee Review:**
| Assessment | Input |
|------------|-------|
| Overall Performance Rating | |
| Behavior and Values Adherence | |
| Suitability for Continued Employment | |
| Risk Assessment | |
| Recommendation | Confirm/Extend/Terminate |

**Section C - HR Recommendation:**
| Field | Input |
|-------|-------|
| HR Review Notes | |
| HR Recommendation | Confirm/Extend with PIP/Terminate |
| HR Specialist Signature | |

**Section D - ED/DD Approval:**
| Field | Input |
|-------|-------|
| Final Decision | |
| Signature | |
| Date | |

---

## 6. TRAINING & DEVELOPMENT MODULE

### Form 29: Training Needs Assessment Form
**Purpose:** Assess employee training needs
**File Type:** DOCX

**Employee Information:**
| Field | Type |
|-------|------|
| Name | Text |
| Position | Text |
| Department | Text |
| Supervisor | Text |
| Assessment Date | Date |

**Rating Scale:** 1 = Need Training, 5 = Expert

**Section 1 - Core Job Performance:**
| Evaluation Area | Description | Rating (1-5) | Comments |
|-----------------|-------------|--------------|----------|
| Job Knowledge & Technical Skills | | | |
| Quality of Work | | | |
| Productivity & Efficiency | | | |
| Field Management | | | |
| Proficiency in Local Languages | | | |
| Proficiency in English | | | |
| Communication Skills | | | |
| Teamwork & Collaboration | | | |
| Initiative, Judgment & Creativity | | | |
| Public Relations | | | |
| Attendance & Punctuality | | | |
| Adaptability & Learning | | | |
| Overall Performance | | | |

**Section 2 - Zero Tolerance Compliance:**
| Area | Rating (1-5) | Comments |
|------|--------------|----------|
| AAP - Accountability to Affected Populations | | |
| PSEAH Compliance | | |
| Safeguarding | | |
| Child Protection | | |
| Code of Conduct Compliance | | |
| Confidentiality & Data Privacy | | |

**Section 3 - Organizational Competencies:**
| Competency | Rating (1-5) | Comments |
|------------|--------------|----------|
| Compliance & Policy Adherence | | |
| Conflict Management | | |
| Expertise & Professional Competence | | |
| Commitment to Role & Organization | | |
| Contribution to Sustainability | | |
| Communication & Behavior | | |

**Total Score and Result:**
| Score Range | Result |
|-------------|--------|
| 1-20 | Complete training required |
| 21-40 | Targeted training in specific areas |
| 41-60 | Regular trainings required |

**Action Plan:**
| Field | Input |
|-------|-------|
| Training Priority | High/Medium/Low |
| Suggested Training Date | |
| Responsible Person | |

---

### Form 30: Training Calendar
**Purpose:** Plan annual training schedule
**File Type:** XLSX

**Header:**
- Organization Name
- Year

**Calendar Grid:**
| Week/Month | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec |
|------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| Week 1 | | | | | | | | | | | | |
| Week 2 | | | | | | | | | | | | |
| Week 3 | | | | | | | | | | | | |
| Week 4 | | | | | | | | | | | | |

**Signatures:**
| Role | Name | Position | Signature |
|------|------|----------|-----------|
| Prepared by | | | |
| Approved by | | | |

---

### Form 31: Budget Proposal for Training
**Purpose:** Request training budget approval
**File Type:** DOCX

**Training Details:**
| Field | Type |
|-------|------|
| Training Title | Text |
| Department | Text |
| Prepared by | Text |
| Date | Date |
| Training Purpose & Objectives | Textarea |

**Cost Breakdown:**
| Item No. | Component | Description | Qty/Duration | Unit Cost | Total Cost | Notes |
|----------|-----------|-------------|--------------|-----------|------------|-------|
| 1 | Trainer Fees | | | | | |
| 2 | Training Materials | | | | | |
| 3 | Venue/Facilities | | | | | |
| 4 | Travel & Accommodation | | | | | |
| 5 | Refreshments & Meals | | | | | |
| 6 | Training Technology | | | | | |
| 7 | Miscellaneous | | | | | |
| | **Subtotal** | | | | | |
| | Contingency (5-10%) | | | | | |
| | **Total** | | | | | |

**Signatures:**
- Prepared by: Name, Date
- Approved by: Name, Date, Comments

---

### Form 41: Training Request Form
**Purpose:** Employee request for training
**File Type:** DOCX

**Employee Details:**
| Field | Type |
|-------|------|
| Name | Text |
| Employee ID | Text |
| Designation | Text |
| Department | Text |
| Line Manager | Text |

**Training Details:**
| Field | Type |
|-------|------|
| Training Title | Text |
| Training Provider/Organization | Text |
| Training Location | Text |
| Start Date | Date |
| End Date | Date |
| Duration (Days/Hours) | Text |

**Training Objectives:** Textarea

**Justification:** Textarea

**Cost Details:**
| Item | Amount |
|------|--------|
| Training Fees | |
| Travel Expenses | |
| Accommodation | |
| Other Expenses | |
| **Total Estimated Cost** | |

**Approvals:**
| Role | Signature | Date |
|------|-----------|------|
| Requested by (Employee) | | |
| Line Manager | | |
| HR Specialist | | |

---

## 7. LEAVE & ATTENDANCE MODULE

### Form 34: Leave Request Form (V2)
**Purpose:** Employee leave application
**File Type:** DOCX

**Employee Information:**
| Field | Type |
|-------|------|
| Name | Text |
| ID | Text |
| Designation | Text |
| Department | Text |
| Line Manager Name | Text |

**Leave Details:**
| Field | Type |
|-------|------|
| From Date | Date |
| To Date | Date |
| Total Working Days | Number |
| Type of Leave | Radio |
| - Annual | Radio |
| - Sick | Radio |
| - Maternity | Radio |
| - Other (specify) | Text |

**Emergency Contact:**
| Field | Type |
|-------|------|
| Name | Text |
| Relationship | Text |
| Mobile Number | Text |

**Alternate Staff:**
| Field | Type |
|-------|------|
| Alternate Staff Name | Text |
| Alternate's Signature & Date | Signature |

**Additional Information:** Textarea

**Approvals:**
| Role | Signature | Date |
|------|-----------|------|
| Staff | | |
| Authority (per Delegation Matrix) | | |
| HR Officer Confirmation | | |

**Leave Balance:**
| Field | Value |
|-------|-------|
| Leave Available | |
| Leave After This Request | |

---

### Form 35: Leave Tracking Sheet
**Purpose:** Track all employee leave by month
**File Type:** XLSX

**Monthly Sheets (Jan-Dec):**

**Header:**
- Month Name
- Organization & Office
- Year

**Columns:**
| S/N | Name | Employee ID | Day 1 | Day 2 | ... | Day 31 | Total Leave |
|-----|------|-------------|-------|-------|-----|--------|-------------|

**Legend:**
- A = Annual Leave
- S = Sick Leave
- M = Maternity Leave
- U = Unpaid Leave
- H = Holiday
- blank = Present

---

### Form 36: Electronic Attendance Template
**Purpose:** Biometric attendance records
**File Type:** XLSX

**Header:**
| Field | Value |
|-------|-------|
| Employee ID | |
| Full Name | |
| Month/Year | |

**Daily Records:**
| Date | Workday | Timetable | Clock-In | Clock-Out | Status |
|------|---------|-----------|----------|-----------|--------|
| | | Normal Time (08:00-16:00) | True/False | True/False | Present/Late/Absent |

**Summary:**
- Total Working Days
- Days Present
- Days Absent
- Late Arrivals

---

### Form 37: Manual Attendance Template
**Purpose:** Paper-based attendance for field offices
**File Type:** XLSX

**Header:**
| Field | Type |
|-------|------|
| Staff Name | Text |
| Designation | Text |
| Location | Text |
| Project | Text |
| Donor | Text |
| Month/Year | Text |

**Daily Records:**
| Date | Day | Time In | Signature | Time Out | Signature | Remarks |
|------|-----|---------|-----------|----------|-----------|---------|
| 1 | | | | | | |
| 2 | | | | | | |
| ... | | | | | | |
| 31 | | | | | | |

**Supervisor Signature:** _____________

---

## 8. PAYROLL MODULE

### Form 42: VDO-AFN Payroll
**Purpose:** Monthly payroll processing
**File Type:** XLSX

**Sheet 1 - Payroll:**

**Header:**
- Month/Year (Solar and Gregorian)

**Employee Details Table:**
| S.No | ID# | Staff Name | Designation | Basic Salary | Working Days | Present Days | Salary for Month | Deductions | Net Salary |
|------|-----|------------|-------------|--------------|--------------|--------------|------------------|------------|------------|

**Signatures:**
| Role | Name | Position | Signature |
|------|------|----------|-----------|
| Prepared by | | HR Officer | |
| Reviewed by | | Finance Manager | |
| Approved by | | Executive Director | |

**Sheet 2 - Payslip:**
| Field | Value |
|-------|-------|
| S.No | |
| Staff Name | |
| ID No | |
| Designation | |
| Basic Salary | |
| Salary for Month | |
| Working Days | |
| Present Days | |
| Deductions | |
| Net Salary | |

---

## 9. EXIT & SEPARATION MODULE

### Form 43: Work Certificate
**Purpose:** Employment verification letter
**File Type:** DOCX

**Fields:**
| Field | Type |
|-------|------|
| Date | Date |
| Employee Name | Text |
| Position | Text |
| Employment Start Date | Date |
| Employment End Date | Date |
| Duties Summary | Textarea |
| Performance Summary | Textarea |

**Signature:**
- HR Department
- Contact Information

---

### Form 44: Exit Interview Form
**Purpose:** Gather feedback from departing employees
**File Type:** DOCX

**Section 1 - Employee Information:**
| Field | Type |
|-------|------|
| Employee Name | Text |
| Position Title | Text |
| Department | Text |
| Office Location | Text |
| Supervisor Name | Text |
| Start Date | Date |
| Exit/Last Working Date | Date |
| Type of Exit | Checkbox |
| - Resignation | [ ] |
| - End of Contract | [ ] |
| - Termination by VDO | [ ] |
| - Probation Not Passed | [ ] |
| - Retirement | [ ] |
| - Other | [ ] |

**Section 2 - Reason for Leaving (Multi-select):**

*Work Environment & Management:*
- [ ] Relationship with supervisor
- [ ] Conflict with colleagues
- [ ] Workplace culture
- [ ] Lack of support/recognition
- [ ] Harassment/discrimination
- [ ] Safety/security concerns

*Compensation & Benefits:*
- [ ] Salary not competitive
- [ ] Benefits insufficient
- [ ] Inconsistent incentives
- [ ] Increased financial needs

*Job Satisfaction:*
- [ ] Limited growth opportunities
- [ ] Responsibilities unclear
- [ ] High workload/overtime
- [ ] Lack of training
- [ ] Job not aligned with expectations

*Career & Personal:*
- [ ] Better job opportunity
- [ ] Career change
- [ ] Education
- [ ] Family/personal reasons
- [ ] Relocation

*Organizational Factors:*
- [ ] Lack of job security
- [ ] Project closure
- [ ] Management/leadership issues
- [ ] Poor communication

**Section 3 - Experience Rating (1-5):**
| Area | Rating |
|------|--------|
| Overall job satisfaction | |
| Work environment | |
| Management support | |
| Career development | |
| Compensation fairness | |
| Work-life balance | |

**Section 4 - Compliance Evaluation:**
| Question | Yes/No | Details |
|----------|--------|---------|
| Any unreported concerns during employment? | | |
| Witnessed any policy violations? | | |
| Suggestions for improvement? | | |

**Section 5-7 - Open-ended Questions:**
- Relationship with supervisor
- Work recognition
- Guidance and support received
- What did you like most?
- What did you like least?
- Suggestions for improvement

**Section 8 - HR Clearance Checklist:**
- [ ] Return of ID card
- [ ] Return of laptop/IT equipment
- [ ] Return of keys/access cards
- [ ] Return of documents/files
- [ ] Handover completed
- [ ] Exit clearance form signed
- [ ] Final payment settlement processed

**Section 9 - Signatures:**
- Employee Statement & Signature
- HR Representative Signature
- Date

---

### Form 47: Employee Exit Checklist
**Purpose:** Ensure complete separation process
**File Type:** DOC (Legacy - needs conversion)

**Employee Information:**
| Field | Type |
|-------|------|
| Name | Text |
| Position | Text |
| Department | Text |
| Last Working Day | Date |

**Clearance Sections:**

**Accounts Clearance:**
- [ ] Salary advances cleared
- [ ] Travel advances settled
- [ ] Any loans cleared
- Signature: ___________

**IT Clearance:**
- [ ] Email/Network access disabled
- [ ] Laptop returned
- [ ] Phone/SIM returned
- [ ] Other devices returned
- Signature: ___________

**Admin Clearance:**
- [ ] Keys returned
- [ ] ID card returned
- [ ] Parking card returned
- [ ] Office equipment returned
- Signature: ___________

**Supervisor Clearance:**
- [ ] Task handover completed
- [ ] Document handover completed
- [ ] Knowledge transfer completed
- [ ] Final work day confirmed
- Signature: ___________

**HR Final Clearance:**
- [ ] All sections signed
- [ ] Exit interview completed
- [ ] Final settlement calculated
- Signature: ___________

**Final Approval:** ED/HR Specialist signature

---

## 10. SPECIAL FORMS

### Form 39: Internal Transfer Eligibility Review
**Purpose:** Assess if employee qualifies for transfer
**File Type:** DOCX

**Section 1 - Basic Information:**
| Field | Type |
|-------|------|
| Employee Name | Text |
| Employee ID | Text |
| Current Position | Text |
| Current Department/Project | Text |
| Proposed Position for Transfer | Text |
| Proposed Department/Duty Station | Text |
| Type of Transfer | Checkbox |
| - Department Transfer | [ ] |
| - Project Transfer | [ ] |
| - Duty Station Transfer | [ ] |
| - Role Transfer | [ ] |
| Request Initiated By | Dropdown |
| Date of Request | Date |

**Section 2 - Contract & Employment Status:**
| Criteria | Yes | No | Remarks |
|----------|-----|-----|---------|
| Valid employment contract | | | |
| Contract allows transfer | | | |
| Not under notice period | | | |
| No active disciplinary process | | | |
| Required clearances completed | | | |

**Section 3 - Performance Check:**
| Indicator | Meets | Does Not Meet | Remarks |
|-----------|-------|---------------|---------|
| Last appraisal meets VDO standards | | | |
| Attendance acceptable | | | |
| Behavioral standards met | | | |

**Section 4 - Qualification & Skills Match:**
(TOR alignment checklist similar to Form 23)

**Section 5 - Supervisor Feedback:**
| Field | Type |
|-------|------|
| Current Supervisor Name | Text |
| Feedback on suitability | Textarea |
| Supervisor Signature | Signature |
| Date | Date |

**Section 6 - HR Assessment:**

*HR Officer Review:*
| Field | Input |
|-------|-------|
| Documentation complete | Yes/No |
| All criteria reviewed | Yes/No |
| Initial recommendation | Eligible/Not Eligible |
| Signature | |
| Date | |

*HR Specialist Evaluation:*
| Field | Input |
|-------|-------|
| Summary of suitability | |
| Final HR Recommendation | Eligible/Not Eligible/Eligible with Conditions |
| Signature | |
| Date | |

**Section 7 - Approval:**
| Decision | Checkbox |
|----------|----------|
| Approved for Internal Transfer | [ ] |
| Not Approved | [ ] |
| Effective Date | |

**HR to Issue:**
- [ ] Transfer Letter
- [ ] Contract Amendment
- [ ] Duty Station Change Memo

---

### Form 54: Dual Employment Declaration
**Purpose:** Disclose secondary employment
**File Type:** DOCX

**Employee Information:**
| Field | Type |
|-------|------|
| Full Name | Text |
| Job Title | Text |
| Department | Text |
| VDO Contract Start Date | Date |
| VDO Contract End Date | Date |

**Secondary Employment Details:**
| Field | Type |
|-------|------|
| Organization Name | Text |
| Job Title | Text |
| Department | Text |
| Monthly Income | Number |
| Contract Start Date | Date |
| Contract End Date | Date |
| Work Schedule | Radio (Part-time/Full-time) |

**Employee Declaration:**
- Declaration Statement
- Employee Signature
- Date

**HR Review:**
| Question | Response |
|----------|----------|
| Conflict of interest with VDO? | Yes/No |
| Explanation | |
| Data Privacy concerns | |
| Document sharing concerns | |
| Intellectual property conflicts | |

**Verified By:**
- Name
- Position
- Signature & Stamp
- Date

---

## WORKFLOW DIAGRAMS

### Open Competition Recruitment Flow
```
1. ToR Development (Form 1)
   ↓
2. Staff Requisition (Form 2) → Update Tracker (Form 3)
   ↓
3. Requisition Review & Verification
   ↓
4. Vacancy Announcement
   ↓
5. Application Receipt (Form 4) → Update Tracker (Form 3)
   ↓
6. RC Formation (Form 45) + COI Declarations (Form 5)
   ↓
7. Longlisting (Form 6)
   ↓
8. Shortlisting (Form 7)
   ↓
9. Written Test (Forms 8, 9, 10) [if applicable]
   ↓
10. Interview (Forms 11, 12, 13)
    ↓
11. Recruitment Report (Form 14)
    ↓
12. Conditional Offer (Form 15)
    ↓
13. Sanction Clearance (Form 16)
    ↓
14. Background Checks (Forms 17, 18, 19, 20)
    ↓
15. Employment Contract (Form 21) + File Checklist (Form 22)
```

### Internal Promotion Flow
```
1. ToR Development (Form 1)
   ↓
2. Staff Requisition (Form 2)
   ↓
3. Requisition Verification
   ↓
4. Internal Promotion Feasibility (Form 23)
   ↓
5. Performance Review (Form 24)
   ↓
6. Promotion Letter (Form 25) + Contract Amendment (Form 50)
```

### Employee Onboarding Flow
```
1. Contract Signed (Form 21)
   ↓
2. Induction Pack Provided (Form 51)
   ↓
3. Induction Session (Form 28)
   ↓
4. Acknowledgment Forms Signed:
   - Code of Conduct (Form 32)
   - PSEAH (Form 53)
   - NDA (Form 55)
   - COI (Form 5)
   - Mahram Form (Form 40/52) [if female]
   ↓
5. Personnel File Complete (Form 33)
```

### Leave Request Flow
```
1. Employee Submits Leave Request (Form 34)
   ↓
2. Line Manager Approval
   ↓
3. HR Verifies Leave Balance
   ↓
4. Update Leave Tracker (Form 35)
   ↓
5. Update Attendance (Form 36/37)
```

### Exit Process Flow
```
1. Resignation Letter / Termination Notice (Form 27)
   ↓
2. Exit Checklist Issued (Form 47)
   ↓
3. Departmental Clearances
   ↓
4. Exit Interview (Form 44)
   ↓
5. Final Settlement Calculation
   ↓
6. Work Certificate (Form 43) [if eligible]
```

---

## FORM RELATIONSHIPS

| Form | Related Forms | Relationship |
|------|---------------|--------------|
| Form 1 (ToR) | Form 2, 7, 23 | Referenced in SRF, Shortlisting, Promotion |
| Form 2 (SRF) | Form 1, 3 | Links ToR to Recruitment Tracker |
| Form 3 (Tracker) | All recruitment forms | Central tracking document |
| Form 5 (COI) | Form 45 | Auto-generated after RC approval |
| Form 14 (Report) | Forms 6-13 | Summarizes all recruitment documents |
| Form 21 (Contract) | Form 1, 15 | References ToR and Offer Letter |
| Form 24 (Appraisal) | Form 23, 25 | Determines promotion eligibility |
| Form 33 (File Checklist) | All forms | Master checklist for all documents |
| Form 34 (Leave) | Form 35, 36, 37 | Updates tracking and attendance |
| Form 42 (Payroll) | Form 36, 37 | Based on attendance records |
| Form 44 (Exit Interview) | Form 47 | Part of exit process |

---

## NOTES FOR FRONTEND DEVELOPMENT

1. **Digital vs Legacy Forms:**
   - Forms 4, 8, 17, 46, 47 are .DOC format (legacy) - need digital conversion
   - All other forms should be built as digital forms

2. **Approval Workflows:**
   - Most forms require multi-level approval
   - Implement approval routing based on position level (SMT vs Others)
   - Track approval status and timestamps

3. **Auto-calculations:**
   - Form 7: Weighted scores
   - Form 13: Combined test + interview scores
   - Form 34: Leave balance
   - Form 42: Salary calculations

4. **File Attachments:**
   - Many forms require document attachments (CV, certificates, photos)
   - Implement secure file upload and storage

5. **Form Dependencies:**
   - SRF requires approved ToR
   - Shortlisting requires completed Longlisting
   - Contract requires completed background checks
   - Implement dependency validation

6. **Reporting:**
   - Form 3 (Tracker) should have dashboard/reporting views
   - Form 35 (Leave Tracker) needs summary reports
   - Form 42 (Payroll) needs monthly reports

7. **Access Control:**
   - HR Officer, HR Specialist, Line Manager, ED/DD roles
   - Different forms accessible to different roles
   - Audit trail for all changes

8. **Language Support:**
   - Form 18 (Guarantee Letter) is in Dari
   - Consider bilingual support for local context forms
