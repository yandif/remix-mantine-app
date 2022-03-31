import { Burger, createStyles, Divider, Header, HeaderProps, MediaQuery, Menu, Text, useMantineTheme } from '@mantine/core';
import { Heart, Logout, Message, PlayerPause, Settings, Star, SwitchHorizontal, Trash } from 'tabler-icons-react';

import { ToggleColorSchemeIcon } from '~/components/ToggleColorScheme';

import useStore from '../stroe';

const useStyles = createStyles((theme) => {
  const isDark = theme.colorScheme === 'dark';
  const color = isDark ? theme.white : theme.colors.dark[3];
  return ({
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%'
    },
    text: {
      color
    }
  });
});

const AdminHeader = (props: Omit<HeaderProps, 'children'>) => {
  const { opened, toggle } = useStore();

  const theme = useMantineTheme();

  const { classes } = useStyles();

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

        <Text mr={20} className={classes.text}>应用</Text>

        <Menu
          size={260}
          placement="end"
          transition="pop-top-right"
          control={
            <div style={{ display: 'flex' }}>
              <ToggleColorSchemeIcon mr="md" />
              <Text mr={20} className={classes.text}>
                Yandif
              </Text>
            </div>
          }
        >
          <Menu.Item icon={<Heart size={14} color={theme.colors.red[6]} />}>
            Liked posts
          </Menu.Item>
          <Menu.Item icon={<Star size={14} color={theme.colors.yellow[6]} />}>
            Saved posts
          </Menu.Item>
          <Menu.Item icon={<Message size={14} color={theme.colors.blue[6]} />}>
            Your comments
          </Menu.Item>

          <Menu.Label>Settings</Menu.Label>
          <Menu.Item icon={<Settings size={14} />}>Account settings</Menu.Item>
          <Menu.Item icon={<SwitchHorizontal size={14} />}>Change account</Menu.Item>
          <Menu.Item icon={<Logout size={14} />}>Logout</Menu.Item>

          <Divider />

          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item icon={<PlayerPause size={14} />}>Pause subscription</Menu.Item>
          <Menu.Item color="red" icon={<Trash size={14} />}>
            Delete account
          </Menu.Item>
        </Menu>
      </div>

    </Header >
  );
};

export default AdminHeader;
