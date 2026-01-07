import { FC, useEffect, useState } from 'react';
import { getAllMissions, updateMissionStatus, getUserData } from '../../api/httpClient';
import type { UserData } from '../../interfaces/User';
import UserSidebarLayout from '../../components/UserSidebarLayout';

interface Mission {
  id: number;
  title: string;
  description: string;
  missionType: string;
  status: string;
  location?: string;
  assignedBy?: { firstName: string; lastName: string; email: string };
  assignedTo?: { firstName: string; lastName: string; email: string; id: number };
  completedAt?: string;
  createdAt: string;
  notes?: string;
}

export const DemonSlayerDashboard: FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userEmail = sessionStorage.getItem('email') || localStorage.getItem('email');
  const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [userDataResult, missionsData] = await Promise.all([
        getUserData(userEmail || '').catch(() => null),
        getAllMissions().catch(() => [])
      ]);

      setUserData(userDataResult);

      // INTENTIONAL VULNERABILITY: Insecure Direct Object Reference (IDOR)
      // Frontend filters missions by assignedTo email, but backend doesn't enforce this
      // An attacker could modify the API response or directly call the API to see all missions
      // Secure approach: Backend should filter missions by assignedTo.id matching authenticated user's ID
      const userMissions = Array.isArray(missionsData)
        ? missionsData.filter((m: Mission) => 
            m.assignedTo?.email === userEmail || 
            m.assignedTo?.id === parseInt(userId || '0')
          )
        : [];

      setMissions(userMissions);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (missionId: number, newStatus: string) => {
    setLoading(true);
    try {
      // INTENTIONAL VULNERABILITY: Predictable resource IDs
      // Mission IDs are sequential integers that can be guessed
      // An attacker could try to update missions they don't own by guessing IDs
      // Secure approach: Use UUIDs and verify ownership on backend
      await updateMissionStatus(missionId, newStatus);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update mission status');
    } finally {
      setLoading(false);
    }
  };

  const pendingMissions = missions.filter((m: Mission) => m.status === 'pending');
  const inProgressMissions = missions.filter((m: Mission) => m.status === 'in_progress');
  const completedMissions = missions.filter((m: Mission) => m.status === 'completed');

  if (loading && missions.length === 0) {
    return (
      <UserSidebarLayout>
        <div style={{ color: '#E0E0E0', textAlign: 'center', padding: '50px' }}>
          Loading dashboard...
        </div>
      </UserSidebarLayout>
    );
  }

  return (
    <UserSidebarLayout>
      <div style={{ color: '#E0E0E0', minHeight: '100vh', background: '#0B0B0C', padding: '20px' }}>
        <h1 style={{ color: '#87CEEB', marginBottom: '30px', fontSize: '32px' }}>
          Demon Slayer Corps Dashboard
        </h1>
        <p style={{ color: '#B0B0B0', marginBottom: '30px' }}>
          Welcome, {userData?.firstName || 'Demon Slayer'}! Here are your assigned missions.
        </p>

        {error && (
          <div style={{ 
            padding: '15px', 
            background: '#ff4444', 
            color: '#fff', 
            borderRadius: '5px', 
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: '25px',
            borderRadius: '10px',
            border: '1px solid #333'
          }}>
            <div style={{ fontSize: '14px', color: '#B0B0B0', marginBottom: '10px' }}>
              Total Missions
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#87CEEB' }}>
              {missions.length}
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: '25px',
            borderRadius: '10px',
            border: '1px solid #333'
          }}>
            <div style={{ fontSize: '14px', color: '#B0B0B0', marginBottom: '10px' }}>
              Pending
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FFA500' }}>
              {pendingMissions.length}
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: '25px',
            borderRadius: '10px',
            border: '1px solid #333'
          }}>
            <div style={{ fontSize: '14px', color: '#B0B0B0', marginBottom: '10px' }}>
              In Progress
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4CAF50' }}>
              {inProgressMissions.length}
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: '25px',
            borderRadius: '10px',
            border: '1px solid #333'
          }}>
            <div style={{ fontSize: '14px', color: '#B0B0B0', marginBottom: '10px' }}>
              Completed
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#87CEEB' }}>
              {completedMissions.length}
            </div>
          </div>
        </div>

        {/* Missions List */}
        <div>
          <h2 style={{ color: '#87CEEB', marginBottom: '20px' }}>My Missions</h2>
          
          {missions.length === 0 ? (
            <div style={{
              background: '#1A1A1C',
              padding: '40px',
              borderRadius: '8px',
              border: '1px solid #333',
              textAlign: 'center'
            }}>
              <p style={{ color: '#888', fontSize: '18px' }}>
                No missions assigned yet. Check back later!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {missions.map((mission: Mission) => (
                <div
                  key={mission.id}
                  style={{
                    background: '#1A1A1C',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #333'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: '#87CEEB', marginBottom: '10px' }}>{mission.title}</h3>
                      <p style={{ color: '#B0B0B0', marginBottom: '10px' }}>{mission.description}</p>
                      <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>
                        <div>Type: {mission.missionType}</div>
                        <div>Status: <strong style={{ color: '#87CEEB' }}>{mission.status}</strong></div>
                        {mission.location && <div>Location: {mission.location}</div>}
                        {mission.assignedBy && (
                          <div>Assigned by: {mission.assignedBy.firstName} {mission.assignedBy.lastName}</div>
                        )}
                        {mission.notes && (
                          <div style={{ marginTop: '10px', padding: '10px', background: '#0B0B0C', borderRadius: '5px' }}>
                            <strong>Notes:</strong> {mission.notes}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {mission.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(mission.id, 'in_progress')}
                          style={{
                            padding: '8px 16px',
                            background: '#4CAF50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          Start Mission
                        </button>
                      )}
                      {mission.status === 'in_progress' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(mission.id, 'completed')}
                            style={{
                              padding: '8px 16px',
                              background: '#87CEEB',
                              color: '#000',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontWeight: 'bold'
                            }}
                          >
                            Complete Mission
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(mission.id, 'pending')}
                            style={{
                              padding: '8px 16px',
                              background: '#666',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}
                          >
                            Put on Hold
                          </button>
                        </>
                      )}
                      {mission.status === 'completed' && (
                        <div style={{
                          padding: '8px 16px',
                          background: '#4CAF50',
                          color: '#fff',
                          borderRadius: '5px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}>
                          ✓ Completed
                        </div>
                      )}
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

