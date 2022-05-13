import { useEffect } from 'react';

import useAdminStore from '~/stores/admin';

export default function Comment() {
  const { setHeaderTitle } = useAdminStore();
  useEffect(() => {
    setHeaderTitle('评论管理');
  }, []);
  return <div>评论管理</div>;
}
