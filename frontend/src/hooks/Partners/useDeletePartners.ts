import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthAxiosInstance } from '@/hooks';
import { useState } from 'react';

export const useDeletePartners = () => {
  const axios = useAuthAxiosInstance();

  const [isDeleted, setIsDeleted] = useState(false);

  const { mutate: deletePartner, isPending } = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`partners/${id}/`);
    },
    onSuccess: data => {
      setIsDeleted(true);
    },
  });

  return { deletePartner, isPending, isDeleted, setIsDeleted };
};
