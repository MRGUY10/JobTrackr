import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [timeRange, setTimeRange] = useState('6months');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Mock data - replace with API
  const overviewStats = {
    totalApplications: 48,
    applicationsTrend: 12.5,
    successRate: 6.25,
    successTrend: -2.3,
    avgResponseTime: 7,
    responseTrend: -1.5,
    activeApplications: 23,
    activeTrend: 8.1
  };

  const monthlyData = [
    { month: 'Jun', applications: 5, interviews: 2, offers: 0, rejected: 1 },
    { month: 'Jul', applications: 8, interviews: 3, offers: 1, rejected: 2 },
    { month: 'Aug', applications: 12, interviews: 5, offers: 0, rejected: 4 },
    { month: 'Sep', applications: 10, interviews: 4, offers: 1, rejected: 3 },
    { month: 'Oct', applications: 7, interviews: 3, offers: 1, rejected: 2 },
    { month: 'Nov', applications: 6, interviews: 2, offers: 0, rejected: 0 }
  ];

  const statusDistribution = [
    { name: 'Wishlist', value: 2, color: '#6B7280' },
    { name: 'Applied', value: 15, color: '#3B82F6' },
    { name: 'Interview', value: 8, color: '#8B5CF6' },
    { name: 'Offer', value: 3, color: '#10B981' },
    { name: 'Rejected', value: 12, color: '#EF4444' }
  ];

  const topCompanies = [
    { company: 'Google', applications: 5, interviews: 2, offers: 0 },
    { company: 'Microsoft', applications: 4, interviews: 2, offers: 1 },
    { company: 'Meta', applications: 3, interviews: 1, offers: 1 },
    { company: 'Amazon', applications: 3, interviews: 1, offers: 0 },
    { company: 'Apple', applications: 2, interviews: 1, offers: 0 }
  ];

  const responseTimeData = [
    { range: '0-3 days', count: 8 },
    { range: '4-7 days', count: 15 },
    { range: '8-14 days', count: 12 },
    { range: '15-30 days', count: 6 },
    { range: '30+ days', count: 3 }
  ];

  const successByJobType = [
    { type: 'Full-time', applied: 35, offers: 2, rate: 5.7 },
    { type: 'Contract', applied: 8, offers: 1, rate: 12.5 },
    { type: 'Part-time', applied: 3, offers: 0, rate: 0 },
    { type: 'Freelance', applied: 2, offers: 0, rate: 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">JT</span>
              </div>
              <span className="text-xl font-bold text-gray-900">JobTrackr</span>
            </Link>

            {/* Navigation Links - Desktop */}
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
              <Link to="/analytics" className="text-primary-600 font-medium border-b-2 border-primary-600 pb-1">
                Analytics
              </Link>
              <Link to="/job-search" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Job Search
              </Link>
              <Link to="/ai-analyzer" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                AI Analyzer
              </Link>
              <Link to="/settings" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Settings
              </Link>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/notifications" className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
              
              <Link to="/profile" className="hidden sm:flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <UserCircleIcon className="h-8 w-8 text-primary-600 hover:text-primary-700" />
                <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-2">
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
                className="block px-4 py-3 text-primary-600 bg-primary-50 rounded-lg font-medium"
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
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-1">Track your job search performance and insights</p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setTimeRange('3months')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === '3months' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                3M
              </button>
              <button 
                onClick={() => setTimeRange('6months')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === '6months' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                6M
              </button>
              <button 
                onClick={() => setTimeRange('1year')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === '1year' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                1Y
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Applications</span>
              <BriefcaseIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-gray-900">{overviewStats.totalApplications}</div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                overviewStats.applicationsTrend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {overviewStats.applicationsTrend >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4" />
                )}
                {Math.abs(overviewStats.applicationsTrend)}%
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">vs last period</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Success Rate</span>
              <CheckCircleIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-gray-900">{overviewStats.successRate}%</div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                overviewStats.successTrend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {overviewStats.successTrend >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4" />
                )}
                {Math.abs(overviewStats.successTrend)}%
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">offers received</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Avg Response Time</span>
              <ClockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-gray-900">{overviewStats.avgResponseTime}d</div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                overviewStats.responseTrend >= 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {overviewStats.responseTrend >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4" />
                )}
                {Math.abs(overviewStats.responseTrend)}d
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">days to hear back</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Active Applications</span>
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-gray-900">{overviewStats.activeApplications}</div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                overviewStats.activeTrend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {overviewStats.activeTrend >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4" />
                )}
                {Math.abs(overviewStats.activeTrend)}%
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">in progress</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Monthly Applications Trend */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Application Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} name="Applied" />
                <Line type="monotone" dataKey="interviews" stroke="#8B5CF6" strokeWidth={2} name="Interviews" />
                <Line type="monotone" dataKey="offers" stroke="#10B981" strokeWidth={2} name="Offers" />
                <Line type="monotone" dataKey="rejected" stroke="#EF4444" strokeWidth={2} name="Rejected" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Response Time Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Companies */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Companies Applied</h3>
            <div className="space-y-4">
              {topCompanies.map((company, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{company.company}</p>
                      <p className="text-sm text-gray-500">{company.applications} applications</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{company.interviews} interviews</p>
                    <p className="text-sm text-green-600 font-medium">{company.offers} offers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Rate by Job Type */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rate by Job Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {successByJobType.map((job, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{job.type}</span>
                  <span className={`text-sm font-medium ${
                    job.rate > 10 ? 'text-green-600' : job.rate > 5 ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {job.rate}%
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Applied:</span>
                    <span className="font-medium text-gray-900">{job.applied}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Offers:</span>
                    <span className="font-medium text-green-600">{job.offers}</span>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(job.rate * 5, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Card */}
        <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Insights</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Your success rate is <strong>6.25%</strong>, which is above the industry average of 2-5%</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Contract positions show the highest success rate at <strong>12.5%</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Consider following up after 7 days - most responses come within this timeframe</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Your application volume increased by <strong>12.5%</strong> this period - great momentum!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
