import { Navbar, NavbarProps, ScrollArea } from '@mantine/core';

import useStore from '../stroe';

const AdminNavbar = (props: Omit<NavbarProps, 'children'>) => {
  const { opened } = useStore();

  return (
    <Navbar {...props}
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 300, lg: 350 }}
      sx={(theme) => ({ color: theme.colorScheme === 'dark' ? theme.white : theme.colors.dark[3] })}
    >

      <Navbar.Section mt="xs">
        Logo
      </Navbar.Section>

      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        导航栏
      </Navbar.Section>

      <Navbar.Section>
        Footer
      </Navbar.Section>

    </Navbar>
  );
};

export default AdminNavbar;
