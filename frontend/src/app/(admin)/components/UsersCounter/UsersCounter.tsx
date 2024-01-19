import React, { FC } from 'react';
import usersTextData from '@/constants/usersTextData.json';
import { UserType } from '@/types/User';
import styles from './UsersCounter.module.scss';

const UsersCounter = ({ users }: { users: number }) => {
  const counter = users || 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.title_wrapper}>
        <div className={styles.icon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8C7 10.7614 9.23858 13 12 13Z"
              stroke="#132D96"
            />
            <path
              d="M20 21C20 18.8783 19.1571 16.8434 17.6569 15.3431C16.1566 13.8429 14.1217 13 12 13C9.87827 13 7.84344 13.8429 6.34315 15.3431C4.84285 16.8434 4 18.8783 4 21"
              stroke="#132D96"
            />
          </svg>
        </div>
        <div className={styles.counter_title}>{usersTextData[5]}</div>
      </div>
      <div className={styles.counter_wrapper}>
        <p className={styles.counter}>{counter}</p>
      </div>
    </div>
  );
};

export default UsersCounter;
