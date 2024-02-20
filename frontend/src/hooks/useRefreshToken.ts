import { useSession, signIn } from 'next-auth/react';
import { axiosClient } from '@/services/axios';

export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    if (session?.user?.token?.refresh) {
      try {
        const res = await axiosClient.post('/auth/token/refresh/', {
          refresh: session.user.token.refresh,
          rememberMe: session.user.rememberMe, // Pass rememberMe flag
        });

        const newAccessToken = res.data.access;
        if (newAccessToken) {
          await signIn(
            'credentials',
            {
              ...session.user,
              token: { ...session.user.token, access: newAccessToken },
            },
            { redirect: false as unknown as string }
          );
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        // Additional error handling as needed
      }
    }
  };

  return refreshToken;
};
