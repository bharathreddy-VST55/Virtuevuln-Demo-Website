import { FormEvent, FC, useEffect, useState } from 'react';
import {
  getAdminStatus,
  getUserDataById,
  putUserData,
  removeUserPhotoById
} from '../../api/httpClient';
import type { UserData } from '../../interfaces/User';
import AdminSidebarLayout from './AdminSidebarLayout';

const defaultUserData: UserData = {
  email: '',
  firstName: '',
  lastName: '',
  id: '',
  company: ''
};

export const AdminProfile: FC = () => {
  const user_email: string | null =
    sessionStorage.getItem('email') || localStorage.getItem('email');
  const user_id: string | null =
    sessionStorage.getItem('user_id') || localStorage.getItem('user_id');

  const [user, setUser] = useState<UserData>(defaultUserData);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('');

  const onInput = ({ target }: { target: EventTarget | null }) => {
    const { name, value } = target as HTMLInputElement;
    setUser({ ...user, [name]: value });
  };

  useEffect(() => {
    if (user_email && user_id) {
      getUserDataById(user_id).then((data) => {
        setUser(data);
        if (data.role) {
          setUserRole(data.role);
        }
      });
      getAdminStatus(user_email).then((data) => {
        setIsAdmin(!!data.isAdmin);
        if (data.role) {
          setUserRole(data.role);
        }
      });
    }
  }, []);

  const sendUserData = (e: FormEvent) => {
    e.preventDefault();
    putUserData(user).then(() => {
      if (localStorage.getItem('email')) {
        localStorage.setItem('userName', `${user.firstName} ${user.lastName}`);
      } else {
        sessionStorage.setItem('userName', `${user.firstName} ${user.lastName}`);
      }
      alert('Profile updated successfully!');
    });
  };

  if (!user_email || !user_id) {
    return null;
  }

  return (
    <AdminSidebarLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1
          style={{
            color: '#87CEEB',
            marginBottom: '30px',
            fontSize: '28px',
            fontWeight: 'bold'
          }}
        >
          Edit Profile
        </h1>

        {userRole && (
          <div
            style={{
              marginBottom: '30px',
              padding: '20px',
              background: 'linear-gradient(135deg, #0B0B0C 0%, #1a1a2e 100%)',
              borderRadius: '10px',
              border: '1px solid #333',
              textAlign: 'center'
            }}
          >
            <div style={{ color: '#B0B0B0', marginBottom: '10px', fontSize: '14px' }}>
              Your Role
            </div>
            <div
              style={{
                color: '#87CEEB',
                fontSize: '24px',
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}
            >
              {userRole === 'super_admin'
                ? '⚔️ Super Admin'
                : userRole === 'hashira'
                ? '🗡️ Hashira'
                : userRole === 'demon_slayer_corps'
                ? '⚔️ Demon Slayer Corps'
                : '👤 People'}
            </div>
          </div>
        )}

        <div
          style={{
            background: 'linear-gradient(135deg, #0B0B0C 0%, #1a1a2e 100%)',
            padding: '30px',
            borderRadius: '10px',
            border: '1px solid #333'
          }}
        >
          <form onSubmit={sendUserData}>
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  color: '#E0E0E0',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Email
              </label>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={user.email}
                onInput={onInput}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#1a1a2e',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  color: '#E0E0E0',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  color: '#E0E0E0',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={user.firstName}
                onInput={onInput}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#1a1a2e',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  color: '#E0E0E0',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  color: '#E0E0E0',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={user.lastName}
                onInput={onInput}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#1a1a2e',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  color: '#E0E0E0',
                  fontSize: '14px'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #87CEEB 0%, #4A90E2 100%)',
                color: '#0B0B0C',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '15px'
              }}
            >
              Save Changes
            </button>
          </form>

          <button
            onClick={() => removeUserPhotoById(user.id, isAdmin)}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Remove Profile Photo
          </button>
        </div>
      </div>
    </AdminSidebarLayout>
  );
};

export default AdminProfile;

