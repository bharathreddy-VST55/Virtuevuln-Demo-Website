import { FC } from 'react';
import { Link } from 'react-router-dom';
import { RoutePath } from '../../router/RoutePath';

export const DashboardDemo: FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0B0B0C 0%, #1a1a2e 100%)',
        color: '#E0E0E0',
        padding: '40px 20px'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#87CEEB',
              marginBottom: '20px',
              textShadow: '0 0 20px rgba(135, 206, 235, 0.5)'
            }}
          >
            🛡️ Admin Dashboard Management
          </h1>
          <p style={{ fontSize: '20px', color: '#B0B0B0', marginBottom: '30px' }}>
            Complete Dashboard & User Management System
          </p>
          <div
            style={{
              display: 'inline-block',
              padding: '10px 30px',
              background: 'linear-gradient(135deg, #87CEEB 0%, #4A90E2 100%)',
              borderRadius: '25px',
              color: '#0B0B0C',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            ✅ Ready for Production
          </div>
        </div>

        {/* Features Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginBottom: '60px'
          }}
        >
          {/* Feature 1: Dashboard Overview */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '30px',
              borderRadius: '15px',
              border: '1px solid #333',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>📊</div>
            <h3 style={{ color: '#87CEEB', marginBottom: '15px', fontSize: '24px' }}>
              Dashboard Overview
            </h3>
            <p style={{ color: '#B0B0B0', lineHeight: '1.6', marginBottom: '20px' }}>
              Real-time statistics and analytics for users, missions, and system performance.
              Visual charts and graphs for quick insights.
            </p>
            <ul style={{ color: '#D0D0D0', paddingLeft: '20px' }}>
              <li>User Statistics</li>
              <li>Mission Statistics</li>
              <li>System Performance</li>
              <li>Activity Logs</li>
            </ul>
          </div>

          {/* Feature 2: User Management */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '30px',
              borderRadius: '15px',
              border: '1px solid #333',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>👤</div>
            <h3 style={{ color: '#87CEEB', marginBottom: '15px', fontSize: '24px' }}>
              User Management
            </h3>
            <p style={{ color: '#B0B0B0', lineHeight: '1.6', marginBottom: '20px' }}>
              Complete user administration system with role-based access control.
              Create, edit, delete, and manage user accounts.
            </p>
            <ul style={{ color: '#D0D0D0', paddingLeft: '20px' }}>
              <li>Create New Users</li>
              <li>Edit User Details</li>
              <li>Role Assignment</li>
              <li>User Search & Filter</li>
            </ul>
          </div>

          {/* Feature 3: Missions */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '30px',
              borderRadius: '15px',
              border: '1px solid #333',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>🎯</div>
            <h3 style={{ color: '#87CEEB', marginBottom: '15px', fontSize: '24px' }}>
              Mission Management
            </h3>
            <p style={{ color: '#B0B0B0', lineHeight: '1.6', marginBottom: '20px' }}>
              Track and manage all missions. Assign missions to users, monitor progress,
              and view completion status.
            </p>
            <ul style={{ color: '#D0D0D0', paddingLeft: '20px' }}>
              <li>Mission Creation</li>
              <li>Assignment System</li>
              <li>Progress Tracking</li>
              <li>Status Management</li>
            </ul>
          </div>

          {/* Feature 4: Settings */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '30px',
              borderRadius: '15px',
              border: '1px solid #333',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>⚙️</div>
            <h3 style={{ color: '#87CEEB', marginBottom: '15px', fontSize: '24px' }}>
              System Settings
            </h3>
            <p style={{ color: '#B0B0B0', lineHeight: '1.6', marginBottom: '20px' }}>
              Configure system-wide settings, security options, and application preferences.
            </p>
            <ul style={{ color: '#D0D0D0', paddingLeft: '20px' }}>
              <li>System Configuration</li>
              <li>Security Settings</li>
              <li>Notification Preferences</li>
              <li>Maintenance Mode</li>
            </ul>
          </div>

          {/* Feature 5: Assignment */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '30px',
              borderRadius: '15px',
              border: '1px solid #333',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>📋</div>
            <h3 style={{ color: '#87CEEB', marginBottom: '15px', fontSize: '24px' }}>
              Assignment System
            </h3>
            <p style={{ color: '#B0B0B0', lineHeight: '1.6', marginBottom: '20px' }}>
              Assign missions and tasks to users with priority levels and deadlines.
            </p>
            <ul style={{ color: '#D0D0D0', paddingLeft: '20px' }}>
              <li>Mission Assignment</li>
              <li>Priority Management</li>
              <li>Deadline Tracking</li>
              <li>Assignment History</li>
            </ul>
          </div>

          {/* Feature 6: Killed Demons */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '30px',
              borderRadius: '15px',
              border: '1px solid #333',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>⚔️</div>
            <h3 style={{ color: '#87CEEB', marginBottom: '15px', fontSize: '24px' }}>
              Killed Demons
            </h3>
            <p style={{ color: '#B0B0B0', lineHeight: '1.6', marginBottom: '20px' }}>
              Track all demon eliminations with evidence, locations, and slayer information.
            </p>
            <ul style={{ color: '#D0D0D0', paddingLeft: '20px' }}>
              <li>Demon Records</li>
              <li>Evidence Management</li>
              <li>Location Tracking</li>
              <li>Slayer Attribution</li>
            </ul>
          </div>

          {/* Feature 7: Hashiras Hideout */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '30px',
              borderRadius: '15px',
              border: '1px solid #333',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>🏰</div>
            <h3 style={{ color: '#87CEEB', marginBottom: '15px', fontSize: '24px' }}>
              Hashiras Hideout Areas
            </h3>
            <p style={{ color: '#B0B0B0', lineHeight: '1.6', marginBottom: '20px' }}>
              Manage Hashira estates and hideout locations with member assignments.
            </p>
            <ul style={{ color: '#D0D0D0', paddingLeft: '20px' }}>
              <li>Hideout Locations</li>
              <li>Hashira Assignments</li>
              <li>Member Management</li>
              <li>Status Tracking</li>
            </ul>
          </div>
        </div>

        {/* Access Dashboard Button */}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <Link
            to={RoutePath.Dashboard}
            style={{
              display: 'inline-block',
              padding: '20px 50px',
              background: 'linear-gradient(135deg, #87CEEB 0%, #4A90E2 100%)',
              color: '#0B0B0C',
              textDecoration: 'none',
              borderRadius: '10px',
              fontSize: '20px',
              fontWeight: 'bold',
              boxShadow: '0 5px 20px rgba(135, 206, 235, 0.4)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            🚀 Access Admin Dashboard
          </Link>
        </div>

        {/* Technical Details */}
        <div
          style={{
            marginTop: '60px',
            padding: '30px',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '15px',
            border: '1px solid #333'
          }}
        >
          <h2 style={{ color: '#87CEEB', marginBottom: '20px', fontSize: '28px' }}>
            Technical Details
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#87CEEB', marginBottom: '10px' }}>Frontend</h4>
              <ul style={{ color: '#B0B0B0', paddingLeft: '20px' }}>
                <li>React + TypeScript</li>
                <li>React Router</li>
                <li>Responsive Design</li>
                <li>Dark Theme UI</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#87CEEB', marginBottom: '10px' }}>Backend</h4>
              <ul style={{ color: '#B0B0B0', paddingLeft: '20px' }}>
                <li>NestJS Framework</li>
                <li>PostgreSQL Database</li>
                <li>JWT Authentication</li>
                <li>RESTful API</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#87CEEB', marginBottom: '10px' }}>Security</h4>
              <ul style={{ color: '#B0B0B0', paddingLeft: '20px' }}>
                <li>Role-Based Access Control</li>
                <li>Session Management</li>
                <li>Token Authentication</li>
                <li>Secure API Endpoints</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDemo;

