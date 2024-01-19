import { useSession } from 'next-auth/react';
import { useAuthAxiosInstance } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/constants/api';

interface useQueryBooks {
  currentPage: number;
  searchValue: string | null;
  page: 'books' | 'quizzes' | 'recommended';
  select?: ((data: any) => any) | undefined;
}

export const useQueryBooks = ({ currentPage, searchValue, page, ...rest }: useQueryBooks) => {
  const { status } = useSession();
  const axios = useAuthAxiosInstance();

  const {
    data: books,
    isLoading: booksLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ['books', page, currentPage, searchValue],
    queryFn: async () => {
      const query = searchValue ? `search=${encodeURIComponent(searchValue)}` : '';
      const endpoint = page === 'recommended' ? 'recommendation-books' : page;
      const res = await axios(`${BASE_URL}/${endpoint}?${query}&page=${currentPage}&page_size=7`);
      return res.data.data;
    },
    enabled: status === 'authenticated',
    ...rest,
  });

  return { books, booksLoading, fetchError };
};
