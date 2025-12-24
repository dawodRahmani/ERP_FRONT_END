import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { payrollDistributionDB, projectDB } from '../../services/db/indexedDB';
import payrollService from '../../services/db/payrollService';

const PayrollGenerationReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [distribution, setDistribution] = useState(null);
  const [periodDistributions, setPeriodDistributions] = useState([]);
  const [period, setPeriod] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'period'

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dist, projectsData] = await Promise.all([
        payrollDistributionDB.getById(Number(id)),
        projectDB.getAll()
      ]);

      if (dist) {
        setDistribution(dist);
        setProjects(projectsData);

        // Load all distributions for the same period
        if (dist.payrollPeriodId) {
          const periodDists = await payrollDistributionDB.getByPeriod(dist.payrollPeriodId);
          setPeriodDistributions(periodDists);

          const periodData = await payrollService.payrollPeriods.getById(dist.payrollPeriodId);
          setPeriod(periodData);
        }
      }
    } catch (error) {
      console.error('Error loading distribution:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AF', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0) + ' AFN';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate period summary
  const getPeriodSummary = () => {
    const projectTotals = {};
    let companyTotal = 0;
    let totalPayroll = 0;

    periodDistributions.forEach(dist => {
      totalPayroll += dist.netSalary || 0;
      dist.distributions?.forEach(d => {
        if (d.isCompanyCharge) {
          companyTotal += d.amount || 0;
        } else if (d.projectId) {
          if (!projectTotals[d.projectId]) {
            projectTotals[d.projectId] = {
              projectId: d.projectId,
              projectCode: d.projectCode,
              projectName: d.projectName,
              amount: 0,
              employeeCount: 0
            };
          }
          projectTotals[d.projectId].amount += d.amount || 0;
          projectTotals[d.projectId].employeeCount += 1;
        }
      });
    });

    return {
      totalPayroll,
      companyTotal,
      projectTotals: Object.values(projectTotals),
      employeeCount: periodDistributions.length
    };
  };

  // Get unique project columns for the table
  const getProjectColumns = () => {
    const projectSet = new Map();
    periodDistributions.forEach(dist => {
      dist.distributions?.forEach(d => {
        if (!d.isCompanyCharge && d.projectId) {
          projectSet.set(d.projectId, { id: d.projectId, code: d.projectCode, name: d.projectName });
        }
      });
    });
    return Array.from(projectSet.values());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!distribution) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Distribution not found</p>
        <button
          onClick={() => navigate('/payroll/generation')}
          className="mt-4 text-primary-500 hover:text-primary-700"
        >
          Back to Payroll Generation
        </button>
      </div>
    );
  }

  const summary = getPeriodSummary();
  const projectColumns = getProjectColumns();

  return (
    <div className="p-6">
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .print-hidden {
            display: none !important;
          }
          @page {
            size: landscape;
            margin: 1cm;
          }
          table {
            font-size: 10px;
          }
          th, td {
            padding: 4px 8px !important;
          }
        }
      `}</style>

      {/* Header - Hidden on print */}
      <div className="flex items-center justify-between mb-6 print-hidden">
        <button
          onClick={() => navigate('/payroll/generation')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" /> Back to Payroll Generation
        </button>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('single')}
              className={`px-4 py-2 text-sm ${viewMode === 'single' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700'}`}
            >
              Single Employee
            </button>
            <button
              onClick={() => setViewMode('period')}
              className={`px-4 py-2 text-sm ${viewMode === 'period' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700'}`}
            >
              Full Period Report
            </button>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Printer className="h-5 w-5" /> Print
          </button>
        </div>
      </div>

      {/* Printable Report */}
      <div className="printable-area bg-white rounded-lg shadow-lg">
        {/* Report Header */}
        <div className="p-6 border-b border-gray-200 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">VDO ERP</h1>
          <h2 className="text-lg font-semibold text-gray-700">
            {viewMode === 'single' ? 'Salary Distribution Report' : 'Payroll Distribution Report'}
          </h2>
          <p className="text-gray-500 mt-2">
            Period: {period?.name || distribution.periodMonth} | Generated: {formatDate(distribution.generatedAt)}
          </p>
        </div>

        {viewMode === 'single' ? (
          /* Single Employee View */
          <div className="p-6">
            {/* Employee Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Employee Name</p>
                <p className="font-medium text-gray-900">{distribution.employeeName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Employee ID</p>
                <p className="font-medium text-gray-900">{distribution.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium text-gray-900">{distribution.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Distribution Type</p>
                <p className="font-medium text-gray-900">
                  {distribution.generationType === 'split' ? 'Split Allocation' : 'Full Project Charge'}
                </p>
              </div>
            </div>

            {/* Salary Breakdown */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Distribution</h3>
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Funding Source</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Project Code</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">Percentage</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {distribution.distributions?.map((d, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b">
                        {d.isCompanyCharge ? 'Company' : d.projectName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-b">
                        {d.isCompanyCharge ? 'COMPANY' : d.projectCode}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right border-b">{d.percentage}%</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right border-b">
                        {formatCurrency(d.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td colSpan="2" className="px-4 py-3 text-sm font-bold text-gray-900">Total Net Salary</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">100%</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                      {formatCurrency(distribution.netSalary)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Signature Section */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="border-b border-gray-400 mb-2 h-12"></div>
                <p className="text-sm text-gray-600">Prepared By</p>
              </div>
              <div className="text-center">
                <div className="border-b border-gray-400 mb-2 h-12"></div>
                <p className="text-sm text-gray-600">Reviewed By</p>
              </div>
              <div className="text-center">
                <div className="border-b border-gray-400 mb-2 h-12"></div>
                <p className="text-sm text-gray-600">Approved By</p>
              </div>
            </div>
          </div>
        ) : (
          /* Full Period Report View */
          <div className="p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Total Employees</p>
                <p className="text-2xl font-bold text-blue-900">{summary.employeeCount}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Total Payroll</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(summary.totalPayroll)}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600">Project Charges</p>
                <p className="text-2xl font-bold text-purple-900">
                  {formatCurrency(summary.totalPayroll - summary.companyTotal)}
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-600">Company Charge</p>
                <p className="text-2xl font-bold text-orange-900">{formatCurrency(summary.companyTotal)}</p>
              </div>
            </div>

            {/* Project Summary Table */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project-wise Summary</h3>
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Project Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Project Name</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">Employees</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">Total Amount</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">% of Payroll</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.projectTotals.map((pt, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">{pt.projectCode}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-b">{pt.projectName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right border-b">{pt.employeeCount}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right border-b">
                        {formatCurrency(pt.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right border-b">
                        {((pt.amount / summary.totalPayroll) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                  {summary.companyTotal > 0 && (
                    <tr className="bg-blue-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-900 border-b">COMPANY</td>
                      <td className="px-4 py-3 text-sm text-blue-700 border-b">Company/Core Funding</td>
                      <td className="px-4 py-3 text-sm text-blue-900 text-right border-b">-</td>
                      <td className="px-4 py-3 text-sm font-medium text-blue-900 text-right border-b">
                        {formatCurrency(summary.companyTotal)}
                      </td>
                      <td className="px-4 py-3 text-sm text-blue-900 text-right border-b">
                        {((summary.companyTotal / summary.totalPayroll) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-200">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-sm font-bold text-gray-900">Grand Total</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                      {formatCurrency(summary.totalPayroll)}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Detailed Employee Distribution Table */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Distribution Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b whitespace-nowrap">Employee</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b whitespace-nowrap">Department</th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-700 border-b whitespace-nowrap">Net Salary</th>
                      {projectColumns.map(pc => (
                        <th key={pc.id} className="px-3 py-2 text-right font-semibold text-gray-700 border-b whitespace-nowrap">
                          {pc.code}
                        </th>
                      ))}
                      <th className="px-3 py-2 text-right font-semibold text-gray-700 border-b whitespace-nowrap bg-blue-50">Company</th>
                    </tr>
                  </thead>
                  <tbody>
                    {periodDistributions.map((dist, idx) => {
                      const projectAmounts = {};
                      let companyAmount = 0;
                      dist.distributions?.forEach(d => {
                        if (d.isCompanyCharge) {
                          companyAmount = d.amount;
                        } else if (d.projectId) {
                          projectAmounts[d.projectId] = d.amount;
                        }
                      });

                      return (
                        <tr key={dist.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-2 text-gray-900 border-b whitespace-nowrap">{dist.employeeName}</td>
                          <td className="px-3 py-2 text-gray-600 border-b whitespace-nowrap">{dist.department}</td>
                          <td className="px-3 py-2 text-gray-900 text-right border-b font-medium">
                            {formatCurrency(dist.netSalary)}
                          </td>
                          {projectColumns.map(pc => (
                            <td key={pc.id} className="px-3 py-2 text-gray-900 text-right border-b">
                              {projectAmounts[pc.id] ? formatCurrency(projectAmounts[pc.id]) : '-'}
                            </td>
                          ))}
                          <td className="px-3 py-2 text-blue-900 text-right border-b bg-blue-50">
                            {companyAmount ? formatCurrency(companyAmount) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-200 font-bold">
                    <tr>
                      <td colSpan="2" className="px-3 py-2 text-gray-900">Total</td>
                      <td className="px-3 py-2 text-gray-900 text-right">{formatCurrency(summary.totalPayroll)}</td>
                      {projectColumns.map(pc => {
                        const projTotal = summary.projectTotals.find(pt => pt.projectId === pc.id);
                        return (
                          <td key={pc.id} className="px-3 py-2 text-gray-900 text-right">
                            {projTotal ? formatCurrency(projTotal.amount) : '-'}
                          </td>
                        );
                      })}
                      <td className="px-3 py-2 text-blue-900 text-right bg-blue-100">
                        {formatCurrency(summary.companyTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Signature Section */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="border-b border-gray-400 mb-2 h-12"></div>
                <p className="text-sm text-gray-600">Prepared By (HR)</p>
              </div>
              <div className="text-center">
                <div className="border-b border-gray-400 mb-2 h-12"></div>
                <p className="text-sm text-gray-600">Reviewed By (Finance)</p>
              </div>
              <div className="text-center">
                <div className="border-b border-gray-400 mb-2 h-12"></div>
                <p className="text-sm text-gray-600">Approved By (Director)</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Generated on {formatDate(new Date().toISOString())} | VDO ERP System</p>
        </div>
      </div>
    </div>
  );
};

export default PayrollGenerationReport;
