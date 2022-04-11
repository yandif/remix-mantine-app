import { FC } from 'react';
import { LinksFunction } from 'remix';

import EngineDemo from '~/components/Editor';
import stylesHref from '~/styles/editor.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: stylesHref },
  ];
};

const Admin: FC = () => {

  return <EngineDemo />;
};

export default Admin;
