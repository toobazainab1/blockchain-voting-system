import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const isAdmin = !!localStorage.getItem('adminToken');
  if (!isAdmin) return <Navigate to="/bsse-f23b-admin-iiu" replace />;
  return children;
}

export default AdminRoute;