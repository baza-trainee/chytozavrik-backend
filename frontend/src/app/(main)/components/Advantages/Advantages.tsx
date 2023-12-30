import React from 'react';
import { Container, Typography } from 'components/common';
import Image from 'next/image';
import book from 'public/images/advantages-book.svg';
import medal from 'public/images/advantages-medal.svg';
import smart from 'public/images/advantages-smart.svg';
import styles from './Advantages.module.scss';

const Advantages = () => (
  <section className={styles.advantages}>
    <Container className={styles.container}>
      <Typography component="h2" variant="h2" className={styles.title}>
        Додаток створений, щоб допомогти дитині
      </Typography>
      <div className={styles.items}>
        <div className={styles.item}>
          <Image className={styles.img} src={medal} alt="medal" />
          <Typography component="p" variant="h4" className={styles.text}>
            Пишатися своїми успіхами та досягненнями у читанні
          </Typography>
        </div>
        <div className={styles.item}>
          <Image className={styles.img} src={book} alt="book" />
          <Typography component="p" variant="h4" className={styles.text}>
            Зробити читання приємною і корисною звичкою
          </Typography>
        </div>
        <div className={styles.item}>
          <Image className={styles.img} src={smart} alt="smart" />
          <Typography component="p" variant="h4" className={styles.text}>
            Розвивати мислення, уяву та аналітичні здібності
          </Typography>
        </div>
      </div>
    </Container>
  </section>
);

export default Advantages;
