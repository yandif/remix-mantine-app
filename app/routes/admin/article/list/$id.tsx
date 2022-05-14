import type { Article } from '@prisma/client';
import type { ActionFunction, LinksFunction, LoaderFunction } from 'remix';
import { json, redirect } from 'remix';

import ErrorMessage from '~/components/ErrorMessage';
import { db } from '~/server/database/db.server';
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/server/message/message.server';
import { checkAuth } from '~/server/middleware/auth.server';
import stylesHref from '~/styles/editor.css';

import CreateArticle from '../create';

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

export default CreateArticle;

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
