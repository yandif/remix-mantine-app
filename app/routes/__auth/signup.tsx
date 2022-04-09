import { Box, Button, Center, Group, Paper, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useEffect, useRef } from 'react';
import { ActionFunction, Form, json, Link, LoaderFunction, useActionData, useNavigate } from 'remix';

import { authenticator } from '~/services/auth/auth.server';
import { useThemeStore } from '~/stores';
import { db } from '~/utils/db.server';
import { auth } from '~/utils/tool';

export default function Signup() {
  const actionData = useActionData();
  const { colorScheme, setColorScheme } = useThemeStore();
  type FormData = { username?: string; password?: string, rePassword?: string };
  const ref = useRef<HTMLFormElement>(null);
  const nav = useNavigate();
  const form = useForm<FormData>({
    initialValues: actionData?.data || { username: '', password: '', rePassword: '' },
    validate: {
      username: (value?: string) => {
        if (!value) return '请输入邮箱';
        if (!/^\S+@\S+$/.test(value)) return '无效邮箱';
        if (value === actionData?.errorData?.username) return '邮箱已存在';
      },
      password: (value?: string) => {
        if (!value) return '请输入密码';
        if (value.length < 6) return '密码不能少于6位';
      },
      rePassword: (value?: string) => {
        if (!value) return '请输入确认密码';
        if (value !== form.values.password) return '两次密码不一致';
      }
    },
  });

  useEffect(() => {
    if (actionData?.failed) {
      setColorScheme(actionData.themeColor);
      form?.validate();
    }
    if (actionData?.signupSuccess) {
      setTimeout(() => {
        showNotification({
          autoClose: 2000,
          title: '注册成功',
          message: '已注册成功，请进行登录',
          color: 'green'
        });
        nav('/login');
      }, 1);
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
    <Paper style={{ height: '100vh' }}>
      <Box sx={{ maxWidth: 340 }} mx="auto" pt={100}>
        <Center>
          <h1>注册</h1>

        </Center>

        <Form ref={ref} method='post'>
          <TextInput name="themeColor" onChange={() => { }} value={colorScheme} style={{ display: 'none' }} />
          <TextInput mt="md" label="邮箱" name="username" {...form.getInputProps('username')} />
          <PasswordInput mt="md" label="密码" name="password" {...form.getInputProps('password')} />
          <PasswordInput mt="md" label="确认密码" name="rePassword" {...form.getInputProps('rePassword')} />
          <Group position="apart" mt="md">

            <Link style={{ textDecoration: 'none', color: '#777' }} to="/login">
              已有账号？去登录
            </Link>

            <Button onClick={handleSubmit}>确定</Button>
          </Group>
        </Form>

      </Box >
    </Paper>
  );

}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const themeColor = form.get('themeColor');
  const username = form.get('username') as string;
  const password = form.get('password') as string;
  const data = {
    username,
    password,
    rePassword: password,
  };
  if (username) {
    const findUser = await db.account.findFirst({
      where: {
        username,
      }
    });

    if (findUser) {
      return json({
        failed: true,
        themeColor,
        data,
        errorData: { username }
      });
    }

    const md5pwd = auth.makePassword(password);

    await db.account.create({
      data: {
        username,
        passwordHash: md5pwd
      }
    });
    return json({
      signupSuccess: true,
      data,
    });
  }
  return json({});
};

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/admin/dashboard',
  });
};
