import { Outlet } from 'remix';

export { CatchBoundary, ErrorBoundary } from '~/components/Remix';

export default function Article() {
  return <Outlet />;
}
