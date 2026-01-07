import { FC, useEffect, useState } from 'react';
import { getAdminStatus } from '../api/httpClient';
import { AdminDashboard } from '../pages/auth/AdminDashboard';
import { HashiraDashboard } from '../pages/auth/HashiraDashboard';
import { DemonSlayerDashboard } from '../pages/user/DemonSlayerDashboard';
import { UserDashboard } from '../pages/user/UserDashboard';
import { RoutePath } from '../router/RoutePath';
import { Navigate } from 'react-router-dom';

export const DashboardRouter: FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const user = sessionStorage.getItem('email') || localStorage.getItem('email');

  useEffect(() => {
    if (user) {
      // INTENTIONAL VULNERABILITY: Weak role validation
      // Role is stored in client-side storage and can be manipulated
      // Secure approach: Always verify role from backend on each request, use server-side session
      const storedRole = sessionStorage.getItem('userRole') || localStorage.getItem('userRole');
      
      console.log('DashboardRouter: Checking role for user:', user);
      console.log('DashboardRouter: Stored role:', storedRole);
      
      if (storedRole) {
        console.log('DashboardRouter: Using stored role:', storedRole);
        setUserRole(storedRole);
        setLoading(false);
      } else {
        console.warn('DashboardRouter: No stored role found, making API call (this should not happen)');
        // Only make API call if role is not in storage
        // This should rarely happen if login flow works correctly
        getAdminStatus(user)
          .then((data) => {
            const role = data.role || 'people';
            console.log('DashboardRouter: API returned role:', role);
            setUserRole(role);
            sessionStorage.setItem('userRole', role);
            localStorage.setItem('userRole', role);
            setLoading(false);
          })
          .catch((err) => {
            console.error('DashboardRouter: Error fetching user role:', err);
            // If API call fails, default to 'people' role
            // This prevents the dashboard from breaking
            setUserRole('people');
            sessionStorage.setItem('userRole', 'people');
            localStorage.setItem('userRole', 'people');
            setLoading(false);
          });
      }
    } else {
      console.log('DashboardRouter: No user found');
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
    return <Navigate to={RoutePath.Login} replace />;
  }

  // Route to appropriate dashboard based on role
  if (userRole === 'super_admin') {
    return <AdminDashboard />;
  }

  if (userRole === 'hashira') {
    return <HashiraDashboard />;
  }

  if (userRole === 'demon_slayer_corps') {
    return <DemonSlayerDashboard />;
  }

  // Default to UserDashboard for 'people' role and any other roles
  return <UserDashboard />;
};

