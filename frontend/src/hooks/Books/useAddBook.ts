'use client';

import { useAuthAxiosInstance } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export const useAddBook = () => {
  const axios = useAuthAxiosInstance();
  const queryClient = useQueryClient();
  const [isAddSuccess, setIsAddSuccess] = useState(false);

  const { mutate: addBook, isPending: isPendingAdd } = useMutation({
    mutationFn: async (formData: FormData) => {
      await axios.post('books/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      setIsAddSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  return { addBook, isPendingAdd, isAddSuccess, setIsAddSuccess };
};
