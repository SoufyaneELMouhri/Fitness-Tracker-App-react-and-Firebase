// Hooks/useRoleNavigation.js
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseAuth } from './UseAuth';

export const useRoleNavigation = () => {
  const navigate = useNavigate();
  const { userRole, isEmailVerified, profileCompleted } = UseAuth();

  const getDashboardPath = useCallback((role = userRole) => {
    if (role === 'admin') return '/admin';
    if (role === 'coach') return '/coach';
    return '/app';
  }, [userRole]);

  const navigateToDashboard = useCallback(() => {
    if (!isEmailVerified) {
      navigate('/verified-account', { replace: true });
      return;
    }

    if (!profileCompleted) {
      navigate('/onboarding', { replace: true });
      return;
    }

    const path = getDashboardPath();
    navigate(path, { replace: true });
  }, [isEmailVerified, profileCompleted, getDashboardPath, navigate]);

  const navigateToRole = useCallback((role) => {
    const path = getDashboardPath(role);
    navigate(path, { replace: true });
  }, [getDashboardPath, navigate]);

  return {
    getDashboardPath,
    navigateToDashboard,
    navigateToRole
  };
};
