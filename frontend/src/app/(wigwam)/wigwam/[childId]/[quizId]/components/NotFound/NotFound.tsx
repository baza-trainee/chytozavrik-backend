'use client';

import React from 'react';
import { Typography, Container } from '@/components/common';
import HomeButton from '../HomeButton/HomeButton';
import styles from './NotFound.module.scss';

const NotFound = () => (
  <div className={styles.notFoundContainer}>
    <Container className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.text}>
          <Typography variant="h4" component="p" className={styles.textContainer}>
            До даної книги ще немає вікторини.
          </Typography>
          <Typography variant="h4" component="p" className={styles.textContainer}>
            Вона зʼявиться незабаром
          </Typography>
        </div>
        <HomeButton />
      </div>
    </Container>
    <div className={styles.background}>
      <div className={styles.hero} />
    </div>
  </div>
);

export default NotFound;
