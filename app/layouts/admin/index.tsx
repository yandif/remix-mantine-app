import { AppShell, MediaQuery, Paper, ScrollArea } from '@mantine/core';
import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'remix';

import MantineProvider from '~/components/MantineProvider';

import AdminHeader from './header';
import AdminNavbar from './navbar';

export default function AdminLayout() {
  const location = useLocation();
  const viewport = useRef<any>();
  useEffect(() => {
    viewport.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.key]);
  return (
    <MantineProvider>
      <AppShell
        navbarOffsetBreakpoint="sm"
        navbar={<AdminNavbar />}
        header={<AdminHeader height={56} />}
        sx={{ '.mantine-AppShell-main': { padding: 0 } }}>
        <MediaQuery
          largerThan="sm"
          styles={{ maxWidth: 'calc(100vw - 200px)' }}>
          <Paper
            key={location.key}
            radius={0}
            component={ScrollArea}
            viewportRef={viewport}
            sx={(theme) => {
              const isDark = theme.colorScheme === 'dark';

              return {
                height: 'calc(100vh - 56px)',
                width: '100%',
                backgroundColor: isDark
                  ? theme.colors.dark[9]
                  : theme.colors.gray[0],
              };
            }}>
            <Outlet />
          </Paper>
        </MediaQuery>
      </AppShell>
    </MantineProvider>
  );
}
