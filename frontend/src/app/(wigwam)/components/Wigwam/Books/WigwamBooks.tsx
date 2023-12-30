'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Typography } from 'components/common';
import { BooksList, SearchInput } from '@/app/(wigwam)/components/Wigwam';
import { LastquizType, BookType } from '@/types';
import wigwamTextData from '../wigwamTextData.json';
import styles from './WigwamBooks.module.scss';

const WigwamBooks = ({
  booksData,
  next,
  wigwamQuizData,
}: {
  booksData: BookType[];
  next: string | null;
  wigwamQuizData?: LastquizType;
}) => {
  const [selectedBooks, setSelectedBooks] = useState<{ [key: string]: boolean }>({});
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={styles.books_container}>
      <Typography component="h2" variant="h2" className={styles.title}>
        {wigwamTextData[7]}
      </Typography>
      <SearchInput setSearchValue={setSearchValue} />
      <BooksList
        booksData={booksData}
        next={next}
        searchValue={searchValue}
        setSelectedBooks={setSelectedBooks}
        selectedBooks={selectedBooks}
        wigwamQuizData={wigwamQuizData}
      />
      <Button
        className={styles.button}
        variant="outline"
        onClick={() => router.push(`${pathname}/quizzes`)}
      >
        {wigwamTextData[8]}
      </Button>
    </div>
  );
};

export default WigwamBooks;
