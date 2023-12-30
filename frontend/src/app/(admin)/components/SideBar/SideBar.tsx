'use client';

import React from 'react';
import Image from 'next/image';
import { NavBar } from '@/app/(admin)/components';
import { Button } from 'components/common';
import { LogIn } from 'lucide-react';
import { Route } from '@/constants';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from './SideBar.module.scss';

const SideBar = () => (
  <section className={styles.sidebar}>
    <div className={styles.logo}>
      <Link href={`${Route.HOME}`}>
        <Image src="/images/logo/logo-footer.svg" alt="logo" width={72} height={60} />
      </Link>
    </div>
    <NavBar />
    <Button
      onClick={() => signOut({ callbackUrl: Route.HOME })}
      size="small"
      variant="outline"
      component="button"
      color="primary"
      startIcon={<LogIn size={24} />}
    >
      Вийти
    </Button>
  </section>
);

export default SideBar;
