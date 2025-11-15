import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
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
  ArrowRightOnRectangleIcon
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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'Google LLC',
      logo: '🔵',
      location: 'Mountain View, CA',
      workMode: 'Remote',
      jobType: 'Full-time',
      salary: '$120k - $180k',
      experience: '5+ years',
      postedDate: '2 days ago',
      applicants: 45,
      matchScore: 95,
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      description: 'Join our world-class team building cutting-edge web applications.',
      benefits: ['Health Insurance', '401k', 'Stock Options', 'Unlimited PTO']
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'Microsoft',
      logo: '🟢',
      location: 'Redmond, WA',
      workMode: 'Hybrid',
      jobType: 'Full-time',
      salary: '$110k - $160k',
      experience: '3+ years',
      postedDate: '3 days ago',
      applicants: 67,
      matchScore: 92,
      skills: ['React', 'C#', '.NET', 'Azure'],
      description: 'Build innovative solutions that impact millions of users worldwide.',
      benefits: ['Health Insurance', 'Retirement Plan', 'Remote Work', 'Learning Budget']
    },
    {
      id: 3,
      title: 'React Developer',
      company: 'Meta',
      logo: '🔷',
      location: 'Menlo Park, CA',
      workMode: 'On-site',
      jobType: 'Full-time',
      salary: '$130k - $190k',
      experience: '4+ years',
      postedDate: '1 day ago',
      applicants: 89,
      matchScore: 90,
      skills: ['React', 'GraphQL', 'JavaScript', 'Jest'],
      description: 'Shape the future of social technology with cutting-edge React development.',
      benefits: ['Comprehensive Health', 'Stock RSUs', 'Free Meals', 'Gym Membership']
    },
    {
      id: 4,
      title: 'UI/UX Developer',
      company: 'Apple',
      logo: '⚪',
      location: 'Cupertino, CA',
      workMode: 'On-site',
      jobType: 'Full-time',
      salary: '$125k - $175k',
      experience: '4+ years',
      postedDate: '5 days ago',
      applicants: 102,
      matchScore: 88,
      skills: ['React', 'Swift', 'Figma', 'Animation'],
      description: 'Create beautiful, intuitive interfaces for next-generation Apple products.',
      benefits: ['Health Coverage', 'Employee Discounts', 'Wellness Programs', 'Education']
    },
    {
      id: 5,
      title: 'Software Development Engineer',
      company: 'Amazon',
      logo: '🟠',
      location: 'Seattle, WA',
      workMode: 'Remote',
      jobType: 'Full-time',
      salary: '$115k - $165k',
      experience: '3+ years',
      postedDate: '1 week ago',
      applicants: 134,
      matchScore: 85,
      skills: ['Java', 'Python', 'AWS', 'Microservices'],
      description: 'Build scalable systems that power e-commerce for millions of customers.',
      benefits: ['Medical Benefits', '401k Match', 'Employee Discount', 'Career Growth']
    },
    {
      id: 6,
      title: 'Frontend Engineer',
      company: 'Netflix',
      logo: '🔴',
      location: 'Los Gatos, CA',
      workMode: 'Hybrid',
      jobType: 'Full-time',
      salary: '$130k - $185k',
      experience: '5+ years',
      postedDate: '4 days ago',
      applicants: 78,
      matchScore: 87,
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      description: 'Create amazing streaming experiences for 200+ million subscribers.',
      benefits: ['Unlimited Vacation', 'Parental Leave', 'Health Insurance', 'Stock Options']
    },
    {
      id: 7,
      title: 'JavaScript Developer',
      company: 'Shopify',
      logo: '🟩',
      location: 'Ottawa, Canada',
      workMode: 'Remote',
      jobType: 'Full-time',
      salary: '$100k - $145k',
      experience: '3+ years',
      postedDate: '6 days ago',
      applicants: 56,
      matchScore: 82,
      skills: ['JavaScript', 'React', 'Ruby', 'GraphQL'],
      description: 'Help merchants around the world grow their businesses with modern commerce.',
      benefits: ['Health Benefits', 'RRSP Matching', 'Learning Fund', 'Wellness Budget']
    },
    {
      id: 8,
      title: 'Senior React Engineer',
      company: 'Airbnb',
      logo: '🎈',
      location: 'San Francisco, CA',
      workMode: 'Hybrid',
      jobType: 'Full-time',
      salary: '$135k - $195k',
      experience: '6+ years',
      postedDate: '2 days ago',
      applicants: 91,
      matchScore: 93,
      skills: ['React', 'TypeScript', 'Redux', 'Testing'],
      description: 'Build the platform that connects millions of hosts and guests worldwide.',
      benefits: ['Travel Credits', 'Health Insurance', 'Equity', 'Remote Options']
    }
  ];

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
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = location === '' || 
      job.location.toLowerCase().includes(location.toLowerCase());
    
    const matchesJobType = filters.jobType === 'all' || job.jobType === filters.jobType;
    const matchesWorkMode = filters.workMode === 'all' || job.workMode === filters.workMode;
    
    return matchesSearch && matchesLocation && matchesJobType && matchesWorkMode;
  });

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">JT</span>
              </div>
              <span className="text-xl font-bold text-gray-900">JobTrackr</span>
            </Link>

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
              <Link to="/settings" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Settings
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/notifications" className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
              <Link to="/profile" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <UserCircleIcon className="h-8 w-8 text-primary-600 hover:text-primary-700" />
                <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Logout">
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
                <span className="hidden md:block text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

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

            <div className="space-y-4">
              {filteredJobs.map(job => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Company Logo */}
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                      {job.logo}
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
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchScoreColor(job.matchScore)}`}>
                            {job.matchScore}% Match
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
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <BriefcaseIcon className="h-4 w-4" />
                          {job.workMode}
                        </span>
                        <span className="flex items-center gap-1">
                          <BanknotesIcon className="h-4 w-4" />
                          {job.salary}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          {job.experience}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4">{job.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            Posted {job.postedDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <UserCircleIcon className="h-4 w-4" />
                            {job.applicants} applicants
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            View Details
                          </button>
                          <Link
                            to="/applications/new"
                            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-purple-700 transition-all duration-200"
                          >
                            Quick Apply
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
