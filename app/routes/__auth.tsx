import { NotificationsProvider } from '@mantine/notifications';
import { FC } from 'react';
import { Outlet } from 'remix';
const Root: FC = () => {
  return <NotificationsProvider>
    <Outlet />
  </NotificationsProvider>;
};

export default Root;
