import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { create } from "zustand";
import {
  User,
  Plus,
  Search,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

// ==================== TYPES ====================

type RelationshipType =
  | "father"
  | "husband"
  | "brother"
  | "son"
  | "uncle"
  | "nephew";

type AvailabilityType = "full_time" | "part_time" | "on_call";

type RegistrationStatus =
  | "active"
  | "inactive"
  | "pending_verification"
  | "expired";

interface FemaleEmployee {
  id: number;
  employee_code: string;
  name: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
}

interface Employee {
  id: number;
  name: string;
  employee_code: string;
  position: string;
  department: string;
}

interface MahramRegistration {
  id: number;
  employee: Employee;
  mahram_name: string;
  relationship: RelationshipType;
  national_id_number: string;
  contact_number: string;
  address: string;
  availability: AvailabilityType;
  availability_notes: string | null;
  status: RegistrationStatus;
  employee_declaration_signed: boolean;
  mahram_consent_signed: boolean;
  verified_by: string | null;
  verified_at: string | null;
  effective_from: string | null;
  effective_until: string | null;
}

interface Statistics {
  total: number;
  active: number;
  pending: number;
  expired: number;
}

interface AvailabilityOption {
  label: string;
  color: string;
}

interface StatusOption {
  label: string;
  color: string;
}

// ==================== CONSTANTS ====================

const RELATIONSHIPS: Record<RelationshipType, string> = {
  father: "Father",
  husband: "Husband",
  brother: "Brother",
  son: "Son",
  uncle: "Uncle",
  nephew: "Nephew",
};

const AVAILABILITY_OPTIONS: Record<AvailabilityType, AvailabilityOption> = {
  full_time: {
    label: "Full-Time",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  part_time: {
    label: "Part-Time",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  on_call: {
    label: "On-Call",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
};

const STATUSES: Record<RegistrationStatus, StatusOption> = {
  active: {
    label: "Active",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  inactive: {
    label: "Inactive",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400",
  },
  pending_verification: {
    label: "Pending Verification",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  expired: {
    label: "Expired",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

// ==================== ZOD SCHEMA ====================

const mahramFormSchema = z.object({
  employee_id: z
    .number({ message: "Please select a female employee" })
    .min(1, "Please select a female employee"),
  mahram_name: z
    .string()
    .min(2, "Mahram name must be at least 2 characters")
    .max(100, "Mahram name must be less than 100 characters"),
  relationship: z.enum(
    ["father", "husband", "brother", "son", "uncle", "nephew"],
    { message: "Please select a relationship" }
  ),
  national_id_number: z
    .string()
    .min(5, "National ID must be at least 5 characters")
    .max(20, "National ID must be less than 20 characters"),
  contact_number: z
    .string()
    .min(10, "Contact number must be at least 10 characters")
    .regex(/^\+?[0-9\s-]+$/, "Please enter a valid phone number"),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must be less than 200 characters"),
  availability: z.enum(["full_time", "part_time", "on_call"], {
    message: "Please select availability",
  }),
  availability_notes: z.string().max(500).optional(),
});

type MahramFormData = z.infer<typeof mahramFormSchema>;

// ==================== ZUSTAND STORE ====================

interface MahramStore {
  searchTerm: string;
  statusFilter: string;
  showModal: boolean;
  selectedRegistration: MahramRegistration | null;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setShowModal: (show: boolean) => void;
  setSelectedRegistration: (reg: MahramRegistration | null) => void;
  resetFilters: () => void;
}

const useMahramStore = create<MahramStore>((set) => ({
  searchTerm: "",
  statusFilter: "",
  showModal: false,
  selectedRegistration: null,
  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setShowModal: (show) => set({ showModal: show }),
  setSelectedRegistration: (reg) => set({ selectedRegistration: reg }),
  resetFilters: () => set({ searchTerm: "", statusFilter: "" }),
}));

// ==================== API FUNCTIONS ====================

const fetchRegistrations = async (): Promise<MahramRegistration[]> => {
  // Simulating API call - replace with actual API
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      id: 1,
      employee: {
        id: 2,
        name: "Fatima Nazari",
        employee_code: "VDO-EMP-0002",
        position: "Finance Officer",
        department: "Finance",
      },
      mahram_name: "Ali Nazari",
      relationship: "father",
      national_id_number: "1234-5678-0001",
      contact_number: "+93700111222",
      address: "House 45, Street 5, Karte-e-Char, Kabul",
      availability: "full_time",
      availability_notes: null,
      status: "active",
      employee_declaration_signed: true,
      mahram_consent_signed: true,
      verified_by: "Zahra Mohammadi",
      verified_at: "2024-01-05",
      effective_from: "2024-01-05",
      effective_until: null,
    },
    {
      id: 2,
      employee: {
        id: 6,
        name: "Sara Rezaei",
        employee_code: "VDO-EMP-0006",
        position: "M&E Officer",
        department: "Monitoring & Evaluation",
      },
      mahram_name: "Hassan Rezaei",
      relationship: "husband",
      national_id_number: "1234-5678-0002",
      contact_number: "+93700222333",
      address: "House 12, Street 3, District 4, Kabul",
      availability: "part_time",
      availability_notes: "Available on weekends and after 4pm on weekdays",
      status: "pending_verification",
      employee_declaration_signed: true,
      mahram_consent_signed: true,
      verified_by: null,
      verified_at: null,
      effective_from: null,
      effective_until: null,
    },
    {
      id: 3,
      employee: {
        id: 8,
        name: "Mariam Akbari",
        employee_code: "VDO-EMP-0008",
        position: "Program Officer",
        department: "Programs",
      },
      mahram_name: "Akbar Akbari",
      relationship: "brother",
      national_id_number: "1234-5678-0003",
      contact_number: "+93700333444",
      address: "House 78, Street 9, Karte-e-Mamorin, Kabul",
      availability: "on_call",
      availability_notes: "Student - available for field visits only",
      status: "active",
      employee_declaration_signed: true,
      mahram_consent_signed: true,
      verified_by: "Zahra Mohammadi",
      verified_at: "2023-08-20",
      effective_from: "2021-08-20",
      effective_until: null,
    },
    {
      id: 4,
      employee: {
        id: 4,
        name: "Zahra Mohammadi",
        employee_code: "VDO-EMP-0004",
        position: "HR Assistant",
        department: "HR & Administration",
      },
      mahram_name: "Mohammad Mohammadi",
      relationship: "father",
      national_id_number: "1234-5678-0004",
      contact_number: "+93700444555",
      address: "House 23, Street 7, Kart-e-Se, Kabul",
      availability: "full_time",
      availability_notes: null,
      status: "active",
      employee_declaration_signed: true,
      mahram_consent_signed: true,
      verified_by: "HR Manager",
      verified_at: "2022-02-25",
      effective_from: "2022-02-20",
      effective_until: null,
    },
  ];
};

const fetchFemaleEmployees = async (): Promise<FemaleEmployee[]> => {
  // Simulating API call - replace with actual API
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      id: 2,
      employee_code: "VDO-EMP-0002",
      name: "Fatima Nazari",
      firstName: "Fatima",
      lastName: "Nazari",
      position: "Finance Officer",
      department: "Finance",
    },
    {
      id: 4,
      employee_code: "VDO-EMP-0004",
      name: "Zahra Mohammadi",
      firstName: "Zahra",
      lastName: "Mohammadi",
      position: "HR Assistant",
      department: "HR & Administration",
    },
    {
      id: 6,
      employee_code: "VDO-EMP-0006",
      name: "Sara Rezaei",
      firstName: "Sara",
      lastName: "Rezaei",
      position: "M&E Officer",
      department: "Monitoring & Evaluation",
    },
    {
      id: 8,
      employee_code: "VDO-EMP-0008",
      name: "Mariam Akbari",
      firstName: "Mariam",
      lastName: "Akbari",
      position: "Program Officer",
      department: "Programs",
    },
    {
      id: 10,
      employee_code: "VDO-EMP-0010",
      name: "Laila Ahmadi",
      firstName: "Laila",
      lastName: "Ahmadi",
      position: "Admin Officer",
      department: "Administration",
    },
    {
      id: 12,
      employee_code: "VDO-EMP-0012",
      name: "Parisa Karimi",
      firstName: "Parisa",
      lastName: "Karimi",
      position: "Accountant",
      department: "Finance",
    },
  ];
};

const fetchStatistics = async (): Promise<Statistics> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    total: 45,
    active: 38,
    pending: 5,
    expired: 2,
  };
};

const createRegistration = async (
  data: MahramFormData
): Promise<MahramRegistration> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("Creating registration:", data);
  // Return mock created registration
  return {
    id: Math.floor(Math.random() * 1000),
    employee: {
      id: data.employee_id,
      name: "New Employee",
      employee_code: "VDO-EMP-NEW",
      position: "Position",
      department: "Department",
    },
    mahram_name: data.mahram_name,
    relationship: data.relationship,
    national_id_number: data.national_id_number,
    contact_number: data.contact_number,
    address: data.address,
    availability: data.availability,
    availability_notes: data.availability_notes || null,
    status: "pending_verification",
    employee_declaration_signed: false,
    mahram_consent_signed: false,
    verified_by: null,
    verified_at: null,
    effective_from: null,
    effective_until: null,
  };
};

const verifyRegistration = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("Verifying registration:", id);
};

