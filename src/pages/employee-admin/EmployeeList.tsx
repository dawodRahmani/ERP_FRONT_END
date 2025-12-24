import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Download,
  Filter,
  MoreVertical,
  FileText,
  ClipboardList,
  Building2,
  CreditCard,
  Printer,
  X,
  Calendar,
  Phone,
  Mail,
  History,
  Briefcase
} from 'lucide-react';
import { initEmployeeAdminDB } from '../../services/db/employeeAdminService';
import { employeeDB, departmentDB } from '../../services/db/indexedDB';

// ==================== TYPES ====================

interface Employee {
  id: number;
  employee_code: string;
  full_name: string;
  father_name: string;
  position: string;
  department: string;
  employment_type: string;
  employment_status: string;
  gender: string;
  date_of_hire: string;
  phone_primary: string;
  photo_path: string | null;
  email: string;
  office?: string;
}

interface Department {
  id: number;
  name: string;
}

interface Statistics {
  total: number;
  active: number;
  onboarding: number;
  probation: number;
  onLeave: number;
  separated: number;
}

interface DeleteModal {
  show: boolean;
  employee: Employee | null;
}

interface Toast {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

interface EmploymentType {
  value: string;
  label: string;
}

interface EmploymentStatus {
  value: string;
  label: string;
  color: string;
}

// ==================== CONSTANTS ====================

const EMPLOYMENT_TYPES: EmploymentType[] = [
  { value: 'core', label: 'Core Staff' },
  { value: 'project', label: 'Project Staff' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'part_time', label: 'Part-Time' },
  { value: 'intern', label: 'Intern' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'daily_wage', label: 'Daily Wage' },
  { value: 'temporary', label: 'Temporary' }
];

const EMPLOYMENT_STATUSES: EmploymentStatus[] = [
  { value: 'pre_boarding', label: 'Pre-Boarding', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
  { value: 'onboarding', label: 'Onboarding', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'probation', label: 'Probation', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'suspended', label: 'Suspended', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  { value: 'on_leave', label: 'On Leave', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  { value: 'notice_period', label: 'Notice Period', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400' },
  { value: 'separated', label: 'Separated', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400' },
  { value: 'terminated', label: 'Terminated', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
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

const calculateExpiryDate = (hireDate?: string): string => {
  if (!hireDate) return '-';
  const date = new Date(hireDate);
  date.setFullYear(date.getFullYear() + 1);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// ==================== ID CARD COMPONENT ====================

interface IDCardProps {
  employee: Employee;
  onClose: () => void;
}

const IDCardGenerator: React.FC<IDCardProps> = ({ employee, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(() => {
    const printContent = cardRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Employee ID Card - ${employee.employee_code}</title>
          <style>
            @page { size: 85.6mm 54mm; margin: 0; }
            body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; }
            .id-card { width: 85.6mm; height: 54mm; position: relative; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }, [employee.employee_code]);

  const expiryDate = useMemo(
    () => calculateExpiryDate(employee.date_of_hire),
    [employee.date_of_hire]
  );

  const getStatusColor = (status: string): string => {
    const statusConfig = EMPLOYMENT_STATUSES.find(s => s.value === status);
    if (status === 'active') return 'bg-green-500 text-white';
    if (status === 'on_leave') return 'bg-yellow-500 text-white';
    return statusConfig?.color || 'bg-gray-500 text-white';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Generate Employee ID Card
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* ID Card Preview */}
        <div className="flex justify-center mb-6">
          <div
            ref={cardRef}
            className="id-card w-[340px] h-[214px] bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-2xl overflow-hidden relative"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Card Content */}
            <div className="relative h-full p-4 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">VDO</h3>
                    <p className="text-blue-200 text-[10px]">Employee ID Card</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-mono font-bold text-xs">
                    {employee.employee_code}
                  </p>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex gap-3 flex-1">
                {/* Photo */}
                <div className="w-20 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                  {employee.photo_path ? (
                    <img
                      src={employee.photo_path}
                      alt={employee.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-400">
                        {employee.full_name?.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-white">
                  <h4 className="font-bold text-sm mb-0.5 truncate">
                    {employee.full_name}
                  </h4>
                  <p className="text-blue-200 text-[10px] mb-2 truncate">
                    {employee.position || 'Position'}
                  </p>

                  <div className="space-y-1 text-[9px]">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-blue-300" />
                      <span className="truncate">
                        {employee.department || 'Department'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-blue-300" />
                      <span>{employee.phone_primary || '-'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-blue-300" />
                      <span className="truncate">
                        {employee.email || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-500/30">
                <div className="text-[9px] text-blue-200">
                  <span>Issue: </span>
                  <span className="text-white font-medium">
                    {formatDate(employee.date_of_hire)}
                  </span>
                </div>
                <div className="text-[9px] text-blue-200">
                  <span>Expiry: </span>
                  <span className="text-white font-medium">{expiryDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-300" />
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${getStatusColor(employee.employment_status)}`}>
                    {employee.employment_status?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Information Summary */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            ID Card Information
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Employee ID</p>
              <p className="font-medium text-gray-900 dark:text-white font-mono">
                {employee.employee_code}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Full Name</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {employee.full_name}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Position</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {employee.position || '-'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Department</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {employee.department || '-'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Issue Date</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatDate(employee.date_of_hire)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Expiry Date</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {expiryDate}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Printer className="w-4 h-4" />
            Print ID Card
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter');

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<Statistics>({
    total: 0,
    active: 0,
    onboarding: 0,
    probation: 0,
    onLeave: 0,
    separated: 0
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter === 'probation' ? 'probation' : '');
  const [typeFilter, setTypeFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Reference data
  const [departments, setDepartments] = useState<Department[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [totalItems, setTotalItems] = useState(0);

  // Modals
  const [deleteModal, setDeleteModal] = useState<DeleteModal>({ show: false, employee: null });
  const [actionMenu, setActionMenu] = useState<number | null>(null);
  const [idCardModal, setIdCardModal] = useState<{ show: boolean; employee: Employee | null }>({
    show: false,
    employee: null
  });

  // Toast notification
  const [toast, setToast] = useState<Toast>({ show: false, message: '', type: 'success' });

  const loadEmployees = useCallback(async () => {
    try {
      const allEmployees = await employeeDB.getAll();

      let filtered = allEmployees.map((emp: Record<string, unknown>) => ({
        id: emp.id as number,
        employee_code: (emp.employeeId as string) || `VDO-EMP-${String(emp.id).padStart(4, '0')}`,
        full_name: `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || (emp.name as string) || 'Unknown',
        father_name: (emp.fatherName as string) || '',
        position: (emp.position as string) || 'Not Assigned',
        department: (emp.department as string) || 'Not Assigned',
        employment_type: (emp.employmentType as string) || (emp.employment_type as string) || 'core',
        employment_status: (emp.status as string) || (emp.employment_status as string) || 'active',
        gender: (emp.gender as string) || 'male',
        date_of_hire: (emp.hireDate as string) || (emp.date_of_hire as string) || new Date().toISOString().split('T')[0],
        phone_primary: (emp.phone as string) || (emp.phone_primary as string) || '',
        photo_path: (emp.photoPath as string) || (emp.photo_path as string) || null,
        email: (emp.email as string) || '',
        office: (emp.office as string) || ''
      }));

      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filtered = filtered.filter((e: Employee) =>
          e.full_name.toLowerCase().includes(search) ||
          e.employee_code.toLowerCase().includes(search) ||
          e.position.toLowerCase().includes(search)
        );
      }

      if (statusFilter) {
        filtered = filtered.filter((e: Employee) => e.employment_status === statusFilter);
      }

      if (typeFilter) {
        filtered = filtered.filter((e: Employee) => e.employment_type === typeFilter);
      }

      if (departmentFilter) {
        filtered = filtered.filter((e: Employee) => e.department === departmentFilter);
      }

      if (genderFilter) {
        filtered = filtered.filter((e: Employee) => e.gender === genderFilter);
      }

      setTotalItems(filtered.length);
      setEmployees(filtered);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  }, [searchTerm, statusFilter, typeFilter, departmentFilter, genderFilter]);

  const loadStatistics = useCallback(async () => {
    try {
      const allEmployees = await employeeDB.getAll();
      const stats: Statistics = {
        total: allEmployees.length,
        active: allEmployees.filter((e: Record<string, unknown>) => ((e.status as string) || (e.employment_status as string)) === 'active').length,
        onboarding: allEmployees.filter((e: Record<string, unknown>) => ((e.status as string) || (e.employment_status as string)) === 'onboarding').length,
        probation: allEmployees.filter((e: Record<string, unknown>) => ((e.status as string) || (e.employment_status as string)) === 'probation').length,
        onLeave: allEmployees.filter((e: Record<string, unknown>) => ((e.status as string) || (e.employment_status as string)) === 'on_leave').length,
        separated: allEmployees.filter((e: Record<string, unknown>) => ['separated', 'terminated'].includes((e.status as string) || (e.employment_status as string))).length
      };
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await initEmployeeAdminDB();
      const depts = await departmentDB.getAll();
      setDepartments(depts as Department[]);
      await loadEmployees();
      loadStatistics();
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [loadEmployees, loadStatistics, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEmployees();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadEmployees]);

  const handleDelete = useCallback(async () => {
    if (!deleteModal.employee) return;
    try {
      await employeeDB.delete(deleteModal.employee.id);
      setDeleteModal({ show: false, employee: null });
      showToast('Employee deleted successfully', 'success');
      await loadEmployees();
      await loadStatistics();
    } catch (error) {
      console.error('Error deleting employee:', error);
      showToast('Failed to delete employee', 'error');
    }
  }, [deleteModal.employee, loadEmployees, loadStatistics, showToast]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
    setDepartmentFilter('');
    setGenderFilter('');
  }, []);

  const getStatusBadge = useCallback((status: string) => {
    const statusConfig = EMPLOYMENT_STATUSES.find(s => s.value === status);
    if (!statusConfig) return null;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
        {statusConfig.label}
      </span>
    );
  }, []);

  const getTypeBadge = useCallback((type: string) => {
    const typeConfig = EMPLOYMENT_TYPES.find(t => t.value === type);
    if (!typeConfig) return type;
    return typeConfig.label;
  }, []);

  const handleGenerateIDCard = useCallback((employee: Employee) => {
    setIdCardModal({ show: true, employee });
    setActionMenu(null);
  }, []);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = useMemo(
    () => employees.slice(startIndex, startIndex + itemsPerPage),
    [employees, startIndex, itemsPerPage]
  );

  const hasActiveFilters = searchTerm || statusFilter || typeFilter || departmentFilter || genderFilter;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employees</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage employee master data and generate ID cards
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
          <button
            onClick={() => navigate('/employee-admin/employees/new')}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('')}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('active')}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.active}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('onboarding')}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.onboarding}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Onboarding</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('probation')}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.probation}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Probation</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('on_leave')}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <UserX className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.onLeave}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">On Leave</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('separated')}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <UserPlus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.separated}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Separated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            {EMPLOYMENT_STATUSES.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {EMPLOYMENT_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {/* Toggle More Filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors ${
              showFilters || departmentFilter || genderFilter
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        )}
      </div>

      {/* Employee Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Hire Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Users className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 mb-2">No employees found</p>
                      {hasActiveFilters ? (
                        <button
                          onClick={clearFilters}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                        >
                          Clear filters
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate('/employee-admin/employees/new')}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                        >
                          Add your first employee
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          employee.gender === 'female' ? 'bg-pink-100 dark:bg-pink-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                        }`}>
                          <span className={`text-sm font-medium ${
                            employee.gender === 'female' ? 'text-pink-600 dark:text-pink-400' : 'text-blue-600 dark:text-blue-400'
                          }`}>
                            {employee.full_name?.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {employee.full_name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {employee.employee_code}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {employee.position || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {employee.department || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {getTypeBadge(employee.employment_type)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(employee.employment_status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {employee.date_of_hire ? new Date(employee.date_of_hire).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1 relative">
                        <button
                          onClick={() => handleGenerateIDCard(employee)}
                          className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                          title="Generate ID Card"
                        >
                          <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </button>
                        <button
                          onClick={() => navigate(`/employee-admin/employees/${employee.id}`)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => navigate(`/employee-admin/employees/${employee.id}/edit`)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit Employee Data"
                        >
                          <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => navigate(`/employee-admin/employees/${employee.id}/update-position`)}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Update Position (New Record)"
                        >
                          <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setActionMenu(actionMenu === employee.id ? null : employee.id)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          </button>
                          {actionMenu === employee.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                              <button
                                onClick={() => {
                                  handleGenerateIDCard(employee);
                                }}
                                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                              >
                                <CreditCard className="w-4 h-4" />
                                <span>Generate ID Card</span>
                              </button>
                              <button
                                onClick={() => {
                                  navigate(`/employee-admin/employees/${employee.id}/update-position`);
                                  setActionMenu(null);
                                }}
                                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                <Briefcase className="w-4 h-4" />
                                <span>Update Position</span>
                              </button>
                              <button
                                onClick={() => {
                                  navigate(`/employee-admin/employees/${employee.id}?tab=history`);
                                  setActionMenu(null);
                                }}
                                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <History className="w-4 h-4" />
                                <span>View Position History</span>
                              </button>
                              <button
                                onClick={() => {
                                  navigate(`/employee-admin/employees/${employee.id}/onboarding`);
                                  setActionMenu(null);
                                }}
                                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <ClipboardList className="w-4 h-4" />
                                <span>View Onboarding</span>
                              </button>
                              <button
                                onClick={() => {
                                  navigate(`/employee-admin/employees/${employee.id}/contracts`);
                                  setActionMenu(null);
                                }}
                                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <FileText className="w-4 h-4" />
                                <span>View Contracts</span>
                              </button>
                              <button
                                onClick={() => {
                                  navigate(`/employee-admin/employees/${employee.id}/personnel-file`);
                                  setActionMenu(null);
                                }}
                                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Building2 className="w-4 h-4" />
                                <span>Personnel File</span>
                              </button>
                              <hr className="my-1 border-gray-200 dark:border-gray-700" />
                              <button
                                onClick={() => {
                                  setDeleteModal({ show: true, employee });
                                  setActionMenu(null);
                                }}
                                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} employees
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ID Card Modal */}
      {idCardModal.show && idCardModal.employee && (
        <IDCardGenerator
          employee={idCardModal.employee}
          onClose={() => setIdCardModal({ show: false, employee: null })}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Employee</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong>{deleteModal.employee?.full_name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModal({ show: false, employee: null })}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close action menu */}
      {actionMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setActionMenu(null)} />
      )}
    </div>
  );
};

export default EmployeeList;
