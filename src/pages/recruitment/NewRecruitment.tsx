import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, X, RefreshCw } from "lucide-react";
import { useRecruitment } from "../../contexts/RecruitmentContext";
import {
  HIRING_APPROACH,
  CONTRACT_TYPE,
} from "../../services/db/recruitmentService";

// ==================== TYPES ====================

interface HiringApproachType {
  [key: string]: string;
}

interface ContractTypeType {
  [key: string]: string;
}

// ==================== ZOD SCHEMA ====================

const newRecruitmentSchema = z.object({
  positionTitle: z
    .string()
    .min(3, "Position title must be at least 3 characters")
    .max(100, "Position title must be less than 100 characters"),
  projectName: z
    .string()
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name must be less than 100 characters"),
  hiringApproach: z.string().min(1, "Please select a hiring approach"),
  contractType: z.string().min(1, "Please select a contract type"),
  departmentId: z.string().optional(),
  projectId: z.string().optional(),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  positionsRequired: z
    .number()
    .min(1, "At least 1 position is required")
    .max(100, "Maximum 100 positions allowed"),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

type NewRecruitmentFormData = z.infer<typeof newRecruitmentSchema>;

// ==================== COMPONENT ====================

const NewRecruitment: React.FC = () => {
  const navigate = useNavigate();
  const { createRecruitment, loading, error } = useRecruitment();

  // React Hook Form with Zod validation
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewRecruitmentFormData>({
    resolver: zodResolver(newRecruitmentSchema),
    defaultValues: {
      positionTitle: "",
      projectName: "",
      hiringApproach: (HIRING_APPROACH as HiringApproachType).OPEN_COMPETITION || "open_competition",
      contractType: (CONTRACT_TYPE as ContractTypeType).PROJECT || "project",
      departmentId: "",
      projectId: "",
      location: "",
      positionsRequired: 1,
      notes: "",
    },
  });

  const onSubmit = useCallback(
    async (data: NewRecruitmentFormData) => {
      try {
        const recruitment = await createRecruitment(data);
        navigate(`/recruitment/${recruitment.id}`);
      } catch (err) {
        console.error("Failed to create recruitment:", err);
      }
    },
    [createRecruitment, navigate]
  );

  const handleCancel = useCallback(() => {
    navigate("/recruitment");
  }, [navigate]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Recruitments
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Start New Recruitment
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Begin a new 15-step recruitment process. You'll start with creating
          the Terms of Reference (TOR).
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6 space-y-6">
          {/* Position Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Position Title <span className="text-red-500">*</span>
            </label>
            <Controller
              name="positionTitle"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="e.g., Senior Program Manager"
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.positionTitle
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
              )}
            />
            {errors.positionTitle && (
              <p className="mt-1 text-sm text-red-500">
                {errors.positionTitle.message}
              </p>
            )}
          </div>

          {/* Project Name - NEW FIELD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <Controller
              name="projectName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="e.g., WASH Program 2024"
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.projectName
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
              )}
            />
            {errors.projectName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.projectName.message}
              </p>
            )}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hiring Approach */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hiring Approach
              </label>
              <Controller
                name="hiringApproach"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.hiringApproach
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {Object.entries(HIRING_APPROACH as HiringApproachType).map(
                      ([key, value]) => (
                        <option key={value} value={value}>
                          {key.replace(/_/g, " ")}
                        </option>
                      )
                    )}
                  </select>
                )}
              />
              {errors.hiringApproach && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.hiringApproach.message}
                </p>
              )}
            </div>

            {/* Contract Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contract Type
              </label>
              <Controller
                name="contractType"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.contractType
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {Object.entries(CONTRACT_TYPE as ContractTypeType).map(
                      ([key, value]) => (
                        <option key={value} value={value}>
                          {key.replace(/_/g, " ")}
                        </option>
                      )
                    )}
                  </select>
                )}
              />
              {errors.contractType && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.contractType.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duty Station / Location
              </label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g., Kabul, Afghanistan"
                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.location
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                )}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Positions Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Positions
              </label>
              <Controller
                name="positionsRequired"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min={1}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 1)
                    }
                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.positionsRequired
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                )}
              />
              {errors.positionsRequired && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.positionsRequired.message}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Initial Notes (Optional)
            </label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  placeholder="Any initial notes about this recruitment..."
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.notes
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
              )}
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
              What happens next?
            </h4>
            <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-decimal list-inside">
              <li>A new recruitment record will be created with a unique code</li>
              <li>
                You'll be redirected to complete the Terms of Reference (TOR)
              </li>
              <li>
                After TOR approval, you'll proceed through all 15 recruitment
                steps
              </li>
            </ol>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading || isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create & Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRecruitment;
