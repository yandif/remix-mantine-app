import { useEffect } from 'react';

import useAdminStore from '~/stores/admin';

export default function Announcement() {
  const { setHeaderTitle } = useAdminStore();
  useEffect(() => {
    setHeaderTitle('公告管理');
  }, []);
  return <div>公告管理</div>;
}
