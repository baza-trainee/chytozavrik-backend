import { useSession } from 'next-auth/react';
import { useAuthAxiosInstance } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/constants/api';

interface useQueryUsersProps {
  currentPage: number;
  searchValue: string | null;
}

export const useQueryUsers = ({ currentPage, searchValue }: useQueryUsersProps) => {
  const { status } = useSession();
  const axios = useAuthAxiosInstance();
  console.log(currentPage);
  console.log(searchValue);
  const {
    data: users,
    isLoading: usersLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ['users', currentPage, searchValue],
    queryFn: async () => {
      const query = searchValue ? `search=${encodeURIComponent(searchValue)}&` : '';
      const res = await axios(`${BASE_URL}/users/?${query}page=${currentPage}&page_size=11`);
      return res.data.data;
    },
    enabled: status === 'authenticated',
  });

  return { users, usersLoading, fetchError };
};
