import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { RoutePath } from '../router/RoutePath';

interface LoggedOutOnlyProps {
  children: ReactNode;
}

/**
 * Component that only renders children if user is NOT logged in.
 * If user is logged in, redirects to dashboard.
 */
export const LoggedOutOnly: FC<LoggedOutOnlyProps> = ({ children }) => {
  const user = sessionStorage.getItem('email') || localStorage.getItem('email');

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to={RoutePath.Dashboard} replace />;
  }

  // If user is not logged in, show the public page
  return <>{children}</>;
};

