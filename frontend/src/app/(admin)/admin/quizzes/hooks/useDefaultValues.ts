'use client';

import { useEffect, useState } from 'react';
import { defaultValuesForm } from '@/app/(admin)/admin/quizzes/constants/defaultValues';
import { QuizInfoResponse } from '@/types';

type DefaultValues = {
  [key: string]: any;
};
export const useDefaultValues = (quizById?: QuizInfoResponse) => {
  const [defaultValues, setDefaultValues] = useState<DefaultValues>(defaultValuesForm);

  const findTrueAnswer = (questionIndex: number) => {
    const { questions } = quizById ?? {};
    const { answers } = questions?.[questionIndex] ?? {};

    if (!quizById || !quizById.questions || !quizById.questions[questionIndex]) {
      return null;
    }
    if (answers) {
      for (let i = 0; i < answers.length; i++) {
        if (answers[i].is_true) {
          return `answer_${i}`;
        }
      }
    }

    return null;
  };

  useEffect(() => {
    if (quizById && quizById.questions) {
      const newDefaultValues: DefaultValues = {};
      quizById.questions.forEach((question, i) => {
        newDefaultValues[`question_${i}`] = question.text;
        newDefaultValues[`question_${i}_isTrue`] = findTrueAnswer(i);
        question.answers.forEach((answer, j) => {
          newDefaultValues[`question_${i}_answer_${j}`] = answer.text;
          newDefaultValues[`question_${i}_answer_${j}_isTrue`] = answer.is_true;
        });
      });

      setDefaultValues(newDefaultValues);
    }
  }, [quizById]);

  return defaultValues;
};
