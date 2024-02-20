'use client';

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { BookType, LastquizType } from '@/types';
import { NotFoundBook, BookItem } from '@/app/(wigwam)/components/Wigwam';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import styles from '@/app/(wigwam)/components/Wigwam/Books/WigwamBooks.module.scss';

interface BooksListProps {
  booksData: BookType[];
  next: string | null;
  searchValue: string;
  selectedBooks: { [p: string]: boolean };
  setSelectedBooks: Dispatch<SetStateAction<{ [p: string]: boolean }>>;
  wigwamQuizData?: LastquizType;
}

const BooksList = ({
  booksData,
  next,
  searchValue,
  selectedBooks,
  setSelectedBooks,
  wigwamQuizData,
}: BooksListProps) => {
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>(booksData);
  const [nextPageUrl, setNextPageUrl] = useState(next);
  const { data: session, status } = useSession();
  const observer = useRef<IntersectionObserver | null>(null);
  const [lastElement, setLastElement] = useState<HTMLElement | null>(null);

  const loadMoreBooks = async () => {
    if (!nextPageUrl) return;
    const response = await axios(nextPageUrl, {
      headers: {
        Authorization: `Bearer ${session?.user?.token.access}`,
      },
    });
    const newBooksData = response.data.data;
    setFilteredBooks(prevBooks => [...prevBooks, ...newBooksData.results]);
    setNextPageUrl(newBooksData.next);
  };

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && nextPageUrl && status === 'authenticated') {
        loadMoreBooks();
      }
    });
    if (lastElement) observer.current.observe(lastElement);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [lastElement, nextPageUrl, status]);

  useEffect(() => {
    const matchedBooks = booksData?.filter(
      entry =>
        entry.book.title.toLowerCase().includes(searchValue.toLowerCase() || '') ||
        entry.book.author.toLowerCase().includes(searchValue.toLowerCase() || '')
    );
    setFilteredBooks(matchedBooks);
  }, [searchValue, booksData]);

  return (
    <>
      {filteredBooks?.length > 0 && (
        <div className={styles.button_list}>
          {filteredBooks?.map((item: BookType, index: number) => (
            <BookItem
              key={item.id}
              item={item}
              selectedBooks={selectedBooks}
              booksData={booksData}
              wigwamQuizData={wigwamQuizData}
              index={index}
            />
          ))}
          <div ref={node => setLastElement(node)} />
        </div>
      )}
      {filteredBooks?.length < 1 && <NotFoundBook />}
    </>
  );
};

export default BooksList;
