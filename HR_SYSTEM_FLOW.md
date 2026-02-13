# VDO HR System - Frontend Flow Guide

This document explains how the HR system works step-by-step for frontend development.

---

## USER ROLES

| Role | Access Level |
|------|--------------|
| Employee | Self-service (leave, profile, forms) |
| Line Manager | Team management, approvals |
| HR Officer | HR operations, data entry |
| HR Specialist | HR review, compliance |
| Finance Officer | Budget verification, payroll |
| ED/DD | Final approvals (SMT positions) |
| HOP | Final approvals (other positions) |

---

## SYSTEM MODULES

```
HR System
├── 1. Recruitment
├── 2. Employee Management
├── 3. Leave & Attendance
├── 4. Performance
├── 5. Training
├── 6. Payroll
└── 7. Exit
```

---

## 1. RECRUITMENT MODULE

### 1.1 Open Competition Flow

```
Step 1: Create Position Request
─────────────────────────────────
WHO: Department Head + HR Officer
FORMS: Form 1 (ToR), Form 2 (SRF)

Action:
1. Department Head opens "New Position Request"
2. Fills Form 1 (ToR):
   - Position details
   - Requirements
   - Responsibilities
3. Fills Form 2 (SRF):
   - Contract type
   - Budget code
   - Equipment needed
4. Submits for approval

Approval Chain:
- HR Specialist (review) → Finance (budget check) → ED/DD or HOP (approve)

System Action:
- On approval: Auto-create entry in Form 3 (Recruitment Tracker)
- Status: "Approved - Ready to Announce"
```

```
Step 2: Vacancy Announcement
────────────────────────────
WHO: HR Specialist
FORMS: None (uses Form 1 data)

Action:
1. HR Specialist opens approved position
2. Clicks "Announce Vacancy"
3. System generates job posting from Form 1
4. HR publishes to channels (website, ACBAR, etc.)
5. Sets closing date

System Action:
- Update Form 3: Status = "Announced"
- Enable "Apply" button for candidates
```

```
Step 3: Receive Applications
────────────────────────────
WHO: HR MIS Officer / System
FORMS: Form 4 (Application)

Action:
1. Candidates fill Form 4 online OR
2. HR enters received applications manually
3. Each application auto-logged in Form 3

System Action:
- Auto-assign application number
- Track: Name, Date, Position, Status
```

```
Step 4: Form Recruitment Committee
──────────────────────────────────
WHO: HR Officer + HR Specialist
FORMS: Form 45 (RC Form), Form 5 (COI)

Action:
1. After closing date, HR opens "Form RC"
2. HR Specialist selects committee members (3-4 people)
3. Fills Form 45 with member details
4. Submits for approval

On RC Approval:
- System auto-generates Form 5 (COI) for each member
- Sends notification to each member
- Members must sign COI before proceeding

System Action:
- RC cannot proceed until all COIs signed
- Update Form 3: Status = "RC Formed"
```

```
Step 5: Longlisting
───────────────────
WHO: RC Members
FORMS: Form 6 (Longlist)

Action:
1. RC opens "Longlisting" for the position
2. System shows all applications from Form 4
3. System shows minimum requirements from Form 1 (ToR)
4. RC marks each candidate: Eligible / Not Eligible
5. RC Chair confirms longlist

System Action:
- Filter eligible candidates
- Update Form 3: Status = "Longlisted"
- Move to shortlisting
```

```
Step 6: Shortlisting
────────────────────
WHO: RC Members
FORMS: Form 7 (Shortlist Scoring)

Action:
1. RC opens "Shortlisting"
2. System shows only eligible candidates from Step 5
3. RC sets criteria weights (from ToR):
   - Academic: 30%
   - Experience: 50%
   - Other: 20%
4. RC scores each candidate (0-100 per criteria)
5. System auto-calculates total weighted score
6. RC confirms shortlist (usually score >= 75)

System Action:
- Rank candidates by score
- Update Form 3: Status = "Shortlisted"
```

```
Step 7: Written Test (if required)
──────────────────────────────────
WHO: HR Officer + RC
FORMS: Form 8 (Test Paper), Form 9 (Attendance), Form 10 (Results)

Action:
1. HR schedules test date
2. System notifies shortlisted candidates
3. On test day:
   - Candidates sign Form 9 (Attendance)
   - Candidates assigned anonymous codes
4. After test:
   - RC grades papers using codes only
   - HR enters scores in Form 10
5. System reveals names after grading

System Action:
- Link scores to candidates
- Update Form 3 with test scores
```

