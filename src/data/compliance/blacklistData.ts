import type {
  BlacklistCategory,
  AccessLevel,
  BlacklistEntry,
} from '../../types/compliance/blacklist';

// Category Options - 5 predefined categories
export const BLACKLIST_CATEGORIES: BlacklistCategory[] = [
  'Staff',
  'Supplier/Vendor/Contractor',
  'Partner',
  'Visitor',
  'Participants',
];

// Access Level Options - 6 predefined access levels
export const ACCESS_LEVELS: AccessLevel[] = [
  'Department Head',
  'HR Only',
  'Finance Only',
  'All Departments',
  'Senior Management',
  'Restricted - Confidential',
];

// Category Color Mapping - Tailwind classes for badges
export const CATEGORY_COLORS: Record<BlacklistCategory, string> = {
  Staff: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'Supplier/Vendor/Contractor':
    'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  Partner: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Visitor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Participants: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

// Access Level Color Function - Returns Tailwind classes based on access level
export const getAccessColor = (access: AccessLevel): string => {
  if (access.includes('Confidential')) {
    return 'text-red-600 dark:text-red-400 font-semibold';
  }
  if (access.includes('Senior')) {
    return 'text-purple-600 dark:text-purple-400 font-medium';
  }
  if (access.includes('All')) {
    return 'text-blue-600 dark:text-blue-400';
  }
  return 'text-gray-600 dark:text-gray-400';
};

// Check if entry is currently active (not expired)
export const isEntryActive = (entry: BlacklistEntry): boolean => {
  if (entry.endOption === 'no_expiry') return true;
  if (!entry.end) return true;

  const endDate = new Date(entry.end);
  const today = new Date();

  // Reset time to compare dates only
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  return endDate >= today;
};

// Get display text for end date
export const getEndDateDisplay = (entry: BlacklistEntry): string => {
  if (entry.endOption === 'no_expiry') return 'No expiry';
  return entry.end || '-';
};

// Format ISO date string to readable format
export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';

  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return dateString;
  }
};

// Get status display text
export const getStatusText = (entry: BlacklistEntry): string => {
  return isEntryActive(entry) ? 'Active' : 'Expired';
};

// Get status badge classes
export const getStatusBadgeClass = (entry: BlacklistEntry): string => {
  return isEntryActive(entry)
    ? 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    : 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
};
