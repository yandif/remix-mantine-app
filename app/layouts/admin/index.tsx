import {
  Avatar,
  Box,
  Center,
  createStyles,
  Group,
  MediaQuery,
  Navbar,
  ScrollArea,
  Text,
  Title,
} from '@mantine/core';
import { Outlet } from 'remix';
import { ChevronRight } from 'tabler-icons-react';

import MantineProvider from '~/components/MantineProvider';
import { ToggleColorSchemeIcon } from '~/components/ToggleColorScheme';

import { mockdata, site, user } from './data';
import { LinksGroup } from './navbar/NavbarLinksGroup';

const useStyles = createStyles((theme) => {
  const isDark = theme.colorScheme === 'dark';
  const backgroundColor = isDark ? theme.colors.dark[7] : theme.colors.gray[0];
  const color = isDark ? theme.colors.dark[0] : theme.colors.gray[7];
  const border = `1px solid ${
    isDark ? theme.colors.dark[4] : theme.colors.gray[3]
  }`;

  return {
    main: {
      backgroundColor,
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
      padding: theme.spacing.md,
      paddingTop: 0,
      marginLeft: -theme.spacing.md,
      marginRight: -theme.spacing.md,
      borderBottom: border,
    },

    links: {
      padding: theme.spacing.xs,
      marginLeft: -theme.spacing.md,
      marginRight: -theme.spacing.md,
    },

    footer: {
      padding: theme.spacing.md,
      paddingBottom: 0,
      marginLeft: -theme.spacing.md,
      marginRight: -theme.spacing.md,
      borderTop: border,
    },
  };
});

function AdminLayout() {
  const { classes } = useStyles();

  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} base="/admin" />
  ));
  return (
    <>
      <Box className={classes.main}>
        <Navbar width={{ sm: 200 }} p="md" className={classes.navbar}>
          <Navbar.Section className={classes.header}>
            <Center>
              <Title order={4}>{site.title}</Title>
              <ToggleColorSchemeIcon ml="md" />
            </Center>
          </Navbar.Section>

          <Navbar.Section grow className={classes.links} component={ScrollArea}>
            {links}
          </Navbar.Section>

          <Navbar.Section className={classes.footer}>
            <Group spacing={7}>
              <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                <Avatar size={30} radius="xl" color="cyan">
                  {user?.name?.charAt(0)}
                </Avatar>
              </MediaQuery>
              <Text weight={500} size="sm" mr={3}>
                {user?.name}
              </Text>
              <ChevronRight size={12} />
            </Group>
          </Navbar.Section>
        </Navbar>
        <Box pl="200px">
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