```
Step 8: Interview
─────────────────
WHO: RC Panel
FORMS: Form 11 (Interview Evaluation), Form 12 (Attendance), Form 13 (Results)

Action:
1. HR schedules interview dates
2. System notifies candidates
3. Candidates sign Form 12 (Attendance)
4. Each RC member fills Form 11:
   - Answer ratings (1-5)
   - Notes
5. System compiles scores into Form 13
6. System calculates final score:
   - Written Test Weight (from ToR) +
   - Interview Weight (from ToR)

System Action:
- Rank final candidates
- Update Form 3: Status = "Interviewed"
```

```
Step 9: Selection & Report
──────────────────────────
WHO: RC Chair + HR
FORMS: Form 14 (Recruitment Report)

Action:
1. RC Chair opens "Generate Report"
2. System auto-fills Form 14 with:
   - All recruitment data
   - Top 3 candidates with scores
3. RC Chair adds recommendation
4. All RC members sign
5. Submit to Approving Authority

Approval:
- ED/DD (SMT positions) or HOP (others)
- Approver selects 1 from top 3

System Action:
- Update Form 3: Status = "Selected"
- Selected candidate marked
```

```
Step 10: Offer Letter
─────────────────────
WHO: HR Officer
FORMS: Form 15 (Offer Letter)

Action:
1. HR opens "Generate Offer"
2. System auto-fills Form 15 from Form 1 + Form 2
3. HR reviews and sends to candidate
4. Candidate signs acceptance section
5. HR uploads signed offer

System Action:
- Update Form 3: Status = "Offer Accepted"
- Trigger background check workflow
```

```
Step 11: Background Checks
──────────────────────────
WHO: HR Officer
FORMS: Form 16, 17, 18, 19, 20

Action (parallel):
1. Form 16 (Sanction Check):
   - HR searches UN sanction lists
   - Records results

2. Form 17 (Reference Check):
   - HR contacts 2-3 references
   - Records feedback

3. Form 18 (Guarantee Letter):
   - Candidate submits guarantor info
   - HR verifies

4. Form 19 (Address Verification):
   - HR verifies home address

5. Form 20 (Criminal Check):
   - Candidate submits MOI clearance
   - HR verifies

All Checks Pass → Proceed to Contract
Any Check Fails → HR Specialist reviews → Decision

System Action:
- Track each check status
- All must be "Cleared" to proceed
```

```
Step 12: Employment Contract
────────────────────────────
WHO: HR Specialist
FORMS: Form 21 (Contract), Form 22 (Checklist)

Action:
1. HR Specialist generates Form 21 (Contract)
2. System auto-fills from previous forms
3. Contract sent for signatures:
   - Employee signs
   - ED/DD/HOP signs
4. HR completes Form 22 (Checklist)
5. Upload all documents to personnel file

System Action:
- Create Employee record
- Update Form 3: Status = "Hired"
- Trigger Onboarding workflow
```

---

### 1.2 Internal Promotion Flow

```
Step 1: Check Feasibility
─────────────────────────
WHO: HR Officer + HR Specialist
FORMS: Form 1 (ToR), Form 2 (SRF), Form 23 (Feasibility)

Action:
1. Create/update ToR (Form 1)
2. Create SRF (Form 2) - select "Internal Promotion"
3. System checks:
   - Any employee marked "Recommended for Promotion" in last appraisal?
4. HR fills Form 23:
   - Compare employee qualifications vs ToR
   - Determine if internal promotion is feasible

Result:
- Feasible → Proceed with promotion
- Not Feasible → Switch to Open Competition
```

```
Step 2: Process Promotion
─────────────────────────
WHO: HR Specialist
FORMS: Form 24 (Appraisal), Form 25 (Promotion Letter), Form 50 (Amendment)

Action:
1. Review latest Form 24 (Performance Appraisal)
2. Generate Form 25 (Promotion Letter):
   - New position
   - New salary
   - Effective date
3. Generate Form 50 (Contract Amendment)
4. Get approvals and signatures

System Action:
- Update employee record
- Update salary in payroll
```

---

### 1.3 Sole Source Recruitment Flow

```
Step 1-3: Same as Open Competition (ToR, SRF, Verification)

Step 4: Justify Sole Source
───────────────────────────
WHO: Department Head + HR
FORMS: Form 38 (Justification)

Action:
1. Fill Form 38 with justification:
   - Why competitive process not used
   - Candidate qualifications
2. Get approval chain signatures

Step 5-7: Skip to Background Checks and Contract
```

---

## 2. EMPLOYEE MANAGEMENT (ONBOARDING)

