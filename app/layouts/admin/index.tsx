import { AppShell, ColorSchemeProvider, MantineProvider, Paper, ScrollArea } from '@mantine/core';
import { Outlet } from 'remix';

import { useThemeStore } from '~/stores';

import AdminHeader from './header';
import AdminNavbar from './navbar';

export default function AdminLayout() {
  const { colorScheme, toggleColorScheme } = useThemeStore();

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }}>
        <AppShell
          navbarOffsetBreakpoint="sm"
          navbar={(
            <AdminNavbar />
          )}
          header={<AdminHeader height={56} />}
          sx={{ '.mantine-AppShell-main': { padding: 0 } }}
        >

          <Paper radius={0} component={ScrollArea}
            style={{
              height: 'calc(100vh - 56px)',
              padding: '0 16px'
            }}
          >
            <Outlet />
          </Paper>
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
