'use client';

import React, { useState } from 'react';
import { Route } from '@/constants';
import { AdminHeader, Books } from '@/app/(admin)/components';
import styles from '@/app/(admin)/admin/books/Books.module.scss';

const BooksList = () => {
  const [searchValue, setSearchValue] = useState<string | null>(null);

  return (
    <div className={styles.books}>
      <AdminHeader
        withSearch
        withButton
        buttonText="Додати книгу"
        withClose={false}
        heading="Книги"
        setSearchWord={setSearchValue}
        href={Route.BOOKS_ADD}
      />
      <Books searchValue={searchValue} page="books" />
    </div>
  );
};

export default BooksList;
