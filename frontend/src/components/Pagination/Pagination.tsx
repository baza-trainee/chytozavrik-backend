'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReactPaginate from 'react-paginate';
import classNames from 'classnames';
import styles from './Pagination.module.scss';

interface PaginationProps {
  size?: 'extraSmall' | 'small' | 'large';
  count: number;
  onPageChange: (page: number) => void;
  currentPage: number;
}

const Pagination = ({ size = 'small', count, onPageChange, currentPage }: PaginationProps) => {
  const paginationLink = {
    extraSmall: styles.extraSmall,
    small: styles.small,
    large: styles.large,
  };

  const labelClassName = {
    extraSmall: styles.labelExtraSmall,
    small: styles.labelSmall,
    large: styles.labelLarge,
  };

  return (
    <div className={styles.wrapper}>
      <ReactPaginate
        forcePage={currentPage - 1}
        previousLabel={size === 'extraSmall' ? <ChevronLeft /> : 'Назад'}
        previousClassName={classNames(labelClassName[size], styles.label)}
        nextLabel={size === 'extraSmall' ? <ChevronRight /> : 'Вперед'}
        nextClassName={classNames(labelClassName[size], styles.label, {
          [styles.disabled]: currentPage >= count,
        })}
        disabledClassName={styles.disabled}
        breakClassName={classNames(styles.breakClass)}
        breakLabel={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="5"
            viewBox="0 0 16 5"
            fill="none"
          >
            <path
              d="M2.13894 4.168C1.59494 4.168 1.13094 3.984 0.746938 3.616C0.362938 3.232 0.170938 2.752 0.170938 2.176C0.170938 1.584 0.354938 1.104 0.722938 0.736C1.10694 0.368 1.57894 0.184 2.13894 0.184C2.69894 0.184 3.16294 0.368 3.53094 0.736C3.91494 1.104 4.10694 1.584 4.10694 2.176C4.10694 2.752 3.91494 3.232 3.53094 3.616C3.14694 3.984 2.68294 4.168 2.13894 4.168ZM7.99831 4.168C7.45431 4.168 6.99031 3.984 6.60631 3.616C6.22231 3.232 6.03031 2.752 6.03031 2.176C6.03031 1.584 6.21431 1.104 6.58231 0.736C6.96631 0.368 7.43831 0.184 7.99831 0.184C8.55831 0.184 9.02231 0.368 9.39031 0.736C9.77431 1.104 9.96631 1.584 9.96631 2.176C9.96631 2.752 9.77431 3.232 9.39031 3.616C9.00631 3.984 8.54231 4.168 7.99831 4.168ZM13.8577 4.168C13.3137 4.168 12.8497 3.984 12.4657 3.616C12.0817 3.232 11.8897 2.752 11.8897 2.176C11.8897 1.584 12.0737 1.104 12.4417 0.736C12.8257 0.368 13.2977 0.184 13.8577 0.184C14.4177 0.184 14.8817 0.368 15.2497 0.736C15.6337 1.104 15.8257 1.584 15.8257 2.176C15.8257 2.752 15.6337 3.232 15.2497 3.616C14.8657 3.984 14.4017 4.168 13.8577 4.168Z"
              fill="#7791FA"
            />
          </svg>
        }
        pageCount={count}
        marginPagesDisplayed={1}
        pageRangeDisplayed={4}
        pageLinkClassName={classNames(paginationLink[size], styles.link)}
        onPageChange={event => onPageChange(event.selected + 1)}
        containerClassName={styles.pagination}
        activeLinkClassName={styles.active}
        renderOnZeroPageCount={null}
      />
    </div>
  );
};

export default Pagination;
