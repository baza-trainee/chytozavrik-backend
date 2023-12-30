import { Route } from '@/constants';
import { ReactNode } from 'react';

export type MenuItemsType = {
  books: {
    href: Route;
    icon: ReactNode;
    anchor: string;
  };
  quizzes: {
    href: Route;
    icon: ReactNode;
    anchor: string;
  };
  recommended: {
    href: Route;
    icon: ReactNode;
    anchor: string;
  };
};
