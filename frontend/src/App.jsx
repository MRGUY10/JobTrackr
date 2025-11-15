import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationsListPage from './pages/ApplicationsListPage';
import AddApplicationPage from './pages/AddApplicationPage';
import KanbanPage from './pages/KanbanPage';
import DocumentsPage from './pages/DocumentsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import CalendarPage from './pages/CalendarPage';
import JobSearchPage from './pages/JobSearchPage';
import AIJobAnalyzerPage from './pages/AIJobAnalyzerPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminApplicationsPage from './pages/AdminApplicationsPage';
import AdminJobsPage from './pages/AdminJobsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><ApplicationsListPage /></ProtectedRoute>} />
        <Route path="/applications/new" element={<ProtectedRoute><AddApplicationPage /></ProtectedRoute>} />
        <Route path="/kanban" element={<ProtectedRoute><KanbanPage /></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/job-search" element={<ProtectedRoute><JobSearchPage /></ProtectedRoute>} />
        <Route path="/ai-analyzer" element={<ProtectedRoute><AIJobAnalyzerPage /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/admin/applications" element={<ProtectedRoute><AdminApplicationsPage /></ProtectedRoute>} />
        <Route path="/admin/jobs" element={<ProtectedRoute><AdminJobsPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
