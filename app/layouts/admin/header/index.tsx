import type { HeaderProps } from '@mantine/core';
import {
  Avatar,
  Burger,
  createStyles,
  Divider,
  Group,
  Header,
  MediaQuery,
  Menu,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { Link } from 'remix';
import { ChevronDown, Logout, Settings } from 'tabler-icons-react';

import { ToggleColorSchemeIcon } from '~/components/ToggleColorScheme';
import { useThemeStore } from '~/stores';

const useStyles = createStyles((theme) => {
  const isDark = theme.colorScheme === 'dark';
  const color = isDark ? theme.white : theme.colors.dark[3];
  return {
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
    },
    text: {
      color,
    },
  };
});

const AdminHeader = (props: Omit<HeaderProps, 'children'>) => {
  const { opened, toggle } = useThemeStore();

  const theme = useMantineTheme();

  const { classes } = useStyles();

  const site = {
    title: '管理界面',
  };

  const user = {
    name: 'Yandif',
  };

  return (
    <Header {...props} p="md">
      <div className={classes.header}>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Text
            ml={20}
            sx={{ display: 'flex' }}
            size="lg"
            className={classes.text}>
            {site?.title}
          </Text>
        </MediaQuery>

        <Menu
          size={150}
          placement="end"
          transition="pop-top-right"
          trigger="hover"
          delay={200}
          control={
            <UnstyledButton>
              <Group spacing={7}>
                <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                  <Avatar size={30} radius="xl" color="cyan">
                    {user?.name?.charAt(0)}
                  </Avatar>
                </MediaQuery>
                <Text weight={500} size="sm" mr={3} className={classes.text}>
                  {user?.name}
                </Text>
                <ChevronDown size={12} />
              </Group>
            </UnstyledButton>
          }>
          <Menu.Label>
            <ToggleColorSchemeIcon ml={10} />
          </Menu.Label>
          <Divider />
          <Menu.Label>设置</Menu.Label>
          <Menu.Item icon={<Settings size={14} />}>个人中心</Menu.Item>
          <Menu.Item component={Link} to="/logout" icon={<Logout size={14} />}>
            登出
          </Menu.Item>
        </Menu>
      </div>
    </Header>
  );
};

export default AdminHeader;
