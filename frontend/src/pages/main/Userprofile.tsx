import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import {
  getAdminStatus,
  getUserDataById,
  putUserData,
  removeUserPhotoById,
  putPhoto
} from '../../api/httpClient';
import type { UserData } from '../../interfaces/User';
import { RoutePath } from '../../router/RoutePath';
import UserSidebarLayout from '../../components/UserSidebarLayout';

const defaultUserData: UserData = {
  email: '',
  firstName: '',
  lastName: '',
  id: '',
  company: ''
};

export const Userprofile = () => {
  const user_email: string | null =
    sessionStorage.getItem('email') || localStorage.getItem('email');
  const user_id: string | null =
    sessionStorage.getItem('user_id') || localStorage.getItem('user_id');

  const [user, setUser] = useState<UserData>(defaultUserData);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const onInput = ({ target }: { target: EventTarget | null }) => {
    const { name, value } = target as HTMLInputElement;
    setUser({ ...user, [name]: value });
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user_email) return;

    setUploadStatus('Uploading...');
    try {
      await putPhoto(file, user_email);
      setUploadStatus('File uploaded successfully!');
      // Refresh page to show new photo
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      setUploadStatus(`Upload failed: ${error.message || 'Unknown error'}`);
      console.error('Upload error:', error);
    }
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
        sessionStorage.setItem(
          'userName',
          `${user.firstName} ${user.lastName}`
        );
      }
      window.location.href = RoutePath.Home;
    });
  };

  return (
    <>
      {user_email && user_id ? (
        <UserSidebarLayout>
          <div className="login-form">
            {userRole && (
              <div
                style={{
                  marginBottom: '20px',
                  padding: '15px',
                  background: 'linear-gradient(135deg, #0B0B0C 0%, #1a1a2e 100%)',
                  borderRadius: '8px',
                  border: '1px solid #333',
                  textAlign: 'center'
                }}
              >
                <div style={{ color: '#B0B0B0', marginBottom: '5px', fontSize: '14px' }}>
                  Your Role
                </div>
                <div
                  style={{
                    color: '#87CEEB',
                    fontSize: '20px',
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
            <form onSubmit={sendUserData}>
              <div className="form-group">
                <label>Email</label>
                <input
                  className="au-input au-input--full"
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={user.email}
                  onInput={onInput}
                />
              </div>
              <div className="form-group">
                <label>FirstName</label>
                <input
                  className="au-input au-input--full"
                  type="text"
                  name="firstName"
                  placeholder="FName"
                  value={user.firstName}
                  onInput={onInput}
                />
              </div>
              <div className="form-group">
                <label>LastName</label>
                <input
                  className="au-input au-input--full"
                  type="text"
                  name="lastName"
                  placeholder="LName"
                  value={user.lastName}
                  onInput={onInput}
                />
              </div>
              <button
                className="au-btn au-btn--block au-btn--green mb-4"
                type="submit"
              >
                Save changes
              </button>
            </form>
            <div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="file-upload" style={{ display: 'block', marginBottom: '10px', color: '#D1D1D3' }}>
                  Upload Profile Photo or Document
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.txt,.svg"
                  onChange={handleFileUpload}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#1A1A1C',
                    border: '1px solid #D1D1D3',
                    borderRadius: '4px',
                    color: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                />
                {uploadStatus && (
                  <div style={{ 
                    marginTop: '10px', 
                    padding: '10px', 
                    background: uploadStatus.includes('success') ? '#1a3a1a' : '#3a1a1a',
                    borderRadius: '4px',
                    color: uploadStatus.includes('success') ? '#4ade80' : '#f87171',
                    fontSize: '14px'
                  }}>
                    {uploadStatus}
                  </div>
                )}
              </div>
              <button
                className="au-btn au-btn--block au-btn--blue mb-4"
                onClick={() => removeUserPhotoById(user.id, isAdmin)}
              >
                Remove user profile photo
              </button>
            </div>
          </div>
        </UserSidebarLayout>
      ) : (
        <Navigate
          to={{ pathname: RoutePath.Login }}
          state={{ from: '/userprofile' }}
        />
      )}
    </>
  );
};

export default Userprofile;
