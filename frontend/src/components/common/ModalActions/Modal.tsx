'use client';

import React, { Dispatch, useEffect } from 'react';
import { Question, Success } from '@/app/(admin)/components';
import styles from './Modal.module.scss';

interface ModalProps {
  type: 'success' | 'question';
  message: string;
  title: string;
  active: boolean;
  setActive: Dispatch<React.SetStateAction<boolean>>;
  successFnc?: () => void;
  cancelButtonText?: string;
}
const Modal = ({
  type,
  message,
  title,
  active,
  setActive,
  successFnc,
  cancelButtonText,
}: ModalProps) => {
  const closeModal = () => {
    setActive(false);
  };

  useEffect(() => {
    if (active) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [active]);

  let content;
  if (type === 'success') {
    content = <Success closeModal={closeModal} title={title} message={message} />;
  } else {
    content = (
      <Question
        closeModal={closeModal}
        title={title}
        message={message}
        successFnc={successFnc}
        cancelButtonText={cancelButtonText}
      />
    );
  }

  return (
    active && (
      <>
        <div className={styles.backdrop} onClick={closeModal} />
        <div className={styles.modal}>{content}</div>
      </>
    )
  );
};

export default Modal;
