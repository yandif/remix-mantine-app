import { ColorSchemeProvider, MantineProvider as DefaultMantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { FC } from 'react';

import { useThemeStore } from '~/stores';

const MantineProvider: FC = ({ children }) => {
  const { colorScheme, toggleColorScheme } = useThemeStore();

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <DefaultMantineProvider theme={{ colorScheme }}>
        <NotificationsProvider>
          {children}
        </NotificationsProvider>
      </DefaultMantineProvider>
    </ColorSchemeProvider>
  );
};

export default MantineProvider;
