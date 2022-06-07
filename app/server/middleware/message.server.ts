import { json, redirect } from 'remix';

import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/server/message/message.server';

type MessageOptions = { redirect?: string; data?: any };
export class Message {
  request: Request;
  constructor(request: Request) {
    this.request = request;
  }
  async success(message = '成功', options: MessageOptions = {}) {
    const session = await getSession(this.request.headers.get('cookie'));

    if (options.redirect) {
      setSuccessMessage(session, message);
      throw redirect(options.redirect, {
        headers: { 'Set-Cookie': await commitSession(session) },
      });
    }

    setSuccessMessage(session, message);
    throw json(
      { ok: true, data: options.data },
      {
        headers: { 'Set-Cookie': await commitSession(session) },
      },
    );
  }

  async error(message = '失败', options: MessageOptions = {}) {
    const session = await getSession(this.request.headers.get('cookie'));

    if (options.redirect) {
      setErrorMessage(session, message);
      throw redirect(options.redirect, {
        headers: { 'Set-Cookie': await commitSession(session) },
      });
    }

    setErrorMessage(session, message);
    throw json(
      { ok: false, data: options.data },
      {
        headers: { 'Set-Cookie': await commitSession(session) },
      },
    );
  }
}
