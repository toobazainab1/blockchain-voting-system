import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Ballot from './pages/Ballot';
import Receipt from './pages/Receipt';
import Results from './pages/Results';
import Profile from './pages/Profile';
import Mission from './pages/Mission';
import HowItWorks from './pages/HowItWorks';
import AuditTrail from './pages/AuditTrail';
import Compare from './pages/Compare';
import Eligibility from './pages/Eligibility';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminElections from './pages/AdminElections';
import AdminCandidates from './pages/AdminCandidates';
import AdminResults from './pages/AdminResults';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Voter protected */}
        <Route path="/dashboard"          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/ballot/:electionId" element={<ProtectedRoute><Ballot /></ProtectedRoute>} />
        <Route path="/receipt"            element={<ProtectedRoute><Receipt /></ProtectedRoute>} />
        <Route path="/results/:electionId"element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/audit/:electionId"  element={<ProtectedRoute><AuditTrail /></ProtectedRoute>} />
        <Route path="/compare/:electionId"element={<ProtectedRoute><Compare /></ProtectedRoute>} />
        <Route path="/profile"            element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/eligibility"        element={<ProtectedRoute><Eligibility /></ProtectedRoute>} />
        <Route path="/mission"            element={<ProtectedRoute><Mission /></ProtectedRoute>} />
        <Route path="/how-it-works"       element={<ProtectedRoute><HowItWorks /></ProtectedRoute>} />

        {/* Admin — secret URL, share only with your team */}
        <Route path="/bsse-f23b-admin-iiu" element={<AdminLogin />} />
        <Route path="/admin/dashboard"  element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/elections"  element={<AdminRoute><AdminElections /></AdminRoute>} />
        <Route path="/admin/candidates" element={<AdminRoute><AdminCandidates /></AdminRoute>} />
        <Route path="/admin/results"    element={<AdminRoute><AdminResults /></AdminRoute>} />

        {/* Block old admin/login URL */}
        <Route path="/admin/login" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;