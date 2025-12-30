// Blacklist Type Definitions

// Category type - 5 predefined categories for classification
export type BlacklistCategory =
  | 'Staff'
  | 'Supplier/Vendor/Contractor'
  | 'Partner'
  | 'Visitor'
  | 'Participants';

// Access Level type - determines who can view the entry
export type AccessLevel =
  | 'Department Head'
  | 'HR Only'
  | 'Finance Only'
  | 'All Departments'
  | 'Senior Management'
  | 'Restricted - Confidential';

// End date option type
export type EndOption = 'no_expiry' | 'date_specified';

// Status type for filtering
export type BlacklistStatus = 'active' | 'expired';

// Main Blacklist Entity
export interface BlacklistEntry {
  id: number;
  name: string;
  description?: string;
  category: BlacklistCategory;
  start: string; // ISO date string (YYYY-MM-DD)
  endOption: EndOption;
  end?: string; // ISO date string (YYYY-MM-DD) - optional
  reason: string;
  documentLink?: string;
  access: AccessLevel;
  createdAt?: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
}

// Form Input type (without auto-generated fields)
export interface BlacklistFormInput {
  name: string;
  description?: string;
  category: BlacklistCategory;
  start: string;
  endOption: EndOption;
  end?: string;
  reason: string;
  documentLink?: string;
  access: AccessLevel;
}

// API Response Types
export interface BlacklistListResponse {
  data: BlacklistEntry[];
  total: number;
  page?: number;
  limit?: number;
}

export interface BlacklistDetailResponse {
  data: BlacklistEntry;
}

// Filter State Interface
export interface BlacklistFilters {
  searchTerm: string;
  categoryFilter: BlacklistCategory | '';
  accessFilter: AccessLevel | '';
  statusFilter: BlacklistStatus | '';
}

// Statistics Interface
export interface BlacklistStatistics {
  total: number;
  active: number;
  expired: number;
  byCategory: Record<BlacklistCategory, number>;
  byAccess: Record<AccessLevel, number>;
}
