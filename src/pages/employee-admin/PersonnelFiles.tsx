import {
  useState,
  useRef,
  type ChangeEvent,
  useEffect,
  useCallback,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Folder,
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Search,
  CheckCircle,
  RefreshCw,
  FolderOpen,
  File,
  User,
  Briefcase,
  CreditCard,
  Award,
  Calendar,
  Shield,
  LogOut,
  AlertTriangle,
  ChevronDown,
  X,
  type LucideIcon,
} from "lucide-react";

// Types
interface FileSection {
  label: string;
  icon: LucideIcon;
  color: string;
}

interface FileSections {
  [key: string]: FileSection;
}

interface Employee {
  id: number;
  employee_code: string;
  full_name: string;
  position: string;
  department: string;
  personnel_file_number: string;
  file_status: string;
  last_audit_date: string;
}

interface Document {
  id: number;
  employee_id: number;
  section: string;
  document_type: string;
  document_name: string;
  document_date: string;
  file_size: number;
  is_verified: boolean;
  is_confidential: boolean;
  uploaded_by: string;
  created_at: string;
}

interface UploadForm {
  employee_id: number | null;
  section: string;
  document_type: string;
  document_name: string;
  document_date: string;
  is_confidential: boolean;
  file: File | null;
}

interface SectionStats {
  [key: string]: number;
}

const FILE_SECTIONS: FileSections = {
  recruitment: {
    label: "Recruitment & Selection",
    icon: User,
    color: "bg-blue-500",
  },
  employment: {
    label: "Employment Documentation",
    icon: Briefcase,
    color: "bg-green-500",
  },
  identity: {
    label: "Identity & Legal Documents",
    icon: Shield,
    color: "bg-purple-500",
  },
  payroll: {
    label: "Payroll & Benefits",
    icon: CreditCard,
    color: "bg-yellow-500",
  },
  performance: {
    label: "Performance & Development",
    icon: Award,
    color: "bg-indigo-500",
  },
  leave: { label: "Leave & Attendance", icon: Calendar, color: "bg-pink-500" },
  disciplinary: {
    label: "Disciplinary & Grievances",
    icon: AlertTriangle,
    color: "bg-red-500",
  },
  separation: {
    label: "Separation & Exit",
    icon: LogOut,
    color: "bg-gray-500",
  },
};

// Mock employees data - in real app this would come from API
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 1,
    employee_code: "VDO-EMP-0001",
    full_name: "Ahmad Shah Ahmadi",
    position: "Program Manager",
    department: "Programs",
    personnel_file_number: "PF-2020-001",
    file_status: "active",
    last_audit_date: "2024-01-10",
  },
  {
    id: 2,
    employee_code: "VDO-EMP-0002",
    full_name: "Fatima Nazari",
    position: "Finance Officer",
    department: "Finance",
    personnel_file_number: "PF-2020-002",
    file_status: "active",
    last_audit_date: "2024-01-12",
  },
  {
    id: 3,
    employee_code: "VDO-EMP-0003",
    full_name: "Mohammad Karimi",
    position: "HR Coordinator",
    department: "Human Resources",
    personnel_file_number: "PF-2021-003",
    file_status: "active",
    last_audit_date: "2024-01-15",
  },
  {
    id: 4,
    employee_code: "VDO-EMP-0004",
    full_name: "Zahra Hosseini",
    position: "Project Coordinator",
    department: "Programs",
    personnel_file_number: "PF-2021-004",
    file_status: "active",
    last_audit_date: "2024-01-08",
  },
  {
    id: 5,
    employee_code: "VDO-EMP-0005",
    full_name: "Abdul Rahman Safi",
    position: "IT Administrator",
    department: "IT",
    personnel_file_number: "PF-2022-005",
    file_status: "active",
    last_audit_date: "2024-01-20",
  },
];

