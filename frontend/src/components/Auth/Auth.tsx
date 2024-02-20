'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSignOut } from '@/hooks';
import { Route } from '@/constants';
import Modal from '../common/Modal';
import SignIn from './SignIn';
import SignUp from './SignUp';
import SignUpSuccess from './SignUpSuccess';
import ResetPassword from './ResetPassword';
import NewPassword from './NewPassword';

type AuthType =
  | 'signin'
  | 'signup'
  | 'forgot-password'
  | 'signup-success'
  | 'reset-password'
  | 'new-password'
  | null;

const Auth = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authType, setAuthType] = useState<AuthType>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useSession();
  const { signOut } = useSignOut();

  const closeModal = () => {
    router.replace('/');
  };

  useEffect(() => {
    const type = searchParams.get('auth') as AuthType;

    setAuthType(type);
    setIsModalOpen(
      type === 'signin' ||
        type === 'signup' ||
        type === 'signup-success' ||
        type === 'reset-password' ||
        type === 'new-password'
    );
  }, [searchParams]);

  useEffect(() => {
    if (session.data?.user?.token?.error) {
      signOut({ callbackUrl: Route.HOME });
    }
  }, [session, signOut]);

  return (
    <>
      {isModalOpen && session.status !== 'authenticated' && authType === 'signin' && (
        <Modal onClose={closeModal}>
          <SignIn />
        </Modal>
      )}

      {isModalOpen && session.status !== 'authenticated' && authType === 'signup' && (
        <Modal onClose={closeModal}>
          <SignUp />
        </Modal>
      )}

      {isModalOpen && session.status === 'authenticated' && authType === 'signup-success' && (
        <Modal onClose={closeModal}>
          <SignUpSuccess />
        </Modal>
      )}

      {isModalOpen && authType === 'reset-password' && (
        <Modal onClose={closeModal}>
          <ResetPassword />
        </Modal>
      )}

      {isModalOpen && authType === 'new-password' && (
        <Modal onClose={closeModal}>
          <NewPassword />
        </Modal>
      )}
    </>
  );
};

export default Auth;
