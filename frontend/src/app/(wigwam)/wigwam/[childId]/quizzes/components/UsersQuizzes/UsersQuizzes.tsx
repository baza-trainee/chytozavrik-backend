import React from 'react';
import { UsersQuizzesResponse, UsersQuiz, QuizCategory } from '@/types';
import QuizCard from '../QuizCard/QuizCard';
import styles from './UsersQuizzes.module.scss';
import Pagination from '../Pagination/Pagination';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

interface UsersQuizzesProps {
  usersQuizzes: UsersQuizzesResponse;
  childId: string;
  category: QuizCategory;
}

const UsersQuizzes = async ({ usersQuizzes, childId, category }: UsersQuizzesProps) => {
  const hasQuizzes = usersQuizzes.results && usersQuizzes.results.length > 0;
  const isPagination = usersQuizzes.count && usersQuizzes.count > 12;

  return (
    <div>
      <div className={styles.quizzesContainer}>
        {hasQuizzes ? (
          usersQuizzes.results.map((quiz: UsersQuiz) => (
            <QuizCard key={quiz.id} quiz={quiz} childId={childId} />
          ))
        ) : (
          <NotFoundPage category={category} />
        )}
      </div>
      {isPagination && (
        <Pagination
          next={usersQuizzes.next}
          previous={usersQuizzes.previous}
          count={usersQuizzes.count}
          childId={childId}
        />
      )}
    </div>
  );
};

export default UsersQuizzes;
