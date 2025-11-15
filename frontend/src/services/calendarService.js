import api from './api';

/**
 * Calendar Service
 * Handles all calendar and interview-related API calls
 */
const calendarService = {
  /**
   * Get calendar events (interviews and deadlines)
   * @param {Object} params - Query parameters (start_date, end_date)
   * @returns {Promise} Response with interviews and deadlines
   */
  async getCalendarEvents(params = {}) {
    try {
      const response = await api.get('/calendar/events', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  },

  /**
   * Get upcoming interviews
   * @returns {Promise} Response with upcoming interviews
   */
  async getUpcomingInterviews() {
    try {
      const response = await api.get('/calendar/interviews');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming interviews:', error);
      throw error;
    }
  },

  /**
   * Update application with interview details
   * @param {number} applicationId - ID of the application
   * @param {Object} interviewData - Interview details
   * @returns {Promise} Response
   */
  async scheduleInterview(applicationId, interviewData) {
    try {
      const response = await api.put(`/applications/${applicationId}`, {
        interview_date: interviewData.interview_date,
        interview_time: interviewData.interview_time,
        interview_location: interviewData.interview_location,
        interview_type: interviewData.interview_type,
        interviewer_name: interviewData.interviewer_name,
        interview_notes: interviewData.interview_notes,
        status: 'Interview' // Update status to Interview
      });
      return response.data;
    } catch (error) {
      console.error('Error scheduling interview:', error);
      throw error;
    }
  },

  /**
   * Update application deadline
   * @param {number} applicationId - ID of the application
   * @param {string} deadline - Deadline date (Y-m-d format)
   * @returns {Promise} Response
   */
  async setDeadline(applicationId, deadline) {
    try {
      const response = await api.put(`/applications/${applicationId}`, {
        deadline
      });
      return response.data;
    } catch (error) {
      console.error('Error setting deadline:', error);
      throw error;
    }
  },

  /**
   * Format date for calendar display
   * @param {string} dateString - ISO date string
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted date
   */
  formatDate(dateString, options = {}) {
    if (!dateString) return 'N/A';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    return new Date(dateString).toLocaleDateString('en-US', defaultOptions);
  },

  /**
   * Format date and time for calendar display
   * @param {string} dateString - ISO date string
   * @param {string} timeString - Time string (e.g., "10:00 AM")
   * @returns {string} Formatted date and time
   */
  formatDateTime(dateString, timeString) {
    if (!dateString) return 'N/A';
    
    const dateOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', dateOptions);
    const formattedTime = timeString || 'Time TBD';
    
    return `${formattedDate} at ${formattedTime}`;
  },

  /**
   * Get interview type styling (icon, color, label)
   * @param {string} type - Interview type ('video', 'phone', 'in-person')
   * @returns {Object} Styling information
   */
  getInterviewTypeStyle(type) {
    const styles = {
      video: {
        label: 'Video Call',
        icon: '📹',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-300'
      },
      phone: {
        label: 'Phone Call',
        icon: '📞',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-300'
      },
      'in-person': {
        label: 'In Person',
        icon: '📍',
        color: 'text-purple-700',
        bgColor: 'bg-purple-100',
        borderColor: 'border-purple-300'
      }
    };

    return styles[type] || {
      label: 'Interview',
      icon: '📅',
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-300'
    };
  },

  /**
   * Check if interview is upcoming (within next 24 hours)
   * @param {string} dateString - ISO date string
   * @param {string} timeString - Time string
   * @returns {boolean} True if upcoming
   */
  isUpcoming(dateString, timeString) {
    if (!dateString) return false;
    
    const interviewDate = new Date(dateString);
    const now = new Date();
    const hoursDiff = (interviewDate - now) / (1000 * 60 * 60);
    
    return hoursDiff > 0 && hoursDiff <= 24;
  },

  /**
   * Check if interview is today
   * @param {string} dateString - ISO date string
   * @returns {boolean} True if today
   */
  isToday(dateString) {
    if (!dateString) return false;
    
    const interviewDate = new Date(dateString);
    const today = new Date();
    
    return interviewDate.getDate() === today.getDate() &&
           interviewDate.getMonth() === today.getMonth() &&
           interviewDate.getFullYear() === today.getFullYear();
  },

  /**
   * Check if date is in the past
   * @param {string} dateString - ISO date string
   * @returns {boolean} True if past
   */
  isPast(dateString) {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date < today;
  },

  /**
   * Get days until event
   * @param {string} dateString - ISO date string
   * @returns {number} Days until event (negative if past)
   */
  daysUntil(dateString) {
    if (!dateString) return null;
    
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  },

  /**
   * Get relative time string (e.g., "Tomorrow", "In 3 days")
   * @param {string} dateString - ISO date string
   * @returns {string} Relative time string
   */
  getRelativeTime(dateString) {
    const days = this.daysUntil(dateString);
    
    if (days === null) return 'No date set';
    if (days < 0) return 'Past';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days <= 7) return `In ${days} days`;
    if (days <= 30) return `In ${Math.floor(days / 7)} weeks`;
    
    return `In ${Math.floor(days / 30)} months`;
  },

  /**
   * Group events by month
   * @param {Array} events - Array of events with date field
   * @returns {Object} Events grouped by month
   */
  groupByMonth(events) {
    const grouped = {};
    
    events.forEach(event => {
      const date = new Date(event.interview_date || event.deadline);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      
      grouped[monthKey].push(event);
    });
    
    return grouped;
  }
};

export default calendarService;
