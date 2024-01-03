'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Typography } from '@/components/common';
import { Checkbox, Input, PasswordInput, validation } from '@/components/common/form';
import { AlertCircle } from 'lucide-react';
import { signUpService } from '@/services/api';
import { Route } from '@/constants';
import AuthLink from '../AuthLink';
import styles from '../Auth.module.scss';

const schema = yup.object({
  email: validation.email,
  password: validation.password,
  password2: validation.confirmPassword,
  rememberMe: validation.rememberMe,
  acceptedRules: validation.acceptedRules,
});

type FormData = yup.InferType<typeof schema>;

const defaultValues: FormData = {
  email: '',
  password: '',
  password2: '',
  rememberMe: false,
  acceptedRules: false,
};

const SignUp = () => {
  const {
    control,
    handleSubmit,
    resetField,
    setError: setFormError,
    watch,
    getValues,
    formState: { isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    // mode: 'onChange',
  });
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const resetFieldByName = (name: keyof FormData) => () =>
    resetField(name, { keepError: true, keepDirty: true, keepTouched: true });

  const formSubmit = async ({ rememberMe, ...data }: FormData) => {
    try {
      // clear error
      if (error) setError(null);
      // Signup request
      const result = await signUpService(data.email, data.password, data.password2);

      // Check for errors
      if (result.status === 'fail' && result.data.message) {
        // set server error
        if (typeof result.data.message === 'object') {
          const errorObj: { [key: string]: string[] } = result.data.message;

          Object.keys(errorObj).forEach(key => {
            const k = key as keyof FormData;
            setFormError(k, { message: errorObj[key].at(0) });
          });
        } else {
          setError(result.data.message);
        }

        return;
      }

      // Signin request
      // const user = await signIn('credentials', { redirect: false, ...data });
      const user = await signIn('credentials', {
        redirect: false,
        ...data,
        rememberMe: rememberMe ? '1' : '0',
      });

      // Show server errors
      if (user?.error) {
        // eslint-disable-next-line no-console
        console.log(user?.error);
      }
      // Redirect to the page, if the login was a success.
      if (user?.url) {
        router.replace(Route.SIGN_UP_SUCCESS);
      }
    } catch (error) {
      setError('Упс. Щось пішло не так. Спробуйте ще раз.');
    }
  };

  useEffect(() => {
    watch('acceptedRules');
  }, [watch]);

  return (
    <div className={styles.dialog}>
      <Typography className={styles.title} component="h2" variant="h2">
        Реєстрація
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
            label="Створити пароль"
            placeholder="Введіть свій пароль"
            autoComplete="new-password"
            isPass
            isShowMessage
          />
          <PasswordInput
            control={control}
            name="password2"
            resetField={resetFieldByName('password2')}
            label="Повторити пароль"
            placeholder="Повторіть свій пароль"
            autoComplete="new-password"
            isPass={false}
          />
        </div>

        <div className={styles['checkboxes-groups-signup']}>
          <Checkbox name="rememberMe" control={control}>
            Запам&apos;ятати мене
          </Checkbox>

          <Checkbox name="acceptedRules" control={control}>
            Я згоден з{' '}
            <a
              className={styles.link}
              href="/pdf/site-rules.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Правилами користування сайтом
            </a>
          </Checkbox>
        </div>

        <div className={styles['signup-group']}>
          <Typography component="p" variant="body">
            Ви вже зареєстровані?
          </Typography>
          <AuthLink href={Route.SIGN_IN}>Увійти в обліковий запис</AuthLink>
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
            disabled={!getValues().acceptedRules || isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting ? '' : 'Зареєструватися'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
