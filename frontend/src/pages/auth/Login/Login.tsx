import type { AxiosRequestConfig } from 'axios';
import type { FC, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RoutePath } from '../../../router/RoutePath';
import {
  getLdap,
  getUser,
  getUserData
} from '../../../api/httpClient';
import type {
  LoginResponse,
  LoginUser,
  UserData,
  RegistrationUser
} from '../../../interfaces/User';
import { LoginFormMode } from '../../../interfaces/User';
import AuthLayout from '../AuthLayout';
import showLdapResponse from './showLdapReponse';
import showLoginResponse from './showLoginReponse';

const defaultLoginUser: LoginUser = {
  user: '',
  password: '',
  op: LoginFormMode.BASIC
};


export const Login: FC = () => {
  const { state } = useLocation();

  const [form, setForm] = useState<LoginUser>(defaultLoginUser);
  const { user, password } = form;

  const [loginResponse, setLoginResponse] = useState<LoginResponse | null>();
  const [ldapResponse, setLdapResponse] = useState<Array<RegistrationUser>>([]);
  const [errorText, setErrorText] = useState<string | null>();

  const onInput = ({ target }: { target: EventTarget | null }) => {
    const { name, value } = target as HTMLInputElement;
    setForm({ ...form, [name]: value });
  };

  const sendUser = (e: FormEvent) => {
    e.preventDefault();
    const config: Pick<AxiosRequestConfig, 'headers'> = {};
    const params = form;

    getUser(params, config)
      .then((data: LoginResponse) => {
        setLoginResponse(data);
        return data;
      })
      .then(({ email, errorText }) => {
        if (errorText) {
          setErrorText(errorText);
          return Promise.reject(new Error(errorText));
        }
        if (!email) {
          const errorMsg = 'Login failed: No email in response';
          setErrorText(errorMsg);
          return Promise.reject(new Error(errorMsg));
        }
        sessionStorage.setItem('email', email);
        
        // Ensure token is stored before proceeding
        // Token should be stored by makeApiRequest from response headers
        const token = sessionStorage.getItem('token');
        if (!token) {
          console.warn('Token not found in sessionStorage after login');
        } else {
          console.log('Token stored successfully');
        }
        
        return getUserData(email).then((userData: UserData) => ({ userData, email }));
      })
      .then(async ({ userData, email }) => {
        sessionStorage.setItem(
          'userName',
          `${userData.firstName} ${userData.lastName}`
        );
        sessionStorage.setItem('user_id', userData.id);
        
        // Store role in sessionStorage AND localStorage for redundancy
        // This ensures the role is available even after page reload
        if (userData.role) {
          sessionStorage.setItem('userRole', userData.role);
          localStorage.setItem('userRole', userData.role);
          console.log('Login: Stored role in sessionStorage and localStorage:', userData.role);
        } else {
          console.warn('Login: userData.role is missing!', userData);
        }
        
        // Check if user is super admin - use role from userData directly
        const isSuperAdmin = userData.role === 'super_admin';
        console.log('Login: User role is super_admin?', isSuperAdmin);
        
        // Verify token is still available before redirecting
        const token = sessionStorage.getItem('token');
        if (!token) {
          console.error('Token missing before redirect - this will cause 401 errors');
          setErrorText('Authentication token not available. Please try logging in again.');
          return;
        }
        
        // Verify role was stored correctly
        const storedRoleCheck = sessionStorage.getItem('userRole');
        if (!storedRoleCheck) {
          console.error('CRITICAL: Role was not stored in sessionStorage!');
          setErrorText('Failed to store user role. Please try logging in again.');
          return;
        }
        console.log('Login: Verified role stored correctly:', storedRoleCheck);
        
        // Set a flag to prevent sendLdap from redirecting
        // Set it BEFORE redirecting to ensure it's checked by sendLdap
        sessionStorage.setItem('loginRedirectHandled', 'true');
        
        console.log('Login successful, token verified, role stored, redirecting to dashboard');
        
        // Use window.location.replace instead of href to prevent back button issues
        // and ensure this redirect cannot be overridden
        window.location.replace('/dashboard');
        return; // Prevent further execution
      })
      .catch((err) => {
        console.error('Login error:', err);
        setErrorText('Login failed. Please try again.');
      });
  };

  const sendLdap = () => {
    // Don't do anything if we've already handled the login redirect
    // This prevents sendLdap from interfering with dashboard redirect
    if (sessionStorage.getItem('loginRedirectHandled') === 'true') {
      return;
    }
    
    const { ldapProfileLink } = loginResponse || {};
    if (ldapProfileLink) {
      getLdap(ldapProfileLink)
        .then((data) => setLdapResponse(data))
        .then(() => {
          // Only redirect if login redirect wasn't already handled
          // AND we're not already on the dashboard
          if (sessionStorage.getItem('loginRedirectHandled') !== 'true' && 
              window.location.pathname !== '/dashboard') {
            window.location.href = state ? state.from : '/';
          }
        })
        .catch(() => {
          // Silently fail if LDAP call fails
        });
    }
  };


  const extractLogoBgColor = (): string | null => {
    const { searchParams } = new URL(window.location.href);
    return searchParams.get('logobgcolor');
  };

  useEffect(() => {
    // Only call sendLdap if we haven't already handled the redirect
    // This prevents sendLdap from interfering with dashboard redirect
    if (sessionStorage.getItem('loginRedirectHandled') !== 'true') {
      sendLdap();
    }
  }, [loginResponse]);

  return (
    <AuthLayout logoBgColor={extractLogoBgColor() || 'transparent'}>
      <div className="login-form">
        <form onSubmit={sendUser}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              className="au-input au-input--full"
              type="text"
              name="user"
              id="email"
              placeholder="Email"
              aria-label="Email"
              value={user}
              onInput={onInput}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              className="au-input au-input--full"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              aria-label="Password"
              value={password}
              onInput={onInput}
            />
          </div>

          {loginResponse && showLoginResponse(loginResponse)}
          <br />
          {ldapResponse && showLdapResponse(ldapResponse)}

          <button
            className="au-btn au-btn--block au-btn--green mb-4"
            type="submit"
            aria-label="Sign in"
          >
            sign in
          </button>
        </form>
        <div>
          {errorText && <div className="error-text">{errorText}</div>}
          <b>Hint</b>: if you are looking for an authentication protected
          endpoint, try using:
          <a href="http://localhost:3000/api/products">
            http://localhost:3000/api/products
          </a>
        </div>
        <div className="register-link">
          <p>
            Don't have an account?{' '}
            <Link to={RoutePath.Register} aria-label="Sign Up">
              Sign Up Here
            </Link>
          </p>
        </div>
        <div className="two-step-link" style={{ marginTop: '20px', textAlign: 'center' }}>
          <p>
            <Link 
              to={RoutePath.LoginNew} 
              aria-label="2-step Sign in"
              style={{ 
                color: '#4A90E2', 
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              2-step Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
