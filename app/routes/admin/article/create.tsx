import {
  Box,
  Button,
  createStyles,
  Divider,
  Grid,
  Group,
  InputWrapper,
  MultiSelect,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Tag } from '@prisma/client';
import type { FC } from 'react';
import { forwardRef, useEffect, useState } from 'react';
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
import useAdminStore from '~/stores/admin';
import stylesHref from '~/styles/editor.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesHref }];
};

const useStyles = createStyles((theme) => {
  const isDark = theme.colorScheme === 'dark';

  return {
    main: {
      boxSizing: 'border-box',
      minHeight: 'calc(100vh - 60px)',
      padding: theme.spacing.md,
      backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
    },
  };
});

export default function CreateArticle() {
  const { classes } = useStyles();
  const { setHeaderTitle } = useAdminStore();
  useEffect(() => {
    setHeaderTitle('新建文章');
  }, []);
  const fetcher = useFetcher();

  const form = useForm({
    initialValues: {
      title: '',
      content: '',
      tag: [] as string[],
    },

    validate: {
      title: (value) => (value?.length === 0 ? '请输入文章标题' : null),
      content: (value) =>
        value?.length === 0 || value === '<p></p>' ? '请输入文章内容' : null,
    },
  });

  /** 选择标签👇 */
  const tagFetcher = useFetcher();
  const createTagFetcher = useFetcher();
  const [tags, setTags] = useState<any>([]);

  const queryTags = async () => {
    await tagFetcher.load('/admin/tag?size=1000&page=1');
  };

  useEffect(() => {
    queryTags();
  }, []);

  useEffect(() => {
    if (tagFetcher?.data) {
      const data = tagFetcher?.data?.data?.map((v: Tag) => {
        const { name, id, description } = v;
        return { label: name, value: `${id}`, description };
      });
      setTags(data);
    }
  }, [tagFetcher?.data]);

  useEffect(() => {
    if (createTagFetcher?.data?.data) {
      const { name, id, description } = createTagFetcher.data.data;

      setTags([{ label: name, value: `${id}`, description }, ...tags]);

      form.setFieldValue(
        'tag',
        form.values.tag.map((v) => {
          if (v === name) {
            return `${id}`;
          } else {
            return v;
          }
        }),
      );
    }
  }, [createTagFetcher.data]);

  interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    label: string;
  }

  const TagItem = forwardRef<HTMLDivElement, ItemProps>(
    // eslint-disable-next-line react/prop-types
    ({ label, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        {label}
      </div>
    ),
  );
  /** 选择标签👆 */

  return (
    <>
      <Box mx="xl" my="md" style={{ position: 'relative' }}>
        <fetcher.Form>
          <Grid gutter="xl">
            <Grid.Col span={6}>
              <TextInput
                mb="md"
                required
                label="标题"
                placeholder="文章标题"
                {...form.getInputProps('title')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <MultiSelect
                mb="md"
                label="标签"
                data={tags}
                placeholder="文章标签"
                searchable
                creatable
                maxSelectedValues={4}
                getCreateLabel={(query) => `+ 新建 ${query}`}
                onCreate={async (query) => {
                  await createTagFetcher.submit(
                    { name: query },
                    {
                      action: '/admin/tag',
                      method: 'post',
                    },
                  );
                }}
                itemComponent={TagItem}
                filter={(value, selected, item) => {
                  if (selected) return false;
                  const filterName = item?.label
                    ?.toLowerCase()
                    ?.includes(value?.toLowerCase()?.trim());
                  const filterDescription = item?.description
                    ?.toLowerCase()
                    ?.includes(value?.toLowerCase()?.trim());
                  return filterName || filterDescription;
                }}
                {...form.getInputProps('tag')}
              />
            </Grid.Col>
          </Grid>

          <InputWrapper
            mb="md"
            required
            label="内容"
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
                const { title, tag, content } = form.values;
                await fetcher.submit(
                  {
                    title,
                    content,
                    tag: tag.toString(),
                  },
                  {
                    method: 'post',
                  },
                );
              }
            }}>
            提交
          </Button>
        </fetcher.Form>
      </Box>
    </>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const user = await checkAuth(request);
  const session = await getSession(request.headers.get('cookie'));
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const tag = (formData.get('tag') as string)?.split(',')?.filter((v) => !!v);
  const content = formData.get('content') as string;

  if (title && content) {
    const article = await db.article.create({
      data: {
        title,
        content,
        tag: { connect: tag.map((v) => ({ id: Number(v) })) },
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
