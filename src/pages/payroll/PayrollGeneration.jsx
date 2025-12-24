import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Building2,
  Calculator,
  Plus,
  Trash2,
  Eye,
  Printer,
  ChevronRight,
  ChevronLeft,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FileText,
  ArrowRight
} from 'lucide-react';
import payrollService from '../../services/db/payrollService';
import { projectDB, payrollDistributionDB, staffSalaryAllocationDB } from '../../services/db/indexedDB';

const PayrollGeneration = () => {
  const navigate = useNavigate();

  // State
  const [step, setStep] = useState(1); // 1: Format, 2: Period & Employees, 3: Allocations, 4: Review
  const [generationType, setGenerationType] = useState(null); // 'split' | 'full'
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [payrollEntries, setPayrollEntries] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allocations, setAllocations] = useState({}); // { employeeId: [{ projectId, percentage }] }
  const [existingAllocations, setExistingAllocations] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('generate'); // 'generate' | 'history'
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDistribution, setSelectedDistribution] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedPeriod) {
      loadPeriodData();
    }
  }, [selectedPeriod]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [periodsData, projectsData, distributionsData] = await Promise.all([
        payrollService.payrollPeriods.getAll(),
        projectDB.getAll({ status: 'ongoing' }),
        payrollDistributionDB.getAll()
      ]);
      setPeriods(periodsData.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)));
      setProjects(projectsData);
      setDistributions(distributionsData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPeriodData = async () => {
    try {
      const entries = await payrollService.payrollEntries.getAll({ payrollPeriodId: selectedPeriod.id });
      setPayrollEntries(entries);

      // Load existing staff allocations for this month
      const periodMonth = selectedPeriod.month;
      const existingAllocs = await staffSalaryAllocationDB.getAll({ allocationMonth: periodMonth });
      setExistingAllocations(existingAllocs);
    } catch (error) {
      console.error('Error loading period data:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AF', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0) + ' AFN';
  };

  const handleSelectFormat = (type) => {
    setGenerationType(type);
    setStep(2);
  };

  const handleSelectPeriod = (period) => {
    setSelectedPeriod(period);
    setSelectedEmployees([]);
    setAllocations({});
  };

  const handleToggleEmployee = (entry) => {
    const isSelected = selectedEmployees.some(e => e.id === entry.id);
    if (isSelected) {
      setSelectedEmployees(prev => prev.filter(e => e.id !== entry.id));
      setAllocations(prev => {
        const updated = { ...prev };
        delete updated[entry.id];
        return updated;
      });
    } else {
      setSelectedEmployees(prev => [...prev, entry]);
      // Initialize allocations based on format
      if (generationType === 'full') {
        setAllocations(prev => ({
          ...prev,
          [entry.id]: [{ projectId: '', projectName: '', percentage: 100 }]
        }));
      } else {
        // Check for existing allocations
        const empAllocs = existingAllocations.filter(a => a.employeeId === entry.employeeId);
        if (empAllocs.length > 0) {
          const allocList = empAllocs.map(a => ({
            projectId: a.projectId,
            projectName: projects.find(p => p.id === a.projectId)?.projectName || '',
            percentage: a.allocationPercentage
          }));
          setAllocations(prev => ({ ...prev, [entry.id]: allocList }));
        } else {
          setAllocations(prev => ({ ...prev, [entry.id]: [] }));
        }
      }
    }
  };

  const handleSelectAllEmployees = () => {
    if (selectedEmployees.length === payrollEntries.length) {
      setSelectedEmployees([]);
      setAllocations({});
    } else {
      setSelectedEmployees([...payrollEntries]);
      const newAllocations = {};
      payrollEntries.forEach(entry => {
        if (generationType === 'full') {
          newAllocations[entry.id] = [{ projectId: '', projectName: '', percentage: 100 }];
        } else {
          const empAllocs = existingAllocations.filter(a => a.employeeId === entry.employeeId);
          if (empAllocs.length > 0) {
            newAllocations[entry.id] = empAllocs.map(a => ({
              projectId: a.projectId,
              projectName: projects.find(p => p.id === a.projectId)?.projectName || '',
              percentage: a.allocationPercentage
            }));
          } else {
            newAllocations[entry.id] = [];
          }
        }
      });
      setAllocations(newAllocations);
    }
  };

  const handleAddAllocation = (entryId) => {
    setAllocations(prev => ({
      ...prev,
      [entryId]: [...(prev[entryId] || []), { projectId: '', projectName: '', percentage: 0 }]
    }));
  };

  const handleRemoveAllocation = (entryId, index) => {
    setAllocations(prev => ({
      ...prev,
      [entryId]: prev[entryId].filter((_, i) => i !== index)
    }));
  };

  const handleAllocationChange = (entryId, index, field, value) => {
    setAllocations(prev => {
      const updated = [...(prev[entryId] || [])];
      if (field === 'projectId') {
        const project = projects.find(p => p.id === Number(value));
        updated[index] = {
          ...updated[index],
          projectId: Number(value),
          projectName: project?.projectName || '',
          projectCode: project?.projectCode || ''
        };
      } else {
        updated[index] = { ...updated[index], [field]: Number(value) };
      }
      return { ...prev, [entryId]: updated };
    });
  };

  const calculateDistribution = (entry, entryAllocations) => {
    const netSalary = entry.netSalary || 0;
    const distributions = [];
    let totalPercentage = 0;

    (entryAllocations || []).forEach(alloc => {
      if (alloc.projectId && alloc.percentage > 0) {
        const amount = Math.round(netSalary * alloc.percentage / 100);
        distributions.push({
          projectId: alloc.projectId,
          projectCode: alloc.projectCode || '',
          projectName: alloc.projectName || '',
          percentage: alloc.percentage,
          amount,
          isCompanyCharge: false
        });
        totalPercentage += alloc.percentage;
      }
    });

    // Add company charge for remainder
    if (totalPercentage < 100) {
      const companyPercentage = 100 - totalPercentage;
      const companyAmount = netSalary - distributions.reduce((sum, d) => sum + d.amount, 0);
      distributions.push({
        projectId: null,
        projectCode: 'COMPANY',
        projectName: 'Company',
        percentage: companyPercentage,
        amount: companyAmount,
        isCompanyCharge: true
      });
    }

    return distributions;
  };

  const getTotalPercentage = (entryId) => {
    return (allocations[entryId] || []).reduce((sum, a) => sum + (a.percentage || 0), 0);
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);

      const distributionsToCreate = selectedEmployees.map(entry => {
        const entryAllocations = allocations[entry.id] || [];
        const distList = calculateDistribution(entry, entryAllocations);

        return {
          payrollPeriodId: selectedPeriod.id,
          periodName: selectedPeriod.name,
          periodMonth: selectedPeriod.month,
          employeeId: entry.employeeId,
          employeeName: entry.employeeName,
          department: entry.department,
          generationType,
          netSalary: entry.netSalary,
          distributions: distList,
          totalAllocated: distList.filter(d => !d.isCompanyCharge).reduce((sum, d) => sum + d.amount, 0),
          unallocatedAmount: distList.find(d => d.isCompanyCharge)?.amount || 0,
          unallocatedPercentage: distList.find(d => d.isCompanyCharge)?.percentage || 0,
          status: 'generated',
          generatedAt: new Date().toISOString()
        };
      });

      await payrollDistributionDB.bulkCreate(distributionsToCreate);

      // Reload distributions
      const updatedDist = await payrollDistributionDB.getAll();
      setDistributions(updatedDist);

      // Reset form
      setStep(1);
      setGenerationType(null);
      setSelectedPeriod(null);
      setSelectedEmployees([]);
      setAllocations({});
      setActiveTab('history');
    } catch (error) {
      console.error('Error generating distributions:', error);
      alert('Error generating payroll distributions');
    } finally {
      setGenerating(false);
    }
  };

  const handleViewDistribution = (dist) => {
    setSelectedDistribution(dist);
    setShowViewModal(true);
  };

  const handleDeleteDistribution = async (id) => {
    if (confirm('Delete this distribution record?')) {
      await payrollDistributionDB.delete(id);
      setDistributions(prev => prev.filter(d => d.id !== id));
    }
  };

  const handlePrintDistribution = (dist) => {
    navigate(`/payroll/generation/${dist.id}`);
  };

  // Summary calculations for step 4
  const getReviewSummary = () => {
    let totalPayroll = 0;
    const projectTotals = {};
    let companyTotal = 0;

    selectedEmployees.forEach(entry => {
      totalPayroll += entry.netSalary || 0;
      const distList = calculateDistribution(entry, allocations[entry.id]);
      distList.forEach(d => {
        if (d.isCompanyCharge) {
          companyTotal += d.amount;
        } else if (d.projectId) {
          if (!projectTotals[d.projectId]) {
            projectTotals[d.projectId] = { name: d.projectName, code: d.projectCode, amount: 0 };
          }
          projectTotals[d.projectId].amount += d.amount;
        }
      });
    });

    return { totalPayroll, projectTotals: Object.values(projectTotals), companyTotal };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll Generation</h1>
        <p className="text-gray-600 dark:text-gray-400">Generate project-wise salary distribution reports</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-4 py-2 font-medium ${activeTab === 'generate'
            ? 'text-primary-600 border-b-2 border-primary-500'
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Generate New
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-medium ${activeTab === 'history'
            ? 'text-primary-600 border-b-2 border-primary-500'
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Generated Reports ({distributions.length})
        </button>
      </div>

      {activeTab === 'generate' ? (
        <div>
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step >= s ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {step > s ? <CheckCircle className="h-5 w-5" /> : s}
                </div>
                {s < 4 && (
                  <div className={`w-16 h-1 ${step > s ? 'bg-primary-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Format Selection */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <button
                onClick={() => handleSelectFormat('split')}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors text-left"
              >
                <PieChart className="h-12 w-12 text-primary-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Split Allocation (Format 1)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Employee salary split across multiple projects. Example: 20% Project A, 30% Project B, 50% Company
                </p>
              </button>

              <button
                onClick={() => handleSelectFormat('full')}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors text-left"
              >
                <Building2 className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Full Project Charge (Format 2)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  100% of salary charged to a single project. Entire salary comes from one funding source.
                </p>
              </button>
            </div>
          )}

          {/* Step 2: Period & Employee Selection */}
          {step === 2 && (
            <div>
              {/* Period Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Payroll Period
                </label>
                <select
                  value={selectedPeriod?.id || ''}
                  onChange={(e) => {
                    const period = periods.find(p => p.id === Number(e.target.value));
                    handleSelectPeriod(period);
                  }}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Period</option>
                  {periods.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.month})</option>
                  ))}
                </select>
              </div>

              {selectedPeriod && (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-500">Employees in Period</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">{payrollEntries.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-500">Selected</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedEmployees.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-8 w-8 text-yellow-500" />
                        <div>
                          <p className="text-sm text-gray-500">Total Net Salary</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(selectedEmployees.reduce((sum, e) => sum + (e.netSalary || 0), 0))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Employee Table */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.length === payrollEntries.length && payrollEntries.length > 0}
                          onChange={handleSelectAllEmployees}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm font-medium">Select All Employees</span>
                      </label>
                    </div>
                    <div className="overflow-x-auto max-h-96">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Select</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {payrollEntries.map(entry => (
                            <tr
                              key={entry.id}
                              className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer
                                ${selectedEmployees.some(e => e.id === entry.id) ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                              onClick={() => handleToggleEmployee(entry)}
                            >
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={selectedEmployees.some(e => e.id === entry.id)}
                                  onChange={() => {}}
                                  className="rounded border-gray-300"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium text-gray-900 dark:text-white">{entry.employeeName}</div>
                                <div className="text-sm text-gray-500">{entry.employeeId}</div>
                              </td>
                              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{entry.department}</td>
                              <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                                {formatCurrency(entry.netSalary)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => { setStep(1); setGenerationType(null); }}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                      <ChevronLeft className="h-5 w-5" /> Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={selectedEmployees.length === 0}
                      className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next: Configure Allocations <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Allocation Configuration */}
          {step === 3 && (
            <div>
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  {generationType === 'split'
                    ? 'Configure project allocations for each employee. Unallocated percentage will be charged to Company.'
                    : 'Select a single project for each employee. 100% of salary will be charged to that project.'}
                </p>
              </div>

              <div className="space-y-4">
                {selectedEmployees.map(entry => {
                  const totalPct = getTotalPercentage(entry.id);
                  const isValid = generationType === 'full' ? totalPct === 100 : totalPct <= 100;

                  return (
                    <div key={entry.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{entry.employeeName}</h3>
                          <p className="text-sm text-gray-500">{entry.department} | Net Salary: {formatCurrency(entry.netSalary)}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium
                          ${isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {totalPct}% Allocated
                        </div>
                      </div>

                      {/* Allocations */}
                      <div className="space-y-2">
                        {(allocations[entry.id] || []).map((alloc, idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <select
                              value={alloc.projectId || ''}
                              onChange={(e) => handleAllocationChange(entry.id, idx, 'projectId', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                            >
                              <option value="">Select Project</option>
                              {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.projectCode} - {p.projectName}</option>
                              ))}
                            </select>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={alloc.percentage || ''}
                                onChange={(e) => handleAllocationChange(entry.id, idx, 'percentage', e.target.value)}
                                disabled={generationType === 'full'}
                                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-right"
                              />
                              <span className="text-gray-500">%</span>
                            </div>
                            <span className="text-sm text-gray-600 w-24 text-right">
                              {formatCurrency(Math.round((entry.netSalary || 0) * (alloc.percentage || 0) / 100))}
                            </span>
                            {generationType === 'split' && (
                              <button
                                onClick={() => handleRemoveAllocation(entry.id, idx)}
                                className="p-1 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}

                        {generationType === 'split' && (
                          <button
                            onClick={() => handleAddAllocation(entry.id)}
                            className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-700"
                          >
                            <Plus className="h-4 w-4" /> Add Project Allocation
                          </button>
                        )}

                        {/* Company charge preview */}
                        {generationType === 'split' && totalPct < 100 && (
                          <div className="flex gap-3 items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span className="flex-1 text-gray-500 text-sm">Company Charge (Remainder)</span>
                            <span className="text-sm text-gray-600">{100 - totalPct}%</span>
                            <span className="text-sm text-gray-600 w-24 text-right">
                              {formatCurrency(Math.round((entry.netSalary || 0) * (100 - totalPct) / 100))}
                            </span>
                            <div className="w-6" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="h-5 w-5" /> Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Next: Review <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Generate */}
          {step === 4 && (
            <div>
              {(() => {
                const summary = getReviewSummary();
                return (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 mb-1">Total Payroll</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(summary.totalPayroll)}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 mb-1">Project Charges</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalPayroll - summary.companyTotal)}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 mb-1">Company Charge</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(summary.companyTotal)}</p>
                      </div>
                    </div>

                    {/* Project Breakdown */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium text-gray-900 dark:text-white">Project-wise Breakdown</h3>
                      </div>
                      <div className="p-4">
                        <table className="min-w-full">
                          <thead>
                            <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                              <th className="pb-2">Project</th>
                              <th className="pb-2 text-right">Amount</th>
                              <th className="pb-2 text-right">% of Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {summary.projectTotals.map((pt, idx) => (
                              <tr key={idx}>
                                <td className="py-2">
                                  <span className="font-medium">{pt.code}</span>
                                  <span className="text-gray-500 ml-2">{pt.name}</span>
                                </td>
                                <td className="py-2 text-right">{formatCurrency(pt.amount)}</td>
                                <td className="py-2 text-right">{((pt.amount / summary.totalPayroll) * 100).toFixed(1)}%</td>
                              </tr>
                            ))}
                            {summary.companyTotal > 0 && (
                              <tr className="bg-gray-50 dark:bg-gray-700">
                                <td className="py-2 font-medium">Company</td>
                                <td className="py-2 text-right">{formatCurrency(summary.companyTotal)}</td>
                                <td className="py-2 text-right">{((summary.companyTotal / summary.totalPayroll) * 100).toFixed(1)}%</td>
                              </tr>
                            )}
                          </tbody>
                          <tfoot>
                            <tr className="border-t-2 border-gray-300 dark:border-gray-600 font-bold">
                              <td className="py-2">Total</td>
                              <td className="py-2 text-right">{formatCurrency(summary.totalPayroll)}</td>
                              <td className="py-2 text-right">100%</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    {/* Employee Details Preview */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium text-gray-900 dark:text-white">Employee Distribution Details ({selectedEmployees.length} employees)</h3>
                      </div>
                      <div className="overflow-x-auto max-h-64">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Employee</th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Net Salary</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Distribution</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {selectedEmployees.map(entry => {
                              const distList = calculateDistribution(entry, allocations[entry.id]);
                              return (
                                <tr key={entry.id}>
                                  <td className="px-4 py-2 text-sm">{entry.employeeName}</td>
                                  <td className="px-4 py-2 text-sm text-right">{formatCurrency(entry.netSalary)}</td>
                                  <td className="px-4 py-2 text-sm">
                                    {distList.map((d, i) => (
                                      <span key={i} className={`inline-block mr-2 px-2 py-0.5 rounded text-xs
                                        ${d.isCompanyCharge ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                        {d.projectCode || d.projectName}: {d.percentage}%
                                      </span>
                                    ))}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="h-5 w-5" /> Back
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-5 w-5" /> Generate Payroll Distribution
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* History Tab */
        <div>
          {distributions.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No distributions generated yet</h3>
              <p className="text-gray-500 mb-4">Generate your first payroll distribution using the Generate New tab</p>
              <button
                onClick={() => setActiveTab('generate')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                <Plus className="h-5 w-5" /> Generate New
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distribution</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {distributions.map(dist => (
                    <tr key={dist.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 dark:text-white">{dist.employeeName}</div>
                        <div className="text-sm text-gray-500">{dist.department}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {dist.periodName || dist.periodMonth}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                          ${dist.generationType === 'split' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                          {dist.generationType === 'split' ? 'Split' : 'Full'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(dist.netSalary)}</td>
                      <td className="px-4 py-3">
                        {dist.distributions?.slice(0, 3).map((d, i) => (
                          <span key={i} className={`inline-block mr-1 px-2 py-0.5 rounded text-xs
                            ${d.isCompanyCharge ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {d.projectCode || 'Company'}: {d.percentage}%
                          </span>
                        ))}
                        {dist.distributions?.length > 3 && (
                          <span className="text-xs text-gray-500">+{dist.distributions.length - 3} more</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDistribution(dist)}
                            className="p-1 text-blue-500 hover:text-blue-700"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePrintDistribution(dist)}
                            className="p-1 text-green-500 hover:text-green-700"
                            title="Print"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDistribution(dist.id)}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedDistribution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Distribution Details</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Employee</p>
                  <p className="font-medium">{selectedDistribution.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{selectedDistribution.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Period</p>
                  <p className="font-medium">{selectedDistribution.periodName || selectedDistribution.periodMonth}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Net Salary</p>
                  <p className="font-medium">{formatCurrency(selectedDistribution.netSalary)}</p>
                </div>
              </div>

              <h3 className="font-medium mb-3">Allocation Breakdown</h3>
              <table className="min-w-full mb-4">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase">
                    <th className="pb-2">Source</th>
                    <th className="pb-2 text-right">Percentage</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedDistribution.distributions?.map((d, idx) => (
                    <tr key={idx}>
                      <td className="py-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs
                          ${d.isCompanyCharge ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {d.projectCode || 'Company'}
                        </span>
                        <span className="ml-2 text-gray-600">{d.projectName}</span>
                      </td>
                      <td className="py-2 text-right">{d.percentage}%</td>
                      <td className="py-2 text-right font-medium">{formatCurrency(d.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => handlePrintDistribution(selectedDistribution)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Printer className="h-4 w-4" /> Print
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollGeneration;
