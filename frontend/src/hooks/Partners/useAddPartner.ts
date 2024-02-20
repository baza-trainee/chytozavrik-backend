'use client';

import { useAuthAxiosInstance } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export const useAddPartner = () => {
  const axios = useAuthAxiosInstance();
  const queryClient = useQueryClient();
  const [isAddSuccess, setIsAddSuccess] = useState(false);

  const { mutate: addPartner, isPending: isPendingAdd } = useMutation({
    mutationFn: async (formData: FormData) => {
      await axios.post('partners/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      setIsAddSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
  });

  return { addPartner, isPendingAdd, isAddSuccess, setIsAddSuccess };
};
