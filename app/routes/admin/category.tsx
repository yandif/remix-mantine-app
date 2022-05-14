import { Box, createStyles } from '@mantine/core';
import { useEffect } from 'react';

import useAdminStore from '~/stores/admin';

const useStyles = createStyles((theme) => {
  const isDark = theme.colorScheme === 'dark';

  return {
    main: {},
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
