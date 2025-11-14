import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  ClockIcon
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data - replace with API calls
  const stats = {
    total: 48,
    applied: 15,
    interview: 8,
    offer: 3,
    rejected: 12
  };

  const recentApplications = [
    {
      id: 1,
      company: 'Google LLC',
      position: 'Senior Frontend Developer',
      status: 'interview',
      appliedDate: '2025-11-10',
      salary: '$120k - $150k',
      location: 'Remote',
      logo: '🔵'
    },
    {
      id: 2,
      company: 'Microsoft',
      position: 'Full Stack Engineer',
      status: 'applied',
      appliedDate: '2025-11-08',
      salary: '$110k - $140k',
      location: 'Hybrid',
      logo: '🟢'
    },
    {
      id: 3,
      company: 'Meta',
      position: 'React Developer',
      status: 'offer',
      appliedDate: '2025-11-05',
      salary: '$130k - $160k',
      location: 'On-site',
      logo: '🔷'
    },
    {
      id: 4,
      company: 'Amazon',
      position: 'Software Development Engineer',
      status: 'applied',
      appliedDate: '2025-11-03',
      salary: '$115k - $145k',
      location: 'Remote',
      logo: '🟠'
    },
    {
      id: 5,
      company: 'Apple',
      position: 'iOS Developer',
      status: 'rejected',
      appliedDate: '2025-10-28',
      salary: '$125k - $155k',
      location: 'On-site',
      logo: '⚪'
    }
  ];

  const upcomingInterviews = [
    {
      id: 1,
      company: 'Google LLC',
      position: 'Senior Frontend Developer',
      date: '2025-11-16',
      time: '10:00 AM',
      type: 'Technical Interview'
    },
    {
      id: 2,
      company: 'Spotify',
      position: 'UI/UX Engineer',
      date: '2025-11-18',
      time: '2:00 PM',
      type: 'HR Round'
    }
  ];

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
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">JT</span>
              </div>
              <span className="text-xl font-bold text-gray-900">JobTrackr</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-primary-600 font-medium border-b-2 border-primary-600 pb-1">
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
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <UserCircleIcon className="h-8 w-8 text-gray-600" />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-t-lg transition-colors">
                    <UserCircleIcon className="h-5 w-5" />
                    Profile
                  </Link>
                  <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                    <Cog6ToothIcon className="h-5 w-5" />
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <button className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-lg transition-colors w-full text-left">
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John! 👋</h1>
          <p className="text-gray-600">Here's what's happening with your job applications today.</p>
        </div>

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
                    to="/applications/new"
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
                {recentApplications.map((app) => (
                  <div key={app.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl">
                          {app.logo}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{app.position}</h3>
                          <p className="text-sm text-gray-600 mb-2">{app.company}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            <span>•</span>
                            <span>{app.location}</span>
                            <span>•</span>
                            <span className="font-medium text-gray-700">{app.salary}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {getStatusText(app.status)}
                      </span>
                    </div>
                  </div>
                ))}
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
              <Link to="/calendar" className="block mt-4 text-center text-primary-600 hover:text-primary-700 font-medium text-sm">
                View calendar →
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link 
                  to="/applications/new"
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
      </div>
    </div>
  );
};

export default DashboardPage;
