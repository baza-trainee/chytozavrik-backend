'use client';

import React from 'react';
import { AdminCheckBox } from '@/app/(admin)/components';
import { Trash2 } from 'lucide-react';
import styles from './UserItem.module.scss';

const UserItem = () => (
  <div className={styles.userItem}>
    <div className={styles.checkbox}>
      <AdminCheckBox id={0} onChange={e => console.log(e.target.checked, 0)} />
    </div>
    <div className={styles.userInfo}>
      <p className={styles.email}>loginloginloginloginloginlogin@gmail.com</p>
      <div className={styles.names}>
        <span>Максим</span>
        <span>Анатолій</span>
        <span>Олександр</span>
        <span>Станіслав</span>
        <span>Володимир</span>
        <span>Костянтин</span>
      </div>
      <p className={styles.date}>08.08.2023</p>
    </div>
    <div className={styles.delete}>
      <Trash2 />
    </div>
  </div>
);

export default UserItem;
