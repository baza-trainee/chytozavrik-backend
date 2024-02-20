import { useSession } from 'next-auth/react';
import { useAuthAxiosInstance } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/constants/api';

export const useFetchChildren = () => {
  const { status } = useSession();
  const axios = useAuthAxiosInstance();

  const {
    data: children,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['children'],
    queryFn: async () => {
      const { data } = await axios(`${BASE_URL}/users/me/children/`);
      return data.data;
    },
    enabled: status === 'authenticated',
  });

  return { children, isLoading, error };
};
