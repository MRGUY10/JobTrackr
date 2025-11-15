import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import adminService from '../services/adminService';
import {
  UsersIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Backend state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [topUsers, setTopUsers] = useState([]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Fetch admin dashboard data
  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    fetchAdminData();
  }, [user, navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await adminService.getDashboard();
      
      setStats({
        totalUsers: data.total_users,
        totalApplications: data.total_applications,
        totalDocuments: data.total_documents,
        newUsers: data.new_users_30d,
        recentApplications: data.recent_applications_30d,
        statusBreakdown: data.status_breakdown
      });
      
      setTopUsers(data.top_users || []);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin dashboard');
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 border-b border-purple-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xl font-bold text-white">Admin Panel</span>
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/admin" className="text-white font-medium border-b-2 border-white pb-1">
                Dashboard
              </Link>
              <Link to="/admin/users" className="text-purple-100 hover:text-white font-medium transition-colors">
                Users
              </Link>
              <Link to="/admin/applications" className="text-purple-100 hover:text-white font-medium transition-colors">
                Applications
              </Link>
              <Link to="/admin/jobs" className="text-purple-100 hover:text-white font-medium transition-colors">
                Job Postings
              </Link>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2">
                <UserCircleIcon className="h-8 w-8 text-white" />
                <span className="hidden md:block text-sm font-medium text-white">{user?.name || 'Admin'}</span>
              </div>

              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
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
          <div className="md:hidden border-t border-purple-700 bg-purple-600">
            <div className="px-4 py-4 space-y-2">
              <Link 
                to="/admin" 
                className="block px-4 py-3 text-white bg-white/10 rounded-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/users" 
                className="block px-4 py-3 text-purple-100 hover:bg-white/10 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Users
              </Link>
              <Link 
                to="/admin/applications" 
                className="block px-4 py-3 text-purple-100 hover:bg-white/10 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Applications
              </Link>
              <Link 
                to="/admin/jobs" 
                className="block px-4 py-3 text-purple-100 hover:bg-white/10 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Job Postings
              </Link>
              
              <div className="border-t border-purple-700 pt-2 mt-2">
                <div className="flex items-center gap-3 px-4 py-3 text-white">
                  <UserCircleIcon className="h-6 w-6" />
                  {user?.name || 'Admin'}
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg font-medium transition-colors"
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheckIcon className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">System overview and platform statistics</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && stats && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-medium">Total Users</span>
                  <UsersIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <ArrowTrendingUpIcon className="h-3 w-3" />
                  {stats.newUsers} new this month
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-100 text-sm font-medium">Applications</span>
                  <BriefcaseIcon className="h-5 w-5 text-blue-100" />
                </div>
                <div className="text-3xl font-bold">{stats.totalApplications}</div>
                <p className="text-xs text-blue-100 mt-1">
                  {stats.recentApplications} recent
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-100 text-sm font-medium">Documents</span>
                  <DocumentTextIcon className="h-5 w-5 text-purple-100" />
                </div>
                <div className="text-3xl font-bold">{stats.totalDocuments}</div>
                <p className="text-xs text-purple-100 mt-1">Uploaded files</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-100 text-sm font-medium">Active</span>
                  <CalendarIcon className="h-5 w-5 text-green-100" />
                </div>
                <div className="text-3xl font-bold">{stats.statusBreakdown?.Applied || 0}</div>
                <p className="text-xs text-green-100 mt-1">In progress</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-orange-100 text-sm font-medium">Interviews</span>
                  <ChartBarIcon className="h-5 w-5 text-orange-100" />
                </div>
                <div className="text-3xl font-bold">{stats.statusBreakdown?.Interview || 0}</div>
                <p className="text-xs text-orange-100 mt-1">Scheduled</p>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Active Users */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Top Active Users</h2>
                  <p className="text-sm text-gray-500 mt-1">Users with most applications</p>
                </div>
                <div className="divide-y divide-gray-200">
                  {topUsers.length > 0 ? (
                    topUsers.map((user, index) => (
                      <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                              <span className="text-lg font-bold text-purple-600">#{index + 1}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{user.name}</h3>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <p className="text-xs text-gray-500 mt-1">Joined: {user.joined_at}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-600">{user.applications_count}</div>
                            <p className="text-xs text-gray-500">applications</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center text-gray-500">
                      <UsersIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No users yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Application Status Breakdown */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Application Status</h2>
                  <p className="text-sm text-gray-500 mt-1">Overall status distribution</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {stats.statusBreakdown && Object.entries(stats.statusBreakdown).map(([status, count]) => {
                      const total = Object.values(stats.statusBreakdown).reduce((a, b) => a + b, 0);
                      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                      const colors = {
                        'Applied': 'bg-blue-500',
                        'Interview': 'bg-purple-500',
                        'Technical Test': 'bg-orange-500',
                        'Offer': 'bg-green-500',
                        'Rejected': 'bg-red-500'
                      };
                      
                      return (
                        <div key={status}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{status}</span>
                            <span className="text-sm font-bold text-gray-900">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${colors[status] || 'bg-gray-500'} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => navigate('/admin/users')}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <UsersIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Manage Users</div>
                    <div className="text-sm text-gray-500">View all users</div>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/admin/applications')}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">View Applications</div>
                    <div className="text-sm text-gray-500">All submissions</div>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
