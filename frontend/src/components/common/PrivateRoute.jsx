import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../../services/auth';

const PrivateRoute = () => {
  const user = getCurrentUser();
  return user ? <Outlet /> : <Navigate to="/register" />;
};

export default PrivateRoute;