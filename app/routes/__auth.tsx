import { Outlet } from 'remix';

import MantineProvider from '~/components/MantineProvider';

const AuthRoot = () => {
  return (
    <MantineProvider>
      <Outlet />
    </MantineProvider>
  );
};

export default AuthRoot;
