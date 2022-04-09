import { LoaderFunction } from 'remix';

import AdminLayout from '~/layouts/admin';
import { authenticator } from '~/services/auth/auth.server';

const AdminLayoutWrapper = () => {
  return <AdminLayout />;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
  return user;
};

export default AdminLayoutWrapper;
