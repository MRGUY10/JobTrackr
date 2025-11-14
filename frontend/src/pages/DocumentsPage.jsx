import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  EyeIcon,
  CloudArrowUpIcon,
  FolderIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const DocumentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock data - replace with API
  const documents = [
    {
      id: 1,
      name: 'Resume_2025.pdf',
      type: 'resume',
      size: '245 KB',
      uploadDate: '2025-11-10',
      applicationId: 1,
      applicationName: 'Google - Senior Frontend Developer',
      icon: '📄'
    },
    {
      id: 2,
      name: 'Cover_Letter_Microsoft.docx',
      type: 'cover_letter',
      size: '89 KB',
      uploadDate: '2025-11-08',
      applicationId: 2,
      applicationName: 'Microsoft - Full Stack Engineer',
      icon: '📝'
    },
    {
      id: 3,
      name: 'Portfolio_Screenshots.zip',
      type: 'portfolio',
      size: '5.2 MB',
      uploadDate: '2025-11-05',
      applicationId: null,
      applicationName: null,
      icon: '📦'
    },
    {
      id: 4,
      name: 'Certifications_AWS.pdf',
      type: 'certificate',
      size: '1.8 MB',
      uploadDate: '2025-11-03',
      applicationId: null,
      applicationName: null,
      icon: '🎓'
    },
    {
      id: 5,
      name: 'Reference_Letter_John.pdf',
      type: 'reference',
      size: '156 KB',
      uploadDate: '2025-10-28',
      applicationId: 5,
      applicationName: 'Apple - iOS Developer',
      icon: '✉️'
    },
    {
      id: 6,
      name: 'Resume_Frontend_Specialist.pdf',
      type: 'resume',
      size: '267 KB',
      uploadDate: '2025-10-25',
      applicationId: 6,
      applicationName: 'Netflix - Senior Software Engineer',
      icon: '📄'
    },
    {
      id: 7,
      name: 'Technical_Skills_Matrix.xlsx',
      type: 'other',
      size: '45 KB',
      uploadDate: '2025-10-22',
      applicationId: null,
      applicationName: null,
      icon: '📊'
    },
    {
      id: 8,
      name: 'Project_Demo_Video.mp4',
      type: 'portfolio',
      size: '28.5 MB',
      uploadDate: '2025-10-20',
      applicationId: 7,
      applicationName: 'Spotify - UI/UX Engineer',
      icon: '🎬'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Documents', count: documents.length },
    { value: 'resume', label: 'Resumes', count: documents.filter(d => d.type === 'resume').length },
    { value: 'cover_letter', label: 'Cover Letters', count: documents.filter(d => d.type === 'cover_letter').length },
    { value: 'portfolio', label: 'Portfolio', count: documents.filter(d => d.type === 'portfolio').length },
    { value: 'certificate', label: 'Certificates', count: documents.filter(d => d.type === 'certificate').length },
    { value: 'reference', label: 'References', count: documents.filter(d => d.type === 'reference').length },
    { value: 'other', label: 'Other', count: documents.filter(d => d.type === 'other').length }
  ];

  const stats = {
    total: documents.length,
    size: '35.7 MB',
    resumes: documents.filter(d => d.type === 'resume').length,
    recent: documents.filter(d => new Date(d.uploadDate) > new Date('2025-11-01')).length
  };

  const filteredDocuments = documents
    .filter(doc => selectedCategory === 'all' || doc.type === selectedCategory)
    .filter(doc => 
      searchQuery === '' || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.applicationName && doc.applicationName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toUpperCase();
  };

  const getFileColor = (type) => {
    const colors = {
      resume: 'bg-blue-100 text-blue-700',
      cover_letter: 'bg-purple-100 text-purple-700',
      portfolio: 'bg-green-100 text-green-700',
      certificate: 'bg-yellow-100 text-yellow-700',
      reference: 'bg-pink-100 text-pink-700',
      other: 'bg-gray-100 text-gray-700'
    };
    return colors[type] || colors.other;
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
              <Link to="/documents" className="text-primary-600 font-medium border-b-2 border-primary-600 pb-1">
                Documents
              </Link>
              <Link to="/analytics" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Analytics
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <UserCircleIcon className="h-8 w-8 text-gray-600 cursor-pointer hover:text-gray-900" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
          <p className="text-gray-600">Manage your resumes, cover letters, and other job application materials</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Files</span>
              <DocumentTextIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100 text-sm font-medium">Total Size</span>
              <FolderIcon className="h-5 w-5 text-blue-100" />
            </div>
            <div className="text-3xl font-bold">{stats.size}</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100 text-sm font-medium">Resumes</span>
              <DocumentIcon className="h-5 w-5 text-purple-100" />
            </div>
            <div className="text-3xl font-bold">{stats.resumes}</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-100 text-sm font-medium">Recent</span>
              <CloudArrowUpIcon className="h-5 w-5 text-green-100" />
            </div>
            <div className="text-3xl font-bold">{stats.recent}</div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FunnelIcon className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Filter</span>
            </button>
            
            <button 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <PlusIcon className="h-5 w-5" />
              Upload Document
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === category.value
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  selectedCategory === category.value
                    ? 'bg-white/20'
                    : 'bg-gray-100'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div 
              key={doc.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {doc.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate group-hover:text-primary-600 transition-colors">
                      {doc.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getFileColor(doc.type)}`}>
                        {getFileExtension(doc.name)}
                      </span>
                      <span className="text-xs text-gray-500">{doc.size}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setActiveDropdown(activeDropdown === doc.id ? null : doc.id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  
                  {activeDropdown === doc.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left">
                        <EyeIcon className="h-4 w-4" />
                        View
                      </button>
                      <button className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left">
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        Download
                      </button>
                      <hr className="my-1" />
                      <button className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left">
                        <TrashIcon className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-xs text-gray-600 mb-4">
                <div className="flex items-center justify-between">
                  <span>Uploaded</span>
                  <span className="font-medium text-gray-900">
                    {new Date(doc.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                {doc.applicationName && (
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-gray-500">Linked to:</span>
                    <p className="font-medium text-gray-900 mt-1 line-clamp-2">{doc.applicationName}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  View
                </button>
                <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search terms' : 'Start by uploading your first document'}
            </p>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <PlusIcon className="h-5 w-5" />
              Upload Your First Document
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upload Document</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary-500 transition-colors cursor-pointer">
              <CloudArrowUpIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Drop files here or click to browse</p>
              <p className="text-sm text-gray-500">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
                <option>Resume/CV</option>
                <option>Cover Letter</option>
                <option>Portfolio</option>
                <option>Certificate</option>
                <option>Reference Letter</option>
                <option>Other</option>
              </select>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link to Application (Optional)
              </label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
                <option value="">None</option>
                <option>Google - Senior Frontend Developer</option>
                <option>Microsoft - Full Stack Engineer</option>
                <option>Meta - React Developer</option>
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
