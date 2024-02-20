import React from 'react';
import Image from 'next/image';
import { Typography } from '@/components/common';
import { QuizCategory } from '@/types';
import styles from './NotFoundPage.module.scss';

interface NotFoundPageProps {
  category: QuizCategory;
}

const NotFoundPage = ({ category }: NotFoundPageProps) => {
  let message = '';

  switch (category) {
    case QuizCategory.All:
      message = 'Упс.. Немає результатів пошуку';
      break;
    case QuizCategory.Started:
      message = 'Упс.. У вас ще немає розпочатих вікторин';
      break;
    case QuizCategory.Completed:
      message = 'Упс.. У вас ще немає завершених вікторин';
      break;
    default:
      message = 'Упс.. Немає результатів пошуку';
      break;
  }
  return (
    <div className={styles.notFoundContainer}>
      <Typography component="h5" variant="body" className={styles.messageTitle}>
        {message}
      </Typography>
    </div>
  );
};

export default NotFoundPage;
