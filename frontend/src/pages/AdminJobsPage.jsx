import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import jobService from '../services/jobService';
import {
  BriefcaseIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  Bars3Icon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const AdminJobsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    job_type: 'Full-time',
    experience_level: 'Mid-Level',
    salary_range: '',
    requirements: '',
    benefits: '',
    application_url: '',
    contact_email: '',
    status: 'active',
    deadline: ''
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    fetchJobs();
  }, [user, navigate]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await jobService.getJobPostings();
      setJobs(data.data || []);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load job postings');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingJob) {
        await jobService.updateJobPosting(editingJob.id, formData);
      } else {
        await jobService.createJobPosting(formData);
      }
      
      setShowModal(false);
      resetForm();
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job posting');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    
    try {
      await jobService.deleteJobPosting(id);
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete job posting');
    }
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      description: job.description,
      location: job.location,
      job_type: job.job_type,
      experience_level: job.experience_level,
      salary_range: job.salary_range || '',
      requirements: job.requirements || '',
      benefits: job.benefits || '',
      application_url: job.application_url || '',
      contact_email: job.contact_email || '',
      status: job.status,
      deadline: job.deadline || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      company: '',
      description: '',
      location: '',
      job_type: 'Full-time',
      experience_level: 'Mid-Level',
      salary_range: '',
      requirements: '',
      benefits: '',
      application_url: '',
      contact_email: '',
      status: 'active',
      deadline: ''
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800',
      'draft': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

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
              <Link to="/admin/applications" className="text-purple-100 hover:text-white font-medium transition-colors">
                Applications
              </Link>
              <Link to="/admin/jobs" className="text-white font-medium border-b-2 border-white pb-1">
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
              <Link to="/admin/applications" className="block px-4 py-3 text-purple-100 hover:bg-white/10 rounded-lg font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Applications
              </Link>
              <Link to="/admin/jobs" className="block px-4 py-3 text-white bg-white/10 rounded-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BriefcaseIcon className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
            </div>
            <p className="text-gray-600">Manage and publish job opportunities</p>
          </div>
          
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Create Job</span>
          </button>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                      <p className="text-gray-600 font-medium mb-3">{job.company}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(job)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span>{job.job_type}</span>
                    <span>•</span>
                    <span>{job.experience_level}</span>
                    {job.salary_range && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <CurrencyDollarIcon className="h-4 w-4" />
                          {job.salary_range}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    {job.deadline && (
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-12 text-center text-gray-500">
                <BriefcaseIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No job postings yet</p>
                <button
                  onClick={() => { resetForm(); setShowModal(true); }}
                  className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                >
                  Create your first job posting
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingJob ? 'Edit Job Posting' : 'Create Job Posting'}
              </h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Job description..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g. New York, NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.job_type}
                    onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.experience_level}
                    onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid-Level">Mid-Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    value={formData.salary_range}
                    onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g. $80k - $120k"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                <textarea
                  rows="3"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="List job requirements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Benefits
                </label>
                <textarea
                  rows="3"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="List benefits..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application URL
                  </label>
                  <input
                    type="url"
                    value={formData.application_url}
                    onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="hr@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingJob ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobsPage;
