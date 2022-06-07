import {
  Button,
  createStyles,
  Divider,
  Modal,
  Paper,
  Stack,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { ActionFunction, LoaderFunction, MetaFunction } from 'remix';
import { Link } from 'remix';
import { Outlet } from 'remix';
import { json, useFetcher, useLoaderData } from 'remix';

import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/server/message/message.server';
import { checkAuth } from '~/server/middleware/auth.server';
import type { CountTag } from '~/server/models/tag.server';
import {
  CreateTag,
  DeleteTag,
  GetTagById,
  GetTagList,
  UpdateTag,
} from '~/server/models/tag.server';
import Table from '~/web/components/Table';
import { useTitle } from '~/web/hooks/useTitle';

export { CatchBoundary, ErrorBoundary } from '~/web/components/Remix';

const title = '标签管理';

export const meta: MetaFunction = () => {
  return {
    title,
    description: '新建、编辑、删除标签',
  };
};

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

  const { tagList, count } = await GetTagList({ size, page, userId: user.id });

  return json<LoaderData>({
    ok: true,
    data: tagList,
    page: page,
    size: size,
    total: count,
  });
};

// export const action: ActionFunction = async ({ request }) => {
//   const method = request.method;
//   const user = await checkAuth(request);
//   const session = await getSession(request.headers.get('cookie'));

//   const formData = await request.formData();
//   const id = Number(formData.get('id'));
//   const name = formData.get('name') as string;
//   const description = (formData.get('description') as string) || '';

//   const message = {
//     error: async (message: string) => {
//       setErrorMessage(session, message);
//       return json(
//         { ok: false },
//         {
//           headers: { 'Set-Cookie': await commitSession(session) },
//         },
//       );
//     },
//     success: async (message: string, data: any = {}) => {
//       setSuccessMessage(session, message);
//       return json(
//         { ok: true, data },
//         {
//           headers: { 'Set-Cookie': await commitSession(session) },
//         },
//       );
//     },
//   };

//   const createTag = async () => {
//     if (name) {
//       const tag = await CreateTag({ name, description, userId: user.id });
//       return await message.success('新建成功!', tag);
//     } else {
//       return await message.error('请确保标签的名称有值!');
//     }
//   };

//   const updateTag = async () => {
//     const tag = await GetTagById(id);
//     if (!tag || tag.accountId !== user.id) {
//       return await message.error('保存失败，标签不存在!');
//     } else {
//       await UpdateTag(id, { name, description });
//       return await message.success('保存成功');
//     }
//   };

//   const deleteTag = async () => {
//     const tag = await GetTagById(id);
//     if (!tag || tag.accountId !== user.id) {
//       return await message.error('删除失败，标签不存在!');
//     } else {
//       await DeleteTag(id);
//       return await message.success('删除成功');
//     }
//   };

//   if (method === 'DELETE') {
//     return await deleteTag();
//   }

//   if (method === 'POST' && !id) {
//     return await createTag();
//   }

//   if (method === 'POST' && id) {
//     return await updateTag();
//   }
// };

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
  useTitle(title);

  const fetcher = useFetcher();
  const { classes } = useStyles();
  const data = useLoaderData<LoaderData>();

  const renderAction = useCallback((data: CountTag) => {
    return (
      <>
        <UnstyledButton
          component={Link}
          to={`${data.id}/edit`}
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
      <Outlet />
      <Stack align="flex-end">
        <Button component={Link} to="add" m={0} size="sm">
          新建标签
        </Button>
      </Stack>
      <Divider mt="md" mb="lg" />
      <Table data={data.data} columns={columns} pagination={data} />
    </Paper>
  );
}

// const TagModal: FC<{ data?: any }> = ({ data }) => {
//   return (
//     <>
//       <Link to="add">Add</Link>
//       {data ? (
//         <UnstyledButton
//           onClick={handleOpen}
//           sx={(theme) => {
//             return {
//               whiteSpace: 'nowrap',
//               fontSize: 14,
//               padding: 4,
//               margin: 4,
//               display: 'block',
//               color: theme.colors.blue[6],
//             };
//           }}>
//           查看详情
//         </UnstyledButton>
//       ) : (
//         <Button m={0} size="sm" onClick={() => setOpened(true)}>
//           新建标签
//         </Button>
//       )}
//       <Modal
//         opened={opened}
//         onClose={handleClose}
//         title={data ? '编辑标签' : '新建标签'}>
//         <fetcher.Form>
//           <TextInput
//             mb="md"
//             required
//             label="名称"
//             placeholder="标签名称"
//             style={{ maxWidth: 400 }}
//             {...form.getInputProps('name')}
//           />
//           <TextInput
//             mb="md"
//             label="描述"
//             placeholder="标签描述"
//             style={{ maxWidth: 400 }}
//             {...form.getInputProps('description')}
//           />

//           <Stack align="flex-end">
//             <Button onClick={handleSave}>{data ? '保存' : '提交'}</Button>
//           </Stack>
//         </fetcher.Form>
//       </Modal>
//     </>
//   );
// };
