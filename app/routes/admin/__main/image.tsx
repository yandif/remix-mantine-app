import {
  Button,
  createStyles,
  Divider,
  Image,
  Modal,
  Paper,
  Stack,
  UnstyledButton,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useClipboard } from '@mantine/hooks';
import type { Image as ImageType } from '@prisma/client';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { ActionFunction, LoaderFunction } from 'remix';
import { json, useFetcher, useLoaderData } from 'remix';

import { db } from '~/server/database/db.server';
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/server/message/message.server';
import { checkAuth } from '~/server/middleware/auth.server';
import ErrorMessage from '~/web/components/ErrorMessage';
import Table from '~/web/components/Table';
import { dropzoneChildren } from '~/web/components/Upload/ImgUpload';
import { useTitle } from '~/web/hooks/useTitle';

interface CountImage extends ImageType {
  _count: {
    article: number;
  };
}

type LoaderData = {
  ok: boolean;
  data: CountImage[];
  page: number;
  size: number;
  total: number;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await checkAuth(request);

  const search = new URL(request.url).searchParams;
  const size = Number(search.get('size') || '10');
  const page = Number(search.get('page') || '1');

  if (isNaN(size)) throw new Error('page 不是数字！');
  if (isNaN(page)) throw new Error('page 不是数字！');
  if (!(size > 0)) throw new Error('size 应该大于零！');
  if (!(page > 0)) throw new Error('page 应该大于零！');

  const whereOption = {
    where: {
      author: { id: user.id },
    },
  };

  const total = await await db.image.count(whereOption);

  if (page > Math.ceil(total / size) && total !== 0)
    throw new Error('page 太大了！');

  const findImage = await db.image.findMany({
    ...whereOption,
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      accountId: true,
      _count: {
        select: { article: true },
      },
    },
    skip: (page - 1) * size,
    take: size,
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });

  const data: LoaderData = {
    ok: true,
    data: findImage,
    page: page,
    size: size,
    total,
  };

  return json(data);
};

const ImageModal: FC<{ data?: any }> = ({ data }) => {
  const { theme } = useStyles();
  const [opened, setOpened] = useState(false);
  const [cover, setCover] = useState<any>(data);

  const handleOpen = () => {
    setCover(data);
    setOpened(true);
  };

  const handleClose = () => {
    setOpened(false);
  };

  const imgFetcher = useFetcher();
  const handleUpload = (file: any) => {
    imgFetcher.submit(
      { img: file },
      {
        encType: 'multipart/form-data',
        action: '/api/upload',
        method: 'post',
      },
    );
  };
  useEffect(() => {
    if (imgFetcher.data?.data) {
      setCover(imgFetcher.data.data);
    }
  }, [imgFetcher.data]);
  const coverSrc = cover?.name ? `/img/${cover?.name}` : undefined;

  return (
    <>
      {data ? (
        <UnstyledButton
          onClick={handleOpen}
          sx={(theme) => {
            return {
              whiteSpace: 'nowrap',
              fontSize: 14,
              padding: 4,
              margin: 4,
              display: 'block',
              color: theme.colors.blue[6],
            };
          }}>
          查看详情
        </UnstyledButton>
      ) : (
        <Button m={0} size="sm" onClick={() => setOpened(true)}>
          新建图片
        </Button>
      )}
      <Modal
        opened={opened}
        onClose={handleClose}
        title={data ? '编辑图片' : '新建图片'}>
        <Dropzone
          p={2}
          loading={imgFetcher.state === 'loading'}
          multiple={false}
          onDrop={(files) => handleUpload(files[0])}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          onReject={() => {
            toast.error('图片不能大于5M');
          }}>
          {(status) => dropzoneChildren(status, theme, coverSrc)}
        </Dropzone>
      </Modal>
    </>
  );
};

const useStyles = createStyles((theme) => {
  const isDark = theme.colorScheme === 'dark';

  return {
    main: {
      padding: '16px',

      backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
    },
  };
});

export default function ImageList() {
  useTitle('图片列表');

  const fetcher = useFetcher();
  const { classes } = useStyles();
  const data = useLoaderData<LoaderData>();
  const clipboard = useClipboard({ timeout: 500 });

  const renderAction = useCallback((data: CountImage) => {
    return (
      <>
        {/* <ImageModal data={data} /> */}
        <UnstyledButton
          onClick={() => {
            clipboard.copy(`${window.location.origin}/img/${data.name}`);
            toast.success('复制成功');
          }}
          sx={(theme) => {
            return {
              whiteSpace: 'nowrap',
              fontSize: 14,
              padding: 4,
              margin: 4,
              display: 'block',
              color: theme.colors.blue[6],
            };
          }}>
          复制链接
        </UnstyledButton>
        <UnstyledButton
          onClick={async () => {
            await fetcher.submit({ id: `${data.id}` }, { method: 'delete' });
          }}
          sx={(theme) => {
            return {
              whiteSpace: 'nowrap',
              fontSize: 14,
              padding: 4,
              margin: 4,
              display: 'block',
              color: theme.colors.red[6],
            };
          }}>
          删除
        </UnstyledButton>
      </>
    );
  }, []);

  const columns = [
    {
      name: 'id',
      header: 'ID',
      width: 30,
    },
    {
      name: 'name',
      header: '图片',
      width: 200,
      render: (data: CountImage) => (
        <Image
          height={100}
          width="auto"
          radius="sm"
          src={`/img/${data.name}`}
          withPlaceholder
          placeholder={'图片不存在'}
          alt="背景图片"
        />
      ),
    },
    {
      name: 'article',
      header: '文章',
      width: 120,
      render: (data: CountImage) => data._count.article,
    },
    {
      name: 'action',
      header: '操作',
      width: 120,
      render: renderAction,
    },
  ];

  return (
    <Paper className={classes.main}>
      <Stack align="flex-end">
        <ImageModal />
      </Stack>
      <Divider mt="md" mb="lg" />
      <Table data={data.data} columns={columns} pagination={data} />
    </Paper>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const method = request.method;
  const user = await checkAuth(request);
  const session = await getSession(request.headers.get('cookie'));

  const formData = await request.formData();
  const id = Number(formData.get('id'));
  const name = formData.get('name') as string;

  const message = {
    error: async (message: string) => {
      setErrorMessage(session, message);
      return json(
        { ok: false },
        {
          headers: { 'Set-Cookie': await commitSession(session) },
        },
      );
    },
    success: async (message: string, data: any = {}) => {
      setSuccessMessage(session, message);
      return json(
        { ok: true, data },
        {
          headers: { 'Set-Cookie': await commitSession(session) },
        },
      );
    },
  };

  const createImage = async () => {
    if (name) {
      const image = await db.image.create({
        data: {
          name,
          author: { connect: { id: user.id } },
        },
      });
      return await message.success('新建成功!', image);
    } else {
      return await message.error('请确保图片的名称有值!');
    }
  };

  const deleteImage = async () => {
    const image = await db.image.findUnique({
      where: { id: id },
      include: { article: true },
    });

    if (!image || image.accountId !== user.id) {
      return await message.error('删除失败，图片不存在!');
    }
    if (image.article?.length > 0) {
      return await message.error('删除失败，图片有文章使用!');
    }
    await db.image.delete({ where: { id: id } });
    return await message.success('删除成功');
  };

  if (method === 'DELETE') {
    return await deleteImage();
  }

  if (method === 'POST' && !id) {
    return await createImage();
  }
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  return <ErrorMessage label="Error" title={error.message} />;
};
