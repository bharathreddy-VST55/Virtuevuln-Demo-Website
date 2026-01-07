import { FC, useEffect, useState } from 'react';
import { getAllMissions, getUserData } from '../../api/httpClient';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import type { UserData } from '../../interfaces/User';

export const Missions: FC = () => {
  const [missions, setMissions] = useState<any[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const user = sessionStorage.getItem('email') || localStorage.getItem('email');

  useEffect(() => {
    if (user) {
      Promise.all([
        getAllMissions().catch(() => []),
        getUserData(user)
      ]).then(([missionData, data]) => {
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

  const filteredMissions = missions.filter((mission: any) => {
    if (filter === 'all') return true;
    return mission.status === filter;
  });

  if (loading) {
    return (
      <UserSidebarLayout>
        <div style={{ color: '#E0E0E0', textAlign: 'center', padding: '50px' }}>
          Loading missions...
        </div>
      </UserSidebarLayout>
    );
  }

  return (
    <UserSidebarLayout>
      <div style={{ color: '#E0E0E0' }}>
        <h1 style={{ color: '#87CEEB', marginBottom: '30px', fontSize: '32px' }}>
          My Missions
        </h1>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          {['all', 'pending', 'in_progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '10px 20px',
                background: filter === status
                  ? 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)'
                  : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                color: filter === status ? '#0B0B0C' : '#E0E0E0',
                border: `1px solid ${filter === status ? '#87CEEB' : '#333'}`,
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'capitalize',
                transition: 'all 0.3s ease'
              }}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Missions List */}
        {filteredMissions.length === 0 ? (
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '50px',
              borderRadius: '10px',
              border: '1px solid #333',
              textAlign: 'center',
              color: '#B0B0B0'
            }}
          >
            {filter === 'all' 
              ? 'No missions assigned yet. Check back later!'
              : `No ${filter.replace('_', ' ')} missions.`}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredMissions.map((mission: any) => (
              <div
                key={mission.id}
                style={{
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                  padding: '25px',
                  borderRadius: '10px',
                  border: '1px solid #333'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ color: '#87CEEB', marginBottom: '10px', fontSize: '20px' }}>
                      {mission.title}
                    </h2>
                    <p style={{ color: '#B0B0B0', marginBottom: '15px', fontSize: '14px', lineHeight: '1.6' }}>
                      {mission.description}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '10px 20px',
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
                          : '1px solid #666',
                      whiteSpace: 'nowrap',
                      marginLeft: '20px'
                    }}
                  >
                    {mission.status?.toUpperCase() || 'PENDING'}
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '15px',
                    marginTop: '20px',
                    paddingTop: '20px',
                    borderTop: '1px solid #333'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                      Mission Type
                    </div>
                    <div style={{ color: '#87CEEB', fontSize: '14px' }}>
                      {mission.missionType || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                      Location
                    </div>
                    <div style={{ color: '#87CEEB', fontSize: '14px' }}>
                      {mission.location || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                      Assigned Date
                    </div>
                    <div style={{ color: '#87CEEB', fontSize: '14px' }}>
                      {mission.createdAt
                        ? new Date(mission.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </div>
                  {mission.completedAt && (
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                        Completed Date
                      </div>
                      <div style={{ color: '#4CAF50', fontSize: '14px' }}>
                        {new Date(mission.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                {mission.notes && (
                  <div style={{ marginTop: '15px', padding: '15px', background: '#0B0B0C', borderRadius: '5px', border: '1px solid #333' }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                      Notes
                    </div>
                    <div style={{ color: '#B0B0B0', fontSize: '14px' }}>
                      {mission.notes}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </UserSidebarLayout>
  );
};

export default Missions;

