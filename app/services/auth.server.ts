import { Authenticator } from 'remix-auth';

import { sessionStorage } from '~/services/session.server';
import { FormStrategy } from '~/utils/strategy.server';

export const authenticator = new Authenticator<any>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get('username');
    const password = form.get('password');
    const termsOfService = form.get('termsOfService');
    const user = { username, password, termsOfService };

    if (username !== '1322278095@qq.com') {
      return {
        failed: true,
        data: user,
        errorData: { username },
      };
    }
    if (password !== '123456') {
      return {
        failed: true,
        data: user,
        errorData: { password },
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
