// routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Spinner from '../Components/componentGuests/Spinner';
import { UseAuth } from '../Hooks/UseAuth';

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [],
  requireEmailVerification = true,
  requireProfileCompletion = true 
}) {
  const { 
    currentUser, 
    userRole, 
    isEmailVerified, 
    profileCompleted,
    loading 
  } = UseAuth();
  console.log({ currentUser, userRole, isEmailVerified, profileCompleted, loading });

  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireEmailVerification && !isEmailVerified) {
    return <Navigate to="/verified-account" replace />;
  }

  if (requireProfileCompletion && !profileCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    console.warn('Access denied:', { userRole, allowedRoles });
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
