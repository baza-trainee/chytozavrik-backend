'use client';

import { useAuthAxiosInstance } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export const useDeleteChosenUsers = () => {
  const axios = useAuthAxiosInstance();
  const queryClient = useQueryClient();
  const [deleteUsers, setDeleteUsers] = useState<number[]>([]);
  const [isChosenDeleted, setIsChosenDeleted] = useState(false);

  const { mutate: deleteChosenUsers } = useMutation({
    mutationFn: async (selected: number[]) => {
      setDeleteUsers(selected);
      await Promise.all(
        selected.map(async id => {
          await axios.delete(`users/${id}/`);
        })
      );
    },

    onSettled: () => setDeleteUsers([]),
    onSuccess: () => {
      setIsChosenDeleted(true);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleDeleteUsers = (selectedUsers: number[]) => {
    setDeleteUsers(selectedUsers);
    deleteChosenUsers(selectedUsers);
  };

  return { handleDeleteUsers, deleteUsers, isChosenDeleted, setIsChosenDeleted };
};
