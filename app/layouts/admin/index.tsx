import {
  Box,
  Center,
  createStyles,
  Navbar,
  ScrollArea,
  Title,
} from '@mantine/core';
import { Outlet } from 'remix';
import {
  Adjustments,
  Backpack,
  Folders,
  Gauge,
  Message2,
  MessageDots,
  Notes,
  Tags,
} from 'tabler-icons-react';

import MantineProvider from '~/components/MantineProvider';
import { ToggleColorSchemeIcon } from '~/components/ToggleColorScheme';

import { LinksGroup } from './navbar/NavbarLinksGroup';

const useStyles = createStyles((theme) => {
  const isDark = theme.colorScheme === 'dark';
  const backgroundColor = isDark ? theme.colors.dark[6] : theme.white;
  return {
    main: {
      backgroundColor,
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
      color: isDark ? theme.colors.gray[4] : theme.black,
      borderBottom: `1px solid ${
        isDark ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
    },

    links: {
      padding: theme.spacing.xs,
      marginLeft: -theme.spacing.md,
      marginRight: -theme.spacing.md,
    },

    footer: {
      marginLeft: -theme.spacing.md,
      marginRight: -theme.spacing.md,
      borderTop: `1px solid ${
        isDark ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
    },
  };
});

function AdminLayout() {
  const { classes } = useStyles();
  const mockdata = [
    { label: '看板', icon: Gauge, link: '/dashboard' },

    { label: '公告管理', icon: MessageDots, link: '/announcement' },
    { label: '分类管理', icon: Folders, link: '/category' },
    { label: '标签管理', icon: Tags, link: '/tag' },
    {
      label: '文章管理',
      icon: Notes,
      initiallyOpened: true,
      links: [
        { label: '文章列表', link: '/article/list' },
        { label: '写文章', link: '/article/create' },
      ],
    },
    { label: '评论管理', icon: Message2, link: '/comment' },
    { label: '反馈管理', icon: Backpack, link: '/feedback' },
    { label: '系统设置', icon: Adjustments, link: '/setting' },
  ];

  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} base="/admin" />
  ));
  return (
    <>
      <Box className={classes.main}>
        <Navbar width={{ sm: 200 }} p="md" className={classes.navbar}>
          <Navbar.Section className={classes.header}>
            <Center>
              <Title order={4}> 管理界面</Title>
              <ToggleColorSchemeIcon ml="md" />
            </Center>
          </Navbar.Section>

          <Navbar.Section grow className={classes.links} component={ScrollArea}>
            {links}
          </Navbar.Section>

          <Navbar.Section className={classes.footer}>
            1322278095@qq.com
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
