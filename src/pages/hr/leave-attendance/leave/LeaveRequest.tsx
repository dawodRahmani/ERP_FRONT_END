import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LeaveWorkflow, LeaveInfoBanner } from '../components';

// ============================================================================
// FORM 34: LEAVE REQUEST FORM
// ============================================================================

interface LeaveRequestFormData {
  // Employee Information
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  lineManagerName: string;

  // Leave Details
  fromDate: string;
  toDate: string;
  totalWorkingDays: number;
  leaveType: 'annual' | 'sick' | 'maternity' | 'unpaid' | 'other';
  otherLeaveType: string;
  reason: string;

  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactMobile: string;

  // Alternate Staff
  alternateStaffName: string;
  alternateStaffSignature: string;
  alternateStaffDate: string;

  // Additional Information
  additionalInfo: string;

  // Leave Balance (read-only, filled by system)
  leaveAvailable: number;
  leaveAfterRequest: number;

  // Signatures
  staffSignature: string;
  staffSignatureDate: string;
  authorityName: string;
  authoritySignature: string;
  authoritySignatureDate: string;
  authorityDecision: 'approved' | 'rejected' | '';
  authorityRemarks: string;
  hrOfficerName: string;
  hrOfficerSignature: string;
  hrOfficerDate: string;
}

const initialFormData: LeaveRequestFormData = {
  employeeId: '',
  employeeName: '',
  designation: '',
  department: '',
  lineManagerName: '',
  fromDate: '',
  toDate: '',
  totalWorkingDays: 0,
  leaveType: 'annual',
  otherLeaveType: '',
  reason: '',
  emergencyContactName: '',
  emergencyContactRelationship: '',
  emergencyContactMobile: '',
  alternateStaffName: '',
  alternateStaffSignature: '',
  alternateStaffDate: '',
  additionalInfo: '',
  leaveAvailable: 20,
  leaveAfterRequest: 20,
  staffSignature: '',
  staffSignatureDate: '',
  authorityName: '',
  authoritySignature: '',
  authoritySignatureDate: '',
  authorityDecision: '',
  authorityRemarks: '',
  hrOfficerName: '',
  hrOfficerSignature: '',
  hrOfficerDate: '',
};

