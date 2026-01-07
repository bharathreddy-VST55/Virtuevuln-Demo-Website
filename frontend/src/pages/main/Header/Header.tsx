import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { goTo, postMetadata, getSpawnData, getAdminStatus } from '../../../api/httpClient';
import Nav from './Nav';
import Sign from './Sign';

interface Props {
  onInnerPage?: boolean;
}

export const Header: FC<Props> = (props: Props) => {
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const user = sessionStorage.getItem('email') || localStorage.getItem('email');

  useEffect(() => {
    postMetadata().then((data) => console.log('xml', data));
    getSpawnData().then((data) => console.log('spawn', data));
    
    // Check if user is super admin - if so, redirect immediately
    if (user) {
      getAdminStatus(user)
        .then((data) => {
          if (data.role === 'super_admin') {
            setIsSuperAdmin(true);
            // Redirect super admin away from public pages
            if (window.location.pathname !== '/dashboard' && 
                window.location.pathname !== '/userprofile' &&
                !window.location.pathname.startsWith('/admin/')) {
              window.location.replace('/dashboard');
            }
          } else {
            setIsSuperAdmin(false);
          }
          setLoading(false);
        })
        .catch(() => {
          setIsSuperAdmin(false);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  const sendGoTo = (url: string) => () => {
    goTo(url).then(() => console.log('goto', url));
  };

  // Don't show header for super admin - they should only see dashboard
  if (loading || isSuperAdmin) {
    return null;
  }

  return (
    <header
      id="header"
      className={`fixed-top ${props.onInnerPage ? 'header-inner-pages' : ''}`}
    >
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-xl-9 d-flex align-items-center">
            <Link to="/" className="logo mr-auto" onClick={sendGoTo('/')}>
              <img src="assets/img/logo.png" alt="" className="img-fluid" />{' '}
              DEMON SLAYERS
            </Link>

            <Nav />

            <Sign />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
