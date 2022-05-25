import { useCatch } from 'remix';

import NotFoundTitle from '../NotFound';

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <NotFoundTitle to="/"></NotFoundTitle>;
  }

  throw new Error(`服务器错误: ${caught.status}`);
}
