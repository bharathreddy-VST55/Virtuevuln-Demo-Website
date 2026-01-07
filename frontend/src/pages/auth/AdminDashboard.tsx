import { ChangeEvent, FC, useEffect, useState } from 'react';
import {
  createUserWithRole,
  getAllMissions,
  getAllUsers,
  getMissionStats,
  getUserStats
} from '../../api/httpClient';
import AdminSidebarLayout from './AdminSidebarLayout';

interface UserStats {
  total: number;
  superAdmin: number;
  hashira: number;
  demonSlayerCorps: number;
  people: number;
}

interface MissionStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  byType: Record<string, number>;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  company: string;
}

interface Mission {
  id: number;
  title: string;
  description: string;
  missionType: string;
  status: string;
  location?: string;
  assignedBy?: { firstName: string; lastName: string; email: string };
  assignedTo?: { firstName: string; lastName: string; email: string };
  completedAt?: string;
  createdAt: string;
}

type TabType = 'dashboard' | 'usermanagement' | 'settings' | 'missions' | 'assignment' | 'killeddemons' | 'hashirashideout';

export const AdminDashboard: FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [missionStats, setMissionStats] = useState<MissionStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateUser, setShowCreateUser] = useState(false);

  // Form state for creating user
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'people',
    company: 'Demon Slayer Corps',
    cardNumber: '',
    phoneNumber: '',
    op: 'basic'
  });

  // Settings state
  const [settings, setSettings] = useState({
    systemName: 'Demon Slayers Training Lab',
    maxUsers: 1000,
    enableNotifications: true,
    maintenanceMode: false,
    sessionTimeout: 30
  });

  // Assignment state
  const [assignmentForm, setAssignmentForm] = useState({
    missionId: '',
    assignTo: '',
    priority: 'medium'
  });

  // Killed Demons data (mock data for now)
  const [killedDemons, setKilledDemons] = useState([
    { id: 1, demonName: 'Lower Moon 6', killedBy: 'Tanjiro Kamado', location: 'Mount Natagumo', date: '2024-01-15', evidence: 'Photo uploaded' },
    { id: 2, demonName: 'Swamp Demon', killedBy: 'Zenitsu Agatsuma', location: 'Butterfly Mansion', date: '2024-01-20', evidence: 'Report submitted' },
    { id: 3, demonName: 'Spider Demon', killedBy: 'Inosuke Hashibira', location: 'Mount Natagumo', date: '2024-01-25', evidence: 'Photo uploaded' }
  ]);

  // Hashiras Hideout Areas (mock data)
  const [hideoutAreas, setHideoutAreas] = useState([
    { id: 1, areaName: 'Water Hashira Estate', hashira: 'Giyu Tomioka', location: 'Mount Sagiri', status: 'Active', members: 5 },
    { id: 2, areaName: 'Flame Hashira Estate', hashira: 'Kyojuro Rengoku', location: 'Tokyo', status: 'Active', members: 8 },
    { id: 3, areaName: 'Wind Hashira Estate', hashira: 'Sanemi Shinazugawa', location: 'Osaka', status: 'Active', members: 6 },
    { id: 4, areaName: 'Sound Hashira Estate', hashira: 'Tengen Uzui', location: 'Kyoto', status: 'Active', members: 7 }
  ]);

  // Announcement state (Vulnerable to XSS)
  const [announcement, setAnnouncement] = useState('');
  const [announcements, setAnnouncements] = useState<string[]>([]);

  // Edit User State
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'dashboard') {
        const [userStatsData, missionStatsData] = await Promise.all([
          getUserStats(),
          getMissionStats()
        ]);
        setUserStats(userStatsData);
        setMissionStats(missionStatsData);
      } else if (activeTab === 'usermanagement') {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } else if (activeTab === 'missions') {
        const missionsData = await getAllMissions();
        setMissions(missionsData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createUserWithRole(newUser);
      setShowCreateUser(false);
      setNewUser({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'people',
        company: 'Demon Slayer Corps',
        cardNumber: '',
        phoneNumber: '',
        op: 'basic'
      });
      if (activeTab === 'usermanagement') {
        await loadData();
      }
      alert('User created successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSettingsChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement assignment API call
    alert(`Mission ${assignmentForm.missionId} assigned to ${assignmentForm.assignTo}`);
    setAssignmentForm({ missionId: '', assignTo: '', priority: 'medium' });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    // TODO: Implement update user API call
    // For now, just update local state to simulate
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
    alert('User updated successfully');
  };

  const handleAnnouncementSubmit = () => {
    // INTENTIONAL VULNERABILITY: Stored XSS
    // The announcement is stored and rendered without sanitization
    // Secure approach: Use a library like DOMPurify to sanitize input
    setAnnouncements([announcement, ...announcements]);
    setAnnouncement('');
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      super_admin: 'Super Admin',
      hashira: 'Hashira',
      demon_slayer_corps: 'Demon Slayer Corps',
      people: 'People'
    };
    return roleMap[role] || role;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: '#FFA500',
      in_progress: '#4A90E2',
      completed: '#4CAF50',
      cancelled: '#F44336',
      active: '#4CAF50',
      inactive: '#666'
    };
    return colorMap[status] || '#666';
  };

  const tabs: { id: TabType; name: string; icon: string }[] = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'usermanagement', name: 'User Management', icon: '👥' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
    { id: 'missions', name: 'Missions', icon: '🎯' },
    { id: 'assignment', name: 'Assignment', icon: '📋' },
    { id: 'killeddemons', name: 'Killed Demons', icon: '⚔️' },
    { id: 'hashirashideout', name: 'Hashiras Hideout Areas', icon: '🏠' }
  ];

  return (
    <AdminSidebarLayout>
      <div style={{ color: '#E0E0E0', fontFamily: "'Inter', sans-serif" }}>
        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            background: 'rgba(26, 26, 46, 0.5)',
            padding: '15px 25px',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ position: 'relative', width: '400px' }}>
            <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#666' }}>🔍</span>
            <input
              type="text"
              placeholder="Search assets, findings, scans..."
              style={{
                width: '100%',
                padding: '12px 15px 12px 45px',
                background: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.2)', padding: '8px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: '#87CEEB' }}>👤</span>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>HashiraAdmin</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.2)', padding: '8px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: '#87CEEB' }}>📁</span>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Corps HQ</span>
            </div>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <span style={{ fontSize: '20px' }}>🔔</span>
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#F44336', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '10px', fontWeight: 'bold' }}>12</span>
            </div>
            <span style={{ fontSize: '20px', cursor: 'pointer' }}>⚙️</span>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1 style={{ color: '#fff', marginBottom: '5px', fontSize: '32px', fontWeight: '800' }}>
                Corps Headquarters <span style={{ fontSize: '14px', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '5px', verticalAlign: 'middle', marginLeft: '10px', fontWeight: '400' }}>Sector A</span>
              </h1>
              <p style={{ color: '#666', fontSize: '14px', fontWeight: '500' }}>
                broken-corps.com
              </p>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #333', borderRadius: '10px', color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                Configure Scans
              </button>
              <button style={{ padding: '10px 20px', background: 'rgba(135, 206, 235, 0.1)', border: '1px solid #87CEEB', borderRadius: '10px', color: '#87CEEB', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                Manage Slayers
              </button>
            </div>
          </div>
        </div>

        {/* Removed duplicate tab navigation - using sidebar navigation instead */}

        {error && (
          <div
            style={{
              padding: '15px',
              background: '#F44336',
              color: 'white',
              borderRadius: '5px',
              marginBottom: '20px'
            }}
          >
            Error: {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#B0B0B0' }}>
            Loading...
          </div>
        )}

        {activeTab === 'dashboard' && !loading && userStats && missionStats && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
              }}
            >
              {/* Active Slayers Card */}
              <div
                style={{
                  background: 'rgba(26, 26, 46, 0.8)',
                  padding: '25px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ color: '#666', fontSize: '14px', fontWeight: '600', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Active Slayers
                  <span style={{ background: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', padding: '2px 8px', borderRadius: '5px', fontSize: '10px' }}>STABLE</span>
                </div>
                <div style={{ fontSize: '42px', fontWeight: '800', color: '#fff', marginBottom: '5px' }}>
                  {userStats.total}
                </div>
                <div style={{ color: '#4CAF50', fontSize: '12px', fontWeight: '500' }}>
                  Good
                </div>
                <div style={{ position: 'absolute', right: '20px', bottom: '20px', fontSize: '32px', opacity: '0.5', background: 'rgba(76, 175, 80, 0.2)', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '15px' }}>
                  🛡️
                </div>
              </div>

              {/* Active Threats Card */}
              <div
                style={{
                  background: 'rgba(26, 26, 46, 0.8)',
                  padding: '25px',
                  borderRadius: '20px',
                  border: '2px solid rgba(244, 67, 54, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ color: '#666', fontSize: '14px', fontWeight: '600', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Active Threats
                  <span style={{ background: 'rgba(244, 67, 54, 0.1)', color: '#F44336', padding: '2px 8px', borderRadius: '5px', fontSize: '10px' }}>CRITICAL</span>
                </div>
                <div style={{ fontSize: '42px', fontWeight: '800', color: '#fff', marginBottom: '5px' }}>
                  {missionStats.pending}
                </div>
                <div style={{ color: '#666', fontSize: '12px', fontWeight: '500' }}>
                  Open findings <span style={{ color: '#87CEEB', cursor: 'pointer' }}>Click for details →</span>
                </div>
                <div style={{ position: 'absolute', right: '20px', bottom: '20px', fontSize: '32px', opacity: '0.8', background: 'rgba(244, 67, 54, 0.2)', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '15px' }}>
                  👹
                </div>
              </div>

              {/* Expedition Success Card */}
              <div
                style={{
                  background: 'rgba(26, 26, 46, 0.8)',
                  padding: '25px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ color: '#666', fontSize: '14px', fontWeight: '600', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Expedition Success
                  <span style={{ background: 'rgba(135, 206, 235, 0.1)', color: '#87CEEB', padding: '2px 8px', borderRadius: '5px', fontSize: '10px' }}>STABLE</span>
                </div>
                <div style={{ fontSize: '42px', fontWeight: '800', color: '#fff', marginBottom: '5px' }}>
                  {Math.round((missionStats.completed / (missionStats.total || 1)) * 100)}%
                </div>
                <div style={{ color: '#666', fontSize: '12px', fontWeight: '500' }}>
                  Target: 90%
                </div>
                <div style={{ position: 'absolute', right: '20px', bottom: '20px', fontSize: '32px', opacity: '0.5', background: 'rgba(135, 206, 235, 0.2)', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '15px' }}>
                  ✅
                </div>
              </div>

              {/* Recovery Time Card */}
              <div
                style={{
                  background: 'rgba(26, 26, 46, 0.8)',
                  padding: '25px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ color: '#666', fontSize: '14px', fontWeight: '600', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Recovery Time
                  <span style={{ background: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', padding: '2px 8px', borderRadius: '5px', fontSize: '10px' }}>IMPROVING</span>
                </div>
                <div style={{ fontSize: '42px', fontWeight: '800', color: '#fff', marginBottom: '5px' }}>
                  4.2d
                </div>
                <div style={{ color: '#666', fontSize: '12px', fontWeight: '500' }}>
                  Mean Time to Remediate
                </div>
                <div style={{ position: 'absolute', right: '20px', bottom: '20px', fontSize: '32px', opacity: '0.5', background: 'rgba(33, 150, 243, 0.2)', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '15px' }}>
                  🕒
                </div>
              </div>

              {/* Total Expeditions Card */}
              <div
                style={{
                  background: 'rgba(26, 26, 46, 0.8)',
                  padding: '25px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ color: '#666', fontSize: '14px', fontWeight: '600', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Total Expeditions
                  <span style={{ background: 'rgba(135, 206, 235, 0.1)', color: '#87CEEB', padding: '2px 8px', borderRadius: '5px', fontSize: '10px' }}>STABLE</span>
                </div>
                <div style={{ fontSize: '42px', fontWeight: '800', color: '#fff', marginBottom: '5px' }}>
                  {missionStats.total}
                </div>
                <div style={{ color: '#666', fontSize: '12px', fontWeight: '500' }}>
                  Assets scanned
                </div>
                <div style={{ position: 'absolute', right: '20px', bottom: '20px', fontSize: '32px', opacity: '0.5', background: 'rgba(3, 169, 244, 0.2)', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '15px' }}>
                  🎯
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '40px' }}>
              {/* Demon Activity Trend */}
              <div
                style={{
                  background: 'rgba(26, 26, 46, 0.8)',
                  padding: '30px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>📈 Demon Activity Trend <span style={{ color: '#F44336', fontSize: '12px', marginLeft: '10px', fontWeight: '500' }}>+0% MoM</span></h3>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ cursor: 'pointer', color: '#666' }}>🔍</span>
                    <span style={{ cursor: 'pointer', color: '#666' }}>📥</span>
                  </div>
                </div>
                <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '20px', paddingBottom: '20px', borderLeft: '1px solid #333', borderBottom: '1px solid #333', position: 'relative' }}>
                  {/* Mock Chart Bars */}
                  <div style={{ flex: 1, background: 'linear-gradient(to top, rgba(135, 206, 235, 0.2), #87CEEB)', height: '40%', borderRadius: '5px 5px 0 0' }}></div>
                  <div style={{ flex: 1, background: 'linear-gradient(to top, rgba(135, 206, 235, 0.2), #87CEEB)', height: '60%', borderRadius: '5px 5px 0 0' }}></div>
                  <div style={{ flex: 1, background: 'linear-gradient(to top, rgba(135, 206, 235, 0.2), #87CEEB)', height: '30%', borderRadius: '5px 5px 0 0' }}></div>
                  <div style={{ flex: 1, background: 'linear-gradient(to top, rgba(135, 206, 235, 0.2), #87CEEB)', height: '80%', borderRadius: '5px 5px 0 0' }}></div>
                  <div style={{ flex: 1, background: 'linear-gradient(to top, rgba(135, 206, 235, 0.2), #87CEEB)', height: '50%', borderRadius: '5px 5px 0 0' }}></div>
                  <div style={{ flex: 1, background: 'linear-gradient(to top, rgba(135, 206, 235, 0.2), #87CEEB)', height: '70%', borderRadius: '5px 5px 0 0' }}></div>
                </div>
              </div>

              {/* Kasugai Crow Communication (Chatting Card) */}
              <div
                style={{
                  background: 'rgba(26, 26, 46, 0.8)',
                  padding: '30px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>🦅 Kasugai Crow</h3>
                  <span style={{ color: '#87CEEB', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>View All</span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', maxHeight: '300px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#87CEEB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🌊</div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '0 15px 15px 15px', flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#87CEEB', marginBottom: '2px' }}>Giyu Tomioka</div>
                      <div style={{ fontSize: '13px', color: '#E0E0E0' }}>Mission at Mount Natagumo is complete.</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>⚡</div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '0 15px 15px 15px', flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFD700', marginBottom: '2px' }}>Zenitsu Agatsuma</div>
                      <div style={{ fontSize: '13px', color: '#E0E0E0' }}>I'm scared! Is the mission really over?</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexDirection: 'row-reverse' }}>
                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#87CEEB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🦅</div>
                    <div style={{ background: 'rgba(135, 206, 235, 0.2)', padding: '10px', borderRadius: '15px 0 15px 15px', flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#87CEEB', marginBottom: '2px' }}>You (Admin)</div>
                      <div style={{ fontSize: '13px', color: '#E0E0E0' }}>Confirmed. Return to headquarters.</div>
                    </div>
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Send update to Slayers..."
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 15px',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '13px'
                    }}
                  />
                  <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>✈️</span>
                </div>
              </div>
            </div>

            {/* Announcements Section (Vulnerable to XSS) */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0B0B0C 0%, #1a1a2e 100%)',
                padding: '25px',
                borderRadius: '10px',
                marginBottom: '20px',
                border: '1px solid #333'
              }}
            >
              <h3 style={{ color: '#87CEEB', marginBottom: '20px', fontSize: '20px' }}>
                📢 Announcements (Vulnerable to XSS)
              </h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                  type="text"
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="Post an announcement..."
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#1a1a2e',
                    border: '1px solid #333',
                    borderRadius: '5px',
                    color: '#E0E0E0'
                  }}
                />
                <button
                  onClick={handleAnnouncementSubmit}
                  style={{
                    padding: '10px 20px',
                    background: '#87CEEB',
                    color: '#0B0B0C',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Post
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {announcements.map((ann, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '15px',
                      background: '#1a1a2e',
                      borderRadius: '5px',
                      border: '1px solid #333',
                      color: '#E0E0E0'
                    }}
                    // INTENTIONAL VULNERABILITY: Rendering raw HTML
                    dangerouslySetInnerHTML={{ __html: ann }}
                  />
                ))}
              </div>
            </div>

            {/* User Statistics */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0B0B0C 0%, #1a1a2e 100%)',
                padding: '25px',
                borderRadius: '10px',
                marginBottom: '20px',
                border: '1px solid #333'
              }}
            >
              <h3 style={{ color: '#87CEEB', marginBottom: '20px', fontSize: '20px' }}>
                👥 User Statistics by Role
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '15px'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', color: '#FF6B6B' }}>
                    {userStats.superAdmin}
                  </div>
                  <div style={{ color: '#B0B0B0', fontSize: '14px' }}>Super Admins</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', color: '#FFD93D' }}>
                    {userStats.hashira}
                  </div>
                  <div style={{ color: '#B0B0B0', fontSize: '14px' }}>Hashiras</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', color: '#6BCF7F' }}>
                    {userStats.demonSlayerCorps}
                  </div>
                  <div style={{ color: '#B0B0B0', fontSize: '14px' }}>Demon Slayer Corps</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', color: '#95A5A6' }}>
                    {userStats.people}
                  </div>
                  <div style={{ color: '#B0B0B0', fontSize: '14px' }}>People</div>
                </div>
              </div>
            </div>

            {/* Mission Statistics */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0B0B0C 0%, #1a1a2e 100%)',
                padding: '25px',
                borderRadius: '10px',
                border: '1px solid #333'
              }}
            >
              <h3 style={{ color: '#87CEEB', marginBottom: '20px', fontSize: '20px' }}>
                🎯 Mission Statistics
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '15px',
                  marginBottom: '20px'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', color: '#4A90E2' }}>
                    {missionStats.inProgress}
                  </div>
                  <div style={{ color: '#B0B0B0', fontSize: '14px' }}>In Progress</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', color: '#F44336' }}>
                    {missionStats.cancelled}
                  </div>
                  <div style={{ color: '#B0B0B0', fontSize: '14px' }}>Cancelled</div>
                </div>
              </div>

              {/* Mission Types */}
              {Object.keys(missionStats.byType).length > 0 && (
                <div>
                  <h4 style={{ color: '#87CEEB', marginBottom: '15px', fontSize: '16px' }}>
                    Missions by Type
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '10px'
                    }}
                  >
                    {Object.entries(missionStats.byType).map(([type, count]) => (
                      <div
                        key={type}
                        style={{
                          padding: '15px',
                          background: '#1a1a2e',
                          borderRadius: '5px',
                          border: '1px solid #333'
                        }}
                      >
                        <div style={{ color: '#87CEEB', fontSize: '12px', marginBottom: '5px' }}>
                          {type.replace(/_/g, ' ').toUpperCase()}
                        </div>
                        <div style={{ fontSize: '24px', color: '#E0E0E0', fontWeight: 'bold' }}>
                          {count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'usermanagement' && !loading && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}
            >
              <h2 style={{ color: '#87CEEB', fontSize: '24px' }}>User Management</h2>
              <button
                onClick={() => setShowCreateUser(!showCreateUser)}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #87CEEB 0%, #4A90E2 100%)',
                  color: '#0B0B0C',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                + Create User
              </button>
            </div>

            {showCreateUser && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #0B0B0C 0%, #1a1a2e 100%)',
                  padding: '25px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  border: '1px solid #333'
                }}
              >
                <h3 style={{ color: '#87CEEB', marginBottom: '20px' }}>Create New User</h3>
                <form onSubmit={handleCreateUser}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '15px',
                      marginBottom: '20px'
                    }}
                  >
                    <div>
                      <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: '#1a1a2e',
                          border: '1px solid #333',
                          borderRadius: '5px',
                          color: '#E0E0E0',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: '#1a1a2e',
                          border: '1px solid #333',
                          borderRadius: '5px',
                          color: '#E0E0E0',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={newUser.firstName}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: '#1a1a2e',
                          border: '1px solid #333',
                          borderRadius: '5px',
                          color: '#E0E0E0',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={newUser.lastName}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: '#1a1a2e',
                          border: '1px solid #333',
                          borderRadius: '5px',
                          color: '#E0E0E0',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                        Role *
                      </label>
                      <select
                        name="role"
                        value={newUser.role}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: '#1a1a2e',
                          border: '1px solid #333',
                          borderRadius: '5px',
                          color: '#E0E0E0',
                          fontSize: '14px'
                        }}
                      >
                        <option value="people">People</option>
                        <option value="hashira">Hashira</option>
                        <option value="demon_slayer_corps">Demon Slayer Corps</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={newUser.company}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: '#1a1a2e',
                          border: '1px solid #333',
                          borderRadius: '5px',
                          color: '#E0E0E0',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="submit"
                      style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #87CEEB 0%, #4A90E2 100%)',
                        color: '#0B0B0C',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}
                    >
                      Create User
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateUser(false)}
                      style={{
                        padding: '12px 24px',
                        background: '#666',
                        color: '#E0E0E0',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div
              style={{
                background: 'linear-gradient(135deg, #0B0B0C 0%, #1a1a2e 100%)',
                padding: '25px',
                borderRadius: '10px',
                border: '1px solid #333'
              }}
            >
              <h3 style={{ color: '#87CEEB', marginBottom: '20px', fontSize: '20px' }}>
                All Users ({users.length})
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #333' }}>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        ID
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        Name
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        Email
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        Role
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        Company
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        style={{
                          borderBottom: '1px solid #333'
                        }}
                      >
                        <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                          {user.id}
                        </td>
                        <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                          {user.firstName} {user.lastName}
                        </td>
                        <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                          {user.email}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span
                            style={{
                              padding: '6px 12px',
                              borderRadius: '5px',
                              background: '#1a1a2e',
                              color: '#87CEEB',
                              border: '1px solid #333',
                              fontSize: '12px'
                            }}
                          >
                            {getRoleDisplayName(user.role)}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                          {user.company}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button
                            onClick={() => setEditingUser(user)}
                            style={{
                              padding: '5px 10px',
                              background: '#4A90E2',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              marginRight: '5px'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            style={{
                              padding: '5px 10px',
                              background: '#F44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer'
                            }}
                          >
                            Disable
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Edit User Modal */}
            {editingUser && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.7)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1000
                }}
              >
                <div
                  style={{
                    background: '#1a1a2e',
                    padding: '30px',
                    borderRadius: '10px',
                    width: '500px',
                    maxWidth: '90%',
                    border: '1px solid #333'
                  }}
                >
                  <h3 style={{ color: '#87CEEB', marginBottom: '20px' }}>Edit User</h3>
                  <form onSubmit={handleUpdateUser}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', color: '#B0B0B0', marginBottom: '5px' }}>Role</label>
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: '#0B0B0C',
                          color: '#E0E0E0',
                          border: '1px solid #333',
                          borderRadius: '5px'
                        }}
                      >
                        <option value="people">People</option>
                        <option value="hashira">Hashira</option>
                        <option value="demon_slayer_corps">Demon Slayer Corps</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => setEditingUser(null)}
                        style={{
                          padding: '10px 20px',
                          background: '#666',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
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
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 style={{ color: '#87CEEB', marginBottom: '20px', fontSize: '24px' }}>
              System Settings
            </h2>
            <div
              style={{
                background: 'linear-gradient(135deg, #0B0B0C 0%, #1a1a2e 100%)',
                padding: '25px',
                borderRadius: '10px',
                border: '1px solid #333'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                    System Name
                  </label>
                  <input
                    type="text"
                    name="systemName"
                    value={settings.systemName}
                    onChange={handleSettingsChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#1a1a2e',
                      border: '1px solid #333',
                      borderRadius: '5px',
                      color: '#E0E0E0',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                    Max Users
                  </label>
                  <input
                    type="number"
                    name="maxUsers"
                    value={settings.maxUsers}
                    onChange={handleSettingsChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#1a1a2e',
                      border: '1px solid #333',
                      borderRadius: '5px',
                      color: '#E0E0E0',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    name="sessionTimeout"
                    value={settings.sessionTimeout}
                    onChange={handleSettingsChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#1a1a2e',
                      border: '1px solid #333',
                      borderRadius: '5px',
                      color: '#E0E0E0',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    name="enableNotifications"
                    checked={settings.enableNotifications}
                    onChange={handleSettingsChange}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <label style={{ color: '#E0E0E0', fontSize: '14px', cursor: 'pointer' }}>
                    Enable Notifications
                  </label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleSettingsChange}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <label style={{ color: '#E0E0E0', fontSize: '14px', cursor: 'pointer' }}>
                    Maintenance Mode
                  </label>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <button
                    onClick={() => alert('Settings saved!')}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #87CEEB 0%, #4A90E2 100%)',
                      color: '#0B0B0C',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Missions Tab */}
        {activeTab === 'missions' && !loading && (
          <div>
            <h2 style={{ color: '#87CEEB', marginBottom: '20px', fontSize: '24px' }}>
              Mission Monitoring
            </h2>
            <div
              style={{
                background: 'linear-gradient(135deg, #0B0B0C 0%, #1a1a2e 100%)',
                padding: '25px',
                borderRadius: '10px',
                border: '1px solid #333'
              }}
            >
              <h3 style={{ color: '#87CEEB', marginBottom: '20px', fontSize: '20px' }}>
                All Missions ({missions.length})
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #333' }}>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        ID
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        Title
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        Type
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        Status
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        Assigned By
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        Assigned To
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {missions.map((mission) => (
                      <tr
                        key={mission.id}
                        style={{
                          borderBottom: '1px solid #333'
                        }}
                      >
                        <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                          {mission.id}
                        </td>
                        <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                          {mission.title}
                        </td>
                        <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                          {mission.missionType.replace(/_/g, ' ')}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span
                            style={{
                              padding: '6px 12px',
                              borderRadius: '5px',
                              background: getStatusColor(mission.status),
                              color: 'white',
                              fontSize: '12px'
                            }}
                          >
                            {mission.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                          {mission.assignedBy
                            ? `${mission.assignedBy.firstName} ${mission.assignedBy.lastName}`
                            : 'N/A'}
                        </td>
                        <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                          {mission.assignedTo
                            ? `${mission.assignedTo.firstName} ${mission.assignedTo.lastName}`
                            : 'Unassigned'}
                        </td>
                        <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                          {mission.location || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Assignment Tab */}
        {activeTab === 'assignment' && (
          <div>
            <h2 style={{ color: '#87CEEB', marginBottom: '20px', fontSize: '24px' }}>
              Mission Assignment
            </h2>
            <div
              style={{
                background: 'linear-gradient(135deg, #0B0B0C 0%, #1a1a2e 100%)',
                padding: '25px',
                borderRadius: '10px',
                border: '1px solid #333',
                marginBottom: '20px'
              }}
            >
              <h3 style={{ color: '#87CEEB', marginBottom: '20px', fontSize: '20px' }}>
                Assign Mission
              </h3>
              <form onSubmit={handleAssignmentSubmit}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '15px',
                    marginBottom: '20px'
                  }}
                >
                  <div>
                    <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                      Select Mission *
                    </label>
                    <select
                      name="missionId"
                      value={assignmentForm.missionId}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, missionId: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#1a1a2e',
                        border: '1px solid #333',
                        borderRadius: '5px',
                        color: '#E0E0E0',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select a mission...</option>
                      {missions.map((mission) => (
                        <option key={mission.id} value={mission.id}>
                          {mission.title} ({mission.status})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                      Assign To *
                    </label>
                    <select
                      name="assignTo"
                      value={assignmentForm.assignTo}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, assignTo: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#1a1a2e',
                        border: '1px solid #333',
                        borderRadius: '5px',
                        color: '#E0E0E0',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select user...</option>
                      {users
                        .filter((u) => u.role !== 'super_admin')
                        .map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} ({getRoleDisplayName(user.role)})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={assignmentForm.priority}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, priority: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#1a1a2e',
                        border: '1px solid #333',
                        borderRadius: '5px',
                        color: '#E0E0E0',
                        fontSize: '14px'
                      }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #87CEEB 0%, #4A90E2 100%)',
                    color: '#0B0B0C',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  Assign Mission
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Killed Demons Tab */}
        {activeTab === 'killeddemons' && (
          <div>
            <h2 style={{ color: '#87CEEB', marginBottom: '20px', fontSize: '24px' }}>
              Killed Demons Records
            </h2>
            <div
              style={{
                background: 'linear-gradient(135deg, #0B0B0C 0%, #1a1a2e 100%)',
                padding: '25px',
                borderRadius: '10px',
                border: '1px solid #333'
              }}
            >
              <h3 style={{ color: '#87CEEB', marginBottom: '20px', fontSize: '20px' }}>
                Demon Elimination Records ({killedDemons.length})
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #333' }}>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        ID
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        Demon Name
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        Killed By
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        Location
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        Date
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#87CEEB', fontSize: '14px' }}>
                        Evidence
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {killedDemons.map((demon) => (
                      <tr
                        key={demon.id}
                        style={{
                          borderBottom: '1px solid #333'
                        }}
                      >
                        <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                          {demon.id}
                        </td>
                        <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                          {demon.demonName}
                        </td>
                        <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                          {demon.killedBy}
                        </td>
                        <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                          {demon.location}
                        </td>
                        <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                          {demon.date}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span
                            style={{
                              padding: '6px 12px',
                              borderRadius: '5px',
                              background: '#1a1a2e',
                              color: '#4CAF50',
                              border: '1px solid #333',
                              fontSize: '12px'
                            }}
                          >
                            {demon.evidence}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Hashiras Hideout Areas Tab */}
        {activeTab === 'hashirashideout' && (
          <div>
            <h2 style={{ color: '#87CEEB', marginBottom: '20px', fontSize: '24px' }}>
              Hashiras Hideout Areas
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}
            >
              {hideoutAreas.map((area) => (
                <div
                  key={area.id}
                  style={{
                    background: 'linear-gradient(135deg, #0B0B0C 0%, #1a1a2e 100%)',
                    padding: '25px',
                    borderRadius: '10px',
                    border: '1px solid #333'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <div>
                      <h3 style={{ color: '#87CEEB', marginBottom: '5px', fontSize: '18px' }}>
                        {area.areaName}
                      </h3>
                      <p style={{ color: '#B0B0B0', fontSize: '14px' }}>
                        {area.hashira}
                      </p>
                    </div>
                    <span
                      style={{
                        padding: '6px 12px',
                        borderRadius: '5px',
                        background: getStatusColor(area.status),
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {area.status}
                    </span>
                  </div>
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #333' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ color: '#B0B0B0', fontSize: '14px' }}>Location:</span>
                      <span style={{ color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                        {area.location}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#B0B0B0', fontSize: '14px' }}>Members:</span>
                      <span style={{ color: '#87CEEB', fontSize: '14px', fontWeight: 'bold' }}>
                        {area.members}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminSidebarLayout>
  );
};

export default AdminDashboard;
