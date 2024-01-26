'use client';

import { useState, type ButtonHTMLAttributes } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { XButton } from '@/components/common';
import { Route } from '@/constants';
import { useQueryClient } from '@tanstack/react-query';
import { Notification, DefaultToast } from '../Notification';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

const CloseQuizButton = (props: Props) => {
  const [isShowNotification, setIsShowNotification] = useState(false);
  const { childId } = useParams();
  const queryClient = useQueryClient();

  const router = useRouter();

  const showNotificationHandler = () => {
    setIsShowNotification(true);
  };

  const hideNotification = () => {
    setIsShowNotification(false);
  };

  const closeHandler = () => {
    window.location.href = `${Route.WIGWAM}/${childId}`;
  };

  return (
    <>
      <XButton {...props} onClick={showNotificationHandler} />
      {isShowNotification && (
        <Notification backdrop>
          <DefaultToast onAction={hideNotification} onClose={closeHandler} />
        </Notification>
      )}
    </>
  );
};

export default CloseQuizButton;
