import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LeaveWorkflow } from '../components';

// ============================================================================
// FORM 37: MANUAL ATTENDANCE TEMPLATE
// ============================================================================

interface ManualAttendanceFormData {
  // Header Information
  staffName: string;
  employeeId: string;
  designation: string;
  location: string;
  project: string;
  donor: string;
  month: number;
  year: number;

  // Daily Records
  dailyRecords: Array<{
    date: number;
    day: string;
    timeIn: string;
    signatureIn: string;
    timeOut: string;
    signatureOut: string;
    remarks: string;
  }>;

  // Supervisor Verification
  supervisorName: string;
  supervisorSignature: string;
  supervisorDate: string;

  // Summary
  totalDaysWorked: number;
  totalAbsent: number;
  totalLeave: number;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ManualAttendanceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateDailyRecords = (month: number, year: number) => {
    const daysInMonth = getDaysInMonth(month, year);
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1);
      return {
        date: i + 1,
        day: weekdays[date.getDay()],
        timeIn: '',
        signatureIn: '',
        timeOut: '',
        signatureOut: '',
        remarks: date.getDay() === 5 ? 'Weekend' : '',
      };
    });
  };

  const [formData, setFormData] = useState<ManualAttendanceFormData>({
    staffName: '',
    employeeId: '',
    designation: '',
    location: '',
    project: '',
    donor: '',
    month: selectedMonth,
    year: selectedYear,
    dailyRecords: generateDailyRecords(selectedMonth, selectedYear),
    supervisorName: '',
    supervisorSignature: '',
    supervisorDate: '',
    totalDaysWorked: 0,
    totalAbsent: 0,
    totalLeave: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ManualAttendanceFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDailyRecordChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dailyRecords: prev.dailyRecords.map((record, i) =>
        i === index ? { ...record, [field]: value } : record
      ),
    }));
  };

  const handleMonthYearChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setFormData(prev => ({
      ...prev,
      month,
      year,
      dailyRecords: generateDailyRecords(month, year),
    }));
  };

  const calculateSummary = () => {
    const records = formData.dailyRecords;
    let daysWorked = 0;
    let absent = 0;
    let leave = 0;

    records.forEach(record => {
      if (record.day !== 'Fri') {
        if (record.timeIn && record.timeOut) {
          daysWorked++;
        } else if (record.remarks.toLowerCase().includes('leave')) {
          leave++;
        } else if (record.remarks.toLowerCase().includes('absent') || (!record.timeIn && !record.timeOut && !record.remarks)) {
          // Only count as absent if it's a past date
          const recordDate = new Date(selectedYear, selectedMonth, record.date);
          if (recordDate < new Date()) {
            absent++;
          }
        }
      }
    });

    setFormData(prev => ({
      ...prev,
      totalDaysWorked: daysWorked,
      totalAbsent: absent,
      totalLeave: leave,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.staffName.trim()) newErrors.staffName = 'Staff name is required';
    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      calculateSummary();
      console.log('Form submitted:', formData);
      navigate('/hr/leave-attendance/attendance/manual');
    }
  };

  const isFriday = (dayName: string) => dayName === 'Fri';

  return (
    <div className="space-y-6">
      <LeaveWorkflow currentStep="manual-attendance" workflowType="attendance" />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Form 37: Manual Attendance Template
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Paper-based attendance for field offices
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
              Form 37
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Header Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Staff Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Staff Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.staffName}
                  onChange={(e) => handleInputChange('staffName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.staffName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.staffName && <p className="text-red-500 text-xs mt-1">{errors.staffName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.employeeId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter employee ID"
                />
                {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Designation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.designation ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter designation"
                />
                {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter field office location"
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project
                </label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => handleInputChange('project', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Donor
                </label>
                <input
                  type="text"
                  value={formData.donor}
                  onChange={(e) => handleInputChange('donor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter donor name"
                />
              </div>
            </div>
          </div>

          {/* Month/Year Selection */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Period:</span>
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthYearChange(Number(e.target.value), selectedYear)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => handleMonthYearChange(selectedMonth, Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {[2023, 2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Daily Records */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Daily Attendance Records</h3>
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-600 rounded-lg">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-12">Date</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-12">Day</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Time In</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Signature</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Time Out</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Signature</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {formData.dailyRecords.map((record, index) => (
                    <tr
                      key={index}
                      className={`${
                        isFriday(record.day)
                          ? 'bg-red-50 dark:bg-red-900/10'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">
                        {record.date}
                      </td>
                      <td className={`px-3 py-2 text-sm ${
                        isFriday(record.day)
                          ? 'text-red-600 dark:text-red-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {record.day}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="time"
                          value={record.timeIn}
                          onChange={(e) => handleDailyRecordChange(index, 'timeIn', e.target.value)}
                          disabled={isFriday(record.day)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={record.signatureIn}
                          onChange={(e) => handleDailyRecordChange(index, 'signatureIn', e.target.value)}
                          disabled={isFriday(record.day)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                          placeholder="Sign"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="time"
                          value={record.timeOut}
                          onChange={(e) => handleDailyRecordChange(index, 'timeOut', e.target.value)}
                          disabled={isFriday(record.day)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={record.signatureOut}
                          onChange={(e) => handleDailyRecordChange(index, 'signatureOut', e.target.value)}
                          disabled={isFriday(record.day)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                          placeholder="Sign"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={record.remarks}
                          onChange={(e) => handleDailyRecordChange(index, 'remarks', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Remarks"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Supervisor Verification */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Supervisor Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Supervisor Name
                </label>
                <input
                  type="text"
                  value={formData.supervisorName}
                  onChange={(e) => handleInputChange('supervisorName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter supervisor name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Supervisor Signature
                </label>
                <input
                  type="text"
                  value={formData.supervisorSignature}
                  onChange={(e) => handleInputChange('supervisorSignature', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Type full name as signature"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.supervisorDate}
                  onChange={(e) => handleInputChange('supervisorDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/hr/leave-attendance/attendance/manual')}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={calculateSummary}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Calculate Summary
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
            >
              {isEditMode ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ManualAttendanceList() {
  const navigate = useNavigate();

  const mockData = [
    { id: '1', employeeId: 'EMP-010', employeeName: 'Hamid Karimi', location: 'Herat Field Office', month: 'January', year: 2024, status: 'Verified', daysWorked: 22 },
    { id: '2', employeeId: 'EMP-011', employeeName: 'Mariam Noori', location: 'Kandahar Field Office', month: 'January', year: 2024, status: 'Pending', daysWorked: 20 },
    { id: '3', employeeId: 'EMP-012', employeeName: 'Jawad Hashimi', location: 'Mazar Field Office', month: 'January', year: 2024, status: 'Verified', daysWorked: 21 },
    { id: '4', employeeId: 'EMP-013', employeeName: 'Laila Ahmadzai', location: 'Jalalabad Field Office', month: 'January', year: 2024, status: 'Pending', daysWorked: 19 },
  ];

  return (
    <div className="space-y-6">
      <LeaveWorkflow currentStep="manual-attendance" workflowType="attendance" />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Manual Attendance Records</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Paper-based attendance records from field offices
              </p>
            </div>
            <button
              onClick={() => navigate('/hr/leave-attendance/attendance/manual/new')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Record
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Days Worked</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{item.employeeName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.employeeId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {item.month} {item.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900 dark:text-white">
                    {item.daysWorked}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      item.status === 'Verified'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => navigate(`/hr/leave-attendance/attendance/manual/${item.id}`)}
                      className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ManualAttendance() {
  const { id } = useParams();
  const isNewOrEdit = window.location.pathname.includes('/new') || id;

  return isNewOrEdit ? <ManualAttendanceForm /> : <ManualAttendanceList />;
}
