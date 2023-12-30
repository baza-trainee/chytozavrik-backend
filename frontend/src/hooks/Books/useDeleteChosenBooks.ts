'use client';

import { useAuthAxiosInstance } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export const useDeleteChosenBooks = (page: string) => {
  const axios = useAuthAxiosInstance();
  const queryClient = useQueryClient();
  const [deletingBooks, setDeletingBooks] = useState<number[]>([]);
  const [isDeleted, setIsDeleted] = useState(false);

  const { mutate: deleteChosenBooks } = useMutation({
    mutationFn: async (selected: number[]) => {
      setDeletingBooks(selected);
      const endpoint = page === 'quizzes' ? 'quizzes' : 'books';
      await Promise.all(
        selected.map(async id => {
          await axios.delete(`${endpoint}/${id}/`);
        })
      );
    },

    onSettled: () => setDeletingBooks([]),
    onSuccess: () => {
      setIsDeleted(true);
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const handleDeleteBooks = (selectedBooks: number[]) => {
    setDeletingBooks(selectedBooks);
    deleteChosenBooks(selectedBooks);
  };

  return { handleDeleteBooks, deletingBooks, isDeleted, setIsDeleted };
};
