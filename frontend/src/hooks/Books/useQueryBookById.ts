import { useSession } from 'next-auth/react';
import { useAuthAxiosInstance } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/constants/api';

export const useQueryBookById = (id: number | undefined) => {
  const { status } = useSession();
  const axios = useAuthAxiosInstance();

  const {
    data: bookById,
    isLoading: bookLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ['bookById', id],
    queryFn: async () => {
      const res = await axios(`${BASE_URL}/books/${id}/`);
      return res.data.data;
    },
    enabled: status === 'authenticated' && !!id,
  });

  return { bookById, bookLoading, fetchError };
};
