import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../Components/componentGuests/Spinner';

export default function RoleProtectedRoute({ 
  children, 
  allowedRoles = [],
  requireEmailVerification = true 
}) {
  const { currentUser, userRole, isEmailVerified, loading } = useAuth();
  const location = useLocation();
    
  if (loading) {
    return <Spinner />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireEmailVerification && !isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
