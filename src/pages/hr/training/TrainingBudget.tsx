import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Search, Filter, DollarSign, Calculator } from 'lucide-react';

interface CostItem {
  id: string;
  itemNo: number;
  component: string;
  description: string;
  qtyDuration: string;
  unitCost: number;
  totalCost: number;
  notes: string;
}

interface BudgetData {
  trainingTitle: string;
  department: string;
  preparedBy: string;
  preparedByPosition: string;
  date: string;
  purposeObjectives: string;
  costItems: CostItem[];
  contingencyPercent: number;
  approvedBy: string;
  approvedByPosition: string;
  approvalDate: string;
  approvalComments: string;
}

const defaultCostItems: CostItem[] = [
  { id: '1', itemNo: 1, component: 'Trainer Fees', description: '', qtyDuration: '', unitCost: 0, totalCost: 0, notes: '' },
  { id: '2', itemNo: 2, component: 'Training Materials', description: '', qtyDuration: '', unitCost: 0, totalCost: 0, notes: '' },
  { id: '3', itemNo: 3, component: 'Venue/Facilities', description: '', qtyDuration: '', unitCost: 0, totalCost: 0, notes: '' },
  { id: '4', itemNo: 4, component: 'Travel & Accommodation', description: '', qtyDuration: '', unitCost: 0, totalCost: 0, notes: '' },
  { id: '5', itemNo: 5, component: 'Refreshments & Meals', description: '', qtyDuration: '', unitCost: 0, totalCost: 0, notes: '' },
  { id: '6', itemNo: 6, component: 'Training Technology', description: '', qtyDuration: '', unitCost: 0, totalCost: 0, notes: '' },
  { id: '7', itemNo: 7, component: 'Miscellaneous', description: '', qtyDuration: '', unitCost: 0, totalCost: 0, notes: '' },
];

