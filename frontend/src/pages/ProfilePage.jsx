import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import profileService from '../services/profileService';
import Navigation from "../components/Navigation";
import { 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  LinkIcon,
  CameraIcon,
  PencilIcon,
  ArrowLeftIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { BellIcon } from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    bio: '',
    website: '',
    linkedin: '',
    github: '',
    yearsOfExperience: '',
    currentCompany: '',
    education: '',
    skills: []
  });

  const [newSkill, setNewSkill] = useState('');
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    offers: 0,
    documents: 0
  });

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getProfile();
      
      // Update profile data from backend
      const userData = data.user;
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        title: userData.title || '',
        bio: userData.bio || '',
        website: userData.website || '',
        linkedin: userData.linkedin || '',
        github: userData.github || '',
        yearsOfExperience: userData.years_of_experience || '',
        currentCompany: userData.current_company || '',
        education: userData.education || '',
        skills: userData.skills ? JSON.parse(userData.skills) : []
      });

      // Update stats (using applications count from backend)
      setStats({
        applications: userData.applications?.length || 0,
        interviews: userData.applications?.filter(app => app.status === 'interview').length || 0,
        offers: userData.applications?.filter(app => app.status === 'offer').length || 0,
        documents: userData.applications?.reduce((sum, app) => sum + (app.documents?.length || 0), 0) || 0
      });

      // Update auth store with latest user data
      setUser(userData);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Prepare data for backend (convert camelCase to snake_case)
      // Only send fields that have values or convert empty strings to null
      const updateData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone || null,
        location: profileData.location || null,
        title: profileData.title || null,
        bio: profileData.bio || null,
        website: profileData.website || null,
        linkedin: profileData.linkedin || null,
        github: profileData.github || null,
        years_of_experience: profileData.yearsOfExperience || null,
        current_company: profileData.currentCompany || null,
        education: profileData.education || null,
        skills: profileData.skills.length > 0 ? JSON.stringify(profileData.skills) : null
      };

      const response = await profileService.updateProfile(updateData);
      setUser(response.user);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 2048 * 1024) {
      setError('Image size must be less than 2MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const response = await profileService.uploadAvatar(file);
      setSuccess('Avatar uploaded successfully!');
      
      // Refresh profile to get new avatar URL
      await fetchProfile();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleCvChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a PDF, DOC, or DOCX file');
      return;
    }

    if (file.size > 5120 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const response = await profileService.uploadCv(file);
      setSuccess('CV uploaded successfully!');
      
      // Refresh profile to get new CV URL
      await fetchProfile();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error uploading CV:', err);
      setError(err.response?.data?.message || 'Failed to upload CV');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Navigation Bar */}
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
                className="flex items-center gap-3 px-4 py-3 text-primary-600 bg-primary-50 rounded-lg font-medium"
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
      {/* Mobile Navigation (shows when isMobileMenuOpen) */}
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
            <Navigation />
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
                className="flex items-center gap-3 px-4 py-3 text-primary-600 bg-primary-50 rounded-lg font-medium"
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
              <Link 
                to="/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </Link>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <PencilIcon className="h-5 w-5" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      fetchProfile(); // Reset data
                    }}
                    disabled={saving}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-5 w-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="relative group">
                  {user?.avatar ? (
                    <img 
                      src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/storage/${user.avatar}`} 
                      alt={profileData.name}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center text-5xl font-bold text-primary-600">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors shadow-lg cursor-pointer">
                      <CameraIcon className="h-5 w-5" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{profileData.name}</h2>
              <p className="text-lg text-gray-600 mb-3">{profileData.title}</p>
              <p className="text-gray-700 mb-4">{profileData.bio}</p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="h-4 w-4" />
                  {profileData.email}
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  {profileData.phone}
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  {profileData.location}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{stats.applications}</div>
              <p className="text-sm text-gray-600 mt-1">Applications</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{stats.interviews}</div>
              <p className="text-sm text-gray-600 mt-1">Interviews</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{stats.offers}</div>
              <p className="text-sm text-gray-600 mt-1">Offers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{stats.documents}</div>
              <p className="text-sm text-gray-600 mt-1">Documents</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('personal')}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'personal'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab('professional')}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'professional'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Professional Details
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'documents'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Documents & CV
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="4"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={profileData.website}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={profileData.linkedin}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub
                    </label>
                    <input
                      type="url"
                      name="github"
                      value={profileData.github}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Professional Details Tab */}
            {activeTab === 'professional' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={profileData.title}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={profileData.yearsOfExperience}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Company
                    </label>
                    <input
                      type="text"
                      name="currentCompany"
                      value={profileData.currentCompany}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={profileData.education}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium flex items-center gap-2"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-primary-900"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                        placeholder="Add a skill..."
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                      <button
                        onClick={handleAddSkill}
                        className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary-500 transition-colors cursor-pointer">
                    <DocumentArrowUpIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Resume/CV</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Click to browse or drop your file here
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleCvChange}
                    className="hidden"
                  />
                </label>

                {user?.cv_path && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Current Resume</p>
                        <a 
                          href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/storage/${user.cv_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:underline"
                        >
                          {user.cv_path.split('/').pop()} - Click to view
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {!user?.cv_path && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600">No CV uploaded yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </>
      )}
    </div>
    </div>
  );
};

export default ProfilePage;
