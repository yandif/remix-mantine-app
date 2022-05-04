import {
  Box,
  Button,
  Center,
  Divider,
  Group,
  LoadingOverlay,
  Pagination,
  Select,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { usePagination } from '@mantine/hooks';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Box as BoxIcon } from 'tabler-icons-react';

import { sleep } from '~/utils';

const elements = [
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon1' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen1' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium1' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium1' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium1' },
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon2' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen2' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium2' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium2' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium3' },
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon3' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen3' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium3' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium3' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium4' },
];

export default function ArticleList() {
  const [data, setData] = useState<any[]>([]);
  const [size, setSize] = useState(10);
  const total = Math.floor(data.length / size);
  const pagination = usePagination({ total });

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    await sleep(200);
    setData(elements);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Box
        sx={(theme) => {
          const isDark = theme.colorScheme === 'dark';

          return {
            margin: '16px',
            padding: theme.spacing.md,
            backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
          };
        }}>
        <Group position="apart">
          <Title order={5}>文章列表</Title>
          <Button size="sm">新建文章</Button>
        </Group>
        <Divider mt="md" mb="lg" />
        <Box style={{ position: 'relative', minHeight: 500 }}>
          <Table
            highlightOnHover
            horizontalSpacing="xl"
            verticalSpacing="sm"
            sx={() => {
              return {};
            }}>
            <thead>
              <tr>
                <th>Element position</th>
                <th>Element name</th>
                <th>Symbol</th>
                <th>Atomic mass</th>
              </tr>
            </thead>
            <tbody>
              {_.chunk(data, size)[
                pagination.active - 1 < 0 ? 0 : pagination.active - 1
              ]?.map((element) => (
                <tr key={element.name}>
                  <td>{element.position}</td>
                  <td>{element.name}</td>
                  <td>{element.symbol}</td>
                  <td>{element.mass}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {!loading && data.length === 0 && (
            <Center
              m="lg"
              p="lg"
              style={{ height: '200px', flexDirection: 'column' }}>
              <BoxIcon size={64} strokeWidth={1} color="#eee" />
              <Text size="md" color="#bbb">
                暂无数据
              </Text>
            </Center>
          )}
          <LoadingOverlay visible={loading} />
          <Stack align="flex-end" m="xl">
            {!!total && (
              <Center>
                <Select
                  mx="md"
                  size="xs"
                  style={{ width: 100 }}
                  data={[
                    { value: '5', label: '5条/页' },
                    { value: '10', label: '10条/页' },
                    { value: '15', label: '15条/页' },
                    { value: '20', label: '20条/页' },
                  ]}
                  value={size + ''}
                  onChange={(v: string) => {
                    setSize(parseInt(v));
                  }}
                />
                <Pagination
                  total={total}
                  page={pagination.active}
                  onChange={(page) => {
                    pagination.setPage(page);
                  }}
                />
              </Center>
            )}
          </Stack>
        </Box>
      </Box>
    </>
  );
}
