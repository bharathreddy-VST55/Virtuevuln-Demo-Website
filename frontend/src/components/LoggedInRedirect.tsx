import { FC, ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { RoutePath } from '../router/RoutePath';

interface LoggedInRedirectProps {
  children: ReactNode;
}

export const LoggedInRedirect: FC<LoggedInRedirectProps> = ({ children }) => {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const user = sessionStorage.getItem('email') || localStorage.getItem('email');

  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (user) {
      setShouldRedirect(true);
    }
  }, [user]);

  if (shouldRedirect && user) {
    return <Navigate to={RoutePath.Dashboard} replace />;
  }

  return <>{children}</>;
};

