import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Briefcase,
  User,
  CheckCircle,
  AlertCircle,
  History,
  Clock
} from 'lucide-react';
import { employeeDB, employeePositionHistoryDB, departmentDB, positionDB } from '../../services/db/indexedDB';

// ==================== TYPES ====================

interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  full_name?: string;
  position?: string;
  department?: string;
  project?: string;
  employment_type?: string;
  employmentType?: string;
  date_of_hire?: string;
  hireDate?: string;
}

interface PositionHistory {
  id: number;
  employeeId: number;
  position: string;
  department: string;
  project: string;
  employmentType: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  supervisor?: string;
  notes?: string;
  createdAt: string;
}

interface Department {
  id: number;
  name: string;
}

interface Position {
  id: number;
  title: string;
  department?: string;
}

interface FormData {
  position: string;
  department: string;
  project: string;
  employmentType: string;
  startDate: string;
  supervisor: string;
  notes: string;
}

interface Toast {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

// ==================== CONSTANTS ====================

const EMPLOYMENT_TYPES = [
  { value: 'core', label: 'Core Staff' },
  { value: 'project', label: 'Project Staff' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'part_time', label: 'Part-Time' },
  { value: 'intern', label: 'Intern' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'daily_wage', label: 'Daily Wage' },
  { value: 'temporary', label: 'Temporary' }
];

// ==================== HELPER FUNCTIONS ====================

const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// ==================== MAIN COMPONENT ====================

const UpdatePosition: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [positionHistory, setPositionHistory] = useState<PositionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>({ show: false, message: '', type: 'success' });

  // Reference data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  // Form data
  const [formData, setFormData] = useState<FormData>({
    position: '',
    department: '',
    project: '',
    employmentType: 'core',
    startDate: new Date().toISOString().split('T')[0],
    supervisor: '',
    notes: ''
  });

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  const loadData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Load employee data
      const emp = await employeeDB.getById(Number(id));
      if (!emp) {
        showToast('Employee not found', 'error');
        navigate('/employee-admin/employees');
        return;
      }

      // Map employee data
      const mappedEmployee: Employee = {
        id: emp.id,
        employeeId: emp.employeeId || `VDO-EMP-${String(emp.id).padStart(4, '0')}`,
        firstName: emp.firstName || '',
        lastName: emp.lastName || '',
        full_name: emp.full_name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim(),
        position: emp.position,
        department: emp.department,
        project: emp.project,
        employment_type: emp.employmentType || emp.employment_type,
        date_of_hire: emp.hireDate || emp.date_of_hire
      };

      setEmployee(mappedEmployee);

      // Pre-fill form with current employee data
      setFormData(prev => ({
        ...prev,
        position: emp.position || '',
        department: emp.department || '',
        project: emp.project || '',
        employmentType: emp.employmentType || emp.employment_type || 'core'
      }));

      // Load position history
      const history = await employeePositionHistoryDB.getByEmployeeId(Number(id));
      setPositionHistory(history);

      // Load reference data
      const depts = await departmentDB.getAll();
      setDepartments(depts);

      const pos = await positionDB.getAll();
      setPositions(pos);

    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load employee data', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.position || !formData.department || !formData.startDate) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setSaving(true);
    try {
      // Add new position to history (this will also end the current position if exists)
      await employeePositionHistoryDB.addNewPosition(Number(id), {
        position: formData.position,
        department: formData.department,
        project: formData.project,
        employmentType: formData.employmentType,
        startDate: formData.startDate,
        supervisor: formData.supervisor,
        notes: formData.notes
      });

      // Update employee record with new current position
      await employeeDB.update(Number(id), {
        position: formData.position,
        department: formData.department,
        project: formData.project,
        employmentType: formData.employmentType
      });

      showToast('Position updated successfully! New record created.', 'success');

      // Navigate back after a short delay
      setTimeout(() => {
        navigate(`/employee-admin/employees/${id}?tab=history`);
      }, 1500);

    } catch (error) {
      console.error('Error updating position:', error);
      showToast('Failed to update position', 'error');
    } finally {
      setSaving(false);
    }
  };

  const currentPosition = useMemo(() => {
    return positionHistory.find(p => p.isCurrent);
  }, [positionHistory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Employee not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/employee-admin/employees')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Update Position
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create a new position record for {employee.full_name || `${employee.firstName} ${employee.lastName}`}
          </p>
        </div>
      </div>

      {/* Employee Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {employee.full_name || `${employee.firstName} ${employee.lastName}`}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{employee.employeeId}</p>
            {currentPosition ? (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Current: <span className="font-medium">{currentPosition.position}</span> at {currentPosition.department}
                {currentPosition.project && ` (${currentPosition.project})`}
              </p>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Current: <span className="font-medium">{employee.position || 'Not Assigned'}</span>
                {employee.department && ` at ${employee.department}`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-300">Creating a New Position Record</h3>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              This action will create a new position record for this employee while preserving the previous record.
              The employee's position history will be maintained for complete traceability.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span>New Position Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Position</option>
                  {positions.map(pos => (
                    <option key={pos.id} value={pos.title}>{pos.title}</option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>

              {/* Project */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project
                </label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => handleChange('project', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Education Support Project"
                />
              </div>

              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employment Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => handleChange('employmentType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  {EMPLOYMENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Supervisor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Supervisor
                </label>
                <input
                  type="text"
                  value={formData.supervisor}
                  onChange={(e) => handleChange('supervisor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., John Doe (Program Director)"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Any additional notes about this position change..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/employee-admin/employees')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Create New Position Record</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Position History Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <History className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span>Position History</span>
            </h3>

            {positionHistory.length > 0 ? (
              <div className="space-y-4">
                {positionHistory.map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 rounded-lg border ${
                      record.isCurrent
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{record.position}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{record.department}</p>
                        {record.project && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{record.project}</p>
                        )}
                      </div>
                      {record.isCurrent && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>
                        {formatDate(record.startDate)}
                        {record.endDate ? ` - ${formatDate(record.endDate)}` : ' - Present'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No position history yet</p>
                <p className="text-sm mt-1">This will be the first record</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePosition;
