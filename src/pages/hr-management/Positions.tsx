import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { create } from 'zustand';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Briefcase,
  RefreshCw,
  X,
  ChevronDown,
  ChevronRight,
  Users,
  Check,
} from 'lucide-react';
import { positionDB, departmentDB, seedAllDefaults } from '../../services/db/indexedDB';

// ============== Types (synced with DB schema) ==============
interface Position {
  id?: number;
  title: string;
  department: string;
  level: string; // Matches DB: "Level 1", "Level 2", etc. or legacy "Junior", "Mid", etc.
  description?: string;
  isCustom?: boolean;
  createdAt?: string;
}

interface Department {
  id: number;
  name: string;
  code?: string;
  description?: string;
}

interface PositionLevel {
  number: number;
  name: string;
  value: string; // The value stored in DB
  description: string;
  positions: string[];
  color: string;
  bgColor: string;
}

// ============== Position Levels Data ==============
const POSITION_LEVELS: PositionLevel[] = [
  {
    number: 1,
    name: 'Support / Entry Level',
    value: 'Level 1 - Support / Entry Level',
    description: 'Foundation-level positions',
    positions: ['Office Assistant', 'Driver', 'Cleaner', 'Guard', 'Junior Clerk'],
    color: 'text-slate-700 dark:text-slate-300',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
  },
  {
    number: 2,
    name: 'Junior Staff',
    value: 'Level 2 - Junior Staff',
    description: 'Entry-level professional positions',
    positions: ['Junior Officer', 'Assistant', 'Field Assistant', 'Data Enumerator'],
    color: 'text-green-700 dark:text-green-300',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    number: 3,
    name: 'Officer / Technical Staff',
    value: 'Level 3 - Officer / Technical Staff',
    description: 'Mid-level professional positions',
    positions: ['HR Officer', 'Finance Officer', 'Program Officer', 'IT Officer'],
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    number: 4,
    name: 'Senior Officer / Specialist',
    value: 'Level 4 - Senior Officer / Specialist',
    description: 'Senior professional positions',
    positions: ['Senior HR Officer', 'Senior Finance Officer', 'Specialist (MEAL, M&E, IT, Agriculture)'],
    color: 'text-purple-700 dark:text-purple-300',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    number: 5,
    name: 'Supervisor / Team Lead',
    value: 'Level 5 - Supervisor / Team Lead',
    description: 'Team leadership positions',
    positions: ['Team Leader', 'Supervisor', 'Field Supervisor', 'Unit Head'],
    color: 'text-amber-700 dark:text-amber-300',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  {
    number: 6,
    name: 'Manager / Coordinator',
    value: 'Level 6 - Manager / Coordinator',
    description: 'Management positions',
    positions: ['Project Manager', 'HR Manager', 'Finance Manager', 'Program Coordinator'],
    color: 'text-orange-700 dark:text-orange-300',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  {
    number: 7,
    name: 'Senior Management',
    value: 'Level 7 - Senior Management',
    description: 'Department leadership',
    positions: ['Head of Department', 'Director', 'Country Manager'],
    color: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  {
    number: 8,
    name: 'Executive / Leadership',
    value: 'Level 8 - Executive / Leadership',
    description: 'Top-level executive positions',
    positions: ['Executive Director', 'CEO', 'Country Director'],
    color: 'text-rose-700 dark:text-rose-300',
    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
  },
];

// Legacy level mapping for backward compatibility
const LEGACY_LEVEL_MAP: Record<string, number> = {
  'Junior': 2,
  'Mid': 3,
  'Senior': 4,
  'Manager': 6,
  'Director': 7,
};

// Helper function to get level number from level string
const getLevelNumber = (level: string): number => {
  if (!level) return 0;

  // Check if it's a new format "Level X - ..."
  const match = level.match(/^Level\s*(\d+)/i);
  if (match) {
    return parseInt(match[1], 10);
  }

  // Check legacy format
  if (LEGACY_LEVEL_MAP[level]) {
    return LEGACY_LEVEL_MAP[level];
  }

  return 0; // Unknown level
};

// Helper function to get level info
const getLevelInfo = (level: string): PositionLevel | undefined => {
  const levelNum = getLevelNumber(level);
  return POSITION_LEVELS.find(l => l.number === levelNum);
};

// ============== Zod Schema (matches DB) ==============
const positionSchema = z.object({
  title: z.string().min(1, 'Position title is required').max(100, 'Title must be less than 100 characters'),
  department: z.string().min(1, 'Department is required'),
  level: z.string().min(1, 'Level is required'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().or(z.literal('')),
  isCustom: z.boolean().optional(),
});

type PositionFormData = z.infer<typeof positionSchema>;

// ============== Zustand Store ==============
interface PositionStore {
  positions: Position[];
  departments: Department[];
  loading: boolean;
  searchTerm: string;
  departmentFilter: string;
  levelFilter: string;
  expandedLevels: number[];
  setPositions: (positions: Position[]) => void;
  setDepartments: (departments: Department[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchTerm: (term: string) => void;
  setDepartmentFilter: (filter: string) => void;
  setLevelFilter: (filter: string) => void;
  toggleLevel: (levelNumber: number) => void;
  expandAllLevels: () => void;
  collapseAllLevels: () => void;
}

const usePositionStore = create<PositionStore>((set) => ({
  positions: [],
  departments: [],
  loading: true,
  searchTerm: '',
  departmentFilter: '',
  levelFilter: '',
  expandedLevels: [],
  setPositions: (positions) => set({ positions }),
  setDepartments: (departments) => set({ departments }),
  setLoading: (loading) => set({ loading }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setDepartmentFilter: (departmentFilter) => set({ departmentFilter }),
  setLevelFilter: (levelFilter) => set({ levelFilter }),
  toggleLevel: (levelNumber) =>
    set((state) => ({
      expandedLevels: state.expandedLevels.includes(levelNumber)
        ? state.expandedLevels.filter((l) => l !== levelNumber)
        : [...state.expandedLevels, levelNumber],
    })),
  expandAllLevels: () => set({ expandedLevels: POSITION_LEVELS.map((l) => l.number) }),
  collapseAllLevels: () => set({ expandedLevels: [] }),
}));

// ============== Main Component ==============
const Positions = () => {
  const {
    positions,
    departments,
    loading,
    searchTerm,
    departmentFilter,
    levelFilter,
    expandedLevels,
    setPositions,
    setDepartments,
    setLoading,
    setSearchTerm,
    setDepartmentFilter,
    setLevelFilter,
    toggleLevel,
    expandAllLevels,
    collapseAllLevels,
  } = usePositionStore();

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; position: Position | null }>({
    show: false,
    position: null,
  });
  const [selectedLevel, setSelectedLevel] = useState<PositionLevel | null>(null);
  const [showCustomInput, setShowCustomInput] = useState<number | null>(null);
  const [customPositionName, setCustomPositionName] = useState('');

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PositionFormData>({
    resolver: zodResolver(positionSchema),
    defaultValues: {
      title: '',
      department: '',
      level: '',
      description: '',
      isCustom: false,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await seedAllDefaults();
      const [posData, deptData] = await Promise.all([
        positionDB.getAll(),
        departmentDB.getAll(),
      ]);
      setPositions(posData as Position[]);
      setDepartments(deptData as Department[]);
    } catch (error) {
      console.error('Error loading positions:', error);
      toast.error('Failed to load positions');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (position: Position | null = null, level?: PositionLevel) => {
    if (position) {
      setEditingPosition(position);
      // When editing, try to find the matching level info
      const posLevelInfo = getLevelInfo(position.level);
      setSelectedLevel(posLevelInfo || null);
      reset({
        title: position.title || '',
        department: position.department || '',
        level: position.level || '',
        description: position.description || '',
        isCustom: position.isCustom || false,
      });
    } else {
      setEditingPosition(null);
      setSelectedLevel(level || null);
      reset({
        title: '',
        department: '',
        level: level?.value || '',
        description: '',
        isCustom: false,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPosition(null);
    setSelectedLevel(null);
    reset();
  };

  const onSubmit = async (data: PositionFormData) => {
    try {
      const submitData = {
        title: data.title,
        department: data.department,
        level: data.level,
        description: data.description || '',
        isCustom: data.isCustom || false,
      };

      if (editingPosition) {
        await positionDB.update(editingPosition.id!, submitData);
        toast.success('Position updated successfully');
      } else {
        await positionDB.create(submitData);
        toast.success('Position created successfully');
      }
      handleCloseModal();
      await loadData();
    } catch (error) {
      console.error('Error saving position:', error);
      toast.error('Failed to save position');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.position) return;

    try {
      await positionDB.delete(deleteModal.position.id!);
      setDeleteModal({ show: false, position: null });
      toast.success('Position deleted successfully');
      await loadData();
    } catch (error) {
      console.error('Error deleting position:', error);
      toast.error('Failed to delete position');
    }
  };

  const handleQuickAddPosition = (positionTitle: string, level: PositionLevel, isCustom: boolean = false) => {
    if (departments.length === 0) {
      toast.error('Please add a department first');
      return;
    }

    // Open modal with pre-filled data
    setEditingPosition(null);
    setSelectedLevel(level);
    reset({
      title: positionTitle,
      department: '',
      level: level.value,
      description: '',
      isCustom: isCustom,
    });
    setShowModal(true);
  };

  const handleAddCustomPosition = (level: PositionLevel) => {
    if (!customPositionName.trim()) {
      toast.error('Please enter a position name');
      return;
    }

    handleQuickAddPosition(customPositionName.trim(), level, true);
    setCustomPositionName('');
    setShowCustomInput(null);
  };

  // Filter positions
  const filteredPositions = positions.filter((pos) => {
    const matchesSearch = pos.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = !departmentFilter || pos.department === departmentFilter;
    const matchesLevel = !levelFilter || getLevelNumber(pos.level) === parseInt(levelFilter);
    return matchesSearch && matchesDept && matchesLevel;
  });

  // Get positions by level number
  const getPositionsByLevel = (levelNumber: number): Position[] => {
    return filteredPositions.filter((pos) => getLevelNumber(pos.level) === levelNumber);
  };

  // Get unassigned positions (legacy or unknown levels)
  const getUnassignedPositions = (): Position[] => {
    return filteredPositions.filter((pos) => getLevelNumber(pos.level) === 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const unassignedPositions = getUnassignedPositions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Positions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage job positions organized by levels
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            <span>Add Position</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Levels</option>
            {POSITION_LEVELS.map((level) => (
              <option key={level.number} value={level.number}>
                Level {level.number} – {level.name}
              </option>
            ))}
          </select>
          <div className="flex items-center space-x-2">
            <button
              onClick={expandAllLevels}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Expand All
            </button>
            <button
              onClick={collapseAllLevels}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Unassigned Positions (Legacy data) */}
      {unassignedPositions.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700 overflow-hidden">
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">
              Unassigned Positions ({unassignedPositions.length})
            </h3>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              These positions have legacy or unrecognized levels. Edit them to assign a proper level.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-yellow-50 dark:bg-yellow-900/20">
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 dark:text-yellow-400 uppercase">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 dark:text-yellow-400 uppercase">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 dark:text-yellow-400 uppercase">
                    Current Level
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-yellow-700 dark:text-yellow-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-200 dark:divide-yellow-700">
                {unassignedPositions.map((pos) => (
                  <tr key={pos.id} className="hover:bg-yellow-50 dark:hover:bg-yellow-900/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                          <Briefcase className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{pos.title}</p>
                          {pos.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {pos.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {pos.department || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        {pos.level || 'Not set'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleOpenModal(pos)}
                          className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-yellow-600" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ show: true, position: pos })}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Position Levels Accordion */}
      <div className="space-y-4">
        {POSITION_LEVELS.map((level) => {
          const levelPositions = getPositionsByLevel(level.number);
          const isExpanded = expandedLevels.includes(level.number);

          return (
            <div
              key={level.number}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Level Header */}
              <button
                onClick={() => toggleLevel(level.number)}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${level.bgColor}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                    <Users className={`w-5 h-5 ${level.color}`} />
                  </div>
                  <div className="text-left">
                    <h3 className={`font-semibold ${level.color}`}>
                      Level {level.number} – {level.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{level.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 text-sm font-medium bg-white dark:bg-gray-800 rounded-full shadow-sm">
                    {levelPositions.length} position{levelPositions.length !== 1 ? 's' : ''}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>

              {/* Level Content */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  {/* Quick Add Positions */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/30">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Quick Add Positions:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {level.positions.map((posTitle) => (
                        <button
                          key={posTitle}
                          onClick={() => handleQuickAddPosition(posTitle, level)}
                          className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700 transition-colors flex items-center space-x-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{posTitle}</span>
                        </button>
                      ))}

                      {/* Other Button */}
                      {showCustomInput === level.number ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="Enter position name..."
                            value={customPositionName}
                            onChange={(e) => setCustomPositionName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddCustomPosition(level);
                              } else if (e.key === 'Escape') {
                                setShowCustomInput(null);
                                setCustomPositionName('');
                              }
                            }}
                            className="px-3 py-1.5 text-sm border border-primary-300 dark:border-primary-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleAddCustomPosition(level)}
                            className="p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setShowCustomInput(null);
                              setCustomPositionName('');
                            }}
                            className="p-1.5 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCustomInput(level.number)}
                          className="px-3 py-1.5 text-sm bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors flex items-center space-x-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Other</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Added Positions Table */}
                  {levelPositions.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-700/50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Position
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Department
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {levelPositions.map((pos) => (
                            <tr key={pos.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className={`p-2 rounded-lg ${level.bgColor}`}>
                                    <Briefcase className={`w-4 h-4 ${level.color}`} />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {pos.title}
                                      {pos.isCustom && (
                                        <span className="ml-2 text-xs text-primary-600 dark:text-primary-400">
                                          (Custom)
                                        </span>
                                      )}
                                    </p>
                                    {pos.description && (
                                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                        {pos.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                {pos.department || '-'}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-1">
                                  <button
                                    onClick={() => handleOpenModal(pos, level)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4 text-gray-500" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteModal({ show: true, position: pos })}
                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {levelPositions.length === 0 && (
                    <div className="p-8 text-center">
                      <Briefcase className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No positions added at this level yet
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        Click on any position above to add it
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Positions</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{positions.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Levels Used</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {new Set(positions.map((p) => getLevelNumber(p.level)).filter(n => n > 0)).size}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Departments</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {new Set(positions.map((p) => p.department).filter(Boolean)).size}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Custom Positions</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {positions.filter((p) => p.isCustom).length}
          </p>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingPosition ? 'Edit Position' : 'Add Position'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {selectedLevel && (
              <div className={`mb-4 p-3 rounded-lg ${selectedLevel.bgColor}`}>
                <p className={`text-sm font-medium ${selectedLevel.color}`}>
                  Level {selectedLevel.number} – {selectedLevel.name}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('title')}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="e.g., HR Officer"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('department')}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 ${
                    errors.department ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-500">{errors.department.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Level <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="level"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        const newLevel = POSITION_LEVELS.find(l => l.value === e.target.value);
                        setSelectedLevel(newLevel || null);
                      }}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 ${
                        errors.level ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">Select Level</option>
                      {POSITION_LEVELS.map((level) => (
                        <option key={level.number} value={level.value}>
                          Level {level.number} – {level.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.level && (
                  <p className="mt-1 text-sm text-red-500">{errors.level.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief description of the position"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingPosition ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Position</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong>{deleteModal.position?.title}</strong>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModal({ show: false, position: null })}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Positions;
