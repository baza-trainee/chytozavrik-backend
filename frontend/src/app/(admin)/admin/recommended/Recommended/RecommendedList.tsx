'use client';

import React, { useState } from 'react';
import { AdminHeader, Books } from '@/app/(admin)/components';
import styles from '../../books/Books.module.scss';

const RecommendedList = () => {
  const [searchValue, setSearchValue] = useState<string | null>(null);

  return (
    <div className={styles.books}>
      <AdminHeader
        withSearch
        withButton={false}
        withClose={false}
        heading="Рекомендовані книжки"
        setSearchWord={setSearchValue}
      />
      <Books searchValue={searchValue} page="recommended" />
    </div>
  );
};

export default RecommendedList;
