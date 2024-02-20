import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_URL } from '@/constants/api';

export const useGetDocuments = () => {
  const { data: documents } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await axios(`${BASE_URL}/documents/`);
      return res.data.data.data;
    },
  });

  return { documents };
};
