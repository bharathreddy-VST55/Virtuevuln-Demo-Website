import { ChangeEvent, FC, useEffect, useState } from 'react';
import {
  getAllMissions,
  getAllUsers,
  createMission,
  assignMission,
  getMissionStats
} from '../../api/httpClient';
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
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

type TabType = 'dashboard' | 'missions' | 'assign' | 'chat';

export const HashiraDashboard: FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [missions, setMissions] = useState<Mission[]>([]);
  const [demonSlayers, setDemonSlayers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateMission, setShowCreateMission] = useState(false);

  // Mission creation form
  const [newMission, setNewMission] = useState({
    title: '',
    description: '',
    missionType: 'kill_demon',
    assignedToId: '',
    location: '',
    notes: ''
  });

  // Assignment form
  const [assignmentForm, setAssignmentForm] = useState({
    missionId: '',
    assignTo: '',
    priority: 'medium'
  });

  const userEmail = sessionStorage.getItem('email') || localStorage.getItem('email');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [missionsData, usersData] = await Promise.all([
        getAllMissions().catch(() => []),
        getAllUsers().catch(() => [])
      ]);

      // INTENTIONAL VULNERABILITY: Weak role validation
      // The frontend filters demon slayers, but this can be bypassed by modifying the API response
      // Secure approach: Backend should enforce role filtering and return only demon_slayer_corps users
      const demonSlayerUsers = Array.isArray(usersData)
        ? usersData.filter((u: User) => u.role === 'demon_slayer_corps')
        : [];

      // INTENTIONAL VULNERABILITY: Insecure Direct Object Reference (IDOR)
      // Hashira can see all missions, not just ones they assigned
      // Secure approach: Backend should filter missions by assignedBy.id matching current user
      setMissions(Array.isArray(missionsData) ? missionsData : []);
      setDemonSlayers(demonSlayerUsers);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMission = async () => {
    if (!newMission.title || !newMission.description) {
      setError('Title and description are required');
      return;
    }

    setLoading(true);
    try {
      await createMission({
        ...newMission,
        assignedToId: newMission.assignedToId ? parseInt(newMission.assignedToId) : undefined
      });
      setShowCreateMission(false);
      setNewMission({
        title: '',
        description: '',
        missionType: 'kill_demon',
        assignedToId: '',
        location: '',
        notes: ''
      });
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to create mission');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignMission = async () => {
    if (!assignmentForm.missionId || !assignmentForm.assignTo) {
      setError('Mission and assignee are required');
      return;
    }

    setLoading(true);
    try {
      // INTENTIONAL VULNERABILITY: Predictable resource IDs
      // Mission IDs are sequential and can be guessed/enumerated
      // Secure approach: Use UUIDs or cryptographically secure random IDs
      await assignMission(parseInt(assignmentForm.missionId), parseInt(assignmentForm.assignTo));
      setAssignmentForm({ missionId: '', assignTo: '', priority: 'medium' });
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to assign mission');
    } finally {
      setLoading(false);
    }
  };

  const myMissions = missions.filter((m: Mission) => 
    m.assignedBy?.email === userEmail
  );
  const pendingMissions = myMissions.filter((m: Mission) => m.status === 'pending');
  const inProgressMissions = myMissions.filter((m: Mission) => m.status === 'in_progress');
  const completedMissions = myMissions.filter((m: Mission) => m.status === 'completed');

  return (
    <UserSidebarLayout>
      <div style={{ color: '#E0E0E0', minHeight: '100vh', background: '#0B0B0C', padding: '20px' }}>
        <h1 style={{ color: '#87CEEB', marginBottom: '30px', fontSize: '32px' }}>
          Hashira Dashboard
        </h1>

        {/* Tab Navigation */}
        <div style={{ marginBottom: '30px', borderBottom: '2px solid #333' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              background: activeTab === 'dashboard' ? '#87CEEB' : 'transparent',
              color: activeTab === 'dashboard' ? '#000' : '#E0E0E0',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px 5px 0 0'
            }}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('missions')}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              background: activeTab === 'missions' ? '#87CEEB' : 'transparent',
              color: activeTab === 'missions' ? '#000' : '#E0E0E0',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px 5px 0 0'
            }}
          >
            Missions
          </button>
          <button
            onClick={() => setActiveTab('assign')}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              background: activeTab === 'assign' ? '#87CEEB' : 'transparent',
              color: activeTab === 'assign' ? '#000' : '#E0E0E0',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px 5px 0 0'
            }}
          >
            Assign Mission
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'chat' ? '#87CEEB' : 'transparent',
              color: activeTab === 'chat' ? '#000' : '#E0E0E0',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px 5px 0 0'
            }}
          >
            Chat Monitor
          </button>
        </div>

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

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
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
                  My Missions
                </div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#87CEEB' }}>
                  {myMissions.length}
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

            <div style={{ marginTop: '40px' }}>
              <h2 style={{ color: '#87CEEB', marginBottom: '20px' }}>Recent Missions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {myMissions.slice(0, 5).map((mission: Mission) => (
                  <div
                    key={mission.id}
                    style={{
                      background: '#1A1A1C',
                      padding: '20px',
                      borderRadius: '8px',
                      border: '1px solid #333'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <h3 style={{ color: '#87CEEB', marginBottom: '10px' }}>{mission.title}</h3>
                        <p style={{ color: '#B0B0B0', marginBottom: '10px' }}>{mission.description}</p>
                        <div style={{ fontSize: '14px', color: '#888' }}>
                          Type: {mission.missionType} | Status: {mission.status}
                          {mission.assignedTo && (
                            <> | Assigned to: {mission.assignedTo.firstName} {mission.assignedTo.lastName}</>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Missions Tab */}
        {activeTab === 'missions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ color: '#87CEEB' }}>All Missions</h2>
              <button
                onClick={() => setShowCreateMission(true)}
                style={{
                  padding: '10px 20px',
                  background: '#87CEEB',
                  color: '#000',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Create New Mission
              </button>
            </div>

            {showCreateMission && (
              <div style={{
                background: '#1A1A1C',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #333'
              }}>
                <h3 style={{ color: '#87CEEB', marginBottom: '15px' }}>Create Mission</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input
                    type="text"
                    placeholder="Mission Title"
                    value={newMission.title}
                    onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                    style={{ padding: '10px', background: '#0B0B0C', color: '#E0E0E0', border: '1px solid #333', borderRadius: '5px' }}
                  />
                  <textarea
                    placeholder="Description"
                    value={newMission.description}
                    onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                    rows={4}
                    style={{ padding: '10px', background: '#0B0B0C', color: '#E0E0E0', border: '1px solid #333', borderRadius: '5px' }}
                  />
                  <select
                    value={newMission.missionType}
                    onChange={(e) => setNewMission({ ...newMission, missionType: e.target.value })}
                    style={{ padding: '10px', background: '#0B0B0C', color: '#E0E0E0', border: '1px solid #333', borderRadius: '5px' }}
                  >
                    <option value="kill_demon">Kill Demon</option>
                    <option value="gather_intel">Gather Intel</option>
                    <option value="protect_location">Protect Location</option>
                    <option value="investigate">Investigate</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Location (optional)"
                    value={newMission.location}
                    onChange={(e) => setNewMission({ ...newMission, location: e.target.value })}
                    style={{ padding: '10px', background: '#0B0B0C', color: '#E0E0E0', border: '1px solid #333', borderRadius: '5px' }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleCreateMission}
                      style={{
                        padding: '10px 20px',
                        background: '#87CEEB',
                        color: '#000',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowCreateMission(false)}
                      style={{
                        padding: '10px 20px',
                        background: '#666',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {myMissions.map((mission: Mission) => (
                <div
                  key={mission.id}
                  style={{
                    background: '#1A1A1C',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #333'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: '#87CEEB', marginBottom: '10px' }}>{mission.title}</h3>
                      <p style={{ color: '#B0B0B0', marginBottom: '10px' }}>{mission.description}</p>
                      <div style={{ fontSize: '14px', color: '#888' }}>
                        Type: {mission.missionType} | Status: {mission.status}
                        {mission.location && <> | Location: {mission.location}</>}
                        {mission.assignedTo && (
                          <> | Assigned to: {mission.assignedTo.firstName} {mission.assignedTo.lastName}</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assign Tab */}
        {activeTab === 'assign' && (
          <div>
            <h2 style={{ color: '#87CEEB', marginBottom: '20px' }}>Assign Mission</h2>
            <div style={{
              background: '#1A1A1C',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #333',
              maxWidth: '500px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ color: '#E0E0E0', marginBottom: '5px', display: 'block' }}>
                    Select Mission
                  </label>
                  <select
                    value={assignmentForm.missionId}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, missionId: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#0B0B0C', color: '#E0E0E0', border: '1px solid #333', borderRadius: '5px' }}
                  >
                    <option value="">Select a mission</option>
                    {pendingMissions.map((m: Mission) => (
                      <option key={m.id} value={m.id}>
                        {m.title} (ID: {m.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ color: '#E0E0E0', marginBottom: '5px', display: 'block' }}>
                    Assign To Demon Slayer
                  </label>
                  <select
                    value={assignmentForm.assignTo}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, assignTo: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#0B0B0C', color: '#E0E0E0', border: '1px solid #333', borderRadius: '5px' }}
                  >
                    <option value="">Select demon slayer</option>
                    {demonSlayers.map((slayer: User) => (
                      <option key={slayer.id} value={slayer.id}>
                        {slayer.firstName} {slayer.lastName} ({slayer.email})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAssignMission}
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    background: '#87CEEB',
                    color: '#000',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Assign Mission
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Monitor Tab */}
        {activeTab === 'chat' && (
          <div>
            <h2 style={{ color: '#87CEEB', marginBottom: '20px' }}>Chat Monitor</h2>
            <p style={{ color: '#B0B0B0' }}>
              As a Hashira, you can monitor all chat messages between Demon Slayer Corps members and People.
              This feature allows you to oversee communications and ensure mission coordination.
            </p>
            <div style={{
              background: '#1A1A1C',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #333',
              marginTop: '20px'
            }}>
              <p style={{ color: '#888', fontStyle: 'italic' }}>
                Chat monitoring interface would be integrated here. Navigate to the Chat page to view messages.
              </p>
            </div>
          </div>
        )}
      </div>
    </UserSidebarLayout>
  );
};

