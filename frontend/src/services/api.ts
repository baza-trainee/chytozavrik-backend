import { getServerSession } from 'next-auth';
import { authOptions } from '@/config';
import {
  FetchResponseType,
  TokenType,
  UserType,
  UsersQuizzesResponse,
  QuizCategory,
  sendPasswordResetEmailType,
  resetPasswordType,
} from '@/types';
import { fetch as axiosServerFetch } from '@/services/axios';
import { MonstersResponse } from '@/types/Monsters';
import { useQuizzesQuery } from '@/hooks/Quizzes/useQuizzesQuery';

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';

export const token: { access: string | null; refresh: string | null } = {
  access: null,
  refresh: null,
};

export const refreshTokenService = async (refreshToken: string) => {
  try {
    const response = await fetch(`${baseUrl}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!response.ok) {
      throw new Error(`Refresh token error: ${response.status}`);
    }
    const data = await response.json();
    token.access = data.access;
    token.refresh = refreshToken; // assuming the refresh token remains the same
    return data;
  } catch (error) {
    console.error('Error in refreshTokenService:', error);
    throw error;
  }
};

export const privateFetch = async (
  input: RequestInfo | URL,
  options: RequestInit | undefined = undefined
) => {
  const session = await getServerSession(authOptions);

  return fetch(input, {
    headers: {
      Authorization: `Bearer ${session?.user.token.access}`,
    },
    ...options,
  });
};

export const signInService = async (
  email: string,
  password: string
): Promise<FetchResponseType<TokenType>> => {
  const result = await fetch(`${baseUrl}/auth/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return result.json();
};

export const signUpService = async (
  email: string,
  password: string,
  confirmPassword: string
): Promise<FetchResponseType<UserType>> => {
  const result = await fetch(`${baseUrl}/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      password2: confirmPassword,
    }),
  });

  return result.json();
};

export const getUserInfoService = async (): Promise<FetchResponseType<UserType>> => {
  const result = await fetch(`${baseUrl}/users/me/`, {
    headers: {
      Authorization: `Bearer ${token.access}`,
    },
  });

  return result.json();
};

export const getUsersQuizzesService = async (
  childId: string,
  search: string = '',
  page: string = '1',
  category: QuizCategory = QuizCategory.All,
  IS_REVERSED: boolean = true,
  PAGE_SIZE: number = 12
): Promise<FetchResponseType<UsersQuizzesResponse>> => {
  const selectedCategory = category ? `&${category}` : '';

  const result = await privateFetch(
    `${baseUrl}/users/me/children/${childId}/quizzes/?page=${page}&page_size=${PAGE_SIZE}&reverse=${IS_REVERSED}&search=${search}${selectedCategory}`
  );
  return result.json();
};

export const sendPasswordResetEmailService = async (
  email: string
): Promise<FetchResponseType<sendPasswordResetEmailType>> => {
  const result = await fetch(`${baseUrl}/users/password/reset/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
    }),
  });

  return result.json();
};

export const newPasswordService = async (
  newPassword1: string,
  newPassword2: string,
  uid: string,
  token: string
): Promise<FetchResponseType<resetPasswordType>> => {
  const result = await fetch(`${baseUrl}/users/password/reset/confirm/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      new_password1: newPassword1,
      new_password2: newPassword2,
      uid,
      token,
    }),
  });

  return result.json();
};

export const getDocumentsService = async () => {
  const result = await privateFetch(`${baseUrl}/documents/`);
  return result.json();
};

export const getBooksService = async (search: string = '') => {
  const result = await axiosServerFetch(`${baseUrl}/books?page=1&page_size=7&search=${search}`);
  return result.data;
};

export const getMonstersService = async (childId: string) => {
  const { data } = await axiosServerFetch<MonstersResponse>(
    `${baseUrl}/users/me/children/${childId}/rewards`
  );

  if ('results' in data) {
    return data.results;
  }

  throw new Error(data.message);
};

export const changePasswordService = async (
  oldPassword: string,
  password: string,
  confirmPassword: string,
  access: string | undefined
): Promise<FetchResponseType<resetPasswordType>> => {
  const result = await fetch(`${baseUrl}/users/password/change/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify({
      old_password: oldPassword,
      new_password1: password,
      new_password2: confirmPassword,
    }),
  });

  return result.json();
};

export const getContactsService = async () => {
  const result = await axiosServerFetch(`${baseUrl}/contact-info/`);
  return result.data;
};

export const getChildById = async (childId: string) => {
  const { data } = await axiosServerFetch(`${baseUrl}/users/me/children/${childId}/`);
  return data;
};

export const getUsersService = async () => {
  const { data } = await axiosServerFetch(`${baseUrl}/statistics/users/`);
  return data;
};
export const getChildsService = async () => {
  const { data } = await axiosServerFetch(`${baseUrl}/statistics/child/`);
  return data;
};
export const getActiveChildsService = async () => {
  const { data } = await axiosServerFetch(`${baseUrl}/statistics/active-child/`);
  return data;
};
export const getQuizzesService = async () => {
  const { data } = await axiosServerFetch(`${baseUrl}/statistics/quizzes/`);
  return data;
};
