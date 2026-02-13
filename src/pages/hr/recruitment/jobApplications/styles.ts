// ─── Reusable Tailwind class strings ───

export const formStyles = {
  // Layout
  page: 'space-y-6',
  card: 'rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm',
  cardBody: 'p-6 space-y-8',

  // Section
  sectionTitle: 'text-lg font-semibold text-gray-900 dark:text-white mb-4',
  sectionHeader: 'flex items-center justify-between mb-4',

  // Grid layouts
  grid2: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  grid3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  grid4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
  fullSpan: 'md:col-span-2 lg:col-span-3',

  // Form elements
  label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
  required: 'text-red-500',
  input: 'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm',
  textarea: 'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm',
  select: 'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm',
  radio: 'text-primary-500 focus:ring-primary-500',
  checkbox: 'rounded border-gray-300 text-primary-500 focus:ring-primary-500',

  // Radio/Checkbox groups
  radioGroup: 'flex gap-4 mt-2',
  radioLabel: 'flex items-center gap-2',
  radioText: 'text-sm text-gray-700 dark:text-gray-300',

  // Dynamic record card
  recordCard: 'p-4 border border-gray-200 dark:border-gray-700 rounded-lg',
  recordHeader: 'flex justify-between items-center mb-3',
  recordTitle: 'text-sm font-medium text-gray-700 dark:text-gray-300',
  recordList: 'space-y-4',

  // Buttons
  addButton: 'inline-flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600',
  removeButton: 'text-red-500 hover:text-red-600',
  primaryButton: 'inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600',
  secondaryButton: 'inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300',

  // Header
  headerRow: 'flex items-center justify-between',
  headerLeft: 'flex items-center gap-4',
  backLink: 'p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
  title: 'text-2xl font-bold text-gray-900 dark:text-white',
  subtitle: 'mt-1 text-sm text-gray-600 dark:text-gray-400',
  headerActions: 'flex items-center gap-3',

  // Empty state
  emptyText: 'text-sm text-gray-500 dark:text-gray-400 text-center py-4',

  // Official use section
  officialBanner: 'p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg',
  officialTitle: 'text-lg font-semibold text-amber-800 dark:text-amber-300 mb-4',

  // Declaration / consent
  consentBox: 'p-4 bg-gray-50 dark:bg-gray-900 rounded-lg',
  consentLabel: 'flex items-start gap-3',
  consentText: 'text-sm text-gray-700 dark:text-gray-300',

  // Yes/No inline group
  yesNoGroup: 'flex items-center gap-6',

  // Table styles (for list view)
  table: 'w-full',
  thead: 'bg-gray-50 dark:bg-gray-900',
  th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase',
  tbody: 'divide-y divide-gray-200 dark:divide-gray-700',
  td: 'px-6 py-4 text-sm text-gray-900 dark:text-white',

  // Search
  searchWrapper: 'relative max-w-md',
  searchIcon: 'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400',
  searchInput: 'w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm',
} as const;
