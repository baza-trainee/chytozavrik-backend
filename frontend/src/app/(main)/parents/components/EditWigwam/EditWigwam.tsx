'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Typography } from 'components/common';
import AvatarFields from '@/app/(main)/parents/components/FormFields/AvaratsFields/AvatarFields';
import NameInput from '@/app/(main)/parents/components/FormFields/NameInput/NameInput';
import Buttons from '@/app/(main)/parents/components/FormFields/Buttons/Buttons';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import styles from './EditWigwam.module.scss';

type Props = {
  closeEditWigwam: () => void;
  id: number;
  kidName: string;
  kidAvatar: number;
};

type FormData = {
  name: string;
  avatar: number;
};

const defaultValues: FormData = {
  name: '',
  avatar: 0,
};

const EditWigwam = ({ id, kidName, kidAvatar, closeEditWigwam }: Props) => {
  const {
    register,
    setValue,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';

  const { mutate: submitData } = useMutation({
    mutationFn: async (formData: FormData) => {
      const formDataObject = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataObject.append(key, String(value));
      });
      await axios.patch(`${baseUrl}/users/me/children/${id}/`, formDataObject, {
        headers: {
          Authorization: `Bearer ${session?.user.token.access}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      resetField('name');
      queryClient.invalidateQueries({ queryKey: ['kids'] });
    },
  });

  const onSubmit: SubmitHandler<FormData> = async formData => {
    const modifiedFormData = {
      ...formData,
      avatar: Number(formData.avatar),
      id,
    };
    closeEditWigwam();
    await submitData(modifiedFormData);
  };

  useEffect(() => {
    setValue('name', kidName);
    setValue('avatar', kidAvatar);
  }, [kidName, kidAvatar]);

  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Typography className={styles.title} component="p" variant="h3">
          Редагувати вігвам
        </Typography>
        <div className={styles.formWrapper}>
          <div>
            <NameInput register={register} errors={errors} defaultValue={kidName} />
            <Buttons onClick={closeEditWigwam} secondBtnText="Зберегти" />
          </div>
          <AvatarFields register={register} errors={errors} selectedAvatar={kidAvatar} />
        </div>
      </form>
    </section>
  );
};

export default EditWigwam;
