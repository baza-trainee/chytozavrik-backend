'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { newPasswordService } from '@/services/api';
import { Button, Typography } from '@/components/common';
import { PasswordInput, validation } from '@/components/common/form';
import { AlertCircle } from 'lucide-react';
import iconDone from 'public/images/iconDone.svg';
import { Route } from '@/constants';
import authStyles from '../Auth.module.scss';
import styles from '../ResetPassword/ResetPassword.module.scss';

const schema = yup.object({
  password: validation.password,
  confirmPassword: validation.confirmPassword,
});

type FormData = yup.InferType<typeof schema>;

const defaultValues: FormData = {
  password: '',
  confirmPassword: '',
};

const NewPassword = () => {
  const {
    control,
    handleSubmit,
    resetField,
    formState: { isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const uid = searchParams.get('uid') as string;
  const token = searchParams.get('token') as string;

  const resetFieldByName = (name: keyof FormData) => () =>
    resetField(name, { keepError: true, keepDirty: true, keepTouched: true });

  const formSubmit = async (data: FormData) => {
    try {
      // clear error
      if (error) setError(null);

      const result = await newPasswordService(data.password, data.confirmPassword, uid, token);

      if (result.status === 'fail' && result.data.message) {
        const errorMessages = Object.values(result.data.message).flat().join(', ');
        setError(errorMessages);
        return;
      }

      setIsSuccess(true);
    } catch (error) {
      setError('Упс. Щось пішло не так. Спробуйте ще раз.');
    }
  };

  const redirectToLoginPage = () => {
    router.replace(Route.SIGN_IN);
  };

  return (
    <div className={authStyles.dialog}>
      {isSuccess ? (
        <>
          <Image
            width={48}
            height={48}
            src={iconDone}
            alt="icon done"
            className={styles.iconDone}
          />
          <Typography className={(authStyles.title, styles.title)} component="h5" variant="h5">
            Ваш пароль успішно змінено
          </Typography>

          <Button
            onClick={redirectToLoginPage}
            className={authStyles['button-submit']}
            type="button"
            color="secondary"
          >
            {isSubmitting ? '' : 'Увійти'}
          </Button>
        </>
      ) : (
        <>
          <Typography className={authStyles.title} component="h3" variant="h3">
            Новий пароль
          </Typography>
          <form className={authStyles.form} onSubmit={handleSubmit(formSubmit)} noValidate>
            <div className={(authStyles['inputs-group'], styles['inputs-group'])}>
              <PasswordInput
                control={control}
                name="password"
                resetField={resetFieldByName('password')}
                label="Ввести новий пароль"
                placeholder=""
                autoComplete="new-password"
              />
              <PasswordInput
                control={control}
                name="confirmPassword"
                resetField={resetFieldByName('confirmPassword')}
                label="Повторити пароль"
                placeholder=""
                autoComplete="new-password"
              />
            </div>

            <div className={(authStyles['form-footer'], styles['form-footer'])}>
              {error && (
                <div className={authStyles.error}>
                  <AlertCircle className={authStyles['error-icon']} />
                  <span className={authStyles['error-message']}>{error}</span>
                </div>
              )}
              <Button
                className={authStyles['button-submit']}
                type="submit"
                color="secondary"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? '' : 'Скинути пароль'}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default NewPassword;
