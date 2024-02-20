import React from 'react';
import Image from 'next/image';
import wigwamTextData from '@/app/(wigwam)/components/Wigwam/wigwamTextData.json';
import styles from '../WigwamBooks.module.scss';

const NotFoundBook = () => (
  <div className={styles.notfound}>
    <Image src="/images/wigwam/not_found.svg" alt="not found" width={100} height={100} />
    <p>{wigwamTextData[10]}</p>
  </div>
);

export default NotFoundBook;
