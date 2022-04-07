import { Authenticator } from 'remix-auth';

import { sessionStorage } from '~/services/auth/session.server';
import { FormStrategy } from '~/utils/strategy.server';

export const authenticator = new Authenticator<any>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get('username');
    const password = form.get('password');
    const termsOfService = form.get('termsOfService');
    const themeColor = form.get('themeColor');
    const user = { username, password, termsOfService };

    if (username !== '1322278095@qq.com') {
      return {
        failed: true,
        data: user,
        errorData: { username },
        themeColor,
      };
    }
    if (password !== '123456') {
      return {
        failed: true,
        data: user,
        errorData: { password },
        themeColor,
      };
    }

    return {
      failed: false,
      data: user,
      errorData: {},
    };
  }),
  'user-pass',
);
