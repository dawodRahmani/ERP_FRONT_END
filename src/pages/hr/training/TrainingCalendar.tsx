import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, ChevronLeft, ChevronRight, Calendar, Search, Filter, Edit2, Trash2, X } from 'lucide-react';

interface TrainingEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  trainer: string;
  location: string;
  participants: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  color: string;
}

interface CalendarData {
  year: number;
  organizationName: string;
  preparedBy: string;
  preparedByPosition: string;
  approvedBy: string;
  approvedByPosition: string;
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// List Component
const CalendarList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());

  const calendars = [
    { id: '1', year: 2024, organizationName: 'VDO', totalEvents: 24, preparedBy: 'HR Department', status: 'approved' },
    { id: '2', year: 2023, organizationName: 'VDO', totalEvents: 28, preparedBy: 'HR Department', status: 'approved' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Training Calendars</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 30: Plan annual training schedule</p>
        </div>
        <Link to="/hr/training/calendar/new" className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> New Calendar
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search calendars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Years</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Year</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Organization</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total Events</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Prepared By</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {calendars.map((calendar) => (
                <tr key={calendar.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{calendar.year}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{calendar.organizationName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{calendar.totalEvents} trainings</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{calendar.preparedBy}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {calendar.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/hr/training/calendar/${calendar.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
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

// Calendar Form/View Component
const CalendarForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<CalendarData>({
    year: new Date().getFullYear(),
    organizationName: 'Voice of Deprived Organization (VDO)',
    preparedBy: '',
    preparedByPosition: '',
    approvedBy: '',
    approvedByPosition: '',
  });

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<TrainingEvent | null>(null);

  const [events, setEvents] = useState<TrainingEvent[]>([
    { id: '1', title: 'PSEAH Training', description: 'Prevention of Sexual Exploitation, Abuse and Harassment', startDate: '2024-01-15', endDate: '2024-01-16', trainer: 'External Consultant', location: 'Kabul Office', participants: 25, status: 'completed', color: 'bg-blue-500' },
    { id: '2', title: 'First Aid Training', description: 'Basic first aid and emergency response', startDate: '2024-02-20', endDate: '2024-02-21', trainer: 'Red Crescent', location: 'Kabul Office', participants: 30, status: 'completed', color: 'bg-green-500' },
    { id: '3', title: 'Project Management', description: 'Advanced project management techniques', startDate: '2024-03-10', endDate: '2024-03-12', trainer: 'Internal', location: 'Online', participants: 20, status: 'scheduled', color: 'bg-purple-500' },
    { id: '4', title: 'Financial Management', description: 'Budget management and reporting', startDate: '2024-04-05', endDate: '2024-04-06', trainer: 'Finance Team', location: 'Kabul Office', participants: 15, status: 'scheduled', color: 'bg-yellow-500' },
  ]);

  const [newEvent, setNewEvent] = useState<Partial<TrainingEvent>>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    trainer: '',
    location: '',
    participants: 0,
    status: 'scheduled',
    color: 'bg-blue-500',
  });

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const currentDate = new Date(date);
      return currentDate >= eventStart && currentDate <= eventEnd;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(formData.year, currentMonth);
    const firstDay = getFirstDayOfMonth(formData.year, currentMonth);
    const days = [];

    // Empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 dark:bg-gray-800/50" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${formData.year}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = getEventsForDate(dateStr);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 dark:border-gray-700 p-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
            isToday ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-white dark:bg-gray-800'
          }`}
          onClick={() => {
            setSelectedDate(dateStr);
            setNewEvent(prev => ({ ...prev, startDate: dateStr, endDate: dateStr }));
            setShowEventModal(true);
          }}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
            {day}
          </div>
          <div className="space-y-1 overflow-hidden">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                className={`${event.color} text-white text-xs px-1 py-0.5 rounded truncate`}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingEvent(event);
                  setNewEvent(event);
                  setShowEventModal(true);
                }}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const handleSaveEvent = () => {
    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...newEvent, id: editingEvent.id } as TrainingEvent : e));
    } else {
      const newId = String(events.length + 1);
      setEvents(prev => [...prev, { ...newEvent, id: newId } as TrainingEvent]);
    }
    setShowEventModal(false);
    setEditingEvent(null);
    setNewEvent({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      trainer: '',
      location: '',
      participants: 0,
      status: 'scheduled',
      color: 'bg-blue-500',
    });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving calendar:', { ...formData, events });
    navigate('/hr/training/calendar');
  };

  const colorOptions = [
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-yellow-500', label: 'Yellow' },
    { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-pink-500', label: 'Pink' },
    { value: 'bg-indigo-500', label: 'Indigo' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/hr/training/calendar" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNew ? 'New Training Calendar' : `Training Calendar ${formData.year}`}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Form 30: Plan annual training schedule</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Header Information */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Calendar Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Organization Name</label>
                <input
                  type="text"
                  value={formData.organizationName}
                  onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year *</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  {[2022, 2023, 2024, 2025, 2026].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Trainings</label>
                <div className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white">
                  {events.length} scheduled
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setCurrentMonth(prev => prev === 0 ? 11 : prev - 1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {months[currentMonth]} {formData.year}
              </h3>
              <button
                type="button"
                onClick={() => setCurrentMonth(prev => prev === 11 ? 0 : prev + 1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedDate(new Date().toISOString().split('T')[0]);
                setShowEventModal(true);
              }}
              className="inline-flex items-center gap-2 px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" /> Add Training
            </button>
          </div>
          <div className="p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0">
              {renderCalendar()}
            </div>
          </div>
        </div>

        {/* Upcoming Trainings List */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Scheduled Trainings</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {events.map(event => (
              <div key={event.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${event.color}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {event.startDate} - {event.endDate} | {event.location} | {event.participants} participants
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    event.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    event.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    event.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {event.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEvent(event);
                      setNewEvent(event);
                      setShowEventModal(true);
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                  >
                    <Edit2 className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signatures */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Signatures</h3>
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
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Position</label>
                <input
                  type="text"
                  value={formData.approvedByPosition}
                  onChange={(e) => setFormData(prev => ({ ...prev, approvedByPosition: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Link to="/hr/training/calendar" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </Link>
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Save className="h-4 w-4" />
            Save Calendar
          </button>
        </div>
      </form>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingEvent ? 'Edit Training' : 'Add Training'}
              </h3>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setEditingEvent(null);
                  setNewEvent({
                    title: '',
                    description: '',
                    startDate: '',
                    endDate: '',
                    trainer: '',
                    location: '',
                    participants: 0,
                    status: 'scheduled',
                    color: 'bg-blue-500',
                  });
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Training Title *</label>
                <input
                  type="text"
                  value={newEvent.title || ''}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={newEvent.description || ''}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={newEvent.startDate || ''}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date *</label>
                  <input
                    type="date"
                    value={newEvent.endDate || ''}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trainer</label>
                  <input
                    type="text"
                    value={newEvent.trainer || ''}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, trainer: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={newEvent.location || ''}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Participants</label>
                  <input
                    type="number"
                    value={newEvent.participants || 0}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, participants: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select
                    value={newEvent.status || 'scheduled'}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, status: e.target.value as TrainingEvent['status'] }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                <div className="flex gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewEvent(prev => ({ ...prev, color: color.value }))}
                      className={`w-8 h-8 rounded-full ${color.value} ${
                        newEvent.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800' : ''
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              {editingEvent && (
                <button
                  type="button"
                  onClick={() => handleDeleteEvent(editingEvent.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    setShowEventModal(false);
                    setEditingEvent(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEvent}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
const TrainingCalendar = () => {
  const { id } = useParams();
  return id ? <CalendarForm /> : <CalendarList />;
};

export default TrainingCalendar;
