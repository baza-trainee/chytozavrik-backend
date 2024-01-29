'use client';

import { useSession } from 'next-auth/react';
import { useAuthAxiosInstance } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/constants/api';

export const useFetchMonsters = () => {
  const { status } = useSession();
  const axios = useAuthAxiosInstance();

  const { data } = useQuery({
    queryKey: ['recommendation'],
    queryFn: async () => {
      const { data } = await axios(`${BASE_URL}/recommendation-books`);
      return data.data.results;
    },
    enabled: status === 'authenticated',
  });

  return { data };
};
