'use client';

import classNames from 'classnames';
import { Button, Typography } from '@/components/common';
import { useConfetti } from '@/hooks';
import { Route } from '@/constants';
import authStyles from '../Auth.module.scss';
import styles from './SignUpSuccess.module.scss';

const SignUpSuccess = () => {
  const confetti = useConfetti({ className: styles.confetti });

  return (
    <div className={classNames(authStyles.dialog, styles.dialog)}>
      <Typography
        className={classNames(authStyles.title, styles.title)}
        component="h2"
        variant="h2"
      >
        Ви успішно зареєструвалися
      </Typography>
      <div className={styles.image}>{confetti}</div>
      <div className={styles['content-wrapper']}>
        <Typography className={styles.text} component="p" variant="body">
          Тепер ви маєте можливість зареєструвати вашу дитину та проходити вікторини
        </Typography>
        <Button
          className={authStyles['button-submit']}
          component="link"
          color="secondary"
          href={Route.PARENTS}
          replace
        >
          Перейти до кабінету
        </Button>
      </div>
    </div>
  );
};

export default SignUpSuccess;
