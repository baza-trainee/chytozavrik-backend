'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import Container from 'components/common/Container/Container';
import Link from 'next/link';
import styles from './NavbarMob.module.scss';

const NavbarMob = ({ avatar }: { avatar: string }) => (
  <header className={styles.header}>
    <Container>
      <div className={styles.wrapper}>
        <Image
          src="/images/logo/header-logo.svg"
          width={29}
          height={24}
          alt="Logo"
          className={classNames(styles.log)}
        />
        <Image src={avatar} width={32} height={32} alt="Logo" className={classNames(styles.log)} />
        <Link href="/parents/lobby">
          <LogOut width={32} height={32} className={classNames(styles.logo)} />
        </Link>
      </div>
    </Container>
  </header>
);

export default NavbarMob;
