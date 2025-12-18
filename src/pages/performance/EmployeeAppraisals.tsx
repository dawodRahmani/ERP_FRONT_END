import {
  CheckCircle,
  ClipboardList,
  Clock,
  Edit,
  Eye,
  FileText,
  MessageSquare,
  Plus,
  Printer,
  Search,
  Send,
  User,
  XCircle
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { employeeDB } from "../../services/db/indexedDB";
import performanceService from "../../services/db/performanceService";

// ==================== INTERFACES ====================

interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  position?: string;
  department?: string;
  email?: string;
  phone?: string;
  dateOfHire?: string;
}

interface AppraisalCycle {
  id: string;
  name: string;
  cycleType: "annual" | "mid_year" | "quarterly";
  fiscalYear: number;
  startDate: string;
  endDate: string;
  status: string;
}

interface AppraisalTemplate {
  id: string;
  name: string;
  templateType: string;
  description?: string;
}

interface AppraisalSection {
  id: string;
  templateId: string;
  name: string;
  description?: string;
  weightPercentage: number;
  sortOrder: number;
}

interface AppraisalCriteria {
  id: string;
  sectionId: string;
  name: string;
  description?: string;
  weight: number;
  sortOrder: number;
}

interface AppraisalRating {
  id: string;
  appraisalId: string;
  criteriaId: string;
  selfRating?: number;
  selfComment?: string;
  managerRating?: number;
  managerComment?: string;
  committeeRating?: number;
  committeeComment?: string;
}

interface AppraisalGoal {
  id: string;
  appraisalId: string;
  description: string;
  targetDate?: string;
  status: string;
  progress?: number;
}

interface TrainingNeed {
  id: string;
  appraisalId: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: string;
}

