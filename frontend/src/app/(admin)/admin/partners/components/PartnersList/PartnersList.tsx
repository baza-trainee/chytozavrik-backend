'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/app/(admin)/components';
import { Route } from '@/constants';
import Partners from '../Partners/Partners';
import styles from './PartnersList.module.scss';

const PartnersList = () => {
  const [searchValue, setSearchValue] = useState<string | null>(null);
  return (
    <div className={styles.partners}>
      <AdminHeader
        withSearch
        withButton
        buttonText="Додати партнера"
        withClose={false}
        heading="Партнери"
        setSearchWord={setSearchValue}
        href={`${Route.PARTNERS_ADD}`}
      />
      <div>
        <Partners searchValue={searchValue} />
      </div>
    </div>
  );
};

export default PartnersList;
