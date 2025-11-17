import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Navigation from '../components/Navigation';
import applicationService from '../services/applicationService';
import documentService from '../services/documentService';
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
  DocumentIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const DocumentsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('cv');
  const [selectedApplication, setSelectedApplication] = useState('');

  // Stats and categories
  const [stats, setStats] = useState({ total: 0, size: '0 MB', resumes: 0, recent: 0 });
  const [categories, setCategories] = useState([
    { value: 'all', label: 'All', count: 0 },
    { value: 'cv', label: 'Resumes', count: 0 },
    { value: 'cover_letter', label: 'Cover Letters', count: 0 },
    { value: 'portfolio', label: 'Portfolios', count: 0 },
    { value: 'certificate', label: 'Certificates', count: 0 },
    { value: 'reference', label: 'References', count: 0 },
    { value: 'other', label: 'Other', count: 0 },
  ]);

  // Fetch applications and documents
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch applications
        const appsResponse = await applicationService.getApplications();
        const apps = appsResponse.data || appsResponse;
        setApplications(apps);
        // Fetch documents for each application
        let allDocuments = [];
        for (const app of apps) {
          try {
            const docsResponse = await documentService.getDocuments(app.id);
            const docs = (docsResponse.data || docsResponse).map(doc => ({
              ...doc,
              applicationName: `${app.company} - ${app.position}`,
              applicationId: app.id
            }));
            allDocuments.push(...docs);
          } catch (err) {
            // Ignore per-app errors
          }
        }
        setDocuments(allDocuments);
        // Calculate stats
        const total = allDocuments.length;
        const size = (allDocuments.reduce((acc, doc) => acc + (doc.file_size || 0), 0) / 1024 / 1024).toFixed(2) + ' MB';
        const resumes = allDocuments.filter(doc => doc.type === 'cv').length;
        const recent = allDocuments.filter(doc => {
          const d = new Date(doc.created_at);
          const now = new Date();
          return (now - d) / (1000 * 60 * 60 * 24) < 7;
        }).length;
        setStats({ total, size, resumes, recent });
        // Calculate categories
        setCategories(cats => cats.map(cat => ({
          ...cat,
          count: cat.value === 'all' ? total : allDocuments.filter(doc => doc.type === cat.value).length
        })));
      } catch (err) {
        setError('Failed to load documents or applications');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtered documents
  const filteredDocuments = documents.filter(doc =>
    (selectedCategory === 'all' || doc.type === selectedCategory) &&
    (searchQuery === '' ||
      doc.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.applicationName && doc.applicationName.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  // Format file size
  const formatFileSize = (size) => {
    if (!size) return '0 B';
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    return (size / 1024 / 1024).toFixed(2) + ' MB';
  };

  // Handlers (stubs for now)
  const handleDownload = (doc) => {
    // Implement download logic
    window.open(doc.url, '_blank');
  };
  const handleDelete = (doc) => {
    // Implement delete logic
    alert('Delete not implemented');
  };
  const handleUpload = () => {
    // Implement upload logic
    alert('Upload not implemented');
  };

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toUpperCase();
  };

  const getFileColor = (type) => {
    const colors = {
      cv: 'bg-blue-100 text-blue-700',
      cover_letter: 'bg-purple-100 text-purple-700',
      portfolio: 'bg-green-100 text-green-700',
      certificate: 'bg-yellow-100 text-yellow-700',
      reference: 'bg-pink-100 text-pink-700',
      other: 'bg-gray-100 text-gray-700'
    };
    return colors[type] || colors.other;
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️'
    };
    return icons[ext] || '📎';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Navigation Header */}
      <Navigation />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
          <p className="text-gray-600">Manage your resumes, cover letters, and other job application materials</p>
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

        {!loading && !error && (
          <>
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
                    {getFileIcon(doc.original_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate group-hover:text-primary-600 transition-colors">
                      {doc.original_name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getFileColor(doc.type)}`}>
                        {getFileExtension(doc.original_name)}
                      </span>
                      <span className="text-xs text-gray-500">{formatFileSize(doc.file_size)}</span>
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
                      <button 
                        onClick={() => handleDownload(doc)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        Download
                      </button>
                      <hr className="my-1" />
                      <button 
                        onClick={() => handleDelete(doc)}
                        className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                      >
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
                    {new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                <button 
                  onClick={() => handleDownload(doc)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200"
                >
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
              {searchQuery ? 'Try adjusting your search terms' : applications.length === 0 ? 'Create an application first to upload documents' : 'Start by uploading your first document'}
            </p>
            {applications.length > 0 && (
              <button 
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <PlusIcon className="h-5 w-5" />
                Upload Your First Document
              </button>
            )}
          </div>
        )}
        </>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upload Document</h2>
              <button 
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={uploading}
              >
                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <label className="block border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary-500 transition-colors cursor-pointer">
              <input 
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              <CloudArrowUpIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              {selectedFile ? (
                <>
                  <p className="text-lg font-medium text-gray-900 mb-2">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium text-gray-900 mb-2">Click to select file</p>
                  <p className="text-sm text-gray-500">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                </>
              )}
            </label>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <select 
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                disabled={uploading}
              >
                <option value="cv">Resume/CV</option>
                <option value="cover_letter">Cover Letter</option>
                <option value="portfolio">Portfolio</option>
                <option value="certificate">Certificate</option>
                <option value="reference">Reference Letter</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link to Application <span className="text-red-500">*</span>
              </label>
              <select 
                value={selectedApplication}
                onChange={(e) => setSelectedApplication(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                disabled={uploading}
              >
                <option value="">Select an application</option>
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.company} - {app.position}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
              <button 
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
