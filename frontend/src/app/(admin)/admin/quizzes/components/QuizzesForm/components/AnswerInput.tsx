'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import { Input } from 'components/common/form';
import { useFormContext } from 'react-hook-form';
import styles from '../QuizForm.module.scss';

interface AnswerInputProps {
  answerIndex: number;
  questionIndex: number;
}

const AnswerInput = ({ answerIndex, questionIndex }: AnswerInputProps) => {
  const { control, resetField, register, trigger, setValue } = useFormContext();

  const handleOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    setValue(`question_${questionIndex}_isTrue`, selectedValue);
    await trigger(`question_${questionIndex}`);
  };

  return (
    <>
      <div className={styles.checkbox}>
        <input
          {...register(`question_${questionIndex}_isTrue`)}
          type="radio"
          id={`question_${questionIndex}_isTrue_${answerIndex}`}
          value={`answer_${answerIndex}`}
          onChange={handleOnChange}
        />
        <label htmlFor={`question_${questionIndex}_isTrue_${answerIndex}`} />
      </div>
      <Input
        name={`question_${questionIndex}_answer_${answerIndex}`}
        control={control}
        placeholder="Введіть відповідь"
        label={`Варіант відповіді ${answerIndex + 1}`}
        resetField={() => resetField(`question_${questionIndex}_answer_${answerIndex}`)}
        usage="admin"
      />
    </>
  );
};

export default AnswerInput;
