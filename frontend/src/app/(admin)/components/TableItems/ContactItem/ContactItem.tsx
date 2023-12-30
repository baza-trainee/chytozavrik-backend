'use client';

import React, { useState } from 'react';

import { Button } from 'components/common';
import { Contact } from '@/types/Contacts';
import { formattedDate } from '@/utils/formatDate';
import { XCircle } from 'lucide-react';
import { Input, validation } from '@/components/common/form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEditContacts } from '@/hooks/useEditContacts';
import ModalWindows from '@/app/(admin)/admin/contacts/components/ModalWindows';
import styles from './ContactItem.module.scss';

const schema = yup.object({
  first_phone: validation.first_phone,
  second_phone: validation.second_phone,
  email: validation.email,
});

export interface ContactInfo {
  first_phone: string;
  second_phone?: string | undefined;
  email: string;
}

const ContactItem = ({
  id,
  first_phone: firstPhone,
  second_phone: secondPhone,
  email,
  updated_at: updated,
}: Contact) => {
  const [isDiscard, setIsDiscard] = useState(false);
  const [isEmptySecondPhone, setIsEmptySecondPhone] = useState(false);
  const { editContact, isPending, error, setIsSuccess, isSuccess } = useEditContacts();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid, isDirty },
    reset,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    // eslint-disable-next-line camelcase
    defaultValues: {
      first_phone: firstPhone || '',
      second_phone: secondPhone || '',
      email: email || '',
    },
  });

  const onSubmit = (data: ContactInfo) => {
    if (data.second_phone === '') {
      setIsEmptySecondPhone(true);
      editContact(data);
    } else {
      editContact(data);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.document}>
          <div className={styles.input_wrapper}>
            <div className={styles.data_wrapper}>
              <Input
                name="first_phone"
                type="text"
                control={control}
                icon={<XCircle onClick={() => setValue('first_phone', '')} />}
                className={styles.input_container}
                label="Номер телефону 1"
                resetField={() => setValue('first_phone', '')}
              />
              <div className={styles.date}>{formattedDate(updated)}</div>
            </div>
            <div className={styles.data_wrapper}>
              <Input
                name="second_phone"
                control={control}
                icon={<XCircle onClick={() => setValue('second_phone', '')} />}
                className={styles.input_container}
                label="Номер телефону 2"
                resetField={() => setValue('second_phone', '')}
              />
              <div className={styles.date}>{formattedDate(updated)}</div>
            </div>
            <div className={styles.data_wrapper}>
              <Input
                name="email"
                control={control}
                icon={<XCircle onClick={() => setValue('email', '')} />}
                className={styles.input_container}
                label="Email"
                resetField={() => setValue('email', '')}
              />
              <div className={styles.date}>{formattedDate(updated)}</div>
            </div>
          </div>
          <div className={styles.buttons}>
            <Button
              variant="outline"
              onClick={() => setIsDiscard(true)}
              disabled={isPending || !isDirty}
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              variant="filled"
              color="secondary"
              disabled={isPending || !isValid || !isDirty}
              isLoading={isPending}
            >
              Оновити
            </Button>
          </div>
          {(isSuccess || isDiscard || isEmptySecondPhone) && (
            <ModalWindows
              isEmptySecondPhone={isEmptySecondPhone}
              isDiscard={isDiscard}
              setIsDiscard={setIsDiscard}
              isSuccess={isSuccess}
              setIsSuccess={setIsSuccess}
              reset={reset}
              setIsEmptySecondPhone={setIsEmptySecondPhone}
              handleSubmit={() => handleSubmit(onSubmit)}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default ContactItem;
