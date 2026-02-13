import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeaveWorkflow } from '../components';

// ============================================================================
// FORM 35: LEAVE TRACKING SHEET
// ============================================================================

interface LeaveRecord {
  employeeId: string;
  employeeName: string;
  department: string;
  days: Record<number, string>; // day number -> leave type code
  totalLeave: number;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const leaveTypes = {
  A: { label: 'Annual Leave', color: 'bg-green-500', textColor: 'text-white' },
  S: { label: 'Sick Leave', color: 'bg-yellow-500', textColor: 'text-white' },
  M: { label: 'Maternity Leave', color: 'bg-purple-500', textColor: 'text-white' },
  U: { label: 'Unpaid Leave', color: 'bg-red-500', textColor: 'text-white' },
  H: { label: 'Holiday', color: 'bg-blue-500', textColor: 'text-white' },
};

export default function LeaveTracker() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Get days in the selected month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

  // Mock data for leave records
  const mockLeaveRecords: LeaveRecord[] = [
    {
      employeeId: 'EMP-001',
      employeeName: 'Ahmad Khan',
      department: 'Programs',
      days: { 5: 'A', 6: 'A', 7: 'A', 8: 'A', 12: 'H', 26: 'H' },
      totalLeave: 4,
    },
    {
      employeeId: 'EMP-002',
      employeeName: 'Fatima Rahimi',
      department: 'Finance',
      days: { 4: 'S', 12: 'H', 26: 'H' },
      totalLeave: 1,
    },
    {
      employeeId: 'EMP-003',
      employeeName: 'Mohammad Ali',
      department: 'Operations',
      days: { 10: 'A', 11: 'A', 12: 'H', 26: 'H' },
      totalLeave: 2,
    },
    {
      employeeId: 'EMP-004',
      employeeName: 'Sarah Ahmadi',
      department: 'HR',
      days: { 1: 'M', 2: 'M', 3: 'M', 4: 'M', 5: 'M', 6: 'M', 7: 'M', 8: 'M', 9: 'M', 10: 'M', 11: 'M', 12: 'M', 13: 'M', 14: 'M', 15: 'M', 16: 'M', 17: 'M', 18: 'M', 19: 'M', 20: 'M', 21: 'M', 22: 'M', 23: 'M', 24: 'M', 25: 'M', 26: 'M', 27: 'M', 28: 'M' },
      totalLeave: 26,
    },
    {
      employeeId: 'EMP-005',
      employeeName: 'Karim Nazari',
      department: 'IT',
      days: { 12: 'H', 20: 'A', 21: 'A', 22: 'A', 26: 'H' },
      totalLeave: 3,
    },
    {
      employeeId: 'EMP-006',
      employeeName: 'Zahra Hosseini',
      department: 'Programs',
      days: { 12: 'H', 15: 'S', 16: 'S', 26: 'H' },
      totalLeave: 2,
    },
    {
      employeeId: 'EMP-007',
      employeeName: 'Omar Stanikzai',
      department: 'Admin',
      days: { 3: 'U', 4: 'U', 12: 'H', 26: 'H' },
      totalLeave: 2,
    },
  ];

  // Get weekday name for a date
  const getWeekday = (day: number) => {
    const date = new Date(selectedYear, selectedMonth, day);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return weekdays[date.getDay()];
  };

  // Check if a day is Friday (Afghan weekend)
  const isFriday = (day: number) => {
    const date = new Date(selectedYear, selectedMonth, day);
    return date.getDay() === 5;
  };

  // Summary statistics
  const summary = {
    totalEmployees: mockLeaveRecords.length,
    totalAnnual: mockLeaveRecords.reduce((sum, r) => sum + Object.values(r.days).filter(d => d === 'A').length, 0),
    totalSick: mockLeaveRecords.reduce((sum, r) => sum + Object.values(r.days).filter(d => d === 'S').length, 0),
    totalMaternity: mockLeaveRecords.reduce((sum, r) => sum + Object.values(r.days).filter(d => d === 'M').length, 0),
    totalUnpaid: mockLeaveRecords.reduce((sum, r) => sum + Object.values(r.days).filter(d => d === 'U').length, 0),
  };

  return (
    <div className="space-y-6">
      <LeaveWorkflow currentStep="leave-tracker" workflowType="leave" />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Form 35: Leave Tracking Sheet
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Monthly leave tracking for all employees
              </p>
            </div>

            {/* Month/Year Selector */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {months.map((month, index) => (
                    <option key={month} value={index}>{month}</option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {[2023, 2024, 2025, 2026].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                Form 35
              </span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalEmployees}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Employees</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{summary.totalAnnual}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Annual Days</div>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{summary.totalSick}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Sick Days</div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{summary.totalMaternity}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Maternity Days</div>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{summary.totalUnpaid}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Unpaid Days</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4 flex-wrap">
          <span className="text-sm text-gray-500 dark:text-gray-400">Legend:</span>
          {Object.entries(leaveTypes).map(([code, info]) => (
            <div key={code} className="flex items-center gap-1.5">
              <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${info.color} ${info.textColor}`}>
                {code}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">{info.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded flex items-center justify-center text-xs bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400">
              -
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Present</span>
          </div>
        </div>

        {/* Calendar Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-700 z-10 min-w-[40px]">
                  S/N
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-[40px] bg-gray-50 dark:bg-gray-700 z-10 min-w-[150px]">
                  Name
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-[190px] bg-gray-50 dark:bg-gray-700 z-10 min-w-[80px]">
                  ID
                </th>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                  <th
                    key={day}
                    className={`px-1 py-2 text-center text-xs font-medium uppercase tracking-wider min-w-[32px] ${
                      isFriday(day)
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <div>{day}</div>
                    <div className="text-[10px] font-normal">{getWeekday(day)}</div>
                  </th>
                ))}
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[60px]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockLeaveRecords.map((record, index) => (
                <tr key={record.employeeId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-3 py-2 text-sm text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-800 z-10">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900 dark:text-white sticky left-[40px] bg-white dark:bg-gray-800 z-10">
                    <div className="font-medium">{record.employeeName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{record.department}</div>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 sticky left-[190px] bg-white dark:bg-gray-800 z-10">
                    {record.employeeId}
                  </td>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                    const leaveCode = record.days[day];
                    const leaveInfo = leaveCode ? leaveTypes[leaveCode as keyof typeof leaveTypes] : null;

                    return (
                      <td
                        key={day}
                        className={`px-1 py-2 text-center ${
                          isFriday(day) ? 'bg-red-50 dark:bg-red-900/10' : ''
                        }`}
                      >
                        {leaveInfo ? (
                          <span
                            className={`inline-flex w-6 h-6 items-center justify-center rounded text-xs font-bold ${leaveInfo.color} ${leaveInfo.textColor}`}
                            title={leaveInfo.label}
                          >
                            {leaveCode}
                          </span>
                        ) : isFriday(day) ? (
                          <span className="inline-flex w-6 h-6 items-center justify-center rounded text-xs bg-red-100 dark:bg-red-900/30 text-red-400">
                            -
                          </span>
                        ) : (
                          <span className="inline-flex w-6 h-6 items-center justify-center rounded text-xs text-gray-300 dark:text-gray-600">
                            -
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 text-center text-sm font-medium text-gray-900 dark:text-white">
                    {record.totalLeave}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {mockLeaveRecords.length} employees for {months[selectedMonth]} {selectedYear}
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              Export to Excel
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
