import { createStyles, Navbar, Title, Tooltip, UnstyledButton } from '@mantine/core';
import { useState } from 'react';
import { MetaFunction } from 'remix';
import {
  CalendarStats, DeviceDesktopAnalytics,
  Fingerprint, Gauge, Home2, Settings, User
} from 'tabler-icons-react';

export const meta: MetaFunction = () => {
  return { title: '首页' };
};

const useStyles = createStyles((theme) => {
  const isDark = theme.colorScheme === 'dark';

  const backgroundColor = isDark ? theme.colors.dark[7] : theme.white;

  return ({
    wrapper: {
      display: 'flex',
    },

    aside: {
      flex: '0 0 60px',
      backgroundColor,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRight: `1px solid ${isDark ? theme.colors.dark[7] : theme.colors.gray[3]}`,
    },

    main: {
      flex: 1,
      backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    mainLink: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isDark ? theme.colors.dark[0] : theme.colors.gray[7],

      '&:hover': {
        backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[0],
      },
    },

    mainLinkActive: {
      '&, &:hover': {
        backgroundColor:
          isDark
            ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
            : theme.colors[theme.primaryColor][0],
        color: theme.colors[theme.primaryColor][isDark ? 4 : 7],
      },
    },

    title: {
      boxSizing: 'border-box',
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
      marginBottom: theme.spacing.xl,
      backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
      padding: theme.spacing.md,
      paddingTop: 18,
      height: 60,
      borderBottom: `1px solid ${isDark ? theme.colors.dark[7] : theme.colors.gray[3]}`,
    },

    logo: {
      boxSizing: 'border-box',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      height: 60,
      paddingTop: theme.spacing.md,
      borderBottom: `1px solid ${isDark ? theme.colors.dark[7] : theme.colors.gray[3]}`,
      marginBottom: theme.spacing.xl,
    },

    link: {
      boxSizing: 'border-box',
      display: 'block',
      textDecoration: 'none',
      borderTopRightRadius: theme.radius.md,
      borderBottomRightRadius: theme.radius.md,
      color: isDark ? theme.colors.dark[0] : theme.colors.gray[7],
      padding: `0 ${theme.spacing.md}px`,
      fontSize: theme.fontSizes.sm,
      marginRight: theme.spacing.md,
      fontWeight: 500,
      height: 44,
      lineHeight: '44px',

      '&:hover': {
        backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
        color: isDark ? theme.white : theme.black,
      },
    },

    linkActive: {
      '&, &:hover': {
        borderLeftColor: theme.colors[theme.primaryColor][isDark ? 7 : 5],
        backgroundColor: theme.colors[theme.primaryColor][isDark ? 7 : 5],
        color: theme.white,
      },
    },
  });
});

const mainLinksMockdata = [
  { icon: Home2, label: 'Home' },
  { icon: Gauge, label: 'Dashboard' },
  { icon: DeviceDesktopAnalytics, label: 'Analytics' },
  { icon: CalendarStats, label: 'Releases' },
  { icon: User, label: 'Account' },
  { icon: Fingerprint, label: 'Security' },
  { icon: Settings, label: 'Settings' },
];

const linksMockdata = [
  'Security',
  'Settings',
  'Dashboard',
  'Releases',
  'Account',
  'Orders',
  'Clients',
  'Databases',
  'Pull Requests',
  'Open Issues',
  'Wiki pages',
];

export default function DoubleNavbar() {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState('Releases');
  const [activeLink, setActiveLink] = useState('Settings');

  const mainLinks = mainLinksMockdata.map((link) => (
    <Tooltip label={link.label} position="right" withArrow transitionDuration={0} key={link.label}>
      <UnstyledButton
        onClick={() => setActive(link.label)}
        className={cx(classes.mainLink, { [classes.mainLinkActive]: link.label === active })}
      >
        <link.icon />
      </UnstyledButton>
    </Tooltip>
  ));

  const links = linksMockdata.map((link) => (
    <a
      className={cx(classes.link, { [classes.linkActive]: activeLink === link })}
      href="/"
      onClick={(event) => {
        event.preventDefault();
        setActiveLink(link);
      }}
      key={link}
    >
      {link}
    </a>
  ));

  return (
    <Navbar height="100vh" width={{ sm: 300 }}>
      <Navbar.Section grow className={classes.wrapper}>
        <div className={classes.aside}>
          <div className={classes.logo}>
            logo
          </div>
          {mainLinks}
        </div>
        <div className={classes.main}>
          <Title order={4} className={classes.title}>
            {active}
          </Title>
          {links}
        </div>
      </Navbar.Section>
    </Navbar>
  );
}
