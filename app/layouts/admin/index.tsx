import {
  Avatar,
  Box,
  Center,
  createStyles,
  Group,
  MediaQuery,
  Menu,
  Navbar,
  ScrollArea,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { Link, Outlet } from 'remix';
import { ChevronDown, Logout, Settings } from 'tabler-icons-react';

import MantineProvider from '~/components/MantineProvider';
import { ToggleColorSchemeIcon } from '~/components/ToggleColorScheme';
import useAdminStore from '~/stores/admin';

import { LinksGroup } from './navbar/NavbarLinksGroup';

const useStyles = createStyles((theme) => {
  const isDark = theme.colorScheme === 'dark';
  const backgroundColor = isDark ? theme.colors.dark[7] : theme.white;

  const color = isDark ? theme.colors.dark[0] : theme.colors.gray[7];

  return {
    main: {
      backgroundColor: 'red',
      color,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
    },

    navbar: {
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
    },

    header: {
      height: 60,
      padding: theme.spacing.md,
    },

    links: {
      padding: theme.spacing.xs,
    },

    adminHeader: {
      height: 60,
      padding: theme.spacing.md,
      backgroundColor,
      color,
    },
  };
});

function AdminLayout() {
  const { classes } = useStyles();
  const { headerTitle, sizeName, user, menus } = useAdminStore();

  if (!user) return null;

  return (
    <>
      <Box className={classes.main}>
        <Navbar
          width={{ sm: 200 }}
          p="md"
          className={classes.navbar}
          px={0}
          py={0}>
          <Navbar.Section className={classes.header}>
            <Center>
              <Title order={4}>{sizeName}</Title>
              <ToggleColorSchemeIcon ml="md" />
            </Center>
          </Navbar.Section>

          <Navbar.Section grow className={classes.links} component={ScrollArea}>
            {menus.map((item) => (
              <LinksGroup {...item} key={item.label} base="/admin" />
            ))}
          </Navbar.Section>
        </Navbar>
        <Box pl="200px">
          <Group position="apart" className={classes.adminHeader}>
            <Title order={5}>{headerTitle}</Title>
            <Menu
              size={170}
              placement="end"
              transition="pop-top-right"
              trigger="hover"
              delay={200}
              control={
                <UnstyledButton>
                  <Group spacing={7}>
                    <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                      <Avatar size={30} radius="xl" color="cyan"></Avatar>
                    </MediaQuery>
                    <Text weight={500} size="sm" mr={3}>
                      {user?.username}
                    </Text>
                    <ChevronDown size={12} />
                  </Group>
                </UnstyledButton>
              }>
              <Menu.Label>设置</Menu.Label>
              <Menu.Item icon={<Settings size={14} />}>个人中心</Menu.Item>
              <Menu.Item
                component={Link}
                to="/logout"
                icon={<Logout size={14} />}>
                登出
              </Menu.Item>
            </Menu>
          </Group>
          <Outlet />
        </Box>
      </Box>
    </>
  );
}

export default function ThemedAdminLayout() {
  return (
    <MantineProvider>
      <AdminLayout />
    </MantineProvider>
  );
}
