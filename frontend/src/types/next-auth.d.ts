import { DefaultUser } from 'next-auth';
import type { TokenType } from '@/types';

/* eslint-disable no-unused-vars */

type AppToken = TokenType & {
  error?: string | null;
};

interface AppUser extends DefaultUser {
  token: AppToken;
  is_superuser: boolean;
  rememberMe: boolean;
}

declare module 'next-auth' {
  interface Session {
    user: AppUser;
  }
  interface User extends AppUser {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: AppUser;
  }
}
