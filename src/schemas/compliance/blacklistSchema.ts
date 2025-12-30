import { z } from 'zod';

// Enum schemas for type-safe validation
const blacklistCategorySchema = z.enum(
  [
    'Staff',
    'Supplier/Vendor/Contractor',
    'Partner',
    'Visitor',
    'Participants',
  ],
  {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }
);

const accessLevelSchema = z.enum(
  [
    'Department Head',
    'HR Only',
    'Finance Only',
    'All Departments',
    'Senior Management',
    'Restricted - Confidential',
  ],
  {
    errorMap: () => ({ message: 'Please select a valid access level' }),
  }
);

const endOptionSchema = z.enum(['no_expiry', 'date_specified']);

// Main form validation schema
export const blacklistFormSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters')
      .trim()
      .refine((val) => val.length > 0, {
        message: 'Name is required',
      }),

    description: z
      .string()
      .max(500, 'Description must be less than 500 characters')
      .optional()
      .or(z.literal('')),

    category: blacklistCategorySchema,

    start: z
      .string()
      .min(1, 'Start date is required')
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Please enter a valid start date',
      }),

    endOption: endOptionSchema,

    end: z
      .string()
      .optional()
      .refine(
        (val) => !val || !isNaN(Date.parse(val)),
        {
          message: 'Please enter a valid end date',
        }
      )
      .or(z.literal('')),

    reason: z
      .string()
      .min(10, 'Reason must be at least 10 characters')
      .max(1000, 'Reason must be less than 1000 characters')
      .trim()
      .refine((val) => val.length >= 10, {
        message: 'Reason is required and must be at least 10 characters',
      }),

    documentLink: z
      .string()
      .url('Please enter a valid URL')
      .optional()
      .or(z.literal('')),

    access: accessLevelSchema,
  })
  .refine(
    (data) => {
      // If endOption is date_specified, end date is required
      if (data.endOption === 'date_specified') {
        return data.end !== '' && data.end !== undefined;
      }
      return true;
    },
    {
      message: 'End date is required when date is specified',
      path: ['end'],
    }
  )
  .refine(
    (data) => {
      // End date must be after start date
      if (data.end && data.end !== '' && data.start) {
        const startDate = new Date(data.start);
        const endDate = new Date(data.end);
        return endDate > startDate;
      }
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['end'],
    }
  );

// Infer TypeScript type from Zod schema
export type BlacklistFormData = z.infer<typeof blacklistFormSchema>;
