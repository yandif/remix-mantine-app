import { useEffect } from 'react';

import useAdminStore from '~/stores/admin';

export function useTitle(title: string) {
  const { setHeaderTitle } = useAdminStore();
  useEffect(() => {
    setHeaderTitle(title);
  }, []);
}
