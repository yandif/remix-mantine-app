import { ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { FC } from 'react';
import { Outlet } from 'remix';

import useStore from '../admin/stroe';

const ToolLayout: FC = () => {
  const { colorScheme, toggleColorScheme } = useStore();

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }}>
        <Outlet />
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default ToolLayout;
