'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import styles from './styles.module.scss';

const Banner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    isOpen && (
      <section className={styles.wrapper}>
        <div className={styles.banner}>
          <h2 className={styles.title}>Проходь вікторини та вигравай читозавриків</h2>
          <div className={styles.icon} onClick={() => setIsOpen(false)}>
            <X />
          </div>
        </div>
      </section>
    )
  );
};

export default Banner;