const PersonnelFiles: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [employees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeSection, setActiveSection] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [employeeDropdownOpen, setEmployeeDropdownOpen] =
    useState<boolean>(false);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState<string>("");
  const [uploadForm, setUploadForm] = useState<UploadForm>({
    employee_id: null,
    section: "employment",
    document_type: "",
    document_name: "",
    document_date: "",
    is_confidential: false,
    file: null,
  });

  const loadData = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      // If we have an ID from URL, select that employee
      if (id) {
        const employee = MOCK_EMPLOYEES.find((e) => e.id === parseInt(id));
        if (employee) {
          setSelectedEmployee(employee);
          loadEmployeeDocuments(employee.id);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadEmployeeDocuments = (employeeId: number): void => {
    // Mock documents - in real app this would be an API call
    const mockDocuments: Document[] = [
      {
        id: 1,
        employee_id: 1,
        section: "recruitment",
        document_type: "cv",
        document_name: "CV - Ahmad Shah Ahmadi.pdf",
        document_date: "2020-03-01",
        file_size: 245000,
        is_verified: true,
        is_confidential: false,
        uploaded_by: "HR Admin",
        created_at: "2020-03-10",
      },
      {
        id: 2,
        employee_id: 1,
        section: "recruitment",
        document_type: "interview_form",
        document_name: "Interview Assessment.pdf",
        document_date: "2020-03-05",
        file_size: 125000,
        is_verified: true,
        is_confidential: false,
        uploaded_by: "HR Admin",
        created_at: "2020-03-10",
      },
      {
        id: 3,
        employee_id: 1,
        section: "employment",
        document_type: "contract",
        document_name: "Employment Contract.pdf",
        document_date: "2020-03-15",
        file_size: 350000,
        is_verified: true,
        is_confidential: false,
        uploaded_by: "HR Manager",
        created_at: "2020-03-15",
      },
      {
        id: 4,
        employee_id: 1,
        section: "employment",
        document_type: "offer_letter",
        document_name: "Offer Letter.pdf",
        document_date: "2020-03-10",
        file_size: 180000,
        is_verified: true,
        is_confidential: false,
        uploaded_by: "HR Manager",
        created_at: "2020-03-10",
      },
      {
        id: 5,
        employee_id: 1,
        section: "identity",
        document_type: "tazkira",
        document_name: "Tazkira Copy.pdf",
        document_date: "2020-03-15",
        file_size: 520000,
        is_verified: true,
        is_confidential: false,
        uploaded_by: "HR Admin",
        created_at: "2020-03-15",
      },
      {
        id: 6,
        employee_id: 1,
        section: "identity",
        document_type: "education",
        document_name: "MBA Certificate.pdf",
        document_date: "2015-06-15",
        file_size: 680000,
        is_verified: true,
        is_confidential: false,
        uploaded_by: "HR Admin",
        created_at: "2020-03-15",
      },
      {
        id: 7,
        employee_id: 1,
        section: "payroll",
        document_type: "bank_details",
        document_name: "Bank Account Form.pdf",
        document_date: "2020-03-15",
        file_size: 95000,
        is_verified: true,
        is_confidential: true,
        uploaded_by: "Finance",
        created_at: "2020-03-16",
      },
      {
        id: 8,
        employee_id: 1,
        section: "performance",
        document_type: "appraisal",
        document_name: "Annual Appraisal 2023.pdf",
        document_date: "2024-01-05",
        file_size: 420000,
        is_verified: false,
        is_confidential: true,
        uploaded_by: "HR Manager",
        created_at: "2024-01-10",
      },
      {
        id: 9,
        employee_id: 1,
        section: "employment",
        document_type: "nda",
        document_name: "Signed NDA.pdf",
        document_date: "2020-03-15",
        file_size: 150000,
        is_verified: true,
        is_confidential: false,
        uploaded_by: "HR Admin",
        created_at: "2020-03-15",
      },
      {
        id: 10,
        employee_id: 1,
        section: "employment",
        document_type: "code_of_conduct",
        document_name: "Code of Conduct Acknowledgement.pdf",
        document_date: "2024-01-15",
        file_size: 85000,
        is_verified: true,
        is_confidential: false,
        uploaded_by: "HR Admin",
        created_at: "2024-01-15",
      },
      {
        id: 11,
        employee_id: 2,
        section: "recruitment",
        document_type: "cv",
        document_name: "CV - Fatima Nazari.pdf",
        document_date: "2020-04-01",
        file_size: 215000,
        is_verified: true,
        is_confidential: false,
        uploaded_by: "HR Admin",
        created_at: "2020-04-05",
      },
      {
        id: 12,
        employee_id: 2,
        section: "employment",
        document_type: "contract",
        document_name: "Employment Contract - Fatima.pdf",
        document_date: "2020-04-15",
        file_size: 340000,
        is_verified: true,
        is_confidential: false,
        uploaded_by: "HR Manager",
        created_at: "2020-04-15",
      },
    ];

    const filteredDocs = mockDocuments.filter(
      (doc) => doc.employee_id === employeeId
    );
    setDocuments(filteredDocs);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (date: string | null): string =>
    date ? new Date(date).toLocaleDateString() : "-";

  const handleEmployeeSelect = (employee: Employee): void => {
    setSelectedEmployee(employee);
    loadEmployeeDocuments(employee.id);
    navigate(`/employee-admin/personnel-files/${employee.id}`);
  };

  const handleUploadEmployeeSelect = (employee: Employee): void => {
    setUploadForm((f) => ({ ...f, employee_id: employee.id }));
    setEmployeeDropdownOpen(false);
    setEmployeeSearchTerm("");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    setUploadForm((f) => ({ ...f, file }));
    if (file && !uploadForm.document_name) {
      setUploadForm((f) => ({ ...f, document_name: file.name }));
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!uploadForm.employee_id) {
      alert("Please select an employee");
      return;
    }
    if (!uploadForm.file) {
      alert("Please select a file to upload");
      return;
    }
    if (!uploadForm.document_name) {
      alert("Please enter a document name");
      return;
    }

    console.log("Uploading:", uploadForm);

    // Add the new document to the list (mock)
    const newDoc: Document = {
      id: documents.length + 100,
      employee_id: uploadForm.employee_id,
      section: uploadForm.section,
      document_type: uploadForm.document_type,
      document_name: uploadForm.document_name,
      document_date:
        uploadForm.document_date || new Date().toISOString().split("T")[0],
      file_size: uploadForm.file.size,
      is_verified: false,
      is_confidential: uploadForm.is_confidential,
      uploaded_by: "Current User",
      created_at: new Date().toISOString(),
    };

    // If the uploaded document is for the currently selected employee, add it to the list
    if (selectedEmployee && uploadForm.employee_id === selectedEmployee.id) {
      setDocuments((prev) => [...prev, newDoc]);
    }

    setShowUploadModal(false);
    setUploadForm({
      employee_id: null,
      section: "employment",
      document_type: "",
      document_name: "",
      document_date: "",
      is_confidential: false,
      file: null,
    });
  };

  const getSectionStats = (): SectionStats => {
    const stats: SectionStats = {};
    Object.keys(FILE_SECTIONS).forEach((key) => {
      stats[key] = documents.filter((d) => d.section === key).length;
    });
    return stats;
  };

  const sectionStats = getSectionStats();

  const filteredDocuments = documents.filter((doc) => {
    const matchesSection =
      activeSection === "all" || doc.section === activeSection;
    const matchesSearch =
      searchTerm === "" ||
      doc.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document_type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSection && matchesSearch;
  });

  const filteredEmployeesForDropdown = employees.filter(
    (emp) =>
      employeeSearchTerm === "" ||
      emp.full_name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      emp.employee_code.toLowerCase().includes(employeeSearchTerm.toLowerCase())
  );

  const getSelectedUploadEmployee = (): Employee | undefined => {
    return employees.find((e) => e.id === uploadForm.employee_id);
  };

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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {selectedEmployee && (
            <button
              onClick={() => {
                setSelectedEmployee(null);
                setDocuments([]);
                navigate("/employee-admin/personnel-files");
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Personnel Files
            </h1>
            {selectedEmployee && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {selectedEmployee.full_name} ({selectedEmployee.employee_code})
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {selectedEmployee && (
            <button
              onClick={() => loadEmployeeDocuments(selectedEmployee.id)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Employee Selection Card (when no employee selected) */}
      {!selectedEmployee && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Select Employee
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Choose an employee to view their personnel file and documents.
          </p>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees
              .filter(
                (emp) =>
                  searchTerm === "" ||
                  emp.full_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  emp.employee_code
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => handleEmployeeSelect(emp)}
                  className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                    <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {emp.full_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {emp.employee_code}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {emp.position}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* File Summary (when employee selected) */}
      {selectedEmployee && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                  <Folder className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    File #{selectedEmployee.personnel_file_number}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedEmployee.position} | {selectedEmployee.department}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {documents.length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Documents
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {documents.filter((d) => d.is_verified).length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Verified
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last Audit
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(selectedEmployee.last_audit_date)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Section Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Sections
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveSection("all")}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      activeSection === "all"
                        ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <FolderOpen className="w-4 h-4" />
                      <span>All Documents</span>
                    </span>
                    <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                      {documents.length}
                    </span>
                  </button>
                  {Object.entries(FILE_SECTIONS).map(
                    ([key, { label, icon: Icon }]) => (
                      <button
                        key={key}
                        onClick={() => setActiveSection(key)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                          activeSection === key
                            ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{label}</span>
                        </span>
                        <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                          {sectionStats[key]}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Documents List */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                {/* Search */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Documents */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDocuments.length === 0 ? (
                    <div className="p-12 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No documents found
                      </p>
                    </div>
                  ) : (
                    filteredDocuments.map((doc) => {
                      const sectionConfig = FILE_SECTIONS[doc.section];
                      return (
                        <div
                          key={doc.id}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div
                                className={`p-2 rounded-lg ${
                                  sectionConfig?.color || "bg-gray-500"
                                }`}
                              >
                                <File className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {doc.document_name}
                                  </p>
                                  {doc.is_verified && (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  )}
                                  {doc.is_confidential && (
                                    <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded">
                                      Confidential
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {sectionConfig?.label} |{" "}
                                  {formatDate(doc.document_date)} |{" "}
                                  {formatFileSize(doc.file_size)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                title="View"
                              >
                                <Eye className="w-4 h-4 text-gray-500" />
                              </button>
                              <button
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                title="Download"
                              >
                                <Download className="w-4 h-4 text-gray-500" />
                              </button>
                              <button
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upload Document
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              {/* Employee Selection Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employee <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setEmployeeDropdownOpen(!employeeDropdownOpen)
                    }
                    className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-left"
                  >
                    {uploadForm.employee_id ? (
                      <span>
                        {getSelectedUploadEmployee()?.full_name} (
                        {getSelectedUploadEmployee()?.employee_code})
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        Select an employee...
                      </span>
                    )}
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        employeeDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {employeeDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
                      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                        <input
                          type="text"
                          placeholder="Search employees..."
                          value={employeeSearchTerm}
                          onChange={(e) =>
                            setEmployeeSearchTerm(e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredEmployeesForDropdown.map((emp) => (
                          <button
                            key={emp.id}
                            type="button"
                            onClick={() => handleUploadEmployeeSelect(emp)}
                            className={`w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left ${
                              uploadForm.employee_id === emp.id
                                ? "bg-primary-50 dark:bg-primary-900/20"
                                : ""
                            }`}
                          >
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white text-sm">
                                {emp.full_name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {emp.employee_code} - {emp.position}
                              </p>
                            </div>
                          </button>
                        ))}
                        {filteredEmployeesForDropdown.length === 0 && (
                          <p className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                            No employees found
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Section
                </label>
                <select
                  value={uploadForm.section}
                  onChange={(e) =>
                    setUploadForm((f) => ({ ...f, section: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {Object.entries(FILE_SECTIONS).map(([value, { label }]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Document Type
                </label>
                <input
                  type="text"
                  value={uploadForm.document_type}
                  onChange={(e) =>
                    setUploadForm((f) => ({
                      ...f,
                      document_type: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., contract, cv, certificate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Document Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={uploadForm.document_name}
                  onChange={(e) =>
                    setUploadForm((f) => ({
                      ...f,
                      document_name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter document name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Document Date
                </label>
                <input
                  type="date"
                  value={uploadForm.document_date}
                  onChange={(e) =>
                    setUploadForm((f) => ({
                      ...f,
                      document_date: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="confidential"
                  checked={uploadForm.is_confidential}
                  onChange={(e) =>
                    setUploadForm((f) => ({
                      ...f,
                      is_confidential: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-primary-600"
                />
                <label
                  htmlFor="confidential"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Mark as confidential
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  File <span className="text-red-500">*</span>
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadForm.file ? (
                    <div className="flex items-center justify-center space-x-2">
                      <File className="w-8 h-8 text-primary-500" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {uploadForm.file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(uploadForm.file.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadForm((f) => ({ ...f, file: null }));
                        }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        PDF, DOC, DOCX, JPG, PNG up to 10MB
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={
                  !uploadForm.employee_id ||
                  !uploadForm.file ||
                  !uploadForm.document_name
                }
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonnelFiles;