```
Trigger: New employee contract signed
──────────────────────────────────────
WHO: HR Officer
FORMS: Form 28, 32, 33, 40/52, 51, 53, 55

Day 1 Actions:

1. HR opens "New Employee Onboarding"
2. System creates employee profile from contract data
3. HR schedules orientation session

4. Generate Induction Pack (Form 51):
   - System prepares document checklist
   - HR provides materials

5. Conduct Orientation (Form 28):
   - HR completes orientation checklist
   - Supervisor completes job-specific orientation
   - Employee signs

6. Employee Signs Acknowledgment Forms:
   - Form 32 (Code of Conduct)
   - Form 53 (Safeguarding/PSEAH)
   - Form 55 (NDA)
   - Form 5 (COI Declaration)
   - Form 40 or 52 (Mahram) - if female employee

7. Complete Personnel File (Form 33):
   - HR checks all documents collected
   - Marks checklist complete

System Action:
- Employee status: "Active"
- Probation tracking starts
- Enable employee self-service
```

---

## 3. LEAVE & ATTENDANCE MODULE

### 3.1 Daily Attendance

```
WHO: Employee / HR
FORMS: Form 36 (Electronic), Form 37 (Manual)

Kabul Office (Biometric):
- Employee clocks in/out
- System records in Form 36
- Auto-syncs daily

Field Offices (Manual):
- Employee signs Form 37 daily
- Supervisor verifies weekly
- HR enters into system monthly
```

### 3.2 Leave Request Flow

```
Step 1: Submit Request
──────────────────────
WHO: Employee
FORMS: Form 34 (Leave Request)

Action:
1. Employee opens "Request Leave"
2. Fills Form 34:
   - Leave type
   - Dates
   - Emergency contact
   - Alternate staff
3. Submits

System Action:
- Check leave balance
- Route to Line Manager
```

```
Step 2: Approval
────────────────
WHO: Line Manager → HR

Action:
1. Line Manager reviews request
2. Approves/Rejects based on:
   - Operational needs
   - Leave balance (shown by system)
3. If approved → HR confirms balance

System Action:
- Update Form 35 (Leave Tracker)
- Deduct from balance
- Notify employee
```

### 3.3 Leave Balance Tracking

```
WHO: HR
FORMS: Form 35 (Leave Tracker)

Monthly:
1. System consolidates all leave data
2. HR reviews Form 35
3. Reconcile with attendance

Annual:
- Check unused leave
- Process carry-over (if ED approves)
```

---

## 4. PERFORMANCE MODULE

### 4.1 Probation Evaluation

```
Trigger: 15 days before probation ends
─────────────────────────────────────
WHO: HR → Line Manager → Committee → ED
FORMS: Form 46 (Probation Evaluation)

Action:
1. System notifies HR
2. HR prepares Form 46 with employee details
3. Line Manager completes Section A (daily performance)
4. Appraisal Committee completes Section B
5. HR Specialist adds recommendation (Section C)
6. ED/DD makes final decision (Section D)

Outcomes:
- Confirm → Generate Form 49 (Confirmation Letter)
- Extend → Generate Form 26 (Extension Letter)
- Terminate → Generate Form 27 (Termination Letter)
```

### 4.2 Annual Performance Appraisal

```
Trigger: November/December each year
───────────────────────────────────
WHO: Employee → Line Manager → Committee → ED
FORMS: Form 24 (Performance Appraisal)

Step 1: Self-Assessment (Employee)
- Employee fills self-assessment section
- Submit to Line Manager

Step 2: Line Manager Evaluation
- Rate competencies (1-4 scale)
- Add comments
- Submit to Committee

Step 3: Committee Review
- Review all appraisals
- Discuss and finalize ratings
- Make recommendations

Step 4: Management Decision
- Contract: Renew / Terminate / Project End
- Benefit: Increment / Promotion / N/A

System Action:
- Update employee record
- Flag "Recommended for Promotion" if applicable
- Trigger salary change if increment approved
```

---

## 5. TRAINING MODULE

### 5.1 Training Needs Assessment

```
WHO: Line Manager + HR
FORMS: Form 29 (Training Needs)

When: After annual appraisal OR when needed

Action:
1. Line Manager assesses employee on Form 29
2. Rate each competency (1-5)
3. System calculates training priority
4. HR consolidates all assessments
```

### 5.2 Training Planning

```
WHO: HR
FORMS: Form 30 (Calendar), Form 31 (Budget)

Annual:
1. HR creates training calendar (Form 30)
2. HR prepares budget proposal (Form 31)
3. ED approves calendar and budget
```

### 5.3 Training Request

```
WHO: Employee → Line Manager → HR
FORMS: Form 41 (Training Request)

Action:
1. Employee fills Form 41
2. Line Manager approves
3. HR Specialist approves
4. If approved → Add to calendar
```

---

## 6. PAYROLL MODULE

### 6.1 Monthly Payroll Flow

