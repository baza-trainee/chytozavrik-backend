'use client';

import React, { Fragment, useState } from 'react';
import { AdminCheckBox } from '@/app/(admin)/components';
import { Trash2 } from 'lucide-react';
import { UserType } from '@/types';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { useDeleteUsers } from '@/hooks/Users/useDeleteUsers';
import usersTextData from '@/constants/usersTextData.json';
import { Spinner } from 'components/common';
import Modal from '../../../../../components/common/ModalActions/Modal';
import styles from './UserItem.module.scss';

interface UserItemProps {
  user: UserType;
  onCheckboxChange: (checked: boolean, bookId: number) => void;
  isDeleting: boolean;
}
const UserItem = ({ user, onCheckboxChange, isDeleting }: UserItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { deleteUser, setIsDeleted, isDeleted, isPending } = useDeleteUsers();

  return (
    <div className={styles.userItem}>
      <div className={styles.checkbox}>
        <AdminCheckBox id={user.id} onChange={e => onCheckboxChange(e.target.checked, user.id)} />
      </div>
      <div className={styles.userInfo}>
        <p className={styles.email}>{user.email}</p>
        <div className={styles.names}>
          {user.childs
            ? user.childs.map((child, index) => (
                <Fragment key={index}>
                  {index > 0 && index % 3 === 0 && <div className={styles.namesRow} />}{' '}
                  <span>{child}</span>
                </Fragment>
              ))
            : 'Дітей не додано'}
        </div>
        <p className={styles.date}> {format(new Date(user.date_joined), 'dd.MM.yyyy')}</p>
      </div>
      <div
        className={styles.delete}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {isPending || isDeleting ? <Spinner /> : <Trash2 />}
      </div>
      {isOpen && (
        <Modal
          type="question"
          message={usersTextData[3]}
          title={`Видалити “${user.email}”`}
          active={isOpen}
          setActive={() => setIsOpen(false)}
          successFnc={() => {
            deleteUser(user.id);
          }}
        />
      )}
      {isDeleted && (
        <Modal
          type="success"
          message={`Користувача “${user?.email}” було видалено`}
          title={usersTextData[4]}
          active={isDeleted}
          setActive={() => {
            setIsDeleted(false);
            queryClient.invalidateQueries({ queryKey: ['users'] });
          }}
        />
      )}
    </div>
  );
};

export default UserItem;
