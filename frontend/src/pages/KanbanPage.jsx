import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  CalendarIcon,
  BanknotesIcon,
  MapPinIcon
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
          <MapPinIcon className="h-3.5 w-3.5" />
          <span>{application.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <BanknotesIcon className="h-3.5 w-3.5" />
          <span className="font-medium text-gray-900">{application.salary}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>{new Date(application.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {application.notes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-600 line-clamp-2">{application.notes}</p>
        </div>
      )}
    </div>
  );
};

// Droppable Column Component
const DroppableColumn = ({ id, children }) => {
  const { setNodeRef } = useSortable({ id });
  
  return (
    <div ref={setNodeRef} className="h-full">
      {children}
    </div>
  );
};

// Kanban Column Component
const KanbanColumn = ({ status, title, applications, color }) => {
  const applicationIds = applications.map(app => app.id);
  const droppableId = `column-${status}`;

  return (
    <div className="bg-gray-50 rounded-xl p-4 min-w-[300px] flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="px-2 py-0.5 bg-white rounded-full text-xs font-medium text-gray-600">
            {applications.length}
          </span>
        </div>
        <button className="p-1 hover:bg-white rounded transition-colors">
          <PlusIcon className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <SortableContext items={[droppableId, ...applicationIds]} strategy={verticalListSortingStrategy}>
        <DroppableColumn id={droppableId}>
          <div className="space-y-3 min-h-[200px]">
            {applications.map((application) => (
              <SortableApplicationCard key={application.id} application={application} />
            ))}
            {applications.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                Drop applications here
              </div>
            )}
          </div>
        </DroppableColumn>
      </SortableContext>
    </div>
  );
};

const KanbanPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Mock data - replace with API
  const [applications, setApplications] = useState({
    wishlist: [
      {
        id: 'app-1',
        company: 'Tesla',
        position: 'Frontend Developer',
        status: 'wishlist',
        appliedDate: '2025-10-20',
        salary: '$100k - $130k',
        location: 'On-site',
        logo: '⚡',
        notes: 'Planning to apply next week'
      },
      {
        id: 'app-2',
        company: 'Airbnb',
        position: 'UI Engineer',
        status: 'wishlist',
        appliedDate: '2025-10-18',
        salary: '$110k - $145k',
        location: 'Remote',
        logo: '🏠',
        notes: 'Great culture and benefits'
      }
    ],
    applied: [
      {
        id: 'app-3',
        company: 'Microsoft',
        position: 'Full Stack Engineer',
        status: 'applied',
        appliedDate: '2025-11-08',
        salary: '$110k - $140k',
        location: 'Hybrid',
        logo: '🟢',
        notes: 'Waiting for response'
      },
      {
        id: 'app-4',
        company: 'Amazon',
        position: 'Software Development Engineer',
        status: 'applied',
        appliedDate: '2025-11-03',
        salary: '$115k - $145k',
        location: 'Remote',
        logo: '🟠',
        notes: 'Applied through referral'
      },
      {
        id: 'app-5',
        company: 'Spotify',
        position: 'UI/UX Engineer',
        status: 'applied',
        appliedDate: '2025-10-22',
        salary: '$105k - $135k',
        location: 'Hybrid',
        logo: '🟢',
        notes: 'Portfolio submitted'
      }
    ],
    interview: [
      {
        id: 'app-6',
        company: 'Google LLC',
        position: 'Senior Frontend Developer',
        status: 'interview',
        appliedDate: '2025-11-10',
        salary: '$120k - $150k',
        location: 'Remote',
        logo: '🔵',
        notes: 'Technical round scheduled for Nov 16'
      },
      {
        id: 'app-7',
        company: 'Netflix',
        position: 'Senior Software Engineer',
        status: 'interview',
        appliedDate: '2025-10-25',
        salary: '$140k - $170k',
        location: 'Remote',
        logo: '🔴',
        notes: 'Second round next week'
      }
    ],
    offer: [
      {
        id: 'app-8',
        company: 'Meta',
        position: 'React Developer',
        status: 'offer',
        appliedDate: '2025-11-05',
        salary: '$130k - $160k',
        location: 'On-site',
        logo: '🔷',
        notes: 'Offer received, need to respond by Nov 20'
      }
    ],
    rejected: [
      {
        id: 'app-9',
        company: 'Apple',
        position: 'iOS Developer',
        status: 'rejected',
        appliedDate: '2025-10-28',
        salary: '$125k - $155k',
        location: 'On-site',
        logo: '⚪',
        notes: 'Not selected after technical round'
      }
    ]
  });

  const columns = [
    { id: 'wishlist', title: 'Wishlist', color: 'bg-gray-400' },
    { id: 'applied', title: 'Applied', color: 'bg-blue-500' },
    { id: 'interview', title: 'Interview', color: 'bg-purple-500' },
    { id: 'offer', title: 'Offer', color: 'bg-green-500' },
    { id: 'rejected', title: 'Rejected', color: 'bg-red-500' }
  ];

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    // Find source column
    let sourceColumn = null;
    Object.keys(applications).forEach(columnId => {
      if (applications[columnId].find(app => app.id === active.id)) {
        sourceColumn = columnId;
      }
    });

    // Find destination column
    let destColumn = null;
    
    // Check if dropped on a column droppable area
    if (over.id.startsWith('column-')) {
      destColumn = over.id.replace('column-', '');
    }
    
    // If not, check if dropped on another card
    if (!destColumn) {
      Object.keys(applications).forEach(columnId => {
        if (applications[columnId].find(app => app.id === over.id)) {
          destColumn = columnId;
        }
      });
    }

    if (sourceColumn && destColumn && sourceColumn !== destColumn) {
      const sourceApps = [...applications[sourceColumn]];
      const destApps = [...applications[destColumn]];

      const appIndex = sourceApps.findIndex(app => app.id === active.id);
      const [movedApp] = sourceApps.splice(appIndex, 1);
      movedApp.status = destColumn;
      destApps.push(movedApp);

      setApplications({
        ...applications,
        [sourceColumn]: sourceApps,
        [destColumn]: destApps
      });
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeApplication = activeId
    ? Object.values(applications)
        .flat()
        .find(app => app.id === activeId)
    : null;

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
              <Link to="/kanban" className="text-primary-600 font-medium border-b-2 border-primary-600 pb-1">
                Kanban
              </Link>
              <Link to="/documents" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
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

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                status={column.id}
                title={column.title}
                applications={applications[column.id]}
                color={column.color}
              />
            ))}
          </div>

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
                  {applications[column.id].length}
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
      </div>
    </div>
  );
};

export default KanbanPage;
