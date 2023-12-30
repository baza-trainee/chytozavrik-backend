'use client';

import { useAuthAxiosInstance } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { QuestionData } from '@/app/(admin)/admin/quizzes/utils/transformData';

interface QuizData {
  book: number;
  questions: QuestionData[];
}

export const useAddQuiz = () => {
  const axios = useAuthAxiosInstance();
  const queryClient = useQueryClient();
  const [isAddSuccess, setIsAddSuccess] = useState(false);

  const {
    mutate: addQuiz,
    isPending: isPendingAdd,
    error: addQuizError,
  } = useMutation({
    mutationFn: async ({
      questionData,
      selectedFile,
    }: {
      questionData: QuizData;
      selectedFile: Blob;
    }) => {
      const response = await axios.post('quizzes/', questionData);
      const quizID = response.data.data.id;
      const formDataReward = new FormData();
      formDataReward.append('reward', selectedFile);
      formDataReward.append('quiz', quizID);
      await axios.post('quizzes-rewards/', formDataReward, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setIsAddSuccess(true);
    },
  });

  return { addQuiz, isAddSuccess, isPendingAdd, setIsAddSuccess, addQuizError };
};
