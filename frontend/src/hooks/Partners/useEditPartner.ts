'use client';

import { useAuthAxiosInstance } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export const useEditPartner = () => {
  const axios = useAuthAxiosInstance();
  const queryClient = useQueryClient();
  const [isEditSuccess, setIsEditSuccess] = useState(false);

  const { mutate: editPartner, isPending: isPendingEdit } = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      await axios.patch(`partners/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      setIsEditSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
  });

  return { editPartner, isPendingEdit, isEditSuccess, setIsEditSuccess };
};
