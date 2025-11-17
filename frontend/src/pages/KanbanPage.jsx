import { useDroppable } from '@dnd-kit/core';

// KanbanColumn component for rendering each column in the Kanban board
const KanbanColumn = ({ status, title, applications = [], color }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `column-${status}` });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[320px] max-w-xs bg-gray-50 rounded-xl border border-gray-200 p-4 transition-shadow ${isOver ? 'ring-2 ring-primary-500' : ''}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-3 h-3 rounded-full ${color}`}></span>
        <h2 className="font-semibold text-gray-800 text-lg">{title}</h2>
        <span className="ml-auto text-xs text-gray-500">{applications.length}</span>
      </div>
      <SortableContext items={applications.map(app => app.id)} strategy={verticalListSortingStrategy}>
        {applications.length === 0 ? (
          <div className="text-gray-400 text-sm text-center py-8">No applications</div>
        ) : (
          applications.map((application) => (
            <SortableApplicationCard key={application.id} application={application} />
          ))
        )}
      </SortableContext>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import useAuthStore from '../store/authStore';
import applicationService from '../services/applicationService';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  CalendarIcon,
  BanknotesIcon,
  MapPinIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

// Sortable Card Component
const SortableApplicationCard = ({ application }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg border border-gray-200 p-4 mb-3 cursor-move hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-xl">
            {application.logo}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm group-hover:text-primary-600 transition-colors">
              {application.position}
            </h4>
            <p className="text-xs text-gray-600 mt-0.5">{application.company}</p>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
          <EllipsisVerticalIcon className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>{new Date(application.applied_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
        {application.job_url && (
          <a href={application.job_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-600 hover:underline">
            View Job
          </a>
        )}
      </div>

      {application.notes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-600 line-clamp-2">{application.notes}</p>
        </div>
      )}
    </div>
  );
};

const KanbanPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationService.getApplications();
      setApplications(data.data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = [
    { id: 'Applied', title: 'Applied', color: 'bg-blue-500' },
    { id: 'Interview', title: 'Interview', color: 'bg-purple-500' },
    { id: 'Technical Test', title: 'Technical Test', color: 'bg-yellow-500' },
    { id: 'Offer', title: 'Offer', color: 'bg-green-500' },
    { id: 'Rejected', title: 'Rejected', color: 'bg-red-500' }
  ];

  // Group applications by status
  const groupedApplications = columns.reduce((acc, column) => {
    acc[column.id] = applications.filter(app => app.status === column.id);
    return acc;
  }, {});

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    // Find the application being dragged
    const draggedApp = applications.find(app => app.id === active.id);
    if (!draggedApp) {
      setActiveId(null);
      return;
    }

    // Find destination column
    let destColumn = null;
    
    // Check if dropped on a column droppable area
    if (over.id.startsWith('column-')) {
      destColumn = over.id.replace('column-', '');
    }
    
    // If not, check if dropped on another card
    if (!destColumn) {
      const targetApp = applications.find(app => app.id === over.id);
      if (targetApp) {
        destColumn = targetApp.status;
      }
    }

    if (destColumn && draggedApp.status !== destColumn) {
      // Optimistically update UI
      const updatedApps = applications.map(app =>
        app.id === draggedApp.id ? { ...app, status: destColumn } : app
      );
      setApplications(updatedApps);

      try {
        // Update in backend
        await applicationService.updateApplication(draggedApp.id, {
          ...draggedApp,
          status: destColumn
        });
        setSuccess(`Moved to ${destColumn}`);
        setTimeout(() => setSuccess(null), 2000);
      } catch (err) {
        // Revert on error
        setApplications(applications);
        setError(err.response?.data?.message || 'Failed to update status');
        setTimeout(() => setError(null), 3000);
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeApplication = activeId
    ? applications.find(app => app.id === activeId)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Navigation Header */}
      <Navigation />

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
                className="block px-4 py-3 text-primary-600 bg-primary-50 rounded-lg font-medium"
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
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
              <p className="text-gray-600 mt-1">Drag and drop to organize your applications</p>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:flex-initial sm:w-64 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <Link
                to="/applications/new"
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
              >
                <PlusIcon className="h-5 w-5" />
                New
              </Link>
            </div>
          </div>
        </div>

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

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-6">Start tracking your job applications to see them here.</p>
            <Link 
              to="/applications"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200"
            >
              <PlusIcon className="h-5 w-5" />
              Add Your First Application
            </Link>
          </div>
        ) : (
          <>
        {/* Kanban Board */}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          {/* SortableContext for columns */}
          <SortableContext items={columns.map(col => `column-${col.id}`)}>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  status={column.id}
                  title={column.title}
                  applications={groupedApplications[column.id]}
                  color={column.color}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeApplication ? (
              <div className="bg-white rounded-lg border-2 border-primary-500 p-4 shadow-xl rotate-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-xl">
                    {activeApplication.logo}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {activeApplication.position}
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">{activeApplication.company}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Stats Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Pipeline Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {columns.map((column) => (
              <div key={column.id} className="text-center">
                <div className={`w-12 h-12 ${column.color} rounded-lg mx-auto mb-2 flex items-center justify-center text-white font-bold text-xl`}>
                  {groupedApplications[column.id]?.length || 0}
                </div>
                <p className="text-sm font-medium text-gray-900">{column.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">How to use</h4>
              <p className="text-sm text-gray-700">
                Click and drag application cards between columns to update their status. Changes are saved automatically.
              </p>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default KanbanPage;
