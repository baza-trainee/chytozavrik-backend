'use client';

import React, { useEffect, useState } from 'react';
import { Spinner, Typography } from 'components/common';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDefaultValues } from '@/app/(admin)/admin/quizzes/hooks/useDefaultValues';
import { useQueryQuizById, useQueryQuizBooksAdmin } from '@/hooks';
import { transformData } from '@/app/(admin)/admin/quizzes/utils/transformData';
import { FormButtons, QuestionsList, QuizBookInput, UploadImage } from '@/app/(admin)/components';
import { SingleValue } from 'react-select';
import { useDebouncedCallback } from 'use-debounce';
import { validationSchema } from '@/app/(admin)/admin/quizzes/utils/validation/validationSchema';
import { AlertCircle } from 'lucide-react';
import { useAddQuiz } from '@/hooks/Books/useAddQuizz';
import Modal from 'components/common/ModalActions/Modal';
import { useEditQuiz } from '@/hooks/Books/useEditQuiz';
import { useRouter } from 'next/navigation';
import styles from './QuizForm.module.scss';

type FormFields = yup.InferType<typeof validationSchema>;

export type SelectedValue = {
  value: number;
  label: string;
  author: string;
};
const QuizzesForm = ({ id }: { id?: number }) => {
  const { quizById, quizLoading, fetchError: fetchErrorQuiz } = useQueryQuizById(id);
  const { books, fetchError: fetchErrorBooks } = useQueryQuizBooksAdmin(id);
  const defaultValues = useDefaultValues(quizById);
  const { addQuiz, addQuizError, isAddSuccess, setIsAddSuccess, isPendingAdd } = useAddQuiz();
  const { editQuiz, isEditSuccess, isPendingEdit, setIsEditSuccess, editQuizError } = useEditQuiz();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedValue, setSelectedValue] = useState<SingleValue<string>>('');
  const [searchValue, setSearchValue] = useState<SingleValue<string>>('');
  const [initialImg, setInitialImg] = useState('');
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (quizById) {
      setInitialImg(quizById.reward_as_url);
    }
  }, [quizById]);

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (quizById) methods.reset(defaultValues);
  }, [quizById, defaultValues]);

  const onFileChange = (file: File | null) => {
    setSelectedFile(file);
    setFileError('');
  };
  const submit = (data: FormFields) => {
    const transformedData = transformData(data);
    if (id && quizById) {
      const questionData = {
        questions: transformedData,
        book: quizById.book_info.id,
      };
      editQuiz({ quizId: id, rewardId: quizById.reward_id, questionData, selectedFile });
    } else {
      if (
        selectedFile &&
        selectedValue &&
        typeof selectedValue === 'object' &&
        'value' in selectedValue
      ) {
        const book = selectedValue as SelectedValue;
        const questionData = {
          questions: transformedData,
          book: book.value,
        };
        addQuiz({ questionData, selectedFile });
      } else {
        setError('Оберіть книгу');
        setFileError("Це поле об'язкове для заповнення");
      }
    }
  };
  const clearInput = () => {
    setSearchValue('');
    setSelectedValue('');
  };
  const handleInputChange = (value: SingleValue<string>) => {
    setSearchValue(value);
  };

  const debouncedHandleInputChange = useDebouncedCallback(handleInputChange, 500);
  const handleChange = (selectedOption: SingleValue<string>) => {
    setSelectedValue(selectedOption);
    setError('');
  };

  const setActiveHandler = () => {
    if (isAddSuccess) {
      setIsAddSuccess(false);
    } else {
      setIsEditSuccess(false);
    }
    router.back();
  };

  if (fetchErrorQuiz || fetchErrorBooks) {
    return (
      <div className={styles.error}>
        Упс...Щось пішло не так:{' '}
        {fetchErrorQuiz ? fetchErrorQuiz.message : fetchErrorBooks!.message}
      </div>
    );
  }

  if (quizLoading) {
    return <Spinner className={styles.spinner} />;
  }

  return (
    <FormProvider {...methods}>
      <form className={styles.form} onSubmit={methods.handleSubmit(submit)}>
        <QuizBookInput
          id={id}
          options={books || []}
          onChange={handleChange}
          clearInput={clearInput}
          selected={selectedValue}
          label="Назва книги"
          onInputChange={debouncedHandleInputChange}
          inputValue={searchValue}
          error={error}
          value={quizById && quizById.book_info.name}
        />
        <div className={styles.questions}>
          <Typography component="h2" variant="h5">
            Запитання
          </Typography>
          <QuestionsList />
        </div>
        <div>
          <UploadImage
            onFileChange={onFileChange}
            file={selectedFile}
            initialImg={initialImg}
            setInitialImg={setInitialImg}
            page="quizzes"
          />
          {(fileError || addQuizError || editQuizError) && (
            <div className={styles.errorMessage}>
              <AlertCircle width={14} height={14} />
              <span>{fileError || addQuizError?.message || editQuizError?.message}</span>
            </div>
          )}
        </div>
        <FormButtons isPendingAdd={isPendingAdd} isPendingEdit={isPendingEdit} />
      </form>
      {(isAddSuccess || isEditSuccess) && (
        <Modal
          type="success"
          message={isAddSuccess ? 'Вікторину додано' : 'Ваші зміни успішно збережено'}
          title={isAddSuccess ? 'Успіх!' : 'Збережено!'}
          active={isAddSuccess || isEditSuccess}
          setActive={setActiveHandler}
        />
      )}
    </FormProvider>
  );
};

export default QuizzesForm;
