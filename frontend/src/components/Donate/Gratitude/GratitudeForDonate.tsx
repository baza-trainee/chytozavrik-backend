'use client';

import React from 'react';
import { Typography } from 'components/common';
import Image from 'next/image';
import styles from './Gratitude.module.scss';

const GratitudeForDonate = () => (
  <div className={styles.gratitude}>
    <div className={styles.text}>
      <Typography className={styles.title} component="h2" variant="h3">
        Дякуємо Вам!
      </Typography>
      <p>
        Завдяки Вам ми зможемо продовжувати розвивати та удосконалювати наш веб-додаток, зробити
        його ще зручнішим та кориснішим для маленьких читачів.
      </p>
    </div>
    <div className={styles.image}>
      <Image src="images/donate/donate-monster.svg" width={266} height={208} alt="thank you" />
    </div>
  </div>
);

export default GratitudeForDonate;
