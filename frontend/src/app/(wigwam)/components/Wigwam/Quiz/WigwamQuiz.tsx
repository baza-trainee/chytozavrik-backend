'use client';

import React from 'react';
import { BookType, LastquizType } from '@/types';
import { WelcomeWigwam, LastQuiz, NoLastQuiz } from '@/app/(wigwam)/components/Wigwam';

export interface WigwamQuizProps {
  booksItem: BookType;
  wigwamQuizItem?: LastquizType;
}

const WigwamQuiz: React.FC<WigwamQuizProps> = ({ booksItem, wigwamQuizItem }) => {
  const uniqueQuizzes = wigwamQuizItem?.last_quiz_id;

  if (!uniqueQuizzes) {
    return <WelcomeWigwam />;
  }

  if (booksItem?.current_score === '5/5') {
    return <NoLastQuiz />;
  }

  return <LastQuiz wigwamQuizItem={wigwamQuizItem} booksItem={booksItem} />;
};

export default WigwamQuiz;
