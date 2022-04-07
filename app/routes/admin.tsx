import { LoaderFunction } from 'remix';

import AdminLayout from '~/layouts/admin';
import { authenticator } from '~/services/auth.server';

const AdminLayoutWrapper = () => {
  return <AdminLayout />;
};

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
};

export default AdminLayoutWrapper;
