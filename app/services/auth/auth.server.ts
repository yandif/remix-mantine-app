import { Authenticator } from 'remix-auth';

import { sessionStorage } from '~/services/auth/session.server';
import { db } from '~/utils/db.server';
import { FormStrategy } from '~/utils/strategy.server';
import { auth } from '~/utils/tool';

export const authenticator = new Authenticator<any>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get('username') as string;
    const password = form.get('password') as string;
    const themeColor = form.get('themeColor');

    const createError = (errorData: any) => ({
      failed: true,
      data: { username, password },
      errorData,
      themeColor,
    });

    const findUser = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (!findUser) {
      // 用户名不存在
      return createError({ username });
    }

    if (!auth.checkPassword(password, findUser.passwordHash)) {
      // 密码错误
      return createError({ password });
    }

    return {
      failed: false,
      data: findUser,
      themeColor,
    };
  }),
  'user-pass',
);
