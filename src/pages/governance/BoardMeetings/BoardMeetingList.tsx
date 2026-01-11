/**
 * Board Meeting List Page
 *
 * Displays board meetings with document completion tracking.
 * Part of Governance module.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar as CalendarIcon, Users, CheckCircle } from 'lucide-react';
import { governanceBoardMeetingsDB, governanceBoardMembersDB } from '../../../services/db/governanceService';
import type { GovernanceBoardMeetingRecord } from '../../../types/modules/governance';
import { BOARD_MEETING_TYPE_OPTIONS, BOARD_MEETING_TYPE_COLORS, getLabel, formatDate } from '../../../data/governance';

const BoardMeetingList = () => {
  const [meetings, setMeetings] = useState<GovernanceBoardMeetingRecord[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<GovernanceBoardMeetingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterYear, filterType, meetings]);

  const loadData = async () => {
    try {
      setLoading(true);
      const meetingsData = await governanceBoardMeetingsDB.getAll();
      setMeetings(meetingsData);
      setFilteredMeetings(meetingsData);
    } catch (error) {
      console.error('Error loading meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...meetings];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.location?.toLowerCase().includes(term) ||
          m.participantNames?.some((p) => p.toLowerCase().includes(term))
      );
    }

    if (filterYear) {
      filtered = filtered.filter((m) => m.year.toString() === filterYear);
    }

    if (filterType) {
      filtered = filtered.filter((m) => m.meetingType === filterType);
    }

    setFilteredMeetings(filtered);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await governanceBoardMeetingsDB.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting meeting:', error);
        alert('Failed to delete meeting');
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterYear('');
    setFilterType('');
  };

  const stats = {
    total: meetings.length,
    thisYear: meetings.filter((m) => m.year === new Date().getFullYear()).length,
    complete: meetings.filter((m) => governanceBoardMeetingsDB.calculateCompletionPercentage(m) === 100).length,
  };

  const years = [...new Set(meetings.map((m) => m.year))].sort((a, b) => b - a);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-600 dark:text-gray-400">Loading...</div></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Board Meetings</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage board meetings with participants and documents
            </p>
          </div>
          <Link
            to="/governance/board-meetings/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Meeting
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Meetings</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.thisYear}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">This Year</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.complete}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Complete Docs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location or participants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
                <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Years</option>
                  {years.map((year) => (<option key={year} value={year}>{year}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Types</option>
                  {BOARD_MEETING_TYPE_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={clearFilters} className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Clear Filters</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {filteredMeetings.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No meetings found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{searchTerm || filterYear || filterType ? 'Try adjusting your filters' : 'Get started by adding your first board meeting'}</p>
            {!searchTerm && !filterYear && !filterType && (<Link to="/governance/board-meetings/new" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Plus className="h-5 w-5" />Add Meeting</Link>)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Participants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completion</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMeetings.map((meeting) => {
                  const completion = governanceBoardMeetingsDB.calculateCompletionPercentage(meeting);
                  return (
                    <tr key={meeting.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(meeting.meetingDate)}</div>{meeting.location && (<div className="text-sm text-gray-500 dark:text-gray-400">{meeting.location}</div>)}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900 dark:text-white">{meeting.year}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${BOARD_MEETING_TYPE_COLORS[meeting.meetingType]}`}>{getLabel(BOARD_MEETING_TYPE_OPTIONS, meeting.meetingType)}</span></td>
                      <td className="px-6 py-4"><div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400"><Users className="h-4 w-4" />{meeting.participants.length}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-2"><div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className={`h-2 rounded-full ${completion === 100 ? 'bg-green-600' : 'bg-blue-600'}`} style={{ width: `${completion}%` }}></div></div><span className="text-sm text-gray-600 dark:text-gray-400">{completion}%</span></div></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div className="flex items-center justify-end gap-2"><Link to={`/governance/board-meetings/${meeting.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="View"><Eye className="h-5 w-5" /></Link><Link to={`/governance/board-meetings/${meeting.id}/edit`} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300" title="Edit"><Edit className="h-5 w-5" /></Link><button onClick={() => handleDelete(meeting.id!)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete"><Trash2 className="h-5 w-5" /></button></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredMeetings.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          Showing {filteredMeetings.length} of {meetings.length} meetings
        </div>
      )}
    </div>
  );
};

export default BoardMeetingList;
