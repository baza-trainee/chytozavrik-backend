'use client';

import React from 'react';
import Image from 'next/image';
import cat from 'public/images/cat/cat.svg';
import { X } from 'lucide-react';
import styles from './NoteKid.module.scss';

type Props = {
  closeNote: () => void;
};

const NoteKid = ({ closeNote }: Props) => (
  <div className={styles.container}>
    <button className={styles.button} type="button" onClick={closeNote} aria-label="Закрити">
      <X size={16} />
    </button>
    <div className={styles.wrapper}>
      <p className={styles.text}>Натисніть на аватар, щоб перейти у ігровий простір дитини.</p>
      <Image className={styles.image} src={cat} width="80" alt="іконка кота" />
    </div>
  </div>
);

export default NoteKid;
