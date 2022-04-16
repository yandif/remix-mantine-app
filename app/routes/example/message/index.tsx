import type { ActionFunction } from 'remix';
import { useLoaderData } from 'remix';
import { Form, redirect, useFetcher } from 'remix';

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
    return redirect('/example/message', {
      headers: { 'Set-Cookie': await commitSession(session) },
    });
  }

  if (Number(number) === 10) {
    setSuccessMessage(session, 'Awesome');
    return redirect('/example/message', {
      headers: { 'Set-Cookie': await commitSession(session) },
    });
  } else {
    setErrorMessage(session, 'Wrong! Guess again');
    return redirect('/example/message', {
      headers: { 'Set-Cookie': await commitSession(session) },
    });
  }
};

export default function Index() {
  const fetcher = useFetcher();

  return (
    <>
      <h2>同一路由处理的动作</h2>
      <Form method="post">
        <label>
          输入数字: <input name="number" type="text" required />
        </label>
        <button>提交</button>
      </Form>
      <h2>资源路由处理的动作 (fetcher.Form)</h2>
      <fetcher.Form method="post" action="submit-secret">
        <label>
          输入数字: <input name="number" type="text" required />
        </label>
        <button>提交</button>
      </fetcher.Form>
      <h2>资源路由处理的动作 (fetcher.submit())</h2>
      <fetcher.Form action="submit-secret" method="post">
        <label>
          输入数字: <input name="number" type="text" required />
        </label>
        <button
          type="button"
          onClick={(event) => {
            console.log(event.currentTarget.form);
            fetcher.submit(event.currentTarget.form);
          }}>
          提交
        </button>
      </fetcher.Form>
    </>
  );
}
