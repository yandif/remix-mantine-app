import { useEffect } from 'react';

import useAdminStore from '~/stores/admin';

export default function Catrgory() {
  const { setHeaderTitle } = useAdminStore();
  useEffect(() => {
    setHeaderTitle('分类管理');
  }, []);
  return <div>分类管理</div>;
}
