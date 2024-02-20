'use client';

import React, { Fragment, useState } from 'react';
import { useQueryUsers } from '@/hooks/Users/useQueryUsers';
import { useDeleteChosenUsers } from '@/hooks/Users/useDeleteChosenUsers';
import { useQueryClient } from '@tanstack/react-query';
import { UserType } from '@/types';
import { Spinner } from 'components/common';
import styles from '@/app/(admin)/components/TableItems/UserItem/UserItem.module.scss';
import usersTextData from '@/constants/usersTextData.json';
import UsersCounter from '@/app/(admin)/components/UsersCounter/UsersCounter';
import UserItem from '@/app/(admin)/components/TableItems/UserItem/UserItem';
import NoSearchResults from '@/app/(admin)/components/NoResults/NoSearchResults';
import Pagination from 'components/Pagination/Pagination';
import TableHeader from '../../components/TableHeader/TableHeader';
import NoResults from '../../components/NoResults/NoResults';
import Modal from '../../../../components/common/ModalActions/Modal';

const Users = ({ searchValue = '' }: { searchValue: string | null }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [isSelectedOpen, setIsSelectedOpen] = useState(false);
  const { usersLoading, users, fetchError } = useQueryUsers({ currentPage, searchValue });
  const { handleDeleteUsers, deleteUsers, isChosenDeleted, setIsChosenDeleted } =
    useDeleteChosenUsers();
  const queryClient = useQueryClient();

  if (fetchError) return <p>{usersTextData[0]}</p>;

  const count = users?.count ? Math.ceil(users.count / 11) : 0;

  const handleCheckboxChange = (checked: boolean, userId: number) => {
    if (checked) {
      setSelected(prev => [...prev, userId]);
    } else {
      setSelected(prev => prev.filter(id => id !== userId));
    }
  };

  return (
    <>
      <UsersCounter users={users?.count} />
      <section className={styles.usersWrapper}>
        <div className={styles.subWrap}>
          <TableHeader
            variant="users"
            handleDelete={() => setIsSelectedOpen(true)}
            colNames={['Email', 'Профілі дітей', 'Дата  реєстрації']}
          />
          {usersLoading && <Spinner className={styles.spinner} />}
          {users &&
            users.count === 0 &&
            (searchValue ? (
              <NoSearchResults />
            ) : (
              <NoResults text={usersTextData[1]} image={usersTextData[2]} />
            ))}
          {users?.results?.map((user: UserType) => (
            <Fragment key={user.id}>
              <UserItem
                user={user}
                onCheckboxChange={handleCheckboxChange}
                isDeleting={deleteUsers?.includes(user.id)}
              />
            </Fragment>
          ))}
        </div>
        {isSelectedOpen && (
          <Modal
            type="question"
            message={`Ви впевнені, що хочете видалити ${selected.length} користувачів?`}
            title={`Видалити ${selected.length} користувачів`}
            active={isSelectedOpen}
            setActive={() => setIsSelectedOpen(false)}
            successFnc={() => handleDeleteUsers(selected)}
          />
        )}
        {isChosenDeleted && (
          <Modal
            type="success"
            message={usersTextData[6]}
            title={usersTextData[4]}
            active={isChosenDeleted}
            setActive={() => {
              setIsChosenDeleted(false);
              queryClient.invalidateQueries({ queryKey: ['users'] });
            }}
          />
        )}
        {users && !usersLoading && users.count > 11 && (
          <Pagination
            size="small"
            count={count}
            onPageChange={page => setCurrentPage(page)}
            currentPage={currentPage}
          />
        )}
      </section>
    </>
  );
};

export default Users;
