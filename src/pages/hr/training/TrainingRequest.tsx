import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Search, Filter, BookOpen, DollarSign, User, Calendar } from 'lucide-react';

interface TrainingRequestData {
  // Employee Details
  employeeName: string;
  employeeId: string;
  designation: string;
  department: string;
  lineManager: string;

  // Training Details
  trainingTitle: string;
  trainingProvider: string;
  trainingLocation: string;
  startDate: string;
  endDate: string;
  duration: string;

  // Training Information
  trainingObjectives: string;
  justification: string;

  // Cost Details
  trainingFees: number;
  travelExpenses: number;
  accommodation: number;
  otherExpenses: number;

  // Approvals
  employeeSignature: string;
  employeeSignatureDate: string;
  lineManagerSignature: string;
  lineManagerDate: string;
  lineManagerComments: string;
  hrSpecialistSignature: string;
  hrSpecialistDate: string;
  hrSpecialistComments: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
}

// List Component
const RequestList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const requests = [
    { id: '1', employeeName: 'Ahmad Ahmadi', trainingTitle: 'Advanced Excel Training', startDate: '2024-02-15', duration: '3 days', totalCost: 500, status: 'approved' },
    { id: '2', employeeName: 'Fatima Rahimi', trainingTitle: 'Project Management Certification', startDate: '2024-03-01', duration: '5 days', totalCost: 1500, status: 'pending' },
    { id: '3', employeeName: 'Mohammad Karimi', trainingTitle: 'Leadership Workshop', startDate: '2024-02-20', duration: '2 days', totalCost: 300, status: 'pending' },
    { id: '4', employeeName: 'Sara Hosseini', trainingTitle: 'Data Analysis Course', startDate: '2024-02-10', duration: '4 days', totalCost: 800, status: 'rejected' },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (status === 'rejected') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    if (status === 'draft') return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Training Requests</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 41: Employee request for training</p>
        </div>
        <Link to="/hr/training/request/new" className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> New Request
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{requests.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900/30 p-2">
              <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{requests.filter(r => r.status === 'pending').length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2">
              <User className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{requests.filter(r => r.status === 'approved').length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
              <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${requests.reduce((sum, r) => sum + r.totalCost, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by employee or training..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Training Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Start Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total Cost</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{request.employeeName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{request.trainingTitle}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{request.startDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{request.duration}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">${request.totalCost.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/hr/training/request/${request.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Link to="/hr/training" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700">
        <ArrowLeft className="h-4 w-4" /> Back to Training Dashboard
      </Link>
    </div>
  );
};

// Form Component
const RequestForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<TrainingRequestData>({
    employeeName: '',
    employeeId: '',
    designation: '',
    department: '',
    lineManager: '',
    trainingTitle: '',
    trainingProvider: '',
    trainingLocation: '',
    startDate: '',
    endDate: '',
    duration: '',
    trainingObjectives: '',
    justification: '',
    trainingFees: 0,
    travelExpenses: 0,
    accommodation: 0,
    otherExpenses: 0,
    employeeSignature: '',
    employeeSignatureDate: new Date().toISOString().split('T')[0],
    lineManagerSignature: '',
    lineManagerDate: '',
    lineManagerComments: '',
    hrSpecialistSignature: '',
    hrSpecialistDate: '',
    hrSpecialistComments: '',
    status: 'draft',
  });

  const [activeTab, setActiveTab] = useState('employee');

  const totalEstimatedCost = formData.trainingFees + formData.travelExpenses + formData.accommodation + formData.otherExpenses;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving training request:', formData);
    navigate('/hr/training/request');
  };

  const tabs = [
    { id: 'employee', label: 'Employee Details' },
    { id: 'training', label: 'Training Details' },
    { id: 'cost', label: 'Cost Details' },
    { id: 'approval', label: 'Approvals' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/hr/training/request" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNew ? 'New Training Request' : 'Edit Training Request'}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 41: Employee request for training</p>
        </div>
      </div>

      {/* Cost Summary Card */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-primary-600 dark:text-primary-400">Total Estimated Cost</p>
              <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">${totalEstimatedCost.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <p className="text-xs text-gray-600 dark:text-gray-400">Training Fees: ${formData.trainingFees.toLocaleString()}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Travel: ${formData.travelExpenses.toLocaleString()}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Accommodation: ${formData.accommodation.toLocaleString()}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Other: ${formData.otherExpenses.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          {/* Employee Details Tab */}
          {activeTab === 'employee' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Employee Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Employee Name *</label>
                  <input
                    type="text"
                    value={formData.employeeName}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Employee ID *</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Designation *</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Programs">Programs</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="HR">Human Resources</option>
                    <option value="Admin">Administration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Line Manager *</label>
                  <input
                    type="text"
                    value={formData.lineManager}
                    onChange={(e) => setFormData(prev => ({ ...prev, lineManager: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Training Details Tab */}
          {activeTab === 'training' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Training Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Training Title *</label>
                  <input
                    type="text"
                    value={formData.trainingTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, trainingTitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Training Provider/Organization</label>
                  <input
                    type="text"
                    value={formData.trainingProvider}
                    onChange={(e) => setFormData(prev => ({ ...prev, trainingProvider: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Training Location</label>
                  <input
                    type="text"
                    value={formData.trainingLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, trainingLocation: e.target.value }))}
                    placeholder="e.g., Kabul Office, Online, External Venue"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration (Days/Hours)</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 3 days, 16 hours"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Training Objectives *</label>
                <textarea
                  value={formData.trainingObjectives}
                  onChange={(e) => setFormData(prev => ({ ...prev, trainingObjectives: e.target.value }))}
                  rows={4}
                  placeholder="Describe the learning objectives and expected outcomes..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Justification *</label>
                <textarea
                  value={formData.justification}
                  onChange={(e) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
                  rows={4}
                  placeholder="Explain why this training is needed and how it will benefit your role and the organization..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
          )}

          {/* Cost Details Tab */}
          {activeTab === 'cost' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cost Details</h3>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Item</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">Training Fees</td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={formData.trainingFees || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, trainingFees: parseFloat(e.target.value) || 0 }))}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">Travel Expenses</td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={formData.travelExpenses || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, travelExpenses: parseFloat(e.target.value) || 0 }))}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">Accommodation</td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={formData.accommodation || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, accommodation: parseFloat(e.target.value) || 0 }))}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">Other Expenses</td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={formData.otherExpenses || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, otherExpenses: parseFloat(e.target.value) || 0 }))}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-primary-50 dark:bg-primary-900/20">
                    <tr>
                      <td className="px-4 py-3 text-sm font-bold text-primary-700 dark:text-primary-300">Total Estimated Cost</td>
                      <td className="px-4 py-3 text-lg font-bold text-primary-700 dark:text-primary-300 text-right">${totalEstimatedCost.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Approvals Tab */}
          {activeTab === 'approval' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Approvals</h3>

              {/* Employee Signature */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Requested By (Employee)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Signature</label>
                    <input
                      type="text"
                      value={formData.employeeSignature}
                      onChange={(e) => setFormData(prev => ({ ...prev, employeeSignature: e.target.value }))}
                      placeholder="Type name as signature"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.employeeSignatureDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, employeeSignatureDate: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Line Manager */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Line Manager Approval</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Signature</label>
                    <input
                      type="text"
                      value={formData.lineManagerSignature}
                      onChange={(e) => setFormData(prev => ({ ...prev, lineManagerSignature: e.target.value }))}
                      placeholder="Type name as signature"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.lineManagerDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, lineManagerDate: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Comments</label>
                    <textarea
                      value={formData.lineManagerComments}
                      onChange={(e) => setFormData(prev => ({ ...prev, lineManagerComments: e.target.value }))}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* HR Specialist */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">HR Specialist Approval</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Signature</label>
                    <input
                      type="text"
                      value={formData.hrSpecialistSignature}
                      onChange={(e) => setFormData(prev => ({ ...prev, hrSpecialistSignature: e.target.value }))}
                      placeholder="Type name as signature"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.hrSpecialistDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, hrSpecialistDate: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Comments</label>
                    <textarea
                      value={formData.hrSpecialistComments}
                      onChange={(e) => setFormData(prev => ({ ...prev, hrSpecialistComments: e.target.value }))}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Link to="/hr/training/request" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Save as Draft
          </button>
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Save className="h-4 w-4" />
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

// Main Component
const TrainingRequest = () => {
  const { id } = useParams();
  return id ? <RequestForm /> : <RequestList />;
};

export default TrainingRequest;
