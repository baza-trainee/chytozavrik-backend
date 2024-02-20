import React from 'react';
import { UsersQuiz, QuizCategory } from '@/types';
import Image from 'next/image';
import { Route } from '@/constants';
import { Typography, Button } from '@/components/common';
import { useIconAndColor } from '@/app/(wigwam)/wigwam/hooks/useIconAndColor';
import styles from './QuizCard.module.scss';

interface QuizCardProps {
  quiz: UsersQuiz;
  childId: string;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, childId }) => {
  const firstChar = quiz.current_score ? quiz.current_score.charAt(0) : '';
  const firstCharInt = parseInt(firstChar, 10);
  const { colorText, icon } = useIconAndColor(firstCharInt);

  let buttonTitle = 'Пройти вікторину';
  if (!quiz.current_score) {
    buttonTitle = 'Пройти вікторину';
  } else if (firstCharInt >= 0 && firstCharInt < 5) {
    buttonTitle = 'Продовжити вікторину';
  } else if (firstCharInt === 5) {
    buttonTitle = 'Пройти ще раз';
  }

  return (
    <div className={styles.quizCard}>
      <div className={styles.bookCoverContainer}>
        <Image src={quiz.book.cover_image} width={140} height={214} alt="book picture" />
      </div>
      <div className={styles.quizDetails}>
        <div className={styles.quizHeader}>
          <Typography component="h5" variant="h5" data-title={quiz.book.title}>
            {quiz.book.title}
          </Typography>
          <div className={styles.scoreWrapper}>
            <Image priority src={icon} alt="brain icon" width={18} height={18} />
            <p className={styles.quizScore} style={{ color: `${colorText}` }}>
              {quiz.current_score || '0/5'}
            </p>
          </div>
        </div>
        <Typography
          className={styles.bookAuthor}
          component="p"
          variant="body"
          data-title={quiz.book.author}
        >
          {quiz.book.author}
        </Typography>
        <Button
          component="link"
          href={`${Route.WIGWAM}/${childId}/${quiz.id}`}
          size="small"
          variant="outline"
        >
          {buttonTitle}
        </Button>
      </div>
    </div>
  );
};

export default QuizCard;
