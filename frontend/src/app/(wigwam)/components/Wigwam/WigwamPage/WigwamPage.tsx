'use client';

import React, { useEffect, useState } from 'react';
import { BookType } from '@/types';

import {
  RecommendedBooks,
  WigwamBooks,
  WigwamMyMonsters,
  WigwamQuiz,
  WigwamReadBooks,
} from '@/app/(wigwam)/components/Wigwam';
import { useFetchMonsters } from '@/hooks/Books/useRecommendedBooksQuery';
import { useQuizzesQuery } from '@/hooks/Quizzes/useQuizzesQuery';
import { useWigwamQuizzQuery } from '@/hooks/Quizzes/useWigwamQuizzQuery';
import styles from '@/app/(wigwam)/wigwam/[childId]/wigwam.module.scss';
import Container from '../../../../../components/common/Container/Container';

interface WigwamProps {
  params: { childId: string };
}

const WigwamPage = ({ params: { childId } }: WigwamProps) => {
  const { data: recommendedBooks } = useFetchMonsters();
  const { data: childBooks } = useQuizzesQuery(childId);
  const { data: wigwamQuiz } = useWigwamQuizzQuery(childId);
  const [isWigwamQuiz, setIsWigwamQuiz] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    if (childBooks?.results.length > 0 && wigwamQuiz) {
      setIsWigwamQuiz(true);
    }
  }, [childBooks, wigwamQuiz]);

  const selectedBook =
    childBooks?.results.find(
      (book: BookType) => book.id === parseInt(wigwamQuiz?.last_quiz_id || '', 10)
    ) || ({} as BookType);

  return (
    <Container className={styles.layout}>
      <WigwamReadBooks wigwamQuizItem={wigwamQuiz} />
      {isWigwamQuiz && <WigwamQuiz wigwamQuizItem={wigwamQuiz} booksItem={selectedBook} />}
      <WigwamMyMonsters childId={childId} />
      <WigwamBooks
        booksData={childBooks?.results}
        wigwamQuizData={wigwamQuiz}
        next={childBooks?.next}
      />
      <div className={styles.test}>
        <RecommendedBooks recBooksData={recommendedBooks} />
      </div>
    </Container>
  );
};

export default WigwamPage;
