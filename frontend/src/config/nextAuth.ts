import type { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import {
  getUserInfoService,
  signInService,
  token as apiToken,
  refreshTokenService,
} from '@/services/api';
import { Route } from '@/constants';
import { log } from 'next/dist/server/typescript/utils';

/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable no-param-reassign */

const getMaxAge = (isRememberMe: boolean = true) =>
  isRememberMe ? 30 * 24 * 60 * 60 : 2 * 60 * 60; // 30 days : 2 hours

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Get token
          const serverToken = await signInService(
            credentials?.email as string,
            credentials?.password as string
          );
          // Check for errors
          if (serverToken.status === 'fail') {
            const errorMessage = serverToken.data.message;
            throw new Error(
              typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)
            );
          }

          apiToken.access = serverToken.data.access;
          apiToken.refresh = serverToken.data.refresh;

          // Get user info
          const userInfo = await getUserInfoService();
          // Check for errors
          if (userInfo.status === 'fail') {
            const errorMessage = userInfo.data.message;
            throw new Error(
              typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)
            );
          }

          const user: User = {
            ...userInfo.data,
            token: serverToken.data,
            id: userInfo.data.id.toString(),
            rememberMe: true,
          };

          if (user) {
            return user;
          }

          return null;
        } catch (error) {
          throw new Error((error as Error).message);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // eslint-disable-next-line no-param-reassign
      if (token.user) {
        session.user = { ...token.user };
      }

      return session;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.user = { ...user };
      }

      if (token.user?.token.access) {
        const decoded = jwtDecode<JwtPayload>(token.user?.token.access);
        const exp = (decoded.exp as number) * 1000;

        if (Date.now() > exp) {
          try {
            const refreshedToken = await refreshTokenService(token.user.token.refresh);
            if (refreshedToken.access) {
              token.user.token.access = refreshedToken.access;
              apiToken.access = refreshedToken.access;
            }
          } catch (error) {
            console.error('Error refreshing token:', error);
            token.user.token.error = 'Failed to refresh session.';
          }
        }
      }

      return token;
    },
  },
  session: {
    maxAge: getMaxAge(),
  },
  pages: {
    signIn: Route.SIGN_IN,
  },
};
