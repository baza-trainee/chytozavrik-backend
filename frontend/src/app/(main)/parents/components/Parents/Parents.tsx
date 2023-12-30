'use client';

import React, { useState, useEffect } from 'react';
import { Container, Button, Typography } from 'components/common';
import Image from 'next/image';
import Notification from 'components/Notification/Notification';
import { ChildType } from '@/types';
import styles from './Parents.module.scss';

type Props = {
  handleClick: () => void;
  kids: ChildType[];
};

const Parents = ({ handleClick, kids }: Props) => {
  const [showNote, setShowNote] = useState(true);

  const closeNote = () => {
    setShowNote(false);
  };

  return (
    <section className={styles.section}>
      <Container className={styles.container}>
        <Image
          src="/images/avatar-parents.svg"
          className={styles.image}
          alt="аватарка батьків"
          width={106}
          height={106}
        />
        <Button
          color="secondary"
          className={styles.button}
          onClick={() => {
            handleClick();
            closeNote();
          }}
        >
          <Image src="/images/wigwam.svg" width={24} height={24} alt="іконка вігваму" />
          <Typography className={styles.text} component="span" variant="h5">
            Створити вігвам
          </Typography>
        </Button>
        {kids && kids.length === 0 && showNote && <Notification closeNote={closeNote} />}
      </Container>
    </section>
  );
};

export default Parents;
