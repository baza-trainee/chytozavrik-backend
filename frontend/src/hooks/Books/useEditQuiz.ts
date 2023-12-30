'use client';

import { useAuthAxiosInstance } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { QuestionData } from '@/app/(admin)/admin/quizzes/utils/transformData';

interface QuizData {
  questions: QuestionData[];
}

export const useEditQuiz = () => {
  const axios = useAuthAxiosInstance();
  const queryClient = useQueryClient();
  const [isEditSuccess, setIsEditSuccess] = useState(false);

  const {
    mutate: editQuiz,
    isPending: isPendingEdit,
    error: editQuizError,
  } = useMutation({
    mutationFn: async ({
      quizId,
      rewardId,
      questionData,
      selectedFile,
    }: {
      quizId: number;
      rewardId: number;
      questionData: QuizData;
      selectedFile?: File | null;
    }) => {
      await axios.patch(`quizzes/${quizId}`, questionData);

      if (selectedFile) {
        const formDataReward = new FormData();
        formDataReward.append('reward', selectedFile);
        formDataReward.append('quiz', quizId.toString());

        await axios.patch(`quizzes-rewards/${rewardId}`, formDataReward, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setIsEditSuccess(true);
    },
  });

  return { editQuiz, isEditSuccess, isPendingEdit, setIsEditSuccess, editQuizError };
};
