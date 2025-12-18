import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Save,
  Send,
  Star,
  User,
  Calendar,
  Target,
  Plus,
  Trash2,
  MessageSquare,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Award,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Printer,
} from "lucide-react";
import performanceService from "../../services/db/performanceService";
import { employeeDB } from "../../services/db/indexedDB";

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
  id?: string;
  appraisalId: string;
  criteriaId: string;
  selfRating?: number | null;
  selfComment?: string;
  managerRating?: number | null;
  managerComment?: string;
  committeeRating?: number | null;
  committeeComment?: string;
}

interface AppraisalGoal {
  id: string;
  appraisalId: string;
  description: string;
  targetDate?: string | null;
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
  selfAssessmentScore?: number | null;
  managerScore?: number | null;
  committeeScore?: number | null;
  finalScore?: number | null;
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

interface RatingScale {
  value: number;
  label: string;
  description: string;
}

interface PerformanceLevel {
  level: string;
  color: string;
}

type ReviewMode = "self" | "manager" | "committee";
type ActiveTab = "evaluation" | "goals" | "training";

// ==================== CONSTANTS ====================

const RATING_SCALE: RatingScale[] = [
  { value: 0, label: "Not Rated", description: "Not yet evaluated" },
  { value: 1, label: "Unsatisfactory", description: "Far below expectations" },
  { value: 2, label: "Needs Improvement", description: "Below expectations" },
  { value: 3, label: "Basic", description: "Meets minimum requirements" },
  { value: 4, label: "Good", description: "Meets expectations" },
  { value: 5, label: "Outstanding", description: "Exceeds expectations" },
];

// ==================== VDO LOGO BASE64 ====================

const VDO_LOGO_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDg4LCAyMDIwLzA3LzEwLTIyOjA2OjUzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTAxLTE1VDEwOjMwOjAwKzA1OjMwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTAxLTE1VDEwOjMwOjAwKzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wMS0xNVQxMDozMDowMCswNTozMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4YTk5YTk5YS05OTk5LTQ5OTktOTk5OS05OTk5OTk5OTk5OTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OGE5OWE5OWEtOTk5OS00OTk5LTk5OTktOTk5OTk5OTk5OTk5IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6OGE5OWE5OWEtOTk5OS00OTk5LTk5OTktOTk5OTk5OTk5OTk5IiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OGE5OWE5OWEtOTk5OS00OTk5LTk5OTktOTk5OTk5OTk5OTk5IiBzdEV2dDp3aGVuPSIyMDI0LTAxLTE1VDEwOjMwOjAwKzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoV2luZG93cykiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VkPqNgAABRfJREFUeJzt3c9rU1kYxvHnJkkT09SmVlur1p+o6FjUKrgQBBdSFy5EEAQXLmah4MKFa/8BFy5cuHDhwoULwYULF4ILQRCKoBZEi1hbrVbb2mbSJjfJuYubdKZ07nszc+85c3h/m0Jy3/ue5yS598wJBEFgAADp6tGLqHd8n7oEAKMR3oQkEj8BXPAQAYwJBEFg7h3fZ0YOW7S3P/K9DMA7Q0Fg7h3bB4hgmIaLxGBMAkMzCoxJZFiIYIyGi0Qw5sJTBIwBiSRgbA6NYCyOiWAsjolgrA6NYIwCYywOjWBMjoVgjAqN4MwCY3JoBGMvHBnBWJ0awVgdEsHYHRLBWBwSwdgbCsHYGwrB2BoKwdgaCsHYGgrBWBsKwdgaCsHYGQrB2BkKwdgYCsHYGArBWBoKwdgYCsGYGwrB2BgKwZgbCsFYGwrBGBsKwRgbCsEYGwrBGBsKwVgaCsHYGgrBWBsKwRgbCsEYGwrBGBkKwRgZCsHYGArB2BkKwdgYCsEYHArBGBsKwRgbCsEYGwrBWBoKwdgaCsHYGgrBWBsKwRgaCsHYGArBmBsKwdgaCsGYGwrB2BsKwVgbCsEYGwrBGBkKwRgZCsHYGArB2BkKwdgYCsEYHArBGBsKwRgbCsEYGwrBWBoKwdgaCsHYGgrBWBsKwRgaCsHYGArBmBsKwdgaCsGYGwrB2BsKwVgbCsEYGwrBGBkKwRgZCsHYGArB2BkKwdgYCsEYHArBGBsKwRgbCsEYGwrBWBoKwdgaCsHYGgrBWBsKwRgaCsHYGArBmBsKwdgaCsGYGwrB2BsKwVgbCsEYGwrBGBkKwRgZCsHYGArB2BkKwdgYCsEYHArBGBsKwRgbCsEYGwrBWBoKwdgaCsHYGgrBWBsKwVh7P/QOAPwqCAKja4v/AHAbwMsgiP5JREQkIZH4bxBE5wBJABCZP/wkIn8TkTdBEBvGRxKRv4jIDSISj48RkZCIXAcQnYEgCGQQBOY/RPR2EESnAJwDMBAE0XUA1wFMAjgBAE8HQXSSiFwhIncARBuIyD8AxInoVQA9RHTkA4D/OwRBYB4F0TEicoOIvB0EsYUvA/j/4CmA60QkSkT+KiIJInoNwPlBEJuISJSIRIjI3wBEZyAIjPEgCAzDIDAMAsMwCAzDIDAMgwBYJCJPx78BwPMgMDaIyCARaR8E0WUAmwB+TET+RUQCALaDIDoCIC8I4r8BSAR4EwTGJhGJA4gCuEREnoLIBPAWEbmaiBwKgtgmgK+JyPNBEBsk8nAQxCaJ/A/ANoDVIIj/BvAUQCKA3wFIAvieiBwCsA2gL4iOAPgeQBTAtSCITRJ5AEAkCGLJIIj+HkA0COK/A/g7gH4iugTgWBDYhgD0A4gEQfzvAPqC6ACRhwCkgyDWDWAQwAYAMwCOBVEdwFMAxojIOwDiQRA7AWARwAQRaQ0C2x8A9gHMAxgPguhxAIMApoMgegDABoBlAJMAxoMgegTAOoDZIIieALAEYCYIoocALAKYDoLoHIBlADNBED0BYAnAdBBEzwDYE0T3ApgOME1EwhMAfg4C4xEAAJkgiP4YQLqNAOQCkGsD8FMRiT4C8HIQRHfZ7wFIBUF0BUCfMDCCIMYCwDIR6SJiawCqAoA3AawFgXEUwEwQRM8BOGAvAPMAxolIDMDpIIgdBrBN5HsAMkEQOwtgnYhkACQGQXQNwDYRCQIYJGK9RGQP4hgEsT0AThCRGIDpIIgeBfB/fNJMx3+iGE0AAAAASUVORK5CYII=";

// ==================== ANNEXURE #24 PDF GENERATION ====================

const generateAnnexure24PDF = async (
  appraisal: EmployeeAppraisal,
  employee: Employee | null,
  cycle: AppraisalCycle | null,
  template: AppraisalTemplate | null,
  sections: AppraisalSection[],
  criteria: AppraisalCriteria[],
  ratings: AppraisalRating[],
  goals: AppraisalGoal[],
  trainingNeeds: TrainingNeed[]
): Promise<void> => {
  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRatingLabel = (value?: number | null): string => {
    if (!value) return "Not Rated";
    return RATING_SCALE.find((r) => r.value === value)?.label || "Not Rated";
  };

  const getPerformanceLevelColor = (score?: number | null): string => {
    if (!score) return "#6B7280";
    if (score >= 80) return "#059669";
    if (score >= 70) return "#10B981";
    if (score >= 50) return "#3B82F6";
    if (score >= 30) return "#F59E0B";
    return "#EF4444";
  };

  const getPerformanceLevelLabel = (score?: number | null): string => {
    if (!score) return "Not Evaluated";
    if (score >= 80) return "Outstanding";
    if (score >= 70) return "Exceeds Expectations";
    if (score >= 50) return "Meets Expectations";
    if (score >= 30) return "Needs Improvement";
    return "Unsatisfactory";
  };

  const getRecommendation = (score?: number | null): string => {
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

      const avgSelf =
        ratedCount > 0 ? (sectionTotalSelf / ratedCount).toFixed(1) : "-";
      const avgManager =
        ratedCount > 0 ? (sectionTotalManager / ratedCount).toFixed(1) : "-";
      const avgCommittee =
        ratedCount > 0 ? (sectionTotalCommittee / ratedCount).toFixed(1) : "-";

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

const AppraisalForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appraisal, setAppraisal] = useState<EmployeeAppraisal | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [cycle, setCycle] = useState<AppraisalCycle | null>(null);
  const [template, setTemplate] = useState<AppraisalTemplate | null>(null);
  const [sections, setSections] = useState<AppraisalSection[]>([]);
  const [criteria, setCriteria] = useState<AppraisalCriteria[]>([]);
  const [ratings, setRatings] = useState<AppraisalRating[]>([]);
  const [goals, setGoals] = useState<AppraisalGoal[]>([]);
  const [trainingNeeds, setTrainingNeeds] = useState<TrainingNeed[]>([]);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [activeTab, setActiveTab] = useState<ActiveTab>("evaluation");
  const [reviewMode, setReviewMode] = useState<ReviewMode>("self");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const appraisalData = await performanceService.employeeAppraisals.getById(
        id as string
      );
      if (!appraisalData) {
        navigate("/hr/performance/appraisals");
        return;
      }
      setAppraisal(appraisalData as EmployeeAppraisal);

      // Determine review mode based on status
      if (appraisalData.status === "self_assessment") {
        setReviewMode("self");
      } else if (appraisalData.status === "manager_review") {
        setReviewMode("manager");
      } else if (appraisalData.status === "committee_review") {
        setReviewMode("committee");
      }

      const [
        employeeData,
        cycleData,
        templateData,
        ratingsData,
        goalsData,
        trainingData,
      ] = await Promise.all([
        employeeDB.getById(appraisalData.employeeId),
        performanceService.appraisalCycles.getById(appraisalData.cycleId),
        performanceService.appraisalTemplates.getById(appraisalData.templateId),
        performanceService.appraisalRatings.getAll(),
        performanceService.appraisalGoals.getAll(),
        performanceService.appraisalTrainingNeeds.getAll(),
      ]);

      setEmployee(employeeData as Employee);
      setCycle(cycleData as AppraisalCycle);
      setTemplate(templateData as AppraisalTemplate);

      // Load sections and criteria for the template
      if (templateData) {
        const [sectionsData, criteriaData] = await Promise.all([
          performanceService.appraisalSections.getAll(),
          performanceService.appraisalCriteria.getAll(),
        ]);
        setSections(
          (sectionsData as AppraisalSection[])
            .filter((s) => s.templateId === templateData.id)
            .sort((a, b) => a.sortOrder - b.sortOrder)
        );
        setCriteria(criteriaData as AppraisalCriteria[]);

        // Expand all sections by default
        const expanded: Record<string, boolean> = {};
        (sectionsData as AppraisalSection[])
          .filter((s) => s.templateId === templateData.id)
          .forEach((s) => {
            expanded[s.id] = true;
          });
        setExpandedSections(expanded);
      }

      setRatings(
        (ratingsData as AppraisalRating[]).filter((r) => r.appraisalId === id)
      );
      setGoals(
        (goalsData as AppraisalGoal[]).filter((g) => g.appraisalId === id)
      );
      setTrainingNeeds(
        (trainingData as TrainingNeed[]).filter((t) => t.appraisalId === id)
      );
    } catch (error) {
      console.error("Error loading appraisal:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSectionCriteria = useCallback(
    (sectionId: string): AppraisalCriteria[] => {
      return criteria
        .filter((c) => c.sectionId === sectionId)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    },
    [criteria]
  );

  const getRating = useCallback(
    (criteriaId: string): AppraisalRating => {
      return (
        ratings.find((r) => r.criteriaId === criteriaId) || {
          appraisalId: id || "",
          criteriaId,
        }
      );
    },
    [ratings, id]
  );

  const calculateSectionScore = useCallback(
    (
      sectionId: string
    ): { score: number; rated: number; total: number } => {
      const sectionCriteria = getSectionCriteria(sectionId);
      let totalScore = 0;
      let maxScore = 0;
      let ratedCount = 0;

      sectionCriteria.forEach((c) => {
        const rating = getRating(c.id);
        const ratingValue =
          reviewMode === "self"
            ? rating.selfRating
            : reviewMode === "manager"
              ? rating.managerRating
              : rating.committeeRating;

        if (ratingValue && ratingValue > 0) {
          totalScore += (ratingValue / 5) * c.weight;
          ratedCount++;
        }
        maxScore += c.weight;
      });

      return {
        score: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0,
        rated: ratedCount,
        total: sectionCriteria.length,
      };
    },
    [getSectionCriteria, getRating, reviewMode]
  );

  const calculateTotalScore = useCallback((): number => {
    let totalScore = 0;
    let maxScore = 0;

    sections.forEach((section) => {
      const sectionCriteria = getSectionCriteria(section.id);
      sectionCriteria.forEach((c) => {
        const rating = getRating(c.id);
        const ratingValue =
          reviewMode === "self"
            ? rating.selfRating
            : reviewMode === "manager"
              ? rating.managerRating
              : rating.committeeRating;

        if (ratingValue && ratingValue > 0) {
          totalScore += (ratingValue / 5) * c.weight;
        }
        maxScore += c.weight;
      });
    });

    return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  }, [sections, getSectionCriteria, getRating, reviewMode]);

  const handleRatingChange = async (
    criteriaId: string,
    value: number
  ): Promise<void> => {
    const existingRating = getRating(criteriaId);
    const ratingData: AppraisalRating = {
      appraisalId: id || "",
      criteriaId,
      selfRating:
        reviewMode === "self" ? value : existingRating.selfRating || null,
      selfComment: existingRating.selfComment || "",
      managerRating:
        reviewMode === "manager" ? value : existingRating.managerRating || null,
      managerComment: existingRating.managerComment || "",
      committeeRating:
        reviewMode === "committee"
          ? value
          : existingRating.committeeRating || null,
      committeeComment: existingRating.committeeComment || "",
    };

    try {
      if (existingRating.id) {
        await performanceService.appraisalRatings.update(
          existingRating.id,
          ratingData
        );
      } else {
        await performanceService.appraisalRatings.create(ratingData);
      }
      await loadData();
    } catch (error) {
      console.error("Error saving rating:", error);
    }
  };

  const handleCommentChange = async (
    criteriaId: string,
    comment: string
  ): Promise<void> => {
    const existingRating = getRating(criteriaId);
    const commentField = `${reviewMode}Comment` as keyof AppraisalRating;

    const ratingData: AppraisalRating = {
      ...existingRating,
      appraisalId: id || "",
      criteriaId,
      [commentField]: comment,
    };

    try {
      if (existingRating.id) {
        await performanceService.appraisalRatings.update(
          existingRating.id,
          ratingData
        );
      } else {
        await performanceService.appraisalRatings.create(ratingData);
      }
      // Don't reload data on every keystroke
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  const handleSaveProgress = async (): Promise<void> => {
    setSaving(true);
    try {
      const totalScore = calculateTotalScore();
      const scoreField = `${reviewMode}AssessmentScore`;

      await performanceService.employeeAppraisals.update(id as string, {
        [scoreField]: totalScore,
      });
      alert("Progress saved");
    } catch (error) {
      console.error("Error saving progress:", error);
      alert("Error saving progress");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const totalScore = calculateTotalScore();

    // Check if all criteria are rated
    let allRated = true;
    sections.forEach((section) => {
      const sectionCriteria = getSectionCriteria(section.id);
      sectionCriteria.forEach((c) => {
        const rating = getRating(c.id);
        const ratingValue =
          reviewMode === "self"
            ? rating.selfRating
            : reviewMode === "manager"
              ? rating.managerRating
              : rating.committeeRating;
        if (!ratingValue || ratingValue === 0) {
          allRated = false;
        }
      });
    });

    if (!allRated) {
      if (!confirm("Some criteria are not rated. Do you want to continue?")) {
        return;
      }
    }

    try {
      setSaving(true);

      if (reviewMode === "self") {
        await performanceService.submitSelfAssessment(id as string, totalScore);
      } else if (reviewMode === "manager") {
        await performanceService.submitManagerReview(id as string, totalScore);
      } else if (reviewMode === "committee") {
        await performanceService.submitCommitteeReview(
          id as string,
          totalScore
        );
      }

      alert("Submitted successfully");
      await loadData();
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Error submitting");
    } finally {
      setSaving(false);
    }
  };

  const addGoal = async (): Promise<void> => {
    try {
      await performanceService.appraisalGoals.create({
        appraisalId: id,
        description: "",
        targetDate: null,
        status: "pending",
        progress: 0,
      });
      await loadData();
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const updateGoal = async (
    goalId: string,
    data: Partial<AppraisalGoal>
  ): Promise<void> => {
    try {
      await performanceService.appraisalGoals.update(goalId, data);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const deleteGoal = async (goalId: string): Promise<void> => {
    try {
      await performanceService.appraisalGoals.delete(goalId);
      await loadData();
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const addTrainingNeed = async (): Promise<void> => {
    try {
      await performanceService.appraisalTrainingNeeds.create({
        appraisalId: id,
        title: "",
        description: "",
        priority: "medium",
        status: "identified",
      });
      await loadData();
    } catch (error) {
      console.error("Error adding training need:", error);
    }
  };

  const updateTrainingNeed = async (
    needId: string,
    data: Partial<TrainingNeed>
  ): Promise<void> => {
    try {
      await performanceService.appraisalTrainingNeeds.update(needId, data);
    } catch (error) {
      console.error("Error updating training need:", error);
    }
  };

  const deleteTrainingNeed = async (needId: string): Promise<void> => {
    try {
      await performanceService.appraisalTrainingNeeds.delete(needId);
      await loadData();
    } catch (error) {
      console.error("Error deleting training need:", error);
    }
  };

  const getPerformanceLevel = useCallback(
    (score: number): PerformanceLevel => {
      if (score >= 80)
        return { level: "Outstanding", color: "text-emerald-600 bg-emerald-100" };
      if (score >= 70)
        return {
          level: "Exceeds Expectations",
          color: "text-green-600 bg-green-100",
        };
      if (score >= 50)
        return {
          level: "Meets Expectations",
          color: "text-blue-600 bg-blue-100",
        };
      if (score >= 30)
        return {
          level: "Needs Improvement",
          color: "text-yellow-600 bg-yellow-100",
        };
      return { level: "Unsatisfactory", color: "text-red-600 bg-red-100" };
    },
    []
  );

  const canEdit = useCallback((): boolean => {
    if (reviewMode === "self" && appraisal?.status === "self_assessment")
      return true;
    if (reviewMode === "manager" && appraisal?.status === "manager_review")
      return true;
    if (reviewMode === "committee" && appraisal?.status === "committee_review")
      return true;
    return false;
  }, [reviewMode, appraisal?.status]);

  const canGenerateAnnexure24 = useMemo((): boolean => {
    return ["approved", "communicated", "completed"].includes(
      appraisal?.status || ""
    );
  }, [appraisal?.status]);

  const handleGenerateAnnexure24 = async (): Promise<void> => {
    if (!appraisal) return;

    try {
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
        ratings,
        goals,
        trainingNeeds
      );
    } catch (error) {
      console.error("Error generating Annexure #24:", error);
      alert("Error generating Annexure #24");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!appraisal) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">Appraisal not found</p>
      </div>
    );
  }

  const totalScore = calculateTotalScore();
  const performanceLevel = getPerformanceLevel(totalScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/hr/performance/appraisals")}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Performance Appraisal
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {employee ? `${employee.firstName} ${employee.lastName}` : "Unknown"}{" "}
              • {cycle?.name || "Unknown Cycle"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Annexure #24 Button */}
          {canGenerateAnnexure24 && (
            <button
              onClick={handleGenerateAnnexure24}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Printer className="w-4 h-4" />
              Annexure #24
            </button>
          )}

          {canEdit() && (
            <>
              <button
                onClick={handleSaveProgress}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Save className="w-4 h-4" />
                Save Progress
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
                Submit{" "}
                {reviewMode === "self"
                  ? "Self Assessment"
                  : reviewMode === "manager"
                    ? "Manager Review"
                    : "Committee Review"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Score Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {employee
                  ? `${employee.firstName} ${employee.lastName}`
                  : "Unknown"}
              </h2>
              <p className="text-gray-500">{employee?.position || "No Position"}</p>
              <p className="text-sm text-gray-400">
                {employee?.department || "No Department"}
              </p>
            </div>
          </div>

          <div className="text-center">
            <div
              className={`text-4xl font-bold ${totalScore > 0 ? performanceLevel.color.split(" ")[0] : "text-gray-400"}`}
            >
              {totalScore}%
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                totalScore > 0 ? performanceLevel.color : "bg-gray-100 text-gray-500"
              }`}
            >
              {totalScore > 0 ? performanceLevel.level : "Not Rated"}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm text-gray-500">Self Assessment</p>
              <p className="text-xl font-bold text-blue-600">
                {appraisal.selfAssessmentScore || "-"}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Manager Score</p>
              <p className="text-xl font-bold text-purple-600">
                {appraisal.managerScore || "-"}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Committee Score</p>
              <p className="text-xl font-bold text-indigo-600">
                {appraisal.committeeScore || "-"}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Mode Toggle */}
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2">
        {(["self", "manager", "committee"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setReviewMode(mode)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
              reviewMode === mode
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {mode === "self"
              ? "Self Assessment"
              : mode === "manager"
                ? "Manager Review"
                : "Committee Review"}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {(
          [
            { key: "evaluation" as const, label: "Evaluation", icon: Star },
            { key: "goals" as const, label: "Goals", icon: Target },
            { key: "training" as const, label: "Training Needs", icon: BookOpen },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 -mb-px transition ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "evaluation" && (
        <div className="space-y-4">
          {sections.map((section) => {
            const sectionScore = calculateSectionScore(section.id);
            const isExpanded = expandedSections[section.id];
            const sectionCriteria = getSectionCriteria(section.id);

            return (
              <div
                key={section.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                {/* Section Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  onClick={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      [section.id]: !prev[section.id],
                    }))
                  }
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {section.sortOrder}. {section.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {sectionScore.rated}/{sectionScore.total} criteria rated
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span
                        className={`text-xl font-bold ${
                          sectionScore.score >= 70
                            ? "text-green-600"
                            : sectionScore.score >= 50
                              ? "text-blue-600"
                              : sectionScore.score > 0
                                ? "text-yellow-600"
                                : "text-gray-400"
                        }`}
                      >
                        {sectionScore.score}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Criteria List */}
                {isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    {sectionCriteria.map((criteriaItem) => {
                      const rating = getRating(criteriaItem.id);
                      const currentRating =
                        reviewMode === "self"
                          ? rating.selfRating
                          : reviewMode === "manager"
                            ? rating.managerRating
                            : rating.committeeRating;
                      const currentComment =
                        reviewMode === "self"
                          ? rating.selfComment
                          : reviewMode === "manager"
                            ? rating.managerComment
                            : rating.committeeComment;

                      return (
                        <div
                          key={criteriaItem.id}
                          className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {criteriaItem.name}
                              </h4>
                              {criteriaItem.description && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {criteriaItem.description}
                                </p>
                              )}
                              <span className="text-xs text-gray-400 mt-1 block">
                                Weight: {criteriaItem.weight} points
                              </span>
                            </div>
                          </div>

                          {/* Rating Stars */}
                          <div className="flex items-center gap-2 mb-3">
                            {RATING_SCALE.slice(1).map((scale) => (
                              <button
                                key={scale.value}
                                onClick={() =>
                                  canEdit() &&
                                  handleRatingChange(criteriaItem.id, scale.value)
                                }
                                disabled={!canEdit()}
                                className={`flex items-center justify-center w-10 h-10 rounded-lg border transition ${
                                  currentRating === scale.value
                                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                                    : "border-gray-300 dark:border-gray-600 text-gray-400 hover:border-gray-400"
                                } ${!canEdit() ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                title={`${scale.value} - ${scale.label}`}
                              >
                                <span className="font-semibold">{scale.value}</span>
                              </button>
                            ))}
                            <span className="ml-2 text-sm text-gray-500">
                              {currentRating
                                ? RATING_SCALE.find((r) => r.value === currentRating)
                                    ?.label
                                : "Not Rated"}
                            </span>
                          </div>

                          {/* Comment */}
                          {canEdit() ? (
                            <textarea
                              placeholder="Add comment..."
                              defaultValue={currentComment || ""}
                              onBlur={(e) =>
                                handleCommentChange(criteriaItem.id, e.target.value)
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                              rows={2}
                            />
                          ) : currentComment ? (
                            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                              {currentComment}
                            </p>
                          ) : null}

                          {/* Other Ratings Display */}
                          {(rating.selfRating ||
                            rating.managerRating ||
                            rating.committeeRating) && (
                            <div className="flex gap-4 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                              {reviewMode !== "self" && rating.selfRating && (
                                <span className="text-xs text-gray-500">
                                  Self: {rating.selfRating}/5
                                </span>
                              )}
                              {reviewMode !== "manager" && rating.managerRating && (
                                <span className="text-xs text-gray-500">
                                  Manager: {rating.managerRating}/5
                                </span>
                              )}
                              {reviewMode !== "committee" &&
                                rating.committeeRating && (
                                  <span className="text-xs text-gray-500">
                                    Committee: {rating.committeeRating}/5
                                  </span>
                                )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "goals" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Development Goals
            </h3>
            <button
              onClick={addGoal}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Goal
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No goals defined yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={goal.description}
                        onChange={(e) =>
                          updateGoal(goal.id, { description: e.target.value })
                        }
                        placeholder="Goal description..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <div className="flex items-center gap-4 mt-2">
                        <input
                          type="date"
                          value={goal.targetDate || ""}
                          onChange={(e) =>
                            updateGoal(goal.id, { targetDate: e.target.value })
                          }
                          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <select
                          value={goal.status}
                          onChange={(e) =>
                            updateGoal(goal.id, { status: e.target.value })
                          }
                          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1 text-gray-400 hover:text-red-600 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "training" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Training Needs
            </h3>
            <button
              onClick={addTrainingNeed}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Training Need
            </button>
          </div>

          {trainingNeeds.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No training needs identified yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trainingNeeds.map((need) => (
                <div
                  key={need.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={need.title}
                        onChange={(e) =>
                          updateTrainingNeed(need.id, { title: e.target.value })
                        }
                        placeholder="Training title..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <textarea
                        value={need.description || ""}
                        onChange={(e) =>
                          updateTrainingNeed(need.id, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Description..."
                        rows={2}
                        className="w-full px-3 py-2 mt-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      />
                      <div className="flex items-center gap-4 mt-2">
                        <select
                          value={need.priority}
                          onChange={(e) =>
                            updateTrainingNeed(need.id, {
                              priority: e.target.value as "low" | "medium" | "high",
                            })
                          }
                          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                        </select>
                        <select
                          value={need.status}
                          onChange={(e) =>
                            updateTrainingNeed(need.id, { status: e.target.value })
                          }
                          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="identified">Identified</option>
                          <option value="planned">Planned</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTrainingNeed(need.id)}
                      className="p-1 text-gray-400 hover:text-red-600 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppraisalForm;
