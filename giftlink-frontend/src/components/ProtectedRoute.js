import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const authToken = sessionStorage.getItem('auth-token');

  if (!authToken) {
    return <Navigate to="/app/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
