import { useSession } from 'next-auth/react';
import { useAuthAxiosInstance } from '@/hooks/useAuthAxiosInstance';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/constants/api';

export const useQueryContactInfo = () => {
  const { status } = useSession();
  const axios = useAuthAxiosInstance();

  const {
    data: contacts,
    isLoading: contactsLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const res = await axios(`${BASE_URL}/contact-info/`);
      return res.data.data;
    },
    enabled: status === 'authenticated',
  });

  return { contacts, contactsLoading, fetchError };
};
