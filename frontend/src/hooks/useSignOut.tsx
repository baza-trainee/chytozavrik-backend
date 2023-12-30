'use client';

import { useState } from 'react';
import { type SignOutParams, signOut as signOutLib } from 'next-auth/react';

export const useSignOut = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signOut = async (options?: SignOutParams<true> | undefined) => {
    setIsLoading(true);

    try {
      await signOutLib(options);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    signOut,
  };
};
