import { Outlet } from 'remix';

import MantineProvider from '~/web/components/MantineProvider';

const AuthRoot = () => {
  return (
    <MantineProvider>
      <Outlet />
    </MantineProvider>
  );
};

export default AuthRoot;
