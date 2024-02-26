'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from 'components/common';
import { X } from 'lucide-react';
import styles from './styles.module.scss';

const CookiesPanel = () => {
  const [showPanel, setShowPanel] = useState(false);

  const checkCookiesConsent = () => {
    const consentCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('cookies-consent='));

    return consentCookie ? consentCookie.split('=')[1] === 'true' : false;
  };

  useEffect(() => {
    const consentGiven = checkCookiesConsent();
    setShowPanel(!consentGiven);
  }, []);

  const handleOkClick = () => {
    setShowPanel(false);
    document.cookie = 'cookies-consent=true; path=/; max-age=31536000';
  };

  // const closePanel = () => {
  //   setShowPanel(false);
  // };

  if (showPanel) {
    return (
      <div className={styles.cookies}>
        {/* <button className={styles.close} type="button" onClick={closePanel} aria-label="Закрити">
          <X size={16} />
        </button> */}
        <div>
          <p>
            Цей сайт використовує файли <span>cookies</span> для правильної роботи і покращення
            сервісу. Якщо ви погоджуєтесь з їхнім використанням, <span>натисніть ОК</span>. Більше
            інформації в{' '}
            <Link href="/media/documents/privacy_policy.pdf#toolbar=0" target="_blank">
              Політика конфіденційності
            </Link>
            .
          </p>
        </div>
        <Button
          className={styles.button}
          variant="filled"
          color="secondary"
          onClick={handleOkClick}
        >
          Ok
        </Button>
      </div>
    );
  }

  return null;
};

export default CookiesPanel;
