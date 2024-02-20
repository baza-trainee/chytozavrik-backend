import React from 'react';
import { Typography } from 'components/common';
import classNames from 'classnames';
import Image from 'next/image';
import catSad from 'public/images/cat/cat-sad.svg';
import styles from '@/app/(main)/parents/lobby/components/Lobby/Lobby.module.scss';

const NoWigwams = () => (
  <>
    <Typography
      className={classNames(styles.title, styles['title--no-user'])}
      component="h1"
      variant="h2"
    >
      Привіт! <br />В тебе ще немає створеного вігваму
    </Typography>

    <div className={styles['image-wrapper']}>
      <Image className={styles.image} src={catSad} alt="Зображення засмученого кота" />
    </div>
  </>
);

export default NoWigwams;
