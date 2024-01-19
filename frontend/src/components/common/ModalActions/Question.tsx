import React from 'react';
import { Button } from 'components/common';
import styles from './Modal.module.scss';

interface QuestionProps {
  message: string;
  title: string;
  closeModal: () => void;
  successFnc: (() => void) | undefined;
  cancelButtonText?: string;
}

const Question = ({
  title,
  message,
  closeModal,
  successFnc,
  cancelButtonText = 'Скасувати',
}: QuestionProps) => (
  <div className={styles.question}>
    <div className={styles.content}>
      <h5 className={styles.title}>{title}</h5>
      <p className={styles.message}>{message}</p>
      <div className={styles.buttons}>
        <Button variant="outline" onClick={() => closeModal()}>
          {cancelButtonText}
        </Button>
        <Button
          variant="filled"
          color="secondary"
          onClick={() => {
            closeModal();
            if (successFnc) successFnc();
          }}
        >
          Підтвердити
        </Button>
      </div>
    </div>
  </div>
);

export default Question;
