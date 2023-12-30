'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Refresh = () => {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};

export default Refresh;
