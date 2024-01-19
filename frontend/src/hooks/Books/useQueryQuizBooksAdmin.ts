import { useSession } from 'next-auth/react';
import { useAuthAxiosInstance } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/constants/api';
import { BookAdmin } from '@/types';

export const useQueryQuizBooksAdmin = (id?: number) => {
  const { status } = useSession();
  const axios = useAuthAxiosInstance();

  const { data: books, error: fetchError } = useQuery({
    queryKey: ['books-quiz-admin'],
    queryFn: async () => {
      const res = await axios(`${BASE_URL}/books?&page=1&page_size=100&is_not_quiz=true`);
      return res.data.data;
    },
    enabled: status === 'authenticated' && id === undefined,
    select: data =>
      data.results.map((book: BookAdmin) => ({
        value: book.id,
        label: book.title,
        author: book.author,
      })),
  });

  return { books, fetchError };
};
