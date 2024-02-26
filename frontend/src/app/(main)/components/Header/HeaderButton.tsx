'use client';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { User2 } from 'lucide-react';
import { useSignOut } from '@/hooks';
import { Button } from 'components/common';
import { Route } from '@/constants';
import styles from './Header.module.scss';

const HeaderButton = () => {
  const [cookiesConsent, setCookiesConsent] = useState(false);

  const session = useSession();
  const path = usePathname();
  const { signOut } = useSignOut();
  const isPartners = path.includes(Route.PARENTS);
  const isLobby = path.includes(Route.WIGWAM_LOBBY);

  const checkCookiesConsent = () => {
    const consentCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('cookies-consent='));

    return consentCookie ? consentCookie.split('=')[1] === 'true' : false;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const consentGiven = checkCookiesConsent();
      if (consentGiven) {
        setCookiesConsent(true);
        window.scrollTo(0, 0);
        clearInterval(intervalId);
      }
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (session.status === 'loading') return null;

  if (session.status === 'authenticated') {
    if (isLobby) {
      return (
        <Button
          className={styles.buttonOut}
          variant="outline"
          component="link"
          href={Route.PARENTS}
        >
          Вихід
        </Button>
      );
    }
    if (isPartners) {
      return (
        <Button
          className={styles.buttonOut}
          variant="outline"
          onClick={() => signOut({ callbackUrl: Route.HOME })}
        >
          Вийти
        </Button>
      );
    }
    return (
      <Button
        component="link"
        href={Route.PARENTS}
        className={styles.button}
        variant="outline"
        startIcon={<User2 className={styles.userLogo} />}
      >
        Кабінет
      </Button>
    );
  }

  if (cookiesConsent) {
    return (
      <Button component="link" href={Route.SIGN_IN} className={styles.buttonIn} variant="outline">
        Вхід
      </Button>
    );
  }
  return null;
};

export default HeaderButton;
