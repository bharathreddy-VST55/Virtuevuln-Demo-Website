import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAdminStatus } from '../../api/httpClient';
import { RoutePath } from '../../router/RoutePath';

interface SidebarItem {
  name: string;
  path: string;
  icon: string;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Corps Headquarters', path: RoutePath.Dashboard, icon: '🏰' },
  { name: 'Slayer Registry', path: '/admin/users', icon: '📜' },
  { name: 'Mission Hub', path: '/admin/missions', icon: '🎯' },
  { name: 'Personal Records', path: RoutePath.Userprofile, icon: '⚔️' }
];

export const AdminSidebarLayout: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = sessionStorage.getItem('email') || localStorage.getItem('email');
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    // Add a small delay to ensure sessionStorage is fully available after page reload
    // This prevents race conditions with window.location.replace
    const checkRole = () => {
      if (user) {
        // First check sessionStorage for role (faster, avoids 401 errors)
        // Role is stored during login, so this should always be available
        const storedRole = sessionStorage.getItem('userRole') || localStorage.getItem('userRole');

        console.log('AdminSidebarLayout: Checking role for user:', user);
        console.log('AdminSidebarLayout: Stored role from sessionStorage:', sessionStorage.getItem('userRole'));
        console.log('AdminSidebarLayout: Stored role from localStorage:', localStorage.getItem('userRole'));
        console.log('AdminSidebarLayout: Final stored role:', storedRole);
        console.log('AdminSidebarLayout: All sessionStorage keys:', Object.keys(sessionStorage));

        if (storedRole) {
          console.log('AdminSidebarLayout: ✅ Using stored role:', storedRole);
          setUserRole(storedRole);
          // If not super admin, redirect to home (but only if we're sure)
          if (storedRole !== 'super_admin') {
            console.log('AdminSidebarLayout: Not super_admin, redirecting to home');
            // Use setTimeout to prevent redirect loop
            setTimeout(() => {
              navigate(RoutePath.Home);
            }, 100);
          } else {
            console.log('AdminSidebarLayout: ✅ Super admin confirmed, rendering dashboard');
          }
          // IMPORTANT: Return early to prevent further checks
          return;
        }

        // Only reach here if storedRole is null/undefined
        // This should NOT happen if login flow works correctly
        console.error('AdminSidebarLayout: ❌ CRITICAL - No stored role found! This should not happen.');
        console.error('AdminSidebarLayout: sessionStorage keys:', Object.keys(sessionStorage));
        console.error('AdminSidebarLayout: localStorage keys:', Object.keys(localStorage));
        console.error('AdminSidebarLayout: user value:', user);

        // Retry multiple times with increasing delays (might be a timing issue)
        let retryCount = 0;
        const maxRetries = 5;

        const retryCheck = () => {
          retryCount++;
          const retryRole = sessionStorage.getItem('userRole') || localStorage.getItem('userRole');

          if (retryRole) {
            console.log(`AdminSidebarLayout: ✅ Found role on retry ${retryCount}:`, retryRole);
            setUserRole(retryRole);
            if (retryRole !== 'super_admin') {
              setTimeout(() => {
                navigate(RoutePath.Home);
              }, 100);
            }
          } else if (retryCount < maxRetries) {
            console.warn(`AdminSidebarLayout: Retry ${retryCount}/${maxRetries} - role not found yet, retrying...`);
            setTimeout(retryCheck, 200 * retryCount); // Exponential backoff
          } else {
            console.error('AdminSidebarLayout: ❌ Still no role found after all retries, redirecting to login');
            // Only redirect to login if we've exhausted all retries
            setTimeout(() => {
              navigate(RoutePath.Login);
            }, 100);
          }
        };

        // Start retry after initial delay
        setTimeout(retryCheck, 200);
      } else {
        console.log('AdminSidebarLayout: No user found, redirecting to login');
        setTimeout(() => {
          navigate(RoutePath.Login);
        }, 100);
      }
    };

    // Small delay to ensure sessionStorage is available after page reload
    const timer = setTimeout(checkRole, 100);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate(RoutePath.Login);
  };

  if (userRole !== 'super_admin') {
    return null; // Will redirect
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#0B0B0C',
        color: '#E0E0E0'
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: '250px',
          background: 'linear-gradient(180deg, #0B0B0C 0%, #1a1a2e 100%)',
          borderRight: '1px solid #333',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto'
        }}
      >
        {/* Logo/Header */}
        <div
          style={{
            padding: '30px 20px',
            borderBottom: '1px solid #333',
            textAlign: 'left',
            background: 'rgba(135, 206, 235, 0.05)'
          }}
        >
          <div
            style={{
              fontSize: '20px',
              fontWeight: '900',
              color: '#87CEEB',
              letterSpacing: '2px',
              marginBottom: '5px',
              textTransform: 'uppercase'
            }}
          >
            VirtueThreatX
          </div>
          <div style={{ fontSize: '11px', color: '#666', fontWeight: '500' }}>
            by VirtuesTech
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '20px 0' }}>
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  padding: '15px 20px',
                  cursor: 'pointer',
                  background: isActive
                    ? 'linear-gradient(90deg, #87CEEB20 0%, transparent 100%)'
                    : 'transparent',
                  borderLeft: isActive ? '3px solid #87CEEB' : '3px solid transparent',
                  color: isActive ? '#87CEEB' : '#E0E0E0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#1a1a2e';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span style={{ fontSize: '14px' }}>{item.name}</span>
              </div>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div
          style={{
            padding: '20px',
            borderTop: '1px solid #333',
            background: '#1a1a2e'
          }}
        >
          <div style={{ marginBottom: '10px' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#87CEEB',
                marginBottom: '2px'
              }}
            >
              Hashira Admin
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              Org Admin
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px',
              background: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: '250px',
          flex: 1,
          padding: '30px',
          background: '#0B0B0C',
          minHeight: '100vh'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AdminSidebarLayout;

