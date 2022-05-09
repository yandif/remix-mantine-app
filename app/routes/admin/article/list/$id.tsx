import {
  Box,
  Button,
  Divider,
  Group,
  InputWrapper,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Article } from '@prisma/client';
import dayjs from 'dayjs';
import { identity } from 'lodash';
import type { FC } from 'react';
import type { ActionFunction, LinksFunction, LoaderFunction } from 'remix';
import { json, redirect, useFetcher, useLoaderData } from 'remix';

import EngineDemo from '~/components/Editor';
import ErrorMessage from '~/components/ErrorMessage';
import { checkAuth } from '~/middleware/index.server';
import { db } from '~/services/database/db.server';
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/services/message/message.server';
import stylesHref from '~/styles/editor.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesHref }];
};

type LoaderData = { article: Article };

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await checkAuth(request);
  const id = parseInt(params.id as string);

  if (isNaN(id)) throw new Error(`Id 为 ${params.id} 的文章不存在`);

  const article = await db.article.findUnique({
    where: { id },
  });

  if (!article || article.accountId !== user.id)
    throw new Error(`Id 为 ${params.id} 的文章不存在`);

  const data: LoaderData = { article };
  return json(data);
};

export default function EditArticle() {
  const data = useLoaderData<LoaderData>();
  const { article } = data;
  const fetcher = useFetcher();

  const form = useForm({
    initialValues: {
      title: article.title,
      content: article.content,
    },

    validate: {
      title: (value) => (value?.length === 0 ? '请输入文章标题' : null),
      content: (value) =>
        value?.length === 0 || value === '<p></p>' ? '请输入文章内容' : null,
    },
  });

  return (
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
        <Title order={5} style={{ height: 36, lineHeight: '36px' }}>
          编辑文章 ({dayjs(article.updatedAt).format('YYYY-MM-DD HH:mm:ss')})
        </Title>
      </Group>
      <Divider mt="md" mb="lg" />
      <Box mx="xl" my="md" style={{ position: 'relative', minHeight: 500 }}>
        <fetcher.Form>
          <TextInput
            mb="md"
            required
            label="标题"
            placeholder="文章标题"
            style={{ maxWidth: 400 }}
            {...form.getInputProps('title')}
          />

          <InputWrapper
            mb="md"
            required
            label="内容"
            style={{ maxWidth: 800 }}
            {...form.getInputProps('content')}>
            <EngineDemo
              placeholder="文章内容"
              {...form.getInputProps('content')}
            />
          </InputWrapper>

          <Button
            onClick={async () => {
              const res = form.validate();
              if (
                form.values.title === article.title &&
                form.values.content === article.content
              ) {
                return;
              }

              if (!res.hasErrors) {
                await fetcher.submit(
                  { id: `${article.id}`, ...form.values },
                  {
                    method: 'post',
                  },
                );
              }
            }}>
            保存
          </Button>
        </fetcher.Form>
      </Box>
    </Box>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const user = await checkAuth(request);
  const session = await getSession(request.headers.get('cookie'));
  const formData = await request.formData();
  const id = Number(formData.get('id'));
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  const e = async (message: string) => {
    setErrorMessage(session, message);
    return json(
      { ok: false },
      { headers: { 'Set-Cookie': await commitSession(session) } },
    );
  };

  try {
    const findArticle = await db.article.findUnique({ where: { id } });
    if (!findArticle || findArticle.accountId !== user.id) {
      return await e('文章不存在');
    }

    if (title && content) {
      const article = await db.article.update({
        where: { id },
        data: {
          title,
          content,
        },
      });
      setSuccessMessage(session, '修改成功!');
      return redirect(`/admin/article/list/${article.id}`, {
        headers: { 'Set-Cookie': await commitSession(session) },
      });
    } else {
      return await e('请确保文章有标题和内容有值');
    }
  } catch {
    return await e('修改失败');
  }
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  return (
    <ErrorMessage
      label="404"
      title={error.message}
      description="你所访问的文章不存在或已被删除！"
    />
  );
};
