import { useAuthAxiosInstance } from '@/hooks/useAuthAxiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ContactInfo } from '@/app/(admin)/components/TableItems/ContactItem/ContactItem';

export const useEditContacts = () => {
  const axios = useAuthAxiosInstance();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    mutate: editContact,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (contactInfo: ContactInfo) => {
      await axios.patch(`contact-info/`, contactInfo);
    },
    onSuccess: () => {
      setIsSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['contact-info'] });
    },
  });

  return { editContact, isPending, error, setIsSuccess, isSuccess };
};
