import { InnerHtml } from '../../../components';
import type { LoginResponse } from '../../../interfaces/User';

export function showLoginResponse({ email, ldapProfileLink }: LoginResponse) {
  const fields = [
    { title: 'Email', value: email },
    { title: 'LDAP', value: ldapProfileLink }
  ];

  return (
    <>
      {fields.map(
        ({ title, value }) =>
          value && (
            <div className="dangerous-html" key={title}>
              <InnerHtml html={`${title}: ${value}`} />
            </div>
          )
      )}
    </>
  );
}

export default showLoginResponse;
