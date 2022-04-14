import { ColorSchemeProvider, MantineProvider as DefaultMantineProvider } from '@mantine/core';
import type { FC } from 'react';

import { useThemeStore } from '~/stores';

const MantineProvider: FC = ({ children }) => {
  const { colorScheme, toggleColorScheme } = useThemeStore();

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <DefaultMantineProvider theme={{ colorScheme }}>
        {children}
      </DefaultMantineProvider>
    </ColorSchemeProvider>
  );
};

export default MantineProvider;
