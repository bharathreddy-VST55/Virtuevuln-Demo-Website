import type { AxiosRequestConfig } from 'axios';
import type { FC, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RoutePath } from '../../../router/RoutePath';
import { getUser, getUserData } from '../../../api/httpClient';
import type {
  LoginResponse,
  LoginUser,
  UserData
} from '../../../interfaces/User';
import { LoginFormMode } from '../../../interfaces/User';
import AuthLayout from '../AuthLayout';

const defaultLoginUser: LoginUser = {
  user: '',
  password: '',
  op: LoginFormMode.BASIC
};

export const PasswordCheck: FC = () => {
  const [form, setForm] = useState<LoginUser>(defaultLoginUser);
  const { password } = form;

  const [errorText, setErrorText] = useState<string | null>();
  const navigate = useNavigate();

  const email = sessionStorage.getItem('email');

  const onInput = ({ target }: { target: EventTarget | null }) => {
    const { name, value } = target as HTMLInputElement;
    setForm({ ...form, [name]: value });
  };

  const sendUser = (e: FormEvent) => {
    e.preventDefault();
    const config: Pick<AxiosRequestConfig, 'headers'> = {
      headers: { 'content-type': 'application/json' }
    };

    getUser(form, config)
      .then((data: LoginResponse) => {
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
        if (form.rememberuser) {
          localStorage.setItem(
            'email',
            sessionStorage.getItem('email') || ''
          );
          localStorage.setItem(
            'token',
            sessionStorage.getItem('token') || ''
          );
          sessionStorage.clear();
        }
        return getUserData(email);
      })
      .then(async (userData: UserData) => {
        if (form.rememberuser) {
          localStorage.setItem(
            'userName',
            `${userData.firstName} ${userData.lastName}`
          );
          localStorage.setItem('user_id', userData.id);
          if (userData.role) {
            localStorage.setItem('userRole', userData.role);
          }
        } else {
          sessionStorage.setItem(
            'userName',
            `${userData.firstName} ${userData.lastName}`
          );
          sessionStorage.setItem('user_id', userData.id);
          if (userData.role) {
            sessionStorage.setItem('userRole', userData.role);
          }
        }
        // Check if user is super admin - use role from userData directly
        const isSuperAdmin = userData.role === 'super_admin';
        
        if (isSuperAdmin) {
          console.log('Super admin detected, redirecting to admin dashboard');
          navigate('/dashboard', { replace: true });
          return;
        }
        
        // Redirect to dashboard for non-super admin users
        navigate('/dashboard', { replace: true });
      });
  };

  useEffect(() => {
    if (email) {
      setForm({ ...form, user: email });
    }
  }, []);

  return (
    <AuthLayout>
      <div className="login-form">
        <form onSubmit={sendUser}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              value={form.user}
              name="user"
              readOnly
              aria-label="Username"
            />
            <label htmlFor="password">Enter Password:</label>
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
            <label htmlFor="rememberuser">
              <input
                type="checkbox"
                id="rememberuser"
                name="rememberuser"
                value="true"
                onChange={onInput}
              />
              &nbsp;Remember me
            </label>
          </div>
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
      </div>
    </AuthLayout>
  );
};

export default PasswordCheck;
