import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../../services/auth';

const AdminRoute = () => {
  const user = getCurrentUser();
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;