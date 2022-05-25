import type { LinksFunction } from 'remix';

import MantineProvider from '~/components/MantineProvider';
import BlogLayout from '~/layouts/blog';
import stylesHref from '~/styles/admin.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesHref }];
};

export default function AdminLayoutWrapper() {
  return (
    <MantineProvider>
      <BlogLayout />
    </MantineProvider>
  );
}
