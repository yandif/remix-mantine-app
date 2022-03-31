import type { LinksFunction, MetaFunction } from 'remix';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from 'remix';

import stylesHref from '~/styles/index.css';

export const meta: MetaFunction = () => {
  return { title: 'remix 应用' };
};

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: stylesHref },
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content="Put your description here." />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
