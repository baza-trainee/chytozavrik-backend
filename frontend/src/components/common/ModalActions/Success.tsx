import React from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.scss';

interface SuccessProps {
  message: string;
  title: string;
  closeModal: () => void;
}
const Success = ({ title, message, closeModal }: SuccessProps) => (
  <div className={styles.success}>
    <div className={styles.closeBtn} onClick={closeModal}>
      <X />
    </div>
    <div className={styles.content}>
      <h5 className={styles.title}>{title}</h5>
      <p className={styles.message}>{message}</p>
    </div>
  </div>
);

export default Success;
