import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import statisticsService from '../services/statisticsService';
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
  
  // Backend state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overviewStats, setOverviewStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Fetch all statistics
  useEffect(() => {
    fetchStatistics();
  }, [timeRange]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all stats in parallel
      const [overview, monthly, byStatus, companies] = await Promise.all([
        statisticsService.getOverview(),
        statisticsService.getMonthly(),
        statisticsService.getByStatus(),
        statisticsService.getTopCompanies(5)
      ]);

      setOverviewStats({
        totalApplications: overview.total_applications,
        successRate: overview.success_rate,
        byStatus: overview.by_status
      });

      // Transform monthly data for chart (last 6 months)
      const currentMonth = new Date().getMonth() + 1;
      const months = timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : 12;
      const filteredMonthly = monthly.data
        .filter((item) => {
          if (timeRange === '1year') return true;
          const monthsAgo = currentMonth - item.month;
          return monthsAgo >= 0 && monthsAgo < months;
        })
        .map((item) => ({
          month: item.month_name.substring(0, 3),
          applications: item.count
        }));
      setMonthlyData(filteredMonthly);

      // Transform status data for pie chart
      const statusColors = {
        'Applied': '#3B82F6',
        'Interview': '#8B5CF6',
        'Technical Test': '#F59E0B',
        'Offer': '#10B981',
        'Rejected': '#EF4444'
      };
      const statusData = byStatus.data.map((item) => ({
        name: item.status,
        value: item.count,
        color: statusColors[item.status] || '#6B7280'
      }));
      setStatusDistribution(statusData);

      setTopCompanies(companies.data || []);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics');
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };



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

        {!loading && !error && overviewStats && (
          <>
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Applications</span>
              <BriefcaseIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-gray-900">{overviewStats.totalApplications}</div>
            </div>
            <p className="text-xs text-gray-500 mt-2">all time</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Success Rate</span>
              <CheckCircleIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-gray-900">{overviewStats.successRate}%</div>
            </div>
            <p className="text-xs text-gray-500 mt-2">offers received</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">In Interview</span>
              <ClockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-gray-900">{overviewStats.byStatus.interview || 0}</div>
            </div>
            <p className="text-xs text-gray-500 mt-2">active interviews</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Offers Received</span>
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-gray-900">{overviewStats.byStatus.offer || 0}</div>
            </div>
            <p className="text-xs text-gray-500 mt-2">job offers</p>
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

          {/* Top Companies */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Companies Applied</h3>
            {topCompanies.length > 0 ? (
              <div className="space-y-4">
                {topCompanies.map((company, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-primary-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{company.company}</p>
                        <p className="text-sm text-gray-500">{company.applications_count} applications</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-600">{company.last_status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No data available</p>
            )}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {statusDistribution.map((status, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{status.name}</span>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{status.value}</div>
                <div className="text-xs text-gray-500">
                  {overviewStats.totalApplications > 0 
                    ? `${Math.round((status.value / overviewStats.totalApplications) * 100)}%` 
                    : '0%'} of total
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
                  <span>You have submitted <strong>{overviewStats.totalApplications}</strong> job applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Your success rate is <strong>{overviewStats.successRate}%</strong> {overviewStats.successRate >= 2 ? '- Great job!' : '- Keep applying!'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>You have <strong>{overviewStats.byStatus.interview || 0}</strong> active interviews in progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>You've received <strong>{overviewStats.byStatus.offer || 0}</strong> job offers - Congratulations!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
