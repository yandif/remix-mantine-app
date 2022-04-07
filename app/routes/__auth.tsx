import { Outlet } from 'remix';

import MantineProvider from '~/components/MantineProvider';

const Auth = () => {
  return (
    <MantineProvider>
      <Outlet />
    </MantineProvider>
  );
};

export default Auth;
