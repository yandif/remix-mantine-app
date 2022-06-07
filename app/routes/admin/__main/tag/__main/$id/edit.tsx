import { Button, Modal, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import type { ActionFunction, LoaderFunction } from 'remix';
import { json, redirect, useFetcher, useLoaderData, useNavigate } from 'remix';

import { Message } from '~/server/middleware/message.server';
import { GetTagById } from '~/server/models/tag.server';

import { tagRoute } from '../add';

export const loader: LoaderFunction = async ({ params, request }) => {
  const message = new Message(request);
  const id = Number(params.id);

  if (!id || isNaN(id)) {
    await message.error('标签不存在!', { redirect: tagRoute });
  }

  const tag = await GetTagById(id);

  if (!tag) {
    await message.error('标签不存在!', { redirect: tagRoute });
  }

  return json(tag);
};

export const action: ActionFunction = async ({ request }) => {
  return redirect(tagRoute);
};

export default function Edit() {
  const nav = useNavigate();
  const data = useLoaderData();

  const fetcher = useFetcher();

  const form = useForm({
    initialValues: data,

    validate: {
      name: (value) => (value?.length === 0 ? '请输入名称' : null),
    },
  });

  return (
    <Modal opened title="新建标签" onClose={() => nav(tagRoute)}>
      <fetcher.Form>
        <TextInput
          mb="md"
          required
          label="名称"
          placeholder="标签名称"
          style={{ maxWidth: 400 }}
          {...form.getInputProps('name')}
        />
        <TextInput
          mb="md"
          label="描述"
          placeholder="标签描述"
          style={{ maxWidth: 400 }}
          {...form.getInputProps('description')}
        />

        <Stack align="flex-end">
          <Button onClick={() => {}}> 提交</Button>
        </Stack>
      </fetcher.Form>
    </Modal>
  );
}
