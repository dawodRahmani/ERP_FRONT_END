import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Users,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  CreditCard,
  Download,
  Printer,
  X,
  Calendar,
  Building2,
  Phone,
  Mail,
  RefreshCw,
} from "lucide-react";
import Modal from "../../components/Modal";
import { hrService } from "../../services/api";

// ==================== TYPES ====================

interface Employee {
  id: number;
  employee_number: string;
  first_name: string;
  last_name: string;
  full_name: string;
  father_name?: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  nationality?: string;
  national_id_type?: string;
  national_id_number?: string;
  blood_group?: string;
  primary_email?: string;
  primary_phone?: string;
  current_address?: string;
  current_province?: string;
  hire_date?: string;
  employment_type?: string;
  status: string;
  age?: number;
  photo_url?: string;
  department?: { id: number; name: string };
  position?: { id: number; title: string };
  office?: { id: number; name: string };
  grade?: { id: number; name: string; code?: string };
  current_salary?: {
    basic_salary: number;
    total_salary: number;
    currency: string;
  };
}

interface Office {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
}

interface Position {
  id: number;
  title: string;
}

interface Grade {
  id: number;
  name: string;
  code?: string;
}

interface Pagination {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

interface Filters {
  search: string;
  status: string;
  department_id: string;
  office_id: string;
  employment_type: string;
}

interface Statistics {
  total_employees: number;
  active_employees: number;
  on_leave: number;
  new_hires_this_month: number;
}

interface FormData {
  title: string;
  first_name: string;
  last_name: string;
  father_name: string;
  grandfather_name: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  nationality: string;
  national_id_type: string;
  national_id_number: string;
  blood_group: string;
  primary_email: string;
  personal_email: string;
  primary_phone: string;
  alternate_phone: string;
  current_address: string;
  current_province: string;
  current_district: string;
  permanent_address: string;
  permanent_province: string;
  permanent_district: string;
  hire_date: string;
  employment_type: string;
  office_id: string;
  department_id: string;
  position_id: string;
  grade_id: string;
  line_manager_id: string;
  has_probation: boolean;
  probation_end_date: string;
  bank_name: string;
  bank_account_holder_name: string;
  bank_account_number: string;
  tax_identification_number: string;
  basic_salary: string;
  housing_allowance: string;
  transportation_allowance: string;
  communication_allowance: string;
  other_allowance: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
  notes: string;
  status?: string;
}

interface FormErrors {
  [key: string]: string[] | string | undefined;
  general?: string;
}

// ==================== CONSTANTS ====================

const INITIAL_FORM_DATA: FormData = {
  title: "",
  first_name: "",
  last_name: "",
  father_name: "",
  grandfather_name: "",
  date_of_birth: "",
  gender: "",
  marital_status: "",
  nationality: "Afghan",
  national_id_type: "tazkira",
  national_id_number: "",
  blood_group: "",
  primary_email: "",
  personal_email: "",
  primary_phone: "",
  alternate_phone: "",
  current_address: "",
  current_province: "",
  current_district: "",
  permanent_address: "",
  permanent_province: "",
  permanent_district: "",
  hire_date: "",
  employment_type: "full_time",
  office_id: "",
  department_id: "",
  position_id: "",
  grade_id: "",
  line_manager_id: "",
  has_probation: true,
  probation_end_date: "",
  bank_name: "",
  bank_account_holder_name: "",
  bank_account_number: "",
  tax_identification_number: "",
  basic_salary: "",
  housing_allowance: "",
  transportation_allowance: "",
  communication_allowance: "",
  other_allowance: "",
  emergency_contact_name: "",
  emergency_contact_relationship: "",
  emergency_contact_phone: "",
  notes: "",
};

// Afghanistan provinces and their districts
const PROVINCES_DISTRICTS: Record<string, string[]> = {
  Kabul: ["Kabul City", "Paghman", "Char Asiab", "Bagrami", "Khak-e-Jabar", "Deh Sabz", "Guldara", "Istalif", "Kalakan", "Mir Bacha Kot", "Musahi", "Qarabagh", "Shakardara", "Surobi", "Farza"],
  Balkh: ["Mazar-i-Sharif", "Balkh", "Char Bolak", "Char Kent", "Chimtal", "Dawlat Abad", "Dehdadi", "Kaldar", "Khulm", "Kishindeh", "Marmul", "Nahri Shahi", "Sholgara", "Shortepa", "Zari"],
  Herat: ["Herat City", "Adraskan", "Chishti Sharif", "Enjil", "Farsi", "Ghoryan", "Gulran", "Guzara", "Karukh", "Kohsan", "Kushk", "Kushk-i-Kuhna", "Obe", "Pashtun Zarghun", "Shindand", "Zinda Jan"],
  Kandahar: ["Kandahar City", "Arghandab", "Arghistan", "Daman", "Dand", "Ghorak", "Khakrez", "Maruf", "Maywand", "Nesh", "Panjwai", "Reg", "Shah Wali Kot", "Shorabak", "Spin Boldak", "Zhari"],
  Nangarhar: ["Jalalabad", "Achin", "Bati Kot", "Behsud", "Chaparhar", "Dara-i-Nur", "Deh Bala", "Dur Baba", "Goshta", "Hesarak", "Kama", "Khogyani", "Kot", "Kuz Kunar", "Lal Pur", "Mohmand Dara", "Muhmand Dara", "Nazyan", "Pachir Wa Agam", "Rodat", "Shinwar", "Surkh Rod"],
  Parwan: ["Charikar", "Bagram", "Ghorband", "Jabul Saraj", "Koh-i-Safi", "Salang", "Sayed Khel", "Sheikh Ali", "Shinwari", "Surkhi Parsa"],
  Baghlan: ["Pul-e-Khumri", "Andarab", "Baghlan-i-Jadid", "Burka", "Dahana-i-Ghori", "Doshi", "Fereng and Gharu", "Guzargah-i-Nur", "Khinjan", "Khost Wa Fereng", "Nahrin", "Pul-i-Hisar", "Tala Wa Barfak"],
  Kunduz: ["Kunduz City", "Aliabad", "Archi", "Chahar Dara", "Dasht-i-Archi", "Imam Sahib", "Khanabad", "Qala-i-Zal"],
  Takhar: ["Taloqan", "Baharak", "Bangi", "Cha Ab", "Chal", "Darqad", "Dasht-i-Qala", "Farkhar", "Hazar Sumuch", "Ishkamish", "Kalafgan", "Khwaja Bahauddin", "Khwaja Ghar", "Namak Ab", "Rostaq", "Warsaj", "Yangi Qala"],
  Badakhshan: ["Fayzabad", "Argo", "Arghanj Khwa", "Baharak", "Darayim", "Darwaz", "Darwaz-i-Bala", "Ishkashim", "Jurm", "Khash", "Khwahan", "Kof Ab", "Kohistan", "Kuf Ab", "Maimay", "Raghistan", "Shahr-i-Buzurg", "Shighnan", "Shiki", "Tagab", "Tishkan", "Wakhan", "Warduj", "Yaftal-i-Sufla", "Yamgan", "Zebak"],
  Ghazni: ["Ghazni City", "Ab Band", "Ajristan", "Andar", "Deh Yak", "Gelan", "Giro", "Jagatu", "Jaghori", "Khwaja Omari", "Malistan", "Muqur", "Nawa", "Nawur", "Qarabagh", "Rashidan", "Waghaz", "Zanakhan"],
  Paktia: ["Gardez", "Ahmad Abad", "Chamkani", "Dand Patan", "Jaji", "Jaji Aryub", "Jani Khel", "Lija Ahmad Khel", "Mirzaka", "Sayed Karam", "Shwak", "Wuza Zadran", "Zurmat"],
  Paktika: ["Sharana", "Barmal", "Dila", "Gayan", "Giyan", "Gomal", "Jani Khel", "Mata Khan", "Neka", "Omna", "Sar Hawza", "Sarhawza", "Sharan", "Terwa", "Urgun", "Waza Khwa", "Wor Mamay", "Yosuf Khel", "Zarghun Shahr", "Ziruk"],
  Logar: ["Pul-i-Alam", "Azra", "Baraki Barak", "Charkh", "Kharwar", "Khoshi", "Mohammad Agha"],
  Wardak: ["Maidan Shahr", "Chak", "Daymirdad", "Hesa-i-Awal-i-Behsud", "Jaghatu", "Jalrez", "Markaz-i-Behsud", "Nirkh", "Sayed Abad"],
  Kapisa: ["Mahmud-i-Raqi", "Alasay", "Hesa-i-Awal-i-Kohistan", "Hesa-i-Duwum-i-Kohistan", "Kohband", "Nijrab", "Tagab"],
  Laghman: ["Mehtarlam", "Alingar", "Alishang", "Dawlat Shah", "Qarghayi"],
  Kunar: ["Asadabad", "Bar Kunar", "Chapa Dara", "Chawkay", "Dangam", "Ghaziabad", "Khas Kunar", "Marawara", "Narang", "Nari", "Nurgal", "Pech", "Sawkai", "Shigal Wa Sheltan", "Sirkani", "Wata Pur"],
  Nuristan: ["Parun", "Barg-i-Matal", "Do Ab", "Kamdesh", "Mandol", "Nurgaram", "Wama", "Waygal"],
  Bamyan: ["Bamyan City", "Kahmard", "Panjab", "Sayghan", "Shibar", "Waras", "Yakawlang"],
  Daykundi: ["Nili", "Ashtarlay", "Gizab", "Isar-i-Miramor", "Kajran", "Khadir", "Kiti", "Miramor", "Sang-i-Takht", "Shahristan"],
  Ghor: ["Firoz Koh", "Chaghcharan", "Charsada", "Dawlat Yar", "Du Layna", "Lal Wa Sarjangal", "Pasaband", "Saghar", "Shahrak", "Taywarah", "Tolak"],
  Farah: ["Farah City", "Anar Dara", "Bakwa", "Bala Buluk", "Gulistan", "Khak-i-Safed", "Lash-i-Juwayn", "Purchaman", "Pusht-i-Rod", "Qala-i-Kah", "Shib Koh"],
  Nimroz: ["Zaranj", "Chahar Burjak", "Chakhansur", "Kang", "Khash Rod"],
  Helmand: ["Lashkar Gah", "Baghran", "Dishu", "Garmser", "Gereshk", "Kajaki", "Lashkargah", "Musa Qala", "Nad Ali", "Nahr-i-Saraj", "Nawa-i-Barakzayi", "Nawzad", "Reg-i-Khan Neshin", "Sangin", "Washer"],
  Zabul: ["Qalat", "Arghandab", "Atghar", "Daychopan", "Kakar", "Mizan", "Naw Bahar", "Shahjoy", "Shamulzayi", "Shinkay", "Tarnak Wa Jaldak"],
  Uruzgan: ["Tarin Kowt", "Chora", "Dehrawud", "Gizab", "Khas Uruzgan", "Shahid-i-Hassas"],
  Faryab: ["Maymana", "Almar", "Andkhoy", "Bilchiragh", "Dawlat Abad", "Gurziwan", "Khan-i-Char Bagh", "Kohistan", "Pashtun Kot", "Qaramqol", "Qaysar", "Qurghan", "Shirin Tagab"],
  Jawzjan: ["Sheberghan", "Aqcha", "Darzab", "Fayzabad", "Khamyab", "Khanaqa", "Khwaja Du Koh", "Mardyan", "Mingajik", "Qarqin", "Qush Tepa"],
  Samangan: ["Aybak", "Dara-i-Suf-i-Bala", "Dara-i-Suf-i-Payin", "Feroz Nakhchir", "Hazrat-i-Sultan", "Khuram Wa Sarbagh", "Ruyi Du Ab"],
  Sar_e_Pol: ["Sar-i-Pul", "Balkhab", "Gosfandi", "Kohestanat", "Sangcharak", "Sayad", "Sozma Qala"],
  Badghis: ["Qala-i-Naw", "Ab Kamari", "Ghormach", "Jawand", "Muqur", "Qadis"],
  Khost: ["Khost City", "Alisher", "Bak", "Gurbuz", "Jaji Maidan", "Mando Zayi", "Matun", "Musa Khel", "Nadir Shah Kot", "Qalandar", "Sabari", "Shamal", "Spera", "Tani", "Terezayi"],
  Panjshir: ["Bazarak", "Anaba", "Dara", "Hesa-i-Awal", "Paryan", "Rukha", "Shutul"]
};

const STEP_LABELS = [
  "Personal Info",
  "Contact Info",
  "Address",
  "Employment",
];

interface StepValidation {
  step: number;
  validate: (data: FormData) => { valid: boolean; errors: FormErrors };
}

const STATUS_CLASSES: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  on_leave:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  terminated: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  resigned: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

// ==================== HELPER FUNCTIONS ====================

const formatDate = (dateString?: string): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const calculateExpiryDate = (hireDate?: string): string => {
  if (!hireDate) return "-";
  const date = new Date(hireDate);
  date.setFullYear(date.getFullYear() + 1);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const extractData = <T,>(res: T | { data: T }): T => {
  if (Array.isArray(res)) return res as T;
  if (res && typeof res === "object" && "data" in res && Array.isArray(res.data))
    return res.data as T;
  return [] as T;
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

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Employee ID Card - ${employee.employee_number}</title>
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
  }, [employee.employee_number]);

