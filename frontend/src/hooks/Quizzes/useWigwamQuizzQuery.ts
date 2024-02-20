import { useSession } from 'next-auth/react';
import { useAuthAxiosInstance } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/constants/api';

export const useWigwamQuizzQuery = (childId: string) => {
  const { status } = useSession();
  const axios = useAuthAxiosInstance();

  const { data } = useQuery({
    queryKey: ['wigwamQuiz', childId],
    queryFn: async () => {
      const { data } = await axios(`${BASE_URL}/users/me/children/${childId}/`);
      return data.data;
    },
    enabled: status === 'authenticated',
  });

  return { data };
};
