'use client';

/* eslint-disable dot-notation */
/* eslint-disable no-param-reassign */
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { axiosClient } from '@/services/axios';
import { useRefreshToken } from '@/hooks/useRefreshToken';

export const useAuthAxiosInstance = () => {
  const { data: session } = useSession();
  const refreshToken = useRefreshToken();
  useEffect(() => {
    const requestIntercept = axiosClient.interceptors.request.use(
      config => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${session?.user?.token.access}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    const responseIntercept = axiosClient.interceptors.response.use(
      response => response,
      async error => {
        const prevRequest = error.config;
        if (error.response.status === 401 && !prevRequest.sent) {
          prevRequest.sent = true;
          await refreshToken();
          prevRequest.headers['Authorization'] = `Bearer ${session?.user?.token.access}`;
          return axiosClient(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosClient.interceptors.request.eject(requestIntercept);
      axiosClient.interceptors.response.eject(responseIntercept);
    };
  }, [session, refreshToken]);

  return axiosClient;
};
