'use client';

import { useSession } from 'next-auth/react';
import { MoveRight } from 'lucide-react';
import classNames from 'classnames';
import { Button, Container, Typography } from 'components/common';
import { Route } from '@/constants';
import styles from './Hero.module.scss';

const Hero = () => {
  const session = useSession();

  return (
    <section className={styles.section}>
      <Container className={styles.container}>
        <Typography component="h1" variant="h1" className={styles.title}>
          Розпочни свою велику книжкову пригоду!
        </Typography>
        <Typography component="p" variant="body" className={styles.text}>
          Інтерактивна вікторина для маленьких книголюбів, яка зробить процес читання ще цікавішим
        </Typography>

        <Button
          component="link"
          href={Route.WIGWAM_LOBBY}
          prefetch={false}
          color="secondary"
          className={classNames({
            [styles.button]: true,
            [styles['button--hide']]: session.status !== 'authenticated',
          })}
          endIcon={<MoveRight size="24" />}
        >
          Почати гру
        </Button>
      </Container>
    </section>
  );
};

export default Hero;
