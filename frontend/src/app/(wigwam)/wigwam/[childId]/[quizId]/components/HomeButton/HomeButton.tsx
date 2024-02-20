'use client';

import { Button } from '@/components/common';
import { useMedia } from '@/hooks';
import { useRouter } from 'next/navigation';
import styles from './HomeButton.module.scss';

const HomeButton = () => {
  const { deviceType } = useMedia();
  const router = useRouter();

  return (
    <Button
      component="button"
      size={deviceType === 'mobile' || deviceType === 'tablet' ? 'default' : 'big'}
      color="secondary"
      className={styles.homeButton}
      onClick={() => router.back()}
    >
      До вігваму
    </Button>
  );
};

export default HomeButton;
