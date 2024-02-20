'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader, QuizzesForm } from '@/app/(admin)/components';
import { Modal } from 'components/common';
import styles from '@/app/(admin)/admin/quizzes/add/AddQuiz.module.scss';

const EditQuiz = ({ id }: { id: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <AdminHeader
        withSearch={false}
        withButton={false}
        withClose
        heading="Редагувати вікторину"
        subHeading={['Вікторини', 'Редагувати вікторину']}
        closeFunc={() => setIsOpen(true)}
      />
      <QuizzesForm id={id} />

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

export default EditQuiz;
