import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Navigation from '../components/Navigation';
import jobService from '../services/jobService';
import { 
  BellIcon,
  UserCircleIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  BanknotesIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  XMarkIcon,
  BookmarkIcon,
  ShareIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const JobSearchPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [filters, setFilters] = useState({
    jobType: 'all',
    workMode: 'all',
    experience: 'all',
    salary: 'all'
  });
  const [savedJobs, setSavedJobs] = useState([2, 5, 8]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getPublicJobPostings();
      setJobs(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load job postings');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.requirements && job.requirements.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = location === '' || 
      job.location.toLowerCase().includes(location.toLowerCase());
    
    const matchesJobType = filters.jobType === 'all' || job.job_type === filters.jobType;
    
    return matchesSearch && matchesLocation && matchesJobType;
  });

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
              className="block px-4 py-3 text-primary-600 bg-primary-50 rounded-lg font-medium"
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

      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2 text-center">Find Your Dream Job</h1>
          <p className="text-primary-100 text-center mb-8">Discover opportunities that match your skills and aspirations</p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-lg p-4 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900"
                />
              </div>
              <div className="flex-1 relative">
                <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900"
                />
              </div>
              <button className="px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
                Search Jobs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Clear all
                </button>
              </div>

              <div className="space-y-6">
                {/* Job Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Job Type</label>
                  <div className="space-y-2">
                    {['all', 'Full-time', 'Part-time', 'Contract', 'Freelance'].map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="jobType"
                          checked={filters.jobType === type}
                          onChange={() => setFilters(prev => ({ ...prev, jobType: type }))}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Work Mode */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Work Mode</label>
                  <div className="space-y-2">
                    {['all', 'Remote', 'Hybrid', 'On-site'].map(mode => (
                      <label key={mode} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="workMode"
                          checked={filters.workMode === mode}
                          onChange={() => setFilters(prev => ({ ...prev, workMode: mode }))}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Experience Level</label>
                  <div className="space-y-2">
                    {['all', 'Entry Level', 'Mid Level', 'Senior Level', 'Lead/Principal'].map(level => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Salary Range</label>
                  <div className="space-y-2">
                    {['all', '$0 - $80k', '$80k - $120k', '$120k - $160k', '$160k+'].map(range => (
                      <label key={range} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="salary"
                          checked={filters.salary === range}
                          onChange={() => setFilters(prev => ({ ...prev, salary: range }))}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredJobs.length}</span> jobs found
              </p>
              <div className="flex items-center gap-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
                  <option>Most Relevant</option>
                  <option>Most Recent</option>
                  <option>Highest Salary</option>
                  <option>Best Match</option>
                </select>
              </div>
            </div>

            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-4">
                {filteredJobs.map(job => (
                  <div
                    key={job.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Company Logo */}
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl font-bold text-primary-700 flex-shrink-0">
                        {job.company.charAt(0).toUpperCase()}
                      </div>

                      {/* Job Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                            <p className="text-gray-600 flex items-center gap-2">
                              <BuildingOfficeIcon className="h-4 w-4" />
                              {job.company}
                            </p>
                          </div>
                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {savedJobs.includes(job.id) ? (
                              <StarIconSolid className="h-6 w-6 text-yellow-500" />
                            ) : (
                              <StarIcon className="h-6 w-6 text-gray-400" />
                            )}
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPinIcon className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <BriefcaseIcon className="h-4 w-4" />
                            {job.job_type}
                          </span>
                          {job.salary_range && (
                            <span className="flex items-center gap-1">
                              <BanknotesIcon className="h-4 w-4" />
                              {job.salary_range}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            {job.experience_level}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                        {job.requirements && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              <span className="font-semibold">Requirements:</span> {job.requirements}
                            </p>
                          </div>
                        )}

                        {job.benefits && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.benefits.split(',').slice(0, 4).map((benefit, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"
                              >
                                {benefit.trim()}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              Posted {new Date(job.created_at).toLocaleDateString()}
                            </span>
                            {job.deadline && (
                              <span className="flex items-center gap-1 text-orange-600">
                                <ClockIcon className="h-4 w-4" />
                                Deadline: {new Date(job.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {job.application_url ? (
                              <a
                                href={job.application_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-purple-700 transition-all duration-200"
                              >
                                Apply Now
                              </a>
                            ) : (
                              <Link
                                to="/applications/new"
                                state={{ jobData: job }}
                                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-purple-700 transition-all duration-200"
                              >
                                Quick Apply
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredJobs.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <BriefcaseIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setLocation('');
                    setFilters({ jobType: 'all', workMode: 'all', experience: 'all', salary: 'all' });
                  }}
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
