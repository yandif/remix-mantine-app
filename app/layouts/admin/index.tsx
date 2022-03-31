import { AppShell, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { Outlet } from 'remix';

import AdminHeader from './header';
import AdminNavbar from './navbar';
import useStore from './stroe';

export default function AdminLayout() {
  const { colorScheme, toggleColorScheme } = useStore();

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }}>
        <AppShell
          navbarOffsetBreakpoint="sm"
          fixed
          navbar={(
            <AdminNavbar />
          )}
          header={(
            <AdminHeader height={70} />
          )}
        >
          <Outlet />
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
