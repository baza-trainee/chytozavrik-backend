'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { Container, Typography } from 'components/common';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import AvatarFields from '@/app/(main)/parents/components/FormFields/AvaratsFields/AvatarFields';
import NameInput from '@/app/(main)/parents/components/FormFields/NameInput/NameInput';
import Buttons from '@/app/(main)/parents/components/FormFields/Buttons/Buttons';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import styles from './CreateWigwam.module.scss';

type Props = {
  setWigwam: Dispatch<SetStateAction<boolean>>;
};

type FormData = {
  name: string;
  avatar: number;
};

const defaultValues: FormData = {
  name: '',
  avatar: 1,
};

const CreateWigwam = ({ setWigwam }: Props) => {
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm({ defaultValues });
  const createWigwamRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';

  const { mutate: submitData } = useMutation({
    mutationFn: async (formData: FormData) => {
      await axios.post(`${baseUrl}/users/me/children/`, formData, {
        headers: {
          Authorization: `Bearer ${session?.user.token.access}`,
        },
      });
    },
    onSuccess: () => {
      resetField('name');
      queryClient.invalidateQueries({ queryKey: ['kids'] });
    },
  });

  const onSubmit: SubmitHandler<FormData> = formData => {
    const modifiedFormData = {
      ...formData,
      avatar: Number(formData.avatar),
    };
    setWigwam(false);
    submitData(modifiedFormData);
  };

  useEffect(() => {
    if (createWigwamRef.current) {
      createWigwamRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }, []);

  return (
    <section className={styles.section} ref={createWigwamRef}>
      <Container className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Typography className={styles.title} component="p" variant="h3">
            Створити вігвам
          </Typography>
          <div className={styles.formWrapper}>
            <div>
              <NameInput register={register} errors={errors} />
              <Buttons onClick={() => setWigwam(false)} secondBtnText="Створити" />
            </div>
            <AvatarFields
              register={register}
              errors={errors}
              selectedAvatar={defaultValues.avatar}
            />
          </div>
        </form>
      </Container>
    </section>
  );
};

export default CreateWigwam;
