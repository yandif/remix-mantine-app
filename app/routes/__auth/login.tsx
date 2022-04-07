import { Box, Button, Center, Checkbox, Group, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useRef } from 'react';
import { ActionFunction, Form, json, LoaderFunction, redirect, useActionData } from 'remix';

import { authenticator } from '~/services/auth.server';

export default function Screen() {
  const actionData = useActionData();

  type FormData = { email?: string; password?: string, termsOfService?: boolean };
  const ref = useRef<HTMLFormElement>(null);
  const form = useForm<FormData>({
    initialValues: {},
    validate: {
      email: (value?: string) => (/^\S+@\S+$/.test(value || '') ? null : '无效邮箱'),
      password: (value?: string) => (!value || (value && value.length < 6)) ? '密码不能少于6位' : null
    },
  });

  const handleSubmit = () => {
    if (!ref.current) return;
    const res = form.validate();
    if (!form.values.termsOfService) {
      return showNotification({
        autoClose: 2000,
        title: '警告',
        message: '请先阅读并同意隐私政策',
        color: 'red',
      });
    }
    if (!res?.hasErrors) {
      ref.current.submit();
    }
  };

  return (
    <Box sx={{ maxWidth: 340 }} mx="auto" mt={100}>
      {JSON.stringify(actionData)}
      <Center>
        <h2>登录</h2>
      </Center>
      <Form ref={ref} method='post'>
        <TextInput mt="md" label="邮箱" name="email" {...form.getInputProps('email')} />
        <PasswordInput mt="md" label="密码" name="password" {...form.getInputProps('password')} />

        <Group position="apart" mt="md">
          <Checkbox
            label="我已阅读并同意隐私政策"
            name="termsOfService"
            {...form.getInputProps('termsOfService', { type: 'checkbox' })}
          />

          <Button onClick={handleSubmit}>确定</Button>
        </Group>
      </Form>
    </Box >
  );

}

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.authenticate('user-pass', request, {
    successRedirect: '/admin/dashboard',
    throwOnError: true,
  });
  console.log(user);
  return json(user);
};

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/admin/dashboard',
  });
};
