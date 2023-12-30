import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthAxiosInstance } from '@/hooks';
import { useState } from 'react';

export const useDeleteBooks = (page: string) => {
  const axios = useAuthAxiosInstance();

  const [isDeleted, setIsDeleted] = useState(false);

  const { mutate: deleteBook, isPending } = useMutation({
    mutationFn: async (id: number) => {
      const endpoint = page === 'quizzes' ? 'quizzes' : 'books';
      await axios.delete(`${endpoint}/${id}/`);
    },
    onSuccess: data => {
      setIsDeleted(true);
    },
  });

  return { deleteBook, isPending, isDeleted, setIsDeleted };
};
