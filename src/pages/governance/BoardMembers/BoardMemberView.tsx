/**
 * Board Member View Page
 *
 * Display detailed information about a board member.
 * Part of Governance module.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Briefcase,
  Building2,
  Mail,
  Phone,
  Calendar,
  FileText,
  Download,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { governanceBoardMembersDB } from '../../../services/db/governanceService';
import type { GovernanceBoardMemberRecord } from '../../../types/modules/governance';
import {
  BOARD_MEMBER_STATUS_OPTIONS,
  BOARD_MEMBER_ROLE_OPTIONS,
  BOARD_MEMBER_STATUS_COLORS,
  BOARD_MEMBER_ROLE_COLORS,
  getLabel,
  formatDate,
  formatDateRange,
  formatFileSize,
} from '../../../data/governance';

const BoardMemberView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [member, setMember] = useState<GovernanceBoardMemberRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await governanceBoardMembersDB.getById(parseInt(id!));
      setMember(data);
    } catch (error) {
      console.error('Error loading board member:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this board member?')) {
      try {
        await governanceBoardMembersDB.delete(parseInt(id!));
        navigate('/governance/board-members');
      } catch (error) {
        console.error('Error deleting member:', error);
        alert('Failed to delete member');
      }
    }
  };

  const handleDownload = (fileName: string) => {
    // In production, this would download the actual file
    alert(`Download functionality would download: ${fileName}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Board member not found
        </h3>
        <Link
          to="/governance/board-members"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Return to board members list
        </Link>
      </div>
    );
  }

  const documents = [
    { key: 'education', label: 'Education Certificate', doc: member.documents?.education },
    { key: 'nid', label: 'National ID (NID)', doc: member.documents?.nid },
    { key: 'picture', label: 'Picture', doc: member.documents?.picture },
    { key: 'passport', label: 'Passport', doc: member.documents?.passport },
    { key: 'cv', label: 'CV / Resume', doc: member.documents?.cv },
    { key: 'profile', label: 'Profile Document', doc: member.documents?.profile },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/governance/board-members')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Board Members
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Board member details and documents
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/governance/board-members/${id}/edit`}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Edit className="h-5 w-5" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 dark:border-red-600 rounded-lg text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{member.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Position</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {member.position}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Organization</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {member.organization}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Board Role Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Board Role
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    BOARD_MEMBER_STATUS_COLORS[member.status]
                  }`}
                >
                  {getLabel(BOARD_MEMBER_STATUS_OPTIONS, member.status)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Role in Board</p>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    BOARD_MEMBER_ROLE_COLORS[member.roleInBoard]
                  }`}
                >
                  {getLabel(BOARD_MEMBER_ROLE_OPTIONS, member.roleInBoard)}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {formatDateRange(member.durationStart, member.durationEnd)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <a
                    href={`mailto:${member.emailId}`}
                    className="text-base font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    {member.emailId}
                  </a>
                </div>
              </div>
              {member.mobileNo && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Mobile</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {member.mobileNo}
                    </p>
                  </div>
                </div>
              )}
              {member.whatsappNo && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">WhatsApp</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {member.whatsappNo}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documents</h3>
            <div className="space-y-3">
              {documents.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.label}
                      </p>
                      {item.doc && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.doc.name} ({formatFileSize(item.doc.size)})
                        </p>
                      )}
                    </div>
                  </div>
                  {item.doc ? (
                    <button
                      onClick={() => handleDownload(item.doc!.name)}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">Not uploaded</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Remarks */}
          {member.remarks && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Remarks</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {member.remarks}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {getLabel(BOARD_MEMBER_STATUS_OPTIONS, member.status)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Role:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {getLabel(BOARD_MEMBER_ROLE_OPTIONS, member.roleInBoard)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatDate(member.durationStart)}
                </span>
              </div>
              {member.durationEnd && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">End Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(member.durationEnd)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Document Checklist */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Document Checklist
            </h3>
            <div className="space-y-2">
              {documents.map((item) => (
                <div key={item.key} className="flex items-center gap-2">
                  {item.doc ? (
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                  )}
                  <span
                    className={`text-sm ${
                      item.doc
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Completion:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {documents.filter((d) => d.doc).length}/{documents.length}
                </span>
              </div>
            </div>
          </div>

          {/* Record Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Record Info
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Created</p>
                <p className="text-gray-900 dark:text-white">{formatDate(member.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Last Updated</p>
                <p className="text-gray-900 dark:text-white">{formatDate(member.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardMemberView;
