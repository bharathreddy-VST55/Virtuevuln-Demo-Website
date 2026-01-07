import { FC, useEffect, useState, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAdminStatus } from '../api/httpClient';
import { RoutePath } from '../router/RoutePath';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export const AdminRouteGuard: FC<AdminRouteGuardProps> = ({ children }) => {
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const user = sessionStorage.getItem('email') || localStorage.getItem('email');

  useEffect(() => {
    if (user) {
      getAdminStatus(user)
        .then((data) => {
          setIsSuperAdmin(data.role === 'super_admin');
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

  if (!isSuperAdmin) {
    return <Navigate to={RoutePath.Login} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

