import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import adminService from '../services/adminService';
import {
  BriefcaseIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon,
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const AdminApplicationsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    fetchApplications();
  }, [user, navigate]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await adminService.getApplications();
      setApplications(data.data || []);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications
    .filter(app => statusFilter === 'all' || app.status === statusFilter)
    .filter(app => 
      searchQuery === '' || 
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.user && app.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const getStatusColor = (status) => {
    const colors = {
      'Applied': 'bg-blue-100 text-blue-800',
      'Interview': 'bg-purple-100 text-purple-800',
      'Technical Test': 'bg-orange-100 text-orange-800',
      'Offer': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const statusOptions = ['Applied', 'Interview', 'Technical Test', 'Offer', 'Rejected'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 border-b border-purple-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>

            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xl font-bold text-white">Admin Panel</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/admin" className="text-purple-100 hover:text-white font-medium transition-colors">
                Dashboard
              </Link>
              <Link to="/admin/users" className="text-purple-100 hover:text-white font-medium transition-colors">
                Users
              </Link>
              <Link to="/admin/applications" className="text-white font-medium border-b-2 border-white pb-1">
                Applications
              </Link>
              <Link to="/admin/jobs" className="text-purple-100 hover:text-white font-medium transition-colors">
                Job Postings
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2">
                <UserCircleIcon className="h-8 w-8 text-white" />
                <span className="hidden md:block text-sm font-medium text-white">{user?.name || 'Admin'}</span>
              </div>

              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
                <span className="hidden md:block text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-purple-700 bg-purple-600">
            <div className="px-4 py-4 space-y-2">
              <Link to="/admin" className="block px-4 py-3 text-purple-100 hover:bg-white/10 rounded-lg font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/admin/users" className="block px-4 py-3 text-purple-100 hover:bg-white/10 rounded-lg font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Users
              </Link>
              <Link to="/admin/applications" className="block px-4 py-3 text-white bg-white/10 rounded-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Applications
              </Link>
              <Link to="/admin/jobs" className="block px-4 py-3 text-purple-100 hover:bg-white/10 rounded-lg font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Job Postings
              </Link>
              
              <div className="border-t border-purple-700 pt-2 mt-2">
                <div className="flex items-center gap-3 px-4 py-3 text-white">
                  <UserCircleIcon className="h-6 w-6" />
                  {user?.name || 'Admin'}
                </div>
                <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg font-medium transition-colors">
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BriefcaseIcon className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Applications Management</h1>
          </div>
          <p className="text-gray-600">View all job applications from all users</p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by company, position, or user..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="flex gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    <option value="all">All Status</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <span>Total: <strong>{filteredApplications.length}</strong> applications</span>
                <span>•</span>
                <span>Showing last 100 applications</span>
              </div>
            </div>

            {/* Applications Grid */}
            <div className="divide-y divide-gray-200">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <div key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          💼
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">{app.position}</h3>
                          <p className="text-sm font-medium text-gray-600 mb-2">{app.company}</p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <UserIcon className="h-4 w-4" />
                              {app.user ? app.user.name : 'Unknown User'}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              Applied: {new Date(app.applied_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            {app.location && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MapPinIcon className="h-4 w-4" />
                                  {app.location}
                                </span>
                              </>
                            )}
                            {app.salary && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <CurrencyDollarIcon className="h-4 w-4" />
                                  {app.salary}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>

                    {app.notes && (
                      <div className="ml-16 mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                        <strong className="text-gray-700">Notes:</strong> {app.notes}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <BriefcaseIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No applications found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplicationsPage;
