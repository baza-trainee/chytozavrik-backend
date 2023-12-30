'use client';

import { useAuthAxiosInstance } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export const useDeleteChosenPartners = () => {
  const axios = useAuthAxiosInstance();
  const queryClient = useQueryClient();
  const [deletingPartners, setDeletingPartners] = useState<number[]>([]);
  const [isDeleted, setIsDeleted] = useState(false);

  const { mutate: deleteChosenPartners } = useMutation({
    mutationFn: async (selected: number[]) => {
      setDeletingPartners(selected);
      await Promise.all(
        selected.map(async id => {
          await axios.delete(`partners/${id}/`);
        })
      );
    },
    onSettled: () => setDeletingPartners([]),
    onSuccess: () => {
      setIsDeleted(true);
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
  });

  const handleDeletePartners = (selectedPartners: number[]) => {
    setDeletingPartners(selectedPartners);
    deleteChosenPartners(selectedPartners);
  };

  return { handleDeletePartners, deletingPartners, isDeleted, setIsDeleted };
};
