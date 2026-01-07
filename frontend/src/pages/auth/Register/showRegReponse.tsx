import { InnerHtml } from '../../../components';
import type { RegistrationUser } from '../../../interfaces/User';

export function showRegResponse({
  email,
  firstName,
  lastName
}: RegistrationUser) {
  const fields = [
    { title: 'Email', value: email },
    { title: 'First Name', value: firstName },
    { title: 'Last Name', value: lastName }
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

export default showRegResponse;
