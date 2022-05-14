import type { FC } from 'react';
import type { LoaderFunction } from 'remix';

import { authenticator } from '~/server/auth/auth.server';

const Logout: FC = () => {
  return <h1>Logout</h1>;
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: '/login' });
};

export default Logout;
