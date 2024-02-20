import React from 'react';
import CatImage from '@/app/(wigwam)/components/Wigwam/Quiz/components/CatImage';
import wigwamTextData from '@/app/(wigwam)/components/Wigwam/wigwamTextData.json';
import styles from '@/app/(wigwam)/components/Wigwam/Quiz/WigwamQuiz.module.scss';

const NoLastQuiz = () => (
  <section className={styles.start_wraper}>
    <div className={styles.start_box}>
      <div className={styles.image}>
        <CatImage alt="cat" width={140} height={90} viewBox="0 0 140 90" />
      </div>
      <div className={styles.text_wrap}>
        <p className={styles.text_welcome}> Супер! </p>
        <p className={styles.text}>{wigwamTextData[3]}</p>
      </div>
    </div>
  </section>
);

export default NoLastQuiz;
