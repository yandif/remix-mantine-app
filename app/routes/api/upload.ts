import type { ActionFunction } from 'remix';
import {
  json,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from 'remix';

import { db } from '~/server/database/db.server';
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/server/message/message.server';
import { checkAuth } from '~/server/middleware/auth.server';

export const action: ActionFunction = async ({ request }) => {
  const user = await checkAuth(request);
  const uploadHandler = unstable_createFileUploadHandler({
    directory: 'public/img',
    // file: ({ filename }) => filename,
    maxFileSize: 5_000_000,
  });
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler,
  );
  const session = await getSession(request.headers.get('cookie'));
  const image = formData.get('img') as any;

  if (!image) {
    setErrorMessage(session, '上传失败!');
    return json(
      {
        ok: false,
      },
      {
        headers: { 'Set-Cookie': await commitSession(session) },
      },
    );
  }
  const img = await db.image.create({
    data: { name: image.name, author: { connect: { id: user.id } } },
  });

  setSuccessMessage(session, '上传成功!');
  return json(
    { ok: true, data: img },
    {
      headers: { 'Set-Cookie': await commitSession(session) },
    },
  );
};
