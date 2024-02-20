'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PenLine, Trash2 } from 'lucide-react';
import { AdminCheckBox } from '@/app/(admin)/components';
import { BookAdminProps } from '@/types';
import { formattedDate } from '@/utils/formatDate';
import Link from 'next/link';
import { Route } from '@/constants';
import { Spinner } from 'components/common';
import { useDeleteBooks } from '@/hooks/Books/useDeleteBooks';
import Modal from 'components/common/ModalActions/Modal';
import { useQueryClient } from '@tanstack/react-query';
import styles from './BookItem.module.scss';

const BookItem = ({ book, page, onCheckboxChange, isDeleting }: BookAdminProps) => {
  const { deleteBook, isPending, setIsDeleted, isDeleted } = useDeleteBooks(page);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  let stateToRender;
  if (Array.isArray(book.state)) {
    if (book.state.length > 1) {
      stateToRender = (
        <p className={styles.blue}>
          {book.state[0]}/{book.state[1]}
        </p>
      );
    } else {
      stateToRender = null;
    }
  } else {
    if (book.state === 'Рекомендована') {
      stateToRender = <p className={styles.blue}>{book.state}</p>;
    } else {
      stateToRender = <p className={styles.green}>{book.state}</p>;
    }
  }

  const state = {
    books: stateToRender,
    quizzes: <p className={styles.green}>Вікторина</p>,
    recommended: <p className={styles.blue}>Рекомендована</p>,
  };

  const redirectRoute = {
    books: Route.BOOKS_EDIT,
    recommended: Route.BOOKS_EDIT,
    quizzes: Route.QUIZZES_EDIT,
  };

  const editorLinkProps = page === 'quizzes' ? book.quizz_id : book.id || book.book_id;

  return (
    <div className={styles.bookItem}>
      <div className={styles.checkbox}>
        <AdminCheckBox
          id={editorLinkProps}
          onChange={e => onCheckboxChange(e.target.checked, editorLinkProps)}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.title}>
          <div className={styles.image}>
            <Image src={book.cover_image} width={40} height={60} alt={book.title} />
          </div>
          <div className={styles.bookInfo}>
            <h2 className={styles.name}>{book.title}</h2>
            <p className={styles.author}>{book.author}</p>
          </div>
        </div>
        <div className={styles.infoBlock}>
          <div className={styles.state}>{state[page]}</div>
          <p className={styles.date}>{formattedDate(book.updated_at)}</p>
        </div>
      </div>
      <div className={styles.actions}>
        {isPending || isDeleting ? (
          <Spinner />
        ) : (
          <>
            <div>
              <Link href={`${redirectRoute[page]}/${editorLinkProps}`}>
                <PenLine />
              </Link>
            </div>
            <div onClick={() => setIsOpen(true)}>
              <Trash2 />
            </div>
          </>
        )}
      </div>
      {isOpen && (
        <Modal
          type="question"
          message="Ви точно хочете видалити книгу?"
          title={`Видалити “${book.title}”`}
          active={isOpen}
          setActive={() => setIsOpen(false)}
          successFnc={() => {
            deleteBook(editorLinkProps);
          }}
        />
      )}
      {isDeleted && (
        <Modal
          type="success"
          message={
            page === 'quizzes'
              ? `Вікторину “${book.title}” видалено`
              : `Книгу “${book.title}” видалено`
          }
          title="Успіх!"
          active={isDeleted}
          setActive={() => {
            setIsDeleted(false);
            queryClient.invalidateQueries({ queryKey: ['books'] });
          }}
        />
      )}
    </div>
  );
};

export default BookItem;
