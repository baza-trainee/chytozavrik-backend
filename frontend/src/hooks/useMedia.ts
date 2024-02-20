'use client';

import { useMediaQuery } from 'react-responsive';
import { useEffect, useState } from 'react';

export const useMedia = () => {
  const isDesktop = useMediaQuery({
    query: '(min-width: 1440px)',
  });
  const isLaptop = useMediaQuery({
    query: '(min-width: 1024px) and (max-width: 1439px)',
  });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)',
  });
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  });

  const [deviceType, setDeviceType] = useState('');

  useEffect(() => {
    if (isDesktop) setDeviceType('desktop');
    else if (isLaptop) setDeviceType('laptop');
    else if (isTablet) setDeviceType('tablet');
    else setDeviceType('mobile');
  }, [isDesktop, isTablet, isLaptop, isMobile]);

  return { deviceType };
};
