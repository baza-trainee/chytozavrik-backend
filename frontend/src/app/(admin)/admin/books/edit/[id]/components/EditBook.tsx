'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/app/(admin)/components';
import BooksForm from '@/app/(admin)/admin/books/components/BooksForm/BooksForm';
import Modal from 'components/common/ModalActions/Modal';
import styles from '@/app/(admin)/admin/books/add/AddBooks.module.scss';

const EditBook = ({ id }: { id: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <AdminHeader
        withSearch={false}
        withButton={false}
        withClose
        heading="Редагувати книгу"
        subHeading={['Книги', 'Редагувати книгу']}
        closeFunc={() => setIsOpen(true)}
      />
      <BooksForm id={id} />

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

export default EditBook;
