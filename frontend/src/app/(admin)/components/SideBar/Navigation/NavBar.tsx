'use client';

import React, { useState } from 'react';
import { Route } from '@/constants';
import {
  Book,
  UsersIcon,
  File,
  Briefcase,
  UserSquare,
  PieChart,
  BookMarked,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MenuItemsType } from '@/types';
import { LinkButton, LockIcon, Neurology } from '@/app/(admin)/components';
import styles from './NavBar.module.scss';

type MenuItemNames = 'books' | 'quizzes' | 'recommended';

const menuItems: MenuItemsType = {
  books: {
    href: Route.BOOKS,
    icon: <Book color="white" />,
    anchor: 'Книги',
  },
  quizzes: {
    href: Route.QUIZZES,
    icon: <Neurology />,
    anchor: 'Вікторини',
  },
  recommended: {
    href: Route.RECOMMENDED,
    icon: <BookMarked color="white" />,
    anchor: 'Рекомендовані',
  },
};

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  type ActiveMenuItem = keyof typeof menuItems;
  const [activeMenuItem, setActiveMenuItem] = useState<ActiveMenuItem>('books');

  const toggleDropdown = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const openLinkHandler = (menuItemName: MenuItemNames) => {
    setActiveMenuItem(menuItemName);
    router.push(menuItems[menuItemName].href);
    setIsOpen(false);
  };

  const arrow = isOpen ? (
    <ChevronUp color="white" onClick={toggleDropdown} />
  ) : (
    <ChevronDown color="white" onClick={toggleDropdown} />
  );

  return (
    <nav className={styles.navigation}>
      <LinkButton
        prefetch={false}
        href="/admin"
        anchor="Користувачі"
        icon={<UsersIcon color="white" />}
        component="link"
      />
      <LinkButton
        component="button"
        href={menuItems[activeMenuItem].href}
        anchor={menuItems[activeMenuItem].anchor}
        icon={menuItems[activeMenuItem].icon}
        iconOpen={arrow}
        onClick={() => openLinkHandler(activeMenuItem)}
      />
      {isOpen &&
        (Object.keys(menuItems) as Array<keyof MenuItemsType>).map(
          itemName =>
            itemName !== activeMenuItem && (
              <LinkButton
                key={itemName}
                component="button"
                href={menuItems[itemName].href}
                anchor={menuItems[itemName].anchor}
                icon={menuItems[itemName].icon}
                onClick={() => openLinkHandler(itemName)}
              />
            )
        )}
      <LinkButton
        prefetch={false}
        component="link"
        href={Route.DOCUMENTS}
        anchor="Документи"
        icon={<File color="white" />}
      />
      <LinkButton
        prefetch={false}
        component="link"
        href={Route.PARTNERS}
        anchor="Партнери"
        icon={<Briefcase color="white" />}
      />
      <LinkButton
        prefetch={false}
        component="link"
        href={Route.CONTACTS}
        anchor="Контакти"
        icon={<UserSquare color="white" />}
      />
      <LinkButton
        prefetch={false}
        component="link"
        href={Route.STATS}
        anchor="Статистика"
        icon={<PieChart color="white" />}
      />
      <LinkButton
        prefetch={false}
        component="link"
        href={Route.CHANGE_PASS}
        anchor="Змінити пароль"
        icon={<LockIcon stroke="white" />}
      />
    </nav>
  );
};

export default NavBar;
