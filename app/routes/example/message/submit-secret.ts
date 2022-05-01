import type { ActionFunction } from 'remix';
import { json } from 'remix';

import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/services/message/message.server';

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('cookie'));
  const formData = await request.formData();

  const number = formData.get('number');

  if (!number) {
    setErrorMessage(session, 'Number is required!');
    return json(
      { ok: false, name: '123123' },
      {
        headers: { 'Set-Cookie': await commitSession(session) },
      },
    );
  }

  if (Number(number) === 10) {
    setSuccessMessage(session, 'Awesome');
    return json(
      { ok: true, name: '123123' },
      {
        headers: { 'Set-Cookie': await commitSession(session) },
      },
    );
  } else {
    setErrorMessage(session, 'Wrong! Guess again');
    return json(
      { ok: false, name: '123123' },
      {
        headers: { 'Set-Cookie': await commitSession(session) },
      },
    );
  }
};
