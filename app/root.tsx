import { Box, Title } from '@mantine/core';
import { useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import type { LinksFunction, LoaderFunction, MetaFunction } from 'remix';
import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from 'remix';

import type { ToastMessage } from '~/server/message/message.server';
import { commitSession, getSession } from '~/server/message/message.server';
import stylesHref from '~/styles/index.css';

import ErrorMessage from './components/ErrorMessage';
import MantineProvider from './components/MantineProvider';
import NotFoundTitle from './components/NotFound';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Yandif',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesHref }];
};

type LoaderData = {
  toastMessage: ToastMessage | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('cookie'));

  const toastMessage = session.get('toastMessage') as ToastMessage;

  if (!toastMessage) {
    return json<LoaderData>({ toastMessage: null });
  }

  if (!toastMessage.type) {
    throw new Error('消息应该有 type 属性');
  }

  return json<LoaderData>(
    { toastMessage },
    { headers: { 'Set-Cookie': await commitSession(session) } },
  );
};

export default function App() {
  const { toastMessage } = useLoaderData<LoaderData>();

  useEffect(() => {
    if (!toastMessage) return;

    const { message, type } = toastMessage;

    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      default:
        throw new Error(`${type} is not handled`);
    }
  }, [toastMessage]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <Toaster />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>{`${caught.status} ${caught.statusText}`}</title>
      </head>
      <body>
        <MantineProvider>
          <NotFoundTitle to="/"></NotFoundTitle>
        </MantineProvider>

        <Toaster />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>Error!</title>
      </head>
      <body>
        <MantineProvider>
          <Box>
            <Title order={1}>
              <ErrorMessage
                label="Error!"
                title="程序出现错误"
                description={error.message}></ErrorMessage>
            </Title>
          </Box>
        </MantineProvider>

        <Toaster />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
