import { FC, useEffect, useState, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getAdminStatus } from '../api/httpClient';
import { RoutePath } from '../router/RoutePath';

interface SuperAdminRedirectProps {
  children: ReactNode;
}

export const SuperAdminRedirect: FC<SuperAdminRedirectProps> = ({ children }) => {
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const user = sessionStorage.getItem('email') || localStorage.getItem('email');

  useEffect(() => {
    if (user) {
      // Check cache first
      const cachedRole = sessionStorage.getItem('userRole') || localStorage.getItem('userRole');
      if (cachedRole) {
        setIsSuperAdmin(cachedRole === 'super_admin');
        setLoading(false);
        return;
      }

      getAdminStatus(user)
        .then((data) => {
          const role = data.role || 'people';
          setIsSuperAdmin(role === 'super_admin');
          // Cache the role
          sessionStorage.setItem('userRole', role);
          localStorage.setItem('userRole', role);
          setLoading(false);
        })
        .catch(() => {
          setIsSuperAdmin(false);
          setLoading(false);
        });
    } else {
      setIsSuperAdmin(false);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return null;
  }

  // If super admin tries to access public pages, redirect to dashboard immediately
  if (isSuperAdmin) {
    // Use window.location for immediate redirect to prevent any rendering
    if (window.location.pathname !== RoutePath.Dashboard) {
      window.location.href = RoutePath.Dashboard;
      return null;
    }
    return <Navigate to={RoutePath.Dashboard} replace />;
  }

  return <>{children}</>;
};