interface EmployeeAppraisal {
  id: string;
  employeeId: number;
  cycleId: string;
  templateId: string;
  appraisalType: string;
  status: string;
  selfAssessmentScore?: number;
  managerScore?: number;
  committeeScore?: number;
  finalScore?: number;
  performanceLevel?: string;
  recommendation?: string;
  employeeAchievements?: string;
  employeeChallenges?: string;
  employeeComments?: string;
  managerOverallComments?: string;
  managerStrengths?: string;
  managerImprovements?: string;
  managerTrainingRecommendations?: string;
  managerRecommendation?: string;
  committeeComments?: string;
  committeeRecommendation?: string;
  approvedBy?: string;
  approvedAt?: string;
  approvalComments?: string;
  finalDecision?: string;
  selfAssessmentStartedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface StatusConfig {
  label: string;
  color: string;
  icon: React.FC<{ className?: string }>;
}

// ==================== VDO LOGO BASE64 ====================

const VDO_LOGO_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDg4LCAyMDIwLzA3LzEwLTIyOjA2OjUzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTAxLTE1VDEwOjMwOjAwKzA1OjMwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTAxLTE1VDEwOjMwOjAwKzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wMS0xNVQxMDozMDowMCswNTozMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4YTk5YTk5YS05OTk5LTQ5OTktOTk5OS05OTk5OTk5OTk5OTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OGE5OWE5OWEtOTk5OS00OTk5LTk5OTktOTk5OTk5OTk5OTk5IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6OGE5OWE5OWEtOTk5OS00OTk5LTk5OTktOTk5OTk5OTk5OTk5IiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OGE5OWE5OWEtOTk5OS00OTk5LTk5OTktOTk5OTk5OTk5OTk5IiBzdEV2dDp3aGVuPSIyMDI0LTAxLTE1VDEwOjMwOjAwKzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoV2luZG93cykiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VkPqNgAABRdJREFUeJzt3c9rU1kYxvHnJkkT09SmVlur1p+o6FjUKrgQBBdSFy5EEAQXLmah4MKFa/8BFy5cuHDhwoULwYULF4ILQRCKoBZEi1hbrVbb2mbSJjfJuYubdKZ07nszc+85c3h/m0Jy3/ue5yS598wJBEFgAADp6tGLqHd8n7oEAKMR3oQkEj8BXPAQAYwJBEFg7h3fZ0YOW7S3P/K9DMA7Q0Fg7h3bB4hgmIaLxGBMAkMzCoxJZFiIYIyGi0Qw5sJTBIwBiSRgbA6NYCyOiWAsjolgrA6NYIwCYywOjWBMjoVgjAqN4MwCY3JoBGMvHBnBWJ0awVgdEsHYHRLBWBwSwdgbCsHYGwrB2BoKwdgaCsHYGgrBWBsKwdgaCsHYGQrB2BkKwdgYCsHYGArBWBoKwdgYCsGYGwrB2BgKwZgbCsFYGwrBGBsKwRgbCsEYGwrBGBsKwVgaCsHYGgrBWBsKwRgbCsEYGwrBGBkKwRgZCsHYGArB2BkKwdgYCsEYHArBGBsKwRgbCsEYGwrBWBoKwdgaCsHYGgrBWBsKwRgaCsHYGArBmBsKwdgaCsGYGwrB2BsKwVgbCsEYGwrBGBkKwRgZCsHYGArB2BkKwdgYCsEYHArBGBsKwRgbCsEYGwrBWBoKwdgaCsHYGgrBWBsKwRgaCsHYGArBmBsKwdgaCsGYGwrB2BsKwVgbCsEYGwrBGBkKwRgZCsHYGArB2BkKwdgYCsEYHArBGBsKwRgbCsEYGwrBWBoKwdgaCsHYGgrBWBsKwRgaCsHYGArBmBsKwdgaCsGYGwrB2BsKwVgbCsEYGwrBGBkKwRgZCsHYGArB2BkKwdgYCsEYHArBGBsKwRgbCsEYGwrBWBoKwdgaCsHYGgrBWBsKwVh7P/QOAPwqCAKja4v/AHAbwMsgiP5JREQkIZH4bxBE5wBJABCZP/wkIn8TkTdBEBvGRxKRv4jIDSISj48RkZCIXAcQnYEgCGQQBOY/RPR2EESnAJwDMBAE0XUA1wFMAjgBAE8HQXSSiFwhIncARBuIyD8AxInoVQA9RHTkA4D/OwRBYB4F0TEicoOIvB0EsYUvA/j/4CmA60QkSkT+KiIJInoNwPlBEJuISJSIRIjI3wBEZyAIjPEgCAzDIDAMAsMwCAzDIDAMgwBYJCJPx78BwPMgMDaIyCARaR8E0WUAmwB+TET+RUQCALaDIDoCIC8I4r8BSAR4EwTGJhGJA4gCuEREnoLIBPAWEbmaiBwKgtgmgK+JyPNBEBsk8nAQxCaJ/A/ANoDVIIj/BvAUQCKA3wFIAvieiBwCsA2gL4iOAPgeQBTAtSCITRJ5AEAkCGLJIIj+HkA0COK/A/g7gH4iugTgWBDYhgD0A4gEQfzvAPqC6ACRhwCkgyDWDWAQwAYAMwCOBVEdwFMAxojIOwDiQRA7AWARwAQRaQ0C2x8A9gHMAxgPguhxAIMApoMgegDABoBlAJMAxoMgegTAOoDZIIieALAEYCYIoocALAKYDoLoHIBlADNBED0BYAnAdBBEzwDYE0T3ApgOME1EwhMAfg4C4xEAAJkgiP4YQLqNAOQCkGsD8FMRiT4C8HIQRHfZ7wFIBUF0BUCfMDCCIMYCwDIR6SJiawCqAoA3AawFgXEUwEwQRM8BOGAvAPMAxolIDMDpIIgdBrBN5HsAMkEQOwtgnYhkACQGQXQNwDYRCQIYJGK9RGQP4hgEsT0AThCRGIDpIIgeBfB/fNJMx3+iGE0AAAAASUVORK5CYII=";

// ==================== RATING SCALE ====================

const RATING_SCALE = [
  { value: 0, label: "Not Rated" },
  { value: 1, label: "Unsatisfactory" },
  { value: 2, label: "Needs Improvement" },
  { value: 3, label: "Basic" },
  { value: 4, label: "Good" },
  { value: 5, label: "Outstanding" },
];

// ==================== ANNEXURE #24 PDF GENERATION ====================

const generateAnnexure24PDF = async (
  appraisal: EmployeeAppraisal,
  employee: Employee | undefined,
  cycle: AppraisalCycle | undefined,
  template: AppraisalTemplate | undefined,
  sections: AppraisalSection[],
  criteria: AppraisalCriteria[],
  ratings: AppraisalRating[],
  goals: AppraisalGoal[],
  trainingNeeds: TrainingNeed[]
): Promise<void> => {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRatingLabel = (value?: number): string => {
    if (!value) return "Not Rated";
    return RATING_SCALE.find((r) => r.value === value)?.label || "Not Rated";
  };

  const getPerformanceLevelColor = (score?: number): string => {
    if (!score) return "#6B7280";
    if (score >= 80) return "#059669";
    if (score >= 70) return "#10B981";
    if (score >= 50) return "#3B82F6";
    if (score >= 30) return "#F59E0B";
    return "#EF4444";
  };

  const getPerformanceLevelLabel = (score?: number): string => {
    if (!score) return "Not Evaluated";
    if (score >= 80) return "Outstanding";
    if (score >= 70) return "Exceeds Expectations";
    if (score >= 50) return "Meets Expectations";
    if (score >= 30) return "Needs Improvement";
    return "Unsatisfactory";
  };

  const getRecommendation = (score?: number): string => {
    if (!score) return "Pending Evaluation";
    if (score >= 70) return "Recommended for promotion";
    if (score >= 50) return "Extend contract";
    if (score >= 30) return "Extend contract with PIP";
    return "Do not extend contract";
  };

  // Generate sections HTML with criteria ratings
  const sectionsHTML = sections
    .map((section) => {
      const sectionCriteria = criteria
        .filter((c) => c.sectionId === section.id)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      let sectionTotalSelf = 0;
      let sectionTotalManager = 0;
      let sectionTotalCommittee = 0;
      let ratedCount = 0;

      const criteriaRows = sectionCriteria
        .map((criterion) => {
          const rating = ratings.find((r) => r.criteriaId === criterion.id);
          const selfRating = rating?.selfRating || 0;
          const managerRating = rating?.managerRating || 0;
          const committeeRating = rating?.committeeRating || 0;

          if (selfRating || managerRating || committeeRating) {
            sectionTotalSelf += selfRating;
            sectionTotalManager += managerRating;
            sectionTotalCommittee += committeeRating;
            ratedCount++;
          }

          return `
          <tr>
            <td style="padding: 10px; border: 1px solid #e5e7eb;">
              <strong>${criterion.name}</strong>
              ${criterion.description ? `<br><span style="font-size: 11px; color: #6b7280;">${criterion.description}</span>` : ""}
            </td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">
              ${selfRating || "-"}
              <br><span style="font-size: 10px; color: #6b7280;">${getRatingLabel(selfRating)}</span>
            </td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">
              ${managerRating || "-"}
              <br><span style="font-size: 10px; color: #6b7280;">${getRatingLabel(managerRating)}</span>
            </td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">
              ${committeeRating || "-"}
              <br><span style="font-size: 10px; color: #6b7280;">${getRatingLabel(committeeRating)}</span>
            </td>
          </tr>
        `;
        })
        .join("");

      const avgSelf = ratedCount > 0 ? (sectionTotalSelf / ratedCount).toFixed(1) : "-";
      const avgManager = ratedCount > 0 ? (sectionTotalManager / ratedCount).toFixed(1) : "-";
      const avgCommittee = ratedCount > 0 ? (sectionTotalCommittee / ratedCount).toFixed(1) : "-";

      return `
        <div style="margin-bottom: 24px;">
          <h3 style="color: #1e40af; font-size: 14px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #1e40af;">
            ${section.sortOrder}. ${section.name}
            ${section.weightPercentage ? `<span style="font-weight: normal; color: #6b7280;">(Weight: ${section.weightPercentage}%)</span>` : ""}
          </h3>
          ${section.description ? `<p style="font-size: 12px; color: #6b7280; margin-bottom: 12px;">${section.description}</p>` : ""}
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left; width: 40%;">Criteria</th>
                <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: center; width: 20%;">Self Assessment</th>
                <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: center; width: 20%;">Manager Review</th>
                <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: center; width: 20%;">Committee Review</th>
              </tr>
            </thead>
            <tbody>
              ${criteriaRows}
              <tr style="background-color: #f8fafc; font-weight: 600;">
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Section Average</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${avgSelf}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${avgManager}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${avgCommittee}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    })
    .join("");

  // Generate goals HTML
  const goalsHTML =
    goals.length > 0
      ? `
    <div style="margin-bottom: 24px;">
      <h3 style="color: #1e40af; font-size: 14px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #1e40af;">
        Development Goals
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Goal Description</th>
            <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: center; width: 120px;">Target Date</th>
            <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: center; width: 100px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${goals
            .map(
              (goal) => `
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${goal.description || "N/A"}</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${formatDate(goal.targetDate)}</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">
                <span style="padding: 4px 8px; border-radius: 4px; font-size: 11px; background-color: ${
                  goal.status === "completed"
                    ? "#D1FAE5"
                    : goal.status === "in_progress"
                      ? "#FEF3C7"
                      : "#F3F4F6"
                }; color: ${
                  goal.status === "completed"
                    ? "#065F46"
                    : goal.status === "in_progress"
                      ? "#92400E"
                      : "#374151"
                };">
                  ${goal.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `
      : "";

  // Generate training needs HTML
  const trainingHTML =
    trainingNeeds.length > 0
      ? `
    <div style="margin-bottom: 24px;">
      <h3 style="color: #1e40af; font-size: 14px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #1e40af;">
        Training Needs
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Training</th>
            <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: center; width: 100px;">Priority</th>
            <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: center; width: 100px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${trainingNeeds
            .map(
              (need) => `
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">
                <strong>${need.title || "N/A"}</strong>
                ${need.description ? `<br><span style="font-size: 11px; color: #6b7280;">${need.description}</span>` : ""}
              </td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">
                <span style="padding: 4px 8px; border-radius: 4px; font-size: 11px; background-color: ${
                  need.priority === "high"
                    ? "#FEE2E2"
                    : need.priority === "medium"
                      ? "#FEF3C7"
                      : "#D1FAE5"
                }; color: ${
                  need.priority === "high"
                    ? "#991B1B"
                    : need.priority === "medium"
                      ? "#92400E"
                      : "#065F46"
                };">
                  ${need.priority.charAt(0).toUpperCase() + need.priority.slice(1)}
                </span>
              </td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${need.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `
      : "";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Annexure #24 - Performance Appraisal Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 12px;
          line-height: 1.5;
          color: #1f2937;
          background: #fff;
        }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        @media print {
          body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .container { padding: 0; }
          .page-break { page-break-before: always; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; border-radius: 8px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 60px; height: 60px; background: white; border-radius: 8px; padding: 8px;">
              <img src="${VDO_LOGO_BASE64}" alt="VDO Logo" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>
            <div>
              <h1 style="font-size: 20px; font-weight: 700; margin-bottom: 4px;">VDO ERP</h1>
              <p style="font-size: 12px; opacity: 0.9;">Enterprise Resource Planning System</p>
            </div>
          </div>
          <div style="text-align: right;">
            <h2 style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">ANNEXURE #24</h2>
            <p style="font-size: 12px; opacity: 0.9;">Performance Appraisal Report</p>
          </div>
        </div>

        <!-- Appraisal Info -->
        <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
            <div>
              <p style="color: #6b7280; font-size: 11px; margin-bottom: 4px;">Appraisal Cycle</p>
              <p style="font-weight: 600;">${cycle?.name || "N/A"}</p>
            </div>
            <div>
              <p style="color: #6b7280; font-size: 11px; margin-bottom: 4px;">Period</p>
              <p style="font-weight: 600;">${formatDate(cycle?.startDate)} - ${formatDate(cycle?.endDate)}</p>
            </div>
            <div>
              <p style="color: #6b7280; font-size: 11px; margin-bottom: 4px;">Template</p>
              <p style="font-weight: 600;">${template?.name || "N/A"}</p>
            </div>
          </div>
        </div>

        <!-- Employee Information -->
        <div style="margin-bottom: 24px;">
          <h3 style="color: #1e40af; font-size: 14px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #1e40af;">
            Employee Information
          </h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px;">
              <p style="color: #6b7280; font-size: 11px;">Employee Name</p>
              <p style="font-weight: 600;">${employee ? `${employee.firstName} ${employee.lastName}` : "N/A"}</p>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px;">
              <p style="color: #6b7280; font-size: 11px;">Employee ID</p>
              <p style="font-weight: 600;">${employee?.employeeId || "N/A"}</p>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px;">
              <p style="color: #6b7280; font-size: 11px;">Position</p>
              <p style="font-weight: 600;">${employee?.position || "N/A"}</p>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px;">
              <p style="color: #6b7280; font-size: 11px;">Department</p>
              <p style="font-weight: 600;">${employee?.department || "N/A"}</p>
            </div>
          </div>
        </div>

        <!-- Performance Summary -->
        <div style="margin-bottom: 24px;">
          <h3 style="color: #1e40af; font-size: 14px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #1e40af;">
            Performance Summary
          </h3>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
            <div style="background: #EFF6FF; padding: 16px; border-radius: 8px; text-align: center; border-left: 4px solid #3B82F6;">
              <p style="font-size: 24px; font-weight: 700; color: #1D4ED8;">${appraisal.selfAssessmentScore || "-"}%</p>
              <p style="font-size: 11px; color: #6b7280;">Self Assessment</p>
            </div>
            <div style="background: #F5F3FF; padding: 16px; border-radius: 8px; text-align: center; border-left: 4px solid #8B5CF6;">
              <p style="font-size: 24px; font-weight: 700; color: #7C3AED;">${appraisal.managerScore || "-"}%</p>
              <p style="font-size: 11px; color: #6b7280;">Manager Score</p>
            </div>
            <div style="background: #EEF2FF; padding: 16px; border-radius: 8px; text-align: center; border-left: 4px solid #6366F1;">
              <p style="font-size: 24px; font-weight: 700; color: #4F46E5;">${appraisal.committeeScore || "-"}%</p>
              <p style="font-size: 11px; color: #6b7280;">Committee Score</p>
            </div>
            <div style="background: ${getPerformanceLevelColor(appraisal.finalScore)}20; padding: 16px; border-radius: 8px; text-align: center; border-left: 4px solid ${getPerformanceLevelColor(appraisal.finalScore)};">
              <p style="font-size: 24px; font-weight: 700; color: ${getPerformanceLevelColor(appraisal.finalScore)};">${appraisal.finalScore || "-"}%</p>
              <p style="font-size: 11px; color: #6b7280;">Final Score</p>
            </div>
          </div>
          <div style="margin-top: 12px; padding: 16px; background: ${getPerformanceLevelColor(appraisal.finalScore)}10; border-radius: 8px; border: 1px solid ${getPerformanceLevelColor(appraisal.finalScore)}40;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="font-size: 11px; color: #6b7280;">Performance Level</p>
                <p style="font-size: 16px; font-weight: 700; color: ${getPerformanceLevelColor(appraisal.finalScore)};">
                  ${getPerformanceLevelLabel(appraisal.finalScore)}
                </p>
              </div>
              <div style="text-align: right;">
                <p style="font-size: 11px; color: #6b7280;">Recommendation</p>
                <p style="font-size: 14px; font-weight: 600; color: #374151;">
                  ${appraisal.finalDecision || getRecommendation(appraisal.finalScore)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Evaluation Sections -->
        <div class="page-break"></div>
        <h3 style="color: #1e40af; font-size: 16px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #1e40af;">
          Detailed Evaluation
        </h3>
        ${sectionsHTML}

        <!-- Goals -->
        ${goalsHTML}

        <!-- Training Needs -->
        ${trainingHTML}

        <!-- Comments Section -->
        <div class="page-break"></div>
        <div style="margin-bottom: 24px;">
          <h3 style="color: #1e40af; font-size: 14px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #1e40af;">
            Comments & Feedback
          </h3>

          <!-- Self Assessment Comments -->
          <div style="margin-bottom: 16px; padding: 12px; background: #EFF6FF; border-radius: 8px; border-left: 4px solid #3B82F6;">
            <h4 style="font-size: 13px; font-weight: 600; color: #1D4ED8; margin-bottom: 8px;">Self Assessment</h4>
            ${appraisal.employeeAchievements ? `<p style="margin-bottom: 8px;"><strong>Key Achievements:</strong> ${appraisal.employeeAchievements}</p>` : ""}
            ${appraisal.employeeChallenges ? `<p style="margin-bottom: 8px;"><strong>Challenges Faced:</strong> ${appraisal.employeeChallenges}</p>` : ""}
            ${appraisal.employeeComments ? `<p><strong>Comments:</strong> ${appraisal.employeeComments}</p>` : ""}
            ${!appraisal.employeeAchievements && !appraisal.employeeChallenges && !appraisal.employeeComments ? "<p style='color: #6b7280; font-style: italic;'>No self-assessment comments provided.</p>" : ""}
          </div>

          <!-- Manager Comments -->
          <div style="margin-bottom: 16px; padding: 12px; background: #F5F3FF; border-radius: 8px; border-left: 4px solid #8B5CF6;">
            <h4 style="font-size: 13px; font-weight: 600; color: #7C3AED; margin-bottom: 8px;">Manager Review</h4>
            ${appraisal.managerStrengths ? `<p style="margin-bottom: 8px;"><strong>Strengths:</strong> ${appraisal.managerStrengths}</p>` : ""}
            ${appraisal.managerImprovements ? `<p style="margin-bottom: 8px;"><strong>Areas for Improvement:</strong> ${appraisal.managerImprovements}</p>` : ""}
            ${appraisal.managerTrainingRecommendations ? `<p style="margin-bottom: 8px;"><strong>Training Recommendations:</strong> ${appraisal.managerTrainingRecommendations}</p>` : ""}
            ${appraisal.managerOverallComments ? `<p style="margin-bottom: 8px;"><strong>Overall Comments:</strong> ${appraisal.managerOverallComments}</p>` : ""}
            ${appraisal.managerRecommendation ? `<p><strong>Recommendation:</strong> ${appraisal.managerRecommendation}</p>` : ""}
            ${!appraisal.managerStrengths && !appraisal.managerImprovements && !appraisal.managerOverallComments ? "<p style='color: #6b7280; font-style: italic;'>No manager review comments provided.</p>" : ""}
          </div>

          <!-- Committee Comments -->
          <div style="margin-bottom: 16px; padding: 12px; background: #EEF2FF; border-radius: 8px; border-left: 4px solid #6366F1;">
            <h4 style="font-size: 13px; font-weight: 600; color: #4F46E5; margin-bottom: 8px;">Committee Review</h4>
            ${appraisal.committeeComments ? `<p style="margin-bottom: 8px;"><strong>Comments:</strong> ${appraisal.committeeComments}</p>` : ""}
            ${appraisal.committeeRecommendation ? `<p><strong>Recommendation:</strong> ${appraisal.committeeRecommendation}</p>` : ""}
            ${!appraisal.committeeComments && !appraisal.committeeRecommendation ? "<p style='color: #6b7280; font-style: italic;'>No committee review comments provided.</p>" : ""}
          </div>

          <!-- Final Approval -->
          ${
            appraisal.approvedBy
              ? `
          <div style="padding: 12px; background: #ECFDF5; border-radius: 8px; border-left: 4px solid #10B981;">
            <h4 style="font-size: 13px; font-weight: 600; color: #059669; margin-bottom: 8px;">Final Approval</h4>
            <p style="margin-bottom: 8px;"><strong>Approved By:</strong> ${appraisal.approvedBy}</p>
            <p style="margin-bottom: 8px;"><strong>Approval Date:</strong> ${formatDate(appraisal.approvedAt)}</p>
            ${appraisal.approvalComments ? `<p style="margin-bottom: 8px;"><strong>Comments:</strong> ${appraisal.approvalComments}</p>` : ""}
            ${appraisal.finalDecision ? `<p><strong>Final Decision:</strong> ${appraisal.finalDecision}</p>` : ""}
          </div>
          `
              : ""
          }
        </div>

        <!-- Rating Scale Reference -->
        <div style="margin-bottom: 24px; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h4 style="font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 8px;">Rating Scale Reference</h4>
          <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; font-size: 10px;">
            ${RATING_SCALE.map(
              (r) => `
              <div style="text-align: center; padding: 6px; background: white; border-radius: 4px; border: 1px solid #e5e7eb;">
                <div style="font-weight: 700; font-size: 14px;">${r.value}</div>
                <div style="color: #6b7280;">${r.label}</div>
              </div>
            `
            ).join("")}
          </div>
        </div>

        <!-- Signatures Section -->
        <div style="margin-bottom: 24px;">
          <h3 style="color: #1e40af; font-size: 14px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #1e40af;">
            Signatures
          </h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;">
            <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <p style="font-weight: 600; margin-bottom: 40px;">Employee</p>
              <div style="border-top: 1px solid #374151; padding-top: 8px;">
                <p style="font-size: 11px; color: #6b7280;">Name: ${employee ? `${employee.firstName} ${employee.lastName}` : "_________________"}</p>
                <p style="font-size: 11px; color: #6b7280;">Date: _________________</p>
              </div>
            </div>
            <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <p style="font-weight: 600; margin-bottom: 40px;">Line Manager</p>
              <div style="border-top: 1px solid #374151; padding-top: 8px;">
                <p style="font-size: 11px; color: #6b7280;">Name: _________________</p>
                <p style="font-size: 11px; color: #6b7280;">Date: _________________</p>
              </div>
            </div>
            <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <p style="font-weight: 600; margin-bottom: 40px;">Committee Representative</p>
              <div style="border-top: 1px solid #374151; padding-top: 8px;">
                <p style="font-size: 11px; color: #6b7280;">Name: _________________</p>
                <p style="font-size: 11px; color: #6b7280;">Date: _________________</p>
              </div>
            </div>
            <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <p style="font-weight: 600; margin-bottom: 40px;">HR Director</p>
              <div style="border-top: 1px solid #374151; padding-top: 8px;">
                <p style="font-size: 11px; color: #6b7280;">Name: _________________</p>
                <p style="font-size: 11px; color: #6b7280;">Date: _________________</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding: 16px; background: #f8fafc; border-radius: 8px; text-align: center;">
          <p style="font-size: 11px; color: #6b7280;">This document was generated by <strong style="color: #1e40af;">VDO ERP System</strong></p>
          <p style="font-size: 10px; color: #9ca3af;">Generated on: ${new Date().toLocaleString()} | Annexure #24 - Performance Appraisal Report</p>
          <p style="font-size: 10px; color: #9ca3af; margin-top: 4px;">© ${new Date().getFullYear()} VDO. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Open print window
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};

// ==================== MAIN COMPONENT ====================

const EmployeeAppraisals: React.FC = () => {
  const navigate = useNavigate();
  const [appraisals, setAppraisals] = useState<EmployeeAppraisal[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [cycles, setCycles] = useState<AppraisalCycle[]>([]);
  const [templates, setTemplates] = useState<AppraisalTemplate[]>([]);
  const [sections, setSections] = useState<AppraisalSection[]>([]);
  const [criteria, setCriteria] = useState<AppraisalCriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cycleFilter, setCycleFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        appraisalsData,
        employeesData,
        cyclesData,
        templatesData,
        sectionsData,
        criteriaData,
      ] = await Promise.all([
        performanceService.employeeAppraisals.getAll(),
        employeeDB.getAll(),
        performanceService.appraisalCycles.getAll(),
        performanceService.appraisalTemplates.getAll(),
        performanceService.appraisalSections.getAll(),
        performanceService.appraisalCriteria.getAll(),
      ]);
      setAppraisals(appraisalsData as EmployeeAppraisal[]);
      setEmployees(employeesData as Employee[]);
      setCycles(cyclesData as AppraisalCycle[]);
      setTemplates(templatesData as AppraisalTemplate[]);
      setSections(sectionsData as AppraisalSection[]);
      setCriteria(criteriaData as AppraisalCriteria[]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEmployee = useCallback(
    (id: number) => employees.find((e) => e.id === id),
    [employees]
  );

  const getCycle = useCallback(
    (id: string) => cycles.find((c) => c.id === id),
    [cycles]
  );

  const getTemplate = useCallback(
    (id: string) => templates.find((t) => t.id === id),
    [templates]
  );

  const filteredAppraisals = useMemo(() => {
    return appraisals.filter((appraisal) => {
      const employee = getEmployee(appraisal.employeeId);
      const employeeName = employee
        ? `${employee.firstName} ${employee.lastName}`.toLowerCase()
        : "";

      const matchesSearch =
        employeeName.includes(searchTerm.toLowerCase()) ||
        appraisal.employeeId?.toString().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || appraisal.status === statusFilter;
      const matchesCycle =
        cycleFilter === "all" || appraisal.cycleId === cycleFilter;

      return matchesSearch && matchesStatus && matchesCycle;
    });
  }, [appraisals, searchTerm, statusFilter, cycleFilter, getEmployee]);

  const getStatusConfig = useCallback((status: string): StatusConfig => {
    const configs: Record<string, StatusConfig> = {
      draft: {
        label: "Draft",
        color:
          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        icon: FileText,
      },
      self_assessment: {
        label: "Self Assessment",
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        icon: Edit,
      },
      manager_review: {
        label: "Manager Review",
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
        icon: User,
      },
      committee_review: {
        label: "Committee Review",
        color:
          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
        icon: ClipboardList,
      },
      pending_approval: {
        label: "Pending Approval",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        icon: Clock,
      },
      approved: {
        label: "Approved",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        icon: CheckCircle,
      },
      communicated: {
        label: "Communicated",
        color:
          "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
        icon: MessageSquare,
      },
      completed: {
        label: "Completed",
        color:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
        icon: CheckCircle,
      },
      rejected: {
        label: "Rejected",
        color:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        icon: XCircle,
      },
    };
    return (
      configs[status] || {
        label: status,
        color: "bg-gray-100 text-gray-800",
        icon: FileText,
      }
    );
  }, []);

  const getPerformanceLevel = useCallback(
    (score?: number): { level: string; color: string } | null => {
      if (!score) return null;
      if (score >= 80)
        return { level: "Outstanding", color: "text-emerald-600" };
      if (score >= 70)
        return { level: "Exceeds Expectations", color: "text-green-600" };
      if (score >= 50)
        return { level: "Meets Expectations", color: "text-blue-600" };
      if (score >= 30)
        return { level: "Needs Improvement", color: "text-yellow-600" };
      return { level: "Unsatisfactory", color: "text-red-600" };
    },
    []
  );

  const getWorkflowSteps = useCallback((status: string) => {
    const steps = [
      "draft",
      "self_assessment",
      "manager_review",
      "committee_review",
      "pending_approval",
      "approved",
      "communicated",
      "completed",
    ];
    const currentIndex = steps.indexOf(status);
    return steps.map((step, index) => ({
      step,
      label: step
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      completed: index < currentIndex,
      current: index === currentIndex,
      pending: index > currentIndex,
    }));
  }, []);

  const handleStartSelfAssessment = async (appraisal: EmployeeAppraisal) => {
    try {
      await performanceService.employeeAppraisals.update(appraisal.id, {
        status: "self_assessment",
        selfAssessmentStartedAt: new Date().toISOString(),
      });
      await loadData();
    } catch (error) {
      console.error("Error starting self assessment:", error);
    }
  };

  const handleGenerateAnnexure24 = async (appraisal: EmployeeAppraisal) => {
    try {
      // Get all related data for the appraisal
      const ratingsData = await performanceService.appraisalRatings.getAll();
      const goalsData = await performanceService.appraisalGoals.getAll();
      const trainingData =
        await performanceService.appraisalTrainingNeeds.getAll();

      const appraisalRatings = (ratingsData as AppraisalRating[]).filter(
        (r) => r.appraisalId === appraisal.id
      );
      const appraisalGoals = (goalsData as AppraisalGoal[]).filter(
        (g) => g.appraisalId === appraisal.id
      );
      const appraisalTrainingNeeds = (trainingData as TrainingNeed[]).filter(
        (t) => t.appraisalId === appraisal.id
      );

      const employee = getEmployee(appraisal.employeeId);
      const cycle = getCycle(appraisal.cycleId);
      const template = getTemplate(appraisal.templateId);

      // Get sections for this template
      const templateSections = sections
        .filter((s) => s.templateId === appraisal.templateId)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      await generateAnnexure24PDF(
        appraisal,
        employee,
        cycle,
        template,
        templateSections,
        criteria,
        appraisalRatings,
        appraisalGoals,
        appraisalTrainingNeeds
      );
    } catch (error) {
      console.error("Error generating Annexure #24:", error);
      alert("Error generating Annexure #24");
    }
  };

  // Create Modal Component
  const CreateModal: React.FC = () => {
    const [formData, setFormData] = useState({
      employeeId: "",
      cycleId: "",
      templateId: "",
      appraisalType: "annual",
    });
    const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
    const [bulkMode, setBulkMode] = useState(false);

    const activeCycles = cycles.filter((c) => c.status === "active");
    const activeTemplates = templates.filter((t: AppraisalTemplate & { isActive?: boolean }) => t.isActive);

    const handleSingleCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await performanceService.employeeAppraisals.create({
          ...formData,
          status: "draft",
          selfAssessmentScore: null,
          managerScore: null,
          committeeScore: null,
          finalScore: null,
          performanceLevel: null,
          recommendation: null,
        });
        await loadData();
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error creating appraisal:", error);
        alert("Error creating appraisal");
      }
    };

    const handleBulkCreate = async () => {
      if (
        !formData.cycleId ||
        !formData.templateId ||
        selectedEmployees.length === 0
      ) {
        alert("Please select cycle, template, and at least one employee");
        return;
      }

      try {
        for (const empId of selectedEmployees) {
          const existing = appraisals.find(
            (a) =>
              a.employeeId === empId && a.cycleId === formData.cycleId
          );
          if (!existing) {
            await performanceService.employeeAppraisals.create({
              employeeId: empId,
              cycleId: formData.cycleId,
              templateId: formData.templateId,
              appraisalType: formData.appraisalType,
              status: "draft",
              selfAssessmentScore: null,
              managerScore: null,
              committeeScore: null,
              finalScore: null,
              performanceLevel: null,
              recommendation: null,
            });
          }
        }
        await loadData();
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error creating appraisals:", error);
        alert("Error creating appraisals");
      }
    };

    const toggleEmployee = (empId: number) => {
      setSelectedEmployees((prev) =>
        prev.includes(empId)
          ? prev.filter((id) => id !== empId)
          : [...prev, empId]
      );
    };

    const selectAllEmployees = () => {
      const eligibleEmployees = employees.filter((emp) => {
        const existing = appraisals.find(
          (a) =>
            a.employeeId === emp.id && a.cycleId === formData.cycleId
        );
        return !existing;
      });
      setSelectedEmployees(eligibleEmployees.map((e) => e.id));
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create Appraisal
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBulkMode(false)}
                  className={`px-3 py-1 text-sm rounded ${
                    !bulkMode
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  Single
                </button>
                <button
                  type="button"
                  onClick={() => setBulkMode(true)}
                  className={`px-3 py-1 text-sm rounded ${
                    bulkMode
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  Bulk
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Appraisal Cycle
                  </label>
                  <select
                    value={formData.cycleId}
                    onChange={(e) =>
                      setFormData({ ...formData, cycleId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Cycle</option>
                    {activeCycles.map((cycle) => (
                      <option key={cycle.id} value={cycle.id}>
                        {cycle.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Template
                  </label>
                  <select
                    value={formData.templateId}
                    onChange={(e) =>
                      setFormData({ ...formData, templateId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Template</option>
                    {activeTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Appraisal Type
                </label>
                <select
                  value={formData.appraisalType}
                  onChange={(e) =>
                    setFormData({ ...formData, appraisalType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="annual">Annual Performance</option>
                  <option value="probation">Probation</option>
                  <option value="contract_renewal">Contract Renewal</option>
                  <option value="pip_review">PIP Review</option>
                </select>
              </div>

              {!bulkMode ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Employee
                  </label>
                  <select
                    value={formData.employeeId}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} ({emp.employeeId})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select Employees ({selectedEmployees.length} selected)
                    </label>
                    <button
                      type="button"
                      onClick={selectAllEmployees}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Select All Eligible
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg">
                    {employees.map((emp) => {
                      const existing = appraisals.find(
                        (a) =>
                          a.employeeId === emp.id &&
                          a.cycleId === formData.cycleId
                      );
                      return (
                        <label
                          key={emp.id}
                          className={`flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                            existing ? "opacity-50" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedEmployees.includes(emp.id)}
                            onChange={() => !existing && toggleEmployee(emp.id)}
                            disabled={!!existing}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-900 dark:text-white">
                            {emp.firstName} {emp.lastName}
                          </span>
                          {existing && (
                            <span className="ml-auto text-xs text-gray-500">
                              Already exists
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={bulkMode ? handleBulkCreate : handleSingleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {bulkMode
                ? `Create ${selectedEmployees.length} Appraisals`
                : "Create Appraisal"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Employee Appraisals
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage performance appraisals for all employees
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New Appraisal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: appraisals.length, color: "blue" },
          {
            label: "In Progress",
            value: appraisals.filter(
              (a) => !["draft", "completed"].includes(a.status)
            ).length,
            color: "yellow",
          },
          {
            label: "Completed",
            value: appraisals.filter((a) => a.status === "completed").length,
            color: "green",
          },
          {
            label: "Pending Start",
            value: appraisals.filter((a) => a.status === "draft").length,
            color: "gray",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold text-${stat.color}-600`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <select
          value={cycleFilter}
          onChange={(e) => setCycleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Cycles</option>
          {cycles.map((cycle) => (
            <option key={cycle.id} value={cycle.id}>
              {cycle.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="self_assessment">Self Assessment</option>
          <option value="manager_review">Manager Review</option>
          <option value="committee_review">Committee Review</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="communicated">Communicated</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Appraisals List */}
      {filteredAppraisals.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            No Appraisals Found
          </h3>
          <p className="text-gray-500">
            Create new appraisals or adjust your filters
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppraisals.map((appraisal) => {
            const employee = getEmployee(appraisal.employeeId);
            const cycle = getCycle(appraisal.cycleId);
            const template = getTemplate(appraisal.templateId);
            const statusConfig = getStatusConfig(appraisal.status);
            const StatusIcon = statusConfig.icon;
            const performanceLevel = getPerformanceLevel(appraisal.finalScore);

            return (
              <div
                key={appraisal.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {employee
                          ? `${employee.firstName} ${employee.lastName}`
                          : "Unknown Employee"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <span>{cycle?.name || "Unknown Cycle"}</span>
                        <span>•</span>
                        <span>{template?.name || "Unknown Template"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Score Display */}
                    {appraisal.finalScore && (
                      <div className="text-center">
                        <div
                          className={`text-2xl font-bold ${performanceLevel?.color || "text-gray-600"}`}
                        >
                          {appraisal.finalScore}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {performanceLevel?.level}
                        </div>
                      </div>
                    )}

                    {/* Status */}
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full ${statusConfig.color}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {statusConfig.label}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {appraisal.status === "draft" && (
                        <button
                          onClick={() => handleStartSelfAssessment(appraisal)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          <Send className="w-4 h-4" />
                          Start
                        </button>
                      )}

                      {/* Generate Annexure #24 Button - Show for completed/approved/communicated appraisals */}
                      {["approved", "communicated", "completed"].includes(
                        appraisal.status
                      ) && (
                        <button
                          onClick={() => handleGenerateAnnexure24(appraisal)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700"
                          title="Generate Annexure #24"
                        >
                          <Printer className="w-4 h-4" />
                          Annexure #24
                        </button>
                      )}

                      <button
                        onClick={() =>
                          navigate(`/hr/performance/appraisal/${appraisal.id}`)
                        }
                        className="p-2 text-gray-400 hover:text-blue-600"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Workflow Progress */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    {getWorkflowSteps(appraisal.status)
                      .slice(0, 6)
                      .map((step, index) => (
                        <div key={step.step} className="flex items-center">
                          <div
                            className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                              step.completed
                                ? "bg-green-600 text-white"
                                : step.current
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-200 text-gray-500 dark:bg-gray-700"
                            }`}
                          >
                            {step.completed ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          {index < 5 && (
                            <div
                              className={`w-8 md:w-16 h-0.5 mx-1 ${
                                step.completed
                                  ? "bg-green-600"
                                  : "bg-gray-200 dark:bg-gray-700"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    {getWorkflowSteps(appraisal.status)
                      .slice(0, 6)
                      .map((step) => (
                        <span
                          key={step.step}
                          className={`text-xs ${
                            step.current
                              ? "text-blue-600 font-medium"
                              : "text-gray-400"
                          }`}
                          style={{ width: "60px", textAlign: "center" }}
                        >
                          {step.label.split(" ")[0]}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Additional Info */}
                {(appraisal.selfAssessmentScore ||
                  appraisal.managerScore ||
                  appraisal.committeeScore) && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Self Assessment</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {appraisal.selfAssessmentScore
                          ? `${appraisal.selfAssessmentScore}%`
                          : "-"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Manager Score</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {appraisal.managerScore
                          ? `${appraisal.managerScore}%`
                          : "-"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Committee Score</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {appraisal.committeeScore
                          ? `${appraisal.committeeScore}%`
                          : "-"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && <CreateModal />}
    </div>
  );
};

export default EmployeeAppraisals;
