'use client';

import React, { FC } from 'react';
import Navbar from '@/app/(wigwam)/components/header/Navbar/Navbar';
import { useAuthAxiosInstance, useMedia } from '@/hooks';
import NavbarMob from '@/app/(wigwam)/components/header/NavbarMob/NavbarMob';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';

interface WigwamHeaderProps {
  childId: string;
}
const WigwamHeader: FC<WigwamHeaderProps> = ({ childId }) => {
  const { deviceType } = useMedia();
  const { status } = useSession();
  const axios = useAuthAxiosInstance();

  const { data: child } = useQuery({
    queryKey: ['childReq', childId],
    queryFn: async () => {
      const { data } = await axios(`/users/me/children/${childId}/`);
      return data.data;
    },
    enabled: status === 'authenticated',
  });

  return child && deviceType === 'mobile' ? (
    <NavbarMob avatar={child?.avatar_as_url} />
  ) : (
    <Navbar childId={childId} name={child?.name} avatar={child?.avatar_as_url} />
  );
};

export default WigwamHeader;
