'use client';

import React, { useState } from 'react';
import { Button, Modal } from 'components/common';
import { useRouter } from 'next/navigation';
import styles from '@/app/(admin)/admin/quizzes/components/QuizzesForm/QuizForm.module.scss';

const FormButtons = ({
  isPendingAdd,
  isPendingEdit,
  id,
}: {
  isPendingAdd: boolean;
  isPendingEdit: boolean;
  id?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <div className={styles.actions}>
        <Button
          variant="outline"
          color="primary"
          size="small"
          onClick={() => setIsOpen(true)}
          disabled={isPendingAdd || isPendingEdit}
        >
          Скасувати
        </Button>
        <Button
          type="submit"
          variant="filled"
          color="secondary"
          size="small"
          isLoading={isPendingAdd || isPendingEdit}
          disabled={isPendingAdd || isPendingEdit}
        >
          {id ? 'Зберегти' : 'Додати'}
        </Button>
      </div>
      {isOpen && (
        <Modal
          type="question"
          message="Ви точно хочете скасувати зміни? Вони не будуть збережені"
          title="Скасувати зміни"
          active={isOpen}
          setActive={() => setIsOpen(false)}
          successFnc={() => router.back()}
          cancelButtonText="Повернутись"
        />
      )}
    </>
  );
};

export default FormButtons;
