import { useCatch } from 'remix';

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>404</div>;
  }

  throw new Error(`服务器错误: ${caught.status}`);
}
