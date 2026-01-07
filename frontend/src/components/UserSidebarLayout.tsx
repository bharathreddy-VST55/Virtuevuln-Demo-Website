import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getAdminStatus, getUserData } from '../api/httpClient';
import { RoutePath } from '../router/RoutePath';
import type { UserData } from '../interfaces/User';

interface SidebarItem {
  name: string;
  path: string;
  icon: string;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', path: RoutePath.Dashboard, icon: '📊' },
  { name: 'Profile', path: RoutePath.Userprofile, icon: '👤' },
  { name: 'Shop', path: RoutePath.Shop, icon: '🛒' },
  { name: 'Chat', path: RoutePath.Chat, icon: '💬' },
  { name: 'Missions', path: '/missions', icon: '🎯' }
];

export const UserSidebarLayout: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = sessionStorage.getItem('email') || localStorage.getItem('email');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        getUserData(user),
        getAdminStatus(user).catch(() => ({ role: 'people' }))
      ]).then(([data, permissions]) => {
        setUserData(data);
        setUserRole(permissions.role || 'people');
        setLoading(false);
        
        // Redirect super admin to admin dashboard
        if (permissions.role === 'super_admin') {
          navigate('/dashboard');
        }
      }).catch(() => {
        setLoading(false);
        navigate(RoutePath.Login);
      });
    } else {
      navigate(RoutePath.Login);
    }
  }, [user, navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate(RoutePath.Login);
  };

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

  if (!user || userRole === 'super_admin') {
    return null; // Will redirect
  }

  const userName = userData 
    ? `${userData.firstName} ${userData.lastName}` 
    : user || 'User';

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
          overflowY: 'auto',
          zIndex: 1000
        }}
      >
        {/* Logo/Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #333',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#87CEEB',
              marginBottom: '5px'
            }}
          >
            DEMON SLAYERS
          </div>
          <div style={{ fontSize: '12px', color: '#B0B0B0' }}>
            {userRole === 'hashira' ? 'Hashira' : 
             userRole === 'demon_slayer_corps' ? 'Demon Slayer Corps' : 
             'Member'}
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '20px 0' }}>
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path === '/missions' && location.pathname.startsWith('/missions'));
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  textDecoration: 'none',
                  display: 'block'
                }}
              >
                <div
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
              </Link>
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
                marginBottom: '5px'
              }}
            >
              {userName}
            </div>
            <div style={{ fontSize: '12px', color: '#B0B0B0' }}>
              {user}
            </div>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
              Role: {userRole}
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

export default UserSidebarLayout;

