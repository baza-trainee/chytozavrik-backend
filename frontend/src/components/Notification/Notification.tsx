'use client';

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import styles from './Notification.module.scss';

type Props = {
  text: string;
  closeNote: () => void;
  img: string;
};

const Notification = ({ text, img, closeNote }: Props) => (
  <div className={styles.container}>
    <button className={styles.button} type="button" onClick={closeNote} aria-label="Закрити">
      <X size={16} />
    </button>
    <div className={styles.wrapper}>
      <p className={styles.text}>{text}</p>
      <div className={styles.img}>
        <Image className={styles.image} src={img} width={90} alt="іконка кота" />
      </div>
    </div>
  </div>
);

export default Notification;
