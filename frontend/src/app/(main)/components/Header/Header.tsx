'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button, Container } from 'components/common';
import { useSession } from 'next-auth/react';
import { useMedia } from '@/hooks';
import styles from './Header.module.scss';
import HeaderButton from './HeaderButton';

const Header = () => {
  const { data: session } = useSession();
  const { deviceType } = useMedia();

  return (
    <header>
      <Container className={styles.header}>
        <Link href="/" className={styles.headerContainer}>
          <Image
            src="/images/logo/header-logo.svg"
            width={64}
            height={54}
            alt="Logo"
            className={styles.logo}
          />
          <Image
            src="/images/logo/chytozavryk.svg"
            width={105}
            height={14}
            alt="Logo"
            className={styles.logoText}
          />
        </Link>

        <div className={styles.buttonContainer}>
          {deviceType !== 'mobile' && session?.user?.is_superuser && (
            <Button
              className={styles.buttonAdmin}
              component="link"
              href="/admin"
              variant="filled"
              color="primary"
            >
              Адміністрування
            </Button>
          )}
          <HeaderButton />
        </div>
      </Container>
    </header>
  );
};

export default Header;
