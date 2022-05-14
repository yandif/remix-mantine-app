import { Box, createStyles } from '@mantine/core';
import { useEffect } from 'react';

import useAdminStore from '~/stores/admin';

const useStyles = createStyles((theme) => {
  const isDark = theme.colorScheme === 'dark';

  return {
    main: {
      boxSizing: 'border-box',
      minHeight: 'calc(100vh - 60px)',
      padding: theme.spacing.md,
      backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
    },
  };
});

export default function Catrgory() {
  const { classes } = useStyles();
  const { setHeaderTitle } = useAdminStore();
  useEffect(() => {
    setHeaderTitle('分类管理');
  }, []);
  return <Box className={classes.main}>分类管理</Box>;
}
