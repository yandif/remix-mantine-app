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
import { useState } from 'react';
import type { ActionFunction, LinksFunction } from 'remix';
import { json, useFetcher } from 'remix';

import EngineDemo from '~/components/Editor';
import stylesHref from '~/styles/editor.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesHref }];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  console.log(formData);
  // redirect('');
  return json({ ok: true });
};

const CreateArticle: FC = () => {
  const [Value, setValue] = useState<string>();
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
        <Title order={5}>新建文章</Title>
      </Group>
      <Divider mt="md" mb="lg" />
      <Box style={{ position: 'relative', minHeight: 500 }}>
        <fetcher.Form>
          <TextInput
            mb="md"
            required
            label="标题"
            placeholder="文章标题"
            {...form.getInputProps('title')}
          />

          <InputWrapper
            mb="md"
            required
            label="内容"
            {...form.getInputProps('content')}>
            <EngineDemo {...form.getInputProps('content')} />
          </InputWrapper>

          <Button
            onClick={async () => {
              const res = form.validate();
              if (!res.hasErrors) {
                await fetcher.submit(form.values, {
                  method: 'post',
                });
                console.log(fetcher);
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
