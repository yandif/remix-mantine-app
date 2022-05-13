import {
  Box,
  Button,
  Center,
  Divider,
  Group,
  Pagination,
  Select,
  Stack,
  Table,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import type { Article } from '@prisma/client';
import { useCallback, useState } from 'react';
import type { ActionFunction, LoaderFunction } from 'remix';
import { json, useFetcher, useLoaderData, useNavigate } from 'remix';
import { Box as BoxIcon } from 'tabler-icons-react';

import ErrorMessage from '~/components/ErrorMessage';
import { checkAuth } from '~/middleware/auth.server';
import { db } from '~/services/database/db.server';
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/services/message/message.server';

type LoaderData = {
  ok: boolean;
  data: Article[];
  page: number;
  size: number;
  total: number;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await checkAuth(request);
  const search = new URL(request.url).searchParams;
  const size = Number(search.get('size') || '10');
  const page = Number(search.get('page') || '1');

  if (isNaN(size)) throw new Error('page 不是数字！');
  if (isNaN(page)) throw new Error('page 不是数字！');
  if (!(size > 0)) throw new Error('size 应该大于零！');
  if (!(page > 0)) throw new Error('page 应该大于零！');

  const selectOption = {
    where: { author: { id: user.id } },
    // where: {
    //   email: { contains: email },
    //   username: { contains: username },
    //   mobile: { contains: mobile },
    //   status,
    //   platform,
    // },
    // select: {
    //   id: true,
    //   username: true,
    //   email: true,
    //   mobile: true,
    //   status: true,
    //   platform: true,
    //   createdAt: true,
    //   updatedAt: true,
    // },
  };

  const total = await (await db.article.findMany(selectOption)).length;

  if (page > Math.ceil(total / size) && total !== 0)
    throw new Error('page 太大了！');

  const findArticle = await db.article.findMany({
    ...selectOption,
    skip: (page - 1) * size,
    take: size,
    orderBy: [
      {
        updatedAt: 'desc',
      },
    ],
  });

  const data: LoaderData = {
    ok: true,
    data: findArticle,
    page: page,
    size: size,
    total,
  };

  return json(data);
};

export default function ArticleList() {
  const data = useLoaderData<LoaderData>();

  const nav = useNavigate();

  const [size, setSize] = useState(data.size);

  const sizeArr = [
    { value: '5', label: '5条/页' },
    { value: '10', label: '10条/页' },
    { value: '15', label: '15条/页' },
    { value: '20', label: '20条/页' },
  ];

  if (![5, 10, 15, 20].includes(size)) {
    sizeArr.unshift({ value: `${size}`, label: `${size}条/页` });
  }

  const fetcher = useFetcher();
  const handleDelete = async (id: string) => {
    await fetcher.submit(
      { id },
      {
        method: 'delete',
      },
    );
  };

  const renderAction = useCallback((data: Article) => {
    return (
      <>
        <UnstyledButton
          onClick={() => nav(`${data.id}`)}
          sx={(theme) => {
            return {
              whiteSpace: 'nowrap',
              fontSize: 14,
              padding: 4,
              margin: 4,
              display: 'block',
              color: theme.colors.blue[6],
            };
          }}>
          查看详情
        </UnstyledButton>
        <UnstyledButton
          onClick={() => handleDelete(`${data.id}`)}
          sx={(theme) => {
            return {
              whiteSpace: 'nowrap',
              fontSize: 14,
              padding: 4,
              margin: 4,
              display: 'block',
              color: theme.colors.red[6],
            };
          }}>
          删除
        </UnstyledButton>
      </>
    );
  }, []);

  const columns = [
    {
      name: 'id',
      header: 'ID',
      width: '15%',
    },
    {
      name: 'title',
      header: '标题',
      width: '70%',
    },
    {
      name: 'action',
      header: '操作',
      width: '15%',
      render: renderAction,
    },
  ];

  return (
    <>
      <Box
        sx={(theme) => {
          const isDark = theme.colorScheme === 'dark';

          return {
            padding: theme.spacing.md,
            backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
          };
        }}>
        <Group position="apart">
          <Title order={5} style={{ lineHeight: '36px' }}>
            文章列表
          </Title>

          <Button m={0} size="sm" onClick={() => nav('/admin/article/create')}>
            新建文章
          </Button>
        </Group>
        <Divider mt="md" mb="lg" />
        <Box style={{ position: 'relative', minHeight: 500 }}>
          <Table
            highlightOnHover
            horizontalSpacing="xl"
            verticalSpacing="sm"
            sx={() => {
              return {
                'tbody::-webkit-scrollbar': {
                  display: 'none',
                },
                tbody: {
                  scrollbarWidth: 'none',
                },
              };
            }}>
            <thead style={{ display: 'table', width: '100%' }}>
              <tr>
                {columns?.map((v) => (
                  <th key={v.name} style={{ width: v.width }}>
                    {v.header}
                  </th>
                ))}
              </tr>
            </thead>
            {data.data.length > 0 && (
              <tbody
                style={{
                  width: '100%',
                  height: 'calc(100vh - 320px)',
                  overflow: 'auto',
                  display: 'block',
                }}>
                {data.data?.map((article) => (
                  <tr
                    key={article.id}
                    style={{ display: 'table', width: '100%' }}>
                    {columns?.map((v) => (
                      <td key={v.name} style={{ width: v.width }}>
                        {v.render
                          ? v.render(article)
                          : article[v.name as keyof Article]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            )}
          </Table>
          {data.data.length === 0 && (
            <Center
              style={{
                height: 'calc(100vh - 320px)',
                flexDirection: 'column',
              }}>
              <BoxIcon size={81} strokeWidth={1} color="#eee" />
              <Text size="md" color="#bbb">
                暂无数据
              </Text>
            </Center>
          )}
          <Stack align="flex-end" m="xl">
            {!!data.total && (
              <Center>
                <Pagination
                  total={Math.ceil(data.total / data.size)}
                  page={data.page}
                  onChange={(page) => {
                    nav(`?size=${size}&page=${page}`);
                  }}
                />
                <Select
                  mx="md"
                  size="xs"
                  style={{ width: 100 }}
                  data={sizeArr}
                  value={`${size}`}
                  onChange={(v: string) => {
                    setSize(parseInt(v));
                    nav(`?size=${v}&page=1`);
                  }}
                  transition="pop-top-left"
                  transitionDuration={80}
                  transitionTimingFunction="ease"
                />
              </Center>
            )}
          </Stack>
        </Box>
      </Box>
    </>
  );
}

export const action: ActionFunction = async ({ request }) => {
  // console.log(request.method);

  const user = await checkAuth(request);
  const session = await getSession(request.headers.get('cookie'));

  const formData = await request.formData();
  const id = Number(formData.get('id') as string);

  const article = await db.article.findUnique({ where: { id: id } });

  if (!article || article.accountId !== user.id) {
    setErrorMessage(session, '删除失败，文章不存在!');
    return json(
      { ok: false },
      {
        headers: { 'Set-Cookie': await commitSession(session) },
      },
    );
  } else {
    await db.article.delete({ where: { id: id } });
    setSuccessMessage(session, '删除成功');
    return json(
      { ok: true },
      {
        headers: { 'Set-Cookie': await commitSession(session) },
      },
    );
  }
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  return <ErrorMessage label="Error" title={error.message} />;
};