export function LeaveRequestForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<LeaveRequestFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof LeaveRequestFormData, value: string | number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // Auto-calculate working days when dates change
      if (field === 'fromDate' || field === 'toDate') {
        if (updated.fromDate && updated.toDate) {
          const from = new Date(updated.fromDate);
          const to = new Date(updated.toDate);
          if (to >= from) {
            let workingDays = 0;
            const current = new Date(from);
            while (current <= to) {
              const dayOfWeek = current.getDay();
              if (dayOfWeek !== 5) { // Exclude Friday (Afghan weekend)
                workingDays++;
              }
              current.setDate(current.getDate() + 1);
            }
            updated.totalWorkingDays = workingDays;
            updated.leaveAfterRequest = updated.leaveAvailable - workingDays;
          }
        }
      }

      return updated;
    });

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
    if (!formData.employeeName.trim()) newErrors.employeeName = 'Employee name is required';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.lineManagerName.trim()) newErrors.lineManagerName = 'Line manager name is required';
    if (!formData.fromDate) newErrors.fromDate = 'From date is required';
    if (!formData.toDate) newErrors.toDate = 'To date is required';
    if (formData.fromDate && formData.toDate && new Date(formData.toDate) < new Date(formData.fromDate)) {
      newErrors.toDate = 'To date must be after from date';
    }
    if (formData.leaveType === 'other' && !formData.otherLeaveType.trim()) {
      newErrors.otherLeaveType = 'Please specify the leave type';
    }
    if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
    if (!formData.emergencyContactMobile.trim()) newErrors.emergencyContactMobile = 'Emergency contact mobile is required';
    if (!formData.staffSignature.trim()) newErrors.staffSignature = 'Staff signature is required';
    if (!formData.staffSignatureDate) newErrors.staffSignatureDate = 'Signature date is required';

    // Check leave balance
    if (formData.leaveAfterRequest < 0 && formData.leaveType !== 'unpaid') {
      newErrors.totalWorkingDays = 'Insufficient leave balance';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      navigate('/hr/leave-attendance/leave/request');
    }
  };

  const leaveTypeOptions = [
    { value: 'annual', label: 'Annual Leave', color: 'green' },
    { value: 'sick', label: 'Sick Leave', color: 'yellow' },
    { value: 'maternity', label: 'Maternity Leave', color: 'purple' },
    { value: 'unpaid', label: 'Unpaid Leave', color: 'red' },
    { value: 'other', label: 'Other (specify)', color: 'gray' },
  ];

  return (
    <div className="space-y-6">
      <LeaveWorkflow currentStep="leave-request" workflowType="leave" />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Form 34: Leave Request Form
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Employee leave application with approval workflow
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              Form 34
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Employee Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Employee Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  Employee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => handleInputChange('employeeName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.employeeName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.employeeName && <p className="text-red-500 text-xs mt-1">{errors.employeeName}</p>}
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
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.department ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter department"
                />
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Line Manager Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lineManagerName}
                  onChange={(e) => handleInputChange('lineManagerName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.lineManagerName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter line manager name"
                />
                {errors.lineManagerName && <p className="text-red-500 text-xs mt-1">{errors.lineManagerName}</p>}
              </div>
            </div>
          </div>

          {/* Leave Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Leave Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  From Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) => handleInputChange('fromDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.fromDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.fromDate && <p className="text-red-500 text-xs mt-1">{errors.fromDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  To Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.toDate}
                  onChange={(e) => handleInputChange('toDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.toDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.toDate && <p className="text-red-500 text-xs mt-1">{errors.toDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Working Days
                </label>
                <input
                  type="number"
                  value={formData.totalWorkingDays}
                  readOnly
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white cursor-not-allowed ${
                    errors.totalWorkingDays ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.totalWorkingDays && <p className="text-red-500 text-xs mt-1">{errors.totalWorkingDays}</p>}
              </div>
            </div>

            {/* Leave Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Type of Leave <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {leaveTypeOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.leaveType === option.value
                        ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-900/20`
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="leaveType"
                      value={option.value}
                      checked={formData.leaveType === option.value}
                      onChange={(e) => handleInputChange('leaveType', e.target.value as LeaveRequestFormData['leaveType'])}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${
                      formData.leaveType === option.value
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {formData.leaveType === 'other' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Specify Leave Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.otherLeaveType}
                  onChange={(e) => handleInputChange('otherLeaveType', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.otherLeaveType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Specify the type of leave"
                />
                {errors.otherLeaveType && <p className="text-red-500 text-xs mt-1">{errors.otherLeaveType}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reason for Leave
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Briefly describe the reason for leave..."
              />
            </div>
          </div>

          {/* Leave Balance */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Leave Balance</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{formData.leaveAvailable}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Leave Available</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className={`text-3xl font-bold ${formData.leaveAfterRequest >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formData.leaveAfterRequest}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Leave After This Request</div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.emergencyContactName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter contact name"
                />
                {errors.emergencyContactName && <p className="text-red-500 text-xs mt-1">{errors.emergencyContactName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactRelationship}
                  onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Spouse, Parent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContactMobile}
                  onChange={(e) => handleInputChange('emergencyContactMobile', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.emergencyContactMobile ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter mobile number"
                />
                {errors.emergencyContactMobile && <p className="text-red-500 text-xs mt-1">{errors.emergencyContactMobile}</p>}
              </div>
            </div>
          </div>

          {/* Alternate Staff */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Alternate Staff</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Alternate Staff Name
                </label>
                <input
                  type="text"
                  value={formData.alternateStaffName}
                  onChange={(e) => handleInputChange('alternateStaffName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter alternate staff name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Alternate's Signature
                </label>
                <input
                  type="text"
                  value={formData.alternateStaffSignature}
                  onChange={(e) => handleInputChange('alternateStaffSignature', e.target.value)}
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
                  value={formData.alternateStaffDate}
                  onChange={(e) => handleInputChange('alternateStaffDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Additional Information
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Any additional information..."
            />
          </div>

          {/* Signatures Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Approvals</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Staff Signature */}
              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Staff</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Signature <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.staffSignature}
                      onChange={(e) => handleInputChange('staffSignature', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                        errors.staffSignature ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Type full name as signature"
                    />
                    {errors.staffSignature && <p className="text-red-500 text-xs mt-1">{errors.staffSignature}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.staffSignatureDate}
                      onChange={(e) => handleInputChange('staffSignatureDate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                        errors.staffSignatureDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.staffSignatureDate && <p className="text-red-500 text-xs mt-1">{errors.staffSignatureDate}</p>}
                  </div>
                </div>
              </div>

              {/* Authority Approval */}
              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Authority (per Delegation Matrix)</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.authorityName}
                      onChange={(e) => handleInputChange('authorityName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter authority name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Decision</label>
                    <select
                      value={formData.authorityDecision}
                      onChange={(e) => handleInputChange('authorityDecision', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select decision</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Signature</label>
                    <input
                      type="text"
                      value={formData.authoritySignature}
                      onChange={(e) => handleInputChange('authoritySignature', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Type full name as signature"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.authoritySignatureDate}
                      onChange={(e) => handleInputChange('authoritySignatureDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* HR Confirmation */}
              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">HR Officer Confirmation</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.hrOfficerName}
                      onChange={(e) => handleInputChange('hrOfficerName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter HR officer name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Signature</label>
                    <input
                      type="text"
                      value={formData.hrOfficerSignature}
                      onChange={(e) => handleInputChange('hrOfficerSignature', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Type full name as signature"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.hrOfficerDate}
                      onChange={(e) => handleInputChange('hrOfficerDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/hr/leave-attendance/leave/request')}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setFormData(initialFormData)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditMode ? 'Update Request' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function LeaveRequestList() {
  const navigate = useNavigate();

  const mockData = [
    { id: '1', employeeId: 'EMP-001', employeeName: 'Ahmad Khan', department: 'Programs', leaveType: 'Annual', fromDate: '2024-02-05', toDate: '2024-02-08', days: 4, status: 'Pending' },
    { id: '2', employeeId: 'EMP-002', employeeName: 'Fatima Rahimi', department: 'Finance', leaveType: 'Sick', fromDate: '2024-02-04', toDate: '2024-02-04', days: 1, status: 'Approved' },
    { id: '3', employeeId: 'EMP-003', employeeName: 'Mohammad Ali', department: 'Operations', leaveType: 'Annual', fromDate: '2024-02-10', toDate: '2024-02-12', days: 3, status: 'Pending' },
    { id: '4', employeeId: 'EMP-004', employeeName: 'Sarah Ahmadi', department: 'HR', leaveType: 'Maternity', fromDate: '2024-02-15', toDate: '2024-05-15', days: 90, status: 'Approved' },
    { id: '5', employeeId: 'EMP-005', employeeName: 'Karim Nazari', department: 'IT', leaveType: 'Annual', fromDate: '2024-02-20', toDate: '2024-02-22', days: 3, status: 'Rejected' },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      Approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[status as keyof typeof styles] || styles.Pending;
  };

  const getLeaveTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      Annual: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Sick: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      Maternity: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      Unpaid: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <div className="space-y-6">
      <LeaveWorkflow currentStep="leave-request" workflowType="leave" />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Leave Requests</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                View and manage employee leave applications
              </p>
            </div>
            <button
              onClick={() => navigate('/hr/leave-attendance/leave/request/new')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Leave Request
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Days</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{item.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLeaveTypeBadge(item.leaveType)}`}>
                      {item.leaveType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{item.fromDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{item.toDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{item.days}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => navigate(`/hr/leave-attendance/leave/request/${item.id}`)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
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

export default function LeaveRequest() {
  const { id } = useParams();
  const isNewOrEdit = window.location.pathname.includes('/new') || id;

  return isNewOrEdit ? <LeaveRequestForm /> : <LeaveRequestList />;
}
