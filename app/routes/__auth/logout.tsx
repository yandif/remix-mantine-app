import { FC } from 'react';
import { LoaderFunction } from 'remix';

import { authenticator } from '~/services/auth.server';

const Logout: FC = () => {
  return <h1>Logout</h1>;
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: '/login' });
};

export default Logout;
