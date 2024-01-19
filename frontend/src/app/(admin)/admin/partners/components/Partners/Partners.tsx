'use client';

import React, { useState, Fragment } from 'react';
import { useDeleteChosenPartners } from '@/hooks/Partners/useDeleteChosenPartners';
import { NoResults, TableHeader, AdminHeader, PartnerItem } from '@/app/(admin)/components';
import { useQueryPartners } from '@/hooks/Partners/useQueryPartners';
import { Spinner } from '@/components/common';
import NoSearchResults from '@/app/(admin)/components/NoResults/NoSearchResults';
import Pagination from '@/components/Pagination/Pagination';
import { Partner } from '@/types/admin/PartnersType';
import Modal from 'components/common/ModalActions/Modal';
import styles from './Partners.module.scss';

const Partners = ({ searchValue = '' }: { searchValue: string | null }) => {
  const [selected, setSelected] = useState<number[]>([]);
  const { handleDeletePartners, deletingPartners, setIsDeleted, isDeleted } =
    useDeleteChosenPartners();
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { partners, partnersLoading, fetchError } = useQueryPartners({
    currentPage: page,
    searchValue,
  });

  const count = partners?.count ? Math.ceil(partners.count / 8) : 0;

  const handleCheckboxChange = (checked: boolean, partnerId: number) => {
    if (checked) {
      setSelected(prev => [...prev, partnerId]);
    } else {
      setSelected(prev => prev.filter(id => id !== partnerId));
    }
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div>
          <TableHeader
            variant="partners"
            colNames={['Назва', 'Дата  додавання']}
            handleDelete={() => setIsOpen(true)}
          />
          {partnersLoading && <Spinner className={styles.spinner} />}
          {fetchError && (
            <div className={styles.error}>Упс... Щось пішло не так: {fetchError.message}</div>
          )}
          {partners &&
            partners.count === 0 &&
            (searchValue ? (
              <NoSearchResults />
            ) : (
              <NoResults
                text="У вас ще немає доданих партнерів"
                image="/images/admin/briefcase.svg"
              />
            ))}
          <div>
            {partners?.results
              ?.sort((a: Partner, b: Partner) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return dateB - dateA;
              })
              .map((partner: Partner) => (
                <PartnerItem
                  key={partner.id}
                  partner={partner}
                  onCheckboxChange={handleCheckboxChange}
                  isDeleting={deletingPartners?.includes(partner.id)}
                />
              ))}
          </div>
        </div>
        {partners && !partnersLoading && partners.count > 8 && (
          <Pagination currentPage={page} onPageChange={page => setPage(page)} count={count} />
        )}
      </div>
      {isOpen && (
        <Modal
          type="question"
          message="Ви точно бажаєте видалити обраних партнерів?"
          title="Видалити партнерів"
          active={isOpen}
          setActive={() => setIsOpen(false)}
          successFnc={() => handleDeletePartners(selected)}
        />
      )}
      {isDeleted && (
        <Modal
          type="success"
          message="Обрані партнери успішно видалені"
          title="Успіх"
          active={isDeleted}
          setActive={() => setIsDeleted(false)}
        />
      )}
    </>
  );
};

export default Partners;
