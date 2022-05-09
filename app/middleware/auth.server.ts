import { redirect } from 'remix';

import { authenticator } from '~/services/auth/auth.server';
import {
  commitSession,
  getSession,
  setErrorMessage,
} from '~/services/message/message.server';

export const checkAuth = async (request: Request) => {
  const session = await getSession(request.headers.get('cookie'));

  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    setErrorMessage(session, '请重新登录!');

    throw redirect('/login', {
      headers: { 'Set-Cookie': await commitSession(session) },
    });
  }
  return user;
};
