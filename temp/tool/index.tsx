import { ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { FC } from 'react';
import { Outlet } from 'remix';

import { useThemeStore } from '~/stores';

const ToolLayout: FC = () => {
  const { colorScheme, toggleColorScheme } = useThemeStore();

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }}>
        <Outlet />
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default ToolLayout;
