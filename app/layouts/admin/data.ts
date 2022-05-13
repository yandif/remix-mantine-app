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
