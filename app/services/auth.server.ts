import { Authenticator } from 'remix-auth';

import { sessionStorage } from '~/services/session.server';
import { FormStrategy } from '~/utils/strategy.server';

export const authenticator = new Authenticator<any>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get('email');
    const password = form.get('password');
    const user = { email, password };
    if (email === '1322278095@qq.com' && password === '123456') {
      return user;
    } else {
      return null;
    }
  }),
  'user-pass',
);
