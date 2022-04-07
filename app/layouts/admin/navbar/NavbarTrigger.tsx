import { createStyles, MediaQuery, ThemeIcon } from '@mantine/core';
import { FC } from 'react';
import { ChevronLeft, ChevronRight } from 'tabler-icons-react';

import { useThemeStore } from '~/stores';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
  },
  trigger: {
    position: 'absolute',
    zIndex: 1000,
    cursor: 'pointer',
    left: -10,
    top: -10,
    color: theme.colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.gray[4],
    background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    borderRadius: '50%',
    border: '1px solid ',
    borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.gray[4],
    height: '18px',
    width: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

const NavbarTrigger: FC = () => {
  const { opened, toggle } = useThemeStore();
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
        <div className={classes.trigger} onClick={toggle} >
          {opened ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </div>
      </MediaQuery>
    </div>
  );
};

export default NavbarTrigger;