// ==================== COMPONENT ====================

const MahramRegistration: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Zustand store
  const {
    searchTerm,
    statusFilter,
    showModal,
    setSearchTerm,
    setStatusFilter,
    setShowModal,
  } = useMahramStore();

  // Employee dropdown state
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");

  // React Query
  const {
    data: registrations = [],
    isLoading: registrationsLoading,
    refetch: refetchRegistrations,
  } = useQuery({
    queryKey: ["mahramRegistrations"],
    queryFn: fetchRegistrations,
  });

  const { data: statistics = { total: 0, active: 0, pending: 0, expired: 0 } } =
    useQuery({
      queryKey: ["mahramStatistics"],
      queryFn: fetchStatistics,
    });

  const { data: femaleEmployees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ["femaleEmployees"],
    queryFn: fetchFemaleEmployees,
  });

  // React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MahramFormData>({
    resolver: zodResolver(mahramFormSchema),
    defaultValues: {
      employee_id: undefined,
      mahram_name: "",
      relationship: "husband",
      national_id_number: "",
      contact_number: "",
      address: "",
      availability: "full_time",
      availability_notes: "",
    },
  });

  const selectedEmployeeId = watch("employee_id");

  // Mutations
  const createMutation = useMutation({
    mutationFn: createRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahramRegistrations"] });
      queryClient.invalidateQueries({ queryKey: ["mahramStatistics"] });
      setShowModal(false);
      reset();
      setEmployeeSearchTerm("");
    },
  });

  const verifyMutation = useMutation({
    mutationFn: verifyRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahramRegistrations"] });
      queryClient.invalidateQueries({ queryKey: ["mahramStatistics"] });
    },
  });

  // Filtered data
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesSearch =
        searchTerm === "" ||
        reg.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.mahram_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "" || reg.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [registrations, searchTerm, statusFilter]);

  // Filtered female employees for dropdown
  const filteredFemaleEmployees = useMemo(() => {
    if (!employeeSearchTerm) return femaleEmployees;
    const searchLower = employeeSearchTerm.toLowerCase();
    return femaleEmployees.filter(
      (emp) =>
        emp.firstName.toLowerCase().includes(searchLower) ||
        emp.lastName.toLowerCase().includes(searchLower) ||
        emp.name.toLowerCase().includes(searchLower) ||
        emp.employee_code.toLowerCase().includes(searchLower)
    );
  }, [femaleEmployees, employeeSearchTerm]);

  // Get selected employee details
  const selectedEmployee = useMemo(() => {
    return femaleEmployees.find((emp) => emp.id === selectedEmployeeId);
  }, [femaleEmployees, selectedEmployeeId]);

  // Handlers
  const onSubmit = useCallback(
    (data: MahramFormData) => {
      createMutation.mutate(data);
    },
    [createMutation]
  );

  const handleVerify = useCallback(
    (id: number) => {
      verifyMutation.mutate(id);
    },
    [verifyMutation]
  );

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    reset();
    setEmployeeSearchTerm("");
    setEmployeeDropdownOpen(false);
  }, [reset, setShowModal]);

  const handleSelectEmployee = useCallback(
    (employee: FemaleEmployee) => {
      setValue("employee_id", employee.id);
      setEmployeeSearchTerm("");
      setEmployeeDropdownOpen(false);
    },
    [setValue]
  );

  // Loading state
  if (registrationsLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mahram Registration
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage mahram information for female staff (Afghanistan requirement)
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => refetchRegistrations()}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            <span>New Registration</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {statistics.total}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Registrations
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {statistics.active}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {statistics.pending}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pending Verification
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {statistics.expired}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Expired
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee or mahram name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Status</option>
            {Object.entries(STATUSES).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Registrations List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Mahram
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Relationship
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRegistrations.map((reg) => (
                <tr
                  key={reg.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                        <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
                          {reg.employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {reg.employee.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {reg.employee.employee_code}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900 dark:text-white">
                      {reg.mahram_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {reg.contact_number}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {RELATIONSHIPS[reg.relationship]}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        AVAILABILITY_OPTIONS[reg.availability]?.color || ""
                      }`}
                    >
                      {AVAILABILITY_OPTIONS[reg.availability]?.label ||
                        reg.availability}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        STATUSES[reg.status]?.color || ""
                      }`}
                    >
                      {STATUSES[reg.status]?.label || reg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/employee-admin/employees/${reg.employee.id}`
                          )
                        }
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        title="View Employee"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      {reg.status === "pending_verification" && (
                        <button
                          onClick={() => handleVerify(reg.id)}
                          className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                          title="Verify"
                          disabled={verifyMutation.isPending}
                        >
                          <ShieldCheck className="w-4 h-4 text-green-600" />
                        </button>
                      )}
                      <button
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRegistrations.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No registrations found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              New Mahram Registration
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Female Employee Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Female Employee <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="employee_id"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      {/* Click outside overlay - inside the relative container */}
                      {employeeDropdownOpen && (
                        <div
                          className="fixed inset-0"
                          style={{ zIndex: 5 }}
                          onClick={() => setEmployeeDropdownOpen(false)}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setEmployeeDropdownOpen(!employeeDropdownOpen)
                        }
                        className={`relative w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-left flex items-center justify-between ${
                          errors.employee_id
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        style={{ zIndex: 6 }}
                      >
                        {selectedEmployee ? (
                          <div>
                            <span className="text-gray-900 dark:text-white">
                              {selectedEmployee.firstName}{" "}
                              {selectedEmployee.lastName}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">
                              ({selectedEmployee.employee_code})
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">
                            Select a female employee...
                          </span>
                        )}
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${
                            employeeDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {employeeDropdownOpen && (
                        <div
                          className="absolute mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden"
                          style={{ zIndex: 10 }}
                        >
                          {/* Search input */}
                          <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search by name..."
                                value={employeeSearchTerm}
                                onChange={(e) =>
                                  setEmployeeSearchTerm(e.target.value)
                                }
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                autoFocus
                              />
                            </div>
                          </div>

                          {/* Employee list */}
                          <div className="max-h-48 overflow-y-auto">
                            {employeesLoading ? (
                              <div className="p-4 text-center text-gray-500">
                                Loading...
                              </div>
                            ) : filteredFemaleEmployees.length === 0 ? (
                              <div className="p-4 text-center text-gray-500">
                                No employees found
                              </div>
                            ) : (
                              filteredFemaleEmployees.map((emp) => (
                                <button
                                  key={emp.id}
                                  type="button"
                                  onClick={() => {
                                    handleSelectEmployee(emp);
                                    field.onChange(emp.id);
                                  }}
                                  className={`w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-between ${
                                    field.value === emp.id
                                      ? "bg-blue-50 dark:bg-blue-900/30"
                                      : ""
                                  }`}
                                >
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {emp.firstName} {emp.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {emp.employee_code} - {emp.position}
                                    </p>
                                  </div>
                                  <span className="text-xs text-gray-400">
                                    {emp.department}
                                  </span>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                />
                {errors.employee_id && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.employee_id.message}
                  </p>
                )}
              </div>

              {/* Mahram Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mahram Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="mahram_name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.mahram_name
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Full name of mahram"
                    />
                  )}
                />
                {errors.mahram_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.mahram_name.message}
                  </p>
                )}
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="relationship"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.relationship
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {Object.entries(RELATIONSHIPS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.relationship && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.relationship.message}
                  </p>
                )}
              </div>

              {/* National ID Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  National ID Number <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="national_id_number"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.national_id_number
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Tazkira number"
                    />
                  )}
                />
                {errors.national_id_number && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.national_id_number.message}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="contact_number"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="tel"
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.contact_number
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="+93..."
                    />
                  )}
                />
                {errors.contact_number && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.contact_number.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={2}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.address
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Full address"
                    />
                  )}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Availability <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="availability"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.availability
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {Object.entries(AVAILABILITY_OPTIONS).map(
                        ([value, { label }]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        )
                      )}
                    </select>
                  )}
                />
                {errors.availability && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.availability.message}
                  </p>
                )}
              </div>

              {/* Availability Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Availability Notes
                </label>
                <Controller
                  name="availability_notes"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Any notes about availability..."
                    />
                  )}
                />
                {errors.availability_notes && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.availability_notes.message}
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || createMutation.isPending}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {(isSubmitting || createMutation.isPending) && (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  )}
                  <span>Register</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MahramRegistration;
