'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/app/(admin)/components';
import PartnersForm from '@/app/(admin)/admin/partners/components/PartnersForm/PartnersForm';
import Modal from 'components/common/ModalActions/Modal';
import { useRouter } from 'next/navigation';
import styles from '../AddPartner.module.scss';

const AddBook = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <AdminHeader
        withSearch={false}
        withButton={false}
        withClose
        heading="Додати партнера"
        subHeading={['Книги', 'Додати партнера']}
        closeFunc={() => setIsOpen(true)}
      />
      <PartnersForm />

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
