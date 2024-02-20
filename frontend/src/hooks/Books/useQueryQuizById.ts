import { useSession } from 'next-auth/react';
import { useAuthAxiosInstance } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/constants/api';

export const useQueryQuizById = (id: number | undefined) => {
  const { status } = useSession();
  const axios = useAuthAxiosInstance();

  const {
    data: quizById,
    isLoading: quizLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ['quizById', id],
    queryFn: async () => {
      const res = await axios(`${BASE_URL}/quizzes/${id}/`);
      return res.data.data;
    },
    enabled: status === 'authenticated' && !!id,
  });

  return { quizById, quizLoading, fetchError };
};
