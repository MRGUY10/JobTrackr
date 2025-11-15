import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
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
      
      const response = await calendarService.getCalendarEvents({
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      });
      
      setInterviews(response.interviews?.data || []);
      setDeadlines(response.deadlines?.data || []);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
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
      return interviewDate >= new Date() && (i.status === 'Interview' || i.status === 'Technical Test');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">JT</span>
              </div>
              <span className="text-xl font-bold text-gray-900">JobTrackr</span>
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Dashboard
              </Link>
              <Link to="/applications" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Applications
              </Link>
              <Link to="/kanban" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Kanban
              </Link>
              <Link to="/documents" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Documents
              </Link>
              <Link to="/analytics" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Analytics
              </Link>
              <Link to="/job-search" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Job Search
              </Link>
              <Link to="/ai-analyzer" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                AI Analyzer
              </Link>
              <Link to="/settings" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Settings
              </Link>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/notifications" className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
              
              <Link to="/profile" className="hidden sm:flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <UserCircleIcon className="h-8 w-8 text-primary-600 hover:text-primary-700" />
                <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
                <span className="hidden md:block text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-2">
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
      </nav>

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
                            {interview.interview_time || 'Time TBD'}
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
                            <span className="text-sm">{interview.interview_time || 'Time TBD'}</span>
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
                        <Link
                          to={`/applications`}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
