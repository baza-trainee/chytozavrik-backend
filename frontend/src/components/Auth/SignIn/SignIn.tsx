'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AlertCircle } from 'lucide-react';
import { Button, Typography } from '@/components/common';
import { Checkbox, Input, PasswordInput, validation } from '@/components/common/form';
import { Route } from '@/constants';
import { isJson } from '@/utils/isJson';
import AuthLink from '../AuthLink';
import styles from '../Auth.module.scss';

const schema = yup.object({
  email: validation.email,
  password: validation.signUpPassword,
  rememberMe: validation.rememberMe,
});

type FormData = yup.InferType<typeof schema>;

const defaultValues: FormData = {
  email: '',
  password: '',
  rememberMe: false,
};

const SignIn = () => {
  const {
    control,
    handleSubmit,
    resetField,
    setError: setFormError,
    formState: { isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const resetFieldByName = (name: keyof FormData) => () =>
    resetField(name, { keepError: true, keepDirty: true, keepTouched: true });

  const formSubmit = async ({ rememberMe, ...data }: FormData) => {
    try {
      // clear error
      if (error) setError(null);

      const result = await signIn('credentials', { redirect: false, ...data });

      // Show server errors
      if (result?.error) {
        // set server error
        if (isJson(result.error)) {
          const errorObj = JSON.parse(result.error);

          Object.keys(errorObj).forEach(key => {
            const k = key as keyof FormData;
            setFormError(k, { message: errorObj[key].at(0) });
          });
        } else {
          setError(result.error);
        }

        return;
      }
      // Redirect to the page, if the login was a success.
      if (result?.url) {
        const url = new URL(result.url);
        const callbackUrl = url.searchParams.get('callbackUrl') ?? Route.HOME;

        router.replace(callbackUrl);
      }
    } catch (error) {
      setError('Упс. Щось пішло не так. Спробуйте ще раз.');
    }
  };

  return (
    <div className={styles.dialog}>
      <Typography className={styles.title} component="h2" variant="h2">
        Вхід
      </Typography>
      <form className={styles.form} onSubmit={handleSubmit(formSubmit)} noValidate>
        <div className={styles['inputs-group']}>
          <Input
            control={control}
            type="email"
            name="email"
            resetField={resetFieldByName('email')}
            label="E-mail"
            placeholder="Введіть свій e-mail"
            autoComplete="username"
            autoFocus
          />
          <PasswordInput
            control={control}
            name="password"
            resetField={resetFieldByName('password')}
            label="Ввести пароль"
            placeholder="Введіть свій пароль"
            autoComplete="current-password"
          />
        </div>

        <div className={styles['checkboxes-groups']}>
          <Checkbox className={styles.checkbox} name="rememberMe" control={control}>
            Запам&apos;ятати мене
          </Checkbox>
          <AuthLink className={(styles.link, styles.forgot)} href={Route.RESET_PASSWORD}>
            Забули пароль?
          </AuthLink>
        </div>

        <div className={styles['signup-group']}>
          <Typography component="p" variant="body">
            Ви ще не зареєстровані?
          </Typography>
          <AuthLink className={styles.link} href={Route.SIGN_UP}>
            Зареєструватися
          </AuthLink>
        </div>

        <div className={styles['form-footer']}>
          {error && (
            <div className={styles.error}>
              <AlertCircle className={styles['error-icon']} />
              <span className={styles['error-message']}>{error}</span>
            </div>
          )}
          <Button
            className={styles['button-submit']}
            type="submit"
            color="secondary"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting ? ` ` : 'Увійти'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
