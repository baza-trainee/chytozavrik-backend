'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Image from 'next/image';
import { Button, Typography } from '@/components/common';
import { Input, validation } from '@/components/common/form';
import { AlertCircle } from 'lucide-react';
import { sendPasswordResetEmailService } from '@/services/api';
import iconDone from 'public/images/iconDone.svg';
import authStyles from '../Auth.module.scss';
import styles from './ResetPassword.module.scss';

const schema = yup.object({
  email: validation.email,
});

type FormData = yup.InferType<typeof schema>;

const defaultValues: FormData = {
  email: '',
};

const ResetPassword = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    resetField,
    formState: { isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const resetFieldByName = (name: keyof FormData) => () =>
    resetField(name, { keepError: true, keepDirty: true, keepTouched: true });

  const formSubmit = async (data: FormData) => {
    try {
      if (error) setError(null);

      const result = await sendPasswordResetEmailService(data.email);

      if (result.status === 'fail' && result.data.message) {
        setError(result.data.message);
        return;
      }

      setIsSent(true);
    } catch (error) {
      setError('Упс. Щось пішло не так. Спробуйте ще раз.');
    }
  };

  return (
    <div className={authStyles.dialog}>
      {isSent ? (
        <>
          <Image
            width={48}
            height={48}
            src={iconDone}
            alt="icon done"
            className={styles.iconDone}
          />
          <Typography className={authStyles.title} component="h5" variant="h5">
            Електронний лист надіслано!
          </Typography>
          <Typography className={(authStyles.text, styles.textDone)} component="p" variant="body">
            Перевірте свою електронну пошту та перейдіть за посиланням, яке ми надіслали, щоб
            продовжити.
          </Typography>
        </>
      ) : (
        <>
          <Typography className={(authStyles.text, styles.text)} component="p" variant="body">
            Введіть свою електронну пошту, і ми надішлемо вам посилання для відновлення пароля.
          </Typography>
          <form className={authStyles.form} onSubmit={handleSubmit(formSubmit)} noValidate>
            <div className={(authStyles['inputs-group'], styles['inputs-group'])}>
              <Input
                control={control}
                type="email"
                name="email"
                resetField={resetFieldByName('email')}
                label="E-mail"
                placeholder=""
                autoComplete="username"
                autoFocus
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
                {isSubmitting ? '' : 'Отримати посилання'}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
