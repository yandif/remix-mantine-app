import { Paper } from '@mantine/core';
import type { LoaderFunction } from 'remix';
import { Link, useLoaderData } from 'remix';

export const loader: LoaderFunction = async ({
  params,
}) => {
  return params?.toolId;
};

export default function Tool() {
  const data = useLoaderData();

  return (
    <Paper p="xl" m={0} style={{ height: '100vh', }}>
      <h1> {data} </h1>
      <Link to="../">返回</Link>
    </Paper>
  );
}