```
Timeline: 18th - 30th of each month
──────────────────────────────────
WHO: HR → Finance → ED
FORMS: Form 36/37 (Attendance), Form 34 (Leave), Form 42 (Payroll)

Step 1: Data Collection (18th-20th)
WHO: HR Officer

Collect:
- Attendance from Form 36/37
- Approved leave from Form 34
- New joiners / terminations
- Contract changes / promotions
- Deductions (late, unpaid leave)

Step 2: Payroll Preparation (21st-25th)
WHO: HR Specialist

Action:
1. HR calculates in Form 42:
   - Basic salary
   - Allowances
   - Deductions
   - Tax
2. HR signs and sends to Finance

Step 3: Finance Review (25th-28th)
WHO: Finance Officer → Finance Manager

Action:
1. Verify calculations
2. Check budget codes
3. Prepare payment file

Step 4: Approval & Payment (29th-30th)
WHO: ED/DD

Action:
1. ED reviews and approves
2. Finance processes bank transfer
3. Generate payslips

System Action:
- Record payment
- Generate payslips (Form 42 Sheet 2)
- Archive for audit
```

---

## 7. EXIT MODULE

### 7.1 Resignation Flow

```
Step 1: Submit Resignation
──────────────────────────
WHO: Employee
FORMS: Resignation Letter (free form)

Action:
1. Employee submits resignation letter
2. HR logs in system
3. Route to ED for approval/rejection
```

```
Step 2: Exit Process
────────────────────
WHO: HR
FORMS: Form 47 (Exit Checklist), Form 44 (Exit Interview)

Action:
1. HR issues Form 47 (Exit Checklist)
2. Employee gets clearance from:
   - Accounts
   - IT
   - Admin
   - Supervisor
3. HR conducts Exit Interview (Form 44)
4. All sections signed
```

```
Step 3: Final Settlement
────────────────────────
WHO: HR → Finance → ED

Action:
1. HR completes checklist
2. Finance calculates final payment:
   - Salary to last day
   - Leave encashment
   - Deductions
3. ED approves
4. Finance processes payment
```

```
Step 4: Work Certificate
────────────────────────
WHO: HR
FORMS: Form 43 (Work Certificate)

If eligible (not terminated for cause):
1. HR generates Form 43
2. ED signs
3. Issue to employee
```

### 7.2 Termination Flow

```
Without Cause:
1. HR generates Form 27 (Termination Letter)
2. Follow Exit Process (Steps 2-4 above)
3. Issue Work Certificate

With Cause:
1. Warning letters documented
2. HR generates Form 27
3. Follow Exit Process (Steps 2-3)
4. NO Work Certificate issued
```

---

## FORM FLOW SUMMARY

```
RECRUITMENT:
Form 1 → Form 2 → Form 3 → Form 45 → Form 5 → Form 6 → Form 7
→ Form 8,9,10 → Form 11,12,13 → Form 14 → Form 15
→ Form 16,17,18,19,20 → Form 21 → Form 22

ONBOARDING:
Form 21 → Form 51 → Form 28 → Form 32,53,55,5,40/52 → Form 33

LEAVE:
Form 34 → Approval → Form 35 → Form 36/37

PERFORMANCE:
Form 46 (Probation) OR Form 24 (Annual) → Form 49/26/27 OR Form 25

TRAINING:
Form 29 → Form 30 → Form 31 → Form 41

PAYROLL:
Form 36/37 + Form 34 → Form 42

EXIT:
Resignation/Form 27 → Form 47 → Form 44 → Form 43
```

---

## DASHBOARD VIEWS

### HR Officer Dashboard
- Pending applications
- Pending background checks
- Probation due dates
- Leave requests pending
- Attendance summary

### HR Specialist Dashboard
- Pending approvals
- Recruitment status
- Compliance issues
- Training calendar

### Line Manager Dashboard
- Team attendance
- Leave requests to approve
- Performance appraisals due
- Team training status

### Employee Self-Service
- My profile
- Leave balance & request
- My attendance
- My documents
- Training history

### ED/DD Dashboard
- Pending final approvals
- Staff count summary
- Budget utilization
- Key metrics

---

## NOTIFICATIONS

| Event | Notify |
|-------|--------|
| New application received | HR Officer |
| COI form pending | RC Member |
| Leave request submitted | Line Manager |
| Leave approved/rejected | Employee |
| Probation ending (15 days) | HR Officer, Line Manager |
| Appraisal due | Employee, Line Manager |
| Training scheduled | Participants |
| Document expiring | HR Officer |
| Approval pending | Approver |

---

## STATUS TRACKING

### Recruitment Status
```
Draft → Pending Approval → Approved → Announced →
Applications Open → Longlisting → Shortlisting →
Testing → Interviewing → Selected → Offer Sent →
Offer Accepted → Background Check → Contract → Hired
```

### Employee Status
```
Onboarding → Probation → Active →
[Promotion/Transfer] → Exit Processing → Exited
```

### Leave Status
```
Draft → Submitted → Manager Approved → HR Confirmed → Taken
```

### Appraisal Status
```
Not Started → Self-Assessment → Manager Review →
Committee Review → Decision Made → Communicated
```
