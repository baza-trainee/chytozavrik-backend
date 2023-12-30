'use client';

import React from 'react';
import { Input } from 'components/common/form';
import { AnswerInput } from '@/app/(admin)/components';
import { useFormContext } from 'react-hook-form';
import styles from '../QuizForm.module.scss';

const QuestionsList = () => {
  const { control, resetField } = useFormContext();

  return (
    <div className={styles['questions-form']}>
      {[...Array(5)].map((_, questionIndex) => (
        <div className={styles.questionBlock} key={questionIndex}>
          <div className={styles.question}>
            <Input
              name={`question_${questionIndex}`}
              control={control}
              label={`Питання ${questionIndex + 1}`}
              placeholder="Введіть питання для вікторини"
              resetField={() => resetField(`question_${questionIndex}`)}
              usage="admin"
            />
          </div>
          <div className={styles.answers}>
            {[...Array(3)].map((_, answerIndex) => (
              <div className={styles.answerBlock} key={answerIndex}>
                <AnswerInput questionIndex={questionIndex} answerIndex={answerIndex} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionsList;
