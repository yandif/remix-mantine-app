import { Box, Button, Center, Group, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useRef } from 'react';
import { ActionFunction, Form, json, Link, LoaderFunction, useActionData } from 'remix';

import { authenticator } from '~/services/auth/auth.server';
import { useThemeStore } from '~/stores';

export default function Login() {
  const actionData = useActionData();
  const { colorScheme, setColorScheme } = useThemeStore();
  type FormData = { username?: string; password?: string };
  const ref = useRef<HTMLFormElement>(null);

  const form = useForm<FormData>({
    initialValues: actionData?.data || { username: '', password: '' },
    validate: {
      username: (value?: string) => {
        if (!value) return '请输入邮箱';
        if (!/^\S+@\S+$/.test(value)) return '无效邮箱';
        if (value === actionData?.errorData?.username) return '邮箱不存在';
      },
      password: (value?: string) => {
        if (!value) return '请输入密码';
        if (value.length < 6) return '密码不能少于6位';
        if (value === actionData?.errorData?.password) return '密码错误';
      }
    },
  });

  useEffect(() => {
    if (actionData?.failed) {
      setColorScheme(actionData.themeColor);
      form?.validate();
    }
  }, []);

  const handleSubmit = () => {
    if (!ref.current) return;
    const res = form.validate();

    if (!res?.hasErrors) {
      ref.current.submit();
    }
  };

  return (
    <Box sx={{ maxWidth: 340 }} mx="auto" mt={100}>
      <Center>
        <h1>登录</h1>
      </Center>

      <Form ref={ref} method='post'>
        <TextInput name="themeColor" onChange={() => { }} value={colorScheme} style={{ display: 'none' }} />
        <TextInput mt="md" label="邮箱" name="username" {...form.getInputProps('username')} />
        <PasswordInput mt="md" label="密码" name="password" {...form.getInputProps('password')} />
        <Group position="apart" mt="md">
          <Link style={{ textDecoration: 'none', color: '#777' }} to="/signup">
            还没有账号？去注册
          </Link>

          <Button onClick={handleSubmit}>确定</Button>
        </Group>
      </Form>

    </Box >
  );

}

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.authenticate('user-pass', request, {
    successRedirect: '/admin/dashboard',
  });
  return json(user);
};

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/admin/dashboard',
  });
};
