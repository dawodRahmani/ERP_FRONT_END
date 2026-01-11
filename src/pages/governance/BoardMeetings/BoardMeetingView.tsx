/**
 * Board Meeting View Page
 *
 * Display detailed information about a board meeting with participants and documents.
 * Part of Governance module.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  Users,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  Target,
  ListChecks,
} from 'lucide-react';
import { governanceBoardMeetingsDB, governanceBoardMembersDB } from '../../../services/db/governanceService';
import type { GovernanceBoardMeetingRecord, GovernanceBoardMemberRecord } from '../../../types/modules/governance';
import {
  BOARD_MEETING_TYPE_OPTIONS,
  BOARD_MEETING_TYPE_COLORS,
  getLabel,
  formatDate,
  formatFileSize,
} from '../../../data/governance';

const BoardMeetingView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [meeting, setMeeting] = useState<GovernanceBoardMeetingRecord | null>(null);
  const [participants, setParticipants] = useState<GovernanceBoardMemberRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const meetingData = await governanceBoardMeetingsDB.getById(parseInt(id!));
      setMeeting(meetingData);

      // Load participant details
      if (meetingData.participants && meetingData.participants.length > 0) {
        const participantRecords = await Promise.all(
          meetingData.participants.map((participantId) =>
            governanceBoardMembersDB.getById(participantId)
          )
        );
        setParticipants(participantRecords.filter((p) => p !== null) as GovernanceBoardMemberRecord[]);
      }
    } catch (error) {
      console.error('Error loading meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await governanceBoardMeetingsDB.delete(parseInt(id!));
        navigate('/governance/board-meetings');
      } catch (error) {
        console.error('Error deleting meeting:', error);
        alert('Failed to delete meeting');
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

  if (!meeting) {
    return (
      <div className="text-center py-12">
        <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Board meeting not found
        </h3>
        <Link
          to="/governance/board-meetings"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Return to board meetings list
        </Link>
      </div>
    );
  }

  const documents = [
    { key: 'minute', label: 'Minute of Meeting', doc: meeting.documents?.minute },
    { key: 'agenda', label: 'Meeting Agenda', doc: meeting.documents?.agenda },
    { key: 'workPlan', label: 'Work Plan', doc: meeting.documents?.workPlan },
    { key: 'performanceEvaluation', label: 'Performance Evaluation', doc: meeting.documents?.performanceEvaluation },
    { key: 'attendanceSheet', label: 'Attendance Sheet', doc: meeting.documents?.attendanceSheet },
  ];

  const pictures = meeting.documents?.pictures || [];
  const completionPercentage = governanceBoardMeetingsDB.calculateCompletionPercentage(meeting);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/governance/board-meetings')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Board Meetings
        </button>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Board Meeting - {formatDate(meeting.meetingDate)}
              </h2>
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  BOARD_MEETING_TYPE_COLORS[meeting.meetingType]
                }`}
              >
                {getLabel(BOARD_MEETING_TYPE_OPTIONS, meeting.meetingType)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Meeting details, participants, and documents
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/governance/board-meetings/${id}/edit`}
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
          {/* Meeting Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Meeting Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Meeting Date</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {formatDate(meeting.meetingDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Year</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {meeting.year}
                  </p>
                </div>
              </div>
              {meeting.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {meeting.location}
                    </p>
                  </div>
                </div>
              )}
              {meeting.nextMeetingDate && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Next Meeting</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {formatDate(meeting.nextMeetingDate)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Participants */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participants ({participants.length})
            </h3>
            <div className="space-y-3">
              {participants.map((participant) => (
                <Link
                  key={participant.id}
                  to={`/governance/board-members/${participant.id}`}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {participant.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {participant.position} - {participant.organization}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                    {participant.roleInBoard}
                  </span>
                </Link>
              ))}
              {participants.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No participants recorded
                </p>
              )}
            </div>
          </div>

          {/* Agenda */}
          {meeting.agenda && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Agenda
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {meeting.agenda}
              </p>
            </div>
          )}

          {/* Minutes */}
          {meeting.minutes && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Minutes
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {meeting.minutes}
              </p>
            </div>
          )}

          {/* Decisions */}
          {meeting.decisions && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Decisions
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {meeting.decisions}
              </p>
            </div>
          )}

          {/* Action Items */}
          {meeting.actionItems && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                Action Items
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {meeting.actionItems}
              </p>
            </div>
          )}

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

          {/* Meeting Pictures */}
          {pictures.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Meeting Pictures ({pictures.length})
              </h3>
              <div className="space-y-3">
                {pictures.map((picture, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {picture.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(picture.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(picture.name)}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
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
                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {getLabel(BOARD_MEETING_TYPE_OPTIONS, meeting.meetingType)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatDate(meeting.meetingDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Year:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {meeting.year}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Participants:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {participants.length}
                </span>
              </div>
              {meeting.nextMeetingDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Next Meeting:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(meeting.nextMeetingDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Participants Quick List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Participants
            </h3>
            <div className="space-y-2">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between">
                  <Link
                    to={`/governance/board-members/${participant.id}`}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
                  >
                    {participant.name}
                  </Link>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded">
                    {participant.roleInBoard}
                  </span>
                </div>
              ))}
              {participants.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                  No participants
                </p>
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
              <div className="flex items-center gap-2">
                {pictures.length > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                )}
                <span
                  className={`text-sm ${
                    pictures.length > 0
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  Meeting Pictures ({pictures.length})
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Completion:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    completionPercentage === 100 ? 'bg-green-600' : 'bg-blue-600'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                ></div>
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
                <p className="text-gray-900 dark:text-white">{formatDate(meeting.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Last Updated</p>
                <p className="text-gray-900 dark:text-white">{formatDate(meeting.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardMeetingView;
