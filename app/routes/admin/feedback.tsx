import { useEffect } from 'react';

import useAdminStore from '~/stores/admin';

export default function Feedback() {
  const { setHeaderTitle } = useAdminStore();
  useEffect(() => {
    setHeaderTitle('反馈设置');
  }, []);
  return <div>反馈设置</div>;
}
