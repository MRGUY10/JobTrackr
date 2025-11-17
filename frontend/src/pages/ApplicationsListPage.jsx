import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import useAuthStore from '../store/authStore';
import applicationService from '../services/applicationService';
import { 
  BriefcaseIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  MapPinIcon,
  BanknotesIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const ApplicationsListPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Fetch applications on mount and when filters change
  useEffect(() => {
    fetchApplications();
  }, [selectedStatus, sortBy]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        status: selectedStatus !== 'all' ? selectedStatus : null,
        company: searchQuery || null,
        sort: sortBy === 'date' ? 'applied_date' : sortBy,
        order: 'desc'
      };
      
      const data = await applicationService.getApplications(filters);
      setApplications(data.data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    
    try {
      await applicationService.deleteApplication(id);
      setSuccess('Application deleted successfully');
      fetchApplications();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete application');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSearch = () => {
    fetchApplications();
  };

  const statusOptions = [
    { value: 'all', label: 'All Applications', count: applications.length },
    { value: 'Applied', label: 'Applied', count: applications.filter(a => a.status === 'Applied').length },
    { value: 'Interview', label: 'Interview', count: applications.filter(a => a.status === 'Interview').length },
    { value: 'Technical Test', label: 'Technical Test', count: applications.filter(a => a.status === 'Technical Test').length },
    { value: 'Offer', label: 'Offer', count: applications.filter(a => a.status === 'Offer').length },
    { value: 'Rejected', label: 'Rejected', count: applications.filter(a => a.status === 'Rejected').length }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Applied': 'bg-blue-100 text-blue-800',
      'Interview': 'bg-purple-100 text-purple-800',
      'Technical Test': 'bg-yellow-100 text-yellow-800',
      'Offer': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    return status;
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
                className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/applications" 
                className="block px-4 py-3 text-primary-600 bg-primary-50 rounded-lg font-medium"
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
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5" />
            {success}
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
              <p className="text-gray-600 mt-1">Manage and track all your job applications</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 w-full sm:max-w-md relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={handleSearch}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
                <span className="font-medium hidden sm:inline">Search</span>
              </button>
              
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <PlusIcon className="h-5 w-5" />
                <span className="hidden sm:inline">New Application</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedStatus === option.value
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {option.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  selectedStatus === option.value
                    ? 'bg-white/20'
                    : 'bg-gray-100'
                }`}>
                  {option.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort and View Options */}
          <div className="flex items-center justify-between mb-6 bg-white rounded-lg border border-gray-200 px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{applications.length}</span> applications
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="date">Date Applied</option>
              <option value="company">Company Name</option>
              <option value="position">Position</option>
              <option value="salary">Salary</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <BriefcaseIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-6">Start tracking your job applications by adding your first one.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200"
            >
              <PlusIcon className="h-5 w-5" />
              Add Your First Application
            </button>
          </div>
        ) : (
          <>
        {/* Applications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div 
              key={app.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-3xl shadow-sm">
                    {app.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-primary-600 transition-colors">
                      {app.position}
                    </h3>
                    <p className="text-gray-600 font-medium mb-2">{app.company}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {getStatusText(app.status)}
                    </span>
                  </div>
                </div>

                {/* Actions Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setActiveDropdown(activeDropdown === app.id ? null : app.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  
                  {activeDropdown === app.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button 
                        onClick={() => {
                          setEditingApplication(app);
                          setShowAddModal(true);
                          setActiveDropdown(null);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </button>
                      <hr className="my-1" />
                      <button 
                        onClick={() => {
                          handleDelete(app.id);
                          setActiveDropdown(null);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{new Date(app.applied_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                {app.job_url && (
                  <div className="flex items-center gap-2 text-sm text-primary-600">
                    <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      View Job Posting
                    </a>
                  </div>
                )}
              </div>

              {/* Notes */}
              {app.notes && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700">{app.notes}</p>
                </div>
              )}

            </div>
          ))}
        </div>
        </>
        )}
      </div>

      {/* Add/Edit Application Modal */}
      {showAddModal && (
        <ApplicationModal
          application={editingApplication}
          onClose={() => {
            setShowAddModal(false);
            setEditingApplication(null);
          }}
          onSuccess={() => {
            fetchApplications();
            setShowAddModal(false);
            setEditingApplication(null);
            setSuccess(editingApplication ? 'Application updated successfully!' : 'Application added successfully!');
            setTimeout(() => setSuccess(null), 3000);
          }}
        />
      )}
    </div>
  );
};

// Application Modal Component
const ApplicationModal = ({ application, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    company: application?.company || '',
    position: application?.position || '',
    status: application?.status || 'Applied',
    applied_date: application?.applied_date || new Date().toISOString().split('T')[0],
    job_url: application?.job_url || '',
    job_description: application?.job_description || '',
    notes: application?.notes || ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (application) {
        await applicationService.updateApplication(application.id, formData);
      } else {
        await applicationService.createApplication(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save application');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {application ? 'Edit Application' : 'Add New Application'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="e.g., Google"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="e.g., Senior Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Technical Test">Technical Test</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applied Date *
              </label>
              <input
                type="date"
                name="applied_date"
                value={formData.applied_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job URL
            </label>
            <input
              type="url"
              name="job_url"
              value={formData.job_url}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              name="job_description"
              value={formData.job_description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              placeholder="Paste the job description here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              placeholder="Add any notes about this application..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
            >
              {saving ? 'Saving...' : (application ? 'Update Application' : 'Add Application')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationsListPage;
