'use client';

import React, { Fragment, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { BookItem, NoResults, TableHeader } from '@/app/(admin)/components';
import { useQueryBooks } from '@/hooks/Books/useQueryBooks';
import { BookAdmin } from '@/types';
import { Spinner } from 'components/common';
import Pagination from 'components/Pagination/Pagination';
import { useDeleteChosenBooks } from '@/hooks/Books/useDeleteChosenBooks';
import NoSearchResults from '@/app/(admin)/components/NoResults/NoSearchResults';
import Modal from '../../../../components/common/ModalActions/Modal';
import styles from '../../admin/books/Books.module.scss';

const Books = ({
  searchValue = '',
  page,
}: {
  searchValue: string | null;
  page: 'books' | 'quizzes' | 'recommended';
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const { books, booksLoading, fetchError } = useQueryBooks({ page, currentPage, searchValue });
  const { handleDeleteBooks, deletingBooks, isDeleted, setIsDeleted } = useDeleteChosenBooks(page);
  const queryClient = useQueryClient();
  const count = books?.count ? Math.ceil(books.count / 7) : 0;
  const [isOpen, setIsOpen] = useState(false);
  const noResultsText = {
    books: 'У вас ще немає доданих книг',
    quizzes: 'У вас ще немає доданих вікторин',
    recommended: 'У вас ще немає доданих рекомендованих книжок',
  };

  const handleCheckboxChange = (checked: boolean, bookId: number) => {
    if (checked) {
      setSelected(prev => [...prev, bookId]);
    } else {
      setSelected(prev => prev.filter(id => id !== bookId));
    }
  };

  return (
    <div className={styles.wrapper}>
      <div>
        <TableHeader
          handleDelete={() => setIsOpen(true)}
          variant="books"
          colNames={['Назва книги', 'Стан', 'Дата  додавання']}
        />
        {booksLoading && <Spinner className={styles.spinner} />}
        {fetchError && (
          <div className={styles.error}>Упс... Щось пішло не так: {fetchError.message}</div>
        )}
        {books &&
          books.count === 0 &&
          (searchValue ? (
            <NoSearchResults />
          ) : (
            <NoResults text={noResultsText[page]} image="/images/admin/books-no-results.svg" />
          ))}
        <div>
          {books?.results?.map((book: BookAdmin) => {
            const bookId = page === 'quizzes' ? book.quizz_id : book.id || book.book_id;
            return (
              <Fragment key={bookId}>
                <BookItem
                  book={book}
                  page={page}
                  onCheckboxChange={handleCheckboxChange}
                  isDeleting={deletingBooks?.includes(bookId)}
                />
              </Fragment>
            );
          })}
        </div>
      </div>
      {books && !booksLoading && books.count > 7 && (
        <Pagination
          currentPage={currentPage}
          onPageChange={page => setCurrentPage(page)}
          count={count}
        />
      )}
      {isDeleted && (
        <Modal
          type="success"
          message="Обрані книги видалено"
          title="Успіх!"
          active={isDeleted}
          setActive={() => {
            setIsDeleted(false);
            queryClient.invalidateQueries({ queryKey: ['books'] });
          }}
        />
      )}
      {isOpen && (
        <Modal
          type="question"
          message="Ви точно бажаєте видалити обрані книги?"
          title="Видалити книги"
          active={isOpen}
          setActive={() => setIsOpen(false)}
          successFnc={() => handleDeleteBooks(selected)}
        />
      )}
    </div>
  );
};

export default Books;
