import { useState } from 'react';
import {
  Plus,
  Search,
  FileText,
  Eye,
  Trash2,
  ChevronLeft,
  Save,
  Send,
  Users
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface CommitteeMember {
  id: string;
  staffName: string;
  position: string;
  department: string;
  location: string;
  roleInCommittee: 'chair' | 'technical' | 'hr' | 'member';
  coiSigned: boolean;
  coiDate: string;
}

interface RCFormData {
  establishmentDate: string;
  positionTitles: string;
  project: string;
  members: CommitteeMember[];
  purpose: string;
  accountability: string;
  membershipRequirements: string;
  dutiesResponsibilities: string;
  approvedByED: boolean;
  edSignatureDate: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'active' | 'completed';
}

const RCForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState<RCFormData>({
    establishmentDate: new Date().toISOString().split('T')[0],
    positionTitles: '',
    project: '',
    members: [],
    purpose: 'The Recruitment Committee is established to ensure fair, transparent, and merit-based recruitment processes in accordance with VDO HR policies.',
    accountability: 'The Committee is accountable to the Executive Director and must comply with all organizational recruitment policies and donor requirements.',
    membershipRequirements: 'Committee members must have relevant technical expertise, no conflict of interest with candidates, and be available for all recruitment stages.',
    dutiesResponsibilities: '1. Review and shortlist applications\n2. Prepare and conduct written tests\n3. Conduct interviews\n4. Score and rank candidates\n5. Prepare recruitment report with recommendations',
    approvedByED: false,
    edSignatureDate: '',
    status: 'draft',
  });

  const handleChange = (field: keyof RCFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMember = () => {
    const newMember: CommitteeMember = {
      id: Date.now().toString(),
      staffName: '',
      position: '',
      department: '',
      location: '',
      roleInCommittee: 'member',
      coiSigned: false,
      coiDate: '',
    };
    setFormData(prev => ({ ...prev, members: [...prev.members, newMember] }));
  };

  const updateMember = (id: string, field: keyof CommitteeMember, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === id ? { ...m, [field]: value } : m),
    }));
  };

  const removeMember = (id: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== id),
    }));
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    console.log('Saving RC Form:', formData);
    navigate('/hr/recruitment/committee');
  };

  const roleLabels = {
    chair: 'Chair',
    technical: 'Technical Expert',
    hr: 'HR Representative',
    member: 'Member',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/hr/recruitment/committee"
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Recruitment Committee' : 'New Recruitment Committee'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Form 45: Establish and document recruitment committee
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit('save')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit('submit')}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            <Send className="h-4 w-4" />
            Submit for Approval
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Committee Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Committee Establishment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.establishmentDate}
                  onChange={(e) => handleChange('establishmentDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position Title(s) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.positionTitles}
                  onChange={(e) => handleChange('positionTitles', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Position(s) being recruited"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => handleChange('project', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Project name"
                />
              </div>
            </div>
          </div>

          {/* Committee Members */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Committee Members</h2>
              <button
                onClick={addMember}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600"
              >
                <Plus className="h-4 w-4" />
                Add Member
              </button>
            </div>

            {formData.members.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                No committee members added. Click "Add Member" to add committee members (minimum 3 required).
              </p>
            ) : (
              <div className="space-y-4">
                {formData.members.map((member, index) => (
                  <div key={member.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Member #{index + 1}</span>
                      <button
                        onClick={() => removeMember(member.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Staff Name"
                        value={member.staffName}
                        onChange={(e) => updateMember(member.id, 'staffName', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Position"
                        value={member.position}
                        onChange={(e) => updateMember(member.id, 'position', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Department"
                        value={member.department}
                        onChange={(e) => updateMember(member.id, 'department', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={member.location}
                        onChange={(e) => updateMember(member.id, 'location', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                      <select
                        value={member.roleInCommittee}
                        onChange={(e) => updateMember(member.id, 'roleInCommittee', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      >
                        {Object.entries(roleLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={member.coiSigned}
                            onChange={(e) => updateMember(member.id, 'coiSigned', e.target.checked)}
                            className="rounded border-gray-300 text-primary-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">COI Signed</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Note: All committee members must sign Conflict of Interest (COI) declaration before proceeding with recruitment.
            </p>
          </div>

          {/* Terms of Reference */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Terms of Reference</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Purpose Statement
                </label>
                <textarea
                  value={formData.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Accountability
                </label>
                <textarea
                  value={formData.accountability}
                  onChange={(e) => handleChange('accountability', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Membership Requirements
                </label>
                <textarea
                  value={formData.membershipRequirements}
                  onChange={(e) => handleChange('membershipRequirements', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duties & Responsibilities
                </label>
                <textarea
                  value={formData.dutiesResponsibilities}
                  onChange={(e) => handleChange('dutiesResponsibilities', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* ED Approval */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Executive Director Approval</h2>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.approvedByED}
                    onChange={(e) => handleChange('approvedByED', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Approved by Executive Director</span>
                </label>
                {formData.approvedByED && (
                  <input
                    type="date"
                    value={formData.edSignatureDate}
                    onChange={(e) => handleChange('edSignatureDate', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RCList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recruitment Committees</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 45: Manage recruitment committees</p>
        </div>
        <Link
          to="/hr/recruitment/committee/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Committee
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by position..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Members</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No recruitment committees found</p>
                <Link
                  to="/hr/recruitment/committee/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600"
                >
                  <Plus className="h-4 w-4" />
                  Create New Committee
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RecruitmentCommittee = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <RCForm />;
  return <RCList />;
};

export default RecruitmentCommittee;
