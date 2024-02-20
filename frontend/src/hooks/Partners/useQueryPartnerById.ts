import { useSession } from 'next-auth/react';
import { useAuthAxiosInstance } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/constants/api';

export const useQueryPartnerById = (id: number | undefined) => {
  const { status } = useSession();
  const axios = useAuthAxiosInstance();

  const {
    data: partnerById,
    isLoading: partnerLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ['partnerById', id],
    queryFn: async () => {
      const res = await axios(`${BASE_URL}/partners/${id}`);
      return res.data.data;
    },
    enabled: status === 'authenticated' && !!id,
  });

  return { partnerById, partnerLoading, fetchError };
};
