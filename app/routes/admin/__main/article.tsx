import { Outlet } from 'remix';

export { CatchBoundary, ErrorBoundary } from '~/web/components/Remix';

export default function Article() {
  return <Outlet />;
}
