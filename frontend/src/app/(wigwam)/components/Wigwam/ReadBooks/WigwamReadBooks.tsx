import React, { FC } from 'react';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import { LastquizType } from '@/types';
import Sticker from 'public/images/sticker.svg';
import styles from './WigwamReadBooks.module.scss';

interface WigwamReadBooksProps {
  wigwamQuizItem?: LastquizType;
}

const WigwamReadBooks: FC<WigwamReadBooksProps> = ({ wigwamQuizItem }) => {
  let counter = '0';
  counter = wigwamQuizItem?.unique_quizzes_passed || '0';

  return (
    <div className={styles.wraper}>
      <Image priority src={Sticker} alt="sticker" width={79} height={48} />
      <p className={styles.counter_title}>Прочитано</p>
      <div className={styles.counter_wraper}>
        <p className={styles.counter}>{counter}</p>
        <div className={styles.icon}>
          <BookOpen color="#7791FA" strokeWidth={1} />
        </div>
      </div>
    </div>
  );
};

export default WigwamReadBooks;
