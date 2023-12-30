'use client';

import React, { FC } from 'react';
import Navbar from '@/app/(wigwam)/components/header/Navbar/Navbar';
import { useMedia } from '@/hooks';
import NavbarMob from '@/app/(wigwam)/components/header/NavbarMob/NavbarMob';

interface WigwamHeaderProps {
  childId: string;
  name: string;
  avatar: string;
}
const WigwamHeader: FC<WigwamHeaderProps> = ({ childId, name, avatar }) => {
  const { deviceType } = useMedia();

  return deviceType === 'mobile' ? (
    <NavbarMob avatar={avatar} />
  ) : (
    <Navbar childId={childId} name={name} avatar={avatar} />
  );
};

export default WigwamHeader;
