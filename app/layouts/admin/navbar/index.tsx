import type { NavbarProps } from '@mantine/core';
import { createStyles, MediaQuery, Navbar, ScrollArea } from '@mantine/core';
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

import { useThemeStore } from '~/stores';

import { LinksGroup } from './NavbarLinksGroup';

const mockdata = [
  { label: '看板', icon: Gauge, link: '/dashboad' },

  { label: '公告管理', icon: MessageDots, link: '/article/announcement' },
  { label: '分类管理', icon: Folders, link: '/article/category' },
  { label: '标签管理', icon: Tags, link: '/article/tag' },
  {
    label: '文章管理',
    icon: Notes,
    initiallyOpened: true,
    links: [
      { label: '文章列表', link: '/article/list' },
      { label: '写文章', link: '/article/create' },
    ],
  },
  { label: '评论管理', icon: Message2, link: '/article/comment' },
  { label: '反馈管理', icon: Backpack, link: '/article/feedback' },
  { label: '系统设置', icon: Adjustments, link: '/setting' },
];

const useStyles = createStyles((theme) => ({
  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  trigger: {},
}));

const AdminNavbar = (props: Omit<NavbarProps, 'children'>) => {
  const { opened } = useThemeStore();
  const { classes } = useStyles();
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} base="/admin" />
  ));

  return (
    <MediaQuery smallerThan="sm" styles={{ position: 'fixed' }}>
      <Navbar
        {...props}
        hiddenBreakpoint="sm"
        px="md"
        hidden={!opened}
        width={{ base: 200 }}
        sx={(theme) => ({
          color:
            theme.colorScheme === 'dark' ? theme.white : theme.colors.dark[3],
          minWidth: '200px',
        })}>
        <Navbar.Section grow className={classes.links} component={ScrollArea}>
          <div className={classes.linksInner}>{links}</div>
        </Navbar.Section>
      </Navbar>
    </MediaQuery>
  );
};

export default AdminNavbar;
