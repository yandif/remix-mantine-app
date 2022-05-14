import {
  Box,
  Button,
  Divider,
  Grid,
  Group,
  InputWrapper,
  MultiSelect,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Article, Tag } from '@prisma/client';
import dayjs from 'dayjs';
import { forwardRef, useEffect, useState } from 'react';
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
import useAdminStore from '~/stores/admin';
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
    include: {
      tag: true,
    },
  });

  if (!article || article.accountId !== user.id)
    throw new Error(`Id 为 ${params.id} 的文章不存在`);

  const data: LoaderData = { article };
  return json(data);
};

export default function EditArticle() {
  const { setHeaderTitle } = useAdminStore();
  useEffect(() => {
    setHeaderTitle('文章详情');
  }, []);
  const data = useLoaderData<LoaderData>();
  const { article } = data;
  const fetcher = useFetcher();

  const form = useForm({
    initialValues: {
      title: article.title,
      content: article.content,
      tag: (article as any)?.tag.map((v: Tag) => `${v.id}`),
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
        form.values.tag.map((v: string) => {
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
      <Box mx="xl" my="md" style={{ position: 'relative', minHeight: 500 }}>
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
              if (
                form.values.title === article.title &&
                form.values.content === article.content &&
                form.values.tag.toString() ===
                  (article as any)?.tag.map((v: Tag) => `${v.id}`).toString()
              ) {
                return;
              }

              if (!res.hasErrors) {
                const { title, tag, content } = form.values;
                await fetcher.submit(
                  { id: `${article.id}`, title, content, tag: tag.toString() },
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
    </>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const user = await checkAuth(request);
  const session = await getSession(request.headers.get('cookie'));
  const formData = await request.formData();
  const id = Number(formData.get('id'));
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const tag = (formData.get('tag') as string)?.split(',')?.filter((v) => !!v);

  const e = async (message: string) => {
    setErrorMessage(session, message);
    return json(
      { ok: false },
      { headers: { 'Set-Cookie': await commitSession(session) } },
    );
  };

  try {
    const findArticle = await db.article.findUnique({
      where: { id },
      include: { tag: true },
    });
    if (!findArticle || findArticle.accountId !== user.id) {
      return await e('文章不存在');
    }

    if (title && content) {
      console.log(tag);
      const article = await db.article.update({
        where: { id },
        data: {
          title,
          content,
          tag: {
            disconnect: findArticle.tag.map((v) => ({ id: v.id })),
            connect: tag.map((v) => ({ id: Number(v) })),
          },
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
