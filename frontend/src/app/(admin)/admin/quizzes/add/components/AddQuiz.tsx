'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/app/(admin)/components';
import QuizzesForm from '@/app/(admin)/admin/quizzes/components/QuizzesForm/QuizzesForm';
import { useRouter } from 'next/navigation';
import Modal from '../../../../../../components/common/ModalActions/Modal';
import styles from '../AddQuiz.module.scss';

const AddQuiz = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <AdminHeader
        withSearch={false}
        withButton={false}
        withClose
        heading="Додати вікторину"
        subHeading={['Вікторини', 'Додати вікторину']}
        closeFunc={() => setIsOpen(true)}
      />
      <QuizzesForm />

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

export default AddQuiz;
