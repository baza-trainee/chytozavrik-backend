import { useSession } from 'next-auth/react';
import { useAuthAxiosInstance } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/constants/api';

export const useQueryQuizReward = (id: number | undefined) => {
  const { status } = useSession();
  const axios = useAuthAxiosInstance();

  const {
    data: quizReward,
    isLoading: rewardLoading,
    error: rewardFetchError,
  } = useQuery({
    queryKey: ['quizReward', id],
    queryFn: async () => {
      const res = await axios(`${BASE_URL}/quizzes-rewards/${id}/`);
      return res.data.data;
    },
    enabled: status === 'authenticated' && !!id,
  });

  return { quizReward, rewardLoading, rewardFetchError };
};
