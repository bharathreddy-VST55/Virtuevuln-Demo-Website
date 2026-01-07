import { FC, useEffect, useState } from 'react';
import { getUserData, getAllMissions } from '../../api/httpClient';
import type { UserData } from '../../interfaces/User';
import UserSidebarLayout from '../../components/UserSidebarLayout';

export const UserDashboard: FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = sessionStorage.getItem('email') || localStorage.getItem('email');

  useEffect(() => {
    if (user) {
      Promise.all([
        getUserData(user),
        getAllMissions().catch(() => [])
      ]).then(([data, missionData]) => {
        setUserData(data);
        // Filter missions for current user
        const userMissions = Array.isArray(missionData) 
          ? missionData.filter((m: any) => m.assignedTo?.email === user || m.assignedToId === data.id)
          : [];
        setMissions(userMissions);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) {
    return (
      <UserSidebarLayout>
        <div style={{ color: '#E0E0E0', textAlign: 'center', padding: '50px' }}>
          Loading dashboard...
        </div>
      </UserSidebarLayout>
    );
  }

  const pendingMissions = missions.filter((m: any) => m.status === 'pending');
  const inProgressMissions = missions.filter((m: any) => m.status === 'in_progress');
  const completedMissions = missions.filter((m: any) => m.status === 'completed');

  return (
    <UserSidebarLayout>
      <div style={{ color: '#E0E0E0' }}>
        <h1 style={{ color: '#87CEEB', marginBottom: '30px', fontSize: '32px' }}>
          Welcome, {userData?.firstName || 'User'}!
        </h1>

        {/* Stats Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '25px',
              borderRadius: '10px',
              border: '1px solid #333'
            }}
          >
            <div style={{ fontSize: '14px', color: '#B0B0B0', marginBottom: '10px' }}>
              Total Missions
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#87CEEB' }}>
              {missions.length}
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '25px',
              borderRadius: '10px',
              border: '1px solid #333'
            }}
          >
            <div style={{ fontSize: '14px', color: '#B0B0B0', marginBottom: '10px' }}>
              Pending
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FFA500' }}>
              {pendingMissions.length}
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '25px',
              borderRadius: '10px',
              border: '1px solid #333'
            }}
          >
            <div style={{ fontSize: '14px', color: '#B0B0B0', marginBottom: '10px' }}>
              In Progress
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4CAF50' }}>
              {inProgressMissions.length}
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '25px',
              borderRadius: '10px',
              border: '1px solid #333'
            }}
          >
            <div style={{ fontSize: '14px', color: '#B0B0B0', marginBottom: '10px' }}>
              Completed
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#87CEEB' }}>
              {completedMissions.length}
            </div>
          </div>
        </div>

        {/* Recent Missions */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: '30px',
            borderRadius: '10px',
            border: '1px solid #333'
          }}
        >
          <h2 style={{ color: '#87CEEB', marginBottom: '20px', fontSize: '24px' }}>
            Recent Missions
          </h2>
          {missions.length === 0 ? (
            <div style={{ color: '#B0B0B0', textAlign: 'center', padding: '40px' }}>
              No missions assigned yet. Check back later!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {missions.slice(0, 5).map((mission: any) => (
                <div
                  key={mission.id}
                  style={{
                    padding: '20px',
                    background: '#0B0B0C',
                    borderRadius: '8px',
                    border: '1px solid #333'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h3 style={{ color: '#87CEEB', marginBottom: '10px', fontSize: '18px' }}>
                        {mission.title}
                      </h3>
                      <p style={{ color: '#B0B0B0', marginBottom: '10px', fontSize: '14px' }}>
                        {mission.description}
                      </p>
                      <div style={{ display: 'flex', gap: '15px', fontSize: '12px' }}>
                        <span style={{ color: '#666' }}>
                          Type: <span style={{ color: '#87CEEB' }}>{mission.missionType || 'N/A'}</span>
                        </span>
                        <span style={{ color: '#666' }}>
                          Location: <span style={{ color: '#87CEEB' }}>{mission.location || 'N/A'}</span>
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '8px 15px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background:
                          mission.status === 'completed'
                            ? '#4CAF5020'
                            : mission.status === 'in_progress'
                            ? '#FFA50020'
                            : '#66620',
                        color:
                          mission.status === 'completed'
                            ? '#4CAF50'
                            : mission.status === 'in_progress'
                            ? '#FFA500'
                            : '#B0B0B0',
                        border:
                          mission.status === 'completed'
                            ? '1px solid #4CAF50'
                            : mission.status === 'in_progress'
                            ? '1px solid #FFA500'
                            : '1px solid #666'
                      }}
                    >
                      {mission.status?.toUpperCase() || 'PENDING'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </UserSidebarLayout>
  );
};

export default UserDashboard;

