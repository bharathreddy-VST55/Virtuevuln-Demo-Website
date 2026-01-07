import type { AxiosRequestConfig } from 'axios';
import { httpClient } from './httpClient';

export function makeApiRequest<T>(
  urlOrConfig: string | AxiosRequestConfig
): Promise<T> {
  const config: AxiosRequestConfig =
    typeof urlOrConfig === 'string' ? { url: urlOrConfig } : urlOrConfig;

  return httpClient
    .request(config)
    .then((response) => {
      const token = response.headers.authorization;
      if (token) {
        sessionStorage.setItem('token', token);
      }

      return response.data;
    })
    .catch((error) => {
      const status = error.response?.status || 500;
      const url = config.url || '';

      switch (status) {
        case 401:
          // Only clear storage and force logout for actual authentication endpoints
          // For other endpoints, log the error but don't force logout
          // This prevents dashboard from going blank when API calls fail
          if (url.includes('/auth/login') || url.includes('/auth/register')) {
            sessionStorage.clear();
            localStorage.clear();
            return {
              email: undefined,
              ldapProfileLink: '',
              errorText:
                'Authentication failed, please check your credentials and try again'
            };
          } else {
            // For other 401 errors (like dashboard API calls), just log and return error
            // without clearing storage
            console.error('401 Unauthorized on:', url);
            console.error('Token might be missing or invalid. Not logging out automatically.');
            throw error; // Re-throw so calling code can handle it
          }
        case 409:
          return {
            email: undefined,
            ldapProfileLink: '',
            errorText: 'User already exists'
          };
        default:
          return {
            email: undefined,
            ldapProfileLink: '',
            errorText: error.response?.data?.error?.error || error.message || 'Something went wrong. Please try again later'
          };
      }
    });
}
