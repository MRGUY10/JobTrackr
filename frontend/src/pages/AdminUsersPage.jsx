import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import adminService from '../services/adminService';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  CalendarIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await adminService.getUsers();
      setUsers(data.data || []);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users
    .filter(u => roleFilter === 'all' || u.role === roleFilter)
    .filter(u => 
      searchQuery === '' || 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
              <Link to="/admin/users" className="text-white font-medium border-b-2 border-white pb-1">
                Users
              </Link>
              <Link to="/admin/applications" className="text-purple-100 hover:text-white font-medium transition-colors">
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
              <Link to="/admin/users" className="block px-4 py-3 text-white bg-white/10 rounded-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Users
              </Link>
              <Link to="/admin/applications" className="block px-4 py-3 text-purple-100 hover:bg-white/10 rounded-lg font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
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
            <UsersIcon className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          </div>
          <p className="text-gray-600">View and manage all registered users</p>
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
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="flex gap-3">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">Users</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <span>Total: <strong>{filteredUsers.length}</strong> users</span>
                <span>•</span>
                <span>Admins: <strong>{users.filter(u => u.role === 'admin').length}</strong></span>
                <span>•</span>
                <span>Regular Users: <strong>{users.filter(u => u.role === 'user').length}</strong></span>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                              <UserCircleIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{u.name}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <EnvelopeIcon className="h-4 w-4" />
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            u.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {u.role === 'admin' && <ShieldCheckIcon className="h-3 w-3 mr-1" />}
                            {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <BriefcaseIcon className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold">{u.applications_count}</span>
                            <span className="text-sm text-gray-500">applications</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                            {u.joined_at}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        <UsersIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No users found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
