import { Container, Grid, Skeleton } from '@mantine/core';
import { useEffect } from 'react';

import useAdminStore from '~/stores/admin';

const child = <Skeleton height={140} radius="md" animate={false} />;

export function GridAsymmetrical() {
  return (
    <Grid>
      <Grid.Col xs={4}>{child}</Grid.Col>
      <Grid.Col xs={8}>{child}</Grid.Col>
    </Grid>
  );
}

export default function Comment() {
  const { setHeaderTitle } = useAdminStore();
  useEffect(() => {
    setHeaderTitle('评论管理');
  }, []);
  return <GridAsymmetrical />;
}
