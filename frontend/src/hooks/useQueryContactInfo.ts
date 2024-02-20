import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/constants/api';
import axios from 'axios';

export const useQueryContactInfo = () => {
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
  });

  return { contacts, contactsLoading, fetchError };
};
