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
import type { FC } from 'react';
import type { ActionFunction, LinksFunction } from 'remix';
import { json, redirect, useFetcher } from 'remix';

import EngineDemo from '~/components/Editor';
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

const CreateArticle: FC = () => {
  const fetcher = useFetcher();

  const form = useForm({
    initialValues: {
      title: '',
      content: '',
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
        <Title order={5} style={{ lineHeight: '36px' }}>
          新建文章
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
              if (!res.hasErrors) {
                await fetcher.submit(form.values, {
                  method: 'post',
                });
              }
            }}>
            提交
          </Button>
        </fetcher.Form>
      </Box>
    </Box>
  );
};

export default CreateArticle;

export const action: ActionFunction = async ({ request }) => {
  const user = await checkAuth(request);
  const session = await getSession(request.headers.get('cookie'));
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (title && content) {
    const article = await db.article.create({
      data: {
        title,
        content,
        author: { connect: { id: user.id } },
      },
    });
    setSuccessMessage(session, '提交成功!');
    return redirect(`/admin/article/list/${article.id}`, {
      headers: { 'Set-Cookie': await commitSession(session) },
    });
  } else {
    setErrorMessage(session, '请确保文章有标题和内容有值!');
    return json(
      { ok: false },
      {
        headers: { 'Set-Cookie': await commitSession(session) },
      },
    );
  }
};
