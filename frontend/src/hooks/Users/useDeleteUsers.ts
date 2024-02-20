import { useMutation } from '@tanstack/react-query';
import { useAuthAxiosInstance } from '@/hooks';
import { useState } from 'react';

export const useDeleteUsers = () => {
  const axios = useAuthAxiosInstance();

  const [isDeleted, setIsDeleted] = useState(false);

  const { mutate: deleteUser, isPending } = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`users/${id}/`);
    },
    onSuccess: data => {
      setIsDeleted(true);
    },
  });

  return { deleteUser, isPending, isDeleted, setIsDeleted };
};
