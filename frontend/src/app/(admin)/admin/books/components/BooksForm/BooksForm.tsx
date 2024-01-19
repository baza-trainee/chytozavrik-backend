'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { validation } from 'components/common/form';
import { Button, Checkbox, Modal, Spinner } from 'components/common';
import { useRouter } from 'next/navigation';
import Input from 'components/common/form/Input/Input';
import UploadImage from '@/app/(admin)/components/UploadImageComponent/UploadImage';
import { useAddBook, useEditBook, useQueryBookById } from '@/hooks';
import { handleKeyDown } from '@/utils/handleKeyDown';
import styles from './BooksFrom.module.scss';

const schema = yup.object({
  title: validation.bookInput,
  author: validation.bookInput,
  is_recommended: validation.recommended,
});

type FormDatas = yup.InferType<typeof schema>;

const BooksForm = ({ id }: { id?: number }) => {
  const { bookById, bookLoading, fetchError } = useQueryBookById(id);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [initialImg, setInitialImg] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { addBook, isPendingAdd, isAddSuccess, setIsAddSuccess } = useAddBook();
  const { editBook, isEditSuccess, setIsEditSuccess, isPendingEdit } = useEditBook();

  useEffect(() => {
    if (bookById) {
      setInitialImg(bookById.cover_image);
    }
  }, [bookById]);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const defaultValues: FormDatas = {
    title: '',
    author: '',
    is_recommended: false,
  };

  const { control, reset, handleSubmit, resetField, setValue } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const { errors, isDirty, isValid, dirtyFields } = useFormState({ control });
  const isImage = initialImg || selectedFile;
  const isDisabled = Object.keys(errors).length > 0 || !isValid || !isImage;
  const router = useRouter();

  useEffect(() => {
    if (bookById) {
      reset({
        title: bookById.title,
        author: bookById.author,
        is_recommended: bookById.is_recommended,
      });
    }
  }, [bookById, reset]);

  const submit = (data: FormDatas) => {
    const formData = new FormData();
    if (id) {
      formData.append('id', id.toString());
      if (dirtyFields.title) {
        formData.append('title', data.title);
      }
      if (dirtyFields.author) {
        formData.append('author', data.author);
      }
      if (dirtyFields.is_recommended) {
        formData.append('is_recommended', data.is_recommended.toString());
      }
      if (selectedFile) {
        formData.append('cover_image', selectedFile);
      }
      editBook({ id, formData });
    } else {
      formData.append('title', data.title);
      formData.append('author', data.author);
      formData.append('is_recommended', data.is_recommended.toString());
      if (selectedFile) formData.append('cover_image', selectedFile);
      addBook(formData);
    }
  };

  return bookLoading ? (
    <Spinner className={styles.spinner} />
  ) : (
    <form className={styles.form} onSubmit={handleSubmit(submit)}>
      <div className={styles.inputs}>
        <div className={styles.textInputs}>
          <Input
            name="title"
            control={control}
            label="Назва книги"
            placeholder="Введіть назву книги"
            resetField={() => resetField('title')}
            onKeyDown={handleKeyDown}
          />
          <Input
            name="author"
            control={control}
            label="Автор книги"
            placeholder="Введіть автора книги"
            resetField={() => resetField('author')}
            onKeyDown={handleKeyDown}
          />
          <Checkbox name="is_recommended" control={control}>
            Рекомендовані книжки
          </Checkbox>
        </div>
        <UploadImage
          onFileChange={handleFileChange}
          file={selectedFile}
          initialImg={initialImg}
          setInitialImg={setInitialImg}
          page="books"
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
          message={isAddSuccess ? 'Книгу додано' : 'Ваші зміни успішно збережено'}
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

export default BooksForm;
