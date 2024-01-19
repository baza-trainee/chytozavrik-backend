'use client';

import Image from 'next/image';
import { Button, Typography } from '@/components/common';
import catImage from 'public/images/cat/cat-congratulation.svg';
import { useConfetti } from '@/hooks';
import styles from './Toast.module.scss';

type Props = {
  onAction: () => void;
};

const SuccessToast = ({ onAction }: Props) => {
  const canvas = useConfetti({
    className: styles.confetti,
  });

  return (
    <>
      <div className={styles.toast}>
        <div className={styles.body}>
          <div className={styles.thumb}>
            <Image className={styles.image} src={catImage} alt="Вітаючий кіт" />
          </div>
          <div className={styles['body-wrapper']}>
            <Typography className={styles.title} component="h2" variant="h2">
              Правильно!
            </Typography>
            <Typography component="p" variant="body">
              Так тримати!
            </Typography>
          </div>
        </div>

        <div className={styles['button-wrapper']}>
          <Button className={styles.button} color="success" onClick={onAction}>
            Продовжити
          </Button>
        </div>
      </div>
      {canvas}
    </>
  );
};

export default SuccessToast;
