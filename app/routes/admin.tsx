import type { LoaderFunction } from 'remix';

import AdminLayout from '~/layouts/admin';
import { authenticator } from '~/services/auth/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
  return user;
};

export default function AdminLayoutWrapper() {
  return <AdminLayout />;
}
