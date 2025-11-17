import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Navigation from '../components/Navigation';
import calendarService from '../services/calendarService';
import applicationService from '../services/applicationService';
import { 
  BellIcon,
  UserCircleIcon,
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  CheckCircleIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const CalendarPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingInterview, setEditingInterview] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Fetch calendar events on component mount and when month changes
  useEffect(() => {
    fetchCalendarEvents();
  }, [currentDate]);

  const fetchCalendarEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get start and end of current month
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      console.log('Fetching calendar events from', startDate.toISOString().split('T')[0], 'to', endDate.toISOString().split('T')[0]);
      
      const response = await calendarService.getCalendarEvents({
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      });
      
      console.log('Calendar events response:', response);
      
      // Backend returns interviews and deadlines directly as arrays wrapped in data property
      const interviewsData = response.interviews?.data || response.interviews || [];
      const deadlinesData = response.deadlines?.data || response.deadlines || [];
      
      console.log('Setting interviews:', interviewsData);
      console.log('Setting deadlines:', deadlinesData);
      
      setInterviews(interviewsData);
      setDeadlines(deadlinesData);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      console.error('Error details:', err.response?.data);
      setError('Failed to load calendar events.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for fallback (will be removed once backend is integrated)
  const mockInterviews = [
    {
      id: 1,
      company: 'Google LLC',
      position: 'Senior Frontend Developer',
      date: '2025-11-16',
      time: '10:00 AM',
      duration: '1 hour',
      type: 'video',
      interviewType: 'Technical Interview',
      interviewer: 'Sarah Johnson',
      location: 'Google Meet',
      notes: 'Prepare React and TypeScript questions',
      status: 'upcoming'
    },
    {
      id: 2,
      company: 'Microsoft',
      position: 'Full Stack Engineer',
      date: '2025-11-18',
      time: '2:00 PM',
      duration: '45 minutes',
      type: 'video',
      interviewType: 'HR Round',
      interviewer: 'Michael Chen',
      location: 'Microsoft Teams',
      notes: 'Discuss salary expectations and benefits',
      status: 'upcoming'
    },
    {
      id: 3,
      company: 'Meta',
      position: 'React Developer',
      date: '2025-11-20',
      time: '11:30 AM',
      duration: '2 hours',
      type: 'video',
      interviewType: 'System Design',
      interviewer: 'Emily Davis',
      location: 'Zoom',
      notes: 'Design a scalable social media feed',
      status: 'upcoming'
    },
    {
      id: 4,
      company: 'Apple',
      position: 'iOS Developer',
      date: '2025-11-22',
      time: '9:00 AM',
      duration: '1.5 hours',
      type: 'in-person',
      interviewType: 'Final Round',
      interviewer: 'David Wilson',
      location: 'Apple Park, Cupertino, CA',
      notes: 'Bring portfolio and government ID',
      status: 'upcoming'
    },
    {
      id: 5,
      company: 'Amazon',
      position: 'Software Development Engineer',
      date: '2025-11-12',
      time: '3:00 PM',
      duration: '1 hour',
      type: 'phone',
      interviewType: 'Phone Screening',
      interviewer: 'Lisa Brown',
      location: 'Phone Call',
      notes: 'Discuss leadership principles',
      status: 'completed'
    }
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getInterviewsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return interviews.filter(interview => {
      const interviewDate = interview.interview_date ? new Date(interview.interview_date).toISOString().split('T')[0] : null;
      return interviewDate === dateStr;
    });
  };

  const getDeadlinesForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return deadlines.filter(deadline => {
      const deadlineDate = deadline.deadline ? new Date(deadline.deadline).toISOString().split('T')[0] : null;
      return deadlineDate === dateStr;
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const today = new Date();
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const upcomingInterviews = interviews
    .filter(i => {
      if (!i.interview_date) return false;
      const interviewDate = new Date(i.interview_date);
      return interviewDate >= new Date();
    })
    .sort((a, b) => new Date(a.interview_date) - new Date(b.interview_date));

  const getInterviewTypeStyle = (type) => {
    const style = calendarService.getInterviewTypeStyle(type);
    return `${style.bgColor} ${style.color} ${style.borderColor}`;
  };

  const getInterviewIcon = (type) => {
    switch (type) {
      case 'video':
        return VideoCameraIcon;
      case 'phone':
        return PhoneIcon;
      case 'in-person':
        return MapPinIcon;
      default:
        return CalendarIcon;
    }
  };

  // Format time for display
  const formatTimeDisplay = (timeStr) => {
    if (!timeStr) return 'Time TBD';
    
    // If already in readable format (e.g., "10:00 AM"), return as is
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      return timeStr;
    }
    
    // If in 24-hour format (e.g., "14:30"), convert to 12-hour
    if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
      try {
        const [hours, minutes] = timeStr.split(':');
        let hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        
        if (hour === 0) {
          hour = 12;
        } else if (hour > 12) {
          hour -= 12;
        }
        
        return `${hour}:${minutes} ${period}`;
      } catch (e) {
        return timeStr;
      }
    }
    
    return timeStr;
  };

  // Edit Interview Modal Component
  const EditInterviewModal = ({ interview, onClose }) => {
    // Convert time to HH:MM format if it's in 12-hour format
    const convertTimeTo24Hour = (timeStr) => {
      if (!timeStr) return '';
      
      // If already in HH:MM format (24-hour), return as is
      if (/^\d{2}:\d{2}$/.test(timeStr)) {
        return timeStr;
      }
      
      // If in 12-hour format like "10:00 AM" or "2:30 PM"
      if (timeStr.includes('AM') || timeStr.includes('PM')) {
        try {
          const [time, period] = timeStr.split(' ');
          let [hours, minutes] = time.split(':');
          hours = parseInt(hours);
          
          if (period === 'PM' && hours !== 12) {
            hours += 12;
          } else if (period === 'AM' && hours === 12) {
            hours = 0;
          }
          
          return `${hours.toString().padStart(2, '0')}:${minutes}`;
        } catch (e) {
          console.error('Error converting time:', e);
          return '';
        }
      }
      
      return timeStr;
    };

    const [interviewData, setInterviewData] = useState({
      interview_date: interview?.interview_date ? new Date(interview.interview_date).toISOString().split('T')[0] : '',
      interview_time: convertTimeTo24Hour(interview?.interview_time) || '',
      interview_location: interview?.interview_location || '',
      interview_type: interview?.interview_type || '',
      interviewer_name: interview?.interviewer_name || '',
      interview_notes: interview?.interview_notes || ''
    });

    console.log('Editing interview:', interview);
    console.log('Interview data state:', interviewData);
    const [saving, setSaving] = useState(false);
    const [modalError, setModalError] = useState(null);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setInterviewData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        setSaving(true);
        setModalError(null);

        console.log('Updating interview:', interviewData);

        await applicationService.updateApplication(interview.id, {
          ...interview,
          ...interviewData
        });

        console.log('Interview updated successfully');

        // Close modal and refresh
        onClose();
        await fetchCalendarEvents();
      } catch (err) {
        console.error('Error updating interview:', err);
        setModalError(err.response?.data?.message || 'Failed to update interview');
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">✏️ Edit Interview</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {modalError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {modalError}
              </div>
            )}

            {/* Application Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{interview.position}</h3>
              <p className="text-gray-700">{interview.company}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {interview.status}
              </span>
            </div>

            {/* Interview Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="interview_date"
                  value={interviewData.interview_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Time
                </label>
                <input
                  type="time"
                  name="interview_time"
                  value={interviewData.interview_time}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Type
                </label>
                <select
                  name="interview_type"
                  value={interviewData.interview_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">Select type...</option>
                  <option value="video">📹 Video Call</option>
                  <option value="phone">📞 Phone Call</option>
                  <option value="in-person">🏢 In Person</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interviewer Name
                </label>
                <input
                  type="text"
                  name="interviewer_name"
                  value={interviewData.interviewer_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="e.g., John Smith"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Location / Meeting Link
                </label>
                <input
                  type="text"
                  name="interview_location"
                  value={interviewData.interview_location}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="e.g., Zoom link or office address"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Notes
                </label>
                <textarea
                  name="interview_notes"
                  value={interviewData.interview_notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  placeholder="Preparation notes, questions to ask, etc..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Add Interview Modal Component
  const AddInterviewModal = () => {
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [interviewData, setInterviewData] = useState({
      interview_date: '',
      interview_time: '',
      interview_location: '',
      interview_type: '',
      interviewer_name: '',
      interview_notes: ''
    });
    const [saving, setSaving] = useState(false);
    const [modalError, setModalError] = useState(null);
    const [modalApplications, setModalApplications] = useState([]);
    const [modalLoading, setModalLoading] = useState(true);

    useEffect(() => {
      const loadApps = async () => {
        try {
          setModalLoading(true);
          console.log('Fetching applications...');
          const response = await applicationService.getApplications();
          console.log('Applications response:', response);
          const appData = response.data || response || [];
          console.log('Setting applications:', appData);
          setModalApplications(appData);
        } catch (err) {
          console.error('Error fetching applications:', err);
          setModalError('Failed to load applications: ' + (err.response?.data?.message || err.message));
        } finally {
          setModalLoading(false);
        }
      };
      
      loadApps();
    }, []);

    const handleApplicationSelect = (appId) => {
      const app = modalApplications.find(a => a.id === parseInt(appId));
      setSelectedApplication(app);
      // Pre-fill if application already has interview data
      if (app) {
        setInterviewData({
          interview_date: app.interview_date ? new Date(app.interview_date).toISOString().split('T')[0] : '',
          interview_time: app.interview_time || '',
          interview_location: app.interview_location || '',
          interview_type: app.interview_type || '',
          interviewer_name: app.interviewer_name || '',
          interview_notes: app.interview_notes || ''
        });
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setInterviewData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!selectedApplication) {
        setModalError('Please select an application');
        return;
      }

      try {
        setSaving(true);
        setModalError(null);
        
        console.log('Updating application with interview:', {
          ...selectedApplication,
          ...interviewData,
          status: 'Interview'
        });

        const response = await applicationService.updateApplication(selectedApplication.id, {
          ...selectedApplication,
          ...interviewData,
          status: 'Interview' // Update status to Interview
        });

        console.log('Interview scheduled successfully:', response);

        // Close modal first
        setShowAddModal(false);
        
        // Refresh calendar events
        console.log('Refreshing calendar...');
        await fetchCalendarEvents();
        
        // Reset state
        setSelectedApplication(null);
        setInterviewData({
          interview_date: '',
          interview_time: '',
          interview_location: '',
          interview_type: '',
          interviewer_name: '',
          interview_notes: ''
        });
      } catch (err) {
        console.error('Error scheduling interview:', err);
        console.error('Error response:', err.response?.data);
        setModalError(err.response?.data?.message || 'Failed to schedule interview');
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">📅 Schedule Interview</h2>
            <button
              onClick={() => {
                setShowAddModal(false);
                setSelectedApplication(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {modalError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {modalError}
              </div>
            )}

            {/* Step 1: Select Application */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Application <span className="text-red-500">*</span>
              </label>
              {modalLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin h-6 w-6 border-2 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Loading applications...</p>
                </div>
              ) : modalApplications.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">No applications found. Please create an application first.</p>
                  <Link
                    to="/applications"
                    className="inline-block mt-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Go to Applications →
                  </Link>
                </div>
              ) : (
                <select
                  value={selectedApplication?.id || ''}
                  onChange={(e) => handleApplicationSelect(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Choose an application...</option>
                  {modalApplications.map(app => (
                    <option key={app.id} value={app.id}>
                      {app.position} at {app.company} ({app.status})
                    </option>
                  ))}
                </select>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Select the job application you want to schedule an interview for
              </p>
            </div>

            {/* Step 2: Interview Details (shown after selecting application) */}
            {selectedApplication && (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interview Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="interview_date"
                        value={interviewData.interview_date}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Time
                </label>
                <input
                  type="time"
                  name="interview_time"
                  value={interviewData.interview_time}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interview Type
                      </label>
                      <select
                        name="interview_type"
                        value={interviewData.interview_type}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      >
                        <option value="">Select type...</option>
                        <option value="video">📹 Video Call</option>
                        <option value="phone">📞 Phone Call</option>
                        <option value="in-person">🏢 In Person</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interviewer Name
                      </label>
                      <input
                        type="text"
                        name="interviewer_name"
                        value={interviewData.interviewer_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="e.g., John Smith"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interview Location / Meeting Link
                      </label>
                      <input
                        type="text"
                        name="interview_location"
                        value={interviewData.interview_location}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="e.g., Zoom link or office address"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interview Notes
                      </label>
                      <textarea
                        name="interview_notes"
                        value={interviewData.interview_notes}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                        placeholder="Preparation notes, questions to ask, etc..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedApplication(null);
                    }}
                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Scheduling...' : 'Schedule Interview'}
                  </button>
                </div>
              </>
            )}

            {!selectedApplication && (
              <div className="text-center py-8 text-gray-500">
                👆 Please select an application to continue
              </div>
            )}
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Navigation Header */}
      <Navigation />
      {/* Mobile Menu Button (Hamburger) - Professional look */}
      {!isMobileMenuOpen && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 border border-gray-200 bg-white shadow-lg rounded-full fixed top-4 left-4 z-50 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:border-primary-400 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-300"
          aria-label="Open mobile menu"
        >
          <Bars3Icon className="h-7 w-7 text-primary-600 transition-colors duration-200" />
        </button>
      )}
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden flex flex-col overflow-y-auto">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 border border-gray-200 bg-white shadow-lg rounded-full transition-all duration-200 hover:scale-105 hover:border-primary-400 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-300"
              aria-label="Close mobile menu"
            >
              <XMarkIcon className="h-7 w-7 text-primary-600 transition-colors duration-200" />
            </button>
          </div>
          <div className="px-4 py-4 space-y-2 flex-1">
            <Link 
              to="/dashboard" 
              className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/applications" 
              className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Applications
            </Link>
            <Link 
              to="/kanban" 
              className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kanban
            </Link>
            <Link 
              to="/documents" 
              className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Documents
            </Link>
            <Link 
              to="/analytics" 
              className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Analytics
            </Link>
            <Link 
              to="/job-search" 
              className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Job Search
            </Link>
            <Link 
              to="/ai-analyzer" 
              className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              AI Analyzer
            </Link>
            <Link 
              to="/calendar" 
              className="block px-4 py-3 text-primary-600 bg-primary-50 rounded-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Calendar
            </Link>
            <Link 
              to="/settings" 
              className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Settings
            </Link>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <Link 
                to="/profile" 
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserCircleIcon className="h-6 w-6 text-primary-600" />
                {user?.name || 'Profile'}
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interview Calendar</h1>
            <p className="text-gray-600 mt-1">Schedule and manage your upcoming interviews</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <PlusIcon className="h-5 w-5" />
            Add Interview
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={previousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day Names */}
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}

                {/* Empty cells for days before month starts */}
                {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square"></div>
                ))}

                {/* Calendar Days */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const dateStr = date.toISOString().split('T')[0];
                  const dayInterviews = getInterviewsForDate(date);
                  const dayDeadlines = getDeadlinesForDate(date);
                  const hasEvents = dayInterviews.length > 0 || dayDeadlines.length > 0;
                  const isToday = 
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();

                  return (
                    <div
                      key={day}
                      className={`aspect-square border rounded-lg p-2 cursor-pointer transition-all hover:border-primary-500 hover:shadow-md ${
                        isToday ? 'bg-primary-50 border-primary-600' : 'border-gray-200'
                      } ${hasEvents ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className="flex flex-col h-full">
                        <span className={`text-sm font-medium ${
                          isToday ? 'text-primary-600' : 'text-gray-900'
                        }`}>
                          {day}
                        </span>
                        {hasEvents && (
                          <div className="mt-1 space-y-1">
                            {dayInterviews.slice(0, 1).map(interview => (
                              <div
                                key={interview.id}
                                className="text-xs bg-primary-600 text-white px-1 py-0.5 rounded truncate"
                                title={`${interview.interview_time || 'TBD'} - ${interview.company}`}
                              >
                                📅 {interview.interview_time || 'TBD'}
                              </div>
                            ))}
                            {dayDeadlines.slice(0, 1).map(deadline => (
                              <div
                                key={deadline.id}
                                className="text-xs bg-orange-600 text-white px-1 py-0.5 rounded truncate"
                                title={`Deadline - ${deadline.company}`}
                              >
                                ⏰ Deadline
                              </div>
                            ))}
                            {(dayInterviews.length + dayDeadlines.length) > 2 && (
                              <div className="text-xs text-gray-600 font-medium">
                                +{(dayInterviews.length + dayDeadlines.length) - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary-50 border border-primary-600 rounded"></div>
                  <span className="text-gray-600">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-50 border border-gray-200 rounded"></div>
                  <span className="text-gray-600">Has Interviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Interviews Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Interviews</h3>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-gray-600 text-sm">Loading...</p>
                </div>
              ) : upcomingInterviews.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">No upcoming interviews</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {upcomingInterviews.map((interview) => {
                    const Icon = getInterviewIcon(interview.interview_type);
                    
                    return (
                      <div
                        key={interview.id}
                        className={`border-2 rounded-lg p-4 ${getInterviewTypeStyle(interview.interview_type)}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{interview.company}</h4>
                            <p className="text-sm text-gray-700">{interview.position}</p>
                          </div>
                          <Icon className="h-5 w-5 flex-shrink-0" />
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-700 mb-3">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            {calendarService.formatDate(interview.interview_date)}
                          </div>
                          <div className="flex items-center gap-2">
                            <ClockIcon className="h-4 w-4" />
                            {formatTimeDisplay(interview.interview_time)}
                          </div>
                          {interview.interview_location && (
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {interview.interview_location}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/applications`}
                            className="flex-1 px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
                          >
                            View Details
                          </Link>
                          {interview.interview_type === 'video' && interview.interview_location && (
                            <a
                              href={interview.interview_location}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors text-center"
                            >
                              Join Meeting
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interview List Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Interviews</h2>
          
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="animate-spin h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading interviews...</p>
            </div>
          ) : interviews.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Interviews Scheduled</h3>
              <p className="text-gray-600 mb-4">
                You haven't scheduled any interviews yet. Add interview details to your applications to see them here.
              </p>
              <Link
                to="/applications"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all"
              >
                Go to Applications
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {interviews.map((interview) => {
                const Icon = getInterviewIcon(interview.interview_type);
                const isPast = calendarService.isPast(interview.interview_date);
                
                return (
                  <div
                    key={interview.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getInterviewTypeStyle(interview.interview_type)}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{interview.company}</h3>
                            <p className="text-gray-600">{interview.position}</p>
                          </div>
                          {isPast ? (
                            <span className="ml-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                              Past
                            </span>
                          ) : calendarService.isToday(interview.interview_date) ? (
                            <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                              Today
                            </span>
                          ) : (
                            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                              {calendarService.getRelativeTime(interview.interview_date)}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-sm">
                              {calendarService.formatDate(interview.interview_date, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <ClockIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-sm">{formatTimeDisplay(interview.interview_time)}</span>
                          </div>
                          {interview.interview_location && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <Icon className="h-5 w-5 text-gray-400" />
                              <span className="text-sm truncate">{interview.interview_location}</span>
                            </div>
                          )}
                        </div>

                        {(interview.interview_type || interview.interviewer_name) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {interview.interview_type && (
                              <div>
                                <span className="text-sm text-gray-600">Interview Type:</span>
                                <p className="font-medium text-gray-900 capitalize">{calendarService.getInterviewTypeStyle(interview.interview_type).label}</p>
                              </div>
                            )}
                            {interview.interviewer_name && (
                              <div>
                                <span className="text-sm text-gray-600">Interviewer:</span>
                                <p className="font-medium text-gray-900">{interview.interviewer_name}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {interview.interview_notes && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-sm text-yellow-900">
                              <span className="font-medium">Notes:</span> {interview.interview_notes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setEditingInterview(interview)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Interview"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Interview Modal */}
      {showAddModal && <AddInterviewModal />}

      {/* Edit Interview Modal */}
      {editingInterview && (
        <EditInterviewModal 
          interview={editingInterview} 
          onClose={() => setEditingInterview(null)} 
        />
      )}
    </div>
  );
};

export default CalendarPage;
