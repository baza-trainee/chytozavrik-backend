'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { AdminHeader } from '@/app/(admin)/components';
import { Button } from '@/components/common';
import { PasswordInput, validation } from '@/components/common/form';
import { changePasswordService } from '@/services/api';
import Modal from '@/components/common/ModalActions/Modal';

import { FetchResponseType, resetPasswordType } from '@/types';

import styles from './Password.module.scss';

type Token = {
  refresh: string;
  access: string;
};
type User = {
  email: string;
  id: string;
  is_superuser: boolean;
  token: Token;
};

const schema = yup.object({
  oldPassword: validation.password,
  password: validation.password,
  confirmPassword: validation.confirmPassword,
});

type FormData = yup.InferType<typeof schema>;

const defaultValues: FormData = {
  oldPassword: '',
  password: '',
  confirmPassword: '',
};

const ChangePassword = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    resetField,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
    context: { user },
  });

  const handleErrors = (result: FetchResponseType<resetPasswordType>) => {
    if (result.status === 'fail' && result.data.message) {
      const errorMessages = Object.values(result.data.message).flat().join(', ');
      setError(errorMessages);
    }
  };

  const handleSuccess = () => {
    reset(defaultValues);
    setIsSuccess(true);
  };

  const resetFieldByName = (name: keyof FormData) => () =>
    resetField(name, { keepError: true, keepDirty: true, keepTouched: true });

  const formSubmit = async (data: FormData) => {
    try {
      if (error) setError(null);

      const result = await changePasswordService(
        data.oldPassword,
        data.password,
        data.confirmPassword,
        user?.token?.access
      );

      handleErrors(result);

      if (result.status === 'success') {
        handleSuccess();
      }

      setIsOpen(false);
    } catch (error) {
      setError('Упс. Щось пішло не так. Спробуйте ще раз.');
    }
  };

  useEffect(() => {
    if (session) {
      setUser(session.user as User);
    }
  }, [session]);

  return (
    <div className={styles.password}>
      <AdminHeader
        withSearch={false}
        withButton={false}
        withClose={false}
        heading="Змінити пароль"
        closeFunc={() => setIsOpen(true)}
      />

      <form className={styles.form} onSubmit={handleSubmit(formSubmit)} noValidate>
        <div className={styles['inputs-group']}>
          <PasswordInput
            control={control}
            name="oldPassword"
            resetField={resetFieldByName('oldPassword')}
            label="Поточний пароль"
            placeholder=""
            autoComplete="new-password"
          />
          <PasswordInput
            control={control}
            name="password"
            resetField={resetFieldByName('password')}
            label="Новий пароль"
            placeholder=""
            autoComplete="new-password"
          />
          <PasswordInput
            control={control}
            name="confirmPassword"
            resetField={resetFieldByName('confirmPassword')}
            label="Новий пароль ще раз"
            placeholder=""
            autoComplete="new-password"
          />
          {error && <div className={styles.error}>{error}</div>}
          <Button
            color="secondary"
            type="button"
            disabled={isSubmitting || Object.keys(errors).length > 0}
            isLoading={isSubmitting}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Оновити пароль
          </Button>
          {isOpen && (
            <Modal
              type="question"
              message="Зверніть увагу, що зміна паролю може вплинути на ваш доступ до адмінпанелі. Впевнені, що хочете продовжити?"
              title="Підтвердження зміни паролю"
              active={isOpen}
              setActive={() => setIsOpen(false)}
              successFnc={handleSubmit(formSubmit)}
              cancelButtonText="Повернутись"
            />
          )}
          {isSuccess && (
            <Modal
              type="success"
              message="Ваші зміни успішно збережено"
              title="Збережено!"
              active={isSuccess}
              setActive={() => setIsSuccess(false)}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
