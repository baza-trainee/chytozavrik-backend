import React from 'react';
import { Typography } from '@/components/common';
import Link from 'next/link';
import { Route } from '@/constants';
import { QuizCategory } from '@/types';
import styles from './CategoryTabs.module.scss';

interface CategoryTabsProps {
  childId: string;
  search?: string;
  page?: string;
  selectedCategory?: QuizCategory;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  childId,
  search = '',
  page = '',
  selectedCategory = QuizCategory.All,
}) => {
  // Utility function to generate class names
  const getTabClassName = (category: QuizCategory) =>
    selectedCategory === category ? `${styles.tab} ${styles.selected}` : styles.tab;

  // Utility function to generate url
  const generateUrl = (category: QuizCategory) => {
    const queryParams = [];

    if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
    if (page) queryParams.push(`page=${page}`);
    if (category) queryParams.push(`category=${category}`);

    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    return `${Route.WIGWAM}/${childId}/quizzes${queryString}`;
  };

  return (
    <div className={styles.tabs}>
      <Link className={getTabClassName(QuizCategory.All)} href={generateUrl(QuizCategory.All)}>
        <Typography component="h4" variant="h5">
          Всі вікторини
        </Typography>
      </Link>
      <Link
        className={getTabClassName(QuizCategory.Started)}
        href={generateUrl(QuizCategory.Started)}
      >
        <Typography component="h4" variant="h5">
          Розпочаті
        </Typography>
      </Link>
      <Link
        className={getTabClassName(QuizCategory.Completed)}
        href={generateUrl(QuizCategory.Completed)}
      >
        <Typography component="h4" variant="h5">
          Завершені
        </Typography>
      </Link>
    </div>
  );
};

export default CategoryTabs;
