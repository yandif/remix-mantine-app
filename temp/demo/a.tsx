import {
  ActionIcon,
  AppShell, ColorScheme,
  ColorSchemeProvider,
  Header,
  MantineProvider,
  Navbar,
  useMantineColorScheme
} from '@mantine/core';
import { Prism } from '@mantine/prism';
import { useState } from 'react';
import { MoonStars, Sun } from 'tabler-icons-react';

function Icon() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <ActionIcon
      variant="outline"
      color={dark ? 'yellow' : 'blue'}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <Sun size={18} /> : <MoonStars size={18} />}
    </ActionIcon>
  );
}

export default function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }}>
        <Demo />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

const deleted = { color: 'red', label: '-' };
const added = { color: 'green', label: '+' };

function P() {
  return (
    <Prism
      language="tsx"
      withLineNumbers
      highlightLines={{
        3: deleted,
        4: deleted,
        5: deleted,
        7: added,
        8: added,
        9: added,
      }}
    >
      {`
    import { Button } from '@mantine/core';

    function Demo() {
      return <Button>Hello</Button>
    }
    
    function Usage() {
      return <ActionIcon>Hello</ActionIcon>;
    }
    `}
    </Prism>
  );
}

function Demo() {
  return (

    <AppShell
      padding="md"
      navbar={<Navbar width={{ base: 300 }} height="100%" p="xs">{/* Navbar content */}</Navbar>}
      header={<Header height={60} p="xs"><div>
        <Icon />
      </div></Header>}
      styles={(theme) => ({
        body: { height: 'calc(100vh - 60px)' },
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      <div style={{ width: '500px' }}>
        <P />
      </div>
    </AppShell>

  );
}
