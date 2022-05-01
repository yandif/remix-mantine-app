import {
  Box,
  Button,
  Divider,
  Group,
  Pagination,
  Table,
  Title,
} from '@mantine/core';

const elements = [
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
];

export default function ArticleList() {
  return (
    <>
      <Box
        sx={(theme) => {
          const isDark = theme.colorScheme === 'dark';

          return {
            margin: '16px',
            padding: theme.spacing.md,
            backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
          };
        }}>
        <Group position="apart">
          <Title order={5}>文章列表</Title>
          <Button size="sm">新建文章</Button>
        </Group>
        <Divider my="sm" />
        <Table highlightOnHover horizontalSpacing="xl" verticalSpacing="sm">
          <thead>
            <tr>
              <th>Element position</th>
              <th>Element name</th>
              <th>Symbol</th>
              <th>Atomic mass</th>
            </tr>
          </thead>
          <tbody>
            {elements.map((element) => (
              <tr key={element.name}>
                <td>{element.position}</td>
                <td>{element.name}</td>
                <td>{element.symbol}</td>
                <td>{element.mass}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination total={20} />
      </Box>
    </>
  );
}
