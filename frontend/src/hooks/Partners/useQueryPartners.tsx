import { useSession } from 'next-auth/react';
import { useAuthAxiosInstance } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/constants/api';

interface useQueryPartners {
  currentPage: number;
  searchValue: string | null;
}

export const useQueryPartners = ({ currentPage, searchValue, ...rest }: useQueryPartners) => {
  const { status } = useSession();
  const axios = useAuthAxiosInstance();

  const {
    data: partners,
    isLoading: partnersLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ['partners', currentPage, searchValue],
    queryFn: async () => {
      const query = searchValue ? `search=${encodeURIComponent(searchValue)}` : '';
      const res = await axios(`${BASE_URL}/partners/?${query}&page=${currentPage}&page_size=8`);
      if (!res.data.data) {
        throw new Error('Unexpected response format: missing results');
      }
      return res.data.data;
    },
    enabled: status === 'authenticated',
    ...rest,
  });

  return { partners, partnersLoading, fetchError };
};
