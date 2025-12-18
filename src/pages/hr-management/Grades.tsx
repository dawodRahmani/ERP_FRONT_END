import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { create } from 'zustand';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Award,
  RefreshCw,
  X,
  TrendingUp,
  Coins,
} from 'lucide-react';
import { gradeDB, seedAllDefaults } from '../../services/db/indexedDB';

// ============== Types ==============
interface Grade {
  id?: number;
  name: string;
  step: number;
  currency: string;
  minSalary: number;
  maxSalary: number;
  description?: string;
  createdAt?: string;
}

// ============== Currency Options ==============
const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AFN', symbol: '؋', name: 'Afghan Afghani' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
];

// ============== Zod Schema ==============
const gradeSchema = z.object({
  name: z.string().min(1, 'Grade name is required').max(100, 'Name must be less than 100 characters'),
  step: z.coerce.number().min(1, 'Step must be at least 1').max(100, 'Step must be less than 100'),
  currency: z.string().min(1, 'Currency is required'),
  minSalary: z.coerce.number().min(0, 'Minimum salary must be at least 0'),
  maxSalary: z.coerce.number().min(0, 'Maximum salary must be at least 0'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
}).refine((data) => data.maxSalary > data.minSalary, {
  message: 'Maximum salary must be greater than minimum salary',
  path: ['maxSalary'],
});

type GradeFormData = z.infer<typeof gradeSchema>;

// ============== Zustand Store ==============
interface GradeStore {
  grades: Grade[];
  loading: boolean;
  searchTerm: string;
  setGrades: (grades: Grade[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchTerm: (term: string) => void;
}

const useGradeStore = create<GradeStore>((set) => ({
  grades: [],
  loading: true,
  searchTerm: '',
  setGrades: (grades) => set({ grades }),
  setLoading: (loading) => set({ loading }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
}));

// ============== Main Component ==============
const Grades = () => {
  const { grades, loading, searchTerm, setGrades, setLoading, setSearchTerm } = useGradeStore();

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; grade: Grade | null }>({
    show: false,
    grade: null,
  });

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      name: '',
      step: 1,
      currency: 'USD',
      minSalary: 0,
      maxSalary: 0,
      description: '',
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await seedAllDefaults();
      const data = await gradeDB.getAll();
      // Map old 'level' field to 'step' for backward compatibility
      const mappedData = (data as Grade[]).map((grade: Grade & { level?: number }) => ({
        ...grade,
        step: grade.step || grade.level || 1,
        currency: grade.currency || 'USD',
      }));
      setGrades(mappedData);
    } catch (error) {
      console.error('Error loading grades:', error);
      toast.error('Failed to load grades');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (grade: Grade | null = null) => {
    if (grade) {
      setEditingGrade(grade);
      reset({
        name: grade.name || '',
        step: grade.step || 1,
        currency: grade.currency || 'USD',
        minSalary: grade.minSalary || 0,
        maxSalary: grade.maxSalary || 0,
        description: grade.description || '',
      });
    } else {
      setEditingGrade(null);
      reset({
        name: '',
        step: 1,
        currency: 'USD',
        minSalary: 0,
        maxSalary: 0,
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGrade(null);
    reset();
  };

  const onSubmit = async (data: GradeFormData) => {
    try {
      // Map step to level for backward compatibility with DB
      const dataToSave = {
        ...data,
        level: data.step, // Keep level for DB compatibility
      };

      if (editingGrade) {
        await gradeDB.update(editingGrade.id!, dataToSave);
        toast.success('Grade updated successfully');
      } else {
        await gradeDB.create(dataToSave);
        toast.success('Grade created successfully');
      }
      handleCloseModal();
      await loadData();
    } catch (error: unknown) {
      console.error('Error saving grade:', error);
      if (error && typeof error === 'object' && 'name' in error && error.name === 'ConstraintError') {
        toast.error('A grade with this name already exists');
      } else {
        toast.error('Failed to save grade');
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.grade) return;

    try {
      await gradeDB.delete(deleteModal.grade.id!);
      setDeleteModal({ show: false, grade: null });
      toast.success('Grade deleted successfully');
      await loadData();
    } catch (error) {
      console.error('Error deleting grade:', error);
      toast.error('Failed to delete grade');
    }
  };

  const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
    const currency = CURRENCIES.find((c) => c.code === currencyCode);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filter grades
  const filteredGrades = grades.filter(
    (grade) =>
      grade.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.step?.toString().includes(searchTerm)
  );

  // Sort grades by step
  const sortedGrades = [...filteredGrades].sort((a, b) => a.step - b.step);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grades</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage employee salary grades and steps
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
            <span>Add Grade</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search grades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Grades Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedGrades.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No grades found</p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium"
            >
              Add your first grade
            </button>
          </div>
        ) : (
          sortedGrades.map((grade) => (
            <div
              key={grade.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Award className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{grade.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Step {grade.step}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Coins className="w-3 h-3" />
                        <span>{grade.currency || 'USD'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenModal(grade)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ show: true, grade })}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Min Salary</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(grade.minSalary, grade.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Max Salary</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(grade.maxSalary, grade.currency)}
                  </span>
                </div>
              </div>

              {grade.description && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {grade.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingGrade ? 'Edit Grade' : 'Add Grade'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Grade Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="e.g., Grade 1"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Step <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register('step')}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 ${
                    errors.step ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="1"
                  min="1"
                />
                {errors.step && <p className="mt-1 text-sm text-red-500">{errors.step.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Currency <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('currency')}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 ${
                    errors.currency ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
                {errors.currency && (
                  <p className="mt-1 text-sm text-red-500">{errors.currency.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minimum Salary <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register('minSalary')}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 ${
                    errors.minSalary ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="30000"
                  min="0"
                  step="1000"
                />
                {errors.minSalary && (
                  <p className="mt-1 text-sm text-red-500">{errors.minSalary.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Maximum Salary <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register('maxSalary')}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 ${
                    errors.maxSalary ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="50000"
                  min="0"
                  step="1000"
                />
                {errors.maxSalary && (
                  <p className="mt-1 text-sm text-red-500">{errors.maxSalary.message}</p>
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
                  placeholder="Brief description of the grade"
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
                  {isSubmitting ? 'Saving...' : editingGrade ? 'Update' : 'Create'}
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Grade</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong>{deleteModal.grade?.name}</strong>? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModal({ show: false, grade: null })}
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

export default Grades;
