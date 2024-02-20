'use client';

import React, { useState } from 'react';
import Users from '@/app/(admin)/admin/components/Users';
import styles from '@/app/(admin)/admin/Admin.module.scss';
import AdminHeader from '../../components/Header/AdminHeader';

const UsersList = () => {
  const [searchValue, setSearchValue] = useState<string | null>(null);

  return (
    <div className={styles.users}>
      <AdminHeader
        withSearch
        withButton={false}
        withClose={false}
        heading="Користувачі"
        setSearchWord={setSearchValue}
      />
      <Users searchValue={searchValue} />
    </div>
  );
};

export default UsersList;
