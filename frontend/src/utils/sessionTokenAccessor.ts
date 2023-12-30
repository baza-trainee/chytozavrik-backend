import { getServerSession } from 'next-auth';
import { authOptions } from '@/config';

export const getAccessToken = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    return session.user.token.access;
  }

  return null;
};
