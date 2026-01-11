/**
 * Correspondence View Page
 *
 * Display detailed information about a correspondence record with documents and tracking.
 * Part of Governance module.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  FileText,
  Download,
  Calendar,
  Building2,
  User,
  AlertCircle,
  Clock,
  CheckCircle,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { governanceCorrespondenceDB, governanceBoardMeetingsDB } from '../../../services/db/governanceService';
import type { GovernanceCorrespondenceRecord, GovernanceBoardMeetingRecord } from '../../../types/modules/governance';
import {
  CORRESPONDENCE_DIRECTION_OPTIONS,
  CORRESPONDENCE_STATUS_OPTIONS,
  CORRESPONDENCE_PRIORITY_OPTIONS,
  CORRESPONDENCE_DIRECTION_COLORS,
  CORRESPONDENCE_STATUS_COLORS,
  CORRESPONDENCE_PRIORITY_COLORS,
  getLabel,
  formatDate,
  formatFileSize,
} from '../../../data/governance';

const CorrespondenceView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [correspondence, setCorrespondence] = useState<GovernanceCorrespondenceRecord | null>(null);
  const [relatedMeeting, setRelatedMeeting] = useState<GovernanceBoardMeetingRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await governanceCorrespondenceDB.getById(parseInt(id!));
      setCorrespondence(data);

      // Load related meeting if exists
      if (data.relatedBoardMeetingId) {
        const meeting = await governanceBoardMeetingsDB.getById(data.relatedBoardMeetingId);
        setRelatedMeeting(meeting);
      }
    } catch (error) {
      console.error('Error loading correspondence:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this correspondence?')) {
      try {
        await governanceCorrespondenceDB.delete(parseInt(id!));
        navigate('/governance/correspondence');
      } catch (error) {
        console.error('Error deleting correspondence:', error);
        alert('Failed to delete correspondence');
      }
    }
  };

  const handleDownload = (fileName: string) => {
    // In production, this would download the actual file
    alert(`Download functionality would download: ${fileName}`);
  };

  const getDaysRemaining = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!correspondence) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Correspondence not found
        </h3>
        <Link
          to="/governance/correspondence"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Return to correspondence list
        </Link>
      </div>
    );
  }

  const daysRemaining = correspondence.responseDeadline ? getDaysRemaining(correspondence.responseDeadline) : null;
  const isOverdue = daysRemaining !== null && daysRemaining < 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/governance/correspondence')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Correspondence
        </button>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {correspondence.subject}
              </h2>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full ${
                  CORRESPONDENCE_DIRECTION_COLORS[correspondence.direction]
                }`}
              >
                {correspondence.direction === 'in' ? (
                  <ArrowDown className="h-4 w-4" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
                {getLabel(CORRESPONDENCE_DIRECTION_OPTIONS, correspondence.direction)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Reference: {correspondence.referenceNumber}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/governance/correspondence/${id}/edit`}
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
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {formatDate(correspondence.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reference Number</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {correspondence.referenceNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {correspondence.direction === 'in' ? 'From (Sender)' : 'To (Recipient)'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {correspondence.direction === 'in' ? (
                <>
                  {correspondence.fromOrganization && (
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Organization</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {correspondence.fromOrganization}
                        </p>
                      </div>
                    </div>
                  )}
                  {correspondence.fromPerson && (
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Person</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {correspondence.fromPerson}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {correspondence.toOrganization && (
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Organization</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {correspondence.toOrganization}
                        </p>
                      </div>
                    </div>
                  )}
                  {correspondence.toPerson && (
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Person</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {correspondence.toPerson}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Description */}
          {correspondence.description && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {correspondence.description}
              </p>
            </div>
          )}

          {/* Documents */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Documents ({correspondence.documents?.length || 0})
            </h3>
            {correspondence.documents && correspondence.documents.length > 0 ? (
              <div className="space-y-3">
                {correspondence.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(doc.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(doc.name)}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No documents attached
              </p>
            )}
          </div>

          {/* Related Board Meeting */}
          {relatedMeeting && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Related Board Meeting
              </h3>
              <Link
                to={`/governance/board-meetings/${relatedMeeting.id}`}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(relatedMeeting.meetingDate)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {relatedMeeting.meetingType} - {relatedMeeting.participants.length} participants
                  </p>
                </div>
                <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180" />
              </Link>
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
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Direction</p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                    CORRESPONDENCE_DIRECTION_COLORS[correspondence.direction]
                  }`}
                >
                  {correspondence.direction === 'in' ? (
                    <ArrowDown className="h-3 w-3" />
                  ) : (
                    <ArrowUp className="h-3 w-3" />
                  )}
                  {getLabel(CORRESPONDENCE_DIRECTION_OPTIONS, correspondence.direction)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    CORRESPONDENCE_STATUS_COLORS[correspondence.status]
                  }`}
                >
                  {getLabel(CORRESPONDENCE_STATUS_OPTIONS, correspondence.status)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Priority</p>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    CORRESPONDENCE_PRIORITY_COLORS[correspondence.priority]
                  }`}
                >
                  {getLabel(CORRESPONDENCE_PRIORITY_OPTIONS, correspondence.priority)}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(correspondence.date)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Documents:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {correspondence.documents?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Response Tracking */}
          {correspondence.responseRequired && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Response Tracking
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Response Required</span>
                </div>
                {correspondence.responseDeadline && (
                  <>
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Deadline</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {formatDate(correspondence.responseDeadline)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Days Remaining</p>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${
                          isOverdue
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            : daysRemaining! <= 3
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        }`}
                      >
                        <Clock className="h-4 w-4" />
                        <span className="font-semibold">
                          {isOverdue ? `${Math.abs(daysRemaining!)} days overdue` : `${daysRemaining} days`}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Record Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Record Info
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Created</p>
                <p className="text-gray-900 dark:text-white">{formatDate(correspondence.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Last Updated</p>
                <p className="text-gray-900 dark:text-white">{formatDate(correspondence.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrespondenceView;
