import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { 
  BriefcaseIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  ClockIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../store/authStore';
import statisticsService from '../services/statisticsService';
import applicationService from '../services/applicationService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Backend state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, applied: 0, interview: 0, offer: 0, rejected: 0 });
  const [recentApplications, setRecentApplications] = useState([]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch stats and recent applications in parallel
      const [overview, applications] = await Promise.all([
        statisticsService.getOverview(),
        applicationService.getApplications({ sort: 'applied_date', order: 'desc' })
      ]);

      // Set stats from overview
      setStats({
        total: overview.total_applications,
        applied: overview.by_status.applied || 0,
        interview: overview.by_status.interview || 0,
        offer: overview.by_status.offer || 0,
        rejected: overview.by_status.rejected || 0
      });

      // Set recent applications (top 5)
      const apps = applications.data || applications;
      setRecentApplications(apps.slice(0, 5));
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter upcoming interviews from applications
  const upcomingInterviews = recentApplications
    .filter(app => app.status === 'Interview' && app.interview_date)
    .slice(0, 2)
    .map(app => ({
      id: app.id,
      company: app.company,
      position: app.position,
      date: app.interview_date,
      time: '10:00 AM', // Default time if not stored
      type: 'Interview'
    }));

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800',
      interview: 'bg-purple-100 text-purple-800',
      offer: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                className="block px-4 py-3 text-primary-600 bg-primary-50 rounded-lg font-medium"
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
                className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || 'User'}! 👋</h1>
          <p className="text-gray-600">Here's what's happening with your job applications today.</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total</span>
              <BriefcaseIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-xs text-gray-500 mt-1">Applications</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100 text-sm font-medium">Applied</span>
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">📝</span>
              </div>
            </div>
            <div className="text-3xl font-bold">{stats.applied}</div>
            <p className="text-xs text-blue-100 mt-1">In Progress</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100 text-sm font-medium">Interview</span>
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">💼</span>
              </div>
            </div>
            <div className="text-3xl font-bold">{stats.interview}</div>
            <p className="text-xs text-purple-100 mt-1">Scheduled</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-100 text-sm font-medium">Offers</span>
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">🎉</span>
              </div>
            </div>
            <div className="text-3xl font-bold">{stats.offer}</div>
            <p className="text-xs text-green-100 mt-1">Received</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Rejected</span>
              <span className="text-xl">❌</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.rejected}</div>
            <p className="text-xs text-gray-500 mt-1">Not matched</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                  <Link 
                    to="/applications"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Add Application
                  </Link>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search applications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <FunnelIcon className="h-5 w-5 text-gray-600" />
                    Filter
                  </button>
                </div>
              </div>

              {/* Applications List */}
              <div className="divide-y divide-gray-200">
                {recentApplications.length > 0 ? (
                  recentApplications.map((app) => (
                    <div key={app.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl">
                            💼
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{app.position}</h3>
                            <p className="text-sm text-gray-600 mb-2">{app.company}</p>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                {new Date(app.applied_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                              <span>•</span>
                              <span>{app.location || 'Not specified'}</span>
                              {app.salary && (
                                <>
                                  <span>•</span>
                                  <span className="font-medium text-gray-700">{app.salary}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status.toLowerCase().replace(' ', ''))}`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    <BriefcaseIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No applications yet</p>
                    <Link to="/applications" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                      Add your first application →
                    </Link>
                  </div>
                )}
              </div>

              {/* View All Link */}
              <div className="p-4 border-t border-gray-200 text-center">
                <Link to="/applications" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                  View all applications →
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Interviews */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-primary-600" />
                Upcoming Interviews
              </h3>
              {upcomingInterviews.length > 0 ? (
                <div className="space-y-4">
                  {upcomingInterviews.map((interview) => (
                    <div key={interview.id} className="p-4 bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg border border-primary-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <CalendarIcon className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm mb-1">{interview.company}</p>
                          <p className="text-xs text-gray-600 mb-2">{interview.position}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-medium">{new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            <span>•</span>
                            <span>{interview.time}</span>
                          </div>
                          <span className="inline-block mt-2 px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                            {interview.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8 text-sm">
                  No upcoming interviews scheduled
                </p>
              )}
              <Link to="/calendar" className="block mt-4 text-center text-primary-600 hover:text-primary-700 font-medium text-sm">
                View calendar →
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link 
                  to="/applications"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <PlusIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">Add Application</span>
                </Link>
                <Link 
                  to="/documents"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <DocumentTextIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-700">Upload Document</span>
                </Link>
                <Link 
                  to="/analytics"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <ChartBarIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-700">View Analytics</span>
                </Link>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Pro Tip</h4>
                  <p className="text-sm text-gray-700">
                    Follow up on your applications after 1-2 weeks. It shows initiative and keeps you top of mind!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
