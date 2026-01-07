import { FC, useEffect, useState, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAdminStatus } from '../api/httpClient';
import { RoutePath } from '../router/RoutePath';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export const RoleBasedRoute: FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo
}) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const user = sessionStorage.getItem('email') || localStorage.getItem('email');

  useEffect(() => {
    if (user) {
      // Check cache first to avoid unnecessary API calls and potential failures
      const cachedRole = sessionStorage.getItem('userRole') || localStorage.getItem('userRole');
      if (cachedRole) {
        setUserRole(cachedRole);
        setLoading(false);
        return;
      }

      getAdminStatus(user)
        .then((data) => {
          const role = data.role || 'people';
          setUserRole(role);
          // Cache the role for future use
          sessionStorage.setItem('userRole', role);
          localStorage.setItem('userRole', role);
          setLoading(false);
        })
        .catch(() => {
          setUserRole('people');
          setLoading(false);
        });
    } else {
      setUserRole(null);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#0B0B0C',
          color: '#E0E0E0'
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={RoutePath.Login} state={{ from: location }} replace />;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to={redirectTo || RoutePath.Home} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