  const expiryDate = useMemo(
    () => calculateExpiryDate(employee.hire_date),
    [employee.hire_date]
  );

  return (
    <div className="space-y-6">
      {/* ID Card Preview */}
      <div className="flex justify-center">
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
                  {employee.employee_number}
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex gap-3 flex-1">
              {/* Photo */}
              <div className="w-20 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                {employee.photo_url ? (
                  <img
                    src={employee.photo_url}
                    alt={employee.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">
                      {employee.first_name?.[0]}
                      {employee.last_name?.[0]}
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
                  {employee.position?.title || "Position"}
                </p>

                <div className="space-y-1 text-[9px]">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-blue-300" />
                    <span className="truncate">
                      {employee.department?.name || "Department"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-blue-300" />
                    <span>{employee.primary_phone || "-"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-blue-300" />
                    <span className="truncate">
                      {employee.primary_email || "-"}
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
                  {formatDate(employee.hire_date)}
                </span>
              </div>
              <div className="text-[9px] text-blue-200">
                <span>Expiry: </span>
                <span className="text-white font-medium">{expiryDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-300" />
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded ${
                    employee.status === "active"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {employee.status?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Information Summary */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          ID Card Information
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Employee ID</p>
            <p className="font-medium text-gray-900 dark:text-white font-mono">
              {employee.employee_number}
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
              {employee.position?.title || "-"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Department</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {employee.department?.name || "-"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Office</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {employee.office?.name || "-"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Status</p>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                STATUS_CLASSES[employee.status] || STATUS_CLASSES.active
              }`}
            >
              {employee.status?.replace("_", " ").toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Issue Date</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatDate(employee.hire_date)}
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
  );
};

// ==================== MAIN COMPONENT ====================

const Employees: React.FC = () => {
  // State for employee list
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0,
  });

  // Filter state
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "",
    department_id: "",
    office_id: "",
    employment_type: "",
  });

  // Dropdown data
  const [offices, setOffices] = useState<Office[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showIDCardModal, setShowIDCardModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  // Form state
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Get districts for a province
  const getDistrictsForProvince = useCallback((province: string): string[] => {
    return PROVINCES_DISTRICTS[province] || [];
  }, []);

  // Step validation functions
  const validateStep = useCallback((step: number, data: FormData): { valid: boolean; errors: FormErrors } => {
    const errors: FormErrors = {};

    switch (step) {
      case 0: // Personal Info
        if (!data.first_name.trim()) errors.first_name = ["First name is required"];
        if (!data.last_name.trim()) errors.last_name = ["Last name is required"];
        if (!data.date_of_birth) errors.date_of_birth = ["Date of birth is required"];
        if (!data.gender) errors.gender = ["Gender is required"];
        break;
      case 1: // Contact Info
        if (!data.primary_email.trim()) errors.primary_email = ["Primary email is required"];
        if (data.primary_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.primary_email)) {
          errors.primary_email = ["Invalid email format"];
        }
        if (!data.primary_phone.trim()) errors.primary_phone = ["Primary phone is required"];
        break;
      case 2: // Address
        // Address fields are optional but if province is selected, validate district
        break;
      case 3: // Employment
        if (!data.hire_date) errors.hire_date = ["Hire date is required"];
        if (!data.office_id) errors.office_id = ["Office is required"];
        if (!data.department_id) errors.department_id = ["Department is required"];
        if (!data.position_id) errors.position_id = ["Position is required"];
        break;
    }

    return { valid: Object.keys(errors).length === 0, errors };
  }, []);

  // Navigate to next step
  const handleNextStep = useCallback(() => {
    const { valid, errors } = validateStep(currentStep, formData);
    if (valid) {
      setFormErrors({});
      setCurrentStep(prev => Math.min(prev + 1, STEP_LABELS.length - 1));
    } else {
      setFormErrors(errors);
    }
  }, [currentStep, formData, validateStep]);

  // Navigate to previous step
  const handlePrevStep = useCallback(() => {
    setFormErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  // Statistics
  const [statistics, setStatistics] = useState<Statistics | null>(null);

  // Fetch employees
  const fetchEmployees = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = {
          page,
          per_page: pagination.perPage,
          ...Object.fromEntries(
            Object.entries(filters).filter(([, v]) => v !== "")
          ),
        };
        const response = await hrService.getEmployees(params);
        setEmployees(response.data || []);
        if (response.meta) {
          setPagination({
            currentPage: response.meta.current_page,
            lastPage: response.meta.last_page,
            perPage: response.meta.per_page,
            total: response.meta.total,
          });
        }
      } catch (err) {
        setError("Failed to fetch employees");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [pagination.perPage, filters]
  );

  // Fetch dropdown data
  const fetchDropdownData = useCallback(async () => {
    try {
      const [officesRes, departmentsRes, gradesRes, positionsRes] =
        await Promise.all([
          hrService.getOffices({ is_active: true, all: true }),
          hrService.getDepartments({ is_active: true, all: true }),
          hrService.getGrades({ all: true }),
          hrService.getPositions({ is_active: true, all: true }),
        ]);

      setOffices(extractData<Office[]>(officesRes));
      setDepartments(extractData<Department[]>(departmentsRes));
      setGrades(extractData<Grade[]>(gradesRes));
      setPositions(extractData<Position[]>(positionsRes));
    } catch (err) {
      console.error("Failed to fetch dropdown data:", err);
    }
  }, []);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await hrService.getEmployeeStatistics();
      if (response?.data) {
        setStatistics(response.data);
      } else if (response && !response.data) {
        setStatistics(response as Statistics);
      }
    } catch (err) {
      console.error("Failed to fetch statistics:", err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchEmployees();
    fetchDropdownData();
    fetchStatistics();
  }, [fetchDropdownData, fetchEmployees, fetchStatistics]);

  // Fetch on filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchEmployees, filters]);

  // Handle filter change
  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Handle form change - no dependency on formErrors to prevent re-renders
  const handleFormChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = e.target;
      const checked =
        type === "checkbox" ? (e.target as HTMLInputElement).checked : false;

      setFormData((prev) => {
        const newData = {
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        };

        // Clear district when province changes
        if (name === "permanent_province") {
          newData.permanent_district = "";
        }
        if (name === "current_province") {
          newData.current_district = "";
        }

        return newData;
      });

      // Clear error for this field
      setFormErrors((prev) => {
        if (prev[name]) {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        }
        return prev;
      });
    },
    []
  );

  // Open create modal
  const handleCreate = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
    setCurrentStep(0);
    setShowCreateModal(true);
  }, []);

  // Open view modal
  const handleView = useCallback(async (employee: Employee) => {
    try {
      const response = await hrService.getEmployee(employee.id);
      setSelectedEmployee(response.data);
      setShowViewModal(true);
    } catch (err) {
      console.error("Failed to fetch employee details:", err);
    }
  }, []);

  // Open ID Card modal
  const handleGenerateIDCard = useCallback(async (employee: Employee) => {
    try {
      const response = await hrService.getEmployee(employee.id);
      setSelectedEmployee(response.data);
      setShowIDCardModal(true);
    } catch (err) {
      console.error("Failed to fetch employee details:", err);
    }
  }, []);

  // Open edit modal
  const handleEdit = useCallback(async (employee: Employee) => {
    try {
      const response = await hrService.getEmployee(employee.id);
      const emp = response.data as Employee;
      setSelectedEmployee(emp);
      setFormData({
        ...INITIAL_FORM_DATA,
        title: "",
        first_name: emp.first_name || "",
        last_name: emp.last_name || "",
        father_name: emp.father_name || "",
        date_of_birth: emp.date_of_birth || "",
        gender: emp.gender || "",
        marital_status: emp.marital_status || "",
        nationality: emp.nationality || "Afghan",
        national_id_type: emp.national_id_type || "tazkira",
        national_id_number: emp.national_id_number || "",
        blood_group: emp.blood_group || "",
        primary_email: emp.primary_email || "",
        primary_phone: emp.primary_phone || "",
        current_address: emp.current_address || "",
        current_province: emp.current_province || "",
        status: emp.status || "active",
        notes: "",
      });
      setFormErrors({});
      setShowEditModal(true);
    } catch (err) {
      console.error("Failed to fetch employee details:", err);
    }
  }, []);

  // Open delete modal
  const handleDelete = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  }, []);

  // Submit create form
  const handleCreateSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setFormErrors({});

      try {
        await hrService.createEmployee(formData);
        setShowCreateModal(false);
        fetchEmployees();
        fetchStatistics();
      } catch (err: unknown) {
        const error = err as { response?: { data?: { errors?: FormErrors } } };
        if (error.response?.data?.errors) {
          setFormErrors(error.response.data.errors);
        } else {
          setFormErrors({ general: "Failed to create employee" });
        }
      } finally {
        setSubmitting(false);
      }
    },
    [formData, fetchEmployees, fetchStatistics]
  );

  // Submit edit form
  const handleEditSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedEmployee) return;
      setSubmitting(true);
      setFormErrors({});

      try {
        await hrService.updateEmployee(selectedEmployee.id, formData);
        setShowEditModal(false);
        fetchEmployees();
      } catch (err: unknown) {
        const error = err as { response?: { data?: { errors?: FormErrors } } };
        if (error.response?.data?.errors) {
          setFormErrors(error.response.data.errors);
        } else {
          setFormErrors({ general: "Failed to update employee" });
        }
      } finally {
        setSubmitting(false);
      }
    },
    [selectedEmployee, formData, fetchEmployees]
  );

  // Confirm delete
  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedEmployee) return;
    setSubmitting(true);
    try {
      await hrService.deleteEmployee(selectedEmployee.id);
      setShowDeleteModal(false);
      fetchEmployees();
      fetchStatistics();
    } catch (err) {
      console.error("Failed to delete employee:", err);
    } finally {
      setSubmitting(false);
    }
  }, [selectedEmployee, fetchEmployees, fetchStatistics]);

  // Status badge
  const getStatusBadge = useCallback((status: string) => {
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          STATUS_CLASSES[status] || STATUS_CLASSES.active
        }`}
      >
        {status?.replace("_", " ").toUpperCase()}
      </span>
    );
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Employees here
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage employee records and generate ID cards
        </p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Employees
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {statistics.total_employees}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Active
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {statistics.active_employees}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <UserX className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  On Leave
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {statistics.on_leave}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Plus className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  New This Month
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {statistics.new_hires_this_month}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Search by name, email, or employee number..."
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Employee
            </button>
          </div>

          {/* Filter Row */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="suspended">Suspended</option>
              <option value="terminated">Terminated</option>
              <option value="resigned">Resigned</option>
            </select>

            <select
              name="department_id"
              value={filters.department_id}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>

            <select
              name="office_id"
              value={filters.office_id}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Offices</option>
              {offices.map((office) => (
                <option key={office.id} value={office.id}>
                  {office.name}
                </option>
              ))}
            </select>

            <select
              name="employment_type"
              value={filters.employment_type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="consultant">Consultant</option>
              <option value="intern">Intern</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Office
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <span className="text-primary-600 dark:text-primary-300 font-medium">
                              {employee.first_name?.[0]}
                              {employee.last_name?.[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {employee.full_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {employee.employee_number}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {employee.department?.name || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {employee.position?.title || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {employee.office?.name || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(employee.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleGenerateIDCard(employee)}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          title="Generate ID Card"
                        >
                          <CreditCard className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleView(employee)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(employee)}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                          title="Edit"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(employee)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(pagination.currentPage - 1) * pagination.perPage + 1}{" "}
                to{" "}
                {Math.min(
                  pagination.currentPage * pagination.perPage,
                  pagination.total
                )}{" "}
                of {pagination.total} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchEmployees(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="px-3 py-1 text-gray-700 dark:text-gray-300">
                  {pagination.currentPage} / {pagination.lastPage}
                </span>
                <button
                  onClick={() => fetchEmployees(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.lastPage}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ID Card Modal */}
      <Modal
        isOpen={showIDCardModal}
        onClose={() => setShowIDCardModal(false)}
        title="Generate Employee ID Card"
        size="lg"
      >
        {selectedEmployee && (
          <IDCardGenerator
            employee={selectedEmployee}
            onClose={() => setShowIDCardModal(false)}
          />
        )}
      </Modal>

      {/* Create Employee Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Employee"
        size="xl"
      >
        <form onSubmit={handleCreateSubmit}>
          {formErrors.general && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
              {formErrors.general}
            </div>
          )}

          {/* Step Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              {STEP_LABELS.map((label, index) => (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index < currentStep
                          ? "bg-green-500 text-white"
                          : index === currentStep
                          ? "bg-primary-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {index < currentStep ? "✓" : index + 1}
                    </div>
                    <span className={`text-xs mt-1 ${
                      index === currentStep
                        ? "text-primary-600 dark:text-primary-400 font-medium"
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {label}
                    </span>
                  </div>
                  {index < STEP_LABELS.length - 1 && (
                    <div
                      className={`w-12 sm:w-20 h-0.5 mx-2 ${
                        index < currentStep ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 0: Personal Information */}
          {currentStep === 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select</option>
                    <option value="mr">Mr</option>
                    <option value="ms">Ms</option>
                    <option value="mrs">Mrs</option>
                    <option value="dr">Dr</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      formErrors.first_name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.first_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {Array.isArray(formErrors.first_name) ? formErrors.first_name[0] : formErrors.first_name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      formErrors.last_name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.last_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {Array.isArray(formErrors.last_name) ? formErrors.last_name[0] : formErrors.last_name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Father Name
                  </label>
                  <input
                    type="text"
                    name="father_name"
                    value={formData.father_name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      formErrors.date_of_birth ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.date_of_birth && (
                    <p className="text-red-500 text-xs mt-1">
                      {Array.isArray(formErrors.date_of_birth) ? formErrors.date_of_birth[0] : formErrors.date_of_birth}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      formErrors.gender ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {formErrors.gender && (
                    <p className="text-red-500 text-xs mt-1">
                      {Array.isArray(formErrors.gender) ? formErrors.gender[0] : formErrors.gender}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Marital Status
                  </label>
                  <select
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    National ID Number
                  </label>
                  <input
                    type="text"
                    name="national_id_number"
                    value={formData.national_id_number}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Primary Email *
                  </label>
                  <input
                    type="email"
                    name="primary_email"
                    value={formData.primary_email}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      formErrors.primary_email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.primary_email && (
                    <p className="text-red-500 text-xs mt-1">
                      {Array.isArray(formErrors.primary_email) ? formErrors.primary_email[0] : formErrors.primary_email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Personal Email
                  </label>
                  <input
                    type="email"
                    name="personal_email"
                    value={formData.personal_email}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Primary Phone *
                  </label>
                  <input
                    type="text"
                    name="primary_phone"
                    value={formData.primary_phone}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      formErrors.primary_phone ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.primary_phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {Array.isArray(formErrors.primary_phone) ? formErrors.primary_phone[0] : formErrors.primary_phone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Alternate Phone
                  </label>
                  <input
                    type="text"
                    name="alternate_phone"
                    value={formData.alternate_phone}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Address Information */}
          {currentStep === 2 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Address Information
              </h4>

              {/* Permanent Address */}
              <div className="mb-6">
                <h5 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Permanent Address
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Province
                    </label>
                    <select
                      name="permanent_province"
                      value={formData.permanent_province}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Province</option>
                      {Object.keys(PROVINCES_DISTRICTS).map((province) => (
                        <option key={province} value={province}>
                          {province.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      District
                    </label>
                    <select
                      name="permanent_district"
                      value={formData.permanent_district}
                      onChange={handleFormChange}
                      disabled={!formData.permanent_province}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select District</option>
                      {getDistrictsForProvince(formData.permanent_province).map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Address Details
                    </label>
                    <input
                      type="text"
                      name="permanent_address"
                      value={formData.permanent_address}
                      onChange={handleFormChange}
                      placeholder="Street, House No, etc."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Current Address */}
              <div>
                <h5 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Current Address
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Province
                    </label>
                    <select
                      name="current_province"
                      value={formData.current_province}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Province</option>
                      {Object.keys(PROVINCES_DISTRICTS).map((province) => (
                        <option key={province} value={province}>
                          {province.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      District
                    </label>
                    <select
                      name="current_district"
                      value={formData.current_district}
                      onChange={handleFormChange}
                      disabled={!formData.current_province}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select District</option>
                      {getDistrictsForProvince(formData.current_province).map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Address Details
                    </label>
                    <input
                      type="text"
                      name="current_address"
                      value={formData.current_address}
                      onChange={handleFormChange}
                      placeholder="Street, House No, etc."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Employment Information */}
          {currentStep === 3 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Employment Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hire Date *
                  </label>
                  <input
                    type="date"
                    name="hire_date"
                    value={formData.hire_date}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      formErrors.hire_date ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.hire_date && (
                    <p className="text-red-500 text-xs mt-1">
                      {Array.isArray(formErrors.hire_date) ? formErrors.hire_date[0] : formErrors.hire_date}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Employment Type
                  </label>
                  <select
                    name="employment_type"
                    value={formData.employment_type}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="consultant">Consultant</option>
                    <option value="intern">Intern</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Office *
                  </label>
                  <select
                    name="office_id"
                    value={formData.office_id}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      formErrors.office_id ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <option value="">Select Office</option>
                    {offices.map((office) => (
                      <option key={office.id} value={office.id}>
                        {office.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.office_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {Array.isArray(formErrors.office_id) ? formErrors.office_id[0] : formErrors.office_id}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department *
                  </label>
                  <select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      formErrors.department_id ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.department_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {Array.isArray(formErrors.department_id) ? formErrors.department_id[0] : formErrors.department_id}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Position *
                  </label>
                  <select
                    name="position_id"
                    value={formData.position_id}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      formErrors.position_id ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <option value="">Select Position</option>
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.title}
                      </option>
                    ))}
                  </select>
                  {formErrors.position_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {Array.isArray(formErrors.position_id) ? formErrors.position_id[0] : formErrors.position_id}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Grade
                  </label>
                  <select
                    name="grade_id"
                    value={formData.grade_id}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Grade</option>
                    {grades.map((grade) => (
                      <option key={grade.id} value={grade.id}>
                        {grade.name} {grade.code ? `(${grade.code})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              {currentStep < STEP_LABELS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create Employee"}
                </button>
              )}
            </div>
          </div>
        </form>
      </Modal>

      {/* View Employee Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Employee Details"
        size="lg"
      >
        {selectedEmployee && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-2xl text-primary-600 dark:text-primary-300 font-medium">
                  {selectedEmployee.first_name?.[0]}
                  {selectedEmployee.last_name?.[0]}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedEmployee.full_name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedEmployee.employee_number}
                </p>
                {getStatusBadge(selectedEmployee.status)}
              </div>
            </div>

            {/* Generate ID Card Button */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setShowIDCardModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <CreditCard className="w-5 h-5" />
                Generate ID Card
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Personal Information
                </h4>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">
                      Gender:
                    </dt>
                    <dd className="text-gray-900 dark:text-white capitalize">
                      {selectedEmployee.gender}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">
                      Date of Birth:
                    </dt>
                    <dd className="text-gray-900 dark:text-white">
                      {selectedEmployee.date_of_birth}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Contact Information
                </h4>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Email:</dt>
                    <dd className="text-gray-900 dark:text-white">
                      {selectedEmployee.primary_email}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Phone:</dt>
                    <dd className="text-gray-900 dark:text-white">
                      {selectedEmployee.primary_phone}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Employment Details
                </h4>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">
                      Office:
                    </dt>
                    <dd className="text-gray-900 dark:text-white">
                      {selectedEmployee.office?.name}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">
                      Department:
                    </dt>
                    <dd className="text-gray-900 dark:text-white">
                      {selectedEmployee.department?.name}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">
                      Position:
                    </dt>
                    <dd className="text-gray-900 dark:text-white">
                      {selectedEmployee.position?.title}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">
                      Hire Date:
                    </dt>
                    <dd className="text-gray-900 dark:text-white">
                      {selectedEmployee.hire_date}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Employee"
        size="lg"
      >
        <form onSubmit={handleEditSubmit}>
          {formErrors.general && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
              {formErrors.general}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Primary Email
              </label>
              <input
                type="email"
                name="primary_email"
                value={formData.primary_email}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Primary Phone
              </label>
              <input
                type="text"
                name="primary_phone"
                value={formData.primary_phone}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="suspended">Suspended</option>
                <option value="terminated">Terminated</option>
                <option value="resigned">Resigned</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Employee"
        size="sm"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <Trash2 className="h-6 w-6 text-red-600 dark:text-red-300" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete{" "}
            <strong>{selectedEmployee?.full_name}</strong>? This action cannot
            be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={submitting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              {submitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Employees;
