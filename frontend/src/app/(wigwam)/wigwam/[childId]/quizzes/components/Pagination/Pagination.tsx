'use client';

import React, { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PAGE_SIZE, Route } from '@/constants';
import { Button, Typography } from '@/components/common';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useMedia } from '@/hooks';
import styles from './Pagination.module.scss';

interface PaginationProps {
  count: number;
  next: string | null;
  previous: string | null;
  childId: string;
}

const Pagination: FC<PaginationProps> = ({ count, next, previous, childId }) => {
  const { deviceType } = useMedia();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 12);
  const search = searchParams.get('search') || '';
  const [pageList, setPageList] = useState<(string | number)[]>([]);

  useEffect(() => {
    const totalPages = Math.ceil(count / PAGE_SIZE);
    const newPageList = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        newPageList.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 4; i++) {
          newPageList.push(i);
        }
        newPageList.push('...');
        newPageList.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        newPageList.push(1);
        newPageList.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          newPageList.push(i);
        }
      } else {
        newPageList.push(1);
        newPageList.push('...');
        newPageList.push(currentPage - 1);
        newPageList.push(currentPage);
        newPageList.push(currentPage + 1);
        newPageList.push('...');
        newPageList.push(totalPages);
      }
    }

    setPageList(newPageList);
  }, [count, currentPage]);

  return (
    <nav className={styles.paginationContainer}>
      <Button
        className={!previous ? styles.linkDisabled : null}
        component="link"
        href={`${Route.WIGWAM}/${childId}/quizzes?search=${search}&page=${currentPage - 1}`}
        size="default"
        variant="outline"
        endIcon={deviceType === 'mobile' && <ChevronLeft />}
      >
        {deviceType !== 'mobile' && 'Назад'}
      </Button>
      <ul className={styles.buttonNumbers}>
        {pageList.map(pageNumber => (
          <li
            key={pageNumber}
            className={pageNumber !== '...' ? styles.buttonNumber : styles.ellipsis}
          >
            {pageNumber !== '...' ? (
              <Button
                component="link"
                href={`${Route.WIGWAM}/${childId}/quizzes?search=${search}&page=${pageNumber}`}
                size="default"
                variant="outline"
                selected={pageNumber === currentPage}
              >
                {pageNumber}
              </Button>
            ) : (
              <span>
                <Typography className={styles.ellipsis} component="p" variant="h5">
                  ...
                </Typography>
              </span>
            )}
          </li>
        ))}
      </ul>
      <Button
        className={!next ? styles.linkDisabled : null}
        component="link"
        href={`${Route.WIGWAM}/${childId}/quizzes?search=${search}&page=${currentPage + 1}`}
        size="default"
        variant="outline"
        endIcon={deviceType === 'mobile' && <ChevronRight />}
      >
        {deviceType !== 'mobile' && 'Вперед'}
      </Button>
    </nav>
  );
};

export default Pagination;
