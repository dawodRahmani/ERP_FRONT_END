// ─── Reusable Tailwind class strings for COI module ───

export const coiStyles = {
  // Layout
  page: 'space-y-6',
  card: 'rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm',
  cardBody: 'p-6 space-y-8',

  // Section
  sectionTitle: 'text-lg font-semibold text-gray-900 dark:text-white mb-4',
  sectionHeader: 'flex items-center justify-between mb-4',
  sectionNumber: 'inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm font-bold mr-2',

  // Grid layouts
  grid2: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  grid3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',

  // Form elements
  label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
  required: 'text-red-500',
  input: 'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm',
  textarea: 'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm',
  select: 'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm',
  radio: 'text-primary-500 focus:ring-primary-500',
  checkbox: 'rounded border-gray-300 text-primary-500 focus:ring-primary-500',

  // Radio groups
  radioGroup: 'flex gap-6 mt-1',
  radioLabel: 'flex items-center gap-2',
  radioText: 'text-sm text-gray-700 dark:text-gray-300',

  // Buttons
  primaryButton: 'inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600',
  secondaryButton: 'inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700',

  // Header
  headerRow: 'flex items-center justify-between',
  headerLeft: 'flex items-center gap-4',
  backLink: 'p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
  title: 'text-2xl font-bold text-gray-900 dark:text-white',
  subtitle: 'mt-1 text-sm text-gray-600 dark:text-gray-400',
  headerActions: 'flex items-center gap-3',

  // Conflict question card
  questionCard: 'p-5 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3',
  questionText: 'text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed',
  questionNumber: 'font-semibold text-primary-600 dark:text-primary-400 mr-1',

  // Declaration / consent
  consentBox: 'p-5 bg-gray-50 dark:bg-gray-900 rounded-lg',
  consentLabel: 'flex items-start gap-3',
  consentText: 'text-sm text-gray-700 dark:text-gray-300 leading-relaxed',

  // HR review section
  reviewSection: 'p-5 border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg',
  reviewTitle: 'text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4',

  // Alert / warning
  warningBanner: 'flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg',
  warningText: 'text-sm text-yellow-800 dark:text-yellow-200',

  // Note banner
  noteBanner: 'p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg',
  noteText: 'text-xs text-blue-700 dark:text-blue-300 leading-relaxed',

  // File upload
  fileZone: 'border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-400 dark:hover:border-primary-500 transition-colors cursor-pointer',
  fileZoneText: 'text-sm text-gray-500 dark:text-gray-400 mt-2',
  fileList: 'space-y-2 mt-3',
  fileItem: 'flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700',
  fileName: 'text-sm font-medium text-gray-700 dark:text-gray-300 truncate',
  fileSize: 'text-xs text-gray-500 dark:text-gray-400 ml-2',
  fileActions: 'flex items-center gap-2 ml-4',

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

  // Status badges
  badgeBase: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  badgeDraft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  badgeSubmitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  badgeNoConflict: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  badgeConflict: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  badgePending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',

  // Empty state
  emptyText: 'text-sm text-gray-500 dark:text-gray-400 text-center py-4',
} as const;
