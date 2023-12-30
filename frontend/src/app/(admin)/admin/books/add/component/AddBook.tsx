'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/app/(admin)/components';
import BooksForm from '@/app/(admin)/admin/books/components/BooksForm/BooksForm';
import Modal from 'components/common/ModalActions/Modal';
import { useRouter } from 'next/navigation';
import styles from '../AddBooks.module.scss';

const AddBook = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <AdminHeader
        withSearch={false}
        withButton={false}
        withClose
        heading="Додати книгу"
        subHeading={['Книги', 'Додати книгу']}
        closeFunc={() => setIsOpen(true)}
      />
      <BooksForm />

      {isOpen && (
        <Modal
          type="question"
          message="Ви точно хочете залишити сторінку? Процес редагування буде втрачено"
          title="Залишити сторінку "
          active={isOpen}
          setActive={() => setIsOpen(false)}
          successFnc={() => router.back()}
        />
      )}
    </div>
  );
};

export default AddBook;
