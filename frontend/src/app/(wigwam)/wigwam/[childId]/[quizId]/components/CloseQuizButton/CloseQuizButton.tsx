'use client';

import { useState, type ButtonHTMLAttributes, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { XButton } from '@/components/common';
import { Route } from '@/constants';
import { useQuizContext } from '@/hooks/useQuizContext';
import { Notification, DefaultToast } from '../Notification';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

const CloseQuizButton = (props: Props) => {
  const { childId } = useParams();
  const { isCloseQuiz, setIsCloseQuiz, isAnswerModal, setIsAnswerModal } = useQuizContext();

  const showNotificationHandler = () => {
    setIsCloseQuiz(true);
    if (isAnswerModal) {
      setIsAnswerModal(false);
    }
  };

  const hideNotification = () => {
    setIsCloseQuiz(false);
    setIsAnswerModal(true);
  };

  const closeHandler = () => {
    window.location.href = `${Route.WIGWAM}/${childId}`;
  };

  return (
    <>
      <XButton {...props} onClick={showNotificationHandler} style={{ zIndex: '1001' }} />
      {isCloseQuiz && (
        <Notification backdrop>
          <DefaultToast onAction={hideNotification} onClose={closeHandler} />
        </Notification>
      )}
    </>
  );
};

export default CloseQuizButton;
