import { useEffect } from 'react';

import useAdminStore from '~/stores/admin';

export default function Dashboard() {
  const { setHeaderTitle } = useAdminStore();
  useEffect(() => {
    setHeaderTitle('超级面板');
  }, []);
  return <div>超级面板</div>;
}
