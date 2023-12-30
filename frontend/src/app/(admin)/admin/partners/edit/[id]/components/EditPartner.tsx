'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/app/(admin)/components';
import PartnersForm from '@/app/(admin)/admin/partners/components/PartnersForm/PartnersForm';
import Modal from 'components/common/ModalActions/Modal';
import styles from '@/app/(admin)/admin/partners/add/AddPartner.module.scss';

interface EditPartnerProps {
  id: number;
}

const EditPartner: React.FC<EditPartnerProps> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <div className={styles.wrapper}>
      <AdminHeader
        withSearch={false}
        withButton={false}
        withClose
        heading="Редагувати партнера"
        subHeading={['Партнери', 'Редагувати партнера']}
        closeFunc={() => setIsOpen(true)}
      />
      <PartnersForm id={id} />

      {isOpen && (
        <Modal
          type="question"
          message="Ви точно хочете залишити сторінку? Процес редагування буде втрачено"
          title="Залишити сторінку "
          active={isOpen}
          setActive={() => setIsOpen(false)}
          successFnc={() => router.back()}
        />
      )}
    </div>
  );
};

export default EditPartner;
