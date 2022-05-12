import {
  Box,
  Button,
  Center,
  Divider,
  Group,
  Modal,
  Pagination,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Tag } from '@prisma/client';
import { useState } from 'react';
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
  data: Tag[];
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

  const total = await (await db.tag.findMany(selectOption)).length;

  if (page > Math.ceil(total / size) && total !== 0)
    throw new Error('page 太大了！');

  const findTag = await db.tag.findMany({
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
    data: findTag,
    page: page,
    size: size,
    total,
  };

  return json(data);
};

function DetailModal({ itemId }: { itemId: string }) {
  const fetcher = useFetcher();
  const [opened, setOpened] = useState(false);
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },

    validate: {
      name: (value) => (value?.length === 0 ? '请输入标签名称' : null),
    },
  });
  const handleOpen = async () => {
    await fetcher.submit(
      { id: itemId },
      {
        method: 'get',
      },
    );
    console.log(await fetcher.data);
    setOpened(true);
  };

  const handleClose = () => {
    form.setValues({ name: '', description: '' });
    setOpened(false);
  };

  const handleCreate = async () => {
    const res = form.validate();
    if (!res.hasErrors) {
      await fetcher.submit(form.values, {
        method: 'post',
      });
      handleClose();
    }
  };

  return (
    <>
      <UnstyledButton
        onClick={handleOpen}
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
      <Modal opened={opened} onClose={handleClose} title="新建标签">
        <fetcher.Form>
          <TextInput
            mb="md"
            required
            label="名称"
            placeholder="标签名称"
            style={{ maxWidth: 400 }}
            {...form.getInputProps('name')}
          />
          <TextInput
            mb="md"
            label="描述"
            placeholder="标签描述"
            style={{ maxWidth: 400 }}
            {...form.getInputProps('description')}
          />
          <Stack align="flex-end">
            <Button onClick={handleCreate}>提交</Button>
          </Stack>
        </fetcher.Form>
      </Modal>
    </>
  );
}

function CreateModal() {
  const fetcher = useFetcher();
  const [opened, setOpened] = useState(false);
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },

    validate: {
      name: (value) => (value?.length === 0 ? '请输入标签名称' : null),
    },
  });

  const handleClose = () => {
    form.setValues({ name: '', description: '' });
    setOpened(false);
  };

  const handleCreate = async () => {
    const res = form.validate();
    if (!res.hasErrors) {
      await fetcher.submit(form.values, {
        method: 'post',
      });
      handleClose();
    }
  };

  return (
    <>
      <Button m={0} size="sm" onClick={() => setOpened(true)}>
        新建标签
      </Button>
      <Modal opened={opened} onClose={handleClose} title="新建标签">
        <fetcher.Form>
          <TextInput
            mb="md"
            required
            label="名称"
            placeholder="标签名称"
            style={{ maxWidth: 400 }}
            {...form.getInputProps('name')}
          />
          <TextInput
            mb="md"
            label="描述"
            placeholder="标签描述"
            style={{ maxWidth: 400 }}
            {...form.getInputProps('description')}
          />
          <Stack align="flex-end">
            <Button onClick={handleCreate}>提交</Button>
          </Stack>
        </fetcher.Form>
      </Modal>
    </>
  );
}

export default function TagList() {
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
          <Title order={5} style={{ lineHeight: '36px' }}>
            标签列表
          </Title>
          <CreateModal />
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
                <th style={{ width: 30 }}>ID</th>
                <th style={{ width: 200 }}>名称</th>
                <th>描述</th>
                <th style={{ width: 120 }}>操作</th>
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
                {data.data?.map((tag) => (
                  <tr key={tag.id} style={{ display: 'table', width: '100%' }}>
                    <td style={{ width: 30 }}>{tag.id}</td>
                    <td style={{ width: 200 }}>{tag.name}</td>
                    <td>{tag.description}</td>
                    <td style={{ width: 120 }}>
                      <DetailModal itemId={`${tag.id}`} />
                      <UnstyledButton
                        onClick={() => handleDelete(`${tag.id}`)}
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
                    </td>
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
                <Pagination
                  total={Math.ceil(data.total / data.size)}
                  page={data.page}
                  onChange={(page) => {
                    nav(`?size=${size}&page=${page}`);
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

export const action: ActionFunction = async ({ request }) => {
  const method = request.method;
  const user = await checkAuth(request);
  const session = await getSession(request.headers.get('cookie'));
  const formData = await request.formData();

  if (method === 'DELETE') {
    const id = Number(formData.get('id') as string);

    const tag = await db.tag.findUnique({ where: { id: id } });

    if (!tag || tag.accountId !== user.id) {
      setErrorMessage(session, '删除失败，标签不存在!');
      return json(
        { ok: false },
        {
          headers: { 'Set-Cookie': await commitSession(session) },
        },
      );
    } else {
      await db.tag.delete({ where: { id: id } });
      setSuccessMessage(session, '删除成功');
      return json(
        { ok: true },
        {
          headers: { 'Set-Cookie': await commitSession(session) },
        },
      );
    }
  } else if (method === 'POST') {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    if (name) {
      await db.tag.create({
        data: {
          name,
          description,
          author: { connect: { id: user.id } },
        },
      });

      setSuccessMessage(session, '新建成功!');
      return json(
        { ok: true },
        {
          headers: { 'Set-Cookie': await commitSession(session) },
        },
      );
    } else {
      setErrorMessage(session, '请确保标签的名称有值!');
      return json(
        { ok: false },
        {
          headers: { 'Set-Cookie': await commitSession(session) },
        },
      );
    }
  }
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  return <ErrorMessage label="Error" title={error.message} />;
};
