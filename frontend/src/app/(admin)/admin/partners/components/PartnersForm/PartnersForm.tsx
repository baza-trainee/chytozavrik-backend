'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { validation } from 'components/common/form';
import { Button, Modal, Spinner } from 'components/common';
import { useRouter } from 'next/navigation';
import Input from 'components/common/form/Input/Input';
import UploadImage from '@/app/(admin)/components/UploadImageComponent/UploadImage';
import { useAddPartner, useQueryPartnerById, useEditPartner } from '@/hooks';
import { handleKeyDown } from '@/utils/handleKeyDown';
import styles from './PartnersForm.module.scss';

const schema = yup.object({
  name: validation.partnerInput,
  link: validation.url,
});

type FormDatas = yup.InferType<typeof schema>;

const PartnersForm = ({ id }: { id?: number }) => {
  const { partnerById, partnerLoading, fetchError } = useQueryPartnerById(id);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [initialImg, setInitialImg] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { addPartner, isPendingAdd, isAddSuccess, setIsAddSuccess } = useAddPartner();
  const { editPartner, isEditSuccess, setIsEditSuccess, isPendingEdit } = useEditPartner();

  useEffect(() => {
    if (partnerById) {
      setInitialImg(partnerById.img);
    }
  }, [partnerById]);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const defaultValues: FormDatas = {
    name: '',
    link: '',
  };

  const { control, reset, handleSubmit, resetField, setValue, getValues } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const { errors, isDirty, isValid, dirtyFields } = useFormState({ control });
  const isImage = initialImg || selectedFile;
  const isDisabled = Object.keys(errors).length > 0 || !isValid || !isImage;
  const router = useRouter();

  useEffect(() => {
    if (partnerById) {
      reset({
        name: partnerById.name,
        link: partnerById.link,
      });
    }
  }, [partnerById, reset]);

  const submit = (data: FormDatas) => {
    const formData = new FormData();
    if (id) {
      if (dirtyFields.name) formData.append('name', data.name);
      if (dirtyFields.link) formData.append('link', data.link);
      if (selectedFile) formData.append('img', selectedFile);

      editPartner({ id, formData });
    } else {
      formData.append('name', data.name);
      formData.append('link', data.link);
      if (selectedFile) formData.append('img', selectedFile);
      addPartner(formData);
    }
  };
  const isFilled = () => {
    const formData = getValues();

    const isNameValid = !!formData.name && !errors.name;
    const isLinkValid = !!formData.link && !errors.link;

    return isNameValid && isLinkValid && isValid && !isImage;
  };
  return partnerLoading ? (
    <Spinner className={styles.spinner} />
  ) : (
    <form className={styles.form} onSubmit={handleSubmit(submit)}>
      <div className={styles.inputs}>
        <div className={styles.textInputs}>
          <Input
            name="name"
            control={control}
            label="Назва"
            placeholder="Введіть назву"
            resetField={() => resetField('name')}
            onKeyDown={handleKeyDown}
          />
          <Input
            name="link"
            control={control}
            label="Посилання"
            placeholder="Введіть посилання"
            resetField={() => resetField('link')}
            onKeyDown={handleKeyDown}
          />
        </div>
        <UploadImage
          onFileChange={handleFileChange}
          file={selectedFile}
          initialImg={initialImg}
          setInitialImg={setInitialImg}
          page="partners"
          isFilled={isFilled}
        />
      </div>
      <div className={styles.actions}>
        <Button
          variant="outline"
          color="primary"
          size="small"
          onClick={() => setIsOpen(true)}
          disabled={isDisabled || isPendingAdd || isPendingEdit}
        >
          Скасувати
        </Button>
        <Button
          type="submit"
          variant="filled"
          color="secondary"
          size="small"
          disabled={isDisabled || isPendingAdd || isPendingEdit}
          isLoading={isPendingAdd || isPendingEdit}
        >
          {id ? 'Зберегти' : 'Додати'}
        </Button>
      </div>

      {isOpen && (
        <Modal
          type="question"
          message="Ви точно хочете скасувати зміни? Вони не будуть збережені"
          title="Скасувати зміни"
          active={isOpen}
          setActive={() => setIsOpen(false)}
          successFnc={() => router.back()}
        />
      )}
      {(isAddSuccess || isEditSuccess) && (
        <Modal
          type="success"
          message={isAddSuccess ? 'Партнера додано' : 'Ваші зміни успішно збережено'}
          title={isAddSuccess ? 'Успіх!' : 'Збережено!'}
          active={isAddSuccess || isEditSuccess}
          setActive={() => {
            if (isAddSuccess) {
              setIsAddSuccess(false);
            } else {
              setIsEditSuccess(false);
            }
            router.back();
          }}
        />
      )}
    </form>
  );
};

export default PartnersForm;
