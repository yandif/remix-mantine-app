import type { Account } from '@prisma/client';
import { useEffect } from 'react';
import type { LinksFunction, LoaderFunction } from 'remix';
import { json, useLoaderData } from 'remix';
import {
  Adjustments,
  Backpack,
  Folders,
  Gauge,
  Message2,
  MessageDots,
  Notes,
  Tags,
} from 'tabler-icons-react';

import AdminLayout from '~/layouts/admin';
import { authenticator } from '~/services/auth/auth.server';
import useAdminStore from '~/stores/admin';
import stylesHref from '~/styles/admin.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesHref }];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
  return json(user);
};

export const site = {
  title: '管理界面',
};

export const user = {
  name: 'Yandif',
};

export const mockdata = [
  { label: '看板', icon: Gauge, link: '/dashboard' },

  { label: '公告管理', icon: MessageDots, link: '/announcement' },
  { label: '分类管理', icon: Folders, link: '/category' },
  { label: '标签管理', icon: Tags, link: '/tag' },
  {
    label: '文章管理',
    icon: Notes,
    initiallyOpened: true,
    links: [
      { label: '文章列表', link: '/article/list' },
      { label: '写文章', link: '/article/create' },
    ],
  },
  { label: '评论管理', icon: Message2, link: '/comment' },
  { label: '反馈管理', icon: Backpack, link: '/feedback' },
  { label: '系统设置', icon: Adjustments, link: '/setting' },
];

export default function AdminLayoutWrapper() {
  const user = useLoaderData<Account>();
  const { setUser, setSizeName, setMenus, setHeaderTitle } = useAdminStore();
  useEffect(() => {
    setUser(user);
    setSizeName('管理界面');
    setMenus(mockdata);
    setHeaderTitle('');
  }, []);
  return <AdminLayout />;
}