// List Component
const BudgetList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const budgets = [
    { id: '1', trainingTitle: 'PSEAH Training Program', department: 'HR', preparedBy: 'Ahmad Ahmadi', date: '2024-01-10', totalBudget: 15000, status: 'approved' },
    { id: '2', trainingTitle: 'Project Management Workshop', department: 'Programs', preparedBy: 'Fatima Rahimi', date: '2024-01-15', totalBudget: 8500, status: 'pending' },
    { id: '3', trainingTitle: 'Financial Management Training', department: 'Finance', preparedBy: 'Mohammad Karimi', date: '2024-01-20', totalBudget: 12000, status: 'approved' },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (status === 'rejected') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Training Budget Proposals</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 31: Request training budget approval</p>
        </div>
        <Link to="/hr/training/budget/new" className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> New Budget Proposal
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by training title..."
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Training Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Prepared By</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total Budget</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {budgets.map((budget) => (
                <tr key={budget.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{budget.trainingTitle}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{budget.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{budget.preparedBy}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{budget.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">${budget.totalBudget.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(budget.status)}`}>
                      {budget.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/hr/training/budget/${budget.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
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
const BudgetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<BudgetData>({
    trainingTitle: '',
    department: '',
    preparedBy: '',
    preparedByPosition: '',
    date: new Date().toISOString().split('T')[0],
    purposeObjectives: '',
    costItems: defaultCostItems,
    contingencyPercent: 5,
    approvedBy: '',
    approvedByPosition: '',
    approvalDate: '',
    approvalComments: '',
  });

  const updateCostItem = (id: string, field: keyof CostItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      costItems: prev.costItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Auto-calculate total cost if unit cost or qty changes
          if (field === 'unitCost' || field === 'qtyDuration') {
            const qty = parseInt(updated.qtyDuration) || 1;
            updated.totalCost = qty * updated.unitCost;
          }
          return updated;
        }
        return item;
      })
    }));
  };

  const addCostItem = () => {
    const newItem: CostItem = {
      id: String(formData.costItems.length + 1),
      itemNo: formData.costItems.length + 1,
      component: '',
      description: '',
      qtyDuration: '',
      unitCost: 0,
      totalCost: 0,
      notes: '',
    };
    setFormData(prev => ({
      ...prev,
      costItems: [...prev.costItems, newItem]
    }));
  };

  const removeCostItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      costItems: prev.costItems.filter(item => item.id !== id).map((item, index) => ({
        ...item,
        itemNo: index + 1
      }))
    }));
  };

  const subtotal = formData.costItems.reduce((sum, item) => sum + item.totalCost, 0);
  const contingency = subtotal * (formData.contingencyPercent / 100);
  const grandTotal = subtotal + contingency;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving budget proposal:', { ...formData, subtotal, contingency, grandTotal });
    navigate('/hr/training/budget');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/hr/training/budget" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNew ? 'New Budget Proposal' : 'Edit Budget Proposal'}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 31: Request training budget approval</p>
        </div>
      </div>

      {/* Budget Summary Card */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-primary-600 dark:text-primary-400">Total Budget Request</p>
              <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">${grandTotal.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Subtotal: ${subtotal.toLocaleString()}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Contingency ({formData.contingencyPercent}%): ${contingency.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Training Details */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Training Details</h3>
          </div>
          <div className="p-6 space-y-6">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prepared By *</label>
                <input
                  type="text"
                  value={formData.preparedBy}
                  onChange={(e) => setFormData(prev => ({ ...prev, preparedBy: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Training Purpose & Objectives *</label>
              <textarea
                value={formData.purposeObjectives}
                onChange={(e) => setFormData(prev => ({ ...prev, purposeObjectives: e.target.value }))}
                rows={4}
                placeholder="Describe the purpose and objectives of this training..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cost Breakdown</h3>
            </div>
            <button
              type="button"
              onClick={addCostItem}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" /> Add Item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-12">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Component</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-24">Qty/Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-28">Unit Cost</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-28">Total Cost</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Notes</th>
                  <th className="px-4 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {formData.costItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{item.itemNo}</td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={item.component}
                        onChange={(e) => updateCostItem(item.id, 'component', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateCostItem(item.id, 'description', e.target.value)}
                        placeholder="Description..."
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={item.qtyDuration}
                        onChange={(e) => updateCostItem(item.id, 'qtyDuration', e.target.value)}
                        placeholder="e.g., 2 days"
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input
                          type="number"
                          value={item.unitCost || ''}
                          onChange={(e) => updateCostItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                          className="w-full pl-6 pr-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input
                          type="number"
                          value={item.totalCost || ''}
                          onChange={(e) => updateCostItem(item.id, 'totalCost', parseFloat(e.target.value) || 0)}
                          className="w-full pl-6 pr-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={item.notes}
                        onChange={(e) => updateCostItem(item.id, 'notes', e.target.value)}
                        placeholder="Notes..."
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => removeCostItem(item.id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Subtotal</td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">${subtotal.toLocaleString()}</td>
                  <td colSpan={2}></td>
                </tr>
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Contingency</td>
                  <td className="px-4 py-3">
                    <select
                      value={formData.contingencyPercent}
                      onChange={(e) => setFormData(prev => ({ ...prev, contingencyPercent: parseInt(e.target.value) }))}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                      <option value={5}>5%</option>
                      <option value={10}>10%</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">${contingency.toLocaleString()}</td>
                  <td colSpan={2}></td>
                </tr>
                <tr className="bg-primary-50 dark:bg-primary-900/20">
                  <td colSpan={5} className="px-4 py-3 text-right text-sm font-bold text-primary-700 dark:text-primary-300">TOTAL</td>
                  <td className="px-4 py-3 text-lg font-bold text-primary-700 dark:text-primary-300">${grandTotal.toLocaleString()}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Approval Section */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Signatures & Approval</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Prepared By</h4>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.preparedBy}
                  onChange={(e) => setFormData(prev => ({ ...prev, preparedBy: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Position</label>
                <input
                  type="text"
                  value={formData.preparedByPosition}
                  onChange={(e) => setFormData(prev => ({ ...prev, preparedByPosition: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Approved By</h4>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.approvedBy}
                  onChange={(e) => setFormData(prev => ({ ...prev, approvedBy: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.approvalDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, approvalDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Comments</label>
                <textarea
                  value={formData.approvalComments}
                  onChange={(e) => setFormData(prev => ({ ...prev, approvalComments: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Link to="/hr/training/budget" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </Link>
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Save className="h-4 w-4" />
            Save Budget Proposal
          </button>
        </div>
      </form>
    </div>
  );
};

// Main Component
const TrainingBudget = () => {
  const { id } = useParams();
  return id ? <BudgetForm /> : <BudgetList />;
};

export default TrainingBudget;
