/**
 * Recruitment Dropdown Settings Page
 *
 * Centralized management UI for all dropdown values used across recruitment forms.
 * Categories are listed on the left; options for the selected category on the right.
 */

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Check, X, Settings, ChevronRight } from 'lucide-react';
import {
  useDropdownsByCategory,
  useCreateDropdownOption,
  useUpdateDropdownOption,
  useDeleteDropdownOption,
  useSeedRecruitmentDropdowns,
  useRecruitmentDropdownsList,
} from '../../../hooks/recruitment';
import { DROPDOWN_CATEGORIES } from '../../../data/recruitment';
import type { RecruitmentDropdownRecord } from '../../../types/modules/recruitment';

// ========== OPTION MODAL ==========

interface OptionModalProps {
  option: RecruitmentDropdownRecord | null;
  category: string;
  categoryLabel: string;
  nextOrder: number;
  onSave: (data: { value: string; label: string; isActive: boolean; displayOrder: number }) => void;
  onClose: () => void;
  isLoading: boolean;
}

const OptionModal = ({ option, category, categoryLabel, nextOrder, onSave, onClose, isLoading }: OptionModalProps) => {
  const [value, setValue] = useState(option?.value ?? '');
  const [label, setLabel] = useState(option?.label ?? '');
  const [isActive, setIsActive] = useState(option?.isActive ?? true);
  const [displayOrder, setDisplayOrder] = useState(option?.displayOrder ?? nextOrder);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!value.trim()) newErrors.value = 'Value is required';
    if (!label.trim()) newErrors.label = 'Label is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ value: value.trim(), label: label.trim(), isActive, displayOrder });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {option ? 'Edit Option' : 'Add Option'} — {categoryLabel}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Value <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${errors.value ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500`}
              placeholder="Stored value (e.g. kabul)"
            />
            {errors.value && <p className="mt-1 text-sm text-red-500">{errors.value}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${errors.label ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500`}
              placeholder="Display label (e.g. Kabul)"
            />
            {errors.label && <p className="mt-1 text-sm text-red-500">{errors.label}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display Order
              </label>
              <input
                type="number"
                min="1"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : option ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ========== MAIN PAGE ==========

const DropdownSettings = () => {
  const [selectedCategory, setSelectedCategory] = useState(DROPDOWN_CATEGORIES[0].key);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingOption, setEditingOption] = useState<RecruitmentDropdownRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Seed defaults on first load
  const { data: allDropdowns = [] } = useRecruitmentDropdownsList();
  const seedMutation = useSeedRecruitmentDropdowns();

  useEffect(() => {
    if (allDropdowns.length === 0 && !seedMutation.isPending && !seedMutation.isSuccess) {
      seedMutation.mutate();
    }
  }, [allDropdowns.length, seedMutation.isPending, seedMutation.isSuccess]);

  const { data: categoryOptions = [], isLoading } = useDropdownsByCategory(selectedCategory);
  const createMutation = useCreateDropdownOption();
  const updateMutation = useUpdateDropdownOption();
  const deleteMutation = useDeleteDropdownOption();

  const selectedCategoryMeta = DROPDOWN_CATEGORIES.find(c => c.key === selectedCategory);

  const filteredOptions = categoryOptions.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opt.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingOption(null);
    setShowModal(true);
  };

  const handleEdit = (option: RecruitmentDropdownRecord) => {
    setEditingOption(option);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete option:', error);
    }
  };

  const handleSave = async (data: { value: string; label: string; isActive: boolean; displayOrder: number }) => {
    try {
      if (editingOption) {
        await updateMutation.mutateAsync({ id: editingOption.id, data });
      } else {
        await createMutation.mutateAsync({
          ...data,
          category: selectedCategory,
        });
      }
      setShowModal(false);
      setEditingOption(null);
    } catch (error) {
      console.error('Failed to save option:', error);
    }
  };

  const handleToggleActive = async (option: RecruitmentDropdownRecord) => {
    try {
      await updateMutation.mutateAsync({
        id: option.id,
        data: { isActive: !option.isActive },
      });
    } catch (error) {
      console.error('Failed to toggle option status:', error);
    }
  };

  // Count options per category from all dropdowns
  const categoryCounts: Record<string, number> = {};
  for (const d of allDropdowns) {
    categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
  }

  const nextOrder = categoryOptions.length > 0
    ? Math.max(...categoryOptions.map(o => o.displayOrder)) + 1
    : 1;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="h-6 w-6 text-gray-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dropdown Settings</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Manage dropdown values used across all recruitment forms
        </p>
      </div>

      <div className="flex gap-6">
        {/* Left Panel — Categories */}
        <div className="w-72 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Categories
              </h2>
            </div>
            <nav className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[calc(100vh-240px)] overflow-y-auto">
              {DROPDOWN_CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat.key;
                const count = categoryCounts[cat.key] || 0;
                return (
                  <button
                    key={cat.key}
                    onClick={() => {
                      setSelectedCategory(cat.key);
                      setSearchTerm('');
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{cat.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cat.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}>
                        {count}
                      </span>
                      <ChevronRight className={`h-4 w-4 ${isSelected ? 'text-blue-500' : 'text-gray-400'}`} />
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Right Panel — Options Table */}
        <div className="flex-1 min-w-0">
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${selectedCategoryMeta?.label ?? ''} options...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Option
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Label
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredOptions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        {searchTerm ? 'No options match your search' : 'No options configured yet'}
                      </td>
                    </tr>
                  ) : (
                    filteredOptions.map((option) => (
                      <tr key={option.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {option.displayOrder}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm text-gray-900 dark:text-white">
                            {option.value}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleActive(option)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                              option.isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-200'
                            }`}
                          >
                            {option.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {deleteConfirmId === option.id ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleDelete(option.id)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400"
                                title="Confirm delete"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-gray-600 hover:text-gray-800 dark:text-gray-400"
                                title="Cancel"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(option)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(option.id)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedCategoryMeta && (
        <OptionModal
          option={editingOption}
          category={selectedCategory}
          categoryLabel={selectedCategoryMeta.label}
          nextOrder={nextOrder}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingOption(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};

export default DropdownSettings;
