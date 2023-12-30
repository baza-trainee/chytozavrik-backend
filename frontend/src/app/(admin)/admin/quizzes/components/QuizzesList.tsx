'use client';

import React, { useState } from 'react';
import { AdminHeader, Books } from '@/app/(admin)/components';
import { Route } from '@/constants';
import styles from '@/app/(admin)/admin/books/Books.module.scss';

const QuizzesList = () => {
  const [searchValue, setSearchValue] = useState<string | null>(null);

  return (
    <div className={styles.books}>
      <AdminHeader
        withSearch
        withButton
        buttonText="Додати вікторину"
        withClose={false}
        heading="Вікторини"
        setSearchWord={setSearchValue}
        href={Route.QUIZZES_ADD}
      />
      <Books searchValue={searchValue} page="quizzes" />
    </div>
  );
};

export default QuizzesList;
