'use client';

import React, { useState } from 'react';
import { PenLine, Trash2 } from 'lucide-react';
import { AdminCheckBox } from '@/app/(admin)/components';
import { useDeletePartners } from '@/hooks/Partners/useDeletePartners';
import { useQueryClient } from '@tanstack/react-query';
import { Spinner } from 'components/common';
import { formattedDate } from '@/utils/formatDate';
import { Partner } from '@/types/admin/PartnersType';
import Modal from 'components/common/ModalActions/Modal';
import Link from 'next/link';
import { Route } from '@/constants';
import styles from './PartnerItem.module.scss';

interface PartnerItemProps {
  partner: Partner;
  onCheckboxChange: (checked: boolean, partnerId: number) => void;
  isDeleting: boolean;
}

const PartnerItem: React.FC<PartnerItemProps> = ({ partner, onCheckboxChange, isDeleting }) => {
  const { deletePartner, isPending, setIsDeleted, isDeleted } = useDeletePartners();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  return (
    <div className={styles.partner}>
      <AdminCheckBox
        id={partner.id}
        onChange={e => onCheckboxChange(e.target.checked, partner.id)}
      />
      <div className={styles.info}>
        <p className={styles.title}>{partner.name}</p>
        <p className={styles.date}>{formattedDate(partner.created_at)}</p>
      </div>
      <div className={styles.actions}>
        {isPending || isDeleting ? (
          <Spinner className={styles.spinner} />
        ) : (
          <>
            <div className={styles.actionItem}>
              <Link href={`${Route.PARTNERS_EDIT}/${partner.id}`}>
                <PenLine />
              </Link>
            </div>
            <div className={styles.actionItem} onClick={() => setIsOpen(true)}>
              <Trash2 />
            </div>
          </>
        )}
      </div>
      {isOpen && (
        <Modal
          type="question"
          message="Ви точно хочете видалити партнера?"
          title={`Видалити “${partner.name}”`}
          active={isOpen}
          setActive={() => setIsOpen(false)}
          successFnc={() => {
            deletePartner(partner.id);
          }}
        />
      )}
      {isDeleted && (
        <Modal
          type="success"
          message={`Партнера “${partner.name}” видалено`}
          title="Успіх!"
          active={isDeleted}
          setActive={() => {
            setIsDeleted(false);
            queryClient.invalidateQueries({ queryKey: ['partners'] });
          }}
        />
      )}
    </div>
  );
};

export default PartnerItem;
