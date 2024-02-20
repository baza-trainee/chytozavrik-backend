import { QuizInfoResponse } from '@/types';

type AnswerData = {
  is_true: boolean;
  text: string;
};

export type QuestionData = {
  text: string;
  answers: AnswerData[];
};

export const transformData = (formData: Record<string, any>) => {
  const transformedData: QuestionData[] = [];

  for (let i = 0; i < 5; i++) {
    const questionData: QuestionData = {
      text: formData[`question_${i}`],
      answers: [],
    };

    for (let j = 0; j < 3; j++) {
      questionData.answers.push({
        is_true: formData[`question_${i}_isTrue`] === `answer_${j}`,
        text: formData[`question_${i}_answer_${j}`],
      });
    }

    transformedData.push(questionData);
  }

  return transformedData;
};
