import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationsListPage from './pages/ApplicationsListPage';
import AddApplicationPage from './pages/AddApplicationPage';
import KanbanPage from './pages/KanbanPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/applications" element={<ApplicationsListPage />} />
        <Route path="/applications/new" element={<AddApplicationPage />} />
        <Route path="/kanban" element={<KanbanPage />} />
      </Routes>
    </Router>
  );
}

export default App;
