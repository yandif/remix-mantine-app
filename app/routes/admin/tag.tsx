import {
  Button,
  createStyles,
  Divider,
  Group,
  Modal,
  Paper,
  Stack,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Tag } from '@prisma/client';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { ActionFunction, LoaderFunction } from 'remix';
import { json, useFetcher, useLoaderData } from 'remix';

import ErrorMessage from '~/components/ErrorMessage';
import Table from '~/components/Table';
import { db } from '~/server/database/db.server';
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/server/message/message.server';
import { checkAuth } from '~/server/middleware/auth.server';
import useAdminStore from '~/stores/admin';

interface CountTag extends Tag {
  _count: {
    article: number;
  };
}

type LoaderData = {
  ok: boolean;
  data: CountTag[];
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

  const whereOption = {
    where: {
      author: { id: user.id },
    },
  };

  const total = await await db.tag.count(whereOption);

  if (page > Math.ceil(total / size) && total !== 0)
    throw new Error('page 太大了！');

  const findTag = await db.tag.findMany({
    ...whereOption,
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      accountId: true,
      _count: {
        select: { article: true },
      },
    },
    skip: (page - 1) * size,
    take: size,
    orderBy: [
      {
        createdAt: 'desc',
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

const TagModal: FC<{ data?: any }> = ({ data }) => {
  const [opened, setOpened] = useState(false);
  const initialValues = { name: '', description: '' };
  const form = useForm({
    initialValues,

    validate: {
      name: (value) => (value?.length === 0 ? '请输入名称' : null),
    },
  });

  useEffect(() => {
    if (data) {
      form.setValues(data);
    }
  }, [data]);

  const handleOpen = () => {
    setOpened(true);
  };

  const handleClose = () => {
    form.setValues(initialValues);
    setOpened(false);
  };

  const fetcher = useFetcher();
  const handleSave = async () => {
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
      {data ? (
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
      ) : (
        <Button m={0} size="sm" onClick={() => setOpened(true)}>
          新建标签
        </Button>
      )}
      <Modal
        opened={opened}
        onClose={handleClose}
        title={data ? '编辑标签' : '新建标签'}>
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
            <Button onClick={handleSave}>{data ? '保存' : '提交'}</Button>
          </Stack>
        </fetcher.Form>
      </Modal>
    </>
  );
};

const useStyles = createStyles((theme) => {
  const isDark = theme.colorScheme === 'dark';

  return {
    main: {
      padding: '16px',

      backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
    },
  };
});

export default function TagList() {
  const { setHeaderTitle } = useAdminStore();
  useEffect(() => {
    setHeaderTitle('标签列表');
  }, []);
  const { classes } = useStyles();
  const fetcher = useFetcher();
  const data = useLoaderData<LoaderData>();

  const renderAction = useCallback((data: CountTag) => {
    return (
      <>
        <TagModal data={data} />
        <UnstyledButton
          onClick={async () => {
            await fetcher.submit({ id: `${data.id}` }, { method: 'delete' });
          }}
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
      width: 30,
    },
    {
      name: 'name',
      header: '名称',
      width: 200,
    },
    {
      name: 'description',
      header: '描述',
      width: 200,
    },
    {
      name: 'article',
      header: '文章',
      width: 120,
      render: (data: CountTag) => data._count.article,
    },
    {
      name: 'action',
      header: '操作',
      width: 120,
      render: renderAction,
    },
  ];

  return (
    <Paper className={classes.main}>
      <Group position="apart">
        <Title order={5} style={{ lineHeight: '36px' }}></Title>
        <TagModal />
      </Group>
      <Divider mt="md" mb="lg" />
      <Table data={data.data} columns={columns} pagination={data} />
    </Paper>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const method = request.method;
  const user = await checkAuth(request);
  const session = await getSession(request.headers.get('cookie'));

  const formData = await request.formData();
  const id = Number(formData.get('id'));
  const name = formData.get('name') as string;
  const description = (formData.get('description') as string) || '';

  const message = {
    error: async (message: string) => {
      setErrorMessage(session, message);
      return json(
        { ok: false },
        {
          headers: { 'Set-Cookie': await commitSession(session) },
        },
      );
    },
    success: async (message: string, data: any = {}) => {
      setSuccessMessage(session, message);
      return json(
        { ok: true, data },
        {
          headers: { 'Set-Cookie': await commitSession(session) },
        },
      );
    },
  };

  const createTag = async () => {
    if (name) {
      const tag = await db.tag.create({
        data: {
          name,
          description,
          author: { connect: { id: user.id } },
        },
      });
      return await message.success('新建成功!', tag);
    } else {
      return await message.error('请确保标签的名称有值!');
    }
  };

  const updateTag = async () => {
    const tag = await db.tag.findUnique({ where: { id: id } });
    if (!tag || tag.accountId !== user.id) {
      return await message.error('保存失败，标签不存在!');
    } else {
      await db.tag.update({
        where: { id: id },
        data: {
          name,
          description,
        },
      });
      return await message.success('保存成功');
    }
  };

  const deleteTag = async () => {
    const tag = await db.tag.findUnique({ where: { id: id } });

    if (!tag || tag.accountId !== user.id) {
      return await message.error('删除失败，标签不存在!');
    } else {
      await db.tag.delete({ where: { id: id } });
      return await message.success('删除成功');
    }
  };

  if (method === 'DELETE') {
    return await deleteTag();
  }

  if (method === 'POST' && !id) {
    return await createTag();
  }

  if (method === 'POST' && id) {
    return await updateTag();
  }
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  return <ErrorMessage label="Error" title={error.message} />;
};
